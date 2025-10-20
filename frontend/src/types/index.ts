export interface Member {
  _id?: string;
  id?: string; // Backend sometimes returns 'id' instead of '_id'
  email: string;
  name: string;
  YOB: number;
  gender: boolean;
  isAdmin: boolean;
  provider?: 'local' | 'google'; // OAuth provider
  googleId?: string; // Google user ID
  avatar?: string; // Profile picture URL
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  _id: string;
  brandName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  rating: number;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Perfume {
  _id: string;
  perfumeName: string;
  uri: string;
  price: number;
  concentration: "Extrait" | "EDP" | "EDT" | "EDC";
  description: string;
  ingredients: string;
  volume: number;
  targetAudience: "male" | "female" | "unisex";
  comments: Comment[];
  brand: Brand;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    member: Member;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    current: number;
    total: number;
    count: number;
    totalItems: number;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  YOB: number;
  gender: boolean;
}

export interface UpdateProfileFormData {
  name: string;
  YOB: number;
  gender: boolean;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CommentFormData {
  rating: number;
  content: string;
}

export interface PerfumeFormData {
  perfumeName: string;
  uri: string;
  price: number;
  concentration: "Extrait" | "EDP" | "EDT" | "EDC";
  description: string;
  ingredients: string;
  volume: number;
  targetAudience: "male" | "female" | "unisex";
  brand: string;
}

export interface BrandFormData {
  brandName: string;
}

export interface SearchFilters {
  search?: string;
  brand?: string;
  targetAudience?: "male" | "female" | "unisex";
  concentration?: "Extrait" | "EDP" | "EDT" | "EDC";
  page?: number;
  limit?: number;
}

export interface UserReview {
  _id: string;
  perfumeId: string;
  perfumeName: string;
  perfumeImage: string;
  brandName: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  perfume: Perfume;
  quantity: number;
}
