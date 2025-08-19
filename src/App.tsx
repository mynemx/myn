import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { UserDetail } from './pages/UserDetail';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Box minH="100vh">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Box>
  );
}

export default App;