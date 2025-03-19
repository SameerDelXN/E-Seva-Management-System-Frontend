"use client"
import React from 'react'
import { useParams } from 'next/navigation'
const page = () => {
    const {service} = useParams()
  return (
    <div className='w-5/6 h-full bg-yellow-100'>{service}</div>
  )
}

export default page