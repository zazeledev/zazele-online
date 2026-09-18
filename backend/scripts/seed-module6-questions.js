const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Module = require('../src/models/Module');
const AssignmentQuestion = require('../src/models/AssignmentQuestion');

const set1JSON = `[
  {
    "questionNumber": 1,
    "section": "Why Digital Drawing Matters",
    "lessonReference": "Lesson 1",
    "question": "What is digital drawing?",
    "options": {
      "a": "Typing numbers into Excel",
      "b": "Creating pictures or designs using a computer or digital device",
      "c": "Printing documents from Microsoft Word",
      "d": "Writing only with a pencil on paper"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 2,
    "section": "Why Digital Drawing Matters",
    "lessonReference": "Lesson 1",
    "question": "Why is digital drawing useful for beginners?",
    "options": {
      "a": "It replaces all other computer skills",
      "b": "It only teaches professional art",
      "c": "It builds mouse control, confidence, creativity, and tool awareness",
      "d": "It helps learners avoid using the mouse"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 3,
    "section": "Why Digital Drawing Matters",
    "lessonReference": "Lesson 1",
    "question": "What does the canvas mean in a drawing program?",
    "options": {
      "a": "The computer keyboard",
      "b": "The printer tray",
      "c": "The place where the drawing appears",
      "d": "The file name box"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 4,
    "section": "Why Digital Drawing Matters",
    "lessonReference": "Lesson 1",
    "question": "Which skill is practised when you click and drag to draw a line?",
    "options": {
      "a": "Email forwarding",
      "b": "Spreadsheet sorting",
      "c": "Printing",
      "d": "Mouse control"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 5,
    "section": "Why Digital Drawing Matters",
    "lessonReference": "Lesson 1",
    "question": "What should a beginner focus on first when learning digital drawing?",
    "options": {
      "a": "Basic control and tool use",
      "b": "Advanced design",
      "c": "Selling artwork online",
      "d": "Professional photo editing"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 6,
    "section": "Why Digital Drawing Matters",
    "lessonReference": "Lesson 1",
    "question": "Why does digital drawing build confidence?",
    "options": {
      "a": "It removes the need to save work",
      "b": "Learners see results immediately on the screen",
      "c": "It only works for advanced users",
      "d": "Learners never make mistakes"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 7,
    "section": "Why Digital Drawing Matters",
    "lessonReference": "Lesson 1",
    "question": "What does creativity mean in beginner digital drawing?",
    "options": {
      "a": "Avoiding all mistakes",
      "b": "Copying only the trainer’s work",
      "c": "Using every tool at once",
      "d": "Making choices about tools, colours, shapes, and layout"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 8,
    "section": "Why Digital Drawing Matters",
    "lessonReference": "Lesson 1",
    "question": "What should you do if you make a mistake while drawing?",
    "options": {
      "a": "Delete the computer file immediately",
      "b": "Stop learning",
      "c": "Use Undo or correct it calmly",
      "d": "Panic and close the program"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 9,
    "section": "Why Digital Drawing Matters",
    "lessonReference": "Lesson 1",
    "question": "Why is saving important in digital drawing?",
    "options": {
      "a": "It prints the picture automatically",
      "b": "It changes the mouse settings",
      "c": "It keeps your work so you can open it later",
      "d": "It makes the drawing disappear"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 10,
    "section": "Why Digital Drawing Matters",
    "lessonReference": "Lesson 1",
    "question": "What is the main purpose of Module 6?",
    "options": {
      "a": "To teach only typing speed",
      "b": "To replace Microsoft Office lessons",
      "c": "To teach advanced graphic design",
      "d": "To build beginner confidence through drawing tools"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 11,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What is Windows Paint used for in this module?",
    "options": {
      "a": "Sending emails",
      "b": "Simple drawing and image work",
      "c": "Writing computer code",
      "d": "Creating databases"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 12,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "How can you usually open Paint in Windows?",
    "options": {
      "a": "Press the monitor button",
      "b": "Open Excel first",
      "c": "Search for Paint from the Start menu",
      "d": "Open the printer cover"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 13,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What is the pencil tool used for?",
    "options": {
      "a": "Playing videos",
      "b": "Fine freehand marks",
      "c": "Printing images",
      "d": "Opening folders"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 14,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What is the brush tool used for?",
    "options": {
      "a": "Drawing broader or expressive strokes",
      "b": "Saving the computer",
      "c": "Changing the screen brightness",
      "d": "Typing text only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 15,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "Why is the brush useful for beginners?",
    "options": {
      "a": "It prevents drawing",
      "b": "It deletes the canvas",
      "c": "It shows how tool style changes the result",
      "d": "It opens the internet"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 16,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What are shapes useful for in Paint?",
    "options": {
      "a": "Playing music",
      "b": "Creating neat forms such as rectangles and circles",
      "c": "Sending messages",
      "d": "Changing the computer language"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 17,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What can a rectangle shape be used for?",
    "options": {
      "a": "A folder password",
      "b": "A printer driver",
      "c": "A wall, door, sign, or window",
      "d": "An email attachment"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 18,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What does the Fill tool do?",
    "options": {
      "a": "Opens the Start menu",
      "b": "Types a paragraph",
      "c": "Deletes Paint",
      "d": "Adds colour to an area"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 19,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What may happen if you use Fill in an open area?",
    "options": {
      "a": "The keyboard stops working",
      "b": "The file becomes a spreadsheet",
      "c": "The colour may spread too far",
      "d": "The computer shuts down"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 20,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What does the Text tool do?",
    "options": {
      "a": "Changes the mouse pointer only",
      "b": "Opens the recycle bin",
      "c": "Adds words to a drawing",
      "d": "Erases the whole canvas"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 21,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "Why must text be readable in a drawing?",
    "options": {
      "a": "So colours disappear",
      "b": "So the message can be understood",
      "c": "So shapes become hidden",
      "d": "So the drawing cannot be saved"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 22,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What does the Color Picker do?",
    "options": {
      "a": "Opens a website",
      "b": "Deletes all text",
      "c": "Prints the image",
      "d": "Copies a colour already in the picture"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 23,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "When should you use the Color Picker?",
    "options": {
      "a": "When you want to close Paint",
      "b": "When you want to reuse an existing colour accurately",
      "c": "When you want to send an email",
      "d": "When you want to shut down the computer"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 24,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What is a good file name for a Paint drawing?",
    "options": {
      "a": "aaabbbccc",
      "b": "Untitled999",
      "c": "My_First_Paint_Drawing",
      "d": "NewNewNew"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 25,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "Which file type is commonly used for images?",
    "options": {
      "a": "DOCX",
      "b": "XLSX",
      "c": "PPTX",
      "d": "PNG"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 26,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "Which tool would you use to add a title to a picture?",
    "options": {
      "a": "Rotate",
      "b": "Text",
      "c": "Printer",
      "d": "Folder"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 27,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "Which tool would you use to colour inside a closed shape?",
    "options": {
      "a": "Open",
      "b": "Save As",
      "c": "Fill",
      "d": "Zoom only"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 28,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "Which tool would you use to draw a freehand line?",
    "options": {
      "a": "File Explorer",
      "b": "Pencil or Brush",
      "c": "Taskbar",
      "d": "Print"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 29,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What should you do after every important drawing action?",
    "options": {
      "a": "Delete the tool",
      "b": "Close the program immediately",
      "c": "Check the result on the canvas",
      "d": "Turn off the mouse"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 30,
    "section": "Paint Basics",
    "lessonReference": "Lesson 2",
    "question": "What is the best beginner habit in Paint?",
    "options": {
      "a": "Click every button quickly",
      "b": "Choose the tool first, then use it on the canvas",
      "c": "Never save work",
      "d": "Use only one colour forever"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 31,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "What does editing mean in Paint?",
    "options": {
      "a": "Installing software",
      "b": "Only creating a new email",
      "c": "Formatting a spreadsheet",
      "d": "Improving or changing an image after it exists"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 32,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "What does Crop do?",
    "options": {
      "a": "Makes a sound louder",
      "b": "Removes unwanted outer parts of an image",
      "c": "Creates a new folder",
      "d": "Changes the keyboard"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 33,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "When should you use Crop?",
    "options": {
      "a": "When you want to play music",
      "b": "When you want to open Excel",
      "c": "When there is extra space or unwanted parts around the image",
      "d": "When you need to type a story"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 34,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "What does Resize do?",
    "options": {
      "a": "Opens the internet",
      "b": "Changes printer ink",
      "c": "Adds a password",
      "d": "Changes the size of an image"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 35,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "Why should resizing be done carefully?",
    "options": {
      "a": "The image can become too small or unclear",
      "b": "It turns the image into sound",
      "c": "It stops the mouse working",
      "d": "It always deletes the file"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 36,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "What does Rotate do?",
    "options": {
      "a": "Opens a saved file",
      "b": "Changes a colour only",
      "c": "Turns an image to another angle",
      "d": "Adds a label"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 37,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "When is Rotate useful?",
    "options": {
      "a": "When searching the web",
      "b": "When printing a spreadsheet",
      "c": "When typing a document",
      "d": "When a picture is sideways"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 38,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "What does Flip do?",
    "options": {
      "a": "Opens Paint",
      "b": "Mirrors an image",
      "c": "Saves a file",
      "d": "Adds a title"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 39,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "What is the difference between Rotate and Flip?",
    "options": {
      "a": "Rotate saves; Flip prints",
      "b": "Rotate turns; Flip mirrors",
      "c": "Rotate types; Flip deletes",
      "d": "Rotate colours; Flip opens"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 40,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "What does Select help you do?",
    "options": {
      "a": "Create a password",
      "b": "Open a web browser",
      "c": "Choose a part of the image to work with",
      "d": "Turn off the monitor"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 41,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "Why is Save As useful before editing?",
    "options": {
      "a": "It removes all colours",
      "b": "It deletes the original file",
      "c": "It helps keep the original image safe",
      "d": "It stops editing"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 42,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "What should you do if you crop too much?",
    "options": {
      "a": "Restart the whole computer",
      "b": "Print immediately",
      "c": "Delete Paint",
      "d": "Use Undo and try again"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 43,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "What should you do if an image becomes too small after resizing?",
    "options": {
      "a": "Add more stamps",
      "b": "Change the keyboard",
      "c": "Close without saving",
      "d": "Use Undo and resize more carefully"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 44,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "What is the main rule for beginner editing?",
    "options": {
      "a": "Look first, edit second, save carefully",
      "b": "Edit randomly",
      "c": "Print before checking",
      "d": "Never use Undo"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 45,
    "section": "Paint Editing Skills",
    "lessonReference": "Lesson 3",
    "question": "Which editing tool helps correct a sideways picture?",
    "options": {
      "a": "Text",
      "b": "Fill",
      "c": "Rotate",
      "d": "Brush"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 46,
    "section": "Pen or Stylus",
    "lessonReference": "Lesson 4",
    "question": "What is a stylus?",
    "options": {
      "a": "A type of printer",
      "b": "A pen-like input device for supported screens or tablets",
      "c": "A folder name",
      "d": "A spreadsheet formula"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 47,
    "section": "Pen or Stylus",
    "lessonReference": "Lesson 4",
    "question": "Why is the stylus lesson optional?",
    "options": {
      "a": "A stylus replaces the keyboard",
      "b": "A stylus only works on paper",
      "c": "Not every device supports a stylus",
      "d": "Every learner must buy one"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 48,
    "section": "Pen or Stylus",
    "lessonReference": "Lesson 4",
    "question": "What can a stylus help with?",
    "options": {
      "a": "Creating an email account automatically",
      "b": "Cooking food",
      "c": "Printing money",
      "d": "Drawing, handwriting, circling, and marking"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 49,
    "section": "Pen or Stylus",
    "lessonReference": "Lesson 4",
    "question": "Which input device is still important even if you use a stylus?",
    "options": {
      "a": "Printer cartridge",
      "b": "Power plug",
      "c": "Mouse",
      "d": "Speaker"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 50,
    "section": "Pen or Stylus",
    "lessonReference": "Lesson 4",
    "question": "What is tapping with a stylus similar to?",
    "options": {
      "a": "Printing a file",
      "b": "Typing paragraphs",
      "c": "Resizing the monitor",
      "d": "Clicking with a mouse"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 51,
    "section": "Pen or Stylus",
    "lessonReference": "Lesson 4",
    "question": "What does dragging with a stylus allow you to do?",
    "options": {
      "a": "Format Excel cells",
      "b": "Draw or move across the screen",
      "c": "Change the internet speed",
      "d": "Open the printer tray"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 52,
    "section": "Pen or Stylus",
    "lessonReference": "Lesson 4",
    "question": "What should you do if your stylus does not work?",
    "options": {
      "a": "Stop the course permanently",
      "b": "Use the mouse and continue",
      "c": "Delete the drawing app",
      "d": "Turn off the screen"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 53,
    "section": "Pen or Stylus",
    "lessonReference": "Lesson 4",
    "question": "When is a stylus especially useful?",
    "options": {
      "a": "For replacing the keyboard completely",
      "b": "For printing without paper",
      "c": "For freehand drawing or handwriting",
      "d": "For installing Windows"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 54,
    "section": "Pen or Stylus",
    "lessonReference": "Lesson 4",
    "question": "What is a good beginner stylus habit?",
    "options": {
      "a": "Click randomly",
      "b": "Press as hard as possible",
      "c": "Never save work",
      "d": "Move slowly and watch the canvas"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 55,
    "section": "Pen or Stylus",
    "lessonReference": "Lesson 4",
    "question": "What should you use if typed words need to be neat?",
    "options": {
      "a": "Random handwriting only",
      "b": "Text tool",
      "c": "Eraser only",
      "d": "Rotate"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 56,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "What is Tux Paint?",
    "options": {
      "a": "A web browser",
      "b": "A spreadsheet program",
      "c": "A beginner-friendly drawing program for children",
      "d": "An email service"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 57,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "Why is Tux Paint useful in this module?",
    "options": {
      "a": "It teaches advanced coding",
      "b": "It provides a simple drawing space for beginners",
      "c": "It replaces all Windows tools",
      "d": "It only works with printers"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 58,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "What does Tux Paint give learners to draw on?",
    "options": {
      "a": "A calendar",
      "b": "A blank canvas",
      "c": "A spreadsheet grid",
      "d": "An email inbox"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 59,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "What helps guide learners in Tux Paint?",
    "options": {
      "a": "A bank account",
      "b": "A friendly mascot and feedback",
      "c": "A printer cable",
      "d": "A spreadsheet formula"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 60,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "Which Windows versions can Tux Paint run on?",
    "options": {
      "a": "Only Windows Server",
      "b": "Only Windows 95",
      "c": "Windows 8, Windows 10, and Windows 11",
      "d": "Only mobile phones"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 61,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "What input device is enough for beginner use in Tux Paint?",
    "options": {
      "a": "A scanner only",
      "b": "A mouse or pointing device",
      "c": "A microphone only",
      "d": "A projector only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 62,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "Why is a keyboard useful in Tux Paint?",
    "options": {
      "a": "For washing the screen",
      "b": "For printing colours",
      "c": "For typing text and labels",
      "d": "For drawing without tools"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 63,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "Where should Tux Paint be downloaded from when needed?",
    "options": {
      "a": "Unknown download sites",
      "b": "Any random pop-up",
      "c": "The official Tux Paint website",
      "d": "A printer menu"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 64,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "Why should you understand the Tux Paint screen before clicking tools?",
    "options": {
      "a": "So you can avoid drawing",
      "b": "So you know where the canvas, tools, colours, and help area are",
      "c": "So you can delete the app",
      "d": "So you can change the operating system"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 65,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "What is one advantage of Tux Paint’s simple interface?",
    "options": {
      "a": "It reduces confusion for beginners",
      "b": "It hides all tools",
      "c": "It blocks drawing",
      "d": "It removes colours"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 66,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "What does saving do in Tux Paint or Paint?",
    "options": {
      "a": "Turns it into a song",
      "b": "Deletes your drawing",
      "c": "Changes the keyboard",
      "d": "Keeps your drawing"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 67,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "What does opening saved work do?",
    "options": {
      "a": "Removes the canvas",
      "b": "Brings back a saved drawing",
      "c": "Closes the computer",
      "d": "Prints all files"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 68,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "Why should learners not use random download websites?",
    "options": {
      "a": "They automatically save drawings",
      "b": "They replace the mouse",
      "c": "They may not be safe or trusted",
      "d": "They always improve learning"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 69,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "What should you check before beginning a Tux Paint activity?",
    "options": {
      "a": "That all files are deleted",
      "b": "That Excel is open",
      "c": "That the program, mouse, keyboard, and screen are ready",
      "d": "That the printer is full of stickers"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 70,
    "section": "Tux Paint Introduction",
    "lessonReference": "Lesson 5",
    "question": "What is the main focus of Lesson 5?",
    "options": {
      "a": "Advanced animation",
      "b": "Introduction and setup before using Tux Paint tools",
      "c": "Complex photo editing",
      "d": "Professional design theory"
    },
    "correctAnswer": "b"
  }
]`;

