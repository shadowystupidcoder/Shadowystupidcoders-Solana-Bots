<p align="center">
  <h3 align="center">Shadowystupidcoders Dumb Raydium Utilitys Demo Repo</h3>
  <p align="center">
    Solana/Raydium related utils
    <br/>
    <br/>
  </p>
</p>

## About The Project

Welcome to Shadowystupidcoders Dumb Raydium Utilitys Demo Repo. 

This demo repo hosts a few things I've built on Solana:

- Monitor SOL in LP of a pool updated every 2 seconds in console, press enter to remove LP instantly.
- Fetch all pool keys from a single market ID.
- Swap in and out in the same block w/ 2 wallets to generate artificial volume on the dexes with 0 risk of being sniped etc. using jito bundles. 

If you are interested I've made and optimized a ton of utilities that are not publicly open source yet:

(Nothing I build uses the Raydium SDK, it's all done with speed and efficiency and mostly just uses Solana web3.js. When possible I slice data down to as small as 8 bytes for things like RPC calls for balance changes etc)

- Build and Raydium swaps using only Solana Web3.js
- The most lightweight and fast new pool/token sniper ever made (under 100 lines of code!)
- Jito Sniper
- Snipe on Pool Init w/ 0 RPC calls before swap in (crazy fast, have multiple methods for this)
- Create market for 0.3 via code
- LP token tracking (also integrated into the snipers)
- Sniper that wont swap into pools where creator swaps into his own supply in the same block
- All sorts of scam and bad pool detection
- Swap Into Supply + Init Pool Same Tx w/ Up to 4 Wallets using Lookup Tables
- Swap Into Supply + Init Pool Same Block w/ Up to 20 or so Wallets using Lookup Tables + Jito
- Distribute tokens after swap in and distribute to thousands of addresses, w/ pushbutton clawback and sell.
- Trading volume generation bot that endlessly creates new wallets with Keypair.generate() and swaps between them for undetectable artificial volume using Lookup Tables and Jito
- Calculate token price + liquidity + market cap easily
- Hand calculation and live updates of any token on Raydium
- Multiple methods of finding Arbitrage and route calculation
- Find and close the lookup table accounts in 1 button for any public key (useful for devs, lots of rent to reclaim)
- Calculate price and potential swap out amount of every token held in a wallet, manual calc

Discord: shadowystupidcoder

**Disclaimer:** These utilities are provided as is, without warranty of any kind. Use of these utilities is at your own risk. Always make sure you understand the code you're running and the transactions you're making. All of the code in this and any other of my repos is strictly for educational use only.
