import React from 'react'
import AdminNavbar from '@/app/components/AdminNavbar'
import AdminSidebar from '@/app/components/AdminSidebar'
import AdminFooter from '@/app/components/AdminFooter'
const layout = ({children}) => {
  return (
    <div className='flex flex-col h-screen '>
        <AdminNavbar/>
        <div className='flex items-center h-[86vh]'>
            <AdminSidebar/>
            {children}
        </div>
        <AdminFooter/>
    </div>
  )
}

export default layout