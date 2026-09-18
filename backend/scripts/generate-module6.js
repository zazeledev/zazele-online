const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const moduleId = '6a8452f685e0de577163a431';

const rawQuestions = [
  // --- SET 1: Questions 1-70 ---
  // Lesson 1: Why Digital Drawing Matters (1-10)
  {
    num: 1,
    section: 'Why Digital Drawing Matters',
    lesson: 'Lesson 1',
    q: 'What is digital drawing?',
    options: {
      a: 'Typing numbers into Excel',
      b: 'Creating pictures or designs using a computer or digital device',
      c: 'Printing documents from Microsoft Word',
      d: 'Writing only with a pencil on paper'
    },
    ans: 'b'
  },
  {
    num: 2,
    section: 'Why Digital Drawing Matters',
    lesson: 'Lesson 1',
    q: 'Why is digital drawing useful for beginners?',
    options: {
      a: 'It replaces all other computer skills',
      b: 'It only teaches professional art',
      c: 'It builds mouse control, confidence, creativity, and tool awareness',
      d: 'It helps learners avoid using the mouse'
    },
    ans: 'c'
  },
  {
    num: 3,
    section: 'Why Digital Drawing Matters',
    lesson: 'Lesson 1',
    q: 'What does the canvas mean in a drawing program?',
    options: {
      a: 'The computer keyboard',
      b: 'The printer tray',
      c: 'The place where the drawing appears',
      d: 'The file name box'
    },
    ans: 'c'
  },
  {
    num: 4,
    section: 'Why Digital Drawing Matters',
    lesson: 'Lesson 1',
    q: 'Which skill is practised when you click and drag to draw a line?',
    options: {
      a: 'Email forwarding',
      b: 'Spreadsheet sorting',
      c: 'Printing',
      d: 'Mouse control'
    },
    ans: 'd'
  },
  {
    num: 5,
    section: 'Why Digital Drawing Matters',
    lesson: 'Lesson 1',
    q: 'What should a beginner focus on first when learning digital drawing?',
    options: {
      a: 'Basic control and tool use',
      b: 'Advanced design',
      c: 'Selling artwork online',
      d: 'Professional photo editing'
    },
    ans: 'a'
  },
  {
    num: 6,
    section: 'Why Digital Drawing Matters',
    lesson: 'Lesson 1',
    q: 'Why does digital drawing build confidence?',
    options: {
      a: 'It removes the need to save work',
      b: 'Learners see results immediately on the screen',
      c: 'It only works for advanced users',
      d: 'Learners never make mistakes'
    },
    ans: 'b'
  },
  {
    num: 7,
    section: 'Why Digital Drawing Matters',
    lesson: 'Lesson 1',
    q: 'What does creativity mean in beginner digital drawing?',
    options: {
      a: 'Avoiding all mistakes',
      b: 'Copying only the trainer’s work',
      c: 'Using every tool at once',
      d: 'Making choices about tools, colours, shapes, and layout'
    },
    ans: 'd'
  },
  {
    num: 8,
    section: 'Why Digital Drawing Matters',
    lesson: 'Lesson 1',
    q: 'What should you do if you make a mistake while drawing?',
    options: {
      a: 'Delete the computer file immediately',
      b: 'Stop learning',
      c: 'Use Undo or correct it calmly',
      d: 'Panic and close the program'
    },
    ans: 'c'
  },
  {
    num: 9,
    section: 'Why Digital Drawing Matters',
    lesson: 'Lesson 1',
    q: 'Why is saving important in digital drawing?',
    options: {
      a: 'It prints the picture automatically',
      b: 'It changes the mouse settings',
      c: 'It keeps your work so you can open it later',
      d: 'It makes the drawing disappear'
    },
    ans: 'c'
  },
  {
    num: 10,
    section: 'Why Digital Drawing Matters',
    lesson: 'Lesson 1',
    q: 'What is the main purpose of Module 6?',
    options: {
      a: 'To teach only typing speed',
      b: 'To replace Microsoft Office lessons',
      c: 'To teach advanced graphic design',
      d: 'To build beginner confidence through drawing tools'
    },
    ans: 'd'
  },

  // Lesson 2: Paint Basics (11-30)
  {
    num: 11,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What is Windows Paint used for in this module?',
    options: {
      a: 'Sending emails',
      b: 'Simple drawing and image work',
      c: 'Writing computer code',
      d: 'Creating databases'
    },
    ans: 'b'
  },
  {
    num: 12,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'How can you usually open Paint in Windows?',
    options: {
      a: 'Press the monitor button',
      b: 'Open Excel first',
      c: 'Search for Paint from the Start menu',
      d: 'Open the printer cover'
    },
    ans: 'c'
  },
  {
    num: 13,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What is the pencil tool used for?',
    options: {
      a: 'Playing videos',
      b: 'Fine freehand marks',
      c: 'Printing images',
      d: 'Opening folders'
    },
    ans: 'b'
  },
  {
    num: 14,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What is the brush tool used for?',
    options: {
      a: 'Drawing broader or expressive strokes',
      b: 'Saving the computer',
      c: 'Changing the screen brightness',
      d: 'Typing text only'
    },
    ans: 'a'
  },
  {
    num: 15,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'Why is the brush useful for beginners?',
    options: {
      a: 'It prevents drawing',
      b: 'It deletes the canvas',
      c: 'It shows how tool style changes the result',
      d: 'It opens the internet'
    },
    ans: 'c'
  },
  {
    num: 16,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What are shapes useful for in Paint?',
    options: {
      a: 'Playing music',
      b: 'Creating neat forms such as rectangles and circles',
      c: 'Sending messages',
      d: 'Changing the computer language'
    },
    ans: 'b'
  },
  {
    num: 17,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What can a rectangle shape be used for?',
    options: {
      a: 'A folder password',
      b: 'A printer driver',
      c: 'A wall, door, sign, or window',
      d: 'An email attachment'
    },
    ans: 'c'
  },
  {
    num: 18,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What does the Fill tool do?',
    options: {
      a: 'Opens the Start menu',
      b: 'Types a paragraph',
      c: 'Deletes Paint',
      d: 'Adds colour to an area'
    },
    ans: 'd'
  },
  {
    num: 19,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What may happen if you use Fill in an open area?',
    options: {
      a: 'The keyboard stops working',
      b: 'The file becomes a spreadsheet',
      c: 'The colour may spread too far',
      d: 'The computer shuts down'
    },
    ans: 'c'
  },
  {
    num: 20,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What does the Text tool do?',
    options: {
      a: 'Changes the mouse pointer only',
      b: 'Opens the recycle bin',
      c: 'Adds words to a drawing',
      d: 'Erases the whole canvas'
    },
    ans: 'c'
  },
  {
    num: 21,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'Why must text be readable in a drawing?',
    options: {
      a: 'So colours disappear',
      b: 'So the message can be understood',
      c: 'So shapes become hidden',
      d: 'So the drawing cannot be saved'
    },
    ans: 'b'
  },
  {
    num: 22,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What does the Color Picker do?',
    options: {
      a: 'Opens a website',
      b: 'Deletes all text',
      c: 'Prints the image',
      d: 'Copies a colour already in the picture'
    },
    ans: 'd'
  },
  {
    num: 23,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'When should you use the Color Picker?',
    options: {
      a: 'When you want to close Paint',
      b: 'When you want to reuse an existing colour accurately',
      c: 'When you want to send an email',
      d: 'When you want to shut down the computer'
    },
    ans: 'b'
  },
  {
    num: 24,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What is a good file name for a Paint drawing?',
    options: {
      a: 'aaabbbccc',
      b: 'Untitled999',
      c: 'My_First_Paint_Drawing',
      d: 'NewNewNew'
    },
    ans: 'c'
  },
  {
    num: 25,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'Which file type is commonly used for images?',
    options: {
      a: 'DOCX',
      b: 'XLSX',
      c: 'PPTX',
      d: 'PNG'
    },
    ans: 'd'
  },
  {
    num: 26,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'Which tool would you use to add a title to a picture?',
    options: {
      a: 'Rotate',
      b: 'Text',
      c: 'Printer',
      d: 'Folder'
    },
    ans: 'b'
  },
  {
    num: 27,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'Which tool would you use to colour inside a closed shape?',
    options: {
      a: 'Open',
      b: 'Save As',
      c: 'Fill',
      d: 'Zoom only'
    },
    ans: 'c'
  },
  {
    num: 28,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'Which tool would you use to draw a freehand line?',
    options: {
      a: 'File Explorer',
      b: 'Pencil or Brush',
      c: 'Taskbar',
      d: 'Print'
    },
    ans: 'b'
  },
  {
    num: 29,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What should you do after every important drawing action?',
    options: {
      a: 'Delete the tool',
      b: 'Close the program immediately',
      c: 'Check the result on the canvas',
      d: 'Turn off the mouse'
    },
    ans: 'c'
  },
  {
    num: 30,
    section: 'Paint Basics',
    lesson: 'Lesson 2',
    q: 'What is the best beginner habit in Paint?',
    options: {
      a: 'Click every button quickly',
      b: 'Choose the tool first, then use it on the canvas',
      c: 'Never save work',
      d: 'Use only one colour forever'
    },
    ans: 'b'
  },

  // Lesson 3: Paint Editing Skills (31-45)
  {
    num: 31,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'What does editing mean in Paint?',
    options: {
      a: 'Installing software',
      b: 'Only creating a new email',
      c: 'Formatting a spreadsheet',
      d: 'Improving or changing an image after it exists'
    },
    ans: 'd'
  },
  {
    num: 32,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'What does Crop do?',
    options: {
      a: 'Makes a sound louder',
      b: 'Removes unwanted outer parts of an image',
      c: 'Creates a new folder',
      d: 'Changes the keyboard'
    },
    ans: 'b'
  },
  {
    num: 33,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'When should you use Crop?',
    options: {
      a: 'When you want to play music',
      b: 'When you want to open Excel',
      c: 'When there is extra space or unwanted parts around the image',
      d: 'When you need to type a story'
    },
    ans: 'c'
  },
  {
    num: 34,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'What does Resize do?',
    options: {
      a: 'Opens the internet',
      b: 'Changes printer ink',
      c: 'Adds a password',
      d: 'Changes the size of an image'
    },
    ans: 'd'
  },
  {
    num: 35,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'Why should resizing be done carefully?',
    options: {
      a: 'The image can become too small or unclear',
      b: 'It turns the image into sound',
      c: 'It stops the mouse working',
      d: 'It always deletes the file'
    },
    ans: 'a'
  },
  {
    num: 36,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'What does Rotate do?',
    options: {
      a: 'Opens a saved file',
      b: 'Changes a colour only',
      c: 'Turns an image to another angle',
      d: 'Adds a label'
    },
    ans: 'c'
  },
  {
    num: 37,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'When is Rotate useful?',
    options: {
      a: 'When searching the web',
      b: 'When printing a spreadsheet',
      c: 'When typing a document',
      d: 'When a picture is sideways'
    },
    ans: 'd'
  },
  {
    num: 38,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'What does Flip do?',
    options: {
      a: 'Opens Paint',
      b: 'Mirrors an image',
      c: 'Saves a file',
      d: 'Adds a title'
    },
    ans: 'b'
  },
  {
    num: 39,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'What is the difference between Rotate and Flip?',
    options: {
      a: 'Rotate saves; Flip prints',
      b: 'Rotate turns; Flip mirrors',
      c: 'Rotate types; Flip deletes',
      d: 'Rotate colours; Flip opens'
    },
    ans: 'b'
  },
  {
    num: 40,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'What does Select help you do?',
    options: {
      a: 'Create a password',
      b: 'Open a web browser',
      c: 'Choose a part of the image to work with',
      d: 'Turn off the monitor'
    },
    ans: 'c'
  },
  {
    num: 41,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'Why is Save As useful before editing?',
    options: {
      a: 'It removes all colours',
      b: 'It deletes the original file',
      c: 'It helps keep the original image safe',
      d: 'It stops editing'
    },
    ans: 'c'
  },
  {
    num: 42,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'What should you do if you crop too much?',
    options: {
      a: 'Restart the whole computer',
      b: 'Print immediately',
      c: 'Delete Paint',
      d: 'Use Undo and try again'
    },
    ans: 'd'
  },
  {
    num: 43,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'What should you do if an image becomes too small after resizing?',
    options: {
      a: 'Add more stamps',
      b: 'Change the keyboard',
      c: 'Close without saving',
      d: 'Use Undo and resize more carefully'
    },
    ans: 'd'
  },
  {
    num: 44,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'What is the main rule for beginner editing?',
    options: {
      a: 'Look first, edit second, save carefully',
      b: 'Edit randomly',
      c: 'Print before checking',
      d: 'Never use Undo'
    },
    ans: 'a'
  },
  {
    num: 45,
    section: 'Paint Editing Skills',
    lesson: 'Lesson 3',
    q: 'Which editing tool helps correct a sideways picture?',
    options: {
      a: 'Text',
      b: 'Fill',
      c: 'Rotate',
      d: 'Brush'
    },
    ans: 'c'
  },

  // Lesson 4: Pen or Stylus (46-55)
  {
    num: 46,
    section: 'Pen or Stylus',
    lesson: 'Lesson 4',
    q: 'What is a stylus?',
    options: {
      a: 'A type of printer',
      b: 'A pen-like input device for supported screens or tablets',
      c: 'A folder name',
      d: 'A spreadsheet formula'
    },
    ans: 'b'
  },
  {
    num: 47,
    section: 'Pen or Stylus',
    lesson: 'Lesson 4',
    q: 'Why is the stylus lesson optional?',
    options: {
      a: 'A stylus replaces the keyboard',
      b: 'A stylus only works on paper',
      c: 'Not every device supports a stylus',
      d: 'Every learner must buy one'
    },
    ans: 'c'
  },
  {
    num: 48,
    section: 'Pen or Stylus',
    lesson: 'Lesson 4',
    q: 'What can a stylus help with?',
    options: {
      a: 'Creating an email account automatically',
      b: 'Cooking food',
      c: 'Printing money',
      d: 'Drawing, handwriting, circling, and marking'
    },
    ans: 'd'
  },
  {
    num: 49,
    section: 'Pen or Stylus',
    lesson: 'Lesson 4',
    q: 'Which input device is still important even if you use a stylus?',
    options: {
      a: 'Printer cartridge',
      b: 'Power plug',
      c: 'Mouse',
      d: 'Speaker'
    },
    ans: 'c'
  },
  {
    num: 50,
    section: 'Pen or Stylus',
    lesson: 'Lesson 4',
    q: 'What is tapping with a stylus similar to?',
    options: {
      a: 'Printing a file',
      b: 'Typing paragraphs',
      c: 'Resizing the monitor',
      d: 'Clicking with a mouse'
    },
    ans: 'd'
  },
  {
    num: 51,
    section: 'Pen or Stylus',
    lesson: 'Lesson 4',
    q: 'What does dragging with a stylus allow you to do?',
    options: {
      a: 'Format Excel cells',
      b: 'Draw or move across the screen',
      c: 'Change the internet speed',
      d: 'Open the printer tray'
    },
    ans: 'b'
  },
  {
    num: 52,
    section: 'Pen or Stylus',
    lesson: 'Lesson 4',
    q: 'What should you do if your stylus does not work?',
    options: {
      a: 'Stop the course permanently',
      b: 'Use the mouse and continue',
      c: 'Delete the drawing app',
      d: 'Turn off the screen'
    },
    ans: 'b'
  },
  {
    num: 53,
    section: 'Pen or Stylus',
    lesson: 'Lesson 4',
    q: 'When is a stylus especially useful?',
    options: {
      a: 'For replacing the keyboard completely',
      b: 'For printing without paper',
      c: 'For freehand drawing or handwriting',
      d: 'For installing Windows'
    },
    ans: 'c'
  },
  {
    num: 54,
    section: 'Pen or Stylus',
    lesson: 'Lesson 4',
    q: 'What is a good beginner stylus habit?',
    options: {
      a: 'Click randomly',
      b: 'Press as hard as possible',
      c: 'Never save work',
      d: 'Move slowly and watch the canvas'
    },
    ans: 'd'
  },
  {
    num: 55,
    section: 'Pen or Stylus',
    lesson: 'Lesson 4',
    q: 'What should you use if typed words need to be neat?',
    options: {
      a: 'Random handwriting only',
      b: 'Text tool',
      c: 'Eraser only',
      d: 'Rotate'
    },
    ans: 'b'
  },

  // Lesson 5: Tux Paint Introduction (56-70)
  {
    num: 56,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'What is Tux Paint?',
    options: {
      a: 'A web browser',
      b: 'A spreadsheet program',
      c: 'A beginner-friendly drawing program for children',
      d: 'An email service'
    },
    ans: 'c'
  },
  {
    num: 57,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'Why is Tux Paint useful in this module?',
    options: {
      a: 'It teaches advanced coding',
      b: 'It provides a simple drawing space for beginners',
      c: 'It replaces all Windows tools',
      d: 'It only works with printers'
    },
    ans: 'b'
  },
  {
    num: 58,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'What does Tux Paint give learners to draw on?',
    options: {
      a: 'A calendar',
      b: 'A blank canvas',
      c: 'A spreadsheet grid',
      d: 'An email inbox'
    },
    ans: 'b'
  },
  {
    num: 59,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'What helps guide learners in Tux Paint?',
    options: {
      a: 'A bank account',
      b: 'A friendly mascot and feedback',
      c: 'A printer cable',
      d: 'A spreadsheet formula'
    },
    ans: 'b'
  },
  {
    num: 60,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'Which Windows versions can Tux Paint run on?',
    options: {
      a: 'Only Windows Server',
      b: 'Only Windows 95',
      c: 'Windows 8, Windows 10, and Windows 11',
      d: 'Only mobile phones'
    },
    ans: 'c'
  },
  {
    num: 61,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'What input device is enough for beginner use in Tux Paint?',
    options: {
      a: 'A scanner only',
      b: 'A mouse or pointing device',
      c: 'A microphone only',
      d: 'A projector only'
    },
    ans: 'b'
  },
  {
    num: 62,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'Why is a keyboard useful in Tux Paint?',
    options: {
      a: 'For washing the screen',
      b: 'For printing colours',
      c: 'For typing text and labels',
      d: 'For drawing without tools'
    },
    ans: 'c'
  },
  {
    num: 63,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'Where should Tux Paint be downloaded from when needed?',
    options: {
      a: 'Unknown download sites',
      b: 'Any random pop-up',
      c: 'The official Tux Paint website',
      d: 'A printer menu'
    },
    ans: 'c'
  },
  {
    num: 64,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'Why should you understand the Tux Paint screen before clicking tools?',
    options: {
      a: 'So you can avoid drawing',
      b: 'So you know where the canvas, tools, colours, and help area are',
      c: 'So you can delete the app',
      d: 'So you can change the operating system'
    },
    ans: 'b'
  },
  {
    num: 65,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'What is one advantage of Tux Paint’s simple interface?',
    options: {
      a: 'It reduces confusion for beginners',
      b: 'It hides all tools',
      c: 'It blocks drawing',
      d: 'It removes colours'
    },
    ans: 'a'
  },
  {
    num: 66,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'What does saving do in Tux Paint or Paint?',
    options: {
      a: 'Turns it into a song',
      b: 'Deletes your drawing',
      c: 'Changes the keyboard',
      d: 'Keeps your drawing'
    },
    ans: 'd'
  },
  {
    num: 67,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'What does opening saved work do?',
    options: {
      a: 'Removes the canvas',
      b: 'Brings back a saved drawing',
      c: 'Closes the computer',
      d: 'Prints all files'
    },
    ans: 'b'
  },
  {
    num: 68,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'Why should learners not use random download websites?',
    options: {
      a: 'They automatically save drawings',
      b: 'They replace the mouse',
      c: 'They may not be safe or trusted',
      d: 'They always improve learning'
    },
    ans: 'c'
  },
  {
    num: 69,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'What should you check before beginning a Tux Paint activity?',
    options: {
      a: 'That all files are deleted',
      b: 'That Excel is open',
      c: 'That the program, mouse, keyboard, and screen are ready',
      d: 'That the printer is full of stickers'
    },
    ans: 'c'
  },
  {
    num: 70,
    section: 'Tux Paint Introduction',
    lesson: 'Lesson 5',
    q: 'What is the main focus of Lesson 5?',
    options: {
      a: 'Advanced animation',
      b: 'Introduction and setup before using Tux Paint tools',
      c: 'Complex photo editing',
      d: 'Professional design theory'
    },
    ans: 'b'
  },

  // --- SET 2: Questions 71-140 ---
  // Tux Paint Tools Overview (71-100)
  {
    num: 71,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What is the toolbar used for in Tux Paint?',
    options: {
      a: 'Storing printer paper',
      b: 'Changing the monitor',
      c: 'Choosing tools and commands',
      d: 'Writing file passwords'
    },
    ans: 'c'
  },
  {
    num: 72,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What is the canvas used for?',
    options: {
      a: 'Adjusting speakers',
      b: 'Creating and viewing the drawing',
      c: 'Opening email',
      d: 'Setting the time'
    },
    ans: 'b'
  },
  {
    num: 73,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does the selector show?',
    options: {
      a: 'Printer history',
      b: 'The computer’s battery only',
      c: 'Deleted files',
      d: 'Options for the selected tool'
    },
    ans: 'd'
  },
  {
    num: 74,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does the colour area allow you to do?',
    options: {
      a: 'Change the mouse battery',
      b: 'Choose colours for supported tools',
      c: 'Open folders',
      d: 'Start Windows'
    },
    ans: 'b'
  },
  {
    num: 75,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does the help area provide?',
    options: {
      a: 'Computer hardware',
      b: 'Tips, hints, and information',
      c: 'Internet passwords',
      d: 'Printer ink'
    },
    ans: 'b'
  },
  {
    num: 76,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'Which tool is used for freehand drawing in Tux Paint?',
    options: {
      a: 'Save tool',
      b: 'Paint tool',
      c: 'Open tool',
      d: 'Print tool'
    },
    ans: 'b'
  },
  {
    num: 77,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does the Stamp tool do?',
    options: {
      a: 'Creates a spreadsheet',
      b: 'Deletes the whole program',
      c: 'Places ready-made pictures into a drawing',
      d: 'Changes the keyboard'
    },
    ans: 'c'
  },
  {
    num: 78,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'Why are stamps useful for beginners?',
    options: {
      a: 'They remove colours',
      b: 'They replace saving',
      c: 'They stop creativity',
      d: 'They help create scenes without drawing everything by hand'
    },
    ans: 'd'
  },
  {
    num: 79,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What tool should you use for a straight road?',
    options: {
      a: 'Save command',
      b: 'Lines tool',
      c: 'Text tool',
      d: 'Open command'
    },
    ans: 'b'
  },
  {
    num: 80,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does the Shapes tool create?',
    options: {
      a: 'Internet tabs',
      b: 'Email replies',
      c: 'Simple neat forms',
      d: 'Printer settings'
    },
    ans: 'c'
  },
  {
    num: 81,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What can shapes help you build?',
    options: {
      a: 'Houses, signs, windows, and posters',
      b: 'Passwords only',
      c: 'Email folders',
      d: 'Sound files'
    },
    ans: 'a'
  },
  {
    num: 82,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'Which tool adds words to a drawing?',
    options: {
      a: 'Eraser only',
      b: 'Open',
      c: 'Text or Label',
      d: 'Quit'
    },
    ans: 'c'
  },
  {
    num: 83,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What should text in a drawing be?',
    options: {
      a: 'Hidden and tiny',
      b: 'Clear and readable',
      c: 'Upside down always',
      d: 'Random and unreadable'
    },
    ans: 'b'
  },
  {
    num: 84,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What is the Fill tool used for?',
    options: {
      a: 'Opening a program',
      b: 'Colouring an area',
      c: 'Sending emails',
      d: 'Changing file names'
    },
    ans: 'b'
  },
  {
    num: 85,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What may happen if you fill an open area?',
    options: {
      a: 'Colour may spread too far',
      b: 'The keyboard deletes letters',
      c: 'The screen turns off',
      d: 'The program becomes Excel'
    },
    ans: 'a'
  },
  {
    num: 86,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does the Magic tool add?',
    options: {
      a: 'Email contacts',
      b: 'Special effects',
      c: 'Printer paper',
      d: 'Folder passwords'
    },
    ans: 'b'
  },
  {
    num: 87,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'How should Magic be used at beginner level?',
    options: {
      a: 'Instead of saving',
      b: 'Only to delete work',
      c: 'Lightly and with purpose',
      d: 'On every part of every drawing'
    },
    ans: 'c'
  },
  {
    num: 88,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does the Eraser do?',
    options: {
      a: 'Opens a website',
      b: 'Saves the drawing',
      c: 'Removes parts of a drawing',
      d: 'Prints the image'
    },
    ans: 'c'
  },
  {
    num: 89,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does Undo do?',
    options: {
      a: 'Opens a new app',
      b: 'Deletes Windows',
      c: 'Prints a copy',
      d: 'Reverses the last action'
    },
    ans: 'd'
  },
  {
    num: 90,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does Redo do?',
    options: {
      a: 'Deletes all work',
      b: 'Opens email',
      c: 'Brings back an action that was undone',
      d: 'Changes the screen colour'
    },
    ans: 'c'
  },
  {
    num: 91,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does New do?',
    options: {
      a: 'Starts a new drawing',
      b: 'Sends a message',
      c: 'Deletes the keyboard',
      d: 'Makes a printer louder'
    },
    ans: 'a'
  },
  {
    num: 92,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does Open do?',
    options: {
      a: 'Adds a stamp automatically',
      b: 'Turns off the screen',
      c: 'Opens a saved drawing',
      d: 'Changes the mouse'
    },
    ans: 'c'
  },
  {
    num: 93,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does Save do?',
    options: {
      a: 'Opens a browser',
      b: 'Keeps your drawing',
      c: 'Removes all colours',
      d: 'Prints without permission'
    },
    ans: 'b'
  },
  {
    num: 94,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What does Print do?',
    options: {
      a: 'Adds colour',
      b: 'Opens a new brush',
      c: 'Saves the drawing only',
      d: 'Sends the drawing to a printer'
    },
    ans: 'd'
  },
  {
    num: 95,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'When should you print in a classroom?',
    options: {
      a: 'Only when allowed or needed',
      b: 'Every time you click',
      c: 'Before the picture is finished',
      d: 'Without permission'
    },
    ans: 'a'
  },
  {
    num: 96,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What is the Slides feature useful for?',
    options: {
      a: 'Deleting drawings',
      b: 'Showing saved drawings in order',
      c: 'Changing keyboard size',
      d: 'Typing labels'
    },
    ans: 'b'
  },
  {
    num: 97,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'What is the main rule for using Tux Paint tools?',
    options: {
      a: 'Never save',
      b: 'Use every tool at once',
      c: 'Choose the tool that matches the job',
      d: 'Always print first'
    },
    ans: 'c'
  },
  {
    num: 98,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'If you want to draw freely, what should you use?',
    options: {
      a: 'Print',
      b: 'Quit',
      c: 'Open',
      d: 'Paint tool'
    },
    ans: 'd'
  },
  {
    num: 99,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'If you want to place an animal picture, what should you use?',
    options: {
      a: 'Eraser only',
      b: 'Line tool',
      c: 'Stamp tool',
      d: 'Save command'
    },
    ans: 'c'
  },
  {
    num: 100,
    section: 'Tux Paint Tools Overview',
    lesson: 'Lesson 6',
    q: 'If you want to write “My Picture,” what should you use?',
    options: {
      a: 'Text or Label',
      b: 'Fill',
      c: 'Stamp only',
      d: 'Open'
    },
    ans: 'a'
  },

  // Classroom Activities (101-130)
  {
    num: 101,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is the purpose of colouring practice?',
    options: {
      a: 'To install software',
      b: 'To create an email',
      c: 'To practise Fill, colour choice, and control',
      d: 'To delete drawings'
    },
    ans: 'c'
  },
  {
    num: 102,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'Which tool is very important in colouring practice?',
    options: {
      a: 'Quit',
      b: 'Open only',
      c: 'Print only',
      d: 'Fill'
    },
    ans: 'd'
  },
  {
    num: 103,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What does a shapes and labels activity practise?',
    options: {
      a: 'Sending emails',
      b: 'Building objects and explaining them with words',
      c: 'Changing settings',
      d: 'Installing printers'
    },
    ans: 'b'
  },
  {
    num: 104,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'Which tools are useful for shapes and labels?',
    options: {
      a: 'Shapes and Text or Label',
      b: 'Email and Calendar',
      c: 'Print and Quit',
      d: 'Open and Close'
    },
    ans: 'a'
  },
  {
    num: 105,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is the purpose of a poster design activity?',
    options: {
      a: 'To hide information',
      b: 'To use no text',
      c: 'To delete colours',
      d: 'To communicate a clear message visually'
    },
    ans: 'd'
  },
  {
    num: 106,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What should a simple poster include?',
    options: {
      a: 'A clear title, message, picture, and useful colours',
      b: 'Only random effects',
      c: 'No words',
      d: 'Only a blank canvas'
    },
    ans: 'a'
  },
  {
    num: 107,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is the most important poster rule?',
    options: {
      a: 'Decoration first, message hidden',
      b: 'Use every colour',
      c: 'Big message first, decoration second',
      d: 'Never save'
    },
    ans: 'c'
  },
  {
    num: 108,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is a “My Community” drawing about?',
    options: {
      a: 'Deleting local files',
      b: 'Formatting a spreadsheet',
      c: 'Respectfully showing places and life in a community',
      d: 'Creating an email account'
    },
    ans: 'c'
  },
  {
    num: 109,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'Why should a community drawing be respectful?',
    options: {
      a: 'It must show only buildings',
      b: 'It should embarrass people',
      c: 'It should hide all labels',
      d: 'It may represent real places and lived experiences'
    },
    ans: 'd'
  },
  {
    num: 110,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'Which item could be included in a community drawing?',
    options: {
      a: 'Inbox rule',
      b: 'School',
      c: 'Formula bar',
      d: 'Printer driver'
    },
    ans: 'b'
  },
  {
    num: 111,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is a digital greeting card used for?',
    options: {
      a: 'Opening Excel',
      b: 'Sorting files',
      c: 'Checking antivirus',
      d: 'Sending or showing a short positive message'
    },
    ans: 'd'
  },
  {
    num: 112,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'Which message fits a greeting card?',
    options: {
      a: 'Delete System',
      b: 'Cell A1',
      c: 'Happy Birthday',
      d: 'Printer Error'
    },
    ans: 'c'
  },
  {
    num: 113,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What should a greeting card include?',
    options: {
      a: 'A greeting, decoration, colour, and saved final version',
      b: 'Only blank space',
      c: 'No text',
      d: 'A spreadsheet table'
    },
    ans: 'a'
  },
  {
    num: 114,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is a pattern?',
    options: {
      a: 'A deleted file',
      b: 'A design that repeats',
      c: 'A printer cable',
      d: 'A password'
    },
    ans: 'b'
  },
  {
    num: 115,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'Which tools can help make a pattern?',
    options: {
      a: 'Calendar only',
      b: 'Start menu only',
      c: 'Shapes, stamps, colours, or simple effects',
      d: 'Email only'
    },
    ans: 'c'
  },
  {
    num: 116,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is a story picture?',
    options: {
      a: 'A spreadsheet chart',
      b: 'A folder backup',
      c: 'A drawing that shows an event or moment',
      d: 'A keyboard shortcut'
    },
    ans: 'c'
  },
  {
    num: 117,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'Which topic fits a story picture?',
    options: {
      a: 'Printer settings only',
      b: 'A trip to school',
      c: 'File extensions',
      d: 'Email spam'
    },
    ans: 'b'
  },
  {
    num: 118,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What does a classroom rules poster teach?',
    options: {
      a: 'Hardware repair',
      b: 'Bank accounting',
      c: 'Good computer-room behaviour',
      d: 'Advanced coding'
    },
    ans: 'c'
  },
  {
    num: 119,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'Which rule belongs on a computer-room poster?',
    options: {
      a: 'Eat over the keyboard',
      b: 'Delete other learners’ work',
      c: 'Save your work',
      d: 'Print without asking'
    },
    ans: 'c'
  },
  {
    num: 120,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is a name design activity about?',
    options: {
      a: 'Creating a spreadsheet',
      b: 'Designing your name clearly and creatively',
      c: 'Installing drivers',
      d: 'Formatting a hard drive'
    },
    ans: 'b'
  },
  {
    num: 121,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What should stand out in a name design?',
    options: {
      a: 'The printer queue',
      b: 'The learner’s name',
      c: 'The keyboard brand',
      d: 'The file path'
    },
    ans: 'b'
  },
  {
    num: 122,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is a Before and After Drawing activity used for?',
    options: {
      a: 'Showing improvement between two versions',
      b: 'Deleting both drawings',
      c: 'Avoiding saving',
      d: 'Printing blank pages'
    },
    ans: 'a'
  },
  {
    num: 123,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What should you do before improving the first drawing?',
    options: {
      a: 'Delete it',
      b: 'Save the first version',
      c: 'Print it ten times',
      d: 'Close without saving'
    },
    ans: 'b'
  },
  {
    num: 124,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is the final Module 6 project called in the lesson?',
    options: {
      a: 'My Web Browser',
      b: 'My Email Inbox',
      c: 'My Digital Artwork',
      d: 'My Spreadsheet Budget'
    },
    ans: 'c'
  },
  {
    num: 125,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What should the final project include?',
    options: {
      a: 'Only a blank page',
      b: 'Freehand part, shape, filled area, text or label, and saved version',
      c: 'Only random stamps',
      d: 'Only the Print command'
    },
    ans: 'b'
  },
  {
    num: 126,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'How should beginner projects be assessed?',
    options: {
      a: 'Professional art quality only',
      b: 'Number of mistakes only',
      c: 'Speed only',
      d: 'Tool use, completion, clarity, and reflection'
    },
    ans: 'd'
  },
  {
    num: 127,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is reflection in a project?',
    options: {
      a: 'Closing the program quickly',
      b: 'Printing without checking',
      c: 'Explaining what you made and which tools you used',
      d: 'Deleting the project'
    },
    ans: 'c'
  },
  {
    num: 128,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What should you do if your project becomes messy?',
    options: {
      a: 'Add more random effects',
      b: 'Stop, look, simplify, undo or erase if needed',
      c: 'Delete another learner’s work',
      d: 'Print immediately'
    },
    ans: 'b'
  },
  {
    num: 129,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What should you do if you finish too quickly?',
    options: {
      a: 'Improve the drawing with a title, border, label, or colour',
      b: 'Close without saving',
      c: 'Use no tools',
      d: 'Delete the canvas'
    },
    ans: 'a'
  },
  {
    num: 130,
    section: 'Classroom Activities',
    lesson: 'Lesson 7',
    q: 'What is the goal of classroom practice projects?',
    options: {
      a: 'To teach advanced animation',
      b: 'To avoid drawing',
      c: 'To use beginner tools in meaningful creative tasks',
      d: 'To replace all lessons'
    },
    ans: 'c'
  },

  // Mixed Review (131-140)
  {
    num: 131,
    section: 'Mixed Review',
    lesson: 'Review',
    q: 'Which program is especially child-friendly?',
    options: {
      a: 'Microsoft Excel',
      b: 'File Explorer',
      c: 'Tux Paint',
      d: 'Outlook'
    },
    ans: 'c'
  },
  {
    num: 132,
    section: 'Mixed Review',
    lesson: 'Review',
    q: 'Which program is a simple Windows drawing app?',
    options: {
      a: 'Calculator',
      b: 'Task Manager',
      c: 'Outlook Calendar',
      d: 'Paint'
    },
    ans: 'd'
  },
  {
    num: 133,
    section: 'Mixed Review',
    lesson: 'Review',
    q: 'Which tool is useful for freehand drawing in Paint?',
    options: {
      a: 'Print',
      b: 'Brush',
      c: 'File Explorer',
      d: 'Save As'
    },
    ans: 'b'
  },
  {
    num: 134,
    section: 'Mixed Review',
    lesson: 'Review',
    q: 'Which Paint tool reuses an existing colour?',
    options: {
      a: 'Rotate',
      b: 'Crop',
      c: 'Color Picker',
      d: 'Open'
    },
    ans: 'c'
  },
  {
    num: 135,
    section: 'Mixed Review',
    lesson: 'Review',
    q: 'Which Paint tool adds colour to an area?',
    options: {
      a: 'Text',
      b: 'Resize',
      c: 'Flip',
      d: 'Fill'
    },
    ans: 'd'
  },
  {
    num: 136,
    section: 'Mixed Review',
    lesson: 'Review',
    q: 'Which Paint action removes extra image space?',
    options: {
      a: 'Open',
      b: 'Save',
      c: 'Crop',
      d: 'Text'
    },
    ans: 'c'
  },
  {
    num: 137,
    section: 'Mixed Review',
    lesson: 'Review',
    q: 'Which action changes the size of an image?',
    options: {
      a: 'Rotate',
      b: 'Resize',
      c: 'Brush',
      d: 'Fill'
    },
    ans: 'b'
  },
  {
    num: 138,
    section: 'Mixed Review',
    lesson: 'Review',
    q: 'Which action turns an image?',
    options: {
      a: 'Stamp',
      b: 'Text',
      c: 'Save',
      d: 'Rotate'
    },
    ans: 'd'
  },
  {
    num: 139,
    section: 'Mixed Review',
    lesson: 'Review',
    q: 'Which action mirrors an image?',
    options: {
      a: 'Crop',
      b: 'Flip',
      c: 'Text',
      d: 'Fill'
    },
    ans: 'b'
  },
  {
    num: 140,
    section: 'Mixed Review',
    lesson: 'Review',
    q: 'Which command protects an original image by saving a new version?',
    options: {
      a: 'Delete',
      b: 'Quit',
      c: 'Print',
      d: 'Save As'
    },
    ans: 'd'
  },

  // --- SET 3: Questions 141-210 ---
  // Applied Tool Choice (141-160)
  {
    num: 141,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to draw grass freely. Which tool should you use?',
    options: {
      a: 'Open',
      b: 'Paint or Brush',
      c: 'Print',
      d: 'Quit'
    },
    ans: 'b'
  },
  {
    num: 142,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to place a ready-made flower. Which tool should you use?',
    options: {
      a: 'Save',
      b: 'Resize',
      c: 'Stamp',
      d: 'Eraser'
    },
    ans: 'c'
  },
  {
    num: 143,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want a straight fence line. Which tool should you use?',
    options: {
      a: 'Open',
      b: 'Print',
      c: 'Magic',
      d: 'Lines'
    },
    ans: 'd'
  },
  {
    num: 144,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want a neat square sign. Which tool should you use?',
    options: {
      a: 'Save only',
      b: 'Shapes',
      c: 'Brush only',
      d: 'Slides'
    },
    ans: 'b'
  },
  {
    num: 145,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to colour inside the sign. Which tool should you use?',
    options: {
      a: 'Fill',
      b: 'Undo',
      c: 'Print',
      d: 'Open'
    },
    ans: 'a'
  },
  {
    num: 146,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to add the words “Welcome.” Which tool should you use?',
    options: {
      a: 'Rotate',
      b: 'Eraser only',
      c: 'Text or Label',
      d: 'Fill'
    },
    ans: 'c'
  },
  {
    num: 147,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You made a mistake. What should you try first?',
    options: {
      a: 'New',
      b: 'Print',
      c: 'Quit',
      d: 'Undo'
    },
    ans: 'd'
  },
  {
    num: 148,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to remove a small unwanted mark. Which tool may help?',
    options: {
      a: 'Save',
      b: 'Eraser',
      c: 'Open',
      d: 'Stamp only'
    },
    ans: 'b'
  },
  {
    num: 149,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to keep your drawing. Which command should you use?',
    options: {
      a: 'Magic',
      b: 'Fill',
      c: 'Save',
      d: 'Quit'
    },
    ans: 'c'
  },
  {
    num: 150,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want a paper copy and have permission. Which command should you use?',
    options: {
      a: 'Fill',
      b: 'Print',
      c: 'Open',
      d: 'Stamp'
    },
    ans: 'b'
  },
  {
    num: 151,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to begin a new drawing. Which command should you use?',
    options: {
      a: 'Text',
      b: 'New',
      c: 'Save',
      d: 'Eraser'
    },
    ans: 'b'
  },
  {
    num: 152,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to return to a saved drawing. Which command should you use?',
    options: {
      a: 'Brush',
      b: 'Print',
      c: 'Fill',
      d: 'Open'
    },
    ans: 'd'
  },
  {
    num: 153,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to show saved drawings in order. Which feature can help?',
    options: {
      a: 'Text only',
      b: 'Fill only',
      c: 'Slides',
      d: 'Eraser'
    },
    ans: 'c'
  },
  {
    num: 154,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want your poster message to be clear. What should come first?',
    options: {
      a: 'Hidden text',
      b: 'Too many effects',
      c: 'Random decoration',
      d: 'The main message'
    },
    ans: 'd'
  },
  {
    num: 155,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to create a respectful local scene. Which project fits best?',
    options: {
      a: 'My Community Drawing',
      b: 'Resize Practice Only',
      c: 'Email Sorting',
      d: 'Printer Setup'
    },
    ans: 'a'
  },
  {
    num: 156,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to practise repetition. Which project fits best?',
    options: {
      a: 'File Password',
      b: 'Pattern Practice',
      c: 'Crop Practice Only',
      d: 'Typing Test'
    },
    ans: 'b'
  },
  {
    num: 157,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to make a thank-you message. Which project fits best?',
    options: {
      a: 'Keyboard Cleaning',
      b: 'Mouse Settings',
      c: 'Digital Greeting Card',
      d: 'Spreadsheet Chart'
    },
    ans: 'c'
  },
  {
    num: 158,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to show improvement from first version to better version. Which project fits best?',
    options: {
      a: 'Email Reply',
      b: 'Before and After Drawing',
      c: 'Web Search',
      d: 'Print Settings'
    },
    ans: 'b'
  },
  {
    num: 159,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want to combine several beginner tools in one final task. Which project fits best?',
    options: {
      a: 'Save Only',
      b: 'Print Only',
      c: 'Open Only',
      d: 'My Digital Artwork'
    },
    ans: 'd'
  },
  {
    num: 160,
    section: 'Applied Tool Choice',
    lesson: 'Applied Practice',
    q: 'You want your name to be the main focus. Which project fits best?',
    options: {
      a: 'My Spreadsheet Formula',
      b: 'My Email Folder',
      c: 'My Name Design',
      d: 'My File Extension'
    },
    ans: 'c'
  },

  // Beginner Understanding (161-170)
  {
    num: 161,
    section: 'Beginner Understanding',
    lesson: 'Core Principles',
    q: 'Why should you avoid random clicking?',
    options: {
      a: 'It saves automatically',
      b: 'It causes confusion and weak tool control',
      c: 'It makes text clearer',
      d: 'It always improves drawings'
    },
    ans: 'b'
  },
  {
    num: 162,
    section: 'Beginner Understanding',
    lesson: 'Core Principles',
    q: 'What should you do before using a tool?',
    options: {
      a: 'Print the canvas',
      b: 'Close the app',
      c: 'Decide what you want to do',
      d: 'Delete your drawing'
    },
    ans: 'c'
  },
  {
    num: 163,
    section: 'Beginner Understanding',
    lesson: 'Core Principles',
    q: 'What should you do after using a tool?',
    options: {
      a: 'Turn off the monitor',
      b: 'Change the password',
      c: 'Ignore the drawing',
      d: 'Check the result on the canvas'
    },
    ans: 'd'
  },
  {
    num: 164,
    section: 'Beginner Understanding',
    lesson: 'Core Principles',
    q: 'Why should you use Magic effects carefully?',
    options: {
      a: 'They remove all tools',
      b: 'Too many effects can make the drawing confusing',
      c: 'They always break the computer',
      d: 'They cannot be undone'
    },
    ans: 'b'
  },
  {
    num: 165,
    section: 'Beginner Understanding',
    lesson: 'Core Principles',
    q: 'Why is readable text important?',
    options: {
      a: 'It prevents saving',
      b: 'It deletes shapes',
      c: 'It helps the viewer understand the message',
      d: 'It hides the picture'
    },
    ans: 'c'
  },
  {
    num: 166,
    section: 'Beginner Understanding',
    lesson: 'Core Principles',
    q: 'Why are shapes useful in beginner drawing?',
    options: {
      a: 'They help create neat structure',
      b: 'They stop learners from drawing',
      c: 'They remove colour',
      d: 'They replace all tools'
    },
    ans: 'a'
  },
  {
    num: 167,
    section: 'Beginner Understanding',
    lesson: 'Core Principles',
    q: 'Why is the Fill tool useful?',
    options: {
      a: 'It changes folder names',
      b: 'It opens files',
      c: 'It colours areas quickly',
      d: 'It prints images'
    },
    ans: 'c'
  },
  {
    num: 168,
    section: 'Beginner Understanding',
    lesson: 'Core Principles',
    q: 'What does a closed shape help Fill do?',
    options: {
      a: 'Add a password',
      b: 'Open the internet',
      c: 'Delete the drawing',
      d: 'Keep colour inside the area'
    },
    ans: 'd'
  },
  {
    num: 169,
    section: 'Beginner Understanding',
    lesson: 'Core Principles',
    q: 'Why should you save during projects?',
    options: {
      a: 'To make the drawing disappear',
      b: 'To avoid losing work',
      c: 'To stop the mouse',
      d: 'To remove colours'
    },
    ans: 'b'
  },
  {
    num: 170,
    section: 'Beginner Understanding',
    lesson: 'Core Principles',
    q: 'What does reflection help you do?',
    options: {
      a: 'Print without permission',
      b: 'Understand what tools you used and why',
      c: 'Avoid learning',
      d: 'Delete mistakes permanently'
    },
    ans: 'b'
  },

  // Paint and Tux Paint Comparison (171-180)
  {
    num: 171,
    section: 'Paint and Tux Paint Comparison',
    lesson: 'Comparison',
    q: 'Which program gives a standard Windows drawing experience?',
    options: {
      a: 'Outlook',
      b: 'Paint',
      c: 'Tux Typing',
      d: 'Excel'
    },
    ans: 'b'
  },
  {
    num: 172,
    section: 'Paint and Tux Paint Comparison',
    lesson: 'Comparison',
    q: 'Which program is especially designed for young beginner drawing?',
    options: {
      a: 'Word',
      b: 'PowerPoint',
      c: 'Tux Paint',
      d: 'File Explorer'
    },
    ans: 'c'
  },
  {
    num: 173,
    section: 'Paint and Tux Paint Comparison',
    lesson: 'Comparison',
    q: 'Which program uses a child-friendly drawing environment with a mascot?',
    options: {
      a: 'Notepad only',
      b: 'Paint only',
      c: 'Calculator',
      d: 'Tux Paint'
    },
    ans: 'd'
  },
  {
    num: 174,
    section: 'Paint and Tux Paint Comparison',
    lesson: 'Comparison',
    q: 'Which program is suitable for basic Windows image editing such as crop and resize?',
    options: {
      a: 'Tux Paint only',
      b: 'Email',
      c: 'Paint',
      d: 'Calendar'
    },
    ans: 'c'
  },
  {
    num: 175,
    section: 'Paint and Tux Paint Comparison',
    lesson: 'Comparison',
    q: 'Which tool appears in both beginner drawing environments as a concept?',
    options: {
      a: 'Browser tab',
      b: 'Drawing or painting tool',
      c: 'Spreadsheet formula',
      d: 'Email inbox'
    },
    ans: 'b'
  },
  {
    num: 176,
    section: 'Paint and Tux Paint Comparison',
    lesson: 'Comparison',
    q: 'Which skill is practised in both Paint and Tux Paint?',
    options: {
      a: 'Website hosting',
      b: 'Advanced coding',
      c: 'Mouse control',
      d: 'Bank transactions'
    },
    ans: 'c'
  },
  {
    num: 177,
    section: 'Paint and Tux Paint Comparison',
    lesson: 'Comparison',
    q: 'Which action is important in both Paint and Tux Paint?',
    options: {
      a: 'Saving work',
      b: 'Deleting all files',
      c: 'Installing printers',
      d: 'Changing hardware'
    },
    ans: 'a'
  },
  {
    num: 178,
    section: 'Paint and Tux Paint Comparison',
    lesson: 'Comparison',
    q: 'Which activity can be done in either Paint or Tux Paint?',
    options: {
      a: 'Spreadsheet filtering',
      b: 'Poster design',
      c: 'Calendar scheduling',
      d: 'Email forwarding'
    },
    ans: 'b'
  },
  {
    num: 179,
    section: 'Paint and Tux Paint Comparison',
    lesson: 'Comparison',
    q: 'Which program is better for guided child-friendly exploration?',
    options: {
      a: 'Registry Editor',
      b: 'Task Manager',
      c: 'Command Prompt only',
      d: 'Tux Paint'
    },
    ans: 'd'
  },
  {
    num: 180,
    section: 'Paint and Tux Paint Comparison',
    lesson: 'Comparison',
    q: 'Which program is better for simple Windows-based drawing and basic image edits?',
    options: {
      a: 'Outlook',
      b: 'Excel',
      c: 'Paint',
      d: 'Calculator'
    },
    ans: 'c'
  },

  // Project Scenarios (181-190)
  {
    num: 181,
    section: 'Project Scenarios',
    lesson: 'Project Work',
    q: 'A learner wants to make a “Save Water” poster. What should the poster include?',
    options: {
      a: 'Only random decorations',
      b: 'A clear title, short message, useful picture, and colour',
      c: 'No words',
      d: 'Only a blank page'
    },
    ans: 'b'
  },
  {
    num: 182,
    section: 'Project Scenarios',
    lesson: 'Project Work',
    q: 'A learner wants to draw a classroom and label parts. Which tools are useful?',
    options: {
      a: 'Print only',
      b: 'Open only',
      c: 'Shapes and Text or Label',
      d: 'Quit only'
    },
    ans: 'c'
  },
  {
    num: 183,
    section: 'Project Scenarios',
    lesson: 'Project Work',
    q: 'A learner wants to colour a flower outline. Which tool is most useful?',
    options: {
      a: 'Flip',
      b: 'Print',
      c: 'Resize',
      d: 'Fill'
    },
    ans: 'd'
  },
  {
    num: 184,
    section: 'Project Scenarios',
    lesson: 'Project Work',
    q: 'A learner wants to place a ready-made animal in Tux Paint. Which tool is best?',
    options: {
      a: 'Save As only',
      b: 'Crop',
      c: 'Stamp',
      d: 'Layout'
    },
    ans: 'c'
  },
  {
    num: 185,
    section: 'Project Scenarios',
    lesson: 'Project Work',
    q: 'A learner wants to write “My Garden” at the top of a picture. Which tool is best?',
    options: {
      a: 'Text or Label',
      b: 'Open only',
      c: 'Eraser',
      d: 'Rotate'
    },
    ans: 'a'
  },
  {
    num: 186,
    section: 'Project Scenarios',
    lesson: 'Project Work',
    q: 'A learner wants to correct a small extra line. Which tool is useful?',
    options: {
      a: 'Eraser or Undo',
      b: 'Print',
      c: 'New',
      d: 'Open'
    },
    ans: 'a'
  },
  {
    num: 187,
    section: 'Project Scenarios',
    lesson: 'Project Work',
    q: 'A learner wants to create a border around a card. Which tool could help?',
    options: {
      a: 'Browser',
      b: 'Lines or Shapes',
      c: 'Folder',
      d: 'Email'
    },
    ans: 'b'
  },
  {
    num: 188,
    section: 'Project Scenarios',
    lesson: 'Project Work',
    q: 'A learner wants to create a community picture. Which topic is suitable?',
    options: {
      a: 'Formula sheet',
      b: 'Password list',
      c: 'Printer driver',
      d: 'School, road, clinic, homes, and trees'
    },
    ans: 'd'
  },
  {
    num: 189,
    section: 'Project Scenarios',
    lesson: 'Project Work',
    q: 'A learner wants to improve a first drawing. What should be done first?',
    options: {
      a: 'Print without checking',
      b: 'Delete it immediately',
      c: 'Save the first version',
      d: 'Close the app'
    },
    ans: 'c'
  },
  {
    num: 190,
    section: 'Project Scenarios',
    lesson: 'Project Work',
    q: 'A learner wants to explain the drawing after finishing. What should they mention?',
    options: {
      a: 'The computer serial number',
      b: 'The tools used and why',
      c: 'The internet speed',
      d: 'The printer brand only'
    },
    ans: 'b'
  },

  // Safety, Respect, and Good Habits (191-200)
  {
    num: 191,
    section: 'Safety, Respect, and Good Habits',
    lesson: 'Digital Citizenship & Safety',
    q: 'Why should you ask before printing in a classroom?',
    options: {
      a: 'Printing uses paper and ink',
      b: 'Printing improves every drawing automatically',
      c: 'Printing replaces saving',
      d: 'Printing deletes the picture'
    },
    ans: 'a'
  },
  {
    num: 192,
    section: 'Safety, Respect, and Good Habits',
    lesson: 'Digital Citizenship & Safety',
    q: 'What should you avoid in a community drawing?',
    options: {
      a: 'Labels',
      b: 'Roads',
      c: 'Disrespectful or embarrassing representations',
      d: 'Trees'
    },
    ans: 'c'
  },
  {
    num: 193,
    section: 'Safety, Respect, and Good Habits',
    lesson: 'Digital Citizenship & Safety',
    q: 'What should you do if the text is hard to read?',
    options: {
      a: 'Print immediately',
      b: 'Delete the whole computer',
      c: 'Change size, colour, or placement',
      d: 'Leave it hidden'
    },
    ans: 'c'
  },
  {
    num: 194,
    section: 'Safety, Respect, and Good Habits',
    lesson: 'Digital Citizenship & Safety',
    q: 'What should you do if too many colours make the picture confusing?',
    options: {
      a: 'Close without saving',
      b: 'Simplify the colour choices',
      c: 'Add more random colours',
      d: 'Remove all tools'
    },
    ans: 'b'
  },
  {
    num: 195,
    section: 'Safety, Respect, and Good Habits',
    lesson: 'Digital Citizenship & Safety',
    q: 'What should you do if you used too many stamps?',
    options: {
      a: 'Print ten copies',
      b: 'Add more stamps',
      c: 'Delete another learner’s work',
      d: 'Remove or undo some and keep the scene clear'
    },
    ans: 'd'
  },
  {
    num: 196,
    section: 'Safety, Respect, and Good Habits',
    lesson: 'Digital Citizenship & Safety',
    q: 'Why should effects not hide the main message?',
    options: {
      a: 'Text is not useful',
      b: 'The viewer must still understand the drawing',
      c: 'Effects must always cover everything',
      d: 'Saving is unnecessary'
    },
    ans: 'b'
  },
  {
    num: 197,
    section: 'Safety, Respect, and Good Habits',
    lesson: 'Digital Citizenship & Safety',
    q: 'What is a good habit before closing a drawing program?',
    options: {
      a: 'Remove the mouse',
      b: 'Turn off the keyboard',
      c: 'Save your work',
      d: 'Delete your work'
    },
    ans: 'c'
  },
  {
    num: 198,
    section: 'Safety, Respect, and Good Habits',
    lesson: 'Digital Citizenship & Safety',
    q: 'What should you do if you are unsure which tool to use?',
    options: {
      a: 'Close the program',
      b: 'Think about the task and choose the matching tool',
      c: 'Click randomly',
      d: 'Print the page'
    },
    ans: 'b'
  },
  {
    num: 199,
    section: 'Safety, Respect, and Good Habits',
    lesson: 'Digital Citizenship & Safety',
    q: 'What is more important than perfect art in this beginner module?',
    options: {
      a: 'Advanced effects',
      b: 'Professional design theory',
      c: 'Tool control, clarity, and confidence',
      d: 'Expensive equipment'
    },
    ans: 'c'
  },
  {
    num: 200,
    section: 'Safety, Respect, and Good Habits',
    lesson: 'Digital Citizenship & Safety',
    q: 'What should you do if you do not have a stylus?',
    options: {
      a: 'Delete Paint',
      b: 'Stop the module',
      c: 'Use the mouse and continue',
      d: 'Avoid drawing forever'
    },
    ans: 'c'
  },

  // Final Module Review (201-210)
  {
    num: 201,
    section: 'Final Module Review',
    lesson: 'Comprehensive Review',
    q: 'What is the main purpose of digital drawing in this course?',
    options: {
      a: 'To teach expert illustration only',
      b: 'To replace all writing',
      c: 'To build beginner computer confidence and control',
      d: 'To avoid saving files'
    },
    ans: 'c'
  },
  {
    num: 202,
    section: 'Final Module Review',
    lesson: 'Comprehensive Review',
    q: 'What does the canvas represent?',
    options: {
      a: 'The keyboard',
      b: 'The working area for the drawing',
      c: 'The internet',
      d: 'The printer cable'
    },
    ans: 'b'
  },
  {
    num: 203,
    section: 'Final Module Review',
    lesson: 'Comprehensive Review',
    q: 'What is the best way to learn tools?',
    options: {
      a: 'Use one tool at a time with purpose',
      b: 'Click every tool quickly',
      c: 'Avoid practice',
      d: 'Never check the result'
    },
    ans: 'a'
  },
  {
    num: 204,
    section: 'Final Module Review',
    lesson: 'Comprehensive Review',
    q: 'Which command helps correct a recent mistake?',
    options: {
      a: 'Print',
      b: 'Quit',
      c: 'Undo',
      d: 'Open'
    },
    ans: 'c'
  },
  {
    num: 205,
    section: 'Final Module Review',
    lesson: 'Comprehensive Review',
    q: 'Which command keeps your work?',
    options: {
      a: 'Erase',
      b: 'New only',
      c: 'Magic',
      d: 'Save'
    },
    ans: 'd'
  },
  {
    num: 206,
    section: 'Final Module Review',
    lesson: 'Comprehensive Review',
    q: 'Which project best shows personal or local connection?',
    options: {
      a: 'Email Setup',
      b: 'My Community Drawing',
      c: 'Resize Only',
      d: 'Printer Test'
    },
    ans: 'b'
  },
  {
    num: 207,
    section: 'Final Module Review',
    lesson: 'Comprehensive Review',
    q: 'Which project best teaches public visual communication?',
    options: {
      a: 'Keyboard Test',
      b: 'File Rename',
      c: 'Poster Design',
      d: 'Calendar Entry'
    },
    ans: 'c'
  },
  {
    num: 208,
    section: 'Final Module Review',
    lesson: 'Comprehensive Review',
    q: 'Which project best teaches repetition?',
    options: {
      a: 'Pattern Practice',
      b: 'Email Reply',
      c: 'System Update',
      d: 'File Deletion'
    },
    ans: 'a'
  },
  {
    num: 209,
    section: 'Final Module Review',
    lesson: 'Comprehensive Review',
    q: 'What should every completed project have?',
    options: {
      a: 'No tool use',
      b: 'A saved final version',
      c: 'No title',
      d: 'Only mistakes'
    },
    ans: 'b'
  },
  {
    num: 210,
    section: 'Final Module Review',
    lesson: 'Comprehensive Review',
    q: 'What is the main rule for Module 6 projects?',
    options: {
      a: 'Click randomly',
      b: 'Never save',
      c: 'Use advanced tools first',
      d: 'Use tools with purpose'
    },
    ans: 'd'
  }
];

