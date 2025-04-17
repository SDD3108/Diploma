"use client"
import React from 'react'
import { useParams } from "next/navigation";
const page = ({params}) => {
    // const params = useParams();
  return (
    <div>desc{params.nestedId}</div>
  )
}

export default page