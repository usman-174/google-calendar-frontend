import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spinner,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useMediaQuery,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";

import React, { useEffect, useState } from "react";
import ShowMoreText from "react-show-more-text";
import FeedBack from "./FeedBack";

const EventList = ({ data, isValidating, mutate }) => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");

  const toast = useToast();
  const [selectedItems, setSelectedItems] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const rows = data?.items
    ?.filter((item) => !item.description.includes("#reminder_sent"))
    .map((event) => ({
      id: event?.id,
      phone: event?.summary,
      summary: event?.summary,
      keywords: event?.description
        .split(" || ")[1]
        .replace(" ", " , ")
        .toUpperCase(),
      description: event?.description,
      ...event,
    }));
  const onCheckBoxChange = (e) => {
    if (e.target.value === "all" && e.target.checked) {
      setSelectedItems(rows);
      return;
    } else if (e.target.value === "all" && !e.target.checked) {
      setSelectedItems([]);
      return;
    }
    const value = JSON.parse(e.target.value);
    const found = selectedItems.find((x) => x.id === value.id);
    if (e.target.checked) {
      if (found) {
      } else {
        const data = [...selectedItems, value];

        setSelectedItems(data);
      }
    } else {
      const data = selectedItems.filter((x) => x.id !== value.id);
      setSelectedItems(data);
    }
  };
  const handleSendReminders = async () => {
    if (selectedItems.length) {
      setFeedback(null);
      setLoading(true);
      try {
        const { data } = await axios.post("/message/bulk", {
          selectedEvents: selectedItems,
        });
        if (data) {
          setFeedback(data);
          if (data.success.length) {
            mutate();
          }
        }
        return;
      } catch (error) {
        setFeedback(null);
        toast({
          title: error?.response?.data?.error || "Failed to send message.",
          status: "error",
          duration: 1700,
          isClosable: true,
        });
        return;
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setSelectedItems([]);
  }, []);
  return (
    <Box mx={isLargerThan460 ? "5" : "0"} mt="8">
      <Button
        onClick={handleSendReminders}
        my="2"
        isLoading={isValidating || loading}
        mx="4"
        size={isLargerThan460 ? "sm" : "xs"}
        disabled={!selectedItems.length}
        colorScheme={"messenger"}
      >
        Send Reminders
      </Button>

      {isValidating && !data.items.length ? (
        <Center w="100%">
          <Spinner mx="auto" mt="10" size="xl" />
        </Center>
      ) : data?.items?.length ? (
        <Box my="8" p="1" overflowX={"auto"}>
          <Table size={"sm"} colorScheme="facebook" mx="auto">
            <TableCaption color={"telegram.400"} fontWeight={"bold"}>
              SELECT EVENTS TO SEND REMINDERS
            </TableCaption>

            <Thead>
              <Tr>
                <Th textAlign={"center"}>
                  <Flex align={"center"} justify={"space-between"}>
                    <Checkbox
                      colorScheme={"teal"}
                      isChecked={
                        JSON.stringify(selectedItems) === JSON.stringify(rows)
                      }
                      value={"all"}
                      mx="1"
                      onChange={onCheckBoxChange}
                    />
                  </Flex>
                </Th>
                <Th textAlign={"center"}>Keywords</Th>
                <Th textAlign={"center"}>Phone No</Th>
                <Th textAlign={"center"}>Description</Th>
                <Th textAlign={"center"}>Start Time</Th>
                <Th textAlign={"center"}>End Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row, i) => (
                <Tr key={row.id}>
                  <Td>
                    <Flex align={"center"} justify={"space-between"}>
                      <Text mx="2">{i + 1}</Text>
                      <Checkbox
                        colorScheme={"green"}
                        isChecked={
                          selectedItems.find((x) => x.id === row.id)
                            ? true
                            : false
                        }
                        value={JSON.stringify(row)}
                        onChange={onCheckBoxChange}
                      />
                    </Flex>
                  </Td>
                  <Td textAlign={"center"} fontSize={"sm"}>
                    {row.keywords}
                  </Td>
                  <Td textAlign={"center"}>{row.phone.replace(" ", "")}</Td>
                  <Td maxWidth={"36vw"} fontSize={"sm"}>
                    <ShowMoreText
                      lines={3}
                      more="Read more"
                      less={"Read less"}
                      className="content-css"
                      anchorClass="show_more"
                      expanded={false}
                      truncatedEndingComponent={"... "}
                    >
                      {row.description.split(" || ")[0]}
                    </ShowMoreText>
                  </Td>
                  <Td>{new Date(row.start?.dateTime).toLocaleString()}</Td>
                  <Td>{new Date(row.end?.dateTime).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th textAlign={"center"}></Th>

                <Th textAlign={"center"}>Keywords</Th>
                <Th textAlign={"center"}>Phone No</Th>
                <Th textAlign={"center"}>Description</Th>
                <Th textAlign={"center"}>Start Time</Th>
                <Th textAlign={"center"}>End Time</Th>
              </Tr>
            </Tfoot>
          </Table>
          <FeedBack feedback={feedback} />
        </Box>
      ) : (
        <Center w="100%">
          <Heading m="8" size={"sm"}>
            No Events Available
          </Heading>
        </Center>
      )}
    </Box>
  );
};

export default EventList;
