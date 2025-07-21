import React from 'react';
import { Box } from '@chakra-ui/react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';

export const LandingPage: React.FC = () => {
  return (
    <Box>
      <Hero />
      <Features />
    </Box>
  );
};