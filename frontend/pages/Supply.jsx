import { useState, useEffect } from 'react'
import { useToast, IconButton, Stack, Button, Container, Input, Text, Heading, Table, Thead, Tbody, FormControl, FormLabel, Tfoot, Tr, Th, Td, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon, EditIcon, InfoIcon, DeleteIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import SideNavigationBar from '../components/SideNavigationBar'

const Supplies = () => {

    const [values, setValues] = useState({
        cashBalance: '',
        debitBalance: '',
        totalDebt: ''
    })

    const toast = useToast()


    const [suministro, setSuministro] = useState([])

    // const router = useRouter()

    const getSupply = async () => {
        const response = await axios.get(`${process.env.API_URL}/supplys`)
        setSuministro(response.data)
    }
    useEffect(() => {
        getSupply()
    }, [])


    const showSupply = () => {
        return suministro.map(supply => {
            return (
                <Tr key={supply._id}>
                    <Td>{supply.name}</Td>
                    <Td>{supply.price}</Td>
                    <Td>{supply.quantity}</Td>
                    <Td>{supply.description}</Td>
                    <Td display={'flex'} mx="10" justifyContent="space-evenly"><IconButton aria-label='Search database' icon={<EditIcon />} /><IconButton aria-label='Search database' icon={<DeleteIcon />} /></Td>
                </Tr>
            )
        })
    }
    const onChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
        console.log(e.target.name, e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log(values)
        try {
            const response = await axios.post(`${process.env.API_URL}/supply`, values)
            if (response.status == 201) {
                toast({
                    title: 'Suministro registrado.',
                    description: "El suministro se registro con éxito.",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                })
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            } else {
                toast({
                    title: 'Error al registrar suministro.',
                    description: "El suministro no se pudo crear.",
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            }
            console.log(response.data.name)
        }
        catch (err) {
            console.log(err)
            toast({
                title: 'Error al registrar suministro.',
                description: "El suministro no se pudo crear.",
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
    }



    return (
        <>
            <SideNavigationBar />
            <Container display={"flex"} flexDirection="column" justifyContent={"center"} bg='whiteAlpha.800' alignItems="center" height={"-webkit-fit-content"} minW='70vw'>
                <Heading textAlign={"center"} my={"10"}>Suministros</Heading>
                <Table variant={"striped"}>
                    <Thead>
                        <Tr>
                            <Td width={"350px"}>Nombre</Td>
                            <Td width={"200px"}>Precio</Td>
                            <Td width={"150px"}>Cantidad</Td>
                            <Td >Descripcion</Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {showSupply()}
                        <Tr>
                            <Td>
                                <FormControl>
                                    <Input onChange={onChange} placeholder="Nombre" type={"text"} name={"name"} />
                                </FormControl>
                            </Td>
                            <Td>
                                <FormControl>
                                    <Input onChange={onChange} placeholder="Precio" type={"number"} min={"0"} name={"price"} />
                                </FormControl>
                            </Td>
                            <Td>
                                <FormControl >
                                    <Input onChange={onChange} placeholder="Cantidad" type={"number"} min={"0"} name={"quantity"} />
                                </FormControl>
                            </Td>
                            <Td>
                                <FormControl>
                                    <Input onChange={onChange} placeholder="Descripción" type={"text"} name={"description"} />
                                </FormControl>
                            </Td>
                            <Td display={"flex"} justifyContent="center" >
                                <IconButton aria-label='Search database' bg={"green.500"} icon={<AddIcon />} onClick={onSubmit} />
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Container>
        </>
    )
}

export default Supplies