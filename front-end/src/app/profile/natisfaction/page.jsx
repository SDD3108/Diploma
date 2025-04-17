import React from 'react'

const page = () => {
    const navigationToNatisfaction = ()=>{
        router.push('/natisfaction')
    }
  return (
    <div onClick={navigationToNatisfaction}>page</div>
  )
}

export default page