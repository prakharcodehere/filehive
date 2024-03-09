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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { DeleteIcon, FileText, GanttChartIcon, ImageIcon, MoreVertical, StarIcon, Trash, WineOff } from "lucide-react"
  

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
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
  





function FileCardActions ({file} : {file: Doc<"files">}) {






const toggleFavourite = useMutation(api.files.toggleFavourite)
const [isConfirmOpen, setIsConfirmOpen] =  useState(false);
const deleteFile = useMutation(api.files.deleteFile)
const {toast} = useToast();

    return (
 <>
<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
 
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
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
            title: "Filde deleted",
            description:"Your file is deleted successfully",
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
    cursor-pointer"> <StarIcon className="w-4 h-4"/> Favourite</DropdownMenuItem>


<DropdownMenuSeparator/>

    <DropdownMenuItem 
    onClick={() => {
        setIsConfirmOpen(true)
    }}
    className="flex gap-1 text-red-600 items-center 
    cursor-pointer"> <Trash className="w-4 h-4"/> Delete</DropdownMenuItem>
    

    
    
  </DropdownMenuContent>
</DropdownMenu>
</>
    )
}

function getFileUrl(fileId: Id<"_storage">) : string {
  return  `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}



const FileCard = ({file} : {file: Doc<"files">}) => {

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
      <FileCardActions file={file}/>
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
    <CardFooter className="flex justify-center">
     
      <Button onClick={() => {
      
    window.open(getFileUrl(file.fileId), "_blank")
    }
      }>Download</Button>
    </CardFooter>
  </Card>
  </>
  )
}

export default FileCard