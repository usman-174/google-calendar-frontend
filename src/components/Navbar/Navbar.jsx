import React from 'react'
import { Box, Heading } from '@chakra-ui/react'

const Navbar = () => {
    return (
        <Box m="0"p="0"  bg="teal.800">
            <Heading  textColor={'white'} fontSize={"x-large"}  py="4" textAlign={"center"}>
                Iframe Calendar
            </Heading>
        </Box>
    )
}

export default Navbar
