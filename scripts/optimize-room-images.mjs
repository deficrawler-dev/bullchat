import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import sharp from "sharp";

const inputRoot = join(process.cwd(), "assets", "rooms");
const outputRoot = join(process.cwd(), "public", "rooms");

const supportedExtensions = new Set([".png", ".jpg", ".jpeg"]);

if (!existsSync(inputRoot)) {
  console.error(`Input folder does not exist:\n${inputRoot}`);
  process.exit(1);
}

function findImages(directory) {
  const images = [];

  for (const item of readdirSync(directory)) {
    const fullPath = join(directory, item);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      images.push(...findImages(fullPath));
      continue;
    }

    if (supportedExtensions.has(extname(item).toLowerCase())) {
      images.push(fullPath);
    }
  }

  return images;
}

const images = findImages(inputRoot);

if (images.length === 0) {
  console.log("No PNG or JPEG images were found.");
  process.exit(0);
}

console.log(`Found ${images.length} images.\n`);

let successful = 0;
let failed = 0;

for (let index = 0; index < images.length; index += 1) {
  const inputPath = images[index];
  const relativePath = relative(inputRoot, inputPath);

  const extension = extname(relativePath);
  const outputRelativePath =
    relativePath.slice(0, -extension.length) + ".webp";

  const outputPath = join(outputRoot, outputRelativePath);
  const outputDirectory = join(outputPath, "..");

  mkdirSync(outputDirectory, { recursive: true });

  console.log(`[${index + 1}/${images.length}] ${relativePath}`);

  try {
    await sharp(inputPath)
      .rotate()
      .webp({
        quality: 85,
        effort: 5,
        smartSubsample: true,
      })
      .toFile(outputPath);

    successful += 1;
  } catch (error) {
    failed += 1;
    console.error(`Failed: ${relativePath}`);
    console.error(error instanceof Error ? error.message : error);
    console.log();
  }
}

console.log("\nImage optimization finished.");
console.log(`Successful: ${successful}`);
console.log(`Failed: ${failed}`);
console.log(`Output: ${outputRoot}`);

if (failed > 0) {
  process.exit(1);
}