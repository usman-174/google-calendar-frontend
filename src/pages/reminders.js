import Head from "next/head";
import { Box, CircularProgress, Container } from "@mui/material";
import ReminderList from "../components/reminder/ReminderList";
import { ReminderToolbar } from "../components/reminder/ReminderToolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from 'next/router'
import { useStore } from "src/store/store";

const Customers = () => {
  const router= useRouter()
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const feedback = useStore(state=>state.feedback)
  const setFeedback = useStore(state=>state.setFeedback)
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const { data, isValidating, mutate } = useSWR("/events");
  const rows = data
    ?.filter((item) => !item.description.includes("#reminder_sent"))
    .filter((evnt) => {
      if (searchQ.length) {
        return (
          evnt.keywords.toLowerCase().includes(searchQ.trim()) ||
          evnt.description.toLowerCase().includes(searchQ.trim()) ||
          evnt.phone.toLowerCase().includes(searchQ.trim())
        );
      }
      return evnt;
    })
    .map((event) => ({
      id: event?.id,
      phone: event?.summary,
      summary: event?.summary,
      keywords: event?.description.split(" || ")[1].replace(" ", " , ").toUpperCase(),
      description: event?.description,
      ...event,
    }))

  const onCheckBoxChange = (e) => {
    if (e.target.value === "all" && e.target.checked) {
      setSelectedItems(rows);
      return;
    } else if (e.target.value === "all" && !e.target.checked) {
      setSelectedItems([]);
      return;
    }
    const value = JSON.parse(e.target.value);
    const found = selectedItems.find((x) => x.id === value.id);
    if (e.target.checked) {
      if (found) {
      } else {
        const data = [...selectedItems, value];

        setSelectedItems(data);
      }
    } else {
      const data = selectedItems.filter((x) => x.id !== value.id);
      setSelectedItems(data);
    }
  };
  const handleSendReminders = async () => {
    if (selectedItems.length) {
      setFeedback(null);
      setFeedbackLoading(true);
      try {
        const { data } = await axios.post("/message/bulk", {
          selectedEvents: selectedItems,
        });
        if (data) {
          setFeedback(data);

          if (data.success.length) {
            mutate();
            setSelectedItems([]);
          }
          router.push("/feedback")
        }
        return;
      } catch (error) {
        setFeedback(null);
        toast.error(error?.response?.data?.error || "Failed to send message.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      } finally {
        setFeedbackLoading(false);
      }
    }
  };

  useEffect(() => {
    setSelectedItems([]);
  }, []);

  if (isValidating && !data) {
    return (
      <Box
        sx={{
          w: "100%",
          height: "50%",
          m: "auto",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>SEND REMINDERS | IFRAME</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <ReminderToolbar
            isValidating={isValidating}
            handlesendreminders={handleSendReminders}
            selectedItems={selectedItems}
            feedbackLoading={feedbackLoading}
            setSelectedItems={setSelectedItems}
            searchQ={searchQ}
            setSearchQ={setSearchQ}
          />
          <Box sx={{ mt: 3 }}>
            <ReminderList
              events={rows}
              onCheckBoxChange={onCheckBoxChange}
              selectedItems={selectedItems}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};
Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
