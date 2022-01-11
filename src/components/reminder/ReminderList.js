import {
  Card,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import ShowMoreText from "react-show-more-text";

const ReminderList = ({ events, onCheckBoxChange, selectedItems, ...rest }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      {events?.length ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ overflowX: "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItems.length === events.length}
                      color="primary"
                      indeterminate={
                        selectedItems.length > 0 && selectedItems.length < events.length
                      }
                      value={"all"}
                      onChange={onCheckBoxChange}
                    />
                  </TableCell>
                  <TableCell>Keywords</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events?.slice(0, limit).map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    selected={selectedItems.find((x) => x.id === row.id) ? true : false}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.find((x) => x.id === row.id) ? true : false}
                        onChange={onCheckBoxChange}
                        value={JSON.stringify(row)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography color="textPrimary" variant="body1">
                        {row.keywords}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell sx={{ minWidth: { xs: "40vw", sm: "20vw", md: "14vw" } }}>
                      <ShowMoreText
                        lines={3}
                        more="Read more"
                        less={"Read less"}
                        className="content-css"
                        anchorClass="show_more"
                        expanded={false}
                        truncatedEndingComponent={"... "}
                      >
                        {row.description.split(" || ")[0]}
                      </ShowMoreText>
                    </TableCell>
                    <TableCell>{new Date(row.start?.dateTime).toLocaleString()}</TableCell>
                    <TableCell>{new Date(row.end?.dateTime).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={events.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      ) : (
        <Typography variant="h4" sx={{my:5,mx:"auto",textAlign:"center"}}>
          No Events Found
        </Typography>
      )}
    </Card>
  );
};

ReminderList.propTypes = {
  events: PropTypes.array.isRequired,
};

export default ReminderList;
