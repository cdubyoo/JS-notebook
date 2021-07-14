import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware';

export const serve = (port: number, filename: string, dir: string) => {
  const app = express()

  app.use(express.static('../../local-client/build'))

  // app.use(createProxyMiddleware({
  //   target: 'https://localhost:3000',
  //   ws: true,
  //   logLevel: 'silent'
  // }))
  
  // create own promise to either resolve or reject
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error',reject)
  })
};
