import {
  Box,
  Button,
  Center,
  Container, Heading, Spinner, useMediaQuery, useToast
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import EventTable from "../components/EventTable";
import FilterBox from "../components/FilterBox";
import TemplateBox from "../components/TemplateBox";
import useGetEvent from "../hooks/useGetEvents";

const Home = () => {

  const [startDate, setStartDate] = useState("");
  const [loadMore, setLoadMore] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState("");
  const toast = useToast();
  const [isLargerThan450] = useMediaQuery("(min-width: 450px)");

  const { isValidating, data, error, nextToken, mutate } = useGetEvent(
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
    setLoadMore(true);
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
    } finally {
      setLoadMore(false);
    }
  };
  useEffect(() => {
    if (error && !isValidating && !data) {
      toast({
        title: error?.error || "Failed to Fetch the Events",
        status: "error",
        duration: 1900,
        isClosable: true,
      });
    }

    // eslint-disable-next-line
  }, [error]);
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
      {/* Calendar */}
      <Calendar/>
      {/* MESSAGEBOX */}
      <TemplateBox/>
       {/* FILTER AREA */}
       <Heading my={isLargerThan450 ?"8":0} size={isLargerThan450?"lg":"md"}textColor={"teal.600"} textAlign={"center"}>
        EVENTS
      </Heading>
     
    <FilterBox endDate={endDate} startDate={startDate} filterEvents={filterEvents} filter={filter} setEndDate={setEndDate} setFilter={setFilter} setStartDate={setStartDate} />
      
      {isValidating && !data ? (
        <Center w="100%">
          <Spinner mx="auto" mt="10" size="xl" />;
        </Center>
      ) : data?.items?.length ? (
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
                  size={isLargerThan450?"md":"sm"}
                >
                  Load More
                </Button>
              </Center>
            )}
        </Box>
      ) : (
        <Box
          mx="auto"
          fontWeight={"semibold"}
          textAlign={"center"}
          my="10"
          fontSize={"3xl"}
        >
          NO EVENTS AVAILABLE
        </Box>
      )}
    </Container>
  );
};

export default Home;
