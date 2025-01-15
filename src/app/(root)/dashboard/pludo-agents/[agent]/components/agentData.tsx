export interface SubRole {
    name: string;
    description: string;
  }
  
  export interface AgentWithSubRoles {
    name: string;
    role: string;
    image: string;
    subRoles: SubRole[];
  }

export const agentsWithSubRoles: AgentWithSubRoles[] = [
    {
      name: "Ace",
      role: "Business Development",
      image: "/images/Avatars/Avatar1.png",
      subRoles: [
        { name: "Strategic Planning", description: "Develops comprehensive strategies to achieve business goals, improve operations, and drive long-term growth." },
        { name: "Partnership Management", description: "Builds and nurtures strategic partnerships to foster mutual growth, streamline business operations, and increase market reach." },
        { name: "Market Analysis", description: "Conducts thorough market research to understand customer trends, industry shifts, and opportunities for business expansion and product development." },
      ],
    },
    {
      name: "Cora",
      role: "Customer Support",
      image: "/images/Avatars/Avatar2.png",
      subRoles: [
        { name: "Issue Resolution", description: "Works quickly and efficiently to address customer complaints, troubleshoot issues, and provide resolutions to ensure satisfaction." },
        { name: "Feedback Collection", description: "Collects valuable feedback from customers to identify areas of improvement and drive better services or product offerings." },
        { name: "Knowledge Base Management", description: "Maintains and regularly updates the knowledge base to provide customers with accessible, accurate, and useful self-service resources." },
      ],
    },
    {
      name: "Echo",
      role: "eCommerce Specialist",
      image: "/images/Avatars/Avatar3.png",
      subRoles: [
        { name: "Product Listing", description: "Oversees the creation, optimization, and management of product listings to ensure accuracy and attract potential customers." },
        { name: "Sales Analytics", description: "Analyzes eCommerce data to identify trends, customer behavior, and sales patterns that drive performance and profitability." },
        { name: "Campaign Management", description: "Plans, launches, and tracks promotional campaigns to increase product visibility, boost sales, and enhance brand recognition." },
      ],
    },
    {
      name: "Delta",
      role: "Data Analyst",
      image: "/images/Avatars/Avatar4.png",
      subRoles: [
        { name: "Data Collection", description: "Gathers accurate and relevant data from various sources to create a foundation for detailed analysis and decision-making." },
        { name: "Trend Analysis", description: "Identifies emerging patterns and trends in large datasets to predict future behavior and inform business strategies." },
        { name: "Reporting", description: "Compiles data analysis into comprehensive reports to communicate key insights and assist in data-driven decision-making." },
      ],
    },
    {
      name: "Ember",
      role: "Email Marketing",
      image: "/images/Avatars/Avatar5.png",
      subRoles: [
        { name: "Campaign Design", description: "Designs engaging, visually appealing email campaigns that resonate with target audiences and effectively communicate promotional messages." },
        { name: "Audience Segmentation", description: "Segments audiences based on behaviors, preferences, and demographics to tailor email campaigns for maximum engagement and conversions." },
        { name: "Performance Tracking", description: "Monitors and analyzes email campaign performance metrics, such as open rates and click-through rates, to refine strategies and improve results." },
      ],
    },
    {
      name: "Gala",
      role: "Personal Development Coach",
      image: "/images/Avatars/Avatar6.png",
      subRoles: [
        { name: "Goal Setting", description: "Assists clients in defining clear, achievable personal and professional goals, creating actionable plans to reach them." },
        { name: "Skill Enhancement", description: "Helps individuals identify areas for improvement, providing strategies and support for developing new personal and professional skills." },
        { name: "Motivational Sessions", description: "Leads motivational sessions to inspire and encourage clients to stay focused, overcome challenges, and achieve their full potential." },
      ],
    },
    {
      name: "Maverik",
      role: "Sales Manager",
      image: "/images/Avatars/Avatar7.png",
      subRoles: [
        { name: "Team Management", description: "Leads and manages the sales team, providing guidance, setting performance goals, and ensuring collaboration towards achieving targets." },
        { name: "Sales Strategies", description: "Develops and implements innovative sales strategies to drive revenue growth, increase market share, and optimize sales performance." },
        { name: "Client Acquisition", description: "Identifies and acquires new clients through prospecting, networking, and establishing relationships to expand the customer base." },
      ],
    },
    {
      name: "Quill",
      role: "Copy Writer",
      image: "/images/Avatars/Avatar8.png",
      subRoles: [
        { name: "Content Creation", description: "Writes clear, concise, and persuasive content for websites, blogs, and marketing materials to drive engagement and conversions." },
        { name: "SEO Writing", description: "Creates content that is optimized for search engines, using relevant keywords to improve search engine rankings and visibility." },
        { name: "Editing and Proofreading", description: "Reviews and edits content for clarity, consistency, and grammatical accuracy to ensure high-quality, error-free writing." },
      ],
    },
    {
      name: "Ryder",
      role: "Recruiter",
      image: "/images/Avatars/Avatar9.png",
      subRoles: [
        { name: "Talent Sourcing", description: "Proactively searches for qualified candidates through various channels to identify the best talent for the company." },
        { name: "Interview Coordination", description: "Schedules and coordinates interviews with candidates, ensuring smooth communication and efficient processes during recruitment." },
        { name: "Onboarding", description: "Supports new hires during the onboarding process, ensuring they have the tools, resources, and knowledge to succeed." },
      ],
    },
    {
      name: "Sage",
      role: "SEO Specialist",
      image: "/images/Avatars/Avatar10.png",
      subRoles: [
        { name: "Keyword Research", description: "Conducts in-depth keyword research to identify high-ranking and relevant keywords for search engine optimization." },
        { name: "Content Optimization", description: "Optimizes website content by incorporating targeted keywords and improving readability to enhance SEO performance." },
        { name: "Performance Monitoring", description: "Monitors and analyzes SEO performance metrics to track improvements, identify trends, and adjust strategies for optimal results." },
      ],
    },
    {
      name: "Lumen",
      role: "Social Media Specialist",
      image: "/images/Avatars/Avatar11.png",
      subRoles: [
        { name: "Content Scheduling", description: "Plans and schedules social media posts across multiple platforms to maintain consistent engagement with the audience." },
        { name: "Engagement Tracking", description: "Monitors social media engagement metrics to assess content effectiveness and refine strategies to increase audience interaction." },
        { name: "Platform Strategy", description: "Develops tailored strategies for different social media platforms to maximize reach, engagement, and brand awareness." },
      ],
    },
    {
      name: "Vera",
      role: "Virtual Assistant",
      image: "/images/Avatars/Avatar12.png",
      subRoles: [
        { name: "Administrative Tasks", description: "Handles day-to-day administrative duties, including scheduling, correspondence, and office management to ensure smooth operations." },
        { name: "Data Management", description: "Organizes and maintains data, ensuring accuracy and accessibility to support efficient decision-making and business processes." },
        { name: "Research Assistance", description: "Conducts in-depth research on various topics, gathering insights and providing information to assist with business decisions." },
      ],
    },
    {
      name: "Aria",
      role: "Education Specialist",
      image: "/images/Avatars/Avatar13.png",
      subRoles: [
        { name: "Curriculum Design", description: "Creates well-structured, engaging curricula that align with educational goals and enhance the learning experience for students." },
        { name: "Instructional Support", description: "Provides resources, guidance, and support to instructors to improve teaching methods and student learning outcomes." },
        { name: "Student Assessment", description: "Develops, administers, and evaluates assessments to gauge student progress, identify learning gaps, and improve teaching approaches." },
      ],
    },
    {
      name: "Drift",
      role: "Event Planner",
      image: "/images/Avatars/Avatar14.png",
      subRoles: [
        { name: "Event Design", description: "Plans and conceptualizes event themes, decorations, and layouts to create a cohesive and engaging experience for attendees." },
        { name: "Vendor Coordination", description: "Manages relationships with vendors, negotiating contracts, ensuring timely delivery of services, and overseeing vendor performance." },
        { name: "On-Site Management", description: "Oversees the event’s execution on the day of, ensuring smooth operations, troubleshooting issues, and ensuring a successful outcome." },
      ],
    },
    {
      name: "Neon",
      role: "Creative Designer",
      image: "/images/Avatars/Avatar15.png",
      subRoles: [
        { name: "Graphic Design", description: "Creates visually appealing designs for marketing materials, websites, and branding to attract and engage audiences." },
        { name: "Brand Identity", description: "Develops and maintains consistent brand identity, including logo design, color schemes, and style guides for cohesive communication." },
        { name: "UI/UX Design", description: "Designs user-friendly interfaces and experiences, ensuring seamless navigation, functionality, and user satisfaction." },
      ],
    },
    {
      name: "Pulse",
      role: "Health & Wellness Advisor",
      image: "/images/Avatars/Avatar16.png",
      subRoles: [
        { name: "Nutrition Planning", description: "Develops customized nutrition plans based on individual needs, preferences, and health goals to support overall wellness." },
        { name: "Exercise Guidance", description: "Provides personalized exercise recommendations to improve physical fitness, strength, and overall health outcomes." },
        { name: "Mental Wellness Support", description: "Offers strategies and support to improve mental well-being, reduce stress, and enhance emotional resilience." },
      ],
    },
    {
      name: "Nova",
      role: "Customizable Support Agent",
      image: "/images/Avatars/Avatar17.png",
      subRoles: [
        { name: "Feature Configuration", description: "Works with customers to configure and customize product features according to their specific needs and preferences." },
        { name: "User Training", description: "Provides training and resources to users to help them understand and efficiently use system features and functionalities." },
        { name: "Feedback Integration", description: "Collects user feedback to improve system features, prioritize updates, and ensure the product meets user needs and expectations." },
      ],
    },
  ];
  