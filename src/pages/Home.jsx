import {
  Box
} from "@chakra-ui/react";
import React from "react";
import Calendar from "../components/Calendar/Calendar";
import IframeTabs from "../components/IframeTabs";
import Navbar from "../components/Navbar/Navbar";


const Home = () => {
  
  return (
    <>
      <Navbar/>
      {/* Calendar */}
      <Box mx="2" my="0">

      <Calendar />

        <IframeTabs />
      </Box>
    
    </>
  );
};

export default Home;
