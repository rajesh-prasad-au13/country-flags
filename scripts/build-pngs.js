var process = require("process");
var exec = require("child_process").exec;
var execSync = require("child_process").execSync;
var fs = require("fs");

var help_message = `You must pass one argument to build-pngs. It should be target dimension in the format:
  200:     - width 200px
  :200     - height 200px  
  200:300  - width 200px, height 300px

High-quality presets:
  hd       - 1920px width (HD quality)
  4k       - 3840px width (4K quality)
  print    - 300 DPI equivalent (approx 2000px for standard flag)
  
Examples:
  npm run build-pngs -- 1000:
  npm run build-pngs -- hd
  npm run build-pngs -- 4k`;
var svg_directory = "svg/";
var countries_file = "countries.json";

// Load country names mapping
var countryNames = {};

function load_country_names() {
  try {
    var data = fs.readFileSync(countries_file, "utf8");
    countryNames = JSON.parse(data);
    console.log(
      "✓ Loaded " + Object.keys(countryNames).length + " country names"
    );
    return true;
  } catch (error) {
    console.log(
      "⚠ Could not load country names from " +
        countries_file +
        ": " +
        error.message
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
  var countryName = countryNames[isoCode.toUpperCase()];
  if (countryName) {
    return sanitize_filename(countryName) + ".png";
  }
  // Fallback to ISO code if country name not found
  return isoCode.toLowerCase() + ".png";
}

// Check arguments
function get_output_directory() {
  var input = process.argv[2];

  // Handle high-quality presets
  var presets = ["hd", "4k", "print"];
  if (presets.includes(input.toLowerCase())) {
    return "png" + input.toLowerCase();
  }

  // Replace : with x, if two dimensions are specified
  var dim = input.split(":").filter((x) => x.length > 0);
  var dir = "png" + (dim.length > 1 ? dim.join("x") : dim) + "px";

  return dir;
}

function get_output_dimensions() {
  var input = process.argv[2];

  // Handle high-quality presets
  switch (input.toLowerCase()) {
    case "hd":
      return "1920:";
    case "4k":
      return "3840:";
    case "print":
      return "2000:"; // ~300 DPI for standard flag size
    default:
      return input;
  }
}

function check_arguments(callback) {
  if (process.argv.length != 3) {
    console.log(help_message);
    process.exit(1);
  }

  var dimensions = process.argv[2];

  // Check for high-quality presets
  var presets = ["hd", "4k", "print"];
  if (presets.includes(dimensions.toLowerCase())) {
    var actual_dimensions = get_output_dimensions();
    var output_folder = "png" + dimensions.toLowerCase();
    console.log(
      "Using " +
        dimensions.toUpperCase() +
        " preset (" +
        actual_dimensions +
        ")"
    );
    console.log("Output folder: " + output_folder);

    if (!fs.existsSync(output_folder)) {
      fs.mkdirSync(output_folder);
    }

    callback();
    return;
  }

  // Check for standard dimension format
  if (/^[0-9]*:[0-9]*$/.test(dimensions) && dimensions.length > 2) {
    var output_folder = get_output_directory();
    console.log("Output folder: " + output_folder);

    if (!fs.existsSync(output_folder)) {
      fs.mkdirSync(output_folder);
    }

    callback();
  } else {
    console.log(help_message);
    process.exit(1);
  }
}

function check_for_svgexport(callback) {
  // Check for presence of imagemin-cli and svgexport
  console.log("Checking if `svgexport` is available...");
  exec("svgexport", function (error, stdout, stderr) {
    if (stdout.indexOf("Usage: svgexport") !== -1) {
      callback();
    } else {
      console.log("`svgexport` is not installed.");
      console.log("Please run: npm install -g svgexport");
      process.exit(1);
    }
  });
}

function check_for_imagemin(callback) {
  // Check for presence of imagemin-cli and required plugins
  console.log("Checking if `imagemin-cli` is available...");
  exec("imagemin --version", function (error, stdout, stderr) {
    if (!error) {
      console.log("Checking for PNG optimization plugins...");
      // Check for pngquant plugin
      exec("imagemin --help", function (help_error, help_stdout, help_stderr) {
        if (help_stdout.includes("pngquant")) {
          console.log("✓ pngquant plugin found");
        } else {
          console.log(
            "⚠ pngquant plugin not found. Install with: npm install -g imagemin-pngquant-cli"
          );
        }

        if (help_stdout.includes("optipng")) {
          console.log("✓ optipng plugin found");
        } else {
          console.log(
            "⚠ optipng plugin not found. Install with: npm install -g imagemin-optipng-cli"
          );
        }

        callback();
      });
    } else {
      console.log("`imagemin-cli` is not installed.");
      console.log("Please run: npm install -g imagemin-cli");
      console.log("For high-quality PNG optimization, also install:");
      console.log(
        "  npm install -g imagemin-pngquant-cli imagemin-optipng-cli"
      );
      process.exit(1);
    }
  });
}

function get_all_svgs(callback) {
  fs.readdir(
    svg_directory,
    function (err, items) {
      if (err) {
        console.log(
          "Could not list *.svg files. You probably ran this command from the wrong working directory."
        );
        console.log(err);
        process.exit(1);
      }

      items = items.filter((path) => /^[a-z\-]+\.svg$/.test(path));
      callback(items);
    },
    (error) => {}
  );
}

function convert_and_compress_svg(path_to_svg) {
  // Extract ISO code from SVG filename
  var svg_filename = path_to_svg.split("/").pop();
  var iso_code = svg_filename.replace(".svg", "");

  var path_to_tmp_png =
    path_to_svg.substring(0, path_to_svg.length - 4) + ".png";

  // Enhanced svgexport command with high-quality settings
  // Added quality settings for better rendering
  var svgexport_command =
    "svgexport " +
    path_to_svg +
    " " +
    path_to_tmp_png +
    " pad " +
    get_output_dimensions() +
    " --quality=100";
  console.log(svgexport_command);
  execSync(svgexport_command, (error, stdout, stderr) => {
    if (error) {
      console.log("Failed to convert SVG: " + path_to_svg);
      process.exit(1);
    }
  });

  // Enhanced imagemin command with PNG optimization for high quality
  // Using pngquant with high quality settings and optipng for lossless compression
  var image_min_command =
    "imagemin " +
    path_to_tmp_png +
    " --out-dir=" +
    get_output_directory() +
    " --plugin=pngquant --plugin.pngquant.quality=90-100 --plugin=optipng --plugin.optipng.optimizationLevel=2";
  console.log(image_min_command);
  execSync(image_min_command, (error, stdout, stderr) => {
    if (error) {
      console.log("Failed to optimize PNG: " + path_to_svg);
      // Try fallback without advanced optimization if plugins fail
      var fallback_command =
        "imagemin " + path_to_tmp_png + " --out-dir=" + get_output_directory();
      console.log("Trying fallback: " + fallback_command);
      execSync(fallback_command, (fallback_error, stdout, stderr) => {
        if (fallback_error) {
          console.log("Failed to convert SVG with fallback: " + path_to_svg);
          process.exit(1);
        }
      });
    }
  });

  // Rename the output file to use country name if different from ISO code
  var country_filename = get_country_filename(iso_code);
  var output_png_path =
    get_output_directory() + "/" + iso_code.toLowerCase() + ".png";
  var final_png_path = get_output_directory() + "/" + country_filename;

  if (country_filename !== iso_code.toLowerCase() + ".png") {
    try {
      if (fs.existsSync(output_png_path)) {
        fs.renameSync(output_png_path, final_png_path);
        console.log(
          "✓ Renamed: " + iso_code.toLowerCase() + ".png → " + country_filename
        );
      }
    } catch (rename_error) {
      console.log(
        "Warning: Could not rename " +
          output_png_path +
          " to " +
          final_png_path +
          ": " +
          rename_error.message
      );
    }
  }

  // Always remove temp file
  fs.unlink(path_to_tmp_png, (error) => {
    if (error) {
      console.log(
        "Warning: Could not remove temp file " + path_to_tmp_png + ": " + error
      );
    }
  });
}

function convert_all_files(svgs, callback) {
  for (let i = 0; i < svgs.length; i++) {
    var iso_code = svgs[i].replace(".svg", "");
    var country_filename = get_country_filename(iso_code);
    console.log(
      "Converting [" +
        (i + 1) +
        "/" +
        svgs.length +
        "] " +
        svgs[i] +
        " → " +
        country_filename
    );
    convert_and_compress_svg(svg_directory + svgs[i]);
  }

  callback();
}

// Run the program
check_arguments(() =>
  check_for_imagemin(() =>
    check_for_svgexport(() => {
      // Load country names
      var hasCountryNames = load_country_names();
      if (hasCountryNames) {
        console.log("🌍 Using country names for filenames");
      } else {
        console.log("🏷️  Using ISO codes for filenames");
      }

      get_all_svgs((svgs) =>
        convert_all_files(svgs, () => {
          console.log("All SVGs converted to PNG!");
          process.exit(0);
        })
      );
    })
  )
);
