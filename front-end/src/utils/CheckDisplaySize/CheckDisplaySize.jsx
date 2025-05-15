import { useState, useEffect } from 'react'

export function CheckDisplaySize(breakpoint = 768){
  const [isMobile, setIsMobile] = useState(false)

  useEffect(()=>{
    const onResize = () => setIsMobile(window.innerWidth < breakpoint)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  },[breakpoint])

  return isMobile
}