import express from 'express'

export const createCellsRouter = (filename: string, dir: string) => {
    const router = express.Router()
    router.get('/cells', async (req, res) => {

    })
    
    router.post('/cells', async (req, res) => {
        
    })

    return router
}

