import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Resume } from "@/lib/resume";

const LINE_HEIGHT = 1.5;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    lineHeight: 1.2,
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#4b5563",
    lineHeight: 1.3,
  },
  contact: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: LINE_HEIGHT,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 4,
    marginTop: 20,
    marginBottom: 10,
    lineHeight: 1.3,
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  role: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    lineHeight: 1.3,
  },
  period: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.3,
  },
  bodyText: {
    fontSize: 10,
    lineHeight: LINE_HEIGHT,
    color: "#374151",
  },
  bullet: {
    flexDirection: "row",
    marginTop: 2,
    marginBottom: 3,
  },
  bulletDot: {
    width: 12,
    fontSize: 10,
    lineHeight: LINE_HEIGHT,
    color: "#374151",
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: LINE_HEIGHT,
    color: "#374151",
  },
  entry: {
    marginBottom: 12,
  },
  projectName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    lineHeight: 1.3,
  },
});

function SectionHeading({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function ResumePdf({ resume }: { resume: Resume }) {
  const contacts = [resume.email, resume.phone, resume.location]
    .filter(Boolean)
    .join("   |   ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {resume.name && <Text style={styles.name}>{resume.name}</Text>}
        {resume.title && <Text style={styles.title}>{resume.title}</Text>}
        {contacts && <Text style={styles.contact}>{contacts}</Text>}

        {resume.summary.trim().length > 0 && (
          <View>
            <SectionHeading>SUMMARY</SectionHeading>
            <Text style={styles.bodyText}>{resume.summary}</Text>
          </View>
        )}

        {resume.experience.length > 0 && (
          <View>
            <SectionHeading>EXPERIENCE</SectionHeading>
            {resume.experience.map((exp) => (
              <View key={exp.id} style={styles.entry}>
                {exp.role && (
                  <View style={styles.roleRow}>
                    <Text style={styles.role}>{exp.role}</Text>
                    {exp.period && <Text style={styles.period}>{exp.period}</Text>}
                  </View>
                )}
                {exp.company && <Text style={styles.bodyText}>{exp.company}</Text>}
                {exp.bullets.map((bullet, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>{"\u2022"}</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {resume.education.length > 0 && (
          <View>
            <SectionHeading>EDUCATION</SectionHeading>
            {resume.education.map((edu) => (
              <View key={edu.id} style={styles.entry}>
                <View style={styles.roleRow}>
                  <Text style={styles.role}>{edu.degree}</Text>
                  {edu.period && <Text style={styles.period}>{edu.period}</Text>}
                </View>
                {edu.school && <Text style={styles.bodyText}>{edu.school}</Text>}
              </View>
            ))}
          </View>
        )}

        {resume.projects.length > 0 && (
          <View>
            <SectionHeading>PROJECTS</SectionHeading>
            {resume.projects.map((project) => (
              <View key={project.id} style={styles.entry}>
                {project.name && (
                  <Text style={styles.projectName}>{project.name}</Text>
                )}
                {project.description && (
                  <Text style={styles.bodyText}>{project.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {resume.skills.length > 0 && (
          <View>
            <SectionHeading>SKILLS</SectionHeading>
            {resume.skills.map((skill) => (
              <View key={skill} style={styles.bullet}>
                <Text style={styles.bulletDot}>{"\u2022"}</Text>
                <Text style={styles.bulletText}>{skill}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}