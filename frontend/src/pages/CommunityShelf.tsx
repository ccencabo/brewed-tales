import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import WrappedBookSVG from "../components/WrappedBookSVG";
import ListBookForm from "../components/ListBookForm";
import { toast } from "sonner";

interface Listing {
  id: string;
  user_id: string;
  cover_color: string;
  emoji: string;
  hook1: string;
  hook2: string;
  hook3: string;
  ingredients: string[];
  status: string;
  matched_by: string | null;
  created_at: string;
  owner_email?: string;
  owner_name?: string;
}

// Mock data to keep the shelf populated for UI testing
const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    user_id: "mock-user-1",
    cover_color: "bg-sage",
    emoji: "🌿",
    hook1: "A secluded cabin in the woods...",
    hook2: "Someone is watching from the trees.",
    hook3: "The protagonist has a dark secret.",
    ingredients: ["matcha", "honey"],
    status: "available",
    matched_by: null,
    created_at: new Date().toISOString(),
    owner_email: "reader1@example.com",
    owner_name: "Alice",
  },
  {
    id: "2",
    user_id: "mock-user-2",
    cover_color: "bg-dusty-rose",
    emoji: "💌",
    hook1: "Enemies who must share one horse.",
    hook2: "A kingdom on the brink of war.",
    hook3: "They slowly realize they are soulmates.",
    ingredients: ["earl grey", "lavender"],
    status: "available",
    matched_by: null,
    created_at: new Date().toISOString(),
    owner_email: "reader2@example.com",
    owner_name: "Ben",
  },
];

const tilts = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];

