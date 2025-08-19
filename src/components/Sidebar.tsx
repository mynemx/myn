import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Button,
  Divider,
  useColorModeValue,
  Collapse,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import {
  FiHome,
  FiUsers,
  FiBarChart,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive = false, 
  isCollapsed, 
  badge 
}: {
  icon: any;
  label: string;
  isActive?: boolean;
  isCollapsed: boolean;
  badge?: string;
}) => (
  <Button
    variant="ghost"
    w="full"
    justifyContent={isCollapsed ? 'center' : 'flex-start'}
    px={isCollapsed ? 2 : 4}
    py={3}
    h="auto"
    fontWeight="normal"
    bg={isActive ? useColorModeValue('brand.50', 'brand.900') : 'transparent'}
    color={isActive ? 'brand.500' : useColorModeValue('gray.700', 'gray.300')}
    _hover={{
      bg: useColorModeValue('gray.100', 'gray.700'),
      color: useColorModeValue('gray.900', 'white'),
    }}
    leftIcon={<Icon size={20} />}
    fontSize="sm"
  >
    {!isCollapsed && (
      <HStack justify="space-between" w="full">
        <Text>{label}</Text>
        {badge && (
          <Badge colorScheme="red" size="sm">
            {badge}
          </Badge>
        )}
      </HStack>
    )}
  </Button>
);

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user } = useAuthStore();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      w={isCollapsed ? '16' : '64'}
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      h="100vh"
      position="sticky"
      top="0"
      transition="width 0.3s ease"
      overflow="hidden"
    >
      <VStack spacing={0} align="stretch" h="full">
        {/* User Profile Section */}
        <Box p={4}>
          <HStack spacing={3} justify={isCollapsed ? 'center' : 'flex-start'}>
            <Avatar
              size={isCollapsed ? 'sm' : 'md'}
              name={user?.name}
              src={user?.avatar}
            />
            <Collapse in={!isCollapsed} animateOpacity>
              <VStack spacing={1} align="start">
                <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                  {user?.name}
                </Text>
                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                  {user?.email}
                </Text>
              </VStack>
            </Collapse>
          </HStack>
        </Box>

        <Divider />

        {/* Navigation Items */}
        <VStack spacing={2} align="stretch" p={4} flex={1}>
          <NavItem
            icon={FiHome}
            label="Dashboard"
            isActive={true}
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={FiUsers}
            label="Users"
            isCollapsed={isCollapsed}
            badge="12"
          />
          <NavItem
            icon={FiBarChart}
            label="Analytics"
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={FiSettings}
            label="Settings"
            isCollapsed={isCollapsed}
          />
        </VStack>

        <Divider />

        {/* Toggle Button */}
        <Box p={4}>
          <IconButton
            aria-label="Toggle Sidebar"
            icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            onClick={onToggle}
            variant="ghost"
            w="full"
            size="sm"
          />
        </Box>
      </VStack>
    </Box>
  );
};