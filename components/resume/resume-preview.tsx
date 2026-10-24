import { PageBlock } from "@/components/paginated";
import {
  getResumeFontFamily,
  type Resume,
  type ResumeAdditional,
} from "@/lib/resume";

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-gray-300 select-none" aria-hidden="true">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-1 mt-[10pt] border-b border-black pb-1 text-[11pt] font-bold leading-[1.2] text-black uppercase">
      {children}
    </h3>
  );
}

function Bullet({
  children,
  glyph = "●",
  indent = 14,
}: {
  children: React.ReactNode;
  glyph?: string;
  indent?: number;
}) {
  return (
    <li
      className="flex gap-1 text-[10pt] leading-[1.2] text-black"
      style={{ marginLeft: indent }}
    >
      <span aria-hidden="true" className="shrink-0">
        {glyph}
      </span>
      <span>{children}</span>
    </li>
  );
}

function getAdditionalInformation(resume: Resume): ResumeAdditional[] {
  const additional = [...(resume.additional ?? [])];
  const labels = new Set(
    additional.map(({ label }) => label.trim().toLowerCase())
  );

  if (
    resume.summary.trim() &&
    !labels.has("professional summary") &&
    !labels.has("summary")
  ) {
    additional.push({
      label: "Professional Summary",
      items: [resume.summary.trim()],
    });
  }

  if (
    resume.skills.length > 0 &&
    !labels.has("technical skills") &&
    !labels.has("skills")
  ) {
    additional.push({ label: "Technical Skills", items: resume.skills });
  }

  if (resume.projects.length > 0 && !labels.has("projects")) {
    additional.push({
      label: "Projects",
      items: resume.projects.map(({ name, description }) =>
        description ? `${name}: ${description}` : name
      ),
    });
  }

  return additional;
}

export function ResumePreview({ resume }: { resume: Resume }) {
  const contacts = [resume.location, resume.email, resume.phone].filter(
    Boolean
  );
  const additional = getAdditionalInformation(resume);
  const fontFamily = getResumeFontFamily(resume);
  const fontClass = {
    serif: "font-serif",
    sans: "font-sans",
    mono: "font-mono",
  }[fontFamily];

  return (
    <div className={`w-full bg-white text-black ${fontClass}`}>
      <PageBlock>
        <header className="text-center">
          <h2 className="text-[20pt] font-bold leading-[1.2] uppercase">
            {resume.name || <Placeholder>Your Name</Placeholder>}
          </h2>
          <p className="text-[11pt] leading-[1.2]">
            {resume.title || <Placeholder>Professional Title</Placeholder>}
          </p>
          <p className="mt-1 text-[10pt] leading-[1.2]">
            {contacts.length > 0 ? (
              contacts.join(" • ")
            ) : (
              <Placeholder>City, State ZIP • email • phone</Placeholder>
            )}
          </p>
        </header>
      </PageBlock>

      {resume.experience.length > 0 && (
        <PageBlock>
          <section>
            <SectionTitle>Professional Experience</SectionTitle>
          </section>
        </PageBlock>
      )}
      {resume.experience.map((experience) => (
        <PageBlock key={experience.id}>
          <article className="mb-[6pt]">
            <div className="flex items-baseline justify-between gap-3 text-[10pt] leading-[1.2]">
              <p className="font-bold uppercase">{experience.company}</p>
              {experience.location && (
                <p className="shrink-0 text-right">{experience.location}</p>
              )}
            </div>
            <div className="flex items-baseline justify-between gap-3 text-[10pt] leading-[1.2]">
              <p className="font-bold">{experience.role}</p>
              {experience.period && (
                <p className="shrink-0 text-right">{experience.period}</p>
              )}
            </div>
            {experience.bullets.length > 0 && (
              <ul className="mt-1 space-y-[2pt]">
                {experience.bullets.map((bullet, index) => (
                  <Bullet key={`${experience.id}-bullet-${index}`}>
                    {bullet}
                  </Bullet>
                ))}
              </ul>
            )}
            {experience.projects && experience.projects.length > 0 && (
              <div className="mt-1">
                <p className="text-[10pt] font-bold leading-[1.2]">
                  Selected Project Experience
                </p>
                {experience.projects.map((project) => (
                  <div key={project.id}>
                    <ul className="mt-[2pt]">
                      <Bullet>{project.name}</Bullet>
                    </ul>
                    {project.bullets.length > 0 && (
                      <ul className="mt-[2pt] space-y-[2pt]">
                        {project.bullets.map((bullet, index) => (
                          <Bullet
                            key={`${project.id}-bullet-${index}`}
                            glyph="-"
                            indent={32}
                          >
                            {bullet}
                          </Bullet>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </article>
        </PageBlock>
      ))}

      {resume.education.length > 0 && (
        <PageBlock>
          <section>
            <SectionTitle>Education</SectionTitle>
          </section>
        </PageBlock>
      )}
      {resume.education.map((education) => (
        <PageBlock key={education.id}>
          <article className="mb-[6pt]">
            <div className="flex items-baseline justify-between gap-3 text-[10pt] leading-[1.2]">
              <p className="font-bold uppercase">{education.school}</p>
              {education.location && (
                <p className="shrink-0 text-right">{education.location}</p>
              )}
            </div>
            <div className="flex items-baseline justify-between gap-3 text-[10pt] leading-[1.2]">
              <p>{education.degree}</p>
              {education.period && (
                <p className="shrink-0 text-right">{education.period}</p>
              )}
            </div>
          </article>
        </PageBlock>
      ))}

      {resume.customSections?.map((section) => (
        <PageBlock key={section.id}>
          <section>
            <SectionTitle>{section.title}</SectionTitle>
            <ul className="space-y-[2pt]">
              {section.items.map((item, index) => (
                <Bullet key={`${section.id}-item-${index}`}>{item}</Bullet>
              ))}
            </ul>
          </section>
        </PageBlock>
      ))}

      {additional.length > 0 && (
        <PageBlock>
          <section>
            <SectionTitle>Additional Information</SectionTitle>
            <ul className="space-y-[2pt]">
              {additional.flatMap(({ label, items }) =>
                items.length > 0
                  ? [
                      <Bullet key={label}>
                        <strong>{label}:</strong> {items.join(", ")}
                      </Bullet>,
                    ]
                  : []
              )}
            </ul>
          </section>
        </PageBlock>
      )}
    </div>
  );
}
