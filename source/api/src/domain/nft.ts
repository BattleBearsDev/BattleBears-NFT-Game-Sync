import { indexerClient } from "../global";

export async function getNftInfo(id: number) : Promise<Record<string, any>> {
    return await indexerClient.lookupAssetByID(id).do()
}
