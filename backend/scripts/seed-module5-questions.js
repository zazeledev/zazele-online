const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Module = require('../src/models/Module');
const AssignmentQuestion = require('../src/models/AssignmentQuestion');

const setAJSON = `[
  {
    "questionNumber": 1,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Which chart is commonly useful for comparing categories?",
    "options": {
      "a": "Column chart",
      "b": "Scatter chart only",
      "c": "Surface chart only",
      "d": "Line chart only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 2,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "What does Wrap Text do?",
    "options": {
      "a": "Displays long content on multiple lines within a cell",
      "b": "Combines several workbooks",
      "c": "Changes text into a number",
      "d": "Deletes extra words"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 3,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "How are Excel rows identified?",
    "options": {
      "a": "By letters only",
      "b": "By worksheet colours",
      "c": "By formulas",
      "d": "By numbers"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 4,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "What does the Name Box commonly show?",
    "options": {
      "a": "The workbook password",
      "b": "The total of selected cells only",
      "c": "The address of the active cell",
      "d": "The current printer name"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 5,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "What is the active cell?",
    "options": {
      "a": "Every cell containing a formula",
      "b": "A cell hidden by a filter",
      "c": "The first cell in every workbook",
      "d": "The currently selected cell where Excel is ready to work"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 6,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "How is data entered into a cell?",
    "options": {
      "a": "Open the Page Setup dialog",
      "b": "Select the cell, type the data, and confirm the entry",
      "c": "Create a chart before typing",
      "d": "Print the worksheet first"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 7,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Why might a number be formatted as currency?",
    "options": {
      "a": "To convert it into text",
      "b": "To sort it alphabetically",
      "c": "To hide the number",
      "d": "To display it clearly as a monetary amount"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 8,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "What is a chart title used for?",
    "options": {
      "a": "To explain what the chart shows",
      "b": "To rename the workbook",
      "c": "To store the source data",
      "d": "To calculate the chart values"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 9,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What does MIN return?",
    "options": {
      "a": "The smallest value in the selected range",
      "b": "The number of worksheets",
      "c": "The total of all values",
      "d": "The largest value in the range"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 10,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "What is a workbook in Excel?",
    "options": {
      "a": "The complete Excel file",
      "b": "The Formula Bar",
      "c": "A single cell inside a worksheet",
      "d": "A printed chart only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 11,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "What is a multilevel sort?",
    "options": {
      "a": "A workbook containing many worksheets",
      "b": "A filter that hides all rows",
      "c": "A chart with several titles",
      "d": "A sort using more than one column in a chosen priority order"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 12,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Why repeat heading rows on every printed page?",
    "options": {
      "a": "To hide the data rows",
      "b": "So readers can understand the columns on each page",
      "c": "To replace the worksheet title",
      "d": "To increase the number of pages"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 13,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "How are Excel columns identified?",
    "options": {
      "a": "By file names",
      "b": "By numbers only",
      "c": "By colours",
      "d": "By letters"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 14,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What does MAX return?",
    "options": {
      "a": "The average value",
      "b": "The number of blank cells",
      "c": "The largest value in the selected range",
      "d": "The smallest value in the range"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 15,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "What is a worksheet?",
    "options": {
      "a": "The complete Windows operating system",
      "b": "A saved email attachment",
      "c": "A grid-based working sheet inside a workbook",
      "d": "The Excel application icon"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 16,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "What happens when a worksheet tab is selected?",
    "options": {
      "a": "The workbook closes",
      "b": "The worksheet prints immediately",
      "c": "That worksheet becomes active",
      "d": "All formulas are deleted"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 17,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What does AVERAGE calculate?",
    "options": {
      "a": "The largest value only",
      "b": "The number of text entries",
      "c": "The total page count",
      "d": "The arithmetic mean of selected numeric values"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 18,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Which chart is commonly useful for showing change over time?",
    "options": {
      "a": "Radar chart",
      "b": "Line chart",
      "c": "Pie chart",
      "d": "Doughnut chart"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 19,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What does the * operator do in a formula?",
    "options": {
      "a": "Divides values",
      "b": "Multiplies values",
      "c": "Joins worksheets",
      "d": "Adds values"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 20,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Does filtering delete hidden rows?",
    "options": {
      "a": "Yes, unless the workbook is saved",
      "b": "No, it only changes which rows are visible",
      "c": "Only when filtering text",
      "d": "Yes, hidden rows are permanently removed"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 21,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Why should the chart type match the message?",
    "options": {
      "a": "Charts are used only for decoration",
      "b": "Every chart type produces the same result",
      "c": "The wrong chart can make the data difficult or misleading to interpret",
      "d": "Chart types control workbook saving"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 22,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Which mixed reference locks column B but allows the row to change?",
    "options": {
      "a": "$B$5",
      "b": "B$5",
      "c": "B5",
      "d": "$B5"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 23,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Which shortcut commonly opens the print screen?",
    "options": {
      "a": "Ctrl+L",
      "b": "Ctrl+P",
      "c": "Ctrl+N",
      "d": "Ctrl+X"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 24,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Why should Merge & Center be used carefully?",
    "options": {
      "a": "Merged cells can interfere with sorting, selection, and editing",
      "b": "It permanently deletes all data",
      "c": "It blocks workbook saving",
      "d": "It changes numbers into dates"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 25,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "What normally happens after pressing Tab following a cell entry?",
    "options": {
      "a": "The column becomes hidden",
      "b": "The formula is removed",
      "c": "The worksheet is printed",
      "d": "The entry is confirmed and the active cell usually moves right"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 26,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "What is the purpose of Cut?",
    "options": {
      "a": "To move selected content from one location to another",
      "b": "To sort dates",
      "c": "To calculate an average",
      "d": "To create a second permanent copy"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 27,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "What does Ctrl+S do?",
    "options": {
      "a": "Starts a new formula",
      "b": "Sorts the active table",
      "c": "Selects the entire worksheet",
      "d": "Saves the current workbook"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 28,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "What does filtering do?",
    "options": {
      "a": "Temporarily shows only rows matching selected criteria",
      "b": "Creates a copy of the workbook",
      "c": "Permanently rearranges every row",
      "d": "Deletes rows that do not match"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 29,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "What does AutoFit Column Width do?",
    "options": {
      "a": "Deletes empty columns",
      "b": "Prints the selected column",
      "c": "Adjusts the column width to fit its contents",
      "d": "Makes every column the same colour"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 30,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Why should Print Preview be checked before printing?",
    "options": {
      "a": "To detect layout problems before using paper or ink",
      "b": "To convert formulas into text",
      "c": "To create a new workbook",
      "d": "To apply filters"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 31,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "What is a Print Area?",
    "options": {
      "a": "A selected range defined for printing",
      "b": "A place where formulas are stored",
      "c": "The chart legend",
      "d": "A hidden worksheet"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 32,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "What does a chart legend identify?",
    "options": {
      "a": "The print area",
      "b": "The active cell",
      "c": "The meaning of data series colours or patterns",
      "d": "The workbook author only"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 33,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "What is cell formatting?",
    "options": {
      "a": "Replacing every value with a formula",
      "b": "Changing how data looks without necessarily changing its underlying value",
      "c": "Deleting the data from a cell",
      "d": "Moving the workbook to another folder"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 34,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "When is Landscape orientation often useful?",
    "options": {
      "a": "When the worksheet contains one narrow column",
      "b": "When renaming a sheet",
      "c": "When a worksheet has many columns and is wide",
      "d": "When adding formulas"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 35,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What does the dollar sign do in an Excel reference?",
    "options": {
      "a": "Adds values together",
      "b": "Locks a row, a column, or both",
      "c": "Marks a formula as incorrect",
      "d": "Changes a value to currency automatically"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 36,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What is a formula in Excel?",
    "options": {
      "a": "A worksheet colour theme",
      "b": "An expression Excel calculates",
      "c": "A printed page heading",
      "d": "A workbook file name"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 37,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "What does sorting do?",
    "options": {
      "a": "Deletes duplicate worksheets",
      "b": "Changes formulas to values",
      "c": "Changes the order of rows based on selected values",
      "d": "Temporarily hides matching rows"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 38,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Which is a valid cell address?",
    "options": {
      "a": "Column7",
      "b": "7C",
      "c": "C7",
      "d": "RowC7"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 39,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Why are parentheses used in formulas?",
    "options": {
      "a": "To rename worksheets",
      "b": "To change page orientation",
      "c": "To control the order of calculation",
      "d": "To create filters"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 40,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "What is a cell?",
    "options": {
      "a": "A printed worksheet page",
      "b": "The bar containing Ribbon tabs",
      "c": "A group of unrelated workbooks",
      "d": "The intersection of a row and a column"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 41,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "What is the standard modern Excel workbook extension?",
    "options": {
      "a": ".xlsx",
      "b": ".jpg",
      "c": ".docx",
      "d": ".pptx"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 42,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What does the + operator do in a formula?",
    "options": {
      "a": "Locks a reference",
      "b": "Adds values",
      "c": "Divides values",
      "d": "Multiplies values"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 43,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "What is Microsoft Excel mainly used for?",
    "options": {
      "a": "Creating only handwritten drawings",
      "b": "Browsing websites without a browser",
      "c": "Editing videos and sound recordings",
      "d": "Organising, calculating, analysing, and presenting data"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 44,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Where is the fill handle located?",
    "options": {
      "a": "At the lower-right corner of the selected cell or range",
      "b": "Inside the File tab",
      "c": "At the top of the Ribbon",
      "d": "On the status bar only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 45,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Which shortcuts are used for Copy, Cut, and Paste?",
    "options": {
      "a": "Ctrl+C, Ctrl+X, and Ctrl+V",
      "b": "Ctrl+P, Ctrl+S, and Ctrl+O",
      "c": "Ctrl+B, Ctrl+I, and Ctrl+U",
      "d": "Ctrl+N, Ctrl+F, and Ctrl+H"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 46,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Why are borders useful in a worksheet?",
    "options": {
      "a": "They correct formula errors",
      "b": "They create workbook copies",
      "c": "They help separate and structure related data visually",
      "d": "They calculate totals"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 47,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "What normally happens after pressing Enter following a cell entry?",
    "options": {
      "a": "The workbook closes",
      "b": "The row is deleted",
      "c": "The data becomes a chart",
      "d": "The entry is confirmed and the active cell usually moves down"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 48,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "What does Ctrl+O usually do?",
    "options": {
      "a": "Applies AutoFit",
      "b": "Creates a chart",
      "c": "Opens an existing workbook",
      "d": "Closes Excel permanently"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 49,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "When is Save As especially useful?",
    "options": {
      "a": "When selecting a range",
      "b": "When clearing a filter",
      "c": "When adding a chart title",
      "d": "When creating a copy or changing the file name, location, or format"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 50,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "What does Clear Print Area do?",
    "options": {
      "a": "Removes the saved print-area setting",
      "b": "Clears all worksheet formatting",
      "c": "Deletes the selected cells",
      "d": "Removes the printer from Windows"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 51,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "What is AutoFill used for?",
    "options": {
      "a": "Extending patterns, sequences, or repeated formulas",
      "b": "Creating email attachments",
      "c": "Protecting the workbook with a password",
      "d": "Automatically printing every worksheet"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 52,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What is AutoSum?",
    "options": {
      "a": "A command that saves every workbook",
      "b": "A chart format",
      "c": "A quick way to insert a SUM formula for a nearby range",
      "d": "A tool that automatically sorts text"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 53,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Why should a workbook be saved regularly?",
    "options": {
      "a": "To remove all formulas",
      "b": "To reduce the risk of losing changes",
      "c": "To make every cell bold",
      "d": "To sort every worksheet"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 54,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Which is an absolute reference?",
    "options": {
      "a": "B$5",
      "b": "$B5",
      "c": "$B$5",
      "d": "B5"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 55,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What is a relative cell reference?",
    "options": {
      "a": "A reference containing no row or column",
      "b": "A reference that never changes",
      "c": "A reference used only in charts",
      "d": "A reference that normally changes when the formula is copied"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 56,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "What is the purpose of Copy?",
    "options": {
      "a": "To lock a cell reference",
      "b": "To change a number into text",
      "c": "To duplicate selected content while leaving the original in place",
      "d": "To remove selected content permanently"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 57,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "What is the Ribbon?",
    "options": {
      "a": "A tool used only for formulas",
      "b": "The area that organises Excel commands into tabs and groups",
      "c": "A line separating two printed pages",
      "d": "The bottom worksheet status line"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 58,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Why should filters be cleared before reviewing the full dataset?",
    "options": {
      "a": "So the workbook can be renamed",
      "b": "So formulas begin with an equal sign",
      "c": "So the chart becomes a picture",
      "d": "So all rows become visible again"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 59,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Which symbol must an Excel formula begin with?",
    "options": {
      "a": "&",
      "b": "=",
      "c": "#",
      "d": "@"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 60,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "What is the Quick Access Toolbar used for?",
    "options": {
      "a": "Changing all workbook formulas",
      "b": "Quick access to frequently used commands such as Save and Undo",
      "c": "Creating chart data automatically",
      "d": "Displaying every worksheet cell"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 61,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What does =SUM(B2:B6) do?",
    "options": {
      "a": "Sorts B2 through B6",
      "b": "Counts only text in B2 through B6",
      "c": "Adds the values from B2 through B6",
      "d": "Finds the largest value only"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 62,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "What are data labels used for?",
    "options": {
      "a": "Protecting formulas",
      "b": "Displaying values or names on chart elements",
      "c": "Changing workbook file types",
      "d": "Selecting worksheets"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 63,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "What is an Excel chart?",
    "options": {
      "a": "A visual representation of worksheet data",
      "b": "A method for deleting rows",
      "c": "A type of worksheet password",
      "d": "A workbook save location"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 64,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What does COUNT calculate?",
    "options": {
      "a": "The number of cells containing numbers",
      "b": "The smallest numeric value",
      "c": "The workbook file size",
      "d": "The sum of all text entries"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 65,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "What is a clear workbook file name?",
    "options": {
      "a": "New document stuff.xlsx",
      "b": "Untitled unknown.xlsx",
      "c": "Book1 final maybe.xlsx",
      "d": "Monthly_Budget_2026.xlsx"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 66,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What does the Formula Bar display for the selected cell?",
    "options": {
      "a": "Its value or formula",
      "b": "The file's print settings",
      "c": "Only the column width",
      "d": "Only the worksheet name"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 67,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "What does Ctrl+N do in Excel?",
    "options": {
      "a": "Renames the active worksheet",
      "b": "Creates a new workbook",
      "c": "Opens Print Preview",
      "d": "Applies number formatting"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 68,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "How is text commonly sorted in Excel?",
    "options": {
      "a": "Oldest to newest only",
      "b": "A to Z or Z to A",
      "c": "Largest to smallest only",
      "d": "By page number"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 69,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Why should the whole table be included when sorting?",
    "options": {
      "a": "To keep each row's related data together",
      "b": "To make formulas absolute",
      "c": "To remove worksheet headings",
      "d": "To reduce the file size"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 70,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "What is the difference between a formula and a function?",
    "options": {
      "a": "A formula prints data; a function saves files",
      "b": "There is no difference",
      "c": "A formula is always text; a function is always a picture",
      "d": "A formula is the full calculation; a function is a built-in calculation tool used within a formula"
    },
    "correctAnswer": "d"
  }
]`;

