"use client";



import {
 
  useOrganization,
  
  useUser
} from "@clerk/nextjs";
import {  useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../../convex/_generated/api";

import { z } from "zod";


import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { UplaodButton } from "@/app/dashboard/_components/upload-button";
import FileCard from "@/app/dashboard/_components/file-card";
import SearchBar from "@/app/dashboard/_components/search-bar";

import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid3x3Icon, Loader2, Rows2Icon, Table2Icon, TableIcon } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";



function Placeholder() {
  return (
    <div className="flex flex-col gap-4 w-full items-center mt-12 ">
      <Image alt="folder image" src="/empty.svg" width="300" height="300" />
      <div className="text-2xl ">
        You have no files, go ahead and upload one now
      </div>
      <UplaodButton />
    </div>
  );
}

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

export default function FileBrowser({
  title,
  favortiesOnly,
  deletedOnly,
}: {
  title: string;
  favortiesOnly?: boolean;
  deletedOnly?:boolean;
}) {
  
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all"> ("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const favorites = useQuery(api.files.getAllFavorites, 
   orgId ? { orgId } : "skip", 
  )

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId,type:type === "all" ? undefined : type, query, favorites : favortiesOnly, deletedOnly :deletedOnly} : "skip"
  );

  const modifiedFiles =
  files?.map((file) => ({
    ...file,
    isFavorited: (favorites ?? []).some(
      (favorite) => favorite.fileId === file._id
    ),
  })) ?? [];



  const isLoading = files === undefined;



  return (
    <div>
      
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold ">{title}</h1>
            
            <SearchBar query={query} setQuery={setQuery} />
            <UplaodButton />
          </div>


          <Tabs defaultValue="Grid" >
          
          
          <div className="flex justify-between items-center">
  <TabsList className="mb-8" >
   
    <TabsTrigger value="grid" className="flex gap-2 items-center"><Grid3x3Icon/>Grid</TabsTrigger>
    <TabsTrigger value="table" className="flex gap-2 items-center"><Rows2Icon/>Table</TabsTrigger>
  </TabsList>

  <div className="flex gap-2 items-center">
    <Label htmlFor="type-select">Type Filter</Label>
  <Select  value={type} onValueChange={(newType) => setType(newType as any)}>
  <SelectTrigger className="w-[180px]" id="type-select">
    <SelectValue  />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="image">Image</SelectItem>
    <SelectItem value="csv">CSV</SelectItem>
    <SelectItem value="pdf">PDF</SelectItem>
  </SelectContent>
</Select>

  </div>


  </div>
  {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading your files...</div>
          </div>
        )}
  
  
  
  
  <TabsContent value="grid">
  <div className="grid grid-cols-3 gap-4 ">
            {modifiedFiles?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
  </TabsContent>
  <TabsContent value="table"><DataTable columns={columns} data={modifiedFiles} /></TabsContent>
</Tabs>



          {files?.length === 0 && <Placeholder />}
          

          
     
    </div>
  );
}
