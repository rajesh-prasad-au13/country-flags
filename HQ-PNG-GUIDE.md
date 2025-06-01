# High-Quality PNG Generation Guide

This repository now includes enhanced tools for generating ultra-high-quality PNG images from the SVG flag sources.

## 📋 Sample Scripts & Examples

**New to this tool?** Check out the interactive examples in the `examples/` directory:

- **`examples/interactive-generation.sh`** - Interactive bash menu for all generation options
- **`examples/basic-usage.js`** - Node.js examples with explanations
- **`examples/advanced-generation.js`** - Batch operations and advanced patterns
- **`examples/README.md`** - Comprehensive usage guide

Quick start: `./examples/interactive-generation.sh`

## 🚀 Quick Start for High-Quality PNGs

### Install Dependencies

For the enhanced high-quality generator (recommended):

```bash
npm install sharp
```

For the standard generator with optimizations:

```bash
npm install -g svgexport imagemin-cli imagemin-pngquant-cli imagemin-optipng-cli
```

### Generate High-Quality PNGs

#### Method 1: High-Quality Generator (Recommended)

Use the new Sharp-based generator for superior quality:

```bash
# Web optimized (512px)
npm run build-hq-pngs web

# HD quality (1920px)
npm run build-hq-pngs hd

# 4K quality (3840px)
npm run build-hq-pngs 4k

# Print quality (2000px @ 300 DPI)
npm run build-hq-pngs print

# Ultra quality (7680px - 8K)
npm run build-hq-pngs ultra

# Custom dimensions
npm run build-hq-pngs 2500:
npm run build-hq-pngs :1600
npm run build-hq-pngs 2000:1333
```

#### Method 2: Enhanced Standard Generator

Use the improved svgexport-based generator:

```bash
# Enhanced with high-quality presets
npm run build-pngs hd      # 1920px width
npm run build-pngs 4k      # 3840px width
npm run build-pngs print   # 2000px width

# Traditional dimensions
npm run build-pngs 1000:
npm run build-pngs :800
```

## 📊 Quality Comparison

| Method                | Engine               | Quality    | Speed      | Features                                            |
| --------------------- | -------------------- | ---------- | ---------- | --------------------------------------------------- |
| **High-Quality**      | Sharp                | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   | Anti-aliasing, Color management, Better compression |
| **Enhanced Standard** | svgexport + imagemin | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | PNG optimization, Quality control                   |
| **Original**          | svgexport            | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ | Basic conversion                                    |

## 🎨 Quality Features

### High-Quality Generator (Sharp-based)

- **Superior Anti-aliasing**: Smooth edges and curves
- **Color Management**: Proper color space handling
- **Subpixel Rendering**: Enhanced detail preservation
- **Adaptive Compression**: Optimal file size vs quality
- **High DPI Support**: Print-ready resolution

### Enhanced Standard Generator

- **Quality Control**: `--quality=100` for maximum fidelity
- **Advanced PNG Optimization**: pngquant + optipng
- **Lossless Compression**: Maintains original quality
- **Fallback Support**: Graceful degradation if plugins unavailable

## 📁 Output Structure

Generated PNGs are organized by quality/size:

```
png-hq-web/          # 512px web-optimized
png-hq-hd/           # 1920px HD quality
png-hq-4k/           # 3840px 4K quality
png-hq-print/        # 2000px print quality
png-hq-ultra/        # 7680px ultra quality
png-hq-2000px/       # Custom dimensions
pnghd/               # Standard generator HD
png4k/               # Standard generator 4K
```

## 🔧 Advanced Usage

### Batch Processing

```bash
# Generate all common sizes
npm run build-hq-presets

# Generate print-ready flags
npm run build-print-quality
```

### Custom Sharp Settings

For even more control, you can modify `scripts/build-hq-pngs.js`:

```javascript
// Ultra-high quality settings
sharpInstance = sharpInstance.png({
  compressionLevel: 9, // Maximum compression
  adaptiveFiltering: true, // Better compression
  palette: false, // Full color depth
  quality: 100, // Maximum quality
  effort: 10, // Maximum effort
});
```

## 📏 Recommended Sizes

| Use Case            | Preset  | Size   | DPI | Description           |
| ------------------- | ------- | ------ | --- | --------------------- |
| **Web Display**     | `web`   | 512px  | 96  | Responsive websites   |
| **High-res Web**    | `hd`    | 1920px | 150 | Retina displays       |
| **Print Media**     | `print` | 2000px | 300 | Professional printing |
| **Large Format**    | `4k`    | 3840px | 300 | Banners, posters      |
| **Maximum Quality** | `ultra` | 7680px | 600 | Archive quality       |

## 🛠️ Troubleshooting

### Sharp Installation Issues

```bash
# Force rebuild Sharp binaries
npm rebuild sharp

# Install with specific platform
npm install --platform=darwin --arch=x64 sharp
```

### Memory Issues with Ultra Quality

For very large outputs, increase Node.js memory:

```bash
node --max-old-space-size=4096 scripts/build-hq-pngs.js ultra
```

## 💡 Tips for Best Quality

1. **Use Sharp-based generator** for best quality
2. **Choose appropriate DPI** for your use case
3. **Consider file size** vs quality trade-offs
4. **Use print preset** for physical media
5. **Test different settings** for your specific needs

## 🔍 Quality Verification

To verify PNG quality:

```bash
# Check file info
file png-hq-4k/us.png

# Check dimensions
identify png-hq-4k/us.png

# Compare file sizes
ls -lh png-hq-*/*.png | head -5
```
