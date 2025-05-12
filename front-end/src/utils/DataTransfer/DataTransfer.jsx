import React from 'react'

let storedData = null
export const setData =(data)=>{    
    console.log("Data set in DataTransfer", data);
    
    storedData = data
}
export const getData =()=>{
    return storedData
}
