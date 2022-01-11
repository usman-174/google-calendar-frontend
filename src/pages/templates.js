import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';
import { TemplateDetails } from '../components/templates/templateDetails';
import { DashboardLayout } from '../components/dashboard-layout';

const Templates = () => (
  <>
    <Head>
      <title>
        Templates | IFRAME
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
          justifyContent={"center"}
        >
         
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <TemplateDetails />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Templates.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Templates;
