#!/usr/bin/env node

/**
 * High-Quality PNG Generator for Country Flags
 *
 * This script generates ultra-high-quality PNG images from SVG sources
 * using Sharp library for superior image processing.
 *
 * Features:
 * - Sharp rendering engine for better quality
 * - Anti-aliasing and subpixel rendering
 * - Proper color space handling
 * - Lossless PNG compression
 * - Multiple quality presets
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const svg_directory = "svg/";
const countries_file = "countries.json";

// Load country names mapping
let countryNames = {};

function load_country_names() {
  try {
    const data = fs.readFileSync(countries_file, "utf8");
    countryNames = JSON.parse(data);
    console.log(`✓ Loaded ${Object.keys(countryNames).length} country names`);
    return true;
  } catch (error) {
    console.log(
      `⚠ Could not load country names from ${countries_file}: ${error.message}`
    );
    console.log("Falling back to ISO codes for filenames");
    return false;
  }
}

function sanitize_filename(name) {
  // Replace problematic characters with safe alternatives
  return name
    .replace(/[\/\\:*?"<>|]/g, "") // Remove illegal filename characters
    .replace(/[,]/g, "") // Remove commas but keep other punctuation like apostrophes
    .replace(/\s+/g, " ") // Normalize multiple spaces to single space
    .trim();
}

function get_country_filename(isoCode) {
  const countryName = countryNames[isoCode.toUpperCase()];
  if (countryName) {
    return sanitize_filename(countryName) + ".png";
  }
  // Fallback to ISO code if country name not found
  return isoCode.toLowerCase() + ".png";
}

const help_message = `High-Quality PNG Generator for Country Flags

Usage: node scripts/build-hq-pngs.js [preset|dimensions]

Quality Presets:
  web       - 512px width (web optimized)
  hd        - 1920px width (HD quality)  
  4k        - 3840px width (4K quality)
  print     - 300 DPI equivalent (2000px)
  ultra     - 7680px width (8K quality)

Custom Dimensions:
  1000:     - width 1000px
  :800      - height 800px
  1000:800  - width 1000px, height 800px

Examples:
  node scripts/build-hq-pngs.js hd
  node scripts/build-hq-pngs.js 4k
  node scripts/build-hq-pngs.js 2000:
`;

// Quality presets with their dimensions and settings
const quality_presets = {
  web: { dimensions: "512:", dpi: 96, description: "Web optimized (512px)" },
  hd: { dimensions: "1920:", dpi: 150, description: "HD quality (1920px)" },
  "4k": { dimensions: "3840:", dpi: 300, description: "4K quality (3840px)" },
  print: {
    dimensions: "2000:",
    dpi: 300,
    description: "Print quality (2000px @ 300 DPI)",
  },
  ultra: {
    dimensions: "7680:",
    dpi: 600,
    description: "8K ultra quality (7680px)",
  },
};

function get_dimensions_and_settings() {
  const input = process.argv[2];

  if (quality_presets[input?.toLowerCase()]) {
    const preset = quality_presets[input.toLowerCase()];
    return {
      dimensions: preset.dimensions,
      dpi: preset.dpi,
      outputDir: `png-hq-${input.toLowerCase()}`,
      description: preset.description,
    };
  }

  // Parse custom dimensions
  if (input && /^[0-9]*:[0-9]*$/.test(input) && input.length > 2) {
    const parts = input.split(":").filter((x) => x.length > 0);
    const dirName = parts.length > 1 ? parts.join("x") : parts[0];

    return {
      dimensions: input,
      dpi: 300, // Default high DPI
      outputDir: `png-hq-${dirName}px`,
      description: `Custom dimensions (${input})`,
    };
  }

  return null;
}

function parse_dimensions(dimensionString) {
  const parts = dimensionString.split(":");
  const width = parts[0] ? parseInt(parts[0]) : null;
  const height = parts[1] ? parseInt(parts[1]) : null;

  return { width, height };
}

async function check_sharp_installation() {
  try {
    require("sharp");
    console.log("✓ Sharp library is available");
    return true;
  } catch (error) {
    console.log("✗ Sharp library is not installed.");
    console.log("Please install it with: npm install sharp");
    console.log("");
    console.log(
      "Sharp provides superior image quality compared to other libraries:"
    );
    console.log("- Better anti-aliasing and subpixel rendering");
    console.log("- Proper color space handling");
    console.log("- Faster processing");
    console.log("- Better PNG compression");
    return false;
  }
}

async function get_svg_files() {
  try {
    const items = await fs.promises.readdir(svg_directory);
    return items.filter((path) => /^[a-z\-]+\.svg$/.test(path));
  } catch (error) {
    console.log(
      "Could not list *.svg files. You probably ran this command from the wrong working directory."
    );
    console.log(error);
    process.exit(1);
  }
}

async function convert_svg_to_hq_png(svgPath, outputPath, width, height, dpi) {
  try {
    // Read SVG file
    const svgBuffer = await fs.promises.readFile(svgPath);

    // Create Sharp instance with high-quality settings and increased limits
    let sharpInstance = sharp(svgBuffer, {
      density: dpi, // Higher DPI for better quality
      limitInputPixels: 268402689 * 4, // Increase pixel limit (4x default)
    });

    // Resize with high-quality settings
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: "contain", // Maintain aspect ratio
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
        withoutEnlargement: false,
        fastShrinkOnLoad: false, // Better quality
      });
    }

    // Convert to PNG with optimal settings
    sharpInstance = sharpInstance.png({
      compressionLevel: 6, // Good compression without quality loss
      adaptiveFiltering: true, // Better compression
      palette: false, // Full color depth
      quality: 100, // Maximum quality
      effort: 10, // Maximum effort for best compression
    });

    // Save the file
    await sharpInstance.toFile(outputPath);

    return true;
  } catch (error) {
    console.error(`Failed to convert ${svgPath}:`, error.message);
    return false;
  }
}

async function main() {
  // Check arguments
  if (process.argv.length !== 3) {
    console.log(help_message);
    process.exit(1);
  }

  // Parse dimensions and settings
  const settings = get_dimensions_and_settings();
  if (!settings) {
    console.log(help_message);
    process.exit(1);
  }

  console.log(`\n🚀 High-Quality PNG Generator`);
  console.log(`📐 Mode: ${settings.description}`);
  console.log(`📁 Output: ${settings.outputDir}`);
  console.log(`🎨 DPI: ${settings.dpi}`);

  // Load country names mapping
  const hasCountryNames = load_country_names();
  if (hasCountryNames) {
    console.log(`🌍 Using country names for filenames`);
  } else {
    console.log(`🏷️  Using ISO codes for filenames`);
  }

  // Check if Sharp is installed
  if (!(await check_sharp_installation())) {
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(settings.outputDir)) {
    fs.mkdirSync(settings.outputDir, { recursive: true });
  }

  // Get all SVG files
  const svgFiles = await get_svg_files();
  console.log(`\n📄 Found ${svgFiles.length} SVG files`);

  // Parse dimensions
  const { width, height } = parse_dimensions(settings.dimensions);
  console.log(`📏 Target dimensions: ${width || "auto"} x ${height || "auto"}`);

  console.log("\n🔄 Converting files...\n");

  let successful = 0;
  let failed = 0;

  // Convert all files
  for (let i = 0; i < svgFiles.length; i++) {
    const svgFile = svgFiles[i];
    const svgPath = path.join(svg_directory, svgFile);

    // Extract ISO code from filename and get country name
    const isoCode = svgFile.replace(".svg", "");
    const pngFile = get_country_filename(isoCode);
    const pngPath = path.join(settings.outputDir, pngFile);

    process.stdout.write(
      `[${i + 1}/${svgFiles.length}] ${svgFile} → ${pngFile} ... `
    );

    const success = await convert_svg_to_hq_png(
      svgPath,
      pngPath,
      width,
      height,
      settings.dpi
    );

    if (success) {
      console.log("✓");
      successful++;
    } else {
      console.log("✗");
      failed++;
    }
  }

  console.log(`\n🎉 Conversion complete!`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📁 Output directory: ${settings.outputDir}`);

  if (failed > 0) {
    console.log(
      `\n⚠️  Some files failed to convert. Check the error messages above.`
    );
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { convert_svg_to_hq_png, quality_presets };
