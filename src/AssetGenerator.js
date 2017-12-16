let webpack = require("webpack");
const resolve = require("resolve");

class AssetGenerator {
    constructor(config) {
        this.config = config;
    }

    run(sites) {
        let api = require("laravel-mix");

        api
            .options({
                processCssUrls: false
            })
            .setPublicPath(global.rootPath('storage/assets/'))
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
                site.slug + '/css/app.css'
            ).version();

            // Compile JS files
            api.js(
                [
                    global.rootPath('resources/sites/' + site.slug + '/' + 'app.js'),
                    global.rootPath('resources/sites/global.js')
                ],
                site.slug + '/js/app.js'
            ).version();
        });
    }

    runWebpack(config) {
        let ProgressPlugin = require('webpack/lib/ProgressPlugin');

        let compiler = webpack(config);

        compiler.apply(new ProgressPlugin((percentage, msg) => {
            console.log((percentage * 100) + '%', msg);
        }));

        compiler.run((err, stats) => {
            if (err) return reject(err);
            resolve(stats);
        })
    }
}

module.exports = AssetGenerator;