import React from 'react'
import { Input, Stack, Button } from '@chakra-ui/react'
const InputTest = ({boton}) => {

  return (
    <Stack spacing={3}>
      <Button onClick={() => window.location.href = "inicio"}>Abrir la otra pestaña</Button>
    </Stack>
  )
}

export default InputTest