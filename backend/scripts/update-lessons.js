require('dotenv').config();
const mongoose = require('mongoose');
const Lesson = require('../src/models/Lesson');
const Module = require('../src/models/Module');

const lessonData = [
  {
    order: 1,
    title: 'Introduction to Computers',
    description: 'We learn what a computer actually is and how it takes in information, thinks about it, and gives us a result. We also learn the difference between the physical machine you can touch (hardware) and the invisible instructions that make it work (software).'
  },
  {
    order: 2,
    title: 'Core Components',
    description: 'We look inside the computer to understand how it works. We learn about its "brain" (the processor), its short-term memory (RAM), and its long-term storage (the Hard Drive).'
  },
  {
    order: 3,
    title: 'The Operating System (System Software)',
    description: 'We meet the "manager" of the computer (Windows 11). We learn how to turn the computer on, log in safely, and find our way around the main screen and basic menus.'
  },
  {
    order: 4,
    title: 'File Management',
    description: 'We learn how to organize our digital life. We practice making folders, naming files so they make sense, and moving things around safely so we never lose our hard work.'
  },
  {
    order: 5,
    title: 'Peripherals and Ports',
    description: 'We learn how to safely plug things into the computer, like mice, keyboards, and screens. We also learn how to connect wireless tools (like headphones) and how to safely remove USB drives without breaking them.'
  },
  {
    order: 6,
    title: 'Application Software',
    description: 'We discover how to find and safely install the specific programs we need to do our work, like writing tools or web browsers. We also learn how to spot fake download buttons so we don\'t accidentally download viruses.'
  },
  {
    order: 7,
    title: 'The Boot Process & Troubleshooting',
    description: 'We learn what to do when the computer freezes or acts up. We cover simple, safe steps to fix everyday problems without panicking or having to call an expensive expert.'
  },
  {
    order: 8,
    title: 'Software and Application',
    description: 'We learn the difference between programs installed directly on the computer and programs we use over the internet. We also learn how to stop annoying "junk" software from sneaking onto our computer and slowing it down.'
  },
  {
    order: 9,
    title: 'Computer Care & Safety',
    description: 'We focus on keeping the physical machine clean and cool so it lasts a long time. More importantly, we learn how to sit and look at the screen correctly so our backs, necks, and eyes stay healthy.'
  },
  {
    order: 10,
    title: 'Practical Lab',
    description: 'This is a hands-on test where students take the driver\'s seat. Students will prove they can use all the skills they learned in the first nine lessons to solve real-world tasks with confidence.'
  }
];

async function updateLessons() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find module 1 by title
    let module = await Module.findOne({ title: 'Introduction to Computers' });
    if (!module) {
      console.log('Module not found. Creating it...');
      module = await Module.create({
        title: 'Introduction to Computers',
        description: 'Learn the basics of computing, from hardware to software',
        order: 1
      });
      console.log('Module created with ID:', module._id);
    } else {
      console.log('Module found:', module._id);
    }
    
    // Update existing lessons or create new ones
    for (const lessonInfo of lessonData) {
      const lesson = await Lesson.findOneAndUpdate(
        { moduleId: module._id, order: lessonInfo.order },
        { 
          title: lessonInfo.title,
          description: lessonInfo.description 
        },
        { upsert: true, new: true }
      );
      console.log(`Updated/Created Lesson ${lessonInfo.order}: ${lessonInfo.title}`);
    }

    console.log('✅ All lessons updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating lessons:', error);
    process.exit(1);
  }
}

updateLessons();
