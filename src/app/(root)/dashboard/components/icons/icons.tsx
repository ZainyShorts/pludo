import { icons } from "lucide-react";// Import all icons from Lucid

const IconBody = ({ iconName }) => {
    // Get the icon component by name from the LucidIcons object
    const Icon = icons[iconName];
  
    if (!Icon) {
      return <span>Icon not found</span>; // If the icon name doesn't match, render a fallback
    }
  
    return <Icon className="h-10 w-10  text-purple-400"  />;
  };

  export default IconBody