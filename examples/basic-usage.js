#!/usr/bin/env node

/**
 * Basic Usage Examples for Country Flag PNG Generation
 *
 * This script demonstrates how to use the PNG generation tools
 * with different quality settings and configurations.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🏁 Country Flag PNG Generation Examples\n");

// Example 1: Generate web-quality PNGs (512px)
function generateWebQuality() {
  console.log("📱 Example 1: Generating web-quality PNGs (512px)...");
  try {
    execSync("npm run build:hq-web", { stdio: "inherit" });
    console.log("✅ Web-quality PNGs generated in png-web/ directory\n");
  } catch (error) {
    console.error("❌ Error generating web-quality PNGs:", error.message);
  }
}

// Example 2: Generate 4K quality PNGs (3840px)
function generate4K() {
  console.log("🖥️ Example 2: Generating 4K quality PNGs (3840px)...");
  console.log(
    "⚠️ Warning: This will take several minutes and generate large files"
  );
  try {
    execSync("npm run build:hq-4k", { stdio: "inherit" });
    console.log("✅ 4K PNGs generated in png-hq-4k/ directory\n");
  } catch (error) {
    console.error("❌ Error generating 4K PNGs:", error.message);
  }
}

// Example 3: Generate specific countries only
function generateSpecificCountries() {
  console.log("🎯 Example 3: Generating PNGs for specific countries...");

  const countries = ["us", "ca", "gb", "fr", "jp"]; // USA, Canada, UK, France, Japan

  countries.forEach((code) => {
    try {
      console.log(`Generating ${code}.svg...`);
      execSync(
        `node scripts/build-hq-pngs.js --country ${code} --quality web`,
        { stdio: "inherit" }
      );
    } catch (error) {
      console.error(`❌ Error generating ${code}:`, error.message);
    }
  });
  console.log("✅ Specific countries generated\n");
}

// Example 4: Check available SVG files
function listAvailableFlags() {
  console.log("📋 Example 4: Available flag files...");
  try {
    const svgDir = path.join(__dirname, "..", "svg");
    const svgFiles = fs
      .readdirSync(svgDir)
      .filter((file) => file.endsWith(".svg"))
      .map((file) => file.replace(".svg", ""))
      .sort();

    console.log(`Found ${svgFiles.length} flag files:`);
    console.log(svgFiles.slice(0, 10).join(", "), "... (showing first 10)");
    console.log(`Full list: ${svgFiles.join(", ")}\n`);
  } catch (error) {
    console.error("❌ Error listing SVG files:", error.message);
  }
}

// Example 5: Compare file sizes
function compareFileSizes() {
  console.log("📊 Example 5: File size comparison...");

  const directories = [
    { name: "SVG Original", path: "svg" },
    { name: "PNG Standard", path: "png" },
    { name: "PNG Web (512px)", path: "png-web" },
    { name: "PNG 4K (3840px)", path: "png-hq-4k" },
  ];

  directories.forEach((dir) => {
    try {
      const dirPath = path.join(__dirname, "..", dir.path);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        if (files.length > 0) {
          const sampleFile = files[0];
          const stats = fs.statSync(path.join(dirPath, sampleFile));
          const sizeKB = (stats.size / 1024).toFixed(1);
          console.log(`${dir.name}: ${sampleFile} = ${sizeKB} KB`);
        }
      } else {
        console.log(`${dir.name}: Directory not found`);
      }
    } catch (error) {
      console.log(`${dir.name}: Error checking - ${error.message}`);
    }
  });
  console.log("");
}

// Interactive menu
function showMenu() {
  console.log("Choose an example to run:");
  console.log("1. Generate web-quality PNGs (512px) - Fast");
  console.log("2. Generate 4K quality PNGs (3840px) - Slow, large files");
  console.log("3. Generate specific countries only");
  console.log("4. List available flag files");
  console.log("5. Compare file sizes");
  console.log("6. Run all examples (except 4K)");
  console.log("0. Exit");
  console.log("");
}

// Main execution
if (require.main === module) {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function runExample() {
    showMenu();
    rl.question("Enter your choice (0-6): ", (choice) => {
      console.log("");

      switch (choice) {
        case "1":
          generateWebQuality();
          break;
        case "2":
          generate4K();
          break;
        case "3":
          generateSpecificCountries();
          break;
        case "4":
          listAvailableFlags();
          break;
        case "5":
          compareFileSizes();
          break;
        case "6":
          listAvailableFlags();
          compareFileSizes();
          generateWebQuality();
          generateSpecificCountries();
          break;
        case "0":
          console.log("👋 Goodbye!");
          rl.close();
          return;
        default:
          console.log("❌ Invalid choice. Please try again.\n");
          break;
      }

      if (choice !== "0") {
        setTimeout(() => {
          console.log("Press Enter to continue...");
          rl.question("", () => {
            console.log("\n" + "=".repeat(50) + "\n");
            runExample();
          });
        }, 1000);
      }
    });
  }

  runExample();
}

module.exports = {
  generateWebQuality,
  generate4K,
  generateSpecificCountries,
  listAvailableFlags,
  compareFileSizes,
};
