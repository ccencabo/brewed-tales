import { useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import type { Book } from "@/data/books";

interface ReceiptOfFateProps {
  book: Book;
  ingredients: string[];
  onClose: () => void;
}

const ReceiptOfFate = ({ book, ingredients, onClose }: ReceiptOfFateProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const ingredientLabels = [
    "Moonpetal leaves",
    "Rose honey",
    "Midnight bark",
    "Stardust powder",
    "A quick dash",
    "A patient pour",
    "A gentle swirl",
    "Wild ginger root",
    "Chamomile hearts",
    "Lavender ink",
    "Warm vanilla cream",
    "Misty fog essence",
    "Smoked peppercorn",
  ];

  const captureReceipt = async () => {
    if (!receiptRef.current) return null;
    const canvas = await html2canvas(receiptRef.current, {
      backgroundColor: null,
      scale: 2,
    });
    return new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
  };

  const handleDownload = async () => {
    try {
      const blob = await captureReceipt();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "receipt-of-fate.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleShare = async () => {
    try {
      const blob = await captureReceipt();
      if (!blob) return;
      const file = new File([blob], "receipt-of-fate.png", {
        type: "image/png",
      });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "My Receipt of Fate 📜",
          text: `My next read is "${book.title}" by ${book.author}, picked on a blind book date!`,
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-3 max-w-xs w-full max-h-[90vh] overflow-y-auto"
      >
        {/* The receipt */}
        <div
          ref={receiptRef}
          className="w-full bg-[#faf6ef] rounded-sm shadow-2xl overflow-hidden"
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 28px, hsl(37 20% 85% / 0.3) 28px, hsl(37 20% 85% / 0.3) 29px)",
          }}
        >
          {/* Torn top edge */}
          <div
            className="w-full h-3 bg-[#faf6ef]"
            style={{
              maskImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,12 Q5,0 10,12 Q15,0 20,12 Q25,0 30,12 Q35,0 40,12 Q45,0 50,12 Q55,0 60,12 Q65,0 70,12 Q75,0 80,12 Q85,0 90,12 Q95,0 100,12 Q105,0 110,12 Q115,0 120,12 Q125,0 130,12 Q135,0 140,12 Q145,0 150,12 Q155,0 160,12 Q165,0 170,12 Q175,0 180,12 Q185,0 190,12 Q195,0 200,12 Q205,0 210,12 Q215,0 220,12 Q225,0 230,12 Q235,0 240,12 Q245,0 250,12 Q255,0 260,12 Q265,0 270,12 Q275,0 280,12 Q285,0 290,12 Q295,0 300,12 Q305,0 310,12 Q315,0 320,12 Q325,0 330,12 Q335,0 340,12 Q345,0 350,12 Q355,0 360,12 Q365,0 370,12 Q375,0 380,12 Q385,0 390,12 Q395,0 400,12 Z' fill='white'/%3E%3C/svg%3E\")",
              WebkitMaskImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,12 Q5,0 10,12 Q15,0 20,12 Q25,0 30,12 Q35,0 40,12 Q45,0 50,12 Q55,0 60,12 Q65,0 70,12 Q75,0 80,12 Q85,0 90,12 Q95,0 100,12 Q105,0 110,12 Q115,0 120,12 Q125,0 130,12 Q135,0 140,12 Q145,0 150,12 Q155,0 160,12 Q165,0 170,12 Q175,0 180,12 Q185,0 190,12 Q195,0 200,12 Q205,0 210,12 Q215,0 220,12 Q225,0 230,12 Q235,0 240,12 Q245,0 250,12 Q255,0 260,12 Q265,0 270,12 Q275,0 280,12 Q285,0 290,12 Q295,0 300,12 Q305,0 310,12 Q315,0 320,12 Q325,0 330,12 Q335,0 340,12 Q345,0 350,12 Q355,0 360,12 Q365,0 370,12 Q375,0 380,12 Q385,0 390,12 Q395,0 400,12 Z' fill='white'/%3E%3C/svg%3E\")",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
          />

          <div className="px-5 py-4 text-[#3a3028]">
            {/* Header */}
            <div className="text-center mb-3">
              <p className="text-[9px] tracking-[0.3em] uppercase opacity-60">
                ~ ~ ~ ~ ~ ~ ~
              </p>
              <h3 className="text-base font-bold tracking-wider mt-1">
                📜 RECEIPT OF FATE
              </h3>
              <p className="text-[9px] tracking-[0.2em] uppercase opacity-50 mt-0.5">
                Brewed Tales
              </p>
              <p className="text-[9px] tracking-[0.3em] uppercase opacity-60 mt-1">
                ~ ~ ~ ~ ~ ~ ~
              </p>
            </div>

            {/* Date & time */}
            <div className="flex justify-between text-[10px] opacity-70 mb-3">
              <span>DATE: {dateStr}</span>
              <span>{timeStr}</span>
            </div>

            <p className="text-center text-[9px] tracking-[0.5em] opacity-40 mb-2">
              ----------------------
            </p>

            {/* Brew order */}
            <p className="text-[9px] tracking-[0.2em] uppercase opacity-50 mb-1">
              YOUR BREW ORDER:
            </p>
            {ingredients.map((emoji, i) => (
              <div key={i} className="flex justify-between text-[11px] mb-0.5">
                <span>
                  {emoji} {ingredientLabels[i] || "Mystery essence"}
                </span>
                <span className="opacity-40">✓</span>
              </div>
            ))}

            <p className="text-center text-[9px] tracking-[0.5em] opacity-40 my-2">
              ----------------------
            </p>

            {/* The recommendation */}
            <p className="text-[9px] tracking-[0.2em] uppercase opacity-50 mb-1">
              YOUR NEXT READ:
            </p>
            <div className="text-center py-2">
              <p className="text-xl mb-0.5">{book.emoji}</p>
              <p className="text-xs font-bold tracking-wide">"{book.title}"</p>
              <p className="text-[10px] opacity-70 mt-0.5">by {book.author}</p>
            </div>

            <p className="text-center text-[9px] tracking-[0.5em] opacity-40 my-2">
              ----------------------
            </p>

            {/* Clues */}
            <p className="text-[9px] tracking-[0.2em] uppercase opacity-50 mb-1">
              WHY IT CHOSE YOU:
            </p>
            {[book.clue1, book.clue2, book.clue3].map((clue, i) => (
              <p
                key={i}
                className="text-[10px] italic opacity-70 mb-0.5 leading-snug"
              >
                "{clue}"
              </p>
            ))}

            {/* Footer */}
            <p className="text-center text-[9px] tracking-[0.5em] opacity-40 mt-3 mb-1">
              ----------------------
            </p>
            <div className="text-center">
              <p className="text-[9px] italic opacity-50">
                "Some books find you at exactly the right time."
              </p>
              <p className="text-[9px] tracking-[0.15em] opacity-40 mt-1">
                THANK YOU FOR BREWING WITH US
              </p>
              <p className="text-[9px] tracking-[0.3em] opacity-30 mt-0.5">♡</p>
            </div>
          </div>

          {/* Torn bottom edge */}
          <div
            className="w-full h-3 bg-[#faf6ef]"
            style={{
              maskImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 Q5,12 10,0 Q15,12 20,0 Q25,12 30,0 Q35,12 40,0 Q45,12 50,0 Q55,12 60,0 Q65,12 70,0 Q75,12 80,0 Q85,12 90,0 Q95,12 100,0 Q105,12 110,0 Q115,12 120,0 Q125,12 130,0 Q135,12 140,0 Q145,12 150,0 Q155,12 160,0 Q165,12 170,0 Q175,12 180,0 Q185,12 190,0 Q195,12 200,0 Q205,12 210,0 Q215,12 220,0 Q225,12 230,0 Q235,12 240,0 Q245,12 250,0 Q255,12 260,0 Q265,12 270,0 Q275,12 280,0 Q285,12 290,0 Q295,12 300,0 Q305,12 310,0 Q315,12 320,0 Q325,12 330,0 Q335,12 340,0 Q345,12 350,0 Q355,12 360,0 Q365,12 370,0 Q375,12 380,0 Q385,12 390,0 Q395,12 400,0 Z' fill='white'/%3E%3C/svg%3E\")",
              WebkitMaskImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 Q5,12 10,0 Q15,12 20,0 Q25,12 30,0 Q35,12 40,0 Q45,12 50,0 Q55,12 60,0 Q65,12 70,0 Q75,12 80,0 Q85,12 90,0 Q95,12 100,0 Q105,12 110,0 Q115,12 120,0 Q125,12 130,0 Q135,12 140,0 Q145,12 150,0 Q155,12 160,0 Q165,12 170,0 Q175,12 180,0 Q185,12 190,0 Q195,12 200,0 Q205,12 210,0 Q215,12 220,0 Q225,12 230,0 Q235,12 240,0 Q245,12 250,0 Q255,12 260,0 Q265,12 270,0 Q275,12 280,0 Q285,12 290,0 Q295,12 300,0 Q305,12 310,0 Q315,12 320,0 Q325,12 330,0 Q335,12 340,0 Q345,12 350,0 Q355,12 360,0 Q365,12 370,0 Q375,12 380,0 Q385,12 390,0 Q395,12 400,0 Z' fill='white'/%3E%3C/svg%3E\")",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-body text-sm
              hover:shadow-warm hover:-translate-y-0.5 transition-all duration-200"
          >
            Download 📥
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-body text-sm
              hover:shadow-warm hover:-translate-y-0.5 transition-all duration-200"
          >
            Share 📤
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-border text-muted-foreground font-body text-sm
              hover:bg-secondary transition-all duration-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReceiptOfFate;
