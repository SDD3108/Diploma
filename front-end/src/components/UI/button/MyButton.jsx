import React from 'react'
import { Button } from "@/src/ui/button"


const MyButton = ({children,...props}) => {
  return (
    <Button className='w-full h-[3rem] rounded-[1rem]' {...props}>
      {children}
    </Button>
  )
}

export default MyButton