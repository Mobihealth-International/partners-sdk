/**
 * Example usage of MobiHealthPartnerClient
 * 
 * This file demonstrates how to use the SDK to identify partner users.
 */

import { MobiHealthPartnerClient, MobiHealthAPIError } from "../src";

async function main() {
  // Initialize the client
  const client = new MobiHealthPartnerClient({
    baseUrl: process.env.MOBIHEALTH_API_URL || "https://api.mobihealth.com",
    partnerId: process.env.PARTNER_ID || "",
    partnerSecret: process.env.PARTNER_SECRET || "",
  });

  try {
    // Example 1: Identify a user by email
    console.log("Identifying user by email...");
    const user1 = await client.identify({
      email: "john.doe@example.com",
      first_name: "John",
      last_name: "Doe",
      gender: "male",
      date_of_birth: "1990-01-01",
    });
    console.log("User identified:", user1);

    // Example 2: Identify a user by phone number
    console.log("\nIdentifying user by phone number...");
    const user2 = await client.identify({
      phone_number: "+1234567890",
      country_code: "US",
      first_name: "Jane",
      last_name: "Smith",
    });
    console.log("User identified:", user2);

    // Example 3: Error handling
    console.log("\nAttempting to identify user without email or phone...");
    try {
      await client.identify({
        first_name: "Test",
      });
    } catch (error) {
      if (error instanceof MobiHealthAPIError) {
        console.error(`API Error (${error.statusCode}): ${error.message}`);
        if (error.errors) {
          console.error("Validation errors:", error.errors);
        }
      } else {
        console.error("Error:", error);
      }
    }
  } catch (error) {
    if (error instanceof MobiHealthAPIError) {
      console.error(`API Error (${error.statusCode}): ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

