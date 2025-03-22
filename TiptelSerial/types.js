export const Command =
{
  INVALID:        0x00,
  READY:          0x01,
  STORE:          0x04,
  HEARTBEAT:      0x05,
  ATTN:           0x06,
  ACK:            0x06,

  ISDN_VERSION:   0x80, // actually 0x8013

  ANALOG_VERSION: 0xA0,
  // Placeholder
  // Placeholder
  UNKNOWN_AC:     0xAC, // -     2 bytes data

  UNKNOWN_B0:     0xB0, // -    18 bytes data
  // Placeholder
  UNKNOWN_B8:     0xB8, // -    12 bytes data
  UNKNOWN_BC:     0xBC, // -     7 bytes data

  UNKNOWN_C0:     0xC0, // -    5 bytes data
  PIN:            0xC4, // type	digits	digits
  MSN_ALLOCATION: 0xC8, // -	bits	bits	bits	bits	bits	bits	bits	bits	bits	bits
  MSN_ASSIGNMENT: 0xCC, // index (00-0A)	digits	digits	digits	digits	digits	digits	digits	digits
  UNKNOWN_D0:     0xD0, // index (00-09)    10 bytes data
  UNKNOWN_D4:     0xD4, // index (00-04)     8 bytes data
  SPEED_DIAL:     0xD8, // Index (00-63)	digits	digits	digits	digits	digits	digits	digits	digits	digits	digits
  RD_CALL_CHARGES:0xDB, // year	month	day	year	month	day.  Special offset!
  CALL_CH_COUNT:  0xDC, // (incoming) amount amount
  RD_NEXT_ENTRY:  0xDE, // -
  NEXT_ENTRY:     0xDD, // line?	year	month	day	hour	minute	??	??	??	cost center	extension	digits	digits	digits	digits	digits	digits	digits	digits	digits	digits

  UNKNOWN_CE:     0xE0, // -    4 bytes data
  // Placeholder
  // Placeholder
  // Placeholder
};

export const State =
{
  // UNINITIALIZED: 0x00,
  IDLE: 0x00,
  WAIT_HEARTBEAT_1: 0x01,
  WAIT_HEARTBEAT_2: 0x02,
  WAIT_HEARTBEAT_3: 0x03,
  WAIT_ACK: 0x04,
  WAIT_ACK_STORE: 0x05, // Some data needs the store command
  WAIT_ACK_READY: 0x06,
  WAIT_READY: 0x07,
  WAIT_DATA: 0x08,

  FAIL: 0xff,
}
