import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path'
import { createCellsRouter } from './routes/cells';

export const serve = (
  port: number, 
  filename: string, 
  dir: string, 
  useProxy: boolean
  ) => {
  const app = express()

  app.use(createCellsRouter(filename, dir))

  if (useProxy) {
    app.use(createProxyMiddleware({
      target: 'https://localhost:3000',
      ws: true,
      logLevel: 'silent'
    }))
  } else {
    const packagePath = require.resolve('@jsnote-j/local-client/build/index.html')
    app.use(express.static(path.dirname(packagePath)))
  }
  
  // create own promise to either resolve or reject
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error',reject)
  })
};
