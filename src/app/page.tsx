"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useOrganization,
  useSession,
  useUser,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";
import { log } from "console";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { UplaodButton } from "./upload-button";
import FileCard from "./file-card";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

export default function Home() {



//

  const organization = useOrganization();
  const user = useUser();





  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }



  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");


  return (
    <main className="container mx-auto pt-12">
      
{files === undefined  &&  
<div  className="flex flex-col gap-4 w-full items-center mt-12 ">
  <Loader2 className="h-24 w-24 animate-spin text-gray-400"/>
  <div className="text-2xl">Loading...</div>
</div>
}

      {files && files.length === 0 && (
  <div className="flex flex-col gap-4 w-full items-center mt-12 ">
  <Image
alt="folder image"
src="/empty.svg"
width="300"
height="300"/>
<div className="text-2xl ">
You have no files, go ahead and upload one now
</div>
<UplaodButton/>
</div>
)}


{files && files.length > 0 && (
  <>
  <div className="flex justify-between items-center mb-8">
  <h1 className="text-4xl font-bold ">Your Files</h1>

  <UplaodButton/>
  </div>
  <div className="grid grid-cols-3 gap-4 ">  

{files?.map((file) => {
      return <FileCard key={file._id} file={file}/>;
    })}
    </div>


</>
)}


   
    </main>
  );
}
 