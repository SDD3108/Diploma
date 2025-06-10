export const dynamic = 'force-dynamic'
import React from 'react'
// import EventItemPageBuilder from '@/src/pageBuilders/EventsPageBuilders/EventItemPageBuilder/Event'
// import EventItemPageBuilder from '@/src/pageBuilders/EventsPageBuilders/EventItemPageBuilder/Event'
import EventItemPageBuilder from '../../../src/pageBuilders/EventsPageBuilders/EventItemPageBuilder/Event'

const EventItemPage = ({object,loading,error}) => {
  return (
    <div>
      <EventItemPageBuilder object={object} loading={loading} error={error}/>
    </div>
  )
}

export default EventItemPage