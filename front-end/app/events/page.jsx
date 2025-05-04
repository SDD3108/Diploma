"use client"
import React from 'react'
import EventsPage from '@/app/(pages)/EventsPage/page';
// import EventsCom

const Events = () => {
  return (
    <div className='my-20'>
      <EventsPage/>
    </div>
  )
}

export default Events

// 1.сделай событие как переиспользуемый компанент и просто тут использовать с header & footer и в основной странице так же делать