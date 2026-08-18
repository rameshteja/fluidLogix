import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL, APP_CONFIG, HTTP_METHODS, HttpMethod, STORAGE_KEYS } from "./constant";
import { INITIAL_ROLES, CAPABILITY_CATEGORIES } from "@/data/capability-data";

/**
 * Standardized NestJS API Response Structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  error?: string | string[];
  timestamp?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * CallAPI Parameters Configuration
 */
export interface CallApiOptions<TData = any> {
  endpoint: string;
  method?: HttpMethod | "get" | "post" | "put" | "patch" | "delete";
  data?: TData;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  token?: string;
  isFormData?: boolean;
  timeout?: number;
  responseType?: AxiosRequestConfig["responseType"];
  onUploadProgress?: (progressEvent: any) => void;
  useMockFallback?: boolean; // Default true when backend is offline
}

/**
 * Unified Custom API Error
 */
export class ApiError extends Error {
  statusCode: number;
  errorDetails?: string | string[];
  data?: any;

  constructor(message: string, statusCode = 500, errorDetails?: string | string[], data?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
    this.data = data;
  }
}

/**
 * Helper to retrieve Auth Token from localStorage or Cookies
 */
export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const localToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (localToken) return localToken;

    // Fallback: Read token from document.cookie
    const match = document.cookie.match(new RegExp(`(^| )${STORAGE_KEYS.AUTH_TOKEN}=([^;]+)`));
    if (match) return decodeURIComponent(match[2]);
  } catch (e) {
    console.error("Failed to read auth token", e);
  }

  return null;
}

/**
 * Helper to set Auth Token to localStorage and Cookies
 */
