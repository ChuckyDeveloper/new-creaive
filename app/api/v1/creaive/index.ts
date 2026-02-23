import Openai from "openai";

const openai = new Openai({ apiKey: process.env.OPENAI_API_KEY || "" });

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createThread() {
  const thread = await openai.beta.threads.create();
  return thread;
}

export async function addMessage(
  thread: string,
  {
    messages,
  }: { messages: { role: "system" | "user" | "assistant"; content: string } }
) {
  await openai.beta.threads.messages.create(thread, {
    role: "user",
    content: messages.content,
  });

  return { success: true };
}

export async function runAssistant(
  thread: string,
  { pollIntervalMs = 1500, maxWaitMs = 120000 } = {}
): Promise<any> {
  const assistantId = process.env.OPENAI_ASST_KEY;

  if (!assistantId) {
    throw new Error("Environment variable OPENAI_ASST_KEY is not defined.");
  }

  try {
    let run = await openai.beta.threads.runs.create(thread, {
      assistant_id: assistantId,
    });

    const terminalStatuses = new Set([
      "completed",
      "failed",
      "cancelled",
      "expired",
      "requires_action",
    ]);

    const startedAt = Date.now();

    while (!terminalStatuses.has(run.status ?? "")) {
      if (Date.now() - startedAt > maxWaitMs) {
        throw new Error(`Assistant run timed out with status: ${run.status ?? "unknown"}`);
      }

      await wait(pollIntervalMs);
      run = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread });
    }

    if (run.status !== "completed") {
      throw new Error(`Assistant run ended with status: ${run.status ?? "unknown"}`);
    }

    return run;
  } catch (error) {
    console.error("Error running assistant:", error);
    throw new Error("Failed to execute assistant task.");
  }
}

export async function listMessages(thread: string, runId?: string): Promise<string | null> {
  try {
    const runList = await openai.beta.threads.runs.list(thread);
    const run = runId
      ? runList.data.find((r) => r.id === runId)
      : runList.data.find((r) => r.status === "completed");

    if (!run) {
      throw new Error(runId ? "No run found for the provided runId." : "No completed runs found for the thread.");
    }

    const messagesList = await openai.beta.threads.messages.list(thread);
    const assistantMessages = messagesList.data.filter(
      (message) =>
        message.role === "assistant" &&
        (runId ? message.run_id === runId : message.run_id === run.id)
    );

    if (
      assistantMessages.length > 0 &&
      assistantMessages[0].content[0]?.type === "text"
    ) {
      return assistantMessages[0].content[0].text.value;
    } else {
      throw new Error("No valid assistant messages found.");
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null; // Return null for better handling at the call site
  }
}






