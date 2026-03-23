import { Command } from "../TiptelSerial/types.js";

const { stdout } = process;

export async function sleep(ms)
{
  return new Promise((r) => {
    setTimeout(r,ms);
  });
}

 // Promisify-ish
export async function P(o, m, ...args)
{
  return new Promise((r) => {
    args.push(r);
    // o[m].call(o, r);
    o[m].apply(o, args);
  });
}

/**
 * Convert hexadecimal or binary input as array of data
 *
 * @param {string} input The input to convert to number.
 * @returns 
 */
export function parseInput(input)
{
  // Parse as hexadecimal or binary (separated by whitespace)
  const bytes = input.split(/\s+/).map((byte) => {
    return parseInt(byte, byte.length > 2 ? 2 : 16);
  });

  if (bytes.some(byte => isNaN(byte))) return false;
  return bytes;
}

export async function writeCommandList()
{
  await P(stdout, "cursorTo", 0, 0);
  await P(stdout, "clearScreenDown");

  stdout.write(`${Command.ISDN_VERSION.toString(16)} 13: Read ISDN version\n`);

  stdout.write(`${Command.ANALOG_VERSION.toString(16)}: Read analog version\n`);
  stdout.write(`${Command.GENERIC_SETTINGS.toString(16)}: TODO\n`);

  stdout.write(`${Command.EXTENSION_FEATURES.toString(16)}: TODO\n`);
  stdout.write(`${Command.EXTENSION_PERMISSIONS.toString(16)}: TODO\n`);
  stdout.write(`${Command.UNKNOWN_BC.toString(16)}: TODO\n`);

  stdout.write(`${Command.CONNECTION_OPTIONS.toString(16)}: TODO\n`);
  stdout.write(`${Command.PIN.toString(16)}: PIN\n`);
  stdout.write(`${Command.MSN_ALLOCATION.toString(16)}: MSN_ALLOCATION\n`);
  stdout.write(`${Command.MSN_ASSIGNMENT.toString(16)}: MSN_ASSIGNMENT\n`);

  stdout.write(`${Command.CALL_FORWARDING.toString(16)}: TODO\n`);
  stdout.write(`${Command.BLOCKED_NUMBERS.toString(16)}: BLOCKED_NUMBERS\n`);
  stdout.write(`${Command.SPEED_DIAL.toString(16)}: SPEED_DIAL\n`);
  stdout.write(`${Command.RD_CALL_CHARGES.toString(16)}: RD_CALL_CHARGES\n`);
  stdout.write(`${Command.CALL_CH_COUNT.toString(16)}: CALL_CH_COUNT\n`);
  stdout.write(`${Command.RD_NEXT_ENTRY.toString(16)}: RD_NEXT_ENTRY\n`);

  stdout.write(`${Command.UNKNOWN_E0.toString(16)}: TODO\n`);
}