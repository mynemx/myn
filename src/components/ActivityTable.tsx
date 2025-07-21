import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Badge,
  Avatar,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  status: 'completed' | 'pending' | 'failed';
  time: string;
}

interface ActivityTableProps {
  loading?: boolean;
}

const activities: Activity[] = [
  {
    id: '1',
    user: {
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50',
    },
    action: 'Created new project',
    status: 'completed',
    time: '2 minutes ago',
  },
  {
    id: '2',
    user: {
      name: 'Sarah Wilson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50',
    },
    action: 'Updated profile settings',
    status: 'completed',
    time: '1 hour ago',
  },
  {
    id: '3',
    user: {
      name: 'Mike Johnson',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50',
    },
    action: 'Uploaded new document',
    status: 'pending',
    time: '3 hours ago',
  },
  {
    id: '4',
    user: {
      name: 'Emily Davis',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=50',
    },
    action: 'Deleted old files',
    status: 'failed',
    time: '1 day ago',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'pending':
      return 'orange';
    case 'failed':
      return 'red';
    default:
      return 'gray';
  }
};

const LoadingSkeleton = () => (
  <Tr>
    <Td>
      <HStack>
        <Skeleton w={8} h={8} borderRadius="full" />
        <VStack align="start" spacing={1}>
          <SkeletonText noOfLines={1} width="120px" />
          <SkeletonText noOfLines={1} width="80px" />
        </VStack>
      </HStack>
    </Td>
    <Td>
      <SkeletonText noOfLines={1} width="100px" />
    </Td>
    <Td>
      <Skeleton w={16} h={6} borderRadius="md" />
    </Td>
    <Td>
      <SkeletonText noOfLines={1} width="80px" />
    </Td>
  </Tr>
);

export const ActivityTable: React.FC<ActivityTableProps> = ({ loading = false }) => {
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bg} borderRadius="xl" boxShadow="sm" overflow="hidden">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th>Action</Th>
            <Th>Status</Th>
            <Th>Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))
          ) : (
            activities.map((activity) => (
              <Tr key={activity.id}>
                <Td>
                  <HStack>
                    <Avatar size="sm" name={activity.user.name} src={activity.user.avatar} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" fontSize="sm">
                        {activity.user.name}
                      </Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td>
                  <Text fontSize="sm">{activity.action}</Text>
                </Td>
                <Td>
                  <Badge
                    colorScheme={getStatusColor(activity.status)}
                    textTransform="capitalize"
                  >
                    {activity.status}
                  </Badge>
                </Td>
                <Td>
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    {activity.time}
                  </Text>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};