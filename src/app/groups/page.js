import Groups from '@/components/GroupsPage/Groups'
import Header from '@/components/Homepage/Header'
import React from 'react'

const page = () => {
  return (
    <>
    <Header/>

    <div className="mt-20">
      <Groups/>
    </div>
    </>
  )
}

export default page