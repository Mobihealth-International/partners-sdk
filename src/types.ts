/**
 * Configuration options for MobiHealthPartnerClient
 */
export interface MobiHealthPartnerClientConfig {
  /**
   * Base URL of the MobiHealth API
   * @example "https://api.mobihealth.com"
   */
  baseUrl: string;
  /**
   * Partner ID (UUID v4)
   */
  partnerId: string;
  /**
   * Partner secret key
   */
  partnerSecret: string;
  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;
}

/**
 * Request payload for identifying a partner user
 */
export interface IdentifyUserRequest {
  /**
   * User's email address (optional if phone_number is provided)
   */
  email?: string;
  /**
   * User's phone number (optional if email is provided)
   */
  phone_number?: string;
  /**
   * Country code for phone number
   */
  country_code?: string;
  /**
   * User's first name
   */
  first_name?: string;
  /**
   * User's last name
   */
  last_name?: string;
  /**
   * User's gender
   */
  gender?: string;
  /**
   * User's date of birth (ISO 8601 format)
   */
  date_of_birth?: string;
}

/**
 * Response from the identify user endpoint
 */
export interface IdentifyUserResponse {
  id: string;
  profile_id: string;
  public_id: string;
  email: string | null;
  phone_number: string | null;
  country_code: string | null;
  first_name: string | null;
  last_name: string | null;
  profile_picture: string | null;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

/**
 * API error response
 */
export interface ApiError {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Custom error class for API errors
 */
export class MobiHealthAPIError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "MobiHealthAPIError";
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, MobiHealthAPIError.prototype);
  }
}

