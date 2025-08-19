import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  Container,
  Flex,
} from '@chakra-ui/react';
import { FaPlus, FaDownload, FaShare } from 'react-icons/fa';
import { Sidebar } from '../components/Sidebar';
import { SearchBar } from '../components/SearchBar';
import { UserTable } from '../components/UserTable';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';

export const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuthStore();
  const { fetchUsers } = useUserStore();
  const bg = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Flex h="100vh" bg={bg}>
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <Box flex={1} overflow="auto">
        <Container maxW="full" p={6}>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <Box>
              <Heading size="lg" mb={2}>
                User Management
              </Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="lg">
                Manage and view all users in your organization.
              </Text>
            </Box>

            {/* Search Bar */}
            <SearchBar />

            {/* Quick Actions */}
            <HStack spacing={4} flexWrap="wrap">
              <Button leftIcon={<FaPlus />} colorScheme="brand" size="md">
                Add User
              </Button>
              <Button leftIcon={<FaDownload />} variant="outline" size="md">
                Export Users
              </Button>
              <Button leftIcon={<FaShare />} variant="ghost" size="md">
                Share List
              </Button>
            </HStack>

            {/* Users Table */}
            <Box>
              <UserTable />
            </Box>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};