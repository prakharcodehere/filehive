import { ConvexError, v } from "convex/values"
import {MutationCtx, QueryCtx, mutation, query} from "./_generated/server"
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Id } from "./_generated/dataModel";


export const generateUploadUrl = mutation(async (ctx) => {

    const identity =  await ctx.auth.getUserIdentity();
    console.log(identity)
    if(!identity){
        throw new ConvexError("you must be loggen in upload a file")
    }

  return await ctx.storage.generateUploadUrl();
});


async function hasAccessToOrg (ctx: QueryCtx | MutationCtx,  tokenIdentifier: string, orgId: string){
    const user =  await getUser(ctx, tokenIdentifier);
const hasAccess = user.orgIds.includes(orgId )|| user.tokenIdentifier.includes(orgId) ;

return hasAccess;
}

export const createFile = mutation({ 
        args:{
        name: v.string(),
        type:fileTypes,
        fileId:v.id("_storage"),
        orgId: v.string(),

    },
    async handler(ctx, args){
const identity =  await ctx.auth.getUserIdentity();
console.log(identity)
if(!identity){
    throw new ConvexError("you must be loggen in upload a file")
}
const user =  await getUser(ctx, identity.tokenIdentifier);







const hasAccess = user.orgIds.includes(args.orgId )|| user.tokenIdentifier.includes(args.orgId) ;




 if(!hasAccess){
throw new ConvexError("you ddon have acccess to this organization")
 }


    await ctx.db.insert("files", {
        name:args.name,
      type: args.type,
       orgId : args.orgId,
       fileId: args.fileId,
    });
    },
});

export const getFiles = query({
    args:{
        orgId: v.string(),
        query: v.optional(v.string()),
        favorites:v.optional(v.boolean()),
    },
    async handler(ctx, args){

        const identity =  await ctx.auth.getUserIdentity();
if(!identity){
  return [];
}



      let files = await ctx.db.query("files").withIndex("by_orgId", q => 
        q.eq("orgId", args.orgId)).collect();



        const query = args.query;


        if(query){
           files =
         files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()))
        }

        if(args.favorites){

            const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", 
            q => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .first();
            
           

if(!user){
    return files;
}


const favorites = await ctx.db.query("favorites").withIndex("by_userId_orgId_fileId", q =>
q.eq("userId", user._id).eq("orgId", args.orgId)
).collect();


files = files.filter(file => favorites.some((favorite) => favorite.fileId === file._id) 
)
        }
        return files;
    },
})


export const deleteFile = mutation(
    {
args:{fileId: v.id("files")},
async handler (ctx, args){
    const access = await hasAccessToFiles(ctx, args.fileId);

  
if(!access){
    throw new ConvexError("no access to file")
}

    await ctx.db.delete(args.fileId);
},

});


export const toggleFavourite = mutation({
    args:{fileId: v.id("files")},
async handler (ctx, args){
    const access = await hasAccessToFiles(ctx, args.fileId);

  
if(!access){
    throw new ConvexError("no access to file")
}


    const favorite = await ctx.db.query("favorites").withIndex("by_userId_orgId_fileId", q =>
    q.eq("userId",access.user._id).eq("orgId", access.file.orgId).eq("fileId", access.file._id)
    ).first();

    if(!favorite){
await ctx.db.insert("favorites",{
    fileId:access.file._id,
    userId:access.user._id,
    orgId:access.file.orgId,
})
    }else{
await ctx.db.delete(favorite._id);
    }
}
})


async function hasAccessToFiles (ctx: QueryCtx | MutationCtx, fileId: Id<"files">  ){
    const identity =  await ctx.auth.getUserIdentity();
    if(!identity){
        return null;
        
    }

const file = await ctx.db.get(fileId);

if(!file){
    return null;
 
}

    const hasAccess = await hasAccessToOrg(
        ctx,
        identity.tokenIdentifier,
       file.orgId,
    )

    if(!hasAccess){
      return null;
    }

const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", 
q => q.eq("tokenIdentifier", identity.tokenIdentifier))
.first();

if(!user){
    return null;
    }
return {user, file};
}