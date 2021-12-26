import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Spinner, Textarea,
  useMediaQuery,
  useToast,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import CreateTemplate from "./CreateTemplate";
import DeleteAlert from "./DeleteAlert";

const TemplateBox = () => {
  const { data: templatesList, isValidating,error } = useSWR("/templates/all");
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const toast = useToast()
  const [isOpen, setIsOpen] = useState(false);

  const [template, setTemplate] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  const setTemplateById = (id) => {
    const temp = templatesList?.find((temp) => temp.id === id);
    setTemplate(temp?.title|| "");
  };
  
  useEffect(() => {
    const messageToSet = templatesList?.find(
      (temp) => temp?.title === template
    )?.message;
    if ((message && template) && message !== messageToSet) {
      setMessage(messageToSet);
    }
    if (!templatesList?.find((temp) => temp.id === templateId)) {
      setTemplate("");
      setTemplateId("");
      setMessage("");
    }
    // eslint-disable-next-line
  }, [template,setTemplateId, templatesList]);

  
  useEffect(() => {
    if (error && !isValidating && !templatesList) {
      toast({
        title: error?.error || "Failed to Fetch the Templates",
        status: "error",
        duration: 1600,
        isClosable: true,
      });
    }

    // eslint-disable-next-line
  }, [error]);
  if (isValidating &&  !error) {
    return (
      <Center w="100%">
        <Spinner mx="auto" mt="10" size="xl" />;
      </Center>
    );
  }
  return (
    <Box  shadow={"sm"}
    borderTop={"1px"}
    borderColor={"teal.600"}
mt="5"
    rounded={"sm"}>
       <Heading mt={isLargerThan460 ?"8":2} size={isLargerThan460?"lg":"md"}textColor={"teal.600"} textAlign={"center"}>
        Send Message
      </Heading>
      <Wrap spacing={isLargerThan460? "10px":"5px"}
        align={"center"}
       
        mb={isLargerThan460 ? null : "30px"}
        w="full"
        p="2"
        textAlign={"center"}
      >
        {/* SELECT ITEM */}
        <WrapItem>
          <FormControl d="flex" alignItems={"center"}>
            <FormLabel fontSize={isLargerThan460? "md":"sm"} htmlFor="template" >
              Template
            </FormLabel>
            <Select
              placeholder={
                template ? `Selected "${template}"` : `Select a template`
              }
              value={template}
              onChange={(e) => {
                if (!e.target.value) {
                  setMessage("");
                  return
                }if(e.target.value === templateId){
                  setTemplateId("");
                  return
                }
                setTemplateById(e.target.value);
                setTemplateId(e.target.value);
              }}
              size={isLargerThan460? "md":"sm"}
            >
              {templatesList?.map((temp) => (
                <option
                  value={temp.id}
                  className={temp.id}
                  key={Math.random(8 * 930)}
                  style={{color:temp.id === templateId ? "#2C7A7B":null,
                fontWeight: temp.id === templateId ? "bolder":null,
                }}
                >
                 {temp.title} 
                </option>
              ))}
            </Select>
            
          </FormControl>
        </WrapItem>

        {/* Message ITEM*/}
        <WrapItem>
          <FormControl my="2" d="flex" alignItems={"center"}>
            <FormLabel fontSize={isLargerThan460? "md":"sm"}>Message</FormLabel>
            <Textarea
              size={"lg"}
              value={message}
              disabled={!template}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            ></Textarea>
          </FormControl>
        </WrapItem>
        {/* PHONE NUMBER */}
        <WrapItem>
          <FormControl my="2" d="flex" alignItems={"center"}>
            <FormLabel fontSize={isLargerThan460? "md":"sm"}>Phone_No</FormLabel>
            <Input
              type="tel"
              value={phone}
              disabled={!template}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormControl>
        </WrapItem>

        {/* BUTTON */}
        <WrapItem>
          <Button
            disabled={!template || !message || !phone}
            mx="auto"
            colorScheme={"teal"}
            size={isLargerThan460? "md":"sm"}
          >
            Send Message
          </Button>
        </WrapItem>
        
        {/* CREATE TEMPLATE */}
        <WrapItem>

        <CreateTemplate />
        </WrapItem>
        {/* Delete Template */}
        <WrapItem>
        {template.length && templateId ? (
              <>
                <DeleteIcon
                  display={"inline-block"}
                  color="red.400"
                  _hover={{ textColor: "red.600" }}
                  onClick={() => setIsOpen(true)}
                  mx="5"
                  h="20px"
                  w="20px"
                  cursor={"pointer"}
                />
                <DeleteAlert
                  onClose={onClose}
                  isOpen={isOpen}
                  cancelRef={cancelRef}
                  templateId={templateId}
                />
              </>
            ) : null}
        </WrapItem>
      </Wrap>
    </Box>
  );
};

export default TemplateBox;
