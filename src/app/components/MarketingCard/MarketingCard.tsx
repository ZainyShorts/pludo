'use client'

import {MarketingSectionProps } from './types'

export default function MarketingSection({
  mainCard,
  subCard1, 
  subCard2,
}: MarketingSectionProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 space-y-4">
      {/* Main Card */}
      <div className="rounded-3xl bg-white/10 backdrop-blur-sm p-6 md:p-8 shadow-lg border border-white/30 overflow-hidden relative h-auto w-full lg:w-[90%] flex flex-col md:flex-row">
        <div className="p-8 flex flex-col md:flex-row items-center justify-between flex-1">
          {/* Text Content */}
          <div className="flex md:pl-16 flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white">
              {mainCard.title}
            </h2>
            <p className="text-lg md:text-3xl mb-6 font-semibold max-w-[300px] md:max-w-[400px] text-white">
              {mainCard.description}
            </p>
            <button className="px-4 py-2 rounded-full text-sm font-medium border border-white text-white hover:bg-white/10 transition-colors">
              Learn more
            </button>
          </div>

          {/* Image Section */}
          <div className="flex-1 flex p-4 items-center justify-end mt-8 md:mt-0">
            <img
              src={mainCard.image}
              alt={mainCard.title}
              className="w-auto h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-contain"
            />
          </div>
        </div>
      </div>

      {/* Sub Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4 w-full lg:w-[90%]">
        {/* Sub Card 1 */}
        <div 
          className="bg-white/10  backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg border border-white/30 overflow-hidden relative flex flex-col"
        >
          <div className="p-8 flex flex-col flex-1">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold mb-3 text-white">
                {subCard1.title}
              </h2>
              <p className="text-lg mb-6 max-w-[280px] text-white">
                {subCard1.description}
              </p>
              <button className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-white hover:bg-black/5 transition-colors">
                Learn more
              </button>
            </div>
            <div className="flex-1 flex items-end justify-center mt-8">
              <img
                src={subCard1.image}
                alt={subCard1.title}
                className="w-auto  h-[300px] md:h-[500px] object-contain"
              />
            </div>
          </div>
        </div>

        <div 
          className="rounded-3xl bg-white/10 backdrop-blur-md p-6 md:p-8 shadow-lg border border-white/30 overflow-hidden relative flex flex-col"
        >
          <div className="p-8 flex flex-col flex-1">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold mb-3 text-white">
                {subCard2.title}
              </h2>
              <p className="text-lg mb-6 max-w-[280px] text-white">
                {subCard2.description}
              </p>
              <button className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-white hover:bg-gray-200 transition-colors">
                Learn more
              </button>
            </div>
            <div className="flex-1 flex items-end justify-center mt-10">
              <img
                src={subCard2.image}
                alt={subCard2.title}
                className="w-auto h-[300px] md:h-[500px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
