#!/bin/bash

# Sample Scripts for High-Quality Country Flag PNG Generation
# ===========================================================

echo "🚀 Country Flags PNG Generation Sample Scripts"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "countries.json" ]; then
    echo "❌ Error: Please run this script from the country-flags directory"
    exit 1
fi

echo ""
echo "📋 Available generation methods:"
echo "1. High-Quality Generator (Sharp-based) - Recommended"
echo "2. Enhanced Standard Generator (svgexport-based)"
echo ""

# Function to generate with high-quality generator
generate_hq() {
    echo "🔥 Using High-Quality Generator (Sharp-based)"
    echo "=============================================="
    
    echo ""
    echo "📱 Web Quality (512px):"
    echo "node scripts/build-hq-pngs.js web"
    node scripts/build-hq-pngs.js web
    
    echo ""
    echo "🖥️  HD Quality (1920px):"
    echo "node scripts/build-hq-pngs.js hd"
    node scripts/build-hq-pngs.js hd
    
    echo ""
    echo "📺 4K Quality (3840px):"
    echo "node scripts/build-hq-pngs.js 4k"
    node scripts/build-hq-pngs.js 4k
    
    echo ""
    echo "🖨️  Print Quality (2000px @ 300 DPI):"
    echo "node scripts/build-hq-pngs.js print"
    node scripts/build-hq-pngs.js print
    
    echo ""
    echo "🌟 Ultra Quality (7680px - 8K):"
    echo "node scripts/build-hq-pngs.js ultra"
    echo "⚠️  Warning: This will create very large files!"
    # Uncomment to run: node scripts/build-hq-pngs.js ultra
}

# Function to generate with standard generator
generate_standard() {
    echo "⚡ Using Enhanced Standard Generator"
    echo "===================================="
    
    echo ""
    echo "🖥️  HD Quality (1920px):"
    echo "node scripts/build-pngs.js hd"
    node scripts/build-pngs.js hd
    
    echo ""
    echo "📺 4K Quality (3840px):"
    echo "node scripts/build-pngs.js 4k"
    node scripts/build-pngs.js 4k
    
    echo ""
    echo "🖨️  Print Quality (2000px):"
    echo "node scripts/build-pngs.js print"
    node scripts/build-pngs.js print
    
    echo ""
    echo "📐 Custom Size (1500px width):"
    echo "node scripts/build-pngs.js 1500:"
    node scripts/build-pngs.js 1500:
}

# Function to generate custom sizes
generate_custom() {
    echo "🎨 Custom Size Examples"
    echo "======================="
    
    echo ""
    echo "📐 Custom width (2500px):"
    echo "node scripts/build-hq-pngs.js 2500:"
    node scripts/build-hq-pngs.js 2500:
    
    echo ""
    echo "📏 Custom height (1600px):"
    echo "node scripts/build-hq-pngs.js :1600"
    node scripts/build-hq-pngs.js :1600
    
    echo ""
    echo "📱 Custom dimensions (1920x1080):"
    echo "node scripts/build-hq-pngs.js 1920:1080"
    node scripts/build-hq-pngs.js 1920:1080
}

# Main menu
echo "🎯 Choose generation type:"
echo "1) High-Quality Generator (Recommended)"
echo "2) Enhanced Standard Generator"
echo "3) Custom Sizes Demo"
echo "4) Show file info"
echo "5) Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        generate_hq
        ;;
    2)
        generate_standard
        ;;
    3)
        generate_custom
        ;;
    4)
        echo ""
        echo "📊 Generated Files Information:"
        echo "================================"
        for dir in png-hq-* png*px; do
            if [ -d "$dir" ]; then
                count=$(ls "$dir"/*.png 2>/dev/null | wc -l)
                size=$(du -sh "$dir" 2>/dev/null | cut -f1)
                echo "📁 $dir: $count files, $size total"
                
                # Show sample file info
                sample=$(ls "$dir"/*.png 2>/dev/null | head -1)
                if [ -n "$sample" ]; then
                    echo "   Sample: $(basename "$sample")"
                    file "$sample" | sed 's/^/   /'
                fi
                echo ""
            fi
        done
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Script completed!"
echo "📁 Check the generated directories for your PNG files"
echo "🔍 Files are named with proper country names (e.g., 'United States.png', 'India.png')"
