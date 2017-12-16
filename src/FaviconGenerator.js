const favicons = require('favicons');
const fs = require('fs');

class FaviconGenerator {
    constructor(config) {
        this.sites = require('./Sites');
        this.config = require('./favicon.conf.json');
    }

    run(sites) {
        console.info('Generating favicons');

        let callback = function (error, response) {
            if (error) {
                console.error(error.status);
                console.error(error.name);
                console.error(error.message);
                return;
            }

            let writer = function(file) {
                let errorHandler = function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log('written: ' + global.rootPath('storage/assets/' + this.slug + '/img/favicons/' + file.name));
                };

                fs.writeFile(global.rootPath('storage/assets/' + this.slug + '/img/favicons/' + file.name), file.contents, errorHandler.bind(this));
            };

            response.images.forEach(writer.bind(this));
            response.files.forEach(writer.bind(this));
        };

        let site = this.sites.get('golyabal');
        // sites.forEach(function(site) {
            // Generate favicons
            console.info("Generating for: " + site.slug);

            let configuration = this.config;

            // Picture to generate favicon from
            let source = global.rootPath('resources/sites/' + site.slug + '/img/favicon.png');
            // Destination folder
            let destination = global.rootPath('storage/assets/' + site.slug + '/img/favicons/');
            configuration.appName = site.name;

            favicons(source, configuration, callback.bind(site));
        // }, this);
    }
}

module.exports = FaviconGenerator;