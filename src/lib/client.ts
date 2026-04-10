/** Generate or retrieve a persistent anonymous client identifier */
export function getClientId(): string {
	const stored = localStorage.getItem("project1356-client-id");
	if (stored !== null) return stored;

	const bytes = new Uint8Array(8);
	crypto.getRandomValues(bytes);
	const id = `client_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
	localStorage.setItem("project1356-client-id", id);
	return id;
}
