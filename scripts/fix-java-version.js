#!/usr/bin/env node

/**
 * Script to fix Java version in Android build.gradle
 * This runs after cap sync to override Java 21 with Java 17
 */

const fs = require('fs');
const path = require('path');

const buildGradlePath = path.join(__dirname, '..', 'android', 'build.gradle');

if (!fs.existsSync(buildGradlePath)) {
  console.warn('android/build.gradle not found. Skipping Java version fix.');
  process.exit(0);
}

let content = fs.readFileSync(buildGradlePath, 'utf8');

// Check if the fix is already applied
if (content.includes('JavaVersion.VERSION_17') && content.includes('// Override Java version')) {
  console.log('Java version fix already applied.');
  process.exit(0);
}

// Find the allprojects block and add the subprojects configuration after it
const allprojectsEndRegex = /(allprojects\s*\{[^}]*\})/s;
const javaVersionFix = `
// Override Java version from capacitor.build.gradle (which uses Java 21)
// This ensures all Android modules use Java 17
subprojects {
    afterEvaluate { project ->
        if (project.hasProperty('android')) {
            project.android {
                compileOptions {
                    sourceCompatibility JavaVersion.VERSION_17
                    targetCompatibility JavaVersion.VERSION_17
                }
            }
        }
    }
}`;

if (allprojectsEndRegex.test(content)) {
  // Insert the fix after the allprojects block
  content = content.replace(allprojectsEndRegex, `$1${javaVersionFix}`);
  fs.writeFileSync(buildGradlePath, content, 'utf8');
  console.log('✓ Fixed Java version to 17 in android/build.gradle');
} else {
  // Fallback: add it before the clean task
  const cleanTaskRegex = /(task clean)/;
  if (cleanTaskRegex.test(content)) {
    content = content.replace(cleanTaskRegex, `${javaVersionFix}\n\n$1`);
    fs.writeFileSync(buildGradlePath, content, 'utf8');
    console.log('✓ Fixed Java version to 17 in android/build.gradle');
  } else {
    console.error('Could not find insertion point in build.gradle');
    process.exit(1);
  }
}

