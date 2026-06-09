const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Module = require('../src/models/Module');
const AssignmentQuestion = require('../src/models/AssignmentQuestion');

const setAJSON = `[
  {
    "questionNumber": 1,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which tab opens Backstage View in Microsoft Word?",
    "options": {
      "a": "Home",
      "b": "Insert",
      "c": "File",
      "d": "Review"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 2,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which part of the Word window shows the document name?",
    "options": {
      "a": "Status Bar",
      "b": "Title Bar",
      "c": "Ribbon",
      "d": "Ruler"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 3,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "The Ribbon in Word is organized into:",
    "options": {
      "a": "Pages, Borders, Themes",
      "b": "Tabs, Groups, Commands",
      "c": "Files, Tools, Notes",
      "d": "Layouts, Slides, Commands"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 4,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which bar at the bottom of Word shows page number information?",
    "options": {
      "a": "Title Bar",
      "b": "Navigation Pane",
      "c": "Status Bar",
      "d": "Quick Access Toolbar"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 5,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which feature is used to place frequently used commands for quick access?",
    "options": {
      "a": "Styles Pane",
      "b": "Quick Access Toolbar",
      "c": "Task Pane",
      "d": "Review Pane"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 6,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which tab would you click first if you want to print a document?",
    "options": {
      "a": "Design",
      "b": "Insert",
      "c": "File",
      "d": "Layout"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 7,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which command saves changes to the current document?",
    "options": {
      "a": "Save",
      "b": "Save As",
      "c": "Export",
      "d": "Close"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 8,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which command is best when you want to save a document with a new name?",
    "options": {
      "a": "Open",
      "b": "Save As",
      "c": "Print",
      "d": "New"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 9,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which file format is the normal Word document format?",
    "options": {
      "a": ".pptx",
      "b": ".xlsx",
      "c": ".docx",
      "d": ".txt"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 10,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which file type is commonly used when you do not want others to edit the document easily?",
    "options": {
      "a": "PDF",
      "b": "DOCX",
      "c": "TXT",
      "d": "RTF"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 11,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which command opens an existing document?",
    "options": {
      "a": "New",
      "b": "Save",
      "c": "Open",
      "d": "Replace"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 12,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Saving a file to OneDrive is an example of saving to:",
    "options": {
      "a": "A printer",
      "b": "Cloud storage",
      "c": "A toolbar",
      "d": "A footer"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 13,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which is the best reason to use Save As?",
    "options": {
      "a": "To close Word",
      "b": "To create another copy with a different name or location",
      "c": "To zoom in",
      "d": "To underline text"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 14,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which key moves the insertion point to the next line?",
    "options": {
      "a": "Tab",
      "b": "Esc",
      "c": "Enter",
      "d": "Shift"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 15,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which key is commonly used to insert a space between words?",
    "options": {
      "a": "Backspace",
      "b": "Spacebar",
      "c": "Ctrl",
      "d": "Alt"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 16,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which key removes the character to the left of the cursor?",
    "options": {
      "a": "Delete",
      "b": "Backspace",
      "c": "Shift",
      "d": "Insert"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 17,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "What is the blinking vertical line in a document called?",
    "options": {
      "a": "Cursor or insertion point",
      "b": "Margin",
      "c": "Footer",
      "d": "Border"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 18,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which bar helps you move up and down through a long document?",
    "options": {
      "a": "Formula bar",
      "b": "Scroll bar",
      "c": "Status bar",
      "d": "Title bar"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 19,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which shortcut is commonly used to move to a specific page in Word through the Go To feature?",
    "options": {
      "a": "Ctrl + G",
      "b": "Ctrl + B",
      "c": "Ctrl + U",
      "d": "Ctrl + P"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 20,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Pressing the Tab key usually moves the cursor:",
    "options": {
      "a": "To the left margin",
      "b": "To the next tab stop or cell",
      "c": "To the top of the page",
      "d": "To the title bar"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 21,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Before changing existing text formatting, what must you usually do first?",
    "options": {
      "a": "Save the document",
      "b": "Select the text",
      "c": "Print the page",
      "d": "Close the file"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 22,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which action usually selects a single word quickly?",
    "options": {
      "a": "Triple-click",
      "b": "Double-click",
      "c": "Right-click",
      "d": "Press Esc"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 23,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which action often selects an entire paragraph quickly?",
    "options": {
      "a": "Triple-click inside the paragraph",
      "b": "Press Tab",
      "c": "Press Alt",
      "d": "Scroll down"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 24,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which command places removed text on the Clipboard?",
    "options": {
      "a": "Copy",
      "b": "Cut",
      "c": "Save",
      "d": "Replace"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 25,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which command duplicates selected text without removing it?",
    "options": {
      "a": "Copy",
      "b": "Cut",
      "c": "Delete",
      "d": "Close"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 26,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which command inserts Clipboard contents into a document?",
    "options": {
      "a": "Paste",
      "b": "Copy",
      "c": "Open",
      "d": "Zoom"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 27,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "If you make a mistake while editing, which shortcut is commonly used to undo it?",
    "options": {
      "a": "Ctrl + Y",
      "b": "Ctrl + Z",
      "c": "Ctrl + N",
      "d": "Ctrl + R"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 28,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which tab contains most standard font formatting tools?",
    "options": {
      "a": "Home",
      "b": "Mailings",
      "c": "View",
      "d": "Draw"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 29,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which button is used to make text darker and stronger?",
    "options": {
      "a": "Italic",
      "b": "Underline",
      "c": "Bold",
      "d": "Grow Font"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 30,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which shortcut makes selected text italic?",
    "options": {
      "a": "Ctrl + B",
      "b": "Ctrl + I",
      "c": "Ctrl + U",
      "d": "Ctrl + J"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 31,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which alignment places text evenly between the left and right margins?",
    "options": {
      "a": "Left",
      "b": "Center",
      "c": "Right",
      "d": "Justify"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 32,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which button increases the space between lines or paragraphs?",
    "options": {
      "a": "Format Painter",
      "b": "Line and Paragraph Spacing",
      "c": "Shrink Font",
      "d": "Change Case"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 33,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which tool copies formatting from one place and applies it to another?",
    "options": {
      "a": "Highlight",
      "b": "Format Painter",
      "c": "Replace",
      "d": "Insert"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 34,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which command removes applied character formatting and returns text to plain formatting?",
    "options": {
      "a": "Copy",
      "b": "Clear Formatting",
      "c": "Restrict Editing",
      "d": "Save As"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 35,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which type of list is best for steps that must stay in order?",
    "options": {
      "a": "Bulleted list",
      "b": "Numbered list",
      "c": "Picture list",
      "d": "Shaded list"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 36,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which type of list is usually best when order does not matter?",
    "options": {
      "a": "Numbered list",
      "b": "Bulleted list",
      "c": "Footer list",
      "d": "Header list"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 37,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "What does shading do in Word?",
    "options": {
      "a": "Deletes text",
      "b": "Adds background colour to selected text, cells, or paragraphs",
      "c": "Opens a file",
      "d": "Protects a document"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 38,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "What is a border in Word?",
    "options": {
      "a": "A spelling mistake",
      "b": "A line around text, a paragraph, a page, or a table area",
      "c": "A page number",
      "d": "A style set"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 39,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which option is used to create levels such as 1, 1.1, 1.1.1?",
    "options": {
      "a": "Simple bullets",
      "b": "Multilevel list",
      "c": "Page border",
      "d": "Font color"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 40,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which tab is commonly used to apply bullets and numbering?",
    "options": {
      "a": "Home",
      "b": "Review",
      "c": "View",
      "d": "Help"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 41,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Margins are the:",
    "options": {
      "a": "Pictures inside a document",
      "b": "Empty spaces around the edges of the page",
      "c": "Page numbers only",
      "d": "Ribbon commands"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 42,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which tab contains the Margins and Orientation commands?",
    "options": {
      "a": "Insert",
      "b": "Layout",
      "c": "Home",
      "d": "Review"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 43,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Portrait orientation means the page is:",
    "options": {
      "a": "Wider than it is tall",
      "b": "Taller than it is wide",
      "c": "Hidden",
      "d": "Locked"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 44,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Landscape orientation is useful for:",
    "options": {
      "a": "Very wide content such as large tables",
      "b": "Spell checking only",
      "c": "Comments only",
      "d": "Password protection only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 45,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "A header appears at the:",
    "options": {
      "a": "Left side of the page",
      "b": "Bottom of the page",
      "c": "Top of the page",
      "d": "Center of the page only"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 46,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which feature helps readers know what page they are on?",
    "options": {
      "a": "Word Count",
      "b": "Page Numbers",
      "c": "Zoom",
      "d": "Replace"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 47,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which tab is used first to insert a table?",
    "options": {
      "a": "Insert",
      "b": "View",
      "c": "Review",
      "d": "Design"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 48,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "A table is made up of rows and:",
    "options": {
      "a": "Slides",
      "b": "Columns",
      "c": "Themes",
      "d": "Tabs"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 49,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which tab appears when you click inside a table?",
    "options": {
      "a": "Table Design and Table Layout",
      "b": "Only Review",
      "c": "Only File",
      "d": "Only Mailings"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 50,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command combines two or more adjacent cells into one?",
    "options": {
      "a": "Split Cells",
      "b": "Merge Cells",
      "c": "AutoFit",
      "d": "Replace"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 51,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command divides one cell into more than one cell?",
    "options": {
      "a": "Merge Cells",
      "b": "Split Cells",
      "c": "Table Style",
      "d": "Shading"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 52,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command can add the values above a cell in a table?",
    "options": {
      "a": "Bold",
      "b": "Formula with SUM(ABOVE)",
      "c": "Replace All",
      "d": "Find Next"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 53,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which feature automatically adjusts a table or column to fit its contents?",
    "options": {
      "a": "AutoFit",
      "b": "Read-Only",
      "c": "Restrict Editing",
      "d": "Compare"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 54,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "A style in Word is best described as:",
    "options": {
      "a": "A saved set of formatting choices",
      "b": "A page number",
      "c": "A password",
      "d": "A table column"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 55,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Which tab contains the Styles gallery?",
    "options": {
      "a": "Home",
      "b": "Insert",
      "c": "View",
      "d": "Help"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 56,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Which style is commonly used for major section headings?",
    "options": {
      "a": "Title",
      "b": "Heading 1",
      "c": "Footer",
      "d": "Caption bar"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 57,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "What happens when you modify a style already used in many places?",
    "options": {
      "a": "Only one paragraph changes",
      "b": "All text using that style can update",
      "c": "The document closes",
      "d": "Only page numbers change"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 58,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "A template is best described as:",
    "options": {
      "a": "A reusable starting file",
      "b": "A spelling error",
      "c": "A zoom control",
      "d": "A footer code"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 59,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Which file type is used for a standard Word template?",
    "options": {
      "a": ".dotx",
      "b": ".xlsx",
      "c": ".jpeg",
      "d": ".mp3"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 60,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which feature in Word checks spelling, grammar, and writing suggestions?",
    "options": {
      "a": "Editor",
      "b": "Header",
      "c": "Align",
      "d": "Margin"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 61,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which tab or area is used to access the Replace command from the ribbon?",
    "options": {
      "a": "Home",
      "b": "Design",
      "c": "Draw",
      "d": "File only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 62,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which command changes one occurrence at a time?",
    "options": {
      "a": "Replace",
      "b": "Replace All",
      "c": "Select All",
      "d": "Encrypt"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 63,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which command compares two versions of a document and shows differences with revision marks?",
    "options": {
      "a": "Translate",
      "b": "Compare Documents",
      "c": "Merge Cells",
      "d": "Save As"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 64,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which command creates one new document from two versions while showing revisions?",
    "options": {
      "a": "Combine Documents",
      "b": "Draw Table",
      "c": "Mark as Final",
      "d": "AutoFit"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 65,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which tab contains the Translate command in Word?",
    "options": {
      "a": "Review",
      "b": "Home",
      "c": "View",
      "d": "File"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 66,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which command protects a document so a password is required to open it?",
    "options": {
      "a": "Encrypt with Password",
      "b": "Replace with Password",
      "c": "Split with Password",
      "d": "Zoom with Password"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 67,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which path is used in Word for password encryption on Windows?",
    "options": {
      "a": "File > Info > Protect Document > Encrypt with Password",
      "b": "Home > Replace > Password",
      "c": "Review > Table > Password",
      "d": "Design > Theme > Password"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 68,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which protection method mainly helps prevent accidental editing but does not strongly secure the content?",
    "options": {
      "a": "Encrypt with Password",
      "b": "Always Open Read-Only",
      "c": "Formula",
      "d": "AutoFit"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 69,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which tab contains Restrict Editing?",
    "options": {
      "a": "Review",
      "b": "Insert",
      "c": "Draw",
      "d": "Help"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 70,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which option under editing restrictions makes the document read-only?",
    "options": {
      "a": "Filling in forms",
      "b": "Comments",
      "c": "No changes (Read only)",
      "d": "Tracked changes"
    },
    "correctAnswer": "c"
  }
]`;

