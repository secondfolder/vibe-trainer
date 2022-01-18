import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            async
            src="https://cdn.jsdelivr.net/npm/buttplug@1.0.17/dist/web/buttplug.min.js"
          />
        </body>
      </Html>
    )
  }
}

export default MyDocument
