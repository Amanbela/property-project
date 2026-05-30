const SESSION_KEY = "indore_session_id";

export function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export interface SessionData {
  sessionId: string;
  firstVisit: string;
}

export function getClientSession(): SessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as SessionData;
  } catch {
    /* ignore */
  }
  return null;
}

export function initClientSession(): SessionData {
  const existing = getClientSession();
  if (existing) {
    existing.firstVisit = existing.firstVisit || new Date().toISOString();
    localStorage.setItem(SESSION_KEY, JSON.stringify(existing));
    return existing;
  }

  const session: SessionData = {
    sessionId: generateSessionId(),
    firstVisit: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSessionId(): string {
  const session = getClientSession();
  return session?.sessionId || "";
}
