import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import Logo from "../../public/logo.png"

const Header = () => {
  return (
    <div className='border-b py-4 bg-gray-50'>
          
        <div className="items-center container mx-auto justify-between flex font-bold">
          <div>File Hive.</div>
<div className='flex gap-2'>
<OrganizationSwitcher />
 <UserButton/>
</div>

 
        </div>
    </div>
  )
}

export default Header