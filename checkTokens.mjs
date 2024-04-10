import { Keypair, PublicKey, Connection, Transaction, SystemProgram, ComputeBudgetProgram } from "@solana/web3.js"
import { u16, blob, u8, u32, seq, struct } from "@solana/buffer-layout"
import { bool, u64, publicKey, u128 } from "@solana/buffer-layout-utils"
import * as BL from "@solana/buffer-layout"
import { wallet, connection } from "./config2.mjs"
import { Metaplex } from "@metaplex-foundation/js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import {ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { makeSwapOut } from "./buy.mjs"
import { getKeys } from "./keys.mjs"
const metaplex = Metaplex.make(connection)
const rayV4 = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')
let symbols = {}


const keypairs = [
[145,194,197,202,137,164,123,77,148,235,251,99,83,219,64,131,3,128,250,78,33,228,230,236,225,70,229,108,27,64,32,136,215,60,240,132,85,19,24,25,127,106,252,146,146,110,56,165,107,26,236,233,161,159,200,104,134,243,74,195,20,16,21,94],
[145,194,197,202,137,164,123,77,148,235,251,99,83,219,64,131,3,128,250,78,33,228,230,236,225,70,229,108,27,64,32,136,215,60,240,132,85,19,24,25,127,106,252,146,146,110,56,165,107,26,236,233,161,159,200,104,134,243,74,195,20,16,21,94],
[145,194,197,202,137,164,123,77,148,235,251,99,83,219,64,131,3,128,250,78,33,228,230,236,225,70,229,108,27,64,32,136,215,60,240,132,85,19,24,25,127,106,252,146,146,110,56,165,107,26,236,233,161,159,200,104,134,243,74,195,20,16,21,94],
[145,194,197,202,137,164,123,77,148,235,251,99,83,219,64,131,3,128,250,78,33,228,230,236,225,70,229,108,27,64,32,136,215,60,240,132,85,19,24,25,127,106,252,146,146,110,56,165,107,26,236,233,161,159,200,104,134,243,74,195,20,16,21,94],
[145,194,197,202,137,164,123,77,148,235,251,99,83,219,64,131,3,128,250,78,33,228,230,236,225,70,229,108,27,64,32,136,215,60,240,132,85,19,24,25,127,106,252,146,146,110,56,165,107,26,236,233,161,159,200,104,134,243,74,195,20,16,21,94],
[145,194,197,202,137,164,123,77,148,235,251,99,83,219,64,131,3,128,250,78,33,228,230,236,225,70,229,108,27,64,32,136,215,60,240,132,85,19,24,25,127,106,252,146,146,110,56,165,107,26,236,233,161,159,200,104,134,243,74,195,20,16,21,94],
[145,194,197,202,137,164,123,77,148,235,251,99,83,219,64,131,3,128,250,78,33,228,230,236,225,70,229,108,27,64,32,136,215,60,240,132,85,19,24,25,127,106,252,146,146,110,56,165,107,26,236,233,161,159,200,104,134,243,74,195,20,16,21,94],
[145,194,197,202,137,164,123,77,148,235,251,99,83,219,64,131,3,128,250,78,33,228,230,236,225,70,229,108,27,64,32,136,215,60,240,132,85,19,24,25,127,106,252,146,146,110,56,165,107,26,236,233,161,159,200,104,134,243,74,195,20,16,21,94]]

async function main() {
const pub = wallet.publicKey
const tkns = await connection.getParsedTokenAccountsByOwner(pub, {programId: TOKEN_PROGRAM_ID})
for (const tk of tkns.value) {
const mint = tk.account.data.parsed.info.mint
if (!symbols[mint]) { symbols[mint] = await getSymbol(mint) }
const amount = tk.account.data.parsed.info.tokenAmount.uiAmount
const decimals = tk.account.data.parsed.info.tokenAmount.decimals
const rawAmount = tk.account.data.parsed.info.tokenAmount.amount
const acc = tk.pubkey
const status = tk.account.data.parsed.info.state
await checkToken(mint, rawAmount, pub.toString())
}
}

async function getSymbol(mint) {
  try {
    let pda = metaplex.nfts().pdas().metadata({
      mint: new PublicKey(mint)
    });
    const mData = await Metadata.fromAccountAddress(connection, pda);
    let symbol = mData.data.symbol.toString().replaceAll('\x00', '');
    return (symbol)
  } catch {
    return ("N/A")
  }
}





async function checkToken(mint, tokenHeldAmount, pub) {
let accs = null
accs = await connection.getProgramAccounts(rayV4, {
filters: [
{ memcmp: { offset: 400, bytes: mint } },
{ dataSize: 752 }]})
if (!accs) {
accs = await connection.getProgramAccounts(rayV4, {
filters: [ { memcmp: { offset: 400-32, bytes: mint } }, { dataSize: 752 } ]
})}
if (accs) {
try {
const feeLamports = ComputeBudgetProgram.setComputeUnitPrice({microLamports:400000})
const feeUnits = ComputeBudgetProgram.setComputeUnitLimit({units:400000})
const quoteVault = new PublicKey(accs[0].account.data.subarray(400-32, 400))
const baseVault = new PublicKey(accs[0].account.data.subarray(400-64, 400-32))
const vaults = await connection.getMultipleAccountsInfo([quoteVault, baseVault])
const quoteAmount = new BL.NearUInt64().decode(new Uint8Array(vaults[0].data.subarray(64, 72)))
const baseAmount = new BL.NearUInt64().decode(new Uint8Array(vaults[1].data.subarray(64, 72)))
const pricePerToken = (quoteAmount / baseAmount)
const worthInSol = (pricePerToken * tokenHeldAmount) / Math.pow(10, 9)
const marketId = new PublicKey(accs[0].account.data.subarray(528, 528 + 32))
const mathOut = (worthInSol * Math.pow(10, 9)) * 0.90
const keys = await getKeys(marketId, wallet)
const sellTokens = await makeSwapOut(keys, tokenHeldAmount, 0)
const tx = new Transaction().add(...sellTokens).add(feeLamports).add(feeUnits)
const bh = (await connection.getLatestBlockhashAndContext("confirmed")).value
tx.recentBlockhash = bh.blockhash
tx.lastValidBlockHeight = bh.lastValidBlockHeight
tx.feePayer = wallet.publicKey
console.log(tx)
console.log(wallet)
tx.sign(wallet)
const ser = tx.serialize()
try {
const sent = connection.sendRawTransaction(ser, {skipPreflight:true, preflightCommitment:"confirmed"})
//console.log("sent:", sent)
//const conf = await connection.confirmTransaction(sent, "processed")
//console.log("confirmed:", conf)
console.log(Number(worthInSol.toFixed(9)), "SOL worth of:", symbols[mint], mint, "with:", quoteAmount, "SOL in LP on account:", pub)
}catch(E) { console.log(E)}
} catch(E) { console.log(E)}
}
}
main()