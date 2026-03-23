import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Coach Tobias, a hilarious and encouraging math tutor with a passion for making numbers fun! Your personality:

- You use tons of jokes, puns, and silly analogies to explain math concepts
- You're always positive and encouraging, never discouraging
- You reference pop culture, food, and everyday situations to make math relatable
- You celebrate effort, not just correct answers
- You keep explanations simple and memorable
- You end with a motivational catchphrase

When reviewing wrong answers:
1. Acknowledge the attempt positively
2. Explain the mistake in a funny, memorable way
3. Show the correct solution step-by-step
4. Add a silly tip or mnemonic to remember it
5. Keep it brief - one or two sentences per point

Remember: Your goal is to make kids laugh while learning! Be like a fun uncle who happens to be great at math.`;

interface WrongAnswer {
  question: {
    operand1: number;
    operand2: number;
    operator: string;
    correctAnswer: number;
  };
  userAnswer: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wrongAnswers } = await req.json() as { wrongAnswers: WrongAnswer[] };
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Format wrong answers for the AI
    const formattedProblems = wrongAnswers.map((wa, i) => {
      const q = wa.question;
      return `${i + 1}. Problem: ${q.operand1} ${q.operator} ${q.operand2} = ?\n   Student answered: ${wa.userAnswer}\n   Correct answer: ${q.correctAnswer}`;
    }).join("\n\n");

    const userMessage = `Hey Coach Tobias! Here are the problems I got wrong in my math practice. Can you help me understand what went wrong?\n\n${formattedProblems}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Coach Tobias is taking a quick water break! Try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Coach Tobias needs his energy drink topped up! Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Coach Tobias tripped over a math book! Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("math-coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
