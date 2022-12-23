import { useState, useEffect } from 'react'
import { Button, Container, Input, Stack, Text, HStack, Table, Thead, Tbody, Tfoot, Tr, Th, Td, Heading, } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'

const users = () => {
    const [users, setUsers] = useState([])
    const router = useRouter()

    useEffect(() => {
        getUsers()
    }, [])

    const showUsers = () => {
        return users.map(user => {
            return (
                <Tr key={user._id}>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.rut}</Td>
                    <Td><Button onClick={() => router.push(`/user/${user._id}`)}>Ver mas</Button></Td>
                </Tr>
            )
        })
    }

    return (
        <Container maxW="container.xl" centerContent>
            <Heading textAlign={"center"} my={10}>Productos</Heading>
            <Button colorScheme="teal" onClick={() => router.push('/user/crear')}>Crear Producto</Button>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Td>Nombre</Td>
                        <Td>Precio</Td>
                        <Td>Stock</Td>
                    </Tr>
                </Thead>
                <Tbody>
                    {showUsers()}
                </Tbody>
            </Table>
        </Container>
    )
}

export default users