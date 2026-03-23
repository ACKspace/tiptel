import { Transform } from "stream"
import { P } from "../helpers/helpers.js";
import { Command, State } from "./types.js";
import { Parser } from "./TitelCommandParser.js";

/**
 * Emit data every number of bytes
 *
 * A transform stream that emits data as a buffer after a specific number of bytes are received. Runs in O(n) time.
 */
export class TiptelParser extends Transform {
  // length;//: number
  position;//: number
  buffer;//: Buffer
  #state = State.IDLE;
  #promise = null;
  #resolver = null;

  constructor(options) {
    super(options);
    // NOTE: emit does not work in constructor!
    // this.emit("dtr", true);

    // this.#source = getLowLevelSourceObject();
    // console.log("source", this.#source);
    // // this.readableFlowing = true;
    // console.log("pause", this.isPaused());
    // this.emit("dtr", false);

    this.position = 0;
    this.buffer = Buffer.alloc(64);
  }

  _transform(chunk, _encoding, cb)
  {

    // data can consist of:
    // HEARTBEAT: ignore
    // ACK (state dependant)
    // READY
    // (partial) DATA

    let cursor = 0
    let store = false;
    while (cursor < chunk.length)
    {
      const byte = chunk[cursor];

      switch (this.#state)
      {
        case State.WAIT_HEARTBEAT_1:
        case State.WAIT_HEARTBEAT_2:
        case State.WAIT_HEARTBEAT_3:
          console.debug("Heartbeat", byte.toString(16));
          // 
          this.#state -= 1;
          if (this.#state === State.IDLE)
          {
            console.debug("Resolving heartbeat");
            this.#resolver?.();
          }
          break;

        case State.IDLE:
          // Drop any data
          console.debug("IDLE: Dropping", byte.toString(16));

          // Should not happen, store anyway
          if (byte !== Command.HEARTBEAT)
            store = true;

          // TODO: we might want to go from uninitialized to idle and emitting "ready"
          break;

        case State.WAIT_ACK:
          console.debug("WAIT_ACK", byte.toString(16));

          // done if ACK was received
          console.assert(chunk.length === 1, "expected 1 byte");
          console.assert(chunk[0] === Command.ACK, "expected ACK");
          const success = byte === Command.ACK;

          // DTR high
          this.emit("dtr", false);
          this.#state = State.IDLE;
          this.emit("ready", success);
          break;

        case State.WAIT_ACK_STORE:
          // TODO: verify
          console.debug("WAIT_ACK_STORE", byte.toString(16));
          // We need ACK, send STORE and then a final ACK
          console.assert(chunk.length === 1, "expected 1 byte");
          console.assert(chunk[0] === Command.ACK, "expected ACK");
          // const success = chunk[0] === Command.ACK;

          if (byte === Command.ACK)
          {
            // We need ACK, READY and then some data..
            this.push(Buffer.from([Command.STORE]));
            this.#state = State.WAIT_ACK;
          }
          break;

        case State.WAIT_ACK_READY:
          // console.debug("WAIT_ACK_READY", byte.toString(16));
          if (byte === Command.ACK)
          {
            // TODO: set a timeout
            // PABX sends ACK, fetches data, sends READY
            this.#state = State.WAIT_READY;
          }
          break;

        case State.WAIT_READY:
          // console.debug("WAIT_READY", byte.toString(16));
          // Confirm READY and wait for data.
          if (byte === Command.READY)
          {
            // PABX sends READY, we need to ACK and wait for the data.
            // We need ACK, READY and then some data..
            this.push(Buffer.from([Command.ACK]));
            this.#state = State.WAIT_DATA;
          }
          break;
  
        case State.WAIT_DATA:
          // Store this byte
          store = true;
          break;

        // case State.FAIL:
        default:
          console.debug("Unexpected data", byte.toString(16));
      }


      // Copy chunk into buffer
      if (store)
      {
        this.buffer[this.position] = chunk[cursor];
        this.position++;
      }

      // Prepare next chunk byte
      cursor++;

      if (this.position && this.#state === State.WAIT_DATA)
      {
        // Check data
        const len = this.buffer[0] + 1;

        // Data should be ready, calculate checksum
        if (this.position == len)
        {
          const command = this.buffer[1] & ~0x01;
          const valid = this.checksum(this.buffer);
          if (!valid)
            console.warn("Invalid packet", this.buffer);

          // If all the data was received, set DTR high and send ACK
          this.push(Buffer.from([Command.ACK]));
          // Translate command and data, and emit it
          this.emit("dtr", false);
          this.#state = State.IDLE;

          // Specific command
          // this.emit(command, data);
          const result = Parser.parse(this.buffer.slice(0, len));

          // Clear buffer
          this.buffer = Buffer.alloc(64)
          this.position = 0
  
          // Generic "command"
          if (result)
            this.emit("command", result.data);
        }
      }

      if (this.position === 64)
      {
        console.log("buffer overflow; resetting");
        this.buffer = Buffer.alloc(64)
        this.position = 0
      }

      // If done, reset buffer
      // this.buffer = Buffer.alloc(64)
      // this.position = 0
    }
    cb();
  }

  _flush(cb)
  {
    // this.push(this.buffer.slice(0, this.position))
    // this.buffer = Buffer.alloc(64)
    cb();
  }

  // pipe data back into the serial port, trigger events on complete data, add methods to invoke command
  async readPabx(command, ...data)
  {
    // Allow params and array as data
    const _data = data?.length && Array.isArray(data[0]) ? data[0] : data;
    return this.invokePabx(command, _data, State.WAIT_ACK_READY);
  }
  async writePabx(command, ...data)
  {
    // Allow params and array as data
    const _data = data?.length && Array.isArray(data[0]) ? data[0] : data;
    return this.invokePabx(command | 0x02, _data, State.WAIT_ACK);
  }

  async invokePabx(command, data, waitForState)
  {
    // Wait until push buffer is empty
    await P(this, "_flush");

    // DTR low
    // this.readableFlowing = false;
    this.#promise = new Promise((resolve) => {
      // Assign resolver
      this.#resolver = resolve;
    })
    this.#state = State.WAIT_HEARTBEAT_3;
    
    this.emit("dtr", true);

    // Wait for 3 "heatbeat" bytes (between 164 and 177ms)
    await this.#promise;
    console.log("Sending command");

    // <ATTN> <LEN> <CMD> <DATA..> <CV>
    const buffer = Buffer.from([Command.ATTN, (data?.length ?? 0) + 2, command, ...data, 0]);
    this.checksum(buffer);
    this.push(buffer);

    // console.log("sent", buffer);

    // Wait for state
    this.#state = waitForState;

    // TODO: This causes a memory leak!?
    const result = await new Promise((resolve) => {
      this.once("command", (data) => {
        resolve(data);
      })
    });

    return result;
  }

  checksum(data)
  {
    // Calculate checksum value from command + data
    // skip attn, length and cv
    let n = 1;
    if ( data[0] === Command.ATTN)
      n++;

    let cv = 0;
    for (; n < data.length - 1; ++n)
      cv ^= data[n];

    const match = data[data.length - 1] === cv;
    data[data.length - 1] = cv;

    // return true if previous CV matched, false if no match
    return match;
  }
}
