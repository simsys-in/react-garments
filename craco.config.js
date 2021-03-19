const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [{
        plugin: CracoLessPlugin,
        options: {
            lessLoaderOptions: {
                lessOptions: {
                    javascriptEnabled: true,
                },
            },
            // cssLoaderOptions: {
            //     modules: { localIdentName: "[local]_[hash:base64:5]" }
            //   }
        },
        modules : true
    }, ],
};