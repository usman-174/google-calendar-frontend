import { CopyIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Text,
  Tooltip,
  useMediaQuery,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import ShowMoreText from "react-show-more-text";
import Highlighter from "react-highlight-words";
import ShowKeywords from "../layouts/ShowKeywords";
import DeleteEventAlter from "./DeleteEventAlert";

const EventTable = ({ events, search }) => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)");
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();
  const toast = useToast();
  const onClose = () => setIsOpen(false);

  return (
    <Box mb="15">
      {events?.length ? (
        <Wrap justify={"center"} spacing={"8"} align={"center"}>
          {events?.map((event) => (
            <WrapItem
              overflowY={"scroll"}
              textAlign={"center"}
              rounded="md"
              mx={"auto"}
              bg={
                !event.description.includes("#reminder_sent")
                  ? "#fff"
                  : "#f4f2f2"
              }
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
                  onClick={() => setIsOpen(true)}
                  _hover={{ textColor: "red.600" }}
                  mx="12"
                  h="20px"
                  w="20px"
                  cursor={"pointer"}
                />
                <DeleteEventAlter
                  onClose={onClose}
                  isOpen={isOpen}
                  eventId={event.id}
                  cancelRef={cancelRef}
                />
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
                    {event.description.includes("#reminder_sent") ? (
                      <Text
                        as={"span"}
                        textColor="green.400"
                        display={"inline-block"}
                        fontSize={"xs"}
                        mx="2"
                      >
                         Reminder Sent
                      </Text>
                    ) : (
                      ""
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
                <Flex m="2" direction={"column"}>
                  <Text
                    textAlign={"left"}
                    fontSize={"xs"}
                    fontWeight={"bold"}
                    color="black"
                  >
                    Keywords :
                  </Text>
                  {search ? (
                    <Highlighter
                      searchWords={search.split(" ")}
                      autoEscape={true}
                      textToHighlight={event.description
                        .split(" || ")[1]
                        .replace(" ", " , ")
                        .toUpperCase()}
                    />
                  ) : (
                    <ShowKeywords description={event.description} />
                  )}
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

                  {search ? (
                    <Text>
                      <Highlighter
                        searchWords={search.split(" ")}
                        autoEscape={true}
                        textToHighlight={
                          event.description.includes("#reminder_sent")
                            ? event.description
                                .split(" || ")[0]
                                .split("#reminder_sent ")[1]
                            : event.description.split(" || ")[0]
                        }
                      />{" "}
                    </Text>
                  ) : (
                  
                    <ShowMoreText
                      lines={3}
                      more="Read more"
                      less={"Read less"}
                      className="content-css"
                      anchorClass="show_more"
                      expanded={false}
                      truncatedEndingComponent={"... "}
                    >
                      {event.description.includes("#reminder_sent")
                        ? event.description
                            .split(" || ")[0]
                            .split("#reminder_sent ")[1]
                        : event.description.split(" || ")[0]}
                    </ShowMoreText>
                  )}
                </Flex>

                <Flex
                  mt="4"
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
