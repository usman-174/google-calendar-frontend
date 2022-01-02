import { Box, HStack, Tag, TagLabel } from '@chakra-ui/react'
import React from 'react'

const ShowKeywords = ({description}) => {
    return (
        <HStack mx="auto" spacing={"5"} >
        {description
          .split(" || ")[1]
          .toUpperCase()
          .split(" ")
          .map((keyword) => (
            <Box  textAlign={"center"} key={keyword}>
              <Tag
                p="2"
                rounded={"md"}
                color={"MenuText"}
                size={"sm"}
                variant="outline"
                colorScheme="teal"
              >
                <TagLabel>{keyword}</TagLabel>
                {/* <TagRightIcon as={MdSettings} /> */}
              </Tag>
            </Box>
          ))}
        )
      </HStack>
    )
}

export default ShowKeywords
