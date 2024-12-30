import Contact from '@/components/ContactPage/Contact'
import Header from '@/components/Homepage/Header'
import React from 'react'

const page = () => {
  return (
    <>
    <Header/>

    <div className="mt-20">
      <Contact/>
    </div>
    </>
  )
}

export default page