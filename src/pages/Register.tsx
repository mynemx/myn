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
  Divider,
  useToast,
} from '@chakra-ui/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
});

export const Register: React.FC = () => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    if (!acceptTerms) {
      toast({
        title: 'Terms required',
        description: 'Please accept the terms and conditions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const success = await register(values.name, values.email, values.password);
    
    if (success) {
      toast({
        title: 'Registration successful',
        description: 'Welcome to our platform!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Registration failed',
        description: 'Something went wrong. Please try again.',
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
          <Heading size="xl">Create your account</Heading>
          <HStack spacing="1" justify="center">
            <Text color="gray.600">Already have an account?</Text>
            <Button as={RouterLink} to="/login" variant="link" colorScheme="brand">
              Sign in
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
          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values }) => (
              <Form>
                <Stack spacing="6">
                  <Stack spacing="5">
                    <Field name="name">
                      {({ field }: any) => (
                        <FormControl isInvalid={!!(errors.name && touched.name)}>
                          <FormLabel>Full Name</FormLabel>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter your full name"
                            bg={useColorModeValue('white', 'gray.700')}
                          />
                          {errors.name && touched.name && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {errors.name}
                            </Text>
                          )}
                        </FormControl>
                      )}
                    </Field>

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
                            placeholder="Create a strong password"
                            bg={useColorModeValue('white', 'gray.700')}
                          />
                          <Box mt={2}>
                            <PasswordStrengthMeter password={values.password} />
                          </Box>
                          {errors.password && touched.password && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {errors.password}
                            </Text>
                          )}
                        </FormControl>
                      )}
                    </Field>
                  </Stack>

                  <Checkbox
                    isChecked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  >
                    <Text fontSize="sm">
                      I accept the{' '}
                      <Link color="brand.500" href="#" textDecoration="underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link color="brand.500" href="#" textDecoration="underline">
                        Privacy Policy
                      </Link>
                    </Text>
                  </Checkbox>

                  <Stack spacing="6">
                    <Button
                      type="submit"
                      isLoading={loading}
                      loadingText="Creating account..."
                      size="lg"
                      fontSize="md"
                      disabled={!acceptTerms}
                    >
                      Create Account
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