// Validate length
if (rawQuestions.length !== 210) {
  console.error(`Error: Expected 210 questions, got ${rawQuestions.length}`);
  process.exit(1);
}

// Split into Set 1 (1-70), Set 2 (71-140), Set 3 (141-210)
const set1 = rawQuestions.slice(0, 70).map(q => ({
  questionNumber: q.num,
  section: q.section,
  lessonReference: q.lesson,
  question: q.q,
  options: q.options,
  correctAnswer: q.ans
}));

const set2 = rawQuestions.slice(70, 140).map(q => ({
  questionNumber: q.num,
  section: q.section,
  lessonReference: q.lesson,
  question: q.q,
  options: q.options,
  correctAnswer: q.ans
}));

const set3 = rawQuestions.slice(140, 210).map(q => ({
  questionNumber: q.num,
  section: q.section,
  lessonReference: q.lesson,
  question: q.q,
  options: q.options,
  correctAnswer: q.ans
}));

// Build seed-module6-questions.js content
const seedScriptContent = `const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Module = require('../src/models/Module');
const AssignmentQuestion = require('../src/models/AssignmentQuestion');

const set1JSON = \`${JSON.stringify(set1, null, 2)}\`;

const set2JSON = \`${JSON.stringify(set2, null, 2)}\`;

const set3JSON = \`${JSON.stringify(set3, null, 2)}\`;

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
        _id: '${moduleId}',
        title: 'Module 6: Drawing',
        description: 'Drawing with Windows Paint & Tux Paint',
        order: 6
      });
    }

    console.log(\`Found module: \${module.title} (\${module._id})\`);

    await AssignmentQuestion.deleteMany({ moduleId: module._id });
    console.log('Cleared existing questions for Module 6');

    const allQuestions = [...s1, ...s2, ...s3].map(q => ({
      ...q,
      moduleId: module._id
    }));

    await AssignmentQuestion.insertMany(allQuestions);
    console.log(\`✅ Successfully seeded \${allQuestions.length} questions into PostgreSQL for Module 6\`);

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
`;

