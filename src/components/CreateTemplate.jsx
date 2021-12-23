import {
  Box, Button, Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay, FormLabel, Input, Text, Textarea, useDisclosure, useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import useSWR from "swr";

function CreateTemplate() {
  const { data: templatesList, isValidating,mutate } = useSWR(
    "/templates/all"
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const btnRef = useRef();
  const toast = useToast();
  const handleSubmit = async () => {
    if (!title || !message) {
      toast({
        title: "Please provide required info.",
        status: "error",
        duration: 1800,
        isClosable: true,
      });
      return;
    }
    if (message.length < 30) {
      toast({
        title: "Message length must be greater than 30 Characters.",
        status: "error",
        duration: 1800,
        isClosable: true,
      });
      return;
    }
    try {
      const { data } = await axios.post("/templates/new", {
        title,
        message,
      });
      if (data?.error) {
        toast({
          title: data.error,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      if (data?.title) {
        toast({
          title: "Template Added",
          status: "success",
          duration: 1600,
          isClosable: true,
        });
        if(!isValidating && templatesList?.length){

            mutate([...templatesList,data],false);
            onClose();
            return
        }
      }
    } catch (error) {
      toast({
        title: error?.message || "Please try later",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Box textAlign={"right"} >
      <Text
      as="span"
       align="right"
        ml="auto"
        color="red.500"
        cursor={"pointer"}
        fontWeight={"semibold"}
        ref={btnRef}
        onClick={onOpen}
        _hover={{ textColor: "teal", textDecoration: "underline" }}
      >
        Add Template?
      </Text>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader mx="auto">Add a Template</DrawerHeader>

          <DrawerBody>
            <FormLabel fontWeight={"semibold"} fontSize={"lg"}>
              Title
            </FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Type Title here..."
            />
            <FormLabel my="2" fontWeight={"semibold"} fontSize={"lg"}>
              Message
            </FormLabel>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type Message here..."
            />
            {message.length < 30 && (
              <Text fontSize={"sm"} textColor={"red.500"} m="2">
                {" "}
                Atleast {30 - message.length} more words{" "}
              </Text>
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} colorScheme="teal">
              Add
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default CreateTemplate;
