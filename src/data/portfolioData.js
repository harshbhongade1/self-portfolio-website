/**
 * PORTFOLIO CONFIGURATION DATA
 * ============================
 * Harsh Bhongade - Self Portfolio Website
 * 
 * Update this file with your real email, GitHub, LinkedIn,
 * certificates, academic marks, and resume when ready!
 */

export const portfolioData = {
  // 1. Personal & Hero Information
  personal: {
    name: "Harsh Bhongade",
    initials: "HB",
    headline: "Building Ideas Through Code",
    titles: [
      "Computer Science Engineering Student",
      "Aspiring Software Developer",
      "AI/ML Enthusiast"
    ],
    college: "Symbiosis Institute of Technology (SIT), Wathoda, Nagpur",
    university: "Symbiosis International (Deemed University)",
    degree: "B.Tech in Computer Science Engineering",
    academicStatus: "Undergraduate Student",
    location: "Nagpur, Maharashtra, India",
    
    // Profile photo: set to user's uploaded portrait image
    profilePhotoUrl: "/assets/images/profile.jpeg", 

    // Resume settings: both PDF and DOCX formats available
    resumeUrl: "/assets/resume.pdf",
    resumeDocxUrl: "/assets/resume.docx",
    isResumeAvailable: true,
    
    // Core hero tech badges
    heroTags: ["Python", "C", "JavaScript", "Machine Learning", "Flask", "SQL"],
    
    about: "I am a Computer Science Engineering student interested in software development, artificial intelligence, machine learning, and building practical technology solutions. I enjoy learning new technologies, exploring innovative ideas, and developing projects that solve real-world problems. I am continuously improving my programming, problem-solving, and development skills through academic projects and hands-on learning.",
    
    highlights: [
      {
        icon: "GraduationCap",
        title: "CSE Undergraduate",
        description: "Symbiosis Institute of Technology, Nagpur"
      },
      {
        icon: "Cpu",
        title: "AI/ML & Software Focus",
        description: "Passionate about computer vision, CNNs & intelligent tools"
      },
      {
        icon: "FolderGit2",
        title: "Hands-on Project Work",
        description: "Building practical web & machine learning solutions"
      },
      {
        icon: "Sparkles",
        title: "Continuous Learner",
        description: "Exploring modern algorithms, tools & development stacks"
      }
    ],

    careerObjective: "Enthusiastic and motivated Computer Science Engineering undergraduate looking for internship opportunities and practical software development roles where I can contribute to real-world projects, learn industry practices, and grow my skills in software engineering and AI/ML technologies."
  },

  // 2. Contact & Social Links Configuration
  contact: {
    email: "harsh.bhongade.batch2024@sitnagpur.siu.edu.in",
    github: "https://github.com/harshbhongade1",
    linkedin: "https://www.linkedin.com/in/harsh-bhongade-6257523b9?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    phone: "8087858304",
    location: "Nagpur, Maharashtra, India"
  },

  // 3. Technical Skills
  skills: [
    {
      category: "Programming Languages",
      description: "Foundational and algorithmic programming",
      skills: [
        { name: "C", level: "Familiar", tag: "Procedural & Systems" },
        { name: "Python", level: "Familiar", tag: "Scripting & Data Science" }
      ]
    },
    {
      category: "Web Development",
      description: "Frontend responsive web foundations",
      skills: [
        { name: "HTML5", level: "Familiar", tag: "Semantic Markup" },
        { name: "CSS3", level: "Familiar", tag: "Modern Styling & Layouts" },
        { name: "JavaScript", level: "Familiar", tag: "Dynamic Logic & DOM" }
      ]
    },
    {
      category: "Backend & Databases",
      description: "Server scripting and relational data storage",
      skills: [
        { name: "Python & Flask Fundamentals", level: "Learning", tag: "Lightweight Web APIs" },
        { name: "MySQL", level: "Familiar", tag: "Relational Queries" },
        { name: "SQLite", level: "Familiar", tag: "Embedded Database" }
      ]
    },
    {
      category: "AI & Machine Learning",
      description: "Data modeling, image processing and neural nets",
      skills: [
        { name: "Machine Learning Fundamentals", level: "Learning", tag: "Classification & Regressions" },
        { name: "OpenCV", level: "Learning", tag: "Computer Vision & Processing" },
        { name: "CNN Basics", level: "Learning", tag: "Convolutional Neural Nets" },
        { name: "NumPy & Pandas", level: "Learning", tag: "Data Manipulation" }
      ]
    },
    {
      category: "Tools & Development Environment",
      description: "Developer workflow and version control",
      skills: [
        { name: "Visual Studio Code", level: "Familiar", tag: "IDE & Extensions" },
        { name: "Git", level: "Familiar", tag: "Version Control" },
        { name: "GitHub", level: "Familiar", tag: "Code Hosting & Repos" }
      ]
    }
  ],

  // 4. Education Timeline
  education: [
    {
      id: "btech",
      level: "Undergraduate Degree",
      degree: "B.Tech in Computer Science Engineering (2nd Year)",
      institution: "Symbiosis Institute of Technology (SIT), Wathoda, Nagpur",
      university: "Symbiosis International (Deemed University)",
      period: "2024 – Present",
      status: "In Progress",
      description: "Pursuing bachelor's degree with emphasis on core computer science subjects, programming fundamentals, algorithms, database systems, and practical machine learning applications.",
      highlights: [
        "1st Year: 7.0 CGPA | 2nd Year: 6.9 CGPA",
        "Core coursework in C, Python, Data Structures & Databases",
        "Active member of the Robotics Club"
      ]
    },
    {
      id: "class12",
      level: "Higher Secondary (Class XII)",
      degree: "Higher Secondary Certificate (HSC)",
      institution: "Prerna College, Reshimbagh, Nagpur",
      university: "Maharashtra State Board",
      period: "Junior College",
      status: "Completed",
      description: "Completed higher secondary curriculum with a strong academic foundation in Science, Mathematics, and Computer Science fundamentals.",
      highlights: [
        "Focused study in Physics, Chemistry, and Mathematics",
        "Developed analytical and problem-solving mindset"
      ]
    },
    {
      id: "class10",
      level: "High School (Class X)",
      degree: "Secondary School Examination (CBSE)",
      institution: "Sanskar Vidya Sagar, Nandanvan, Nagpur",
      university: "Central Board of Secondary Education (CBSE)",
      period: "High School",
      status: "Completed",
      description: "Completed secondary school education under the CBSE curriculum with active involvement in academics and foundational mathematics.",
      highlights: [
        "Curriculum Board: CBSE",
        "Solid grounding in Mathematics and General Sciences",
        "Active involvement in school co-curricular activities"
      ]
    }
  ],

  // 5. Academic Performance (Verified metrics)
  academicPerformance: {
    statusNote: "Official academic track records and performance indices verified for undergraduate and school milestones.",
    records: [
      {
        title: "B.Tech in CSE — 2nd Year",
        institution: "Symbiosis Institute of Technology (SIT), Nagpur",
        status: "Current CGPA: 6.9",
        scoreNote: "2nd Year Cumulative Grade Point: 6.9 CGPA",
        badge: "6.9 CGPA"
      },
      {
        title: "B.Tech in CSE — 1st Year",
        institution: "Symbiosis Institute of Technology (SIT), Nagpur",
        status: "Completed",
        scoreNote: "1st Year Cumulative Grade Point: 7.0 CGPA",
        badge: "7.0 CGPA"
      },
      {
        title: "Class XII (Higher Secondary)",
        institution: "Prerna College, Reshimbagh, Nagpur",
        status: "Completed",
        scoreNote: "Science & Mathematics Stream Verified",
        badge: "HSC"
      },
      {
        title: "Class X (High School — CBSE)",
        institution: "Sanskar Vidya Sagar, Nandanvan, Nagpur",
        status: "Completed",
        scoreNote: "Central Board of Secondary Education (CBSE)",
        badge: "CBSE"
      }
    ]
  },

  // 6. Featured Projects
  projects: [
    {
      id: "fruit-ripeness",
      title: "Real-Time Fruit Ripeness and Defect Detection Using Lightweight CNN",
      tagline: "Computer Vision & Agriculture AI",
      description: "An agriculture-focused machine learning project designed to classify fruit ripeness stages and identify visible fruit defects using computer vision and a lightweight CNN model.",
      technologies: ["Python", "OpenCV", "CNN", "Machine Learning"],
      status: "Academic project in development",
      statusType: "in-progress",
      badgeColor: "amber",
      githubUrl: "", // Add your repository link here
      demoUrl: "",
      details: [
        "Utilizes OpenCV for real-time video stream handling, image pre-processing, and region-of-interest cropping.",
        "Employs a lightweight Convolutional Neural Network (CNN) architecture designed for efficient inference.",
        "Aims to distinguish between unripe, ripe, and overripe produce while flagging visible physical defects.",
        "Built to demonstrate the potential of AI-driven quality grading in agricultural sorting pipelines."
      ]
    },
    {
      id: "heatwave-detection",
      title: "Heat Wave Detection System Using Machine Learning",
      tagline: "Climatic & Environmental Analysis",
      description: "A machine learning project focused on analyzing relevant meteorological and environmental data to identify heat-wave conditions and anomalous temperature patterns.",
      technologies: ["Python", "Machine Learning", "Data Analysis"],
      status: "Academic research & data modeling",
      statusType: "research",
      badgeColor: "blue",
      githubUrl: "", // Add your repository link here
      demoUrl: "",
      details: [
        "Analyzes climatic indicators including ambient temperature, humidity indices, and regional averages.",
        "Investigates predictive patterns to flag anomalous heat threshold crossings.",
        "Explores classification algorithms in Python to assist in early climatic warning assessments."
      ]
    },
    {
      id: "smart-onboarding",
      title: "Smart Onboarding Assistant",
      tagline: "Web Application & Conversational Helper",
      description: "A web-based employee onboarding management system with an AI onboarding assistant chatbot to help users smoothly access onboarding-related information, procedures, and FAQs.",
      technologies: ["HTML", "CSS", "JavaScript", "Python", "Flask", "SQLite"],
      status: "Web Application & Assistant Feature",
      statusType: "active",
      badgeColor: "emerald",
      githubUrl: "", // Add your repository link here
      demoUrl: "",
      details: [
        "Lightweight Flask web server connected to an SQLite database for managing onboarding records.",
        "Interactive front-end user interface with dynamic task tracking and checklist verification.",
        "Integrated chatbot assistant feature that answers recurring queries regarding documentation, policies, and next steps."
      ]
    },
    {
      id: "student-performance",
      title: "Student Performance Analyzer",
      tagline: "Academic Data Analysis & Visualization",
      description: "A student-focused data analysis project for organizing marks, analyzing academic performance, assigning grade categories, and visualizing results.",
      technologies: ["Python", "NumPy", "Pandas", "Matplotlib", "Seaborn"],
      status: "Learning & planned project",
      statusType: "planned",
      badgeColor: "purple",
      githubUrl: "", // Add your repository link here
      demoUrl: "",
      details: [
        "Designed to parse student score sheets, handle missing values, and calculate key performance indicators.",
        "Generates subject-wise performance charts and grade category distributions with Matplotlib & Seaborn.",
        "Provides clear visual breakdowns to help students and educators identify areas of academic improvement."
      ]
    }
  ],

  // 7. Career & Professional Interests
  interests: [
    {
      title: "Software Development",
      description: "Building scalable, maintainable software and clean object-oriented code.",
      icon: "Code"
    },
    {
      title: "Artificial Intelligence & ML",
      description: "Exploring machine learning models, statistical patterns, and neural architectures.",
      icon: "Brain"
    },
    {
      title: "Computer Vision",
      description: "Image processing, object detection, and visual pattern recognition using OpenCV & CNNs.",
      icon: "Eye"
    },
    {
      title: "Web Development",
      description: "Crafting modern, accessible, and responsive user interfaces with reliable backends.",
      icon: "Globe"
    },
    {
      title: "Data Analysis",
      description: "Extracting meaningful insights, trends, and visualizations from structured datasets.",
      icon: "BarChart3"
    },
    {
      title: "Practical Tech Solutions",
      description: "Applying technology to solve tangible, real-world problems for users and communities.",
      icon: "Wrench"
    }
  ],

  // 8. Certificates (Real documents available in project)
  certificates: [
    {
      id: "maincrafts-internship",
      title: "Certificate of Internship",
      issuer: "Maincrafts Technology",
      category: "Internship & Practical Training",
      fileUrl: "/assets/certificates/Maincrafts Certificate of Internship-495.pdf",
      fileType: "pdf",
      description: "Formal certification validating successful internship training and project contributions in technology development.",
      dateLabel: "Verified Credential"
    },
    {
      id: "redhat-rh124",
      title: "Red Hat System Administration I (RH124)",
      issuer: "Red Hat Academy",
      category: "Linux & System Administration",
      fileUrl: "/assets/certificates/red-hat-system-administration-i-rh124-rha-ver-10.png",
      fileType: "image",
      description: "Core foundation training in Red Hat Enterprise Linux system administration, command-line operations, file systems, and user management.",
      dateLabel: "Red Hat Academy Certified"
    }
  ],

  // 9. Achievements (Editable cards ready for additional verified wins)
  achievements: [
    {
      id: "academic-tech-participation",
      title: "Academic & Technical Project Work",
      organization: "Symbiosis Institute of Technology",
      description: "Actively engaging in collegiate technical coursework, laboratory mini projects, and collaborative engineering assignments.",
      tag: "Academic"
    },
    {
      id: "continuous-skill-building",
      title: "Continuous Self-Directed Learning",
      organization: "Self-Paced & Online Learning",
      description: "Proactively building hands-on competencies in Python, Machine Learning fundamentals, Git version control, and web technologies.",
      tag: "Skill Development"
    }
  ],

  // 10. Student Activities & Contributions
  contributions: [
    {
      id: "robotics-club",
      title: "Robotics Club Member",
      organization: "Symbiosis Institute of Technology, Nagpur",
      category: "Student Club Activity",
      status: "Active Member",
      description: "Participating as a student member in collegiate robotics club activities, collaborating with peers on embedded systems, hardware-software logic, and technical design tasks.",
      icon: "Bot"
    },
    {
      id: "tech-workshops",
      title: "Technical Workshops & Seminars",
      organization: "College Technical Events",
      category: "Learning & Seminars",
      status: "Participant",
      description: "Engaging in collegiate technical workshops, tech talks, and guest lectures on emerging computer science paradigms and industry tools.",
      icon: "Laptop"
    },
    {
      id: "peer-collaboration",
      title: "Academic Project Collaboration",
      organization: "SIT Academic Cohort",
      category: "Peer Development",
      status: "Collaborator",
      description: "Working in teams with classmates to brainstorm, architect, and code project deliverables solving practical challenges.",
      icon: "Users"
    }
  ]
};
