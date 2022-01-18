import { useEffect, useState } from "react";

export default function useDevicePixelRatio() {
  const [devicePixelRatio, setDevicePixelRatio] = useState(1)

  function updatePixelRatio() {
    setDevicePixelRatio(window.devicePixelRatio)
  }

  useEffect(() => {
    if (window.devicePixelRatio !== devicePixelRatio) {
      updatePixelRatio()
    }
  }, [])

  useEffect(() => {
    const mediaQuery = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    mediaQuery.addEventListener('change', updatePixelRatio)
    return () => mediaQuery.removeEventListener('change', updatePixelRatio)
  }, [devicePixelRatio])

  return devicePixelRatio
}
  