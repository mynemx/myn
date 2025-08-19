import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Avatar,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  Button,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  FormControl,
  FormLabel,
  Stack,
} from '@chakra-ui/react';
import { FiChevronUp, FiChevronDown, FiFilter, FiMoreVertical, FiEye, FiUserX, FiUserCheck } from 'react-icons/fi';
import { useUserStore, type ApiUser } from '../stores/userStore';
import { useNavigate } from 'react-router-dom';

const LoadingSkeleton = () => (
  <Tr>
    {Array.from({ length: 6 }).map((_, index) => (
      <Td key={index}>
        <HStack>
          {index === 0 && <Skeleton w={10} h={10} borderRadius="full" />}
          <VStack align="start" spacing={1}>
            <SkeletonText noOfLines={1} width="120px" />
            {index === 0 && <SkeletonText noOfLines={1} width="80px" />}
          </VStack>
        </HStack>
      </Td>
    ))}
  </Tr>
);

const getStatusFromDate = (lastActiveDate: string) => {
  const lastActive = new Date(lastActiveDate);
  const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceActive <= 7) return { status: 'Active', color: 'green' };
  if (daysSinceActive <= 30) return { status: 'Pending', color: 'orange' };
  return { status: 'Inactive', color: 'red' };
};

const SortableHeader = ({ 
  children, 
  field, 
  sortField, 
  sortDirection, 
  onSort 
}: {
  children: React.ReactNode;
  field: keyof ApiUser;
  sortField: keyof ApiUser | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof ApiUser) => void;
}) => {
  const isActive = sortField === field;
  
  return (
    <Th cursor="pointer" onClick={() => onSort(field)} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
      <HStack spacing={1}>
        <Text>{children}</Text>
        <Box>
          {isActive ? (
            sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />
          ) : (
            <FiChevronUp opacity={0.3} />
          )}
        </Box>
      </HStack>
    </Th>
  );
};

const FilterPopover = () => {
  const { statusFilter, orgFilter, setStatusFilter, setOrgFilter, users } = useUserStore();
  
  const organizations = Array.from(new Set(users.map(user => user.orgName))).sort();

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="Filter"
          icon={<FiFilter />}
          variant="outline"
          size="sm"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm">Status</FormLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="sm"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel fontSize="sm">Organization</FormLabel>
              <Select
                value={orgFilter}
                onChange={(e) => setOrgFilter(e.target.value)}
                size="sm"
              >
                <option value="">All Organizations</option>
                {organizations.map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </Select>
            </FormControl>
            
            <Button
              size="sm"
              onClick={() => {
                setStatusFilter('');
                setOrgFilter('');
              }}
            >
              Clear Filters
            </Button>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export const UserTable: React.FC = () => {
  const navigate = useNavigate();
  const {
    filteredUsers,
    loading,
    currentPage,
    pageSize,
    sortField,
    sortDirection,
    setCurrentPage,
    setPageSize,
    setSorting,
  } = useUserStore();

  const bg = useColorModeValue('white', 'gray.800');
  
  const handleSort = (field: keyof ApiUser) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSorting(field, newDirection);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleViewUser = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  return (
    <Box bg={bg} borderRadius="xl" boxShadow="sm" overflow="hidden">
      {/* Table Controls */}
      <HStack justify="space-between" p={4} borderBottom="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </Text>
          <Select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            size="sm"
            w="auto"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </Select>
        </HStack>
        
        <FilterPopover />
      </HStack>

      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
            <Tr>
              <SortableHeader
                field="userName"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                User
              </SortableHeader>
              <SortableHeader
                field="email"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Email
              </SortableHeader>
              <SortableHeader
                field="phoneNumber"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Phone
              </SortableHeader>
              <SortableHeader
                field="orgName"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Organization
              </SortableHeader>
              <SortableHeader
                field="lastActiveDate"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                Status
              </SortableHeader>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            ) : (
              paginatedUsers.map((user) => {
                const { status, color } = getStatusFromDate(user.lastActiveDate);
                
                return (
                  <Tr 
                    key={user.id}
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                    cursor="pointer"
                    onClick={() => handleViewUser(user.id)}
                  >
                    <Td>
                      <HStack>
                        <Avatar 
                          size="sm" 
                          name={`${user.profile.firstName} ${user.profile.lastName}`}
                          src={user.profile.avatar}
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium" fontSize="sm">
                            {user.profile.firstName} {user.profile.lastName}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            @{user.userName}
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{user.email}</Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{user.phoneNumber}</Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{user.orgName}</Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={color} textTransform="capitalize">
                        {status}
                      </Badge>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <MenuList>
                          <MenuItem 
                            icon={<FiEye />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewUser(user.id);
                            }}
                          >
                            View Details
                          </MenuItem>
                          <MenuItem icon={<FiUserCheck />}>
                            Activate User
                          </MenuItem>
                          <MenuItem icon={<FiUserX />} color="red.500">
                            Deactivate User
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <HStack justify="space-between" p={4} borderTop="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
          <Button
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <HStack spacing={2}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;
              
              return (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={isActive ? 'solid' : 'ghost'}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            {totalPages > 5 && (
              <>
                <Text>...</Text>
                <Button
                  size="sm"
                  variant={currentPage === totalPages ? 'solid' : 'ghost'}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </HStack>
          
          <Button
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>
      )}
    </Box>
  );
};