import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay, FormLabel,
  HStack,
  Input,
  Select,
  Tag,
  TagLabel,
  Text,
  Textarea,
  useDisclosure,
  useMediaQuery,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useSWR from "swr";
import useGetEvent from "../../hooks/useGetEvents";

function CreateEvent() {
  const { isValidating, mutate } = useGetEvent();
  const { data: templatesList } = useSWR("/templates/all");
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [template, setTemplate] = useState("");
  const [keywords, setkeywords] = useState([]);
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
    if (!keywords?.length) {
      toast({
        title: "Please select keywords from a template.",
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
    let wordString = "";
    keywords.forEach((word) => {
      wordString += " " + word;
    });

    try {
      const { data } = await axios.post("/events/new", {
        description: description + " ||" + wordString,
        summary: phone,
        startTime: startDate,
        endTime: endDate,
      });
      if (data?.success) {
        setDescription("");
        setEndDate("");
        setStartDate("");
        setPhone("");
        toast({
          title: "Event Created",
          status: "success",
          duration: 1600,
          isClosable: true,
        });
        mutate();
        if (!isValidating) {
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
  useEffect(() => {
    if (template) {
      setkeywords(
        templatesList.find((temp) => temp.title === template)?.keywords
      );
    }
  }, [setTemplate, setkeywords, templatesList, template, keywords]);
  return (
    <>
     <Button
        variant={"outline"}
        size={isLargerThan460 ? "sm" : "xs"}
        disabled={isValidating}
        colorScheme={"twitter"}
        textAlign={"center"}
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
            fontSize={isLargerThan460 ? "2xl" : "xl"}
          >
            Create an Event
          </DrawerHeader>

          <DrawerBody>
            <FormLabel
              
              fontSize={isLargerThan460 ? "md" : "sm"}
            >
              From
            </FormLabel>

            <Input
              type="datetime-local"
              name="endDate"
              
              w={"sm"}
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
            <FormLabel
              
              fontSize={isLargerThan460 ? "md" : "sm"}
            >
              To
            </FormLabel>

            <Input
              type="datetime-local"
              name="endDate"
              w={"sm"}
        
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
            />
            <FormLabel
              
              fontSize={isLargerThan460 ? "md" : "sm"}
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
              
              fontSize={isLargerThan460 ? "md" : "sm"}
            >
              Set Keywords
            </FormLabel>
            <Select
              placeholder={"Select a template"}
              value={template}
              onChange={(e) => {
                setTemplate(e.target.value);
              }}
             w="50%"
            >
              {templatesList?.map((temp) => (
                <option
                  value={temp.title}
                  className={temp.title}
                  key={Math.random(8 * 930)}
                  style={{
                    color: temp.title === template ? "#2C7A7B" : null,
                    fontWeight: temp.title === template ? "bolder" : null,
                  }}
                >
                  {temp.title}
                </option>
              ))}
            </Select>
            <HStack spacing={4}>
              {keywords.map((word) => (
                <div key={word}>
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
                </div>
              ))}
              )
            </HStack>
            <FormLabel
              my="2"
              
              fontSize={isLargerThan460 ? "md" : "sm"}
            >
              Phone No
            </FormLabel>
            
            <PhoneInput
              value={phone}
              placeholder="Enter formated phone number"
              countryCodeEditable={true}
              enableSearch={true}
              onChange={(_,__, ___, formattedValue) => setPhone(formattedValue.replace("-",""))
              }
            />
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              disabled={isValidating}
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isValidating}
              colorScheme="teal"
            >
              Create
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default CreateEvent;