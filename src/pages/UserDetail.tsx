import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Divider,
  useColorModeValue,
  Spinner,
  Center,
  IconButton,
} from '@chakra-ui/react';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiCalendar, FiDollarSign, FiUserCheck, FiUserX } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore, type ApiUser } from '../stores/userStore';

const getStatusFromDate = (lastActiveDate: string) => {
  const lastActive = new Date(lastActiveDate);
  const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceActive <= 7) return { status: 'Active', color: 'green' };
  if (daysSinceActive <= 30) return { status: 'Pending', color: 'orange' };
  return { status: 'Inactive', color: 'red' };
};

export const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, fetchUsers } = useUserStore();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const bg = useColorModeValue('white', 'gray.800');
  const pageBg = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    const loadUser = async () => {
      if (users.length === 0) {
        await fetchUsers();
      }
      
      const foundUser = users.find(u => u.id === id);
      setUser(foundUser || null);
      setLoading(false);
    };

    loadUser();
  }, [id, users, fetchUsers]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Container maxW="4xl" py={8}>
        <VStack spacing={4}>
          <Text fontSize="xl">User not found</Text>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </VStack>
      </Container>
    );
  }

  const { status, color } = getStatusFromDate(user.lastActiveDate);

  return (
    <Box bg={pageBg} minH="100vh">
      <Container maxW="6xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack>
            <IconButton
              aria-label="Go back"
              icon={<FiArrowLeft />}
              onClick={() => navigate('/dashboard')}
              variant="ghost"
            />
            <Heading size="lg">User Details</Heading>
          </HStack>

          {/* User Profile Card */}
          <Card bg={bg}>
            <CardBody p={8}>
              <VStack spacing={6}>
                <HStack spacing={6} align="start" w="full">
                  <Avatar
                    size="2xl"
                    name={`${user.profile.firstName} ${user.profile.lastName}`}
                    src={user.profile.avatar}
                  />
                  
                  <VStack align="start" spacing={2} flex={1}>
                    <Heading size="lg">
                      {user.profile.firstName} {user.profile.lastName}
                    </Heading>
                    <Text color="gray.600" fontSize="lg">@{user.userName}</Text>
                    <Badge colorScheme={color} size="lg">
                      {status}
                    </Badge>
                  </VStack>
                  
                  <VStack spacing={2}>
                    <Button colorScheme="green" leftIcon={<FiUserCheck />}>
                      Activate User
                    </Button>
                    <Button variant="outline" colorScheme="red" leftIcon={<FiUserX />}>
                      Deactivate User
                    </Button>
                  </VStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* User Information Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Personal Information */}
            <Card bg={bg}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md" color="brand.500">Personal Information</Heading>
                  <Divider />
                  
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <FiMail />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.600">Email</Text>
                        <Text fontWeight="medium">{user.email}</Text>
                      </VStack>
                    </HStack>
                    
                    <HStack>
                      <FiPhone />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.600">Phone</Text>
                        <Text fontWeight="medium">{user.phoneNumber}</Text>
                      </VStack>
                    </HStack>
                    
                    <HStack>
                      <FiMapPin />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.600">Address</Text>
                        <Text fontWeight="medium">{user.profile.address}</Text>
                      </VStack>
                    </HStack>
                    
                    <HStack>
                      <FiCalendar />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.600">Joined</Text>
                        <Text fontWeight="medium">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Account Information */}
            <Card bg={bg}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md" color="brand.500">Account Information</Heading>
                  <Divider />
                  
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <FiDollarSign />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.600">Account Balance</Text>
                        <Text fontWeight="medium" fontSize="lg" color="green.500">
                          {user.accountBalance}
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600">Account Number</Text>
                      <Text fontWeight="medium">{user.accountNumber}</Text>
                    </VStack>
                    
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600">Organization</Text>
                      <Text fontWeight="medium">{user.orgName}</Text>
                    </VStack>
                    
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600">BVN</Text>
                      <Text fontWeight="medium">{user.profile.bvn}</Text>
                    </VStack>
                    
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600">Gender</Text>
                      <Text fontWeight="medium" textTransform="capitalize">
                        {user.profile.gender}
                      </Text>
                    </VStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Guarantor Information */}
            <Card bg={bg}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md" color="brand.500">Guarantor Information</Heading>
                  <Divider />
                  
                  <VStack align="stretch" spacing={3}>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600">Full Name</Text>
                      <Text fontWeight="medium">
                        {user.guarantor.firstName} {user.guarantor.lastName}
                      </Text>
                    </VStack>
                    
                    <HStack>
                      <FiPhone />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.600">Phone</Text>
                        <Text fontWeight="medium">{user.guarantor.phoneNumber}</Text>
                      </VStack>
                    </HStack>
                    
                    <HStack>
                      <FiMapPin />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.600">Address</Text>
                        <Text fontWeight="medium">{user.guarantor.address}</Text>
                      </VStack>
                    </HStack>
                    
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600">Gender</Text>
                      <Text fontWeight="medium" textTransform="capitalize">
                        {user.guarantor.gender}
                      </Text>
                    </VStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Activity Summary */}
            <Card bg={bg}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md" color="brand.500">Activity Summary</Heading>
                  <Divider />
                  
                  <VStack align="stretch" spacing={3}>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600">Last Active</Text>
                      <Text fontWeight="medium">
                        {new Date(user.lastActiveDate).toLocaleDateString()}
                      </Text>
                    </VStack>
                    
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600">Account Created</Text>
                      <Text fontWeight="medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Text>
                    </VStack>
                    
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600">Currency</Text>
                      <Text fontWeight="medium">{user.profile.currency}</Text>
                    </VStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};