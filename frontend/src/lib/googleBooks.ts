import type { Book } from "@/data/books";
import { generateBookTeaser } from "./aiTeaser";

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

const cozyColors = ["bg-washi-pink/10", "bg-washi-mint/10", "bg-washi-gold/10"];

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

  const queryParts = [`subject:${genre}`];
  if (moodKeyword) queryParts.push(moodKeyword);
  if (priorityKeyword) queryParts.push(priorityKeyword);
  if (pacingKeyword) queryParts.push(pacingKeyword);

  let targetQuery = queryParts.join(" ");
  let items = await executeFetch(targetQuery);

  // NEW: Filter out books the user has already seen
  if (items) items = items.filter((item: any) => !excludeIds.includes(item.id));

  // Strategy 2 (Safety Net)
  if (!items || items.length < 3) {
    targetQuery = `subject:${genre} ${moodKeyword}`.trim();
    const moreItems = await executeFetch(targetQuery);
    if (moreItems) {
      // Filter the new batch too, then combine them
      const filteredMore = moreItems.filter(
        (item: any) => !excludeIds.includes(item.id),
      );
      items = [...(items || []), ...filteredMore];
    }
  }

  // Strategy 3 (Ultimate Fallback)
  if (!items || items.length < 3) {
    targetQuery = `subject:${genre}`;
    const evenMoreItems = await executeFetch(targetQuery);
    if (evenMoreItems) {
      const filteredEvenMore = evenMoreItems.filter(
        (item: any) => !excludeIds.includes(item.id),
      );
      items = [...(items || []), ...filteredEvenMore];
    }
  }

  // NEW: Deduplicate items by ID (just in case our fallback strategies grabbed the same popular book twice)
  const uniqueItems = Array.from(
    new Map((items || []).map((item: any) => [item.id, item])).values(),
  );

  // Shuffle and grab the top 3
  const shuffled = uniqueItems.sort(() => 0.5 - Math.random()).slice(0, 3);

  return Promise.all(
    shuffled.map(async (item: any, index: number) => {
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
const executeFetch = async (queryString: string) => {
  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(queryString)}&maxResults=12&langRestrict=en&printType=books&key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.items || null;
  } catch (error) {
    console.error("Fetch instance failed:", error);
    return null;
  }
};
