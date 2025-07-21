import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import { FiUsers, FiTrendingUp, FiDollarSign, FiActivity } from 'react-icons/fi';
import { FaPlus, FaDownload, FaShare } from 'react-icons/fa';
import { Sidebar } from '../components/Sidebar';
import { StatsCard } from '../components/StatsCard';
import { ActivityTable } from '../components/ActivityTable';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const bg = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      icon: FiUsers,
      change: 12.5,
      changeText: 'from last month',
    },
    {
      title: 'Revenue',
      value: '$45,231',
      icon: FiDollarSign,
      change: 8.2,
      changeText: 'from last month',
    },
    {
      title: 'Growth',
      value: '23.1%',
      icon: FiTrendingUp,
      change: -2.1,
      changeText: 'from last week',
    },
    {
      title: 'Active Sessions',
      value: '1,247',
      icon: FiActivity,
      change: 5.7,
      changeText: 'from yesterday',
    },
  ];

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
                Welcome back, {user?.name}! 👋
              </Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="lg">
                Here's what's happening with your dashboard today.
              </Text>
            </Box>

            {/* Quick Actions */}
            <HStack spacing={4} flexWrap="wrap">
              <Button leftIcon={<FaPlus />} colorScheme="brand" size="md">
                New Project
              </Button>
              <Button leftIcon={<FaDownload />} variant="outline" size="md">
                Export Data
              </Button>
              <Button leftIcon={<FaShare />} variant="ghost" size="md">
                Share Report
              </Button>
            </HStack>

            {/* Stats Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={6}>
              {stats.map((stat, index) => (
                <StatsCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  change={stat.change}
                  changeText={stat.changeText}
                />
              ))}
            </SimpleGrid>

            {/* Recent Activity */}
            <Box>
              <Heading size="md" mb={4}>
                Recent Activity
              </Heading>
              <ActivityTable loading={loading} />
            </Box>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};