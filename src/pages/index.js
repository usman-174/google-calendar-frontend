import { Box, Container, Typography } from '@mui/material';
import Head from 'next/head';
import Calendar from '../components/calendar/Calendar';
import { DashboardLayout } from '../components/dashboard-layout';

const Dashboard = () =>{
  return(
  <>
    <Head>
      <title>
        IFRAME CALENDAR
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
      <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        m: -1
      }}
    >
      <Typography
        sx={{ mx: "auto" ,color:"#111827"}}
        variant="h4"
      >
        Calendar
      </Typography>
      
    </Box>
        <Calendar/>
       
      </Container>
    </Box>
  </>
);
}
Dashboard.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Dashboard;
