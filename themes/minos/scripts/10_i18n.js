const _ = require('lodash');
const util = require('hexo-util');
const postGenerator = require('hexo/lib/plugins/generator/post');
const indexGenerator = require('hexo-generator-index/lib/generator');
const archiveGenerator = require('hexo-generator-archive/lib/generator');
const categoryGenerator = require('hexo-generator-category/lib/generator');
const tagGenerator = require('hexo-generator-tag/lib/generator');

const Pattern = util.Pattern;

function pathJoin(...paths) {
    return paths.join('/');
}

function withLanguage(func) {
    return function(locals) {
        let languages = this.config.language;
        if (!Array.isArray(languages)) {
            languages = [languages];
        }
        return func.call(this, languages, locals);
    }
}

function getPostLanguage(post) {
    const languages = hexo.theme.i18n.list();
    let lang = post.lang || post.language;
    if (!lang) {
        const pattern = new Pattern(`${hexo.config.i18n_dir}/*path`);
        const data = pattern.match(post.path);

        if (data && data.lang && ~languages.indexOf(data.lang)) {
            lang = data.lang;
        }
    }
    return lang;
}

function postFilter(language, isDefaultLanguage) {
    return function (post) {
        let lang = getPostLanguage(post);
        return lang === language || (isDefaultLanguage && !lang);
    }
}

function url_for(path) {
    return hexo.extend.helper.get('url_for').call(hexo, path);
}

/**
 * Modify previous and next post link
 */
hexo.extend.generator.register('post', function(locals) {
    return postGenerator(locals).map(route => {
        let post = route.data;
        if (post.next) {
            let next = post.next;
            while (next && post.lang !== next.lang) {
                next = next.next;
            }
            post.next = next;
            if (next) {
                next.prev = post;
            }
        }
        if (post.prev) {
            let prev = post.prev;
            while (prev && post.lang !== prev.lang) {
                prev = prev.prev;
            }
            post.prev = prev;
            if (prev) {
                prev.next = post;
            }
        }
        return route;
    });
});

/**
 * Multi-language index generator.
 *
 * ATTENTION: This will override the default index generator!
 */
hexo.extend.generator.register('index', withLanguage(function(languages, locals) {
    return _.flatten(languages.map((language, i) => {
        // Filter posts by language considering. Posts without a language is considered of the default language.
        const posts = locals.posts.filter(postFilter(language, i === 0));
        if (posts.length === 0) {
            return null;
        }
        const routes = indexGenerator.call(this, Object.assign({}, locals, {
            posts: posts
        }));
        if (i === 0) {
            return routes;
        }
        return routes.map(route => {
            const data = Object.assign({}, route.data, {
                base: pathJoin(language, route.data.base),
                current_url: pathJoin(language, route.data.current_url)
            });
            return Object.assign({}, route, {
                path: pathJoin(language, route.path),
                data: data
            });
        });
    }).filter(post => post !== null));
}));

/**
 * Multi-language archive generator.
 *
 * ATTENTION: This will override the default archive generator!
 */
hexo.extend.generator.register('archive', withLanguage(function(languages, locals) {
    return _.flatten(languages.map((language, i) => {
        // Filter posts by language considering. Posts without a language is considered of the default language.
        const posts = locals.posts.filter(postFilter(language, i === 0));
        if (posts.length === 0) {
            return null;
        }
        const routes = archiveGenerator.call(this, Object.assign({}, locals, {
            posts: posts
        }));
        if (i === 0) {
            return routes;
        }
        return routes.map(route => {
            const data = Object.assign({}, route.data, {
                base: pathJoin(language, route.data.base),
                current_url: pathJoin(language, route.data.current_url)
            });
            return Object.assign({}, route, {
                path: pathJoin(language, route.path),
                data: data
            });
        });
    }).filter(post => post !== null));
}));

/**
 * Multi-language category generator.
 *
 * ATTENTION: This will override the default category generator!
 */
hexo.extend.generator.register('category', withLanguage(function(languages, locals) {
    return _.flatten(languages.map((language, i) => {
        const categories = locals.categories.map(category => {
            // Filter posts by language considering. Posts without a language is considered of the default language.
            const posts = category.posts.filter(postFilter(language, i === 0));
            if (posts.length === 0) {
                return null;
            }
            return Object.assign({}, category, {
                posts: posts
            });
        }).filter(category => category !== null);
        if (categories.length === 0) {
            return null;
        }

        const routes = categoryGenerator.call(this, Object.assign({}, locals, {
            categories: categories
        }));
        if (i === 0) {
            return routes;
        }
        return routes.map(route => {
            const data = Object.assign({}, route.data, {
                base: pathJoin(language, route.data.base),
                current_url: pathJoin(language, route.data.current_url)
            });
            return Object.assign({}, route, {
                path: pathJoin(language, route.path),
                data: data
            });
        });
    }).filter(post => post !== null));
}));

