import {
  Box, Container
} from "@chakra-ui/react";
import React from "react";
import Calendar from "../components/Calendar";
import IframeTabs from "../components/IframeTabs";


const Home = () => {
  
  return (
    <Container maxW="container.xl">
      {/* Calendar */}
      <Calendar />
      <Box p="2" my="5">

        <IframeTabs/>
      </Box>
    
    </Container>
  );
};

export default Home;
