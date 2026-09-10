export const TELEPHONY_ERRORS = {
  ERR_INVALID_RECIPIENT: "Please provide a valid recipient phone number.",
  ERR_NO_AGENT: "Please select a Voice Agent to place the call.",
  ERR_NO_CALLER_ID: "Please select or enter a connected Vobiz Caller ID number.",
  ERR_API_FAILURE: "Failed to initiate outbound call.",
  ERR_PREREQUISITES_FAILURE: "Failed to load voice agents or phone numbers. Please try again.",
} as const;

export type TelephonyErrorCode = keyof typeof TELEPHONY_ERRORS;
