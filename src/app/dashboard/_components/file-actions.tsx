import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { DeleteIcon, Download, FileText, GanttChartIcon, ImageIcon, MoreVertical, StarHalf, StarIcon, Trash, Undo2Icon, WineOff } from "lucide-react"
  

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { ReactNode, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Protect } from "@clerk/nextjs"
  





export function FileCardActions ({file, isFavorited} : {file: Doc<"files">, isFavorited: boolean}) {






const toggleFavourite = useMutation(api.files.toggleFavourite)

const [isConfirmOpen, setIsConfirmOpen] =  useState(false);
const deleteFile = useMutation(api.files.deleteFile)
const restoreFile = useMutation(api.files.restoreFile)
const {toast} = useToast();
const me = useQuery(api.users.getMe)

    return (
 <>
<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
 
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action will mark file for deletion process. Files are deleted after some time.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={async () => {
        
      await  deleteFile({
            fileId:file._id,

        })
        toast({
            variant:"default",
            title: "File marked for deletion",
            description:"Your file will be deleted soon",
          })
      }}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>





        <DropdownMenu>
  <DropdownMenuTrigger><MoreVertical/></DropdownMenuTrigger>
  <DropdownMenuContent>

  <DropdownMenuItem 
    onClick={() => {
      toggleFavourite({
        fileId:file._id,

      });
    }}
    className="flex gap-1 text-yellow-600 items-center 
    cursor-pointer"> 
    {isFavorited ? (
      <div className="flex gap-1 items-center">
    <StarHalf className="w-4 h-4"/> Unfavorite </div>
    ) :( <div className="flex gap-1 items-center "> <StarIcon className="w-4 h-4 font-bold"/> Favorite </div>
    )
    
   
 } </DropdownMenuItem>


<DropdownMenuItem 
    onClick={() => {
      
      window.open(getFileUrl(file.fileId), "_blank")
      }
        }
    className="flex gap-1 text-blue-600 items-center 
    cursor-pointer"> 
    <Download/> Download
     </DropdownMenuItem>


      
      
      
   


<DropdownMenuSeparator/>
<Protect
condition={(check) => {
    return check({
        role:"org:admin",
    }) || file.userId === me?._id;
}}
fallback={<></>}
>


    <DropdownMenuItem 
    onClick={() => {
      if(file.shouldDelete){
        restoreFile({
          fileId:file._id,
        })
      }else
       { setIsConfirmOpen(true)}
        
    }}
    className ="flex gap-1 items-center cursor-pointer"
   > 
    {file.shouldDelete ?<div className="flex gap-1 text-green-600 items-center  cursor-pointer" ><Undo2Icon className="w-4 h-4"/> Restore </div> : 
    <div  className="flex gap-1 text-red-600 items-center  cursor-pointer"><Trash className="w-4 h-4"/> Delete</div> } 
  
    </DropdownMenuItem>
    </Protect>

    
    
  </DropdownMenuContent>
</DropdownMenu>
</>
    )
}

export function getFileUrl(fileId: Id<"_storage">) : string {
  return  `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}
