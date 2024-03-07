import { ConvexError, v } from "convex/values"
import {MutationCtx, QueryCtx, mutation, query} from "./_generated/server"
import { getUser } from "./users";


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

return hasAccess;``
}

export const createFile = mutation({ 
        args:{
        name: v.string(),
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
       orgId : args.orgId,
       fileId: args.fileId,
    });
    },
});

export const getFiles = query({
    args:{
        orgId: v.string()
    },
    async handler(ctx, args){

        const identity =  await ctx.auth.getUserIdentity();
if(!identity){
  return [];
}
        return ctx.db.query("files").withIndex("by_orgId", q => 
        q.eq("orgId", args.orgId)).collect()
    },
})