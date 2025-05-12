import React from 'react'
import EventsPageBuilder from '@/src/pageBuilders/EventsPageBuilders/EventsPageBuilder/EventsCompanent'
import SearchPage from '../SearchPage/page'

const EventsPage = () => {
  return (
    <div className=''>
      <SearchPage/>
      <EventsPageBuilder/>
    </div>
  )
}

export default EventsPage