import React from 'react'
import AdminNavbar from '@/app/components/AdminNavbar'
import AdminSidebar from '@/app/components/AdminSidebar'
import AdminFooter from '@/app/components/AdminFooter'
const layout = ({children}) => {
  return (
    <div className='flex  h-screen '>
        <AdminSidebar/>
        <div className='flex flex-col w-5/6 items-center h-screen'>
            
            <AdminNavbar/>
            <div className='p-5 bg-white w-full h-full text-black flex items-center justify-center'>{children}</div>
            {/* <AdminFooter/> */}
        </div>
        
    </div>
  )
}

export default layout