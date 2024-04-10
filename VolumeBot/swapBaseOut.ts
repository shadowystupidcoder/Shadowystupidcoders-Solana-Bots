//@ts-nocheck
import { PublicKey, TransactionInstruction, Transaction, ComputeBudgetProgram, SystemProgram} from '@solana/web3.js';
import { connection } from './config.mjs';
import { BN } from "bn.js"
import * as spl from "@solana/spl-token"
const programId = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')

export async function swapBaseOut(maxAmountIn, amountOut, poolKeys) {
	const args = { amountIn: new BN(maxAmountIn), minimumAmountOut: new BN(amountOut) };
	const buffer = Buffer.alloc(16);
	args.amountIn.toArrayLike(Buffer, 'le', 8).copy(buffer, 0);
	args.minimumAmountOut.toArrayLike(Buffer, 'le', 8).copy(buffer, 8);
	const prefix = Buffer.from([0x0b]);
	const instructionData = Buffer.concat([prefix, buffer]);
    let accountMetas = [
	{pubkey: poolKeys.keg,              isSigner: false, isWritable: false},    // token program
	{pubkey: poolKeys.id,               isSigner: false, isWritable: true},     // amm/pool id
	{pubkey: poolKeys.authority,        isSigner: false, isWritable: false},    // amm/pool authority
	{pubkey: poolKeys.openOrders,       isSigner: false, isWritable: true},     // amm/pool open orders
	{pubkey: poolKeys.targetOrders,     isSigner: false, isWritable: true},     // amm/pool target orders
	{pubkey: poolKeys.baseVault,        isSigner: false, isWritable: true},     // amm/pool baseVault/pool coin token account
	{pubkey: poolKeys.quoteVault,       isSigner: false, isWritable: true},     // amm/pool quoteVault/pool pc token account
	{pubkey: poolKeys.marketProgramId,  isSigner: false, isWritable: false},    // openbook program idmarketBaseVault
	{pubkey: poolKeys.marketId,         isSigner: false, isWritable: true},     // openbook market
	{pubkey: poolKeys.marketBids,       isSigner: false, isWritable: true},     // openbook bids
	{pubkey: poolKeys.marketAsks,       isSigner: false, isWritable: true},     // openbook asks
	{pubkey: poolKeys.marketEventQueue, isSigner: false, isWritable: true},     // openbook event queue
	{pubkey: poolKeys.marketBaseVault,  isSigner: false, isWritable: true},     // marketBaseVault/openbook coin vault
	{pubkey: poolKeys.marketQuoteVault, isSigner: false, isWritable: true},     // marketQuoteVault/openbook pc vault
	{pubkey: poolKeys.marketAuthority,  isSigner: false, isWritable: false},    // marketAuthority/openbook vault signer
	{pubkey: poolKeys.ownerQuoteAta,    isSigner: false, isWritable: true},     // wallet wsol account
	{pubkey: poolKeys.ownerBaseAta,     isSigner: false, isWritable: true},     // wallet token account
	{pubkey: poolKeys.wallet,          isSigner: true,  isWritable: true}]
	const swap = new TransactionInstruction({ keys: accountMetas, programId, data: instructionData })
	return(swap)
}