import {
    Brain,
    MessageSquare,
    Share2,
    Layers,
    Mail,
    UserCircle,
    DollarSign,
    PenTool,
    Briefcase,
    Search,
    Instagram,
    ClipboardList,
    GraduationCap,
    Calendar,
    Palette,
    Heart
  } from 'lucide-react';
  
  export const agents = [
    {
      name: 'Ace',
      role: 'Business Development',
      icon: Brain,
      avatar:
        '/images/Avatars/Avatar.png',
      description: 'Expert in marketing strategies and competitor analysis',
      features: [
        'Generate detailed and actionable marketing strategies',
        'Analyze competitors by identifying strengths, weaknesses, opportunities, and threats',
        'Develop comprehensive product launch plans with timelines and KPIs',
        'Craft personalized investor updates and reports'
      ]
    },
    {
      name: 'Cora',
      role: 'Customer Support',
      icon: MessageSquare,
      avatar:
        '/images/Avatars/Avatar2.png',
      description: 'Dedicated to providing exceptional customer support',
      features: [
        'Provide instant responses to customer queries via chat and email',
        'Create FAQ sections, user manuals, and troubleshooting guides',
        'Analyze customer feedback to generate actionable support improvement reports'
      ]
    },
    {
      name: 'Echo',
      role: 'eCommerce Specialist',
      icon: Share2,
      avatar:
        '/images/Avatars/Avatar3.png',
      description: 'Optimizes online stores for maximum performance',
      features: [
        'Write high-converting product descriptions and design engaging landing pages',
        'Perform store audits and recommend optimization strategies',
        'Identify winning product ideas and calculate profit margins'
      ]
    },
    {
      name: 'Delta',
      role: 'Data Analyst',
      icon: Layers,
      avatar:
        '/images/Avatars/Avatar4.png',
      description: 'Transforms raw data into actionable insights',
      features: [
        'Generate balance sheets, profit/loss statements, and other financial reports',
        'Forecast future sales trends and revenue streams based on current data',
        'Calculate ROI for projects and offer actionable insights'
      ]
    },
    {
      name: 'Ember',
      role: 'Email Marketing',
      icon: Mail,
      avatar:
        '/images/Avatars/Avatar5.png',
      description: 'Creates engaging email campaigns that convert',
      features: [
        'Automate the creation of email campaigns, calendars, and workflows',
        'Design emails for abandoned carts, customer win-backs, and special promotions',
        'Provide post-purchase email flows that boost customer satisfaction'
      ]
    },
    {
      name: 'Gala',
      role: 'Personal Development Coach',
      icon: UserCircle,
      avatar:
        '/images/Avatars/Avatar6.png',
      description: 'Your personal coach for growth and development',
      features: [
        'Develop personalized meal and workout plans',
        'Assist with studying through optimized schedules and study aids',
        'Offer productivity recommendations for daily and weekly tasks'
      ]
    },
    {
      name: 'Maverick',
      role: 'Sales Manager',
      icon: DollarSign,
      avatar:
        '/images/Avatars/Avatar7.png',
      description: 'Expert in sales strategies and customer acquisition',
      features: [
        'Generate persuasive cold email scripts and follow-ups',
        'Create legally sound sales contracts and comprehensive incentive plans',
        'Provide expert negotiation guidance and discovery call frameworks'
      ]
    },
    {
      name: 'Quill',
      role: 'Copywriter',
      icon: PenTool,
      avatar:
        '/images/Avatars/Avatar8.png',
      description: 'Crafts compelling content that engages and converts',
      features: [
        'Write engaging ad copy, blogs, newsletters, and social media posts',
        'Optimize scripts for Facebook ads, video sales letters (VSL), and advertorials',
        'Enhance written content for readability, SEO, and conversions'
      ]
    },
    {
      name: 'Ryder',
      role: 'Recruiter',
      icon: Briefcase,
      avatar:
        '/images/Avatars/Avatar9.png',
      description: 'Finds and retains top talent for your organization',
      features: [
        'Screen resumes with tailored filters for role-specific qualifications',
        'Develop personalized onboarding plans for new hires',
        'Generate outreach emails and job descriptions to attract talent'
      ]
    },
    {
      name: 'Sage',
      role: 'SEO Specialist',
      icon: Search,
      avatar:
        '/images/Avatars/Avatar10.png',
      description: 'Boosts your online presence with effective SEO strategies',
      features: [
        'Write SEO-optimized blogs to improve website visibility',
        'Audit websites for SEO performance and recommend improvements',
        'Provide keyword strategies to improve search engine rankings'
      ]
    },
    {
      name: 'Lumen',
      role: 'Social Media Strategist',
      icon: Instagram,
      avatar:
        '/images/Avatars/Avatar11.png',
      description: 'Maximizes your social media impact',
      features: [
        'Create consistent and engaging content calendars',
        'Develop scripts for TikTok, YouTube, and Instagram Reels',
        'Identify viral trends to boost brand visibility'
      ]
    },
    {
      name: 'Vera',
      role: 'Virtual Assistant',
      icon: ClipboardList,
      avatar:
        '/images/Avatars/Avatar12.png',
      description: 'Supports your daily tasks with efficiency',
      features: [
        'Manage tasks like trip planning and financial reporting',
        'Organize events such as birthdays and business meetings',
        'Provide administrative support for projects and workflows'
      ]
    },
    {
      name: 'Aria',
      role: 'Education Specialist',
      icon: GraduationCap,
      avatar:
        '/images/Avatars/Avatar13.png',
      description: 'Enhances learning experiences with tailored plans',
      features: [
        'Create personalized learning plans for all skill levels',
        'Summarize study materials into concise notes and quizzes',
        'Recommend resources for academic and personal growth'
      ]
    },
    {
      name: 'Drift',
      role: 'Event Planner',
      icon: Calendar,
      avatar:
        '/images/Avatars/Avatar14.png',
      description: 'Plans memorable events with precision',
      features: [
        'Plan corporate and social events with detailed schedules',
        'Recommend activities, catering options, and decor ideas',
        'Manage RSVPs and analyze post-event feedback'
      ]
    },
    {
      name: 'Neon',
      role: 'Creative Designer',
      icon: Palette,
      avatar:
        '/images/Avatars/Avatar15.png',
      description: 'Transforms ideas into stunning visuals',
      features: [
        'Design templates for presentations and brochures',
        'Suggest branding elements like logos and typography',
        'Provide ideas for visual storytelling and impactful designs'
      ]
    },
    {
      name: 'Pulse',
      role: 'Health & Wellness Advisor',
      icon: Heart,
      avatar:
        '/images/Avatars/Avatar6.png',
      description: 'Promotes better health and well-being',
      features: [
        'Offer tailored fitness routines and mental health advice',
        'Suggest daily wellness practices and mindfulness exercises',
        'Provide stress management strategies'
      ]
    },
    {
      name: 'Nova',
      role: 'Customizable Support Agent',
      icon: UserCircle,
      avatar:
        '/images/Avatars/Avatar3.png',
      description: 'Adaptable to meet your unique needs',
      features: [
        'Allow users to upload specific data and train the agent',
        'Provide an API for seamless integration into websites',
        'Answer queries in real-time with voice and text-based responses'
      ]
    }
  ];
  