const setBJSON = `[
  {
    "questionNumber": 71,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which part of Word lets you switch between tabs such as Home, Insert, and Review?",
    "options": {
      "a": "Ribbon tabs",
      "b": "Footer",
      "c": "Zoom slider",
      "d": "Printer pane"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 72,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which area can show whether Track Changes is on or off, page number, and word count?",
    "options": {
      "a": "Status Bar",
      "b": "Title Bar",
      "c": "Navigation Pane",
      "d": "Clipboard"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 73,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which part of the screen is the main typing area?",
    "options": {
      "a": "Document area",
      "b": "Quick Access Toolbar",
      "c": "Ruler box only",
      "d": "Backstage area"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 74,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which tab would you use first to access document information and document protection options?",
    "options": {
      "a": "File",
      "b": "Home",
      "c": "Layout",
      "d": "Draw"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 75,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which bar can hold commands like Save, Undo, and Redo?",
    "options": {
      "a": "Quick Access Toolbar",
      "b": "Footer",
      "c": "Navigation Pane",
      "d": "Styles Pane"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 76,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which view area opens when you click File?",
    "options": {
      "a": "Backstage View",
      "b": "Table Layout",
      "c": "Split View",
      "d": "Theme View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 77,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which command creates a brand-new blank document?",
    "options": {
      "a": "Open",
      "b": "Save",
      "c": "New",
      "d": "Replace"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 78,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "If you want to keep the old file and also make a new version with a different name, use:",
    "options": {
      "a": "Save",
      "b": "Save As",
      "c": "Close",
      "d": "Undo"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 79,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which file type is usually best for future editing in Word?",
    "options": {
      "a": ".pdf",
      "b": ".docx",
      "c": ".jpg",
      "d": ".mp4"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 80,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which file type is often useful for sharing a finished version that should look the same on many devices?",
    "options": {
      "a": "DOCX",
      "b": "PDF",
      "c": "TXT",
      "d": "DOTX"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 81,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which storage location is a cloud-based location?",
    "options": {
      "a": "OneDrive",
      "b": "Keyboard",
      "c": "Status Bar",
      "d": "Clipboard"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 82,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which action opens a file you created earlier?",
    "options": {
      "a": "Open",
      "b": "New",
      "c": "Replace",
      "d": "Restrict"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 83,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which command should you use regularly while working so recent changes are not lost?",
    "options": {
      "a": "Save",
      "b": "Print",
      "c": "Zoom",
      "d": "Compare"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 84,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which key can move the cursor to the next table cell?",
    "options": {
      "a": "Esc",
      "b": "Tab",
      "c": "Home",
      "d": "Num Lock"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 85,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which key combination is commonly used for Go To in Word?",
    "options": {
      "a": "Ctrl + G",
      "b": "Ctrl + L",
      "c": "Ctrl + D",
      "d": "Ctrl + K"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 86,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which key removes the character to the right of the cursor?",
    "options": {
      "a": "Delete",
      "b": "Backspace",
      "c": "Shift",
      "d": "F2"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 87,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "If the screen shows only part of a long document, what do you use to move up or down quickly?",
    "options": {
      "a": "Scroll bar",
      "b": "Formula bar",
      "c": "Caption box",
      "d": "Comment bubble"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 88,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which part of the document tells you exactly where newly typed text will appear?",
    "options": {
      "a": "The blinking insertion point",
      "b": "The footer",
      "c": "The title bar",
      "d": "The file name"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 89,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which key normally starts a new paragraph?",
    "options": {
      "a": "Tab",
      "b": "Enter",
      "c": "Alt",
      "d": "Caps Lock"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 90,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which key is mainly used to create a space between words?",
    "options": {
      "a": "Spacebar",
      "b": "Shift",
      "c": "Ctrl",
      "d": "Insert"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 91,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "To move text from one place to another, which sequence is most suitable?",
    "options": {
      "a": "Copy and Close",
      "b": "Cut and Paste",
      "c": "Save and Print",
      "d": "Zoom and Paste"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 92,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "To duplicate text in another place while keeping the original, use:",
    "options": {
      "a": "Cut and Paste",
      "b": "Copy and Paste",
      "c": "Delete and Undo",
      "d": "Save and Replace"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 93,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which action is most likely to select a whole word?",
    "options": {
      "a": "Double-click the word",
      "b": "Triple-click the page",
      "c": "Press Esc",
      "d": "Scroll down"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 94,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which action often selects a full paragraph?",
    "options": {
      "a": "Triple-click inside it",
      "b": "Click the File tab",
      "c": "Press F12",
      "d": "Click the zoom slider"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 95,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "What should you do before applying bold, italic, or underline to existing text?",
    "options": {
      "a": "Print the document",
      "b": "Select the text",
      "c": "Close the document",
      "d": "Open Backstage View\"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 96,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which shortcut is commonly used to redo an action that was undone?",
    "options": {
      "a": "Ctrl + Z",
      "b": "Ctrl + Y",
      "c": "Ctrl + O",
      "d": "Ctrl + W"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 97,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which key is commonly used to remove selected text immediately?",
    "options": {
      "a": "Delete",
      "b": "F9",
      "c": "Page Down",
      "d": "Alt"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 98,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which formatting tool is used to underline selected text?",
    "options": {
      "a": "U",
      "b": "B",
      "c": "I",
      "d": "J"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 99,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which formatting command changes the style of the letters themselves, such as Arial or Calibri?",
    "options": {
      "a": "Font type",
      "b": "Alignment",
      "c": "Paragraph spacing",
      "d": "Indent"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 100,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which alignment places text in the middle between the margins?",
    "options": {
      "a": "Left",
      "b": "Center",
      "c": "Right",
      "d": "Justify"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 101,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which command increases the left indentation of a paragraph?",
    "options": {
      "a": "Increase Indent",
      "b": "Decrease Indent",
      "c": "Clear Formatting",
      "d": "Highlight"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 102,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which command is best if you want to remove bold, color, and other direct character formatting from selected text?",
    "options": {
      "a": "Clear Formatting",
      "b": "Save As",
      "c": "Replace",
      "d": "Compare"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 103,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which feature shades the background behind words, like a marker pen?",
    "options": {
      "a": "Text Highlight Color",
      "b": "Font Color",
      "c": "Track Changes",
      "d": "Header Color"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 104,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which command copies formatting only, not the words themselves?",
    "options": {
      "a": "Format Painter",
      "b": "Save As",
      "c": "Merge Cells",
      "d": "Replace All"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 105,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which list type is best for unordered items such as shopping items?",
    "options": {
      "a": "Bulleted list",
      "b": "Numbered list",
      "c": "Multilevel legal list only",
      "d": "Page list"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 106,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which list type is best for instructions in sequence?",
    "options": {
      "a": "Shaded list",
      "b": "Numbered list",
      "c": "Border list",
      "d": "Footer list"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 107,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which option creates a heading level structure like 1, 1.1, 1.1.1?",
    "options": {
      "a": "Bullets",
      "b": "Multilevel list",
      "c": "Highlight",
      "d": "Theme Fonts"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 108,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "A page border appears around the:",
    "options": {
      "a": "Whole page",
      "b": "Status bar",
      "c": "Spell-check pane",
      "d": "Quick Access Toolbar"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 109,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which feature adds background color to a paragraph or selected item?",
    "options": {
      "a": "Shading",
      "b": "Footnote",
      "c": "Translation",
      "d": "Restrict Editing"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 110,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which tab usually contains border and list tools most beginners use first?",
    "options": {
      "a": "Home",
      "b": "Mailings",
      "c": "File",
      "d": "View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 111,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which command changes the empty space around the edge of the page?",
    "options": {
      "a": "Margins",
      "b": "Highlight",
      "c": "Compare",
      "d": "Merge"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 112,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which orientation is wider than it is tall?",
    "options": {
      "a": "Portrait",
      "b": "Landscape",
      "c": "Header",
      "d": "Footer"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 113,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which tab contains the command to change page orientation?",
    "options": {
      "a": "Layout",
      "b": "Review",
      "c": "Home",
      "d": "Draw"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 114,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which item appears repeatedly at the bottom of every page?",
    "options": {
      "a": "Footer",
      "b": "Header",
      "c": "Ribbon",
      "d": "Style"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 115,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which feature lets a title page have no page number while later pages are numbered?",
    "options": {
      "a": "Different First Page",
      "b": "Replace All",
      "c": "Find Next",
      "d": "Merge Cells"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 116,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which command starts the next content at the top of a new page without inserting repeated blank paragraphs?",
    "options": {
      "a": "Page Break",
      "b": "Bold",
      "c": "Split Table",
      "d": "Theme"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 117,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command is used to create a table from existing text separated by tabs or commas?",
    "options": {
      "a": "Convert Text to Table",
      "b": "Translate Document",
      "c": "Restrict Editing",
      "d": "Compare Documents"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 118,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command lets you create a table by drawing the borders yourself?",
    "options": {
      "a": "Draw Table",
      "b": "Protect Document",
      "c": "Mark as Final",
      "d": "Find"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 119,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command adds a row below the selected cell?",
    "options": {
      "a": "Insert Below",
      "b": "Insert Above",
      "c": "Insert Left",
      "d": "Insert Right"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 120,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command adds a column to the left of the selected cell?",
    "options": {
      "a": "Insert Right",
      "b": "Insert Left",
      "c": "Split Cells",
      "d": "Split Table"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 121,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "What happens when you press Tab in the last cell of the last row of a table?",
    "options": {
      "a": "Word closes",
      "b": "A new row is added",
      "c": "The table is deleted",
      "d": "The page is locked"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 122,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command can divide one table into two tables?",
    "options": {
      "a": "Split Table",
      "b": "Merge Cells",
      "c": "AutoFit",
      "d": "Restrict Editing"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 123,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which tab contains the Formula command for Word tables?",
    "options": {
      "a": "Table Layout",
      "b": "Design",
      "c": "File",
      "d": "View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 124,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Which built-in style is commonly used for the main title of a document?",
    "options": {
      "a": "Heading 1",
      "b": "Title",
      "c": "Footer",
      "d": "Note marker"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 125,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Which style is mainly used for section headings?",
    "options": {
      "a": "Subtitle only",
      "b": "Heading 1",
      "c": "Normal Zoom",
      "d": "Encrypt"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 126,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Which tab contains Themes?",
    "options": {
      "a": "Design",
      "b": "Home",
      "c": "Review",
      "d": "Draw"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 127,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Document themes coordinate:",
    "options": {
      "a": "Only page numbers",
      "b": "Colors, fonts, and effects",
      "c": "Only comments",
      "d": "Only margins"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 128,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Which command saves a current design as reusable template file type?",
    "options": {
      "a": "Save As and choose Word Template",
      "b": "Replace with Template",
      "c": "Compare with Template",
      "d": "Merge into Template"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 129,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Where does Word commonly save custom templates?",
    "options": {
      "a": "Custom Office Templates folder",
      "b": "Status Bar",
      "c": "Quick Access Toolbar",
      "d": "Proofing menu"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 130,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which feature suggests corrections for spelling and grammar?",
    "options": {
      "a": "Editor",
      "b": "AutoFit",
      "c": "Header",
      "d": "Shading"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 131,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which command is usually safer when you want to review each change individually?",
    "options": {
      "a": "Replace",
      "b": "Replace All",
      "c": "Encrypt",
      "d": "Translate Document"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 132,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which command can find paragraph marks or page breaks?",
    "options": {
      "a": "Special menu in Find and Replace",
      "b": "Header command",
      "c": "Theme Fonts",
      "d": "Word Count"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 133,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which tab contains the Compare command?",
    "options": {
      "a": "Review",
      "b": "Home",
      "c": "Insert",
      "d": "Layout"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 134,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Compare Documents leaves the original document:",
    "options": {
      "a": "Deleted",
      "b": "Untouched",
      "c": "Converted to PDF",
      "d": "Encrypted automatically"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 135,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which command translates selected text into another language?",
    "options": {
      "a": "Review > Translate",
      "b": "Layout > Margins",
      "c": "Home > Replace",
      "d": "File > Print"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 136,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which protection method requires the correct password before the file can be opened?",
    "options": {
      "a": "Encrypt with Password",
      "b": "Always open Read-Only",
      "c": "Comment Only",
      "d": "Word Count"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 137,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which statement about passwords in Word is correct?",
    "options": {
      "a": "Word can always recover forgotten passwords",
      "b": "Passwords do not matter once saved",
      "c": "Forgotten document passwords may not be recoverable",
      "d": "Passwords are not case-sensitive"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 138,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which option in Restrict Editing allows people to add comments but not edit the main text?",
    "options": {
      "a": "Filling in forms",
      "b": "Comments",
      "c": "Tracked changes only for deletion",
      "d": "No changes plus no comments"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 139,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which area appears when you click Restrict Editing?",
    "options": {
      "a": "Restrict Editing pane",
      "b": "Page border gallery",
      "c": "Formula box",
      "d": "Theme preview grid"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 140,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which option lets a protected document still have selected editable sections?",
    "options": {
      "a": "Exceptions",
      "b": "AutoFit",
      "c": "Replace All",
      "d": "Footer"
    },
    "correctAnswer": "a"
  }
]`;

