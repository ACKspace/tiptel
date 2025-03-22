import { Command } from "./types.js";

// const parser = {
//   [Command.ANALOG_VERSION]: 
// }

// String
export function s(data, start, len)
{
  // Raw string
  return data.slice(start, start + len).toString();
}
export function h(data, start, len)
{
  // Hexadecimal
  return Array.from(data.slice(start, start + len)).map(val => val.toString(16).padStart(2,"0")).join("");
}
export function n(data, start, len)
{
  // Hex to number
  return parseInt(`0x${h(data, start, len)}`);
}
export function b(data, start, len)
{
  // Bitmask
  const value = n(data, start, len);
  const size = len * 8;
  return new Array(size).fill(false).map((_v, i) => !!(value & 2**(size - i - 1)));
}
export function d(data, start, len)
{
  const digits = h(data, start, len);
  return Array.prototype.map.call(digits, digit => parseInt(digit, 16))
  .filter(digit => {
    if (digit > 10)
    {
      console.log("unsupported digit", digit);
      return false;
    }
    // Exclude 0 ("null")
    return !!digit;
  })
  .map(digit => String.fromCharCode(0x30 + (digit % 10))).join("");

  // Digit (ignore 0, A = 0)
  // TODO: include leading zeroes
}

export class Parser
{
  static parse(data)
  {
    const command = data[1] & ~0x01;
    // Execute dedicated parser function
    if (command in Parser)
      return Parser[command](data);

    console.warn("Unhandled data", data);
    return null;
  }

  static [Command.ANALOG_VERSION](m)
  {
    const date = new Date();
    date.setTime(0);
    date.setUTCFullYear(s(m, 13, 4), s(m, 11, 2) - 1, s(m, 9, 2));

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