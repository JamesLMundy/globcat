import type { Readable } from 'node:stream'
import os from 'os';

export async function streamToString(stream: Readable) {
  const chunks: unknown[] = []

  for await (const chunk of stream) {
    chunks.push(chunk)
  }

  return typeof chunks[0] === 'string'
    ? chunks.join(os.EOL)
    : Buffer.concat(chunks as Uint8Array[]).toString('utf8')
}
