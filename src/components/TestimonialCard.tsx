import React from "react";

interface TestimonialCardProps {
  name: string;
  company: string;
  testimonial: string;
  rating: number;
  avatarUrl: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  company,
  testimonial,
  rating,
  avatarUrl
}) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else if (i === Math.floor(rating) && rating % 1 !== 0) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    return stars;
  };

  return (
    <div className="bg-secondary p-6 rounded-lg border border-gray-800 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <img 
            src={avatarUrl} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover" 
          />
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-gray-400">{company}</p>
          </div>
        </div>
        <div className="text-primary">
          <i className="fas fa-quote-right text-xl opacity-50"></i>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm flex-grow">{testimonial}</p>
      
      <div className="mt-4 text-primary">
        {renderStars()}
      </div>
    </div>
  );
};

export default TestimonialCard;
