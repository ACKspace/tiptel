https://github.com/chjj/blessed?tab=readme-ov-file



# things to test

# decompile executable -> pascal/C read timing (ghidra, ...)
* https://reverseengineering.stackexchange.com/questions/3074/decompiling-a-1990-dos-application
* https://archive.org/details/sourcer-8-01
* https://github.com/uxmal/reko
* https://www.makeuseof.com/how-to-install-ghidra-linux/
* https://github.com/xorvoid/dis86
* https://hte.sourceforge.net/

# arduino mega with DTR/RTS pin breakout and MAX232
* buffer too small





## command list
command bit:
1 seems acknowledge/response
2 seems "write" flag
rd: `!DTR 3xHB <ATTN> <LEN> <CMD> <DATA..> <CV>, wait for <ACK> <READY>, send <ACK>, read <LEN> <CMD> <DATA> <CV>, send DTR+<ACK>`
wr: `!DTR 3xHB <ATTN> <LEN> <CMD> <DATA..> <CV>, wait for <ACK>, send DTR+`


* ISDN firmware version: `80 13` (byte 18 is `00` 0r `02` -> NC or PTMP)
* analog FW version: `A0`
* read config as PPP or PTMP:
  * `CC 00 ... CC 0A` (MSN response CD 00 00 00 00 00 00 00 01 96)

  * `C8`: MSN ext alloc
  * `B0`, `B8`, `BC`, `C0`
  * `D0 00 ... D0 09`
  * `D4 00 ... D4 04`
  * `AC`, `E0`
* read call charges (35 entries, 01.01.95 to 08.02.25)
  * `C4 01` (read pin response `05 C5 01 22 22 C4`) 0 = A
  * `DB 5F 01 01 19 02 08` (response `DC 00 23`) (`0x23`=35 entries) `yy mm dd yy mm dd
  <line?> YY MM DD HH MM ?? ?? ?? <cost center> <ext> nn nn nn nn nn nn nn nn nn nn`
  * `DE` (response `DD 01 19 01 06 14 35 00 00 00 01 21 00 00 00 00 00 00 00 00 13 AA`) `01 25 01 06 20 53  21` dialed 1300 06-01-25@20:53
  * `DE` (response `DD 01 19 01 06 14 35 00 00 00 01 26 00 00 00 00 00 00 00 00 13 AA`) 126 dialed 1300
  * `DE` (response `DD 01 19 01 06 14 37 00 00 00 01 26 00 00 00 00 00 00 00 00 13 AA`) 126 dialed 1300
  ...
  * `DE` (response `DD 01 19 01 1B 0B 00 00 00 00 01 21 00 00 00 00 00 00 A9 AA 8A A2`) `01 25 01 27 11 00`  21 dialed 0900 8002 27-01-25@11:00
  * `DE` (response `DD 02 19 02 02 0A 05 00 00 00 01 21 00 00 00 00 00 00 A8 AA 9A A2`) `02 25 01 02 10 05`  21 dialed 0800 9002 02-02-25@10:05
* set call charge pin
  * `C6 01 22 22` (0=A)
  * `04` (write/apply config)
* get programming pin
  * `C4 02` (response `C5 02 11 11`)
* set programming pin
  * `C6 02 AA AA` (A=0)
  * `04` (write/apply config)

* write (PMTP) config
  Phone number(s)
  * 10x Multiple Subscriber Number
  * `CE 00 00 00 00 00 00 01 96` (MSN 196)
  * `CE 01 00 00 00 00 00 09 22` (MSN 922)
  * `CE 02 00 00 00 00 00 09 23` (MSN 923)
  * `CE 03 00 00 00 00 00 09 24` (MSN 924)
  * `CE 04 00 00 00 00 00 00 00` (none)
  ...
  * `CE 0A 00 00 00 00 00 00 00` (none)

  * MSN allocation (bitwise: 1, 23, 45, 6, 6x12345678)
  * `CA 01 06 18 20 FF FF FF FF FF FF`

  * ??? extension settings
  * `B2 FF FF FF FF FF FF FF FF FF FF 00 00 00 00 00 00 FF FF`
  * `BA FF FF FF FF FF FF FF 00 FF FF FF FF`
  * `BE 2E 7F 7F 00 7F 00 00`
  * `C2 00 04 00 00 00`

  * ??
  * `D2 00 00 00 00 00 00 00 00 00 00 00`
  ...
  * `D2 09 00 00 00 00 00 00 00 00 00 00`

  * ??
  * `D6 00 00 00 00 00 00 00 00 00`
  ...
  * `D6 04 00 00 00 00 00 00 00 00`

  * `AE 10 00`
  * `E2 00 00 10 01`
  * `04` (write/apply config)

* Read directory of memory dialing numbers (fast dial)
@665, 1200, 09000666, 926, 082780926

* `D8 00` (response `D9 00 00 00 00 00 00 00 00 00 00 00`)
* `D8 01`
...
* `D8 41` (response `D9 41 00 00 00 00 00 00 00 00 12 AA`)
* `D8 42` (response `D9 42 00 00 00 00 00 00 A9 AA A6 66`)
* `D8 43` (response `D9 43 00 00 00 00 00 00 00 00 09 26`)
* `D8 44` (response )

* write
  * `DA 00 00 00 00 00 00 00 00 00 00 00`
  ...
  * `DA 41 00 00 00 00 00 00 00 00 12 AA`
  ..etc


* read version
  * ISDN: `80 13`
  * analog: `A0`
* Multiple Subscriber Number assignment
  * rd: `CC <addr>`, where:
    * `<addr>` is `00..0A`
  * wr: `CE <addr> <number>`, where:
    * `<addr>` is `00..0A`
    * `<number>` is 7 bytes, PABX encoded (0=A)
* Multiple Subscriber Number extension allocation
  * rd: `C8`
  * wr: `CA <bits>`, where:
      * `<bits>` is 10 bytes, bitwise extension per MSN, i.e. `01`=extension 1, `06` are extensions 2+3, `20`=extension 6, `FF` are all 8 extensions
    
* call charge pin
  * rd: `C4 01`
  * wr: `C6 01 <pin>`, `04`, where:
    * pin is 2 bytes, PABX encoded (0=A) 
* programming pin
  * rd: `C4 02`
  * wr: `C6 02 <pin>`, `04`, where:
    * pin is 2 bytes, PABX encoded (0=A) 
* call charges
  * rd: `DB <date-from> <date-to>`, where:
    * `<date>` is 3 bytes YY MM DD
* speed dial/directory of memory dialing numbers


unknown commands
read:
  * `B0`
  * `B8`
  * `BC`
  * `C0`
  * `D0 00 ... D0 09`
  * `D4 00 ... D4 04`
  * `AC`
  * `E0`
write:
  * `B2`
  * `BA`
  * `BE`
  * `C2`
  * `D2 00 ... D2 09`
  * `D6 00 ... D6 04`
  * `AE`
  * `E2`
