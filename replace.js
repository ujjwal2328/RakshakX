const fs = require('fs');
const path = require('path');

const replacements = {
  // Navigation & Page Titles
  'Ingestion Pipeline': 'Document Processing',
  'Knowledge Base': 'Information Repository',
  'AI Query': 'Information Search',
  'Report Factory': 'Report Preparation',
  'Topic Intelligence': 'Subject & Trend Analysis',
  'GIS Explorer': 'Geographic Information',
  'Query Response Center': 'Query & Correspondence',
  'Validation Center': 'Data Verification',
  'Review & Approvals': 'Review & Approval',

  // Other AI UI terms
  'AI-powered Query': 'Information Search',
  'Ask the AI': 'Search Information',
  'Ask AI': 'Search Information',
  'AI Response': 'Information Response',
  'Knowledge Explorer': 'Information Repository',
  'Knowledge Graph': 'Information Relationships',
  'Document Ingestion': 'Document Processing',
  'Ingestion Queue': 'Document Processing Queue',
  'AI Document Intelligence': 'Document Processing & Extraction',
  'AI Report Generation': 'Report Preparation',
  'Topic Explorer': 'Subject Analysis',
  'Word Cloud': 'Subject Overview',
  'AI Analytics': 'Analytics',
  'AI Validation': 'Data Verification',
  'Validation Engine': 'Verification Service',
  'Human-in-the-loop': 'Review & Approval',
  'AI Approval': 'Review & Approval',
  'Vector Search': 'Advanced Search',
  'Semantic Search': 'Advanced Search',
  'AI Confidence': 'Information Confidence',
  'AI Generated': 'System Generated',
  'AI Draft': 'System Draft',
  'AI Summary': 'Summary',
  'AI Insight': 'Analysis',
  'AI Recommendation': 'Recommendation',
  'AI Extraction': 'Data Extraction',
  'AI OCR': 'Text & Data Extraction',
  'AI Vision': 'Document & Image Processing',
  'Generate with AI': 'Prepare Draft',
  'RAG Sources': 'Sources Used'
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
