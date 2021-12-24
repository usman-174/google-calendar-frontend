import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EventTable from "../components/EventTable";
import RightSide from "../components/RightSide";
import useGetEvent from "../hooks/useGetEvents";

const Home = () => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [startDate, setStartDate] = useState("");
  const [loadMore, setLoadMore] = useState(false)
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState("");
  const toast = useToast();

  const { isValidating, data,error, nextToken,mutate } = useGetEvent(
    startDate,
    endDate,
    filter
  );

  const filterEvents = () => {
    if (!endDate) {
      toast({
        title: "Please provide required dates.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setFilter(true);
  };
  const handlePaginate = async () => {
    setLoadMore(true)
    let query = "/events/all";

    
    if (nextToken) {
      query = `/events/all?pageToken=${nextToken}`;
    }
    try {
      const { data: res } = await axios.get(query, { withCredentials: true });
      if (res) {
        const input = {
          nextPageToken: res.nextPageToken,
          items: [...data.items, ...res?.items],

          totalItems: res.totalItems,
        };
        console.log("Data to mutate= ", input);
        mutate(input, false);
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.error || "Failed to Fetch the Events",
        status: "error",
        duration: 1600,
        isClosable: true,
      });
    }finally{
      setLoadMore(false)
    }
  };
  useEffect(()=>{
    if(error && !isValidating && !data){
      toast({
        title: error?.error || "Failed to Fetch the Events",
        status: "error",
        duration: 1900,
        isClosable: true,
      });
    }
    
    // eslint-disable-next-line
  },[error])
  useEffect(() => {
    if (filter === false) {
      toast({
        title: "Filter Removed",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line
  }, [filter]);
  
  return (
    <Container maxW="container.xl">
      <Box
        bg="lightskyblue"
        w="100%"
        rounded={"md"}
        textAlign={"center"}
        py="12"
        px="8"
        my="10"
        fontSize={"3xl"}
      >
        IFRAME GOOGLE CALENDAR
      </Box>
      <Flex
        justify={"space-around"}
        align={"center"}
        direction={!isLargerThan460 ? "column" : "row-reverse"}
      >
        {/* CHAT COMPONENT */}
        <RightSide />

        {/* FIlTER AREA */}
        <Flex
          shadow={"md"}
          rounded={"sm"}
          w={isLargerThan460 ? "40%" : "80%"}
          p="2"
          direction={"column"}
        >
          <FormControl>
            <FormLabel htmlFor="startDate">From</FormLabel>
            <Input
              type="datetime-local"
              name="startDate"
              id="startDate"
              onChange={(e) => {
                if (!e.target.value && !endDate) {
                  setFilter(false);
                }
                return setStartDate(e.target.value);
              }}
              value={startDate}
            />
            <br />
            <FormLabel htmlFor="endDate">To</FormLabel>

            <Input
              type="datetime-local"
              name="endDate"
              id="endDate"
              onChange={(e) => {
                if (!e.target.value && !startDate) {
                  setFilter(false);
                }
                return setEndDate(e.target.value);
              }}
              value={endDate}
            />
            <Flex justifyContent={"center"} align={"center"}>
              <Button
              
                disabled={!endDate && !startDate}
                my="2"
                onClick={filterEvents}
                mx="auto"
                variant={"solid"}
                colorScheme={"teal"}
              >
                Apply Filter
              </Button>
              {filter && (
                <Text
                  _hover={{ textColor: "teal", textDecoration: "underline" }}
                  align={"center"}
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setFilter(false);
                  }}
                  color="red.600"
                  fontFamily={"serif"}
                  fontWeight={"semibold"}
                  cursor={"pointer"}
                >
                  <CloseIcon h="12px" w="12px" mx="2" />
                  ResetFilter
                </Text>
              )}
            </Flex>

            {/* FILTER END HERE */}
          </FormControl>
        </Flex>
      </Flex>
      {(isValidating && !data) ? (
        <Center w="100%">
          <Spinner mx="auto" mt="10" size="xl" />;
        </Center>
      ) : (
        data?.items?.length ? (
          <Box>
            <EventTable events={data.items} />
            {!filter &&
             nextToken.length &&
              !isValidating &&
              data?.items?.length !== data?.totalItems && (
                <Center>

                <Button
                isLoading={loadMore}
                my="3"
                onClick={handlePaginate}
                colorScheme={"telegram"}
                >
                  Load More
                </Button>
                  </Center>
              )}
          </Box>
        ): <Box mx="auto" fontWeight={"semibold"} textAlign={"center"} my="10" fontSize={"3xl"}>
        NO EVENTS AVAILABLE
      </Box>
      )}
    </Container>
  );
};

export default Home;
