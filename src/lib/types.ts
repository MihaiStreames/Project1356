/** A participant who joined the countdown. */
export interface Joiner {
	/** Display name chosen at join time. */
	name: string;
	/** Server timestamp of when they joined, in milliseconds. */
	joinedAt: number;
}
