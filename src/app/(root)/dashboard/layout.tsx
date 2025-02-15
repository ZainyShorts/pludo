import { Sidebar } from "./Sidebar/Sidebar"; 
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen ">
      <Sidebar />
      <main className=" md:pl-64 bg-custom-gradient">
        {children} 

      </main> 
       <ToastContainer/>
      
    </div>
  )
}

