import '@/styles/globals.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
