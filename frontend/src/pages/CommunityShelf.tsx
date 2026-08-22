import { useCallback, useEffect, useState } from "react";
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
import {
  claimShelfListing,
  fetchCommunityShelfListings,
  removeShelfListing,
  type CommunityShelfListingDto,
} from "../lib/communityShelf";

interface Listing extends ShelfMatchListing {
  user_id: string;
  matched_by: string | null;
  created_at: string;
  owner_email?: string;
  is_owner: boolean;
}

const deriveTemporaryMatchTags = (
  listing: CommunityShelfListingDto,
): string[] => {
  const searchableText = [...listing.hooks, ...listing.ingredients]
    .join(" ")
    .toLowerCase();
  const tagRules: Array<[string, string[]]> = [
    ["mystery", ["secret", "watching", "hidden"]],
    ["tense", ["war", "closing", "watching"]],
    ["secrets", ["secret", "hidden"]],
    ["atmospheric", ["woods", "midnight", "garden"]],
    ["twisty", ["secret", "impossible"]],
    ["romance", ["soulmate", "enemies"]],
    ["heartfelt", ["soulmate", "heart"]],
    ["adventure", ["kingdom", "dragon", "map", "horse"]],
    ["character", ["hero", "protagonist"]],
    ["slow-burn", ["enemies", "lavender"]],
    ["fantasy", ["dragon", "kingdom", "impossible"]],
    ["escape", ["door", "dragon", "kingdom"]],
    ["fast", ["closing", "war"]],
    ["witty", ["opinionated"]],
    ["cozy", ["honey", "matcha", "chai"]],
    ["hopeful", ["summer", "garden"]],
  ];

  return tagRules
    .filter(([, keywords]) =>
      keywords.some((keyword) => searchableText.includes(keyword)),
    )
    .map(([tag]) => tag);
};

const toListing = (listing: CommunityShelfListingDto): Listing => ({
  id: String(listing.id),
  user_id: listing.isOwner ? "current" : "",
  cover_color: listing.coverColor,
  emoji: listing.emoji,
  hook1: listing.hooks[0],
  hook2: listing.hooks[1],
  hook3: listing.hooks[2],
  publication_year: listing.publicationYear,
  ingredients: listing.ingredients,
  match_tags: deriveTemporaryMatchTags(listing),
  status: listing.status.toLowerCase(),
  matched_by: null,
  created_at: listing.createdAt,
  owner_name: listing.owner.displayName,
  is_owner: listing.isOwner,
});

const tilts = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];

