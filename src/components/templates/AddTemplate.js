import { Chip, Grid, TextField, Typography, Stack, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Drawer from "@mui/material/Drawer";
import { useFormik,Form } from "formik";
import { useState } from "react";
import { toast, ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function CreateTemplate({ mutate, isValidating, templatesList }) {
  const [isOpen, setIsOpen] = useState(false);
  const formik = useFormik({
    initialValues: {
      title: "",
      message: "",
      tag: "",
      list: [],
    },
   
    onSubmit: async ({ title, message, list }) => {
        if (!title || !message || !list.length) {
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
            if (!isValidating && templatesList?.length) {
              mutate([...templatesList, data], false);
              setIsOpen(false);
              return;
            }
          }
        } catch (error) {
         
          toast.error(error?.response?.data?.error ||"Failed to create the template.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    
  });

  return (
    <div>
      <ToastContainer />
      <Button color="warning" onClick={() => setIsOpen(true)} variant="outlined">
        New Template
      </Button>{" "}
      <Drawer anchor={"right"} open={isOpen} onClose={() => setIsOpen(false)}>
        {/* {list(anchor)} */}

        <Box sx={{ my: 3, textAlign: "center" }}>
          <Typography color="textPrimary" variant="h4">
            Add Template
          </Typography>
        </Box>
        <Box sx={{ px: 4,maxWidth:{sm:"40vw"} }}>
          {/* <form onSubmit={formik.handleSubmit}> */}
            <Grid sx={{ my: 4 }} container justifyContent={"center"} spacing={4}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(formik.touched.message && formik.errors.message)}
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
              </Grid>
              <Grid item xs={12} alignItems="center" justifyContent={"center"}>
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
                <Button
                  color="primary"
                  disabled={formik.isSubmitting}
                  type="submit"
                  sx={{ mt: { xs: 1, sm: 3 }, mx: { xs: 1 } }}
                  variant="contained"
                  onClick={() => {
                    formik.setValues({
                      list: formik.values.list.includes(formik.values.tag.trim().replace(" ", "_"))
                        ? formik.values.list
                        : [...formik.values.list, formik.values.tag.trim().replace(" ", "_")],
                      tag:"",
                      ...formik.values

                    });
                  }}
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
                mx:"auto",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
              }}
              component="ul"
            >
              {formik.values.list.map((tagx) => (
                <Chip
                sx={{m:0.4}}
                  icon={DeleteIcon}
                  label={tagx}
                  color="info"
                  onDelete={() =>
                    formik.setValues({
                      list: formik.values.list.filter((x) => x !== tagx),
                   ...formik.values
                    })
                  }
                />
              ))}
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
    </div>
  );
}