fs.writeFileSync(path.join(__dirname, 'seed-module6-questions.js'), seedScriptContent, 'utf8');
console.log('✅ Generated backend/scripts/seed-module6-questions.js');

// Generate SQL migration file
function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function escJson(obj) {
  if (obj === null || obj === undefined) return "'{}'::jsonb";
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

let sqlContent = `-- ========================================================\n`;
sqlContent += `-- Module 6: Drawing Assessment Questions Migration\n`;
sqlContent += `-- Total: 210 Questions (3 Sets of 70 Questions Each)\n`;
sqlContent += `-- ========================================================\n\n`;

sqlContent += `-- Ensure Module 6 exists in modules table\n`;
sqlContent += `INSERT INTO modules (_id, title, description, code, order_num, created_at)\n`;
sqlContent += `VALUES ('${moduleId}', 'Module 6: Drawing', 'Drawing with Windows Paint & Tux Paint', 'M6', 6, NOW())\n`;
sqlContent += `ON CONFLICT (_id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_num = EXCLUDED.order_num;\n\n`;

sqlContent += `-- Clean up existing Module 6 questions to avoid duplicates\n`;
sqlContent += `DELETE FROM assignment_questions WHERE module_id = '${moduleId}';\n\n`;

// Generate deterministic IDs for export sync
function genId(modId, qNum) {
  const hash = crypto.createHash('sha256').update(`module6-q-${qNum}-${modId}`).digest('hex');
  return hash.substring(0, 24);
}

const exportedQuestions = [];
const exportJsonPath = path.resolve(__dirname, '../db-backup-export/assignmentquestions.json');
let existingExport = [];
if (fs.existsSync(exportJsonPath)) {
  existingExport = JSON.parse(fs.readFileSync(exportJsonPath, 'utf8'));
}

// Remove any prior module 6 questions from export
const filteredExport = existingExport.filter(q => q.moduleId !== moduleId);

const nowIso = new Date().toISOString();

for (const q of rawQuestions) {
  const qId = genId(moduleId, q.num);
  
  // SQL
  sqlContent += `INSERT INTO assignment_questions (_id, module_id, question_number, question, options, correct_answer, section, lesson_reference, created_at)\n`;
  sqlContent += `VALUES (${esc(qId)}, ${esc(moduleId)}, ${q.num}, ${esc(q.q)}, ${escJson(q.options)}, ${esc(q.ans)}, ${esc(q.section)}, ${esc(q.lesson)}, ${esc(nowIso)}) ON CONFLICT (_id) DO UPDATE SET question = EXCLUDED.question, options = EXCLUDED.options, correct_answer = EXCLUDED.correct_answer, section = EXCLUDED.section, lesson_reference = EXCLUDED.lesson_reference;\n`;

  // JSON Export object
  filteredExport.push({
    _id: qId,
    moduleId: moduleId,
    questionNumber: q.num,
    question: q.q,
    options: q.options,
    correctAnswer: q.ans,
    section: q.section,
    lessonReference: q.lesson,
    createdAt: nowIso,
    __v: 0
  });
}

// Write SQL file
const sqlFilePath = path.join(__dirname, 'module6_questions.sql');
fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
console.log(`✅ Generated backend/scripts/module6_questions.sql (${sqlContent.length} bytes)`);

// Write updated assignmentquestions.json
fs.writeFileSync(exportJsonPath, JSON.stringify(filteredExport, null, 2), 'utf8');
console.log(`✅ Updated backend/db-backup-export/assignmentquestions.json (Total questions: ${filteredExport.length})`);

// Also update full_migration.sql if generate-sql.js exists
try {
  require('./generate-sql');
  console.log('✅ Updated backend/src/db/full_migration.sql');
} catch (e) {
  console.log('Notice: generate-sql completed or skipped:', e.message);
}
