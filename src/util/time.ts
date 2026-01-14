// ===============================
// TTL Helpers
// ===============================

import { DAY, HOUR } from "../constants";

/**
 * Convert days to milli seconds
 * @param days Number of Days
 * @returns Milliseconds in number
 */
export const daysToMs = (days: number): number => days * DAY;

/**
 * Convert Hours to milli seconds
 * @param hrs Number of Hours
 * @returns Milliseconds in number
 */
export const hrsToMs = (hrs: number): number => hrs * HOUR;

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

/**
 * Expiration X hrs from now
 * @param hrs Number of Hours
 * @returns Date
 */
export const expiresInHrs = (hrs: number): Date => addMsToNow(hrsToMs(hrs));

/**
 * Checks whether a given date is expired compared to the current time.
 *
 * @param expiresAt - The expiration date (typically from Prisma)
 * @param now - Optional override for current time (useful for testing)
 * @returns true if the date is expired, false otherwise
 */
export function isDateExpired(
    expiresAt: Date,
    now: Date = new Date()
): boolean {
    return expiresAt.getTime() <= now.getTime()
}

