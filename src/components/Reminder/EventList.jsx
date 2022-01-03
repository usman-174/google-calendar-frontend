import {
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  useMediaQuery,
  useToast
} from "@chakra-ui/react";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import FeedBack from "./FeedBack";
const EventList = ({data,isValidating,mutate}) => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

  const toast = useToast();
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null);
  const columns = [
    { field: "id", headerName: "ID", align: "left", width: 150 },
    {
      field: "phone",
      headerName: "Phone Number",
      width: 140,
      align: "left",
    },
    {
      field: "keywords",
      headerName: "Keywords",
      width: 180,
      sortable: false,

      align: "left",
    },

    {
      field: "description",
      headerName: "Description",
      align: "center",
      width: 520,
    },
    {
      field: "startTime",
      headerName: "Starting Time",
      align: "center",
      width: 200,
    },
    {
      field: "endTime",
      headerName: "Ending Time",
      sortable: true,
      align: "center",
      width: 200,
    },
  ];

  const rows = data?.items?.filter(item=>!item.description.includes("#reminder_sent")).map((event) => ({
    id: event?.id,
    phone: event?.summary,
    keywords: event?.description
      .split(" || ")[1]
      .replace(" ", " , ")
      .toUpperCase(),
    description: event?.description.split(" || ")[0],
    startTime: new Date(event.start?.dateTime).toLocaleString(),
    endTime: new Date(event.end?.dateTime).toLocaleString(),
  }));
  const handlerowSelect = (ids) => {
    setSelectedItems([]);
    let foundItem;
    let items = [];
    ids.forEach((idx) => {
      foundItem = data?.items?.find(({ id }) => id === idx);
      items.push(foundItem);
      setSelectedItems(items);
    });
  };
  const handleSendReminders = async () => {
    if (selectedItems.length) {
      try {
        setLoading(true)
        const { data } = await axios.post("/message/bulk", {
          selectedEvents: selectedItems,
        });
        setFeedback(data);
        return;
      } catch (error) {
        setFeedback(null);
        toast({
          title: error?.response.data.error || "Failed to send message.",
          status: "error",
          duration: 1700,
          isClosable: true,
        });
        return;
      }finally{
  mutate();

        setLoading(false)
      }
    }
  };
  //   IF LOADING
  useEffect(() => {
    setSelectedItems([]);
  }, []);
  return (
    <Box mx={isLargerThan460 ? "5" : "0" }mt="8" >
     
      <Button
        onClick={handleSendReminders}
        my="2"
        mx="4"
        isLoading={loading}
        p={isLargerThan460 ? "4" : "2"}
        disabled={!selectedItems.length}
        colorScheme={"messenger"}
      >
        Send Reminders
      </Button>
      
      {isValidating ? (
        <Center w="100%">
          <Spinner mx="auto" mt="12" size="xl" />;
        </Center>
      ) : !isValidating && data?.items?.length ? (
        <>
        <Box
        my="1"
          mx="auto"
          bg="gray.50"
          h={isLargerThan800 ? "30vw" : isLargerThan460 ? "75vw" : "90vw"}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            onSelectionModelChange={handlerowSelect}
            checkboxSelection
            rowsPerPageOptions={[10, 15, 20, 25]}
            disableSelectionOnClick
            />
        </Box>
       {feedback && <FeedBack feedback={feedback} />
       
       }
            </>
      ) : (
        <Center w="100%">
          <Heading m="8" size={"sm"}>
            No Events
          </Heading>
        </Center>
      )}
    </Box>
  );
};

export default EventList;
