import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";


// [{postId:5, userId:10}]
// [{postId:5, userId:10, value:1}]

export const createUpdootLoader = () => new DataLoader<{postId:number,userId:number},Updoot|null>(async (keys:any)=>{
    const updoots = await Updoot.findByIds(keys as any)
    const updootIdsToUpdoot: Record<string,Updoot> = {}
    updoots.forEach((updoot) => {
        updootIdsToUpdoot[`${updoot.postId} ${updoot.userId}`] = updoot
    });
    const sortedUpdoots = keys.map((key: { postId: number; userId: number; }) => updootIdsToUpdoot[`${key.postId}|${key.userId}`])
    console.log('updoots',updoots);
    
    return sortedUpdoots
})


