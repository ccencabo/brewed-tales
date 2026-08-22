import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import WrappedBookSVG from "../components/WrappedBookSVG";
import {
  fetchLibrary,
  removeLibrarySave,
  type LibrarySave,
} from "../lib/library";

const tilts = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];

const Library = () => {
  const [saves, setSaves] = useState<LibrarySave[]>([]);
  const [tab, setTab] = useState<"all" | "blind_date" | "shelf_match">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchLibrary(controller.signal)
      .then(setSaves)
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Could not load your library");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const remove = async (save: LibrarySave) => {
    try {
      await removeLibrarySave(save);
      setSaves((current) => current.filter((item) => item.id !== save.id));
      toast.success(
        save.kind === "shelf_match"
          ? "Shelf match cancelled and returned to the shelf"
          : "Removed from library",
      );
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Could not remove this item");
    }
  };

  const filtered = saves.filter((save) => tab === "all" || save.kind === tab);

  return (
    <div className="paper-texture relative min-h-screen px-4 pb-24 pt-32 sm:pb-10">
      <div className="pointer-events-none fixed bottom-0 left-3 top-0 flex flex-col justify-center gap-8">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="h-4 w-4 rounded-full border-2 border-border bg-background" />
        ))}
      </div>
      <div className="pointer-events-none fixed bottom-0 left-12 top-0 w-px bg-dusty-rose/20" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-8 max-w-2xl text-center"
      >
        <p className="font-handwritten text-lg text-muted-foreground/60">~ your collection ~</p>
        <h1 className="font-handwritten text-5xl text-foreground md:text-6xl">My Little Library</h1>
        <div className="journal-divider mx-auto my-3 w-56" />
        <p className="font-body italic text-muted-foreground">
          Your recommended reads and community exchanges, pressed between these pages.
        </p>
      </motion.div>

      <div className="mx-auto mb-10 flex max-w-3xl justify-center gap-2 font-handwritten text-xl">
        {(["all", "blind_date", "shelf_match"] as const).map((itemTab) => (
          <button
            key={itemTab}
            onClick={() => setTab(itemTab)}
            className={`rounded-sm border px-4 py-1.5 transition ${
              tab === itemTab
                ? "border-primary/30 bg-primary text-primary-foreground shadow-journal"
                : "border-border bg-card hover:bg-secondary"
            }`}
          >
            {itemTab === "all"
              ? "All ♡"
              : itemTab === "blind_date"
                ? "Next Reads ✦"
                : "Shelf Exchanges 📚"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-20 animate-pulse text-center font-handwritten text-2xl text-muted-foreground">
          Opening your library...
        </p>
      ) : error ? (
        <div className="mx-auto mt-16 max-w-md rounded-sm border border-dashed border-destructive/40 bg-card p-6 text-center">
          <p className="font-handwritten text-2xl text-foreground">The library could not be opened</p>
          <p className="mt-2 font-body text-sm italic text-muted-foreground">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="mb-3 font-handwritten text-2xl text-muted-foreground/60">No pressed flowers here yet…</p>
          <Link to="/" className="font-handwritten text-xl text-primary underline underline-offset-4">
            find your next read →
          </Link>
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          <AnimatePresence>
            {filtered.map((save, index) => (
              <motion.article
                key={save.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.04 }}
                className={`dog-ear relative rounded-sm border border-border bg-card p-5 shadow-journal ${tilts[index % tilts.length]}`}
              >
                <div className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rounded-sm bg-washi-pink/40" />

                <div className="mb-3 mt-1 flex justify-center">
                  {save.cover_url ? (
                    <img
                      src={save.cover_url}
                      alt={save.title ? `Cover of ${save.title}` : "Saved book cover"}
                      className="h-40 w-28 rounded-sm object-cover shadow-md"
                    />
                  ) : (
                    <div className="origin-top scale-75">
                      <WrappedBookSVG
                        color={save.cover_color || "bg-primary"}
                        emoji={save.emoji || "📖"}
                        className="h-40 w-28 drop-shadow"
                      />
                    </div>
                  )}
                </div>

                {save.kind === "blind_date" ? (
                  <>
                    <h2 className="text-center font-handwritten text-xl leading-tight text-foreground">{save.title}</h2>
                    <p className="mb-2 text-center text-xs italic text-muted-foreground">by {save.author}</p>
                  </>
                ) : (
                  <p className="mb-2 text-center font-handwritten text-base text-muted-foreground">
                    from {save.owner_name || "a reader"}
                  </p>
                )}

                <div className="journal-divider mb-2" />
                <div className="space-y-1.5">
                  {(save.kind === "blind_date"
                    ? [save.clue1, save.clue2, save.clue3]
                    : save.hooks
                  )
                    .filter(Boolean)
                    .map((line, lineIndex) => (
                      <p key={lineIndex} className="flex gap-2 font-body text-xs italic text-muted-foreground">
                        <span className="font-handwritten text-accent">✦</span> {line}
                      </p>
                    ))}
                </div>

                {save.ingredients.length > 0 && (
                  <p className="mt-2 font-handwritten text-[10px] text-muted-foreground/70">
                    tea: {save.ingredients.join(" · ")}
                  </p>
                )}

                {save.kind === "shelf_match" && save.owner_email && (
                  <p className="mt-2 break-all text-center font-handwritten text-xs text-primary">
                    💌 {save.owner_email}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2">
                  <span className="font-handwritten text-[10px] uppercase tracking-wider text-muted-foreground/60">
                    {save.kind === "blind_date" ? "next read" : "shelf exchange"}
                  </span>
                  {save.kind === "shelf_match" && save.exchange_status === "completed" ? (
                    <span className="font-handwritten text-xs text-primary">completed ✓</span>
                  ) : (
                    <button
                      onClick={() => void remove(save)}
                      className="font-handwritten text-xs text-destructive/70 hover:text-destructive"
                    >
                      {save.kind === "shelf_match" ? "cancel match" : "remove"}
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Library;
