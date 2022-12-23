import {React, useRef, useState, useEffect} from 'react'
import { useRouter } from 'next/router'

import { Input, Stack, Button, DrawerOverlay, DrawerContent,DrawerCloseButton, Drawer, 
	DrawerHeader, DrawerBody, DrawerFooter, Box, Flex, Text, IconButton, Icon, Divider, 
    useTheme, Avatar } from '@chakra-ui/react'

import { HamburgerIcon } from '@chakra-ui/icons'
import { WashingMachineIcon, HomeIcon, ScheduleIcon, HistoryIcon } from '../public/SVGsResources'

const SideNavigationBar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const btnRef = useRef()


    const theme  = useTheme()
    const generalColor = theme.colors.brand[500];
	const router = useRouter()

    
	const [homeButtCol, setHomeButtCol] = useState(generalColor)
	const [scheduleButtCol, setScheduleButtCol] = useState(generalColor)
	const [historyButtCol, setHistoryButtCol] = useState(generalColor)

    const userName = 'Jaime Huenchulao o.'


    const [avatarIsWrapped, setAvatarIsWrapped] = useState(true);
    const userTextRef = useRef(null);

    useEffect(() => {
        if (userTextRef.offsetHeight > userTextRef.clientHeight) {
            setAvatarIsWrapped(true);
        } else {
            setAvatarIsWrapped(false);
        }
    }, [userTextRef]);
    
    return (
        <>   
            <Flex  justifyContent="space-between" alignItems="stretch"  alignContent="stretch" spacing={4} bg = "white" py = '2' maxH = '8vh' w = "full"
                backgroundAttachment = "fixed" position = "fixed" zIndex = "1">

                <IconButton  ref={btnRef} justifySelf="start" alignSelf="center" h = '8vh' rounded = '0' colorScheme= "white" onClick={() => setIsOpen(!isOpen)} _hover = { { bg : "brand.500"} } >
                
                    <HamburgerIcon w={8} h='full' color="Black" />
                    
                </IconButton>
                
                <Text  fontSize="6vh" fontWeight="thin" color="brand.500" justifySelf="center" alignSelf="center" ml = '14vw'
                display = "flex" justifyContent="space-between" alignItems="center" > 

                    <WashingMachineIcon color = {generalColor} v = '7vh' w = '7vh'/>
                    Lavanderia</Text>

                <Flex align="center" h = '6vh' justifySelf="end" alignSelf="center" pr = '10' >
                    <Avatar h = '6vh' w = '6vh' src="/favicon.ico" mr = '2'/>
                    
                    <Stack orientation="vertical" justifyContent="center" alignContent="center" size = 'full'>
                        <Text ref = {userTextRef} alignSelf='start' fontWeight="medium" fontSize = '-moz-initial' >{avatarIsWrapped ? '' : userName}</Text>
                    </Stack>
                </Flex>
            </Flex>
            <Divider borderColor="black" borderWidth="1px" borderStyle="double" backgroundAttachment = "fixed" position = "fixed" zIndex = "1" mt = '8vh' />
            <Stack mb = '8vh'></Stack>
            
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={() => setIsOpen(false)}
                colorScheme= "brand"
                finalFocusRef={btnRef}
            >

                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton />
                
                    <DrawerHeader  display = "flex" justifyContent="space-between" alignItems="center" mb = {2} mr = '10' >
                        <WashingMachineIcon color = {generalColor} w = "62" h = "62"/>
                        <Text mx = 'auto' pt = '1' fontSize="xl" fontWeight="medium" >Lavanderia</Text>
                    </DrawerHeader>
                    
                    <Divider borderColor="brand.500" borderWidth="1px" borderStyle="dashed" mb = {10} />

                    <DrawerBody p = {0}>
                        <Button 
                            
                            rounded = '0' pr = '10' pl = '10' w = 'full' mb = {2} h = '16'
                            colorScheme = 'white' color = 'black'
                            display = "flex" justifyContent="space-between" alignItems="center"  
                            
                            leftIcon={ <HomeIcon color = {homeButtCol}  w = "42" h = "42" />}

                            _hover = { { bg: "brand.500" }} 
                            onMouseLeave =  { ()=> setHomeButtCol(generalColor) }
                            onMouseEnter = { ()=> setHomeButtCol("#FFFFFF") } 
                            
                            onClick={() => router.push('/productos') } >

                            <Text mx = 'auto'>Inicio</Text>
                        </Button>

                        <Button 
                            
                            rounded = '0' pr = '10' pl = '10' w = 'full'  mb = {2} h = '16'
                            colorScheme = 'white' color = 'black'
                            display = "flex" justifyContent="space-between" alignItems="center"  
                            
                            leftIcon={ <ScheduleIcon color = {scheduleButtCol} w = "42" h = "42" />}

                            _hover = { { bg: "brand.500" }} 
                            onMouseLeave =  { ()=> setScheduleButtCol(generalColor) }
                            onMouseEnter = { ()=> setScheduleButtCol("#FFFFFF") } 
                            onClick={() => router.push('/productos') }
                            >

                            <Text mx = 'auto'>Agendar</Text>
                        </Button>

                        <Button 
                            
                            rounded = '0' pr = '10' pl = '10' w = 'full'  mb = {2} h = '16'
                            colorScheme = 'white' color = 'black'
                            display = "flex" justifyContent="space-between" alignItems="center"  
                            
                            leftIcon={ <HistoryIcon color = {historyButtCol} w = "42" h = "42" />}

                            _hover = { { bg: "brand.500" }} 
                            onMouseLeave =  { ()=> setHistoryButtCol(generalColor) }
                            onMouseEnter = { ()=> setHistoryButtCol("#FFFFFF") } 
                            
                            onClick={() => router.push('/productos') }
                            >

                            <Text mx = 'auto'>Ver historial</Text>
                        </Button>

                    </DrawerBody>

                    <DrawerFooter>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            
        </>
    )
}

export default SideNavigationBar