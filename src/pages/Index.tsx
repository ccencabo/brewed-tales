import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WelcomeScreen from "../components/WelcomeScreen";
import QuizScreen from "../components/QuizScreen";
import BrewingComplete from "../components/BrewingComplete";
import BlindDateReveal from "../components/BlindDateReveal";
import { fetchMatchesFromAnswers } from "../lib/googleBooks";
import type { Book } from "../data/books";

type Screen = "welcome" | "quiz" | "brewing" | "results";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [matchedBooks, setMatchedBooks] = useState<Book[]>([]);
  const [lastAnswers, setLastAnswers] = useState<Record<string, string>>({});
  const [chosenIngredients, setChosenIngredients] = useState<string[]>([]);
  const [isFetchingMatches, setIsFetchingMatches] = useState(false);

  // NEW: Bring back the memory state!
  const [shownBookIds, setShownBookIds] = useState<string[]>([]);

  const handleQuizComplete = async (
    answers: Record<string, string>,
    ingredients: string[],
  ) => {
    setLastAnswers(answers);
    setChosenIngredients(ingredients);

    // Clear the memory when starting a brand new quiz
    setShownBookIds([]);

    setScreen("brewing");
    setIsFetchingMatches(true);

    // Pass an empty array since it's the first fetch
    const recommendations = await fetchMatchesFromAnswers(answers, []);

    setMatchedBooks(recommendations);
    // Save these 3 IDs to our memory
    setShownBookIds(recommendations.map((book) => book.id));
    setIsFetchingMatches(false);
  };

  const handleGenerateMore = useCallback(async () => {
    setIsFetchingMatches(true);

    // NEW: Pass the memory array to Google so it skips them
    const recommendations = await fetchMatchesFromAnswers(
      lastAnswers,
      shownBookIds,
    );

    if (recommendations.length > 0) {
      setMatchedBooks(recommendations);
      // Append the new IDs to our memory
      setShownBookIds((prev) => [
        ...prev,
        ...recommendations.map((book) => book.id),
      ]);
    }

    setIsFetchingMatches(false);
  }, [lastAnswers, shownBookIds]);

  const handleReset = () => {
    setMatchedBooks([]);
    setChosenIngredients([]);
    setShownBookIds([]); // Clear memory
    setScreen("welcome");
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {screen === "welcome" && (
          <WelcomeScreen onStart={() => setScreen("quiz")} />
        )}

        {screen === "quiz" && <QuizScreen onComplete={handleQuizComplete} />}

        {screen === "brewing" && (
          <BrewingComplete
            ingredients={chosenIngredients}
            onComplete={() => setScreen("results")}
          />
        )}

        {screen === "results" && (
          <BlindDateReveal
            books={matchedBooks}
            ingredients={chosenIngredients}
            onReset={handleReset}
            onGenerateMore={handleGenerateMore}
            hasMore={true}
            isLoading={isFetchingMatches}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
