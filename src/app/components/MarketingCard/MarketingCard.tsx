'use client'

import {MarketingSectionProps } from './types'

export default function MarketingSection({
  mainCard,
  subCard1, 
  subCard2,
  mainBgColor,
}: MarketingSectionProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 space-y-4 bg-slate-100">
      {/* Main Card */}
      <div
  className="rounded-3xl overflow-hidden relative h-auto w-full lg:w-[90%] flex flex-col md:flex-row"
  style={{ backgroundColor: mainBgColor }}
>
  <div className="p-8 flex flex-col md:flex-row items-center justify-between flex-1">
    {/* Text Content */}
    <div className="flex md:pl-16 flex-col items-center md:items-start text-center md:text-left">
      <h2 className=" text-3xl md:text-5xl font-bold mb-3 text-white">
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
          className="rounded-3xl overflow-hidden relative  flex flex-col"
          style={{ backgroundColor: 'white' }}
        >
          <div className="p-8 flex flex-col flex-1">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold mb-3 text-black">
                {subCard1.title}
              </h2>
              <p className="text-lg mb-6 max-w-[280px] text-black">
                {subCard1.description}
              </p>
              <button className=" px-4 py-2 rounded-full text-sm font-medium border border-black text-black hover:bg-black/5 transition-colors">
                Learn more
              </button>
            </div>
            <div className="flex-1 flex items-end justify-center mt-8">
              <img
                src={subCard1.image}
                alt={subCard1.title}
                className="w-auto h-[300px] md:h-[500px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* Sub Card 2 */}
        <div 
          className="rounded-3xl overflow-hidden relative  flex flex-col"
          style={{ backgroundColor: 'white' }}
        >
          <div className="p-8 flex flex-col flex-1">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold mb-3 text-black">
                {subCard2.title}
              </h2>
              <p className="text-lg mb-6 max-w-[280px] text-black">
                {subCard2.description}
              </p>
              <button className="px-4 py-2 rounded-full text-sm font-medium border border-black text-black hover:bg-black/5 transition-colors">
                Learn more
              </button>
            </div>
            <div className="flex-1 flex items-end justify-center mt-8">
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

