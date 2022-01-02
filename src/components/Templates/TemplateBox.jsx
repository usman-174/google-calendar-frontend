import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel, HStack,
  Input,
  Select,
  Spinner,
  Tag,
  TagLabel,
  Textarea,
  useMediaQuery,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import CreateTemplate from "./CreateTemplate";
import DeleteAlert from "./DeleteAlert";
import EditTemplate from "./EditTemplate";

const TemplateBox = () => {
  const { data: templatesList, isValidating, error } = useSWR("/templates/all");
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const toast = useToast();

  const [template, setTemplate] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [keywords, setkeywords] = useState([]);

  const setTemplateById = (id) => {
    const temp = templatesList?.find((temp) => temp.id === id);
    setTemplate(temp?.title || "");
  };
  const handleSentMessage = async()=>{
    try {
        const {data} =await axios.post("/message/",{
          number:phone,message
        })
        if(data?.message){
          toast({
            title: data.message || "Message Sent",
            status: "success",
            duration: 1500,
            isClosable: true,
          });
          return
        }
    } catch (error) {
      toast({
        title: error?.response.data.error || "Failed to send message.",
        status: "error",
        duration: 1700,
        isClosable: true,
      });
      return
    }
  }
  useEffect(() => {
    const foundTemplates = templatesList?.find(
      (temp) => temp?.title === template
    );

    if (!message || message !== foundTemplates?.message) {
      setMessage(foundTemplates?.message);
      
    }
    if(!keywords || keywords !== foundTemplates?.keywords){
      setkeywords(
        foundTemplates?.keywords
      );
    }
    if (!templatesList?.find((temp) => temp.id === templateId)) {
      setTemplate("");
      setTemplateId("");
      setMessage("");
    }

    // eslint-disable-next-line
  }, [template, setTemplate, setTemplateId, templateId,templatesList]);

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
  if (isValidating && !templatesList) {
    return (
      <Center w="100%">
        <Spinner mx="auto" mt="10" size="xl" />;
      </Center>
    );
  }
  return (
    <Box shadow={"sm"} mt="8" rounded={"sm"}>
      {/* <Heading
        my="5"
        size={isLargerThan460 ? "lg" : "md"}
        textColor={"teal.800"}
        textAlign={"center"}
      >
        Send Message
      </Heading> */}
      <Box
        spacing={isLargerThan460 ? "10px" : "5px"}
        mx={"auto"}
        mb={isLargerThan460 ? null : "30px"}
        w={isLargerThan460 ? "60%" : "90%"}
        p="2"
        textAlign={"center"}
      >
        {/* SELECT ITEM */}
        <FormControl d="flex" alignItems={"center"}>
          <FormLabel
            fontSize={isLargerThan460 ? "md" : "sm"}
            htmlFor="template"
          >
            Template
          </FormLabel>
          <Select
            placeholder={
              templatesList?.length
                ? template
                  ? `Selected "${template}"`
                  : `Select a template`
                : "No Templates available"
            }
            value={template}
            onChange={(e) => {
              if (!e.target.value) {

                setMessage("");
                return;
              }
              if (e.target.value === templateId) {
                setTemplateId("");
                setTemplate("");
                return;
              }
              setTemplateById(e.target.value);
              setTemplateId(e.target.value);
            }}
            size={isLargerThan460 ? "md" : "sm"}
          >
            {(templatesList || [])?.map((temp) => (
              <option
                value={temp.id}
                className={temp.id}
                key={Math.random(8 * 930)}
                style={{
                  color: temp.id === templateId ? "#2C7A7B" : null,
                  fontWeight: temp.id === templateId ? "bolder" : null,
                }}
              >
                {temp.title}
              </option>
            ))}
          </Select>
        </FormControl>
        <HStack justify={"center"} align={"center"} spacing={4}>
          {keywords?.map((word) => (
            <Box  key={word}>
              <Tag
                p="2"
                m="2"
                rounded={"md"}
                color={"MenuText"}
                size={"ls"}
                variant="outline"
                colorScheme="teal"
              >
                <TagLabel>{word}</TagLabel>
                {/* <TagRightIcon as={MdSettings} /> */}
              </Tag>
            </Box>
          ))}
          )
        </HStack>
        {/* Message ITEM*/}
        <FormControl my="2" d="flex" alignItems={"center"}>
          <FormLabel fontSize={isLargerThan460 ? "md" : "sm"}>
            Message
          </FormLabel>
          <Textarea
            size={"lg"}
            value={message}
            disabled={!template}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          ></Textarea>
        </FormControl>
        {/* PHONE NUMBER */}
        <FormControl my="2" d="flex" alignItems={"center"}>
          <FormLabel fontSize={isLargerThan460 ? "md" : "sm"}>
            Phone_No
          </FormLabel>
          <Input
            type="tel"
            value={phone}
            disabled={!template}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormControl>

        {/* BUTTON */}
        <Button
          disabled={!template || !message || !phone}
          mx="auto"
          colorScheme={"teal"}
          my="4"
          onClick={handleSentMessage}
          size={isLargerThan460 ? "md" : "sm"}
        >
          Send Message
        </Button>

        {/* CREATE TEMPLATE */}

        <CreateTemplate />
        {/* Delete Template */}
        {template.length && templateId ? (
          <>
            <DeleteIcon
              display={"inline-block"}
              color="red.400"
              _hover={{ textColor: "red.600" }}
              onClick={() => setIsOpen(true)}
              mx="5"
              h="40px"
              w="40px"
              cursor={"pointer"}
            />

            <EditTemplate templateId={templateId} setTemplate={setTemplate} />
            <DeleteAlert
              onClose={onClose}
              isOpen={isOpen}
              setTemplateId={setTemplateId}
              cancelRef={cancelRef}
              templateId={templateId}
            />
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default TemplateBox;