const setCJSON = `[
  {
    "questionNumber": 141,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "If you want to customize a command so it is always easy to reach, which area is most suitable?",
    "options": {
      "a": "Quick Access Toolbar",
      "b": "Footer",
      "c": "Page background",
      "d": "Table cell"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 142,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which part of Word displays tabs like Home, Insert, Layout, and Review?",
    "options": {
      "a": "Ribbon",
      "b": "Status Bar",
      "c": "Footer",
      "d": "Clipboard"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 143,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which bar can show zoom level and page count?",
    "options": {
      "a": "Status Bar",
      "b": "Title Bar",
      "c": "Menu border",
      "d": "Header"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 144,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which tab would you use first to manage document settings such as Info and Print?",
    "options": {
      "a": "File",
      "b": "Insert",
      "c": "Draw",
      "d": "Layout"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 145,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "What is the ribbon command area below the tabs called in general?",
    "options": {
      "a": "Groups and commands area",
      "b": "Footer block",
      "c": "Scroll margin",
      "d": "Header strip only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 146,
    "section": "Word Interface (3.1)",
    "lessonReference": "Lesson 1",
    "question": "Which part shows the current file name and sometimes the application name?",
    "options": {
      "a": "Title Bar",
      "b": "Review Pane",
      "c": "Styles Pane",
      "d": "Navigation Bar"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 147,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "What is the first thing you should usually do when you start important work in a new document?",
    "options": {
      "a": "Save the document",
      "b": "Delete all text",
      "c": "Compare two files",
      "d": "Restrict editing"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 148,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which option is best if you want a reusable starting file rather than a normal document?",
    "options": {
      "a": "Save as Word Template",
      "b": "Save as JPG",
      "c": "Save as MP3",
      "d": "Save as Slide"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 149,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which command opens a file that already exists?",
    "options": {
      "a": "Open",
      "b": "New",
      "c": "Replace",
      "d": "Translate"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 150,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which file format is associated with a standard Word template?",
    "options": {
      "a": ".docx",
      "b": ".dotx",
      "c": ".pdf",
      "d": ".txt"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 151,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "When would Save As be more appropriate than Save?",
    "options": {
      "a": "When keeping the same file only",
      "b": "When making a new version with a different name or location",
      "c": "When closing Word",
      "d": "When spelling a word"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 152,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which type of location is usually accessed through the internet rather than only on the same computer?",
    "options": {
      "a": "Cloud storage",
      "b": "Keyboard tray",
      "c": "Status line",
      "d": "Ruler area"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 153,
    "section": "Create, Open, Save (3.2)",
    "lessonReference": "Lesson 2",
    "question": "Which format is most suitable if you want easy editing later in Word?",
    "options": {
      "a": "DOCX",
      "b": "PDF",
      "c": "PNG",
      "d": "WAV"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 154,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which key takes the cursor to the next line and usually starts a new paragraph?",
    "options": {
      "a": "Enter",
      "b": "Shift",
      "c": "Ctrl",
      "d": "Alt"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 155,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which command or shortcut helps you jump directly to a page or section?",
    "options": {
      "a": "Go To (Ctrl + G)",
      "b": "Print Preview",
      "c": "Encrypt",
      "d": "Borders and Shading"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 156,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which key normally removes characters to the left of the cursor?",
    "options": {
      "a": "Backspace",
      "b": "Delete",
      "c": "F7",
      "d": "Tab"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 157,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "Which bar is used to move through long documents?",
    "options": {
      "a": "Scroll bar",
      "b": "Formula bar",
      "c": "Color bar",
      "d": "Theme bar"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 158,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "What tells you where typed text will appear?",
    "options": {
      "a": "Insertion point",
      "b": "Page border",
      "c": "Status bar",
      "d": "Ribbon tab"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 159,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "In a table, which key often moves between cells?",
    "options": {
      "a": "Tab",
      "b": "Esc",
      "c": "Shift Lock",
      "d": "Backspace only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 160,
    "section": "Typing and Navigation (3.3)",
    "lessonReference": "Lesson 3",
    "question": "What is the purpose of the Spacebar while typing?",
    "options": {
      "a": "Insert spaces between words",
      "b": "Save the file",
      "c": "Open a new page always",
      "d": "Delete a line"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 161,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which command is best for moving selected text to another location?",
    "options": {
      "a": "Cut",
      "b": "Copy",
      "c": "Format Painter",
      "d": "Zoom"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 162,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which command is best for duplicating text somewhere else?",
    "options": {
      "a": "Copy",
      "b": "Cut",
      "c": "Delete",
      "d": "Translate"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 163,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which action most likely selects one word?",
    "options": {
      "a": "Double-click",
      "b": "Triple-click",
      "c": "Press F12",
      "d": "Press Esc"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 164,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which action most likely selects a paragraph?",
    "options": {
      "a": "Triple-click",
      "b": "Double-click",
      "c": "Click File",
      "d": "Drag the zoom slider"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 165,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "What should usually come before applying formatting to existing text?",
    "options": {
      "a": "Protecting the file",
      "b": "Selecting the text",
      "c": "Printing the file",
      "d": "Changing the theme"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 166,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which shortcut usually undoes the last action?",
    "options": {
      "a": "Ctrl + Z",
      "b": "Ctrl + P",
      "c": "Ctrl + S",
      "d": "Ctrl + E"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 167,
    "section": "Editing and Selecting Text (3.4)",
    "lessonReference": "Lesson 4",
    "question": "Which key can delete selected text immediately?",
    "options": {
      "a": "Delete",
      "b": "F9",
      "c": "Shift",
      "d": "Alt"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 168,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which shortcut usually makes text bold?",
    "options": {
      "a": "Ctrl + B",
      "b": "Ctrl + I",
      "c": "Ctrl + U",
      "d": "Ctrl + J"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 169,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which command changes how large the letters appear?",
    "options": {
      "a": "Font size",
      "b": "Highlight color",
      "c": "Indent",
      "d": "Header"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 170,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which command changes the design of the letters, such as Arial or Times New Roman?",
    "options": {
      "a": "Font type",
      "b": "Justify",
      "c": "Page Break",
      "d": "Shading"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 171,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which alignment places text against the left margin in the normal way?",
    "options": {
      "a": "Left Align",
      "b": "Center",
      "c": "Right Align",
      "d": "Justify"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 172,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which command copies only the formatting from one place to another?",
    "options": {
      "a": "Format Painter",
      "b": "Translate",
      "c": "Protect Document",
      "d": "Find"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 173,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which command removes direct text formatting such as bold and color?",
    "options": {
      "a": "Clear Formatting",
      "b": "Restrict Editing",
      "c": "Compare",
      "d": "New Style"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 174,
    "section": "Formatting Text and Paragraphs (3.5)",
    "lessonReference": "Lesson 5",
    "question": "Which feature changes the background behind selected text like a marker?",
    "options": {
      "a": "Text Highlight Color",
      "b": "Font Type",
      "c": "Print Range",
      "d": "Formula"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 175,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which list is best when the items do not need to follow a sequence?",
    "options": {
      "a": "Bulleted list",
      "b": "Numbered list",
      "c": "Formula list",
      "d": "Compare list"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 176,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which list is best for instructions that must be followed in order?",
    "options": {
      "a": "Numbered list",
      "b": "Bulleted list",
      "c": "Theme list",
      "d": "Footer list"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 177,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which feature adds a line around selected text, a page, or part of a table?",
    "options": {
      "a": "Border",
      "b": "Shading",
      "c": "Formula",
      "d": "Translation"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 178,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which feature adds colour behind text or paragraph areas?",
    "options": {
      "a": "Shading",
      "b": "Header",
      "c": "Compare",
      "d": "Password"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 179,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which list type can show many levels such as section, subsection, and sub-subsection?",
    "options": {
      "a": "Multilevel list",
      "b": "Highlight list",
      "c": "Read-only list",
      "d": "Picture fill list"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 180,
    "section": "Lists, Borders, Shading (3.6)",
    "lessonReference": "Lesson 6",
    "question": "Which tab is commonly used first for bullets and numbering?",
    "options": {
      "a": "Home",
      "b": "File",
      "c": "View",
      "d": "Help"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 181,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which command changes page direction between tall and wide layouts?",
    "options": {
      "a": "Orientation",
      "b": "Replace",
      "c": "Proofing",
      "d": "Formula"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 182,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which orientation is usually used for normal letters and reports?",
    "options": {
      "a": "Portrait",
      "b": "Landscape",
      "c": "Split",
      "d": "Read-only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 183,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which item is usually repeated at the top of each page?",
    "options": {
      "a": "Header",
      "b": "Footer",
      "c": "Margin",
      "d": "Comment"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 184,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which item is usually repeated at the bottom of each page?",
    "options": {
      "a": "Footer",
      "b": "Header",
      "c": "Style pane",
      "d": "Table handle"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 185,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which feature starts content on a fresh page without pressing Enter many times?",
    "options": {
      "a": "Page Break",
      "b": "Theme",
      "c": "AutoFit",
      "d": "Highlight"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 186,
    "section": "Page Setup Essentials (3.7)",
    "lessonReference": "Lesson 7",
    "question": "Which command inserts a completely empty new page into the document?",
    "options": {
      "a": "Blank Page",
      "b": "Compare",
      "c": "Replace",
      "d": "Count"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 187,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "A table is useful mainly because it:",
    "options": {
      "a": "Organizes information into rows and columns",
      "b": "Deletes spelling mistakes",
      "c": "Encrypts the document",
      "d": "Creates themes automatically"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 188,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which tab appears only after you click inside a table?",
    "options": {
      "a": "Table Design and Table Layout",
      "b": "View and Draw only",
      "c": "Help and Mailings only",
      "d": "File only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 189,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command combines adjacent cells into one larger cell?",
    "options": {
      "a": "Merge Cells",
      "b": "Split Table",
      "c": "Formula",
      "d": "Replace"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 190,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command divides one cell into smaller parts?",
    "options": {
      "a": "Split Cells",
      "b": "Merge Cells",
      "c": "Draw Table",
      "d": "Word Count"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 191,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command separates one table into two tables?",
    "options": {
      "a": "Split Table",
      "b": "Insert Above",
      "c": "Combine Documents",
      "d": "Encrypt Document"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 192,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which command can total numbers above a selected result cell?",
    "options": {
      "a": "Formula with SUM(ABOVE)",
      "b": "Clear Formatting",
      "c": "Translate",
      "d": "Compare"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 193,
    "section": "Tables (3.8)",
    "lessonReference": "Lesson 8",
    "question": "Which feature automatically adjusts column widths to fit text?",
    "options": {
      "a": "AutoFit",
      "b": "Restrict Editing",
      "c": "Page Break",
      "d": "Heading 1"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 194,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Styles are useful because they help documents become:",
    "options": {
      "a": "Consistent",
      "b": "Heavier",
      "c": "Locked",
      "d": "Hidden"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 195,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Which tab contains the Styles gallery?",
    "options": {
      "a": "Home",
      "b": "View",
      "c": "File",
      "d": "Review only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 196,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Which action can change all headings that use the same style?",
    "options": {
      "a": "Modify the style",
      "b": "Print the document",
      "c": "Lock the file",
      "d": "Insert a table"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 197,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Themes control coordinated:",
    "options": {
      "a": "Colors, fonts, and effects",
      "b": "Only comments",
      "c": "Only passwords",
      "d": "Only rows"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 198,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Which file type should you choose if you want to save a reusable Word template?",
    "options": {
      "a": "Word Template (.dotx)",
      "b": "PDF",
      "c": "TXT",
      "d": "PNG"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 199,
    "section": "Styles and Templates (3.9)",
    "lessonReference": "Lesson 9",
    "question": "Which command path is used to start a new document from a saved template?",
    "options": {
      "a": "File > New > Personal/Custom",
      "b": "Review > Comments",
      "c": "Insert > Footer",
      "d": "Layout > Margins"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 200,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which feature in Word can suggest spelling, grammar, and style improvements?",
    "options": {
      "a": "Editor",
      "b": "Table Layout",
      "c": "Header Tools",
      "d": "Page Setup"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 201,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which command is safer when you want to check each change before it is made?",
    "options": {
      "a": "Replace",
      "b": "Replace All",
      "c": "Encrypt with Password",
      "d": "Save As PDF"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 202,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which command shows differences between two versions of a document?",
    "options": {
      "a": "Compare Documents",
      "b": "Split Cells",
      "c": "Theme Colors",
      "d": "AutoFit"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 203,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which command merges revisions from two versions into one new document?",
    "options": {
      "a": "Combine Documents",
      "b": "Find Next",
      "c": "Restrict Editing",
      "d": "Blank Page"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 204,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which tab contains Translate in Word?",
    "options": {
      "a": "Review",
      "b": "File",
      "c": "Home only",
      "d": "Layout"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 205,
    "section": "Proofing, Find/Replace, Compare, Translate (3.10)",
    "lessonReference": "Lesson 10",
    "question": "Which feature can translate selected text into another language and insert it into the document?",
    "options": {
      "a": "Translate",
      "b": "Restrict Editing",
      "c": "Page Border",
      "d": "Ruler"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 206,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which command is used to remove a password from an encrypted document when you know the password?",
    "options": {
      "a": "File > Info > Protect Document > Encrypt with Password, then clear it",
      "b": "Home > Copy > Remove Password",
      "c": "Review > Compare > Delete Password",
      "d": "Insert > Table > Password Off"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 207,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which statement about read-only protection is correct?",
    "options": {
      "a": "It strongly encrypts the file",
      "b": "It mainly helps prevent accidental editing",
      "c": "It always requires a password",
      "d": "It automatically hides the file"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 208,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which command is used to begin document restriction from the Review tab?",
    "options": {
      "a": "Restrict Editing",
      "b": "Find and Replace",
      "c": "Translate",
      "d": "AutoFit"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 209,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which option under Restrict Editing allows only comment insertion but not full text editing?",
    "options": {
      "a": "Comments",
      "b": "No changes",
      "c": "Encrypt with Password",
      "d": "AutoSave"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 210,
    "section": "Document Protection (3.11)",
    "lessonReference": "Lesson 11",
    "question": "Which command in the Restrict Editing pane removes the current editing restriction when you are allowed to do so?",
    "options": {
      "a": "Stop Protection",
      "b": "Replace All",
      "c": "New Document",
      "d": "Clear Formatting"
    },
    "correctAnswer": "a"
  }
]`;

async function seedModule3Questions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const module = await Module.findOne({ title: /Module 3/i });
    if (!module) {
      console.log('Module 3 not found');
      process.exit(1);
    }

    await AssignmentQuestion.deleteMany({ moduleId: module._id });
    console.log('Cleared existing questions for Module 3');

    const setA = JSON.parse(setAJSON);
    const setB = JSON.parse(setBJSON);
    const setC = JSON.parse(setCJSON);

    const allQuestions = [...setA, ...setB, ...setC].map(q => ({
      ...q,
      moduleId: module._id
    }));

    await AssignmentQuestion.insertMany(allQuestions);
    console.log(`✅ Successfully seeded ${allQuestions.length} questions for Module 3`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedModule3Questions();
