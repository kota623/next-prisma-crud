import '../styles/reset.css'
import '../styles/skyblue/css/skyblue.min.css'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
