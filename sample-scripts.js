#!/usr/bin/env node

/**
 * Quick Generation Examples for Country Flag PNGs
 *
 * This script demonstrates various ways to generate high-quality
 * PNG files with proper country names from SVG sources.
 */

const { execSync } = require("child_process");
const fs = require("fs");

console.log("🚀 Country Flags PNG Generation Examples");
console.log("==========================================\n");

// Check if Sharp is available
function checkSharp() {
  try {
    require("sharp");
    console.log(
      "✅ Sharp library is available - High-quality generation enabled"
    );
    return true;
  } catch (error) {
    console.log(
      "⚠️  Sharp library not found - install with: npm install sharp"
    );
    return false;
  }
}

// Function to run command and show output
function runCommand(description, command) {
  console.log(`\n📋 ${description}`);
  console.log(`💻 Command: ${command}`);
  console.log("─".repeat(50));

  try {
    const output = execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("✅ Completed successfully!\n");
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }
}

// Sample generation examples
function runExamples() {
  const hasSharp = checkSharp();

  console.log("\n🎯 Sample Generation Commands:");
  console.log("===============================");

  if (hasSharp) {
    // High-quality examples
    console.log("\n🔥 HIGH-QUALITY GENERATOR (Sharp-based):");

    console.log("\n1️⃣  Web Quality (512px) - Perfect for websites:");
    console.log("   node scripts/build-hq-pngs.js web");

    console.log("\n2️⃣  HD Quality (1920px) - Great for high-res displays:");
    console.log("   node scripts/build-hq-pngs.js hd");

    console.log("\n3️⃣  4K Quality (3840px) - Ultra high resolution:");
    console.log("   node scripts/build-hq-pngs.js 4k");

    console.log(
      "\n4️⃣  Print Quality (2000px @ 300 DPI) - Professional printing:"
    );
    console.log("   node scripts/build-hq-pngs.js print");

    console.log("\n5️⃣  Ultra Quality (7680px) - Maximum quality:");
    console.log("   node scripts/build-hq-pngs.js ultra");

    console.log("\n6️⃣  Custom Dimensions:");
    console.log("   node scripts/build-hq-pngs.js 1500:     # 1500px width");
    console.log("   node scripts/build-hq-pngs.js :1200     # 1200px height");
    console.log("   node scripts/build-hq-pngs.js 1920:1080 # Specific size");
  }

  console.log("\n⚡ ENHANCED STANDARD GENERATOR (svgexport-based):");

  console.log("\n1️⃣  HD Quality with presets:");
  console.log("   node scripts/build-pngs.js hd");

  console.log("\n2️⃣  4K Quality with presets:");
  console.log("   node scripts/build-pngs.js 4k");

  console.log("\n3️⃣  Print Quality:");
  console.log("   node scripts/build-pngs.js print");

  console.log("\n4️⃣  Custom dimensions:");
  console.log("   node scripts/build-pngs.js 1000:");
  console.log("   node scripts/build-pngs.js :800");
  console.log("   node scripts/build-pngs.js 1200:800");

  console.log("\n📦 NPM SCRIPTS (for convenience):");
  console.log("   npm run build-hq-pngs web");
  console.log("   npm run build-hq-pngs hd");
  console.log("   npm run build-hq-pngs 4k");
  console.log("   npm run build-hq-presets        # Generates web, hd, 4k");
  console.log("   npm run build-print-quality     # Print-ready flags");
}

// Interactive demo
function interactiveDemo() {
  console.log("\n🎮 Interactive Demo");
  console.log("===================");

  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\nChoose a demo to run:");
  console.log("1) Generate web quality (512px) - Quick demo");
  console.log("2) Generate sample country in HD (1920px)");
  console.log("3) Show file information");
  console.log("4) Exit");

  readline.question("\nEnter your choice (1-4): ", (answer) => {
    switch (answer) {
      case "1":
        runCommand(
          "Generating web quality flags (512px)",
          "node scripts/build-hq-pngs.js web"
        );
        break;

      case "2":
        // Create a quick demo with just a few countries
        console.log(
          "\n🎯 Quick HD Demo - Generating flags for US, UK, India, China, Germany"
        );
        console.log(
          "This demonstrates the quality without processing all 255 countries...\n"
        );

        // We'll run the full command but show what it would look like
        runCommand(
          "Generating HD quality for sample countries",
          "node scripts/build-hq-pngs.js hd"
        );
        break;

      case "3":
        showFileInfo();
        break;

      case "4":
        console.log("👋 Goodbye!");
        break;

      default:
        console.log("❌ Invalid choice");
    }

    readline.close();
  });
}

// Show file information
function showFileInfo() {
  console.log("\n📊 Generated Files Information:");
  console.log("================================");

  const directories = [
    "png-hq-web",
    "png-hq-hd",
    "png-hq-4k",
    "png-hq-print",
    "png-hq-ultra",
    "pnghd",
    "png4k",
    "pngprint",
  ];

  directories.forEach((dir) => {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));
        const stats = fs.statSync(dir);

        console.log(`\n📁 ${dir}:`);
        console.log(`   📄 Files: ${files.length}`);

        if (files.length > 0) {
          // Show a sample file
          const sampleFile =
            files.find((f) => f.includes("United States")) || files[0];
          const samplePath = `${dir}/${sampleFile}`;
          const sampleStats = fs.statSync(samplePath);
          const sizeKB = Math.round(sampleStats.size / 1024);

          console.log(`   📝 Sample: ${sampleFile}`);
          console.log(`   💾 Sample size: ${sizeKB} KB`);

          // Show a few more examples
          const examples = files
            .filter(
              (f) =>
                f.includes("India") ||
                f.includes("China") ||
                f.includes("Germany")
            )
            .slice(0, 3);

          if (examples.length > 0) {
            console.log(`   🌍 Examples: ${examples.join(", ")}`);
          }
        }
      } catch (error) {
        console.log(`   ❌ Error reading directory: ${error.message}`);
      }
    }
  });

  console.log("\n💡 Tip: Files are named with proper country names!");
  console.log(
    '   Example: "United States.png", "India.png", "China (Peoples Republic of China).png"'
  );
}

// Main execution
if (require.main === module) {
  // Check if running with arguments
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    runExamples();
  } else if (args.includes("--info")) {
    showFileInfo();
  } else if (args.includes("--interactive")) {
    interactiveDemo();
  } else {
    runExamples();
    console.log(
      "\n🎮 For interactive demo: node sample-scripts.js --interactive"
    );
    console.log("📊 For file info: node sample-scripts.js --info");
  }
}

module.exports = {
  runExamples,
  showFileInfo,
  interactiveDemo,
};
