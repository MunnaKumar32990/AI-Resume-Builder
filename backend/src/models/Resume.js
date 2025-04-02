const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    summary: String
  },
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String,
    achievements: [String]
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: String,
    achievements: [String]
  }],
  skills: [{
    category: String,
    items: [String]
  }],
  projects: [{
    name: String,
    description: String,
    technologies: String,
    startDate: String,
    endDate: String,
    role: String,
    achievements: String,
    link: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiryDate: Date
  }],
  template: {
    type: String,
    default: 'modern'
  },
  styling: {
    fontFamily: String,
    fontSize: String,
    colorScheme: String,
    spacing: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  }
});

// Update the updatedAt timestamp before saving
resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume; 