export interface Agent {
  id: string;
  name: string;
  role: string;
  image: string;
  isLocked: boolean;
  isSpecial?: boolean;
}

export const pludoAgentsData: Agent[] = [
  {
    id: "pludo",
    name: "Pludo X",
    role: "Unlock All 17 Agents",
    image: "/images/Avatars/Hero.png",
    isLocked: true,
    isSpecial: true,
  }, 
  {
    id: "ace",
    name: "Ace",
    role: "Bussiness Development",
    image: "/images/Avatars/Avatar.png",
    isLocked: false,
  },
  {
    id: "cora",
    name: "CORA",
    role: "Customer Support",
    image: "/images/Avatars/Avatar2.png",
    isLocked: true,
  },
  {
    id: "echo",
    name: "Echo",
    role: "eCommerce Specialist",
    image: "/images/Avatars/Avatar3.png",
    isLocked: true,
  },
  {
    id: "delta",
    name: "Delta",
    role: "Data Analyst",
    image: "/images/Avatars/Avatar4.png",
    isLocked: false,
  },
  {
    id: "ember",
    name: "Ember",
    role: "Email Marketing",
    image: "/images/Avatars/Avatar5.png",
    isLocked: true,
  },
  {
    id: "gala",
    name: "Gala",
    role: "Personal Development Coach",
    image: "/images/Avatars/Avatar6.png",
    isLocked: false,
  },
  {
    id: "maverik",
    name: "Maverik",
    role: "Sales Manager",
    image: "/images/Avatars/Avatar7.png",
    isLocked: true,
  },
  {
    id: "quill",
    name: "Quill",
    role: "Copy Writer",
    image: "/images/Avatars/Avatar8.png",
    isLocked: true,
  },
  {
    id: "ryder",
    name: "Ryder",
    role: "Recruiter",
    image: "/images/Avatars/Avatar9.png",
    isLocked: false,
  },
  {
    id: "sage",
    name: "Sage",
    role: "SEO Specialist",
    image: "/images/Avatars/Avatar10.png",
    isLocked: true,
  },
  {
    id: "lumen",
    name: "Lumen",
    role: "Social Media Specialist",
    image: "/images/Avatars/Avatar11.png",
    isLocked: true,
  },
  {
    id: "vera",
    name: "Vera",
    role: "Virtual Assistant",
    image: "/images/Avatars/Avatar12.png",
    isLocked: true,
  },
  {
    id: "aria",
    name: "Aria",
    role: "Education Specialist",
    image: "/images/Avatars/Avatar13.png",
    isLocked: true,
  },
  {
    id: "drift",
    name: "Drift",
    role: "Event Planner",
    image: "/images/Avatars/Avatar14.png",
    isLocked: false,
  },
  {
    id: "neon",
    name: "Neon",
    role: "Creative Designer",
    image: "/images/Avatars/Avatar15.png",
    isLocked: true,
  },
  {
    id: "pulse",
    name: "Pulse",
    role: "Health & Wellness Advisor",
    image: "/images/Avatars/Avatar16.png",
    isLocked: true,
  },
  {
    id: "nova",
    name: "Nova",
    role: "Customizable Support Agent",
    image: "/images/Avatars/Avatar10.png",
    isLocked: false,
  },
];
