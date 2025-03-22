# Tiptel 810 S clip programming interface
This project connects to the (old quare model) Tiptel 810 S serial port to read and write settings and call data.

This is currently a work in progress; the protocol is more or less decoded, but not all commands are known or documented.

## Getting started
The tool assumes USB serial connected to `/dev/ttyUSB0`

Install dependencies:
* `npm i`

Run the "test" tool:
* `npm test`

## TTL modification
* Remove the AN232B chip on the bottom left side on the back of the PCB
* Tap into the vias:
  * TX, RX and GND: near the big electrolytic capacitors
  * DTR: below the CLIP addon board/header
  * VCC: either on the extension-8 header or CLIP addon header\
  TODO: find a VCC-via

[<img src="resources/front.jpg" width="400" height="auto">](resources/front.jpg)
[<img src="resources/back.jpg" width="400" height="auto">](resources/back.jpg)

Look into the resources folder for full resolution images.

## pincodes 
* programming code is 1111
* call charge code is 2222


## FRITZ!Box notes
* FRITZ!Box does not send Advice Of Charge (AOC pulse) needed for cost center calculations


## Instructions
All instructions are noted in hexadecimal.
### ready
* `01`
### apply/store
* `04`
### heartbeat
* `05`
### attention/ACK
* `06`
### read ISDN version (from other µC)
* rd: `80 13`
* rd response: `81 14 ?? ?? ?? VV VV vv vv DD DD MM MM YY YY YY YY SS 01 00`, where:
  * `VV` is major version in ASCII
  * `vv` is minor version in ASCII
  * `DD` is day of month in ASCII
  * `MM` is month in ASCII
  * `YY` is year in ASCII
  * `SS` is state of operation: `00`=disconnected, `02`=PTMP
### read analog version
* rd: `A0`
* rd response: `A1 ?? ?? ?? VV VV vv vv DD DD MM MM YY YY YY YY`, where:
  * `VV` is major version in ASCII
  * `vv` is minor version in ASCII
  * `DD` is day of month in ASCII
  * `MM` is month in ASCII
  * `YY` is year in ASCII
## command A4/A6
TODO
## command A8/AA
TODO
## unknown AC/AE

## unknown B0/B2
## command B4/B6
TODO
## unknown B8/BA
## unknown BC/BE

## unknown C0/C2
## PIN
* rd: `C4 TT`
* wr: `C6 TT DD DD`
* special bytes:
  * `TT` is type: `01`=call charge, `02`=programming
  * `DD` is two PABX digits (`A`=0)
## MSN allocation
* rd: `C8`
* rd response: `C9 BB BB BB BB BB BB BB BB BB BB`
* wr: `CA BB BB BB BB BB BB BB BB BB BB`
* special bytes:
  * `BB` are bits
## MSN assignment
* rd: `CC II`
* rd response: `CD II DD DD DD DD DD DD DD DD`
* wr: `CE II DD DD DD DD DD DD DD DD`
* special bytes:
  * `II` is index `00..0A`, yes 11 numbers according to the original software
  * `DD` is two PABX digits (`A`=0)

## unknown D0/D2
## unknown D4/D6
## speed dial
* rd: `D8 II`
* rd response: `D9 II DD DD DD DD DD DD DD DD DD DD`
* wr: `DA II DD DD DD DD DD DD DD DD DD DD`
* special bytes:
  * `II` is index `00..63`
  * `DD` is two PABX digits (`A`=0)
## read call charges (DB!)
* rd: `DB yy mm dd yy mm dd`
* rd response: `DC nn` 
## read next entry (DE!)
* rd: `DE`
* rd response: `DD ll yy MM dd hh mm
## unknown E0/E2
## command E4/E6
TODO
## command E8/EA
TODO
## command EC/EE
TODO

