const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, '../dist/output.css');
const outputPath = path.resolve(__dirname, '../src/generated-css.ts');

try {
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: ${inputPath} does not exist. Run tailwindcss build first.`);
    process.exit(1);
  }

  const css = fs.readFileSync(inputPath, 'utf8');
  // Escape backticks and other special characters if necessary, though JSON.stringify is safer
  const tsContent = `export const css = ${JSON.stringify(css)};`;

  fs.writeFileSync(outputPath, tsContent);
  console.log(`Successfully generated ${outputPath}`);
} catch (error) {
  console.error('Error generating CSS wrapper:', error);
  process.exit(1);
}
