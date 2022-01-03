import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useGetEvent from "../hooks/useGetEvents";
import CreateEvent from "./Events/CreateEvent";
import EventTable from "./Events/EventTable";
import FilterBox from "./Events/FilterBox";
import EventList from "./Reminder/EventList";
import TemplateBox from "./Templates/TemplateBox";

const IframeTabs = () => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const toast = useToast();

  const [startDate, setStartDate] = useState("");
  const [loadMore, setLoadMore] = useState(false);
  const [viewGrid, setViewGrid] = useState(true);
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const { isValidating, data, error, nextToken, mutate } = useGetEvent(
    startDate,
    endDate,
    filter,
    search
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
    <Tabs mt="5" isFitted variant="soft-rounded" colorScheme="telegram">
      <TabList>
        <Tab>Events</Tab>
        <Tab>Send Message</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Center>
            <Input
              mt="8"
              p="3"
              w="sm"
              disabled={endDate || startDate || filter}
              type="text"
              placeholder="Search Here...."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
          {/* CREATE EVENT */}
          <Flex w="45%" justifyContent={"center"} alignItems={"center"}>
            {/* CREATE EVENT */}
            <CreateEvent />

            {/* SWITCH VIEW */}
          <FormControl
              display="flex"
              alignItems="center"
              justifyContent={"center"}
            >
              <Switch
                checked={viewGrid}
                defaultChecked={viewGrid}
                colorScheme={"teal"}
                onChange={(e) => setViewGrid(e.target.checked)}
                id="show-table"
                mx="1"
              />
              <FormLabel htmlFor="show-list" mb="1">
                View In Grid
              </FormLabel>
            </FormControl>
            
          </Flex>

          {isValidating ? (
            // LOADING SPINNER
            <Center w="100%">
              <Spinner mx="auto" mt="10" size="xl" />;
            </Center>
          ) : !isValidating && data?.items?.length ? (
            <Box>
              {viewGrid ? (
                <>
                  <EventTable events={data.items} search={search} />
                  {!search &&
                    !filter &&
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
                </>
              ) : (
                <EventList data={data} mutate={mutate} isValidating={isValidating} />
              )}
              {/* EVENT BOX */}
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
          {/* CREATE TEMPLATE */}
          <TemplateBox />
        </TabPanel>
       
      </TabPanels>
    </Tabs>
  );
};

export default IframeTabs;
