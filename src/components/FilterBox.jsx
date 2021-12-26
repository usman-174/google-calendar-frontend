import { CloseIcon } from "@chakra-ui/icons";
import {
  Button, Center, FormLabel,
  Input, Text, useMediaQuery, Wrap,
  WrapItem
} from "@chakra-ui/react";
import React from "react";

const FilterBox = ({
  setFilter,
  setStartDate,
  setEndDate,
  filter,
  endDate,
  startDate,
  filterEvents,
}) => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");

  return (
    <Center>

    <Wrap
      spacing="15px"
      // bg="##f9f9f9"
      p="2"
      my="2"
    >
      
      <WrapItem verticalAlign={"center"}>
        <FormLabel fontSize={isLargerThan460? "md":"sm"}>From</FormLabel>
        <Input
          type="datetime-local"
          name="startDate"
          onChange={(e) => {
            if (!e.target.value && !endDate) {
              setFilter(false);
            }
            return setStartDate(e.target.value);
          }}
          value={startDate}
        />
      </WrapItem>
      <WrapItem verticalAlign={"center"}>
        <FormLabel fontSize={isLargerThan460? "md":"sm"}>To</FormLabel>

        <Input
          type="datetime-local"
          name="endDate"
          onChange={(e) => {
            if (!e.target.value && !startDate) {
              setFilter(false);
            }
            return setEndDate(e.target.value);
          }}
          value={endDate}
        />
      </WrapItem>
   <WrapItem>
        <Button
          disabled={!endDate && !startDate}
          my="2"
          onClick={filterEvents}
          mx="auto"
          size={isLargerThan460? "md":"sm"}
          variant={"solid"}
          colorScheme={"teal"}
        >
          Apply Filter
        </Button>
</WrapItem>

      {filter && (
        <WrapItem>
          <Text
            _hover={{ textColor: "teal", textDecoration: "underline" }}
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
        </WrapItem>
      )}
    {/* <WrapItem verticalAlign={"center"}>
        <Button my="2" mx={"4"} colorScheme={"telegram"}>
          <AddIcon mr="1" /> Create an Event
        </Button>
      </WrapItem> */}
      {/* FILTER END HERE */}
    </Wrap>
    </Center>
  );
};

export default FilterBox;
