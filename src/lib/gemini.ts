import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const geminiSummariseCommit = async (diff: string) => {
  const response = await model.generateContent([
    `
You are an expert software engineer specializing in analyzing and summarizing \`git diff\` changes. Below are important guidelines and instructions for your task:

/// Understanding Git Diff Format ///
1. Metadata Lines:
   - Each file in the diff starts with metadata, such as:
     \`\`\`
     diff --git a/path/to/file b/path/to/file
     new file mode 100644
     index <old-hash>..<new-hash>
     --- <old-file>
     +++ <new-file>
     \`\`\`
     - \`new file mode\`: Indicates a new file was added.
     - \`--- /dev/null\`: Marks the file as newly added.
     - \`+++ b/path/to/file\`: Shows the new file's path.

2. Content Changes:
   - Lines starting with \`+\` are **additions**.
   - Lines starting with \`-\` are **deletions**.
   - Lines with no prefix (\` \`) provide **context** to the changes.

3. Additional Information:
   - Each diff chunk begins with a line like \`@@ -<old> +<new> @@\`, showing the line numbers impacted in the file.

/// Your Task ///
- Analyze the provided \`git diff\` and summarize its changes effectively.
- Focus on the purpose, functionality, and key impact of the changes rather than line-by-line details.
- Include new files, modified functionality, removed features, or other relevant aspects.

/// Example Summary Format ///
- Added a new API endpoint in pages/api/example.ts to handle user input using a Python script in scripts/example.py.
- Improved error handling and output formatting in scripts/example.py.
- Refactored utils/oldUtil.js to improve performance.
- Removed unused files: legacy/oldFile.js.

/// Notes for Effective Summaries ///
- If there are fewer or unclear changes, infer the intent based on the context provided.
- Avoid overly verbose or repetitive descriptions.
- Do not include parts of the example summary in your response. It is only for guidance.

/// Task Request ///
Please analyze and summarize the following \`git diff\` file:
\`\`\`
${diff}
\`\`\`
`,
  ]);

  return response.response.text();
};

export const summariseCode = async (doc: Document) => {
  try {
    const code = doc.pageContent.slice(0, 10000); // 10000 character limit
    const response = await model.generateContent([
      `You are an expert software engineer specializing in onboarding new developers to a codebase. 
    You are onboarding a junior software engineer and explaining them the purpose of the ${doc.metadata.source} file.
    Here is the code:
    ----
    ${code}
    ----
    Give a summary no more than 100 words explaining the purpose of the code and what it does.`,
    ]);

    return response.response.text();
  } catch (error) {
    return "";
  }
};

export const generateEmbedding = async (summary: string) => {
  const model = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });
  const response = await model.embedContent(summary);
  const embedding = response.embedding;
  return embedding.values;
};
