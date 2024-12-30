import Header from '@/components/Homepage/Header'
import Services from '@/components/ServicesPage/Services'
import React from 'react'

const page = () => {
  return (
    <>
    <Header/>

    <div className="mt-20">
    <Services/>

    </div>
    </>
  )
}

export default page