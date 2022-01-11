import { Box, Card, CardContent, Divider, Grid, IconButton, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Highlighter from "react-highlight-words";
import ShowMoreText from "react-show-more-text";

import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useState } from "react";import Menu from '@mui/material/Menu';
import DeleteEventAlert from "./DeleteEvent";
import { toast, ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import axios from "axios";

export const EventCard = ({ searchQ,mutate, event, ...rest }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openAlert, setOpenAlert] = useState(false);
  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

 const HandleDelete = async () => {
    try {
      const { data } = await axios.delete("/events/delete/" + event.id);
      if (data?.success) {
        toast.success("Event Deleted", {
          position: "top-center",
          autoClose: 1800,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        mutate("/events/all");
        handleCloseAlert();
        return;
      }
    } catch (error) {
      alert(error.message)
      toast.error(error?.response?.data?.error || "Failed to delete the Event", {
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
    }}
  return(
  <Card
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
    {...rest}
  >
      <ToastContainer />

    <CardContent>
    
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems:"center",
          pb: 2,
          fontSize: "18px",
        }}
      >
        <Typography align="center" color="textPrimary" gutterBottom variant="h6">
        {searchQ.length > 2 ? 
          <Highlighter
            searchWords={searchQ?.split(" ")}
            autoEscape={true}
            textToHighlight={event.description.split(" || ")[1].toUpperCase().replace(",", " ")}
          /> : event.description.split(" || ")[1].toUpperCase().replace(",", " ")}
      </Typography>
        
          <IconButton
          
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: "18%",
            width: '12ch',

          },
        }}
      >
          <MenuItem sx={{textAlign:"center",mx:"auto",'&:hover': {
              textColor: "error"
            }}}onClick={handleClickOpenAlert}>
            Delete
          </MenuItem>
      </Menu>
      <DeleteEventAlert HandleDelete={HandleDelete} open={openAlert} handleClose={handleCloseAlert} />
      </Box>
      
      <Box sx={{mx:"auto",my:1,textAlign:"center",fontSize:18}}>
      {searchQ.length > 2 ? 

          <Highlighter
            searchWords={searchQ?.split(" ")}
            autoEscape={true}
            textToHighlight={event.summary}
            /> :event.summary}
            </Box>
      <Typography align="center" color="textPrimary" variant="body1">
        {searchQ.length > 2 ? (
          <Highlighter
            searchWords={searchQ?.split(" ")}
            autoEscape={true}
            textToHighlight={event.description.split(" || ")[0].replace("#reminder_sent", "")}
          />
        ) : (
          <ShowMoreText
            lines={4}
            more="Read more"
            less={"Read less"}
            className="content-css"
            anchorClass="show_more"
            expanded={false}
            truncatedEndingComponent={"... "}
          >
            {event.description.split(" || ")[0].replace("#reminder_sent", "")}
          </ShowMoreText>
        )}
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1 }} />
    <Divider />
    <Box sx={{ p: 1 }}>
      <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
        <Grid
          item
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <AccessTimeIcon color="info" />
          <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
            Start : {new Date(event.start?.dateTime).toDateString()} at{" "}
            {new Date(event.start?.dateTime).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <ClockIcon color="error" />
          <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
            End : {new Date(event.end?.dateTime).toDateString()} at{" "}
            {new Date(event.end?.dateTime).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  </Card>
);}
          
EventCard.propTypes = {
  event: PropTypes.object.isRequired,
};
