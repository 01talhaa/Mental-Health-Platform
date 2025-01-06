import React from 'react'
import SearchTherapist from './SearchTherapist'
import TherapistCategory from './TherapistCategory'
import TherapistCard from './TherapistCard'
import Header from '../Homepage/Header'
import TherapistFromHospitals from './TherapistFromHospitals'

const BookTherapist = () => {
  return (
    <div>
        <Header/>
        <div className='mt-20'>
        <SearchTherapist/>
        <TherapistCategory/>
        <TherapistFromHospitals/>
        <TherapistCard/>
        </div>
    </div>
  )
}

export default BookTherapist