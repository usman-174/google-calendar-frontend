import { EditIcon } from "@chakra-ui/icons";
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
    Input, Textarea,
    useDisclosure,
    useMediaQuery,
    useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

function EditTemplate({ templateId ,setTemplate}) {
  const {
    data: templatesList,
    mutate,
  } = useSWR("/templates/all");
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState(
    templatesList?.find((temp) => temp.id === templateId)?.title
  );
  const [message, setMessage] = useState(
    templatesList?.find((temp) => temp.id === templateId)?.message
  );

  const btnRef = useRef();
  const toast = useToast();
  const handleSubmit = async () => {
    const options = {};
    if( message !== templatesList?.find((temp) => temp.id === templateId)?.message && title !== templatesList?.find((temp) => temp.id === templateId)?.title){
      toast({
              title: "Please change the details",
              status: "error",
              duration: 2000,
              isClosable: true,
            });
            return
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
        setTemplate(data.title)
        mutate()
        onClose()
        return
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
  useEffect(()=>{
      if(templatesList?.length){

          setTitle(
              templatesList?.find((temp) => temp.id === templateId)?.title
            )
            setMessage(
              templatesList?.find((temp) => temp.id === templateId)?.message
            )
      }
  },[templatesList,setTemplate,templateId])
  return (
    <>
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

      <Box my="5">
        <Drawer
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
