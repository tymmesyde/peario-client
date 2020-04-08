const TITLE = "peario.xyz"

module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = TITLE
                return args
            })
    }
}