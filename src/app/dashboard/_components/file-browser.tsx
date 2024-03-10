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
import { api } from "../../../../convex/_generated/api";

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
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import { UplaodButton } from "@/app/dashboard/_components/upload-button";
import FileCard from "@/app/dashboard/_components/file-card";
import SearchBar from "@/app/dashboard/_components/search-bar";
import Link from "next/link";

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
}: {
  title: string;
  favortiesOnly?: boolean;
}) {
  
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const favorites = useQuery(api.files.getAllFavorites, 
   orgId ? { orgId } : "skip", 
  )

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites : favortiesOnly} : "skip"
  );

  return (
    <div>
      {files && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold ">{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UplaodButton />
          </div>

          {files.length === 0 && <Placeholder />}

          <div className="grid grid-cols-3 gap-4 ">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} favorites={favorites || []}/>;
            })}
          </div>
        </>
      )}
    </div>
  );
}
