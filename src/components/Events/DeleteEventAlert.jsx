import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    useToast,
  } from "@chakra-ui/react";
  import axios from "axios";
  import React from "react";
import { useSWRConfig } from "swr";
  
  const DeleteEventAlter = ({
    isOpen,
    cancelRef,
    onClose,
    eventId
  }) => {
    const toast = useToast();
    const { mutate } = useSWRConfig();
  
    const deleteEvent = async () => {
        try {
          const { data } = await axios.delete("/events/delete/" + eventId);
          if (data?.success) {
            toast({
              title: "Event Deleted",
              status: "success",
              duration: 1500,
              isClosable: true,
            });
            mutate("/events/all");
            onClose();
            return;
          }
        } catch (error) {
          toast({
            title: error?.response?.data?.error || "Failed to delete the Event",
            status: "error",
            duration: 1600,
            isClosable: true,
          });
          onClose();
        return;
        }
      };
    return (
      <>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Template?
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={deleteEvent} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  };
  
  export default DeleteEventAlter;
  