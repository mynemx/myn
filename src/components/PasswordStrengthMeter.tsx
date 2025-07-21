import React from 'react';
import { Progress, Text, VStack, HStack, Box } from '@chakra-ui/react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    const strength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';
    const color = strength === 'weak' ? 'red' : strength === 'medium' ? 'orange' : 'green';
    
    return { score: (score / 5) * 100, strength, color, checks };
  };

  const { score, strength, color, checks } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <VStack spacing={2} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="sm" color="gray.600">
          Password Strength
        </Text>
        <Text fontSize="sm" color={`${color}.500`} textTransform="capitalize" fontWeight="medium">
          {strength}
        </Text>
      </HStack>
      
      <Progress value={score} colorScheme={color} size="sm" borderRadius="md" />
      
      <Box fontSize="xs" color="gray.500">
        <Text>Password must contain:</Text>
        <VStack align="start" spacing={1} mt={1}>
          <Text color={checks.length ? 'green.500' : 'gray.500'}>
            ✓ At least 8 characters
          </Text>
          <Text color={checks.lowercase ? 'green.500' : 'gray.500'}>
            ✓ One lowercase letter
          </Text>
          <Text color={checks.uppercase ? 'green.500' : 'gray.500'}>
            ✓ One uppercase letter
          </Text>
          <Text color={checks.number ? 'green.500' : 'gray.500'}>
            ✓ One number
          </Text>
          <Text color={checks.special ? 'green.500' : 'gray.500'}>
            ✓ One special character
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};