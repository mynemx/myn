import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaArrowRight, FaPlay } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const Hero: React.FC = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      position="relative"
      overflow="hidden"
    >
      <Container maxW="7xl" position="relative" zIndex={1}>
        <Stack
          align="center"
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: 'column', md: 'row' }}
        >
          <VStack spacing={6} align="center" textAlign="center" flex={1}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Heading
                fontWeight={800}
                fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
                lineHeight="110%"
                bgGradient="linear(to-r, brand.400, teal.400)"
                bgClip="text"
              >
                Build Amazing
                <br />
                <Text color="brand.500">Web Applications</Text>
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              maxW="lg"
            >
              <Text
                color={useColorModeValue('gray.600', 'gray.400')}
                fontSize="xl"
                lineHeight={1.6}
              >
                Create stunning, responsive web applications with our modern tech stack.
                Fast, scalable, and beautifully designed components ready for production.
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <HStack spacing={4}>
                <Button
                  as={RouterLink}
                  to="/register"
                  size="lg"
                  px={8}
                  rightIcon={<Icon as={FaArrowRight} />}
                  bgGradient="linear(to-r, brand.400, teal.400)"
                  color="white"
                  _hover={{
                    bgGradient: 'linear(to-r, brand.500, teal.500)',
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.3s"
                >
                  Get Started
                </Button>
                
                <Button
                  size="lg"
                  px={8}
                  variant="outline"
                  leftIcon={<Icon as={FaPlay} />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.3s"
                >
                  Watch Demo
                </Button>
              </HStack>
            </MotionBox>
          </VStack>
        </Stack>
      </Container>

      {/* Background Decoration */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        bgGradient="radial(circle at 25% 25%, teal.500, transparent 50%)"
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        bgGradient="radial(circle at 75% 75%, brand.500, transparent 50%)"
      />
    </Box>
  );
};