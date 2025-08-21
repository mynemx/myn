import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  Input,
  HStack,
  VStack,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  FormControl,
  FormLabel,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon, MoreVertical, Filter } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useNavigate } from 'react-router-dom';

type SortField = 'organization' | 'username' | 'email' | 'phoneNumber' | 'dateJoined' | 'status';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  status: string;
  dateJoined: string;
}

const getStatusFromDate = (dateString: string): 'Active' | 'Inactive' | 'Pending' | 'Blacklisted' => {
  const date = new Date(dateString);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 30) return 'Active';
  if (daysDiff < 90) return 'Pending';
  if (daysDiff < 180) return 'Inactive';
  return 'Blacklisted';
};

const SortableHeader: React.FC<{
  children: React.ReactNode;
  field: SortField;
  currentSort: { field: SortField; order: SortOrder };
  onSort: (field: SortField) => void;
}> = ({ children, field, currentSort, onSort }) => {
  const isActive = currentSort.field === field;
  
  return (
    <Th 
      cursor="pointer" 
      onClick={() => onSort(field)}
      position="relative"
      className="table-header"
    >
      <HStack spacing={2}>
        <Text>{children}</Text>
        <Box>
          {isActive ? (
            currentSort.order === 'asc' ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />
          ) : (
            <Filter size={16} opacity={0.5} />
          )}
        </Box>
      </HStack>
    </Th>
  );
};

const FilterPopover: React.FC<{
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  organizations: string[];
}> = ({ filters, onFilterChange, organizations }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      organization: '',
      username: '',
      email: '',
      phoneNumber: '',
      status: '',
      dateJoined: '',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" variant="outline" leftIcon={<Filter size={16} />}>
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent width="300px">
        <PopoverBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm">Organization</FormLabel>
              <Select
                size="sm"
                value={localFilters.organization}
                onChange={(e) => setLocalFilters({ ...localFilters, organization: e.target.value })}
              >
                <option value="">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Username</FormLabel>
              <Input
                size="sm"
                value={localFilters.username}
                onChange={(e) => setLocalFilters({ ...localFilters, username: e.target.value })}
                placeholder="Enter username"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Email</FormLabel>
              <Input
                size="sm"
                value={localFilters.email}
                onChange={(e) => setLocalFilters({ ...localFilters, email: e.target.value })}
                placeholder="Enter email"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Status</FormLabel>
              <Select
                size="sm"
                value={localFilters.status}
                onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Blacklisted">Blacklisted</option>
              </Select>
            </FormControl>

            <HStack spacing={2}>
              <Button size="sm" colorScheme="blue" onClick={handleApplyFilters} flex={1}>
                Filter
              </Button>
              <Button size="sm" variant="outline" onClick={handleResetFilters} flex={1}>
                Reset
              </Button>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export const UserTable: React.FC = () => {
  const { users, loading } = useUserStore();
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: 'dateJoined',
    order: 'desc'
  });
  const [filters, setFilters] = useState<FilterState>({
    organization: '',
    username: '',
    email: '',
    phoneNumber: '',
    status: '',
    dateJoined: '',
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const organizations = useMemo(() => {
    return Array.from(new Set(users.map(user => user.orgName))).sort();
  }, [users]);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesOrg = !filters.organization || user.orgName.toLowerCase().includes(filters.organization.toLowerCase());
      const matchesUsername = !filters.username || user.userName.toLowerCase().includes(filters.username.toLowerCase());
      const matchesEmail = !filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchesPhone = !filters.phoneNumber || user.phoneNumber.includes(filters.phoneNumber);
      const userStatus = getStatusFromDate(user.createdAt);
      const matchesStatus = !filters.status || userStatus === filters.status;

      return matchesOrg && matchesUsername && matchesEmail && matchesPhone && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.field) {
        case 'organization':
          aValue = a.orgName;
          bValue = b.orgName;
          break;
        case 'username':
          aValue = a.userName;
          bValue = b.userName;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'phoneNumber':
          aValue = a.phoneNumber;
          bValue = b.phoneNumber;
          break;
        case 'dateJoined':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'status':
          aValue = getStatusFromDate(a.createdAt);
          bValue = getStatusFromDate(b.createdAt);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.order === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, filters, sortConfig]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Inactive': return 'gray';
      case 'Pending': return 'yellow';
      case 'Blacklisted': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Box p={6} className="dashboard-container">
        <Text>Loading users...</Text>
      </Box>
    );
  }

  return (
    <Box className="dashboard-container">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="#213F7D">
            Users ({filteredAndSortedUsers.length})
          </Text>
          <FilterPopover
            filters={filters}
            onFilterChange={setFilters}
            organizations={organizations}
          />
        </HStack>

        <Box 
          bg={bgColor} 
          borderRadius="4px" 
          border="1px solid"
          borderColor="rgba(33, 63, 125, 0.06)"
          boxShadow="3px 5px 20px rgba(0, 0, 0, 0.04)"
          className="table-container"
        >
          <Table variant="simple" className="users-table">
            <Thead>
              <Tr>
                <SortableHeader field="organization" currentSort={sortConfig} onSort={handleSort}>
                  ORGANIZATION
                </SortableHeader>
                <SortableHeader field="username" currentSort={sortConfig} onSort={handleSort}>
                  USERNAME
                </SortableHeader>
                <SortableHeader field="email" currentSort={sortConfig} onSort={handleSort}>
                  EMAIL
                </SortableHeader>
                <SortableHeader field="phoneNumber" currentSort={sortConfig} onSort={handleSort}>
                  PHONE NUMBER
                </SortableHeader>
                <SortableHeader field="dateJoined" currentSort={sortConfig} onSort={handleSort}>
                  DATE JOINED
                </SortableHeader>
                <SortableHeader field="status" currentSort={sortConfig} onSort={handleSort}>
                  STATUS
                </SortableHeader>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedUsers.map((user) => {
                const status = getStatusFromDate(user.createdAt);
                return (
                  <Tr 
                    key={user.id} 
                    cursor="pointer" 
                    _hover={{ bg: 'gray.50' }}
                    onClick={() => handleUserClick(user.id)}
                    className="table-row"
                  >
                    <Td className="table-cell">{user.orgName}</Td>
                    <Td className="table-cell">{user.userName}</Td>
                    <Td className="table-cell">{user.email}</Td>
                    <Td className="table-cell">{user.phoneNumber}</Td>
                    <Td className="table-cell">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Td>
                    <Td className="table-cell">
                      <Badge 
                        colorScheme={getStatusColor(status)}
                        className={`status-pill status-${status.toLowerCase()}`}
                      >
                        {status}
                      </Badge>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<MoreVertical size={16} />}
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <MenuList>
                          <MenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleUserClick(user.id);
                          }}>
                            View Details
                          </MenuItem>
                          <MenuItem>Blacklist User</MenuItem>
                          <MenuItem>Activate User</MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>

        <HStack justify="space-between" align="center" className="pagination-container">
          <HStack spacing={4}>
            <Text fontSize="sm" color="#545F7D">Showing</Text>
            <Select 
              size="sm" 
              value={itemsPerPage} 
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              width="80px"
              className="pagination-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
            <Text fontSize="sm" color="#545F7D">
              out of {filteredAndSortedUsers.length}
            </Text>
          </HStack>

          <HStack spacing={2}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="pagination-btn prev-btn"
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={currentPage === pageNum ? "solid" : "outline"}
                  colorScheme={currentPage === pageNum ? "blue" : "gray"}
                  onClick={() => setCurrentPage(pageNum)}
                  className="pagination-number"
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
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                  className="pagination-number"
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn next-btn"
            >
              Next
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};