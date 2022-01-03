import {
  Table, Tbody, Td, Tfoot, Th, Thead, Tr
} from "@chakra-ui/react";
import React from "react";

const FeedBackTable = ({ info }) => {

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Message</Th>
          <Th>Phone No</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          {info?.map((row,i) => (
              <>
            <Td key={row.body+String(i)}>{row.body}</Td>
            <Td  key={row.to+i}>{row.to}</Td>
              </>
            ))}
        </Tr>
      </Tbody>
     {info.length ? <Tfoot>
      <Tr>
          <Th>Message</Th>
          <Th>Phone No</Th>
        </Tr>
      </Tfoot>:null}
    </Table>
  );
};

export default FeedBackTable;
