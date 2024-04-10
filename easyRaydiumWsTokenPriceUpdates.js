import { PublicKey, ComputeBudgetProgram } from '@solana/web3.js';
import { connection, wallet } from './config.mjs';
import { initLog, SPL_ACCOUNT_LAYOUT } from "./structs.mjs";
import * as BL from "@solana/buffer-layout"
import { EventEmitter } from 'events';
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";


const balEmit = new EventEmitter()
const baseVault = new PublicKey("4Vc6N76UBu26c3jJDKBAbvSD7zPLuQWStBk7QgVEoeoS")
const quoteVault = new PublicKey("n6CwMY77wdEftf2VF6uPvbusYoraYUci3nYBPqH1DJ5")
let baseVaultData = { balance: 0, slot: 0 }
let quoteVaultData = { balance: 0, slot: 0 }
const getUpdatedBalance = async (ata, vaultType) => {
connection.onAccountChange(ata, (info, context) => {
const balance = new BL.NearUInt64().decode(new Uint8Array(info.data.subarray(64, 72)))
const slot = context.slot
balEmit.emit('balanceUpdated', { balance, slot, vaultType })
}, { dataSlice: { offset: 64, length: 8 } }) }
getUpdatedBalance(quoteVault, 'quote')
getUpdatedBalance(baseVault, 'base')
balEmit.on('balanceUpdated', ({ balance, slot, vaultType }) => {
if (vaultType === 'quote') {
quoteVaultData = { balance, slot }
} else if (vaultType === 'base') {
baseVaultData = { balance, slot } }
if (quoteVaultData.slot === baseVaultData.slot) {
const price = quoteVaultData.balance / baseVaultData.balance
console.log(`sol per token: ${price} at slot: ${slot}`) } })
