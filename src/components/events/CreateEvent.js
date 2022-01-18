import { FormLabel, Input } from "@chakra-ui/react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import axios from "axios";
import { toast, ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useSWR from "swr";
import { SeverityPill } from "../severity-pill";

const CreateEvent = ({ isValidating, data, mutate }) => {
  const { data: templatesList } = useSWR("/templates/all");

  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [template, setTemplate] = useState("");
  const [keywords, setkeywords] = useState([]);
  const handleSubmit = async () => {
    if (!description || !phone) {
      toast.error("Please provide all details of the Event.", {
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
    if (description.length < 10) {
      toast.error("Description length must be greater than 10 Characters.", {
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
    if (!keywords?.length) {
      toast.error("Please select a keywords Template", {
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
    if (!endDate) {
      toast.error("Atleast provide End Date", {
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
    let wordString = "";
    keywords.forEach((word) => {
      wordString += " " + word;
    });

    try {
      const { data } = await axios.post("/events/new", {
        description: description + " ||" + wordString,
        summary: phone,
        startTime: startDate,
        endTime: endDate,
      });
      if (data?.success) {
        setDescription("");
        setEndDate("");
        setStartDate("");
        setPhone("");
        setkeywords("");
        toast({
          title: "Event Created",
          status: "success",
          duration: 1600,
          isClosable: true,
        });
        mutate();
        if (!isValidating) {
          setIsOpen(false);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Please try later", {
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
    if (template) {
      setkeywords(templatesList.find((temp) => temp.title === template)?.keywords);
    }
  }, [setTemplate, setkeywords, templatesList, template, keywords]);
  return (
    <>
      <ToastContainer />

      <Link
        component="button"
        variant="body1"
        sx={{ my: 1, mx: 4, display: "flex", alignItems: "center" }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Create an Event
        <AddBoxIcon sx={{ ml: 1 }} />
      </Link>

      <Drawer anchor={"left"} open={isOpen} onClose={() => setIsOpen(false)}>
        <ToastContainer />

        <Box sx={{ my: 3, textAlign: "center" }}>
          <Typography color="textPrimary" variant="h4">
            Create Event
          </Typography>
        </Box>
        <Box sx={{ px: 5, maxWidth: { sm: "40vw" } }}>
          <FormLabel fontSize={"sm"}>From</FormLabel>
          <Box
            sx={{ boxShadow: "2px 1px 2px 1px rgba(0, 0, 255, .2)", borderRadius: "5px", p: 1.5 }}
          >
            <Input
              type="datetime-local"
              name="endDate"
              w={"sm"}
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
          </Box>
          <FormLabel fontSize={"sm"}>To</FormLabel>
          <Box
            sx={{ boxShadow: "2px 1px 2px 1px rgba(0, 0, 255, .2)", borderRadius: "5px", p: 1.5 }}
          >
            <Input
              type="datetime-local"
              name="endDate"
              w={"sm"}
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
            />
          </Box>
          <Grid justifyContent={"center"}>
            <Grid item xs={12}>
              <FormControl>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Description"
                  margin="normal"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="description"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ minWidth: "40%" }}>
                <InputLabel id="Templates">Template</InputLabel>
                <Select
                  labelId="Select Templates"
                  placeholder="Select Template"
                  id="Templates"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  label="Template"
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
                {!templatesList?.length ? <Typography variant="caption" color="error" display="block" gutterBottom>
        Please create a template before creating an event
      </Typography>:null}
              </FormControl>
            </Grid>
            {keywords ? (
              <Grid item xs={12}>
                {keywords.map((word) => (
                  <SeverityPill key={word} sx={{ mx: 0.7, my: 1, p: 0.7 }}>{word}</SeverityPill>
                ))}
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <FormLabel fontSize={"sm"}>Phone Number</FormLabel>
              <PhoneInput
                value={phone}
                buttonStyle={{ padding: "3px" }}
                placeholder="Enter formated phone number"
                countryCodeEditable={true}
                enableSearch={true}
                onChange={(_, __, ___, formattedValue) => setPhone(formattedValue.replace("-", ""))}
              />
            </Grid>
          </Grid>

          <Box sx={{ py: 2, mx: "auto", textAlign: "center" }}>
            <Button
              color="error"
              size="medium"
              type="submit"
              onClick={() => setIsOpen(false)}
              variant="outlined"
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button
              disabled={isValidating || !templatesList?.length}
              color="primary"
              onClick={handleSubmit}
              sx={{ mx: 2 }}
              size="medium"
              type="submit"
              variant="contained"
            >
              Create
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default CreateEvent;
