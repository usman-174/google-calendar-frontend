import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  Textarea,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

function EditTemplate({ templateId, setTemplate }) {
  const { data: templatesList, mutate } = useSWR("/templates/all");
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState(
    templatesList?.find((temp) => temp.id === templateId)?.title
  );
  const [tag, setTag] = useState("");
  const [list, setList] = useState(
    templatesList?.find((temp) => temp.id === templateId)?.keywords
  );
  const [message, setMessage] = useState(
    templatesList?.find((temp) => temp.id === templateId)?.message
  );

  const btnRef = useRef();
  const toast = useToast();
  const handleSubmit = async () => {
    const options = {};
    if (
      message ===
        templatesList?.find((temp) => temp.id === templateId)?.message
         &&
      title === templatesList?.find((temp) => temp.id === templateId)?.title
       &&
       list === templatesList?.find((temp) => temp.id === templateId)?.keywords
    ) {
      toast({
        title: "Please change the details",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (
      message !== templatesList?.find((temp) => temp.id === templateId)?.message
    ) {
      options.message = message;
    }
    if (
      title !== templatesList?.find((temp) => temp.id === templateId)?.title
    ) {
      options.title = title;
    }
     if (
      list !== templatesList?.find((temp) => temp.id === templateId)?.keywords
    ) {
      options.keywords = list;
    }
    
    try {
      const { data } = await axios.put(
        "/templates/edit/" + templateId,
        options
      );
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
          title: "Template Edited",
          status: "success",
          duration: 1600,
          isClosable: true,
        });
        setTemplate(data.title);
        mutate();
        onClose();
        return;
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
    setList([...list, tag.replace(" ","_")]);
    setTag("");
  };
  useEffect(() => {
    if (templatesList?.length) {
      const found = templatesList?.find((temp) => temp.id === templateId)
      setTitle(found?.title);
      setMessage(
        found?.message
      );
      setList(found?.keywords)
    }
  }, [templatesList, setTemplate, templateId]);
  return (
    <>
            <Tooltip hasArrow label='Edit Template'>
      <EditIcon
        display={"inline-block"}
        color="steelblue"
        _hover={{ textColor: "teal.600" }}
        ref={btnRef}
        onClick={onOpen}
        mx="5"
        
        h="40px"
        w="40px"
        cursor={"pointer"}
        />
        </Tooltip>

      <Box my="5">
        <Drawer
         size={isLargerThan460 ? "lg" : "md"}
          isOpen={isOpen}
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
              fontSize={isLargerThan460 ? "2xl" : "xl"}
            >
              Edit Template
            </DrawerHeader>

            <DrawerBody>
              <FormLabel
               
                fontSize={isLargerThan460 ? "md" : "sm"}
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
               
                fontSize={isLargerThan460 ? "md" : "sm"}
              >
                Message
              </FormLabel>
              <Textarea
                size={isLargerThan460 ? "md" : "sm"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type Message here..."
              />
              <FormLabel
               
                fontSize={isLargerThan460 ? "md" : "sm"}
              >
                Keywords
              </FormLabel>
              <Input
                name="tag"
                w={"50%"}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Type Keyword here..."
              />

              <Button
                onClick={AddtoList}
                fontSize={"sm"}
                m="2"
  
                disabled={tag.length < 4}
              >
                Add
              </Button>
              <HStack spacing={4} my="3">
                {list?.map((keyword) => (
                  <Tag
                    mx="2"
                    variant="outline"
                    size="lg"
                    key={keyword}
                    colorScheme="blue"
                  >
                    <TagLabel>{keyword}</TagLabel>
                    <TagRightIcon
                      onClick={() => {
                        
                          const filtered = list.filter(
                            (word) => word !== keyword
                          );
                          return setList(filtered);
                        
                      }}
                      _hover={{ color: "red" }}
                      cursor={"pointer"}
                      as={DeleteIcon}
                    />
                  </Tag>
                ))}{" "}
              </HStack>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} colorScheme="teal">
                Update
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
}
export default EditTemplate;
