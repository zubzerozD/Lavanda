import { useState, useEffect, use } from 'react'
import { IconButton, Stack, Button, Container, Input, Text, Heading, Table, Thead, Tbody, Tfoot, Tr, Th, Td, Box } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { EditIcon, InfoIcon } from '@chakra-ui/icons'
import SideNavigationBar from '../components/SideNavigationBar'

export default function Finances() {
    const [libro, setLibro] = useState([])

    const router = useRouter()

    const onSubmit = async (e) => {
        router.push('/LibroContable')
    }

    const getLibro = async () => {
        const response = await axios.get(`${process.env.API_URL}/ledgers`)
        setLibro(response.data)
    }

    useEffect(() => {
        getLibro()
    }, [])

    const showLibro = () => {
        return libro.map(ledger => {
            return (
                <Tr key={ledger._id}>
                    <Td isNumeric>{ledger.cashBalance}</Td>
                    <Td isNumeric>{ledger.debitBalance}</Td>
                    <Td isNumeric>{ledger.totalDebt}</Td>
                    <Td display={'flex'} mx="10" justifyContent="space-evenly"><IconButton aria-label='Search database' icon={<EditIcon />} /><IconButton aria-label='Search database' icon={<InfoIcon />} /></Td>
                </Tr>
            )
        })
    }

    return (
        <>
            <SideNavigationBar></SideNavigationBar>
            <Container centerContent bg='whiteAlpha.800' display={"flex"} flexDirection="column" minH='50vh' minW='70vw'>
                <Heading textAlign={"center"} my={10}>Libro contable</Heading>
                <Table variant={"striped"}>
                    <Thead>
                        <Tr>
                            <Td>Cantidad dinero en efectivo</Td>
                            <Td>Cantidad de dinero en cuenta</Td>
                            <Td>Total deudas</Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {showLibro()}
                    </Tbody>
                </Table>
                <Button colorScheme={"teal"} size={"md"} type={"submit"} my={"5"} onClick={onSubmit}>Añadir libro contable</Button>
            </Container>
        </>
    )
}
