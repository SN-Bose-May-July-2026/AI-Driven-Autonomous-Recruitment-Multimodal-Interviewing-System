const fs = require('fs');
const PDFDocument = require('pdfkit');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

const DESKTOP_DIR = path.join(require('os').homedir(), 'Desktop');
const SAMPLES_DIR = path.join(DESKTOP_DIR, 'Recruitment_Sample_Data');

if (!fs.existsSync(SAMPLES_DIR)) {
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
}

const candidates = [
  { name: 'Alice Smith', email: 'alice@example.com', phone: '555-0101', filename: 'alice_smith_resume.pdf', skills: 'React, Node.js, TypeScript' },
  { name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0102', filename: 'bob_johnson_resume.pdf', skills: 'Python, Django, AWS' },
  { name: 'Charlie Davis', email: 'charlie@example.com', phone: '555-0103', filename: 'charlie_davis_resume.pdf', skills: 'Java, Spring Boot, SQL' },
  { name: 'Diana Evans', email: 'diana@example.com', phone: '555-0104', filename: 'diana_evans_resume.pdf', skills: 'React, Next.js, Tailwind CSS' },
  { name: 'Ethan Garcia', email: 'ethan@example.com', phone: '555-0105', filename: 'ethan_garcia_resume.pdf', skills: 'Go, Kubernetes, Docker' }
];

async function generateData() {
  console.log('Generating CSV mapping...');
  const csvWriter = createObjectCsvWriter({
    path: path.join(SAMPLES_DIR, 'candidates_mapping.csv'),
    header: [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'phone', title: 'Phone' },
      { id: 'filename', title: 'ResumeFilename' }
    ]
  });
  await csvWriter.writeRecords(candidates);

  console.log('Generating PDF Resumes...');

  for (const candidate of candidates) {
    const doc = new PDFDocument();
    const pdfPath = path.join(SAMPLES_DIR, candidate.filename);
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(25).text(`${candidate.name} - Resume`, 100, 100);
    doc.fontSize(12).text(`Email: ${candidate.email}`, 100, 150);
    doc.fontSize(12).text(`Phone: ${candidate.phone}`, 100, 170);
    doc.moveDown();
    doc.fontSize(16).text(`Professional Summary`, 100, 210);
    doc.fontSize(12).text(`An experienced software engineer with a strong background in ${candidate.skills}.`, 100, 240);
    doc.moveDown();
    doc.fontSize(16).text(`Experience`, 100, 280);
    doc.fontSize(12).text(`Senior Developer at Tech Corp (2020 - Present)`, 100, 310);
    
    doc.end();
  }

  console.log(`Generated sample data on Desktop in 'Recruitment_Sample_Data' folder.`);
}

generateData().catch(console.error);
