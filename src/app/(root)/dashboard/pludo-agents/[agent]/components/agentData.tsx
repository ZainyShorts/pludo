export interface SubAgent {
  id: string;
  name: string;
  description: string;
}

export interface AgentWithSubAgents {
  name: string;
  role: string;
  image: string;
  subAgents: SubAgent[];
}

export const agentsWithSubAgents: AgentWithSubAgents[] = [
  {
    name: "Ace",
    role: "Business Development",
    image: "/images/Avatars/Avatar10.png",
    subAgents: [
      { id: "ace-1", name: "Strategic Planning Agent", description: "Formulates strategies for long-term goals." },
      { id: "ace-2", name: "Partnership Management Agent", description: "Builds and maintains strategic partnerships." },
      { id: "ace-3", name: "Market Analysis Agent", description: "Analyzes customer trends and opportunities." },
      { id: "ace-4", name: "Business Proposal Agent", description: "Creates proposals to secure funding or deals." }
    ],
  },
  {
    name: "Cora",
    role: "Customer Support",
    image: "/images/Avatars/Avatar2.png",
    subAgents: [
      { id: "cora-1", name: "Issue Resolution Agent", description: "Addresses customer complaints and issues." },
      { id: "cora-2", name: "Feedback Collection Agent", description: "Gathers insights through customer surveys." },
      { id: "cora-3", name: "Knowledge Base Management Agent", description: "Maintains a comprehensive knowledge base." },
      { id: "cora-4", name: "Customer Engagement Agent", description: "Proactively engages customers for loyalty." }
    ],
  },
  {
    name: "Echo",
    role: "eCommerce Specialist",
    image: "/images/Avatars/Avatar3.png",
    subAgents: [
      { id: "echo-1", name: "Product Listing Agent", description: "Creates and optimizes product listings." },
      { id: "echo-2", name: "Sales Analytics Agent", description: "Analyzes sales data and trends." },
      { id: "echo-3", name: "Campaign Management Agent", description: "Oversees execution of promotional campaigns." },
      { id: "echo-4", name: "Inventory Management Agent", description: "Monitors and optimizes stock levels." }
    ],
  },
  {
    name: "Delta",
    role: "Data Analyst",
    image: "/images/Avatars/Avatar4.png",
    subAgents: [
      { id: "delta-1", name: "Data Collection Agent", description: "Gathers reliable data from diverse sources." },
      { id: "delta-2", name: "Trend Analysis Agent", description: "Identifies patterns and trends in data." },
      { id: "delta-3", name: "Reporting Agent", description: "Compiles data into actionable reports." },
      { id: "delta-4", name: "Data Cleaning Agent", description: "Ensures data accuracy and consistency." }
    ],
  },
  {
    name: "Ember",
    role: "Email Marketing",
    image: "/images/Avatars/Avatar5.png",
    subAgents: [
      { id: "ember-1", name: "Campaign Design Agent", description: "Designs engaging and persuasive email campaigns." },
      { id: "ember-2", name: "Audience Segmentation Agent", description: "Segments email lists for personalization." },
      { id: "ember-3", name: "Performance Tracking Agent", description: "Monitors key email campaign metrics." },
      { id: "ember-4", name: "A/B Testing Agent", description: "Tests strategies for maximum engagement." }
    ],
  },
  {
    name: "Gala",
    role: "Personal Development Coach",
    image: "/images/Avatars/Avatar6.png",
    subAgents: [
      { id: "gala-1", name: "Goal Setting Agent", description: "Defines actionable goals and strategies." },
      { id: "gala-2", name: "Skill Enhancement Agent", description: "Provides resources for skill development." },
      { id: "gala-3", name: "Motivational Agent", description: "Inspires clients to overcome challenges." },
      { id: "gala-4", name: "Accountability Agent", description: "Ensures clients stay on track." }
    ],
  },
  {
    name: "Maverik",
    role: "Sales Manager",
    image: "/images/Avatars/Avatar7.png",
    subAgents: [
      { id: "maverik-1", name: "Team Management Agent", description: "Leads and trains the sales team." },
      { id: "maverik-2", name: "Sales Strategy Agent", description: "Designs innovative revenue strategies." },
      { id: "maverik-3", name: "Client Acquisition Agent", description: "Sources and acquires new clients." },
      { id: "maverik-4", name: "Customer Retention Agent", description: "Builds relationships for repeat business." }
    ],
  },
  {
    name: "Quill",
    role: "Copy Writer",
    image: "/images/Avatars/Avatar8.png",
    subAgents: [
      { id: "quill-1", name: "Content Creation Agent", description: "Writes persuasive content for marketing." },
      { id: "quill-2", name: "SEO Writing Agent", description: "Optimizes content for search engines." },
      { id: "quill-3", name: "Editing and Proofreading Agent", description: "Reviews content for clarity and errors." },
      { id: "quill-4", name: "Creative Storytelling Agent", description: "Crafts compelling brand narratives." }
    ],
  },
  {
    name: "Ryder",
    role: "Recruiter",
    image: "/images/Avatars/Avatar9.png",
    subAgents: [
      { id: "ryder-1", name: "Talent Sourcing Agent", description: "Seeks and evaluates qualified candidates." },
      { id: "ryder-2", name: "Interview Coordination Agent", description: "Manages scheduling and interview logistics." },
      { id: "ryder-3", name: "Onboarding Agent", description: "Facilitates smooth onboarding for hires." },
      { id: "ryder-4", name: "Employee Engagement Agent", description: "Maintains relationships with employees." }
    ],
  },
  {
    name: "Sage",
    role: "SEO Specialist",
    image: "/images/Avatars/Avatar10.png",
    subAgents: [
      { id: "sage-1", name: "Keyword Research Agent", description: "Identifies high-ranking SEO keywords." },
      { id: "sage-2", name: "Content Optimization Agent", description: "Enhances content for SEO performance." },
      { id: "sage-3", name: "Performance Monitoring Agent", description: "Tracks and analyzes SEO metrics." },
      { id: "sage-4", name: "Link Building Agent", description: "Builds backlinks to boost rankings." }
    ],
  },
  {
    name: "Lumen",
    role: "Social Media Specialist",
    image: "/images/Avatars/Avatar11.png",
    subAgents: [
      { id: "lumen-1", name: "Content Scheduling Agent", description: "Schedules posts for consistent engagement." },
      { id: "lumen-2", name: "Engagement Tracking Agent", description: "Tracks metrics like likes and shares." },
      { id: "lumen-3", name: "Platform Strategy Agent", description: "Develops strategies for social platforms." },
      { id: "lumen-4", name: "Community Management Agent", description: "Interacts with and supports the audience." }
    ],
  },
  {
    name: "Vera",
    role: "Virtual Assistant",
    image: "/images/Avatars/Avatar12.png",
    subAgents: [
      { id: "vera-1", name: "Administrative Tasks Agent", description: "Handles day-to-day administrative duties." },
      { id: "vera-2", name: "Data Management Agent", description: "Organizes and maintains accurate data." },
      { id: "vera-3", name: "Research Assistance Agent", description: "Conducts research and provides reports." },
      { id: "vera-4", name: "Customer Support Agent", description: "Addresses inquiries to ensure satisfaction." }
    ],
  },
  {
    name: "Aria",
    role: "Education Specialist",
    image: "/images/Avatars/Avatar13.png",
    subAgents: [
      { id: "aria-1", name: "Curriculum Design Agent", description: "Designs structured and engaging curricula." },
      { id: "aria-2", name: "Instructional Support Agent", description: "Provides resources to improve teaching." },
      { id: "aria-3", name: "Student Assessment Agent", description: "Develops assessments to evaluate progress." },
      { id: "aria-4", name: "E-Learning Development Agent", description: "Creates interactive online learning content." }
    ],
  },
  {
    name: "Drift",
    role: "Event Planner",
    image: "/images/Avatars/Avatar14.png",
    subAgents: [
      { id: "drift-1", name: "Event Design Agent", description: "Conceptualizes themes and decorations." },
      { id: "drift-2", name: "Vendor Coordination Agent", description: "Manages vendor contracts and delivery." },
      { id: "drift-3", name: "On-Site Management Agent", description: "Oversees logistics during events." },
      { id: "drift-4", name: "Budget Management Agent", description: "Tracks and allocates event budgets." }
    ],
  },
  {
    name: "Neon",
    role: "Creative Designer",
    image: "/images/Avatars/Avatar15.png",
    subAgents: [
      { id: "neon-1", name: "Graphic Design Agent", description: "Creates captivating visual designs." },
      { id: "neon-2", name: "Brand Identity Agent", description: "Develops and maintains consistent branding." },
      { id: "neon-3", name: "UI/UX Design Agent", description: "Designs user-friendly digital interfaces." },
      { id: "neon-4", name: "Motion Graphics Agent", description: "Creates dynamic video content." }
    ],
  },
  {
    name: "Pulse",
    role: "Health & Wellness Advisor",
    image: "/images/Avatars/Avatar16.png",
    subAgents: [
      { id: "pulse-1", name: "Nutrition Planning Agent", description: "Designs personalized nutrition plans." },
      { id: "pulse-2", name: "Exercise Guidance Agent", description: "Provides personalized fitness routines." },
      { id: "pulse-3", name: "Mental Wellness Support Agent", description: "Offers strategies for mental health." },
      { id: "pulse-4", name: "Holistic Health Agent", description: "Integrates physical and spiritual wellness." }
    ],
  },
  {
    name: "Nova",
    role: "Customizable Support Agent",
    image: "/images/Avatars/Avatar11.png",
    subAgents: [
      { id: "nova-1", name: "Feature Configuration Agent", description: "Customizes features to user needs." },
      { id: "nova-2", name: "User Training Agent", description: "Provides training for efficient use." },
      { id: "nova-3", name: "Feedback Integration Agent", description: "Analyzes feedback to prioritize updates." },
      { id: "nova-4", name: "Customer Success Agent", description: "Ensures satisfaction and ongoing support." }
    ],
  }
];
