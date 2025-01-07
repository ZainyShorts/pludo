import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";

import BlogPost from "./components/BlogPost";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function page({ params }: { params: { blogId: any } }) {
  console.log(params)
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
