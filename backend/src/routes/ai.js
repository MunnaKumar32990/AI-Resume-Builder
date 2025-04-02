const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const OpenAI = require('openai');
const auth = require('../middleware/auth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Get AI suggestions for resume content
router.post('/suggestions',
  [
    body('section').isIn(['personalInfo', 'experience', 'education', 'skills', 'projects']),
    body('currentContent').optional().isObject()
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { section, currentContent = {} } = req.body;

      let prompt = '';
      switch (section) {
        case 'personalInfo':
          prompt = `Generate a professional summary for a resume. 
                   Current content: ${currentContent.summary || 'No content yet'}. 
                   Make it concise, impactful, and highlight relevant skills and experience.
                   Format the response as a professional summary paragraph.`;
          break;
        case 'experience':
          prompt = `Suggest improvements for the following work experience:
                   ${JSON.stringify(currentContent.experience || [])}.
                   Focus on quantifying achievements and using action verbs.
                   Format the response as a list of bullet points.`;
          break;
        case 'education':
          prompt = `Suggest improvements for the following education section:
                   ${JSON.stringify(currentContent.education || [])}.
                   Focus on highlighting relevant coursework, achievements, and academic excellence.
                   Format the response as a list of bullet points.`;
          break;
        case 'skills':
          prompt = `Suggest relevant skills for a professional resume.
                   Current skills: ${JSON.stringify(currentContent.skills || [])}.
                   Include both technical and soft skills.
                   Format the response as a list of skills with proficiency levels.`;
          break;
        case 'projects':
          prompt = `Suggest improvements for the following projects:
                   ${JSON.stringify(currentContent.projects || [])}.
                   Focus on highlighting technical achievements and impact.
                   Format the response as a list of bullet points.`;
          break;
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer and career coach. Provide specific, actionable suggestions for improving resume content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      res.json({
        suggestions: completion.choices[0].message.content
      });
    } catch (error) {
      console.error('AI suggestions error:', error);
      res.status(500).json({ message: 'Error generating suggestions' });
    }
  }
);

// Optimize resume for ATS
router.post('/optimize',
  [
    body('resumeContent').isObject(),
    body('jobDescription').trim().notEmpty()
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { resumeContent, jobDescription } = req.body;

      const prompt = `Analyze this resume content and job description for ATS optimization:
                     Resume: ${JSON.stringify(resumeContent)}
                     Job Description: ${jobDescription}
                     
                     Provide suggestions for:
                     1. Keyword optimization
                     2. Format improvements
                     3. Content relevance
                     4. Missing important skills or experience`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an ATS optimization expert. Provide specific suggestions for improving resume content to pass ATS screening."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      res.json({
        suggestions: completion.choices[0].message.content
      });
    } catch (error) {
      console.error('ATS optimization error:', error);
      res.status(500).json({ message: 'Error optimizing resume' });
    }
  }
);

// Generate cover letter
router.post('/cover-letter',
  [
    body('resumeContent').isObject(),
    body('jobDescription').trim().notEmpty(),
    body('companyName').trim().notEmpty()
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { resumeContent, jobDescription, companyName } = req.body;

      const prompt = `Generate a professional cover letter for ${companyName} based on:
                     Resume: ${JSON.stringify(resumeContent)}
                     Job Description: ${jobDescription}
                     
                     The cover letter should:
                     1. Be personalized to the company and position
                     2. Highlight relevant experience and skills
                     3. Show enthusiasm and fit for the role
                     4. Be concise and well-structured`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional cover letter writer."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      res.json({
        coverLetter: completion.choices[0].message.content
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating cover letter' });
    }
  }
);

module.exports = router; 