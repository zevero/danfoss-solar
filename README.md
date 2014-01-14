
Read Danfoss TLX Pro Portal-Upload Data, present it in the browser and convert it to SMA SunnyBeam CSV

## Feature 1 - View your Data

![Image](Danfoss_Solar.png?raw=true)
View your Data by minute and String: Power (unstacked, stacked, percent stacked), Voltage, Current, Efficiency, etc...

## Feature 2 - Get your Data in SMA SunnyBeam CSV

It works with [sunwatcherapp.sineta.de](sunwatcherapp.sineta.de) (string-data included)


## Why?

There are at least two free services, which allow your Danfoss Inverter to send your data on their ftp-server and to fetch it in csv - format:

 * http://clxportal.danfoss.com/ 
 * http://www.pv-log.com is free as well (compatible to sunwatcherapp.sineta.de)

Unfortunately, both services store data only every 10 minutes and contain no string-information.


## Where is it testes?

It runs on any server with node.js installed. Currently it runs on my Raspberry Pi B. I use a single Danfoss TLX Pro + 15K.

## Tips

Place your data into a folder named data (or make a softlink to your ftp-root directory). For tests just rename the data-samples folder.
Depending on the ftp-user, you need to adjust the prefix or path in model/danfoss.js.