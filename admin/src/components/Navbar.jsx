import React from 'react'
import { assets } from '../assets/assets'
const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 sm:px-6'>
      <img className='w-[110px] sm:w-[118px]' src={assets.logo} alt="" />
      <button className='rounded-full bg-gray-600 px-4 py-1.5 text-xs text-white sm:px-5 sm:py-2 sm:text-sm' onClick={() => setToken('')}>
        Logout
      </button>
    </div>
  )
}

export default Navbar
