import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import useSWR from 'swr';

const DeleteAlert = ({isOpen,cancelRef,onClose,templateId,setTemplateId}) => {
    const { data:templateList,mutate} = useSWR(
        "/templates/all"
      );
  const toast = useToast();

    const HandleDelete = async()=>{
        try {
            
            const {data} = await axios.delete(`/templates/delete/${templateId}`)
            if(data?.success){
                toast({
                    title:  "Template Deleted",
                    status: "success",
                    duration: 1600,
                    isClosable: true,
                  });
                  setTemplateId("")
                  mutate(templateList.filter(temp=>temp.id!== templateId),true)
                  onClose()
                  return
            }
        } catch (error) {
            toast({
                title: error?.response?.data?.error || "Failed to delete the template",
                status: "error",
                duration: 1600,
                isClosable: true,
              });
              return
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
