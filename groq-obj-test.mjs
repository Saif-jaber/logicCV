import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

const docSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  summary: z.string(),
  experience: z.array(
    z.object({
      id: z.string(),
      role: z.string(),
      company: z.string(),
      period: z.string(),
      bullets: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      id: z.string(),
      degree: z.string(),
      school: z.string(),
      period: z.string(),
    })
  ),
  skills: z.array(z.string()),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
    })
  ),
});

const outSchema = z.object({
  message: z.string(),
  stage: z.enum(["onboarding", "chat"]),
  document: docSchema,
  pending: z.enum(["summary", "experience", "skills", "project"]).nullable(),
  suggestions: z.array(z.string()),
});

const result = await generateObject({
  model: groq(process.env.GROQ_MODEL),
  system: "You are a CV assistant. Return the FULL updated document JSON.",
  messages: [
    { role: "user", content: "jady robby a front end web dev with 3y+ experience" },
  ],
  schema: outSchema,
});
console.log("OK message:", result.object.message);
console.log(JSON.stringify(result.object.document, null, 2).slice(0, 800));