const CommunityShelf = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showMatcher, setShowMatcher] = useState(false);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [matchedContact, setMatchedContact] = useState<{
    email?: string;
    name?: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const loadListings = useCallback(async (signal?: AbortSignal) => {
    await Promise.resolve();
    if (signal?.aborted) return;
    setIsLoadingListings(true);
    setListingsError(null);

    try {
      const response = await fetchCommunityShelfListings(signal);
      setListings(response.map(toListing));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setListingsError(
        error instanceof Error ? error.message : "Could not load the shelf",
      );
    } finally {
      if (!signal?.aborted) setIsLoadingListings(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCommunityShelfListings(controller.signal)
      .then((response) => setListings(response.map(toListing)))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setListingsError(
          error instanceof Error ? error.message : "Could not load the shelf",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingListings(false);
      });
    return () => controller.abort();
  }, []);

  const handleMatch = async (listing: ShelfMatchListing) => {
    const fullListing = listings.find((item) => item.id === listing.id);
    if (!fullListing) return;

    try {
      const match = await claimShelfListing(
        Number(fullListing.id),
        fullListing.match_tags,
      );
      setListings((current) =>
        current.filter((item) => item.id !== fullListing.id),
      );
      setRevealedId(null);
      setShowMatcher(false);
      setMatchedContact({
        name: match.owner.displayName,
      });
      toast.success("Exchange request sent 📖");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not claim this book");
      void loadListings();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeShelfListing(Number(id));
      setListings((current) => current.filter((listing) => listing.id !== id));
      setRevealedId(null);
      toast("Book removed from the shelf ♡");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove the book");
    }
  };

  if (loading) return null;

  const availableListings = listings.filter((listing) => listing.status === "available");
  const matchableListings = availableListings.filter((listing) => !listing.is_owner);

  return (
    <div className="paper-texture relative min-h-screen px-4 pb-24 pt-32 sm:pb-10">
      <div className="pointer-events-none fixed bottom-0 left-3 top-0 hidden flex-col justify-center gap-8 sm:flex">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="h-4 w-4 rounded-full border-2 border-border bg-background" />
        ))}
      </div>
      <div className="pointer-events-none fixed bottom-0 left-12 top-0 hidden w-px bg-dusty-rose/20 sm:block" />

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
            disabled={isLoadingListings || matchableListings.length === 0}
            className="dog-ear relative rounded-sm border-2 border-primary/30 bg-primary p-6 text-left text-primary-foreground shadow-journal transition hover:shadow-warm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="absolute -top-2.5 left-8 h-5 w-16 -rotate-3 rounded-sm bg-washi-gold/70" />
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-handwritten text-sm uppercase tracking-widest opacity-80">Community match</span>
              <BookHeart className="h-6 w-6" />
            </div>
            <span className="block font-handwritten text-3xl">Find a Shelf Match</span>
            <span className="mt-1 block font-body text-sm italic opacity-85">
              {isLoadingListings
                ? "Checking the shelf for available books..."
                : `Answer 3 quick questions and pair with one of ${matchableListings.length} available shared books.`}
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

        {isLoadingListings ? (
          <div className="mt-14 text-center" role="status">
            <p className="animate-pulse font-handwritten text-2xl text-muted-foreground">
              Dusting off the shelf pages…
            </p>
          </div>
        ) : listingsError ? (
          <div className="mx-auto mt-14 max-w-md rounded-sm border border-dashed border-destructive/40 bg-card/70 p-6 text-center">
            <p className="font-handwritten text-2xl text-foreground">
              The shelf couldn’t be opened
            </p>
            <p className="mt-1 font-body text-sm italic text-muted-foreground">
              {listingsError}
            </p>
            <button
              type="button"
              onClick={() => void loadListings()}
              className="mt-4 rounded-sm bg-primary px-5 py-2 font-handwritten text-lg text-primary-foreground"
            >
              Try again
            </button>
          </div>
        ) : listings.length === 0 ? (
          <p className="mt-16 text-center font-handwritten text-2xl text-muted-foreground/60">
            The shelf is empty… be the first to wrap a book ♡
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {listings.map((listing, index) => {
              const isOwn = listing.is_owner;
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
                        {listing.publication_year && (
                          <p className="mb-3 font-handwritten text-xs text-muted-foreground/70">
                            first published: {listing.publication_year}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setRevealedId(null)} className="flex-1 rounded-sm border border-border py-2 font-handwritten text-base hover:bg-secondary">
                            Pass
                          </button>
                          {isOwn ? (
                            <button type="button" onClick={() => void handleDelete(listing.id)} className="flex-1 rounded-sm border border-destructive/30 py-2 font-handwritten text-base text-destructive">
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
          <CommunityMatchFinder listings={matchableListings} onClose={() => setShowMatcher(false)} onMatch={handleMatch} />
        )}
        {showForm && (
          <ListBookForm
            onClose={() => setShowForm(false)}
            onCreated={() => {
              setShowForm(false);
              void loadListings();
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
              {matchedContact.email ? (
                <>
                  <p className="mb-4 font-body italic text-muted-foreground">
                    Reach out to {matchedContact.name || "your fellow reader"} to arrange the exchange:
                  </p>
                  <p className="mb-5 break-all font-handwritten text-2xl text-primary">
                    {matchedContact.email}
                  </p>
                </>
              ) : (
                <p className="mb-5 font-body italic text-muted-foreground">
                  Your request was sent to {matchedContact.name || "the book owner"}. Contact details will unlock after they accept it. Track the request in My Exchanges.
                </p>
              )}
              <Link to="/exchanges" onClick={() => setMatchedContact(null)} className="mr-2 inline-block rounded-sm border border-border px-6 py-2 font-handwritten text-xl text-primary">
                My Exchanges
              </Link>
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
