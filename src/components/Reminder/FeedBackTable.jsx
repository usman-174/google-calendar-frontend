import {
    Table, Tbody, Tfoot, Th,Td, Thead, Tr, Text
} from "@chakra-ui/react";
import React from "react";
import ReadMoreReact from "read-more-react";

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
            <Td key={row.body+String(i)}><ReadMoreReact
                        text={
                          row.body
                        }
                        min={80}
                        max={500}
                        readMoreText={
                          <Text
                            textColor={"blue.400"}
                            fontSize={"sm"}
                            cursor={"pointer"}
                          >
                            read more...
                          </Text>
                        }
                      /></Td>
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
