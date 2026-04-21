import { database, analytics } from "$lib/firebase";
import { get, set, child, ref, serverTimestamp } from "firebase/database";
import { logEvent } from "firebase/analytics";
import { getClientId } from "$lib/client";

/**
 * Record the current client as a countdown participant.
 *
 * Checks for an existing entry before writing to avoid duplicates.
 * Logs a Firebase Analytics event on successful join.
 *
 * @param name - Display name for the participant, or empty for "Anonymous".
 */
export async function joinCountdown(name: string): Promise<void> {
  const clientId = getClientId();
  const displayName = name !== "" ? name : "Anonymous";
  const entryRef = child(ref(database), `participants/${clientId}`);

  const snapshot = await get(entryRef);
  if (snapshot.val() !== null) return;

  await set(entryRef, {
    name: displayName,
    joinedAt: serverTimestamp(),
  });

  if (analytics !== null) {
    logEvent(analytics, "joined_countdown", { named: displayName !== "Anonymous" });
  }
}

/**
 * Check whether the current client has already joined the countdown.
 *
 * @returns True if a participant entry exists for this client.
 */
export async function checkAlreadyJoined(): Promise<boolean> {
  const clientId = getClientId();
  const snapshot = await get(child(ref(database), `participants/${clientId}`));
  const val: unknown = snapshot.val();
  return val !== null;
}
