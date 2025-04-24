const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const OpenAI = require('openai');
const auth = require('../middleware/auth');

// Create OpenAI client with error handling
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

// Fallback suggestions for when API is unavailable
const fallbackSuggestions = {
  personalInfo: 'Results-driven professional with a proven track record of success in [industry]. Skilled in [skill 1], [skill 2], and [skill 3]. Passionate about delivering high-quality solutions that drive business growth.',
  experience: '• Increased department productivity by 20% through implementation of new workflow processes\n• Led a team of 5 members to successfully deliver project ahead of schedule\n• Reduced operational costs by 15% through strategic optimizations',
  education: '• Dean\'s List for academic excellence (4 semesters)\n• Relevant coursework: Advanced Statistics, Data Structures, Machine Learning\n• Graduated with honors, top 10% of class',
  skills: 'Technical Skills:\n• Programming Languages: Python, JavaScript, SQL\n• Tools & Frameworks: React, Node.js, Docker\n• Concepts: Agile Development, CI/CD, Data Analysis',
  projects: '• Designed and implemented key features that improved user engagement by 35%\n• Collaborated with cross-functional teams to deliver project under tight deadlines\n• Implemented automated testing suite that reduced bugs by 40%'
};

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
          prompt = `Improve this professional summary for a resume. Make it concise, impactful, and focused on achievements: "${currentContent.summary || ''}"`;
          break;
        case 'experience':
          prompt = `Enhance these job descriptions with strong action verbs and quantifiable achievements: ${JSON.stringify(currentContent.experience || [])}`;
          break;
        case 'education':
          prompt = `Suggest achievements and relevant coursework to add to this education section: ${JSON.stringify(currentContent.education || [])}`;
          break;
        case 'skills':
          prompt = `Based on these existing skills, suggest additional relevant skills and optimized descriptions: ${JSON.stringify(currentContent.skills || [])}`;
          break;
        case 'projects':
          prompt = `Improve these project descriptions with impactful bullet points highlighting technical skills and achievements: ${JSON.stringify(currentContent.projects || [])}`;
          break;
        default:
          return res.status(400).json({ message: 'Invalid section' });
      }

      // Check if OpenAI client is available
      if (!openai || !process.env.OPENAI_API_KEY) {
        console.log('OpenAI API not available, using fallback suggestions');
        return res.json({
          suggestions: fallbackSuggestions[section],
          fromFallback: true
        });
      }

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Use a more available model
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
          max_tokens: 500,
          timeout: 5000 // 5 second timeout
        });

        res.json({
          suggestions: completion.choices[0].message.content
        });
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        // Return fallback suggestions when OpenAI API fails
        res.json({
          suggestions: fallbackSuggestions[section],
          fromFallback: true
        });
      }
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

      // Check if OpenAI client is available
      if (!openai || !process.env.OPENAI_API_KEY) {
        return res.json({
          suggestions: "Based on the job description, consider adding more keywords related to required skills. Quantify your achievements with metrics. Customize your resume summary to match the job description."
        });
      }

      const prompt = `Analyze this resume content and job description for ATS optimization:
                     Resume: ${JSON.stringify(resumeContent)}
                     Job Description: ${jobDescription}
                     
                     Provide suggestions for:
                     1. Keyword optimization
                     2. Format improvements
                     3. Content relevance
                     4. Missing important skills or experience`;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Use a more available model
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
          max_tokens: 500,
          timeout: 5000 // 5 second timeout
        });

        res.json({
          suggestions: completion.choices[0].message.content
        });
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        // Return fallback suggestions when OpenAI API fails
        res.json({
          suggestions: "Based on the job description, consider adding more keywords related to required skills. Quantify your achievements with metrics. Customize your resume summary to match the job description.",
          fromFallback: true
        });
      }
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