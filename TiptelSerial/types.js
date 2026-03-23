export const Command =
{
  INVALID:        0x00,
  READY:          0x01,
  STORE:          0x04,
  HEARTBEAT:      0x05,
  ATTN:           0x06,
  ACK:            0x06,

  // 0-8* has no response

  /** ISDN version (0x8013)
   * byte  1: unknown (00)
   * byte  2: unknown (21)
   * byte  3: unknown (05)
   * byte  4- 5: {string} version (major)
   * byte  6- 7: {string} revision (minor)
   * byte  8- 9: {string} day
   * byte 10-11: {string} month
   * byte 12-15: {string} year
   * byte 16: type
   * byte 17: program mode
   * byte 18: unknown (00)
   */
  ISDN_VERSION:   0x80,

  // 9* has no response

  /** Analog version
   * byte  1: unknown (00)
   * byte  2: unknown (04)
   * byte  3: unknown (07)
   * byte  4- 5: {string} version (major)
   * byte  6- 7: {string} revision (minor)
   * byte  8- 9: {string} day
   * byte 10-11: {string} month
   * byte 12-15: {string} year
   */
  ANALOG_VERSION: 0xA0,
  // A4 has no response
  // A8 has no response

  /** Generic settings
   * bitmask 1:
   * MSB: unknown (0)
   *      unknown (0)
   *      music on hold source (`0`=internal, `1`=external)
   *      music on hold
   *      unknown (0)
   *      unknown (0)
   *      unknown (0)
   * LSB: unknown (0)
   * byte 2: unknown (00)
   */
  GENERIC_SETTINGS: 0xAC,

  /** Extension features
   * extension bits  1: external access authorization day service
   * extension bits  2: external access authorization night service
   * extension bits  3: external ringing signal day service
   * extension bits  4: external ringing signal night service
   * extension bits  5: long-distance dialling day
   * extension bits  6: long-distance dialling night?
   * extension bits  7: international dialling day
   * extension bits  8: international dialling night?
   * extension bits  9: authorization memory dialling day
   * extension bits 10: authorization memory dialling night
   * extension bits 11: directory of blocked numbers activated day
   * extension bits 12: directory of blocked numbers activated night
   * extension crumbles 13: Cost center during day service ext 1-4 (00=1, 01=2, 10=3)
   * extension crumbles 14: Cost center during day service ext 5-8
   * extension crumbles 15: Cost center during night service ext 1-4
   * extension crumbles 16: Cost center during night service ext 5-8
   * extension bits 17: authorization call forwarding
   * extension bits 18: authorization call transfer
   */
  EXTENSION_FEATURES:     0xB0,
/*
  Call authorizations:
-------------------------------------------------
"Options per extension"
v  telephone combination system fax / modem (or phone when off)
v  automatic network access
v  charge pulse
v  calling line id restriction (CLIR)
v Extension for special terminal equipment []
-------------------------------------------------
v  external access authorization day service
v  external access authorization night service
v  external ringing signal day service
v  external ringing signal night service
-------------------------------------------------
v  long distance dialling day
v  long distance dialling night
v  international dialling day
v  international dialling night
v  blocked numbers activated day
v  blocked numbers activated night
-------------------------------------------------
v  authorization call forwarding
v  authorization call transfer
v  authorization memory dialling day
v  authorization memory dialling night
-------------------------------------------------
v room monitoring authorization to interrogate
v  do-not-disturb function for interrogation programmable
v  do-not-disturb function for interrogation programmed
-------------------------------------------------
v  pager call authorization readiness to release
v  pager call authorization readiness to receive
v  general/urgency call authorization readiness to release
v  general/urgency call authorization readiness to receive
-------------------------------------------------
v  day/night switch service programmable
v  day/night switch service currently programmed parameter day
-------------------------------------------------
v  call retrieval permitted
v  call waiting permitted
v Music on hold (single) ()
v MOH from internal/external source ()
-------------------------------------------------
"Allocation of extension - cost center"
v  Day service switch 1/2/3
v  Night service switch 1/2/3
-------------------------------------------------

*/
  /** Unknown (B4)
   * byte unknown (02)
   * byte unknown (7f)
   * byte unknown (7f)
   * byte unknown (7f)
   * byte unknown (7f)
   * byte unknown (7f)
   * byte unknown (7f)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   * byte unknown (00)
   */
  UNKNOWN_B4:     0xB4,

  /** Extension permissions
   * extension bits  1: room monitoring authorization to interrogate
   * extension bits? 2: unknown (ff)
   * extension bits  3: pager call release
   * extension bits  4: pager call reception?
   * extension bits  5: general/urgency call release
   * extension bits  6: general/urgency call reception?
   * extension bits  7: Do-not-disturb function (for interrogation) programmable
   * extension bits  8: do-not-disturb function (for interrogation) programmed
   * extension bits  9: day/night switch service programmable
   * extension bits 10: day/night switch service currently programmed parameter day (option)
   * extension bits 11: Call retrieval permitted
   * extension bits 12: Call waiting permitted
   */
  EXTENSION_PERMISSIONS:0xB8,

  /** Unknown (BC)
   * byte  1: unknown (2e)
   * byte  2: unknown (7f)
   * byte  3: unknown (7f)
   * byte  4: unknown (00)
   * byte  5: unknown (7f)
   * byte  6: unknown (00)
   * byte  7: unknown (00)
   */
  UNKNOWN_BC:     0xBC,

  /** Connection options
   * extension bits 1: automatic network access (external)
   * extension bits 2: combination system, fax, modem (or phone when off)
   * extension bits 3: extension for special terminal equipment (only one connection permitted)
   * extension bits 4: charge pulse
   * extension bits 5: calling line id restrictions (CLIR)
   */
  CONNECTION_OPTIONS:0xC0, // (5 bytes data) fe 04 00 03 00

  /** PIN
   * byte 1: `01`=call charge, `02`=programming (value seems treated as modulus 2)
   * byte 2-3: {digits} 4 digit pin code, PABX encoded (`A`=`0`)
   */
  PIN:            0xC4,

  /** Multiple Subscriber Number (MSN) allocation
   * extension bits  1: MSN-1 assignment
   * ...
   * extension bits 10: MSN-10 assignment
   */
  MSN_ALLOCATION: 0xC8,

  /** Multiple Subscriber Number (MSN) assignment
   * byte 1: {number} index (00-0A)
   * byte 2-9: {digits} 16 digit PABX encoded subscriber number, right aligned
   */
  MSN_ASSIGNMENT: 0xCC,

  /** Call forwarding
   * byte 1: {number} index (00-09)
   * byte 2-12: {digits} 20 digit PABX encoded number, right aligned (prefix with 0 for outside call)
   */
  CALL_FORWARDING:0xD0, // index (00-09)    10 bytes data  d00013aa9c190108120600, 00:0000000000000000000000, 01:01000000000000a1000000

  /** Blocked numbers (incoming?)
   * byte 1: {number} index (00-04)
   * byte 2-10: {digits} 16 digit PABX encoded number, right aligned
   */
  BLOCKED_NUMBERS:0xD4, // index (00-04)     8 bytes data  d401048a4080405440, 00:000000000000000666, 01:010000000000001234 (incoming numbers?)

  /** Speed / memory dial
   * byte 1: {number} index (00-63)
   * byte 2-12 {digits} 20 digit PABX encoded number, right aligned (prefix with 0 for outside call)
   */
  SPEED_DIAL:     0xD8, // A.K.A. memory dialling: Index (00-63)

  /** Read call charges (0xDB)
   * byte 1: {number} start year
   * byte 2: {number} start month
   * byte 3: {number} start day
   * byte 1: {number} end year
   * byte 2: {number} end month
   * byte 3: {number} end day
   */
  RD_CALL_CHARGES:0xDB,

  /** Call charge count response
   * byte 1-2 {number} amount of entries
   */
  CALL_CH_COUNT:  0xDC,

  /** Read next entry */
  RD_NEXT_ENTRY:  0xDE,

  /**
   * Next entry response
   * byte  1: unknown (outside line?)
   * byte  2: {number} year
   * byte  3: {number} month
   * byte  4: {number} day
   * byte  5: {number} hour
   * byte  6: {number} minute
   * byte  7: unknown
   * byte  8: unknown
   * byte  9: unknown
   * byte 10: cost center
   * byte 11: {number?} extension
   * byte 12-21: {digits} 20 digit PABX encoded number, right aligned(?)
   */
  NEXT_ENTRY:     0xDD,

  /** Unknown command (0xE0): invalid packet, padded with zeroes
   * byte 1: unknown (00)
   * byte 2: unknown (00)
   * byte 3: unknown (6d)
   * byte 4: unknown (01)
   */
  UNKNOWN_E0:     0xE0,

  // E4 has no response
  // E8 has no response
  // EC has no response

  // F* has no response
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
