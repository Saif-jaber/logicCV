import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { getResumeFontFamily } from "@/lib/resume";
import type {
  Resume,
  ResumeAdditional,
  ResumeFontFamily,
} from "@/lib/resume";

const LINE_HEIGHT = 1.2;

const styles = StyleSheet.create({
  page: {
    paddingVertical: 43.2,
    paddingHorizontal: 50.4,
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#000000",
  },
  header: {
    textAlign: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontFamily: "Times-Bold",
    lineHeight: LINE_HEIGHT,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 11,
    lineHeight: LINE_HEIGHT,
  },
  contact: {
    fontSize: 10,
    lineHeight: LINE_HEIGHT,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    borderBottomWidth: 0.75,
    borderBottomColor: "#000000",
    paddingBottom: 4,
    marginTop: 10,
    marginBottom: 4,
    lineHeight: LINE_HEIGHT,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  company: {
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
  },
  role: {
    fontFamily: "Times-Bold",
  },
  bodyText: {
    fontSize: 10,
    lineHeight: LINE_HEIGHT,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
    lineHeight: LINE_HEIGHT,
  },
  bulletGlyph: {
    width: 14,
    fontSize: 10,
    lineHeight: LINE_HEIGHT,
  },
  nestedBulletGlyph: {
    width: 32,
    fontSize: 10,
    lineHeight: LINE_HEIGHT,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: LINE_HEIGHT,
  },
  entry: {
    marginBottom: 6,
  },
  selectedProjects: {
    marginTop: 2,
  },
  selectedProjectsTitle: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    lineHeight: LINE_HEIGHT,
    marginBottom: 2,
  },
});

function getPdfFontNames(fontFamily: ResumeFontFamily) {
  if (fontFamily === "sans") {
    return { regular: "Helvetica", bold: "Helvetica-Bold" };
  }
  if (fontFamily === "mono") {
    return { regular: "Courier", bold: "Courier-Bold" };
  }
  return { regular: "Times-Roman", bold: "Times-Bold" };
}

function SectionHeading({
  children,
  boldFont,
}: {
  children: string;
  boldFont: string;
}) {
  return (
    <Text style={[styles.sectionTitle, { fontFamily: boldFont }]}>
      {children}
    </Text>
  );
}

function Bullet({
  children,
  nested = false,
  regularFont,
}: {
  children: React.ReactNode;
  nested?: boolean;
  regularFont: string;
}) {
  return (
    <View style={styles.bullet}>
      <Text style={nested ? styles.nestedBulletGlyph : styles.bulletGlyph}>
        {nested ? "-" : "\u2022"}
      </Text>
      <Text style={[styles.bulletText, { fontFamily: regularFont }]}>
        {children}
      </Text>
    </View>
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

export function ResumePdf({ resume }: { resume: Resume }) {
  const contacts = [resume.location, resume.email, resume.phone]
    .filter(Boolean)
    .join("   \u2022   ");
  const additional = getAdditionalInformation(resume);
  const font = getPdfFontNames(getResumeFontFamily(resume));

  return (
    <Document>
      <Page size="LETTER" style={[styles.page, { fontFamily: font.regular }]}>
        <View style={styles.header}>
          {resume.name && (
            <Text style={[styles.name, { fontFamily: font.bold }]}>
              {resume.name}
            </Text>
          )}
          {resume.title && <Text style={styles.title}>{resume.title}</Text>}
          {contacts && <Text style={styles.contact}>{contacts}</Text>}
        </View>

        {resume.experience.length > 0 && (
          <View>
            <SectionHeading boldFont={font.bold}>
              PROFESSIONAL EXPERIENCE
            </SectionHeading>
            {resume.experience.map((experience) => (
              <View key={experience.id} style={styles.entry}>
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.bodyText,
                      styles.company,
                      { fontFamily: font.bold },
                    ]}
                  >
                    {experience.company}
                  </Text>
                  {experience.location && (
                    <Text style={styles.bodyText}>{experience.location}</Text>
                  )}
                </View>
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.bodyText,
                      styles.role,
                      { fontFamily: font.bold },
                    ]}
                  >
                    {experience.role}
                  </Text>
                  {experience.period && (
                    <Text style={styles.bodyText}>{experience.period}</Text>
                  )}
                </View>
                {experience.bullets.map((bullet, index) => (
                  <Bullet
                    key={`${experience.id}-bullet-${index}`}
                    regularFont={font.regular}
                  >
                    {bullet}
                  </Bullet>
                ))}
                {experience.projects && experience.projects.length > 0 && (
                  <View style={styles.selectedProjects}>
                    <Text
                      style={[
                        styles.selectedProjectsTitle,
                        { fontFamily: font.bold },
                      ]}
                    >
                      Selected Project Experience
                    </Text>
                    {experience.projects.map((project) => (
                      <View key={project.id}>
                        <Bullet regularFont={font.regular}>
                          {project.name}
                        </Bullet>
                        {project.bullets.map((bullet, index) => (
                          <Bullet
                            key={`${project.id}-bullet-${index}`}
                            nested
                            regularFont={font.regular}
                          >
                            {bullet}
                          </Bullet>
                        ))}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {resume.education.length > 0 && (
          <View>
            <SectionHeading boldFont={font.bold}>EDUCATION</SectionHeading>
            {resume.education.map((education) => (
              <View key={education.id} style={styles.entry}>
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.bodyText,
                      styles.company,
                      { fontFamily: font.bold },
                    ]}
                  >
                    {education.school}
                  </Text>
                  {education.location && (
                    <Text style={styles.bodyText}>{education.location}</Text>
                  )}
                </View>
                <View style={styles.row}>
                  <Text style={styles.bodyText}>{education.degree}</Text>
                  {education.period && (
                    <Text style={styles.bodyText}>{education.period}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {resume.customSections?.map((section) => (
          <View key={section.id}>
            <SectionHeading boldFont={font.bold}>
              {section.title}
            </SectionHeading>
            {section.items.map((item, index) => (
              <Bullet
                key={`${section.id}-item-${index}`}
                regularFont={font.regular}
              >
                {item}
              </Bullet>
            ))}
          </View>
        ))}

        {additional.length > 0 && (
          <View>
            <SectionHeading boldFont={font.bold}>
              ADDITIONAL INFORMATION
            </SectionHeading>
            {additional.map(
              ({ label, items }) =>
                items.length > 0 && (
                <Bullet key={label} regularFont={font.regular}>
                  <Text style={{ fontFamily: font.bold }}>{label}:</Text>
                    <Text> {items.join(", ")}</Text>
                  </Bullet>
                )
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
