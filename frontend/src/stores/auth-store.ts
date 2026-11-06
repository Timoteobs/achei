import { create } from "zustand";
import { toast } from "sonner";
import { persist } from "zustand/middleware";
import type { PersistStorage } from "zustand/middleware";
import type { AuthSession } from "../services/auth";
import { queryClient } from "../query-client";

interface PersistedAuth {
  session: AuthSession | null;
  rememberMe: boolean;
}

interface AuthState extends PersistedAuth {
  setSession: (session: AuthSession, rememberMe?: boolean) => void;
  signOut: (reason?: "expired") => void;
  isAuthenticated: () => boolean;
}

function isValidSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<AuthSession>;

  return (
    typeof session.accessToken === "string" &&
    session.accessToken.length > 0 &&
    typeof session.expiresAt === "string" &&
    Date.parse(session.expiresAt) > Date.now() &&
    !!session.user &&
    typeof session.user.id === "number" &&
    typeof session.user.name === "string" &&
    typeof session.user.email === "string"
  );
}

const storage: PersistStorage<PersistedAuth> = {
  getItem: (name) => {
    try {
      const value = localStorage.getItem(name) ?? sessionStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      const target = value.state.rememberMe ? localStorage : sessionStorage;
      const other = value.state.rememberMe ? sessionStorage : localStorage;
      other.removeItem(name);
      if (value.state.session) target.setItem(name, JSON.stringify(value));
      else target.removeItem(name);
    } catch {
      // Se o navegador bloquear o armazenamento, a sessão continua em memória.
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      rememberMe: false,
      setSession: (session, rememberMe = false) => {
        if (!isValidSession(session)) {
          throw new Error("Sessão inválida ou expirada.");
        }
        queryClient.clear();
        set({ session, rememberMe });
      },
      signOut: (reason) => {
        if (!get().session) return;
        queryClient.clear();
        set({ session: null, rememberMe: false });
        if (reason === "expired") {
          toast.warning("Sua sessão foi encerrada. Entre novamente.", {
            id: "auth-session-ended",
          });
        } else {
          toast.info("Você saiu da sua conta.");
        }
      },
      isAuthenticated: () => isValidSession(get().session),
    }),
    {
      name: "achei-auth",
      storage,
      partialize: ({ session, rememberMe }) => ({ session, rememberMe }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<PersistedAuth> | undefined;
        return {
          ...current,
          session: isValidSession(saved?.session) ? saved.session : null,
          rememberMe: saved?.rememberMe === true,
        };
      },
    },
  ),
);
