# EmPACT Lab Website

Official website for the Embodied Perception and Interaction Lab (EmPACT) at NTU Singapore, led by Assistant Professor Addison Lin Wang.

## 🌐 Live Website

Visit: [https://namaibest.github.io/EmPACT-Lab/](https://namaibest.github.io/EmPACT-Lab/)

## 📋 Overview

This is a Bootstrap 3-based educational website showcasing the lab's research, team members, publications, and news. The website uses a **database-driven approach** for easy content management without requiring backend infrastructure.

## 🗂️ Page Structure

### 1. **Home** (`index.html`)
- Lab introduction and mission statement
- Principal Investigator information
- Research focus areas
- Quick links to other sections

### 2. **Research** (`research.html`)
- Three main research pillars:
  - Neuro- and Physics-inspired Sensing and Perception
  - Spatial Intelligence and Edge AI
  - Robot Learning and Human-Agent Interaction
- Uses Font Awesome icons

### 3. **People** (`people.html`)
- Principal Investigator section
- Team members organized by categories:
  - PhD Students
  - MSc Students
  - Visiting PhD Students
  - Research Associates & Fellows
- **LinkedIn integration** - entire card is clickable when LinkedIn URL is provided

### 4. **Publications** (`publication.html`)
- Grouped by year (2026, 2025, 2024, 2023, etc.)
- Summarized format (e.g., "8 papers accepted to CVPR 2024")
- Color-coded venue badges
- Automatic year-based organization

### 5. **News** (`news.html`)
- Lab announcements and achievements
- Color-coded by type:
  - 🎤 Keynote (red)
  - 🏆 Award (orange)
  - 📄 Publication (green)
  - 👥 People (blue)
  - 📢 Announcement (purple)

### 6. **Contact** (`contact.html`)
- Contact form with Google Sheets integration
- Lab address and contact information
- Form submissions automatically saved to Google Sheets

## 🗄️ Database Structure

All content is managed through **JavaScript objects** at the top of each HTML file. No backend database required!

### Research Database (`research.html`)

```javascript
const researchData = {
    sections: [
        {
            title: "Research Area Title",
            areas: [
                {
                    icon: "fa-icon-name",  // Font Awesome icon
                    title: "Sub-area Title",
                    description: "Description text"
                }
            ]
        }
    ]
};
```

### People Database (`people.html`)

```javascript
const peopleData = {
    phd: [
        {
            name: "Full Name",
            role: "PhD",
            research: "Research interests",
            image: "filename.jpg",  // Must be in assets/People_Images/
            linkedin: "https://linkedin.com/in/username"  // Optional
        }
    ],
    msc: [...],
    visiting: [...],
    fellows: [...]
};
```

**Features**:
- Images stored in `assets/People_Images/`
- Circular 160px profile images
- LinkedIn integration - entire card is clickable when URL provided
- Empty `linkedin: ""` for members without LinkedIn

### Publications Database (`publication.html`)

```javascript
const publicationsData = [
    {
        date: "2025-06",  // YYYY-MM format
        venue: "CVPR 2025",
        title: "3 papers accepted to CVPR 2025",  // Use summarized format
        authors: "EmPACT Lab Team",
        link: "#",  // Optional paper link
        count: 3  // Optional - for grouped papers
    }
];
```

**Features**:
- Automatically groups by year
- Color-coded venue badges
- Hover effects on cards
- Paper links open in new tab

### News Database (`news.html`)

```javascript
const newsData = [
    {
        date: "2025-11",
        type: "keynote",  // keynote, award, publication, people, announcement
        title: "News headline",
        description: "Detailed description"
    }
];
```

**News Types**:
- `keynote` - Speaking engagements (red)
- `award` - Awards and recognition (orange)
- `publication` - Paper acceptances (green)
- `people` - Team updates (blue)
- `announcement` - General announcements (purple)

## 🎨 Design System

### Colors
- **Primary Red**: `#dc2626`, `#ef4444`
- **Text**: `#1a1a1a` (headings), `#666` (body)
- **Borders**: `#e8e8e8`
- **Background**: `#f9f9f9`

### Card Styling
- Gradient background: `linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%)`
- Border radius: `12px`
- Box shadow: `0 2px 10px rgba(0,0,0,0.08)`
- Hover effect: Lifts up with enhanced shadow

### Typography
- Font: Open Sans (300, 400, 700)
- Headings: 600 weight, `#1a1a1a`
- Body: 400 weight, `#666`

## 🛠️ Technical Stack

- **Framework**: Bootstrap 3.0
- **Icons**: Font Awesome 4.x
- **Fonts**: Google Fonts (Open Sans)
- **JavaScript**: Vanilla JS (ES6)
- **Backend**: None (static site with Google Sheets integration)

## 📁 File Structure

```
NTU new website/
├── index.html              # Home page
├── research.html           # Research areas
├── people.html            # Team members
├── publication.html       # Publications list
├── news.html              # Lab news
├── contact.html           # Contact form
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── font-awesome.min.css
│   │   ├── bootstrap-theme.css
│   │   └── style.css
│   ├── js/
│   │   ├── bootstrap.min.js
│   │   └── custom.js
│   ├── images/
│   │   ├── logo.png
│   │   └── Prof.jpg
│   └── People_Images/      # Team member photos
│       ├── [Name].jpg
│       └── ...
└── README.md
```

## 🚀 Deployment

### GitHub Pages

1. Push changes to GitHub repository
2. Go to repository Settings → Pages
3. Select branch: `main`, folder: `/ (root)`
4. Save and wait for deployment
5. Site will be live at: `https://[username].github.io/[repo-name]/`

### Local Development

Simply open any HTML file in a web browser. No build process required.

## 🔧 Customization Tips

### Changing Colors

Search and replace color codes:
- Primary red: `#dc2626` and `#ef4444`
- Use find/replace across all HTML files

### Changing Icons

Research page icons can be changed by updating the `icon` field:
- Browse icons: [Font Awesome 4.7 Icons](https://fontawesome.com/v4/icons/)
- Use format: `fa-icon-name` (e.g., `fa-brain`, `fa-lightbulb-o`)

### Adding New Sections

Follow the existing pattern:
1. Create database object at top of page
2. Write generator function
3. Call on `DOMContentLoaded`

## 📞 Contact

**Embodied Perception and Interaction Lab (EmPACT)**  
School of Electrical and Electronic Engineering  
Nanyang Technological University, Singapore

**Email**: linwang@ntu.edu.sg  
**Phone**: (65) 6790-5629

## 📄 License

© 2025 EmPACT Lab, NTU Singapore. All rights reserved.

---

**Last Updated**: November 2025  
**Maintained by**: EmPACT Lab Team