export function setStoredAuthToken(token: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    // Set 7-day cookie for Next.js Middleware route evaluation
    document.cookie = `${STORAGE_KEYS.AUTH_TOKEN}=${encodeURIComponent(
      token
    )}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  } catch (e) {
    console.error("Failed to set auth token", e);
  }
}

/**
 * Helper to remove Auth Token
 */
export function removeStoredAuthToken(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    document.cookie = `${STORAGE_KEYS.AUTH_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch (e) {
    console.error("Failed to remove auth token", e);
  }
}

/**
 * Central Axios Instance for NestJS Backend
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: APP_CONFIG.DEFAULT_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-App-Client": "FluidLogix-Web",
    "X-App-Version": APP_CONFIG.APP_VERSION,
  },
});

/**
 * Request Interceptor: Attach Bearer Token & Active Role
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAuthToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (typeof window !== "undefined") {
      const activeRole = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
      if (activeRole) {
        config.headers["X-Active-Role"] = activeRole;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Formats NestJS responses & handles 401
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response as { status: number; data: any };

      let message = "An error occurred while processing your request.";
      let errorDetails: string | string[] | undefined = undefined;

      if (data) {
        if (typeof data.message === "string") {
          message = data.message;
        } else if (Array.isArray(data.message)) {
          message = data.message[0] || message;
          errorDetails = data.message;
        } else if (data.error) {
          message = typeof data.error === "string" ? data.error : message;
        }
      }

      return Promise.reject(new ApiError(message, status, errorDetails, data));
    } else if (error.request) {
      return Promise.reject(
        new ApiError(
          "Backend server not reachable. Utilizing dummy mock data engine.",
          0
        )
      );
    } else {
      return Promise.reject(new ApiError(error.message || "Unknown error", 500));
    }
  }
);

/**
 * =========================================================================
 * Intelligent Mock Data Engine (Provides dummy data when NestJS is offline)
 * =========================================================================
 */
function generateDummyDataResponse<T>(
  endpoint: string,
  method: string,
  data?: any,
  params?: any
): ApiResponse<T> {
  const normEndpoint = endpoint.toLowerCase();

  // 1. Auth: Login
  if (normEndpoint.includes("/auth/login")) {
    const demoToken = `fl_jwt_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setStoredAuthToken(demoToken);
    return {
      success: true,
      statusCode: 200,
      message: "Sign in successful! (Dummy Data)",
      data: {
        token: demoToken,
        user: {
          id: "usr-01",
          name: "Ramesh Teja (Admin)",
          email: data?.email || "admin@fluidlogix.com",
          role: data?.role || "SUPER_ADMIN",
        },
      } as unknown as T,
    };
  }

  // 2. Auth: Register
  if (normEndpoint.includes("/auth/register")) {
    return {
      success: true,
      statusCode: 201,
      message: "Account created successfully! (Dummy Data)",
      data: { id: `usr_${Date.now()}`, ...data } as unknown as T,
    };
  }

  // 3. Auth: Forgot Password & OTP
  if (normEndpoint.includes("/auth/forgot-password") || normEndpoint.includes("/auth/resend-otp")) {
    return {
      success: true,
      statusCode: 200,
      message: `6-digit verification code dispatched to ${data?.identifier || "your email/mobile"} (Demo OTP: 123456)`,
      data: { sent: true, expirySeconds: 600 } as unknown as T,
    };
  }

  if (normEndpoint.includes("/auth/verify-otp")) {
    return {
      success: true,
      statusCode: 200,
      message: "OTP Code verified successfully!",
      data: { verified: true, resetToken: `reset_${Date.now()}` } as unknown as T,
    };
  }

  if (normEndpoint.includes("/auth/reset-password")) {
    return {
      success: true,
      statusCode: 200,
      message: "Your password has been securely updated. You can now log in.",
      data: { updated: true } as unknown as T,
    };
  }

  // 4. Capabilities Matrix
  if (normEndpoint.includes("/capabilities/matrix") || normEndpoint.includes("/capabilities/roles")) {
    return {
      success: true,
      statusCode: 200,
      message: "Capabilities loaded successfully (Dummy Data)",
      data: INITIAL_ROLES as unknown as T,
      meta: { total: INITIAL_ROLES.length, page: 1, limit: 10 },
    };
  }

  // 5. General Fallback for all other endpoints
  return {
    success: true,
    statusCode: method === "POST" ? 201 : 200,
    message: `Operation for ${method} ${endpoint} completed successfully (Dummy Mock Data)`,
    data: (data ? { id: `item_${Date.now()}`, ...data } : { result: "ok", timestamp: new Date().toISOString() }) as unknown as T,
  };
}

/**
 * =========================================================================
 * Unified CallAPI Function
 * Handles GET, POST, PUT, PATCH, DELETE and FormData with automatic fallback
 * =========================================================================
 */
export async function CallAPI<TResponse = any, TBody = any>({
  endpoint,
  method = HTTP_METHODS.GET,
  data,
  params,
  headers = {},
  token,
  isFormData = false,
  timeout,
  responseType,
  onUploadProgress,
  useMockFallback = true,
}: CallApiOptions<TBody>): Promise<ApiResponse<TResponse>> {
  const normalizedMethod = (method.toUpperCase() as HttpMethod) || HTTP_METHODS.GET;

  const requestConfig: AxiosRequestConfig = {
    url: endpoint,
    method: normalizedMethod,
    headers: { ...headers },
    timeout: timeout || APP_CONFIG.DEFAULT_TIMEOUT_MS,
    responseType: responseType || "json",
    onUploadProgress,
  };

  // Override token if explicitly passed
  if (token) {
    requestConfig.headers = {
      ...requestConfig.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Handle Query Parameters
  if (params && Object.keys(params).length > 0) {
    requestConfig.params = params;
  }

  // Handle Request Body / Payload
  if (data !== undefined && data !== null) {
    if (isFormData) {
      if (data instanceof FormData) {
        requestConfig.data = data;
      } else if (typeof data === "object") {
        const formData = new FormData();
        Object.entries(data as Record<string, any>).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            if (val instanceof File || val instanceof Blob) {
              formData.append(key, val);
            } else if (Array.isArray(val)) {
              val.forEach((item, index) => formData.append(`${key}[${index}]`, item));
            } else if (typeof val === "object") {
              formData.append(key, JSON.stringify(val));
            } else {
              formData.append(key, String(val));
            }
          }
        });
        requestConfig.data = formData;
      }
      requestConfig.headers = {
        ...requestConfig.headers,
        "Content-Type": "multipart/form-data",
      };
    } else {
      requestConfig.data = data;
    }
  }

  try {
    const response: AxiosResponse = await axiosInstance.request(requestConfig);

    // Normalize NestJS response
    const resData = response.data;

    if (resData && typeof resData === "object" && ("data" in resData || "success" in resData)) {
      return {
        success: resData.success !== false,
        statusCode: resData.statusCode || response.status,
        message: resData.message,
        data: (resData.data !== undefined ? resData.data : resData) as TResponse,
        meta: resData.meta,
        error: resData.error,
      };
    }

    return {
      success: response.status >= 200 && response.status < 300,
      statusCode: response.status,
      data: resData as TResponse,
      message: response.statusText,
    };
  } catch (err: any) {
    // If backend is offline / connection refused, seamlessly provide mock dummy data
    if (useMockFallback && (err.statusCode === 0 || err.code === "ERR_NETWORK" || err.code === "ECONNREFUSED")) {
      console.info(
        `%c[FluidLogix API - Dummy Mock Data]%c ${normalizedMethod} ${endpoint}`,
        "color: #FFA500; font-weight: bold;",
        "color: inherit;"
      );
      return generateDummyDataResponse<TResponse>(endpoint, normalizedMethod, data, params);
    }

    if (err instanceof ApiError) {
      return {
        success: false,
        statusCode: err.statusCode,
        message: err.message,
        error: err.errorDetails || err.message,
        data: err.data as any,
      };
    }

    // Default mock fallback on 404 / 500 when testing without backend
    if (useMockFallback) {
      return generateDummyDataResponse<TResponse>(endpoint, normalizedMethod, data, params);
    }

    return {
      success: false,
      statusCode: err.response?.status || 500,
      message: err.message || "Request failed",
      error: err.message,
      data: null as any,
    };
  }
}

// Alias for CallAPI with lowercase convention
export const callAPI = CallAPI;

/**
 * Convenient Method Wrappers
 */
export const getAPI = <T = any>(endpoint: string, params?: Record<string, any>, options?: Partial<CallApiOptions>) =>
  CallAPI<T>({ endpoint, method: HTTP_METHODS.GET, params, ...options });

export const postAPI = <T = any, B = any>(endpoint: string, data?: B, options?: Partial<CallApiOptions<B>>) =>
  CallAPI<T, B>({ endpoint, method: HTTP_METHODS.POST, data, ...options });

export const putAPI = <T = any, B = any>(endpoint: string, data?: B, options?: Partial<CallApiOptions<B>>) =>
  CallAPI<T, B>({ endpoint, method: HTTP_METHODS.PUT, data, ...options });

export const patchAPI = <T = any, B = any>(endpoint: string, data?: B, options?: Partial<CallApiOptions<B>>) =>
  CallAPI<T, B>({ endpoint, method: HTTP_METHODS.PATCH, data, ...options });

export const deleteAPI = <T = any>(endpoint: string, params?: Record<string, any>, options?: Partial<CallApiOptions>) =>
  CallAPI<T>({ endpoint, method: HTTP_METHODS.DELETE, params, ...options });

export const uploadAPI = <T = any>(endpoint: string, formData: FormData, options?: Partial<CallApiOptions>) =>
  CallAPI<T>({ endpoint, method: HTTP_METHODS.POST, data: formData, isFormData: true, ...options });

export default CallAPI;
