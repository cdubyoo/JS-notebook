import express from 'express'

export const serve = (port: number, filename: string, dir: string) => {
  const app = express()
  // create own promise to either resolve or reject
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error',reject)
  })
};
