import '../styles/globals.css'
import type { AppProps } from 'next/app'
// used by react-speech-recognition
import 'regenerator-runtime/runtime'
import { VibeLevelProvider } from '../contexts/vibe-level'

function MyApp({ Component, pageProps }: AppProps) {
  // id used by react-modal in Dialog component
  return <div id="app">
    <VibeLevelProvider>
      <Component {...pageProps} />
    </VibeLevelProvider>
  </div>
}

export default MyApp
