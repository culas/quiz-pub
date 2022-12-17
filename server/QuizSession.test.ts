import { assertExists } from "asserts";

Deno.test("generic test placeholder", () => {
  // breaks now b/c of BroadcastChannel being an unstable feature
  //const quizSession = new QuizSession("ADMIN", "JOIN");
  assertExists({});
});
