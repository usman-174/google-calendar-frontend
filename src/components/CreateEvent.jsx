import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  Text,
  Textarea,
  useDisclosure,
  useMediaQuery,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import PhoneInput from 'react-phone-number-input';
import useGetEvent from "../hooks/useGetEvents";

function CreateEvent() {
  const {  isValidating, mutate } = useGetEvent();
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const btnRef = useRef();
  const toast = useToast();
  const handleSubmit = async () => {
    if (!description || !phone) {
      toast({
        title: "Please provide all details of the Event.",
        status: "error",
        duration: 1800,
        isClosable: true,
      });
      return;
    }
    if (description.length < 10) {
      toast({
        title: "Description length must be greater than 10 Characters.",
        status: "error",
        duration: 1800,
        isClosable: true,
      });
      return;
    }
    if (!endDate) {
      toast({
        title: "Atleast provide End Date.",
        status: "error",
        duration: 1800,
        isClosable: true,
      });
      return;
    }
    try {
      const { data } = await axios.post("/events/new", {
        description,
        summary: phone,
        startTime: startDate,
        endTime: endDate,
      });
      if (data?.success) {
          setDescription("")
          setEndDate("")
          setStartDate("")
          setPhone("")
        toast({
          title: "Event Created",
          status: "success",
          duration: 1600,
          isClosable: true,
        });
        mutate();
        if(!isValidating){

            onClose();
        }
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.error || "Please try later",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  return (
    <Box my="5">
      <Button
        mx={isLargerThan460 ? null : "auto"}
        my={isLargerThan460 ? "5" : "2"}
        variant={"outline"}
        p="6"
        colorScheme={"twitter"}
        textAlign={isLargerThan460 ? "center" : "left"}
        ref={btnRef}
        onClick={onOpen}
      >
        CREATE EVENT
      </Button>
      <Drawer
        isOpen={isOpen}
        size={isLargerThan460 ? "lg" : "md"}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            mx="auto"
            textTransform={"uppercase"}
            fontSize={isLargerThan460 ? "xl" : "lg"}
          >
            Create an Event
          </DrawerHeader>

          <DrawerBody>
            <FormLabel
              fontWeight={"semibold"}
              fontSize={isLargerThan460 ? "lg" : "md"}
            >
              From
            </FormLabel>

            <Input
              type="datetime-local"
              name="endDate"
              w={isLargerThan460 ? "sm" : "md"}
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
            <FormLabel
              fontWeight={"semibold"}
              fontSize={isLargerThan460 ? "lg" : "md"}
            >
              To
            </FormLabel>

            <Input
              type="datetime-local"
              name="endDate"
              w={isLargerThan460 ? "sm" : "md"}
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
            />
            <FormLabel
              fontWeight={"semibold"}
              fontSize={isLargerThan460 ? "lg" : "md"}
            >
              Description
            </FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Type Title here..."
            />
            {description.length < 15 && (
              <Text fontSize={"sm"} textColor={"red.500"} m="2">
                {" "}
                Atleast {15 - description.length} more words{" "}
              </Text>
            )}
            <FormLabel
              my="2"
              fontWeight={"semibold"}
              fontSize={isLargerThan460 ? "lg" : "md"}
            >
              Phone No
            </FormLabel>
            <PhoneInput
              w={isLargerThan460 ? "sm" : "md"}
              value={phone}
              defaultCountry="US"
              onChange={setPhone}
              
              placeholder="Type Phone Number here..."
            />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" disabled={isValidating} mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isValidating} colorScheme="teal">
              Create
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
export default CreateEvent;
