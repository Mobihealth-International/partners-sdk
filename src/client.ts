import {
  MobiHealthPartnerClientConfig,
  IdentifyUserRequest,
  IdentifyUserResponse,
  ApiResponse,
  ApiError,
  MobiHealthAPIError,
} from "./types";

/**
 * MobiHealthPartnerClient - SDK for interacting with MobiHealth Partner API
 *
 * @example
 * ```typescript
 * const client = new MobiHealthPartnerClient({
 *   baseUrl: "https://api.mobihealth.com",
 *   partnerId: "your-partner-uuid",
 *   partnerSecret: "your-secret-key",
 * });
 *
 * const user = await client.identify({
 *   email: "user@example.com",
 *   first_name: "John",
 *   last_name: "Doe",
 * });
 * ```
 */
export class MobiHealthPartnerClient {
  private config: Required<MobiHealthPartnerClientConfig>;

  constructor(config: MobiHealthPartnerClientConfig) {
    this.validateConfig(config);

    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ""), // Remove trailing slash
      partnerId: config.partnerId,
      partnerSecret: config.partnerSecret,
      timeout: config.timeout ?? 30000,
    };
  }

  /**
   * Validates the client configuration
   */
  private validateConfig(config: MobiHealthPartnerClientConfig): void {
    if (!config.baseUrl) {
      throw new Error("baseUrl is required");
    }

    if (!config.partnerId) {
      throw new Error("partnerId is required");
    }

    if (!config.partnerSecret) {
      throw new Error("partnerSecret is required");
    }

    // Validate UUID v4 format
    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidV4Regex.test(config.partnerId)) {
      throw new Error("partnerId must be a valid UUID v4");
    }
  }

  /**
   * Makes an authenticated HTTP request to the API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    headers.set("X-PARTNER-ID", this.config.partnerId);
    headers.set("X-PARTNER-KEY", this.config.partnerSecret);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = data;
        throw new MobiHealthAPIError(
          error.message || "API request failed",
          response.status,
          error.errors
        );
      }

      const apiResponse: ApiResponse<T> = data;
      return apiResponse.data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof MobiHealthAPIError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        throw error;
      }

      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Identifies a partner user. If the user exists, returns the existing user.
   * If not, creates a new user and returns it.
   *
   * @param userData - User identification data
   * @returns User information
   * @throws {MobiHealthAPIError} If the API request fails
   *
   * @example
   * ```typescript
   * // Identify by email
   * const user = await client.identify({
   *   email: "user@example.com",
   *   first_name: "John",
   *   last_name: "Doe",
   *   gender: "male",
   *   date_of_birth: "1990-01-01",
   * });
   *
   * // Identify by phone number
   * const user = await client.identify({
   *   phone_number: "+1234567890",
   *   country_code: "US",
   *   first_name: "Jane",
   *   last_name: "Smith",
   * });
   * ```
   */
  public async identify(
    userData: IdentifyUserRequest
  ): Promise<IdentifyUserResponse> {
    // Validate that either email or phone_number is provided
    if (!userData.email && !userData.phone_number) {
      throw new Error("Either email or phone_number must be provided");
    }

    return this.request<IdentifyUserResponse>("/api/v1/public/identify/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }
}

