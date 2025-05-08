import React,{useEffect,useState} from 'react'
import axios from 'axios'

// export const getSessionsByEventId = async(eventId)=>{
//     const response = await axios.get(`/events/${eventId}`)
//     return response.data.sessions
// }
// export const getSessionById = async(eventId,sessionId)=>{
//   const sessions = await getSessionsByEventId(eventId)
//   const session = sessions.find((session) => session.id == sessionId)
//   return session
// }

export const GetSessions = async(eventId) => {

    const response = await axios.get(`/api/events/${eventId}`)
    const sessions = response.data.sessions
    return sessions
}
export const GetSession = async(eventId,sessionId) => {
    const sessions = await GetSessions(eventId)
    const session = sessions.find((session) => session._id == sessionId)
    return session
}

export default GetSessions