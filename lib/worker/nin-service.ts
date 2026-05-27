/**
 * Mock NIN lookup service — SERVER ONLY.
 *
 * Simulates a call to the NIMC identity verification API.
 * Returns a realistic NINLookupData object for any valid 11-digit NIN.
 *
 * Swap strategy: replace lookupNIN body with:
 *   GET /api/nimc/verify?nin=xxx  (or your backend proxy)
 * Shape of NINLookupData must match the real API response contract.
 */

import type { NINLookupData } from "./types";

function makeAvatar(firstName: string, lastName: string, hue: number): string {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  // HSL circle with readable white initials
  const bg = `hsl(${hue}, 55%, 40%)`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">` +
    `<circle cx="60" cy="60" r="60" fill="${bg}"/>` +
    `<text x="60" y="74" font-family="system-ui,Arial,sans-serif" font-size="46" ` +
    `font-weight="700" fill="white" text-anchor="middle">${initials}</text>` +
    `</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

const MOCK_NIN_DB: Record<string, NINLookupData> = {
  "12345678901": {
    nin: "12345678901",
    firstName: "Chioma",
    lastName: "Adeyemi",
    middleName: "Grace",
    phoneNumber: "+234 803 456 7890",
    location: "Lekki, Lagos State",
    photoUrl: makeAvatar("Chioma", "Adeyemi", 200),
    dateOfBirth: "1992-03-15",
    gender: "F",
  },
  "98765432101": {
    nin: "98765432101",
    firstName: "Emeka",
    lastName: "Okonkwo",
    middleName: "Chukwuemeka",
    phoneNumber: "+234 806 789 0123",
    location: "Enugu, Enugu State",
    photoUrl: makeAvatar("Emeka", "Okonkwo", 150),
    dateOfBirth: "1988-07-22",
    gender: "M",
  },
  "11223344556": {
    nin: "11223344556",
    firstName: "Aisha",
    lastName: "Muhammad",
    phoneNumber: "+234 802 345 6789",
    location: "Kano, Kano State",
    photoUrl: makeAvatar("Aisha", "Muhammad", 25),
    dateOfBirth: "1995-11-08",
    gender: "F",
  },
  "55667788990": {
    nin: "55667788990",
    firstName: "Tunde",
    lastName: "Adebayo",
    middleName: "Oluwatunde",
    phoneNumber: "+234 808 901 2345",
    location: "Ibadan, Oyo State",
    photoUrl: makeAvatar("Tunde", "Adebayo", 270),
    dateOfBirth: "1990-01-30",
    gender: "M",
  },
  "44332211009": {
    nin: "44332211009",
    firstName: "Ngozi",
    lastName: "Eze",
    phoneNumber: "+234 701 234 5678",
    location: "Onitsha, Anambra State",
    photoUrl: makeAvatar("Ngozi", "Eze", 320),
    dateOfBirth: "1993-05-17",
    gender: "F",
  },
};

const FIRST_NAMES_M  = ["Emeka", "Tunde", "Chidi", "Bayo", "Uche", "Seun", "Kola", "Femi"];
const FIRST_NAMES_F  = ["Ngozi", "Chioma", "Amaka", "Bola", "Kemi", "Funmi", "Ada", "Nneka"];
const LAST_NAMES     = ["Okonkwo", "Adeyemi", "Ibrahim", "Eze", "Okafor", "Adeleke", "Bello", "Ojo"];
const STATES         = ["Lagos State", "Abuja FCT", "Rivers State", "Kano State", "Oyo State", "Enugu State", "Anambra State", "Delta State"];
const AREA_PREFIXES  = ["Victoria Island", "Ikeja", "Owerri", "Port Harcourt", "Benin City", "Warri", "Kaduna", "Abeokuta"];

function deriveFromNIN(nin: string): NINLookupData {
  // Use NIN digits to deterministically pick profile attributes
  const d = nin.split("").map(Number);
  const isM = d[0] % 2 === 0;
  const names = isM ? FIRST_NAMES_M : FIRST_NAMES_F;
  const firstName = names[d[1] % names.length];
  const lastName  = LAST_NAMES[d[2] % LAST_NAMES.length];
  const state     = STATES[d[3] % STATES.length];
  const area      = AREA_PREFIXES[d[4] % AREA_PREFIXES.length];
  const hue       = (d[5] * 36 + d[6] * 10) % 360;

  const phoneSuffix = `${d[5]}${d[6]}${d[7]}${d[8]} ${d[9]}${d[0]}${d[1]}${d[2]}`;
  const prefixes = ["+234 802", "+234 803", "+234 806", "+234 808", "+234 701", "+234 704", "+234 805", "+234 907"];
  const prefix = prefixes[d[3] % prefixes.length];

  const year = 1975 + (d[4] * 5 + d[5] * 3) % 30;
  const month = String(1 + (d[6] % 12)).padStart(2, "0");
  const day   = String(1 + (d[7] % 28)).padStart(2, "0");

  return {
    nin,
    firstName,
    lastName,
    phoneNumber: `${prefix} ${phoneSuffix}`,
    location: `${area}, ${state}`,
    photoUrl: makeAvatar(firstName, lastName, hue),
    dateOfBirth: `${year}-${month}-${day}`,
    gender: isM ? "M" : "F",
  };
}

/**
 * Look up a NIN and return the associated identity record.
 * Returns null if the NIN is syntactically invalid (caller should validate first).
 *
 * Replace body with: GET /api/nimc/verify?nin=xxx
 */
export async function lookupNIN(nin: string): Promise<NINLookupData | null> {
  if (!/^\d{11}$/.test(nin)) return null;

  // Simulate realistic network latency
  await new Promise<void>((res) => setTimeout(res, 1_100));

  return MOCK_NIN_DB[nin] ?? deriveFromNIN(nin);
}