const CommunityShelf = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Initialize with mock data to simulate an active community
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [showForm, setShowForm] = useState(false);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [matchedContact, setMatchedContact] = useState<{
    email: string;
    name?: string;
  } | null>(null);

  useEffect(() => {
    // If not loading and no user exists, redirect to auth
    if (!loading && !user) {
      // Bypassing strict redirect for local UI testing, but keeping logic intact.
      // navigate("/auth");
    }
  }, [user, loading, navigate]);

  const loadListings = () => {
    // In a real app this would re-fetch. Here we just ensure we have our mock data.
    if (listings.length === 0) {
      setListings(MOCK_LISTINGS);
    }
  };

  const handleMatch = (listing: Listing) => {
    // Update local state to simulate matching
    setListings((prev) =>
      prev.map((l) =>
        l.id === listing.id
          ? { ...l, status: "matched", matched_by: user?.id || "local-user" }
          : l,
      ),
    );

    setMatchedContact({
      email: listing.owner_email || "reader@example.com",
      name: listing.owner_name || "A fellow reader",
    });

    toast.success("Saved to your library 📖");
  };

  const handleDelete = (id: string) => {
    // Update local state to simulate deletion
    setListings((prev) => prev.filter((l) => l.id !== id));
    toast("Book removed from the shelf ♡");
  };

  if (loading) return null; // Or a loading spinner

  return (
    <div className="min-h-screen paper-texture px-4 py-10 relative">
      <div className="fixed left-3 top-0 bottom-0 flex flex-col justify-center gap-8 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2 border-border bg-background"
          />
        ))}
      </div>
      <div className="fixed left-12 top-0 bottom-0 w-px bg-dusty-rose/20 pointer-events-none" />

      <header className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <Link
          to="/"
          className="font-handwritten text-lg text-muted-foreground hover:text-primary"
        >
          ← home
        </Link>
        <button
          onClick={signOut}
          className="font-handwritten text-base text-muted-foreground hover:text-primary"
        >
          sign out
        </button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 max-w-2xl mx-auto"
      >
        <p className="font-handwritten text-lg text-muted-foreground/60">
          ~ peer-to-peer ~
        </p>
        <h1 className="font-handwritten text-5xl md:text-6xl text-foreground">
          The Community Shelf
        </h1>
        <div className="journal-divider w-56 mx-auto my-3" />
        <p className="font-body italic text-muted-foreground">
          Wrap a book you love, leave three hints, and let a stranger fall for
          it.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto flex justify-center mb-10">
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-3 rounded-sm bg-primary text-primary-foreground font-handwritten text-2xl
            shadow-journal hover:shadow-warm hover:-translate-y-0.5 transition border border-primary/20"
        >
          ✎ List a Wrapped Book
        </button>
      </div>

      {listings.length === 0 ? (
        <p className="text-center font-handwritten text-2xl text-muted-foreground/60 mt-16">
          The shelf is empty… be the first to wrap a book ♡
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {listings.map((l, i) => {
            const isOwn = user && l.user_id === user.id;
            const isMatched = l.status === "matched";
            const revealed = revealedId === l.id;

            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex flex-col items-center ${tilts[i % tilts.length]}`}
              >
                <AnimatePresence mode="wait">
                  {!revealed ? (
                    <motion.button
                      key="wrap"
                      onClick={() => setRevealedId(l.id)}
                      exit={{ rotateY: 90, opacity: 0 }}
                      className="cursor-pointer"
                    >
                      <div
                        className="animate-gentle-bounce"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      >
                        <WrappedBookSVG
                          color={l.cover_color}
                          emoji={l.emoji}
                          className="w-40 h-56 drop-shadow-lg"
                        />
                      </div>
                      <p className="mt-3 font-handwritten text-base text-muted-foreground">
                        {isMatched ? "💌 matched" : "tap to peek ✦"}
                      </p>
                      <p className="font-handwritten text-sm text-muted-foreground/60">
                        from {l.owner_name || "a reader"}
                      </p>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      className="w-full bg-card rounded-sm shadow-journal border border-border p-5 dog-ear relative"
                    >
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 rounded-sm bg-washi-mint/40" />
                      <span className="text-4xl block text-center mb-2 mt-1">
                        {l.emoji}
                      </span>
                      <p className="text-center font-handwritten text-sm text-muted-foreground mb-3">
                        from {l.owner_name || "a reader"}
                      </p>
                      <div className="journal-divider mb-3" />
                      <div className="space-y-2 mb-3">
                        {[l.hook1, l.hook2, l.hook3].map((h, hi) => (
                          <p
                            key={hi}
                            className="text-sm font-body italic text-muted-foreground flex gap-2"
                          >
                            <span className="text-accent font-handwritten">
                              ✦
                            </span>{" "}
                            {h}
                          </p>
                        ))}
                      </div>
                      {l.ingredients.length > 0 && (
                        <p className="text-xs font-handwritten text-muted-foreground/70 mb-3">
                          tea notes: {l.ingredients.join(" · ")}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRevealedId(null)}
                          className="flex-1 py-2 rounded-sm border border-border font-handwritten text-base hover:bg-secondary"
                        >
                          Pass
                        </button>
                        {isOwn ? (
                          <button
                            onClick={() => handleDelete(l.id)}
                            className="flex-1 py-2 rounded-sm border border-destructive/30 text-destructive font-handwritten text-base"
                          >
                            Remove
                          </button>
                        ) : isMatched ? (
                          <span className="flex-1 py-2 rounded-sm bg-muted text-center font-handwritten text-base">
                            Matched 💘
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMatch(l)}
                            className="flex-1 py-2 rounded-sm bg-primary text-primary-foreground font-handwritten text-lg hover:shadow-warm"
                          >
                            It's a Match 💘
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <ListBookForm
            onClose={() => setShowForm(false)}
            onCreated={() => {
              setShowForm(false);
              loadListings();
            }}
          />
        )}
        {matchedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setMatchedContact(null)}
          >
            <motion.div
              initial={{ scale: 0.9, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-sm shadow-warm border border-border p-8 max-w-md w-full text-center relative dog-ear"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-washi-pink/50 -rotate-2 rounded-sm" />
              <p className="text-5xl mb-3">💌</p>
              <h2 className="font-handwritten text-3xl mb-2">It's a match!</h2>
              <p className="font-body italic text-muted-foreground mb-4">
                Reach out to {matchedContact.name || "your fellow reader"} to
                arrange the swap:
              </p>
              <p className="font-handwritten text-2xl text-primary break-all mb-5">
                {matchedContact.email}
              </p>
              <button
                onClick={() => setMatchedContact(null)}
                className="px-6 py-2 rounded-sm bg-primary text-primary-foreground font-handwritten text-xl"
              >
                Lovely ♡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityShelf;
