import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types';
import { getCurrentUser, login, register } from '../api/api';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

// Action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'REGISTER_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'AUTH_ERROR' }
  | { type: 'LOGIN_FAIL'; payload: string }
  | { type: 'REGISTER_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERRORS' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.type === 'AUTH_ERROR' ? 'Authentication error' : action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create context
interface AuthContextProps {
  state: AuthState;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  loadUser: () => Promise<void>;
  logout: () => void;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on initial render if token exists
  useEffect(() => {
    const loadUserOnMount = async () => {
      if (localStorage.getItem('token')) {
        await loadUser();
      } else {
        dispatch({ type: 'AUTH_ERROR' });
      }
    };

    loadUserOnMount();
  }, []);

  // Load user
  const loadUser = async () => {
    try {
      const res = await getCurrentUser();
      dispatch({ type: 'USER_LOADED', payload: res.data.user });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register user
  const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const res = await register({ firstName, lastName, email, password });
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
    } catch (err: any) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.error || 'Registration failed'
      });
    }
  };

  // Login user
  const loginUser = async (email: string, password: string) => {
    try {
      const res = await login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
    } catch (err: any) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.error || 'Invalid credentials'
      });
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        loginUser,
        registerUser,
        loadUser,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
