const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

// Get all modules
exports.getAllModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1 });
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get module with lessons
exports.getModuleWithLessons = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const lessons = await Lesson.find({ moduleId: req.params.moduleId }).sort({ order: 1 });

    res.json({
      ...module.toObject(),
      lessons,
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create module (admin only)
exports.createModule = async (req, res) => {
  try {
    const { title, description, order } = req.body;

    if (!title || order === undefined) {
      return res.status(400).json({ message: 'Title and order are required' });
    }

    const newModule = new Module({
      title,
      description: description || '',
      order,
    });

    await newModule.save();

    res.status(201).json({
      message: 'Module created successfully',
      module: newModule,
    });
  } catch (error) {
    console.error('Creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update module (admin only)
exports.updateModule = async (req, res) => {
  try {
    const { title, description, order } = req.body;

    const module = await Module.findByIdAndUpdate(
      req.params.moduleId,
      { title, description, order },
      { new: true }
    );

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    res.json({
      message: 'Module updated successfully',
      module,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete module (admin only)
exports.deleteModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Delete all lessons in module
    await Lesson.deleteMany({ moduleId: req.params.moduleId });

    res.json({
      message: 'Module and associated lessons deleted',
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).populate('moduleId');
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create lesson (admin only)
exports.createLesson = async (req, res) => {
  try {
    const { moduleId, title, youtubeURL, description, order } = req.body;

    if (!moduleId || !title || order === undefined) {
      return res.status(400).json({ message: 'Module ID, title, and order are required' });
    }

    // Verify module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const notesPath = req.file?.filename || null;

    const newLesson = new Lesson({
      moduleId,
      title,
      youtubeURL: youtubeURL || '',
      description: description || '',
      notesPath,
      order,
    });

    await newLesson.save();

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson: newLesson,
    });
  } catch (error) {
    console.error('Creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update lesson (admin only)
exports.updateLesson = async (req, res) => {
  try {
    const { title, youtubeURL, description, order } = req.body;
    
    const updateData = {
      title,
      youtubeURL: youtubeURL || '',
      description: description || '',
      order,
    };

    if (req.file) {
      updateData.notesPath = req.file.filename;
    }

    const lesson = await Lesson.findByIdAndUpdate(
      req.params.lessonId,
      updateData,
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({
      message: 'Lesson updated successfully',
      lesson,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete lesson (admin only)
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({
      message: 'Lesson deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
