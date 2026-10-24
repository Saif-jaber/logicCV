# Resume Template Structure (Source of Truth)

This document describes the exact structure for an ATS-friendly, one-page Technical Program Manager resume template.

## Layout
- **Page size**: US Letter
- **Columns**: Single column
- **Order**: Reverse-chronological
- **Content**: Text only (no photo, no sidebar, no icons, no graphics)
- **Length**: Must fit on exactly ONE page
- **Alignment**: Left-aligned body text; locations and dates right-aligned on the same row
- **ATS-friendly**: Simple structure, standard headings

## Section Order
1. Header
2. PROFESSIONAL EXPERIENCE
3. EDUCATION  
4. Custom sections requested by the user
5. ADDITIONAL INFORMATION

## 1. HEADER (centered)
- **Line 1**: FULL NAME in ALL CAPS, largest font, bold
- **Line 2**: Target job title (smaller, regular)  
- **Line 3**: "City, State ZIP • email • phone" on one line, items separated by " • "

## 2. SECTION: PROFESSIONAL EXPERIENCE
- **Heading**: ALL CAPS, bold, with a thin horizontal rule underneath
- **Each job entry has a 2-row header**:
  - Row 1: COMPANY NAME (caps, bold) on the left | "City, State" on the right
  - Row 2: Job Title (bold or italic) on the left | "YYYY-YYYY" or "YYYY-Present" on the right
- **Bullets**: Below, 2-4 level-1 bullets ("●"). Formula: action verb + what you did + measurable result.
- **Optional sub-block per job, titled "Selected Project Experience"**:
  - Project name as a level-1 "●" bullet
  - Under it, indented level-2 bullets using "-" with metrics
- **Order**: Jobs ordered newest first

## 3. SECTION: EDUCATION
- **Heading**: ALL CAPS, bold, with a thin horizontal rule underneath
- **Each entry**:
  - Row 1: INSTITUTION (caps, bold) left | "City, State" right
  - Row 2: Degree, major, minor left | "YYYY-YYYY" right
- **Order**: Newest first

## 4. SECTION: ADDITIONAL INFORMATION
- **Heading**: ALL CAPS, bold, with a thin horizontal rule underneath
- **Bullets**: Level-1 "●" bullets in the form "Label: item, item, item" (e.g. Program Management, Technical Skills, Certifications). Label is bold.

## Custom Sections
- Users can ask the assistant to add, edit, reorder, or remove complete sections.
- Each custom section has a title, a horizontal rule, and level-1 bullets for its items.
- Keep custom sections after Education and before Additional Information.
- Preserve custom section IDs and unrelated resume content when editing.

## Font Choices
- Users can choose Times New Roman (serif), Arial (sans-serif), or Courier New (monospace).
- Apply the selected family consistently to the on-screen preview and exported PDF.

## ASCII Wireframe
```
                 FIRST LAST
            Technical Program Manager
   City, ST ZIP • email • phone
PROFESSIONAL EXPERIENCE
------------------------------------------------
COMPANY                                City, ST
Job Title                         2014-Present
 ● bullet ...
 ● bullet ...
 ● Selected Project Experience
    ● Project name
       - metric bullet
EDUCATION
------------------------------------------------
INSTITUTION                            City, ST
Degree                                2007-2011
ADDITIONAL INFORMATION
------------------------------------------------
 ● Label: item, item
```

## Style Tokens

### Default Tokens (if no template.pdf provided)
| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| Page | - | US Letter (8.5" x 11") | - | Margins: 0.6in top/bottom, 0.7in left/right |
| Font Family | User choice: Times New Roman, Arial, or Courier New | - | - | Single family everywhere; default to serif |
| Name | Times New Roman/Liberation Serif | 20pt | bold | ALL CAPS, centered |
| Title | Times New Roman/Liberation Serif | 11pt | regular | Centered |
| Contact | Times New Roman/Liberation Serif | 10pt | regular | Centered, items separated by " • " |
| Section Heading | Times New Roman/Liberation Serif | 11pt | bold | ALL CAPS |
| Body Text | Times New Roman/Liberation Serif | 10pt | regular | Left-aligned |
| Line Height | - | 1.2 | - | All text |

### Colors
| Element | Color |
|---------|-------|
| All text | #000000 (black) |
| Rules/Horizontal lines | #000000 (black), 0.75pt solid |

### Spacing
| Element | Spacing |
|---------|---------|
| Section heading space-before | 10pt |
| Section heading space-after | 4pt |
| Between jobs | 6pt |
| Between bullets | 2pt |

### Indentation
| Bullet Level | Indent | Glyph |
|--------------|--------|-------|
| Level 1 (●) | 14pt hanging indent | ● |
| Level 2 (-) | 32pt hanging indent | - |

## Implementation Notes
- Use flexbox with `justify-content: space-between` for left/right aligned rows (company/location, title/dates, institution/location, degree/dates)
- Consistent spacing between sections, medium between jobs, small between bullets
- Every achievement quantified where possible
- Bullet formula: action verb + what you did + measurable result
- Store all style tokens in `docs/style.json` for configurability