const set2JSON = `[
  {
    "questionNumber": 71,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What is the toolbar used for in Tux Paint?",
    "options": {
      "a": "Storing printer paper",
      "b": "Changing the monitor",
      "c": "Choosing tools and commands",
      "d": "Writing file passwords"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 72,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What is the canvas used for?",
    "options": {
      "a": "Adjusting speakers",
      "b": "Creating and viewing the drawing",
      "c": "Opening email",
      "d": "Setting the time"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 73,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does the selector show?",
    "options": {
      "a": "Printer history",
      "b": "The computer’s battery only",
      "c": "Deleted files",
      "d": "Options for the selected tool"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 74,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does the colour area allow you to do?",
    "options": {
      "a": "Change the mouse battery",
      "b": "Choose colours for supported tools",
      "c": "Open folders",
      "d": "Start Windows"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 75,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does the help area provide?",
    "options": {
      "a": "Computer hardware",
      "b": "Tips, hints, and information",
      "c": "Internet passwords",
      "d": "Printer ink"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 76,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "Which tool is used for freehand drawing in Tux Paint?",
    "options": {
      "a": "Save tool",
      "b": "Paint tool",
      "c": "Open tool",
      "d": "Print tool"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 77,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does the Stamp tool do?",
    "options": {
      "a": "Creates a spreadsheet",
      "b": "Deletes the whole program",
      "c": "Places ready-made pictures into a drawing",
      "d": "Changes the keyboard"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 78,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "Why are stamps useful for beginners?",
    "options": {
      "a": "They remove colours",
      "b": "They replace saving",
      "c": "They stop creativity",
      "d": "They help create scenes without drawing everything by hand"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 79,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What tool should you use for a straight road?",
    "options": {
      "a": "Save command",
      "b": "Lines tool",
      "c": "Text tool",
      "d": "Open command"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 80,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does the Shapes tool create?",
    "options": {
      "a": "Internet tabs",
      "b": "Email replies",
      "c": "Simple neat forms",
      "d": "Printer settings"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 81,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What can shapes help you build?",
    "options": {
      "a": "Houses, signs, windows, and posters",
      "b": "Passwords only",
      "c": "Email folders",
      "d": "Sound files"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 82,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "Which tool adds words to a drawing?",
    "options": {
      "a": "Eraser only",
      "b": "Open",
      "c": "Text or Label",
      "d": "Quit"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 83,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What should text in a drawing be?",
    "options": {
      "a": "Hidden and tiny",
      "b": "Clear and readable",
      "c": "Upside down always",
      "d": "Random and unreadable"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 84,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What is the Fill tool used for?",
    "options": {
      "a": "Opening a program",
      "b": "Colouring an area",
      "c": "Sending emails",
      "d": "Changing file names"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 85,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What may happen if you fill an open area?",
    "options": {
      "a": "Colour may spread too far",
      "b": "The keyboard deletes letters",
      "c": "The screen turns off",
      "d": "The program becomes Excel"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 86,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does the Magic tool add?",
    "options": {
      "a": "Email contacts",
      "b": "Special effects",
      "c": "Printer paper",
      "d": "Folder passwords"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 87,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "How should Magic be used at beginner level?",
    "options": {
      "a": "Instead of saving",
      "b": "Only to delete work",
      "c": "Lightly and with purpose",
      "d": "On every part of every drawing"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 88,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does the Eraser do?",
    "options": {
      "a": "Opens a website",
      "b": "Saves the drawing",
      "c": "Removes parts of a drawing",
      "d": "Prints the image"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 89,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does Undo do?",
    "options": {
      "a": "Opens a new app",
      "b": "Deletes Windows",
      "c": "Prints a copy",
      "d": "Reverses the last action"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 90,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does Redo do?",
    "options": {
      "a": "Deletes all work",
      "b": "Opens email",
      "c": "Brings back an action that was undone",
      "d": "Changes the screen colour"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 91,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does New do?",
    "options": {
      "a": "Starts a new drawing",
      "b": "Sends a message",
      "c": "Deletes the keyboard",
      "d": "Makes a printer louder"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 92,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does Open do?",
    "options": {
      "a": "Adds a stamp automatically",
      "b": "Turns off the screen",
      "c": "Opens a saved drawing",
      "d": "Changes the mouse"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 93,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does Save do?",
    "options": {
      "a": "Opens a browser",
      "b": "Keeps your drawing",
      "c": "Removes all colours",
      "d": "Prints without permission"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 94,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What does Print do?",
    "options": {
      "a": "Adds colour",
      "b": "Opens a new brush",
      "c": "Saves the drawing only",
      "d": "Sends the drawing to a printer"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 95,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "When should you print in a classroom?",
    "options": {
      "a": "Only when allowed or needed",
      "b": "Every time you click",
      "c": "Before the picture is finished",
      "d": "Without permission"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 96,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What is the Slides feature useful for?",
    "options": {
      "a": "Deleting drawings",
      "b": "Showing saved drawings in order",
      "c": "Changing keyboard size",
      "d": "Typing labels"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 97,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "What is the main rule for using Tux Paint tools?",
    "options": {
      "a": "Never save",
      "b": "Use every tool at once",
      "c": "Choose the tool that matches the job",
      "d": "Always print first"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 98,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "If you want to draw freely, what should you use?",
    "options": {
      "a": "Print",
      "b": "Quit",
      "c": "Open",
      "d": "Paint tool"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 99,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "If you want to place an animal picture, what should you use?",
    "options": {
      "a": "Eraser only",
      "b": "Line tool",
      "c": "Stamp tool",
      "d": "Save command"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 100,
    "section": "Tux Paint Tools Overview",
    "lessonReference": "Lesson 6",
    "question": "If you want to write “My Picture,” what should you use?",
    "options": {
      "a": "Text or Label",
      "b": "Fill",
      "c": "Stamp only",
      "d": "Open"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 101,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is the purpose of colouring practice?",
    "options": {
      "a": "To install software",
      "b": "To create an email",
      "c": "To practise Fill, colour choice, and control",
      "d": "To delete drawings"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 102,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "Which tool is very important in colouring practice?",
    "options": {
      "a": "Quit",
      "b": "Open only",
      "c": "Print only",
      "d": "Fill"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 103,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What does a shapes and labels activity practise?",
    "options": {
      "a": "Sending emails",
      "b": "Building objects and explaining them with words",
      "c": "Changing settings",
      "d": "Installing printers"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 104,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "Which tools are useful for shapes and labels?",
    "options": {
      "a": "Shapes and Text or Label",
      "b": "Email and Calendar",
      "c": "Print and Quit",
      "d": "Open and Close"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 105,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is the purpose of a poster design activity?",
    "options": {
      "a": "To hide information",
      "b": "To use no text",
      "c": "To delete colours",
      "d": "To communicate a clear message visually"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 106,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What should a simple poster include?",
    "options": {
      "a": "A clear title, message, picture, and useful colours",
      "b": "Only random effects",
      "c": "No words",
      "d": "Only a blank canvas"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 107,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is the most important poster rule?",
    "options": {
      "a": "Decoration first, message hidden",
      "b": "Use every colour",
      "c": "Big message first, decoration second",
      "d": "Never save"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 108,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is a “My Community” drawing about?",
    "options": {
      "a": "Deleting local files",
      "b": "Formatting a spreadsheet",
      "c": "Respectfully showing places and life in a community",
      "d": "Creating an email account"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 109,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "Why should a community drawing be respectful?",
    "options": {
      "a": "It must show only buildings",
      "b": "It should embarrass people",
      "c": "It should hide all labels",
      "d": "It may represent real places and lived experiences"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 110,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "Which item could be included in a community drawing?",
    "options": {
      "a": "Inbox rule",
      "b": "School",
      "c": "Formula bar",
      "d": "Printer driver"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 111,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is a digital greeting card used for?",
    "options": {
      "a": "Opening Excel",
      "b": "Sorting files",
      "c": "Checking antivirus",
      "d": "Sending or showing a short positive message"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 112,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "Which message fits a greeting card?",
    "options": {
      "a": "Delete System",
      "b": "Cell A1",
      "c": "Happy Birthday",
      "d": "Printer Error"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 113,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What should a greeting card include?",
    "options": {
      "a": "A greeting, decoration, colour, and saved final version",
      "b": "Only blank space",
      "c": "No text",
      "d": "A spreadsheet table"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 114,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is a pattern?",
    "options": {
      "a": "A deleted file",
      "b": "A design that repeats",
      "c": "A printer cable",
      "d": "A password"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 115,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "Which tools can help make a pattern?",
    "options": {
      "a": "Calendar only",
      "b": "Start menu only",
      "c": "Shapes, stamps, colours, or simple effects",
      "d": "Email only"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 116,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is a story picture?",
    "options": {
      "a": "A spreadsheet chart",
      "b": "A folder backup",
      "c": "A drawing that shows an event or moment",
      "d": "A keyboard shortcut"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 117,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "Which topic fits a story picture?",
    "options": {
      "a": "Printer settings only",
      "b": "A trip to school",
      "c": "File extensions",
      "d": "Email spam"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 118,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What does a classroom rules poster teach?",
    "options": {
      "a": "Hardware repair",
      "b": "Bank accounting",
      "c": "Good computer-room behaviour",
      "d": "Advanced coding"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 119,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "Which rule belongs on a computer-room poster?",
    "options": {
      "a": "Eat over the keyboard",
      "b": "Delete other learners’ work",
      "c": "Save your work",
      "d": "Print without asking"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 120,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is a name design activity about?",
    "options": {
      "a": "Creating a spreadsheet",
      "b": "Designing your name clearly and creatively",
      "c": "Installing drivers",
      "d": "Formatting a hard drive"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 121,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What should stand out in a name design?",
    "options": {
      "a": "The printer queue",
      "b": "The learner’s name",
      "c": "The keyboard brand",
      "d": "The file path"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 122,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is a Before and After Drawing activity used for?",
    "options": {
      "a": "Showing improvement between two versions",
      "b": "Deleting both drawings",
      "c": "Avoiding saving",
      "d": "Printing blank pages"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 123,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What should you do before improving the first drawing?",
    "options": {
      "a": "Delete it",
      "b": "Save the first version",
      "c": "Print it ten times",
      "d": "Close without saving"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 124,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is the final Module 6 project called in the lesson?",
    "options": {
      "a": "My Web Browser",
      "b": "My Email Inbox",
      "c": "My Digital Artwork",
      "d": "My Spreadsheet Budget"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 125,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What should the final project include?",
    "options": {
      "a": "Only a blank page",
      "b": "Freehand part, shape, filled area, text or label, and saved version",
      "c": "Only random stamps",
      "d": "Only the Print command"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 126,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "How should beginner projects be assessed?",
    "options": {
      "a": "Professional art quality only",
      "b": "Number of mistakes only",
      "c": "Speed only",
      "d": "Tool use, completion, clarity, and reflection"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 127,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is reflection in a project?",
    "options": {
      "a": "Closing the program quickly",
      "b": "Printing without checking",
      "c": "Explaining what you made and which tools you used",
      "d": "Deleting the project"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 128,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What should you do if your project becomes messy?",
    "options": {
      "a": "Add more random effects",
      "b": "Stop, look, simplify, undo or erase if needed",
      "c": "Delete another learner’s work",
      "d": "Print immediately"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 129,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What should you do if you finish too quickly?",
    "options": {
      "a": "Improve the drawing with a title, border, label, or colour",
      "b": "Close without saving",
      "c": "Use no tools",
      "d": "Delete the canvas"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 130,
    "section": "Classroom Activities",
    "lessonReference": "Lesson 7",
    "question": "What is the goal of classroom practice projects?",
    "options": {
      "a": "To teach advanced animation",
      "b": "To avoid drawing",
      "c": "To use beginner tools in meaningful creative tasks",
      "d": "To replace all lessons"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 131,
    "section": "Mixed Review",
    "lessonReference": "Review",
    "question": "Which program is especially child-friendly?",
    "options": {
      "a": "Microsoft Excel",
      "b": "File Explorer",
      "c": "Tux Paint",
      "d": "Outlook"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 132,
    "section": "Mixed Review",
    "lessonReference": "Review",
    "question": "Which program is a simple Windows drawing app?",
    "options": {
      "a": "Calculator",
      "b": "Task Manager",
      "c": "Outlook Calendar",
      "d": "Paint"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 133,
    "section": "Mixed Review",
    "lessonReference": "Review",
    "question": "Which tool is useful for freehand drawing in Paint?",
    "options": {
      "a": "Print",
      "b": "Brush",
      "c": "File Explorer",
      "d": "Save As"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 134,
    "section": "Mixed Review",
    "lessonReference": "Review",
    "question": "Which Paint tool reuses an existing colour?",
    "options": {
      "a": "Rotate",
      "b": "Crop",
      "c": "Color Picker",
      "d": "Open"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 135,
    "section": "Mixed Review",
    "lessonReference": "Review",
    "question": "Which Paint tool adds colour to an area?",
    "options": {
      "a": "Text",
      "b": "Resize",
      "c": "Flip",
      "d": "Fill"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 136,
    "section": "Mixed Review",
    "lessonReference": "Review",
    "question": "Which Paint action removes extra image space?",
    "options": {
      "a": "Open",
      "b": "Save",
      "c": "Crop",
      "d": "Text"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 137,
    "section": "Mixed Review",
    "lessonReference": "Review",
    "question": "Which action changes the size of an image?",
    "options": {
      "a": "Rotate",
      "b": "Resize",
      "c": "Brush",
      "d": "Fill"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 138,
    "section": "Mixed Review",
    "lessonReference": "Review",
    "question": "Which action turns an image?",
    "options": {
      "a": "Stamp",
      "b": "Text",
      "c": "Save",
      "d": "Rotate"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 139,
    "section": "Mixed Review",
    "lessonReference": "Review",
    "question": "Which action mirrors an image?",
    "options": {
      "a": "Crop",
      "b": "Flip",
      "c": "Text",
      "d": "Fill"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 140,
    "section": "Mixed Review",
    "lessonReference": "Review",
    "question": "Which command protects an original image by saving a new version?",
    "options": {
      "a": "Delete",
      "b": "Quit",
      "c": "Print",
      "d": "Save As"
    },
    "correctAnswer": "d"
  }
]`;

