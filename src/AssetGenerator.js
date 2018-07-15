let webpack = require("webpack");

class AssetGenerator {
    constructor() {
    }

    run(sites) {
        let api = require("laravel-mix");

        api
            .options({
                processCssUrls: false
            })
            .setPublicPath('storage/assets')
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
                global.rootPath('resources/sites/' + site.slug + '/app.scss'),
                site.slug + '/css/app.css'
            ).version();

            // Compile JS files
            api.js([
                    global.rootPath('resources/sites/' + site.slug + '/app.js'),
                    global.rootPath('resources/sites/global.js')
                ],
                site.slug + '/js/app.js'
            ).version();

            if (site.hasFontsFile) {
                let fonts = require(global.rootPath('resources/sites/' + site.slug + '/fonts.json'));

                fonts.forEach(function (font) {
                    api.copyDirectory('node_modules/' + font, 'storage/assets/' + site.slug + '/fonts/');
                });
            }
        });
    }

    runWebpack(config) {
        let compiler = webpack(config);

        compiler.apply(new webpack.ProgressPlugin());

        let compilerCallback = (err, stats) => {
            if (err) return reject(err);
            console.log(stats.toString({
                chunks: false,
                colors: true,
                children: false,
                modules: false
            }));
        };

        if (global.watch) {
            compiler.watch({}, compilerCallback);
        } else {
            compiler.run(compilerCallback);
        }
    }
}

module.exports = AssetGenerator;