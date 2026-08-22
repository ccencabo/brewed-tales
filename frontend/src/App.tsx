import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./hooks/useAuth";
import Navbar from "./components/Navbar.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import CommunityShelf from "./pages/CommunityShelf.tsx";
import Library from "./pages/Library.tsx";
import Profile from "./pages/Profile.tsx";
import Exchanges from "./pages/Exchanges.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/community"
            element={
              <RequireAuth>
                <CommunityShelf />
              </RequireAuth>
            }
          />
          <Route
            path="/library"
            element={
              <RequireAuth>
                <Library />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/exchanges"
            element={
              <RequireAuth>
                <Exchanges />
              </RequireAuth>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
