export interface SubAgent {
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
        { name: "Strategic Planning Agent", description: "This subagent is tasked with formulating business strategies that help achieve long-term goals, streamline operations, and drive growth through comprehensive planning." },
        { name: "Partnership Management Agent", description: "This subagent focuses on building and maintaining relationships with strategic partners to foster collaboration, increase market reach, and enhance mutual growth." },
        { name: "Market Analysis Agent", description: "This subagent specializes in market research, analyzing customer trends and competitive landscapes to uncover opportunities for business expansion and product innovation." },
      ],
    },
    {
      name: "Cora",
      role: "Customer Support",
      image: "/images/Avatars/Avatar2.png",
      subAgents: [
        { name: "Issue Resolution Agent", description: "This subagent ensures that customer complaints and technical issues are addressed swiftly and effectively, aiming to enhance customer satisfaction and retention." },
        { name: "Feedback Collection Agent", description: "This subagent gathers valuable insights from customers through surveys and feedback forms, which help identify areas for improvement in products or services." },
        { name: "Knowledge Base Management Agent", description: "This subagent maintains an up-to-date, comprehensive knowledge base for customers, ensuring easy access to solutions and reducing the burden on support teams." },
      ],
    },
    {
      name: "Echo",
      role: "eCommerce Specialist",
      image: "/images/Avatars/Avatar3.png",
      subAgents: [
        { name: "Product Listing Agent", description: "This subagent ensures that product listings are created, optimized, and regularly updated to ensure accuracy and maximize customer appeal on eCommerce platforms." },
        { name: "Sales Analytics Agent", description: "This subagent analyzes sales data to uncover customer purchasing behaviors, trends, and market dynamics, providing actionable insights to improve sales strategies." },
        { name: "Campaign Management Agent", description: "This subagent oversees the execution of promotional campaigns, ensuring they are well-targeted, effectively launched, and accurately tracked to boost brand visibility and drive sales." },
      ],
    },
    {
      name: "Delta",
      role: "Data Analyst",
      image: "/images/Avatars/Avatar4.png",
      subAgents: [
        { name: "Data Collection Agent", description: "This subagent is responsible for gathering relevant data from diverse sources, ensuring its quality and reliability for subsequent analysis." },
        { name: "Trend Analysis Agent", description: "This subagent uses statistical tools to identify emerging patterns in large datasets, providing insights that can help shape future business strategies." },
        { name: "Reporting Agent", description: "This subagent compiles data into comprehensive reports, transforming raw data into clear and actionable insights that inform decision-making." },
      ],
    },
    {
      name: "Ember",
      role: "Email Marketing",
      image: "/images/Avatars/Avatar5.png",
      subAgents: [
        { name: "Campaign Design Agent", description: "This subagent is in charge of designing visually engaging and persuasive email campaigns that align with the company’s marketing objectives and resonate with the target audience." },
        { name: "Audience Segmentation Agent", description: "This subagent segments the email list based on customer demographics and behaviors, ensuring each campaign is highly targeted and personalized." },
        { name: "Performance Tracking Agent", description: "This subagent monitors key email campaign metrics, such as open rates and click-through rates, to assess effectiveness and refine future marketing strategies." },
      ],
    },
    {
      name: "Gala",
      role: "Personal Development Coach",
      image: "/images/Avatars/Avatar6.png",
      subAgents: [
        { name: "Goal Setting Agent", description: "This subagent helps clients define clear, actionable goals and create detailed plans to achieve them, tracking progress and adjusting strategies as needed." },
        { name: "Skill Enhancement Agent", description: "This subagent identifies areas for improvement and provides tailored strategies and resources to help individuals develop essential personal and professional skills." },
        { name: "Motivational Agent", description: "This subagent delivers motivational sessions designed to inspire and empower clients to overcome challenges and stay focused on their personal growth journey." },
      ],
    },
    {
      name: "Maverik",
      role: "Sales Manager",
      image: "/images/Avatars/Avatar7.png",
      subAgents: [
        { name: "Team Management Agent", description: "This subagent leads the sales team, providing direction, support, and training to ensure that team members meet their performance targets and contribute to the company’s goals." },
        { name: "Sales Strategy Agent", description: "This subagent designs and implements innovative sales strategies aimed at increasing revenue, expanding market reach, and optimizing sales processes." },
        { name: "Client Acquisition Agent", description: "This subagent is responsible for sourcing and acquiring new clients by networking, prospecting, and building strong relationships with potential customers." },
      ],
    },
    {
      name: "Quill",
      role: "Copy Writer",
      image: "/images/Avatars/Avatar8.png",
      subAgents: [
        { name: "Content Creation Agent", description: "This subagent is tasked with writing persuasive and engaging content for websites, blogs, and other marketing materials that align with brand messaging and drive conversions." },
        { name: "SEO Writing Agent", description: "This subagent creates content optimized for search engines, ensuring that relevant keywords are used to improve rankings and drive organic traffic." },
        { name: "Editing and Proofreading Agent", description: "This subagent reviews written content to ensure it is clear, concise, error-free, and consistent with brand voice, making adjustments for grammar, style, and clarity." },
      ],
    },
    {
      name: "Ryder",
      role: "Recruiter",
      image: "/images/Avatars/Avatar9.png",
      subAgents: [
        { name: "Talent Sourcing Agent", description: "This subagent proactively seeks out and evaluates qualified candidates through various recruitment channels, ensuring the best talent is brought into the company." },
        { name: "Interview Coordination Agent", description: "This subagent handles the scheduling and logistics of interviews, ensuring clear communication with candidates and efficient interview processes." },
        { name: "Onboarding Agent", description: "This subagent facilitates the onboarding process for new hires, ensuring they receive the necessary training, resources, and support to succeed in their new role." },
      ],
    },
    {
      name: "Sage",
      role: "SEO Specialist",
      image: "/images/Avatars/Avatar10.png",
      subAgents: [
        { name: "Keyword Research Agent", description: "This subagent conducts in-depth research to identify the most relevant and high-ranking keywords for improving the website’s SEO performance." },
        { name: "Content Optimization Agent", description: "This subagent optimizes website content to improve readability, keyword usage, and user experience, ensuring content is both engaging and SEO-friendly." },
        { name: "Performance Monitoring Agent", description: "This subagent tracks and analyzes SEO metrics to evaluate website performance, identifying areas for improvement and adapting strategies for optimal results." },
      ],
    },
    {
      name: "Lumen",
      role: "Social Media Specialist",
      image: "/images/Avatars/Avatar11.png",
      subAgents: [
        { name: "Content Scheduling Agent", description: "This subagent ensures that social media posts are scheduled and published consistently across platforms to maintain ongoing engagement with the audience." },
        { name: "Engagement Tracking Agent", description: "This subagent tracks engagement metrics such as likes, shares, and comments, assessing content effectiveness and refining future social media strategies." },
        { name: "Platform Strategy Agent", description: "This subagent develops tailored strategies for each social media platform to maximize reach, engagement, and brand awareness." },
      ],
    },
    {
      name: "Vera",
      role: "Virtual Assistant",
      image: "/images/Avatars/Avatar12.png",
      subAgents: [
        { name: "Administrative Tasks Agent", description: "This subagent manages day-to-day administrative duties, including scheduling, correspondence, and office management, ensuring smooth operation of the business." },
        { name: "Data Management Agent", description: "This subagent organizes, updates, and maintains accurate data records, ensuring that essential business information is easily accessible and properly stored." },
        { name: "Research Assistance Agent", description: "This subagent conducts research on a variety of topics, gathering insights and providing reports to assist with business decision-making and planning." },
      ],
    },
    {
      name: "Aria",
      role: "Education Specialist",
      image: "/images/Avatars/Avatar13.png",
      subAgents: [
        { name: "Curriculum Design Agent", description: "This subagent designs educational programs and curricula that are structured, engaging, and aligned with educational objectives to optimize student learning outcomes." },
        { name: "Instructional Support Agent", description: "This subagent provides guidance and resources to instructors, helping improve teaching methods and student learning experiences." },
        { name: "Student Assessment Agent", description: "This subagent develops and administers assessments to evaluate student progress, identify learning gaps, and guide improvements in educational strategies." },
      ],
    },
    {
      name: "Drift",
      role: "Event Planner",
      image: "/images/Avatars/Avatar14.png",
      subAgents: [
        { name: "Event Design Agent", description: "This subagent is responsible for conceptualizing event themes, decorations, and layouts to create an engaging and cohesive experience for attendees." },
        { name: "Vendor Coordination Agent", description: "This subagent manages vendor relationships, ensuring timely delivery of goods and services, negotiating contracts, and overseeing vendor performance." },
        { name: "On-Site Management Agent", description: "This subagent oversees the logistics and execution of events, ensuring everything runs smoothly and troubleshooting issues as they arise during the event." },
      ],
    },
    {
      name: "Neon",
      role: "Creative Designer",
      image: "/images/Avatars/Avatar15.png",
      subAgents: [
        { name: "Graphic Design Agent", description: "This subagent creates visually captivating designs for branding, websites, and marketing materials to attract and engage the target audience." },
        { name: "Brand Identity Agent", description: "This subagent is responsible for developing and maintaining a consistent brand identity, including logo design, color schemes, and style guidelines." },
        { name: "UI/UX Design Agent", description: "This subagent designs user-friendly interfaces and seamless user experiences, ensuring that websites and applications are intuitive and easy to navigate." },
      ],
    },
    {
      name: "Pulse",
      role: "Health & Wellness Advisor",
      image: "/images/Avatars/Avatar16.png",
      subAgents: [
        { name: "Nutrition Planning Agent", description: "This subagent creates personalized nutrition plans based on individual health goals, preferences, and dietary needs, promoting overall well-being." },
        { name: "Exercise Guidance Agent", description: "This subagent provides personalized fitness advice and exercise routines to enhance physical strength, health, and wellness." },
        { name: "Mental Wellness Support Agent", description: "This subagent offers guidance and strategies for improving mental health, reducing stress, and building emotional resilience to maintain overall mental well-being." },
      ],
    },
    {
      name: "Nova",
      role: "Customizable Support Agent",
      image: "/images/Avatars/Avatar11.png",
      subAgents: [
        { name: "Feature Configuration Agent", description: "This subagent works closely with customers to configure and customize product features according to their specific needs, ensuring satisfaction." },
        { name: "User Training Agent", description: "This subagent provides training and educational resources to users to help them understand and efficiently use the system’s features." },
        { name: "Feedback Integration Agent", description: "This subagent gathers and analyzes user feedback to improve system features, prioritize product updates, and ensure that the product meets user expectations." },
      ],
    },
  ];
