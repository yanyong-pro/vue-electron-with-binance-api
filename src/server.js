const express = require('express')
const app = express()
const cors = require('cors')
const CronJob = require('cron').CronJob
const Binance = require('node-binance-api')
const qs = require('qs')
const { default: axios } = require('axios')

global.symbols = []
global.isServiceRunning = false
global.lineApiToken = null

const binanceApi = new Binance()

app.use(cors())
app.use(express.json())

app.post('/update/notification', (req, res) => {
    global.symbols = req.body.symbols
    global.lineApiToken = req.body.lineApiToken
    global.isServiceRunning = !global.isServiceRunning
    res.json({
        status: 'ok'
    })
})

app.listen(3001, () => {
    console.log('Start server at port 3001.')
})

const notifyMsgToLine = async (msg) => {
    await axios.post('https://notify-api.line.me/api/notify',
        qs.stringify({
            message: msg
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${global.lineApiToken}`
            }
        }).catch((error) => console.log(error))
}

const thirtyJob = new CronJob('0/30 * * * * *', async () => {
    if (global.isServiceRunning) {
        for (let i = 0; i < global.symbols.length; i++) {
            const symbol = global.symbols[i]
            if (symbol.interval === '30s') {
                const res = await binanceApi.prices(symbol.name)
                const lastPrice = parseFloat(res[symbol.name]).toFixed(2)

                for (let j = 0; j < symbol.triggers.length; j++) {
                    const triggerInSymbol = symbol.triggers[j]
                    if (triggerInSymbol.price && triggerInSymbol.operation &&
                        triggerInSymbol.operation === 'Greater Than' &&
                        lastPrice >= triggerInSymbol.price) {
                        const msg = `The latest price of ${symbol.name} is greater than ${triggerInSymbol.price} which current price is ${lastPrice}.`
                        await notifyMsgToLine(msg)
                    } else if (triggerInSymbol.price && triggerInSymbol.operation &&
                                triggerInSymbol.operation === 'Less Than' &&
                                lastPrice <= triggerInSymbol.price) {
                        const msg = `The latest price of ${symbol.name} is less than ${triggerInSymbol.price} which current price is ${lastPrice}.`
                        await notifyMsgToLine(msg)
                    }
                }
            }
        }
    }
})

thirtyJob.start()
