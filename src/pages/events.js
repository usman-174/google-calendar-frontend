import { LoadingButton } from "@mui/lab";
import { Box, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { useEffect, useState } from "react";
import useGetEvent from "../hooks/useGetEvents";
import CreateEvent from "../components/events/CreateEvent"
import { DashboardLayout } from "../components/dashboard-layout";
import { EventCard } from "../components/events/EventCard";
import { EventListToolbar } from "../components/events/EventListToolbar";
const Events = () => {
  const [loadMore, setLoadMore] = useState(false);
  const [filter, setFilter] = useState(null)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const { isValidating, data, error, nextToken, mutate } = useGetEvent(startDate, endDate, filter);
  const handlePaginate = async () => {
    setLoadMore(true);
    let query = "/events/all";
    if (nextToken) {
      query = `/events/all?pageToken=${nextToken}`;
    }
    try {
      const { data: res } = await axios.get(query, { withCredentials: true });
      if (res) {
        const input = {
          nextPageToken: res.nextPageToken,
          items: [...data.items, ...res?.items],

          totalItems: res.totalItems,
        };
        mutate(input, false);
      }
    } catch (error) {
      
      toast.error(error?.response?.data?.error || "Failed to Fetch the Events", {
        position: "top-center",
        autoClose: 1700,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoadMore(false);
    }
  };
  const filterEvents = () => {
    if (!endDate) {
      toast.error("Please provide required datesX.", {
        position: "top-center",
        autoClose: 1700,
        hideProgressBar: false,
        // closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        // progress: undefined,
      });
      return;
    }else{

      setFilter(true);
    }
  };
  useEffect(() => {
    if (error && !isValidating && !data) {
      toast.error(error?.error || "Failed to Fetch the Events", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setFilter(false);
    }

    // eslint-disable-next-line
  }, [error]);
  useEffect(() => {
    if (filter === false && typeof filter !== "string") {
      setStartDate();
      setEndDate();
    }
    // eslint-disable-next-line
  }, [setFilter,filter]);
  useEffect(() => {
    setStartDate();
    setEndDate();
  }, []);

  return (
    <>
      <Head>
        <title>Events | IFRAME</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <ToastContainer />
        <Container maxWidth={false}>
          <EventListToolbar
            searchQ={searchQ}
            filter={filter}
            filterEvents={filterEvents}
            setFilter={setFilter}
            setSearchQ={setSearchQ}
            startDate={startDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            endDate={endDate}
          />
          {isValidating && !data?.items ? (
            <Box
              sx={{
                w: "100%",
                textAlign: "center",
                height: "80%",
                mx: "auto",
                my: 10,
              }}
            >
              <CircularProgress />
            </Box>
          ) : data?.items?.length ? (
            <>
             <CreateEvent
             isValidating={isValidating}
             data={data}
             mutate={mutate}/>
              <Box sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  {searchQ.length > 2
                    ? data?.items
                        .filter((evnt) => {
                          if (searchQ.length) {
                            return (
                              evnt.description
                                .toLowerCase()
                                .split(" || ")[1]
                                .includes(searchQ.trim().toLowerCase()) ||
                              evnt.description
                                .toLowerCase()
                                .split(" || ")[0]
                                .includes(searchQ.trim().toLowerCase()) ||
                              evnt.summary.toLowerCase().includes(searchQ.trim())
                            );
                          }
                          return evnt;
                        })
                        .map((event) => (
                          <Grid item key={event.id} lg={4} md={6} xs={12}>
                            <EventCard mutate={mutate}searchQ={searchQ} event={event} />
                          </Grid>
                        ))
                    : data?.items.map((event) => (
                        <Grid item key={event.id} lg={4} md={6} xs={12}>
                          <EventCard mutate={mutate}searchQ={searchQ} event={event} />
                        </Grid>
                      ))}
                </Grid>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  pt: 3,
                }}
              >
                {!filter && nextToken.length && data?.items?.length !== data?.totalItems && (
                  <LoadingButton
                    onClick={handlePaginate}
                    color="primary"
                    sx={{ my: 2, mx: "auto" }}
                    loading={loadMore}
                    disabled={isValidating}
                    variant="contained"
                  >
                    Load More
                  </LoadingButton>
                )}
              </Box>
            </>
          ) : (
            <Box>
              <Typography sx={{ textAlign: "center" }} variant="h4">
                No Events Available
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

Events.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Events;
