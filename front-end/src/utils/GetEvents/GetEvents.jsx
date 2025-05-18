import React from 'react'
import axios from 'axios'

export const GetEvents = async() => {
    const resp = await axios.get('/api/events')
    return resp.data
}

export const GetEvent = async(eventId) => {
    console.log(eventId);
    
    const resp = await axios.get(`/api/events/${eventId}`)
    return resp.data
}
// export default GetEvents