const setBJSON = `[
  {
    "questionNumber": 71,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Choose the correct answer: Why should the chart type match the message?",
    "options": {
      "a": "Every chart type produces the same result",
      "b": "The wrong chart can make the data difficult or misleading to interpret",
      "c": "Chart types control workbook saving",
      "d": "Charts are used only for decoration"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 72,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What is a formula in Excel?",
    "options": {
      "a": "A printed page heading",
      "b": "A workbook file name",
      "c": "An expression Excel calculates",
      "d": "A worksheet colour theme"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 73,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What does the dollar sign do in an Excel reference?",
    "options": {
      "a": "Changes a value to currency automatically",
      "b": "Marks a formula as incorrect",
      "c": "Adds values together",
      "d": "Locks a row, a column, or both"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 74,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Choose the correct answer: Which shortcuts are used for Copy, Cut, and Paste?",
    "options": {
      "a": "Ctrl+N, Ctrl+F, and Ctrl+H",
      "b": "Ctrl+B, Ctrl+I, and Ctrl+U",
      "c": "Ctrl+P, Ctrl+S, and Ctrl+O",
      "d": "Ctrl+C, Ctrl+X, and Ctrl+V"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 75,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: What is the Ribbon?",
    "options": {
      "a": "The area that organises Excel commands into tabs and groups",
      "b": "A line separating two printed pages",
      "c": "The bottom worksheet status line",
      "d": "A tool used only for formulas"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 76,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What does the Formula Bar display for the selected cell?",
    "options": {
      "a": "Its value or formula",
      "b": "Only the worksheet name",
      "c": "Only the column width",
      "d": "The file's print settings"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 77,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Choose the correct answer: Which shortcut commonly opens the print screen?",
    "options": {
      "a": "Ctrl+N",
      "b": "Ctrl+P",
      "c": "Ctrl+L",
      "d": "Ctrl+X"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 78,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Choose the correct answer: What does Wrap Text do?",
    "options": {
      "a": "Displays long content on multiple lines within a cell",
      "b": "Deletes extra words",
      "c": "Combines several workbooks",
      "d": "Changes text into a number"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 79,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Choose the correct answer: What is the purpose of Copy?",
    "options": {
      "a": "To change a number into text",
      "b": "To duplicate selected content while leaving the original in place",
      "c": "To lock a cell reference",
      "d": "To remove selected content permanently"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 80,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Choose the correct answer: How is text commonly sorted in Excel?",
    "options": {
      "a": "Oldest to newest only",
      "b": "Largest to smallest only",
      "c": "By page number",
      "d": "A to Z or Z to A"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 81,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Choose the correct answer: Why should the whole table be included when sorting?",
    "options": {
      "a": "To reduce the file size",
      "b": "To make formulas absolute",
      "c": "To keep each row's related data together",
      "d": "To remove worksheet headings"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 82,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Choose the correct answer: What is a Print Area?",
    "options": {
      "a": "A selected range defined for printing",
      "b": "A place where formulas are stored",
      "c": "A hidden worksheet",
      "d": "The chart legend"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 83,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Choose the correct answer: Why might a number be formatted as currency?",
    "options": {
      "a": "To convert it into text",
      "b": "To sort it alphabetically",
      "c": "To hide the number",
      "d": "To display it clearly as a monetary amount"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 84,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Choose the correct answer: How is data entered into a cell?",
    "options": {
      "a": "Print the worksheet first",
      "b": "Open the Page Setup dialog",
      "c": "Select the cell, type the data, and confirm the entry",
      "d": "Create a chart before typing"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 85,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: What happens when a worksheet tab is selected?",
    "options": {
      "a": "The worksheet prints immediately",
      "b": "That worksheet becomes active",
      "c": "The workbook closes",
      "d": "All formulas are deleted"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 86,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: What is Microsoft Excel mainly used for?",
    "options": {
      "a": "Editing videos and sound recordings",
      "b": "Organising, calculating, analysing, and presenting data",
      "c": "Browsing websites without a browser",
      "d": "Creating only handwritten drawings"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 87,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Choose the correct answer: What is cell formatting?",
    "options": {
      "a": "Replacing every value with a formula",
      "b": "Deleting the data from a cell",
      "c": "Changing how data looks without necessarily changing its underlying value",
      "d": "Moving the workbook to another folder"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 88,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Choose the correct answer: What are data labels used for?",
    "options": {
      "a": "Displaying values or names on chart elements",
      "b": "Changing workbook file types",
      "c": "Selecting worksheets",
      "d": "Protecting formulas"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 89,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What is the difference between a formula and a function?",
    "options": {
      "a": "A formula prints data; a function saves files",
      "b": "A formula is the full calculation; a function is a built-in calculation tool used within a formula",
      "c": "A formula is always text; a function is always a picture",
      "d": "There is no difference"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 90,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: Which is an absolute reference?",
    "options": {
      "a": "$B$5",
      "b": "B5",
      "c": "$B5",
      "d": "B$5"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 91,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Choose the correct answer: What does Ctrl+S do?",
    "options": {
      "a": "Sorts the active table",
      "b": "Starts a new formula",
      "c": "Saves the current workbook",
      "d": "Selects the entire worksheet"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 92,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: How are Excel columns identified?",
    "options": {
      "a": "By letters",
      "b": "By file names",
      "c": "By colours",
      "d": "By numbers only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 93,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What does MIN return?",
    "options": {
      "a": "The largest value in the range",
      "b": "The smallest value in the selected range",
      "c": "The total of all values",
      "d": "The number of worksheets"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 94,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What does MAX return?",
    "options": {
      "a": "The smallest value in the range",
      "b": "The average value",
      "c": "The largest value in the selected range",
      "d": "The number of blank cells"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 95,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What is AutoSum?",
    "options": {
      "a": "A quick way to insert a SUM formula for a nearby range",
      "b": "A command that saves every workbook",
      "c": "A chart format",
      "d": "A tool that automatically sorts text"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 96,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: What is the standard modern Excel workbook extension?",
    "options": {
      "a": ".xlsx",
      "b": ".docx",
      "c": ".jpg",
      "d": ".pptx"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 97,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Choose the correct answer: What normally happens after pressing Enter following a cell entry?",
    "options": {
      "a": "The data becomes a chart",
      "b": "The workbook closes",
      "c": "The row is deleted",
      "d": "The entry is confirmed and the active cell usually moves down"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 98,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Choose the correct answer: Why should Print Preview be checked before printing?",
    "options": {
      "a": "To create a new workbook",
      "b": "To detect layout problems before using paper or ink",
      "c": "To convert formulas into text",
      "d": "To apply filters"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 99,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What does the * operator do in a formula?",
    "options": {
      "a": "Joins worksheets",
      "b": "Divides values",
      "c": "Multiplies values",
      "d": "Adds values"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 100,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Choose the correct answer: What does sorting do?",
    "options": {
      "a": "Changes formulas to values",
      "b": "Deletes duplicate worksheets",
      "c": "Temporarily hides matching rows",
      "d": "Changes the order of rows based on selected values"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 101,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Choose the correct answer: What does AutoFit Column Width do?",
    "options": {
      "a": "Makes every column the same colour",
      "b": "Deletes empty columns",
      "c": "Prints the selected column",
      "d": "Adjusts the column width to fit its contents"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 102,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Choose the correct answer: What is a chart title used for?",
    "options": {
      "a": "To explain what the chart shows",
      "b": "To store the source data",
      "c": "To calculate the chart values",
      "d": "To rename the workbook"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 103,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What does =SUM(B2:B6) do?",
    "options": {
      "a": "Finds the largest value only",
      "b": "Counts only text in B2 through B6",
      "c": "Sorts B2 through B6",
      "d": "Adds the values from B2 through B6"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 104,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Choose the correct answer: When is Landscape orientation often useful?",
    "options": {
      "a": "When the worksheet contains one narrow column",
      "b": "When renaming a sheet",
      "c": "When a worksheet has many columns and is wide",
      "d": "When adding formulas"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 105,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Choose the correct answer: Does filtering delete hidden rows?",
    "options": {
      "a": "No, it only changes which rows are visible",
      "b": "Only when filtering text",
      "c": "Yes, hidden rows are permanently removed",
      "d": "Yes, unless the workbook is saved"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 106,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: Which mixed reference locks column B but allows the row to change?",
    "options": {
      "a": "B$5",
      "b": "$B$5",
      "c": "$B5",
      "d": "B5"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 107,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Choose the correct answer: Which chart is commonly useful for showing change over time?",
    "options": {
      "a": "Pie chart",
      "b": "Doughnut chart",
      "c": "Line chart",
      "d": "Radar chart"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 108,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Choose the correct answer: What is the purpose of Cut?",
    "options": {
      "a": "To sort dates",
      "b": "To calculate an average",
      "c": "To create a second permanent copy",
      "d": "To move selected content from one location to another"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 109,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Choose the correct answer: What is an Excel chart?",
    "options": {
      "a": "A method for deleting rows",
      "b": "A workbook save location",
      "c": "A visual representation of worksheet data",
      "d": "A type of worksheet password"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 110,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: Why are parentheses used in formulas?",
    "options": {
      "a": "To change page orientation",
      "b": "To control the order of calculation",
      "c": "To create filters",
      "d": "To rename worksheets"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 111,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Choose the correct answer: Why repeat heading rows on every printed page?",
    "options": {
      "a": "To increase the number of pages",
      "b": "To hide the data rows",
      "c": "So readers can understand the columns on each page",
      "d": "To replace the worksheet title"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 112,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: What is the Quick Access Toolbar used for?",
    "options": {
      "a": "Displaying every worksheet cell",
      "b": "Creating chart data automatically",
      "c": "Quick access to frequently used commands such as Save and Undo",
      "d": "Changing all workbook formulas"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 113,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: What is a worksheet?",
    "options": {
      "a": "The Excel application icon",
      "b": "A saved email attachment",
      "c": "The complete Windows operating system",
      "d": "A grid-based working sheet inside a workbook"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 114,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Choose the correct answer: What normally happens after pressing Tab following a cell entry?",
    "options": {
      "a": "The entry is confirmed and the active cell usually moves right",
      "b": "The worksheet is printed",
      "c": "The formula is removed",
      "d": "The column becomes hidden"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 115,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: Which is a valid cell address?",
    "options": {
      "a": "Column7",
      "b": "7C",
      "c": "C7",
      "d": "RowC7"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 116,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Choose the correct answer: Why should filters be cleared before reviewing the full dataset?",
    "options": {
      "a": "So formulas begin with an equal sign",
      "b": "So the workbook can be renamed",
      "c": "So all rows become visible again",
      "d": "So the chart becomes a picture"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 117,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Choose the correct answer: What is AutoFill used for?",
    "options": {
      "a": "Protecting the workbook with a password",
      "b": "Creating email attachments",
      "c": "Automatically printing every worksheet",
      "d": "Extending patterns, sequences, or repeated formulas"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 118,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What does AVERAGE calculate?",
    "options": {
      "a": "The number of text entries",
      "b": "The arithmetic mean of selected numeric values",
      "c": "The total page count",
      "d": "The largest value only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 119,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What does COUNT calculate?",
    "options": {
      "a": "The smallest numeric value",
      "b": "The number of cells containing numbers",
      "c": "The sum of all text entries",
      "d": "The workbook file size"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 120,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: How are Excel rows identified?",
    "options": {
      "a": "By worksheet colours",
      "b": "By letters only",
      "c": "By formulas",
      "d": "By numbers"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 121,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: What is the active cell?",
    "options": {
      "a": "A cell hidden by a filter",
      "b": "The first cell in every workbook",
      "c": "The currently selected cell where Excel is ready to work",
      "d": "Every cell containing a formula"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 122,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: What is a cell?",
    "options": {
      "a": "The intersection of a row and a column",
      "b": "The bar containing Ribbon tabs",
      "c": "A group of unrelated workbooks",
      "d": "A printed worksheet page"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 123,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Choose the correct answer: What is a clear workbook file name?",
    "options": {
      "a": "Book1 final maybe.xlsx",
      "b": "Monthly_Budget_2026.xlsx",
      "c": "Untitled unknown.xlsx",
      "d": "New document stuff.xlsx"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 124,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: What is a workbook in Excel?",
    "options": {
      "a": "A printed chart only",
      "b": "A single cell inside a worksheet",
      "c": "The complete Excel file",
      "d": "The Formula Bar"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 125,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Choose the correct answer: What does filtering do?",
    "options": {
      "a": "Creates a copy of the workbook",
      "b": "Temporarily shows only rows matching selected criteria",
      "c": "Permanently rearranges every row",
      "d": "Deletes rows that do not match"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 126,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: Which symbol must an Excel formula begin with?",
    "options": {
      "a": "#",
      "b": "=",
      "c": "&",
      "d": "@"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 127,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Choose the correct answer: Why are borders useful in a worksheet?",
    "options": {
      "a": "They help separate and structure related data visually",
      "b": "They create workbook copies",
      "c": "They calculate totals",
      "d": "They correct formula errors"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 128,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Choose the correct answer: What does Clear Print Area do?",
    "options": {
      "a": "Deletes the selected cells",
      "b": "Removes the saved print-area setting",
      "c": "Clears all worksheet formatting",
      "d": "Removes the printer from Windows"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 129,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Choose the correct answer: What does the Name Box commonly show?",
    "options": {
      "a": "The total of selected cells only",
      "b": "The address of the active cell",
      "c": "The current printer name",
      "d": "The workbook password"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 130,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Choose the correct answer: What is a multilevel sort?",
    "options": {
      "a": "A sort using more than one column in a chosen priority order",
      "b": "A workbook containing many worksheets",
      "c": "A filter that hides all rows",
      "d": "A chart with several titles"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 131,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What does the + operator do in a formula?",
    "options": {
      "a": "Multiplies values",
      "b": "Locks a reference",
      "c": "Divides values",
      "d": "Adds values"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 132,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Choose the correct answer: Why should a workbook be saved regularly?",
    "options": {
      "a": "To sort every worksheet",
      "b": "To remove all formulas",
      "c": "To make every cell bold",
      "d": "To reduce the risk of losing changes"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 133,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Choose the correct answer: What is a relative cell reference?",
    "options": {
      "a": "A reference used only in charts",
      "b": "A reference containing no row or column",
      "c": "A reference that never changes",
      "d": "A reference that normally changes when the formula is copied"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 134,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Choose the correct answer: Where is the fill handle located?",
    "options": {
      "a": "At the lower-right corner of the selected cell or range",
      "b": "Inside the File tab",
      "c": "On the status bar only",
      "d": "At the top of the Ribbon"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 135,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Choose the correct answer: What does a chart legend identify?",
    "options": {
      "a": "The active cell",
      "b": "The meaning of data series colours or patterns",
      "c": "The print area",
      "d": "The workbook author only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 136,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Choose the correct answer: Why should Merge & Center be used carefully?",
    "options": {
      "a": "Merged cells can interfere with sorting, selection, and editing",
      "b": "It changes numbers into dates",
      "c": "It blocks workbook saving",
      "d": "It permanently deletes all data"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 137,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Choose the correct answer: What does Ctrl+O usually do?",
    "options": {
      "a": "Creates a chart",
      "b": "Closes Excel permanently",
      "c": "Applies AutoFit",
      "d": "Opens an existing workbook"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 138,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Choose the correct answer: When is Save As especially useful?",
    "options": {
      "a": "When clearing a filter",
      "b": "When adding a chart title",
      "c": "When selecting a range",
      "d": "When creating a copy or changing the file name, location, or format"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 139,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Choose the correct answer: Which chart is commonly useful for comparing categories?",
    "options": {
      "a": "Scatter chart only",
      "b": "Column chart",
      "c": "Surface chart only",
      "d": "Line chart only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 140,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Choose the correct answer: What does Ctrl+N do in Excel?",
    "options": {
      "a": "Creates a new workbook",
      "b": "Opens Print Preview",
      "c": "Renames the active worksheet",
      "d": "Applies number formatting"
    },
    "correctAnswer": "a"
  }
]`;

