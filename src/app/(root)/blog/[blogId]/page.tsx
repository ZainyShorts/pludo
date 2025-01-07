import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";

import BlogPost from "./components/BlogPost";

export default function page({ params }: { params: { blogId: string } }) {
  return (
    <>
      <Navbar />
      <div className="mt-20">
        <BlogPost/>
      </div>
      <Footer />
    </>
  );
}
