const fs = require('fs');
const path = require('path');

const sourceDir = path.join(
    __dirname,
    '../node_modules/@supergrowthai/next-blog/dist/nextjs/assets/@supergrowthai/next-blog-dashboard/static/internal-plugins'
);

const targetDir = path.join(__dirname, '../public/internal-plugins');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Copy the entire internal-plugins directory
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log('✅ Internal plugins copied successfully');