import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  type AuthUser,
} from "../lib/auth";

interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterInput {
  email: string;
  displayName: string;
  password: string;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetchCurrentUser(controller.signal)
      .then(setUser)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Could not restore the current session", error);
        setUser(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      login: async (input) => {
        const authenticatedUser = await loginRequest(input);
        setUser(authenticatedUser);
        return authenticatedUser;
      },
      register: async (input) => {
        const authenticatedUser = await registerRequest(input);
        setUser(authenticatedUser);
        return authenticatedUser;
      },
      signOut: async () => {
        try {
          await logoutRequest();
        } finally {
          setUser(null);
        }
      },
    }),
    [loading, user],
  );

  return (
    <Ctx.Provider value={value}>{children}</Ctx.Provider>
  );
};

export const useAuth = (): AuthCtx => {
  const context = useContext(Ctx);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
