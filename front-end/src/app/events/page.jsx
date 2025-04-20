"use client"
import React from 'react'
import HeaderCompanent from '@/src/companents/header/HeaderCompanent';
import FooterCompanent from '@/src/companents/footer/FooterCompanent';
import EventsCompanent from '@/src/companents/events/EventsCompanent';
// import EventsCom

const Events = () => {
    return (
      <div className='space-y-4'>
          <HeaderCompanent/>
          <EventsCompanent/>
          <FooterCompanent/>
      </div>
    )
}

export default Events

// 1.сделай событие как переиспользуемый компанент и просто тут использовать с header & footer и в основной странице так же делать