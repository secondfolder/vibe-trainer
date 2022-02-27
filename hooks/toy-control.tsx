import { useEffect, useState } from "react";
import { useVibeLevel } from "../contexts/vibe-level";
import { useInterval } from "./timers"

import type * as ButtplugType from "buttplug"

declare let Buttplug: typeof ButtplugType;

export type Toy = {
  name: string,
  batteryLevel: number | null,
  device: ButtplugType.ButtplugClientDevice,
  features: {
    vibrationMotors?: number,
    linearActuators?: number,
    rotationalMotors?: number,
  },
  activate: (level: number, time?: number) => Promise<void>
}

type ButtplugClientStatus = "not loaded" | "scanning" | "ready" | "error"

type Return = {
  buttplugScan: () => void,
  connectedToys: Toy[],
  buttplugClientStatus: ButtplugClientStatus
}

export default function (): Return {
  const [vibeLevel, setVibeLevel] = useVibeLevel()
  const [connectedToys, setConnectedToys] = useState<Toy[]>([])
  const [buttplugClient, setButtplugClient] = useState<ButtplugType.ButtplugClient>()
  const [buttplugClientStatus, setButtplugClientStatus] = useState<ButtplugClientStatus>('not loaded')


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


  // Refresh battery level every minute
  useInterval(async () => {
    let updatedConnectedToys = await Promise.all(
      connectedToys.map(async toy => {
        let batteryLevel
        try {
          batteryLevel = await toy.device.batteryLevel()
        } catch (error) {
          batteryLevel = null
        }
        return {
          ...toy,
          batteryLevel
        }
      })
    )
    setConnectedToys(updatedConnectedToys)
  }, 1000 * 60)

  function buttplugScan() {
    buttplugClient?.startScanning()
    buttplugClient?.isScanning && setButtplugClientStatus('scanning')
  }

  function loadButtplug() {
    Buttplug.buttplugInit().then(async () => {
      console.log("Buttplug Loaded");
  
      const connector = new Buttplug.ButtplugEmbeddedConnectorOptions();
      const buttplugClient = new Buttplug.ButtplugClient("Vibe Trainer");
      setButtplugClient(buttplugClient)

      buttplugClient.addListener("scanningfinished", async () => {
        setButtplugClientStatus('ready')
      })

      buttplugClient.addListener("serverdisconnect", async () => {
        setButtplugClientStatus('not loaded')
        console.info('Sever disconnected')
      })

      buttplugClient.addListener("deviceadded", async (newDevice: ButtplugType.ButtplugClientDevice) => {
        // Some devices like the Lovense Lush 2 remember their previous vibration settings and will 
        // may start vibrating as soon as they successfully connect via bluetooth. We don't want this 
        // thus we make sure the new device is stopped.
        await newDevice.stop()

        const newConnectedToys: Toy[] = []

        for (const device of buttplugClient.Devices) {
          const vibrationMotors = device.messageAttributes(Buttplug.ButtplugDeviceMessageType.VibrateCmd)?.featureCount
          const linearActuators = device.messageAttributes(Buttplug.ButtplugDeviceMessageType.LinearCmd)?.featureCount
          const rotationalMotors = device.messageAttributes(Buttplug.ButtplugDeviceMessageType.RotateCmd)?.featureCount
          
          const features = {
            ...(vibrationMotors && {vibrationMotors}),
            ...(linearActuators && {linearActuators}),
            ...(rotationalMotors && {rotationalMotors}),
          }

          let batteryLevel

          try {
            batteryLevel = await device.batteryLevel()
          } catch (error) {
            batteryLevel = null
          }

          newConnectedToys.push({
            name: device.Name,
            batteryLevel,
            device,
            features,
            activate: activateDevice.bind(undefined, device)
          })
        }
  
        setConnectedToys(newConnectedToys)
      });

      buttplugClient.addListener("deviceremoved", (device: ButtplugType.ButtplugClientDevice) => {
        setConnectedToys(
          connectedToys => connectedToys.filter(connectedToy => connectedToy.device !== device)
        )
      });
  
      try {
        await buttplugClient.connect(connector);
      } catch (ex) {
        console.error(ex);
      }
      setButtplugClientStatus('ready')
    });
  }

  async function buttplugSetVibeLevel(vibeLevel: number) {
    for (const toy of connectedToys) {
      if (!toy.features.vibrationMotors) {
        continue;
      }
    
      activateDevice(toy.device, vibeLevel)
    }
  }
  
  async function activateDevice(device: ButtplugType.ButtplugClientDevice, level: number, time?: number) {
    try {
      await Promise.race([
        level > 0 ? device.vibrate(level) : device.stop(),
        new Promise((resolve, reject) => 
          setTimeout(() => reject(new Error('Timed out')), 1000)
        )
      ])
    } catch (error) {
      setButtplugClientStatus("error")
    }
    if (time) {
      setTimeout(() => device.stop(), time)
    }
  }

  return {
    buttplugScan,
    connectedToys,
    buttplugClientStatus,
  }
};