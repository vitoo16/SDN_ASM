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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              padding: 6, 
              width: '100%',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0 auto 16px'
                }}
              >
                O
              </Box>
              <Typography component="h1" variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {isLogin ? 'Welcome Back' : 'Join Odour'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
                {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
              </Typography>
            </Box>
          
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
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0284c7 0%, #0891b2 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)'
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
            
            <Box textAlign="center">
              <Link 
                component={RouterLink} 
                to={isLogin ? '/register' : '/login'} 
                sx={{
                  color: '#0ea5e9',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#0284c7',
                    textDecoration: 'underline'
                  }
                }}
              >
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
    </Box>
  );
};