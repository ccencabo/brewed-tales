import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BookHeart, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import WrappedBookSVG from "../components/WrappedBookSVG";
import ListBookForm from "../components/ListBookForm";
import CommunityMatchFinder, {
  type ShelfMatchListing,
} from "../components/CommunityMatchFinder";

interface Listing extends ShelfMatchListing {
  user_id: string;
  matched_by: string | null;
  created_at: string;
  owner_email?: string;
}

// Frontend-only sample profiles. The backend can later provide these tags with each listing.
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
    match_tags: ["mystery", "tense", "secrets", "atmospheric", "twisty"],
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
    match_tags: ["romance", "heartfelt", "adventure", "character", "slow-burn"],
    status: "available",
    matched_by: null,
    created_at: new Date().toISOString(),
    owner_email: "reader2@example.com",
    owner_name: "Ben",
  },
  {
    id: "3",
    user_id: "mock-user-3",
    cover_color: "bg-warm",
    emoji: "🐉",
    hook1: "A map that redraws itself every midnight.",
    hook2: "A reluctant hero with a very opinionated dragon.",
    hook3: "The last door home may already be closing.",
    ingredients: ["spiced chai", "orange peel"],
    match_tags: ["fantasy", "adventure", "escape", "fast", "witty"],
    status: "available",
    matched_by: null,
    created_at: new Date().toISOString(),
    owner_email: "reader3@example.com",
    owner_name: "Mina",
  },
];

const tilts = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];