const setCJSON = `[
  {
    "questionNumber": 141,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: How are Excel columns identified?",
    "options": {
      "a": "By numbers only",
      "b": "By letters",
      "c": "By file names",
      "d": "By colours"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 142,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Excel revision question: Which shortcuts are used for Copy, Cut, and Paste?",
    "options": {
      "a": "Ctrl+P, Ctrl+S, and Ctrl+O",
      "b": "Ctrl+C, Ctrl+X, and Ctrl+V",
      "c": "Ctrl+N, Ctrl+F, and Ctrl+H",
      "d": "Ctrl+B, Ctrl+I, and Ctrl+U"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 143,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: What happens when a worksheet tab is selected?",
    "options": {
      "a": "The worksheet prints immediately",
      "b": "The workbook closes",
      "c": "All formulas are deleted",
      "d": "That worksheet becomes active"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 144,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: Which mixed reference locks column B but allows the row to change?",
    "options": {
      "a": "B$5",
      "b": "B5",
      "c": "$B5",
      "d": "$B$5"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 145,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What is the difference between a formula and a function?",
    "options": {
      "a": "A formula is always text; a function is always a picture",
      "b": "There is no difference",
      "c": "A formula prints data; a function saves files",
      "d": "A formula is the full calculation; a function is a built-in calculation tool used within a formula"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 146,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Excel revision question: What does Wrap Text do?",
    "options": {
      "a": "Changes text into a number",
      "b": "Deletes extra words",
      "c": "Combines several workbooks",
      "d": "Displays long content on multiple lines within a cell"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 147,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Excel revision question: How is data entered into a cell?",
    "options": {
      "a": "Create a chart before typing",
      "b": "Print the worksheet first",
      "c": "Open the Page Setup dialog",
      "d": "Select the cell, type the data, and confirm the entry"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 148,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What does the dollar sign do in an Excel reference?",
    "options": {
      "a": "Adds values together",
      "b": "Locks a row, a column, or both",
      "c": "Changes a value to currency automatically",
      "d": "Marks a formula as incorrect"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 149,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Excel revision question: What does a chart legend identify?",
    "options": {
      "a": "The active cell",
      "b": "The workbook author only",
      "c": "The print area",
      "d": "The meaning of data series colours or patterns"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 150,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Excel revision question: What normally happens after pressing Enter following a cell entry?",
    "options": {
      "a": "The workbook closes",
      "b": "The entry is confirmed and the active cell usually moves down",
      "c": "The data becomes a chart",
      "d": "The row is deleted"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 151,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Excel revision question: Why repeat heading rows on every printed page?",
    "options": {
      "a": "To replace the worksheet title",
      "b": "To hide the data rows",
      "c": "So readers can understand the columns on each page",
      "d": "To increase the number of pages"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 152,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Excel revision question: What is a clear workbook file name?",
    "options": {
      "a": "Untitled unknown.xlsx",
      "b": "Monthly_Budget_2026.xlsx",
      "c": "New document stuff.xlsx",
      "d": "Book1 final maybe.xlsx"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 153,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: What does the Name Box commonly show?",
    "options": {
      "a": "The address of the active cell",
      "b": "The workbook password",
      "c": "The current printer name",
      "d": "The total of selected cells only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 154,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Excel revision question: Why are borders useful in a worksheet?",
    "options": {
      "a": "They calculate totals",
      "b": "They create workbook copies",
      "c": "They correct formula errors",
      "d": "They help separate and structure related data visually"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 155,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Excel revision question: What does AutoFit Column Width do?",
    "options": {
      "a": "Adjusts the column width to fit its contents",
      "b": "Prints the selected column",
      "c": "Makes every column the same colour",
      "d": "Deletes empty columns"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 156,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What does MAX return?",
    "options": {
      "a": "The smallest value in the range",
      "b": "The number of blank cells",
      "c": "The largest value in the selected range",
      "d": "The average value"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 157,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: What is a cell?",
    "options": {
      "a": "The bar containing Ribbon tabs",
      "b": "A printed worksheet page",
      "c": "The intersection of a row and a column",
      "d": "A group of unrelated workbooks"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 158,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Excel revision question: What are data labels used for?",
    "options": {
      "a": "Protecting formulas",
      "b": "Changing workbook file types",
      "c": "Displaying values or names on chart elements",
      "d": "Selecting worksheets"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 159,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What is a formula in Excel?",
    "options": {
      "a": "A worksheet colour theme",
      "b": "A printed page heading",
      "c": "A workbook file name",
      "d": "An expression Excel calculates"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 160,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What does the + operator do in a formula?",
    "options": {
      "a": "Divides values",
      "b": "Locks a reference",
      "c": "Adds values",
      "d": "Multiplies values"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 161,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What does AVERAGE calculate?",
    "options": {
      "a": "The number of text entries",
      "b": "The total page count",
      "c": "The arithmetic mean of selected numeric values",
      "d": "The largest value only"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 162,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Excel revision question: Does filtering delete hidden rows?",
    "options": {
      "a": "No, it only changes which rows are visible",
      "b": "Yes, hidden rows are permanently removed",
      "c": "Yes, unless the workbook is saved",
      "d": "Only when filtering text"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 163,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What does MIN return?",
    "options": {
      "a": "The smallest value in the selected range",
      "b": "The largest value in the range",
      "c": "The number of worksheets",
      "d": "The total of all values"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 164,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What does the Formula Bar display for the selected cell?",
    "options": {
      "a": "Its value or formula",
      "b": "Only the worksheet name",
      "c": "The file's print settings",
      "d": "Only the column width"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 165,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Excel revision question: What is a chart title used for?",
    "options": {
      "a": "To store the source data",
      "b": "To calculate the chart values",
      "c": "To rename the workbook",
      "d": "To explain what the chart shows"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 166,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Excel revision question: What is a Print Area?",
    "options": {
      "a": "A selected range defined for printing",
      "b": "The chart legend",
      "c": "A place where formulas are stored",
      "d": "A hidden worksheet"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 167,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Excel revision question: What is the purpose of Cut?",
    "options": {
      "a": "To sort dates",
      "b": "To create a second permanent copy",
      "c": "To move selected content from one location to another",
      "d": "To calculate an average"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 168,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Excel revision question: When is Landscape orientation often useful?",
    "options": {
      "a": "When renaming a sheet",
      "b": "When adding formulas",
      "c": "When the worksheet contains one narrow column",
      "d": "When a worksheet has many columns and is wide"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 169,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Excel revision question: Where is the fill handle located?",
    "options": {
      "a": "On the status bar only",
      "b": "Inside the File tab",
      "c": "At the lower-right corner of the selected cell or range",
      "d": "At the top of the Ribbon"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 170,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Excel revision question: What is an Excel chart?",
    "options": {
      "a": "A type of worksheet password",
      "b": "A method for deleting rows",
      "c": "A workbook save location",
      "d": "A visual representation of worksheet data"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 171,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Excel revision question: Why should the chart type match the message?",
    "options": {
      "a": "The wrong chart can make the data difficult or misleading to interpret",
      "b": "Chart types control workbook saving",
      "c": "Every chart type produces the same result",
      "d": "Charts are used only for decoration"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 172,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Excel revision question: What does Clear Print Area do?",
    "options": {
      "a": "Deletes the selected cells",
      "b": "Clears all worksheet formatting",
      "c": "Removes the saved print-area setting",
      "d": "Removes the printer from Windows"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 173,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What does =SUM(B2:B6) do?",
    "options": {
      "a": "Adds the values from B2 through B6",
      "b": "Sorts B2 through B6",
      "c": "Finds the largest value only",
      "d": "Counts only text in B2 through B6"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 174,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Excel revision question: Why should the whole table be included when sorting?",
    "options": {
      "a": "To keep each row's related data together",
      "b": "To remove worksheet headings",
      "c": "To reduce the file size",
      "d": "To make formulas absolute"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 175,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Excel revision question: What is cell formatting?",
    "options": {
      "a": "Deleting the data from a cell",
      "b": "Replacing every value with a formula",
      "c": "Moving the workbook to another folder",
      "d": "Changing how data looks without necessarily changing its underlying value"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 176,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: What is the Quick Access Toolbar used for?",
    "options": {
      "a": "Creating chart data automatically",
      "b": "Quick access to frequently used commands such as Save and Undo",
      "c": "Displaying every worksheet cell",
      "d": "Changing all workbook formulas"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 177,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Excel revision question: What is the purpose of Copy?",
    "options": {
      "a": "To change a number into text",
      "b": "To remove selected content permanently",
      "c": "To lock a cell reference",
      "d": "To duplicate selected content while leaving the original in place"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 178,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Excel revision question: What does Ctrl+N do in Excel?",
    "options": {
      "a": "Creates a new workbook",
      "b": "Opens Print Preview",
      "c": "Renames the active worksheet",
      "d": "Applies number formatting"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 179,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: How are Excel rows identified?",
    "options": {
      "a": "By letters only",
      "b": "By worksheet colours",
      "c": "By formulas",
      "d": "By numbers"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 180,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Excel revision question: Which chart is commonly useful for comparing categories?",
    "options": {
      "a": "Column chart",
      "b": "Scatter chart only",
      "c": "Line chart only",
      "d": "Surface chart only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 181,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Excel revision question: Why should Print Preview be checked before printing?",
    "options": {
      "a": "To detect layout problems before using paper or ink",
      "b": "To apply filters",
      "c": "To convert formulas into text",
      "d": "To create a new workbook"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 182,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Excel revision question: Why should a workbook be saved regularly?",
    "options": {
      "a": "To make every cell bold",
      "b": "To reduce the risk of losing changes",
      "c": "To sort every worksheet",
      "d": "To remove all formulas"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 183,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What does the * operator do in a formula?",
    "options": {
      "a": "Multiplies values",
      "b": "Joins worksheets",
      "c": "Divides values",
      "d": "Adds values"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 184,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: Why are parentheses used in formulas?",
    "options": {
      "a": "To control the order of calculation",
      "b": "To rename worksheets",
      "c": "To change page orientation",
      "d": "To create filters"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 185,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Excel revision question: What is a multilevel sort?",
    "options": {
      "a": "A sort using more than one column in a chosen priority order",
      "b": "A filter that hides all rows",
      "c": "A workbook containing many worksheets",
      "d": "A chart with several titles"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 186,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: What is the standard modern Excel workbook extension?",
    "options": {
      "a": ".jpg",
      "b": ".xlsx",
      "c": ".pptx",
      "d": ".docx"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 187,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: What is a workbook in Excel?",
    "options": {
      "a": "The Formula Bar",
      "b": "The complete Excel file",
      "c": "A single cell inside a worksheet",
      "d": "A printed chart only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 188,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What is AutoSum?",
    "options": {
      "a": "A chart format",
      "b": "A quick way to insert a SUM formula for a nearby range",
      "c": "A tool that automatically sorts text",
      "d": "A command that saves every workbook"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 189,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Excel revision question: What normally happens after pressing Tab following a cell entry?",
    "options": {
      "a": "The column becomes hidden",
      "b": "The worksheet is printed",
      "c": "The formula is removed",
      "d": "The entry is confirmed and the active cell usually moves right"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 190,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Excel revision question: Why might a number be formatted as currency?",
    "options": {
      "a": "To sort it alphabetically",
      "b": "To display it clearly as a monetary amount",
      "c": "To hide the number",
      "d": "To convert it into text"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 191,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: What is the active cell?",
    "options": {
      "a": "A cell hidden by a filter",
      "b": "Every cell containing a formula",
      "c": "The currently selected cell where Excel is ready to work",
      "d": "The first cell in every workbook"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 192,
    "section": "Data Entry & Editing (5.3)",
    "lessonReference": "Lesson 3",
    "question": "Excel revision question: What is AutoFill used for?",
    "options": {
      "a": "Protecting the workbook with a password",
      "b": "Creating email attachments",
      "c": "Automatically printing every worksheet",
      "d": "Extending patterns, sequences, or repeated formulas"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 193,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: Which symbol must an Excel formula begin with?",
    "options": {
      "a": "#",
      "b": "&",
      "c": "=",
      "d": "@"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 194,
    "section": "Formatting Cells (5.4)",
    "lessonReference": "Lesson 4",
    "question": "Excel revision question: Why should Merge & Center be used carefully?",
    "options": {
      "a": "It blocks workbook saving",
      "b": "Merged cells can interfere with sorting, selection, and editing",
      "c": "It changes numbers into dates",
      "d": "It permanently deletes all data"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 195,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: Which is a valid cell address?",
    "options": {
      "a": "RowC7",
      "b": "C7",
      "c": "7C",
      "d": "Column7"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 196,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: Which is an absolute reference?",
    "options": {
      "a": "B5",
      "b": "$B$5",
      "c": "$B5",
      "d": "B$5"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 197,
    "section": "Printing & Page Setup (5.8)",
    "lessonReference": "Lesson 8",
    "question": "Excel revision question: Which shortcut commonly opens the print screen?",
    "options": {
      "a": "Ctrl+X",
      "b": "Ctrl+P",
      "c": "Ctrl+L",
      "d": "Ctrl+N"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 198,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: What is Microsoft Excel mainly used for?",
    "options": {
      "a": "Editing videos and sound recordings",
      "b": "Creating only handwritten drawings",
      "c": "Browsing websites without a browser",
      "d": "Organising, calculating, analysing, and presenting data"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 199,
    "section": "Charts & Data Visualization (5.7)",
    "lessonReference": "Lesson 7",
    "question": "Excel revision question: Which chart is commonly useful for showing change over time?",
    "options": {
      "a": "Line chart",
      "b": "Doughnut chart",
      "c": "Radar chart",
      "d": "Pie chart"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 200,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Excel revision question: When is Save As especially useful?",
    "options": {
      "a": "When clearing a filter",
      "b": "When creating a copy or changing the file name, location, or format",
      "c": "When selecting a range",
      "d": "When adding a chart title"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 201,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Excel revision question: What does Ctrl+S do?",
    "options": {
      "a": "Selects the entire worksheet",
      "b": "Sorts the active table",
      "c": "Starts a new formula",
      "d": "Saves the current workbook"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 202,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: What is the Ribbon?",
    "options": {
      "a": "The bottom worksheet status line",
      "b": "A tool used only for formulas",
      "c": "The area that organises Excel commands into tabs and groups",
      "d": "A line separating two printed pages"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 203,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Excel revision question: What does sorting do?",
    "options": {
      "a": "Changes the order of rows based on selected values",
      "b": "Deletes duplicate worksheets",
      "c": "Changes formulas to values",
      "d": "Temporarily hides matching rows"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 204,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Excel revision question: What does filtering do?",
    "options": {
      "a": "Deletes rows that do not match",
      "b": "Temporarily shows only rows matching selected criteria",
      "c": "Creates a copy of the workbook",
      "d": "Permanently rearranges every row"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 205,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What is a relative cell reference?",
    "options": {
      "a": "A reference containing no row or column",
      "b": "A reference that normally changes when the formula is copied",
      "c": "A reference used only in charts",
      "d": "A reference that never changes"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 206,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Excel revision question: How is text commonly sorted in Excel?",
    "options": {
      "a": "Largest to smallest only",
      "b": "By page number",
      "c": "A to Z or Z to A",
      "d": "Oldest to newest only"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 207,
    "section": "Formulas & Functions (5.5)",
    "lessonReference": "Lesson 5",
    "question": "Excel revision question: What does COUNT calculate?",
    "options": {
      "a": "The smallest numeric value",
      "b": "The sum of all text entries",
      "c": "The number of cells containing numbers",
      "d": "The workbook file size"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 208,
    "section": "Create, Open & Save Workbooks (5.2)",
    "lessonReference": "Lesson 2",
    "question": "Excel revision question: What does Ctrl+O usually do?",
    "options": {
      "a": "Applies AutoFit",
      "b": "Closes Excel permanently",
      "c": "Opens an existing workbook",
      "d": "Creates a chart"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 209,
    "section": "Sort & Filter (5.6)",
    "lessonReference": "Lesson 6",
    "question": "Excel revision question: Why should filters be cleared before reviewing the full dataset?",
    "options": {
      "a": "So formulas begin with an equal sign",
      "b": "So the chart becomes a picture",
      "c": "So all rows become visible again",
      "d": "So the workbook can be renamed"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 210,
    "section": "Spreadsheet Basics (5.1)",
    "lessonReference": "Lesson 1",
    "question": "Excel revision question: What is a worksheet?",
    "options": {
      "a": "A grid-based working sheet inside a workbook",
      "b": "The complete Windows operating system",
      "c": "A saved email attachment",
      "d": "The Excel application icon"
    },
    "correctAnswer": "a"
  }
]`;

async function seedModule5Questions() {
  try {
    let module = await Module.findOne({ order: 5 });
    if (!module) {
      module = await Module.findOne({ title: /Spreadsheet|Excel|Module 5/i });
    }
    if (!module) {
      console.log('Module 5 not found');
      process.exit(1);
    }

    console.log(`Found module: ${module.title} (${module._id})`);

    await AssignmentQuestion.deleteMany({ moduleId: module._id });
    console.log('Cleared existing questions for Module 5');

    const setA = JSON.parse(setAJSON);
    const setB = JSON.parse(setBJSON);
    const setC = JSON.parse(setCJSON);

    const allQuestions = [...setA, ...setB, ...setC].map(q => ({
      ...q,
      moduleId: module._id
    }));

    await AssignmentQuestion.insertMany(allQuestions);
    console.log(`✅ Successfully seeded ${allQuestions.length} questions for Module 5`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedModule5Questions();
