import Image from "next/image"
import { teamMembers } from "./Data"

export default function TopHelpersComponent() {
  return (
    <main className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen py-16">
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
            Top Agents
          </h2>
          <div className="w-32 h-1 bg-indigo-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center group">
              <div
                className="relative w-48 h-48 mb-6 rounded-full overflow-hidden shadow-lg 
                transition-transform duration-300 transform group-hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-75"></div>
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-contain object-center"
                />
                <div className="absolute inset-0 ring-2 ring-white/20 rounded-full"></div>
              </div>

              <h3
                className="text-3xl font-bold mt-6 mb-2 transition-all duration-300 group-hover:text-4xl 
                relative z-10"
                style={{ fontFamily: "Brush Script MT, cursive" }}
              >
                <span
                  className={`bg-clip-text text-transparent bg-gradient-to-r ${member.gradient} 
                  drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]`}
                >
                  {member.name}
                </span>
              </h3>

              <p
                className="text-white/90 text-lg  font-medium tracking-wide transition-all duration-300 
               text-white z-30  group-hover:scale-105"
              >
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

