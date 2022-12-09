module.exports = function override(config) {
    // add html loader as a webpack config rule
    config.module.rules.push({
        test: /\.html$/i,
        loader: 'html-loader',
    });

    // config.module.rules.push({
    //     test: /\.(png|jpg|gif|svg|ico|glb)$/,
    //     loader: 'file-loader',
    //     options: {
    //         outputPath: './assets/',
    //         name: '[path][name].[ext]?[hash]'
    //     }
    // })
    return config
}