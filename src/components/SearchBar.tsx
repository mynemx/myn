import React from 'react';
import {
  InputGroup,
  InputLeftElement,
  Input,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useUserStore } from '../stores/userStore';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useUserStore();
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box maxW="md">
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search users by name, email, organization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg={bg}
          border="1px"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          _focus={{
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          }}
          borderRadius="lg"
        />
      </InputGroup>
    </Box>
  );
};