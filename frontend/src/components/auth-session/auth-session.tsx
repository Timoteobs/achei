import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export function AuthSession() {
  const session = useAuthStore((state) => state.session);
  const router = useRouter();

  useEffect(() => {
    void router.invalidate();
    if (!session) return;

    let timer: ReturnType<typeof setTimeout>;
    const checkExpiration = () => {
      clearTimeout(timer);
      const auth = useAuthStore.getState();
      if (auth.session !== session) return;
      if (!auth.isAuthenticated()) {
        auth.signOut("expired");
        return;
      }

      const remaining = Date.parse(session.expiresAt) - Date.now();
      timer = setTimeout(
        checkExpiration,
        Math.min(Math.max(remaining, 0), 2147483647),
      );
    };

    checkExpiration();
    window.addEventListener("focus", checkExpiration);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", checkExpiration);
    };
  }, [session, router]);

  return null;
}
