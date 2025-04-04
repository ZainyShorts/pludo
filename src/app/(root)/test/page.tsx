'use client'
import React from 'react'

function Page() {
  return (
    <div className="w-full h-screen relative">
      <iframe 
        src="http://localhost:3000/dashboard/pludo-agents/Maverik/integration/asst_gI221IM7XGLK57HYHZhXN6Cz"
        width="400"
        height="500"
        style={{ 
          position: 'absolute', 
          bottom: '20px', 
          right: '20px', 
          border: 'none', 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
        }}
      />
    </div>
  )
}

export default Page
