//@ts-nocheck
import * as spl from "@solana/spl-token"
import { Market } from '@openbook-dex/openbook'
import { connection } from './config';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js'
import { u16, blob, u8, u32, seq, struct } from "@solana/buffer-layout"
import { bool, u64, publicKey, u128 } from "@solana/buffer-layout-utils"
import { NearUInt64 } from "@solana/buffer-layout"
import { createAssociatedTokenAccountIdempotent, getAssociatedTokenAddress, createSyncNativeInstruction, createAssociatedTokenAccountIdempotentInstruction} from "@solana/spl-token"
import { PublicKey, TransactionInstruction, Transaction, ComputeBudgetProgram, SystemProgram} from '@solana/web3.js';
import { BN } from "bn.js"
import * as spl from "@solana/spl-token"
const ray = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')
const openbookProgram = new PublicKey('srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX')
export async function getKeys(marketId, wallet) {
  const marketInfo = await getMarketInfo(marketId);
  const marketFields = await getDecodedData(marketInfo);
  const baseMint = marketFields.baseMint;
  const ownerBaseAta = await getOwnerAta(baseMint, wallet.publicKey);
  const quoteMint = marketFields.quoteMint;
  const ownerQuoteAta = await getOwnerAta(quoteMint, wallet.publicKey);
  const authority = PublicKey.findProgramAddressSync([Buffer.from([97, 109, 109, 32, 97, 117, 116, 104, 111, 114, 105, 116, 121])], ray)[0];
  const marketAuthority = getVaultSigner(marketId, marketFields);
const seeds = [
  Buffer.from('amm_associated_seed', 'utf-8'),
  Buffer.from('coin_vault_associated_seed', 'utf-8'),
  Buffer.from('pc_vault_associated_seed', 'utf-8'),
  Buffer.from('lp_mint_associated_seed', 'utf-8'),
  Buffer.from('temp_lp_token_associated_seed', 'utf-8'),
  Buffer.from('target_associated_seed', 'utf-8'),
  Buffer.from('withdraw_associated_seed', 'utf-8'),
  Buffer.from('open_order_associated_seed', 'utf-8'),
  Buffer.from('pc_vault_associated_seed', 'utf-8')
];
const promises = seeds.map(seed => PublicKey.findProgramAddress([ray.toBuffer(), marketId.toBuffer(), seed], ray));
const [id, baseVault, coinVault, lpMint, lpVault, targetOrders, withdrawQueue, openOrders, quoteVault] = await Promise.all(promises);
const lpInfo = await connection.getAccountInfo(id[0])
const baseDecimals = new NearUInt64().decode(Uint8Array.from(lpInfo.data.subarray(32, 40)))
const quoteDecimals = new NearUInt64().decode(Uint8Array.from(lpInfo.data.subarray(40, 48)))
  const ownerLpTokenAta = await getOwnerAta(lpMint[0], wallet.publicKey);
  const poolKeys = {
	keg: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    version: 4,
    marketVersion: 3,
    programId: ray,
    baseMint: baseMint,
    quoteMint: quoteMint,
    ownerBaseAta: ownerBaseAta,
    ownerQuoteAta: ownerQuoteAta,
    baseDecimals: baseDecimals,
	lpTokenAccount: ownerLpTokenAta,
    quoteDecimals: quoteDecimals,
	tokenProgram: spl.TOKEN_PROGRAM_ID,
	lpDecimals: baseDecimals,
    authority: authority,
    marketAuthority: marketAuthority,
    marketProgramId: openbookProgram,
    marketId: marketId,
    marketBids: marketFields.bids,
    marketAsks: marketFields.asks,
    marketQuoteVault: marketFields.quoteVault,
    marketBaseVault: marketFields.baseVault,
    marketEventQueue: marketFields.eventQueue,
    id: id[0],
    baseVault: baseVault[0],
    coinVault: coinVault[0],
    lpMint: lpMint[0],
    lpVault: lpVault[0],
    targetOrders: targetOrders[0],
    withdrawQueue: withdrawQueue[0],
    openOrders: openOrders[0],
	quoteVault: quoteVault[0],
	lookupTableAccount: new PublicKey("11111111111111111111111111111111"),
	keysWallet: wallet.publicKey
  };
  return poolKeys;
}
async function getMarketInfo(marketId) {
    let marketInfo = await connection.getAccountInfo(marketId);
return(marketInfo)
}
async function getDecodedData(marketInfo) {
const deco = await Market.getLayout(openbookProgram).decode(marketInfo.data);
  return(deco)
}
async function getOwnerAta(mint, owner) {
const foundAta = PublicKey.findProgramAddressSync([owner.toBuffer(), spl.TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], spl.ASSOCIATED_TOKEN_PROGRAM_ID)[0]
return(foundAta) }
function getVaultSigner(marketId, marketFields) {
  const seeds = [marketId.toBuffer()];
  const seedsWithNonce = seeds.concat(Buffer.from([Number(marketFields.vaultSignerNonce.toString())]), Buffer.alloc(7));
  return PublicKey.createProgramAddressSync(seedsWithNonce, openbookProgram);
}