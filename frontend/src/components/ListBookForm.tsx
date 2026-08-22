import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import WrappedBookSVG from "./WrappedBookSVG";
import { toast } from "sonner";
import { createShelfListing } from "../lib/communityShelf";

const colors = [
  { id: "bg-primary", label: "Rust" },
  { id: "bg-sage", label: "Sage" },
  { id: "bg-dusty-rose", label: "Rose" },
  { id: "bg-accent", label: "Gold" },
  { id: "bg-warm", label: "Cocoa" },
];
const emojis = ["📖", "🌙", "🌸", "🗝️", "🕯️", "🍂", "☕", "✨", "🌊", "🔮"];
const ingredients = [
  "chamomile",
  "earl grey",
  "matcha",
  "hibiscus",
  "honey",
  "lavender",
  "cinnamon",
  "vanilla",
];
const currentYear = new Date().getFullYear();

const schema = z.object({
  hook1: z.string().trim().min(5, "Hook too short").max(180),
  hook2: z.string().trim().min(5, "Hook too short").max(180),
  hook3: z.string().trim().min(5, "Hook too short").max(180),
  publicationYear: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter a four-digit publication year")
    .transform(Number)
    .refine(
      (year) => year >= 1000 && year <= currentYear,
      `Year must be between 1000 and ${currentYear}`,
    ),
});

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const ListBookForm = ({ onClose, onCreated }: Props) => {
  const [color, setColor] = useState("bg-primary");
  const [emoji, setEmoji] = useState("📖");
  const [hook1, setHook1] = useState("");
  const [hook2, setHook2] = useState("");
  const [hook3, setHook3] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const togglePick = (i: string) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const submit = async () => {
    const parsed = schema.safeParse({ hook1, hook2, hook3, publicationYear });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setSaving(true);

    try {
      await createShelfListing({
        coverColor: color,
        emoji,
        hooks: [hook1.trim(), hook2.trim(), hook3.trim()],
        publicationYear: parsed.data.publicationYear,
        ingredients: picked,
      });
      setSaving(false);
      toast.success("Listed on the shelf ✨");
      onCreated();
    } catch (error) {
      setSaving(false);
      toast.error(error instanceof Error ? error.message : "Could not list the book");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, rotate: -1 }}
        animate={{ y: 0, rotate: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-sm shadow-warm border border-border p-6 max-w-2xl w-full my-8 relative dog-ear"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-washi-gold/50 rotate-2 rounded-sm" />
        <h2 className="font-handwritten text-3xl text-center mb-1">
          Wrap a Book
        </h2>
        <p className="text-center font-body italic text-muted-foreground text-sm mb-5">
          Don't reveal the title — leave only hints ♡
        </p>

        <div className="grid md:grid-cols-[160px,1fr] gap-6">
          <div className="flex flex-col items-center">
            <WrappedBookSVG color={color} emoji={emoji} className="w-32 h-44" />
            <p className="font-handwritten text-xs text-muted-foreground mt-1">
              preview
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-handwritten text-base mb-1">wrapping color</p>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    className={`px-3 py-1 rounded-sm border font-handwritten text-sm ${
                      color === c.id
                        ? "border-primary bg-secondary"
                        : "border-border"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-handwritten text-base mb-1">seal it with</p>
              <div className="flex gap-2 flex-wrap">
                {emojis.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`text-2xl w-10 h-10 rounded-sm border ${
                      emoji === e
                        ? "border-primary bg-secondary"
                        : "border-border"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="publication-year"
                className="mb-1 block font-handwritten text-base"
              >
                publication year
              </label>
              <input
                id="publication-year"
                type="number"
                inputMode="numeric"
                min={1000}
                max={currentYear}
                value={publicationYear}
                onChange={(event) => setPublicationYear(event.target.value)}
                placeholder="e.g. 1994"
                className="w-full rounded-sm border border-border bg-background px-3 py-2 font-body text-sm"
              />
              <p className="mt-1 font-body text-xs italic text-muted-foreground">
                This helps readers choose classics or newer stories.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <p className="font-handwritten text-base">three little hooks</p>
          {[
            { v: hook1, s: setHook1, p: "Sentence one…" },
            { v: hook2, s: setHook2, p: "Sentence two…" },
            { v: hook3, s: setHook3, p: "Sentence three…" },
          ].map((h, i) => (
            <input
              key={i}
              value={h.v}
              onChange={(e) => h.s(e.target.value)}
              placeholder={h.p}
              maxLength={180}
              className="w-full px-3 py-2 rounded-sm border border-border bg-background font-body italic text-sm"
            />
          ))}
        </div>

        <div className="mt-5">
          <p className="font-handwritten text-base mb-1">
            tea pairing (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((i) => (
              <button
                key={i}
                onClick={() => togglePick(i)}
                className={`px-3 py-1 rounded-sm border font-handwritten text-sm ${
                  picked.includes(i)
                    ? "border-primary bg-secondary"
                    : "border-border"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-sm border border-border font-handwritten text-lg hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-sm bg-primary text-primary-foreground font-handwritten text-xl
              hover:shadow-warm disabled:opacity-50"
          >
            {saving ? "..." : "Place on Shelf ✨"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ListBookForm;
