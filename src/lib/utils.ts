/** Pad a number to two digits with a leading zero. */
export const pad2 = (n: number): string => String(n).padStart(2, "0");
/** Clamp a value to the 0-1 range. */
export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

/**
 * Format a Unix timestamp as a human-readable US-locale date string.
 *
 * @param timestamp - Unix timestamp in milliseconds.
 * @returns Formatted string like "January 7, 2026, 12:00:00 AM".
 */
export function formatDate(timestamp: number): string {
	return new Date(timestamp).toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});
}
