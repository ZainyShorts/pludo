import Image from "next/image";
import Link from "next/link";

export default function BlogPost() {
  return (
    <>
        <article className="max-w-4xl mt-24 mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
            <span className="text-gray-400">&gt;</span>
            <Link href="/blog/product" className="hover:underline">
              Product
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Sintra AI Goes Mobile: Introducing the iOS App – Manage Your AI
              Workforce Anytime, Anywhere
            </h1>
            <time className="text-gray-600" dateTime="2025-01-05">
              January 5, 2025
            </time>
          </header>

          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden">
            <Image
              src="https://cdn.prod.website-files.com/66912739c6023a7f5b275a1b/677a501883439ccc58b35d79_Sintra%20AI%20Goes%20Mobile_%20Introducing%20the%20iOS%20App%20%E2%80%93%20Manage%20Your%20AI%20Workforce%20Anytime%2C%20Anywhere.png"
              alt="Sintra AI iOS App Interface"
              width={1200}
              height={600}
              className="w-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed mb-8">
              We're thrilled to announce the launch of the Sintra AI app for
              iOS, available from November 2024! The app marks a significant
              step in our commitment to empowering small and medium-sized
              businesses with accessible, on-demand AI employees. Now, you can
              manage and interact with your virtual team directly from your
              iPhone or iPad, transforming business operations on the go.
            </p>

            <p className="mb-8">
              Today's business environment is competitive, and time is of the
              essence. One key advantage is making AI-powered
              information-related decisions early across various Sintra AI agent
              roles. Launching the mobile app eliminates many of the challenges
              Sintra users face while away from their computers.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">
              Sintra Mobile App: Take Control of Your Productivity Wherever You
              Are
            </h2>

            <p className="mb-6">
              The{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Sintra
              </Link>{" "}
              mobile app addresses the challenges of managing AI agents
              remotely, including limited travel access and reduced control when
              away from the web app on a computer.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">
              Lack of Accessibility on the Go
            </h3>

            <p>
              Suppose you are frequently mobile and lack consistent access to a
              computer. In that case, the Sintra mobile app provides access to
              your Sintra agents and workspace anytime, anywhere, directly from
              your iPhone or iPad. A case in point is you can ask the customer
              support agent Cassie to generate reports on last month's customer
              support metrics or ask your E-commerce specialist to update
              product listings while commuting.
            </p>
          </div>
        </article>
    </>
  );
}
