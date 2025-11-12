# Icon Generation

## Converting SVG to PNG

VSCode requires a PNG icon (128x128 pixels). The `icon.svg` file needs to be converted to `icon.png`.

### Method 1: Online Converter (Easiest)

1. Go to https://cloudconvert.com/svg-to-png
2. Upload `icon.svg`
3. Set dimensions to 128x128 pixels
4. Download as `icon.png`
5. Save to this directory

### Method 2: Using Inkscape (Free, Open Source)

```bash
# Install Inkscape
# macOS
brew install inkscape

# Ubuntu/Debian
sudo apt-get install inkscape

# Convert
inkscape icon.svg --export-type=png --export-width=128 --export-height=128 --export-filename=icon.png
```

### Method 3: Using ImageMagick

```bash
# Install ImageMagick
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Convert
convert -background none -resize 128x128 icon.svg icon.png
```

### Method 4: Using Node.js (sharp package)

```bash
npm install -g sharp-cli
sharp -i icon.svg -o icon.png resize 128 128
```

### Method 5: Using rsvg-convert

```bash
# Install
# macOS
brew install librsvg

# Ubuntu/Debian
sudo apt-get install librsvg2-bin

# Convert
rsvg-convert -w 128 -h 128 icon.svg -o icon.png
```

## Icon Design

The icon features:
- **Red circle background** (#CB3837 - official npm color)
- **Package box** representing npm packages
- **Play button** representing running scripts
- **"npm" text** for clear branding

## Requirements

For VSCode Marketplace:
- Format: PNG
- Size: 128x128 pixels
- Background: Should be visible (not transparent for better visibility)
- High contrast for dark and light themes

## Notes

After converting to PNG, make sure to:
1. Save it as `icon.png` in this directory
2. Verify the size is exactly 128x128 pixels
3. The file should be referenced in `package.json` as `"icon": "images/icon.png"`
