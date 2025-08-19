import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../stores/authStore';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const Login: React.FC = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (values: { email: string; password: string }) => {
    const success = await login(values.email, values.password);
    
    if (success) {
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }}>
      <Stack spacing="8">
        <Stack spacing="6" textAlign="center">
          <Heading size="xl">Log in to your account</Heading>
          <HStack spacing="1" justify="center">
            <Text color="gray.600">Don't have an account?</Text>
            <Button as={RouterLink} to="/register" variant="link" colorScheme="brand">
              Sign up
            </Button>
          </HStack>
        </Stack>
        
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={useColorModeValue('md', 'md-dark')}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Alert status="info" borderRadius="md" mb={6}>
            <AlertIcon />
            Use email: user@example.com and password: password to test
          </Alert>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Stack spacing="6">
                  <Stack spacing="5">
                    <Field name="email">
                      {({ field }: any) => (
                        <FormControl isInvalid={!!(errors.email && touched.email)}>
                          <FormLabel>Email</FormLabel>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            bg={useColorModeValue('white', 'gray.700')}
                          />
                          {errors.email && touched.email && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {errors.email}
                            </Text>
                          )}
                        </FormControl>
                      )}
                    </Field>

                    <Field name="password">
                      {({ field }: any) => (
                        <FormControl isInvalid={!!(errors.password && touched.password)}>
                          <FormLabel>Password</FormLabel>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your password"
                            bg={useColorModeValue('white', 'gray.700')}
                          />
                          {errors.password && touched.password && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {errors.password}
                            </Text>
                          )}
                        </FormControl>
                      )}
                    </Field>
                  </Stack>

                  <HStack justify="space-between">
                    <Checkbox
                      isChecked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    >
                      Remember me
                    </Checkbox>
                    <Button variant="link" colorScheme="brand" size="sm">
                      Forgot password?
                    </Button>
                  </HStack>

                  <Stack spacing="6">
                    <Button
                      type="submit"
                      isLoading={loading}
                      loadingText="Signing in..."
                      size="lg"
                      fontSize="md"
                    >
                      Sign in
                    </Button>

                    <HStack>
                      <Divider />
                      <Text fontSize="sm" whiteSpace="nowrap" color="gray.600">
                        or continue with
                      </Text>
                      <Divider />
                    </HStack>

                    <HStack spacing="4">
                      <Button
                        variant="outline"
                        leftIcon={<FaGoogle />}
                        size="lg"
                        width="full"
                      >
                        Google
                      </Button>
                      <Button
                        variant="outline"
                        leftIcon={<FaGithub />}
                        size="lg"
                        width="full"
                      >
                        GitHub
                      </Button>
                    </HStack>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Stack>
    </Container>
  );
};