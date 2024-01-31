import express from 'express'
import { tab } from './data'

const app = express()
const port = 3000


app.get('/', (req, res) => {
    console.log('test')
  res.send('Hello World!')
})

app.get('/tasks',(req, res)=> {
    res.send(tab)
} )

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

