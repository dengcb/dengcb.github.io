const fs = require('fs');
const path = require('path');
const logger = require('hexo-log')();

logger.info(`=======================================
███╗   ███╗ ██╗ ███╗   ██╗  ██████╗  ███████╗
████╗ ████║ ██║ ████╗  ██║ ██╔═══██╗ ██╔════╝
██╔████╔██║ ██║ ██╔██╗ ██║ ██║   ██║ ███████╗
██║╚██╔╝██║ ██║ ██║╚██╗██║ ██║   ██║ ╚════██║
██║ ╚═╝ ██║ ██║ ██║ ╚████║ ╚██████╔╝ ███████║
╚═╝     ╚═╝ ╚═╝ ╚═╝  ╚═══╝  ╚═════╝  ╚══════╝
=============================================`);

function checkDependency(name) {
    try {
        require.resolve(name);
        return true;
    } catch(e) {
        logger.error(`Package ${name} is not installed.`)
    }
    return false;
}

logger.info('Checking dependencies');
const missingDeps = [
    'moment',
    'lodash',
    'cheerio',
    'js-yaml',
    'highlight.js',
    'hexo-util',
    'hexo-generator-archive',
    'hexo-generator-category',
    'hexo-generator-index',
    'hexo-generator-tag',
    'hexo-renderer-ejs',
    'hexo-renderer-marked',
    'hexo-renderer-sass',
].map(checkDependency).some(installed => !installed);
if (missingDeps) {
    logger.error('Please install the missing dependencies in the root directory of your Hexo site.');
    process.exit(-1);
}

const themeRoot = path.join(__dirname, '..');
const mainConfigPath = path.join(themeRoot, '_config.yml');

if (!fs.existsSync(mainConfigPath)) {
    logger.warn(`${mainConfigPath} is not found. Please create one from the template _config.yml.example.`)
}