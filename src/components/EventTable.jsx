import { CopyIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box, Flex, Text,
  Tooltip,
  useMediaQuery,
  useToast,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import Highlighter from "react-highlight-words";
import { useSWRConfig } from "swr";
import CreateEvent from "./CreateEvent";

const EventTable = ({ events, search }) => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)");
  const toast = useToast();

  const { mutate } = useSWRConfig();

  const deleteEvent = async (id) => {
    try {
      const { data } = await axios.delete("/events/delete/" + id);
      if (data?.success) {
        toast({
          title: "Event Deleted",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
        mutate("/events/all");
        return;
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
    <Box mb="15" >
      <CreateEvent />
      {events?.length ? (
        <Wrap justify={"center"} spacing={"8"} align={"center"}>
          {events?.map((event) => (
            <WrapItem overflowY={"scroll"}
              textAlign={"center"}
              rounded="md"
              mx={"auto"}
              bg="#fff"
              shadow="md"
              borderWidth="1px"
              key={event.id}
            >
              <Box
                w={
                  isLargerThan950
                    ? "30vw"
                    : isLargerThan650
                    ? "40vw"
                    : isLargerThan460
                    ? "30vw"
                    : "80vw"
                }
                h={
                  isLargerThan950
                    ? "21vw"
                    : isLargerThan650
                    ? "48vw"
                    : isLargerThan460
                    ? "30vw"
                    : "80vw"
                }
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
                  <Text px="2">
                    {search ? (
                      <Highlighter
                        searchWords={search.split(" ")}
                        autoEscape={true}
                        textToHighlight={event.id}
                      />
                    ) : (
                      event.id
                    )}
                  </Text>
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
                    {search ? (
                      <Highlighter
                        searchWords={search.split(" ")}
                        autoEscape={true}
                        textToHighlight={event.summary}
                      />
                    ) : (
                      event.summary
                    )}
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
                  <Text noOfLines={4}>
                    {search ? (
                      <Highlighter
                        searchWords={search.split(" ")}
                        autoEscape={true}
                        textToHighlight={event.description}
                      />
                    ) : (
                      `${event.description}yes ${event.description} yes ${event.description}`
                    )}
                  </Text>
                </Flex>

                <Flex
                  mt="10"
                  flexDirection={"row"}
                  justify={"space-around"}
                  alignItems={"end"}
                >
                  <Flex
                    direction={"column"}
                    alignItems={"center"}
                    justifyContent={"start"}
                  >
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

                  <Flex
                    direction={"column"}
                    alignItems={"center"}
                    justifyContent={"end"}
                  >
                    <Text
                      textAlign={"right"}
                      fontSize={"xs"}
                      fontWeight={"bold"}
                      color="black"
                    >
                      Ending Time :
                    </Text>
                    <Text px="1" fontSize={"small"}>
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
            </WrapItem>
          ))}
        </Wrap>
      ) : (
        <Box mx="auto" textAlign={"center"} my="5" fontSize={"3xl"}>
          NO EVENTS AVAILABLE
        </Box>
      )}
    </Box>
  );
};

export default EventTable;
