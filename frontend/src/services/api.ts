import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  AuthResponse, 
  Member, 
  Brand, 
  Perfume, 
  LoginFormData, 
  RegisterFormData,
  UpdateProfileFormData,
  ChangePasswordFormData,
  CommentFormData,
  PerfumeFormData,
  BrandFormData,
  SearchFilters
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: RegisterFormData): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/members/register', data),
  
  login: (data: LoginFormData): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/members/login', data),
  
  getProfile: (): Promise<AxiosResponse<ApiResponse<{ member: Member }>>> =>
    api.get('/members/profile'),
  
  updateProfile: (id: string, data: UpdateProfileFormData): Promise<AxiosResponse<ApiResponse<{ member: Member }>>> =>
    api.put(`/members/${id}`, data),
  
  changePassword: (id: string, data: ChangePasswordFormData): Promise<AxiosResponse<ApiResponse<{}>>> =>
    api.put(`/members/${id}/password`, data),
};

// Members API
export const membersAPI = {
  getAllMembers: (): Promise<AxiosResponse<ApiResponse<{ members: Member[]; count: number }>>> =>
    api.get('/members/collectors'),
};

// Brands API
export const brandsAPI = {
  getAllBrands: (): Promise<AxiosResponse<ApiResponse<{ brands: Brand[]; count: number }>>> =>
    api.get('/brands'),
  
  getBrandById: (id: string): Promise<AxiosResponse<ApiResponse<{ brand: Brand }>>> =>
    api.get(`/brands/${id}`),
  
  createBrand: (data: BrandFormData): Promise<AxiosResponse<ApiResponse<{ brand: Brand }>>> =>
    api.post('/brands', data),
  
  updateBrand: (id: string, data: BrandFormData): Promise<AxiosResponse<ApiResponse<{ brand: Brand }>>> =>
    api.put(`/brands/${id}`, data),
  
  deleteBrand: (id: string): Promise<AxiosResponse<ApiResponse<{}>>> =>
    api.delete(`/brands/${id}`),
};

// Perfumes API
export const perfumesAPI = {
  getAllPerfumes: (filters?: SearchFilters): Promise<AxiosResponse<ApiResponse<{ perfumes: Perfume[] }>>> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.targetAudience) params.append('targetAudience', filters.targetAudience);
    if (filters?.concentration) params.append('concentration', filters.concentration);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    return api.get(`/perfumes?${params.toString()}`);
  },
  
  getPerfumeById: (id: string): Promise<AxiosResponse<ApiResponse<{ perfume: Perfume }>>> =>
    api.get(`/perfumes/${id}`),
  
  createPerfume: (data: PerfumeFormData): Promise<AxiosResponse<ApiResponse<{ perfume: Perfume }>>> =>
    api.post('/perfumes', data),
  
  updatePerfume: (id: string, data: PerfumeFormData): Promise<AxiosResponse<ApiResponse<{ perfume: Perfume }>>> =>
    api.put(`/perfumes/${id}`, data),
  
  deletePerfume: (id: string): Promise<AxiosResponse<ApiResponse<{}>>> =>
    api.delete(`/perfumes/${id}`),
  
  addComment: (perfumeId: string, data: CommentFormData): Promise<AxiosResponse<ApiResponse<{ comment: any }>>> =>
    api.post(`/perfumes/${perfumeId}/comments`, data),
  
  updateComment: (perfumeId: string, commentId: string, data: CommentFormData): Promise<AxiosResponse<ApiResponse<{ comment: any }>>> =>
    api.put(`/perfumes/${perfumeId}/comments/${commentId}`, data),
  
  deleteComment: (perfumeId: string, commentId: string): Promise<AxiosResponse<ApiResponse<{}>>> =>
    api.delete(`/perfumes/${perfumeId}/comments/${commentId}`),
};

export default api;