import { assertExists } from "asserts";
import { QuizSession } from "./QuizSession.ts";

Deno.test("generic test placeholder", () => {
  const quizSession = new QuizSession("ADMIN", "JOIN", {} as WebSocket);
  assertExists(quizSession);
});