/**
 * Multi-language tag generator.
 *
 * ATTENTION: This will override the default tag generator!
 */
hexo.extend.generator.register('tag', withLanguage(function(languages, locals) {
    return _.flatten(languages.map((language, i) => {
        const tags = locals.tags.map(tag => {
            // Filter posts by language considering. Posts without a language is considered of the default language.
            const posts = tag.posts.filter(postFilter(language, i === 0));
            if (posts.length === 0) {
                return null;
            }
            return Object.assign({}, tag, {
                posts: posts
            });
        }).filter(category => category !== null);
        if (tags.length === 0) {
            return null;
        }

        const routes = tagGenerator.call(this, Object.assign({}, locals, {
            tags: tags
        }));
        if (i === 0) {
            return routes;
        }

        return routes.map(route => {
            const data = Object.assign({}, route.data, {
                base: pathJoin(language, route.data.base),
                current_url: pathJoin(language, route.data.current_url)
            });
            return Object.assign({}, route, {
                path: pathJoin(language, route.path),
                data: data
            });
        });
    }).filter(post => post !== null));
}));

/**
 * Category list page generator
 */
hexo.extend.generator.register('categories', withLanguage(function(languages, locals) {
    return languages.map((language, i) => {
        const categories = locals.categories.map(category => {
            // Filter posts by language considering. Posts without a language is considered of the default language.
            const posts = category.posts.filter(postFilter(language, i === 0));
            if (posts.length === 0) {
                return null;
            }
            return Object.assign({}, category, {
                posts: posts,
                path: i === 0 ? category.path : pathJoin(language, category.path)
            });
        }).filter(category => category !== null);
        return {
            path: i !== 0 ? pathJoin(language, 'categories/') : 'categories/',
            layout: ['categories'],
            data: Object.assign({}, locals, {
                _categories: categories
            })
        };
    })
}));

/**
 * Tag list page generator
 */
hexo.extend.generator.register('tags', withLanguage(function(languages, locals) {
    return languages.map((language, i) => {
        const tags = locals.tags.map(tag => {
            // Filter posts by language considering. Posts without a language is considered of the default language.
            const posts = tag.posts.filter(postFilter(language, i === 0));
            if (posts.length === 0) {
                return null;
            }
            return Object.assign({}, tag, {
                posts: posts,
                path: i === 0 ? tag.path : pathJoin(language, tag.path)
            });
        }).filter(category => category !== null);
        return {
            path: i !== 0 ? pathJoin(language, 'tags/') : 'tags/',
            layout: ['tags'],
            data: Object.assign({}, locals, {
                _tags: tags
            })
        };
    })
}));

/**
 * Multi-language insight search content.json generator.
 *
 * ATTENTION: This will override the default insight search content.json generator!
 */
hexo.extend.generator.register('insight', withLanguage(function(languages, locals) {
    function minify(str) {
        return util.stripHTML(str).trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
    }
    function postMapper(post) {
        return {
            title: post.title,
            text: minify(post.content),
            link: url_for(post.path)
        }
    }
    function tagMapper(language, defaultLanguage) {
        return function (tag) {
            return {
                name: tag.name,
                slug: tag.slug,
                link: url_for(defaultLanguage ? tag.path : pathJoin(language, tag.path))
            }
        }
    }
    return languages.map((language, i) => {
        const site = {
            pages: locals.pages.filter(postFilter(language, i === 0)).map(postMapper),
            posts: locals.posts.filter(postFilter(language, i === 0)).map(postMapper),
            tags: locals.tags.filter(tag => tag.posts.some(postFilter(language, i === 0)))
                .map(tagMapper(language, i === 0)),
            categories: locals.categories.filter(category => category.posts.some(postFilter(language, i === 0)))
                .map(tagMapper(language, i === 0)),
        };
        return {
            path: i === 0 ? 'content.json' : 'content.' + language + '.json',
            data: JSON.stringify(site)
        };
    });
}));

/**
 * Append language directory to the post tags and categories
 */
hexo.extend.filter.register('before_post_render', function(data) {
    data.lang = getPostLanguage(data);
    data._categories = data.categories ? data.categories.map(category => {
        return {
            name: category.name,
            path: data.lang ? pathJoin(data.lang, category.path) : category.path
        };
    }) : [];
    data._tags = data.tags ? data.tags.map(tag => {
        return {
            name: tag.name,
            path: data.lang ? pathJoin(data.lang, tag.path) : tag.path
        };
    }) : [];
    return data;
});

hexo.extend.helper.register('i18n_path', function (language) {
    const path = this.page.path;
    const lang = getPostLanguage(this.page);
    const base = path.startsWith(lang) ? path.slice(lang.length + 1) : path;
    return (language ? '/' + language : '') + '/' + base.replace(/index.html/g, "");
});