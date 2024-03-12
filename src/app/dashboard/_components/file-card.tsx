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
import { FileCardActions, getFileUrl } from "./file-actions"
  


const FileCard = ({file} : {file: Doc<"files"> & {isFavorited: boolean}}) => {



  const userProfile = useQuery(api.users.getUserProfile, {
    userId:file.userId,
    })








  const typeIcons = {
    "image": <  ImageIcon/>,
    "pdf": <FileText/>,
    "csv":<GanttChartIcon/>,
  } as Record<Doc<"files">["type"], ReactNode>


 
  

  return (
    <>
    <Card>
    <CardHeader className="relative">
      <CardTitle className="flex gap-2 ">
      <div className="flex justify-center text-center">{typeIcons[file.type]}</div>
        {file.name}
      </CardTitle>
      <div className="absolute top-2 right-1">
      <FileCardActions file={file} isFavorited={file.isFavorited}/>
      </div>
     
      {/* <CardDescription>{file}</CardDescription> */}
    </CardHeader>
    <CardContent className="h-[200px] flex justify-center items-center" >
    {
    file.type === "image" && (<Image alt={file.name} width="200" height="100" src={getFileUrl(file.fileId)}/>)
    }
    {file.type === "csv" &&  <GanttChartIcon className="w-20 h-20 "/>}
    {file.type === "pdf" &&  <FileText className="w-20 h-20 "/>}
    </CardContent>
 

   
    <CardFooter className="flex justify-between">
    
    
<div  className="flex gap-2 text-xs text-gray-700">
      <Avatar className="w-8 h-8  border-2 ">
  <AvatarImage src={userProfile?.image} />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

{userProfile?.name}
</div>
     <div className="text-xs text-gray-700">
 Uploaded on {" "}{formatRelative(new Date(file._creationTime), new Date())}
 </div>
    </CardFooter>
   
  </Card>
  </>
  )
}

export default FileCard