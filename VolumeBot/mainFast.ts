//@ts-nocheck
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { Keypair, PublicKey, ComputeBudgetProgram, Transaction, TransactionInstruction, SystemProgram, VersionedTransaction, TransactionMessage} from "@solana/web3.js";
import * as spl from "@solana/spl-token"
import { NearUInt64 } from "@solana/buffer-layout"
import * as fs from "fs"
import { wallet, wallet2, connection } from "./config";
import { getKeys } from "./keys";
import { swapBaseOut } from "./swapBaseOut";//22We1hRTu8C5svxQrmS25bcf6RoLB8nkJaewNUbeW26D
import { swapBaseIn } from "./SwapBaseIn";
import { sendBundle } from "./src/jito";
const auctioneer = new PublicKey('Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY');
const ray = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')
const openbookProgram = new PublicKey('srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX')
const marketId = new PublicKey("22We1hRTu8C5svxQrmS25bcf6RoLB8nkJaewNUbeW26D")
let initialWallet = wallet
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const payer = wallet.publicKey
let keypairs = []
let walletStore = []
let count = 0
walletStore.push(wallet)


const w1 = Keypair.fromSecretKey(Uint8Array.from([95,81,73,72,114,107,144,50,251,180,183,39,152,220,239,102,51,182,243,138,123,128,20,216,151,208,93,67,62,64,166,26,106,201,252,117,93,85,30,93,199,142,253,145,77,147,103,184,152,80,176,173,188,159,98,223,47,96,43,90,44,16,15,197]))
const w2 = Keypair.fromSecretKey(Uint8Array.from([249,105,57,141,227,67,134,54,48,236,6,14,122,113,201,10,161,242,69,109,150,121,206,30,203,234,172,185,28,24,124,4,192,82,69,115,2,178,12,74,82,242,60,158,208,250,90,53,118,182,75,142,210,87,149,208,91,9,121,207,163,135,11,173]))

async function test() {
let x = 0
while ( x < 99) {
const too = new PublicKey('srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX')
const fee = ComputeBudgetProgram.setComputeUnitPrice({microLamports: 169999})
const feeUnits = ComputeBudgetProgram.setComputeUnitLimit({units: 166000})
const tx = new Transaction().add(fee).add(feeUnits).add(SystemProgram.transfer({fromPubkey: w2.publicKey, toPubkey: w1.publicKey, lamports: 0}))
const blockhash = (await connection.getLatestBlockhashAndContext("confirmed"))
tx.recentBlockhash = blockhash.value.blockhash
tx.lastValidBlockHeight = blockhash.value.lastValidBlockHeight
tx.feePayer = w2.publicKey
tx.sign(w2)
const s = tx.serialize()
console.log(await connection.sendRawTransaction(s, {skipPreflight: true, preflightCommitment: "confirmed", minContextSlot: blockhash.context.slot, maxRetries: null}))
x++
}
}





test()






















