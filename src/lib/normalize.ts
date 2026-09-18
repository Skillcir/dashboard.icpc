// Canonical state names, matching the college DB's spelling.
export const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

// Maps a map-layer's NAME_1 property to the canonical state name used by the college DB.
export const MAP_STATE_ALIASES: Record<string, string> = {
  Orissa: "Odisha",
  Uttaranchal: "Uttarakhand",
  "Jammu and Kashmir": "Jammu & Kashmir",
};

export function canonicalStateName(mapName: string): string {
  return MAP_STATE_ALIASES[mapName] ?? mapName;
}

/** Normalizes an institution name for fuzzy matching: lowercase, strip
 * punctuation and common filler words, collapse whitespace. */
export function normalizeInstitution(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[.,'()]/g, "")
    .replace(/\b(the|of)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
