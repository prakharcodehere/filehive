import {
  OrganizationSwitcher,
  SignInButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import Logo from "../../public/logo.png";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="relative z-10 border-b py-4 bg-gray-50">
      <div className="items-center container mx-auto justify-between flex font-bold">
        <Link href="/" className="flex items-center  gap-2">
          <Image src="/file-hive-block.png" width={70} height={40} alt="logo"/>
   
     </Link>

     <Button>
     <Link href="/dashboard/files">Your Files</Link>
     </Button>
    
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Header;
