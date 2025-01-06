import React from 'react'
import AnnouncementBlog from './components/FrontBlog/FrontBlog'
import BlogGrid from './components/BlogCards/BlogCard'

const page = () => {
  return (
    <>
    <div className='mt-24'>
        <AnnouncementBlog/>
        <BlogGrid/>
    </div>
    </>
  )
}

export default page