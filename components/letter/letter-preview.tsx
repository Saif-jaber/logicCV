import type { Letter } from "@/lib/letter";
import { PageBlock } from "@/components/paginated";

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-gray-300 select-none" aria-hidden="true">
      {children}
    </span>
  );
}

export function LetterPreview({ letter }: { letter: Letter }) {
  const contact = [letter.email, letter.phone, letter.location].filter(Boolean);

  return (
    <div className="relative bg-white p-8 text-gray-900">
      <span className="absolute top-0 right-0 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
        {letter.kind === "application" ? "Application" : "Cover"}
      </span>
      <PageBlock>
        <header>
          <p className="text-lg font-bold tracking-tight">
            {letter.senderName || <Placeholder>Your Name</Placeholder>}
          </p>
          <p className="mt-0.5 text-sm text-gray-500">
            {letter.senderTitle || <Placeholder>Your Title</Placeholder>}
          </p>
          <p className="mt-2 text-[11px] text-gray-400">
            {contact.length > 0 ? (
              contact.join(" · ")
            ) : (
              <Placeholder>email@example.com · phone · location</Placeholder>
            )}
          </p>
        </header>
      </PageBlock>

      <PageBlock>
        <div className="mt-7">
          <p className="text-xs text-gray-500">
            Dear {letter.recipientName || <Placeholder>Hiring Manager</Placeholder>},
          </p>
        </div>
      </PageBlock>

      {letter.body.length === 0 ? (
        <PageBlock>
          <div className="mt-4 space-y-3">
            <p className="text-xs leading-relaxed text-gray-300">
              <Placeholder>
                {letter.kind === "application"
                  ? "Your opening — the company you're applying to and why."
                  : "Your opening paragraph — why you're interested in the role."}
              </Placeholder>
            </p>
            <p className="text-xs leading-relaxed text-gray-300">
              <Placeholder>
                Your strong selling points, written as a natural story.
              </Placeholder>
            </p>
            <p className="text-xs leading-relaxed text-gray-300">
              <Placeholder>
                Your closing paragraph and a polite thank you.
              </Placeholder>
            </p>
          </div>
        </PageBlock>
      ) : (
        letter.body.map((paragraph, i) => (
          <PageBlock key={i}>
            <p className="mt-3 text-xs leading-relaxed text-gray-600 first:mt-4">
              {paragraph}
            </p>
          </PageBlock>
        ))
      )}

      <PageBlock>
        <div>
          <p className="mt-6 text-xs text-gray-500">
            {letter.valediction || <Placeholder>Best regards</Placeholder>},
          </p>
          <p className="mt-1.5 text-sm font-semibold">
            {letter.senderName || <Placeholder>Your Name</Placeholder>}
          </p>
        </div>
      </PageBlock>
    </div>
  );
}