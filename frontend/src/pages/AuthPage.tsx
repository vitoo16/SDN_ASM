import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginFormData, RegisterFormData } from '../types';

const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const registerSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  YOB: yup.number()
    .min(1900, 'Invalid year of birth')
    .max(new Date().getFullYear(), 'Invalid year of birth')
    .required('Year of birth is required'),
  gender: yup.boolean().required('Gender is required'),
});

interface AuthPageProps {
  mode: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const isLogin = mode === 'login';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');
      
      if (isLogin) {
        await login(data as LoginFormData);
      } else {
        await registerUser(data as RegisterFormData);
      }
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message as string}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message as string}
            />
            
            {!isLogin && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message as string}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Full Name"
                  id="name"
                  autoComplete="name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message as string}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Year of Birth"
                  type="number"
                  id="YOB"
                  {...register('YOB')}
                  error={!!errors.YOB}
                  helperText={errors.YOB?.message as string}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked={false}
                      color="primary"
                    />
                  }
                  label="Gender (Male/Female)"
                  sx={{ mt: 2 }}
                />
              </>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </Button>
            
            <Box textAlign="center">
              <Link component={RouterLink} to={isLogin ? '/register' : '/login'} variant="body2">
                {isLogin 
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"
                }
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};