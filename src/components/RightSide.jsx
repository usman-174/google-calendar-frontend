import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Spinner,
  Textarea,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import DeleteAlert from "./DeleteAlert";
import CreateTemplate from "./CreateTemplate";

const RightSide = () => {
  const { data: templatesList, isValidating } = useSWR(
    "/templates/all"
  );
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const [template, setTemplate] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  const setTemplateById = (id) => {
    const temp = templatesList?.find((temp) => temp.id === id);
    setTemplate(temp.title);
  };

  useEffect(() => {
    console.log("Useeffect started");
    const messageToSet = templatesList?.find(
      (temp) => temp?.title === template
    )?.message;
    if (template && message !== messageToSet) {
      setMessage(messageToSet);
    }
    if(!templatesList?.find(temp=>temp.id===templateId)){
      console.log("Deleted temp not found");
      setTemplate("")
      setTemplateId("")
      setMessage("")
    }
    // eslint-disable-next-line
  }, [template,templatesList]);

  if (isValidating && !templatesList) {
    return (
      <Center w="100%">
        <Spinner mx="auto" mt="10" size="xl" />;
      </Center>
    );
  }

  return (
    <Container centerContent p="1">
      {/* MESSAGE */}
      <Box
        shadow={"md"}
        rounded={"sm"}
        mb={isLargerThan460 ? null : "30px"}
        w={isLargerThan460 ? "80%" : "98%"}
        p="2"
        textAlign={"center"}
      >
        <Heading mb="4">SEND MESSAGE</Heading>
        <FormControl d="flex" alignItems={"center"}>
          <FormLabel htmlFor="template" fontWeight={"semibold"}>
            Template
          </FormLabel>
          <Select
            placeholder={template ? `Selected "${template}"`:`Select a template`}
            value={template}
            onChange={(e) => {
              if (!e.target.value) {
                setMessage("");
              }
              setTemplateById(e.target.value);
              setTemplateId(e.target.value);
            }}
          >
            {templatesList?.map((temp) => (
              <option
                value={temp.id}
                className={temp.id}
                key={Math.random(8 * 930)}
              >
                {temp.title}
              </option>
            ))}
          </Select>
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
        </FormControl>
        <FormControl my="2" d="flex" alignItems={"center"}>
          <FormLabel fontWeight={"semibold"}>Message</FormLabel>
          <Textarea
            size={"lg"}
            value={message}
            disabled={!template}
            onChange={(e) =>{ setMessage(e.target.value)}}
          ></Textarea>
        </FormControl>
        <FormControl my="2" d="flex" alignItems={"center"}>
          <FormLabel fontWeight={"semibold"}>Phone_No</FormLabel>
          <Input
            w="sm"
            type="tel"
            value={phone}
            disabled={!template}

            onChange={(e) => setPhone(e.target.value)}
          />
        </FormControl>
        <Button disabled={!template || !message || !phone} mx="auto" colorScheme={"teal"}>
          Send Message
        </Button>
        {/* CREATE TEMPLATE */}
        <CreateTemplate />
      </Box>
    </Container>
  );
};

export default RightSide;
