import { Box, Container,  Typography,Link } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useStore } from "../store/store";
import { DashboardLayout } from "../components/dashboard-layout";
import { ReminderFeedBack } from "../components/feedback/ReminderFeedBack";

const Settings = () => {
  const router = useRouter()
  const feedback = useStore(state=>state.feedback);
  
  return (
    <>
      <Head>
        <title>Bulk Reminders Feedback | IFRAME</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          {feedback ? (
              <ReminderFeedBack />
          ) : (
            <>
            <Typography sx={{ mt: 10, mx: "auto",bgColor:"primary" }} variant="h4">
              Send Bulk Reminder to see feedback
            </Typography>
            <Link href="#" onClick={()=>router.push("/reminders")}>Reminder</Link>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

Settings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Settings;
