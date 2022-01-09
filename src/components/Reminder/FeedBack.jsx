import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Heading, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import FeedBackTable from "./FeedBackTable";

const FeedBack = ({ feedback }) => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  if(!feedback){
    return <Box mx={"auto"} textAlign={"center"}>
      <Heading my="4" size={"lg"}>FeedBack is Empty</Heading>
      
    </Box>
  }
  return (
    <Box w="80%" my="4" mx="auto">
      {/* HEADING */}
      <Heading
        textAlign={"center"}
        size={isLargerThan460 ? "lg" : "md"}
        textColor={"teal.800"}
      >
        FeedBack
      </Heading>
      {/* Accordian */}
      <Accordion my="10">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box textColor={"green.700"} fontWeight={"bold"} flex="1" textAlign="center">
                SUCCEED ( {feedback.success?.length} )
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <FeedBackTable info={feedback.success||[]} />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
            <Box textColor={"red.700"} fontWeight={"bold"} flex="1" textAlign="center">
               FAILED ( {feedback.failed?.length} )
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
          <FeedBackTable info={feedback.failed||[]} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default FeedBack;
