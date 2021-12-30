import { Box, Button, Center, Heading, Spinner, useMediaQuery } from "@chakra-ui/react";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import useGetEvent from "../../hooks/useGetEvents";

const EventList = () => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

  const { isValidating, data } = useGetEvent();
  const [selectedItems, setSelectedItems] = useState([]);
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
      width: 230,
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
      width: 204,
    },
    {
      field: "endTime",
      headerName: "Ending Time",
      sortable: true,
      align: "center",
      width: 204,
    },
  ];

  const rows = data?.items?.map((event) => ({
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

  //   IF LOADING
  useEffect(()=>{
    setSelectedItems([])
  },[])
  return (
    <Box m={isLargerThan460 ? "5" : "0"} p="1">
      <Heading my="6" textAlign={"center"} color={"teal.700"}>
        Event List
      </Heading>
      <Button my="5" mx="4" disabled={!selectedItems.length 
      } colorScheme={"facebook"}>Send Reminders</Button>
      {isValidating ? (
        <Center w="100%">
          <Spinner mx="auto" mt="12" size="xl" />;
        </Center>
      ) : 
      (!isValidating && data?.items?.length) ? (
        <Box
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
