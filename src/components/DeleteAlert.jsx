import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import useSWR from 'swr';

const DeleteAlert = ({isOpen,cancelRef,onClose,templateId}) => {
    const { data:templateList,mutate} = useSWR(
        "/templates/all"
      );
  const toast = useToast();

    const HandleDelete = async()=>{
        try {
            
            const {data} = await axios.delete(`/templates/delete/${templateId}`)
            if(data?.message){
                toast({
                    title:  "Template Deleted",
                    status: "success",
                    duration: 1600,
                    isClosable: true,
                  });
                  onClose()
                  mutate(templateList.filter(temp=>temp.id!== templateId),true)
                  return
            }
        } catch (error) {
            toast({
                title: error.message || "Failed to delete the template",
                status: "error",
                duration: 1600,
                isClosable: true,
              });
        } 
    }
    return (
        <>
       
        <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Template?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={HandleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
        </>
    )
}

export default DeleteAlert
