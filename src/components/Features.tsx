import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Text,
  VStack,
  Heading,
  useColorModeValue,
  Icon,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { FaRocket, FaMobile } from 'react-icons/fa';
import { FaShield } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const features = [
  {
    icon: FaRocket,
    title: 'Lightning Fast',
    description: 'Built with modern technologies for optimal performance and speed. Your applications will load instantly and run smoothly.',
  },
  {
    icon: FaShield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with JWT authentication, data encryption, and secure API endpoints to protect your users.',
  },
  {
    icon: FaMobile,
    title: 'Mobile First',
    description: 'Fully responsive design that looks beautiful on all devices. From mobile phones to desktop computers.',
  },
];

export const Features: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const iconColor = useColorModeValue('brand.500', 'brand.300');

  return (
    <Box id="features" py={20} bg={useColorModeValue('white', 'gray.800')}>
      <Container maxW="6xl">
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color={useColorModeValue('gray.800', 'white')}>
              Why Choose Our Platform?
            </Heading>
            <Text
              fontSize="lg"
              color={useColorModeValue('gray.600', 'gray.400')}
              maxW="2xl"
            >
              Discover the features that make our platform the perfect choice
              for building modern web applications.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {features.map((feature, index) => (
              <MotionCard
                key={feature.title}
                bg={cardBg}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                cursor="pointer"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: '2xl',
                }}
              >
                <CardBody textAlign="center" p={8}>
                  <VStack spacing={6}>
                    <Box
                      w={16}
                      h={16}
                      bg={useColorModeValue('brand.50', 'brand.900')}
                      rounded="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={feature.icon} w={8} h={8} color={iconColor} />
                    </Box>
                    
                    <Heading size="md" color={useColorModeValue('gray.800', 'white')}>
                      {feature.title}
                    </Heading>
                    
                    <Text
                      color={useColorModeValue('gray.600', 'gray.400')}
                      lineHeight={1.7}
                    >
                      {feature.description}
                    </Text>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};