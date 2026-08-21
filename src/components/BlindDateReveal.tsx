import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WrappedBookSVG from "./WrappedBookSVG";
import ReceiptOfFate from "./ReceiptOfFate";
import { toast } from "sonner";
import type { Book } from "@/data/books";

interface BlindDateRevealProps {
  books: Book[];
  ingredients: string[];
  onReset: () => void;
  onGenerateMore: () => void;
  hasMore: boolean;
  isLoading?: boolean; // NEW: Accept the loading prop
}

const tapeColors = ["bg-washi-pink/40", "bg-washi-mint/40", "bg-washi-gold/40"];
const cardTilts = ["-rotate-1", "rotate-[0.5deg]", "-rotate-[0.5deg]"];

const BlindDateReveal = ({
  books,
  ingredients,
  onReset,
  onGenerateMore,
  hasMore,
  isLoading = false,
}: BlindDateRevealProps) => {
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [receiptBook, setReceiptBook] = useState<Book | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleSave = (book: Book) => {
    if (savedIds.has(book.id)) {
      toast("Already in your library ♡");
      return;
    }
    setSavedIds((s) => new Set(s).add(book.id));
    toast.success("Saved to your library 📖");
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 paper-texture relative">
      {/* Notebook edges */}
      <div className="fixed left-3 top-0 bottom-0 flex flex-col justify-center gap-8 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2 border-border bg-background"
          />
        ))}
      </div>
      <div className="fixed left-12 top-0 bottom-0 w-px bg-dusty-rose/20 pointer-events-none" />

      {/* Washi tape accents */}
      <div className="fixed top-8 right-20 w-20 h-5 bg-washi-pink/25 -rotate-12 pointer-events-none rounded-sm" />
      <div className="fixed bottom-16 left-24 w-16 h-5 bg-washi-gold/20 rotate-6 pointer-events-none rounded-sm" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="font-handwritten text-lg text-muted-foreground/50 mb-1">
          ~ the reveal ~
        </p>
        <h1 className="text-4xl md:text-5xl font-handwritten text-foreground mb-3">
          Your Blind Dates Are Ready
        </h1>
        <div className="journal-divider w-48 mx-auto mb-3" />
        <p className="text-muted-foreground font-body text-base italic">
          Tap a wrapped book to unwrap your match ✨
        </p>
      </motion.div>

      {/* NEW: THE LOADING SPINNER VS THE BOOK GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 min-h-[400px] w-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="text-6xl mb-6 drop-shadow-sm opacity-80"
          >
            ☕
          </motion.div>
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="font-handwritten text-2xl md:text-3xl text-foreground text-center"
          >
            Consulting the archives...
            <br />
            <span className="text-lg text-muted-foreground/50 block mt-2 tracking-wide">
              (adding a dash of literary magic 🪄)
            </span>
          </motion.p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full mb-12">
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className={`flex flex-col items-center ${cardTilts[i % cardTilts.length]}`}
            >
              <AnimatePresence mode="wait">
                {revealedId !== book.id ? (
                  <motion.button
                    key="wrapped"
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setRevealedId(book.id)}
                    className="cursor-pointer group"
                  >
                    <div
                      className="animate-gentle-bounce"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    >
                      <WrappedBookSVG
                        color={book.coverColor}
                        emoji={book.emoji}
                        className="w-40 h-56 drop-shadow-lg"
                      />
                    </div>
                    <p className="mt-4 text-base text-muted-foreground font-handwritten">
                      tap to unwrap ✦
                    </p>
                  </motion.button>
                ) : (
                  <motion.div
                    key="revealed"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full h-full flex"
                  >
                    <div className="relative w-full flex flex-col bg-card rounded-sm shadow-journal border border-border p-6 text-center dog-ear">
                      <div
                        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 rounded-sm ${tapeColors[i % tapeColors.length]} pointer-events-none`}
                      />

                      {book.coverUrl ? (
                        <motion.img
                          src={book.coverUrl}
                          alt={`Cover of ${book.title}`}
                          initial={{ filter: "blur(4px)", opacity: 0 }}
                          animate={{ filter: "blur(0px)", opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="w-28 h-40 object-cover mx-auto mb-4 mt-2 rounded-sm shadow-md"
                        />
                      ) : (
                        <motion.span
                          className="text-5xl block mb-4 mt-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.3,
                            type: "spring",
                            stiffness: 200,
                          }}
                        >
                          {book.emoji}
                        </motion.span>
                      )}

                      <h3 className="font-handwritten text-2xl text-foreground mb-1">
                        {book.title}
                      </h3>
                      <p className="text-muted-foreground font-body text-sm mb-4 italic">
                        by {book.author}
                      </p>

                      <div className="journal-divider w-full mb-3 mt-auto" />

                      <div className="space-y-2 text-left mb-4">
                        {[book.clue1, book.clue2, book.clue3].map(
                          (clue, ci) => (
                            <motion.p
                              key={ci}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + ci * 0.15 }}
                              className="text-sm text-muted-foreground font-body italic flex gap-2"
                            >
                              <span className="text-accent font-handwritten text-lg">
                                ✦
                              </span>
                              {clue}
                            </motion.p>
                          ),
                        )}
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mt-auto flex gap-2"
                      >
                        <button
                          onClick={() => setReceiptBook(book)}
                          className="flex-1 py-2.5 rounded-sm bg-primary text-primary-foreground font-handwritten text-xl
                            hover:shadow-warm hover:-translate-y-0.5 transition-all duration-200 border border-primary/20"
                        >
                          It's a Match 💘
                        </button>
                        <button
                          onClick={() => handleSave(book)}
                          title="Save to your library"
                          className={`px-3 py-2.5 rounded-sm border font-handwritten text-xl transition-all duration-200 hover:-translate-y-0.5
                            ${savedIds.has(book.id) ? "bg-washi-pink/40 border-dusty-rose/40 text-foreground" : "bg-card border-border hover:bg-secondary"}`}
                        >
                          {savedIds.has(book.id) ? "♥" : "♡"}
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Buttons at the bottom */}
      <div className="flex gap-4 flex-wrap justify-center">
        {hasMore && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => {
              setRevealedId(null);
              onGenerateMore();
            }}
            disabled={isLoading} // NEW: Disable button while loading to prevent spam clicking
            className={`px-8 py-3 rounded-sm border-2 border-dashed font-handwritten text-xl transition-all duration-200
              ${isLoading ? "border-border text-muted-foreground opacity-50 cursor-not-allowed" : "border-primary text-primary hover:bg-primary/10 hover:shadow-journal hover:-translate-y-0.5"}`}
          >
            {isLoading ? "Writing..." : "Show Me More 🔮"}
          </motion.button>
        )}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onReset}
          disabled={isLoading} // NEW: Disable reset while loading
          className={`px-8 py-3 rounded-sm font-handwritten text-xl transition-all duration-200 border 
            ${isLoading ? "bg-secondary text-muted-foreground border-border opacity-50 cursor-not-allowed" : "bg-primary text-primary-foreground hover:shadow-warm hover:-translate-y-0.5 border-primary/20"}`}
        >
          Start Over 📖
        </motion.button>
      </div>

      {/* Decorative */}
      <div className="fixed bottom-6 left-16 text-4xl opacity-15 animate-float select-none">
        🕯️
      </div>
      <div
        className="fixed top-16 right-8 text-3xl opacity-10 animate-float select-none"
        style={{ animationDelay: "1.5s" }}
      >
        ☕
      </div>

      {/* Handwritten note */}
      <motion.p
        className="fixed bottom-4 right-4 font-handwritten text-base text-muted-foreground/25 -rotate-2 select-none"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        dear diary… ♡
      </motion.p>

      {/* Receipt modal */}
      <AnimatePresence>
        {receiptBook && (
          <ReceiptOfFate
            book={receiptBook}
            ingredients={ingredients}
            onClose={() => setReceiptBook(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlindDateReveal;
