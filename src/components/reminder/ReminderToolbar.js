import { LoadingButton } from "@mui/lab";
import {
  Box, Card,
  CardContent,
  InputAdornment,
  SvgIcon,
  TextField
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export const ReminderToolbar = ({
  searchQ,
  setSearchQ,
  feedbackLoading,
  handlesendreminders,
  selectedItems,
  isValidating,
}) => {
  return (
    <Box>
      {/* <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          Events List
        </Typography>
        <Box sx={{ m: 1 }}>
          <LoadingButton color="primary" loading={feedbackLoading} disabled={!selectedItems?.length} onClick={handlesendreminders} variant="contained">
            Send Reminders
          </LoadingButton>
        </Box>
      </Box> */}
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                justifyContent: {
                  md:"space-between",xs:"center"},
                flexDirection:{
                  xs:"column",
                  md:"row"
                },
                // m: -1,
              }}
            >
              <Box sx={{ minWidth: "40%" }}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search events"
                  variant="outlined"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </Box>
              <LoadingButton
                sx={{ my:{
                  xs:2,sm:1,md:0
                }}}
                color="primary"
                loading={feedbackLoading}
                disabled={!selectedItems?.length || isValidating}
                onClick={handlesendreminders}
                variant="contained"
              >
                Send Reminders
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
