import { Document, Page, StyleSheet, Text } from "@react-pdf/renderer";
import type { Letter } from "@/lib/letter";

const LINE_HEIGHT = 1.6;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
  },
  name: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    lineHeight: 1.2,
  },
  senderTitle: {
    fontSize: 11,
    color: "#4b5563",
    lineHeight: 1.4,
  },
  contact: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: LINE_HEIGHT,
  },
  greeting: {
    fontSize: 10,
    color: "#111827",
    marginTop: 20,
    lineHeight: LINE_HEIGHT,
  },
  paragraph: {
    fontSize: 10,
    color: "#111827",
    marginTop: 12,
    lineHeight: LINE_HEIGHT,
  },
  valediction: {
    fontSize: 10,
    color: "#111827",
    marginTop: 22,
    lineHeight: LINE_HEIGHT,
  },
  signature: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginTop: 6,
    lineHeight: 1.4,
  },
});

export function LetterPdf({ letter }: { letter: Letter }) {
  const contacts = [letter.email, letter.phone, letter.location]
    .filter(Boolean)
    .join("   |   ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {letter.senderName && (
          <Text style={styles.name}>{letter.senderName}</Text>
        )}
        {letter.senderTitle && (
          <Text style={styles.senderTitle}>{letter.senderTitle}</Text>
        )}
        {contacts && <Text style={styles.contact}>{contacts}</Text>}

        <Text style={styles.greeting}>
          Dear {letter.recipientName || "Hiring Manager"},
        </Text>

        {letter.body.map((paragraph, i) => (
          <Text key={i} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        <Text style={styles.valediction}>{letter.valediction},</Text>
        <Text style={styles.signature}>{letter.senderName}</Text>
      </Page>
    </Document>
  );
}