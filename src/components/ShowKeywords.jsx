import { Box, HStack, Tag, TagLabel } from '@chakra-ui/react'
import React from 'react'

const ShowKeywords = ({description}) => {
    return (
        <HStack mx="auto" my="2" spacing={"10"} >
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
                size={"md"}
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
