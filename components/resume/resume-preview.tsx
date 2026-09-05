import type { Resume } from "@/lib/resume";

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-gray-300 select-none" aria-hidden="true">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-gray-200 pb-1 text-xs font-bold tracking-widest text-gray-500 uppercase">
      {children}
    </h3>
  );
}

export function ResumePreview({ resume }: { resume: Resume }) {
  const contacts = [resume.email, resume.phone, resume.location].filter(
    Boolean
  );

  return (
    <div className="mx-auto w-full max-w-[560px] rounded-lg bg-white p-6 text-gray-900 shadow-sm sm:p-8">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">
          {resume.name || <Placeholder>Your Name</Placeholder>}
        </h2>
        <p className="mt-0.5 text-sm font-medium text-gray-500">
          {resume.title || <Placeholder>Professional Title</Placeholder>}
        </p>
        <p className="mt-2 text-[11px] text-gray-400">
          {contacts.length > 0 ? (
            contacts.join(" · ")
          ) : (
            <Placeholder>email@example.com · phone · location</Placeholder>
          )}
        </p>
      </header>

      <section className="mt-5">
        <SectionTitle>Summary</SectionTitle>
        <p className="mt-2 text-xs leading-relaxed text-gray-600">
          {resume.summary.trim().length > 0 ? (
            resume.summary
          ) : (
            <Placeholder>Your professional summary will appear here.</Placeholder>
          )}
        </p>
      </section>

      <section className="mt-5">
        <SectionTitle>Experience</SectionTitle>
        {resume.experience.length === 0 ? (
          <p className="mt-2 text-xs text-gray-400">
            <Placeholder>Add your work history by chatting below.</Placeholder>
          </p>
        ) : (
          resume.experience.map((exp) => (
            <div key={exp.id} className="mt-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold">
                  {exp.role || exp.company}
                </p>
                <p className="text-[11px] whitespace-nowrap text-gray-400">
                  {exp.period}
                </p>
              </div>
              {exp.company && (
                <p className="text-xs font-medium text-gray-500">
                  {exp.company}
                </p>
              )}
              {exp.bullets.length > 0 && (
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-gray-600">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </section>

      <section className="mt-5">
        <SectionTitle>Education</SectionTitle>
        {resume.education.length === 0 ? (
          <p className="mt-2 text-xs text-gray-400">
            <Placeholder>Your education will appear here.</Placeholder>
          </p>
        ) : (
          resume.education.map((edu) => (
            <div key={edu.id} className="mt-2">
              <p className="text-sm font-semibold">{edu.degree}</p>
              {edu.school && (
                <p className="text-xs text-gray-500">{edu.school}</p>
              )}
            </div>
          ))
        )}
      </section>

      {resume.projects.length > 0 && (
        <section className="mt-5">
          <SectionTitle>Projects</SectionTitle>
          {resume.projects.map((project) => (
            <div key={project.id} className="mt-2">
              <p className="text-sm font-semibold">{project.name}</p>
              <p className="text-xs leading-relaxed text-gray-600">
                {project.description}
              </p>
            </div>
          ))}
        </section>
      )}

      <section className="mt-5">
        <SectionTitle>Skills</SectionTitle>
        {resume.skills.length === 0 ? (
          <p className="mt-2 text-xs text-gray-400">
            <Placeholder>Your key skills will appear here.</Placeholder>
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {resume.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}