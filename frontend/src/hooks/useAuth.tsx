import { createContext, useContext, useState, ReactNode } from "react";

// Mock types to replace Supabase's types so your other components don't break
export interface User {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}

export interface Session {
  access_token: string;
  user: User;
}

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // If you want to bypass the login screen entirely for testing,
  // you can replace `null` with a mock session object here.
  const [session, setSession] = useState<Session | null>(null);
  const [loading] = useState(false);

  return (
    <Ctx.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        signOut: async () => {
          setSession(null);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
