#!/usr/bin/env node

/**
 * Quick Demo - Country Flag PNG Generation
 *
 * This script demonstrates the PNG generation tools with a small sample
 * of flags to give you a quick taste of what the tools can do.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🏁 Country Flag PNG Generation - Quick Demo");
console.log("===========================================\n");

// Sample countries for demo (popular and diverse)
const demoCountries = ["us", "jp", "gb", "ca", "fr"];

// Load country names
let countries = {};
try {
  const data = fs.readFileSync("countries.json", "utf8");
  countries = JSON.parse(data);
} catch (error) {
  console.log("⚠️  countries.json not found, using country codes as names");
}

function getCountryName(code) {
  return countries[code] || code.toUpperCase();
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(1) + " KB";
  } catch {
    return "N/A";
  }
}

console.log("📋 Demo will generate PNG flags for these countries:");
demoCountries.forEach((code) => {
  console.log(`   • ${getCountryName(code)} (${code})`);
});
console.log("");

// Check if SVG files exist
console.log("🔍 Checking SVG source files...");
let missingFiles = [];
demoCountries.forEach((code) => {
  const svgPath = `svg/${code}.svg`;
  if (fileExists(svgPath)) {
    console.log(`   ✅ ${code}.svg found`);
  } else {
    console.log(`   ❌ ${code}.svg missing`);
    missingFiles.push(code);
  }
});

if (missingFiles.length > 0) {
  console.log(
    `\n⚠️  Warning: ${missingFiles.length} SVG files missing. Demo will continue with available files.`
  );
  // Remove missing files from demo list
  demoCountries = demoCountries.filter((code) => !missingFiles.includes(code));
}

if (demoCountries.length === 0) {
  console.log(
    "❌ No SVG files found for demo. Please check the svg/ directory."
  );
  process.exit(1);
}

console.log("\n🚀 Starting demo generation...");
console.log("   Quality: Web (512px) - Fast generation for demo purposes");
console.log("   Output: png-demo/ directory\n");

// Generate web-quality PNGs for demo countries
demoCountries.forEach((code, index) => {
  try {
    console.log(
      `[${index + 1}/${demoCountries.length}] Generating ${getCountryName(
        code
      )}...`
    );

    // Create output directory if it doesn't exist
    if (!fileExists("png-demo")) {
      fs.mkdirSync("png-demo", { recursive: true });
    }

    // Generate the PNG
    const command = `node scripts/build-hq-pngs.js --country ${code} --quality web --output png-demo`;
    execSync(command, { stdio: "pipe" });

    // Check if file was created and show size
    const expectedFileName = `${getCountryName(code)}.png`;
    const outputPath = `png-demo/${expectedFileName}`;

    if (fileExists(outputPath)) {
      const size = getFileSize(outputPath);
      console.log(`   ✅ ${expectedFileName} (${size})`);
    } else {
      console.log(`   ⚠️  File may not have been created as expected`);
    }
  } catch (error) {
    console.log(`   ❌ Error generating ${code}: ${error.message}`);
  }
});

console.log("\n🎉 Demo complete!");
console.log("\n📊 Results Summary:");
console.log("===================");

// Show results summary
if (fileExists("png-demo")) {
  const files = fs.readdirSync("png-demo").filter((f) => f.endsWith(".png"));
  if (files.length > 0) {
    console.log(
      `✅ Generated ${files.length} PNG files in png-demo/ directory:`
    );
    files.forEach((file) => {
      const filePath = path.join("png-demo", file);
      const size = getFileSize(filePath);
      console.log(`   • ${file} (${size})`);
    });

    // Calculate total size
    let totalSize = 0;
    files.forEach((file) => {
      try {
        const stats = fs.statSync(path.join("png-demo", file));
        totalSize += stats.size;
      } catch {}
    });
    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`\n📦 Total size: ${totalMB} MB`);
  } else {
    console.log("❌ No PNG files found in output directory");
  }
} else {
  console.log("❌ Demo output directory not created");
}

console.log("\n🚀 Next Steps:");
console.log("==============");
console.log("1. 📖 Read the full guide: cat HQ-PNG-GUIDE.md");
console.log(
  "2. 🎮 Try interactive tools: ./examples/interactive-generation.sh"
);
console.log("3. 📋 View all examples: ls examples/");
console.log("4. 🌍 Generate all countries: npm run build:hq-web");
console.log(
  "5. 🔍 Explore quality options: npm run build:hq-hd (or 4k, print, ultra)"
);

console.log("\n💡 Quality Options Available:");
console.log("   • web (512px) - Fast, small files (~20-80 KB)");
console.log("   • hd (1920px) - Medium quality (~200-800 KB)");
console.log("   • 4k (3840px) - High quality (~800KB-3MB)");
console.log("   • print (2000px) - Print ready (~400KB-1.5MB)");
console.log("   • ultra (7680px) - Maximum quality (~2-10MB)");

console.log("\n🎯 Popular Commands:");
console.log("   npm run build:hq-web     # All countries, web quality");
console.log("   npm run build:hq-hd      # All countries, HD quality");
console.log(
  "   node scripts/build-hq-pngs.js --country us --quality 4k  # Specific country"
);

console.log("\n✨ Demo completed successfully! Check the png-demo/ directory.");
