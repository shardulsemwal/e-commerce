import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'   

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex w-[180px] items-center gap-3 border border-gray-200 border-r-0 bg-white px-3 py-2 text-gray-700 ${
      isActive ? 'active' : ''
    }`

  return (
    <div className='min-h-[calc(100vh-73px)] w-52 border-r border-gray-200 bg-white pt-3 pl-4'>
      <NavLink
        to="/add"
        className={linkClass}
      >
        <img className='h-5 w-5' src={assets.add_icon} alt="" />
        <p className='text-sm'>Add Items</p>
      </NavLink>

      <NavLink
        to="/list"
        className={linkClass}
      >
        <img className='h-5 w-5' src={assets.order_icon} alt="" />
        <p className='text-sm'>List Items</p>
      </NavLink>

      <NavLink
        to="/orders"
        className={linkClass}
      >
        <img className='h-5 w-5' src={assets.order_icon} alt="" />
        <p className='text-sm'>Orders</p>
      </NavLink>
    </div>
  )
}

export default Sidebar
