# EmPACT Lab - People Management Template

## 📋 Quick Edit Guide

### How to Add a New Team Member

1. **Prepare the photo**: Save as `.jpg` file in `assets/images/people/`
   - Use lowercase name with underscores: `firstname_lastname.jpg`
   - Example: "John Smith" → `john_smith.jpg`
   - Recommended size: 400x400px (square)

2. **Add the HTML code**: Copy the template below and paste it in `people.html`

3. **Edit the details**: Update name, role, and research area

---

## 📝 HTML Template to Copy

```html
<!-- [PERSON NAME] -->
<div class="col-md-4">
    <div class="team-member" style="text-align: center; margin-bottom: 30px;">
        <img src="assets/images/people/[firstname_lastname].jpg" alt="[Full Name]" class="img-responsive" style="border-radius: 5px; margin-bottom: 15px;">
        <h4 style="margin-bottom: 5px;">[Full Name]</h4>
        <p style="color: #666; margin-bottom: 5px;"><strong>[Role/Position]</strong></p>
        <p style="font-size: 14px; color: #888;">[Research Area 1, Research Area 2]</p>
    </div>
</div>
```

---

## 👥 Current Team Members List

### Principal Investigator
- **Addison Lin Wang** | Assistant Professor | Embodied Perception, Computer Vision, Robotics
  - Image: `assets/images/Prof.jpg`

### Team Members (10 people)

| Name | Role | Research Area | Image Filename |
|------|------|---------------|----------------|
| Jongsung Lee | Visiting PhD Student | 3D Scene Understanding, 360 Image-based Vision | `jongsung_lee.jpg` |
| Zhang Haitian | PhD | Event-based Vision, Multi-modality | `zhang_haitian.jpg` |
| Shriram Damodaran | M.Eng | Robotics, 3D Computer Vision | `shriram_damodaran.jpg` |
| Gu Zhihao | Research Fellow | Vision for Robotics, Computer Vision | `gu_zhihao.jpg` |
| Yu Ze | MSc | Embodied AI, Robot Learning | `yu_ze.jpg` |
| Liu Zinan | PhD | Embodied AI, Knowledge Distillation, Agentic Reasoning | `liu_zinan.jpg` |
| Nguyen Duy Thai | PhD | 3D Perception, Embodied World Model | `nguyen_duy_thai.jpg` |
| Chen Xuanyu | MSc | Humanoid Locomotion, VLA Models | `chen_xuanyu.jpg` |
| Chen Huitong | MSc | Event Camera | `chen_huitong.jpg` |
| Dong Ze | MSc | Embodied AI, Large Multimodal Models | `dong_ze.jpg` |

---

## 🎯 Step-by-Step Example: Adding a New Person

### Example: Adding "Sarah Johnson"

**Step 1**: Save her photo as `sarah_johnson.jpg` in `assets/images/people/`

**Step 2**: In `people.html`, find the Team Members section and add:

```html
<!-- Sarah Johnson -->
<div class="col-md-4">
    <div class="team-member" style="text-align: center; margin-bottom: 30px;">
        <img src="assets/images/people/sarah_johnson.jpg" alt="Sarah Johnson" class="img-responsive" style="border-radius: 5px; margin-bottom: 15px;">
        <h4 style="margin-bottom: 5px;">Sarah Johnson</h4>
        <p style="color: #666; margin-bottom: 5px;"><strong>PhD Student</strong></p>
        <p style="font-size: 14px; color: #888;">Deep Learning, Neural Networks</p>
    </div>
</div>
```

**Step 3**: Save and refresh the webpage!

---

## 📐 Layout Structure

- **3 people per row** (using Bootstrap `col-md-4` class)
- Each person has:
  - Photo (square, 400x400px recommended)
  - Name (h4)
  - Role (bold, colored text)
  - Research areas (smaller, gray text)

---

## 🖼️ Image Requirements

- **Format**: JPG or PNG
- **Size**: 400x400px (square) recommended
- **File size**: Under 200KB for fast loading
- **Naming**: lowercase with underscores (e.g., `john_doe.jpg`)
- **Location**: `assets/images/people/` folder

---

## 🎨 Customization Options

### Change photo shape to circular:
Replace `border-radius: 5px;` with `border-radius: 50%;`

### Adjust spacing between rows:
Modify `margin-bottom: 30px;` in the team-member div

### Change text colors:
- Role color: Change `color: #666;`
- Research area color: Change `color: #888;`

---

## ✅ Checklist Before Publishing

- [ ] All photos are added to `assets/images/people/` folder
- [ ] Photo filenames match exactly in HTML (case-sensitive!)
- [ ] All names are spelled correctly
- [ ] Research areas are accurate
- [ ] Page tested on desktop and mobile
- [ ] No broken image links

---

## 📞 Need Help?

If images don't show:
1. Check filename spelling (must match exactly)
2. Verify file is in correct folder: `assets/images/people/`
3. Check file extension (.jpg vs .jpeg vs .png)
4. Clear browser cache and refresh

---

**Last Updated**: November 26, 2025
