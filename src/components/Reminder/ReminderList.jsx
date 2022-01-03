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
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const rows = data?.items
    ?.filter((item) => !item.description.includes("#reminder_sent"))
    .map((event) => ({
      id: event?.id,
      phone: event?.summary,
      keywords: event?.description
        .split(" || ")[1]
        .replace(" ", " , ")
        .toUpperCase(),
      description: event?.description.split(" || ")[0],
      startTime: new Date(event.start?.dateTime).toLocaleString(),
      endTime: new Date(event.end?.dateTime).toLocaleString(),
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
      try {
        setLoading(true);
        const { data } = await axios.post("/message/bulk", {
          selectedEvents: selectedItems,
        });
        setFeedback(data);
        return;
      } catch (error) {
        setFeedback(null);
        toast({
          title: error?.response.data.error || "Failed to send message.",
          status: "error",
          duration: 1700,
          isClosable: true,
        });
        return;
      } finally {
        mutate();

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
        mx="4"
        isLoading={loading}
        size={isLargerThan460 ? "sm" : "xs"}
        disabled={!selectedItems.length}
        colorScheme={"messenger"}
      >
        Send Reminders
      </Button>

      {isValidating ? (
        <Center w="100%">
          <Spinner mx="auto" mt="12" size="xl" />;
        </Center>
      ) : !isValidating && data?.items?.length ? (
        <Box my="8" p="1" maxW={"100%"} overflowX={"auto"}>
          <Table
            size={isLargerThan460 ? "md" : "sm"}
            colorScheme="teal"
            mx="auto"
            w="98%"
          >
            <TableCaption fontWeight={"semibold"}>
              SELECT EVENTS TO SEND REMINDERS
            </TableCaption>

            <Thead>
              <Tr>
                <Th textAlign={"center"}>
                  <Flex align={"center"} justify={"space-between"}>
                    <Text>Checked </Text>
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
                      <Text>{i + 1}</Text>
                      <Checkbox
                        colorScheme={"green"}
                        isChecked={selectedItems.find((x) => x.id === row.id)}
                        value={JSON.stringify(row)}
                        onChange={onCheckBoxChange}
                      />
                    </Flex>
                  </Td>
                  <Td>{row.keywords}</Td>
                  <Td>{row.phone}</Td>
                  <Td>
                    <ShowMoreText
                      lines={3}
                      more="Read more"
                      less={"Read less"}
                      className="content-css"
                      anchorClass="show_more"
                      expanded={false}
                      truncatedEndingComponent={"... "}
                    >
                      {row.description}
                    </ShowMoreText>
                  </Td>
                  <Td>{row.startTime}</Td>
                  <Td>{row.endTime}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th textAlign={"center"}>
                  {" "}
                  <Flex align={"center"} justify={"space-between"}>
                    <Text>Checked </Text>
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
            </Tfoot>
          </Table>
          {feedback && <FeedBack feedback={feedback} />}
        </Box>
      ) : (
        <Center w="100%">
          <Heading m="8" size={"sm"}>
            No Events
          </Heading>
        </Center>
      )}
    </Box>
  );
};

export default EventList;
