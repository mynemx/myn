import React from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Link,
  Button,
  Text,
  useColorMode,
  useColorModeValue,
  IconButton,
  useDisclosure,
  Stack,
  Collapse,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <Link
    as={RouterLink}
    to={to}
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    transition="all 0.2s"
  >
    {children}
  </Link>
);

export const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} shadow="sm" position="sticky" top={0} zIndex={1000}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        
        <HStack spacing={8} alignItems="center">
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="brand.500">
              WebApp
            </Text>
          </Box>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="#features">Features</NavLink>
            <NavLink to="#pricing">Pricing</NavLink>
            <NavLink to="#contact">Contact</NavLink>
          </HStack>
        </HStack>

        <Flex alignItems="center">
          <IconButton
            aria-label="Toggle Color Mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            mr={2}
          />
          
          {user ? (
            <HStack spacing={2}>
              <Button
                as={RouterLink}
                to="/dashboard"
                variant="ghost"
                size="sm"
                display={{ base: 'none', md: 'inline-flex' }}
              >
                Dashboard
              </Button>
              <Button onClick={handleLogout} size="sm" variant="outline">
                Logout
              </Button>
            </HStack>
          ) : (
            <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
              <Button as={RouterLink} to="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button as={RouterLink} to="/register" size="sm">
                Sign Up
              </Button>
            </HStack>
          )}
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="#features">Features</NavLink>
            <NavLink to="#pricing">Pricing</NavLink>
            <NavLink to="#contact">Contact</NavLink>
            
            {user ? (
              <VStack spacing={2} align="stretch">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <Button onClick={handleLogout} size="sm" variant="outline">
                  Logout
                </Button>
              </VStack>
            ) : (
              <VStack spacing={2} align="stretch">
                <Button as={RouterLink} to="/login" variant="ghost" size="sm">
                  Login
                </Button>
                <Button as={RouterLink} to="/register" size="sm">
                  Sign Up
                </Button>
              </VStack>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};