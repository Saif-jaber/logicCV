const fs = require("fs");
const path = require("path");

// Load .env
for (const line of fs
  .readFileSync(path.join(process.cwd(), ".env"), "utf8")
  .split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)="?([^"]*)"?$/);
  if (m) process.env[m[1]] = m[2];
}

const { generateObject } = require("ai");
const { groq } = require("@ai-sdk/groq");
const { z } = require("zod");

const resumeDocumentSchema = z.object({
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

const outputSchema = z.object({
  message: z.string(),
  stage: z.enum(["onboarding", "chat"]),
  document: resumeDocumentSchema,
  pending: z
    .enum(["summary", "experience", "skills", "project"])
    .nullable(),
  suggestions: z.array(z.string()),
});

(async () => {
  console.log("MODEL:", process.env.GROQ_MODEL);
  console.log("KEY len:", (process.env.GROQ_API_KEY || "").length);
  try {
    const { object } = await generateObject({
      model: groq(process.env.GROQ_MODEL),
      system: "You are a resume-building assistant.",
      messages: [
        {
          role: "user",
          content:
            "My name is John Frody and I'm a Senior Frontend Engineer.",
        },
      ],
      schema: outputSchema,
    });
    console.log("SUCCESS:", JSON.stringify(object).slice(0, 400));
  } catch (e) {
    console.log("FAILED:", e.message);
    console.log("name:", e.name, "status:", e.statusCode);
    if (e.cause) console.log("cause:", e.cause.message);
    if (e.responseBody) console.log("responseBody:", e.responseBody);
  }
})();
