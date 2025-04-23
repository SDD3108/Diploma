"use client"
import React, { useEffect, useState, useMemo,useRef } from 'react'
import { useParams,useRouter } from "next/navigation";
const page = () => {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState({})
  const [session,setSession] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(()=>{
    const getEvents = async ()=>{
      try{
        const resp = await axios.get('/api/events')
        const findEventById = resp.data.find((event)=>event._id == params.id)
        if(!findEventById){
          return router.push(`/events/${params.id}`)
        }
        setEvent(findEventById)
        const findSessionById = findEventById.sessions.find((session)=>session.cinemaId == params.nestedId)
        if(!findSessionById){
          return router.push(`/events/${params.id}`)
        }
        setSession(findSessionById)
      }
      catch(err){
        setError(err.resp?.data?.message || err.message || 'Unknown error')
      }
      finally{
        setLoading(false)
      }
    }
    getEvents()
  },[])

  return (
    <div>desc{params.nestedId}</div>
  )
}

export default page