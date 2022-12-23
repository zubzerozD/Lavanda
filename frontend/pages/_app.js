import '../styles/globals.css'
import '../styles/login.css';
import { ChakraProvider, extendTheme, ThemeProvider, Box  } from '@chakra-ui/react'
import axios from 'axios'


function MyApp({ Component, pageProps }) {
  // axios.defaults.withCredentials = true;
  
  return (
      <><Component {...pageProps}/></>
  )
}

export default MyApp