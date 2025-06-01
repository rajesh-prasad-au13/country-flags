#!/bin/bash

# Country Flag PNG Generation - Interactive Sample Script
# This script provides an interactive way to generate PNG flags

echo "🏁 Country Flag PNG Generation Tool"
echo "=================================="
echo ""

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display menu
show_menu() {
    echo -e "${BLUE}Choose a generation option:${NC}"
    echo "1. Quick web-quality PNGs (512px) - Recommended for websites"
    echo "2. HD quality PNGs (1920px) - Good for presentations"
    echo "3. 4K ultra-quality PNGs (3840px) - Best quality, large files"
    echo "4. Print quality PNGs (2000px) - Good for printing"
    echo "5. Custom size PNGs"
    echo "6. Generate specific countries only"
    echo "7. Show available npm scripts"
    echo "8. Check disk space usage"
    echo "0. Exit"
    echo ""
}

# Function to check if directory exists and show file count
check_output_dir() {
    local dir=$1
    local name=$2
    
    if [ -d "$dir" ]; then
        local count=$(ls -1 "$dir"/*.png 2>/dev/null | wc -l)
        echo -e "${GREEN}✅ $name directory exists with $count PNG files${NC}"
        
        # Show a few sample files
        if [ $count -gt 0 ]; then
            echo "   Sample files:"
            ls "$dir"/*.png 2>/dev/null | head -3 | while read file; do
                local size=$(du -h "$file" | cut -f1)
                local filename=$(basename "$file")
                echo "   - $filename ($size)"
            done
        fi
    else
        echo -e "${YELLOW}⚠️  $name directory doesn't exist yet${NC}"
    fi
    echo ""
}

# Function to show disk space usage
show_disk_usage() {
    echo -e "${BLUE}📊 Disk Space Usage:${NC}"
    echo ""
    
    # Check each output directory
    check_output_dir "png" "Standard PNG"
    check_output_dir "png-web" "Web Quality (512px)"
    check_output_dir "png-hd" "HD Quality (1920px)"
    check_output_dir "png-hq-4k" "4K Quality (3840px)"
    check_output_dir "png-print" "Print Quality (2000px)"
    check_output_dir "png-ultra" "Ultra Quality (7680px)"
    
    # Show total size of all PNG directories
    echo -e "${BLUE}Total PNG storage:${NC}"
    du -sh png* 2>/dev/null | sort -hr
    echo ""
}

# Function to generate specific countries
generate_specific_countries() {
    echo -e "${BLUE}🎯 Generate Specific Countries${NC}"
    echo ""
    echo "Enter country codes separated by spaces (e.g., us ca gb fr jp)"
    echo "Some popular codes: us ca gb fr de jp cn in br au"
    echo -n "Country codes: "
    read countries
    
    if [ -z "$countries" ]; then
        echo -e "${RED}❌ No countries specified${NC}"
        return
    fi
    
    echo ""
    echo "Select quality:"
    echo "1. Web (512px)"
    echo "2. HD (1920px)"
    echo "3. 4K (3840px)"
    echo -n "Choice (1-3): "
    read quality_choice
    
    case $quality_choice in
        1) quality="web";;
        2) quality="hd";;
        3) quality="4k";;
        *) echo -e "${RED}❌ Invalid choice${NC}"; return;;
    esac
    
    echo ""
    echo -e "${YELLOW}🚀 Generating $quality quality PNGs for: $countries${NC}"
    
    for country in $countries; do
        echo "Processing $country..."
        node scripts/build-hq-pngs.js --country "$country" --quality "$quality"
    done
    
    echo -e "${GREEN}✅ Specific countries generated!${NC}"
}

# Function to show available npm scripts
show_npm_scripts() {
    echo -e "${BLUE}📋 Available NPM Scripts:${NC}"
    echo ""
    
    if [ -f "package.json" ]; then
        echo "Standard generation scripts:"
        echo "• npm run build:pngs - Standard PNG generation"
        echo ""
        echo "High-quality generation scripts:"
        echo "• npm run build:hq-web - Web quality (512px)"
        echo "• npm run build:hq-hd - HD quality (1920px)"
        echo "• npm run build:hq-4k - 4K quality (3840px)"
        echo "• npm run build:hq-print - Print quality (2000px)"
        echo "• npm run build:hq-ultra - Ultra quality (7680px)"
        echo ""
        echo "Direct script usage:"
        echo "• node scripts/build-pngs.js"
        echo "• node scripts/build-hq-pngs.js [options]"
        echo ""
    else
        echo -e "${RED}❌ package.json not found${NC}"
    fi
}

# Function to estimate generation time and file sizes
estimate_generation() {
    local quality=$1
    local svg_count=$(ls svg/*.svg 2>/dev/null | wc -l)
    
    echo -e "${BLUE}📊 Generation Estimates for $quality quality:${NC}"
    echo "• Source SVG files: $svg_count"
    
    case $quality in
        "web")
            echo "• Estimated time: 2-5 minutes"
            echo "• Estimated file size per flag: 20-80 KB"
            echo "• Total estimated size: 5-20 MB"
            ;;
        "hd")
            echo "• Estimated time: 5-10 minutes"
            echo "• Estimated file size per flag: 200-800 KB"
            echo "• Total estimated size: 50-200 MB"
            ;;
        "4k")
            echo "• Estimated time: 15-30 minutes"
            echo "• Estimated file size per flag: 800KB-3MB"
            echo "• Total estimated size: 200MB-800MB"
            ;;
        "print")
            echo "• Estimated time: 10-20 minutes"
            echo "• Estimated file size per flag: 400KB-1.5MB"
            echo "• Total estimated size: 100-400 MB"
            ;;
    esac
    echo ""
}

# Main loop
while true; do
    show_menu
    echo -n "Enter your choice (0-8): "
    read choice
    echo ""
    
    case $choice in
        1)
            echo -e "${YELLOW}🚀 Generating web-quality PNGs (512px)...${NC}"
            estimate_generation "web"
            echo -n "Continue? (y/N): "
            read confirm
            if [[ $confirm =~ ^[Yy]$ ]]; then
                npm run build:hq-web
                echo -e "${GREEN}✅ Web-quality PNGs generated!${NC}"
            fi
            ;;
        2)
            echo -e "${YELLOW}🚀 Generating HD quality PNGs (1920px)...${NC}"
            estimate_generation "hd"
            echo -n "Continue? (y/N): "
            read confirm
            if [[ $confirm =~ ^[Yy]$ ]]; then
                npm run build:hq-hd
                echo -e "${GREEN}✅ HD quality PNGs generated!${NC}"
            fi
            ;;
        3)
            echo -e "${YELLOW}🚀 Generating 4K ultra-quality PNGs (3840px)...${NC}"
            echo -e "${RED}⚠️  Warning: This will take 15-30 minutes and use 200MB-800MB disk space${NC}"
            estimate_generation "4k"
            echo -n "Continue? (y/N): "
            read confirm
            if [[ $confirm =~ ^[Yy]$ ]]; then
                npm run build:hq-4k
                echo -e "${GREEN}✅ 4K quality PNGs generated!${NC}"
            fi
            ;;
        4)
            echo -e "${YELLOW}🚀 Generating print quality PNGs (2000px)...${NC}"
            estimate_generation "print"
            echo -n "Continue? (y/N): "
            read confirm
            if [[ $confirm =~ ^[Yy]$ ]]; then
                npm run build:hq-print
                echo -e "${GREEN}✅ Print quality PNGs generated!${NC}"
            fi
            ;;
        5)
            echo -e "${BLUE}📏 Custom Size Generation${NC}"
            echo -n "Enter width in pixels (e.g., 1024): "
            read width
            if [[ $width =~ ^[0-9]+$ ]]; then
                echo -e "${YELLOW}🚀 Generating ${width}px PNGs...${NC}"
                node scripts/build-hq-pngs.js --width "$width" --output "png-custom-${width}"
                echo -e "${GREEN}✅ Custom size PNGs generated!${NC}"
            else
                echo -e "${RED}❌ Invalid width${NC}"
            fi
            ;;
        6)
            generate_specific_countries
            ;;
        7)
            show_npm_scripts
            ;;
        8)
            show_disk_usage
            ;;
        0)
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid choice. Please try again.${NC}"
            ;;
    esac
    
    echo ""
    echo "Press Enter to continue..."
    read
    echo ""
    echo "=================================================="
    echo ""
done
