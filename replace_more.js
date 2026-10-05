const fs = require('fs');
const path = require('path');

const replacements = {
  'AI-discovered topics': 'System-identified subjects',
  'Mock AI delay': 'Mock system delay',
  'AI Assistant': 'System Assistance',
  'use the AI Assistant to generate sections': 'use System Assistance to prepare draft sections',
  'AI Co-Pilot': 'System Assistance',
  'The AI has access': 'The system has access',
  'AI System': 'System',
  'Generate, validate, and manage AI-assisted reports': 'Prepare, verify, and manage reports',
  'Failed to fetch AI response': 'Failed to fetch system response',
  'Generating response via Gemini AI': 'Generating system response',
  'AI-generated response': 'System-Generated Response',
  'AI-Powered': 'Advanced',
  'AI Intelligence': 'System Analysis',
  'AI has extracted': 'The system has extracted',
  'AI queries': 'information searches',
  'AI-Assisted Drafts': 'System-Prepared Drafts',
  'AI Provider': 'Model Provider'
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      
      for (const [oldTerm, newTerm] of Object.entries(replacements)) {
        // Simple global replacement
        const regex = new RegExp(oldTerm, 'g');
        newContent = newContent.replace(regex, newTerm);
      }
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'frontend/src'));
