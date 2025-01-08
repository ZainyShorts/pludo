import Image from 'next/image'
import Link from 'next/link'
import { teamMembers } from './Data'


export default function TopHelpersComponent() {
  return (
    <main className="min-h-screen ">
      {/* Header */}
      <header className="p-6 mx-auto w-[70vw] ">
        <h1 className="text-2xl text-white font-bold">Shop Pludo</h1>
      </header>

      {/* Hero Section */}
      <section className="relative w-[70vw] mx-auto    bg-black text-white rounded-3xl mb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            Pludo AI.
          </h2>
          <Link 
            href="#" 
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Learn more
          </Link>
        </div>
        <div className="absolute right-0 bottom-0 w-2/3 h-full">
          <Image
            src="https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/6638da968932dde8ba90a522_Remove%20Background.webp"
            alt="Sintra characters collection"
            width={800}
            height={600}
            className="object-contain"
          />
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <h3 className={`text-3xl font-bold mb-2 text-white `}  style={{ fontFamily: 'cursive' }}>
                Top Agents
              </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              <div className="relative w-full aspect-square mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className={`text-3xl font-bold mb-2 ${member.color}`}  style={{ fontFamily: 'cursive' }}>
                {member.name}
              </h3>
              <p className=" text-white">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

