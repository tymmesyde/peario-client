const { VUE_APP_TILE } = process.env;

module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = VUE_APP_TILE
                return args
            })
    }
}