import algosdk from "algosdk";
// init algod
const algodToken : string = process.env.ALGOD_TOKEN || 'NONE';
export const algodClient = new algosdk.Algodv2(algodToken, process.env.ALGOD_SERVER, process.env.ALGOD_PORT)

const indexerToken: string = process.env.INDEXER_TOKEN || 'NONE'
export const indexerClient = new algosdk.Indexer(indexerToken, process.env.INDEXER_SERVER, process.env.INDEXER_PORT)