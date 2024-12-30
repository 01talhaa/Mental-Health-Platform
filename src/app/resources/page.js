import Header from '@/components/Homepage/Header'
import Resources from '@/components/ResourcesPage/Resources'
import React from 'react'

const page = () => {
  return (
    <>
    <Header/>

    <div className="mt-20">
      <Resources/>
    </div>
    </>
  )
}

export default page