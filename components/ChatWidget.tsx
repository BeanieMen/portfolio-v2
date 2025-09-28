"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";

type Role = "system" | "user" | "assistant";
type Msg = {
  id: string;
  role: Role;
  content: string;
};
const SYSTEM_PROMPT = `
You are Aarjav Jain, a 15-year-old high-school student from India. You are a programmer, chess player, and think about money — talk like a teen who uses Instagram a lot, but switch to professional tone when needed (resumes, technical docs, formal writing).

## Identity & GitHub Persona
- GitHub username: BeanieMen (https://github.com/BeanieMen)
- Role: Developer / Open-source contributor / Portfolio projects owner
- Focus: Programming projects you personally built or maintain
- Style: Casual IG-like voice by default; professional when context requires it
- Always reference your actual projects or repos when relevant. Do not invent projects or credentials.  

## Voice & Style
- **Casual mode (default)**: short, punchy, Instagram captions, emojis allowed. Example: "yooo just pushed a cool TS CLI 😎"  
- **Professional mode**: full sentences, structured, no slang or emojis. Use for resumes, cover letters, API docs, or serious explanations.  
- **Mode triggers**:  
  - PRO → professional  
  - CASUAL] → casual  
  - Otherwise, default = casual

## Behavior Rules
1. **Code-first**: Give runnable code examples. Favor TypeScript, Python, Node, Linux tooling, or technologies present in your GitHub projects.  
2. **Explain simply**: Bullet steps, concise explanations, no chain-of-thought leaks.  
3. **Portfolio-aware**: Reference your GitHub repos in context. Example: “As I did in my BeanieMen project …”  
4. **Smart defaults**: If instructions are vague, pick a reasonable approach and note assumptions.  
5. **Formatting**: Markdown headings, bullets, code fences. In professional mode, add proper sections (Overview, Example, Next Steps).  
6. **Safety & honesty**: Do not hallucinate personal info or claim untrue credentials. Decline unsafe instructions politely.  
7. **Memory limits**: Only use information provided or publicly available on your GitHub.  

## Output Rules
- Start complex answers with a TL;DR.  
- When providing code:  
  - 1–2 line summary  
  - fenced code block  
  - run instructions if applicable  
- Portfolio text: first-person style, concise, and link to GitHub repos.  
- For comparisons, include pros/cons bullets (performance, readability, complexity).  

## Examples
### Casual
TL;DR: Yo, that TS CLI is easy af 😎  
Quick snippet:
\`\`\`ts
import { readFileSync } from "fs";
console.log(readFileSync("example.txt", "utf-8"));
\`\`\`
Wanna push a full repo starter? I gotchu 👀

### Professional
TL;DR: Here’s a minimal TypeScript scaffold for a CLI.  
**Overview:** Reads files and outputs content in a structured way.  
\`\`\`ts
import { readFileSync } from "fs";

function printFile(path: string) {
  const content = readFileSync(path, "utf-8");
  console.log(content);
}
\`\`\`
**Next Steps:** Add error handling, unit tests, and CLI flags.

## Final Reminders
- You are **Aarjav Jain**. Stay in the persona.  
- Default = casual IG-style coder vibes; professional when triggered.  
- Reference BeanieMen repos in context — credibility matters.  
- Ask for clarifications only if necessary; otherwise, make smart assumptions.  
- At public demos, include a disclaimer: "This emulates Aarjav Jain’s GitHub persona for demo purposes."  

END OF SYSTEM PROMPT
`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const push = (m: Omit<Msg, "id">) =>
    setMessages((s) => [
      ...s,
      { ...m, id: Date.now().toString() + Math.random() },
    ]);

  const initConversation = useCallback(async () => {
    setInitialized(true);
    const initialMessages: Msg[] = [
      { id: "s", role: "system", content: SYSTEM_PROMPT },
      { id: "u", role: "user", content: "Hi!" },
    ];

    push({ role: "assistant", content: "..." });
    setLoading(true);
    try {
      const res = await fetch("/api/openrouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: initialMessages }),
      });
      const data = await res.json();
      const assistant =
        data?.choices?.[0]?.message?.content ??
        data?.output ??
        "Sorry, I couldn't get a reply.";

      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.content !== "...");
        return [
          ...withoutOptimistic,
          { id: Date.now().toString(), role: "assistant", content: assistant },
        ];
      });
    } catch (err) {
      setMessages((prev) => {
        console.error(err);
        const withoutOptimistic = prev.filter((m) => m.content !== "...");
        return [
          ...withoutOptimistic,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "Error contacting the chat service.",
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  useEffect(() => {
    if (open && !initialized) {
      initConversation();
    }
  }, [open, initConversation, initialized]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg: Msg = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setInput("");
    push(userMsg);
    setLoading(true);

    const history = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content })),
      { role: userMsg.role, content: userMsg.content },
    ];

    push({ role: "assistant", content: "..." });

    try {
      const res = await fetch("/api/openrouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const assistant =
        data?.choices?.[0]?.message?.content ?? data?.output ?? "(no reply)";

      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.content !== "...");
        return [
          ...withoutOptimistic,
          { id: Date.now().toString(), role: "assistant", content: assistant },
        ];
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.content !== "...");
        return [
          ...withoutOptimistic,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "Failed to send message.",
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="sm:hidden">
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 transition-transform ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="bg-[#0f1724] border-t border-gray-700 p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Chat</span>
                <span className="text-sm text-gray-300">(alpha)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-1 rounded bg-gray-700 text-sm text-white"
                >
                  Close
                </button>
              </div>
            </div>

            <div
              className="h-56 bg-[#071021] rounded p-2 overflow-auto"
              ref={listRef}
            >
              {messages.length === 0 && (
                <div className="text-gray-400">Start the chat below</div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`mb-2 ${
                    m.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-[85%] px-3 py-1.5 rounded ${
                      m.role === "user"
                        ? "bg-[#1f2937] text-white"
                        : "bg-[#0b1220] text-gray-200"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                className="flex-1 px-3 py-2 rounded bg-[#0b1220] text-white outline-none"
                placeholder="Say hi..."
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded bg-indigo-600 text-white"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {!open && (
          <div className="fixed bottom-4 left-4 right-4 z-40">
            <button
              onClick={() => setOpen(true)}
              className="w-full flex items-center justify-between bg-[#0b1220] border border-gray-700 rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-white" />
                <div className="text-left">
                  <div className="text-white font-medium">Chat with Aarjav</div>
                  <div className="text-xs text-gray-400">
                    Quick help, powered by a 7B model
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-300">Open</div>
            </button>
          </div>
        )}
      </div>

      <div className="hidden sm:block">
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {/* panel */}
          {open && (
            <div className="w-96 max-w-sm bg-[#071021] rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-white" />
                  <div className="text-white font-semibold">Chat (7B)</div>
                </div>
                <div>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-2 py-1 text-sm text-gray-300 rounded hover:bg-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="p-3 h-80 overflow-auto" ref={listRef}>
                {messages.length === 0 && (
                  <div className="text-gray-400">
                    Say hi — this starts a conversation with a 7B chat model.
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`mb-3 ${
                      m.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block px-3 py-1.5 rounded ${
                        m.role === "user"
                          ? "bg-gray-700 text-white"
                          : "bg-[#06101a] text-gray-200"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-gray-800 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  className="flex-1 px-3 py-2 rounded bg-[#06101a] text-white outline-none"
                  placeholder="Ask something..."
                />
                <button
                  onClick={sendMessage}
                  className="px-3 py-2 rounded bg-indigo-600 text-white"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setOpen((s) => !s)}
            className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg"
            aria-label="Open chat"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
