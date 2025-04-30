"use client"
import React from 'react'
import HeaderCompanent from "../../src/common/header/HeaderCompanent"
import FooterCompanent from '../../src/common/footer/FooterCompanent';
import EventsPage from "../pages/EventsPage/page"
// import EventsCom

const Events = () => {
    return (
      <div className='space-y-4'>
          <HeaderCompanent/>
          <EventsPage/>
          <FooterCompanent/>
      </div>
    )
}

export default Events

// 1.сделай событие как переиспользуемый компанент и просто тут использовать с header & footer и в основной странице так же делать