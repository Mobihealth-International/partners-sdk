# MobiHealth Partners SDK

TypeScript/JavaScript SDK for interacting with the MobiHealth Partner API.

## Installation

```bash
npm install partners-sdk
# or
pnpm add partners-sdk
# or
yarn add partners-sdk
```

## Quick Start

```typescript
import { MobiHealthPartnerClient } from "partners-sdk";

// Initialize the client
const client = new MobiHealthPartnerClient({
  baseUrl: "https://api.mobihealth.com",
  partnerId: "your-partner-uuid",
  partnerSecret: "your-secret-key",
});

// Identify a user
const user = await client.identify({
  email: "user@example.com",
  first_name: "John",
  last_name: "Doe",
  gender: "male",
  date_of_birth: "1990-01-01",
});

console.log(user);
```

## API Reference

### MobiHealthPartnerClient

#### Constructor

```typescript
new MobiHealthPartnerClient(config: MobiHealthPartnerClientConfig)
```

**Config Options:**

- `baseUrl` (string, required): Base URL of the MobiHealth API
- `partnerId` (string, required): Partner ID (UUID v4)
- `partnerSecret` (string, required): Partner secret key
- `timeout` (number, optional): Request timeout in milliseconds (default: 30000)

#### Methods

##### `identify(userData: IdentifyUserRequest): Promise<IdentifyUserResponse>`

Identifies a partner user. If the user exists, returns the existing user. If not, creates a new user and returns it.

**Parameters:**

- `userData` (IdentifyUserRequest):
  - `email` (string, optional): User's email address
  - `phone_number` (string, optional): User's phone number
  - `country_code` (string, optional): Country code for phone number
  - `first_name` (string, optional): User's first name
  - `last_name` (string, optional): User's last name
  - `gender` (string, optional): User's gender
  - `date_of_birth` (string, optional): User's date of birth (ISO 8601 format)

**Note:** Either `email` or `phone_number` must be provided.

**Returns:** Promise resolving to `IdentifyUserResponse` containing user information.

**Throws:** `MobiHealthAPIError` if the API request fails.

**Example:**

```typescript
// Identify by email
const user = await client.identify({
  email: "user@example.com",
  first_name: "John",
  last_name: "Doe",
});

// Identify by phone number
const user = await client.identify({
  phone_number: "+1234567890",
  country_code: "US",
  first_name: "Jane",
  last_name: "Smith",
});
```

## Error Handling

The SDK throws `MobiHealthAPIError` for API errors:

```typescript
import { MobiHealthAPIError } from "partners-sdk";

try {
  const user = await client.identify({ email: "user@example.com" });
} catch (error) {
  if (error instanceof MobiHealthAPIError) {
    console.error(`API Error (${error.statusCode}): ${error.message}`);
    console.error("Validation errors:", error.errors);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Development

### Building

```bash
npm run build
```

### Generating API Types

```bash
npm run generate:api
```

## License

GPL-3.0-or-later
