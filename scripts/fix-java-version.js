#!/usr/bin/env node

/**
 * Script to fix Java version in Android build.gradle
 * This runs after cap sync to override Java 21 with Java 17
 */

const fs = require('fs');
const path = require('path');

const androidDir = path.join(__dirname, '..', 'android');
const buildGradlePath = path.join(androidDir, 'build.gradle');
const gradlePropertiesPath = path.join(androidDir, 'gradle.properties');

// Also set in gradle.properties for earlier evaluation
if (fs.existsSync(gradlePropertiesPath)) {
  let gradleProps = fs.readFileSync(gradlePropertiesPath, 'utf8');
  
  // Ensure we have the Java toolchain setting (but don't force a specific version here)
  // The build.gradle override will handle the actual version
  if (!gradleProps.includes('# Java version override')) {
    gradleProps += '\n# Java version override - see build.gradle subprojects block\n';
    fs.writeFileSync(gradlePropertiesPath, gradleProps, 'utf8');
    console.log('✓ Updated gradle.properties');
  }
}

if (!fs.existsSync(buildGradlePath)) {
  console.warn('android/build.gradle not found. Skipping Java version fix.');
  process.exit(0);
}

let content = fs.readFileSync(buildGradlePath, 'utf8');

// Check if the fix is already applied
const fixMarker = '// Override Java version from capacitor.build.gradle';
if (content.includes(fixMarker)) {
  console.log('Java version fix already applied to build.gradle.');
  process.exit(0);
}

// The fix block to add - this will override Java 21 with Java 17 for all subprojects
// Using afterEvaluate to ensure it runs after plugin configuration
const javaVersionFix = `
// Override Java version from capacitor.build.gradle (which uses Java 21)
// This ensures all Android modules use Java 17
subprojects {
    afterEvaluate { project ->
        // Override for Android projects
        if (project.hasProperty('android')) {
            project.android {
                compileOptions {
                    sourceCompatibility JavaVersion.VERSION_17
                    targetCompatibility JavaVersion.VERSION_17
                }
            }
        }
        // Override for Java/Java-library projects
        def javaExtension = project.extensions.findByName('java')
        if (javaExtension != null) {
            javaExtension.sourceCompatibility = JavaVersion.VERSION_17
            javaExtension.targetCompatibility = JavaVersion.VERSION_17
        }
        // Override Java compilation tasks directly for extra safety
        project.tasks.withType(JavaCompile).configureEach {
            sourceCompatibility = JavaVersion.VERSION_17
            targetCompatibility = JavaVersion.VERSION_17
        }
    }
}
`;

// Try to find a good insertion point - after allprojects block
// The regex needs to handle nested braces properly
const allprojectsPattern = /(allprojects\s*\{[^}]*(?:\{[^}]*(?:\{[^}]*\}[^}]*)*\}[^}]*)*\})/s;
const match = content.match(allprojectsPattern);

if (match) {
  // Insert after allprojects block
  const insertPos = match.index + match[0].length;
  content = content.slice(0, insertPos) + javaVersionFix + content.slice(insertPos);
  fs.writeFileSync(buildGradlePath, content, 'utf8');
  console.log('✓ Fixed Java version to 17 in android/build.gradle (after allprojects)');
} else {
  // Fallback: append at the end of the file
  content += javaVersionFix;
  fs.writeFileSync(buildGradlePath, content, 'utf8');
  console.log('✓ Fixed Java version to 17 in android/build.gradle (appended)');
}

console.log('✓ Java version fix completed');

