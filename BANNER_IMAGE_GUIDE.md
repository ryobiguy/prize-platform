# 🎨 Hero Banner Image Guide

## What I've Set Up

A **responsive hero banner** that displays your big prizes (UK money, PS5, Xbox, etc.) and automatically resizes for different screen sizes.

---

## How to Add Your Banner Image

### Step 1: Save Your Image

Save your banner image here:
```
C:\Users\Ryan Guy\CascadeProjects\prize-platform\client\public\banner.jpg
```

**Or if it's a PNG:**
```
C:\Users\Ryan Guy\CascadeProjects\prize-platform\client\public\banner.png
```

Then update the filename in `Home.js` if needed (currently set to `banner.jpg`)

---

## Recommended Image Specifications

### Desktop Banner
- **Width:** 1920px (full HD width)
- **Height:** 600-800px
- **Aspect Ratio:** 16:9 or 21:9 (widescreen)
- **File Size:** Under 500KB (compress it!)
- **Format:** JPG (for photos) or PNG (for graphics)

### What to Include in Your Banner
- UK money/cash stacks
- PS5 console
- Xbox console
- Gift cards
- Other big prizes
- Eye-catching text/graphics

---

## How It Works

### Desktop (Large Screens)
```
Max Height: 600px
Width: 100% (full width)
Image scales proportionally
```

### Tablet (Medium Screens)
```
Max Height: 400px
Width: 100% (full width)
Image scales proportionally
```

### Mobile (Small Screens)
```
Max Height: 400px
Min Height: 200px
Width: 100% (full width)
Image scales proportionally
```

---

## CSS Properties Used

```css
.banner-image-responsive {
  width: 100%;              /* Full width */
  height: auto;             /* Maintains aspect ratio */
  display: block;           /* Removes extra spacing */
  object-fit: cover;        /* Crops to fit if needed */
  max-height: 600px;        /* Limits height on desktop */
  min-height: 300px;        /* Ensures minimum height */
}
```

**What each does:**
- `width: 100%` - Always fills container width
- `height: auto` - Keeps image proportions
- `object-fit: cover` - Crops image to fit without distortion
- `max-height` - Prevents banner from being too tall
- `min-height` - Prevents banner from being too short

---

## Design Tips

### 1. Create a Compelling Banner

**Include:**
- ✅ High-quality product images (PS5, Xbox, etc.)
- ✅ UK currency/money visuals
- ✅ Bold, readable text
- ✅ Call-to-action (e.g., "Win Big!")
- ✅ Your brand colors

**Avoid:**
- ❌ Too much text (hard to read)
- ❌ Low-resolution images (looks unprofessional)
- ❌ Cluttered design (confusing)

### 2. Text Placement

Since the banner is just an image now, include text directly in your image design:
- Main headline at the top or center
- Prize values prominently displayed
- Call-to-action button graphic

### 3. Mobile Considerations

Make sure important elements are:
- Centered (won't get cut off on mobile)
- Large enough to read on small screens
- Not too close to edges

---

## Different Banner Sizes

### Option 1: Wide Banner (Recommended)
```
1920px × 600px
Aspect ratio: 16:5
Best for: Desktop-first design
```

### Option 2: Standard Banner
```
1920px × 1080px
Aspect ratio: 16:9
Best for: Balanced desktop/mobile
```

### Option 3: Tall Banner
```
1920px × 800px
Aspect ratio: 12:5
Best for: More visual impact
```

---

## If You Want to Change the Image

### Use a Different Filename

If your image is named differently, update `Home.js`:

```javascript
<img 
  src={`${process.env.PUBLIC_URL}/your-image-name.jpg`} 
  alt="Win Big Prizes - PS5, Xbox, Cash and More!" 
  className="banner-image-responsive"
/>
```

### Use Multiple Images (Slideshow)

Want a rotating banner? Let me know and I can add that!

---

## Optimization Tips

### 1. Compress Your Image

Use these free tools:
- [TinyJPG.com](https://tinyjpg.com) - Compress JPG/PNG
- [Squoosh.app](https://squoosh.app) - Advanced compression
- [ImageOptim](https://imageoptim.com) - Mac app

**Target:** Under 500KB for fast loading

### 2. Use WebP Format (Modern)

For best performance, save as WebP:
```
banner.webp (modern browsers)
banner.jpg (fallback)
```

### 3. Lazy Loading

Already implemented! The image loads efficiently.

---

## Current Setup

**File Location:**
```
/client/public/banner.jpg
```

**Code:**
```javascript
// Home.js
<section className="banner">
  <img 
    src={`${process.env.PUBLIC_URL}/banner.jpg`} 
    alt="Win Big Prizes - PS5, Xbox, Cash and More!" 
    className="banner-image-responsive"
  />
</section>
```

**Responsive Behavior:**
- Desktop: Max 600px tall, full width
- Mobile: Max 400px tall, full width
- Always maintains aspect ratio
- Never distorts or stretches

---

## Need Help Creating the Banner?

### Design Tools:
- **Canva** (easiest, free templates)
- **Figma** (professional, free)
- **Photoshop** (advanced)
- **GIMP** (free Photoshop alternative)

### Template Idea:
```
[Left Side]
- PS5 image
- Xbox image

[Center]
- "WIN BIG!"
- "£1000+ in prizes"

[Right Side]
- Cash/money image
- Gift cards
```

---

## Next Steps

1. **Create or find your banner image** with prizes
2. **Save it** as `banner.jpg` in `/client/public/`
3. **Refresh the browser** - it will appear automatically!
4. **Test on mobile** - resize browser to check responsiveness

Your banner will automatically resize for all screen sizes! 🎉
