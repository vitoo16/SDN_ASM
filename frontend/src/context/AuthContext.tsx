import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Member, LoginFormData, RegisterFormData } from "../types";
import { authAPI } from "../services/api";

interface AuthState {
  user: Member | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Member) => void;
  updateProfile: (data: {
    name: string;
    YOB: number;
    gender: boolean;
  }) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: Member; token: string } }
  | { type: "AUTH_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Member };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Helper function to normalize user object (handle both 'id' and '_id')
  const normalizeUser = (user: Member): Member => {
    if (user.id && !user._id) {
      return { ...user, _id: user.id };
    }
    if (user._id && !user.id) {
      return { ...user, id: user._id };
    }
    return user;
  };

  // Helper function to get user ID (handle both 'id' and '_id')
  const getUserId = (user: Member): string => {
    return user._id || user.id || "";
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          // Verify token is still valid by making a request
          const response = await authAPI.getProfile();
          const freshUser = normalizeUser(response.data.data.member);

          // Update localStorage with fresh normalized data
          localStorage.setItem("user", JSON.stringify(freshUser));
          dispatch({
            type: "AUTH_SUCCESS",
            payload: { user: freshUser, token },
          });
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch({ type: "AUTH_FAILURE" });
        }
      } else {
        dispatch({ type: "AUTH_FAILURE" });
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginFormData) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authAPI.login(data);
      const { member, token } = response.data.data;

      const normalizedUser = normalizeUser(member);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: normalizedUser, token },
      });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authAPI.register(data);
      const { member, token } = response.data.data;

      const normalizedUser = normalizeUser(member);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: normalizedUser, token },
      });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (user: Member) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "UPDATE_USER", payload: user });
  };

  const updateProfile = async (data: {
    name: string;
    YOB: number;
    gender: boolean;
  }) => {
    try {
      if (!state.user) {
        throw new Error("User not authenticated");
      }

      const userId = getUserId(state.user);
      if (!userId) {
        throw new Error("User ID is missing. Please log out and log in again.");
      }

      const response = await authAPI.updateProfile(userId, data);
      const updatedUser = normalizeUser(response.data.data.member);
      updateUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      if (!state.user) {
        throw new Error("User not authenticated");
      }

      const userId = getUserId(state.user);
      if (!userId) {
        throw new Error("User ID is missing. Please log out and log in again.");
      }

      await authAPI.changePassword(userId, {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
