import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowRightLeft,
  BookHeart,
  CalendarDays,
  LibraryBig,
  LogOut,
  Mail,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const joinedAt = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));
  const initials = user.displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const firstName = user.displayName.trim().split(/\s+/)[0] || "Reader";
  const cardNumber = `BT-${String(user.id).padStart(5, "0")}`;

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="paper-texture relative min-h-screen overflow-hidden px-4 pb-28 pt-36 sm:px-8 sm:pb-16 sm:pt-36">
      <div className="pointer-events-none fixed bottom-0 left-3 top-0 hidden flex-col justify-center gap-8 sm:flex">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="h-4 w-4 rounded-full border-2 border-border bg-background"
          />
        ))}
      </div>
      <div className="pointer-events-none fixed bottom-0 left-12 top-0 hidden w-px bg-dusty-rose/20 sm:block" />

      <main className="mx-auto max-w-5xl sm:pl-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-9 text-center"
        >
          <p className="font-handwritten text-lg uppercase tracking-[0.2em] text-primary">
            reader&apos;s journal
          </p>
          <h1 className="font-handwritten text-5xl font-semibold leading-none text-foreground sm:text-6xl">
            {firstName}&apos;s reading corner
          </h1>
          <div className="journal-divider mx-auto my-4 max-w-sm" />
          <p className="font-body text-sm italic text-muted-foreground">
            Your library card, saved stories, and reader-to-reader adventures—all in one place.
          </p>
        </motion.header>

        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <motion.section
            initial={{ opacity: 0, x: -20, rotate: -2 }}
            animate={{ opacity: 1, x: 0, rotate: -1 }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="relative overflow-hidden rounded-md border-2 border-primary/20 bg-secondary/80 p-6 shadow-journal sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-3 bg-primary/80" />
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[12px] border-primary/5" />

            <div className="relative flex items-center justify-between gap-4 border-b border-dashed border-border pb-5">
              <div>
                <p className="font-handwritten text-xs uppercase tracking-[0.22em] text-primary">
                  Brewed Tales
                </p>
                <p className="font-handwritten text-2xl text-foreground">Library card</p>
              </div>
              <BookHeart className="h-8 w-8 text-primary" />
            </div>

            <div className="relative py-7 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-primary/40 bg-background/70 font-handwritten text-4xl font-semibold text-primary shadow-sticker">
                {initials || "R"}
              </div>
              <h2 className="font-handwritten text-4xl leading-none text-foreground">
                {user.displayName}
              </h2>
              <p className="mt-2 break-all font-body text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>

            <dl className="relative grid grid-cols-2 gap-3 border-t border-dashed border-border pt-5">
              <div className="rounded-sm bg-background/55 p-3">
                <dt className="flex items-center gap-1.5 font-handwritten text-sm text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" /> issued
                </dt>
                <dd className="mt-1 font-body text-xs font-medium text-foreground">
                  {joinedAt}
                </dd>
              </div>
              <div className="rounded-sm bg-background/55 p-3">
                <dt className="font-handwritten text-sm text-muted-foreground">card no.</dt>
                <dd className="mt-1 font-body text-xs font-medium tracking-wider text-foreground">
                  {cardNumber}
                </dd>
              </div>
            </dl>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative rounded-sm border border-border bg-card/85 p-6 shadow-journal sm:p-8"
          >
            <div className="absolute -top-3 left-8 h-6 w-24 -rotate-2 rounded-sm bg-washi-mint/65" />

            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-handwritten text-lg text-primary">your next chapter</p>
                <h2 className="font-handwritten text-4xl font-semibold text-foreground">
                  Where would you like to go?
                </h2>
              </div>
              <Sparkles className="mt-2 hidden h-6 w-6 text-primary/60 sm:block" />
            </div>

            <div className="space-y-3">
              <Link
                to="/library"
                className="group flex items-center gap-4 rounded-sm border border-primary/20 bg-primary/5 p-4 transition hover:-translate-y-0.5 hover:bg-primary/10 hover:shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <LibraryBig className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-handwritten text-2xl text-foreground">My Library</span>
                  <span className="block font-body text-xs text-muted-foreground">Revisit your saved recommendations and matches.</span>
                </span>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>

              <Link
                to="/community"
                className="group flex items-center gap-4 rounded-sm border border-border bg-washi-pink/15 p-4 transition hover:-translate-y-0.5 hover:bg-washi-pink/25 hover:shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-primary/40 bg-background/70 text-primary">
                  <BookHeart className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-handwritten text-2xl text-foreground">Shelf Match</span>
                  <span className="block font-body text-xs text-muted-foreground">Discover a wrapped book from another reader.</span>
                </span>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>

              <Link
                to="/exchanges"
                className="group flex items-center gap-4 rounded-sm border border-border bg-washi-gold/15 p-4 transition hover:-translate-y-0.5 hover:bg-washi-gold/25 hover:shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-primary/40 bg-background/70 text-primary">
                  <ArrowRightLeft className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-handwritten text-2xl text-foreground">My Exchanges</span>
                  <span className="block font-body text-xs text-muted-foreground">Continue requests and book handoffs.</span>
                </span>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </div>

            <div className="mt-7 flex flex-col gap-4 border-t border-dashed border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate font-body text-xs">Signed in as {user.email}</span>
              </div>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-border px-4 py-2 font-handwritten text-lg text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Profile;
