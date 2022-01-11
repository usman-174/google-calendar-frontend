import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Chip, Grid, Paper, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import axios from "axios";
import { toast, ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

export default function EditTemplate({
  mutate,
  isValidating,
  templatesList,
  templateId,
  Template,
  Message,
  List,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(Template);
  const [list, setList] = useState(List);
  const [message, setMessage] = useState(Message);
  const [tag, setTag] = useState("");

  const handleSubmit = async () => {
    const options = {};
    if (
      message === templatesList?.find((temp) => temp.id === templateId)?.message &&
      title === templatesList?.find((temp) => temp.id === templateId)?.title &&
      list === templatesList?.find((temp) => temp.id === templateId)?.keywords
    ) {
      toast({
        title: "Please change the details",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (message !== templatesList?.find((temp) => temp.id === templateId)?.message) {
      options.message = message;
    }
    if (title !== templatesList?.find((temp) => temp.id === templateId)?.title) {
      options.title = title;
    }
    if (list !== templatesList?.find((temp) => temp.id === templateId)?.keywords) {
      options.keywords = list;
    }

    try {
      const { data } = await axios.put("/templates/edit/" + templateId, options);
      if (data?.error) {
        toast.error(data.error || "Failed to update template", {
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
      if (data?.title) {
        toast.success("Template Updated", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        mutate();
        setIsOpen(false);
        return;
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error Try later again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const AddtoList = () => {
    setList([...list, tag.replace(" ", "_")]);
    setTag("");
  };
  useEffect(() => {
    if (isOpen) {
      setTitle(Template);
      setList(List);
      setMessage(Message);
    }
  }, [setIsOpen, isOpen]);
  return (
    <>
      <EditIcon
        fontSize="large"
        onClick={() => setIsOpen(true)}
        color="info"
        sx={{ cursor: "pointer", mx: 1 }}
      />

      <Drawer anchor={"right"} open={isOpen} onClose={() => setIsOpen(false)}>
        <ToastContainer />
        {/* {list(anchor)} */}

        <Box sx={{ my: 3, textAlign: "center" }}>
          <Typography color="textPrimary" variant="h4">
            Add Template
          </Typography>
        </Box>
        <Box sx={{ px: 4, maxWidth: { sm: "40vw" } }}>
          <Grid sx={{ my: 4 }} justifyContent={"center"} spacing={4}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Title"
                margin="normal"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                value={title}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                label="Message"
                margin="normal"
                name="message"
                type="message"
                onChange={(e) => setMessge(e.target.value)}
                value={message}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} alignItems="center" justifyContent={"center"}>
              <TextField
                label="Keyword"
                name="tag"
                margin="normal"
                onChange={(e) => setTag(e.target.value)}
                type="text"
                value={tag}
                variant="outlined"
              />
              <Button
                color="primary"
                type="submit"
                sx={{ mt: { xs: 1, sm: 3 }, mx: { xs: 1 } }}
                variant="contained"
                onClick={AddtoList}
                disabled={!tag.length}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          <Paper
            sx={{
              display: "flex",
              justifyContent: "center",
              mx: "auto",
              flexWrap: "wrap",
              listStyle: "none",
              p: 0.5,
            }}
            component="ul"
          >
            {list.map((tagx) => (
              <Chip
                sx={{ m: 0.4 }}
                icon={DeleteIcon}
                label={tagx}
                color="info"
                onDelete={() => {
                  const filtered = list.filter((word) => word !== tagx);
                  return setList(filtered);
                }}
              />
            ))}
          </Paper>

          <Box sx={{ py: 2, mx: "auto", textAlign: "center" }}>
            <Button
              color="error"
              size="medium"
              type="submit"
              onClick={() => setIsOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              sx={{ mx: 2 }}
              size="medium"
              type="submit"
              variant="contained"
            >
              Update
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
