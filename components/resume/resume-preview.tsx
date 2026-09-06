import type { Resume } from "@/lib/resume";
import { PageBlock } from "@/components/paginated";

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
    <div className="w-full bg-white p-6 text-gray-900 sm:p-8">
      <PageBlock>
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
      </PageBlock>

      {resume.summary.trim().length > 0 && (
        <PageBlock>
          <section className="mt-5">
            <SectionTitle>Summary</SectionTitle>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              {resume.summary}
            </p>
          </section>
        </PageBlock>
      )}

      {resume.experience.length > 0 && (
        <PageBlock>
          <section className="mt-5">
            <SectionTitle>Experience</SectionTitle>
          </section>
        </PageBlock>
      )}
      {resume.experience.map((exp) => (
        <PageBlock key={exp.id}>
          <div className="mt-3">
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
        </PageBlock>
      ))}

      {resume.education.length > 0 && (
        <PageBlock>
          <section className="mt-5">
            <SectionTitle>Education</SectionTitle>
          </section>
        </PageBlock>
      )}
      {resume.education.map((edu) => (
        <PageBlock key={edu.id}>
          <div className="mt-2">
            <p className="text-sm font-semibold">{edu.degree}</p>
            {edu.school && (
              <p className="text-xs text-gray-500">{edu.school}</p>
            )}
          </div>
        </PageBlock>
      ))}

      {resume.projects.length > 0 && (
        <PageBlock>
          <section className="mt-5">
            <SectionTitle>Projects</SectionTitle>
          </section>
        </PageBlock>
      )}
      {resume.projects.map((project) => (
        <PageBlock key={project.id}>
          <div className="mt-2">
            <p className="text-sm font-semibold">{project.name}</p>
            <p className="text-xs leading-relaxed text-gray-600">
              {project.description}
            </p>
          </div>
        </PageBlock>
      ))}

      {resume.skills.length > 0 && (
        <PageBlock>
          <section className="mt-5">
            <SectionTitle>Skills</SectionTitle>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-gray-600">
              {resume.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </section>
        </PageBlock>
      )}
    </div>
  );
}