import React from 'react'
import EventItemPageBuilder from '@/src/pageBuilders/EventsPageBuilders/EventItemPageBuilder/Event'
/**
 * @param {{ object: any, loading: boolean, error: any }} props
 */

const EventItemPage = ({object,loading,error}) => {
  return (
    <div>
      <EventItemPageBuilder object={object} loading={loading} error={error}/>
    </div>
  )
}

export default EventItemPage