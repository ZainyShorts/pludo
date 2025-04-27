'use client'
import React from "react";
import { Button } from "@/components/ui/button";

interface Feature {
  available: boolean;
  text: string;
}

interface PriceCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: Feature[];
  isPopular?: boolean;
  buttonText: string;
  onButtonClick: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({
  title,
  description,
  price,
  period,
  features,
  isPopular = false,
  buttonText,
  onButtonClick
}) => {
  return (
    <div 
      className={`bg-secondary rounded-lg overflow-hidden border ${
        isPopular ? 'border-primary relative transform scale-105 shadow-xl' : 'border-gray-800 transition-all duration-300 hover:border-gray-700 hover:shadow-lg'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1">
          MOST POPULAR
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex items-baseline mb-6">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-gray-400 ml-2">{period}</span>
        </div>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className={`flex items-start ${!feature.available ? 'opacity-50' : ''}`}>
              <i className={`${feature.available ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'} mt-1 mr-2`}></i>
              <span className="text-sm">{feature.text}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={onButtonClick}
          className={`w-full ${
            isPopular 
            ? 'bg-primary hover:bg-primary/90 text-white' 
            : 'border border-gray-700 hover:bg-gray-800 bg-transparent'
          }`}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default PriceCard;
