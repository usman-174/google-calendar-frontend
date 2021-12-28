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
  HStack,
  Input,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  Textarea,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import axios from "axios";
import { useRef, useState } from "react";
import useSWR from "swr";

function CreateTemplate() {
  const {
    data: templatesList,
    isValidating,
    mutate,
  } = useSWR("/templates/all");
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [tag, setTag] = useState("");
  const [list, setList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");
  const btnRef = useRef();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!title || !message || !list.length) {
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
        message,keywords:list
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
        if (!isValidating && templatesList?.length) {
          mutate([...templatesList, data], false);
          onClose();
          return;
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
  const AddtoList = () => {
    setList([...list, tag]);
    setTag("");
  };
 
  return (
    <Box my="4">
      <Text
        color="red.500"
        textAlign={"center"}
        cursor={"pointer"}
        fontWeight={"semibold"}
        ref={btnRef}
        onClick={onOpen}
        fontSize={isLargerThan460 ? "md" : "xs"}
        _hover={{ textColor: "teal", textDecoration: "underline" }}
      >
        Add Template?
      </Text>
      <Drawer
        isOpen={isOpen}
        size={isLargerThan460 ? "lg" : "md"}
        placement="right"
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
            Add a Template
          </DrawerHeader>

          <DrawerBody>
            <FormLabel
              fontWeight={"semibold"}
              fontSize={isLargerThan460 ? "lg" : "md"}
            >
              Title
            </FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Type Title here..."
            />
            <FormLabel
              my="2"
              fontWeight={"semibold"}
              fontSize={isLargerThan460 ? "lg" : "md"}
            >
              Message
            </FormLabel>
            <Textarea
              size={isLargerThan460 ? "md" : "sm"}
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
            <FormLabel
              fontWeight={"semibold"}
              fontSize={isLargerThan460 ? "lg" : "md"}
            >
              Keywords
            </FormLabel>
            <Input
            name="tag"
              w="60%"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Type Keyword here..."
            />

            <Button onClick={AddtoList} mx="3" mb="1" disabled={tag.length < 4}>
              Add
            </Button>
           
          <HStack spacing={4} my="3">{list?.map((keyword)=>
              
              <Tag mx="2" variant="outline" size="lg"  key={keyword}  colorScheme="blue">
                <TagLabel>{keyword}</TagLabel>
                <TagRightIcon onClick={()=>{
                  
                    const filtered = list.filter((word)=>word!==keyword)
                    return setList(filtered)
                  
                }}_hover={{color:"red"}} cursor={"pointer"} as={DeleteIcon} />
              </Tag>)}
            </HStack>
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
    </Box>
  );
}
export default CreateTemplate;
