"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { formatRelative } from "date-fns"
import { useQueries, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileCardActions } from "./file-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
function UserCell ({userId}:{userId: Id<"users">}){
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: userId,
    })
   

    return <div  className="flex gap-2 text-xs text-gray-700 items-center">
    <Avatar className="w-8 h-8  border-2 ">
<AvatarImage src={userProfile?.image} />
<AvatarFallback>CN</AvatarFallback>
</Avatar>

{userProfile?.name}
</div>
}

export const columns: ColumnDef<Doc<"files"> & {isFavorited: boolean}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "User",
    cell: ({ row }) => {
        return <UserCell userId={row.original.userId}/>;
      },
      },

  {
header: "Uploaded on",
cell: ({ row }) => {
    const amount = parseFloat(row.getValue("createdOn"))
   

    return <div>{formatRelative(new Date(row.original._creationTime), new Date())}</div>
  },
  },
  {
header: "Actions",
cell: ({ row }) => {
    const amount = parseFloat(row.getValue("createdOn"))
   

    return <div><FileCardActions file={row.original}  isFavorited={row.original.isFavorited}/></div>
  },
  },



]
 