import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BellRing, LogIn, UserRound } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchExchanges } from "../lib/exchanges";

const Navbar = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [pendingExchanges, setPendingExchanges] = useState(0);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    fetchExchanges(controller.signal)
      .then((exchanges) =>
        setPendingExchanges(
          exchanges.filter((exchange) => exchange.actionRequired).length,
        ),
      )
      .catch(() => undefined);
    return () => controller.abort();
  }, [user]);

  if (["/auth", "/login", "/signup"].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-40 h-24 border-b border-border/70 bg-background/95 shadow-sm backdrop-blur-md"
      />

      {/* Top-left Logo */}
      <Link
        to="/"
        className="group fixed left-16 top-4 z-50 flex items-center gap-3 rounded-sm px-2 py-1 transition-colors hover:bg-card/70 md:left-24"
      >
        <motion.svg
          viewBox="0 0 64 64"
          className="w-10 h-10 md:w-12 md:h-12 drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          whileHover={{ rotate: -5, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Book */}
          <rect
            x="8"
            y="44"
            width="48"
            height="12"
            rx="2"
            fill="hsl(18 65% 45%)"
            stroke="hsl(25 30% 18%)"
            strokeWidth="2"
          />
          <rect
            x="8"
            y="44"
            width="6"
            height="12"
            rx="1"
            fill="hsl(18 65% 38%)"
          />
          <line
            x1="18"
            y1="50"
            x2="50"
            y2="50"
            stroke="hsl(40 45% 97% / 0.3)"
            strokeWidth="1"
          />

          {/* Coffee Cup */}
          <path
            d="M24 28 L26 44 Q32 46 38 44 L40 28 Z"
            fill="hsl(37 45% 92%)"
            stroke="hsl(25 30% 18%)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M40 32 Q46 32 46 36 Q46 40 40 40"
            stroke="hsl(25 30% 18%)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Animated Steam */}
          <motion.path
            d="M28 22 Q30 16 26 10"
            stroke="hsl(25 15% 55%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M36 20 Q38 14 34 8"
            stroke="hsl(25 15% 55%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            animate={{ opacity: [0.1, 0.6, 0.1], y: [0, -4, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.svg>

        <span className="font-handwritten text-2xl md:text-3xl text-foreground tracking-wide mt-1">
          Brewed Tales
        </span>
      </Link>

      {/* Top-right Navigation - Journal Label Style */}
      <nav
        aria-label="Main navigation"
        className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-2 overflow-x-auto whitespace-nowrap rounded-sm border-2 border-dashed border-border/50 bg-background/90 px-3 py-2 shadow-sm backdrop-blur-sm transition-transform sm:bottom-auto sm:left-auto sm:right-6 sm:top-6 sm:max-w-none sm:translate-x-0 sm:rotate-1 sm:gap-4 sm:overflow-visible sm:px-6 sm:py-3 sm:hover:rotate-0 md:right-12"
      >
        {/* Washi tape holding the navbar */}
        <div className="absolute -top-3 left-4 w-12 h-5 bg-washi-pink/40 -rotate-6 pointer-events-none rounded-sm" />
        <div className="absolute -top-2 right-4 w-10 h-4 bg-washi-mint/40 rotate-6 pointer-events-none rounded-sm" />

        {!loading && user ? (
          <>
            <NavLink
              to="/community"
              className={({ isActive }) =>
                `font-handwritten text-lg transition-all hover:-translate-y-0.5 hover:text-primary md:text-xl ${
                  isActive
                    ? "text-primary underline decoration-dashed underline-offset-4"
                    : "text-foreground"
                }`
              }
            >
              Shelf Match
            </NavLink>

            <div className="h-6 w-px rotate-12 bg-border/60" />

            <NavLink
              to="/exchanges"
              className={({ isActive }) =>
                `relative flex items-center gap-1 font-handwritten text-lg transition-all hover:-translate-y-0.5 hover:text-primary md:text-xl ${
                  isActive
                    ? "text-primary underline decoration-dashed underline-offset-4"
                    : "text-foreground"
                }`
              }
            >
              <BellRing className="h-4 w-4" /> Exchanges
              {pendingExchanges > 0 && (
                <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-body text-[10px] text-primary-foreground">
                  {pendingExchanges}
                </span>
              )}
            </NavLink>

            <div className="h-6 w-px rotate-12 bg-border/60" />

            <NavLink
              to="/library"
              className={({ isActive }) =>
                `font-handwritten text-lg transition-all hover:-translate-y-0.5 hover:text-primary md:text-xl ${
                  isActive
                    ? "text-primary underline decoration-dashed underline-offset-4"
                    : "text-foreground"
                }`
              }
            >
              My Library
            </NavLink>

            <div className="h-6 w-px rotate-12 bg-border/60" />

            <NavLink
              to="/profile"
              aria-label={`${user.displayName}'s profile`}
              className={({ isActive }) =>
                `flex items-center gap-1.5 font-handwritten text-lg transition-all hover:-translate-y-0.5 hover:text-primary md:text-xl ${
                  isActive
                    ? "text-primary underline decoration-dashed underline-offset-4"
                    : "text-foreground"
                }`
              }
            >
              <UserRound className="h-5 w-5" />
              <span>Profile</span>
            </NavLink>
          </>
        ) : !loading ? (
          <>
            <Link
              to="/login"
              className="flex items-center gap-1.5 font-handwritten text-lg text-foreground transition-all hover:-translate-y-0.5 hover:text-primary md:text-xl"
            >
              <LogIn className="h-4 w-4" /> Log in
            </Link>
            <div className="h-6 w-px rotate-12 bg-border/60" />
            <Link
              to="/signup"
              className="rounded-sm bg-primary px-3 py-1 font-handwritten text-lg text-primary-foreground transition hover:shadow-warm md:text-xl"
            >
              Join
            </Link>
          </>
        ) : (
          <span className="font-handwritten text-lg text-muted-foreground">
            Checking card...
          </span>
        )}
      </nav>
    </>
  );
};

export default Navbar;
