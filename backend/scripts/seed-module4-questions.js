const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Module = require('../src/models/Module');
const AssignmentQuestion = require('../src/models/AssignmentQuestion');

const setAJSON = `[
  {
    "questionNumber": 1,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 1",
    "question": "Which view is the main editing view in PowerPoint?",
    "options": {
      "a": "Reading View",
      "b": "Slide Sorter View",
      "c": "Normal View",
      "d": "Notes Page View"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 2,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 1",
    "question": "In Normal View, the pane on the left side of the screen mainly shows:",
    "options": {
      "a": "Notes and comments",
      "b": "Slide thumbnails",
      "c": "Themes only",
      "d": "Animation tools only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 3,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 1",
    "question": "Which view is best when you want to see all slides at once and rearrange them quickly?",
    "options": {
      "a": "Outline View",
      "b": "Slide Sorter View",
      "c": "Notes Page View",
      "d": "Reading View"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 4,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 1",
    "question": "Which view focuses mainly on the text structure of the presentation?",
    "options": {
      "a": "Outline View",
      "b": "Presenter View",
      "c": "Reading View",
      "d": "Slide Show View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 5,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 1",
    "question": "Which view shows one slide together with its notes in a printed-page style?",
    "options": {
      "a": "Reading View",
      "b": "Slide Sorter View",
      "c": "Notes Page View",
      "d": "Normal View"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 6,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 1",
    "question": "Which tab contains the main commands for switching between PowerPoint views?",
    "options": {
      "a": "Insert",
      "b": "View",
      "c": "Home",
      "d": "Design"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 7,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 1",
    "question": "Which view is useful when you want to preview your presentation without going fully full-screen?",
    "options": {
      "a": "Normal View",
      "b": "Notes Page View",
      "c": "Reading View",
      "d": "Outline View"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 8,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 1",
    "question": "Which mode displays the presentation full-screen for the audience?",
    "options": {
      "a": "Slide Show View",
      "b": "Notes Page View",
      "c": "Normal View",
      "d": "Outline View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 9,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 1",
    "question": "Which PowerPoint feature shows the current slide, the next slide, and speaker notes to the presenter only?",
    "options": {
      "a": "Reading View",
      "b": "Presenter View",
      "c": "Slide Sorter View",
      "d": "Outline View"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 10,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 1",
    "question": "In Presenter View, the audience usually sees:",
    "options": {
      "a": "Notes and timer",
      "b": "The current slide only",
      "c": "The next slide preview",
      "d": "The slide thumbnails pane"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 11,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 2",
    "question": "Which option is used to start a completely new presentation from scratch?",
    "options": {
      "a": "Save As",
      "b": "Blank Presentation",
      "c": "Outline View",
      "d": "Slide Sorter"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 12,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 2",
    "question": "A PowerPoint template is best described as:",
    "options": {
      "a": "A printed handout",
      "b": "A prepared design starting point",
      "c": "A type of chart only",
      "d": "A transition effect"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 13,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 2",
    "question": "Which command should you use the first time you save a new presentation?",
    "options": {
      "a": "Save As",
      "b": "Print",
      "c": "Replace",
      "d": "Broadcast"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 14,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 2",
    "question": "Which command saves changes to the same existing presentation file?",
    "options": {
      "a": "Export",
      "b": "Save",
      "c": "Duplicate",
      "d": "New"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 15,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 2",
    "question": "Which command is best when you want another version of the same presentation with a different name?",
    "options": {
      "a": "Open",
      "b": "Save As",
      "c": "Replace Fonts",
      "d": "Preview"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 16,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 2",
    "question": "Which file format is the normal editable PowerPoint presentation format?",
    "options": {
      "a": ".pdf",
      "b": ".pptx",
      "c": ".jpg",
      "d": ".mp4"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 17,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 2",
    "question": "Which tab contains the New Slide command?",
    "options": {
      "a": "Home",
      "b": "View",
      "c": "Slide Show",
      "d": "Review"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 18,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 2",
    "question": "Which command lets you choose a different layout for the selected slide?",
    "options": {
      "a": "Arrange",
      "b": "Layout",
      "c": "Export",
      "d": "Notes"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 19,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 2",
    "question": "Which tab is typically used to insert pictures, shapes, icons, SmartArt, or charts?",
    "options": {
      "a": "Home",
      "b": "Review",
      "c": "Insert",
      "d": "Slide Show"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 20,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 2",
    "question": "Saving to OneDrive is an example of saving to:",
    "options": {
      "a": "Local memory only",
      "b": "A cloud location",
      "c": "A notes pane",
      "d": "A transition gallery"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 21,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 3",
    "question": "A slide layout is best described as:",
    "options": {
      "a": "A slide transition",
      "b": "A predefined arrangement of placeholders",
      "c": "A speaker note style",
      "d": "A print setting"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 22,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 3",
    "question": "Which command is used to change the layout of an existing slide?",
    "options": {
      "a": "Insert > Chart",
      "b": "Home > Layout",
      "c": "Slide Show > From Beginning",
      "d": "View > Notes Page"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 23,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 3",
    "question": "Which layout is most suitable for the opening slide of a presentation?",
    "options": {
      "a": "Blank",
      "b": "Title Slide",
      "c": "Comparison",
      "d": "Two Content"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 24,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 3",
    "question": "Which layout is useful when you want to compare two ideas side by side?",
    "options": {
      "a": "Comparison",
      "b": "Title Only",
      "c": "Blank",
      "d": "Section Zoom"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 25,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 3",
    "question": "Which command restores a slide to its original layout arrangement without deleting its content?",
    "options": {
      "a": "Rehearse Timings",
      "b": "Reset",
      "c": "Duplicate Slide",
      "d": "Print Notes"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 26,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 3",
    "question": "Which tab contains the Themes gallery?",
    "options": {
      "a": "Design",
      "b": "Review",
      "c": "View",
      "d": "Record"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 27,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 3",
    "question": "A PowerPoint theme usually controls the presentation’s:",
    "options": {
      "a": "Speaker notes only",
      "b": "Colors, fonts, effects, and background style",
      "c": "Print copies only",
      "d": "Animation order only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 28,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 3",
    "question": "Which feature lets you change the color style of a theme without changing the whole theme family?",
    "options": {
      "a": "Crop",
      "b": "Variants",
      "c": "Outline View",
      "d": "Arrange"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 29,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 3",
    "question": "Which command is used to save a customized theme for reuse later?",
    "options": {
      "a": "Save Current Theme",
      "b": "Replace Theme",
      "c": "Save as PDF",
      "d": "Notes Master"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 30,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 3",
    "question": "Which pane is most often used to drag slides into a different order in Normal View?",
    "options": {
      "a": "Notes pane",
      "b": "Slide thumbnail pane",
      "c": "Chart data pane",
      "d": "Animation Pane"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 31,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 4",
    "question": "A placeholder is mainly used to:",
    "options": {
      "a": "Lock a slide",
      "b": "Hold content in a predefined layout position",
      "c": "Print handouts",
      "d": "Export the file"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 32,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 4",
    "question": "If you want to place text anywhere on a slide outside the normal layout, you should use a:",
    "options": {
      "a": "Footer",
      "b": "Text box",
      "c": "Theme variant",
      "d": "Section break"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 33,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 4",
    "question": "Which tab contains the main Font and Paragraph formatting tools?",
    "options": {
      "a": "Home",
      "b": "Design",
      "c": "Insert",
      "d": "Slide Show"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 34,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 4",
    "question": "Which option is best for showing unordered key points on a slide?",
    "options": {
      "a": "Numbering",
      "b": "Bullets",
      "c": "Notes Page",
      "d": "Animation Pane"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 35,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 4",
    "question": "Which option is best when the points must follow a sequence?",
    "options": {
      "a": "Grayscale",
      "b": "Bullets",
      "c": "Numbering",
      "d": "Crop"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 36,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 4",
    "question": "Which formatting choice usually makes a title stand out more clearly than body text?",
    "options": {
      "a": "Smaller font size",
      "b": "Larger font size and bold",
      "c": "Pure black print",
      "d": "Hidden slide"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 37,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 4",
    "question": "Which alignment is usually best for most body text on slides?",
    "options": {
      "a": "Left alignment",
      "b": "Center alignment only",
      "c": "Distributed only",
      "d": "Bottom alignment"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 38,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 4",
    "question": "Which PowerPoint tool lets you copy formatting from one object and apply it to another?",
    "options": {
      "a": "Replace Fonts",
      "b": "Format Painter",
      "c": "Notes Master",
      "d": "Slide Master Zoom"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 39,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 4",
    "question": "If text in a placeholder becomes too long, PowerPoint may automatically reduce the font size and spacing using:",
    "options": {
      "a": "Presenter Mode",
      "b": "AutoFit",
      "c": "SmartArt Styles",
      "d": "Outline Print"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 40,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 4",
    "question": "Which feature changes the color behind selected text like a marker effect?",
    "options": {
      "a": "Font Theme",
      "b": "Text Highlight Color",
      "c": "Slide Background",
      "d": "Notes Border"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 41,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 5",
    "question": "Which tab is used to insert a picture onto a slide?",
    "options": {
      "a": "Insert",
      "b": "Review",
      "c": "Slide Show",
      "d": "Animations"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 42,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 5",
    "question": "Which command path is used to insert a picture from your own computer?",
    "options": {
      "a": "View > Pictures > Local",
      "b": "Insert > Pictures > This Device",
      "c": "Home > New Slide > Photo",
      "d": "Design > Format Background"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 43,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 5",
    "question": "Which tab appears when a shape is selected and lets you change Fill, Outline, and Effects?",
    "options": {
      "a": "Shape Format",
      "b": "Record",
      "c": "Notes Master",
      "d": "References"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 44,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 5",
    "question": "Which shape formatting option changes the inside color of a shape?",
    "options": {
      "a": "Shape Outline",
      "b": "Shape Fill",
      "c": "Arrange",
      "d": "Crop to Shape"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 45,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 5",
    "question": "If you type directly into a shape, the text will:",
    "options": {
      "a": "Stay separate from the shape",
      "b": "Attach to the shape and move with it",
      "c": "Print only in Notes Page",
      "d": "Automatically become SmartArt"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 46,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 5",
    "question": "Which PowerPoint feature is best for quickly turning a process, cycle, or hierarchy into a visual diagram?",
    "options": {
      "a": "SmartArt",
      "b": "Slide Sorter",
      "c": "Sections",
      "d": "Handout Master"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 47,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 5",
    "question": "Which command is used to insert SmartArt?",
    "options": {
      "a": "Insert > SmartArt",
      "b": "Home > Reset",
      "c": "View > Outline",
      "d": "File > Export"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 48,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 5",
    "question": "Which SmartArt category is most appropriate for an organization chart?",
    "options": {
      "a": "Process",
      "b": "Hierarchy",
      "c": "Picture Accent",
      "d": "Matrix Title"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 49,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 5",
    "question": "Which command is used to insert a chart on a slide?",
    "options": {
      "a": "Design > Variants",
      "b": "Insert > Chart",
      "c": "Home > Replace",
      "d": "Slide Show > Record"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 50,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 5",
    "question": "When you insert a chart, PowerPoint usually opens a worksheet with:",
    "options": {
      "a": "The final printed handout",
      "b": "Placeholder sample data to replace",
      "c": "The Notes Master",
      "d": "The theme settings only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 51,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 6",
    "question": "Which command helps line up multiple shapes or pictures neatly along shared edges or centers?",
    "options": {
      "a": "Align",
      "b": "Crop",
      "c": "Rehearse",
      "d": "Export"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 52,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 6",
    "question": "Which command spaces selected objects evenly across a slide?",
    "options": {
      "a": "Compress Pictures",
      "b": "Distribute Horizontally or Vertically",
      "c": "Notes Setup",
      "d": "Preview"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 53,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 6",
    "question": "Which feature allows several shapes or objects to behave like one object when moved or resized?",
    "options": {
      "a": "Outline View",
      "b": "Group",
      "c": "Variants",
      "d": "Broadcast"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 54,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 6",
    "question": "Which visual aid appears while dragging objects to help with positioning and spacing?",
    "options": {
      "a": "Smart Guides",
      "b": "Reading View",
      "c": "Print Preview",
      "d": "Taskbar only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 55,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 6",
    "question": "A transition in PowerPoint is the effect that happens:",
    "options": {
      "a": "Inside a text box only",
      "b": "Between one slide and the next",
      "c": "Only in charts",
      "d": "Only in Presenter View"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 56,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 6",
    "question": "Which tab contains the transition gallery?",
    "options": {
      "a": "Transitions",
      "b": "Review",
      "c": "Home",
      "d": "View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 57,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 6",
    "question": "Which command applies the same transition to every slide in the presentation?",
    "options": {
      "a": "Reset All",
      "b": "Apply To All",
      "c": "Duplicate Slide",
      "d": "Group Objects"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 58,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 6",
    "question": "Which option removes a transition from a selected slide?",
    "options": {
      "a": "Remove Sound",
      "b": "None",
      "c": "Reset Notes",
      "d": "Clear Animation Pane"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 59,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 6",
    "question": "An animation in PowerPoint is applied to:",
    "options": {
      "a": "The movement between slides only",
      "b": "Objects or text on a slide",
      "c": "Print layouts only",
      "d": "Theme colors only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 60,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 6",
    "question": "Which tab is used to animate text, pictures, and shapes?",
    "options": {
      "a": "Animations",
      "b": "Design",
      "c": "Notes Page",
      "d": "File"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 61,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 7",
    "question": "Which start option makes an animation begin only when you click the slide?",
    "options": {
      "a": "With Previous",
      "b": "After Previous",
      "c": "On Click",
      "d": "On Export"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 62,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 7",
    "question": "Which start option makes an animation begin at the same time as the previous animation?",
    "options": {
      "a": "With Previous",
      "b": "After Previous",
      "c": "On Click",
      "d": "With Presenter"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 63,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 7",
    "question": "Which start option makes an animation begin automatically after the previous one ends?",
    "options": {
      "a": "On Click",
      "b": "After Previous",
      "c": "Mirror Show",
      "d": "None"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 64,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 7",
    "question": "Which pane shows all animations on the current slide and helps you reorder them?",
    "options": {
      "a": "Notes Pane",
      "b": "Animation Pane",
      "c": "Selection Pane",
      "d": "Outline Pane"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 65,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 7",
    "question": "Which keyboard key starts a slide show from the first slide?",
    "options": {
      "a": "F5",
      "b": "F2",
      "c": "Esc",
      "d": "Tab"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 66,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 7",
    "question": "Which keyboard shortcut starts a slide show from the currently selected slide?",
    "options": {
      "a": "Ctrl + F5",
      "b": "Shift + F5",
      "c": "Alt + F5",
      "d": "Ctrl + Enter"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 67,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 7",
    "question": "Which key ends a running slide show?",
    "options": {
      "a": "Delete",
      "b": "Esc",
      "c": "Backspace",
      "d": "Shift"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 68,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 7",
    "question": "Which feature lets the presenter see notes, next slide, and timing tools while the audience sees only the presentation?",
    "options": {
      "a": "Outline View",
      "b": "Presenter View",
      "c": "Reading View",
      "d": "Slide Sorter View"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 69,
    "section": "Printing, Notes, Handouts & Exporting",
    "lessonReference": "Lesson 7",
    "question": "Which part of PowerPoint is used to type speaker notes while editing a slide?",
    "options": {
      "a": "Taskbar",
      "b": "Notes pane",
      "c": "Animation Pane",
      "d": "Status line only"
    },
    "correctAnswer": "b"
  }
]`;
const setBJSON = `[
  {
    "questionNumber": 70,
    "section": "Printing, Notes, Handouts & Exporting",
    "lessonReference": "Lesson 7",
    "question": "Which menu path is used to print slides, handouts, or notes?",
    "options": {
      "a": "Home > Print Layout",
      "b": "File > Print",
      "c": "Insert > Notes",
      "d": "View > Export"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 71,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 8",
    "question": "Which view is best for editing slides one at a time while still seeing thumbnails and notes?",
    "options": {
      "a": "Normal View",
      "b": "Reading View",
      "c": "Slide Show View",
      "d": "Outline View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 72,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 8",
    "question": "Which view shows the presentation mainly as text without pictures or graphics?",
    "options": {
      "a": "Notes Page View",
      "b": "Outline View",
      "c": "Slide Show View",
      "d": "Presenter View"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 73,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 8",
    "question": "Which view is most suitable when checking whether the presentation order makes sense visually?",
    "options": {
      "a": "Slide Sorter View",
      "b": "Notes Page View",
      "c": "Reading View",
      "d": "Outline View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 74,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 8",
    "question": "Which part of Normal View is used to add speaker notes while editing?",
    "options": {
      "a": "Slide thumbnail pane",
      "b": "Notes pane",
      "c": "Status bar",
      "d": "Theme gallery"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 75,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 8",
    "question": "Which view is most often used when creating and formatting slides?",
    "options": {
      "a": "Reading View",
      "b": "Normal View",
      "c": "Slide Show View",
      "d": "Notes Master View"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 76,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 8",
    "question": "Which view is useful if you want to print or review the slide together with its notes?",
    "options": {
      "a": "Outline View",
      "b": "Notes Page View",
      "c": "Slide Sorter View",
      "d": "Reading View"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 77,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 8",
    "question": "Which view shortcut is commonly found at the bottom-right of the PowerPoint window?",
    "options": {
      "a": "Print Layout",
      "b": "Normal, Slide Sorter, and Reading View",
      "c": "Only Notes Page",
      "d": "Only Presenter View"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 78,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 8",
    "question": "Which tab would you use first if you wanted to switch from Normal View to Slide Sorter View?",
    "options": {
      "a": "Home",
      "b": "View",
      "c": "Review",
      "d": "Insert"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 79,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 8",
    "question": "Which feature is specifically designed to support the presenter during delivery?",
    "options": {
      "a": "Notes Page View",
      "b": "Presenter View",
      "c": "Outline View",
      "d": "Slide Sorter View"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 80,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 8",
    "question": "In Presenter View, which item helps the presenter know what is coming next?",
    "options": {
      "a": "Printer list",
      "b": "Next slide preview",
      "c": "Theme variants",
      "d": "Hidden comments"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 81,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 9",
    "question": "Which option on the start screen is used when you want to avoid using a template?",
    "options": {
      "a": "Export",
      "b": "Blank Presentation",
      "c": "Slide Show",
      "d": "Handout"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 82,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 9",
    "question": "Which PowerPoint feature helps you begin with a professionally designed look?",
    "options": {
      "a": "Notes pane",
      "b": "Template",
      "c": "Outline",
      "d": "Animation Pane"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 83,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 9",
    "question": "Which command should be used regularly while working so you do not lose recent changes?",
    "options": {
      "a": "Save",
      "b": "Replace",
      "c": "New Slide",
      "d": "Review"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 84,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 9",
    "question": "Which command creates a second saved version of the presentation under a new name?",
    "options": {
      "a": "Save As",
      "b": "Save",
      "c": "Open",
      "d": "Duplicate Slide"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 85,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 9",
    "question": "Which format is generally best if you want to continue editing the presentation later in PowerPoint?",
    "options": {
      "a": "PDF",
      "b": "PPTX",
      "c": "JPG",
      "d": "MP4"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 86,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 9",
    "question": "Which storage option allows me to access the presentation across devices if I sign in?",
    "options": {
      "a": "Clipboard",
      "b": "OneDrive",
      "c": "Notes pane",
      "d": "Slide footer"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 87,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 9",
    "question": "Which tab contains the command used to add a new slide?",
    "options": {
      "a": "Home",
      "b": "View",
      "c": "Record",
      "d": "Transitions"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 88,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 9",
    "question": "Which command is used to choose a different structure for the selected slide content?",
    "options": {
      "a": "Layout",
      "b": "Replace Font",
      "c": "Animate",
      "d": "Distribute"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 89,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 9",
    "question": "Which tab would I usually use first to insert a picture into a presentation?",
    "options": {
      "a": "Design",
      "b": "Insert",
      "c": "Slide Show",
      "d": "View"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 90,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 9",
    "question": "Saving a file with a clear title such as “Sales Meeting June” is better than “Presentation1” because it:",
    "options": {
      "a": "makes the file smaller",
      "b": "creates a better theme",
      "c": "makes the file easier to identify later",
      "d": "adds notes automatically"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 91,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 10",
    "question": "Which layout usually contains a title placeholder and one main content placeholder?",
    "options": {
      "a": "Title and Content",
      "b": "Blank",
      "c": "Section Zoom",
      "d": "Slide Master"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 92,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 10",
    "question": "Which layout is most suitable if I want complete freedom with no placeholders?",
    "options": {
      "a": "Title Slide",
      "b": "Comparison",
      "c": "Blank",
      "d": "Two Content"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 93,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 10",
    "question": "Which command is useful if I changed a slide layout and want to return to the original placeholder arrangement?",
    "options": {
      "a": "Reset",
      "b": "Reuse Slides",
      "c": "Record Slide Show",
      "d": "Export"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 94,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 10",
    "question": "Which pane is most often used to drag slides into a different order while editing?",
    "options": {
      "a": "Notes Pane",
      "b": "Slide thumbnail pane",
      "c": "Chart worksheet",
      "d": "Header area"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 95,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 10",
    "question": "Which command copies the selected slide directly so you can reuse its basic structure?",
    "options": {
      "a": "Reset",
      "b": "Duplicate Slide",
      "c": "Hide Slide",
      "d": "Export Slide"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 96,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 10",
    "question": "Which tab contains theme thumbnails for changing the overall presentation design?",
    "options": {
      "a": "Design",
      "b": "Home",
      "c": "Review",
      "d": "Help"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 97,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 10",
    "question": "Which feature lets you alter the colors, fonts, or effects of the current theme without replacing it completely?",
    "options": {
      "a": "Notes Pages",
      "b": "Variants",
      "c": "Rehearse Timings",
      "d": "Arrange"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 98,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 10",
    "question": "A custom theme is useful because it:",
    "options": {
      "a": "removes all formatting",
      "b": "can be reused in future presentations",
      "c": "deletes slide layouts",
      "d": "hides animations"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 99,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 10",
    "question": "Which option is used to save your current customized theme?",
    "options": {
      "a": "Save Current Theme",
      "b": "Export Theme to Video",
      "c": "Print Layout",
      "d": "Replace Theme"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 100,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 10",
    "question": "A theme affects:",
    "options": {
      "a": "slide color and design consistency",
      "b": "only speaker notes",
      "c": "only slide numbering",
      "d": "only print margins"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 101,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 11",
    "question": "Which type of container is already built into many layouts for adding text?",
    "options": {
      "a": "Placeholder",
      "b": "Footer",
      "c": "Ruler",
      "d": "Chart Legend"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 102,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 11",
    "question": "Which object gives extra freedom for placing text anywhere on a slide?",
    "options": {
      "a": "SmartArt",
      "b": "Text box",
      "c": "Slide Number",
      "d": "Width guide"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 103,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 11",
    "question": "Which tab contains bold, italic, underline, and font size tools?",
    "options": {
      "a": "Home",
      "b": "Design",
      "c": "View",
      "d": "Slide Show"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 104,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 11",
    "question": "Which format is usually better for a sequence of steps?",
    "options": {
      "a": "Bulleted list",
      "b": "Numbered list",
      "c": "Paragraph note",
      "d": "Theme style"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 105,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 11",
    "question": "Which format is usually better for a group of key points where order does not matter?",
    "options": {
      "a": "Numbered list",
      "b": "Bulleted list",
      "c": "Export list",
      "d": "Comments list"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 106,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 11",
    "question": "Which option helps create emphasis by making text thicker and darker?",
    "options": {
      "a": "Italic",
      "b": "Bold",
      "c": "Underline",
      "d": "Delay"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 107,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 11",
    "question": "Which option changes the leaning style of letters?",
    "options": {
      "a": "Underline",
      "b": "Italic",
      "c": "Shadow pane",
      "d": "Notes master"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 108,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 11",
    "question": "Which option draws a line under the selected text?",
    "options": {
      "a": "Highlight",
      "b": "Underline",
      "c": "Shadows",
      "d": "Group"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 109,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 11",
    "question": "Which alignment is usually best for a large block of slide text because it is easiest to read quickly?",
    "options": {
      "a": "Left",
      "b": "Right",
      "c": "Center",
      "d": "Vertical Middle"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 110,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 11",
    "question": "Which tool is best for applying the same title formatting across multiple slides quickly?",
    "options": {
      "a": "SmartArt",
      "b": "Format Painter",
      "c": "Print Layout",
      "d": "Selection Pane"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 111,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 12",
    "question": "Which feature may automatically shrink text if too much is typed into a placeholder?",
    "options": {
      "a": "Presenter View",
      "b": "AutoFit",
      "c": "Notes Master",
      "d": "Zoom"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 112,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 12",
    "question": "Which feature changes the color of the letters themselves?",
    "options": {
      "a": "Font Color",
      "b": "Slide Background",
      "c": "Theme Variant",
      "d": "Handout Style"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 113,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 12",
    "question": "Which feature changes the color behind text like a marker?",
    "options": {
      "a": "Font Theme",
      "b": "Text Highlight Color",
      "c": "Shape Fill",
      "d": "Reading Mode"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 114,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 12",
    "question": "Which command can be used to remove or adjust bullets and numbering on selected lines?",
    "options": {
      "a": "Home > Paragraph group",
      "b": "Review > Compare",
      "c": "File > Print",
      "d": "Design > Themes"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 115,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 12",
    "question": "Which path is used to insert stock images into a PowerPoint slide?",
    "options": {
      "a": "Home > Pictures > Gallery",
      "b": "Insert > Pictures > Stock Images",
      "c": "View > Stock Pictures",
      "d": "Design > Image Variant"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 116,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 12",
    "question": "Which path is used to search web-based images directly from PowerPoint?",
    "options": {
      "a": "Insert > Pictures > Online Pictures",
      "b": "Review > Search Web",
      "c": "View > Picture Search",
      "d": "Home > Replace Picture"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 117,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 12",
    "question": "After inserting a picture, which action is usually used to make it fit the slide better?",
    "options": {
      "a": "Print it",
      "b": "Resize and reposition it",
      "c": "Export it",
      "d": "Convert it to notes"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 118,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 12",
    "question": "Which category of tool includes arrows, circles, rectangles, and callouts?",
    "options": {
      "a": "SmartArt",
      "b": "Shapes",
      "c": "Themes",
      "d": "Slide Masters"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 119,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 12",
    "question": "Which formatting option changes the border color or border style of a shape?",
    "options": {
      "a": "Shape Fill",
      "b": "Shape Outline",
      "c": "Shape Notes",
      "d": "Arrange Photo"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 120,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 12",
    "question": "Which formatting option adds a shadow, glow, or reflection to a shape?",
    "options": {
      "a": "Shape Effects",
      "b": "Shape Crop",
      "c": "Slide Background",
      "d": "Bullet Effects"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 121,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 13",
    "question": "If I want to label a process visually with arrows and boxes, which tool is often a good choice?",
    "options": {
      "a": "Shapes",
      "b": "Audio Notes",
      "c": "Handout Master",
      "d": "Outline Print"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 122,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 13",
    "question": "Which feature converts structured information into ready-made visual diagrams?",
    "options": {
      "a": "SmartArt",
      "b": "Hyperlink",
      "c": "Printer Setup",
      "d": "Slide Number"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 123,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 13",
    "question": "Which SmartArt category is best for showing repeating stages?",
    "options": {
      "a": "Hierarchy",
      "b": "Process",
      "c": "Cycle",
      "d": "Pyramid only"
    },
    "correctAnswer": "c"
  },
  {
    "questionNumber": 124,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 13",
    "question": "Which SmartArt category is best for showing reporting lines or levels?",
    "options": {
      "a": "List",
      "b": "Hierarchy",
      "c": "Picture",
      "d": "Notes"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 125,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 13",
    "question": "Which command on SmartArt Design lets you insert another box before or after an existing one?",
    "options": {
      "a": "Add Shape",
      "b": "Replace Node",
      "c": "Animate Shape",
      "d": "Fit Shape"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 126,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 13",
    "question": "Which command changes the color set of the whole SmartArt graphic?",
    "options": {
      "a": "Change Colors",
      "b": "Change Layout to Notes",
      "c": "Change Slide Show",
      "d": "Change Printer"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 127,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 13",
    "question": "Which feature is best for showing numerical comparisons visually?",
    "options": {
      "a": "Chart",
      "b": "Text Box",
      "c": "Outline View",
      "d": "Smart Guide"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 128,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 13",
    "question": "Which tab is usually used first when adding a chart to a slide?",
    "options": {
      "a": "Insert",
      "b": "Review",
      "c": "Slide Show",
      "d": "Record"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 129,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 13",
    "question": "After inserting a chart, where do you usually replace the sample values with your own data?",
    "options": {
      "a": "Notes pane",
      "b": "The worksheet that appears",
      "c": "Footer settings",
      "d": "Presenter View"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 130,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 13",
    "question": "Which command is most useful when you want three shapes spaced evenly across the slide?",
    "options": {
      "a": "Group",
      "b": "Distribute Horizontally",
      "c": "Duplicate Slide",
      "d": "Print Handout"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 131,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 14",
    "question": "Which option is most useful when you want two pictures lined up neatly along the same top edge?",
    "options": {
      "a": "Notes Page",
      "b": "Align Top",
      "c": "Move Later",
      "d": "Outline"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 132,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 14",
    "question": "Which feature helps several objects behave as one when moving or resizing?",
    "options": {
      "a": "Group",
      "b": "Slide Sorter",
      "c": "Rehearse Timings",
      "d": "Background Graphics"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 133,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 14",
    "question": "Which effect controls how one slide leaves and the next one appears?",
    "options": {
      "a": "Animation",
      "b": "Transition",
      "c": "Grouping",
      "d": "Chart Style"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 134,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 14",
    "question": "Which tab should be used if I want to apply a Fade or Wipe between slides?",
    "options": {
      "a": "Transitions",
      "b": "Home",
      "c": "View",
      "d": "Design"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 135,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 14",
    "question": "Which option on the Transitions tab lets me change the direction of some transitions?",
    "options": {
      "a": "Effect Options",
      "b": "Shape Fill",
      "c": "Add Animation",
      "d": "Notes Style"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 136,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 14",
    "question": "Which option lets me make the same transition style run across the entire presentation?",
    "options": {
      "a": "Replace All",
      "b": "Apply To All",
      "c": "Preview All",
      "d": "Export All"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 137,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 14",
    "question": "Which command removes the transition from the selected slide?",
    "options": {
      "a": "Remove from Notes",
      "b": "None",
      "c": "Delete Slide",
      "d": "Hide Slide"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 138,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 14",
    "question": "Which tab is used if I want an object to appear, disappear, or move on the slide itself?",
    "options": {
      "a": "Animations",
      "b": "Transitions",
      "c": "Review",
      "d": "File"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 139,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 14",
    "question": "Which type of start setting requires the presenter to trigger the animation manually?",
    "options": {
      "a": "With Previous",
      "b": "After Previous",
      "c": "On Click",
      "d": "Use Timings"
    },
    "correctAnswer": "c"
  }
]`;
const setCJSON = `[
  {
    "questionNumber": 140,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 14",
    "question": "Which feature helps the presenter see notes and the next slide while speaking?",
    "options": {
      "a": "Reading View",
      "b": "Presenter View",
      "c": "Handout View",
      "d": "Notes Page only"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 141,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 15",
    "question": "Which view is designed mainly for delivering the presentation to an audience?",
    "options": {
      "a": "Slide Show View",
      "b": "Outline View",
      "c": "Notes Page View",
      "d": "Slide Sorter View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 142,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 15",
    "question": "Which view is useful when checking the text organization of the whole presentation?",
    "options": {
      "a": "Outline View",
      "b": "Presenter View",
      "c": "Notes Master",
      "d": "Handout Preview"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 143,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 15",
    "question": "Which area of the Normal View is mainly used to switch quickly from one slide to another?",
    "options": {
      "a": "Notes pane",
      "b": "Slide thumbnail pane",
      "c": "Animation Pane",
      "d": "Print preview pane"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 144,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 15",
    "question": "Which tab contains commands such as Normal, Slide Sorter, Notes Page, and Reading View?",
    "options": {
      "a": "View",
      "b": "Design",
      "c": "Insert",
      "d": "File"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 145,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 15",
    "question": "Which view is useful for previewing the presentation inside the PowerPoint window instead of fully full-screen?",
    "options": {
      "a": "Reading View",
      "b": "Slide Show View",
      "c": "Outline View",
      "d": "Notes Page View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 146,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 15",
    "question": "Which view is best for editing notes in more of a page-style layout?",
    "options": {
      "a": "Notes Page View",
      "b": "Reading View",
      "c": "Slide Show View",
      "d": "Slide Sorter View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 147,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 15",
    "question": "Which mode is mainly for the presenter and not the audience?",
    "options": {
      "a": "Presenter View",
      "b": "Reading View",
      "c": "Slide Sorter View",
      "d": "Outline View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 148,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 15",
    "question": "What does Presenter View typically show besides the current slide?",
    "options": {
      "a": "Next slide and notes",
      "b": "Handout layout and print queue",
      "c": "Outline only",
      "d": "Theme fonts and variants"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 149,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 15",
    "question": "Which view is most useful when checking whether slide order should be changed?",
    "options": {
      "a": "Slide Sorter View",
      "b": "Notes Page View",
      "c": "Presenter View",
      "d": "Reading View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 150,
    "section": "Interface & Slide Views",
    "lessonReference": "Lesson 15",
    "question": "Which view usually becomes your main workspace while building slides?",
    "options": {
      "a": "Normal View",
      "b": "Reading View",
      "c": "Slide Show View",
      "d": "Hidden Slide View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 151,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 16",
    "question": "Which start option creates a new presentation without any built-in design besides the default?",
    "options": {
      "a": "Blank Presentation",
      "b": "Export Presentation",
      "c": "Slide Master",
      "d": "Notes Page"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 152,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 16",
    "question": "A template mainly helps by:",
    "options": {
      "a": "forcing narration",
      "b": "giving a prepared visual design starting point",
      "c": "removing all slide layouts",
      "d": "printing notes automatically"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 153,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 16",
    "question": "Which command should be used if you want to save your presentation in a new folder?",
    "options": {
      "a": "Save As",
      "b": "Save",
      "c": "Replace Fonts",
      "d": "Reuse Slides"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 154,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 16",
    "question": "Which format is usually best when you want people to edit the slides later?",
    "options": {
      "a": "PPTX",
      "b": "PDF",
      "c": "PNG",
      "d": "MP4"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 155,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 16",
    "question": "Which format is best when you want to preserve the layout for viewing but not allow easy editing?",
    "options": {
      "a": "PDF",
      "b": "PPTX",
      "c": "POTX",
      "d": "WAV"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 156,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 16",
    "question": "Which tab contains New Slide and Layout commands?",
    "options": {
      "a": "Home",
      "b": "View",
      "c": "Slide Show",
      "d": "Record"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 157,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 16",
    "question": "Which command changes a slide’s placeholder structure without creating a new slide?",
    "options": {
      "a": "Layout",
      "b": "New Slide",
      "c": "Rehearse Timings",
      "d": "Export"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 158,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 16",
    "question": "Which tab is used to add visual elements like icons, SmartArt, and charts?",
    "options": {
      "a": "Insert",
      "b": "Review",
      "c": "Design",
      "d": "View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 159,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 16",
    "question": "Which location is best described as cloud-based storage?",
    "options": {
      "a": "OneDrive",
      "b": "Status bar",
      "c": "Notes pane",
      "d": "Slide Sorter"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 160,
    "section": "Create & Save Presentations",
    "lessonReference": "Lesson 16",
    "question": "Which saving habit is the most professional while creating a presentation?",
    "options": {
      "a": "Wait until the end to save",
      "b": "Save early and save regularly",
      "c": "Save only after printing",
      "d": "Only save when PowerPoint asks"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 161,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 17",
    "question": "Which layout best suits a slide where you want two different content areas side by side?",
    "options": {
      "a": "Two Content or Comparison",
      "b": "Blank only",
      "c": "Notes Page",
      "d": "Slide Show"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 162,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 17",
    "question": "Which command is used to duplicate an existing slide?",
    "options": {
      "a": "Duplicate Slide",
      "b": "Apply To All",
      "c": "Save Current Theme",
      "d": "Replace Font"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 163,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 17",
    "question": "Which action is used to change the order of slides quickly in the left pane?",
    "options": {
      "a": "Drag the slide thumbnails",
      "b": "Add bullets",
      "c": "Change the notes pane",
      "d": "Open Presenter View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 164,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 17",
    "question": "Which tab contains the gallery of themes?",
    "options": {
      "a": "Design",
      "b": "Home",
      "c": "Review",
      "d": "File"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 165,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 17",
    "question": "Which feature changes the coordinated colors, fonts, and effects used by the presentation?",
    "options": {
      "a": "Theme",
      "b": "Notes Page",
      "c": "Animation Pane",
      "d": "Zip folder"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 166,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 17",
    "question": "Which feature provides alternate versions of a selected theme’s style?",
    "options": {
      "a": "Variants",
      "b": "Handout Master",
      "c": "Current Slide Only",
      "d": "Outline Print"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 167,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 17",
    "question": "Which command saves the style you created so it can be used in future presentations?",
    "options": {
      "a": "Save Current Theme",
      "b": "Save as JPG",
      "c": "Replace Current Layout",
      "d": "Compress Media"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 168,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 17",
    "question": "Which command can restore layout placeholders if they were moved or altered?",
    "options": {
      "a": "Reset",
      "b": "Print Preview",
      "c": "Reorder Animation",
      "d": "Broadcast"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 169,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 17",
    "question": "Which statement about themes is correct?",
    "options": {
      "a": "Themes affect only one slide at a time by default",
      "b": "Themes help keep the presentation visually consistent",
      "c": "Themes affect handouts only",
      "d": "Themes are only for charts"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 170,
    "section": "Slides & Themes",
    "lessonReference": "Lesson 17",
    "question": "Which slide organization method is best for quick visual review of the whole deck?",
    "options": {
      "a": "Slide Sorter View",
      "b": "Notes Page View",
      "c": "Outline Print",
      "d": "Record Slide Show"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 171,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 18",
    "question": "Which PowerPoint object is best when I want to place a caption near a picture?",
    "options": {
      "a": "Text box",
      "b": "Header",
      "c": "Slide sorter",
      "d": "Section"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 172,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 18",
    "question": "If I want the text to move with a rectangle or arrow, I should:",
    "options": {
      "a": "add a footnote",
      "b": "type directly into the shape",
      "c": "print it as notes",
      "d": "create a PDF"
    },
    "correctAnswer": "b"
  },
  {
    "questionNumber": 173,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 18",
    "question": "Which tab contains most of the font styling commands?",
    "options": {
      "a": "Home",
      "b": "View",
      "c": "Transitions",
      "d": "Slide Show"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 174,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 18",
    "question": "Which formatting tool changes the actual typeface, such as Arial or Calibri?",
    "options": {
      "a": "Font",
      "b": "Slide Background",
      "c": "Duration",
      "d": "Layout"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 175,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 18",
    "question": "Which formatting tool changes how large the text appears?",
    "options": {
      "a": "Font Size",
      "b": "Notes Size",
      "c": "Theme Style",
      "d": "Slide Number"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 176,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 18",
    "question": "Which style is most suitable for unordered points on a presentation slide?",
    "options": {
      "a": "Bulleted list",
      "b": "Numbered list",
      "c": "Outline print",
      "d": "Comments list"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 177,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 18",
    "question": "Which style is most suitable for step-by-step instructions?",
    "options": {
      "a": "Numbered list",
      "b": "Bulleted list",
      "c": "Footer text",
      "d": "Theme color"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 178,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 18",
    "question": "Which option helps make selected text stand out by darkening and strengthening it?",
    "options": {
      "a": "Bold",
      "b": "Italic",
      "c": "Delay",
      "d": "Crop"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 179,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 18",
    "question": "Which option places a line underneath selected text?",
    "options": {
      "a": "Underline",
      "b": "Shadow",
      "c": "Glow",
      "d": "Delay"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 180,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 18",
    "question": "Which alignment is often best for slide titles when you want formal, easy reading?",
    "options": {
      "a": "It depends, but center or left are common",
      "b": "Bottom only",
      "c": "Distributed only",
      "d": "Hidden"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 181,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 19",
    "question": "Which feature can copy the exact text formatting from one title to another?",
    "options": {
      "a": "Format Painter",
      "b": "SmartArt",
      "c": "Animation Pane",
      "d": "Replace Theme"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 182,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 19",
    "question": "Which feature may reduce font size to keep all text inside a placeholder?",
    "options": {
      "a": "AutoFit",
      "b": "Print Scaling",
      "c": "Gridlines",
      "d": "Presenter Notes"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 183,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 19",
    "question": "Which option changes the letters’ color directly?",
    "options": {
      "a": "Font Color",
      "b": "Text Box Outline",
      "c": "Handout Color",
      "d": "Slide Size"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 184,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 19",
    "question": "Which option changes the background behind words for emphasis?",
    "options": {
      "a": "Text Highlight Color",
      "b": "Shadow",
      "c": "Slide Background",
      "d": "Replace Font"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 185,
    "section": "Text, Lists & Formatting",
    "lessonReference": "Lesson 19",
    "question": "Which dialog gives more detailed control of alignment, spacing, and indentation?",
    "options": {
      "a": "Paragraph dialog box",
      "b": "Print dialog only",
      "c": "Export box",
      "d": "Notes Master pane"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 186,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 19",
    "question": "Which insert option can be used when I want Microsoft-provided images without searching the wider web?",
    "options": {
      "a": "Stock Images",
      "b": "Motion Path",
      "c": "Replace Layout",
      "d": "Notes Pages"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 187,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 19",
    "question": "Which step usually comes after inserting a picture so it fits a slide better?",
    "options": {
      "a": "Resize and move it",
      "b": "Delete the placeholder",
      "c": "Print the outline",
      "d": "Reorder animations"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 188,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 19",
    "question": "Which Insert tool includes rectangles, circles, arrows, stars, and callouts?",
    "options": {
      "a": "Shapes",
      "b": "SmartArt only",
      "c": "Chart Elements",
      "d": "Notes tools"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 189,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 19",
    "question": "Which tab appears when I select a shape and want to modify its style?",
    "options": {
      "a": "Shape Format",
      "b": "Reading View",
      "c": "Notes Master",
      "d": "Slide Show"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 190,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 19",
    "question": "Which option changes the inside appearance of a shape?",
    "options": {
      "a": "Shape Fill",
      "b": "Shape Order",
      "c": "Notes Format",
      "d": "Rehearse Color"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 191,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 20",
    "question": "Which option changes the border line of a shape?",
    "options": {
      "a": "Shape Outline",
      "b": "Shape Pane",
      "c": "Slide Border",
      "d": "Theme Background"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 192,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 20",
    "question": "Which option adds shadow, glow, or reflection to a shape?",
    "options": {
      "a": "Shape Effects",
      "b": "Slide Effects",
      "c": "Outline Effects",
      "d": "Print Effects"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 193,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 20",
    "question": "If I want a process diagram without drawing each box manually, I should use:",
    "options": {
      "a": "SmartArt",
      "b": "Notes Pages",
      "c": "Speaker View",
      "d": "Handouts"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 194,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 20",
    "question": "Which SmartArt category is best for showing ordered steps?",
    "options": {
      "a": "Process",
      "b": "Hierarchy",
      "c": "Picture",
      "d": "Relationship only"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 195,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 20",
    "question": "Which SmartArt category is often best for showing connected ideas or cause-and-effect?",
    "options": {
      "a": "Relationship",
      "b": "Notes",
      "c": "Export",
      "d": "Review"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 196,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 20",
    "question": "Which command lets me insert another shape inside a SmartArt graphic?",
    "options": {
      "a": "Add Shape",
      "b": "Add Printer",
      "c": "Add Transition",
      "d": "Add Narration"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 197,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 20",
    "question": "Which command changes the color family of the whole SmartArt graphic at once?",
    "options": {
      "a": "Change Colors",
      "b": "Change Placeholder",
      "c": "Change Pane",
      "d": "Change Notes"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 198,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 20",
    "question": "Which PowerPoint feature is most suitable for displaying sales figures or survey totals visually?",
    "options": {
      "a": "Chart",
      "b": "Text box",
      "c": "Notes pane",
      "d": "Reading View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 199,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 20",
    "question": "After inserting a chart, what should I normally do next?",
    "options": {
      "a": "Replace the sample data in the worksheet",
      "b": "Export it as PDF immediately",
      "c": "Open Notes Page",
      "d": "Turn on Presenter View"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 200,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 20",
    "question": "Which command helps make multiple objects line up neatly?",
    "options": {
      "a": "Align",
      "b": "Save",
      "c": "Delay",
      "d": "Record"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 201,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 21",
    "question": "Which command helps make the spaces between multiple objects equal?",
    "options": {
      "a": "Distribute",
      "b": "Duplicate",
      "c": "Outline",
      "d": "Rehearse"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 202,
    "section": "Pictures, Shapes, SmartArt & Charts",
    "lessonReference": "Lesson 21",
    "question": "Which feature lets several selected objects move as one unit?",
    "options": {
      "a": "Group",
      "b": "Variants",
      "c": "Reading View",
      "d": "Outline Pane"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 203,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 21",
    "question": "Which type of effect occurs when moving from one slide to the next?",
    "options": {
      "a": "Transition",
      "b": "Animation",
      "c": "Shape Effect",
      "d": "Grouping"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 204,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 21",
    "question": "Which command on the Transitions tab changes the direction or style of some transitions?",
    "options": {
      "a": "Effect Options",
      "b": "Add Animation",
      "c": "Notes Layout",
      "d": "Replace"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 205,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 21",
    "question": "Which setting determines how long a transition takes?",
    "options": {
      "a": "Duration",
      "b": "Delay only",
      "c": "Print Color",
      "d": "Theme Variant"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 206,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 21",
    "question": "Which feature is used to animate objects already on a slide?",
    "options": {
      "a": "Animations tab",
      "b": "Slide Sorter",
      "c": "Notes Pane",
      "d": "Footer setup"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 207,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 21",
    "question": "Which pane is essential when managing several animations on one slide?",
    "options": {
      "a": "Animation Pane",
      "b": "Outline Pane",
      "c": "Notes Pane",
      "d": "Print Pane"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 208,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 21",
    "question": "Which start option makes an animation play without another click immediately after the previous one?",
    "options": {
      "a": "After Previous",
      "b": "On Click",
      "c": "With Previous only",
      "d": "Apply to All"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 209,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 21",
    "question": "Which command starts the slide show from the currently selected slide?",
    "options": {
      "a": "From Current Slide",
      "b": "From Beginning",
      "c": "Notes Page",
      "d": "Current Print"
    },
    "correctAnswer": "a"
  },
  {
    "questionNumber": 210,
    "section": "Transitions, Animations & Slide Show Delivery",
    "lessonReference": "Lesson 21",
    "question": "Which feature is designed specifically to help the presenter view notes, timing, and next slide while presenting?",
    "options": {
      "a": "Presenter View",
      "b": "Reading View",
      "c": "Outline View",
      "d": "Slide Sorter View"
    },
    "correctAnswer": "a"
  }
]`;

async function seedModule4Questions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const module = await Module.findOne({ order: 4 });
    if (!module) {
      console.log('Module 4 not found');
      process.exit(1);
    }

    await AssignmentQuestion.deleteMany({ moduleId: module._id });
    console.log('Cleared existing questions for Module 4');

    const setA = JSON.parse(setAJSON);
    const setB = JSON.parse(setBJSON);
    const setC = JSON.parse(setCJSON);

    const allQuestions = [...setA, ...setB, ...setC].map(q => ({
      ...q,
      moduleId: module._id
    }));

    await AssignmentQuestion.insertMany(allQuestions);
    console.log(`✅ Successfully seeded ${allQuestions.length} questions for Module 4`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedModule4Questions();
