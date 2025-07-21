import React from 'react';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: any;
  change: number;
  changeText: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeText,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const iconBg = useColorModeValue('brand.50', 'brand.900');

  return (
    <Box
      bg={bg}
      p={6}
      borderRadius="xl"
      boxShadow="sm"
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      _hover={{
        boxShadow: 'md',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.3s"
    >
      <Stat>
        <HStack justify="space-between" align="start">
          <Box>
            <StatLabel color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm">
              {title}
            </StatLabel>
            <StatNumber fontSize="2xl" fontWeight="bold" mt={1}>
              {value}
            </StatNumber>
          </Box>
          <Box
            p={3}
            bg={iconBg}
            borderRadius="lg"
            color="brand.500"
          >
            <Icon as={icon} w={5} h={5} />
          </Box>
        </HStack>
        <StatHelpText mt={2} mb={0}>
          <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
          {Math.abs(change)}% {changeText}
        </StatHelpText>
      </Stat>
    </Box>
  );
};