import { headers } from "next/headers";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function normalizeHost(host: string) {
  return host.replace(/:\d+$/, "").trim().toLowerCase();
}

export function isLocalHost(host?: string | null) {
  if (!host) return false;
  return LOCAL_HOSTS.has(normalizeHost(host));
}

export function isLocalRequest(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");
  return isLocalHost(host);
}

export async function isLocalPageRequest() {
  const headerStore = await headers();
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost || headerStore.get("host");
  return isLocalHost(host);
}
