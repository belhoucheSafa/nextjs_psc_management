
import React from 'react'
import "./notFound.scss"

import NOTFOUNDBG from "../../assets/images/404.png"


const NotFound = () => {
  return (
    <div className='not-found-page-wrapper'>

        <img src={NOTFOUNDBG} alt="" />
    </div>
  )
}

export default NotFound
