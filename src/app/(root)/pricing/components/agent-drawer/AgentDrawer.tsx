'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { AgentData } from '@/app/(root)/agents/[agent]/Components/data';
import { useMutation } from '@apollo/client';
import { Make_Payment } from '@/lib/query';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { useUser } from '@descope/nextjs-sdk/client'
import { useRouter } from 'next/navigation';

interface AgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentDrawer({ isOpen, onClose }: AgentDrawerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<typeof AgentData>([]);
  const router = useRouter()
  const {user} = useUser()

  const scrollTo = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const currentScroll = container.scrollLeft;
    const targetScroll =
      direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  const toggleAgentSelection = (agent: (typeof AgentData)[0]) => {
    setSelectedAgents((prev) => {
      const isSelected = prev.some((a) => a.name === agent.name);
      if (isSelected) {
        return prev.filter((a) => a.name !== agent.name);
      }
      return [...prev, agent];
    });
  };

  const removeSelectedAgent = (agent: (typeof AgentData)[0]) => {
    setSelectedAgents((prev) => prev.filter((a) => a.name !== agent.name));
  };

  const calculateTotalPrice = () => {
    return selectedAgents.reduce((total, agent) => total + (agent.price || 0), 0);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollButtons();
    container.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);

    return () => {
      container.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

  const [MakePayment] = useMutation(Make_Payment())

  const Checkout = async() =>{
   if(!user?.userId) return router.push('/login')


    const stripe:Stripe | null = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

    if (!stripe) {
      console.error("Stripe failed to load.");
      return;
    }

    let path = "http://localhost:3000" 

    if (typeof window !== "undefined") {
       path = window.location.origin;
      }

    const paymentInput = selectedAgents.map(agent => ({
      amount: agent.price,
      agent: agent.name,
      img: "https://res.cloudinary.com/dklqbx5k0/image/upload/v1737030967/ossuczzut3kurcwrqsuw.webp"
    })) 

   const { data, errors } = await MakePayment({
     variables: {
        paymentInput:paymentInput,
        deScopeId: user!.userId,
        path,
      },
    });

    if(errors){
      console.log(errors)
      return
     }

     try {

     await stripe.redirectToCheckout({
        sessionId: data.makePayment, 
     });
   
   } catch (error) {
       console.error('Payment failed:', error);
   } 
     
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[80vh] p-0 bg-black backdrop-blur-xl border-t border-gray-800"
      >
        <SheetTitle className="sr-only">Select Agent</SheetTitle>
        <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-gray-900/70 to-purple-900/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900/5 to-gray-900/0" />
          </div>

          {/* Main Agents Section */}
          <div className="relative w-full pt-8">
            <div className="relative w-full max-w-[90%] mx-auto">
              <button
                onClick={() => scrollTo('left')}
                className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 group shadow-lg ${
                  canScrollLeft ? 'opacity-100 visible' : ''
                }`}
                aria-label="Previous agents"
              >
                <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={() => scrollTo('right')}
                className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 group shadow-lg ${
                  canScrollRight ? 'opacity-100 visible' : ''
                }`}
                aria-label="Next agents"
              >
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </button>

              <div
                ref={scrollContainerRef}
                className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-8"
              >
                {AgentData.map((agent) => (
                  <div
                    key={agent.name}
                    onClick={() => toggleAgentSelection(agent)}
                    className={`flex-none w-[180px] pb-4 flex flex-col items-center gap-4 group snap-center cursor-pointer transition-transform duration-300 hover:scale-105 ${
                      selectedAgents.some((a) => a.name === agent.name)
                        ? 'scale-105'
                        : ''
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-sm ${
                          selectedAgents.some((a) => a.name === agent.name)
                            ? 'opacity-50'
                            : ''
                        }`}
                      />
                      <div className="relative">
                        <div
                          className={`relative w-36 h-36 rounded-full border-2 transition-all duration-300 ${
                            selectedAgents.some((a) => a.name === agent.name)
                              ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                              : 'border-gray-700 group-hover:border-gray-500'
                          }`}
                        >
                          <Image
                            src={agent.avatar || '/placeholder.svg'}
                            alt={agent.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110 rounded-full"
                          />
                        </div>
                      </div>
                      {selectedAgents.some((a) => a.name === agent.name) && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/90 to-blue-500/90 backdrop-blur-sm border border-white/10 shadow-lg transform transition-all duration-300 scale-100 animate-in fade-in zoom-in">
                          <span className="text-xs font-medium text-white tracking-wider">
                            Selected
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {agent.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Agents Section */}
          <div className="relative w-full mt-auto bg-gray-900/50 backdrop-blur-sm border-t border-gray-800">
            <div className="relative w-full max-w-[90%] mx-auto py-6">
              <div className="flex flex-wrap items-center justify-center gap-4">
                {selectedAgents.map((agent) => (
                  <div key={agent.name} className="relative group">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-2 border-purple-500 overflow-hidden">
                        <Image
                          src={agent.avatar || '/placeholder.svg'}
                          alt={agent.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelectedAgent(agent);
                        }}
                        className="absolute -top-2 -right-2 p-1.5 rounded-full bg-gray-900 border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-800"
                      >
                        <X className="w-3 h-3 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                    <span className='flex justify-center items-center tracking-widest text-white font-zentry text-xl' >{agent.name}</span>
                  </div>
                ))}
              </div>

              {/* Checkout Section */}
              {selectedAgents.length > 0 && (
                <div className="absolute bottom-6 right-0 flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      ${calculateTotalPrice().toLocaleString()}
                    </p>
                  </div>
                  <button onClick={Checkout} className="px-6 py-2 rounded-full border-2 border-white/20 text-white transition-all duration-300 hover:bg-white hover:text-gray-900 hover:border-white backdrop-blur-sm">
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
      <style jsx>{`
        @layer utilities {
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </Sheet>
  );
}


