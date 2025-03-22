import { SerialPort } from "serialport";
import { TiptelParser } from "./TiptelSerial/TiptelSerial.js";
import { Command, State } from "./TiptelSerial/types.js";
import { s as string, n as number, b as bitmask, h as hexadecimal, d as digits } from "./TiptelSerial/TitelCommandParser.js";

const {stdin, stdout } = process;

const serialport = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 9600, autoOpen: false, hupcl: true, dtr: true });

// Pipe serial port from and to TiptelParser
const tiptel = serialport.pipe(new TiptelParser());
tiptel.pipe(serialport);

stdout.write("Tests\n=====\n");

stdout.write("DataParser:\t");
console.assert(string(Buffer.from([0x42, 0x34, 0x32, 65]), 1, 3) === "42A", "string failed");
console.assert(hexadecimal(Buffer.from([0x42, 0x01, 0xff]), 1, 2) === "01ff", "hexadecimal failed");
console.assert(number(Buffer.from([0x42, 0x01, 0xff]), 1, 2) === 511, "number failed");
const flags = bitmask(Buffer.from([0x42, 0x0e, 0x71]), 1, 2);
const match = [false, false, false, false, true, true, true, false, false, true, true, true, false, false, false, true];
flags.forEach((f, n) => console.assert(f === match[n]), `bitmask failed`);
console.assert(digits(Buffer.from([0x42, 0x08, 0x9A]), 1, 2) === "890", "digits failed");
stdout.write("done\n");

// Checksum
stdout.write("checksum:\t");
console.assert(tiptel.checksum(Buffer.from([0x42, 0x66, 0x66])), "Receive checksum read failed");
console.assert(tiptel.checksum(Buffer.from([0x06, 0x42, 0x66, 0x66])), "Send checksum read failed");

let buffer = Buffer.from([0x42, 0x66, 0x00]);
console.assert(!tiptel.checksum(buffer), "Unexpected receive checksum");
// TODO: we might not want to alter receive checksum
console.assert(buffer[buffer.length - 1] === 0x66, "Receive checksum write failed");
buffer = Buffer.from([0x06, 0x42, 0x66, 0x00]);
console.assert(!tiptel.checksum(buffer), "Unexpected send checksum");
console.assert(buffer[buffer.length - 1] === 0x66, "Send checksum write failed");
stdout.write("done\n");


stdout.write("invokePabx:\t");
// Verify data is array
let called = false;
tiptel.invokePabx = async (command, data, waitForState) => {
  console.assert(command, "Command not found");
  console.assert(Array.isArray(data), "Data not array, should not happen");
  console.assert(waitForState === State.WAIT_ACK || waitForState === State.WAIT_ACK_READY, `Unexpected waitForState: ${waitForState}`);
  // console.assert(waitForState === 1 || waitForState === 3, "Unexpected waitForState");
  called = true;
  return Promise.resolve(data);
};

called = false;
tiptel.readPabx(0x99);
tiptel.readPabx(0x99, []);
tiptel.readPabx(0x99, 0x55, 0x66);
const testData = [0x55, 0x66];
const resultData = await tiptel.readPabx(0x99, testData);
console.assert(resultData === testData, "Data not returned");
console.assert(called, "invokePabx (read) not invoked!");

called = false;
tiptel.writePabx(0x99);
tiptel.writePabx(0x99, []);
tiptel.writePabx(0x99, 0x55, 0x66);
tiptel.writePabx(0x99, [0x55, 0x66]);
console.assert(called, "invokePabx (write) not invoked!");


delete tiptel.invokePabx;
stdout.write("done\n\n");


tiptel.on("dtr", (dtr) => {
  // console.log(`DTR ${dtr ? "enabled (low)" : "disabled (high)"}`);
  serialport.set({ dtr });
})
tiptel.on("ready", () => {
  console.log("Tiptel ready.");
})
tiptel.on("command", (data) => {
  console.log("Command", data);
})

// without this, we would only get streams once enter is pressed
// NOTE: not available in debug
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// No binary, plain text
stdin.setEncoding( "utf8" );

// on any data into stdin
stdin.on( "data", function( key )
{
  switch (key)
  {
    case "\u0003":
      process.exit();

    case "l":
    case "L":
      console.log("log enabled");
      // log = !log;
      serialport.on("data", (d) => console.log("serial",d))
      tiptel.on("data", (d) => console.log("parser",d))
      break;

    case "i":
    case "I":
      console.log("request isdn version");
      void tiptel.readPabx(Command.ISDN_VERSION, 0x13);
      break;

    case "a":
    case "A":
      console.log("request analog version");
      void tiptel.readPabx(Command.ANALOG_VERSION);
      break;

    case "p":
    case "P":
      console.log("programming pin");
      void tiptel.readPabx(Command.PIN, 0x02);
      break;

    case "c":
    case "C":
      console.log("call charge pin");
      void tiptel.readPabx(Command.PIN, 0x01);
      break;
    
    default:
      // write the key to stdout all normal like
      stdout.write( key );
  }
});


serialport.on("close", () => console.log("closed"));
serialport.on("end", () => console.log("end"));
serialport.on("error", () => console.log("error"));
serialport.on("finish", () => console.log("finish"));

// TODO: handle DTR flow in-stream
// serialport.on("pause", () => {
//   console.log("paused");
//   // serialport.set({dtr: false});
// });
// serialport.on("resume", () => {
//   console.log("resumed");
//   // serialport.set({dtr: true});
// });

serialport.on("drain", () => console.log("drain"));

serialport.open(async (e) => {
  if (e) {
    console.error(e);
    process.exit(1);
  }

  // Stop flow
  serialport.set({dtr: false});

  // "Menu"
  stdout.write("Commands\n========\n");
  stdout.write("L: enable on-screen serial logging\n");
  stdout.write("I: get ISDN firmware version\n");
  stdout.write("A: get analog firmware version\n");
  stdout.write("P: get programming PIN code\n");
  stdout.write("C: get call charge PIN code\n");
  stdout.write("\n");
  stdout.write("CTRL+C: exit\n");  
});

