"use client"

import type { MarketingSectionProps } from "./types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function MarketingSection({ mainCard, subCard1, subCard2 }: MarketingSectionProps) {
  const router = useRouter()
  const handleNavigate = (title: string) => {
    router.push(`/agents/${title}`)
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 md:p-8 space-y-12">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[2.5rem] bg-gradient-to-r from-purple-800/90 to-indigo-900/90 shadow-2xl border border-purple-500/30 overflow-hidden relative min-h-auto w-full lg:w-[90%] flex flex-col md:flex-row p-4 md:p-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between flex-1 gap-8 md:gap-16">
          {/* Text Content */}
          <div className="flex md:pl-8 flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              {mainCard.title}
            </h2>
            <p className="text-xl md:text-2xl font-semibold max-w-[400px] text-gray-300/90">{mainCard.description}</p>
            <ul className="list-none space-y-4 w-full">
              {mainCard.keyPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <span className="text-green-400 mr-3 text-xl">•</span>
                  <span className="text-gray-200 text-base md:text-lg">{point}</span>
                </motion.li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate(mainCard.title)}
              className="px-8 py-4 rounded-full text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg flex items-center gap-2 hover:gap-3"
            >
              Learn more
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Enhanced Image Container */}
          <div className="flex-1 z-40 flex items-center justify-center md:justify-end w-full md:w-1/2 relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mt-8 md:mt-0"> 
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full"
            >
              {/* Glass Effect Layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-[2rem] transform rotate-6 scale-95 translate-x-4 translate-y-4" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-[2rem] transform -rotate-3 scale-95" />

              {/* Main Image Container */}
              <motion.div
                whileHover={{
                  scale: 1.02,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="relative h-full w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md shadow-2xl border border-white/20"
              >
                {/* Lighting Effects */}
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/40 via-pink-500/40 to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-indigo-500/40 via-purple-500/40 to-transparent rounded-full blur-3xl" />

                {/* Image */}
                <Image
                  src={mainCard.image || "/placeholder.svg"}
                  alt={mainCard.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "contain", objectPosition: "center" }}
                  className="rounded-[2rem] transition-all duration-300 hover:scale-105"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent" />

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="absolute top-4 left-4 w-12 h-12 bg-pink-500/30 rounded-full backdrop-blur-md"
                />
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="absolute bottom-4 right-4 w-16 h-16 bg-purple-500/30 rounded-full backdrop-blur-md"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Sub Cards */}
      <div className="grid md:grid-cols-2 gap-12 w-full lg:w-[90%]">
        {[subCard1, subCard2].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="rounded-[2rem] bg-gradient-to-br from-purple-900/40 via-purple-800/40 to-purple-900/20 shadow-2xl border border-white/20 overflow-hidden relative flex flex-col p-8"
          >
            <div className="flex flex-col flex-1 gap-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <h2 className="text-3xl font-bold text-white">{card.title}</h2>
                <p className="text-xl max-w-[320px] text-gray-300/90">{card.description}</p>
                <ul className="list-none space-y-3 w-full">
                  {card.keyPoints.map((point, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-purple-400 mr-3 text-xl">•</span>
                      <span className="text-gray-200 text-base">{point}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate(card.title)}
                  className="px-8 py-4 rounded-full text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 shadow-lg flex items-center gap-2 hover:gap-3"
                >
                  Learn more
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Enhanced Sub-Card Image Container */}
              <div className="relative h-[300px] sm:h-[350px] mt-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  {/* Glass Effect Layers */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-[2rem] transform rotate-6 scale-95 translate-x-4 translate-y-4" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-[2rem] transform -rotate-3 scale-95" />

                  {/* Main Image Container */}
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      rotate: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    className="relative h-full w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md shadow-2xl border border-white/20"
                  >
                    {/* Lighting Effects */}
                    <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-transparent rounded-full blur-3xl" />
                    <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/30 to-transparent rounded-full blur-3xl" />

                    {/* Image */}
                    <Image
                      src={card.image || "/placeholder.svg"}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "contain", objectPosition: "center" }}
                      className="rounded-[2rem] transition-all duration-300 hover:scale-105"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

