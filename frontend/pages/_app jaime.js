import '../styles/globals.css'
import { ChakraProvider, extendTheme, ThemeProvider, Box  } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: "#44337A",
      100: "#B794F4",
      500: '#25d3bc'
    }
  }
});

function MyApp({ Component, pageProps }) {



  return (
    <ChakraProvider >
      <ThemeProvider theme={theme}>
        <Box 
          w="full" h='full'
          css={{
            backgroundImage: "url(/background.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            position: "fixed",
            zIndex: "-1"
          }}
          >
        </Box>

          {<Component {...pageProps} />}

      </ThemeProvider>
    </ChakraProvider>
  )
}

export default MyApp