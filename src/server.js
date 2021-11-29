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
    console.log('You will see this message every 30 seconds')
    if (global.isServiceRunning) {
        const binance = new Binance()

        for (let i = 0; i < global.symbols.length; i++) {
            const symbol = global.symbols[i]
            if (symbol.interval === '30s') {
                const res = await binance.prices(symbol.name)
                const lastPrice = parseFloat(res[symbol.name]).toFixed(2)

                if (symbol.shouldSell && symbol.shouldSell <= lastPrice) {
                    const msg = `Sell - ควร Shot ${symbol.name} แล้วนะ ราคาปัจจุบันอยู่ที่ ${lastPrice}`
                    await notifyMsgToLine(msg)
                } else if (symbol.quicklyShouldSell && symbol.quicklyShouldSell <= lastPrice) {
                    const msg = `Quickly Sell - ควร Shot ${symbol.name} แล้วนะ ราคาปัจจุบันอยู่ที่ ${lastPrice}`
                    await notifyMsgToLine(msg)
                }

                if (symbol.shouldBuy && symbol.shouldBuy >= lastPrice) {
                    const msg = `Buy - ควร Long ${symbol.name} แล้วนะ ราคาปัจจุบันอยู่ที่ ${lastPrice}`
                    await notifyMsgToLine(msg)
                } else if (symbol.quicklyShouldBuy && symbol.quicklyShouldBuy >= lastPrice) {
                    const msg = `Quickly Buy - ควร Long ${symbol.name} แล้วนะ ราคาปัจจุบันอยู่ที่ ${lastPrice}`
                    await notifyMsgToLine(msg)
                }
            }
        }
    }
})

thirtyJob.start()
