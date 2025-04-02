const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

// Get all resumes for a user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select('-__v')
      .sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single resume
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new resume
router.post('/',
  [
    body('title').trim().notEmpty(),
    body('personalInfo').isObject(),
    body('experience').isArray(),
    body('education').isArray(),
    body('skills').isArray(),
    body('projects').isArray(),
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      console.log('Creating resume with body:', req.body);
      
      // Sanitize projects data to ensure proper format
      if (req.body.projects) {
        req.body.projects = req.body.projects.map(project => ({
          ...project,
          technologies: typeof project.technologies === 'string' ? project.technologies : '',
        }));
      }

      const resume = new Resume({
        ...req.body,
        userId: req.user._id
      });

      await resume.save();
      console.log('Resume saved successfully:', resume);
      res.status(201).json(resume);
    } catch (error) {
      console.error('Error creating resume:', error);
      res.status(500).json({ message: 'Server error: ' + error.message });
    }
  }
);

// Update a resume
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('Updating resume with id:', req.params.id);
    console.log('Update data:', req.body);
    
    // Sanitize projects data to ensure proper format
    if (req.body.projects) {
      req.body.projects = req.body.projects.map(project => ({
        ...project,
        technologies: typeof project.technologies === 'string' ? project.technologies : '',
      }));
    }
    
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    console.log('Resume updated successfully');
    res.json(resume);
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Delete a resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle resume public status
router.patch('/:id/toggle-public', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    resume.isPublic = !resume.isPublic;
    await resume.save();

    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public resume by ID
router.get('/public/:id', async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      isPublic: true
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Increment view count
    resume.views += 1;
    await resume.save();

    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Track resume download
router.post('/:id/download', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Increment download count
    resume.downloads += 1;
    await resume.save();

    res.json({ 
      message: 'Download tracked successfully',
      downloads: resume.downloads
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 