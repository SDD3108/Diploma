import React from 'react'

let storedData = null
export const secondSetData =(data)=>{    
    storedData = data
}
export const secondGetData =()=>{
    return storedData
}
