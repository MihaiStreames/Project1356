/** Pad a number to 2 digits with leading zero */
export const pad2 = (n: number): string => String(n).padStart(2, "0");
/** Clamp a number to the 0-1 range */
export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

/** Format a timestamp as a human-readable US locale string */
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
