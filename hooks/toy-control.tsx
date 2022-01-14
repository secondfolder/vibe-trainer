declare var Buttplug: any;

import { useEffect, useState } from "react";
import { useVibeLevel } from "../contexts/vibe-level";

export default () => {
  const [vibeLevel, setVibeLevel] = useVibeLevel()
  const [connectedDevices, setConnectedDevices] = useState([])
  const [buttplugClient, setButtplugClient] = useState()


  useEffect(() => {
    buttplugSetVibeLevel(vibeLevel/100)
  }, [vibeLevel])

  useEffect(() => {
    if (document.readyState === "complete") {
      loadButtplug()
    } else {
      window.addEventListener("load", loadButtplug);
      return () => window.removeEventListener("load", loadButtplug)
    }
  }, [])

  function buttplugScan() {
    // @ts-ignore
    buttplugClient.startScanning()
  }


  function loadButtplug() {
    // @ts-ignore
    Buttplug.buttplugInit().then(async () => {
      console.log("Buttplug Loaded");
  
      const connector = new Buttplug.ButtplugEmbeddedConnectorOptions();
      const buttplugClient = new Buttplug.ButtplugClient("Developer Guide Example");
      setButtplugClient(buttplugClient)

      // @ts-ignore
      buttplugClient.addListener("deviceadded", async (device) => {
        console.log(`Device Connected: ${device.Name}`);
        console.log("Client currently knows about these devices:");
        // @ts-ignore
        buttplugClient.Devices.forEach((device) => console.log(`- ${device.Name}`));
  
        // @ts-ignore
        setConnectedDevices([...connectedDevices, device])
      });

      // @ts-ignore
      buttplugClient.addListener("deviceremoved", (device) => {
        console.log(`Device Removed: ${device.Name}`)
        setConnectedDevices(
          connectedDevices.filter(connectedDevice => connectedDevice !== device)
        )
      });
  
      try {
        await buttplugClient.connect(connector);
      } catch (ex) {
        console.error(ex);
      }
  
      console.log("Connected!");
    });
  }
  


  async function buttplugSetVibeLevel(vibeLevel: number) {
    for (const device of connectedDevices) {
      // @ts-ignore
      if (!device.messageAttributes(Buttplug.ButtplugDeviceMessageType.VibrateCmd)) {
        continue;
      }
    
      try {
        if (vibeLevel) {
          // @ts-ignore
          await device.vibrate(vibeLevel);
        } else {
          // @ts-ignore
          device.stop();
        }
      } catch (e) {
        console.error(e);
        if (e instanceof Buttplug.ButtplugDeviceError) {
          console.error("got a device error!");
        }
      }
    }
  }

  return {
    buttplugScan,
    connectedDevices,
    buttplugLoaded: !!buttplugClient
  }
};