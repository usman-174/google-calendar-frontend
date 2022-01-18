import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import Head from "next/head";
import React from "react";
import useSWR from "swr";
import { DashboardLayout } from "../components/dashboard-layout";

import { toast, ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import EditTemplates from "../components/modifyTemplates/EditTemplates";
import CreateTemplate from "../components/templates/AddTemplate";

const modify_templates = () => {
  const {
    data: templatesList,
    isValidating,
    mutate,
  } = useSWR("/templates/all");
  const HandleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/templates/delete/${id}`);
      if (data?.success) {
        toast.success("Template Deleted", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        mutate(
          templatesList.filter((temp) => temp.id !== id),
          true
        );
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error || "Failed to delete the template",
        {
          position: "top-center",
          autoClose: 2200,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    }
  };
  return (
    <>
      <Head>
        <title>Bulk Reminders Feedback | Modify Templates</title>
      </Head>
      <ToastContainer />

      {isValidating && !templatesList ? (
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
      ) : (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{ textAlign: "center" }}
              gutterBottom
              component="div"
            >
              Modify Templates
            </Typography>
            <Card>
              <Box sx={{mx:"auto",my:2,textAlign:"center"}}>

            <CreateTemplate
                            isValidating={isValidating}
                            templatesList={templatesList}
                            mutate={mutate}
                            />
                            </Box>
              <CardContent>
                <Stack spacing={4}>
                  {templatesList.length ? templatesList?.map((temp,i) => {
                    return (
                      <Box
                        sx={{
                   
                          display: "flex",
                          bgcolor: "error",
                          alignItems: "center",
                          flexDirection: { sm: "column", md: "row" },
                          justifyContent: { xs: "center", sm: "space-between" },
                        }}
                        key={temp.id}
                      >
                        <Typography variant="subtitle1" component="div">
                         {i+1 +") "}  {temp.title}
                        </Typography>

                        <Box sx={{ml:{md:"auto"},my:{xs:2,md:0},display:{
                          sm:"block",
                          xs:"flex"
                        },flexDirection:"column"}}>
                       
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{ mx: 1,my:{xs:2,sm:0} }}
                            onClick={() => HandleDelete(temp.id)}
                          >
                            Delete
                          </Button>
                          <EditTemplates
                            isValidating={isValidating}
                            templateId={temp.id}
                            templatesList={templatesList}
                            Message={temp.message}
                            List={temp.keywords}
                            mutate={mutate}
                            Template={temp.title}
                          />
                          
                        </Box>
                        <Divider />
                      </Box>
                    )
                  }) :
                    <Box>
                      <Typography sx={{ textAlign: "center" }} variant="h6">
                        No Templates Available
                      </Typography>
                    </Box>
                  }
                </Stack>
                {/* {!isValidating && !templatesList ? (
                  <Box>
                    <Typography sx={{ textAlign: "center" }} variant="h6">
                      No Templates Available
                    </Typography>
                  </Box>
                ) : null} */}
              </CardContent>
            </Card>
          </Container>
        </Box>
      )}
    </>
  );
};
modify_templates.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default modify_templates;
