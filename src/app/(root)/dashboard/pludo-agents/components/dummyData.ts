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
      id: "pludo-x",
      name: "Pludo X",
      role: "Unlock all 12 of your Helpers.",
      image: "/images/Avatars/Hero.png",
      isLocked: true,
      isSpecial: true,
    },
    {
      id: "buddy",
      name: "Buddy",
      role: "Business Development",
      image: "/images/Avatars/Avatar4.png",
      isLocked: true,
    },
    {
      id: "cassie",
      name: "Cassie",
      role: "Customer Support",
      image: "/images/Avatars/Avatar2.png",
      isLocked: false,
    },
    {
      id: "gummet",
      name: "Gummet",
      role: "eCommerce",
      image: "/images/Avatars/Avatar.png",
      isLocked: true,
    },
    {
      id: "dexter",
      name: "Dexter",
      role: "Data Analyst",
      image: "/images/Avatars/Avatar.png",
      isLocked: false,
    },
    {
      id: "emmie",
      name: "Emmie",
      role: "Excel Master",
      image: "/images/Avatars/Avatar9.png",
      isLocked: true,
    },
    {
      id: "gigi",
      name: "Gigi",
      role: "Personal Development",
      image: "/images/Avatars/Avatar10.png",
      isLocked: true,
    },
    {
      id: "milli",
      name: "Milli",
      role: "Sales Manager",
      image: "/images/Avatars/Avatar15.png",
      isLocked: true,
    }
  ]
  
  