
## HP/Agilent 6623 used to capture IV characteristic of IGBT or MOSFET
This is an example for module node-nisa, demonstrating query command.

# Installation and usage
Check the GPIB address of your 662x and change the appropriate number in source (line 6). Wire output 2 of the instrument between gate and emitter and ouput 3 between collector and emitter. Make sure that voltage an current boundaries match your DUT. 