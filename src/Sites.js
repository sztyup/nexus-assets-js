let fs = require('fs');

class Sites {
    constructor() {
        this.loadSites();
    }

    loadSites() {
        let file = fs.readFileSync(global.rootPath('/storage/app/sites.json'));
        let sites = JSON.parse(file).sites;
        this.sites = new Map();

        sites.forEach(function(site) {
            this.sites.set(site.slug, {
                slug: site.slug,
                name: site.name,
                hasFontsFile: fs.existsSync(
                    global.rootPath('resources/sites/' + site.slug + '/fonts.json')
                )
            });
        }, this);
    }

    all() {
        return this.sites;
    }

    get(site) {
        if(this.sites.has(site)) {
            return this.sites.get(site);
        }
        else {
            throw new Error("Undrecognised site: " + site);
        }
    }
}

module.exports = new Sites();
