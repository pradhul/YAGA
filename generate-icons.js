const fs = require('fs');
const path = require('path');

// This script uses sharp to convert SVG to PNG at various sizes
// Install sharp first: npm install --save-dev sharp

async function generateIcons() {
  try {
    const sharp = require('sharp');
    const iconDir = path.join(__dirname, 'src', 'assets', 'icon');
    const svgPath = path.join(iconDir, 'icon.svg');
    
    // Sizes needed for different platforms
    const sizes = {
      'favicon.png': 32,
      'icon-16.png': 16,
      'icon-32.png': 32,
      'icon-48.png': 48,
      'icon-64.png': 64,
      'icon-96.png': 96,
      'icon-128.png': 128,
      'icon-192.png': 192,
      'icon-512.png': 512,
      'apple-touch-icon.png': 180,
      'icon.png': 1024 // For Capacitor assets
    };
    
    console.log('Generating icons from SVG...');
    
    for (const [filename, size] of Object.entries(sizes)) {
      const outputPath = path.join(iconDir, filename);
      await sharp(svgPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${filename} (${size}x${size})`);
    }
    
    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('\n❌ Error: sharp module not found.');
      console.log('Please install sharp first: npm install --save-dev sharp');
      console.log('Then run: node generate-icons.js');
    } else {
      console.error('Error generating icons:', error);
    }
    process.exit(1);
  }
}

generateIcons();
