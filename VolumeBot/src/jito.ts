//@ts-nocheck
import { Keypair } from '@solana/web3.js'
import { config } from './config'
import { SearcherClient, searcherClient as jitoSearcherClient } from 'jito-ts/dist/sdk/block-engine/searcher.js'
import { Bundle as JitoBundle } from 'jito-ts/dist/sdk/block-engine/types.js';


const BLOCK_ENGINE_URLS = config.get('block_engine_urls')
const AUTH_KEYPAIR_PATH = config.get('auth_keypair_path')
const auth = Keypair.fromSecretKey(Uint8Array.from([ 170, 102, 199, 216, 226, 201, 23, 43, 26, 120, 207, 73, 110, 164, 116, 178, 255, 140, 255, 218, 189, 56, 60, 156, 217, 54, 187, 126, 163, 9, 162, 105, 7, 82, 19, 78, 31, 45, 211, 21, 169, 244, 1, 88, 110, 145, 211, 13, 133, 99, 16, 32, 105, 253, 55, 213, 94, 124, 237, 195, 235, 255, 7, 72 ]))
const client = jitoSearcherClient(BLOCK_ENGINE_URLS[0], auth, { 'grpc.keepalive_timeout_ms': 4000 })

let ids = new Map()
export async function sendBundle(bundle) {
  try {
    const bundleId = await client.sendBundle(new JitoBundle(bundle, bundle.length))
    console.log(`${bundleId} sent.`)
    ids.set(bundleId, bundleId)
    client.onBundleResult((bundleResult) => {
      if (ids.has(bundleResult.bundleId)) {
        console.log('result:', bundleResult)
      }
    })
  } catch (error) {
    console.error('error:', error)
  }
}