import React from 'react'
import axios from 'axios'

export const GetCinemas = async() => {
    const resp = await axios.get('/api/cinemas')
    return resp.data
}
export const GetCinemaByName = async(cinemaName)=>{
    const data = await GetCinemas()
    const cinema = data.find((cinema) => cinema.name == cinemaName)
    return cinema
}

export const GetCinemaHall = async(cinemaName,cinemaHallName)=>{
    const data = await GetCinemas()
    const cinema = data.find((cinema) => cinema.name == cinemaName)
    const cinemaHall = cinema.halls.find((hall) => hall.name == cinemaHallName)
    return cinemaHall
}