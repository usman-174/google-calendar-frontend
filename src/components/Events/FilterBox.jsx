import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Text,
  useMediaQuery,
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
  search,
}) => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [isLargerThan708] = useMediaQuery("(min-width: 708px)");

  return (
    <Box w="full">
      <Flex
        p="2"
        align={"center"}
        justify={"center"}
        flexDirection={isLargerThan708 ? "row" : "column"}
        mt={isLargerThan460 ? "3" : "0"}
      >
        {/* FROM INPUT */}
        <Flex
          mx={isLargerThan460 ? "5" : "0"}
          my={isLargerThan708 ? 0 : 2}
          align={"center"}
          flexDirection={isLargerThan460 ? "row" : "column"}
        >
          <FormLabel fontSize={isLargerThan460 ? "sm" : "xs"}>From</FormLabel>
          <Input
            type="datetime-local"
            name="startDate"
            size={isLargerThan460 ? "sm" : "xs"}
            onChange={(e) => {
              if (!e.target.value && !endDate) {
                setFilter(false);
              }
              return setStartDate(e.target.value);
            }}
            value={startDate}
          />
        </Flex>
        {/* TO INPUT */}
        <Flex
          mx={isLargerThan460 ? "5" : "0"}
          my={isLargerThan708 ? 0 : 2}
          align={"center"}
          flexDirection={isLargerThan460 ? "row" : "column"}
        >
          <FormLabel fontSize={isLargerThan460 ? "sm" : "xs"}>To</FormLabel>

          <Input
            type="datetime-local"
            name="endDate"
            size={isLargerThan460 ? "sm" : "xs"}
            onChange={(e) => {
              if (!e.target.value && !startDate) {
                setFilter(false);
              }
              return setEndDate(e.target.value);
            }}
            value={endDate}
          />
        </Flex>
        {/* APPLy BUTTON */}
        <Box>
          <Button
            disabled={(!endDate && !startDate) || search}
            onClick={filterEvents}
            size={isLargerThan460 ? "sm" : "xs"}
            variant={"solid"}
            colorScheme={"teal"}
          >
            Apply Filter
          </Button>
        </Box>

        {/* RESET FILET BUTTON */}
        {!search && filter && (
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
      </Flex>
    </Box>
  );
};

export default FilterBox;
