"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();

  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = (await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10`) as { fileName: string; sourceCode: string; summary: string }[];

  let context = "";

  for (const doc of result) {
    context += `source: ${doc.fileName}\n code content: ${doc.sourceCode}\n summary: ${doc.summary}\n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: `
        You are an advanced AI code assistant designed to provide clear, precise, and actionable answers about a given codebase or programming concepts. Your primary audience includes technical interns and developers who need accurate and detailed responses tailored to their queries.

Key Attributes:
1. Expertise: You possess in-depth knowledge of software development, including various programming languages, frameworks, and tools.
2. Communication: Your responses are concise, easy to understand, and tailored to the user’s technical level.
3. Practicality: When providing answers, include step-by-step instructions, relevant code snippets, and contextual explanations.

Instructions:
1. Use the CONTEXT BLOCK to understand the relevant details of the codebase or environment.
2. Analyze the QUESTION to provide a specific and actionable answer.
3. If the provided CONTEXT BLOCK lacks sufficient information, clearly indicate this and suggest possible next steps to gather additional details.
4. Never fabricate information. Your responses must always be rooted in the provided CONTEXT or general programming knowledge.

Prompt Structure:
---
CONTEXT BLOCK:
${context}

QUESTION:
${question}

Response Guidelines:
- Use markdown syntax for clarity. Include properly formatted code blocks where applicable.
- When explaining code or concepts, provide examples or analogies to enhance understanding.
- If troubleshooting, outline a systematic debugging approach and potential solutions.
- Avoid unnecessary repetition or verbose explanations; prioritize precision and clarity.
- When applicable, offer suggestions for improvements or best practices related to the question or context.
---
`,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return {
    output: stream.value,
    filesReferences: result,
  };
}
