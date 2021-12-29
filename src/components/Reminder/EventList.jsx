import { Box, Center, Heading, Spinner, useMediaQuery } from "@chakra-ui/react";
import { DataGrid } from "@material-ui/data-grid";
import React, { useState } from "react";
import useGetEvent from "../../hooks/useGetEvents";

const EventList = () => {
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

  const { isValidating, data } = useGetEvent();
  const [selectedItems, setSelectedItems] = useState([]);
  const columns = [
    { field: "id", headerName: "ID", align: "center", width: 200 },
    {
      field: "phone",
      headerName: "Phone Number",
      width: 300,
      align: "right",
    },

    {
      field: "description",
      headerName: "Description",
      sortable: false,
      align: "right",
      width: 500,
    },
    {
      field: "startTime",
      headerName: "Starting Time",
      sortable: false,
      align: "center",
      width: 220,
    },
  ];

  const rows = data?.items?.map((event) => ({
    id: event?.id,
    phone: event?.summary,
    firstName: "Jon",
    age: 35,
    description: event?.description.split(" || ")[0],
    startTime:
      new Date(event.start?.dateTime).toDateString() +
      "at" +
      new Date(event.start?.dateTime).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
  }));
  const handlerowSelect = (ids) => {
    setSelectedItems([])
    let foundItem;
    let items = []
    ids.forEach((idx) => {
      foundItem = data?.items?.find(({ id }) => id === idx);
      items.push(foundItem)
      setSelectedItems(items);
    });
  };

  //   IF LOADING
  if (isValidating) {
    <Center w="100%">
      <Spinner mx="auto" mt="10" size="xl" />;
    </Center>;
  }
  return (
    <Box m={isLargerThan460 ? "5" : "0"} p="1">
      {data?.items ? (
        <>
          {" "}
          <Heading my="4" textAlign={"center"} color={"teal.700"}>
            Event List
          </Heading>
          {JSON.stringify(selectedItems)}
          <Box
            mx="auto"
            bg="gray.50"
            h={isLargerThan800 ? "40vw" : isLargerThan460 ? "75vw" : "90vw"}
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
        </>
      ) : (
        <Center w="100%">
          <Heading m="5" size={"sm"}>
            {" "}
            No Events
          </Heading>
        </Center>
      )}
    </Box>
  );
};

export default EventList;
