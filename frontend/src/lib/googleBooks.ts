import type { Book } from "@/data/books";
import { generateBookTeaser } from "./aiTeaser";

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

const cozyColors = ["bg-washi-pink/10", "bg-washi-mint/10", "bg-washi-gold/10"];

interface GoogleBooksItem {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    publishedDate?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
}

type EraPreference = "classic" | "recent" | "any";

const keywordMap: Record<string, string> = {
  fast: "thrilling",
  slow: "epic",
  medium: "",
  plot: "twists",
  characters: "character-driven",
  literary: "literary",
  comfort: "cozy",
  escape: "adventure",
  challenge: "thought-provoking",
};

// NEW: Added excludeIds parameter
export const fetchMatchesFromAnswers = async (
  answers: Record<string, string>,
  excludeIds: string[] = [],
): Promise<Book[]> => {
  const genreMap: Record<string, string> = {
    fantasy: "fantasy",
    romance: "romance",
    mystery: "mystery",
    scifi: "science fiction",
  };

  const genre = genreMap[answers.genre] || "fiction";
  const pacingKeyword = keywordMap[answers.pacing] || "";
  const priorityKeyword = keywordMap[answers.priority] || "";
  const moodKeyword = keywordMap[answers.mood] || "";
  const eraPreference: EraPreference =
    answers.era === "classic" || answers.era === "recent"
      ? answers.era
      : "any";
  const eraKeyword = eraPreference === "classic" ? "classic" : "";

  const queryParts = [`subject:${genre}`];
  if (moodKeyword) queryParts.push(moodKeyword);
  if (priorityKeyword) queryParts.push(priorityKeyword);
  if (pacingKeyword) queryParts.push(pacingKeyword);
  if (eraKeyword) queryParts.push(eraKeyword);

  const orderBy = eraPreference === "recent" ? "newest" : "relevance";
  const matchesEra = (item: GoogleBooksItem) => {
    if (eraPreference === "any") return true;
    const publishedYear = Number.parseInt(
      item.volumeInfo.publishedDate?.slice(0, 4) ?? "",
      10,
    );
    if (!Number.isFinite(publishedYear)) return false;
    return eraPreference === "classic"
      ? publishedYear < 2000
      : publishedYear >= 2000;
  };

  const queries = [
    queryParts.join(" "),
    [`subject:${genre}`, moodKeyword, eraKeyword].filter(Boolean).join(" "),
    [`subject:${genre}`, eraKeyword].filter(Boolean).join(" "),
  ];
  const items: GoogleBooksItem[] = [];

  for (const query of [...new Set(queries)]) {
    const batch = await executeFetch(query, orderBy);
    if (batch) {
      items.push(
        ...batch.filter(
          (item) => !excludeIds.includes(item.id) && matchesEra(item),
        ),
      );
    }
    if (items.length >= 3) break;
  }

  // NEW: Deduplicate items by ID (just in case our fallback strategies grabbed the same popular book twice)
  const uniqueItems = Array.from(
    new Map(items.map((item) => [item.id, item])).values(),
  );

  // Shuffle and grab the top 3
  const shuffled = uniqueItems.sort(() => 0.5 - Math.random()).slice(0, 3);

  return Promise.all(
    shuffled.map(async (item, index) => {
      const info = item.volumeInfo;
      const pageCount = info.pageCount || Math.floor(Math.random() * 150) + 200;
      const categories = info.categories ? info.categories[0] : genre;
      const year = info.publishedDate
        ? info.publishedDate.substring(0, 4)
        : "Recent";

      let plotHook = `A beautifully woven ${categories.toLowerCase()} narrative.`;

      if (info.description) {
        plotHook = await generateBookTeaser(info.title || "", info.description);
      }

      return {
        id: item.id,
        title: info.title || "A Mysterious Tale",
        author: info.authors ? info.authors.join(", ") : "Anonymous",
        coverUrl:
          info.imageLinks?.thumbnail?.replace("http:", "https:") ||
          info.imageLinks?.smallThumbnail?.replace("http:", "https:"),
        emoji: "📖",
        coverColor: cozyColors[index % cozyColors.length],
        clue1: plotHook,
        clue2: `An immersive read spanning roughly ${pageCount} pages.`,
        clue3: `First published in the year ${year}.`,
      };
    }),
  );
};

// Helper function to handle the direct HTTP call
const executeFetch = async (
  queryString: string,
  orderBy: "relevance" | "newest",
): Promise<GoogleBooksItem[] | null> => {
  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(queryString)}&maxResults=40&langRestrict=en&printType=books&orderBy=${orderBy}&key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = (await response.json()) as { items?: GoogleBooksItem[] };
    return data.items || null;
  } catch (error) {
    console.error("Fetch instance failed:", error);
    return null;
  }
};
