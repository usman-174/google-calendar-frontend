import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider, FormControl, Grid,
  InputLabel, MenuItem,
  Select, TextField
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import useSWR from "swr";



export const TemplateDetails = (props) => {
  const { data: templatesList, isValidating, error, mutate } = useSWR("/templates/all");

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [template, setTemplate] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [keywords, setkeywords] = useState([]);

  const HandleDelete = async () => {
    try {
      const { data } = await axios.delete(`/templates/delete/${templateId}`);
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
        setTemplate("");
        mutate(
          templatesList.filter((temp) => temp.id !== templateId),
          true
        );
        handleClose();
        return;
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to delete the template", {
        position: "top-center",
        autoClose: 2200,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      handleClose();
      return;
    }
  };
  const handleSentMessage = async () => {
    try {
      const { data } = await axios.post("/message/", {
        number: phone,
        message,
      });
      if (data?.message) {
        toast.success(data.message || "Message Sent", {
          position: "top-center",
          autoClose: 1800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to Send Message", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  };
  useEffect(() => {
    const foundTemplates = templatesList?.find((temp) => temp?.title === template);

    if (!message || message !== foundTemplates?.message) {
      setMessage(foundTemplates?.message);
    }
    if (!templateId || templateId !== foundTemplates?.id) {
      setTemplateId(foundTemplates?.id);
    }
    if (!keywords || keywords !== foundTemplates?.keywords) {
      setkeywords(foundTemplates?.keywords);
    }
    if (!template||!foundTemplates) {
      setMessage("");
      setkeywords([]);
      setTemplateId("");
    }

    // eslint-disable-next-line
  }, [template, setTemplate, templateId, templatesList]);

  useEffect(() => {
    if (error && !isValidating && !templatesList) {
      toast({
        title: error?.error || "Failed to Fetch the Templates",
        status: "error",
        duration: 1600,
        isClosable: true,
      });
    }

    // eslint-disable-next-line
  }, [error]);
  return (
    <form autoComplete="off" noValidate {...props}>
      <ToastContainer />
      <Card>
        <CardHeader subheader="Select Templated to send Messages" title="Template Messages" />
        {template && (
          <Box sx={{ mx: "auto", textAlign: "center" }}>
            {/* <DeleteForeverIcon
              onClick={handleClickOpen}
              fontSize="large"
              color="error"
              sx={{ cursor: "pointer", mx: 1 }}
            />
            <EditTemplate
              templateId={templateId}
              Message={message}
              List={keywords}
              Template={template}
              templatesList={templatesList}
              isValidating={isValidating}
              mutate={mutate}
            /> */}
          </Box>
        )}
        {/* <DeleteAlert HandleDelete={HandleDelete} open={open} handleClose={handleClose} /> */}
        <Divider />
        <CardContent>
          <Grid container sx={{ textAlign: "center" }} justifyContent={"center"} spacing={5}>
            <Grid item xs={12}>
                <FormControl  sx={{minWidth:"20%"}}>

                <InputLabel id="demo-simple-select-autowidth-label">Template</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={template}
                 
                  
                  onChange={(e) => setTemplate(e.target.value)}
                  autoWidth
                  label="TemplateX"
                  >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {templatesList?.map((temp) => (
                    <MenuItem key={Math.random(8 * 930)} value={temp.title}>
                      {temp.title}
                    </MenuItem>
                  ))}
                </Select>
                  </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                sx={{ width: { sm: "60%", md: "50%" } }}
              
              >

              <TextField
                id="outlined-textarea"
                label="Message"
                placeholder="Message"
                value={message}
                disabled={!template}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                multiline
                />
                </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                sx={{ width: { sm: "40%", md: "33%" } }}
              
              >

              <TextField
                disabled={!message}
                label="Phone Number"
                name="phone"
                onChange={(e) => setPhone(e.target.value)}
                type="number"
                value={phone}
                variant="outlined"
                />
                </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            p: 2,
          }}
        >
          {/* <CreateTemplate
            templatesList={templatesList}
            isValidating={isValidating}
            mutate={mutate}
          /> */}
          <Button
            disabled={!phone || !template || !message}
            color="primary"
            onClick={handleSentMessage}
            variant="contained"
          >
            Send Message
          </Button>
        </Box>
      </Card>
    </form>
  );
};
