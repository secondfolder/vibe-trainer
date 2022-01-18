import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [mediaQuery] = useState(
    window.matchMedia("(prefers-color-scheme: dark)")
  )
  const [darkMode, setDarkMode] = useState(mediaQuery.matches)

  function handleChange(mediaQuery: MediaQueryList, event: MediaQueryListEvent) {
    setDarkMode(mediaQuery.matches)
  }

  useEffect(() => {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])
  return darkMode
}
  