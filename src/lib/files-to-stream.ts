import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import Stream from 'node:stream'
import os from 'node:os'

/**
 * Takes a list of paths to files and returns a promise that resolves to a stream with the combined
 * contents. Will fail if one of the paths point to a non-file (e.g. a directory).
 */
export default async function filesToStream(
  files: string[]
): Promise<Stream.Readable> {
  let passthrough = new Stream.PassThrough()
  let queueSize = files.length
  
  
  for (const file of files) {
    const stats = await fsPromises.stat(file)
    if (stats.isFile()) {
      const stream = fs.createReadStream(file)
      passthrough = stream.pipe(passthrough, { end: false })
      let nl = new Stream.Readable()
      // here
      nl.push(os.EOL)
      nl.push(null)
      stream.once('end', () => {
        passthrough = nl.pipe(passthrough, { end: false })
        queueSize--
        if (queueSize === 0) {
          passthrough.end()
        }
      })
    } else {
      throw new Error('Not a file: ' + file)
    }
  }

  return passthrough
}
