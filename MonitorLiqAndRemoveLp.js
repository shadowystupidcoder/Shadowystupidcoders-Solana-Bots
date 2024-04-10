//@ts-nocheck
import { Connection, PublicKey } from '@solana/web3.js';
import assert from 'assert';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ENDPOINT, jsonInfo2PoolKeys, Liquidity, LiquidityPoolKeys, TokenAmount, Token } from '@raydium-io/raydium-sdk';
import { Keypair } from '@solana/web3.js';
import * as BL from "@solana/buffer-layout"
import { connection, DEFAULT_TOKEN, makeTxVersion, RAYDIUM_MAINNET_API, wallet } from './config';
import { buildAndSendTx, getWalletTokenAccount } from './util';
import { deriveKeys } from "./poolKeys"
import readline from 'readline';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', async (input) => {
  if (input === 'rug') {
    try {
      await getBalanceAndUse();
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  }
});


//autopull settings ---> note: you can turn autopull = true and still type rug in console to pull if desired for redundancy
const autopull = true       // set this to true if you want to pull profits automatically using the settings below
const initialLpSolAmount = 5 // the amount of sol you added to the lp on pool create. only used for calculating the pull amount
const pullAtThisX = 2.3 // pulls profits at 5 * 2.3x = 11.6 sol ONLY if auto is set to true, otherwise you need to type rug in terminal and hit enter
const updateFrequency = 2  // time in seconds between LP update in terminal. active in both manual and auto mode.

//priority fee config  --> note: probably wont make a diff but you can change if you want, it wont spend over 0.01 sol im pretty sure regardless what these are set at
const computeUnits = 200000 // expected total compute units to be used by the remove liq instruction
const computeMicroLamports = 200000   //amount in micro lamports to spend per compute unit --> note: im not sure but i think a microlamport is 0.0000001 sol.
// the above settings are unchanged from the original code, just moved  here for convenience

//lp and market settings
const lpDecimals = 9
const lpMint = new PublicKey("6NeaDR3MxxLQXW75ftU4RXHbohD8MUEcSy1DopKuGLqd")
const marketId = new PublicKey("9YvXMk68HTcGYavHNxBzdv961bDLMiUtV38pmtiRvPWe")
const lpToken = new Token(TOKEN_PROGRAM_ID, lpMint, lpDecimals)




async function getPoolKeys() {
let keys = await deriveKeys(marketId, 9, 9)
return(keys)
}
let poolKeys;
(async () => {
  poolKeys = await getPoolKeys();
  loop();
})();


type TestTxInputInfo = {
    removeLpTokenAmount: TokenAmount;
    targetPool: string;
    walletTokenAccounts: any[];
    wallet: Keypair;
  };

async function getLpTokenBalance(wallet): Promise<bigint> {
    const lpTokenMintAddress = poolKeys.lpMint
    const walletPublicKey = new PublicKey(wallet.publicKey);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, { mint: lpTokenMintAddress });
    let totalBalance = 0;
    for (const account of tokenAccounts.value) {
        totalBalance += account.account.data.parsed.info.tokenAmount.uiAmount;
    }
    return BigInt(Math.floor(totalBalance * Math.pow(10, lpDecimals)));
}

async function ammRemoveLiquidity(input: TestTxInputInfo) {

const removeLiquidityInstructionResponse = await Liquidity.makeRemoveLiquidityInstructionSimple({
connection,
poolKeys,
userKeys: { owner: input.wallet.publicKey, payer: input.wallet.publicKey, tokenAccounts: input.walletTokenAccounts },
computeBudgetConfig: { units: computeUnits, microLamports: computeMicroLamports },
amountIn: input.removeLpTokenAmount,
makeTxVersion });

    return { txids: await buildAndSendTx(removeLiquidityInstructionResponse.innerTransactions) };
}

async function howToUse(lpTokenBalance: bigint) {
    const removeLpTokenAmount = new TokenAmount(lpToken, lpTokenBalance.toString());
    const targetPool = poolKeys.id;
    const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey);
    return ammRemoveLiquidity({
        removeLpTokenAmount,
        targetPool,
        walletTokenAccounts: await walletTokenAccounts,
        wallet: wallet,
    });

}

async function getBalanceAndUse() {
    try {
        const balance = await getLpTokenBalance(wallet);
        const txids = await howToUse(balance);
        return(txids);
    } catch (error) {
    }
}

async function loop() {
  setInterval(async () => {
    const quoteAccountInfo = await connection.getAccountInfo(new PublicKey(poolKeys.baseVault))
    const baseAccountInfo = await connection.getAccountInfo(new PublicKey(poolKeys.quoteVault))
    const quoteTokenAmount = new BL.NearUInt64().decode(new Uint8Array(quoteAccountInfo.data.subarray(64, 72)))
    const baseTokenAmount = new BL.NearUInt64().decode(new Uint8Array(baseAccountInfo.data.subarray(64, 72)))
    const fixedQuote = quoteTokenAmount / Math.pow(10, poolKeys.quoteDecimals)
    const fixedBase = baseTokenAmount / Math.pow(10, poolKeys.baseDecimals)
    const amount = Number(fixedQuote.toFixed(2))
    if (autopull === true) {
	if (amount === initialLpSolAmount * pullAtThisX) {
	await getBalanceAndUse();
	}
	}
	console.log(amount)
  }, updateFrequency * 1000);
}
