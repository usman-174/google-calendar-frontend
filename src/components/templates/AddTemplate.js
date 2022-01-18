import {
  Chip, FormControl, Grid, Paper, TextField,
  Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import axios from "axios";
import { useFormik } from "formik";
import { toast, ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import { useState } from "react";

export default function CreateTemplate({
  mutate,
  isValidating,
  templatesList,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState([]);
  const formik = useFormik({
    initialValues: {
      title: "",
      message: "",
      tag: "",
      // list: [],
    },

    onSubmit: async ({ title, message }) => {
      if (!title || !message || !list.length) {
        console.log({ title, message, list });
        toast.error("Please provide required info.", {
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

      try {
        const { data } = await axios.post("/templates/new", {
          title,
          message,
          keywords: list,
        });
        if (data?.error) {
          toast.error(data.error || "Failed to create the template.", {
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
          toast.success("Template Added", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          if (!isValidating) {
            mutate([...templatesList, data], false);
            setIsOpen(false);
            return;
          }
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.error || "Failed to create the template.",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    },
  });

  return (
    <>
      <Button
        color="warning"
        onClick={() => setIsOpen(true)}
        variant="outlined"
      >
        Create a new Template
      </Button>{" "}
      <Drawer anchor={"right"} open={isOpen} onClose={() => setIsOpen(false)}>
        <ToastContainer />

        <Box sx={{ my: 3, textAlign: "center" }}>
          <Typography color="textPrimary" variant="h4">
            Add Template
          </Typography>
        </Box>
        <Box sx={{ px: 1, textAlign: "center", maxWidth: { sm: "35vw" } }}>
          {/* <form onSubmit={formik.handleSubmit}> */}
          <Grid sx={{ my: 4 }} container justifyContent={"center"} spacing={4}>
            <Grid item xs={12}>
              <FormControl>
                <TextField
                  error={Boolean(formik.touched.title && formik.errors.title)}
                  fullWidth
                  helperText={formik.touched.title && formik.errors.title}
                  label="Title"
                  margin="normal"
                  name="title"
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.title}
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <TextField
                  error={Boolean(
                    formik.touched.message && formik.errors.message
                  )}
                  fullWidth
                  multiline
                  helperText={formik.touched.message && formik.errors.message}
                  label="Message"
                  margin="normal"
                  name="message"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="message"
                  value={formik.values.message}
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} alignItems="center" justifyContent={"center"}>
              <FormControl>
                <TextField
                  error={Boolean(formik.touched.tag && formik.errors.tag)}
                  helperText={formik.touched.tag && formik.errors.tag}
                  label="Keyword"
                  name="tag"
                  margin="normal"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.tag}
                  variant="outlined"
                />
              </FormControl>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                type="submit"
                sx={{ mt: { xs: 1, sm: 3 }, mx: { xs: 1 } }}
                variant="contained"
                onClick={
                  () => {
                    setList(
                      JSON.stringify(list)?.includes(
                        formik.values.tag.trim().replace(" ", "_")
                      )
                        ? list
                        : [...list, formik.values.tag.trim().replace(" ", "_")]
                    );
                    
                  }
                  // formik.setValues({
                  //   list: formik.values.list.includes(
                  //     formik.values.tag.trim().replace(" ", "_")
                  //   )
                  //     ? formik.values.list
                  //     : [
                  //         ...formik.values.list,
                  //         formik.values.tag.trim().replace(" ", "_"),
                  //       ],
                  //   tag: "",
                  //   ...formik.values
                  // });
                }
                disabled={!formik.values.tag}
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
            {list.length
              ? list?.map((tagx) => (
                  <Chip
                    sx={{ m: 0.4 }}
                    label={tagx}
                    key={tagx}
                    color="info"
                    onDelete={() => {
                      const filtered = list.filter((word) => word !== tagx);
                      return setList(filtered);
                    }}
                  />
                ))
              : null}
          </Paper>

          <Box sx={{ py: 2, mx: "auto", textAlign: "center" }}>
            <Button
              color="error"
              disabled={formik.isSubmitting}
              size="medium"
              type="submit"
              onClick={() => setIsOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              sx={{ mx: 2 }}
              disabled={formik.isSubmitting}
              onClick={formik.handleSubmit}
              size="medium"
              type="submit"
              variant="contained"
            >
              Create
            </Button>
          </Box>
          {/* </form> */}
        </Box>
      </Drawer>
    </>
  );
}
