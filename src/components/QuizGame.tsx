import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Question, getRandomQuestions } from "@/data/questions";
import { Ghost, Skull } from "lucide-react";

interface UserAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  options: string[];
  isCorrect: boolean;
  summary?: string;
}

export const QuizGame = () => {
  const [gameState, setGameState] = useState<"start" | "quiz" | "results" | "review">("start");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loadingSummaries, setLoadingSummaries] = useState(false);

  const startQuiz = () => {
    const randomQuestions = getRandomQuestions(10);
    setQuestions(randomQuestions);
    setGameState("quiz");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;

    setUserAnswers([
      ...userAnswers,
      {
        question: currentQuestion.question,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.answer,
        options: currentQuestion.options,
        isCorrect,
      },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setGameState("results");
    }
  };

  const generateSummaries = async () => {
    setLoadingSummaries(true);
    const updatedAnswers = await Promise.all(
      userAnswers.map(async (answer) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-summary`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                question: answer.question,
                answer: answer.correctAnswer,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to generate summary");
          }

          const data = await response.json();
          return { ...answer, summary: data.summary };
        } catch (error) {
          console.error("Error generating summary:", error);
          return { ...answer, summary: "Summary unavailable." };
        }
      })
    );
    setUserAnswers(updatedAnswers);
    setLoadingSummaries(false);
    setGameState("review");
  };

  const correctAnswersCount = userAnswers.filter((a) => a.isCorrect).length;

  if (gameState === "start") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center gap-4 text-primary">
              <Ghost className="w-12 h-12 animate-bounce" />
              <Skull className="w-12 h-12 animate-pulse" />
              <Ghost className="w-12 h-12 animate-bounce" />
            </div>
            <CardTitle className="text-5xl font-bold text-primary">
              🎃 Trick or Trivia
            </CardTitle>
            <CardDescription className="text-xl text-foreground/80">
              Test your spooky smarts!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={startQuiz} size="lg" className="text-lg px-8">
              Start the Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === "quiz") {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-primary/20">
          <CardHeader>
            <CardDescription className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardDescription>
            <CardTitle className="text-2xl text-foreground">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-4"
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <Button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="w-full"
              size="lg"
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === "results") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl text-primary mb-4">
              Quiz Complete! 🎃
            </CardTitle>
            <CardDescription className="text-2xl text-foreground">
              You got {correctAnswersCount} out of {questions.length} correct!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={generateSummaries}
              disabled={loadingSummaries}
              className="w-full"
              size="lg"
            >
              {loadingSummaries ? "Generating Spooky Summaries..." : "Review Questions"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === "review") {
    return (
      <div className="min-h-screen p-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-primary">
                Review Your Answers
              </CardTitle>
              <CardDescription className="text-xl">
                Score: {correctAnswersCount}/{questions.length}
              </CardDescription>
            </CardHeader>
          </Card>

          {userAnswers.map((answer, index) => (
            <Card
              key={index}
              className={`border-2 ${
                answer.isCorrect ? "border-green-500/50" : "border-destructive/50"
              }`}
            >
              <CardHeader>
                <CardDescription>Question {index + 1}</CardDescription>
                <CardTitle className="text-xl text-foreground">{answer.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  {answer.options.map((option) => {
                    const isUserAnswer = option === answer.userAnswer;
                    const isCorrectAnswer = option === answer.correctAnswer;
                    
                    let variant: "outline" | "default" | "destructive" = "outline";
                    if (isCorrectAnswer) variant = "default";
                    else if (isUserAnswer && !answer.isCorrect) variant = "destructive";

                    return (
                      <Button
                        key={option}
                        variant={variant}
                        className="w-full justify-start text-left h-auto py-3 cursor-default"
                        disabled
                      >
                        {option}
                        {isUserAnswer && !answer.isCorrect && " (Your answer)"}
                        {isCorrectAnswer && " ✓"}
                      </Button>
                    );
                  })}
                </div>
                {answer.summary && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground font-semibold mb-1">
                      Spooky Fact:
                    </p>
                    <p className="text-foreground">{answer.summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <Button onClick={startQuiz} className="w-full" size="lg">
                Play Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};
