let webpack = require("webpack");
const resolve = require("resolve");

class AssetGenerator {
    constructor() {
    }

    run(sites) {
        let api = require("laravel-mix");

        api
            .options({
                processCssUrls: false
            })
            .setPublicPath(global.rootPath('.'))
            .setResourceRoot(global.rootPath('storage/assets'))
            .disableNotifications()
        ;

        this.applySites(api, sites);

        let WebpackConfig = require('laravel-mix/src/builder/WebpackConfig');

        this.runWebpack(new WebpackConfig().build());
    }

    applySites(api, sites) {
        sites.forEach(function(site) {
            // Generate css files from sass
            api.sass(
                global.rootPath('resources/sites/' + site.slug + '/' + 'app.scss'),
                'storage/assets/' + site.slug + '/css/app.css'
            ).version();

            // Compile JS files
            api.js(
                [
                    global.rootPath('resources/sites/' + site.slug + '/' + 'app.js'),
                    global.rootPath('resources/sites/global.js')
                ],
                'storage/assets/' + site.slug + '/js/app.js'
            ).version();
        });
    }

    runWebpack(config) {
        let compiler = webpack(config);

        compiler.apply(new webpack.ProgressPlugin());

        compiler.run((err, stats) => {
            if (err) return reject(err);
            console.log(stats.toString({
                chunks: false,
                colors: true,
                children: false,
                modules: false
            }));
        })
    }
}

module.exports = AssetGenerator;