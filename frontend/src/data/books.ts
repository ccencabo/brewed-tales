export interface Book {
  id: string;
  title: string;
  author: string;
  emoji: string;
  coverColor: string;
  clue1: string;
  clue2: string;
  clue3: string;
  coverUrl?: string; // Pulled dynamically from Google Books!
}
