import { database, analytics } from "$lib/firebase";
import { get, set, child, ref, serverTimestamp } from "firebase/database";
import { logEvent } from "firebase/analytics";
import { getClientId } from "$lib/client";

/** Record the current client as a countdown participant */
export async function joinCountdown(name: string): Promise<string> {
	const clientId = getClientId();
	const displayName = name !== "" ? name : "Anonymous";

	const snapshot = await get(child(ref(database), `participants/${clientId}`));
	const existingVal: unknown = snapshot.val();
	if (existingVal !== null) {
		return "already";
	}

	await set(child(ref(database), `participants/${clientId}`), {
		name: displayName,
		joinedAt: serverTimestamp(),
	});

	if (analytics !== null) {
		logEvent(analytics, "joined_countdown", { named: displayName !== "Anonymous" });
	}
	return "joined";
}

/** Check whether the current client has already joined */
export async function checkAlreadyJoined(): Promise<boolean> {
	const clientId = getClientId();
	const snapshot = await get(child(ref(database), `participants/${clientId}`));
	const val: unknown = snapshot.val();
	return val !== null;
}