async function wrapper() {
await makeWalletStore()
console.log(walletStore.length)
while(count < walletStore.length) {
let wallet = walletStore[count]
let wallet2 = walletStore[count + 1]
const keys = await getKeys(marketId, wallet)
const keys2 = await getKeys(marketId, wallet)
let maxAmountIn = 100000
let amountOut = 131221332324
const accounts = {
keg: spl.TOKEN_PROGRAM_ID,
id: keys.id,
baseMint: keys.baseMint,
quoteMint: keys.quoteMint,
lpMint: keys.lpMint,
programId: ray,
authority: keys.authority,
openOrders: keys.openOrders,
targetOrders: keys.targetOrders,
baseVault: keys.baseVault,
quoteVault: keys.quoteVault,
withdrawQueue: keys.withdrawQueue,
lpVault: keys.lpVault,
marketProgramId: keys.marketProgramId,
marketId: keys.marketId,
marketAuthority: keys.marketAuthority,
marketBaseVault: keys.marketBaseVault,
marketQuoteVault: keys.marketQuoteVault,
marketBids: keys.marketBids,
marketAsks: keys.marketAsks,
marketEventQueue: keys.marketEventQueue,
ownerBaseAta: keys.ownerBaseAta,
ownerQuoteAta: keys.ownerQuoteAta,
wallet: keys.keysWallet}
const accounts2 = {
keg: spl.TOKEN_PROGRAM_ID,
id: keys2.id,
baseMint: keys2.baseMint,
quoteMint: keys2.quoteMint,
lpMint: keys2.lpMint,
programId: ray,
authority: keys2.authority,
openOrders: keys2.openOrders,
targetOrders: keys2.targetOrders,
baseVault: keys2.baseVault,
quoteVault: keys2.quoteVault,
withdrawQueue: keys2.withdrawQueue,
lpVault: keys2.lpVault,
marketProgramId: keys2.marketProgramId,
marketId: keys2.marketId,
marketAuthority: keys2.marketAuthority,
marketBaseVault: keys2.marketBaseVault,
marketQuoteVault: keys2.marketQuoteVault,
marketBids: keys2.marketBids,
marketAsks: keys2.marketAsks,
marketEventQueue: keys2.marketEventQueue,
ownerBaseAta: keys2.ownerBaseAta,
ownerQuoteAta: keys2.ownerQuoteAta,
wallet: keys2.keysWallet}
//console.log(accounts.wallet)
//console.log(accounts2.wallet)

let bundle = []
async function main() {
let x = 0
while (true) {
const maxAmountIn = maxAmountIn
const amountOut = amountOut
const tx = await swapBaseOut(maxAmountIn, amountOut, accounts)
const tx2 = await swapBaseIn(amountOut, 0, accounts2)
const UNITPRICE = ComputeBudgetProgram.setComputeUnitPrice({microLamports: 229999})
const UNITLIMIT = ComputeBudgetProgram.setComputeUnitLimit({units: 229999})
const coinMint = new PublicKey(accounts.baseMint);
const pcMint = new PublicKey(accounts.quoteMint);
const uerSourceTokenAccount = keys.ownerBaseAta
const uerDestinationTokenAccount = keys.ownerQuoteAta
const uerSourceTokenAccount2 = keys2.ownerBaseAta
const uerDestinationTokenAccount2 = keys2.ownerQuoteAta
const createTokenBaseAta = spl.createAssociatedTo1kenAccountIdempotentInstruction(wallet.publicKey, uerDestinationTokenAccount, wallet.publicKey, pcMint)
const createWsolQuoteAta = spl.createAssociatedTokenAccountIdempotentInstruction(wallet.publicKey, uerSourceTokenAccount, wallet.publicKey, coinMint)
const createTokenBaseAta2 = spl.createAssociatedTokenAccountIdempotentInstruction(wallet.publicKey, uerDestinationTokenAccount2, wallet2.publicKey, pcMint)
const createWsolQuoteAta2 = spl.createAssociatedTokenAccountIdempotentInstruction(wallet.publicKey, uerSourceTokenAccount2, wallet2.publicKey, coinMint)
const closeSol = spl.createCloseAccountInstruction(keys.ownerQuoteAta, wallet.publicKey, wallet.publicKey)
const closeAta = spl.createCloseAccountInstruction(keys.ownerBaseAta, wallet.publicKey, wallet.publicKey)
const transferTokens = spl.createTransferCheckedInstruction(keys.ownerBaseAta, keys2.baseMint, keys2.ownerBaseAta, wallet.publicKey, amountOut, keys.baseDecimals)
const closeSol2 = spl.createCloseAccountInstruction(keys2.ownerQuoteAta, wallet.publicKey, wallet2.publicKey)
const closeAta2 = spl.createCloseAccountInstruction(keys2.ownerBaseAta, wallet.publicKey, wallet2.publicKey)
const submitBid = SystemProgram.transfer({fromPubkey: wallet.publicKey, toPubkey: auctioneer, lamports: 1000000 })
const ixs = []
const ixs2 = []
ixs.push(UNITPRICE)
ixs.push(UNITLIMIT)
ixs.push(createWsolQuoteAta)
ixs.push(createTokenBaseAta)
ixs.push(SystemProgram.transfer({fromPubkey: wallet.publicKey, toPubkey: keys.ownerQuoteAta, lamports: maxAmountIn }), spl.createSyncNativeInstruction(keys.ownerQuoteAta))
ixs.push(tx)
ixs2.push(UNITPRICE)
ixs2.push(UNITLIMIT)
ixs2.push(createWsolQuoteAta2)
ixs2.push(createTokenBaseAta2)
ixs2.push(transferTokens)
ixs2.push(tx2)
ixs2.push(submitBid)
const blockhash = (await connection.getLatestBlockhash()).blockhash
const msg1 = new TransactionMessage({
payerKey: payer,
recentBlockhash: blockhash,
instructions: ixs }).compileToV0Message();
const txx1 = new VersionedTransaction(msg1);
txx1.sign([wallet])
bundle.push(txx1)



const msg2 = new TransactionMessage({
payerKey: payer,
recentBlockhash: blockhash,
instructions: ixs2 }).compileToV0Message();
const txx2 = new VersionedTransaction(msg2);
txx2.sign([wallet, wallet2])
bundle.push(txx2)
//txs2.add(closeSol)
//txs2.add(closeAta)
//txs2.add(closeSol2)
//txs2.add(closeAta2)

//const sent = await connection.sendTransaction(txs, [wallet], {skipPreflight: false, preflightCommitment: "confirmed"})
//console.log(sent)
//await wait(30000)
//const sent2 = await connection.sendTransaction(txs2, [wallet, wallet2], {skipPreflight: false, preflightCommitment: "confirmed"})
//console.log(sent2)
//break
//console.log(sent, sent2, Date.now() / 1000)
//let confirmed = await connection.confirmTransaction(sent, 'processed')
//x++
if (bundle.length === 4) {
await sendBundle(bundle)
bundle = []
bundle.length = 0
}
}
}
main()
}
}

//makeWalletStore = async() => {
//while (walletStore.length >= 99) {
//let wallet = Keypair.generate()
//await addKeypairToBackup(`[${wallet.secretKey.toString()}],`)
//walletStore.push(wallet)
//}
//}
//


//addKeypairToBackup = async(keypair) => {
//const id = fs.appendFileSync('keypairs.txt', keypair + "\n")
//fs.closeSync(id) }
