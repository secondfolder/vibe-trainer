import { useEffect, useState } from "react";

export default function useTypefaceLoaded(typeface: string) {
  const [loaded, setLoaded] = useState(false)
  const typefaceLoadedCheck = `12px "${typeface}"`

  useEffect(() => {
    setLoaded(document.fonts.check(typefaceLoadedCheck))

	document.fonts.load(typefaceLoadedCheck).then(() => setLoaded(true));
  }, [])

  return loaded
}