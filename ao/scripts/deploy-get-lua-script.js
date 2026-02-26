import ARx from '@permaweb/arx'
import {config} from 'dotenv'
config()

const wallet = JSON.parse(process.env.WALLET_JSON)

const arx = await ARx.init({ token: 'arweave', key: JSON.parse(wallet) })

//const arx = new ARx({ token: 'arweave', key: JSON.parse(wallet) })

const balance = await arx.getPrice(1024 * 1024) //arx.getBalance("HJuxnSbwMURxYQh6xsXE_3OYWgYGYrUF74muIJJLdNA")

console.log(balance)