const CommunityShelf = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [showForm, setShowForm] = useState(false);
  const [showMatcher, setShowMatcher] = useState(false);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [matchedContact, setMatchedContact] = useState<{
    email: string;
    name?: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      // Frontend preview mode: auth redirect will be re-enabled with backend integration.
      // navigate("/auth");
    }
  }, [user, loading, navigate]);

  const loadListings = () => {
    if (listings.length === 0) setListings(MOCK_LISTINGS);
  };

  const handleMatch = (listing: ShelfMatchListing) => {
    const fullListing = listings.find((item) => item.id === listing.id);
    if (!fullListing) return;

    setListings((current) =>
      current.map((item) =>
        item.id === fullListing.id
          ? { ...item, status: "matched", matched_by: user?.id || "local-user" }
          : item,
      ),
    );
    setShowMatcher(false);
    setMatchedContact({
      email: fullListing.owner_email || "reader@example.com",
      name: fullListing.owner_name || "A fellow reader",
    });
    toast.success("Shelf match saved to your library 📖");
  };

  const handleDelete = (id: string) => {
    setListings((current) => current.filter((listing) => listing.id !== id));
    toast("Book removed from the shelf ♡");
  };

  if (loading) return null;

  const availableListings = listings.filter((listing) => listing.status === "available");

  return (
    <div className="paper-texture relative min-h-screen px-4 py-8 sm:py-10">
      <div className="pointer-events-none fixed bottom-0 left-3 top-0 hidden flex-col justify-center gap-8 sm:flex">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="h-4 w-4 rounded-full border-2 border-border bg-background" />
        ))}
      </div>
      <div className="pointer-events-none fixed bottom-0 left-12 top-0 hidden w-px bg-dusty-rose/20 sm:block" />

      <header className="mx-auto mb-8 flex max-w-5xl items-center justify-between pl-2 sm:pl-10">
        <Link to="/" className="font-handwritten text-lg text-muted-foreground transition hover:text-primary">
          ← Find My Next Read
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/library" className="font-handwritten text-lg text-muted-foreground transition hover:text-primary">
            My Library
          </Link>
          <button onClick={signOut} className="font-handwritten text-base text-muted-foreground transition hover:text-primary">
            sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl pl-2 sm:pl-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-8 max-w-2xl text-center"
        >
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sage/30 bg-washi-mint/25 px-4 py-1 font-handwritten text-lg text-foreground">
            <Users className="h-4 w-4" /> Reader-to-reader exchange
          </div>
          <h1 className="font-handwritten text-5xl text-foreground md:text-6xl">The Community Shelf</h1>
          <div className="journal-divider mx-auto my-3 w-56" />
          <p className="font-body italic text-muted-foreground">
            Match with a wrapped book shared by a fellow reader—or browse every note on the shelf yourself.
          </p>
        </motion.div>

        <section className="mx-auto mb-12 grid max-w-4xl gap-4 md:grid-cols-2" aria-label="Community shelf actions">
          <motion.button
            type="button"
            whileHover={{ y: -3, rotate: -0.3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMatcher(true)}
            className="dog-ear relative rounded-sm border-2 border-primary/30 bg-primary p-6 text-left text-primary-foreground shadow-journal transition hover:shadow-warm"
          >
            <div className="absolute -top-2.5 left-8 h-5 w-16 -rotate-3 rounded-sm bg-washi-gold/70" />
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-handwritten text-sm uppercase tracking-widest opacity-80">Community match</span>
              <BookHeart className="h-6 w-6" />
            </div>
            <span className="block font-handwritten text-3xl">Find a Shelf Match</span>
            <span className="mt-1 block font-body text-sm italic opacity-85">
              Answer 3 quick questions and pair with one of {availableListings.length} available shared books.
            </span>
          </motion.button>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="dog-ear relative rounded-sm border-2 border-border bg-card p-6 text-left shadow-journal transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-warm"
          >
            <div className="absolute -top-2.5 right-10 h-5 w-16 rotate-3 rounded-sm bg-washi-pink/60" />
            <div className="mb-3 flex items-center justify-between gap-3 text-primary">
              <span className="font-handwritten text-sm uppercase tracking-widest">Share a favorite</span>
              <span className="text-2xl" aria-hidden="true">✎</span>
            </div>
            <span className="block font-handwritten text-3xl text-foreground">List a Wrapped Book</span>
            <span className="mt-1 block font-body text-sm italic text-muted-foreground">
              Leave three spoiler-free hints for the next reader.
            </span>
          </button>
        </section>

        <div className="mb-7 flex items-end justify-between gap-4 border-b border-dashed border-border pb-3">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Search className="h-4 w-4" />
              <p className="font-handwritten text-lg">Browse the shelf</p>
            </div>
            <p className="font-body text-xs italic text-muted-foreground">Prefer to choose for yourself? Peek at any wrapped book below.</p>
          </div>
          <span className="shrink-0 font-handwritten text-sm text-muted-foreground">{availableListings.length} available</span>
        </div>

        {listings.length === 0 ? (
          <p className="mt-16 text-center font-handwritten text-2xl text-muted-foreground/60">
            The shelf is empty… be the first to wrap a book ♡
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {listings.map((listing, index) => {
              const isOwn = Boolean(user && listing.user_id === user.id);
              const isMatched = listing.status === "matched";
              const revealed = revealedId === listing.id;

              return (
                <motion.article
                  key={listing.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className={`flex flex-col items-center ${tilts[index % tilts.length]}`}
                >
                  <AnimatePresence mode="wait">
                    {!revealed ? (
                      <motion.button
                        key="wrap"
                        type="button"
                        onClick={() => setRevealedId(listing.id)}
                        exit={{ rotateY: 90, opacity: 0 }}
                        className="cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={`Peek at wrapped book from ${listing.owner_name || "a reader"}`}
                      >
                        <div className="animate-gentle-bounce" style={{ animationDelay: `${index * 0.3}s` }}>
                          <WrappedBookSVG color={listing.cover_color} emoji={listing.emoji} className="h-56 w-40 drop-shadow-lg" />
                        </div>
                        <p className="mt-3 font-handwritten text-base text-muted-foreground">
                          {isMatched ? "💌 matched" : "tap to peek ✦"}
                        </p>
                        <p className="font-handwritten text-sm text-muted-foreground/60">from {listing.owner_name || "a reader"}</p>
                      </motion.button>
                    ) : (
                      <motion.div
                        key="open"
                        initial={{ rotateY: -90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        className="dog-ear relative w-full rounded-sm border border-border bg-card p-5 shadow-journal"
                      >
                        <div className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rounded-sm bg-washi-mint/40" />
                        <span className="mb-2 mt-1 block text-center text-4xl">{listing.emoji}</span>
                        <p className="mb-3 text-center font-handwritten text-sm text-muted-foreground">from {listing.owner_name || "a reader"}</p>
                        <div className="journal-divider mb-3" />
                        <div className="mb-3 space-y-2">
                          {[listing.hook1, listing.hook2, listing.hook3].map((hook) => (
                            <p key={hook} className="flex gap-2 font-body text-sm italic text-muted-foreground">
                              <span className="font-handwritten text-accent">✦</span> {hook}
                            </p>
                          ))}
                        </div>
                        {listing.ingredients.length > 0 && (
                          <p className="mb-3 font-handwritten text-xs text-muted-foreground/70">
                            tea notes: {listing.ingredients.join(" · ")}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setRevealedId(null)} className="flex-1 rounded-sm border border-border py-2 font-handwritten text-base hover:bg-secondary">
                            Pass
                          </button>
                          {isOwn ? (
                            <button type="button" onClick={() => handleDelete(listing.id)} className="flex-1 rounded-sm border border-destructive/30 py-2 font-handwritten text-base text-destructive">
                              Remove
                            </button>
                          ) : isMatched ? (
                            <span className="flex-1 rounded-sm bg-muted py-2 text-center font-handwritten text-base">Matched 💘</span>
                          ) : (
                            <button type="button" onClick={() => handleMatch(listing)} className="flex-1 rounded-sm bg-primary py-2 font-handwritten text-lg text-primary-foreground hover:shadow-warm">
                              Choose book 💌
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>

      <AnimatePresence>
        {showMatcher && (
          <CommunityMatchFinder listings={listings} onClose={() => setShowMatcher(false)} onMatch={handleMatch} />
        )}
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="match-contact-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
            onClick={() => setMatchedContact(null)}
          >
            <motion.div
              initial={{ scale: 0.9, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="dog-ear relative w-full max-w-md rounded-sm border border-border bg-card p-8 text-center shadow-warm"
            >
              <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-sm bg-washi-pink/50" />
              <p className="mb-3 text-5xl">💌</p>
              <p className="mb-1 font-handwritten text-base uppercase tracking-widest text-primary">Community Shelf Match</p>
              <h2 id="match-contact-title" className="mb-2 font-handwritten text-3xl">It’s a match!</h2>
              <p className="mb-4 font-body italic text-muted-foreground">
                Reach out to {matchedContact.name || "your fellow reader"} to arrange the exchange:
              </p>
              <p className="mb-5 break-all font-handwritten text-2xl text-primary">{matchedContact.email}</p>
              <button type="button" onClick={() => setMatchedContact(null)} className="rounded-sm bg-primary px-6 py-2 font-handwritten text-xl text-primary-foreground">
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
