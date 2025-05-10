import React from 'react'

export const GetInitials = (name) => {
    if(name == undefined || name == null){
        return 'SD'
    }
    const cleared = name.trim().toUpperCase()
    const initials = cleared.split(/\s+/).filter((word) => word.length > 0)
    if(initials.length >= 2){
        return `${initials[0][0]}${initials[initials.length - 1][0]}`
    }
    else if(cleared.length >= 2){
      return cleared.slice(0, 2)
    }
    return cleared.length == 1 ? `${cleared[0]}${cleared[0]}` : 'SD'
}

// export default GetInitials