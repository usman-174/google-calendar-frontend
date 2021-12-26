import { CopyIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box, Flex,
  Grid, Text,
  Tooltip,
  useMediaQuery,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useSWRConfig } from "swr";

const EventTable = ({ events }) => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");
  const toast = useToast();

  const { mutate } = useSWRConfig();

  const deleteEvent = async (id) => {
    try {
      
      const { data } = await axios.delete(
        "/events/delete/" + id
      );
      if (data?.success) {
        toast({
          title: "Event Deleted",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
         mutate("/events/all");
         return
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.error || "Failed to delete the Event",
        status: "error",
        duration: 1600,
        isClosable: true,
      });
    }
  };

  return (
     
      <Box textAlign="center" mx="2" mb="15">
        {events?.length ? (
          <Grid
            templateColumns={
              isLargerThan650
                ? "repeat(3, 5fr)"
                : isLargerThan460
                ? "repeat(2, 4fr)"
                : "repeat(1, 3fr)"
            }
            gap={isLargerThan460 ? 4 : 2}
          >
            {events?.map((event) => (
              <Box
                rounded="md"
                my="2"
                bg="#fff"
                shadow="md"
                borderWidth="1px"
                key={event.id}
              >
                <DeleteIcon
                  color="red.400"
                  onClick={() => deleteEvent(event.id)}
                  _hover={{ textColor: "red.600" }}
                  mx="12"
                  h="20px"
                  w="20px"
                  cursor={"pointer"}
                />
                <Flex m="2" direction={"column"}>
                  <Text
                    textAlign={"left"}
                    fontSize={"xs"}
                    fontWeight={"bold"}
                    color="black"
                  >
                    ID :
                  </Text>
                  <Text px="2">{event.id}</Text>
                </Flex>
                <Flex m="2" direction="column">
                  <Text
                    textAlign={"left"}
                    fontSize={"xs"}
                    fontWeight={"bold"}
                    color="black"
                  >
                    Phone Number :
                  </Text>
                  <Text px="2">
                    {event.summary}

                    <Tooltip label="Copy Phone">
                      <CopyIcon
                        mx="4"
                        onClick={() => {
                          navigator.clipboard.writeText(event.summary);

                          toast({
                            title: "Phone Number Copied",
                            description: `Copied ${event.summary}`,
                            status: "info",
                            duration: 1000,
                            isClosable: true,
                          });
                        }}
                        cursor={"pointer"}
                      />
                    </Tooltip>
                  </Text>
                </Flex>
                <Flex m="2" direction="column">
                  <Text
                    textAlign={"left"}
                    fontSize={"xs"}
                    fontWeight={"bold"}
                    color="black"
                  >
                    Description :
                  </Text>
                  <Text px="2">{event.description}</Text>
                </Flex>

                <Flex m="2" flexDirection={"row"} alignItems={"center"}>
                  <Flex direction={"column"}>
                    <Text
                      textAlign={"left"}
                      fontSize={"xs"}
                      fontWeight={"bold"}
                      color="black"
                    >
                      Starting Time :
                    </Text>
                    <Text px="1" fontSize={"small"}>
                      {new Date(event.start?.dateTime).toDateString()} at{" "}
                      {new Date(event.start?.dateTime).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </Text>
                  </Flex>

                  <Flex direction={"column"}>
                    <Text
                      textAlign={"left"}
                      fontSize={"xs"}
                      fontWeight={"bold"}
                      color="black"
                    >
                      Ending Time :
                    </Text>
                    <Text mx="3" px="1" fontSize={"small"} ml={"auto"}>
                      {new Date(event.end?.dateTime).toDateString()} at{" "}
                      {new Date(event.end?.dateTime).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Grid>
        ) : (
          <Box mx="auto" textAlign={"center"} my="5" fontSize={"3xl"}>
            NO EVENTS AVAILABLE
          </Box>
        )}
      </Box>
  );
};

export default EventTable;
