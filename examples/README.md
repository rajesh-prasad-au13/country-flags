# Country Flag PNG Generation - Sample Scripts

This directory contains sample scripts and examples to help you use the PNG generation tools effectively.

## 📁 Available Examples

### 1. `basic-usage.js` - Interactive Basic Examples

**Usage:** `node examples/basic-usage.js`

An interactive Node.js script that demonstrates:

- Web-quality PNG generation (512px)
- 4K quality PNG generation (3840px)
- Generating specific countries only
- Listing available flag files
- Comparing file sizes across different quality levels

**Features:**

- Interactive menu system
- Real-time file size comparisons
- Error handling and progress feedback
- Safe execution with user confirmation

### 2. `interactive-generation.sh` - Bash Interactive Tool

**Usage:** `chmod +x examples/interactive-generation.sh && ./examples/interactive-generation.sh`

A comprehensive bash script that provides:

- Full interactive menu with all quality options
- Disk space usage monitoring
- Generation time estimates
- Custom size generation
- Regional flag generation
- Color-coded output for better UX

**Features:**

- ✅ Pre-generation estimates (time & file size)
- 📊 Disk usage monitoring
- 🎯 Specific country selection
- ⚠️ Safety warnings for large operations
- 🌈 Color-coded terminal output

### 3. `advanced-generation.js` - Batch Operations

**Usage:** `node examples/advanced-generation.js`

Advanced usage patterns for power users:

- Batch generation with parallel processing
- Regional flag generation (continents)
- Popular countries priority generation
- File size-based generation strategies
- Quality comparison samples
- Comprehensive statistics

**Features:**

- 🔄 Parallel processing (configurable)
- 🌍 Regional batch operations
- 📊 SVG file size analysis
- ⭐ Popular countries presets
- 📈 Generation statistics

## 🚀 Quick Start Examples

### Generate Web-Quality PNGs (Fast)

```bash
# Interactive approach
./examples/interactive-generation.sh

# Direct npm script
npm run build:hq-web

# Node.js approach
node examples/basic-usage.js
```

### Generate Specific Countries

```bash
# Using the interactive script
./examples/interactive-generation.sh
# Then choose option 6

# Direct command
node scripts/build-hq-pngs.js --country us --quality web
node scripts/build-hq-pngs.js --country jp --quality hd
```

### Generate Popular Countries (G20 + Major Nations)

```bash
node examples/advanced-generation.js
# Then choose option 1
```

### Create Quality Comparison

```bash
node examples/advanced-generation.js
# Then choose option 4
```

## 📊 Quality Level Recommendations

| Use Case          | Quality Level    | Size        | Speed     | Recommended For          |
| ----------------- | ---------------- | ----------- | --------- | ------------------------ |
| **Web/Mobile**    | `web` (512px)    | 20-80 KB    | Fast      | Websites, mobile apps    |
| **Presentations** | `hd` (1920px)    | 200-800 KB  | Medium    | PowerPoint, displays     |
| **Print Media**   | `print` (2000px) | 400KB-1.5MB | Medium    | Brochures, documents     |
| **Ultra Quality** | `4k` (3840px)    | 800KB-3MB   | Slow      | Large displays, archives |
| **Maximum**       | `ultra` (7680px) | 2-10MB      | Very Slow | Professional printing    |

## 🎯 Common Use Cases

### 1. Website Integration

```bash
# Generate optimized web flags
npm run build:hq-web

# Result: png-web/ directory with ~20-80KB files
# Perfect for: <img src="flags/United States.png" />
```

### 2. Mobile App Resources

```bash
# Generate multiple sizes for responsive design
node scripts/build-hq-pngs.js --quality web    # 512px
node scripts/build-hq-pngs.js --quality hd     # 1920px
```

### 3. Print Design

```bash
# High-quality for print materials
npm run build:hq-print

# Result: png-print/ directory with 2000px images
```

### 4. Presentation Materials

```bash
# HD quality for PowerPoint/Keynote
npm run build:hq-hd

# Result: png-hd/ directory with 1920px images
```

## 🔧 Customization Examples

### Custom Size Generation

```bash
# Generate 1024px flags
node scripts/build-hq-pngs.js --width 1024 --output png-custom-1024

# Generate 256px thumbnails
node scripts/build-hq-pngs.js --width 256 --output png-thumbnails
```

### Specific Country Sets

```bash
# European Union countries
node examples/advanced-generation.js
# Implement custom country lists in the script

# G7 countries only
countries=("us" "ca" "gb" "fr" "de" "it" "jp")
for country in "${countries[@]}"; do
    node scripts/build-hq-pngs.js --country "$country" --quality hd
done
```

## 📈 Performance Tips

### 1. Parallel Generation

```javascript
// In advanced-generation.js
await generator.generateBatch(countries, "web", 3); // 3 parallel processes
```

### 2. Incremental Generation

```bash
# Only generate missing files
node scripts/build-hq-pngs.js --quality web --skip-existing
```

### 3. Memory Management

```bash
# For large batches, process in chunks
node --max-old-space-size=4096 scripts/build-hq-pngs.js --quality 4k
```

## 🛠️ Troubleshooting

### Common Issues

1. **Out of memory errors**: Use `--max-old-space-size=4096` for Node.js
2. **Permission errors**: Use `chmod +x` for shell scripts
3. **Missing dependencies**: Run `npm install` to install Sharp
4. **Pixel limit errors**: Some SVGs are too complex for ultra-high resolutions

### Debug Mode

```bash
# Enable debug output
DEBUG=1 node scripts/build-hq-pngs.js --quality web
```

## 📝 Creating Custom Scripts

### Example: Custom Quality Script

```javascript
const { execSync } = require("child_process");

// Generate custom quality for specific use case
const customQuality = {
  width: 800,
  density: 150,
  quality: 95,
};

execSync(
  `node scripts/build-hq-pngs.js --width ${customQuality.width} --density ${customQuality.density} --output png-custom`
);
```

### Example: Automated Workflow

```bash
#!/bin/bash
# automated-generation.sh

echo "🚀 Starting automated flag generation workflow..."

# Step 1: Generate web flags for immediate use
npm run build:hq-web

# Step 2: Generate HD flags for popular countries
popular_countries=("us" "gb" "ca" "au" "de" "fr" "jp")
for country in "${popular_countries[@]}"; do
    node scripts/build-hq-pngs.js --country "$country" --quality hd
done

# Step 3: Generate 4K flags for top 10 countries
top_countries=("us" "cn" "jp" "de" "gb" "in" "fr" "it" "br" "ca")
for country in "${top_countries[@]}"; do
    node scripts/build-hq-pngs.js --country "$country" --quality 4k
done

echo "✅ Automated workflow complete!"
```

## 🎉 Getting Started

1. **First time setup:**

   ```bash
   npm install
   chmod +x examples/interactive-generation.sh
   ```

2. **Try the interactive tool:**

   ```bash
   ./examples/interactive-generation.sh
   ```

3. **Or use the Node.js examples:**

   ```bash
   node examples/basic-usage.js
   ```

4. **For advanced users:**
   ```bash
   node examples/advanced-generation.js
   ```

These examples will help you understand the tools and find the best workflow for your specific needs!
