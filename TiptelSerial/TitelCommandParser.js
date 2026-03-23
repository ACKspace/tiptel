import { Command } from "./types.js";

/**
 * Bytes to String
 * @param {Buffer} data The data to read
 * @param {number} start Start offset
 * @param {number} len Total input length
 * @returns {string} A text representation of the data
 */
export function s(data, start, len)
{
  // TODO: return false if there are non-printable characters.
  return data.slice(start, start + len).toString();
}

/**
 * Bytes to Hexadecimal
 * @param {Buffer} data The data to read
 * @param {number} start Start offset
 * @param {number} len Total input length
 * @returns {string} A hexadecimal representation of the data
 */
export function h(data, start, len)
{
  return Array.from(data.slice(start, start + len)).map(val => val.toString(16).padStart(2,"0")).join("");
}

/**
 * Bytes to number
 * @param {Buffer} data The data to read
 * @param {number} start Start offset
 * @param {number} len Total input length (typically 1 or 2)
 * @returns {number} The numeric representation of the bytes
 */
export function n(data, start, len)
{
  return parseInt(`0x${h(data, start, len)}`);
}

/**
 * Bytes to bitmask, typically to store extension flags
 * @param {Buffer} data The data to read
 * @param {number} start Start offset
 * @param {number} len Total input length
 * @returns {Array<Boolean>} A list of bits
 */
export function b(data, start, len)
{
  const value = n(data, start, len);
  const size = len * 8;
  return new Array(size).fill(false).map((_v, i) => !!(value & 2**(size - i - 1)));
}

/**
 * Bytes to PABX digits
 * @param {Buffer} data The data to read
 * @param {number} start Start offset
 * @param {number} len Total input length (typically 1 or 2)
 * @returns {string} PABX digits (2 per byte) where `0` is omitted and `A` is converted to `0`
 */
export function d(data, start, len)
{
  const digits = h(data, start, len);
  return Array.prototype.map.call(digits, digit => parseInt(digit, 16))
  .filter(digit => {
    if (digit > 10)
    {
      // console.log("unsupported digit", digit);
      return false;
    }
    // Exclude 0 ("null")
    return !!digit;
  })
  .map(digit => String.fromCharCode(0x30 + (digit % 10))).join("");
}

export class Parser
{
  static parse(data)
  {
    const command = data[1] & ~0x01; // TODO: toggle bit or remove 1?

    // Execute dedicated parser function
    if (command in Parser)
      return Parser[command](data);

    // Note that checksum is already verified
    console.warn(`Unhandled data: (${data.length - 3} bytes)`);
    console.warn("Hex.\t", h(data, 2, data.length - 3));
    console.warn("Digits\t", d(data, 2, data.length - 3));
    if ( data.length < 7) console.warn("Numeric\t", n(data, 2, data.length - 3));
    if ( data.length < 8) console.warn("Binary\t", b(data, 2, data.length - 3).map(b => b ? "1" : "0").join(""));
    console.warn("Text\t", s(data, 2, data.length - 3));

    return null;
  }

  static [Command.ANALOG_VERSION](m)
  {
    const date = new Date();
    date.setTime(0);
    date.setUTCFullYear(s(m, 13, 4), s(m, 11, 2) - 1, s(m, 9, 2));
    console.log("A", m);
    // a1 00 04 07 ...

    return { command: Command.ANALOG_VERSION, data: 
      {
        major: s(m, 5, 2),
        minor: s(m, 7, 2),
        date,
      }
     };
  }

  static [Command.ISDN_VERSION](m)
  {
    const date = new Date();
    date.setTime(0);
    date.setUTCFullYear(s(m, 14, 4), s(m, 12, 2) - 1, s(m, 10, 2));
    console.log("I", m);
    //              tt pp
    // 00 21 05 ... 02 01 00

    let type = "unknown";
    switch (m[18])
    {
      case 0x00: type = "Not connected"; break; // Also known as DDI or number block to extension UNTESTED
      case 0x01: type = "PTP"; break; // Also known as DDI or number block to extension UNTESTED
      case 0x02: type = "PTMP"; break; // Also known as "Switchboard function"
    }

    return { command: Command.ANALOG_VERSION, data: 
      {
        major: s(m, 6, 2),
        minor: s(m, 8, 2),
        date,
        type,
      }
     };
  }

  static [Command.PIN](m)
  {
    return { command: Command.PIN, data: 
      {
        type: n(m, 2, 1),
        pin: d(m, 3, 2),
      }
     };
  }  
}