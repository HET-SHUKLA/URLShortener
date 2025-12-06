// ===============================
// TTL Helpers
// ===============================

import { DAY } from "../constants";

/**
 * Convert days to milli seconds
 * @param days Number of Days
 * @returns Milliseconds in number
 */
export const daysToMs = (days: number): number => days * DAY;

/**
 * Convert days to seconds
 * @param days Number of Days
 * @returns Seconds in number
 */
export const daysToSeconds = (days: number): number => days * 24 * 60 * 60;

/**
 * Adds Milliseconds to current Date and Time
 * @param ms Milliseconds in number
 * @returns Date
 */
export const addMsToNow = (ms: number): Date => new Date(Date.now() + ms);

/**
 * Expiration X days from now 
 * @param days Number of Days
 * @returns Date
 */
export const expiresInDays = (days: number): Date => addMsToNow(daysToMs(days));
