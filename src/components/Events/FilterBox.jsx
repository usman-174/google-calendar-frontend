import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button, Flex, FormLabel,
  Input,
  Text,
  useMediaQuery
} from "@chakra-ui/react";
import React from "react";

const FilterBox = ({
  setFilter,
  setStartDate,
  setEndDate,
  filter,
  endDate,
  startDate,
  filterEvents,search
}) => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");

  return (
    <Box w="full">
      <Flex
        p="2"
        align={"center"}
        justify={"center"}
        flexDirection={isLargerThan460 ? "row" : "column"}
        my={isLargerThan460 ? "4" : "0"}
      >
        <Flex
          mx={isLargerThan460 ? "5" : "0"}
          align={"center"}
          flexDirection={isLargerThan460 ? "row" : "column"}        >
          <FormLabel fontSize={isLargerThan460 ? "md" : "sm"}>From</FormLabel>
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
        </Flex>
        <Flex
          mx={isLargerThan460 ? "5" : "0"}
          my={isLargerThan460 ? "0" : "3"}

          align={"center"}flexDirection={isLargerThan460 ? "row" : "column"}
        >
          <FormLabel fontSize={isLargerThan460 ? "md" : "sm"}>To</FormLabel>

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
        </Flex>
        <Box>
          <Button
            disabled={(!endDate && !startDate) || search}
            onClick={filterEvents}
            size={isLargerThan460 ? "md" : "sm"}
            variant={"solid"}
            colorScheme={"teal"}
          >
            Apply Filter
          </Button>
        </Box>

        {!search  && filter && (
          <Box m="2">
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
          </Box>
        )}
      {/* CREATE BUTTOn */}
        {/* <Box >
        <Button my="2" mx={"4"} colorScheme={"telegram"}>
          <AddIcon mr="1" /> Create an Event
        </Button>
      </Box> */}

        {/* FILTER END HERE */}
      </Flex>
    </Box>
  );
};

export default FilterBox;
