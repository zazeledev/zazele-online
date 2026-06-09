require('dotenv').config();
const mongoose = require('mongoose');
const Module = require('../src/models/Module');
const AssignmentQuestion = require('../src/models/AssignmentQuestion');

// All 70 questions for Module 1 from Set A (primary dataset)
const moduleQuestionsSetA = [
  // Section 1: Introduction to Computers (Lesson 1) - Questions 1-7
  {
    questionNumber: 1,
    section: 'Introduction to Computers',
    lessonReference: 'Lesson 1',
    question: 'Which of the following best defines a "computer"?',
    options: {
      a: 'A machine that only plays games.',
      b: 'An electronic device that manipulates information or data.',
      c: 'A screen that shows movies.',
      d: 'A typewriter with a screen.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 2,
    section: 'Introduction to Computers',
    lessonReference: 'Lesson 1',
    question: 'Which of the steps below is NOT part of the IPOS cycle?',
    options: {
      a: 'Input',
      b: 'Processing',
      c: 'Printing',
      d: 'Storage',
    },
    correctAnswer: 'c',
  },
  {
    questionNumber: 3,
    section: 'Introduction to Computers',
    lessonReference: 'Lesson 1',
    question: 'Which of these is an example of HARDWARE?',
    options: {
      a: 'Microsoft Word',
      b: 'The Monitor (Screen)',
      c: 'Windows 11',
      d: 'A Video Game',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 4,
    section: 'Introduction to Computers',
    lessonReference: 'Lesson 1',
    question: 'Which of these is an example of SOFTWARE?',
    options: {
      a: 'The Keyboard',
      b: 'The Mouse',
      c: 'Google Chrome',
      d: 'The Power Cable',
    },
    correctAnswer: 'c',
  },
  {
    questionNumber: 5,
    section: 'Introduction to Computers',
    lessonReference: 'Lesson 1',
    question: 'A Laptop is designed primarily for:',
    options: {
      a: 'Staying on a desk forever.',
      b: 'Portability and mobile work.',
      c: 'Use only in large server rooms.',
      d: 'Use without an operating system.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 6,
    section: 'Introduction to Computers',
    lessonReference: 'Lesson 1',
    question: 'The "Start Button" in Windows 11 is typically located:',
    options: {
      a: 'In the top right corner.',
      b: 'Centered on the Taskbar at the bottom.',
      c: 'Hidden inside a folder.',
      d: 'On the physical keyboard only.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 7,
    section: 'Introduction to Computers',
    lessonReference: 'Lesson 1',
    question: 'What happens during the "Boot Process"?',
    options: {
      a: 'The computer cleans its screen.',
      b: 'The computer checks its hardware and loads the Operating System.',
      c: 'The computer connects to the internet instantly.',
      d: 'The computer deletes old files.',
    },
    correctAnswer: 'b',
  },
  // Section 2: Core Components (Lesson 2) - Questions 8-15
  {
    questionNumber: 8,
    section: 'Core Components',
    lessonReference: 'Lesson 2',
    question: 'The CPU is often called the _____ of the computer.',
    options: {
      a: 'Heart',
      b: 'Brain',
      c: 'Hands',
      d: 'Eyes',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 9,
    section: 'Core Components',
    lessonReference: 'Lesson 2',
    question: 'RAM stands for:',
    options: {
      a: 'Read Access Memory',
      b: 'Random Access Memory',
      c: 'Real Active Memory',
      d: 'Rapid Action Mode',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 10,
    section: 'Core Components',
    lessonReference: 'Lesson 2',
    question: 'What happens to data in RAM when the power is turned off?',
    options: {
      a: 'It is saved permanently.',
      b: 'It is uploaded to the cloud.',
      c: 'It is completely erased (Volatile).',
      d: 'It moves to the Hard Drive automatically.',
    },
    correctAnswer: 'c',
  },
  {
    questionNumber: 11,
    section: 'Core Components',
    lessonReference: 'Lesson 2',
    question: 'Which storage device is faster and more durable: HDD or SSD?',
    options: {
      a: 'HDD (Hard Disk Drive)',
      b: 'SSD (Solid State Drive)',
      c: 'Floppy Disk',
      d: 'CD-ROM',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 12,
    section: 'Core Components',
    lessonReference: 'Lesson 2',
    question: 'The Motherboard is responsible for:',
    options: {
      a: 'Connecting all the components together.',
      b: 'Typing documents.',
      c: 'Cooling the room.',
      d: 'Displaying images on the screen.',
    },
    correctAnswer: 'a',
  },
  {
    questionNumber: 13,
    section: 'Core Components',
    lessonReference: 'Lesson 2',
    question: 'Which unit of measurement is the LARGEST?',
    options: {
      a: 'Gigabyte (GB)',
      b: 'Megabyte (MB)',
      c: 'Terabyte (TB)',
      d: 'Kilobyte (KB)',
    },
    correctAnswer: 'c',
  },
  {
    questionNumber: 14,
    section: 'Core Components',
    lessonReference: 'Lesson 2',
    question: 'If your computer is very slow when opening multiple programs, you likely need more:',
    options: {
      a: 'Hard Drive Space',
      b: 'RAM',
      c: 'USB Ports',
      d: 'Monitors',
    },
    correctAnswer: 'b',
  },
  // Section 3: The Operating System (Lesson 3) - Questions 15-21
  {
    questionNumber: 15,
    section: 'The Operating System',
    lessonReference: 'Lesson 3',
    question: 'What is the main role of an Operating System (OS)?',
    options: {
      a: 'To manage hardware and software resources.',
      b: 'To browse the internet only.',
      c: 'To create spreadsheets.',
      d: 'To clean viruses.',
    },
    correctAnswer: 'a',
  },
  {
    questionNumber: 16,
    section: 'The Operating System',
    lessonReference: 'Lesson 3',
    question: 'Which of the following is NOT an Operating System?',
    options: {
      a: 'Windows 11',
      b: 'macOS',
      c: 'Microsoft Word',
      d: 'Android',
    },
    correctAnswer: 'c',
  },
  {
    questionNumber: 17,
    section: 'The Operating System',
    lessonReference: 'Lesson 3',
    question: 'What is the bar at the bottom of the Windows desktop called?',
    options: {
      a: 'The Menu Bar',
      b: 'The Taskbar',
      c: 'The Status Line',
      d: 'The Tool Strip',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 18,
    section: 'The Operating System',
    lessonReference: 'Lesson 3',
    question: 'To hide a window without closing it, you click:',
    options: {
      a: 'Minimize (The Dash)',
      b: 'Maximize (The Square)',
      c: 'Close (The X)',
      d: 'Delete',
    },
    correctAnswer: 'a',
  },
  {
    questionNumber: 19,
    section: 'The Operating System',
    lessonReference: 'Lesson 3',
    question: 'What does "Snap Layouts" allow you to do?',
    options: {
      a: 'Take a screenshot.',
      b: 'Arrange windows side-by-side perfectly.',
      c: 'Close all apps at once.',
      d: 'Change the color of the screen.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 20,
    section: 'The Operating System',
    lessonReference: 'Lesson 3',
    question: 'Where would you find the volume and Wi-Fi status icons?',
    options: {
      a: 'The Start Menu',
      b: 'The System Tray (bottom right)',
      c: 'The Recycle Bin',
      d: 'The Title Bar',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 21,
    section: 'The Operating System',
    lessonReference: 'Lesson 3',
    question: 'Which key combination locks your computer immediately?',
    options: {
      a: 'Ctrl + C',
      b: 'Windows Key + L',
      c: 'Alt + F4',
      d: 'Shift + Delete',
    },
    correctAnswer: 'b',
  },
  // Section 4: File Management (Lesson 4) - Questions 22-28
  {
    questionNumber: 22,
    section: 'File Management',
    lessonReference: 'Lesson 4',
    question: 'What tool do we use to manage files and folders in Windows?',
    options: {
      a: 'Internet Explorer',
      b: 'File Explorer (Yellow Folder)',
      c: 'Task Manager',
      d: 'Settings',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 23,
    section: 'File Management',
    lessonReference: 'Lesson 4',
    question: 'Which of the following is the correct hierarchy (order)?',
    options: {
      a: 'File > Folder > Drive',
      b: 'Drive > Folder > File',
      c: 'Folder > Drive > File',
      d: 'File > Drive > Folder',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 24,
    section: 'File Management',
    lessonReference: 'Lesson 4',
    question: 'You want to create a folder inside "Documents." What is the first step?',
    options: {
      a: 'Restart the computer.',
      b: 'Right-click in the empty space and select "New > Folder."',
      c: 'Press the power button.',
      d: 'Open Google Chrome.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 25,
    section: 'File Management',
    lessonReference: 'Lesson 4',
    question: 'What is the difference between "Copy" and "Cut"?',
    options: {
      a: 'Copy creates a duplicate; Cut moves the original.',
      b: 'Copy deletes the file; Cut saves it.',
      c: 'There is no difference.',
      d: 'Cut creates a duplicate; Copy moves the original.',
    },
    correctAnswer: 'a',
  },
  {
    questionNumber: 26,
    section: 'File Management',
    lessonReference: 'Lesson 4',
    question: 'You accidentally deleted a file. Where should you look first?',
    options: {
      a: 'The Start Menu',
      b: 'The Recycle Bin',
      c: 'The Internet',
      d: 'The Printer',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 27,
    section: 'File Management',
    lessonReference: 'Lesson 4',
    question: 'Which keyboard shortcut is used to PASTE a file?',
    options: {
      a: 'Ctrl + C',
      b: 'Ctrl + V',
      c: 'Ctrl + X',
      d: 'Ctrl + P',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 28,
    section: 'File Management',
    lessonReference: 'Lesson 4',
    question: 'Scenario: You have a photo named "Image1.jpg". You want to change it to "Holiday.jpg". You should:',
    options: {
      a: 'Delete the file and take a new photo.',
      b: 'Right-click and select "Rename."',
      c: 'Email it to yourself.',
      d: 'Open it in Paint.',
    },
    correctAnswer: 'b',
  },
  // Section 5: Peripherals and Ports (Lesson 5) - Questions 29-35
  {
    questionNumber: 29,
    section: 'Peripherals and Ports',
    lessonReference: 'Lesson 5',
    question: 'Which of these is an INPUT device?',
    options: {
      a: 'Monitor',
      b: 'Printer',
      c: 'Mouse',
      d: 'Speakers',
    },
    correctAnswer: 'c',
  },
  {
    questionNumber: 30,
    section: 'Peripherals and Ports',
    lessonReference: 'Lesson 5',
    question: 'Which of these is an OUTPUT device?',
    options: {
      a: 'Microphone',
      b: 'Webcam',
      c: 'Scanner',
      d: 'Headphones',
    },
    correctAnswer: 'd',
  },
  {
    questionNumber: 31,
    section: 'Peripherals and Ports',
    lessonReference: 'Lesson 5',
    question: 'Which port is known for being "reversible" (can plug in upside down)?',
    options: {
      a: 'USB-A',
      b: 'HDMI',
      c: 'USB-C',
      d: 'VGA',
    },
    correctAnswer: 'c',
  },
  {
    questionNumber: 32,
    section: 'Peripherals and Ports',
    lessonReference: 'Lesson 5',
    question: 'Which cable carries BOTH video and sound to a TV?',
    options: {
      a: 'VGA',
      b: 'HDMI',
      c: 'Audio Jack',
      d: 'Ethernet',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 33,
    section: 'Peripherals and Ports',
    lessonReference: 'Lesson 5',
    question: 'What is "Plug and Play"?',
    options: {
      a: 'A game you play on the computer.',
      b: 'The computer automatically detecting and setting up a new device.',
      c: 'A type of battery.',
      d: 'A virus warning.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 34,
    section: 'Peripherals and Ports',
    lessonReference: 'Lesson 5',
    question: 'To connect wireless headphones, you must use:',
    options: {
      a: 'Wi-Fi',
      b: 'Bluetooth',
      c: 'NFC',
      d: 'Infrared',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 35,
    section: 'Peripherals and Ports',
    lessonReference: 'Lesson 5',
    question: 'Why must you "Eject" a USB drive before pulling it out?',
    options: {
      a: 'To save electricity.',
      b: 'To prevent data corruption (lost files).',
      c: 'To cool down the drive.',
      d: 'It is not necessary; you can just pull it out.',
    },
    correctAnswer: 'b',
  },
  // Section 6: Application Software (Lesson 6) - Questions 36-42
  {
    questionNumber: 36,
    section: 'Application Software',
    lessonReference: 'Lesson 6',
    question: 'Which of the following is Application Software?',
    options: {
      a: 'The Motherboard',
      b: 'Windows 11',
      c: 'Microsoft Excel',
      d: 'The Hard Drive',
    },
    correctAnswer: 'c',
  },
  {
    questionNumber: 37,
    section: 'Application Software',
    lessonReference: 'Lesson 6',
    question: 'Which type of software is used for browsing the internet?',
    options: {
      a: 'Word Processor',
      b: 'Spreadsheet',
      c: 'Web Browser',
      d: 'Media Player',
    },
    correctAnswer: 'c',
  },
  {
    questionNumber: 38,
    section: 'Application Software',
    lessonReference: 'Lesson 6',
    question: 'What is the safest place to download apps on Windows 11?',
    options: {
      a: 'Any website that says "Free Download."',
      b: 'The Microsoft Store.',
      c: 'A link in a spam email.',
      d: 'A pop-up advertisement.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 39,
    section: 'Application Software',
    lessonReference: 'Lesson 6',
    question: 'What is "Bloatware"?',
    options: {
      a: 'Software that makes your computer faster.',
      b: 'Unwanted "junk" software that comes pre-installed or bundled with other apps.',
      c: 'Software for designing boats.',
      d: 'Essential system updates.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 40,
    section: 'Application Software',
    lessonReference: 'Lesson 6',
    question: 'How should you remove a program you no longer need?',
    options: {
      a: 'Delete the icon on the Desktop.',
      b: 'Go to Settings > Apps > Uninstall.',
      c: 'Rename the folder to "Hidden."',
      d: 'Turn off the monitor.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 41,
    section: 'Application Software',
    lessonReference: 'Lesson 6',
    question: 'Google Docs is an example of a:',
    options: {
      a: 'Desktop App (Installed)',
      b: 'Web App (Cloud-based)',
      c: 'System Driver',
      d: 'Hardware component',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 42,
    section: 'Application Software',
    lessonReference: 'Lesson 6',
    question: 'Why should you update your apps?',
    options: {
      a: 'To fill up the hard drive.',
      b: 'To fix security holes and get new features.',
      c: 'To change the color of the icon.',
      d: 'Updates are never necessary.',
    },
    correctAnswer: 'b',
  },
  // Section 7: The Internet and Web (Lesson 7) - Questions 43-49
  {
    questionNumber: 43,
    section: 'The Internet and Web',
    lessonReference: 'Lesson 7',
    question: 'The "Internet" refers to:',
    options: {
      a: 'The websites you visit.',
      b: 'The physical network of cables and computers (The Road).',
      c: 'Google Chrome only.',
      d: 'Your Wi-Fi password.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 44,
    section: 'The Internet and Web',
    lessonReference: 'Lesson 7',
    question: 'The "World Wide Web" refers to:',
    options: {
      a: 'The cables under the ocean.',
      b: 'The collection of websites and pages (The Shops).',
      c: 'The modem in your house.',
      d: 'An spider web.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 45,
    section: 'The Internet and Web',
    lessonReference: 'Lesson 7',
    question: 'Which of the following is a Web Browser?',
    options: {
      a: 'Google',
      b: 'Bing',
      c: 'Microsoft Edge',
      d: 'Windows',
    },
    correctAnswer: 'c',
  },
  {
    questionNumber: 46,
    section: 'The Internet and Web',
    lessonReference: 'Lesson 7',
    question: 'Where do you type a specific website address (URL)?',
    options: {
      a: 'The Search Bar in the middle of the page.',
      b: 'The Address Bar at the very top.',
      c: 'The Start Menu.',
      d: 'A Word document.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 47,
    section: 'The Internet and Web',
    lessonReference: 'Lesson 7',
    question: 'What is a "Hyperlink"?',
    options: {
      a: 'A fast internet connection.',
      b: 'Text or an image that takes you to another page when clicked.',
      c: 'A type of virus.',
      d: 'A cable for your monitor.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 48,
    section: 'The Internet and Web',
    lessonReference: 'Lesson 7',
    question: 'If you want to save a website to visit later, you should:',
    options: {
      a: 'Print it out.',
      b: 'Bookmark it.',
      c: 'Memorize the address.',
      d: 'Take a photo of the screen.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 49,
    section: 'The Internet and Web',
    lessonReference: 'Lesson 7',
    question: '"Wi-Fi" connects your computer to the internet using:',
    options: {
      a: 'Blue cables.',
      b: 'Wireless radio waves.',
      c: 'Telephone wires only.',
      d: 'Bluetooth.',
    },
    correctAnswer: 'b',
  },
  // Section 8: Software Safety & Defaults (Lesson 8) - Questions 50-56
  {
    questionNumber: 50,
    section: 'Software Safety & Defaults',
    lessonReference: 'Lesson 8',
    question: 'If you double-click a PDF and it opens in the wrong app, how do you fix it permanently?',
    options: {
      a: 'Delete the PDF.',
      b: 'Right-click > Open With > Choose another app (Check "Always use this app").',
      c: 'Restart the computer.',
      d: 'You cannot fix it.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 51,
    section: 'Software Safety & Defaults',
    lessonReference: 'Lesson 8',
    question: 'When installing free software, you should:',
    options: {
      a: 'Click "Next" as fast as possible.',
      b: 'Read carefully and uncheck boxes for extra "junk" software.',
      c: 'Provide your credit card details immediately.',
      d: 'Turn off your antivirus.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 52,
    section: 'Software Safety & Defaults',
    lessonReference: 'Lesson 8',
    question: 'A file ending in .docx usually opens in:',
    options: {
      a: 'Microsoft Word',
      b: 'Adobe Reader',
      c: 'Spotify',
      d: 'Paint',
    },
    correctAnswer: 'a',
  },
  {
    questionNumber: 53,
    section: 'Software Safety & Defaults',
    lessonReference: 'Lesson 8',
    question: 'Which of these is a risk of downloading software from unknown websites?',
    options: {
      a: 'It might be too fast.',
      b: 'It might contain viruses or malware.',
      c: 'It will make your screen too bright.',
      d: 'It will delete your email account automatically.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 54,
    section: 'Software Safety & Defaults',
    lessonReference: 'Lesson 8',
    question: 'What is "Ninite.com" useful for?',
    options: {
      a: 'Watching movies.',
      b: 'Installing multiple safe apps at once without bloatware.',
      c: 'Playing games.',
      d: 'Buying hardware.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 55,
    section: 'Software Safety & Defaults',
    lessonReference: 'Lesson 8',
    question: 'Desktop Apps (Installed) are generally better if:',
    options: {
      a: 'You have no internet connection (Offline).',
      b: 'You want to save hard drive space.',
      c: 'You want to access your work from any computer.',
      d: 'You hate installing things.',
    },
    correctAnswer: 'a',
  },
  {
    questionNumber: 56,
    section: 'Software Safety & Defaults',
    lessonReference: 'Lesson 8',
    question: 'Web Apps (Cloud) are generally better if:',
    options: {
      a: 'You have no internet.',
      b: 'You need to access your work from multiple different computers.',
      c: 'You need the most powerful features possible.',
      d: 'You want to own the software disc.',
    },
    correctAnswer: 'b',
  },
  // Section 9: Care and Safety (Lesson 9) - Questions 57-63
  {
    questionNumber: 57,
    section: 'Care and Safety',
    lessonReference: 'Lesson 9',
    question: 'What are the two biggest enemies of computer hardware?',
    options: {
      a: 'Mouse and Keyboard.',
      b: 'Heat and Dust.',
      c: 'Wi-Fi and Bluetooth.',
      d: 'Software and Updates.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 58,
    section: 'Care and Safety',
    lessonReference: 'Lesson 9',
    question: 'What is the correct way to clean a computer screen?',
    options: {
      a: 'Spray Windex directly on the screen.',
      b: 'Use a dry or slightly damp Microfiber cloth.',
      c: 'Scrub hard with a paper towel.',
      d: 'Use a vacuum cleaner.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 59,
    section: 'Care and Safety',
    lessonReference: 'Lesson 9',
    question: 'Why should you NOT use a laptop on a soft pillow or blanket?',
    options: {
      a: 'It is uncomfortable.',
      b: 'It blocks the airflow vents and causes overheating.',
      c: 'It drains the battery instantly.',
      d: 'It scratches the case.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 60,
    section: 'Care and Safety',
    lessonReference: 'Lesson 9',
    question: '"Ergonomics" refers to:',
    options: {
      a: 'Setting up your workspace to prevent injury and strain.',
      b: 'The speed of your processor.',
      c: 'The cost of the computer.',
      d: 'Cleaning software.',
    },
    correctAnswer: 'a',
  },
  {
    questionNumber: 61,
    section: 'Care and Safety',
    lessonReference: 'Lesson 9',
    question: 'To prevent "Text Neck," your monitor should be:',
    options: {
      a: 'Looking up at you from the floor.',
      b: 'At eye level (top of the screen).',
      c: 'Looking down from the ceiling.',
      d: 'To the far left side.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 62,
    section: 'Care and Safety',
    lessonReference: 'Lesson 9',
    question: 'The "20-20-20 Rule" helps prevent:',
    options: {
      a: 'Back pain.',
      b: 'Digital Eye Strain.',
      c: 'Wrist pain.',
      d: 'Overheating.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 63,
    section: 'Care and Safety',
    lessonReference: 'Lesson 9',
    question: 'If you spill water on your laptop, the first thing you must do is:',
    options: {
      a: 'Turn it off and unplug it immediately.',
      b: 'Use a hair dryer on hot.',
      c: 'Shake it violently.',
      d: 'Turn it on to see if it works.',
    },
    correctAnswer: 'a',
  },
  // Section 10: Capstone Practical (Lesson 10) - Questions 64-70
  {
    questionNumber: 64,
    section: 'Capstone Practical',
    lessonReference: 'Lesson 10',
    question: 'To check your computer\'s RAM and CPU specs, you go to:',
    options: {
      a: 'File Explorer > Downloads.',
      b: 'Settings > System > About.',
      c: 'The Recycle Bin.',
      d: 'Microsoft Edge.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 65,
    section: 'Capstone Practical',
    lessonReference: 'Lesson 10',
    question: 'If an application freezes and won\'t close, you should open:',
    options: {
      a: 'The Start Menu.',
      b: 'Task Manager (Ctrl + Shift + Esc).',
      c: 'File Explorer.',
      d: 'The Calculator.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 66,
    section: 'Capstone Practical',
    lessonReference: 'Lesson 10',
    question: 'In Task Manager, to stop a frozen app, you click:',
    options: {
      a: 'Delete App.',
      b: 'End Task.',
      c: 'Restart Windows.',
      d: 'New Task.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 67,
    section: 'Capstone Practical',
    lessonReference: 'Lesson 10',
    question: 'How do you identify a USB-C port visually?',
    options: {
      a: 'It is a large rectangle.',
      b: 'It is round like a headphone jack.',
      c: 'It is a small, reversible oval.',
      d: 'It has a "Smile" shape.',
    },
    correctAnswer: 'c',
  },
  {
    questionNumber: 68,
    section: 'Capstone Practical',
    lessonReference: 'Lesson 10',
    question: 'When performing a "Hardware Audit," if you see a blue/yellow cable plugged into the wall, it is likely:',
    options: {
      a: 'Power.',
      b: 'Ethernet (Internet).',
      c: 'HDMI.',
      d: 'Audio.',
    },
    correctAnswer: 'b',
  },
  {
    questionNumber: 69,
    section: 'Capstone Practical',
    lessonReference: 'Lesson 10',
    question: 'You want to arrange three windows on one screen. You should use:',
    options: {
      a: 'Snap Layouts (Hover over Maximize).',
      b: 'Minimize all windows.',
      c: 'Close two windows.',
      d: 'Buy two more monitors.',
    },
    correctAnswer: 'a',
  },
  {
    questionNumber: 70,
    section: 'Capstone Practical',
    lessonReference: 'Lesson 10',
    question: 'Restarting your computer solves many problems because:',
    options: {
      a: 'It gives the computer a rest.',
      b: 'It clears the RAM (Memory) and starts fresh.',
      c: 'It deletes old files.',
      d: 'It charges the battery faster.',
    },
    correctAnswer: 'b',
  },
];

async function seedAssignmentQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find Module 1
    const module = await Module.findOne({ title: 'Introduction to Computers' });
    if (!module) {
      console.log('Module "Introduction to Computers" not found');
      process.exit(1);
    }

    // Clear existing questions for this module
    await AssignmentQuestion.deleteMany({ moduleId: module._id });
    console.log('Cleared existing assignment questions');

    // Add moduleId to all questions
    const questionsWithModule = moduleQuestionsSetA.map((q) => ({
      ...q,
      moduleId: module._id,
    }));

    // Insert all questions
    await AssignmentQuestion.insertMany(questionsWithModule);
    console.log(`✅ Inserted ${questionsWithModule.length} assignment questions for Module 1`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding assignment questions:', error);
    process.exit(1);
  }
}

seedAssignmentQuestions();
