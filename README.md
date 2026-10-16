# Self Portfolio Website

> A personal portfolio website built as a Computer Science Engineering college mini project showcasing academic journey, technical skills, machine learning projects, verified credentials, and software development work.

![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.1-646cff?style=flat&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/Styling-Vanilla_CSS-1572b6?style=flat&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 🌟 Overview

This portfolio website serves as an interactive showcase of my undergraduate experience as a **B.Tech Computer Science Engineering student** at **Symbiosis Institute of Technology (SIT), Nagpur**. It highlights practical applications of computer science fundamentals, hands-on machine learning projects, system administration training, and collegiate activities.

---

## ✨ Features

- **Dynamic Hero & Profile:** Introduction banner featuring professional portrait, career aspirations, and quick tech stack tags.
- **About & Career Objective:** Background summary, engineering highlights, and targeted career objectives.
- **Categorized Technical Skills:** Interactive skill cards spanning Programming Languages, Web Technologies, Backend & Databases, AI/Machine Learning, and Developer Tools.
- **Academic Timeline & Verified Performance:** Chronological academic history and verified milestone scores (SIT Nagpur B.Tech CGPA, Class XII HSC, Class X CBSE).
- **Featured Projects Showcase:** Deep-dive project cards with interactive modals:
  - *Real-Time Fruit Ripeness and Defect Detection Using Lightweight CNN*
  - *Heat Wave Detection System Using Machine Learning*
  - *Smart Onboarding Assistant*
  - *Student Performance Analyzer*
- **Certificates & Credentials Viewer:** Built-in modal viewer for verified certifications:
  - *Maincrafts Technology Internship Certificate*
  - *Red Hat System Administration I (RH124) — Red Hat Academy*
- **Interactive Resume Modal:** Integrated document viewer supporting direct PDF and DOCX downloads.
- **Student Activities & Contributions:** Highlighting active membership in the collegiate **Robotics Club** and academic workshops.
- **Responsive Contact Hub:** Quick email triggering via `mailto:`, draft message copier, and direct links to GitHub and LinkedIn profiles.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Component-based frontend architecture and reactive UI state |
| **Vite 6** | Ultra-fast build tool and local development environment |
| **Vanilla CSS** | Custom design system with glassmorphism, responsive grids, and CSS variables |
| **Lucide React** | Clean, accessible vector icons across all sections |

---

## 📂 Project Structure

```text
Portfolio Website/
├── public/
│   ├── assets/
│   │   ├── certificates/   # Verified certificate documents and scans
│   │   ├── images/         # Profile and portrait images
│   │   ├── resume.docx     # Resume in Word format
│   │   └── resume.pdf      # Resume in PDF format
│   └── favicon.svg         # Browser favicon
├── src/
│   ├── components/         # Modular React UI components
│   │   ├── About.jsx
│   │   ├── AcademicPerformance.jsx
│   │   ├── Achievements.jsx
│   │   ├── CareerInterests.jsx
│   │   ├── CertificateModal.jsx
│   │   ├── Certificates.jsx
│   │   ├── Contact.jsx
│   │   ├── Contributions.jsx
│   │   ├── Education.jsx
│   │   ├── Footer.jsx
│   │   ├── Gallery.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProjectModal.jsx
│   │   ├── Projects.jsx
│   │   ├── ResumeModal.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── Skills.jsx
│   ├── data/
│   │   └── portfolioData.js # Centralized configuration and portfolio contents
│   ├── styles/
│   │   └── index.css        # Core stylesheet and theme tokens
│   ├── App.jsx              # Main application shell
│   └── main.jsx             # React DOM root entry
├── .env.example             # Environment variable template
├── .gitignore               # Git exclusion rules
├── index.html               # Main HTML entry template
├── package.json             # NPM dependencies and scripts
└── vite.config.js           # Vite server and build configuration
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harshbhongade1/self-portfolio-website.git
   cd self-portfolio-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local` and add your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Run Database Migration:**
   Execute the SQL statements inside `supabase/schema.sql` in your Supabase SQL Editor.

5. **Run Security & API Tests:**
   ```bash
   npm test
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) for the portfolio or [http://localhost:3000/admin](http://localhost:3000/admin) for the Administrator Console.

7. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📊 Telemetry & Admin Console

- **Live Footer Counter:** Displays Total Views, Unique Visitors, and real-time Active Visitors with deduplication and React Strict Mode guards.
- **Secure Admin Dashboard (`/admin`):** Protected by Supabase Auth and server-side JWT verification.
- **Detailed Activity Logs:** Tracks anonymous visitor UUID, path, referrer, browser/OS/device category, and approximate region (via Vercel edge headers).
- **Privacy-Preserving IP Processing:** Raw IPs are never stored; HMAC-SHA256 keyed hashing is used strictly server-side for rate limiting.
- **Data Retention:** Configurable pruning of activity logs directly within the console.

---

## 👤 Author

**Harsh Bhongade**  
- GitHub: [@harshbhongade1](https://github.com/harshbhongade1)  
- LinkedIn: [Harsh Bhongade](https://www.linkedin.com/in/harsh-bhongade-6257523b9)  
- College: Symbiosis Institute of Technology (SIT), Nagpur  

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
