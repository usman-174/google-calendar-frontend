import {
  Box,
  Button,
  Center,
  Heading, Input, Spinner, Tab,
  TabList,
  TabPanel,
  TabPanels, Tabs, useMediaQuery,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetEvent from "../hooks/useGetEvents";
import EventTable from "./EventTable";
import FilterBox from "./FilterBox";
import TemplateBox from "./TemplateBox";
const IframeTabs = () => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const toast = useToast();

  const [startDate, setStartDate] = useState("");
  const [loadMore, setLoadMore] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const { isValidating, data, error, nextToken, mutate } = useGetEvent(
    startDate,
    endDate,
    filter,search
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
    <Tabs  isFitted  variant='soft-rounded' colorScheme='telegram'>
      <TabList>
        <Tab>Events</Tab>
        <Tab>Send Message</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Heading
            my="5"
            textAlign={"center"}
            size={isLargerThan460 ? "lg" : "md"}
            textColor={"teal.800"}
          >
            EVENTS
          </Heading>
          <Center>

          <Input  my="2" p="4" w="md"
          disabled={endDate||startDate||filter}
          type="text" placeholder="Search Here...."  value={search} onChange={(e)=>setSearch(e.target.value)}/>
          
          </Center>
          {/* FILTER BOX STARTS */}
          <FilterBox
            endDate={endDate}
            startDate={startDate}
            filterEvents={filterEvents}
            filter={filter}
            setEndDate={setEndDate}
            search={search}
            setFilter={setFilter}
            setStartDate={setStartDate}
          />

          {isValidating && !data ? (
            <Center w="100%">
              <Spinner mx="auto" mt="10" size="xl" />;
            </Center>
          ) : data?.items?.length ? (
            <Box >
              {/* EVENT BOX */}
              <EventTable events={data.items} search={search} />
              {(!search && !filter) &&
                nextToken.length &&
                !isValidating &&
                data?.items?.length !== data?.totalItems && (
                  <Center>
                    <Button
                      isLoading={loadMore}
                      my="3"
                      onClick={handlePaginate}
                      colorScheme={"telegram"}
                      size={isLargerThan460 ? "md" : "sm"}
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
          {/* EVENT BOX END */}
          {/* ------------------------------- */}
        </TabPanel>
        <TabPanel>
          <TemplateBox />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default IframeTabs;