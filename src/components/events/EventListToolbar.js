import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  SvgIcon,
  TextField,
  Typography
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
export const EventListToolbar = ({
  startDate,
  setStartDate,
  setEndDate,
  setFilter,
  searchQ,
  filter,
  setSearchQ,
  filterEvents,
  endDate,
}) => {
  const handleRemoveFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilter(false)
  };

  return (
      <Box >
        <Card>
          <CardContent>
        {/* <Typography sx={{ my: 2,textAlign:"center" }} variant="h4">
          Events
        </Typography> */}
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <TextField
                sx={{ width: { md: "60%", xs: "80%" } }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search Events..."
                variant="outlined"
              />{" "}
              {/* Filter Area */}
              <Box
                style={{ textAlign: "center" }}
                sx={{
                  alignItems: "center",
                  textAlign: {
                    xs: "center",
                    md: "auto",
                  },
                  display: {
                    sm: "flex",
                    xs: "block",
                  },
                  width: "70%",
                  justifyContent: "center",
                  flexDirection: {
                    sm: "unset",
                  },
                  flexWrap: {
                    sm: "wrap",
                  },
                  my: 2,
                }}
              >
                <Box sx={{textAlign:"center",mx:"auto"}}>
                  <label>
                  From
                  <input
                    style={{ padding: "12px" ,backgroundColor:"#F9FAFC",borderRadius:"5px",marginBotton:"2px"}}
                    type="datetime-local"
                    name="startDate"
                    onChange={(e) => {
                      if (!e.target.value && !endDate) {
                        setFilter(false);
                      }
                      return setStartDate(e.target.value);
                    }}
                    value={startDate}
                  />
                  </label>
                  <label>
               To
                  <input
                    style={{ padding: "12px",backgroundColor:"#F9FAFC",borderRadius:"5px" ,marginBotton:"2px" }}
                    type="datetime-local"
                    name="endDate"
                    placeholder="End Time"
                    onChange={(e) => {
                      if (!e.target.value && !startDate) {
                        setFilter(false);
                      }
                      setEndDate(e.target.value);
                    }}
                    value={endDate}
                  />
                  </label>
                </Box>
                <Box>
                  <Button
                    sx={{
                      m: {
                        xs: 1,
                      },
                    }}
                    color="primary"
                    onClick={filterEvents}
                    variant="contained"
                  >
                    Filter
                  </Button>
                  { filter ? (
                    <Button onClick={handleRemoveFilter} color="error" variant="outlined">
                      Remove Filter
                    </Button>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
  );
};