const set3JSON = `[
  {
    "questionNumber": 141,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to draw grass freely. Which tool should you use?",
    "options": {
      "a": "Open",
      "b": "Paint or Brush",
      "c": "Print",
      "d": "Quit"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 142,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to place a ready-made flower. Which tool should you use?",
    "options": {
      "a": "Save",
      "b": "Resize",
      "c": "Stamp",
      "d": "Eraser"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 143,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want a straight fence line. Which tool should you use?",
    "options": {
      "a": "Open",
      "b": "Print",
      "c": "Magic",
      "d": "Lines"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 144,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want a neat square sign. Which tool should you use?",
    "options": {
      "a": "Save only",
      "b": "Shapes",
      "c": "Brush only",
      "d": "Slides"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 145,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to colour inside the sign. Which tool should you use?",
    "options": {
      "a": "Fill",
      "b": "Undo",
      "c": "Print",
      "d": "Open"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 146,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to add the words “Welcome.” Which tool should you use?",
    "options": {
      "a": "Rotate",
      "b": "Eraser only",
      "c": "Text or Label",
      "d": "Fill"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 147,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You made a mistake. What should you try first?",
    "options": {
      "a": "New",
      "b": "Print",
      "c": "Quit",
      "d": "Undo"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 148,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to remove a small unwanted mark. Which tool may help?",
    "options": {
      "a": "Save",
      "b": "Eraser",
      "c": "Open",
      "d": "Stamp only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 149,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to keep your drawing. Which command should you use?",
    "options": {
      "a": "Magic",
      "b": "Fill",
      "c": "Save",
      "d": "Quit"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 150,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want a paper copy and have permission. Which command should you use?",
    "options": {
      "a": "Fill",
      "b": "Print",
      "c": "Open",
      "d": "Stamp"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 151,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to begin a new drawing. Which command should you use?",
    "options": {
      "a": "Text",
      "b": "New",
      "c": "Save",
      "d": "Eraser"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 152,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to return to a saved drawing. Which command should you use?",
    "options": {
      "a": "Brush",
      "b": "Print",
      "c": "Fill",
      "d": "Open"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 153,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to show saved drawings in order. Which feature can help?",
    "options": {
      "a": "Text only",
      "b": "Fill only",
      "c": "Slides",
      "d": "Eraser"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 154,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want your poster message to be clear. What should come first?",
    "options": {
      "a": "Hidden text",
      "b": "Too many effects",
      "c": "Random decoration",
      "d": "The main message"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 155,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to create a respectful local scene. Which project fits best?",
    "options": {
      "a": "My Community Drawing",
      "b": "Resize Practice Only",
      "c": "Email Sorting",
      "d": "Printer Setup"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 156,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to practise repetition. Which project fits best?",
    "options": {
      "a": "File Password",
      "b": "Pattern Practice",
      "c": "Crop Practice Only",
      "d": "Typing Test"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 157,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to make a thank-you message. Which project fits best?",
    "options": {
      "a": "Keyboard Cleaning",
      "b": "Mouse Settings",
      "c": "Digital Greeting Card",
      "d": "Spreadsheet Chart"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 158,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to show improvement from first version to better version. Which project fits best?",
    "options": {
      "a": "Email Reply",
      "b": "Before and After Drawing",
      "c": "Web Search",
      "d": "Print Settings"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 159,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want to combine several beginner tools in one final task. Which project fits best?",
    "options": {
      "a": "Save Only",
      "b": "Print Only",
      "c": "Open Only",
      "d": "My Digital Artwork"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 160,
    "section": "Applied Tool Choice",
    "lessonReference": "Applied Practice",
    "question": "You want your name to be the main focus. Which project fits best?",
    "options": {
      "a": "My Spreadsheet Formula",
      "b": "My Email Folder",
      "c": "My Name Design",
      "d": "My File Extension"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 161,
    "section": "Beginner Understanding",
    "lessonReference": "Core Principles",
    "question": "Why should you avoid random clicking?",
    "options": {
      "a": "It saves automatically",
      "b": "It causes confusion and weak tool control",
      "c": "It makes text clearer",
      "d": "It always improves drawings"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 162,
    "section": "Beginner Understanding",
    "lessonReference": "Core Principles",
    "question": "What should you do before using a tool?",
    "options": {
      "a": "Print the canvas",
      "b": "Close the app",
      "c": "Decide what you want to do",
      "d": "Delete your drawing"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 163,
    "section": "Beginner Understanding",
    "lessonReference": "Core Principles",
    "question": "What should you do after using a tool?",
    "options": {
      "a": "Turn off the monitor",
      "b": "Change the password",
      "c": "Ignore the drawing",
      "d": "Check the result on the canvas"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 164,
    "section": "Beginner Understanding",
    "lessonReference": "Core Principles",
    "question": "Why should you use Magic effects carefully?",
    "options": {
      "a": "They remove all tools",
      "b": "Too many effects can make the drawing confusing",
      "c": "They always break the computer",
      "d": "They cannot be undone"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 165,
    "section": "Beginner Understanding",
    "lessonReference": "Core Principles",
    "question": "Why is readable text important?",
    "options": {
      "a": "It prevents saving",
      "b": "It deletes shapes",
      "c": "It helps the viewer understand the message",
      "d": "It hides the picture"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 166,
    "section": "Beginner Understanding",
    "lessonReference": "Core Principles",
    "question": "Why are shapes useful in beginner drawing?",
    "options": {
      "a": "They help create neat structure",
      "b": "They stop learners from drawing",
      "c": "They remove colour",
      "d": "They replace all tools"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 167,
    "section": "Beginner Understanding",
    "lessonReference": "Core Principles",
    "question": "Why is the Fill tool useful?",
    "options": {
      "a": "It changes folder names",
      "b": "It opens files",
      "c": "It colours areas quickly",
      "d": "It prints images"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 168,
    "section": "Beginner Understanding",
    "lessonReference": "Core Principles",
    "question": "What does a closed shape help Fill do?",
    "options": {
      "a": "Add a password",
      "b": "Open the internet",
      "c": "Delete the drawing",
      "d": "Keep colour inside the area"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 169,
    "section": "Beginner Understanding",
    "lessonReference": "Core Principles",
    "question": "Why should you save during projects?",
    "options": {
      "a": "To make the drawing disappear",
      "b": "To avoid losing work",
      "c": "To stop the mouse",
      "d": "To remove colours"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 170,
    "section": "Beginner Understanding",
    "lessonReference": "Core Principles",
    "question": "What does reflection help you do?",
    "options": {
      "a": "Print without permission",
      "b": "Understand what tools you used and why",
      "c": "Avoid learning",
      "d": "Delete mistakes permanently"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 171,
    "section": "Paint and Tux Paint Comparison",
    "lessonReference": "Comparison",
    "question": "Which program gives a standard Windows drawing experience?",
    "options": {
      "a": "Outlook",
      "b": "Paint",
      "c": "Tux Typing",
      "d": "Excel"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 172,
    "section": "Paint and Tux Paint Comparison",
    "lessonReference": "Comparison",
    "question": "Which program is especially designed for young beginner drawing?",
    "options": {
      "a": "Word",
      "b": "PowerPoint",
      "c": "Tux Paint",
      "d": "File Explorer"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 173,
    "section": "Paint and Tux Paint Comparison",
    "lessonReference": "Comparison",
    "question": "Which program uses a child-friendly drawing environment with a mascot?",
    "options": {
      "a": "Notepad only",
      "b": "Paint only",
      "c": "Calculator",
      "d": "Tux Paint"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 174,
    "section": "Paint and Tux Paint Comparison",
    "lessonReference": "Comparison",
    "question": "Which program is suitable for basic Windows image editing such as crop and resize?",
    "options": {
      "a": "Tux Paint only",
      "b": "Email",
      "c": "Paint",
      "d": "Calendar"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 175,
    "section": "Paint and Tux Paint Comparison",
    "lessonReference": "Comparison",
    "question": "Which tool appears in both beginner drawing environments as a concept?",
    "options": {
      "a": "Browser tab",
      "b": "Drawing or painting tool",
      "c": "Spreadsheet formula",
      "d": "Email inbox"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 176,
    "section": "Paint and Tux Paint Comparison",
    "lessonReference": "Comparison",
    "question": "Which skill is practised in both Paint and Tux Paint?",
    "options": {
      "a": "Website hosting",
      "b": "Advanced coding",
      "c": "Mouse control",
      "d": "Bank transactions"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 177,
    "section": "Paint and Tux Paint Comparison",
    "lessonReference": "Comparison",
    "question": "Which action is important in both Paint and Tux Paint?",
    "options": {
      "a": "Saving work",
      "b": "Deleting all files",
      "c": "Installing printers",
      "d": "Changing hardware"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 178,
    "section": "Paint and Tux Paint Comparison",
    "lessonReference": "Comparison",
    "question": "Which activity can be done in either Paint or Tux Paint?",
    "options": {
      "a": "Spreadsheet filtering",
      "b": "Poster design",
      "c": "Calendar scheduling",
      "d": "Email forwarding"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 179,
    "section": "Paint and Tux Paint Comparison",
    "lessonReference": "Comparison",
    "question": "Which program is better for guided child-friendly exploration?",
    "options": {
      "a": "Registry Editor",
      "b": "Task Manager",
      "c": "Command Prompt only",
      "d": "Tux Paint"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 180,
    "section": "Paint and Tux Paint Comparison",
    "lessonReference": "Comparison",
    "question": "Which program is better for simple Windows-based drawing and basic image edits?",
    "options": {
      "a": "Outlook",
      "b": "Excel",
      "c": "Paint",
      "d": "Calculator"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 181,
    "section": "Project Scenarios",
    "lessonReference": "Project Work",
    "question": "A learner wants to make a “Save Water” poster. What should the poster include?",
    "options": {
      "a": "Only random decorations",
      "b": "A clear title, short message, useful picture, and colour",
      "c": "No words",
      "d": "Only a blank page"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 182,
    "section": "Project Scenarios",
    "lessonReference": "Project Work",
    "question": "A learner wants to draw a classroom and label parts. Which tools are useful?",
    "options": {
      "a": "Print only",
      "b": "Open only",
      "c": "Shapes and Text or Label",
      "d": "Quit only"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 183,
    "section": "Project Scenarios",
    "lessonReference": "Project Work",
    "question": "A learner wants to colour a flower outline. Which tool is most useful?",
    "options": {
      "a": "Flip",
      "b": "Print",
      "c": "Resize",
      "d": "Fill"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 184,
    "section": "Project Scenarios",
    "lessonReference": "Project Work",
    "question": "A learner wants to place a ready-made animal in Tux Paint. Which tool is best?",
    "options": {
      "a": "Save As only",
      "b": "Crop",
      "c": "Stamp",
      "d": "Layout"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 185,
    "section": "Project Scenarios",
    "lessonReference": "Project Work",
    "question": "A learner wants to write “My Garden” at the top of a picture. Which tool is best?",
    "options": {
      "a": "Text or Label",
      "b": "Open only",
      "c": "Eraser",
      "d": "Rotate"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 186,
    "section": "Project Scenarios",
    "lessonReference": "Project Work",
    "question": "A learner wants to correct a small extra line. Which tool is useful?",
    "options": {
      "a": "Eraser or Undo",
      "b": "Print",
      "c": "New",
      "d": "Open"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 187,
    "section": "Project Scenarios",
    "lessonReference": "Project Work",
    "question": "A learner wants to create a border around a card. Which tool could help?",
    "options": {
      "a": "Browser",
      "b": "Lines or Shapes",
      "c": "Folder",
      "d": "Email"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 188,
    "section": "Project Scenarios",
    "lessonReference": "Project Work",
    "question": "A learner wants to create a community picture. Which topic is suitable?",
    "options": {
      "a": "Formula sheet",
      "b": "Password list",
      "c": "Printer driver",
      "d": "School, road, clinic, homes, and trees"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 189,
    "section": "Project Scenarios",
    "lessonReference": "Project Work",
    "question": "A learner wants to improve a first drawing. What should be done first?",
    "options": {
      "a": "Print without checking",
      "b": "Delete it immediately",
      "c": "Save the first version",
      "d": "Close the app"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 190,
    "section": "Project Scenarios",
    "lessonReference": "Project Work",
    "question": "A learner wants to explain the drawing after finishing. What should they mention?",
    "options": {
      "a": "The computer serial number",
      "b": "The tools used and why",
      "c": "The internet speed",
      "d": "The printer brand only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 191,
    "section": "Safety, Respect, and Good Habits",
    "lessonReference": "Digital Citizenship & Safety",
    "question": "Why should you ask before printing in a classroom?",
    "options": {
      "a": "Printing uses paper and ink",
      "b": "Printing improves every drawing automatically",
      "c": "Printing replaces saving",
      "d": "Printing deletes the picture"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 192,
    "section": "Safety, Respect, and Good Habits",
    "lessonReference": "Digital Citizenship & Safety",
    "question": "What should you avoid in a community drawing?",
    "options": {
      "a": "Labels",
      "b": "Roads",
      "c": "Disrespectful or embarrassing representations",
      "d": "Trees"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 193,
    "section": "Safety, Respect, and Good Habits",
    "lessonReference": "Digital Citizenship & Safety",
    "question": "What should you do if the text is hard to read?",
    "options": {
      "a": "Print immediately",
      "b": "Delete the whole computer",
      "c": "Change size, colour, or placement",
      "d": "Leave it hidden"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 194,
    "section": "Safety, Respect, and Good Habits",
    "lessonReference": "Digital Citizenship & Safety",
    "question": "What should you do if too many colours make the picture confusing?",
    "options": {
      "a": "Close without saving",
      "b": "Simplify the colour choices",
      "c": "Add more random colours",
      "d": "Remove all tools"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 195,
    "section": "Safety, Respect, and Good Habits",
    "lessonReference": "Digital Citizenship & Safety",
    "question": "What should you do if you used too many stamps?",
    "options": {
      "a": "Print ten copies",
      "b": "Add more stamps",
      "c": "Delete another learner’s work",
      "d": "Remove or undo some and keep the scene clear"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 196,
    "section": "Safety, Respect, and Good Habits",
    "lessonReference": "Digital Citizenship & Safety",
    "question": "Why should effects not hide the main message?",
    "options": {
      "a": "Text is not useful",
      "b": "The viewer must still understand the drawing",
      "c": "Effects must always cover everything",
      "d": "Saving is unnecessary"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 197,
    "section": "Safety, Respect, and Good Habits",
    "lessonReference": "Digital Citizenship & Safety",
    "question": "What is a good habit before closing a drawing program?",
    "options": {
      "a": "Remove the mouse",
      "b": "Turn off the keyboard",
      "c": "Save your work",
      "d": "Delete your work"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 198,
    "section": "Safety, Respect, and Good Habits",
    "lessonReference": "Digital Citizenship & Safety",
    "question": "What should you do if you are unsure which tool to use?",
    "options": {
      "a": "Close the program",
      "b": "Think about the task and choose the matching tool",
      "c": "Click randomly",
      "d": "Print the page"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 199,
    "section": "Safety, Respect, and Good Habits",
    "lessonReference": "Digital Citizenship & Safety",
    "question": "What is more important than perfect art in this beginner module?",
    "options": {
      "a": "Advanced effects",
      "b": "Professional design theory",
      "c": "Tool control, clarity, and confidence",
      "d": "Expensive equipment"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 200,
    "section": "Safety, Respect, and Good Habits",
    "lessonReference": "Digital Citizenship & Safety",
    "question": "What should you do if you do not have a stylus?",
    "options": {
      "a": "Delete Paint",
      "b": "Stop the module",
      "c": "Use the mouse and continue",
      "d": "Avoid drawing forever"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 201,
    "section": "Final Module Review",
    "lessonReference": "Comprehensive Review",
    "question": "What is the main purpose of digital drawing in this course?",
    "options": {
      "a": "To teach expert illustration only",
      "b": "To replace all writing",
      "c": "To build beginner computer confidence and control",
      "d": "To avoid saving files"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 202,
    "section": "Final Module Review",
    "lessonReference": "Comprehensive Review",
    "question": "What does the canvas represent?",
    "options": {
      "a": "The keyboard",
      "b": "The working area for the drawing",
      "c": "The internet",
      "d": "The printer cable"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 203,
    "section": "Final Module Review",
    "lessonReference": "Comprehensive Review",
    "question": "What is the best way to learn tools?",
    "options": {
      "a": "Use one tool at a time with purpose",
      "b": "Click every tool quickly",
      "c": "Avoid practice",
      "d": "Never check the result"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 204,
    "section": "Final Module Review",
    "lessonReference": "Comprehensive Review",
    "question": "Which command helps correct a recent mistake?",
    "options": {
      "a": "Print",
      "b": "Quit",
      "c": "Undo",
      "d": "Open"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 205,
    "section": "Final Module Review",
    "lessonReference": "Comprehensive Review",
    "question": "Which command keeps your work?",
    "options": {
      "a": "Erase",
      "b": "New only",
      "c": "Magic",
      "d": "Save"
    },
    "correctAnswer": "d"
  },
  {
    "questionNumber": 206,
    "section": "Final Module Review",
    "lessonReference": "Comprehensive Review",
    "question": "Which project best shows personal or local connection?",
    "options": {
      "a": "Email Setup",
      "b": "My Community Drawing",
      "c": "Resize Only",
      "d": "Printer Test"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 207,
    "section": "Final Module Review",
    "lessonReference": "Comprehensive Review",
    "question": "Which project best teaches public visual communication?",
    "options": {
      "a": "Keyboard Test",
      "b": "File Rename",
      "c": "Poster Design",
      "d": "Calendar Entry"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 208,
    "section": "Final Module Review",
    "lessonReference": "Comprehensive Review",
    "question": "Which project best teaches repetition?",
    "options": {
      "a": "Pattern Practice",
      "b": "Email Reply",
      "c": "System Update",
      "d": "File Deletion"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 209,
    "section": "Final Module Review",
    "lessonReference": "Comprehensive Review",
    "question": "What should every completed project have?",
    "options": {
      "a": "No tool use",
      "b": "A saved final version",
      "c": "No title",
      "d": "Only mistakes"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 210,
    "section": "Final Module Review",
    "lessonReference": "Comprehensive Review",
    "question": "What is the main rule for Module 6 projects?",
    "options": {
      "a": "Click randomly",
      "b": "Never save",
      "c": "Use advanced tools first",
      "d": "Use tools with purpose"
    },
    "correctAnswer": "d"
  }
]`;

async function seedModule6Questions() {
  try {
    const s1 = JSON.parse(set1JSON);
    const s2 = JSON.parse(set2JSON);
    const s3 = JSON.parse(set3JSON);

    let module = await Module.findOne({ order: 6 });
    if (!module) {
      module = await Module.findOne({ title: /Drawing|Paint|Module 6/i });
    }
    if (!module) {
      module = await Module.create({
        _id: '6a8452f685e0de577163a431',
        title: 'Module 6: Drawing',
        description: 'Drawing with Windows Paint & Tux Paint',
        order: 6
      });
    }

    console.log(`Found module: ${module.title} (${module._id})`);

    await AssignmentQuestion.deleteMany({ moduleId: module._id });
    console.log('Cleared existing questions for Module 6');

    const allQuestions = [...s1, ...s2, ...s3].map(q => ({
      ...q,
      moduleId: module._id
    }));

    await AssignmentQuestion.insertMany(allQuestions);
    console.log(`✅ Successfully seeded ${allQuestions.length} questions into PostgreSQL for Module 6`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedModule6Questions();
}

module.exports = { seedModule6Questions };
