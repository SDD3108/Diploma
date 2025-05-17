import React from 'react'
import axios from 'axios'

export const GetUsers = async() => {
    const resp = await axios.get('/api/users')
    return resp.data
}
export const GetUser = ()=>{

}

// export default GetUsers
