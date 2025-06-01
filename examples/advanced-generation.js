#!/usr/bin/env node

/**
 * Advanced PNG Generation Examples
 *
 * This script demonstrates advanced usage patterns and batch operations
 * for the country flag PNG generation tools.
 */

const { exec, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const util = require("util");

const execAsync = util.promisify(exec);

class FlagGenerator {
  constructor() {
    this.baseDir = path.join(__dirname, "..");
    this.svgDir = path.join(this.baseDir, "svg");
    this.countriesFile = path.join(this.baseDir, "countries.json");
    this.countries = this.loadCountries();
  }

  loadCountries() {
    try {
      const data = fs.readFileSync(this.countriesFile, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("❌ Error loading countries.json:", error.message);
      return {};
    }
  }

  getAvailableSvgFiles() {
    try {
      return fs
        .readdirSync(this.svgDir)
        .filter((file) => file.endsWith(".svg"))
        .map((file) => file.replace(".svg", ""));
    } catch (error) {
      console.error("❌ Error reading SVG directory:", error.message);
      return [];
    }
  }

  async generateBatch(countries, quality = "web", parallel = 3) {
    console.log(
      `🚀 Starting batch generation for ${countries.length} countries`
    );
    console.log(`📋 Quality: ${quality}, Parallel: ${parallel}`);

    const chunks = this.chunkArray(countries, parallel);
    let completed = 0;

    for (const chunk of chunks) {
      const promises = chunk.map(async (country) => {
        try {
          const command = `node scripts/build-hq-pngs.js --country ${country} --quality ${quality}`;
          await execAsync(command);
          completed++;
          const countryName = this.countries[country] || country;
          console.log(
            `✅ ${completed}/${countries.length}: ${countryName} (${country})`
          );
        } catch (error) {
          console.error(`❌ Error generating ${country}:`, error.message);
        }
      });

      await Promise.all(promises);
    }

    console.log(
      `🎉 Batch generation complete! Generated ${completed}/${countries.length} flags`
    );
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  async generateRegionalFlags() {
    console.log("🌍 Generating flags by regions...");

    const regions = {
      "North America": [
        "us",
        "ca",
        "mx",
        "gt",
        "bz",
        "cr",
        "sv",
        "hn",
        "ni",
        "pa",
      ],
      Europe: [
        "gb",
        "fr",
        "de",
        "it",
        "es",
        "nl",
        "be",
        "ch",
        "at",
        "se",
        "no",
        "dk",
      ],
      Asia: ["jp", "cn", "in", "kr", "th", "vn", "sg", "my", "ph", "id"],
      "South America": [
        "br",
        "ar",
        "cl",
        "pe",
        "co",
        "ve",
        "uy",
        "py",
        "ec",
        "bo",
      ],
      Africa: ["za", "ng", "eg", "ke", "ma", "gh", "tz", "ug", "ao", "mz"],
      Oceania: ["au", "nz", "fj", "pg", "sb", "vu", "nc", "pf"],
    };

    for (const [region, countries] of Object.entries(regions)) {
      console.log(`\n📍 Processing ${region}...`);
      await this.generateBatch(countries, "web", 2);
    }
  }

  async generatePopularFlags() {
    console.log("⭐ Generating most popular country flags...");

    // G20 countries and other popular ones
    const popularCountries = [
      "us",
      "gb",
      "ca",
      "au",
      "de",
      "fr",
      "it",
      "jp",
      "kr",
      "cn",
      "in",
      "br",
      "mx",
      "ru",
      "za",
      "tr",
      "sa",
      "ar",
      "id",
      "nl",
      "es",
      "ch",
      "se",
      "no",
      "dk",
      "be",
      "at",
      "ie",
      "fi",
    ];

    await this.generateBatch(popularCountries, "hd", 3);
  }

  async generateByFileSize() {
    console.log("📊 Analyzing SVG file sizes and generating accordingly...");

    const svgFiles = this.getAvailableSvgFiles();
    const fileSizes = svgFiles.map((file) => {
      const filePath = path.join(this.svgDir, `${file}.svg`);
      const stats = fs.statSync(filePath);
      return { code: file, size: stats.size };
    });

    // Sort by file size (larger files first for 4K, smaller for web)
    fileSizes.sort((a, b) => b.size - a.size);

    const largeFiles = fileSizes.slice(0, 10).map((f) => f.code);
    const mediumFiles = fileSizes.slice(10, 50).map((f) => f.code);
    const smallFiles = fileSizes.slice(50).map((f) => f.code);

    console.log("🔍 Large SVG files (generating in web quality):");
    await this.generateBatch(largeFiles, "web", 1);

    console.log("🔍 Medium SVG files (generating in HD quality):");
    await this.generateBatch(mediumFiles, "hd", 2);

    console.log("🔍 Small SVG files (generating in 4K quality):");
    await this.generateBatch(smallFiles.slice(0, 20), "4k", 1);
  }

  generateQualityComparison(countries = ["us", "jp", "gb"]) {
    console.log("📊 Generating quality comparison samples...");

    const qualities = ["web", "hd", "4k"];

    countries.forEach((country) => {
      qualities.forEach((quality) => {
        try {
          console.log(`Generating ${country} in ${quality} quality...`);
          execSync(
            `node scripts/build-hq-pngs.js --country ${country} --quality ${quality}`,
            { stdio: "pipe" }
          );
        } catch (error) {
          console.error(
            `❌ Error generating ${country} in ${quality}:`,
            error.message
          );
        }
      });
    });

    console.log("✅ Quality comparison samples generated!");
    this.showQualityComparison(countries);
  }

  showQualityComparison(countries) {
    console.log("\n📋 Quality Comparison Results:");
    console.log("=====================================");

    const qualities = [
      { name: "Web (512px)", dir: "png-web" },
      { name: "HD (1920px)", dir: "png-hd" },
      { name: "4K (3840px)", dir: "png-hq-4k" },
    ];

    countries.forEach((country) => {
      const countryName = this.countries[country] || country;
      console.log(`\n🏁 ${countryName} (${country}):`);

      qualities.forEach((quality) => {
        const fileName = `${countryName}.png`;
        const filePath = path.join(this.baseDir, quality.dir, fileName);

        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          const sizeKB = (stats.size / 1024).toFixed(1);
          console.log(`   ${quality.name}: ${sizeKB} KB`);
        } else {
          console.log(`   ${quality.name}: Not found`);
        }
      });
    });
  }

  showStatistics() {
    console.log("📊 PNG Generation Statistics:");
    console.log("============================");

    const directories = [
      { name: "SVG Source", path: "svg", extension: ".svg" },
      { name: "PNG Standard", path: "png", extension: ".png" },
      { name: "PNG Web (512px)", path: "png-web", extension: ".png" },
      { name: "PNG HD (1920px)", path: "png-hd", extension: ".png" },
      { name: "PNG 4K (3840px)", path: "png-hq-4k", extension: ".png" },
      { name: "PNG Print (2000px)", path: "png-print", extension: ".png" },
    ];

    directories.forEach((dir) => {
      const dirPath = path.join(this.baseDir, dir.path);
      if (fs.existsSync(dirPath)) {
        const files = fs
          .readdirSync(dirPath)
          .filter((f) => f.endsWith(dir.extension));

        if (files.length > 0) {
          // Calculate total size
          let totalSize = 0;
          files.forEach((file) => {
            const stats = fs.statSync(path.join(dirPath, file));
            totalSize += stats.size;
          });

          const totalMB = (totalSize / (1024 * 1024)).toFixed(1);
          const avgKB = (totalSize / files.length / 1024).toFixed(1);

          console.log(`${dir.name}:`);
          console.log(`   Files: ${files.length}`);
          console.log(`   Total: ${totalMB} MB`);
          console.log(`   Average: ${avgKB} KB per file`);
          console.log("");
        }
      }
    });
  }
}

// Example usage functions
async function runAdvancedExamples() {
  const generator = new FlagGenerator();

  console.log("🚀 Advanced PNG Generation Examples\n");

  // Show current statistics
  generator.showStatistics();

  console.log("Choose an advanced example:");
  console.log("1. Generate popular country flags (HD quality)");
  console.log("2. Generate flags by regions (Web quality)");
  console.log("3. Generate based on SVG file sizes");
  console.log("4. Create quality comparison samples");
  console.log("5. Show current statistics only");
  console.log("0. Exit");

  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter your choice (0-5): ", async (choice) => {
    console.log("");

    try {
      switch (choice) {
        case "1":
          await generator.generatePopularFlags();
          break;
        case "2":
          await generator.generateRegionalFlags();
          break;
        case "3":
          await generator.generateByFileSize();
          break;
        case "4":
          generator.generateQualityComparison();
          break;
        case "5":
          generator.showStatistics();
          break;
        case "0":
          console.log("👋 Goodbye!");
          break;
        default:
          console.log("❌ Invalid choice.");
          break;
      }
    } catch (error) {
      console.error("❌ Error during execution:", error.message);
    }

    rl.close();
  });
}

// Run if called directly
if (require.main === module) {
  runAdvancedExamples();
}

module.exports = FlagGenerator;
