import {
  Card,
  CardContent, Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useStore } from "src/store/store";

export const ReminderFeedBack = () => {
  const feedback = useStore((state) => state.feedback);

  

  return (
    <form>
      <Card>
        
        <CardContent>
        <Typography variant="body" style={{color:"black"}} sx={{p:2, color:"secondary.dark"}}>
        Details of Bulk Reminder sent
                      </Typography>
          <Tabs>
            <TabList style={{margin:"0 auto",textAlign:"center"}}>
              <Tab><Typography variant="h5" style={{color:"#178c55"}} sx={{px:2, color:"secondary.dark"}}>
                        Sent
                      </Typography></Tab>
              <Tab><Typography variant="h5" style={{color:"#453FC3"}}sx={{px:2}}>
                        Failed
                      </Typography></Tab>
            </TabList>

            <TabPanel>
              <TableContainer component={Paper}>
              <Table sx={{ overflowX: "auto" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Message
                      </TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feedback?.success?.map((row) => (
                    <TableRow hover key={row.to}>
                      <TableCell>
                        <Typography color="textPrimary" variant="body1">
                          {row.body}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.to}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </TabPanel>
            <TabPanel>
            <TableContainer component={Paper}>
              <Table sx={{ overflowX: "auto" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Message</TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feedback?.failed?.map((row) => (
                    <TableRow hover key={row.to}>
                      <TableCell>
                        <Typography color="textPrimary" variant="body1">
                          {row.body}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.to}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </TabPanel>
          </Tabs>
          
        </CardContent>
      </Card>
    </form>
  );
};
