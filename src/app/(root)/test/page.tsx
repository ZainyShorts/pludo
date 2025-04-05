'use client'
import React from 'react'

function Page() {
  return (
    <div className="w-full h-screen relative">
     <iframe 
        src="http://localhost:3000/dashboard/pludo-agents/Maverik/integration/asst_aWlVlhDBbQOSOYO68XLdSnTP?clr=%2320eebb"
        width="400"
        height="500"
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          border: 'none',
          borderRadius: '12px'
        }}
    />
    </div>
  )
}

export default Page
