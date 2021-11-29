module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                productName: 'Binance Notify',
                win: {
                    target: [
                        'nsis'
                    ],
                    icon: 'public/binance-logo.png'
                },
                nsis: {
                    oneClick: false,
                    allowToChangeInstallationDirectory: true
                }
            }
        }
    }
}
