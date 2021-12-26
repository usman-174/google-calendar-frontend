import React from 'react'
import { Box, Heading } from '@chakra-ui/react'

const Navbar = () => {
    return (
        <Box mt={0}  bg="teal.800">
            <Heading  textColor={'white'} fontSize={"large"}  py="5" textAlign={"center"}>
                Iframe Calendar
            </Heading>
        </Box>
    )
}

export default Navbar
