import { Box, Flex, Heading } from '@chakra-ui/react';

export const PageHeader = () => {
  return (
    <Box
      bg='#1c1c1c'
      color='white'
      px={8}
      py={3}
      top={0}
      left={0}
      position='sticky'
      as='header'
      zIndex={1000}
    >
      <Flex align='center' justify='space-between' mx='auto'>
        {/* Header Title */}
        <Heading as='h1' size='2xl'>
          Football Schedule
        </Heading>
      </Flex>
    </Box>
  );
};
