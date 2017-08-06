(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Cookies.js - 1.2.3
 * https://github.com/ScottHamper/Cookies
 *
 * This is free and unencumbered software released into the public domain.
 */
(function (global, undefined) {
    'use strict';

    var factory = function (window) {
        if (typeof window.document !== 'object') {
            throw new Error('Cookies.js requires a `window` with a `document` object');
        }

        var Cookies = function (key, value, options) {
            return arguments.length === 1 ?
                Cookies.get(key) : Cookies.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        Cookies._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
        
        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

        Cookies.defaults = {
            path: '/',
            secure: false
        };

        Cookies.get = function (key) {
            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
                Cookies._renewCache();
            }
            
            var value = Cookies._cache[Cookies._cacheKeyPrefix + key];

            return value === undefined ? undefined : decodeURIComponent(value);
        };

        Cookies.set = function (key, value, options) {
            options = Cookies._getExtendedOptions(options);
            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

            return Cookies;
        };

        Cookies.expire = function (key, options) {
            return Cookies.set(key, undefined, options);
        };

        Cookies._getExtendedOptions = function (options) {
            return {
                path: options && options.path || Cookies.defaults.path,
                domain: options && options.domain || Cookies.defaults.domain,
                expires: options && options.expires || Cookies.defaults.expires,
                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
            };
        };

        Cookies._isValidDate = function (date) {
            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
        };

        Cookies._getExpiresDate = function (expires, now) {
            now = now || new Date();

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (expires && !Cookies._isValidDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        };

        Cookies._generateCookieString = function (key, value, options) {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var cookieString = key + '=' + value;
            cookieString += options.path ? ';path=' + options.path : '';
            cookieString += options.domain ? ';domain=' + options.domain : '';
            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            cookieString += options.secure ? ';secure' : '';

            return cookieString;
        };

        Cookies._getCacheFromString = function (documentCookie) {
            var cookieCache = {};
            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < cookiesArray.length; i++) {
                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        };

        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
            var separatorIndex = cookieString.indexOf('=');

            // IE omits the "=" when the cookie value is an empty string
            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

            var key = cookieString.substr(0, separatorIndex);
            var decodedKey;
            try {
                decodedKey = decodeURIComponent(key);
            } catch (e) {
                if (console && typeof console.error === 'function') {
                    console.error('Could not decode cookie with key "' + key + '"', e);
                }
            }
            
            return {
                key: decodedKey,
                value: cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
            };
        };

        Cookies._renewCache = function () {
            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
            Cookies._cachedDocumentCookie = Cookies._document.cookie;
        };

        Cookies._areEnabled = function () {
            var testKey = 'cookies.js';
            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
            Cookies.expire(testKey);
            return areEnabled;
        };

        Cookies.enabled = Cookies._areEnabled();

        return Cookies;
    };
    var cookiesExport = (global && typeof global.document === 'object') ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return cookiesExport; });
    // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module === 'object' && typeof module.exports === 'object') {
            exports = module.exports = cookiesExport;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Cookies = cookiesExport;
    } else {
        global.Cookies = cookiesExport;
    }
})(typeof window === 'undefined' ? this : window);
},{}],2:[function(require,module,exports){
/*! Browser bundle of nunjucks 3.0.1  */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["nunjucks"] = factory();
	else
		root["nunjucks"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var lib = __webpack_require__(1);
	var env = __webpack_require__(2);
	var Loader = __webpack_require__(16);
	var loaders = __webpack_require__(15);
	var precompile = __webpack_require__(3);

	module.exports = {};
	module.exports.Environment = env.Environment;
	module.exports.Template = env.Template;

	module.exports.Loader = Loader;
	module.exports.FileSystemLoader = loaders.FileSystemLoader;
	module.exports.PrecompiledLoader = loaders.PrecompiledLoader;
	module.exports.WebLoader = loaders.WebLoader;

	module.exports.compiler = __webpack_require__(7);
	module.exports.parser = __webpack_require__(8);
	module.exports.lexer = __webpack_require__(9);
	module.exports.runtime = __webpack_require__(13);
	module.exports.lib = lib;
	module.exports.nodes = __webpack_require__(10);

	module.exports.installJinjaCompat = __webpack_require__(22);

	// A single instance of an environment, since this is so commonly used

	var e;
	module.exports.configure = function(templatesPath, opts) {
	    opts = opts || {};
	    if(lib.isObject(templatesPath)) {
	        opts = templatesPath;
	        templatesPath = null;
	    }

	    var TemplateLoader;
	    if(loaders.FileSystemLoader) {
	        TemplateLoader = new loaders.FileSystemLoader(templatesPath, {
	            watch: opts.watch,
	            noCache: opts.noCache
	        });
	    }
	    else if(loaders.WebLoader) {
	        TemplateLoader = new loaders.WebLoader(templatesPath, {
	            useCache: opts.web && opts.web.useCache,
	            async: opts.web && opts.web.async
	        });
	    }

	    e = new env.Environment(TemplateLoader, opts);

	    if(opts && opts.express) {
	        e.express(opts.express);
	    }

	    return e;
	};

	module.exports.compile = function(src, env, path, eagerCompile) {
	    if(!e) {
	        module.exports.configure();
	    }
	    return new module.exports.Template(src, env, path, eagerCompile);
	};

	module.exports.render = function(name, ctx, cb) {
	    if(!e) {
	        module.exports.configure();
	    }

	    return e.render(name, ctx, cb);
	};

	module.exports.renderString = function(src, ctx, cb) {
	    if(!e) {
	        module.exports.configure();
	    }

	    return e.renderString(src, ctx, cb);
	};

	if(precompile) {
	    module.exports.precompile = precompile.precompile;
	    module.exports.precompileString = precompile.precompileString;
	}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	var ArrayProto = Array.prototype;
	var ObjProto = Object.prototype;

	var escapeMap = {
	    '&': '&amp;',
	    '"': '&quot;',
	    '\'': '&#39;',
	    '<': '&lt;',
	    '>': '&gt;'
	};

	var escapeRegex = /[&"'<>]/g;

	var lookupEscape = function(ch) {
	    return escapeMap[ch];
	};

	var exports = module.exports = {};

	exports.prettifyError = function(path, withInternals, err) {
	    // jshint -W022
	    // http://jslinterrors.com/do-not-assign-to-the-exception-parameter
	    if (!err.Update) {
	        // not one of ours, cast it
	        err = new exports.TemplateError(err);
	    }
	    err.Update(path);

	    // Unless they marked the dev flag, show them a trace from here
	    if (!withInternals) {
	        var old = err;
	        err = new Error(old.message);
	        err.name = old.name;
	    }

	    return err;
	};

	exports.TemplateError = function(message, lineno, colno) {
	    var err = this;

	    if (message instanceof Error) { // for casting regular js errors
	        err = message;
	        message = message.name + ': ' + message.message;

	        try {
	            if(err.name = '') {}
	        }
	        catch(e) {
	            // If we can't set the name of the error object in this
	            // environment, don't use it
	            err = this;
	        }
	    } else {
	        if(Error.captureStackTrace) {
	            Error.captureStackTrace(err);
	        }
	    }

	    err.name = 'Template render error';
	    err.message = message;
	    err.lineno = lineno;
	    err.colno = colno;
	    err.firstUpdate = true;

	    err.Update = function(path) {
	        var message = '(' + (path || 'unknown path') + ')';

	        // only show lineno + colno next to path of template
	        // where error occurred
	        if (this.firstUpdate) {
	            if(this.lineno && this.colno) {
	                message += ' [Line ' + this.lineno + ', Column ' + this.colno + ']';
	            }
	            else if(this.lineno) {
	                message += ' [Line ' + this.lineno + ']';
	            }
	        }

	        message += '\n ';
	        if (this.firstUpdate) {
	            message += ' ';
	        }

	        this.message = message + (this.message || '');
	        this.firstUpdate = false;
	        return this;
	    };

	    return err;
	};

	exports.TemplateError.prototype = Error.prototype;

	exports.escape = function(val) {
	  return val.replace(escapeRegex, lookupEscape);
	};

	exports.isFunction = function(obj) {
	    return ObjProto.toString.call(obj) === '[object Function]';
	};

	exports.isArray = Array.isArray || function(obj) {
	    return ObjProto.toString.call(obj) === '[object Array]';
	};

	exports.isString = function(obj) {
	    return ObjProto.toString.call(obj) === '[object String]';
	};

	exports.isObject = function(obj) {
	    return ObjProto.toString.call(obj) === '[object Object]';
	};

	exports.groupBy = function(obj, val) {
	    var result = {};
	    var iterator = exports.isFunction(val) ? val : function(obj) { return obj[val]; };
	    for(var i=0; i<obj.length; i++) {
	        var value = obj[i];
	        var key = iterator(value, i);
	        (result[key] || (result[key] = [])).push(value);
	    }
	    return result;
	};

	exports.toArray = function(obj) {
	    return Array.prototype.slice.call(obj);
	};

	exports.without = function(array) {
	    var result = [];
	    if (!array) {
	        return result;
	    }
	    var index = -1,
	    length = array.length,
	    contains = exports.toArray(arguments).slice(1);

	    while(++index < length) {
	        if(exports.indexOf(contains, array[index]) === -1) {
	            result.push(array[index]);
	        }
	    }
	    return result;
	};

	exports.extend = function(obj, obj2) {
	    for(var k in obj2) {
	        obj[k] = obj2[k];
	    }
	    return obj;
	};

	exports.repeat = function(char_, n) {
	    var str = '';
	    for(var i=0; i<n; i++) {
	        str += char_;
	    }
	    return str;
	};

	exports.each = function(obj, func, context) {
	    if(obj == null) {
	        return;
	    }

	    if(ArrayProto.each && obj.each === ArrayProto.each) {
	        obj.forEach(func, context);
	    }
	    else if(obj.length === +obj.length) {
	        for(var i=0, l=obj.length; i<l; i++) {
	            func.call(context, obj[i], i, obj);
	        }
	    }
	};

	exports.map = function(obj, func) {
	    var results = [];
	    if(obj == null) {
	        return results;
	    }

	    if(ArrayProto.map && obj.map === ArrayProto.map) {
	        return obj.map(func);
	    }

	    for(var i=0; i<obj.length; i++) {
	        results[results.length] = func(obj[i], i);
	    }

	    if(obj.length === +obj.length) {
	        results.length = obj.length;
	    }

	    return results;
	};

	exports.asyncIter = function(arr, iter, cb) {
	    var i = -1;

	    function next() {
	        i++;

	        if(i < arr.length) {
	            iter(arr[i], i, next, cb);
	        }
	        else {
	            cb();
	        }
	    }

	    next();
	};

	exports.asyncFor = function(obj, iter, cb) {
	    var keys = exports.keys(obj);
	    var len = keys.length;
	    var i = -1;

	    function next() {
	        i++;
	        var k = keys[i];

	        if(i < len) {
	            iter(k, obj[k], i, len, next);
	        }
	        else {
	            cb();
	        }
	    }

	    next();
	};

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
	exports.indexOf = Array.prototype.indexOf ?
	    function (arr, searchElement, fromIndex) {
	        return Array.prototype.indexOf.call(arr, searchElement, fromIndex);
	    } :
	    function (arr, searchElement, fromIndex) {
	        var length = this.length >>> 0; // Hack to convert object.length to a UInt32

	        fromIndex = +fromIndex || 0;

	        if(Math.abs(fromIndex) === Infinity) {
	            fromIndex = 0;
	        }

	        if(fromIndex < 0) {
	            fromIndex += length;
	            if (fromIndex < 0) {
	                fromIndex = 0;
	            }
	        }

	        for(;fromIndex < length; fromIndex++) {
	            if (arr[fromIndex] === searchElement) {
	                return fromIndex;
	            }
	        }

	        return -1;
	    };

	if(!Array.prototype.map) {
	    Array.prototype.map = function() {
	        throw new Error('map is unimplemented for this js engine');
	    };
	}

	exports.keys = function(obj) {
	    if(Object.prototype.keys) {
	        return obj.keys();
	    }
	    else {
	        var keys = [];
	        for(var k in obj) {
	            if(obj.hasOwnProperty(k)) {
	                keys.push(k);
	            }
	        }
	        return keys;
	    }
	};

	exports.inOperator = function (key, val) {
	    if (exports.isArray(val)) {
	        return exports.indexOf(val, key) !== -1;
	    } else if (exports.isObject(val)) {
	        return key in val;
	    } else if (exports.isString(val)) {
	        return val.indexOf(key) !== -1;
	    } else {
	        throw new Error('Cannot use "in" operator to search for "'
	            + key + '" in unexpected types.');
	    }
	};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var path = __webpack_require__(3);
	var asap = __webpack_require__(4);
	var lib = __webpack_require__(1);
	var Obj = __webpack_require__(6);
	var compiler = __webpack_require__(7);
	var builtin_filters = __webpack_require__(14);
	var builtin_loaders = __webpack_require__(15);
	var runtime = __webpack_require__(13);
	var globals = __webpack_require__(18);
	var waterfall = __webpack_require__(19);
	var Frame = runtime.Frame;
	var Template;

	// Unconditionally load in this loader, even if no other ones are
	// included (possible in the slim browser build)
	builtin_loaders.PrecompiledLoader = __webpack_require__(17);

	// If the user is using the async API, *always* call it
	// asynchronously even if the template was synchronous.
	function callbackAsap(cb, err, res) {
	    asap(function() { cb(err, res); });
	}

	var Environment = Obj.extend({
	    init: function(loaders, opts) {
	        // The dev flag determines the trace that'll be shown on errors.
	        // If set to true, returns the full trace from the error point,
	        // otherwise will return trace starting from Template.render
	        // (the full trace from within nunjucks may confuse developers using
	        //  the library)
	        // defaults to false
	        opts = this.opts = opts || {};
	        this.opts.dev = !!opts.dev;

	        // The autoescape flag sets global autoescaping. If true,
	        // every string variable will be escaped by default.
	        // If false, strings can be manually escaped using the `escape` filter.
	        // defaults to true
	        this.opts.autoescape = opts.autoescape != null ? opts.autoescape : true;

	        // If true, this will make the system throw errors if trying
	        // to output a null or undefined value
	        this.opts.throwOnUndefined = !!opts.throwOnUndefined;
	        this.opts.trimBlocks = !!opts.trimBlocks;
	        this.opts.lstripBlocks = !!opts.lstripBlocks;

	        this.loaders = [];

	        if(!loaders) {
	            // The filesystem loader is only available server-side
	            if(builtin_loaders.FileSystemLoader) {
	                this.loaders = [new builtin_loaders.FileSystemLoader('views')];
	            }
	            else if(builtin_loaders.WebLoader) {
	                this.loaders = [new builtin_loaders.WebLoader('/views')];
	            }
	        }
	        else {
	            this.loaders = lib.isArray(loaders) ? loaders : [loaders];
	        }

	        // It's easy to use precompiled templates: just include them
	        // before you configure nunjucks and this will automatically
	        // pick it up and use it
	        if((true) && window.nunjucksPrecompiled) {
	            this.loaders.unshift(
	                new builtin_loaders.PrecompiledLoader(window.nunjucksPrecompiled)
	            );
	        }

	        this.initCache();

	        this.globals = globals();
	        this.filters = {};
	        this.asyncFilters = [];
	        this.extensions = {};
	        this.extensionsList = [];

	        for(var name in builtin_filters) {
	            this.addFilter(name, builtin_filters[name]);
	        }
	    },

	    initCache: function() {
	        // Caching and cache busting
	        lib.each(this.loaders, function(loader) {
	            loader.cache = {};

	            if(typeof loader.on === 'function') {
	                loader.on('update', function(template) {
	                    loader.cache[template] = null;
	                });
	            }
	        });
	    },

	    addExtension: function(name, extension) {
	        extension._name = name;
	        this.extensions[name] = extension;
	        this.extensionsList.push(extension);
	        return this;
	    },

	    removeExtension: function(name) {
	        var extension = this.getExtension(name);
	        if (!extension) return;

	        this.extensionsList = lib.without(this.extensionsList, extension);
	        delete this.extensions[name];
	    },

	    getExtension: function(name) {
	        return this.extensions[name];
	    },

	    hasExtension: function(name) {
	        return !!this.extensions[name];
	    },

	    addGlobal: function(name, value) {
	        this.globals[name] = value;
	        return this;
	    },

	    getGlobal: function(name) {
	        if(typeof this.globals[name] === 'undefined') {
	            throw new Error('global not found: ' + name);
	        }
	        return this.globals[name];
	    },

	    addFilter: function(name, func, async) {
	        var wrapped = func;

	        if(async) {
	            this.asyncFilters.push(name);
	        }
	        this.filters[name] = wrapped;
	        return this;
	    },

	    getFilter: function(name) {
	        if(!this.filters[name]) {
	            throw new Error('filter not found: ' + name);
	        }
	        return this.filters[name];
	    },

	    resolveTemplate: function(loader, parentName, filename) {
	        var isRelative = (loader.isRelative && parentName)? loader.isRelative(filename) : false;
	        return (isRelative && loader.resolve)? loader.resolve(parentName, filename) : filename;
	    },

	    getTemplate: function(name, eagerCompile, parentName, ignoreMissing, cb) {
	        var that = this;
	        var tmpl = null;
	        if(name && name.raw) {
	            // this fixes autoescape for templates referenced in symbols
	            name = name.raw;
	        }

	        if(lib.isFunction(parentName)) {
	            cb = parentName;
	            parentName = null;
	            eagerCompile = eagerCompile || false;
	        }

	        if(lib.isFunction(eagerCompile)) {
	            cb = eagerCompile;
	            eagerCompile = false;
	        }

	        if (name instanceof Template) {
	             tmpl = name;
	        }
	        else if(typeof name !== 'string') {
	            throw new Error('template names must be a string: ' + name);
	        }
	        else {
	            for (var i = 0; i < this.loaders.length; i++) {
	                var _name = this.resolveTemplate(this.loaders[i], parentName, name);
	                tmpl = this.loaders[i].cache[_name];
	                if (tmpl) break;
	            }
	        }

	        if(tmpl) {
	            if(eagerCompile) {
	                tmpl.compile();
	            }

	            if(cb) {
	                cb(null, tmpl);
	            }
	            else {
	                return tmpl;
	            }
	        } else {
	            var syncResult;
	            var _this = this;

	            var createTemplate = function(err, info) {
	                if(!info && !err) {
	                    if(!ignoreMissing) {
	                        err = new Error('template not found: ' + name);
	                    }
	                }

	                if (err) {
	                    if(cb) {
	                        cb(err);
	                    }
	                    else {
	                        throw err;
	                    }
	                }
	                else {
	                    var tmpl;
	                    if(info) {
	                        tmpl = new Template(info.src, _this,
	                                            info.path, eagerCompile);

	                        if(!info.noCache) {
	                            info.loader.cache[name] = tmpl;
	                        }
	                    }
	                    else {
	                        tmpl = new Template('', _this,
	                                            '', eagerCompile);
	                    }

	                    if(cb) {
	                        cb(null, tmpl);
	                    }
	                    else {
	                        syncResult = tmpl;
	                    }
	                }
	            };

	            lib.asyncIter(this.loaders, function(loader, i, next, done) {
	                function handle(err, src) {
	                    if(err) {
	                        done(err);
	                    }
	                    else if(src) {
	                        src.loader = loader;
	                        done(null, src);
	                    }
	                    else {
	                        next();
	                    }
	                }

	                // Resolve name relative to parentName
	                name = that.resolveTemplate(loader, parentName, name);

	                if(loader.async) {
	                    loader.getSource(name, handle);
	                }
	                else {
	                    handle(null, loader.getSource(name));
	                }
	            }, createTemplate);

	            return syncResult;
	        }
	    },

	    express: function(app) {
	        var env = this;

	        function NunjucksView(name, opts) {
	            this.name          = name;
	            this.path          = name;
	            this.defaultEngine = opts.defaultEngine;
	            this.ext           = path.extname(name);
	            if (!this.ext && !this.defaultEngine) throw new Error('No default engine was specified and no extension was provided.');
	            if (!this.ext) this.name += (this.ext = ('.' !== this.defaultEngine[0] ? '.' : '') + this.defaultEngine);
	        }

	        NunjucksView.prototype.render = function(opts, cb) {
	          env.render(this.name, opts, cb);
	        };

	        app.set('view', NunjucksView);
	        app.set('nunjucksEnv', this);
	        return this;
	    },

	    render: function(name, ctx, cb) {
	        if(lib.isFunction(ctx)) {
	            cb = ctx;
	            ctx = null;
	        }

	        // We support a synchronous API to make it easier to migrate
	        // existing code to async. This works because if you don't do
	        // anything async work, the whole thing is actually run
	        // synchronously.
	        var syncResult = null;

	        this.getTemplate(name, function(err, tmpl) {
	            if(err && cb) {
	                callbackAsap(cb, err);
	            }
	            else if(err) {
	                throw err;
	            }
	            else {
	                syncResult = tmpl.render(ctx, cb);
	            }
	        });

	        return syncResult;
	    },

	    renderString: function(src, ctx, opts, cb) {
	        if(lib.isFunction(opts)) {
	            cb = opts;
	            opts = {};
	        }
	        opts = opts || {};

	        var tmpl = new Template(src, this, opts.path);
	        return tmpl.render(ctx, cb);
	    },

	    waterfall: waterfall
	});

	var Context = Obj.extend({
	    init: function(ctx, blocks, env) {
	        // Has to be tied to an environment so we can tap into its globals.
	        this.env = env || new Environment();

	        // Make a duplicate of ctx
	        this.ctx = {};
	        for(var k in ctx) {
	            if(ctx.hasOwnProperty(k)) {
	                this.ctx[k] = ctx[k];
	            }
	        }

	        this.blocks = {};
	        this.exported = [];

	        for(var name in blocks) {
	            this.addBlock(name, blocks[name]);
	        }
	    },

	    lookup: function(name) {
	        // This is one of the most called functions, so optimize for
	        // the typical case where the name isn't in the globals
	        if(name in this.env.globals && !(name in this.ctx)) {
	            return this.env.globals[name];
	        }
	        else {
	            return this.ctx[name];
	        }
	    },

	    setVariable: function(name, val) {
	        this.ctx[name] = val;
	    },

	    getVariables: function() {
	        return this.ctx;
	    },

	    addBlock: function(name, block) {
	        this.blocks[name] = this.blocks[name] || [];
	        this.blocks[name].push(block);
	        return this;
	    },

	    getBlock: function(name) {
	        if(!this.blocks[name]) {
	            throw new Error('unknown block "' + name + '"');
	        }

	        return this.blocks[name][0];
	    },

	    getSuper: function(env, name, block, frame, runtime, cb) {
	        var idx = lib.indexOf(this.blocks[name] || [], block);
	        var blk = this.blocks[name][idx + 1];
	        var context = this;

	        if(idx === -1 || !blk) {
	            throw new Error('no super block available for "' + name + '"');
	        }

	        blk(env, context, frame, runtime, cb);
	    },

	    addExport: function(name) {
	        this.exported.push(name);
	    },

	    getExported: function() {
	        var exported = {};
	        for(var i=0; i<this.exported.length; i++) {
	            var name = this.exported[i];
	            exported[name] = this.ctx[name];
	        }
	        return exported;
	    }
	});

	Template = Obj.extend({
	    init: function (src, env, path, eagerCompile) {
	        this.env = env || new Environment();

	        if(lib.isObject(src)) {
	            switch(src.type) {
	            case 'code': this.tmplProps = src.obj; break;
	            case 'string': this.tmplStr = src.obj; break;
	            }
	        }
	        else if(lib.isString(src)) {
	            this.tmplStr = src;
	        }
	        else {
	            throw new Error('src must be a string or an object describing ' +
	                            'the source');
	        }

	        this.path = path;

	        if(eagerCompile) {
	            var _this = this;
	            try {
	                _this._compile();
	            }
	            catch(err) {
	                throw lib.prettifyError(this.path, this.env.opts.dev, err);
	            }
	        }
	        else {
	            this.compiled = false;
	        }
	    },

	    render: function(ctx, parentFrame, cb) {
	        if (typeof ctx === 'function') {
	            cb = ctx;
	            ctx = {};
	        }
	        else if (typeof parentFrame === 'function') {
	            cb = parentFrame;
	            parentFrame = null;
	        }

	        var forceAsync = true;
	        if(parentFrame) {
	            // If there is a frame, we are being called from internal
	            // code of another template, and the internal system
	            // depends on the sync/async nature of the parent template
	            // to be inherited, so force an async callback
	            forceAsync = false;
	        }

	        var _this = this;
	        // Catch compile errors for async rendering
	        try {
	            _this.compile();
	        } catch (_err) {
	            var err = lib.prettifyError(this.path, this.env.opts.dev, _err);
	            if (cb) return callbackAsap(cb, err);
	            else throw err;
	        }

	        var context = new Context(ctx || {}, _this.blocks, _this.env);
	        var frame = parentFrame ? parentFrame.push(true) : new Frame();
	        frame.topLevel = true;
	        var syncResult = null;

	        _this.rootRenderFunc(
	            _this.env,
	            context,
	            frame || new Frame(),
	            runtime,
	            function(err, res) {
	                if(err) {
	                    err = lib.prettifyError(_this.path, _this.env.opts.dev, err);
	                }

	                if(cb) {
	                    if(forceAsync) {
	                        callbackAsap(cb, err, res);
	                    }
	                    else {
	                        cb(err, res);
	                    }
	                }
	                else {
	                    if(err) { throw err; }
	                    syncResult = res;
	                }
	            }
	        );

	        return syncResult;
	    },


	    getExported: function(ctx, parentFrame, cb) {
	        if (typeof ctx === 'function') {
	            cb = ctx;
	            ctx = {};
	        }

	        if (typeof parentFrame === 'function') {
	            cb = parentFrame;
	            parentFrame = null;
	        }

	        // Catch compile errors for async rendering
	        try {
	            this.compile();
	        } catch (e) {
	            if (cb) return cb(e);
	            else throw e;
	        }

	        var frame = parentFrame ? parentFrame.push() : new Frame();
	        frame.topLevel = true;

	        // Run the rootRenderFunc to populate the context with exported vars
	        var context = new Context(ctx || {}, this.blocks, this.env);
	        this.rootRenderFunc(this.env,
	                            context,
	                            frame,
	                            runtime,
	                            function(err) {
	        		        if ( err ) {
	        			    cb(err, null);
	        		        } else {
	        			    cb(null, context.getExported());
	        		        }
	                            });
	    },

	    compile: function() {
	        if(!this.compiled) {
	            this._compile();
	        }
	    },

	    _compile: function() {
	        var props;

	        if(this.tmplProps) {
	            props = this.tmplProps;
	        }
	        else {
	            var source = compiler.compile(this.tmplStr,
	                                          this.env.asyncFilters,
	                                          this.env.extensionsList,
	                                          this.path,
	                                          this.env.opts);

	            /* jslint evil: true */
	            var func = new Function(source);
	            props = func();
	        }

	        this.blocks = this._getBlocks(props);
	        this.rootRenderFunc = props.root;
	        this.compiled = true;
	    },

	    _getBlocks: function(props) {
	        var blocks = {};

	        for(var k in props) {
	            if(k.slice(0, 2) === 'b_') {
	                blocks[k.slice(2)] = props[k];
	            }
	        }

	        return blocks;
	    }
	});

	module.exports = {
	    Environment: Environment,
	    Template: Template
	};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	// rawAsap provides everything we need except exception management.
	var rawAsap = __webpack_require__(5);
	// RawTasks are recycled to reduce GC churn.
	var freeTasks = [];
	// We queue errors to ensure they are thrown in right order (FIFO).
	// Array-as-queue is good enough here, since we are just dealing with exceptions.
	var pendingErrors = [];
	var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

	function throwFirstError() {
	    if (pendingErrors.length) {
	        throw pendingErrors.shift();
	    }
	}

	/**
	 * Calls a task as soon as possible after returning, in its own event, with priority
	 * over other events like animation, reflow, and repaint. An error thrown from an
	 * event will not interrupt, nor even substantially slow down the processing of
	 * other events, but will be rather postponed to a lower priority event.
	 * @param {{call}} task A callable object, typically a function that takes no
	 * arguments.
	 */
	module.exports = asap;
	function asap(task) {
	    var rawTask;
	    if (freeTasks.length) {
	        rawTask = freeTasks.pop();
	    } else {
	        rawTask = new RawTask();
	    }
	    rawTask.task = task;
	    rawAsap(rawTask);
	}

	// We wrap tasks with recyclable task objects.  A task object implements
	// `call`, just like a function.
	function RawTask() {
	    this.task = null;
	}

	// The sole purpose of wrapping the task is to catch the exception and recycle
	// the task object after its single use.
	RawTask.prototype.call = function () {
	    try {
	        this.task.call();
	    } catch (error) {
	        if (asap.onerror) {
	            // This hook exists purely for testing purposes.
	            // Its name will be periodically randomized to break any code that
	            // depends on its existence.
	            asap.onerror(error);
	        } else {
	            // In a web browser, exceptions are not fatal. However, to avoid
	            // slowing down the queue of pending tasks, we rethrow the error in a
	            // lower priority turn.
	            pendingErrors.push(error);
	            requestErrorThrow();
	        }
	    } finally {
	        this.task = null;
	        freeTasks[freeTasks.length] = this;
	    }
	};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	// Use the fastest means possible to execute a task in its own turn, with
	// priority over other events including IO, animation, reflow, and redraw
	// events in browsers.
	//
	// An exception thrown by a task will permanently interrupt the processing of
	// subsequent tasks. The higher level `asap` function ensures that if an
	// exception is thrown by a task, that the task queue will continue flushing as
	// soon as possible, but if you use `rawAsap` directly, you are responsible to
	// either ensure that no exceptions are thrown from your task, or to manually
	// call `rawAsap.requestFlush` if an exception is thrown.
	module.exports = rawAsap;
	function rawAsap(task) {
	    if (!queue.length) {
	        requestFlush();
	        flushing = true;
	    }
	    // Equivalent to push, but avoids a function call.
	    queue[queue.length] = task;
	}

	var queue = [];
	// Once a flush has been requested, no further calls to `requestFlush` are
	// necessary until the next `flush` completes.
	var flushing = false;
	// `requestFlush` is an implementation-specific method that attempts to kick
	// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
	// the event queue before yielding to the browser's own event loop.
	var requestFlush;
	// The position of the next task to execute in the task queue. This is
	// preserved between calls to `flush` so that it can be resumed if
	// a task throws an exception.
	var index = 0;
	// If a task schedules additional tasks recursively, the task queue can grow
	// unbounded. To prevent memory exhaustion, the task queue will periodically
	// truncate already-completed tasks.
	var capacity = 1024;

	// The flush function processes all tasks that have been scheduled with
	// `rawAsap` unless and until one of those tasks throws an exception.
	// If a task throws an exception, `flush` ensures that its state will remain
	// consistent and will resume where it left off when called again.
	// However, `flush` does not make any arrangements to be called again if an
	// exception is thrown.
	function flush() {
	    while (index < queue.length) {
	        var currentIndex = index;
	        // Advance the index before calling the task. This ensures that we will
	        // begin flushing on the next task the task throws an error.
	        index = index + 1;
	        queue[currentIndex].call();
	        // Prevent leaking memory for long chains of recursive calls to `asap`.
	        // If we call `asap` within tasks scheduled by `asap`, the queue will
	        // grow, but to avoid an O(n) walk for every task we execute, we don't
	        // shift tasks off the queue after they have been executed.
	        // Instead, we periodically shift 1024 tasks off the queue.
	        if (index > capacity) {
	            // Manually shift all values starting at the index back to the
	            // beginning of the queue.
	            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
	                queue[scan] = queue[scan + index];
	            }
	            queue.length -= index;
	            index = 0;
	        }
	    }
	    queue.length = 0;
	    index = 0;
	    flushing = false;
	}

	// `requestFlush` is implemented using a strategy based on data collected from
	// every available SauceLabs Selenium web driver worker at time of writing.
	// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

	// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
	// have WebKitMutationObserver but not un-prefixed MutationObserver.
	// Must use `global` or `self` instead of `window` to work in both frames and web
	// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

	/* globals self */
	var scope = typeof global !== "undefined" ? global : self;
	var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

	// MutationObservers are desirable because they have high priority and work
	// reliably everywhere they are implemented.
	// They are implemented in all modern browsers.
	//
	// - Android 4-4.3
	// - Chrome 26-34
	// - Firefox 14-29
	// - Internet Explorer 11
	// - iPad Safari 6-7.1
	// - iPhone Safari 7-7.1
	// - Safari 6-7
	if (typeof BrowserMutationObserver === "function") {
	    requestFlush = makeRequestCallFromMutationObserver(flush);

	// MessageChannels are desirable because they give direct access to the HTML
	// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
	// 11-12, and in web workers in many engines.
	// Although message channels yield to any queued rendering and IO tasks, they
	// would be better than imposing the 4ms delay of timers.
	// However, they do not work reliably in Internet Explorer or Safari.

	// Internet Explorer 10 is the only browser that has setImmediate but does
	// not have MutationObservers.
	// Although setImmediate yields to the browser's renderer, it would be
	// preferrable to falling back to setTimeout since it does not have
	// the minimum 4ms penalty.
	// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
	// Desktop to a lesser extent) that renders both setImmediate and
	// MessageChannel useless for the purposes of ASAP.
	// https://github.com/kriskowal/q/issues/396

	// Timers are implemented universally.
	// We fall back to timers in workers in most engines, and in foreground
	// contexts in the following browsers.
	// However, note that even this simple case requires nuances to operate in a
	// broad spectrum of browsers.
	//
	// - Firefox 3-13
	// - Internet Explorer 6-9
	// - iPad Safari 4.3
	// - Lynx 2.8.7
	} else {
	    requestFlush = makeRequestCallFromTimer(flush);
	}

	// `requestFlush` requests that the high priority event queue be flushed as
	// soon as possible.
	// This is useful to prevent an error thrown in a task from stalling the event
	// queue if the exception handled by Node.js’s
	// `process.on("uncaughtException")` or by a domain.
	rawAsap.requestFlush = requestFlush;

	// To request a high priority event, we induce a mutation observer by toggling
	// the text of a text node between "1" and "-1".
	function makeRequestCallFromMutationObserver(callback) {
	    var toggle = 1;
	    var observer = new BrowserMutationObserver(callback);
	    var node = document.createTextNode("");
	    observer.observe(node, {characterData: true});
	    return function requestCall() {
	        toggle = -toggle;
	        node.data = toggle;
	    };
	}

	// The message channel technique was discovered by Malte Ubl and was the
	// original foundation for this library.
	// http://www.nonblocking.io/2011/06/windownexttick.html

	// Safari 6.0.5 (at least) intermittently fails to create message ports on a
	// page's first load. Thankfully, this version of Safari supports
	// MutationObservers, so we don't need to fall back in that case.

	// function makeRequestCallFromMessageChannel(callback) {
	//     var channel = new MessageChannel();
	//     channel.port1.onmessage = callback;
	//     return function requestCall() {
	//         channel.port2.postMessage(0);
	//     };
	// }

	// For reasons explained above, we are also unable to use `setImmediate`
	// under any circumstances.
	// Even if we were, there is another bug in Internet Explorer 10.
	// It is not sufficient to assign `setImmediate` to `requestFlush` because
	// `setImmediate` must be called *by name* and therefore must be wrapped in a
	// closure.
	// Never forget.

	// function makeRequestCallFromSetImmediate(callback) {
	//     return function requestCall() {
	//         setImmediate(callback);
	//     };
	// }

	// Safari 6.0 has a problem where timers will get lost while the user is
	// scrolling. This problem does not impact ASAP because Safari 6.0 supports
	// mutation observers, so that implementation is used instead.
	// However, if we ever elect to use timers in Safari, the prevalent work-around
	// is to add a scroll event listener that calls for a flush.

	// `setTimeout` does not call the passed callback if the delay is less than
	// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
	// even then.

	function makeRequestCallFromTimer(callback) {
	    return function requestCall() {
	        // We dispatch a timeout with a specified delay of 0 for engines that
	        // can reliably accommodate that request. This will usually be snapped
	        // to a 4 milisecond delay, but once we're flushing, there's no delay
	        // between events.
	        var timeoutHandle = setTimeout(handleTimer, 0);
	        // However, since this timer gets frequently dropped in Firefox
	        // workers, we enlist an interval handle that will try to fire
	        // an event 20 times per second until it succeeds.
	        var intervalHandle = setInterval(handleTimer, 50);

	        function handleTimer() {
	            // Whichever timer succeeds will cancel both timers and
	            // execute the callback.
	            clearTimeout(timeoutHandle);
	            clearInterval(intervalHandle);
	            callback();
	        }
	    };
	}

	// This is for `asap.js` only.
	// Its name will be periodically randomized to break any code that depends on
	// its existence.
	rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

	// ASAP was originally a nextTick shim included in Q. This was factored out
	// into this ASAP package. It was later adapted to RSVP which made further
	// amendments. These decisions, particularly to marginalize MessageChannel and
	// to capture the MutationObserver implementation in a closure, were integrated
	// back into ASAP proper.
	// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	// A simple class system, more documentation to come

	function extend(cls, name, props) {
	    // This does that same thing as Object.create, but with support for IE8
	    var F = function() {};
	    F.prototype = cls.prototype;
	    var prototype = new F();

	    // jshint undef: false
	    var fnTest = /xyz/.test(function(){ xyz; }) ? /\bparent\b/ : /.*/;
	    props = props || {};

	    for(var k in props) {
	        var src = props[k];
	        var parent = prototype[k];

	        if(typeof parent === 'function' &&
	           typeof src === 'function' &&
	           fnTest.test(src)) {
	            /*jshint -W083 */
	            prototype[k] = (function (src, parent) {
	                return function() {
	                    // Save the current parent method
	                    var tmp = this.parent;

	                    // Set parent to the previous method, call, and restore
	                    this.parent = parent;
	                    var res = src.apply(this, arguments);
	                    this.parent = tmp;

	                    return res;
	                };
	            })(src, parent);
	        }
	        else {
	            prototype[k] = src;
	        }
	    }

	    prototype.typename = name;

	    var new_cls = function() {
	        if(prototype.init) {
	            prototype.init.apply(this, arguments);
	        }
	    };

	    new_cls.prototype = prototype;
	    new_cls.prototype.constructor = new_cls;

	    new_cls.extend = function(name, props) {
	        if(typeof name === 'object') {
	            props = name;
	            name = 'anonymous';
	        }
	        return extend(new_cls, name, props);
	    };

	    return new_cls;
	}

	module.exports = extend(Object, 'Object', {});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var lib = __webpack_require__(1);
	var parser = __webpack_require__(8);
	var transformer = __webpack_require__(12);
	var nodes = __webpack_require__(10);
	// jshint -W079
	var Object = __webpack_require__(6);
	var Frame = __webpack_require__(13).Frame;

	// These are all the same for now, but shouldn't be passed straight
	// through
	var compareOps = {
	    '==': '==',
	    '===': '===',
	    '!=': '!=',
	    '!==': '!==',
	    '<': '<',
	    '>': '>',
	    '<=': '<=',
	    '>=': '>='
	};

	// A common pattern is to emit binary operators
	function binOpEmitter(str) {
	    return function(node, frame) {
	        this.compile(node.left, frame);
	        this.emit(str);
	        this.compile(node.right, frame);
	    };
	}

	var Compiler = Object.extend({
	    init: function(templateName, throwOnUndefined) {
	        this.templateName = templateName;
	        this.codebuf = [];
	        this.lastId = 0;
	        this.buffer = null;
	        this.bufferStack = [];
	        this.scopeClosers = '';
	        this.inBlock = false;
	        this.throwOnUndefined = throwOnUndefined;
	    },

	    fail: function (msg, lineno, colno) {
	        if (lineno !== undefined) lineno += 1;
	        if (colno !== undefined) colno += 1;

	        throw new lib.TemplateError(msg, lineno, colno);
	    },

	    pushBufferId: function(id) {
	        this.bufferStack.push(this.buffer);
	        this.buffer = id;
	        this.emit('var ' + this.buffer + ' = "";');
	    },

	    popBufferId: function() {
	        this.buffer = this.bufferStack.pop();
	    },

	    emit: function(code) {
	        this.codebuf.push(code);
	    },

	    emitLine: function(code) {
	        this.emit(code + '\n');
	    },

	    emitLines: function() {
	        lib.each(lib.toArray(arguments), function(line) {
	            this.emitLine(line);
	        }, this);
	    },

	    emitFuncBegin: function(name) {
	        this.buffer = 'output';
	        this.scopeClosers = '';
	        this.emitLine('function ' + name + '(env, context, frame, runtime, cb) {');
	        this.emitLine('var lineno = null;');
	        this.emitLine('var colno = null;');
	        this.emitLine('var ' + this.buffer + ' = "";');
	        this.emitLine('try {');
	    },

	    emitFuncEnd: function(noReturn) {
	        if(!noReturn) {
	            this.emitLine('cb(null, ' + this.buffer +');');
	        }

	        this.closeScopeLevels();
	        this.emitLine('} catch (e) {');
	        this.emitLine('  cb(runtime.handleError(e, lineno, colno));');
	        this.emitLine('}');
	        this.emitLine('}');
	        this.buffer = null;
	    },

	    addScopeLevel: function() {
	        this.scopeClosers += '})';
	    },

	    closeScopeLevels: function() {
	        this.emitLine(this.scopeClosers + ';');
	        this.scopeClosers = '';
	    },

	    withScopedSyntax: function(func) {
	        var scopeClosers = this.scopeClosers;
	        this.scopeClosers = '';

	        func.call(this);

	        this.closeScopeLevels();
	        this.scopeClosers = scopeClosers;
	    },

	    makeCallback: function(res) {
	        var err = this.tmpid();

	        return 'function(' + err + (res ? ',' + res : '') + ') {\n' +
	            'if(' + err + ') { cb(' + err + '); return; }';
	    },

	    tmpid: function() {
	        this.lastId++;
	        return 't_' + this.lastId;
	    },

	    _templateName: function() {
	        return this.templateName == null? 'undefined' : JSON.stringify(this.templateName);
	    },

	    _compileChildren: function(node, frame) {
	        var children = node.children;
	        for(var i=0, l=children.length; i<l; i++) {
	            this.compile(children[i], frame);
	        }
	    },

	    _compileAggregate: function(node, frame, startChar, endChar) {
	        if(startChar) {
	            this.emit(startChar);
	        }

	        for(var i=0; i<node.children.length; i++) {
	            if(i > 0) {
	                this.emit(',');
	            }

	            this.compile(node.children[i], frame);
	        }

	        if(endChar) {
	            this.emit(endChar);
	        }
	    },

	    _compileExpression: function(node, frame) {
	        // TODO: I'm not really sure if this type check is worth it or
	        // not.
	        this.assertType(
	            node,
	            nodes.Literal,
	            nodes.Symbol,
	            nodes.Group,
	            nodes.Array,
	            nodes.Dict,
	            nodes.FunCall,
	            nodes.Caller,
	            nodes.Filter,
	            nodes.LookupVal,
	            nodes.Compare,
	            nodes.InlineIf,
	            nodes.In,
	            nodes.And,
	            nodes.Or,
	            nodes.Not,
	            nodes.Add,
	            nodes.Concat,
	            nodes.Sub,
	            nodes.Mul,
	            nodes.Div,
	            nodes.FloorDiv,
	            nodes.Mod,
	            nodes.Pow,
	            nodes.Neg,
	            nodes.Pos,
	            nodes.Compare,
	            nodes.NodeList
	        );
	        this.compile(node, frame);
	    },

	    assertType: function(node /*, types */) {
	        var types = lib.toArray(arguments).slice(1);
	        var success = false;

	        for(var i=0; i<types.length; i++) {
	            if(node instanceof types[i]) {
	                success = true;
	            }
	        }

	        if(!success) {
	            this.fail('assertType: invalid type: ' + node.typename,
	                      node.lineno,
	                      node.colno);
	        }
	    },

	    compileCallExtension: function(node, frame, async) {
	        var args = node.args;
	        var contentArgs = node.contentArgs;
	        var autoescape = typeof node.autoescape === 'boolean' ? node.autoescape : true;

	        if(!async) {
	            this.emit(this.buffer + ' += runtime.suppressValue(');
	        }

	        this.emit('env.getExtension("' + node.extName + '")["' + node.prop + '"](');
	        this.emit('context');

	        if(args || contentArgs) {
	            this.emit(',');
	        }

	        if(args) {
	            if(!(args instanceof nodes.NodeList)) {
	                this.fail('compileCallExtension: arguments must be a NodeList, ' +
	                          'use `parser.parseSignature`');
	            }

	            lib.each(args.children, function(arg, i) {
	                // Tag arguments are passed normally to the call. Note
	                // that keyword arguments are turned into a single js
	                // object as the last argument, if they exist.
	                this._compileExpression(arg, frame);

	                if(i !== args.children.length - 1 || contentArgs.length) {
	                    this.emit(',');
	                }
	            }, this);
	        }

	        if(contentArgs.length) {
	            lib.each(contentArgs, function(arg, i) {
	                if(i > 0) {
	                    this.emit(',');
	                }

	                if(arg) {
	                    var id = this.tmpid();

	                    this.emitLine('function(cb) {');
	                    this.emitLine('if(!cb) { cb = function(err) { if(err) { throw err; }}}');
	                    this.pushBufferId(id);

	                    this.withScopedSyntax(function() {
	                        this.compile(arg, frame);
	                        this.emitLine('cb(null, ' + id + ');');
	                    });

	                    this.popBufferId();
	                    this.emitLine('return ' + id + ';');
	                    this.emitLine('}');
	                }
	                else {
	                    this.emit('null');
	                }
	            }, this);
	        }

	        if(async) {
	            var res = this.tmpid();
	            this.emitLine(', ' + this.makeCallback(res));
	            this.emitLine(this.buffer + ' += runtime.suppressValue(' + res + ', ' + autoescape + ' && env.opts.autoescape);');
	            this.addScopeLevel();
	        }
	        else {
	            this.emit(')');
	            this.emit(', ' + autoescape + ' && env.opts.autoescape);\n');
	        }
	    },

	    compileCallExtensionAsync: function(node, frame) {
	        this.compileCallExtension(node, frame, true);
	    },

	    compileNodeList: function(node, frame) {
	        this._compileChildren(node, frame);
	    },

	    compileLiteral: function(node) {
	        if(typeof node.value === 'string') {
	            var val = node.value.replace(/\\/g, '\\\\');
	            val = val.replace(/"/g, '\\"');
	            val = val.replace(/\n/g, '\\n');
	            val = val.replace(/\r/g, '\\r');
	            val = val.replace(/\t/g, '\\t');
	            this.emit('"' + val  + '"');
	        }
	        else if (node.value === null) {
	            this.emit('null');
	        }
	        else {
	            this.emit(node.value.toString());
	        }
	    },

	    compileSymbol: function(node, frame) {
	        var name = node.value;
	        var v;

	        if((v = frame.lookup(name))) {
	            this.emit(v);
	        }
	        else {
	            this.emit('runtime.contextOrFrameLookup(' +
	                      'context, frame, "' + name + '")');
	        }
	    },

	    compileGroup: function(node, frame) {
	        this._compileAggregate(node, frame, '(', ')');
	    },

	    compileArray: function(node, frame) {
	        this._compileAggregate(node, frame, '[', ']');
	    },

	    compileDict: function(node, frame) {
	        this._compileAggregate(node, frame, '{', '}');
	    },

	    compilePair: function(node, frame) {
	        var key = node.key;
	        var val = node.value;

	        if(key instanceof nodes.Symbol) {
	            key = new nodes.Literal(key.lineno, key.colno, key.value);
	        }
	        else if(!(key instanceof nodes.Literal &&
	                  typeof key.value === 'string')) {
	            this.fail('compilePair: Dict keys must be strings or names',
	                      key.lineno,
	                      key.colno);
	        }

	        this.compile(key, frame);
	        this.emit(': ');
	        this._compileExpression(val, frame);
	    },

	    compileInlineIf: function(node, frame) {
	        this.emit('(');
	        this.compile(node.cond, frame);
	        this.emit('?');
	        this.compile(node.body, frame);
	        this.emit(':');
	        if(node.else_ !== null)
	            this.compile(node.else_, frame);
	        else
	            this.emit('""');
	        this.emit(')');
	    },

	    compileIn: function(node, frame) {
	      this.emit('runtime.inOperator(');
	      this.compile(node.left, frame);
	      this.emit(',');
	      this.compile(node.right, frame);
	      this.emit(')');
	    },

	    compileOr: binOpEmitter(' || '),
	    compileAnd: binOpEmitter(' && '),
	    compileAdd: binOpEmitter(' + '),
	    // ensure concatenation instead of addition
	    // by adding empty string in between
	    compileConcat: binOpEmitter(' + "" + '),
	    compileSub: binOpEmitter(' - '),
	    compileMul: binOpEmitter(' * '),
	    compileDiv: binOpEmitter(' / '),
	    compileMod: binOpEmitter(' % '),

	    compileNot: function(node, frame) {
	        this.emit('!');
	        this.compile(node.target, frame);
	    },

	    compileFloorDiv: function(node, frame) {
	        this.emit('Math.floor(');
	        this.compile(node.left, frame);
	        this.emit(' / ');
	        this.compile(node.right, frame);
	        this.emit(')');
	    },

	    compilePow: function(node, frame) {
	        this.emit('Math.pow(');
	        this.compile(node.left, frame);
	        this.emit(', ');
	        this.compile(node.right, frame);
	        this.emit(')');
	    },

	    compileNeg: function(node, frame) {
	        this.emit('-');
	        this.compile(node.target, frame);
	    },

	    compilePos: function(node, frame) {
	        this.emit('+');
	        this.compile(node.target, frame);
	    },

	    compileCompare: function(node, frame) {
	        this.compile(node.expr, frame);

	        for(var i=0; i<node.ops.length; i++) {
	            var n = node.ops[i];
	            this.emit(' ' + compareOps[n.type] + ' ');
	            this.compile(n.expr, frame);
	        }
	    },

	    compileLookupVal: function(node, frame) {
	        this.emit('runtime.memberLookup((');
	        this._compileExpression(node.target, frame);
	        this.emit('),');
	        this._compileExpression(node.val, frame);
	        this.emit(')');
	    },

	    _getNodeName: function(node) {
	        switch (node.typename) {
	            case 'Symbol':
	                return node.value;
	            case 'FunCall':
	                return 'the return value of (' + this._getNodeName(node.name) + ')';
	            case 'LookupVal':
	                return this._getNodeName(node.target) + '["' +
	                       this._getNodeName(node.val) + '"]';
	            case 'Literal':
	                return node.value.toString();
	            default:
	                return '--expression--';
	        }
	    },

	    compileFunCall: function(node, frame) {
	        // Keep track of line/col info at runtime by settings
	        // variables within an expression. An expression in javascript
	        // like (x, y, z) returns the last value, and x and y can be
	        // anything
	        this.emit('(lineno = ' + node.lineno +
	                  ', colno = ' + node.colno + ', ');

	        this.emit('runtime.callWrap(');
	        // Compile it as normal.
	        this._compileExpression(node.name, frame);

	        // Output the name of what we're calling so we can get friendly errors
	        // if the lookup fails.
	        this.emit(', "' + this._getNodeName(node.name).replace(/"/g, '\\"') + '", context, ');

	        this._compileAggregate(node.args, frame, '[', '])');

	        this.emit(')');
	    },

	    compileFilter: function(node, frame) {
	        var name = node.name;
	        this.assertType(name, nodes.Symbol);
	        this.emit('env.getFilter("' + name.value + '").call(context, ');
	        this._compileAggregate(node.args, frame);
	        this.emit(')');
	    },

	    compileFilterAsync: function(node, frame) {
	        var name = node.name;
	        this.assertType(name, nodes.Symbol);

	        var symbol = node.symbol.value;
	        frame.set(symbol, symbol);

	        this.emit('env.getFilter("' + name.value + '").call(context, ');
	        this._compileAggregate(node.args, frame);
	        this.emitLine(', ' + this.makeCallback(symbol));

	        this.addScopeLevel();
	    },

	    compileKeywordArgs: function(node, frame) {
	        var names = [];

	        lib.each(node.children, function(pair) {
	            names.push(pair.key.value);
	        });

	        this.emit('runtime.makeKeywordArgs(');
	        this.compileDict(node, frame);
	        this.emit(')');
	    },

	    compileSet: function(node, frame) {
	        var ids = [];

	        // Lookup the variable names for each identifier and create
	        // new ones if necessary
	        lib.each(node.targets, function(target) {
	            var name = target.value;
	            var id = frame.lookup(name);

	            if (id === null || id === undefined) {
	                id = this.tmpid();

	                // Note: This relies on js allowing scope across
	                // blocks, in case this is created inside an `if`
	                this.emitLine('var ' + id + ';');
	            }

	            ids.push(id);
	        }, this);

	        if (node.value) {
	          this.emit(ids.join(' = ') + ' = ');
	          this._compileExpression(node.value, frame);
	          this.emitLine(';');
	        }
	        else {
	          this.emit(ids.join(' = ') + ' = ');
	          this.compile(node.body, frame);
	          this.emitLine(';');
	        }

	        lib.each(node.targets, function(target, i) {
	            var id = ids[i];
	            var name = target.value;

	            // We are running this for every var, but it's very
	            // uncommon to assign to multiple vars anyway
	            this.emitLine('frame.set("' + name + '", ' + id + ', true);');

	            this.emitLine('if(frame.topLevel) {');
	            this.emitLine('context.setVariable("' + name + '", ' + id + ');');
	            this.emitLine('}');

	            if(name.charAt(0) !== '_') {
	                this.emitLine('if(frame.topLevel) {');
	                this.emitLine('context.addExport("' + name + '", ' + id + ');');
	                this.emitLine('}');
	            }
	        }, this);
	    },

	    compileIf: function(node, frame, async) {
	        this.emit('if(');
	        this._compileExpression(node.cond, frame);
	        this.emitLine(') {');

	        this.withScopedSyntax(function() {
	            this.compile(node.body, frame);

	            if(async) {
	                this.emit('cb()');
	            }
	        });

	        if(node.else_) {
	            this.emitLine('}\nelse {');

	            this.withScopedSyntax(function() {
	                this.compile(node.else_, frame);

	                if(async) {
	                    this.emit('cb()');
	                }
	            });
	        } else if(async) {
	            this.emitLine('}\nelse {');
	            this.emit('cb()');
	        }

	        this.emitLine('}');
	    },

	    compileIfAsync: function(node, frame) {
	        this.emit('(function(cb) {');
	        this.compileIf(node, frame, true);
	        this.emit('})(' + this.makeCallback());
	        this.addScopeLevel();
	    },

	    emitLoopBindings: function(node, arr, i, len) {
	        var bindings = {
	            index: i + ' + 1',
	            index0: i,
	            revindex: len + ' - ' + i,
	            revindex0: len + ' - ' + i + ' - 1',
	            first: i + ' === 0',
	            last: i + ' === ' + len + ' - 1',
	            length: len
	        };

	        for (var name in bindings) {
	            this.emitLine('frame.set("loop.' + name + '", ' + bindings[name] + ');');
	        }
	    },

	    compileFor: function(node, frame) {
	        // Some of this code is ugly, but it keeps the generated code
	        // as fast as possible. ForAsync also shares some of this, but
	        // not much.

	        var v;
	        var i = this.tmpid();
	        var len = this.tmpid();
	        var arr = this.tmpid();
	        frame = frame.push();

	        this.emitLine('frame = frame.push();');

	        this.emit('var ' + arr + ' = ');
	        this._compileExpression(node.arr, frame);
	        this.emitLine(';');

	        this.emit('if(' + arr + ') {');

	        // If multiple names are passed, we need to bind them
	        // appropriately
	        if(node.name instanceof nodes.Array) {
	            this.emitLine('var ' + i + ';');

	            // The object could be an arroy or object. Note that the
	            // body of the loop is duplicated for each condition, but
	            // we are optimizing for speed over size.
	            this.emitLine('if(runtime.isArray(' + arr + ')) {'); {
	                this.emitLine('var ' + len + ' = ' + arr + '.length;');
	                this.emitLine('for(' + i + '=0; ' + i + ' < ' + arr + '.length; '
	                              + i + '++) {');

	                // Bind each declared var
	                for (var u=0; u < node.name.children.length; u++) {
	                    var tid = this.tmpid();
	                    this.emitLine('var ' + tid + ' = ' + arr + '[' + i + '][' + u + ']');
	                    this.emitLine('frame.set("' + node.name.children[u].value
	                                  + '", ' + arr + '[' + i + '][' + u + ']' + ');');
	                    frame.set(node.name.children[u].value, tid);
	                }

	                this.emitLoopBindings(node, arr, i, len);
	                this.withScopedSyntax(function() {
	                    this.compile(node.body, frame);
	                });
	                this.emitLine('}');
	            }

	            this.emitLine('} else {'); {
	                // Iterate over the key/values of an object
	                var key = node.name.children[0];
	                var val = node.name.children[1];
	                var k = this.tmpid();
	                v = this.tmpid();
	                frame.set(key.value, k);
	                frame.set(val.value, v);

	                this.emitLine(i + ' = -1;');
	                this.emitLine('var ' + len + ' = runtime.keys(' + arr + ').length;');
	                this.emitLine('for(var ' + k + ' in ' + arr + ') {');
	                this.emitLine(i + '++;');
	                this.emitLine('var ' + v + ' = ' + arr + '[' + k + '];');
	                this.emitLine('frame.set("' + key.value + '", ' + k + ');');
	                this.emitLine('frame.set("' + val.value + '", ' + v + ');');

	                this.emitLoopBindings(node, arr, i, len);
	                this.withScopedSyntax(function() {
	                    this.compile(node.body, frame);
	                });
	                this.emitLine('}');
	            }

	            this.emitLine('}');
	        }
	        else {
	            // Generate a typical array iteration
	            v = this.tmpid();
	            frame.set(node.name.value, v);

	            this.emitLine('var ' + len + ' = ' + arr + '.length;');
	            this.emitLine('for(var ' + i + '=0; ' + i + ' < ' + arr + '.length; ' +
	                          i + '++) {');
	            this.emitLine('var ' + v + ' = ' + arr + '[' + i + '];');
	            this.emitLine('frame.set("' + node.name.value + '", ' + v + ');');

	            this.emitLoopBindings(node, arr, i, len);

	            this.withScopedSyntax(function() {
	                this.compile(node.body, frame);
	            });

	            this.emitLine('}');
	        }

	        this.emitLine('}');
	        if (node.else_) {
	          this.emitLine('if (!' + len + ') {');
	          this.compile(node.else_, frame);
	          this.emitLine('}');
	        }

	        this.emitLine('frame = frame.pop();');
	    },

	    _compileAsyncLoop: function(node, frame, parallel) {
	        // This shares some code with the For tag, but not enough to
	        // worry about. This iterates across an object asynchronously,
	        // but not in parallel.

	        var i = this.tmpid();
	        var len = this.tmpid();
	        var arr = this.tmpid();
	        var asyncMethod = parallel ? 'asyncAll' : 'asyncEach';
	        frame = frame.push();

	        this.emitLine('frame = frame.push();');

	        this.emit('var ' + arr + ' = ');
	        this._compileExpression(node.arr, frame);
	        this.emitLine(';');

	        if(node.name instanceof nodes.Array) {
	            this.emit('runtime.' + asyncMethod + '(' + arr + ', ' +
	                      node.name.children.length + ', function(');

	            lib.each(node.name.children, function(name) {
	                this.emit(name.value + ',');
	            }, this);

	            this.emit(i + ',' + len + ',next) {');

	            lib.each(node.name.children, function(name) {
	                var id = name.value;
	                frame.set(id, id);
	                this.emitLine('frame.set("' + id + '", ' + id + ');');
	            }, this);
	        }
	        else {
	            var id = node.name.value;
	            this.emitLine('runtime.' + asyncMethod + '(' + arr + ', 1, function(' + id + ', ' + i + ', ' + len + ',next) {');
	            this.emitLine('frame.set("' + id + '", ' + id + ');');
	            frame.set(id, id);
	        }

	        this.emitLoopBindings(node, arr, i, len);

	        this.withScopedSyntax(function() {
	            var buf;
	            if(parallel) {
	                buf = this.tmpid();
	                this.pushBufferId(buf);
	            }

	            this.compile(node.body, frame);
	            this.emitLine('next(' + i + (buf ? ',' + buf : '') + ');');

	            if(parallel) {
	                this.popBufferId();
	            }
	        });

	        var output = this.tmpid();
	        this.emitLine('}, ' + this.makeCallback(output));
	        this.addScopeLevel();

	        if(parallel) {
	            this.emitLine(this.buffer + ' += ' + output + ';');
	        }

	        if (node.else_) {
	          this.emitLine('if (!' + arr + '.length) {');
	          this.compile(node.else_, frame);
	          this.emitLine('}');
	        }

	        this.emitLine('frame = frame.pop();');
	    },

	    compileAsyncEach: function(node, frame) {
	        this._compileAsyncLoop(node, frame);
	    },

	    compileAsyncAll: function(node, frame) {
	        this._compileAsyncLoop(node, frame, true);
	    },

	    _compileMacro: function(node, frame) {
	        var args = [];
	        var kwargs = null;
	        var funcId = 'macro_' + this.tmpid();
	        var keepFrame = (frame !== undefined);

	        // Type check the definition of the args
	        lib.each(node.args.children, function(arg, i) {
	            if(i === node.args.children.length - 1 &&
	               arg instanceof nodes.Dict) {
	                kwargs = arg;
	            }
	            else {
	                this.assertType(arg, nodes.Symbol);
	                args.push(arg);
	            }
	        }, this);

	        var realNames = lib.map(args, function(n) { return 'l_' + n.value; });
	        realNames.push('kwargs');

	        // Quoted argument names
	        var argNames = lib.map(args, function(n) { return '"' + n.value + '"'; });
	        var kwargNames = lib.map((kwargs && kwargs.children) || [],
	                                 function(n) { return '"' + n.key.value + '"'; });

	        // We pass a function to makeMacro which destructures the
	        // arguments so support setting positional args with keywords
	        // args and passing keyword args as positional args
	        // (essentially default values). See runtime.js.
	        if (keepFrame) {
	            frame = frame.push(true);
	        } else {
	            frame = new Frame();
	        }
	        this.emitLines(
	            'var ' + funcId + ' = runtime.makeMacro(',
	            '[' + argNames.join(', ') + '], ',
	            '[' + kwargNames.join(', ') + '], ',
	            'function (' + realNames.join(', ') + ') {',
	            'var callerFrame = frame;',
	            'frame = ' + ((keepFrame) ? 'frame.push(true);' : 'new runtime.Frame();'),
	            'kwargs = kwargs || {};',
	            'if (kwargs.hasOwnProperty("caller")) {',
	            'frame.set("caller", kwargs.caller); }'
	        );

	        // Expose the arguments to the template. Don't need to use
	        // random names because the function
	        // will create a new run-time scope for us
	        lib.each(args, function(arg) {
	            this.emitLine('frame.set("' + arg.value + '", ' +
	                          'l_' + arg.value + ');');
	            frame.set(arg.value, 'l_' + arg.value);
	        }, this);

	        // Expose the keyword arguments
	        if(kwargs) {
	            lib.each(kwargs.children, function(pair) {
	                var name = pair.key.value;
	                this.emit('frame.set("' + name + '", ' +
	                          'kwargs.hasOwnProperty("' + name + '") ? ' +
	                          'kwargs["' + name + '"] : ');
	                this._compileExpression(pair.value, frame);
	                this.emitLine(');');
	            }, this);
	        }

	        var bufferId = this.tmpid();
	        this.pushBufferId(bufferId);

	        this.withScopedSyntax(function () {
	          this.compile(node.body, frame);
	        });

	        this.emitLine('frame = ' + ((keepFrame) ? 'frame.pop();' : 'callerFrame;'));
	        this.emitLine('return new runtime.SafeString(' + bufferId + ');');
	        this.emitLine('});');
	        this.popBufferId();

	        return funcId;
	    },

	    compileMacro: function(node, frame) {
	        var funcId = this._compileMacro(node);

	        // Expose the macro to the templates
	        var name = node.name.value;
	        frame.set(name, funcId);

	        if(frame.parent) {
	            this.emitLine('frame.set("' + name + '", ' + funcId + ');');
	        }
	        else {
	            if(node.name.value.charAt(0) !== '_') {
	                this.emitLine('context.addExport("' + name + '");');
	            }
	            this.emitLine('context.setVariable("' + name + '", ' + funcId + ');');
	        }
	    },

	    compileCaller: function(node, frame) {
	        // basically an anonymous "macro expression"
	        this.emit('(function (){');
	        var funcId = this._compileMacro(node, frame);
	        this.emit('return ' + funcId + ';})()');
	    },

	    compileImport: function(node, frame) {
	        var id = this.tmpid();
	        var target = node.target.value;

	        this.emit('env.getTemplate(');
	        this._compileExpression(node.template, frame);
	        this.emitLine(', false, '+this._templateName()+', false, ' + this.makeCallback(id));
	        this.addScopeLevel();

	        this.emitLine(id + '.getExported(' +
	            (node.withContext ? 'context.getVariables(), frame, ' : '') +
	            this.makeCallback(id));
	        this.addScopeLevel();

	        frame.set(target, id);

	        if(frame.parent) {
	            this.emitLine('frame.set("' + target + '", ' + id + ');');
	        }
	        else {
	            this.emitLine('context.setVariable("' + target + '", ' + id + ');');
	        }
	    },

	    compileFromImport: function(node, frame) {
	        var importedId = this.tmpid();

	        this.emit('env.getTemplate(');
	        this._compileExpression(node.template, frame);
	        this.emitLine(', false, '+this._templateName()+', false, ' + this.makeCallback(importedId));
	        this.addScopeLevel();

	        this.emitLine(importedId + '.getExported(' +
	            (node.withContext ? 'context.getVariables(), frame, ' : '') +
	            this.makeCallback(importedId));
	        this.addScopeLevel();

	        lib.each(node.names.children, function(nameNode) {
	            var name;
	            var alias;
	            var id = this.tmpid();

	            if(nameNode instanceof nodes.Pair) {
	                name = nameNode.key.value;
	                alias = nameNode.value.value;
	            }
	            else {
	                name = nameNode.value;
	                alias = name;
	            }

	            this.emitLine('if(' + importedId + '.hasOwnProperty("' + name + '")) {');
	            this.emitLine('var ' + id + ' = ' + importedId + '.' + name + ';');
	            this.emitLine('} else {');
	            this.emitLine('cb(new Error("cannot import \'' + name + '\'")); return;');
	            this.emitLine('}');

	            frame.set(alias, id);

	            if(frame.parent) {
	                this.emitLine('frame.set("' + alias + '", ' + id + ');');
	            }
	            else {
	                this.emitLine('context.setVariable("' + alias + '", ' + id + ');');
	            }
	        }, this);
	    },

	    compileBlock: function(node) {
	        var id = this.tmpid();

	        // If we are executing outside a block (creating a top-level
	        // block), we really don't want to execute its code because it
	        // will execute twice: once when the child template runs and
	        // again when the parent template runs. Note that blocks
	        // within blocks will *always* execute immediately *and*
	        // wherever else they are invoked (like used in a parent
	        // template). This may have behavioral differences from jinja
	        // because blocks can have side effects, but it seems like a
	        // waste of performance to always execute huge top-level
	        // blocks twice
	        if(!this.inBlock) {
	            this.emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : ');
	        }
	        this.emit('context.getBlock("' + node.name.value + '")');
	        if(!this.inBlock) {
	            this.emit(')');
	        }
	        this.emitLine('(env, context, frame, runtime, ' + this.makeCallback(id));
	        this.emitLine(this.buffer + ' += ' + id + ';');
	        this.addScopeLevel();
	    },

	    compileSuper: function(node, frame) {
	        var name = node.blockName.value;
	        var id = node.symbol.value;

	        this.emitLine('context.getSuper(env, ' +
	                      '"' + name + '", ' +
	                      'b_' + name + ', ' +
	                      'frame, runtime, '+
	                      this.makeCallback(id));
	        this.emitLine(id + ' = runtime.markSafe(' + id + ');');
	        this.addScopeLevel();
	        frame.set(id, id);
	    },

	    compileExtends: function(node, frame) {
	        var k = this.tmpid();

	        this.emit('env.getTemplate(');
	        this._compileExpression(node.template, frame);
	        this.emitLine(', true, '+this._templateName()+', false, ' + this.makeCallback('_parentTemplate'));

	        // extends is a dynamic tag and can occur within a block like
	        // `if`, so if this happens we need to capture the parent
	        // template in the top-level scope
	        this.emitLine('parentTemplate = _parentTemplate');

	        this.emitLine('for(var ' + k + ' in parentTemplate.blocks) {');
	        this.emitLine('context.addBlock(' + k +
	                      ', parentTemplate.blocks[' + k + ']);');
	        this.emitLine('}');

	        this.addScopeLevel();
	    },

	    compileInclude: function(node, frame) {
	        var id = this.tmpid();
	        var id2 = this.tmpid();

	        this.emitLine('var tasks = [];');
	        this.emitLine('tasks.push(');
	        this.emitLine('function(callback) {');
	        this.emit('env.getTemplate(');
	        this._compileExpression(node.template, frame);
	        this.emitLine(', false, '+this._templateName()+', ' + node.ignoreMissing + ', ' + this.makeCallback(id));
	        this.emitLine('callback(null,' + id + ');});');
	        this.emitLine('});');

	        this.emitLine('tasks.push(');
	        this.emitLine('function(template, callback){');
	        this.emitLine('template.render(' +
	            'context.getVariables(), frame, ' + this.makeCallback(id2));
	        this.emitLine('callback(null,' + id2 + ');});');
	        this.emitLine('});');

	        this.emitLine('tasks.push(');
	        this.emitLine('function(result, callback){');
	        this.emitLine(this.buffer + ' += result;');
	        this.emitLine('callback(null);');
	        this.emitLine('});');
	        this.emitLine('env.waterfall(tasks, function(){');
	        this.addScopeLevel();
	    },

	    compileTemplateData: function(node, frame) {
	        this.compileLiteral(node, frame);
	    },

	    compileCapture: function(node, frame) {
	        // we need to temporarily override the current buffer id as 'output'
	        // so the set block writes to the capture output instead of the buffer
	        var buffer = this.buffer;
	        this.buffer = 'output';
	        this.emitLine('(function() {');
	        this.emitLine('var output = "";');
	        this.withScopedSyntax(function () {
	            this.compile(node.body, frame);
	        });
	        this.emitLine('return output;');
	        this.emitLine('})()');
	        // and of course, revert back to the old buffer id
	        this.buffer = buffer;
	    },

	    compileOutput: function(node, frame) {
	        var children = node.children;
	        for(var i=0, l=children.length; i<l; i++) {
	            // TemplateData is a special case because it is never
	            // autoescaped, so simply output it for optimization
	            if(children[i] instanceof nodes.TemplateData) {
	                if(children[i].value) {
	                    this.emit(this.buffer + ' += ');
	                    this.compileLiteral(children[i], frame);
	                    this.emitLine(';');
	                }
	            }
	            else {
	                this.emit(this.buffer + ' += runtime.suppressValue(');
	                if(this.throwOnUndefined) {
	                    this.emit('runtime.ensureDefined(');
	                }
	                this.compile(children[i], frame);
	                if(this.throwOnUndefined) {
	                    this.emit(',' + node.lineno + ',' + node.colno + ')');
	                }
	                this.emit(', env.opts.autoescape);\n');
	            }
	        }
	    },

	    compileRoot: function(node, frame) {
	        if(frame) {
	            this.fail('compileRoot: root node can\'t have frame');
	        }

	        frame = new Frame();

	        this.emitFuncBegin('root');
	        this.emitLine('var parentTemplate = null;');
	        this._compileChildren(node, frame);
	        this.emitLine('if(parentTemplate) {');
	        this.emitLine('parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);');
	        this.emitLine('} else {');
	        this.emitLine('cb(null, ' + this.buffer +');');
	        this.emitLine('}');
	        this.emitFuncEnd(true);

	        this.inBlock = true;

	        var blockNames = [];

	        var i, name, block, blocks = node.findAll(nodes.Block);
	        for (i = 0; i < blocks.length; i++) {
	            block = blocks[i];
	            name = block.name.value;

	            if (blockNames.indexOf(name) !== -1) {
	                throw new Error('Block "' + name + '" defined more than once.');
	            }
	            blockNames.push(name);

	            this.emitFuncBegin('b_' + name);

	            var tmpFrame = new Frame();
	            this.emitLine('var frame = frame.push(true);');
	            this.compile(block.body, tmpFrame);
	            this.emitFuncEnd();
	        }

	        this.emitLine('return {');
	        for (i = 0; i < blocks.length; i++) {
	            block = blocks[i];
	            name = 'b_' + block.name.value;
	            this.emitLine(name + ': ' + name + ',');
	        }
	        this.emitLine('root: root\n};');
	    },

	    compile: function (node, frame) {
	        var _compile = this['compile' + node.typename];
	        if(_compile) {
	            _compile.call(this, node, frame);
	        }
	        else {
	            this.fail('compile: Cannot compile node: ' + node.typename,
	                      node.lineno,
	                      node.colno);
	        }
	    },

	    getCode: function() {
	        return this.codebuf.join('');
	    }
	});

	// var c = new Compiler();
	// var src = 'hello {% filter title %}' +
	//     'Hello madam how are you' +
	//     '{% endfilter %}'
	// var ast = transformer.transform(parser.parse(src));
	// nodes.printNodes(ast);
	// c.compile(ast);
	// var tmpl = c.getCode();
	// console.log(tmpl);

	module.exports = {
	    compile: function(src, asyncFilters, extensions, name, opts) {
	        var c = new Compiler(name, opts.throwOnUndefined);

	        // Run the extension preprocessors against the source.
	        if(extensions && extensions.length) {
	            for(var i=0; i<extensions.length; i++) {
	                if('preprocess' in extensions[i]) {
	                    src = extensions[i].preprocess(src, name);
	                }
	            }
	        }

	        c.compile(transformer.transform(
	            parser.parse(src,
	                         extensions,
	                         opts),
	            asyncFilters,
	            name
	        ));
	        return c.getCode();
	    },

	    Compiler: Compiler
	};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var lexer = __webpack_require__(9);
	var nodes = __webpack_require__(10);
	// jshint -W079
	var Object = __webpack_require__(6);
	var lib = __webpack_require__(1);

	var Parser = Object.extend({
	    init: function (tokens) {
	        this.tokens = tokens;
	        this.peeked = null;
	        this.breakOnBlocks = null;
	        this.dropLeadingWhitespace = false;

	        this.extensions = [];
	    },

	    nextToken: function (withWhitespace) {
	        var tok;

	        if(this.peeked) {
	            if(!withWhitespace && this.peeked.type === lexer.TOKEN_WHITESPACE) {
	                this.peeked = null;
	            }
	            else {
	                tok = this.peeked;
	                this.peeked = null;
	                return tok;
	            }
	        }

	        tok = this.tokens.nextToken();

	        if(!withWhitespace) {
	            while(tok && tok.type === lexer.TOKEN_WHITESPACE) {
	                tok = this.tokens.nextToken();
	            }
	        }

	        return tok;
	    },

	    peekToken: function () {
	        this.peeked = this.peeked || this.nextToken();
	        return this.peeked;
	    },

	    pushToken: function(tok) {
	        if(this.peeked) {
	            throw new Error('pushToken: can only push one token on between reads');
	        }
	        this.peeked = tok;
	    },

	    fail: function (msg, lineno, colno) {
	        if((lineno === undefined || colno === undefined) && this.peekToken()) {
	            var tok = this.peekToken();
	            lineno = tok.lineno;
	            colno = tok.colno;
	        }
	        if (lineno !== undefined) lineno += 1;
	        if (colno !== undefined) colno += 1;

	        throw new lib.TemplateError(msg, lineno, colno);
	    },

	    skip: function(type) {
	        var tok = this.nextToken();
	        if(!tok || tok.type !== type) {
	            this.pushToken(tok);
	            return false;
	        }
	        return true;
	    },

	    expect: function(type) {
	        var tok = this.nextToken();
	        if(tok.type !== type) {
	            this.fail('expected ' + type + ', got ' + tok.type,
	                      tok.lineno,
	                      tok.colno);
	        }
	        return tok;
	    },

	    skipValue: function(type, val) {
	        var tok = this.nextToken();
	        if(!tok || tok.type !== type || tok.value !== val) {
	            this.pushToken(tok);
	            return false;
	        }
	        return true;
	    },

	    skipSymbol: function(val) {
	        return this.skipValue(lexer.TOKEN_SYMBOL, val);
	    },

	    advanceAfterBlockEnd: function(name) {
	        var tok;
	        if(!name) {
	            tok = this.peekToken();

	            if(!tok) {
	                this.fail('unexpected end of file');
	            }

	            if(tok.type !== lexer.TOKEN_SYMBOL) {
	                this.fail('advanceAfterBlockEnd: expected symbol token or ' +
	                          'explicit name to be passed');
	            }

	            name = this.nextToken().value;
	        }

	        tok = this.nextToken();

	        if(tok && tok.type === lexer.TOKEN_BLOCK_END) {
	            if(tok.value.charAt(0) === '-') {
	                this.dropLeadingWhitespace = true;
	            }
	        }
	        else {
	            this.fail('expected block end in ' + name + ' statement');
	        }

	        return tok;
	    },

	    advanceAfterVariableEnd: function() {
	        var tok = this.nextToken();

	        if(tok && tok.type === lexer.TOKEN_VARIABLE_END) {
	            this.dropLeadingWhitespace = tok.value.charAt(
	                tok.value.length - this.tokens.tags.VARIABLE_END.length - 1
	            ) === '-';
	        } else {
	            this.pushToken(tok);
	            this.fail('expected variable end');
	        }
	    },

	    parseFor: function() {
	        var forTok = this.peekToken();
	        var node;
	        var endBlock;

	        if(this.skipSymbol('for')) {
	            node = new nodes.For(forTok.lineno, forTok.colno);
	            endBlock = 'endfor';
	        }
	        else if(this.skipSymbol('asyncEach')) {
	            node = new nodes.AsyncEach(forTok.lineno, forTok.colno);
	            endBlock = 'endeach';
	        }
	        else if(this.skipSymbol('asyncAll')) {
	            node = new nodes.AsyncAll(forTok.lineno, forTok.colno);
	            endBlock = 'endall';
	        }
	        else {
	            this.fail('parseFor: expected for{Async}', forTok.lineno, forTok.colno);
	        }

	        node.name = this.parsePrimary();

	        if(!(node.name instanceof nodes.Symbol)) {
	            this.fail('parseFor: variable name expected for loop');
	        }

	        var type = this.peekToken().type;
	        if(type === lexer.TOKEN_COMMA) {
	            // key/value iteration
	            var key = node.name;
	            node.name = new nodes.Array(key.lineno, key.colno);
	            node.name.addChild(key);

	            while(this.skip(lexer.TOKEN_COMMA)) {
	                var prim = this.parsePrimary();
	                node.name.addChild(prim);
	            }
	        }

	        if(!this.skipSymbol('in')) {
	            this.fail('parseFor: expected "in" keyword for loop',
	                      forTok.lineno,
	                      forTok.colno);
	        }

	        node.arr = this.parseExpression();
	        this.advanceAfterBlockEnd(forTok.value);

	        node.body = this.parseUntilBlocks(endBlock, 'else');

	        if(this.skipSymbol('else')) {
	            this.advanceAfterBlockEnd('else');
	            node.else_ = this.parseUntilBlocks(endBlock);
	        }

	        this.advanceAfterBlockEnd();

	        return node;
	    },

	    parseMacro: function() {
	        var macroTok = this.peekToken();
	        if(!this.skipSymbol('macro')) {
	            this.fail('expected macro');
	        }

	        var name = this.parsePrimary(true);
	        var args = this.parseSignature();
	        var node = new nodes.Macro(macroTok.lineno,
	                                   macroTok.colno,
	                                   name,
	                                   args);

	        this.advanceAfterBlockEnd(macroTok.value);
	        node.body = this.parseUntilBlocks('endmacro');
	        this.advanceAfterBlockEnd();

	        return node;
	    },

	    parseCall: function() {
	        // a call block is parsed as a normal FunCall, but with an added
	        // 'caller' kwarg which is a Caller node.
	        var callTok = this.peekToken();
	        if(!this.skipSymbol('call')) {
	            this.fail('expected call');
	        }

	        var callerArgs = this.parseSignature(true) || new nodes.NodeList();
	        var macroCall = this.parsePrimary();

	        this.advanceAfterBlockEnd(callTok.value);
	        var body = this.parseUntilBlocks('endcall');
	        this.advanceAfterBlockEnd();

	        var callerName = new nodes.Symbol(callTok.lineno,
	                                          callTok.colno,
	                                          'caller');
	        var callerNode = new nodes.Caller(callTok.lineno,
	                                          callTok.colno,
	                                          callerName,
	                                          callerArgs,
	                                          body);

	        // add the additional caller kwarg, adding kwargs if necessary
	        var args = macroCall.args.children;
	        if (!(args[args.length-1] instanceof nodes.KeywordArgs)) {
	          args.push(new nodes.KeywordArgs());
	        }
	        var kwargs = args[args.length - 1];
	        kwargs.addChild(new nodes.Pair(callTok.lineno,
	                                       callTok.colno,
	                                       callerName,
	                                       callerNode));

	        return new nodes.Output(callTok.lineno,
	                                callTok.colno,
	                                [macroCall]);
	    },

	    parseWithContext: function() {
	        var tok = this.peekToken();

	        var withContext = null;

	        if(this.skipSymbol('with')) {
	            withContext = true;
	        }
	        else if(this.skipSymbol('without')) {
	            withContext = false;
	        }

	        if(withContext !== null) {
	            if(!this.skipSymbol('context')) {
	                this.fail('parseFrom: expected context after with/without',
	                            tok.lineno,
	                            tok.colno);
	            }
	        }

	        return withContext;
	    },

	    parseImport: function() {
	        var importTok = this.peekToken();
	        if(!this.skipSymbol('import')) {
	            this.fail('parseImport: expected import',
	                      importTok.lineno,
	                      importTok.colno);
	        }

	        var template = this.parseExpression();

	        if(!this.skipSymbol('as')) {
	            this.fail('parseImport: expected "as" keyword',
	                            importTok.lineno,
	                            importTok.colno);
	        }

	        var target = this.parseExpression();

	        var withContext = this.parseWithContext();

	        var node = new nodes.Import(importTok.lineno,
	                                    importTok.colno,
	                                    template,
	                                    target,
	                                    withContext);

	        this.advanceAfterBlockEnd(importTok.value);

	        return node;
	    },

	    parseFrom: function() {
	        var fromTok = this.peekToken();
	        if(!this.skipSymbol('from')) {
	            this.fail('parseFrom: expected from');
	        }

	        var template = this.parseExpression();

	        if(!this.skipSymbol('import')) {
	            this.fail('parseFrom: expected import',
	                            fromTok.lineno,
	                            fromTok.colno);
	        }

	        var names = new nodes.NodeList(),
	            withContext;

	        while(1) {
	            var nextTok = this.peekToken();
	            if(nextTok.type === lexer.TOKEN_BLOCK_END) {
	                if(!names.children.length) {
	                    this.fail('parseFrom: Expected at least one import name',
	                              fromTok.lineno,
	                              fromTok.colno);
	                }

	                // Since we are manually advancing past the block end,
	                // need to keep track of whitespace control (normally
	                // this is done in `advanceAfterBlockEnd`
	                if(nextTok.value.charAt(0) === '-') {
	                    this.dropLeadingWhitespace = true;
	                }

	                this.nextToken();
	                break;
	            }

	            if(names.children.length > 0 && !this.skip(lexer.TOKEN_COMMA)) {
	                this.fail('parseFrom: expected comma',
	                                fromTok.lineno,
	                                fromTok.colno);
	            }

	            var name = this.parsePrimary();
	            if(name.value.charAt(0) === '_') {
	                this.fail('parseFrom: names starting with an underscore ' +
	                          'cannot be imported',
	                          name.lineno,
	                          name.colno);
	            }

	            if(this.skipSymbol('as')) {
	                var alias = this.parsePrimary();
	                names.addChild(new nodes.Pair(name.lineno,
	                                              name.colno,
	                                              name,
	                                              alias));
	            }
	            else {
	                names.addChild(name);
	            }

	            withContext = this.parseWithContext();
	        }

	        return new nodes.FromImport(fromTok.lineno,
	                                    fromTok.colno,
	                                    template,
	                                    names,
	                                    withContext);
	    },

	    parseBlock: function() {
	        var tag = this.peekToken();
	        if(!this.skipSymbol('block')) {
	            this.fail('parseBlock: expected block', tag.lineno, tag.colno);
	        }

	        var node = new nodes.Block(tag.lineno, tag.colno);

	        node.name = this.parsePrimary();
	        if(!(node.name instanceof nodes.Symbol)) {
	            this.fail('parseBlock: variable name expected',
	                      tag.lineno,
	                      tag.colno);
	        }

	        this.advanceAfterBlockEnd(tag.value);

	        node.body = this.parseUntilBlocks('endblock');
	        this.skipSymbol('endblock');
	        this.skipSymbol(node.name.value);

	        var tok = this.peekToken();
	        if(!tok) {
	            this.fail('parseBlock: expected endblock, got end of file');
	        }

	        this.advanceAfterBlockEnd(tok.value);

	        return node;
	    },

	    parseExtends: function() {
	        var tagName = 'extends';
	        var tag = this.peekToken();
	        if(!this.skipSymbol(tagName)) {
	            this.fail('parseTemplateRef: expected '+ tagName);
	        }

	        var node = new nodes.Extends(tag.lineno, tag.colno);
	        node.template = this.parseExpression();

	        this.advanceAfterBlockEnd(tag.value);
	        return node;
	    },

	    parseInclude: function() {
	        var tagName = 'include';
	        var tag = this.peekToken();
	        if(!this.skipSymbol(tagName)) {
	            this.fail('parseInclude: expected '+ tagName);
	        }

	        var node = new nodes.Include(tag.lineno, tag.colno);
	        node.template = this.parseExpression();

	        if(this.skipSymbol('ignore') && this.skipSymbol('missing')) {
	            node.ignoreMissing = true;
	        }

	        this.advanceAfterBlockEnd(tag.value);
	        return node;
	    },

	    parseIf: function() {
	        var tag = this.peekToken();
	        var node;

	        if(this.skipSymbol('if') || this.skipSymbol('elif') || this.skipSymbol('elseif')) {
	            node = new nodes.If(tag.lineno, tag.colno);
	        }
	        else if(this.skipSymbol('ifAsync')) {
	            node = new nodes.IfAsync(tag.lineno, tag.colno);
	        }
	        else {
	            this.fail('parseIf: expected if, elif, or elseif',
	                      tag.lineno,
	                      tag.colno);
	        }

	        node.cond = this.parseExpression();
	        this.advanceAfterBlockEnd(tag.value);

	        node.body = this.parseUntilBlocks('elif', 'elseif', 'else', 'endif');
	        var tok = this.peekToken();

	        switch(tok && tok.value) {
	        case 'elseif':
	        case 'elif':
	            node.else_ = this.parseIf();
	            break;
	        case 'else':
	            this.advanceAfterBlockEnd();
	            node.else_ = this.parseUntilBlocks('endif');
	            this.advanceAfterBlockEnd();
	            break;
	        case 'endif':
	            node.else_ = null;
	            this.advanceAfterBlockEnd();
	            break;
	        default:
	            this.fail('parseIf: expected elif, else, or endif, ' +
	                      'got end of file');
	        }

	        return node;
	    },

	    parseSet: function() {
	        var tag = this.peekToken();
	        if(!this.skipSymbol('set')) {
	            this.fail('parseSet: expected set', tag.lineno, tag.colno);
	        }

	        var node = new nodes.Set(tag.lineno, tag.colno, []);

	        var target;
	        while((target = this.parsePrimary())) {
	            node.targets.push(target);

	            if(!this.skip(lexer.TOKEN_COMMA)) {
	                break;
	            }
	        }

	        if(!this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
	            if (!this.skip(lexer.TOKEN_BLOCK_END)) {
	                this.fail('parseSet: expected = or block end in set tag',
	                          tag.lineno,
	                          tag.colno);
	            }
	            else {
	                node.body = new nodes.Capture(
	                    tag.lineno,
	                    tag.colno,
	                    this.parseUntilBlocks('endset')
	                );
	                node.value = null;
	                this.advanceAfterBlockEnd();
	            }
	        }
	        else {
	            node.value = this.parseExpression();
	            this.advanceAfterBlockEnd(tag.value);
	        }

	        return node;
	    },

	    parseStatement: function () {
	        var tok = this.peekToken();
	        var node;

	        if(tok.type !== lexer.TOKEN_SYMBOL) {
	            this.fail('tag name expected', tok.lineno, tok.colno);
	        }

	        if(this.breakOnBlocks &&
	           lib.indexOf(this.breakOnBlocks, tok.value) !== -1) {
	            return null;
	        }

	        switch(tok.value) {
	        case 'raw': return this.parseRaw();
	        case 'verbatim': return this.parseRaw('verbatim');
	        case 'if':
	        case 'ifAsync':
	            return this.parseIf();
	        case 'for':
	        case 'asyncEach':
	        case 'asyncAll':
	            return this.parseFor();
	        case 'block': return this.parseBlock();
	        case 'extends': return this.parseExtends();
	        case 'include': return this.parseInclude();
	        case 'set': return this.parseSet();
	        case 'macro': return this.parseMacro();
	        case 'call': return this.parseCall();
	        case 'import': return this.parseImport();
	        case 'from': return this.parseFrom();
	        case 'filter': return this.parseFilterStatement();
	        default:
	            if (this.extensions.length) {
	                for (var i = 0; i < this.extensions.length; i++) {
	                    var ext = this.extensions[i];
	                    if (lib.indexOf(ext.tags || [], tok.value) !== -1) {
	                        return ext.parse(this, nodes, lexer);
	                    }
	                }
	            }
	            this.fail('unknown block tag: ' + tok.value, tok.lineno, tok.colno);
	        }

	        return node;
	    },

	    parseRaw: function(tagName) {
	        tagName = tagName || 'raw';
	        var endTagName = 'end' + tagName;
	        // Look for upcoming raw blocks (ignore all other kinds of blocks)
	        var rawBlockRegex = new RegExp('([\\s\\S]*?){%\\s*(' + tagName + '|' + endTagName + ')\\s*(?=%})%}');
	        var rawLevel = 1;
	        var str = '';
	        var matches = null;

	        // Skip opening raw token
	        // Keep this token to track line and column numbers
	        var begun = this.advanceAfterBlockEnd();

	        // Exit when there's nothing to match
	        // or when we've found the matching "endraw" block
	        while((matches = this.tokens._extractRegex(rawBlockRegex)) && rawLevel > 0) {
	            var all = matches[0];
	            var pre = matches[1];
	            var blockName = matches[2];

	            // Adjust rawlevel
	            if(blockName === tagName) {
	                rawLevel += 1;
	            } else if(blockName === endTagName) {
	                rawLevel -= 1;
	            }

	            // Add to str
	            if(rawLevel === 0) {
	                // We want to exclude the last "endraw"
	                str += pre;
	                // Move tokenizer to beginning of endraw block
	                this.tokens.backN(all.length - pre.length);
	            } else {
	                str += all;
	            }
	        }

	        return new nodes.Output(
	            begun.lineno,
	            begun.colno,
	            [new nodes.TemplateData(begun.lineno, begun.colno, str)]
	        );
	    },

	    parsePostfix: function(node) {
	        var lookup, tok = this.peekToken();

	        while(tok) {
	            if(tok.type === lexer.TOKEN_LEFT_PAREN) {
	                // Function call
	                node = new nodes.FunCall(tok.lineno,
	                                         tok.colno,
	                                         node,
	                                         this.parseSignature());
	            }
	            else if(tok.type === lexer.TOKEN_LEFT_BRACKET) {
	                // Reference
	                lookup = this.parseAggregate();
	                if(lookup.children.length > 1) {
	                    this.fail('invalid index');
	                }

	                node =  new nodes.LookupVal(tok.lineno,
	                                            tok.colno,
	                                            node,
	                                            lookup.children[0]);
	            }
	            else if(tok.type === lexer.TOKEN_OPERATOR && tok.value === '.') {
	                // Reference
	                this.nextToken();
	                var val = this.nextToken();

	                if(val.type !== lexer.TOKEN_SYMBOL) {
	                    this.fail('expected name as lookup value, got ' + val.value,
	                              val.lineno,
	                              val.colno);
	                }

	                // Make a literal string because it's not a variable
	                // reference
	                lookup = new nodes.Literal(val.lineno,
	                                               val.colno,
	                                               val.value);

	                node =  new nodes.LookupVal(tok.lineno,
	                                            tok.colno,
	                                            node,
	                                            lookup);
	            }
	            else {
	                break;
	            }

	            tok = this.peekToken();
	        }

	        return node;
	    },

	    parseExpression: function() {
	        var node = this.parseInlineIf();
	        return node;
	    },

	    parseInlineIf: function() {
	        var node = this.parseOr();
	        if(this.skipSymbol('if')) {
	            var cond_node = this.parseOr();
	            var body_node = node;
	            node = new nodes.InlineIf(node.lineno, node.colno);
	            node.body = body_node;
	            node.cond = cond_node;
	            if(this.skipSymbol('else')) {
	                node.else_ = this.parseOr();
	            } else {
	                node.else_ = null;
	            }
	        }

	        return node;
	    },

	    parseOr: function() {
	        var node = this.parseAnd();
	        while(this.skipSymbol('or')) {
	            var node2 = this.parseAnd();
	            node = new nodes.Or(node.lineno,
	                                node.colno,
	                                node,
	                                node2);
	        }
	        return node;
	    },

	    parseAnd: function() {
	        var node = this.parseNot();
	        while(this.skipSymbol('and')) {
	            var node2 = this.parseNot();
	            node = new nodes.And(node.lineno,
	                                 node.colno,
	                                 node,
	                                 node2);
	        }
	        return node;
	    },

	    parseNot: function() {
	        var tok = this.peekToken();
	        if(this.skipSymbol('not')) {
	            return new nodes.Not(tok.lineno,
	                                 tok.colno,
	                                 this.parseNot());
	        }
	        return this.parseIn();
	    },

	    parseIn: function() {
	      var node = this.parseCompare();
	      while(1) {
	        // check if the next token is 'not'
	        var tok = this.nextToken();
	        if (!tok) { break; }
	        var invert = tok.type === lexer.TOKEN_SYMBOL && tok.value === 'not';
	        // if it wasn't 'not', put it back
	        if (!invert) { this.pushToken(tok); }
	        if (this.skipSymbol('in')) {
	          var node2 = this.parseCompare();
	          node = new nodes.In(node.lineno,
	                              node.colno,
	                              node,
	                              node2);
	          if (invert) {
	            node = new nodes.Not(node.lineno,
	                                 node.colno,
	                                 node);
	          }
	        }
	        else {
	          // if we'd found a 'not' but this wasn't an 'in', put back the 'not'
	          if (invert) { this.pushToken(tok); }
	          break;
	        }
	      }
	      return node;
	    },

	    parseCompare: function() {
	        var compareOps = ['==', '===', '!=', '!==', '<', '>', '<=', '>='];
	        var expr = this.parseConcat();
	        var ops = [];

	        while(1) {
	            var tok = this.nextToken();

	            if(!tok) {
	                break;
	            }
	            else if(lib.indexOf(compareOps, tok.value) !== -1) {
	                ops.push(new nodes.CompareOperand(tok.lineno,
	                                                  tok.colno,
	                                                  this.parseConcat(),
	                                                  tok.value));
	            }
	            else {
	                this.pushToken(tok);
	                break;
	            }
	        }

	        if(ops.length) {
	            return new nodes.Compare(ops[0].lineno,
	                                     ops[0].colno,
	                                     expr,
	                                     ops);
	        }
	        else {
	            return expr;
	        }
	    },

	    // finds the '~' for string concatenation
	    parseConcat: function(){
	        var node = this.parseAdd();
	        while(this.skipValue(lexer.TOKEN_TILDE, '~')) {
	            var node2 = this.parseAdd();
	            node = new nodes.Concat(node.lineno,
	                                 node.colno,
	                                 node,
	                                 node2);
	        }
	        return node;
	    },

	    parseAdd: function() {
	        var node = this.parseSub();
	        while(this.skipValue(lexer.TOKEN_OPERATOR, '+')) {
	            var node2 = this.parseSub();
	            node = new nodes.Add(node.lineno,
	                                 node.colno,
	                                 node,
	                                 node2);
	        }
	        return node;
	    },

	    parseSub: function() {
	        var node = this.parseMul();
	        while(this.skipValue(lexer.TOKEN_OPERATOR, '-')) {
	            var node2 = this.parseMul();
	            node = new nodes.Sub(node.lineno,
	                                 node.colno,
	                                 node,
	                                 node2);
	        }
	        return node;
	    },

	    parseMul: function() {
	        var node = this.parseDiv();
	        while(this.skipValue(lexer.TOKEN_OPERATOR, '*')) {
	            var node2 = this.parseDiv();
	            node = new nodes.Mul(node.lineno,
	                                 node.colno,
	                                 node,
	                                 node2);
	        }
	        return node;
	    },

	    parseDiv: function() {
	        var node = this.parseFloorDiv();
	        while(this.skipValue(lexer.TOKEN_OPERATOR, '/')) {
	            var node2 = this.parseFloorDiv();
	            node = new nodes.Div(node.lineno,
	                                 node.colno,
	                                 node,
	                                 node2);
	        }
	        return node;
	    },

	    parseFloorDiv: function() {
	        var node = this.parseMod();
	        while(this.skipValue(lexer.TOKEN_OPERATOR, '//')) {
	            var node2 = this.parseMod();
	            node = new nodes.FloorDiv(node.lineno,
	                                      node.colno,
	                                      node,
	                                      node2);
	        }
	        return node;
	    },

	    parseMod: function() {
	        var node = this.parsePow();
	        while(this.skipValue(lexer.TOKEN_OPERATOR, '%')) {
	            var node2 = this.parsePow();
	            node = new nodes.Mod(node.lineno,
	                                 node.colno,
	                                 node,
	                                 node2);
	        }
	        return node;
	    },

	    parsePow: function() {
	        var node = this.parseUnary();
	        while(this.skipValue(lexer.TOKEN_OPERATOR, '**')) {
	            var node2 = this.parseUnary();
	            node = new nodes.Pow(node.lineno,
	                                 node.colno,
	                                 node,
	                                 node2);
	        }
	        return node;
	    },

	    parseUnary: function(noFilters) {
	        var tok = this.peekToken();
	        var node;

	        if(this.skipValue(lexer.TOKEN_OPERATOR, '-')) {
	            node = new nodes.Neg(tok.lineno,
	                                 tok.colno,
	                                 this.parseUnary(true));
	        }
	        else if(this.skipValue(lexer.TOKEN_OPERATOR, '+')) {
	            node = new nodes.Pos(tok.lineno,
	                                 tok.colno,
	                                 this.parseUnary(true));
	        }
	        else {
	            node = this.parsePrimary();
	        }

	        if(!noFilters) {
	            node = this.parseFilter(node);
	        }

	        return node;
	    },

	    parsePrimary: function (noPostfix) {
	        var tok = this.nextToken();
	        var val;
	        var node = null;

	        if(!tok) {
	            this.fail('expected expression, got end of file');
	        }
	        else if(tok.type === lexer.TOKEN_STRING) {
	            val = tok.value;
	        }
	        else if(tok.type === lexer.TOKEN_INT) {
	            val = parseInt(tok.value, 10);
	        }
	        else if(tok.type === lexer.TOKEN_FLOAT) {
	            val = parseFloat(tok.value);
	        }
	        else if(tok.type === lexer.TOKEN_BOOLEAN) {
	            if(tok.value === 'true') {
	                val = true;
	            }
	            else if(tok.value === 'false') {
	                val = false;
	            }
	            else {
	                this.fail('invalid boolean: ' + tok.value,
	                          tok.lineno,
	                          tok.colno);
	            }
	        }
	        else if(tok.type === lexer.TOKEN_NONE) {
	            val = null;
	        }
	        else if (tok.type === lexer.TOKEN_REGEX) {
	            val = new RegExp(tok.value.body, tok.value.flags);
	        }

	        if(val !== undefined) {
	            node = new nodes.Literal(tok.lineno, tok.colno, val);
	        }
	        else if(tok.type === lexer.TOKEN_SYMBOL) {
	            node = new nodes.Symbol(tok.lineno, tok.colno, tok.value);
	        }
	        else {
	            // See if it's an aggregate type, we need to push the
	            // current delimiter token back on
	            this.pushToken(tok);
	            node = this.parseAggregate();
	        }

	        if(!noPostfix) {
	            node = this.parsePostfix(node);
	        }

	        if(node) {
	            return node;
	        }
	        else {
	            this.fail('unexpected token: ' + tok.value,
	                      tok.lineno,
	                      tok.colno);
	        }
	    },

	    parseFilterName: function() {
	        var tok = this.expect(lexer.TOKEN_SYMBOL);
	        var name = tok.value;

	        while(this.skipValue(lexer.TOKEN_OPERATOR, '.')) {
	            name += '.' + this.expect(lexer.TOKEN_SYMBOL).value;
	        }

	        return new nodes.Symbol(tok.lineno, tok.colno, name);
	    },

	    parseFilterArgs: function(node) {
	        if(this.peekToken().type === lexer.TOKEN_LEFT_PAREN) {
	            // Get a FunCall node and add the parameters to the
	            // filter
	            var call = this.parsePostfix(node);
	            return call.args.children;
	        }
	        return [];
	    },

	    parseFilter: function(node) {
	        while(this.skip(lexer.TOKEN_PIPE)) {
	            var name = this.parseFilterName();

	            node = new nodes.Filter(
	                name.lineno,
	                name.colno,
	                name,
	                new nodes.NodeList(
	                    name.lineno,
	                    name.colno,
	                    [node].concat(this.parseFilterArgs(node))
	                )
	            );
	        }

	        return node;
	    },

	    parseFilterStatement: function() {
	        var filterTok = this.peekToken();
	        if(!this.skipSymbol('filter')) {
	            this.fail('parseFilterStatement: expected filter');
	        }

	        var name = this.parseFilterName();
	        var args = this.parseFilterArgs(name);

	        this.advanceAfterBlockEnd(filterTok.value);
	        var body = new nodes.Capture(
	            name.lineno,
	            name.colno,
	            this.parseUntilBlocks('endfilter')
	        );
	        this.advanceAfterBlockEnd();

	        var node = new nodes.Filter(
	            name.lineno,
	            name.colno,
	            name,
	            new nodes.NodeList(
	                name.lineno,
	                name.colno,
	                [body].concat(args)
	            )
	        );

	        return new nodes.Output(
	            name.lineno,
	            name.colno,
	            [node]
	        );
	    },

	    parseAggregate: function() {
	        var tok = this.nextToken();
	        var node;

	        switch(tok.type) {
	        case lexer.TOKEN_LEFT_PAREN:
	            node = new nodes.Group(tok.lineno, tok.colno); break;
	        case lexer.TOKEN_LEFT_BRACKET:
	            node = new nodes.Array(tok.lineno, tok.colno); break;
	        case lexer.TOKEN_LEFT_CURLY:
	            node = new nodes.Dict(tok.lineno, tok.colno); break;
	        default:
	            return null;
	        }

	        while(1) {
	            var type = this.peekToken().type;
	            if(type === lexer.TOKEN_RIGHT_PAREN ||
	               type === lexer.TOKEN_RIGHT_BRACKET ||
	               type === lexer.TOKEN_RIGHT_CURLY) {
	                this.nextToken();
	                break;
	            }

	            if(node.children.length > 0) {
	                if(!this.skip(lexer.TOKEN_COMMA)) {
	                    this.fail('parseAggregate: expected comma after expression',
	                              tok.lineno,
	                              tok.colno);
	                }
	            }

	            if(node instanceof nodes.Dict) {
	                // TODO: check for errors
	                var key = this.parsePrimary();

	                // We expect a key/value pair for dicts, separated by a
	                // colon
	                if(!this.skip(lexer.TOKEN_COLON)) {
	                    this.fail('parseAggregate: expected colon after dict key',
	                        tok.lineno,
	                        tok.colno);
	                }

	                // TODO: check for errors
	                var value = this.parseExpression();
	                node.addChild(new nodes.Pair(key.lineno,
	                                             key.colno,
	                                             key,
	                                             value));
	            }
	            else {
	                // TODO: check for errors
	                var expr = this.parseExpression();
	                node.addChild(expr);
	            }
	        }

	        return node;
	    },

	    parseSignature: function(tolerant, noParens) {
	        var tok = this.peekToken();
	        if(!noParens && tok.type !== lexer.TOKEN_LEFT_PAREN) {
	            if(tolerant) {
	                return null;
	            }
	            else {
	                this.fail('expected arguments', tok.lineno, tok.colno);
	            }
	        }

	        if(tok.type === lexer.TOKEN_LEFT_PAREN) {
	            tok = this.nextToken();
	        }

	        var args = new nodes.NodeList(tok.lineno, tok.colno);
	        var kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);
	        var checkComma = false;

	        while(1) {
	            tok = this.peekToken();
	            if(!noParens && tok.type === lexer.TOKEN_RIGHT_PAREN) {
	                this.nextToken();
	                break;
	            }
	            else if(noParens && tok.type === lexer.TOKEN_BLOCK_END) {
	                break;
	            }

	            if(checkComma && !this.skip(lexer.TOKEN_COMMA)) {
	                this.fail('parseSignature: expected comma after expression',
	                          tok.lineno,
	                          tok.colno);
	            }
	            else {
	                var arg = this.parseExpression();

	                if(this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
	                    kwargs.addChild(
	                        new nodes.Pair(arg.lineno,
	                                       arg.colno,
	                                       arg,
	                                       this.parseExpression())
	                    );
	                }
	                else {
	                    args.addChild(arg);
	                }
	            }

	            checkComma = true;
	        }

	        if(kwargs.children.length) {
	            args.addChild(kwargs);
	        }

	        return args;
	    },

	    parseUntilBlocks: function(/* blockNames */) {
	        var prev = this.breakOnBlocks;
	        this.breakOnBlocks = lib.toArray(arguments);

	        var ret = this.parse();

	        this.breakOnBlocks = prev;
	        return ret;
	    },

	    parseNodes: function () {
	        var tok;
	        var buf = [];

	        while((tok = this.nextToken())) {
	            if(tok.type === lexer.TOKEN_DATA) {
	                var data = tok.value;
	                var nextToken = this.peekToken();
	                var nextVal = nextToken && nextToken.value;

	                // If the last token has "-" we need to trim the
	                // leading whitespace of the data. This is marked with
	                // the `dropLeadingWhitespace` variable.
	                if(this.dropLeadingWhitespace) {
	                    // TODO: this could be optimized (don't use regex)
	                    data = data.replace(/^\s*/, '');
	                    this.dropLeadingWhitespace = false;
	                }

	                // Same for the succeeding block start token
	                if(nextToken &&
	                    ((nextToken.type === lexer.TOKEN_BLOCK_START &&
	                      nextVal.charAt(nextVal.length - 1) === '-') ||
	                    (nextToken.type === lexer.TOKEN_VARIABLE_START &&
	                      nextVal.charAt(this.tokens.tags.VARIABLE_START.length)
	                        === '-') ||
	                    (nextToken.type === lexer.TOKEN_COMMENT &&
	                      nextVal.charAt(this.tokens.tags.COMMENT_START.length)
	                        === '-'))) {
	                    // TODO: this could be optimized (don't use regex)
	                    data = data.replace(/\s*$/, '');
	                }

	                buf.push(new nodes.Output(tok.lineno,
	                                          tok.colno,
	                                          [new nodes.TemplateData(tok.lineno,
	                                                                  tok.colno,
	                                                                  data)]));
	            }
	            else if(tok.type === lexer.TOKEN_BLOCK_START) {
	                this.dropLeadingWhitespace = false;
	                var n = this.parseStatement();
	                if(!n) {
	                    break;
	                }
	                buf.push(n);
	            }
	            else if(tok.type === lexer.TOKEN_VARIABLE_START) {
	                var e = this.parseExpression();
	                this.dropLeadingWhitespace = false;
	                this.advanceAfterVariableEnd();
	                buf.push(new nodes.Output(tok.lineno, tok.colno, [e]));
	            }
	            else if(tok.type === lexer.TOKEN_COMMENT) {
	                this.dropLeadingWhitespace = tok.value.charAt(
	                    tok.value.length - this.tokens.tags.COMMENT_END.length - 1
	                ) === '-';
	            } else {
	                // Ignore comments, otherwise this should be an error
	                this.fail('Unexpected token at top-level: ' +
	                                tok.type, tok.lineno, tok.colno);

	            }
	        }

	        return buf;
	    },

	    parse: function() {
	        return new nodes.NodeList(0, 0, this.parseNodes());
	    },

	    parseAsRoot: function() {
	        return new nodes.Root(0, 0, this.parseNodes());
	    }
	});

	// var util = require('util');

	// var l = lexer.lex('{%- if x -%}\n hello {% endif %}');
	// var t;
	// while((t = l.nextToken())) {
	//     console.log(util.inspect(t));
	// }

	// var p = new Parser(lexer.lex('hello {% filter title %}' +
	//                              'Hello madam how are you' +
	//                              '{% endfilter %}'));
	// var n = p.parseAsRoot();
	// nodes.printNodes(n);

	module.exports = {
	    parse: function(src, extensions, opts) {
	        var p = new Parser(lexer.lex(src, opts));
	        if (extensions !== undefined) {
	            p.extensions = extensions;
	        }
	        return p.parseAsRoot();
	    },
	    Parser: Parser
	};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var lib = __webpack_require__(1);

	var whitespaceChars = ' \n\t\r\u00A0';
	var delimChars = '()[]{}%*-+~/#,:|.<>=!';
	var intChars = '0123456789';

	var BLOCK_START = '{%';
	var BLOCK_END = '%}';
	var VARIABLE_START = '{{';
	var VARIABLE_END = '}}';
	var COMMENT_START = '{#';
	var COMMENT_END = '#}';

	var TOKEN_STRING = 'string';
	var TOKEN_WHITESPACE = 'whitespace';
	var TOKEN_DATA = 'data';
	var TOKEN_BLOCK_START = 'block-start';
	var TOKEN_BLOCK_END = 'block-end';
	var TOKEN_VARIABLE_START = 'variable-start';
	var TOKEN_VARIABLE_END = 'variable-end';
	var TOKEN_COMMENT = 'comment';
	var TOKEN_LEFT_PAREN = 'left-paren';
	var TOKEN_RIGHT_PAREN = 'right-paren';
	var TOKEN_LEFT_BRACKET = 'left-bracket';
	var TOKEN_RIGHT_BRACKET = 'right-bracket';
	var TOKEN_LEFT_CURLY = 'left-curly';
	var TOKEN_RIGHT_CURLY = 'right-curly';
	var TOKEN_OPERATOR = 'operator';
	var TOKEN_COMMA = 'comma';
	var TOKEN_COLON = 'colon';
	var TOKEN_TILDE = 'tilde';
	var TOKEN_PIPE = 'pipe';
	var TOKEN_INT = 'int';
	var TOKEN_FLOAT = 'float';
	var TOKEN_BOOLEAN = 'boolean';
	var TOKEN_NONE = 'none';
	var TOKEN_SYMBOL = 'symbol';
	var TOKEN_SPECIAL = 'special';
	var TOKEN_REGEX = 'regex';

	function token(type, value, lineno, colno) {
	    return {
	        type: type,
	        value: value,
	        lineno: lineno,
	        colno: colno
	    };
	}

	function Tokenizer(str, opts) {
	    this.str = str;
	    this.index = 0;
	    this.len = str.length;
	    this.lineno = 0;
	    this.colno = 0;

	    this.in_code = false;

	    opts = opts || {};

	    var tags = opts.tags || {};
	    this.tags = {
	        BLOCK_START: tags.blockStart || BLOCK_START,
	        BLOCK_END: tags.blockEnd || BLOCK_END,
	        VARIABLE_START: tags.variableStart || VARIABLE_START,
	        VARIABLE_END: tags.variableEnd || VARIABLE_END,
	        COMMENT_START: tags.commentStart || COMMENT_START,
	        COMMENT_END: tags.commentEnd || COMMENT_END
	    };

	    this.trimBlocks = !!opts.trimBlocks;
	    this.lstripBlocks = !!opts.lstripBlocks;
	}

	Tokenizer.prototype.nextToken = function() {
	    var lineno = this.lineno;
	    var colno = this.colno;
	    var tok;

	    if(this.in_code) {
	        // Otherwise, if we are in a block parse it as code
	        var cur = this.current();

	        if(this.is_finished()) {
	            // We have nothing else to parse
	            return null;
	        }
	        else if(cur === '"' || cur === '\'') {
	            // We've hit a string
	            return token(TOKEN_STRING, this.parseString(cur), lineno, colno);
	        }
	        else if((tok = this._extract(whitespaceChars))) {
	            // We hit some whitespace
	            return token(TOKEN_WHITESPACE, tok, lineno, colno);
	        }
	        else if((tok = this._extractString(this.tags.BLOCK_END)) ||
	                (tok = this._extractString('-' + this.tags.BLOCK_END))) {
	            // Special check for the block end tag
	            //
	            // It is a requirement that start and end tags are composed of
	            // delimiter characters (%{}[] etc), and our code always
	            // breaks on delimiters so we can assume the token parsing
	            // doesn't consume these elsewhere
	            this.in_code = false;
	            if(this.trimBlocks) {
	                cur = this.current();
	                if(cur === '\n') {
	                    // Skip newline
	                    this.forward();
	                }else if(cur === '\r'){
	                    // Skip CRLF newline
	                    this.forward();
	                    cur = this.current();
	                    if(cur === '\n'){
	                        this.forward();
	                    }else{
	                        // Was not a CRLF, so go back
	                        this.back();
	                    }
	                }
	            }
	            return token(TOKEN_BLOCK_END, tok, lineno, colno);
	        }
	        else if((tok = this._extractString(this.tags.VARIABLE_END)) ||
	                (tok = this._extractString('-' + this.tags.VARIABLE_END))) {
	            // Special check for variable end tag (see above)
	            this.in_code = false;
	            return token(TOKEN_VARIABLE_END, tok, lineno, colno);
	        }
	        else if (cur === 'r' && this.str.charAt(this.index + 1) === '/') {
	            // Skip past 'r/'.
	            this.forwardN(2);

	            // Extract until the end of the regex -- / ends it, \/ does not.
	            var regexBody = '';
	            while (!this.is_finished()) {
	                if (this.current() === '/' && this.previous() !== '\\') {
	                    this.forward();
	                    break;
	                } else {
	                    regexBody += this.current();
	                    this.forward();
	                }
	            }

	            // Check for flags.
	            // The possible flags are according to https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
	            var POSSIBLE_FLAGS = ['g', 'i', 'm', 'y'];
	            var regexFlags = '';
	            while (!this.is_finished()) {
	                var isCurrentAFlag = POSSIBLE_FLAGS.indexOf(this.current()) !== -1;
	                if (isCurrentAFlag) {
	                    regexFlags += this.current();
	                    this.forward();
	                } else {
	                    break;
	                }
	            }

	            return token(TOKEN_REGEX, {body: regexBody, flags: regexFlags}, lineno, colno);
	        }
	        else if(delimChars.indexOf(cur) !== -1) {
	            // We've hit a delimiter (a special char like a bracket)
	            this.forward();
	            var complexOps = ['==', '===', '!=', '!==', '<=', '>=', '//', '**'];
	            var curComplex = cur + this.current();
	            var type;

	            if(lib.indexOf(complexOps, curComplex) !== -1) {
	                this.forward();
	                cur = curComplex;

	                // See if this is a strict equality/inequality comparator
	                if(lib.indexOf(complexOps, curComplex + this.current()) !== -1) {
	                    cur = curComplex + this.current();
	                    this.forward();
	                }
	            }

	            switch(cur) {
	            case '(': type = TOKEN_LEFT_PAREN; break;
	            case ')': type = TOKEN_RIGHT_PAREN; break;
	            case '[': type = TOKEN_LEFT_BRACKET; break;
	            case ']': type = TOKEN_RIGHT_BRACKET; break;
	            case '{': type = TOKEN_LEFT_CURLY; break;
	            case '}': type = TOKEN_RIGHT_CURLY; break;
	            case ',': type = TOKEN_COMMA; break;
	            case ':': type = TOKEN_COLON; break;
	            case '~': type = TOKEN_TILDE; break;
	            case '|': type = TOKEN_PIPE; break;
	            default: type = TOKEN_OPERATOR;
	            }

	            return token(type, cur, lineno, colno);
	        }
	        else {
	            // We are not at whitespace or a delimiter, so extract the
	            // text and parse it
	            tok = this._extractUntil(whitespaceChars + delimChars);

	            if(tok.match(/^[-+]?[0-9]+$/)) {
	                if(this.current() === '.') {
	                    this.forward();
	                    var dec = this._extract(intChars);
	                    return token(TOKEN_FLOAT, tok + '.' + dec, lineno, colno);
	                }
	                else {
	                    return token(TOKEN_INT, tok, lineno, colno);
	                }
	            }
	            else if(tok.match(/^(true|false)$/)) {
	                return token(TOKEN_BOOLEAN, tok, lineno, colno);
	            }
	            else if(tok === 'none') {
	                return token(TOKEN_NONE, tok, lineno, colno);
	            }
	            else if(tok) {
	                return token(TOKEN_SYMBOL, tok, lineno, colno);
	            }
	            else {
	                throw new Error('Unexpected value while parsing: ' + tok);
	            }
	        }
	    }
	    else {
	        // Parse out the template text, breaking on tag
	        // delimiters because we need to look for block/variable start
	        // tags (don't use the full delimChars for optimization)
	        var beginChars = (this.tags.BLOCK_START.charAt(0) +
	                          this.tags.VARIABLE_START.charAt(0) +
	                          this.tags.COMMENT_START.charAt(0) +
	                          this.tags.COMMENT_END.charAt(0));

	        if(this.is_finished()) {
	            return null;
	        }
	        else if((tok = this._extractString(this.tags.BLOCK_START + '-')) ||
	                (tok = this._extractString(this.tags.BLOCK_START))) {
	            this.in_code = true;
	            return token(TOKEN_BLOCK_START, tok, lineno, colno);
	        }
	        else if((tok = this._extractString(this.tags.VARIABLE_START + '-')) ||
	                (tok = this._extractString(this.tags.VARIABLE_START))) {
	            this.in_code = true;
	            return token(TOKEN_VARIABLE_START, tok, lineno, colno);
	        }
	        else {
	            tok = '';
	            var data;
	            var in_comment = false;

	            if(this._matches(this.tags.COMMENT_START)) {
	                in_comment = true;
	                tok = this._extractString(this.tags.COMMENT_START);
	            }

	            // Continually consume text, breaking on the tag delimiter
	            // characters and checking to see if it's a start tag.
	            //
	            // We could hit the end of the template in the middle of
	            // our looping, so check for the null return value from
	            // _extractUntil
	            while((data = this._extractUntil(beginChars)) !== null) {
	                tok += data;

	                if((this._matches(this.tags.BLOCK_START) ||
	                    this._matches(this.tags.VARIABLE_START) ||
	                    this._matches(this.tags.COMMENT_START)) &&
	                  !in_comment) {
	                    if(this.lstripBlocks &&
	                        this._matches(this.tags.BLOCK_START) &&
	                        this.colno > 0 &&
	                        this.colno <= tok.length) {
	                        var lastLine = tok.slice(-this.colno);
	                        if(/^\s+$/.test(lastLine)) {
	                            // Remove block leading whitespace from beginning of the string
	                            tok = tok.slice(0, -this.colno);
	                            if(!tok.length) {
	                                // All data removed, collapse to avoid unnecessary nodes
	                                // by returning next token (block start)
	                                return this.nextToken();
	                            }
	                        }
	                    }
	                    // If it is a start tag, stop looping
	                    break;
	                }
	                else if(this._matches(this.tags.COMMENT_END)) {
	                    if(!in_comment) {
	                        throw new Error('unexpected end of comment');
	                    }
	                    tok += this._extractString(this.tags.COMMENT_END);
	                    break;
	                }
	                else {
	                    // It does not match any tag, so add the character and
	                    // carry on
	                    tok += this.current();
	                    this.forward();
	                }
	            }

	            if(data === null && in_comment) {
	                throw new Error('expected end of comment, got end of file');
	            }

	            return token(in_comment ? TOKEN_COMMENT : TOKEN_DATA,
	                         tok,
	                         lineno,
	                         colno);
	        }
	    }

	    throw new Error('Could not parse text');
	};

	Tokenizer.prototype.parseString = function(delimiter) {
	    this.forward();

	    var str = '';

	    while(!this.is_finished() && this.current() !== delimiter) {
	        var cur = this.current();

	        if(cur === '\\') {
	            this.forward();
	            switch(this.current()) {
	            case 'n': str += '\n'; break;
	            case 't': str += '\t'; break;
	            case 'r': str += '\r'; break;
	            default:
	                str += this.current();
	            }
	            this.forward();
	        }
	        else {
	            str += cur;
	            this.forward();
	        }
	    }

	    this.forward();
	    return str;
	};

	Tokenizer.prototype._matches = function(str) {
	    if(this.index + str.length > this.len) {
	        return null;
	    }

	    var m = this.str.slice(this.index, this.index + str.length);
	    return m === str;
	};

	Tokenizer.prototype._extractString = function(str) {
	    if(this._matches(str)) {
	        this.index += str.length;
	        return str;
	    }
	    return null;
	};

	Tokenizer.prototype._extractUntil = function(charString) {
	    // Extract all non-matching chars, with the default matching set
	    // to everything
	    return this._extractMatching(true, charString || '');
	};

	Tokenizer.prototype._extract = function(charString) {
	    // Extract all matching chars (no default, so charString must be
	    // explicit)
	    return this._extractMatching(false, charString);
	};

	Tokenizer.prototype._extractMatching = function (breakOnMatch, charString) {
	    // Pull out characters until a breaking char is hit.
	    // If breakOnMatch is false, a non-matching char stops it.
	    // If breakOnMatch is true, a matching char stops it.

	    if(this.is_finished()) {
	        return null;
	    }

	    var first = charString.indexOf(this.current());

	    // Only proceed if the first character doesn't meet our condition
	    if((breakOnMatch && first === -1) ||
	       (!breakOnMatch && first !== -1)) {
	        var t = this.current();
	        this.forward();

	        // And pull out all the chars one at a time until we hit a
	        // breaking char
	        var idx = charString.indexOf(this.current());

	        while(((breakOnMatch && idx === -1) ||
	               (!breakOnMatch && idx !== -1)) && !this.is_finished()) {
	            t += this.current();
	            this.forward();

	            idx = charString.indexOf(this.current());
	        }

	        return t;
	    }

	    return '';
	};

	Tokenizer.prototype._extractRegex = function(regex) {
	    var matches = this.currentStr().match(regex);
	    if(!matches) {
	        return null;
	    }

	    // Move forward whatever was matched
	    this.forwardN(matches[0].length);

	    return matches;
	};

	Tokenizer.prototype.is_finished = function() {
	    return this.index >= this.len;
	};

	Tokenizer.prototype.forwardN = function(n) {
	    for(var i=0; i<n; i++) {
	        this.forward();
	    }
	};

	Tokenizer.prototype.forward = function() {
	    this.index++;

	    if(this.previous() === '\n') {
	        this.lineno++;
	        this.colno = 0;
	    }
	    else {
	        this.colno++;
	    }
	};

	Tokenizer.prototype.backN = function(n) {
	    for(var i=0; i<n; i++) {
	        this.back();
	    }
	};

	Tokenizer.prototype.back = function() {
	    this.index--;

	    if(this.current() === '\n') {
	        this.lineno--;

	        var idx = this.src.lastIndexOf('\n', this.index-1);
	        if(idx === -1) {
	            this.colno = this.index;
	        }
	        else {
	            this.colno = this.index - idx;
	        }
	    }
	    else {
	        this.colno--;
	    }
	};

	// current returns current character
	Tokenizer.prototype.current = function() {
	    if(!this.is_finished()) {
	        return this.str.charAt(this.index);
	    }
	    return '';
	};

	// currentStr returns what's left of the unparsed string
	Tokenizer.prototype.currentStr = function() {
	    if(!this.is_finished()) {
	        return this.str.substr(this.index);
	    }
	    return '';
	};

	Tokenizer.prototype.previous = function() {
	    return this.str.charAt(this.index-1);
	};

	module.exports = {
	    lex: function(src, opts) {
	        return new Tokenizer(src, opts);
	    },

	    TOKEN_STRING: TOKEN_STRING,
	    TOKEN_WHITESPACE: TOKEN_WHITESPACE,
	    TOKEN_DATA: TOKEN_DATA,
	    TOKEN_BLOCK_START: TOKEN_BLOCK_START,
	    TOKEN_BLOCK_END: TOKEN_BLOCK_END,
	    TOKEN_VARIABLE_START: TOKEN_VARIABLE_START,
	    TOKEN_VARIABLE_END: TOKEN_VARIABLE_END,
	    TOKEN_COMMENT: TOKEN_COMMENT,
	    TOKEN_LEFT_PAREN: TOKEN_LEFT_PAREN,
	    TOKEN_RIGHT_PAREN: TOKEN_RIGHT_PAREN,
	    TOKEN_LEFT_BRACKET: TOKEN_LEFT_BRACKET,
	    TOKEN_RIGHT_BRACKET: TOKEN_RIGHT_BRACKET,
	    TOKEN_LEFT_CURLY: TOKEN_LEFT_CURLY,
	    TOKEN_RIGHT_CURLY: TOKEN_RIGHT_CURLY,
	    TOKEN_OPERATOR: TOKEN_OPERATOR,
	    TOKEN_COMMA: TOKEN_COMMA,
	    TOKEN_COLON: TOKEN_COLON,
	    TOKEN_TILDE: TOKEN_TILDE,
	    TOKEN_PIPE: TOKEN_PIPE,
	    TOKEN_INT: TOKEN_INT,
	    TOKEN_FLOAT: TOKEN_FLOAT,
	    TOKEN_BOOLEAN: TOKEN_BOOLEAN,
	    TOKEN_NONE: TOKEN_NONE,
	    TOKEN_SYMBOL: TOKEN_SYMBOL,
	    TOKEN_SPECIAL: TOKEN_SPECIAL,
	    TOKEN_REGEX: TOKEN_REGEX
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var lib = __webpack_require__(1);
	// jshint -W079
	var Object = __webpack_require__(6);

	function traverseAndCheck(obj, type, results) {
	    if(obj instanceof type) {
	        results.push(obj);
	    }

	    if(obj instanceof Node) {
	        obj.findAll(type, results);
	    }
	}

	var Node = Object.extend('Node', {
	    init: function(lineno, colno) {
	        this.lineno = lineno;
	        this.colno = colno;

	        var fields = this.fields;
	        for(var i = 0, l = fields.length; i < l; i++) {
	            var field = fields[i];

	            // The first two args are line/col numbers, so offset by 2
	            var val = arguments[i + 2];

	            // Fields should never be undefined, but null. It makes
	            // testing easier to normalize values.
	            if(val === undefined) {
	                val = null;
	            }

	            this[field] = val;
	        }
	    },

	    findAll: function(type, results) {
	        results = results || [];

	        var i, l;
	        if(this instanceof NodeList) {
	            var children = this.children;

	            for(i = 0, l = children.length; i < l; i++) {
	                traverseAndCheck(children[i], type, results);
	            }
	        }
	        else {
	            var fields = this.fields;

	            for(i = 0, l = fields.length; i < l; i++) {
	                traverseAndCheck(this[fields[i]], type, results);
	            }
	        }

	        return results;
	    },

	    iterFields: function(func) {
	        lib.each(this.fields, function(field) {
	            func(this[field], field);
	        }, this);
	    }
	});

	// Abstract nodes
	var Value = Node.extend('Value', { fields: ['value'] });

	// Concrete nodes
	var NodeList = Node.extend('NodeList', {
	    fields: ['children'],

	    init: function(lineno, colno, nodes) {
	        this.parent(lineno, colno, nodes || []);
	    },

	    addChild: function(node) {
	        this.children.push(node);
	    }
	});

	var Root = NodeList.extend('Root');
	var Literal = Value.extend('Literal');
	var Symbol = Value.extend('Symbol');
	var Group = NodeList.extend('Group');
	var Array = NodeList.extend('Array');
	var Pair = Node.extend('Pair', { fields: ['key', 'value'] });
	var Dict = NodeList.extend('Dict');
	var LookupVal = Node.extend('LookupVal', { fields: ['target', 'val'] });
	var If = Node.extend('If', { fields: ['cond', 'body', 'else_'] });
	var IfAsync = If.extend('IfAsync');
	var InlineIf = Node.extend('InlineIf', { fields: ['cond', 'body', 'else_'] });
	var For = Node.extend('For', { fields: ['arr', 'name', 'body', 'else_'] });
	var AsyncEach = For.extend('AsyncEach');
	var AsyncAll = For.extend('AsyncAll');
	var Macro = Node.extend('Macro', { fields: ['name', 'args', 'body'] });
	var Caller = Macro.extend('Caller');
	var Import = Node.extend('Import', { fields: ['template', 'target', 'withContext'] });
	var FromImport = Node.extend('FromImport', {
	    fields: ['template', 'names', 'withContext'],

	    init: function(lineno, colno, template, names, withContext) {
	        this.parent(lineno, colno,
	                    template,
	                    names || new NodeList(), withContext);
	    }
	});
	var FunCall = Node.extend('FunCall', { fields: ['name', 'args'] });
	var Filter = FunCall.extend('Filter');
	var FilterAsync = Filter.extend('FilterAsync', {
	    fields: ['name', 'args', 'symbol']
	});
	var KeywordArgs = Dict.extend('KeywordArgs');
	var Block = Node.extend('Block', { fields: ['name', 'body'] });
	var Super = Node.extend('Super', { fields: ['blockName', 'symbol'] });
	var TemplateRef = Node.extend('TemplateRef', { fields: ['template'] });
	var Extends = TemplateRef.extend('Extends');
	var Include = Node.extend('Include', { fields: ['template', 'ignoreMissing'] });
	var Set = Node.extend('Set', { fields: ['targets', 'value'] });
	var Output = NodeList.extend('Output');
	var Capture = Node.extend('Capture', { fields: ['body'] });
	var TemplateData = Literal.extend('TemplateData');
	var UnaryOp = Node.extend('UnaryOp', { fields: ['target'] });
	var BinOp = Node.extend('BinOp', { fields: ['left', 'right'] });
	var In = BinOp.extend('In');
	var Or = BinOp.extend('Or');
	var And = BinOp.extend('And');
	var Not = UnaryOp.extend('Not');
	var Add = BinOp.extend('Add');
	var Concat = BinOp.extend('Concat');
	var Sub = BinOp.extend('Sub');
	var Mul = BinOp.extend('Mul');
	var Div = BinOp.extend('Div');
	var FloorDiv = BinOp.extend('FloorDiv');
	var Mod = BinOp.extend('Mod');
	var Pow = BinOp.extend('Pow');
	var Neg = UnaryOp.extend('Neg');
	var Pos = UnaryOp.extend('Pos');
	var Compare = Node.extend('Compare', { fields: ['expr', 'ops'] });
	var CompareOperand = Node.extend('CompareOperand', {
	    fields: ['expr', 'type']
	});

	var CallExtension = Node.extend('CallExtension', {
	    fields: ['extName', 'prop', 'args', 'contentArgs'],

	    init: function(ext, prop, args, contentArgs) {
	        this.extName = ext._name || ext;
	        this.prop = prop;
	        this.args = args || new NodeList();
	        this.contentArgs = contentArgs || [];
	        this.autoescape = ext.autoescape;
	    }
	});

	var CallExtensionAsync = CallExtension.extend('CallExtensionAsync');

	// Print the AST in a nicely formatted tree format for debuggin
	function printNodes(node, indent) {
	    indent = indent || 0;

	    // This is hacky, but this is just a debugging function anyway
	    function print(str, indent, inline) {
	        var lines = str.split('\n');

	        for(var i=0; i<lines.length; i++) {
	            if(lines[i]) {
	                if((inline && i > 0) || !inline) {
	                    for(var j=0; j<indent; j++) {
	                        process.stdout.write(' ');
	                    }
	                }
	            }

	            if(i === lines.length-1) {
	                process.stdout.write(lines[i]);
	            }
	            else {
	                process.stdout.write(lines[i] + '\n');
	            }
	        }
	    }

	    print(node.typename + ': ', indent);

	    if(node instanceof NodeList) {
	        print('\n');
	        lib.each(node.children, function(n) {
	            printNodes(n, indent + 2);
	        });
	    }
	    else if(node instanceof CallExtension) {
	        print(node.extName + '.' + node.prop);
	        print('\n');

	        if(node.args) {
	            printNodes(node.args, indent + 2);
	        }

	        if(node.contentArgs) {
	            lib.each(node.contentArgs, function(n) {
	                printNodes(n, indent + 2);
	            });
	        }
	    }
	    else {
	        var nodes = null;
	        var props = null;

	        node.iterFields(function(val, field) {
	            if(val instanceof Node) {
	                nodes = nodes || {};
	                nodes[field] = val;
	            }
	            else {
	                props = props || {};
	                props[field] = val;
	            }
	        });

	        if(props) {
	            print(JSON.stringify(props, null, 2) + '\n', null, true);
	        }
	        else {
	            print('\n');
	        }

	        if(nodes) {
	            for(var k in nodes) {
	                printNodes(nodes[k], indent + 2);
	            }
	        }

	    }
	}

	// var t = new NodeList(0, 0,
	//                      [new Value(0, 0, 3),
	//                       new Value(0, 0, 10),
	//                       new Pair(0, 0,
	//                                new Value(0, 0, 'key'),
	//                                new Value(0, 0, 'value'))]);
	// printNodes(t);

	module.exports = {
	    Node: Node,
	    Root: Root,
	    NodeList: NodeList,
	    Value: Value,
	    Literal: Literal,
	    Symbol: Symbol,
	    Group: Group,
	    Array: Array,
	    Pair: Pair,
	    Dict: Dict,
	    Output: Output,
	    Capture: Capture,
	    TemplateData: TemplateData,
	    If: If,
	    IfAsync: IfAsync,
	    InlineIf: InlineIf,
	    For: For,
	    AsyncEach: AsyncEach,
	    AsyncAll: AsyncAll,
	    Macro: Macro,
	    Caller: Caller,
	    Import: Import,
	    FromImport: FromImport,
	    FunCall: FunCall,
	    Filter: Filter,
	    FilterAsync: FilterAsync,
	    KeywordArgs: KeywordArgs,
	    Block: Block,
	    Super: Super,
	    Extends: Extends,
	    Include: Include,
	    Set: Set,
	    LookupVal: LookupVal,
	    BinOp: BinOp,
	    In: In,
	    Or: Or,
	    And: And,
	    Not: Not,
	    Add: Add,
	    Concat: Concat,
	    Sub: Sub,
	    Mul: Mul,
	    Div: Div,
	    FloorDiv: FloorDiv,
	    Mod: Mod,
	    Pow: Pow,
	    Neg: Neg,
	    Pos: Pos,
	    Compare: Compare,
	    CompareOperand: CompareOperand,

	    CallExtension: CallExtension,
	    CallExtensionAsync: CallExtensionAsync,

	    printNodes: printNodes
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var nodes = __webpack_require__(10);
	var lib = __webpack_require__(1);

	var sym = 0;
	function gensym() {
	    return 'hole_' + sym++;
	}

	// copy-on-write version of map
	function mapCOW(arr, func) {
	    var res = null;

	    for(var i=0; i<arr.length; i++) {
	        var item = func(arr[i]);

	        if(item !== arr[i]) {
	            if(!res) {
	                res = arr.slice();
	            }

	            res[i] = item;
	        }
	    }

	    return res || arr;
	}

	function walk(ast, func, depthFirst) {
	    if(!(ast instanceof nodes.Node)) {
	        return ast;
	    }

	    if(!depthFirst) {
	        var astT = func(ast);

	        if(astT && astT !== ast) {
	            return astT;
	        }
	    }

	    if(ast instanceof nodes.NodeList) {
	        var children = mapCOW(ast.children, function(node) {
	            return walk(node, func, depthFirst);
	        });

	        if(children !== ast.children) {
	            ast = new nodes[ast.typename](ast.lineno, ast.colno, children);
	        }
	    }
	    else if(ast instanceof nodes.CallExtension) {
	        var args = walk(ast.args, func, depthFirst);

	        var contentArgs = mapCOW(ast.contentArgs, function(node) {
	            return walk(node, func, depthFirst);
	        });

	        if(args !== ast.args || contentArgs !== ast.contentArgs) {
	            ast = new nodes[ast.typename](ast.extName,
	                                          ast.prop,
	                                          args,
	                                          contentArgs);
	        }
	    }
	    else {
	        var props = ast.fields.map(function(field) {
	            return ast[field];
	        });

	        var propsT = mapCOW(props, function(prop) {
	            return walk(prop, func, depthFirst);
	        });

	        if(propsT !== props) {
	            ast = new nodes[ast.typename](ast.lineno, ast.colno);

	            propsT.forEach(function(prop, i) {
	                ast[ast.fields[i]] = prop;
	            });
	        }
	    }

	    return depthFirst ? (func(ast) || ast) : ast;
	}

	function depthWalk(ast, func) {
	    return walk(ast, func, true);
	}

	function _liftFilters(node, asyncFilters, prop) {
	    var children = [];

	    var walked = depthWalk(prop ? node[prop] : node, function(node) {
	        if(node instanceof nodes.Block) {
	            return node;
	        }
	        else if((node instanceof nodes.Filter &&
	                 lib.indexOf(asyncFilters, node.name.value) !== -1) ||
	                node instanceof nodes.CallExtensionAsync) {
	            var symbol = new nodes.Symbol(node.lineno,
	                                          node.colno,
	                                          gensym());

	            children.push(new nodes.FilterAsync(node.lineno,
	                                                node.colno,
	                                                node.name,
	                                                node.args,
	                                                symbol));
	            return symbol;
	        }
	    });

	    if(prop) {
	        node[prop] = walked;
	    }
	    else {
	        node = walked;
	    }

	    if(children.length) {
	        children.push(node);

	        return new nodes.NodeList(
	            node.lineno,
	            node.colno,
	            children
	        );
	    }
	    else {
	        return node;
	    }
	}

	function liftFilters(ast, asyncFilters) {
	    return depthWalk(ast, function(node) {
	        if(node instanceof nodes.Output) {
	            return _liftFilters(node, asyncFilters);
	        }
	        else if(node instanceof nodes.Set) {
	            return _liftFilters(node, asyncFilters, 'value');
	        }
	        else if(node instanceof nodes.For) {
	            return _liftFilters(node, asyncFilters, 'arr');
	        }
	        else if(node instanceof nodes.If) {
	            return _liftFilters(node, asyncFilters, 'cond');
	        }
	        else if(node instanceof nodes.CallExtension) {
	            return _liftFilters(node, asyncFilters, 'args');
	        }
	    });
	}

	function liftSuper(ast) {
	    return walk(ast, function(blockNode) {
	        if(!(blockNode instanceof nodes.Block)) {
	            return;
	        }

	        var hasSuper = false;
	        var symbol = gensym();

	        blockNode.body = walk(blockNode.body, function(node) {
	            if(node instanceof nodes.FunCall &&
	               node.name.value === 'super') {
	                hasSuper = true;
	                return new nodes.Symbol(node.lineno, node.colno, symbol);
	            }
	        });

	        if(hasSuper) {
	            blockNode.body.children.unshift(new nodes.Super(
	                0, 0, blockNode.name, new nodes.Symbol(0, 0, symbol)
	            ));
	        }
	    });
	}

	function convertStatements(ast) {
	    return depthWalk(ast, function(node) {
	        if(!(node instanceof nodes.If) &&
	           !(node instanceof nodes.For)) {
	            return;
	        }

	        var async = false;
	        walk(node, function(node) {
	            if(node instanceof nodes.FilterAsync ||
	               node instanceof nodes.IfAsync ||
	               node instanceof nodes.AsyncEach ||
	               node instanceof nodes.AsyncAll ||
	               node instanceof nodes.CallExtensionAsync) {
	                async = true;
	                // Stop iterating by returning the node
	                return node;
	            }
	        });

	        if(async) {
		        if(node instanceof nodes.If) {
	                return new nodes.IfAsync(
	                    node.lineno,
	                    node.colno,
	                    node.cond,
	                    node.body,
	                    node.else_
	                );
	            }
	            else if(node instanceof nodes.For) {
	                return new nodes.AsyncEach(
	                    node.lineno,
	                    node.colno,
	                    node.arr,
	                    node.name,
	                    node.body,
	                    node.else_
	                );
	            }
	        }
	    });
	}

	function cps(ast, asyncFilters) {
	    return convertStatements(liftSuper(liftFilters(ast, asyncFilters)));
	}

	function transform(ast, asyncFilters) {
	    return cps(ast, asyncFilters || []);
	}

	// var parser = require('./parser');
	// var src = 'hello {% foo %}{% endfoo %} end';
	// var ast = transform(parser.parse(src, [new FooExtension()]), ['bar']);
	// nodes.printNodes(ast);

	module.exports = {
	    transform: transform
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var lib = __webpack_require__(1);
	var Obj = __webpack_require__(6);

	// Frames keep track of scoping both at compile-time and run-time so
	// we know how to access variables. Block tags can introduce special
	// variables, for example.
	var Frame = Obj.extend({
	    init: function(parent, isolateWrites) {
	        this.variables = {};
	        this.parent = parent;
	        this.topLevel = false;
	        // if this is true, writes (set) should never propagate upwards past
	        // this frame to its parent (though reads may).
	        this.isolateWrites = isolateWrites;
	    },

	    set: function(name, val, resolveUp) {
	        // Allow variables with dots by automatically creating the
	        // nested structure
	        var parts = name.split('.');
	        var obj = this.variables;
	        var frame = this;

	        if(resolveUp) {
	            if((frame = this.resolve(parts[0], true))) {
	                frame.set(name, val);
	                return;
	            }
	        }

	        for(var i=0; i<parts.length - 1; i++) {
	            var id = parts[i];

	            if(!obj[id]) {
	                obj[id] = {};
	            }
	            obj = obj[id];
	        }

	        obj[parts[parts.length - 1]] = val;
	    },

	    get: function(name) {
	        var val = this.variables[name];
	        if(val !== undefined) {
	            return val;
	        }
	        return null;
	    },

	    lookup: function(name) {
	        var p = this.parent;
	        var val = this.variables[name];
	        if(val !== undefined) {
	            return val;
	        }
	        return p && p.lookup(name);
	    },

	    resolve: function(name, forWrite) {
	        var p = (forWrite && this.isolateWrites) ? undefined : this.parent;
	        var val = this.variables[name];
	        if(val !== undefined) {
	            return this;
	        }
	        return p && p.resolve(name);
	    },

	    push: function(isolateWrites) {
	        return new Frame(this, isolateWrites);
	    },

	    pop: function() {
	        return this.parent;
	    }
	});

	function makeMacro(argNames, kwargNames, func) {
	    return function() {
	        var argCount = numArgs(arguments);
	        var args;
	        var kwargs = getKeywordArgs(arguments);
	        var i;

	        if(argCount > argNames.length) {
	            args = Array.prototype.slice.call(arguments, 0, argNames.length);

	            // Positional arguments that should be passed in as
	            // keyword arguments (essentially default values)
	            var vals = Array.prototype.slice.call(arguments, args.length, argCount);
	            for(i = 0; i < vals.length; i++) {
	                if(i < kwargNames.length) {
	                    kwargs[kwargNames[i]] = vals[i];
	                }
	            }

	            args.push(kwargs);
	        }
	        else if(argCount < argNames.length) {
	            args = Array.prototype.slice.call(arguments, 0, argCount);

	            for(i = argCount; i < argNames.length; i++) {
	                var arg = argNames[i];

	                // Keyword arguments that should be passed as
	                // positional arguments, i.e. the caller explicitly
	                // used the name of a positional arg
	                args.push(kwargs[arg]);
	                delete kwargs[arg];
	            }

	            args.push(kwargs);
	        }
	        else {
	            args = arguments;
	        }

	        return func.apply(this, args);
	    };
	}

	function makeKeywordArgs(obj) {
	    obj.__keywords = true;
	    return obj;
	}

	function getKeywordArgs(args) {
	    var len = args.length;
	    if(len) {
	        var lastArg = args[len - 1];
	        if(lastArg && lastArg.hasOwnProperty('__keywords')) {
	            return lastArg;
	        }
	    }
	    return {};
	}

	function numArgs(args) {
	    var len = args.length;
	    if(len === 0) {
	        return 0;
	    }

	    var lastArg = args[len - 1];
	    if(lastArg && lastArg.hasOwnProperty('__keywords')) {
	        return len - 1;
	    }
	    else {
	        return len;
	    }
	}

	// A SafeString object indicates that the string should not be
	// autoescaped. This happens magically because autoescaping only
	// occurs on primitive string objects.
	function SafeString(val) {
	    if(typeof val !== 'string') {
	        return val;
	    }

	    this.val = val;
	    this.length = val.length;
	}

	SafeString.prototype = Object.create(String.prototype, {
	    length: { writable: true, configurable: true, value: 0 }
	});
	SafeString.prototype.valueOf = function() {
	    return this.val;
	};
	SafeString.prototype.toString = function() {
	    return this.val;
	};

	function copySafeness(dest, target) {
	    if(dest instanceof SafeString) {
	        return new SafeString(target);
	    }
	    return target.toString();
	}

	function markSafe(val) {
	    var type = typeof val;

	    if(type === 'string') {
	        return new SafeString(val);
	    }
	    else if(type !== 'function') {
	        return val;
	    }
	    else {
	        return function() {
	            var ret = val.apply(this, arguments);

	            if(typeof ret === 'string') {
	                return new SafeString(ret);
	            }

	            return ret;
	        };
	    }
	}

	function suppressValue(val, autoescape) {
	    val = (val !== undefined && val !== null) ? val : '';

	    if(autoescape && !(val instanceof SafeString)) {
	        val = lib.escape(val.toString());
	    }

	    return val;
	}

	function ensureDefined(val, lineno, colno) {
	    if(val === null || val === undefined) {
	        throw new lib.TemplateError(
	            'attempted to output null or undefined value',
	            lineno + 1,
	            colno + 1
	        );
	    }
	    return val;
	}

	function memberLookup(obj, val) {
	    obj = obj || {};

	    if(typeof obj[val] === 'function') {
	        return function() {
	            return obj[val].apply(obj, arguments);
	        };
	    }

	    return obj[val];
	}

	function callWrap(obj, name, context, args) {
	    if(!obj) {
	        throw new Error('Unable to call `' + name + '`, which is undefined or falsey');
	    }
	    else if(typeof obj !== 'function') {
	        throw new Error('Unable to call `' + name + '`, which is not a function');
	    }

	    // jshint validthis: true
	    return obj.apply(context, args);
	}

	function contextOrFrameLookup(context, frame, name) {
	    var val = frame.lookup(name);
	    return (val !== undefined) ?
	        val :
	        context.lookup(name);
	}

	function handleError(error, lineno, colno) {
	    if(error.lineno) {
	        return error;
	    }
	    else {
	        return new lib.TemplateError(error, lineno, colno);
	    }
	}

	function asyncEach(arr, dimen, iter, cb) {
	    if(lib.isArray(arr)) {
	        var len = arr.length;

	        lib.asyncIter(arr, function(item, i, next) {
	            switch(dimen) {
	            case 1: iter(item, i, len, next); break;
	            case 2: iter(item[0], item[1], i, len, next); break;
	            case 3: iter(item[0], item[1], item[2], i, len, next); break;
	            default:
	                item.push(i, next);
	                iter.apply(this, item);
	            }
	        }, cb);
	    }
	    else {
	        lib.asyncFor(arr, function(key, val, i, len, next) {
	            iter(key, val, i, len, next);
	        }, cb);
	    }
	}

	function asyncAll(arr, dimen, func, cb) {
	    var finished = 0;
	    var len, i;
	    var outputArr;

	    function done(i, output) {
	        finished++;
	        outputArr[i] = output;

	        if(finished === len) {
	            cb(null, outputArr.join(''));
	        }
	    }

	    if(lib.isArray(arr)) {
	        len = arr.length;
	        outputArr = new Array(len);

	        if(len === 0) {
	            cb(null, '');
	        }
	        else {
	            for(i = 0; i < arr.length; i++) {
	                var item = arr[i];

	                switch(dimen) {
	                case 1: func(item, i, len, done); break;
	                case 2: func(item[0], item[1], i, len, done); break;
	                case 3: func(item[0], item[1], item[2], i, len, done); break;
	                default:
	                    item.push(i, done);
	                    // jshint validthis: true
	                    func.apply(this, item);
	                }
	            }
	        }
	    }
	    else {
	        var keys = lib.keys(arr);
	        len = keys.length;
	        outputArr = new Array(len);

	        if(len === 0) {
	            cb(null, '');
	        }
	        else {
	            for(i = 0; i < keys.length; i++) {
	                var k = keys[i];
	                func(k, arr[k], i, len, done);
	            }
	        }
	    }
	}

	module.exports = {
	    Frame: Frame,
	    makeMacro: makeMacro,
	    makeKeywordArgs: makeKeywordArgs,
	    numArgs: numArgs,
	    suppressValue: suppressValue,
	    ensureDefined: ensureDefined,
	    memberLookup: memberLookup,
	    contextOrFrameLookup: contextOrFrameLookup,
	    callWrap: callWrap,
	    handleError: handleError,
	    isArray: lib.isArray,
	    keys: lib.keys,
	    SafeString: SafeString,
	    copySafeness: copySafeness,
	    markSafe: markSafe,
	    asyncEach: asyncEach,
	    asyncAll: asyncAll,
	    inOperator: lib.inOperator
	};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var lib = __webpack_require__(1);
	var r = __webpack_require__(13);

	function normalize(value, defaultValue) {
	    if(value === null || value === undefined || value === false) {
	        return defaultValue;
	    }
	    return value;
	}

	var filters = {
	    abs: Math.abs,

	    batch: function(arr, linecount, fill_with) {
	        var i;
	        var res = [];
	        var tmp = [];

	        for(i = 0; i < arr.length; i++) {
	            if(i % linecount === 0 && tmp.length) {
	                res.push(tmp);
	                tmp = [];
	            }

	            tmp.push(arr[i]);
	        }

	        if(tmp.length) {
	            if(fill_with) {
	                for(i = tmp.length; i < linecount; i++) {
	                    tmp.push(fill_with);
	                }
	            }

	            res.push(tmp);
	        }

	        return res;
	    },

	    capitalize: function(str) {
	        str = normalize(str, '');
	        var ret = str.toLowerCase();
	        return r.copySafeness(str, ret.charAt(0).toUpperCase() + ret.slice(1));
	    },

	    center: function(str, width) {
	        str = normalize(str, '');
	        width = width || 80;

	        if(str.length >= width) {
	            return str;
	        }

	        var spaces = width - str.length;
	        var pre = lib.repeat(' ', spaces/2 - spaces % 2);
	        var post = lib.repeat(' ', spaces/2);
	        return r.copySafeness(str, pre + str + post);
	    },

	    'default': function(val, def, bool) {
	        if(bool) {
	            return val ? val : def;
	        }
	        else {
	            return (val !== undefined) ? val : def;
	        }
	    },

	    dictsort: function(val, case_sensitive, by) {
	        if (!lib.isObject(val)) {
	            throw new lib.TemplateError('dictsort filter: val must be an object');
	        }

	        var array = [];
	        for (var k in val) {
	            // deliberately include properties from the object's prototype
	            array.push([k,val[k]]);
	        }

	        var si;
	        if (by === undefined || by === 'key') {
	            si = 0;
	        } else if (by === 'value') {
	            si = 1;
	        } else {
	            throw new lib.TemplateError(
	                'dictsort filter: You can only sort by either key or value');
	        }

	        array.sort(function(t1, t2) {
	            var a = t1[si];
	            var b = t2[si];

	            if (!case_sensitive) {
	                if (lib.isString(a)) {
	                    a = a.toUpperCase();
	                }
	                if (lib.isString(b)) {
	                    b = b.toUpperCase();
	                }
	            }

	            return a > b ? 1 : (a === b ? 0 : -1);
	        });

	        return array;
	    },

	    dump: function(obj, spaces) {
	        return JSON.stringify(obj, null, spaces);
	    },

	    escape: function(str) {
	        if(str instanceof r.SafeString) {
	            return str;
	        }
	        str = (str === null || str === undefined) ? '' : str;
	        return r.markSafe(lib.escape(str.toString()));
	    },

	    safe: function(str) {
	        if (str instanceof r.SafeString) {
	            return str;
	        }
	        str = (str === null || str === undefined) ? '' : str;
	        return r.markSafe(str.toString());
	    },

	    first: function(arr) {
	        return arr[0];
	    },

	    groupby: function(arr, attr) {
	        return lib.groupBy(arr, attr);
	    },

	    indent: function(str, width, indentfirst) {
	        str = normalize(str, '');

	        if (str === '') return '';

	        width = width || 4;
	        var res = '';
	        var lines = str.split('\n');
	        var sp = lib.repeat(' ', width);

	        for(var i=0; i<lines.length; i++) {
	            if(i === 0 && !indentfirst) {
	                res += lines[i] + '\n';
	            }
	            else {
	                res += sp + lines[i] + '\n';
	            }
	        }

	        return r.copySafeness(str, res);
	    },

	    join: function(arr, del, attr) {
	        del = del || '';

	        if(attr) {
	            arr = lib.map(arr, function(v) {
	                return v[attr];
	            });
	        }

	        return arr.join(del);
	    },

	    last: function(arr) {
	        return arr[arr.length-1];
	    },

	    length: function(val) {
	        var value = normalize(val, '');

	        if(value !== undefined) {
	            if(
	                (typeof Map === 'function' && value instanceof Map) ||
	                (typeof Set === 'function' && value instanceof Set)
	            ) {
	                // ECMAScript 2015 Maps and Sets
	                return value.size;
	            }
	            if(lib.isObject(value) && !(value instanceof r.SafeString)) {
	                // Objects (besides SafeStrings), non-primative Arrays
	                return Object.keys(value).length;
	            }
	            return value.length;
	        }
	        return 0;
	    },

	    list: function(val) {
	        if(lib.isString(val)) {
	            return val.split('');
	        }
	        else if(lib.isObject(val)) {
	            var keys = [];

	            if(Object.keys) {
	                keys = Object.keys(val);
	            }
	            else {
	                for(var k in val) {
	                    keys.push(k);
	                }
	            }

	            return lib.map(keys, function(k) {
	                return { key: k,
	                         value: val[k] };
	            });
	        }
	        else if(lib.isArray(val)) {
	          return val;
	        }
	        else {
	            throw new lib.TemplateError('list filter: type not iterable');
	        }
	    },

	    lower: function(str) {
	        str = normalize(str, '');
	        return str.toLowerCase();
	    },

	    nl2br: function(str) {
	        if (str === null || str === undefined) {
	            return '';
	        }
	        return r.copySafeness(str, str.replace(/\r\n|\n/g, '<br />\n'));
	    },

	    random: function(arr) {
	        return arr[Math.floor(Math.random() * arr.length)];
	    },

	    rejectattr: function(arr, attr) {
	      return arr.filter(function (item) {
	        return !item[attr];
	      });
	    },

	    selectattr: function(arr, attr) {
	      return arr.filter(function (item) {
	        return !!item[attr];
	      });
	    },

	    replace: function(str, old, new_, maxCount) {
	        var originalStr = str;

	        if (old instanceof RegExp) {
	            return str.replace(old, new_);
	        }

	        if(typeof maxCount === 'undefined'){
	            maxCount = -1;
	        }

	        var res = '';  // Output

	        // Cast Numbers in the search term to string
	        if(typeof old === 'number'){
	            old = old + '';
	        }
	        else if(typeof old !== 'string') {
	            // If it is something other than number or string,
	            // return the original string
	            return str;
	        }

	        // Cast numbers in the replacement to string
	        if(typeof str === 'number'){
	            str = str + '';
	        }

	        // If by now, we don't have a string, throw it back
	        if(typeof str !== 'string' && !(str instanceof r.SafeString)){
	            return str;
	        }

	        // ShortCircuits
	        if(old === ''){
	            // Mimic the python behaviour: empty string is replaced
	            // by replacement e.g. "abc"|replace("", ".") -> .a.b.c.
	            res = new_ + str.split('').join(new_) + new_;
	            return r.copySafeness(str, res);
	        }

	        var nextIndex = str.indexOf(old);
	        // if # of replacements to perform is 0, or the string to does
	        // not contain the old value, return the string
	        if(maxCount === 0 || nextIndex === -1){
	            return str;
	        }

	        var pos = 0;
	        var count = 0; // # of replacements made

	        while(nextIndex  > -1 && (maxCount === -1 || count < maxCount)){
	            // Grab the next chunk of src string and add it with the
	            // replacement, to the result
	            res += str.substring(pos, nextIndex) + new_;
	            // Increment our pointer in the src string
	            pos = nextIndex + old.length;
	            count++;
	            // See if there are any more replacements to be made
	            nextIndex = str.indexOf(old, pos);
	        }

	        // We've either reached the end, or done the max # of
	        // replacements, tack on any remaining string
	        if(pos < str.length) {
	            res += str.substring(pos);
	        }

	        return r.copySafeness(originalStr, res);
	    },

	    reverse: function(val) {
	        var arr;
	        if(lib.isString(val)) {
	            arr = filters.list(val);
	        }
	        else {
	            // Copy it
	            arr = lib.map(val, function(v) { return v; });
	        }

	        arr.reverse();

	        if(lib.isString(val)) {
	            return r.copySafeness(val, arr.join(''));
	        }
	        return arr;
	    },

	    round: function(val, precision, method) {
	        precision = precision || 0;
	        var factor = Math.pow(10, precision);
	        var rounder;

	        if(method === 'ceil') {
	            rounder = Math.ceil;
	        }
	        else if(method === 'floor') {
	            rounder = Math.floor;
	        }
	        else {
	            rounder = Math.round;
	        }

	        return rounder(val * factor) / factor;
	    },

	    slice: function(arr, slices, fillWith) {
	        var sliceLength = Math.floor(arr.length / slices);
	        var extra = arr.length % slices;
	        var offset = 0;
	        var res = [];

	        for(var i=0; i<slices; i++) {
	            var start = offset + i * sliceLength;
	            if(i < extra) {
	                offset++;
	            }
	            var end = offset + (i + 1) * sliceLength;

	            var slice = arr.slice(start, end);
	            if(fillWith && i >= extra) {
	                slice.push(fillWith);
	            }
	            res.push(slice);
	        }

	        return res;
	    },

	    sum: function(arr, attr, start) {
	        var sum = 0;

	        if(typeof start === 'number'){
	            sum += start;
	        }

	        if(attr) {
	            arr = lib.map(arr, function(v) {
	                return v[attr];
	            });
	        }

	        for(var i = 0; i < arr.length; i++) {
	            sum += arr[i];
	        }

	        return sum;
	    },

	    sort: r.makeMacro(['value', 'reverse', 'case_sensitive', 'attribute'], [], function(arr, reverse, caseSens, attr) {
	         // Copy it
	        arr = lib.map(arr, function(v) { return v; });

	        arr.sort(function(a, b) {
	            var x, y;

	            if(attr) {
	                x = a[attr];
	                y = b[attr];
	            }
	            else {
	                x = a;
	                y = b;
	            }

	            if(!caseSens && lib.isString(x) && lib.isString(y)) {
	                x = x.toLowerCase();
	                y = y.toLowerCase();
	            }

	            if(x < y) {
	                return reverse ? 1 : -1;
	            }
	            else if(x > y) {
	                return reverse ? -1: 1;
	            }
	            else {
	                return 0;
	            }
	        });

	        return arr;
	    }),

	    string: function(obj) {
	        return r.copySafeness(obj, obj);
	    },

	    striptags: function(input, preserve_linebreaks) {
	        input = normalize(input, '');
	        preserve_linebreaks = preserve_linebreaks || false;
	        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi;
	        var trimmedInput = filters.trim(input.replace(tags, ''));
	        var res = '';
	        if (preserve_linebreaks) {
	            res = trimmedInput
	                .replace(/^ +| +$/gm, '')     // remove leading and trailing spaces
	                .replace(/ +/g, ' ')          // squash adjacent spaces
	                .replace(/(\r\n)/g, '\n')     // normalize linebreaks (CRLF -> LF)
	                .replace(/\n\n\n+/g, '\n\n'); // squash abnormal adjacent linebreaks
	        } else {
	            res = trimmedInput.replace(/\s+/gi, ' ');
	        }
	        return r.copySafeness(input, res);
	    },

	    title: function(str) {
	        str = normalize(str, '');
	        var words = str.split(' ');
	        for(var i = 0; i < words.length; i++) {
	            words[i] = filters.capitalize(words[i]);
	        }
	        return r.copySafeness(str, words.join(' '));
	    },

	    trim: function(str) {
	        return r.copySafeness(str, str.replace(/^\s*|\s*$/g, ''));
	    },

	    truncate: function(input, length, killwords, end) {
	        var orig = input;
	        input = normalize(input, '');
	        length = length || 255;

	        if (input.length <= length)
	            return input;

	        if (killwords) {
	            input = input.substring(0, length);
	        } else {
	            var idx = input.lastIndexOf(' ', length);
	            if(idx === -1) {
	                idx = length;
	            }

	            input = input.substring(0, idx);
	        }

	        input += (end !== undefined && end !== null) ? end : '...';
	        return r.copySafeness(orig, input);
	    },

	    upper: function(str) {
	        str = normalize(str, '');
	        return str.toUpperCase();
	    },

	    urlencode: function(obj) {
	        var enc = encodeURIComponent;
	        if (lib.isString(obj)) {
	            return enc(obj);
	        } else {
	            var parts;
	            if (lib.isArray(obj)) {
	                parts = obj.map(function(item) {
	                    return enc(item[0]) + '=' + enc(item[1]);
	                });
	            } else {
	                parts = [];
	                for (var k in obj) {
	                    if (obj.hasOwnProperty(k)) {
	                        parts.push(enc(k) + '=' + enc(obj[k]));
	                    }
	                }
	            }
	            return parts.join('&');
	        }
	    },

	    urlize: function(str, length, nofollow) {
	        if (isNaN(length)) length = Infinity;

	        var noFollowAttr = (nofollow === true ? ' rel="nofollow"' : '');

	        // For the jinja regexp, see
	        // https://github.com/mitsuhiko/jinja2/blob/f15b814dcba6aa12bc74d1f7d0c881d55f7126be/jinja2/utils.py#L20-L23
	        var puncRE = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/;
	        // from http://blog.gerv.net/2011/05/html5_email_address_regexp/
	        var emailRE = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i;
	        var httpHttpsRE = /^https?:\/\/.*$/;
	        var wwwRE = /^www\./;
	        var tldRE = /\.(?:org|net|com)(?:\:|\/|$)/;

	        var words = str.split(/(\s+)/).filter(function(word) {
	          // If the word has no length, bail. This can happen for str with
	          // trailing whitespace.
	          return word && word.length;
	        }).map(function(word) {
	          var matches = word.match(puncRE);
	          var possibleUrl = matches && matches[1] || word;

	          // url that starts with http or https
	          if (httpHttpsRE.test(possibleUrl))
	            return '<a href="' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';

	          // url that starts with www.
	          if (wwwRE.test(possibleUrl))
	            return '<a href="http://' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';

	          // an email address of the form username@domain.tld
	          if (emailRE.test(possibleUrl))
	            return '<a href="mailto:' + possibleUrl + '">' + possibleUrl + '</a>';

	          // url that ends in .com, .org or .net that is not an email address
	          if (tldRE.test(possibleUrl))
	            return '<a href="http://' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';

	          return word;

	        });

	        return words.join('');
	    },

	    wordcount: function(str) {
	        str = normalize(str, '');
	        var words = (str) ? str.match(/\w+/g) : null;
	        return (words) ? words.length : null;
	    },

	    'float': function(val, def) {
	        var res = parseFloat(val);
	        return isNaN(res) ? def : res;
	    },

	    'int': function(val, def) {
	        var res = parseInt(val, 10);
	        return isNaN(res) ? def : res;
	    }
	};

	// Aliases
	filters.d = filters['default'];
	filters.e = filters.escape;

	module.exports = filters;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Loader = __webpack_require__(16);
	var PrecompiledLoader = __webpack_require__(17);

	var WebLoader = Loader.extend({
	    init: function(baseURL, opts) {
	        this.baseURL = baseURL || '.';
	        opts = opts || {};

	        // By default, the cache is turned off because there's no way
	        // to "watch" templates over HTTP, so they are re-downloaded
	        // and compiled each time. (Remember, PRECOMPILE YOUR
	        // TEMPLATES in production!)
	        this.useCache = !!opts.useCache;

	        // We default `async` to false so that the simple synchronous
	        // API can be used when you aren't doing anything async in
	        // your templates (which is most of the time). This performs a
	        // sync ajax request, but that's ok because it should *only*
	        // happen in development. PRECOMPILE YOUR TEMPLATES.
	        this.async = !!opts.async;
	    },

	    resolve: function(from, to) { // jshint ignore:line
	        throw new Error('relative templates not support in the browser yet');
	    },

	    getSource: function(name, cb) {
	        var useCache = this.useCache;
	        var result;
	        this.fetch(this.baseURL + '/' + name, function(err, src) {
	            if(err) {
	                if(cb) {
	                    cb(err.content);
	                } else {
	                    if (err.status === 404) {
	                      result = null;
	                    } else {
	                      throw err.content;
	                    }
	                }
	            }
	            else {
	                result = { src: src,
	                           path: name,
	                           noCache: !useCache };
	                if(cb) {
	                    cb(null, result);
	                }
	            }
	        });

	        // if this WebLoader isn't running asynchronously, the
	        // fetch above would actually run sync and we'll have a
	        // result here
	        return result;
	    },

	    fetch: function(url, cb) {
	        // Only in the browser please
	        var ajax;
	        var loading = true;

	        if(window.XMLHttpRequest) { // Mozilla, Safari, ...
	            ajax = new XMLHttpRequest();
	        }
	        else if(window.ActiveXObject) { // IE 8 and older
	            /* global ActiveXObject */
	            ajax = new ActiveXObject('Microsoft.XMLHTTP');
	        }

	        ajax.onreadystatechange = function() {
	            if(ajax.readyState === 4 && loading) {
	                loading = false;
	                if(ajax.status === 0 || ajax.status === 200) {
	                    cb(null, ajax.responseText);
	                }
	                else {
	                    cb({ status: ajax.status, content: ajax.responseText });
	                }
	            }
	        };

	        url += (url.indexOf('?') === -1 ? '?' : '&') + 's=' +
	               (new Date().getTime());

	        ajax.open('GET', url, this.async);
	        ajax.send();
	    }
	});

	module.exports = {
	    WebLoader: WebLoader,
	    PrecompiledLoader: PrecompiledLoader
	};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var path = __webpack_require__(3);
	var Obj = __webpack_require__(6);
	var lib = __webpack_require__(1);

	var Loader = Obj.extend({
	    on: function(name, func) {
	        this.listeners = this.listeners || {};
	        this.listeners[name] = this.listeners[name] || [];
	        this.listeners[name].push(func);
	    },

	    emit: function(name /*, arg1, arg2, ...*/) {
	        var args = Array.prototype.slice.call(arguments, 1);

	        if(this.listeners && this.listeners[name]) {
	            lib.each(this.listeners[name], function(listener) {
	                listener.apply(null, args);
	            });
	        }
	    },

	    resolve: function(from, to) {
	        return path.resolve(path.dirname(from), to);
	    },

	    isRelative: function(filename) {
	        return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
	    }
	});

	module.exports = Loader;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Loader = __webpack_require__(16);

	var PrecompiledLoader = Loader.extend({
	    init: function(compiledTemplates) {
	        this.precompiled = compiledTemplates || {};
	    },

	    getSource: function(name) {
	        if (this.precompiled[name]) {
	            return {
	                src: { type: 'code',
	                       obj: this.precompiled[name] },
	                path: name
	            };
	        }
	        return null;
	    }
	});

	module.exports = PrecompiledLoader;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	'use strict';

	function cycler(items) {
	    var index = -1;

	    return {
	        current: null,
	        reset: function() {
	            index = -1;
	            this.current = null;
	        },

	        next: function() {
	            index++;
	            if(index >= items.length) {
	                index = 0;
	            }

	            this.current = items[index];
	            return this.current;
	        },
	    };

	}

	function joiner(sep) {
	    sep = sep || ',';
	    var first = true;

	    return function() {
	        var val = first ? '' : sep;
	        first = false;
	        return val;
	    };
	}

	// Making this a function instead so it returns a new object
	// each time it's called. That way, if something like an environment
	// uses it, they will each have their own copy.
	function globals() {
	    return {
	        range: function(start, stop, step) {
	            if(typeof stop === 'undefined') {
	                stop = start;
	                start = 0;
	                step = 1;
	            }
	            else if(!step) {
	                step = 1;
	            }

	            var arr = [];
	            var i;
	            if (step > 0) {
	                for (i=start; i<stop; i+=step) {
	                    arr.push(i);
	                }
	            } else {
	                for (i=start; i>stop; i+=step) {
	                    arr.push(i);
	                }
	            }
	            return arr;
	        },

	        // lipsum: function(n, html, min, max) {
	        // },

	        cycler: function() {
	            return cycler(Array.prototype.slice.call(arguments));
	        },

	        joiner: function(sep) {
	            return joiner(sep);
	        }
	    };
	}

	module.exports = globals;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(setImmediate, process) {// MIT license (by Elan Shanker).
	(function(globals) {
	  'use strict';

	  var executeSync = function(){
	    var args = Array.prototype.slice.call(arguments);
	    if (typeof args[0] === 'function'){
	      args[0].apply(null, args.splice(1));
	    }
	  };

	  var executeAsync = function(fn){
	    if (typeof setImmediate === 'function') {
	      setImmediate(fn);
	    } else if (typeof process !== 'undefined' && process.nextTick) {
	      process.nextTick(fn);
	    } else {
	      setTimeout(fn, 0);
	    }
	  };

	  var makeIterator = function (tasks) {
	    var makeCallback = function (index) {
	      var fn = function () {
	        if (tasks.length) {
	          tasks[index].apply(null, arguments);
	        }
	        return fn.next();
	      };
	      fn.next = function () {
	        return (index < tasks.length - 1) ? makeCallback(index + 1): null;
	      };
	      return fn;
	    };
	    return makeCallback(0);
	  };
	  
	  var _isArray = Array.isArray || function(maybeArray){
	    return Object.prototype.toString.call(maybeArray) === '[object Array]';
	  };

	  var waterfall = function (tasks, callback, forceAsync) {
	    var nextTick = forceAsync ? executeAsync : executeSync;
	    callback = callback || function () {};
	    if (!_isArray(tasks)) {
	      var err = new Error('First argument to waterfall must be an array of functions');
	      return callback(err);
	    }
	    if (!tasks.length) {
	      return callback();
	    }
	    var wrapIterator = function (iterator) {
	      return function (err) {
	        if (err) {
	          callback.apply(null, arguments);
	          callback = function () {};
	        } else {
	          var args = Array.prototype.slice.call(arguments, 1);
	          var next = iterator.next();
	          if (next) {
	            args.push(wrapIterator(next));
	          } else {
	            args.push(callback);
	          }
	          nextTick(function () {
	            iterator.apply(null, args);
	          });
	        }
	      };
	    };
	    wrapIterator(makeIterator(tasks))();
	  };

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return waterfall;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // RequireJS
	  } else if (typeof module !== 'undefined' && module.exports) {
	    module.exports = waterfall; // CommonJS
	  } else {
	    globals.waterfall = waterfall; // <script>
	  }
	})(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20).setImmediate, __webpack_require__(11)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var apply = Function.prototype.apply;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// setimmediate attaches itself to the global object
	__webpack_require__(21);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(11)))

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	function installCompat() {
	    'use strict';

	    // This must be called like `nunjucks.installCompat` so that `this`
	    // references the nunjucks instance
	    var runtime = this.runtime; // jshint ignore:line
	    var lib = this.lib; // jshint ignore:line
	    var Compiler = this.compiler.Compiler; // jshint ignore:line
	    var Parser = this.parser.Parser; // jshint ignore:line
	    var nodes = this.nodes; // jshint ignore:line
	    var lexer = this.lexer; // jshint ignore:line

	    var orig_contextOrFrameLookup = runtime.contextOrFrameLookup;
	    var orig_Compiler_assertType = Compiler.prototype.assertType;
	    var orig_Parser_parseAggregate = Parser.prototype.parseAggregate;
	    var orig_memberLookup = runtime.memberLookup;

	    function uninstall() {
	        runtime.contextOrFrameLookup = orig_contextOrFrameLookup;
	        Compiler.prototype.assertType = orig_Compiler_assertType;
	        Parser.prototype.parseAggregate = orig_Parser_parseAggregate;
	        runtime.memberLookup = orig_memberLookup;
	    }

	    runtime.contextOrFrameLookup = function(context, frame, key) {
	        var val = orig_contextOrFrameLookup.apply(this, arguments);
	        if (val === undefined) {
	            switch (key) {
	            case 'True':
	                return true;
	            case 'False':
	                return false;
	            case 'None':
	                return null;
	            }
	        }

	        return val;
	    };

	    var Slice = nodes.Node.extend('Slice', {
	        fields: ['start', 'stop', 'step'],
	        init: function(lineno, colno, start, stop, step) {
	            start = start || new nodes.Literal(lineno, colno, null);
	            stop = stop || new nodes.Literal(lineno, colno, null);
	            step = step || new nodes.Literal(lineno, colno, 1);
	            this.parent(lineno, colno, start, stop, step);
	        }
	    });

	    Compiler.prototype.assertType = function(node) {
	        if (node instanceof Slice) {
	            return;
	        }
	        return orig_Compiler_assertType.apply(this, arguments);
	    };
	    Compiler.prototype.compileSlice = function(node, frame) {
	        this.emit('(');
	        this._compileExpression(node.start, frame);
	        this.emit('),(');
	        this._compileExpression(node.stop, frame);
	        this.emit('),(');
	        this._compileExpression(node.step, frame);
	        this.emit(')');
	    };

	    function getTokensState(tokens) {
	        return {
	            index: tokens.index,
	            lineno: tokens.lineno,
	            colno: tokens.colno
	        };
	    }

	    Parser.prototype.parseAggregate = function() {
	        var self = this;
	        var origState = getTokensState(this.tokens);
	        // Set back one accounting for opening bracket/parens
	        origState.colno--;
	        origState.index--;
	        try {
	            return orig_Parser_parseAggregate.apply(this);
	        } catch(e) {
	            var errState = getTokensState(this.tokens);
	            var rethrow = function() {
	                lib.extend(self.tokens, errState);
	                return e;
	            };

	            // Reset to state before original parseAggregate called
	            lib.extend(this.tokens, origState);
	            this.peeked = false;

	            var tok = this.peekToken();
	            if (tok.type !== lexer.TOKEN_LEFT_BRACKET) {
	                throw rethrow();
	            } else {
	                this.nextToken();
	            }

	            var node = new Slice(tok.lineno, tok.colno);

	            // If we don't encounter a colon while parsing, this is not a slice,
	            // so re-raise the original exception.
	            var isSlice = false;

	            for (var i = 0; i <= node.fields.length; i++) {
	                if (this.skip(lexer.TOKEN_RIGHT_BRACKET)) {
	                    break;
	                }
	                if (i === node.fields.length) {
	                    if (isSlice) {
	                        this.fail('parseSlice: too many slice components', tok.lineno, tok.colno);
	                    } else {
	                        break;
	                    }
	                }
	                if (this.skip(lexer.TOKEN_COLON)) {
	                    isSlice = true;
	                } else {
	                    var field = node.fields[i];
	                    node[field] = this.parseExpression();
	                    isSlice = this.skip(lexer.TOKEN_COLON) || isSlice;
	                }
	            }
	            if (!isSlice) {
	                throw rethrow();
	            }
	            return new nodes.Array(tok.lineno, tok.colno, [node]);
	        }
	    };

	    function sliceLookup(obj, start, stop, step) {
	        obj = obj || [];
	        if (start === null) {
	            start = (step < 0) ? (obj.length - 1) : 0;
	        }
	        if (stop === null) {
	            stop = (step < 0) ? -1 : obj.length;
	        } else {
	            if (stop < 0) {
	                stop += obj.length;
	            }
	        }

	        if (start < 0) {
	            start += obj.length;
	        }

	        var results = [];

	        for (var i = start; ; i += step) {
	            if (i < 0 || i > obj.length) {
	                break;
	            }
	            if (step > 0 && i >= stop) {
	                break;
	            }
	            if (step < 0 && i <= stop) {
	                break;
	            }
	            results.push(runtime.memberLookup(obj, i));
	        }
	        return results;
	    }

	    var ARRAY_MEMBERS = {
	        pop: function(index) {
	            if (index === undefined) {
	                return this.pop();
	            }
	            if (index >= this.length || index < 0) {
	                throw new Error('KeyError');
	            }
	            return this.splice(index, 1);
	        },
	        append: function(element) {
	                return this.push(element);
	        },
	        remove: function(element) {
	            for (var i = 0; i < this.length; i++) {
	                if (this[i] === element) {
	                    return this.splice(i, 1);
	                }
	            }
	            throw new Error('ValueError');
	        },
	        count: function(element) {
	            var count = 0;
	            for (var i = 0; i < this.length; i++) {
	                if (this[i] === element) {
	                    count++;
	                }
	            }
	            return count;
	        },
	        index: function(element) {
	            var i;
	            if ((i = this.indexOf(element)) === -1) {
	                throw new Error('ValueError');
	            }
	            return i;
	        },
	        find: function(element) {
	            return this.indexOf(element);
	        },
	        insert: function(index, elem) {
	            return this.splice(index, 0, elem);
	        }
	    };
	    var OBJECT_MEMBERS = {
	        items: function() {
	            var ret = [];
	            for(var k in this) {
	                ret.push([k, this[k]]);
	            }
	            return ret;
	        },
	        values: function() {
	            var ret = [];
	            for(var k in this) {
	                ret.push(this[k]);
	            }
	            return ret;
	        },
	        keys: function() {
	            var ret = [];
	            for(var k in this) {
	                ret.push(k);
	            }
	            return ret;
	        },
	        get: function(key, def) {
	            var output = this[key];
	            if (output === undefined) {
	                output = def;
	            }
	            return output;
	        },
	        has_key: function(key) {
	            return this.hasOwnProperty(key);
	        },
	        pop: function(key, def) {
	            var output = this[key];
	            if (output === undefined && def !== undefined) {
	                output = def;
	            } else if (output === undefined) {
	                throw new Error('KeyError');
	            } else {
	                delete this[key];
	            }
	            return output;
	        },
	        popitem: function() {
	            for (var k in this) {
	                // Return the first object pair.
	                var val = this[k];
	                delete this[k];
	                return [k, val];
	            }
	            throw new Error('KeyError');
	        },
	        setdefault: function(key, def) {
	            if (key in this) {
	                return this[key];
	            }
	            if (def === undefined) {
	                def = null;
	            }
	            return this[key] = def;
	        },
	        update: function(kwargs) {
	            for (var k in kwargs) {
	                this[k] = kwargs[k];
	            }
	            return null;    // Always returns None
	        }
	    };
	    OBJECT_MEMBERS.iteritems = OBJECT_MEMBERS.items;
	    OBJECT_MEMBERS.itervalues = OBJECT_MEMBERS.values;
	    OBJECT_MEMBERS.iterkeys = OBJECT_MEMBERS.keys;
	    runtime.memberLookup = function(obj, val, autoescape) { // jshint ignore:line
	        if (arguments.length === 4) {
	            return sliceLookup.apply(this, arguments);
	        }
	        obj = obj || {};

	        // If the object is an object, return any of the methods that Python would
	        // otherwise provide.
	        if (lib.isArray(obj) && ARRAY_MEMBERS.hasOwnProperty(val)) {
	            return function() {return ARRAY_MEMBERS[val].apply(obj, arguments);};
	        }

	        if (lib.isObject(obj) && OBJECT_MEMBERS.hasOwnProperty(val)) {
	            return function() {return OBJECT_MEMBERS[val].apply(obj, arguments);};
	        }

	        return orig_memberLookup.apply(this, arguments);
	    };

	    return uninstall;
	}

	module.exports = installCompat;


/***/ })
/******/ ])
});
;
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _controller = require('./lib/controller');

var _controller2 = _interopRequireDefault(_controller);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_nunjucks2.default.configure('./dist');

function getName(request) {
  var name = {
    fname: 'Rick',
    lname: 'Sanchez'
  };

  var nameParts = request.params.name ? request.params.name.split('/') : [];

  name.fname = nameParts[0] || request.query.fname || name.fname;
  name.lname = nameParts[1] || request.query.lname || name.lname;
  return name;
}

var HelloController = function (_Controller) {
  _inherits(HelloController, _Controller);

  function HelloController() {
    _classCallCheck(this, HelloController);

    return _possibleConstructorReturn(this, (HelloController.__proto__ || Object.getPrototypeOf(HelloController)).apply(this, arguments));
  }

  _createClass(HelloController, [{
    key: 'toString',
    value: function toString(callback) {
      _nunjucks2.default.renderString('hello.html', getName(this.context), function (err, html) {
        if (err) {
          return callback(err, null);
        }
        callback(null, html);
      });
    }
  }, {
    key: 'index',
    value: function index(application, request, reply, callback) {
      this.context.cookie.set('random', '_' + (Math.floor(Math.random() * 1000) + 1), { path: '/' });
      callback(null);
    }
  }]);

  return HelloController;
}(_controller2.default);

exports.default = HelloController;

},{"./lib/controller":5,"nunjucks":2}],4:[function(require,module,exports){
'use strict';

var _lib = require('./lib');

var _lib2 = _interopRequireDefault(_lib);

var _helloController = require('./hello-controller');

var _helloController2 = _interopRequireDefault(_helloController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('hello browser');

var application = new _lib2.default({
  '/hello/{name}': _helloController2.default
}, {

  target: 'body'
});

application.start();

},{"./hello-controller":3,"./lib":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
  function Controller(context) {
    _classCallCheck(this, Controller);

    this.context = context;
  }

  _createClass(Controller, [{
    key: 'index',
    value: function index(application, request, reply, callback) {
      callback(null);
    }
  }, {
    key: 'toString',
    value: function toString(callback) {
      callback(null, '成功');
    }
  }]);

  return Controller;
}();

exports.default = Controller;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cookiesJs = require('cookies-js');

var _cookiesJs2 = _interopRequireDefault(_cookiesJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  get: function get(name) {
    return _cookiesJs2.default.get(name);
  },
  set: function set(name, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (options.expires) {
      options.expires /= 1000;
    }

    _cookiesJs2.default.set(name, value, options);
  }
};

},{"cookies-js":1}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cookie = require('./cookie.client');

var _cookie2 = _interopRequireDefault(_cookie);

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _reply = require('./reply.client');

var _reply2 = _interopRequireDefault(_reply);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Application = function () {
  function Application() {
    _classCallCheck(this, Application);
  }

  _createClass(Application, [{
    key: 'navigate',
    value: function navigate(url) {
      var push = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var controller = new _controller2.default({
        query: query.parse(search),
        params: params,
        cookie: _cookie2.default
      });

      var request = function request() {};
      var reply = (0, _reply2.default)(this);
    }
  }]);

  return Application;
}();

exports.default = Application;

},{"./controller":5,"./cookie.client":6,"./reply.client":8}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (application) {
  var reply = function reply() {};
  reply.redirect = function (url) {
    application.navigate(url);
    return this;
  };

  reply.temporary = function () {
    return this;
  };

  reply.rewritable = function () {
    return this;
  };

  reply.permanent = function () {
    return this;
  };

  return reply;
};

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29va2llcy1qcy9kaXN0L2Nvb2tpZXMuanMiLCJub2RlX21vZHVsZXMvbnVuanVja3MvYnJvd3Nlci9udW5qdWNrcy5qcyIsInNyYy9oZWxsby1jb250cm9sbGVyLmpzIiwic3JjL2luZGV4LmNsaWVudC5qcyIsInNyYy9saWIvY29udHJvbGxlci5qcyIsInNyYy9saWIvY29va2llLmNsaWVudC5qcyIsInNyYy9saWIvaW5kZXguY2xpZW50LmpzIiwic3JjL2xpYi9yZXBseS5jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNXZOQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxtQkFBUyxTQUFULENBQW1CLFFBQW5COztBQUVBLFNBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQjtBQUN4QixNQUFJLE9BQU87QUFDVCxXQUFPLE1BREU7QUFFVCxXQUFPO0FBRkUsR0FBWDs7QUFLQSxNQUFJLFlBQVksUUFBUSxNQUFSLENBQWUsSUFBZixHQUFzQixRQUFRLE1BQVIsQ0FBZSxJQUFmLENBQW9CLEtBQXBCLENBQTBCLEdBQTFCLENBQXRCLEdBQXVELEVBQXZFOztBQUVBLE9BQUssS0FBTCxHQUFjLFVBQVUsQ0FBVixLQUFnQixRQUFRLEtBQVIsQ0FBYyxLQUEvQixJQUF5QyxLQUFLLEtBQTNEO0FBQ0EsT0FBSyxLQUFMLEdBQWMsVUFBVSxDQUFWLEtBQWdCLFFBQVEsS0FBUixDQUFjLEtBQS9CLElBQXlDLEtBQUssS0FBM0Q7QUFDQSxTQUFPLElBQVA7QUFDRDs7SUFFb0IsZTs7Ozs7Ozs7Ozs7NkJBQ1YsUSxFQUFVO0FBQ2pCLHlCQUFTLFlBQVQsQ0FBc0IsWUFBdEIsRUFBb0MsUUFBUSxLQUFLLE9BQWIsQ0FBcEMsRUFBMkQsVUFBQyxHQUFELEVBQU0sSUFBTixFQUFlO0FBQ3hFLFlBQUksR0FBSixFQUFTO0FBQ1AsaUJBQU8sU0FBUyxHQUFULEVBQWMsSUFBZCxDQUFQO0FBQ0Q7QUFDRCxpQkFBUyxJQUFULEVBQWUsSUFBZjtBQUNELE9BTEQ7QUFNRDs7OzBCQUNLLFcsRUFBYSxPLEVBQVMsSyxFQUFPLFEsRUFBVTtBQUMzQyxXQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLEdBQXBCLENBQXdCLFFBQXhCLEVBQWtDLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWdCLElBQTNCLElBQW1DLENBQTFDLENBQWxDLEVBQWdGLEVBQUMsTUFBTSxHQUFQLEVBQWhGO0FBQ0EsZUFBUyxJQUFUO0FBQ0Q7Ozs7OztrQkFaa0IsZTs7Ozs7QUNoQnJCOzs7O0FBQ0E7Ozs7OztBQUhBLFFBQVEsR0FBUixDQUFZLGVBQVo7O0FBS0EsSUFBTSxjQUFjLGtCQUFnQjtBQUNsQztBQURrQyxDQUFoQixFQUVqQjs7QUFFRCxVQUFRO0FBRlAsQ0FGaUIsQ0FBcEI7O0FBT0EsWUFBWSxLQUFaOzs7Ozs7Ozs7Ozs7O0lDWnFCLFU7QUFDbkIsc0JBQVksT0FBWixFQUFxQjtBQUFBOztBQUNuQixTQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0Q7Ozs7MEJBRUssVyxFQUFhLE8sRUFBUyxLLEVBQU8sUSxFQUFVO0FBQzNDLGVBQVMsSUFBVDtBQUNEOzs7NkJBRVEsUSxFQUFVO0FBQ2pCLGVBQVMsSUFBVCxFQUFlLElBQWY7QUFDRDs7Ozs7O2tCQVhrQixVOzs7Ozs7Ozs7QUNBckI7Ozs7OztrQkFFZTtBQUNiLEtBRGEsZUFDVCxJQURTLEVBQ0g7QUFDUixXQUFPLG9CQUFPLEdBQVAsQ0FBVyxJQUFYLENBQVA7QUFDRCxHQUhZO0FBSWIsS0FKYSxlQUlULElBSlMsRUFJSCxLQUpHLEVBSWtCO0FBQUEsUUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQzdCLFFBQUksUUFBUSxPQUFaLEVBQXFCO0FBQ25CLGNBQVEsT0FBUixJQUFtQixJQUFuQjtBQUNEOztBQUVELHdCQUFPLEdBQVAsQ0FBVyxJQUFYLEVBQWlCLEtBQWpCLEVBQXdCLE9BQXhCO0FBQ0Q7QUFWWSxDOzs7Ozs7Ozs7OztBQ0ZmOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7SUFFcUIsVzs7Ozs7Ozs2QkFDVixHLEVBQWtCO0FBQUEsVUFBYixJQUFhLHVFQUFOLElBQU07O0FBQ3pCLFVBQU0sYUFBYSx5QkFBZTtBQUNoQyxlQUFPLE1BQU0sS0FBTixDQUFZLE1BQVosQ0FEeUI7QUFFaEMsZ0JBQVEsTUFGd0I7QUFHaEM7QUFIZ0MsT0FBZixDQUFuQjs7QUFNQSxVQUFNLFVBQVUsU0FBVixPQUFVLEdBQU0sQ0FBRSxDQUF4QjtBQUNBLFVBQU0sUUFBUSxxQkFBYSxJQUFiLENBQWQ7QUFDRDs7Ozs7O2tCQVZrQixXOzs7Ozs7Ozs7a0JDSk4sVUFBUyxXQUFULEVBQXNCO0FBQ25DLE1BQU0sUUFBUSxTQUFSLEtBQVEsR0FBVyxDQUV4QixDQUZEO0FBR0EsUUFBTSxRQUFOLEdBQWlCLFVBQVMsR0FBVCxFQUFjO0FBQzdCLGdCQUFZLFFBQVosQ0FBcUIsR0FBckI7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUhEOztBQUtBLFFBQU0sU0FBTixHQUFrQixZQUFXO0FBQzNCLFdBQU8sSUFBUDtBQUNELEdBRkQ7O0FBSUEsUUFBTSxVQUFOLEdBQW1CLFlBQVc7QUFDNUIsV0FBTyxJQUFQO0FBQ0QsR0FGRDs7QUFJQSxRQUFNLFNBQU4sR0FBa0IsWUFBVztBQUMzQixXQUFPLElBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU8sS0FBUDtBQUNELEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcclxuICogQ29va2llcy5qcyAtIDEuMi4zXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9TY290dEhhbXBlci9Db29raWVzXHJcbiAqXHJcbiAqIFRoaXMgaXMgZnJlZSBhbmQgdW5lbmN1bWJlcmVkIHNvZnR3YXJlIHJlbGVhc2VkIGludG8gdGhlIHB1YmxpYyBkb21haW4uXHJcbiAqL1xyXG4oZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIGZhY3RvcnkgPSBmdW5jdGlvbiAod2luZG93KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29va2llcy5qcyByZXF1aXJlcyBhIGB3aW5kb3dgIHdpdGggYSBgZG9jdW1lbnRgIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIENvb2tpZXMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLmdldChrZXkpIDogQ29va2llcy5zZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQWxsb3dzIGZvciBzZXR0ZXIgaW5qZWN0aW9uIGluIHVuaXQgdGVzdHNcclxuICAgICAgICBDb29raWVzLl9kb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHJcbiAgICAgICAgLy8gVXNlZCB0byBlbnN1cmUgY29va2llIGtleXMgZG8gbm90IGNvbGxpZGUgd2l0aFxyXG4gICAgICAgIC8vIGJ1aWx0LWluIGBPYmplY3RgIHByb3BlcnRpZXNcclxuICAgICAgICBDb29raWVzLl9jYWNoZUtleVByZWZpeCA9ICdjb29rZXkuJzsgLy8gSHVyciBodXJyLCA6KVxyXG4gICAgICAgIFxyXG4gICAgICAgIENvb2tpZXMuX21heEV4cGlyZURhdGUgPSBuZXcgRGF0ZSgnRnJpLCAzMSBEZWMgOTk5OSAyMzo1OTo1OSBVVEMnKTtcclxuXHJcbiAgICAgICAgQ29va2llcy5kZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgcGF0aDogJy8nLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSAhPT0gQ29va2llcy5fZG9jdW1lbnQuY29va2llKSB7XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IENvb2tpZXMuX2NhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsga2V5XTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBDb29raWVzLl9nZXRFeHRlbmRlZE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuZXhwaXJlcyA9IENvb2tpZXMuX2dldEV4cGlyZXNEYXRlKHZhbHVlID09PSB1bmRlZmluZWQgPyAtMSA6IG9wdGlvbnMuZXhwaXJlcyk7XHJcblxyXG4gICAgICAgICAgICBDb29raWVzLl9kb2N1bWVudC5jb29raWUgPSBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyhrZXksIHZhbHVlLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuZXhwaXJlID0gZnVuY3Rpb24gKGtleSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcy5zZXQoa2V5LCB1bmRlZmluZWQsIG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiBvcHRpb25zICYmIG9wdGlvbnMucGF0aCB8fCBDb29raWVzLmRlZmF1bHRzLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBkb21haW46IG9wdGlvbnMgJiYgb3B0aW9ucy5kb21haW4gfHwgQ29va2llcy5kZWZhdWx0cy5kb21haW4sXHJcbiAgICAgICAgICAgICAgICBleHBpcmVzOiBvcHRpb25zICYmIG9wdGlvbnMuZXhwaXJlcyB8fCBDb29raWVzLmRlZmF1bHRzLmV4cGlyZXMsXHJcbiAgICAgICAgICAgICAgICBzZWN1cmU6IG9wdGlvbnMgJiYgb3B0aW9ucy5zZWN1cmUgIT09IHVuZGVmaW5lZCA/ICBvcHRpb25zLnNlY3VyZSA6IENvb2tpZXMuZGVmYXVsdHMuc2VjdXJlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5faXNWYWxpZERhdGUgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGUpID09PSAnW29iamVjdCBEYXRlXScgJiYgIWlzTmFOKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRFeHBpcmVzRGF0ZSA9IGZ1bmN0aW9uIChleHBpcmVzLCBub3cpIHtcclxuICAgICAgICAgICAgbm93ID0gbm93IHx8IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4cGlyZXMgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgICAgICBleHBpcmVzID0gZXhwaXJlcyA9PT0gSW5maW5pdHkgP1xyXG4gICAgICAgICAgICAgICAgICAgIENvb2tpZXMuX21heEV4cGlyZURhdGUgOiBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgZXhwaXJlcyAqIDEwMDApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBpcmVzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgZXhwaXJlcyA9IG5ldyBEYXRlKGV4cGlyZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXhwaXJlcyAmJiAhQ29va2llcy5faXNWYWxpZERhdGUoZXhwaXJlcykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYGV4cGlyZXNgIHBhcmFtZXRlciBjYW5ub3QgYmUgY29udmVydGVkIHRvIGEgdmFsaWQgRGF0ZSBpbnN0YW5jZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZXhwaXJlcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9bXiMkJitcXF5gfF0vZywgZW5jb2RlVVJJQ29tcG9uZW50KTtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcKC9nLCAnJTI4JykucmVwbGFjZSgvXFwpL2csICclMjknKTtcclxuICAgICAgICAgICAgdmFsdWUgPSAodmFsdWUgKyAnJykucmVwbGFjZSgvW14hIyQmLStcXC0tOjwtXFxbXFxdLX5dL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvb2tpZVN0cmluZyA9IGtleSArICc9JyArIHZhbHVlO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5wYXRoID8gJztwYXRoPScgKyBvcHRpb25zLnBhdGggOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuZG9tYWluID8gJztkb21haW49JyArIG9wdGlvbnMuZG9tYWluIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLmV4cGlyZXMgPyAnO2V4cGlyZXM9JyArIG9wdGlvbnMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLnNlY3VyZSA/ICc7c2VjdXJlJyA6ICcnO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZVN0cmluZztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcgPSBmdW5jdGlvbiAoZG9jdW1lbnRDb29raWUpIHtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZUNhY2hlID0ge307XHJcbiAgICAgICAgICAgIHZhciBjb29raWVzQXJyYXkgPSBkb2N1bWVudENvb2tpZSA/IGRvY3VtZW50Q29va2llLnNwbGl0KCc7ICcpIDogW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXNBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb2tpZUt2cCA9IENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcoY29va2llc0FycmF5W2ldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9IGNvb2tpZUt2cC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZUNhY2hlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcgPSBmdW5jdGlvbiAoY29va2llU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vIFwiPVwiIGlzIGEgdmFsaWQgY2hhcmFjdGVyIGluIGEgY29va2llIHZhbHVlIGFjY29yZGluZyB0byBSRkM2MjY1LCBzbyBjYW5ub3QgYHNwbGl0KCc9JylgXHJcbiAgICAgICAgICAgIHZhciBzZXBhcmF0b3JJbmRleCA9IGNvb2tpZVN0cmluZy5pbmRleE9mKCc9Jyk7XHJcblxyXG4gICAgICAgICAgICAvLyBJRSBvbWl0cyB0aGUgXCI9XCIgd2hlbiB0aGUgY29va2llIHZhbHVlIGlzIGFuIGVtcHR5IHN0cmluZ1xyXG4gICAgICAgICAgICBzZXBhcmF0b3JJbmRleCA9IHNlcGFyYXRvckluZGV4IDwgMCA/IGNvb2tpZVN0cmluZy5sZW5ndGggOiBzZXBhcmF0b3JJbmRleDtcclxuXHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBjb29raWVTdHJpbmcuc3Vic3RyKDAsIHNlcGFyYXRvckluZGV4KTtcclxuICAgICAgICAgICAgdmFyIGRlY29kZWRLZXk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkZWNvZGVkS2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb25zb2xlICYmIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGRlY29kZSBjb29raWUgd2l0aCBrZXkgXCInICsga2V5ICsgJ1wiJywgZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGRlY29kZWRLZXksXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogY29va2llU3RyaW5nLnN1YnN0cihzZXBhcmF0b3JJbmRleCArIDEpIC8vIERlZmVyIGRlY29kaW5nIHZhbHVlIHVudGlsIGFjY2Vzc2VkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGUgPSBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcoQ29va2llcy5fZG9jdW1lbnQuY29va2llKTtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgPSBDb29raWVzLl9kb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fYXJlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlc3RLZXkgPSAnY29va2llcy5qcyc7XHJcbiAgICAgICAgICAgIHZhciBhcmVFbmFibGVkID0gQ29va2llcy5zZXQodGVzdEtleSwgMSkuZ2V0KHRlc3RLZXkpID09PSAnMSc7XHJcbiAgICAgICAgICAgIENvb2tpZXMuZXhwaXJlKHRlc3RLZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJlRW5hYmxlZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmVuYWJsZWQgPSBDb29raWVzLl9hcmVFbmFibGVkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgfTtcclxuICAgIHZhciBjb29raWVzRXhwb3J0ID0gKGdsb2JhbCAmJiB0eXBlb2YgZ2xvYmFsLmRvY3VtZW50ID09PSAnb2JqZWN0JykgPyBmYWN0b3J5KGdsb2JhbCkgOiBmYWN0b3J5O1xyXG5cclxuICAgIC8vIEFNRCBzdXBwb3J0XHJcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvb2tpZXNFeHBvcnQ7IH0pO1xyXG4gICAgLy8gQ29tbW9uSlMvTm9kZS5qcyBzdXBwb3J0XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIC8vIFN1cHBvcnQgTm9kZS5qcyBzcGVjaWZpYyBgbW9kdWxlLmV4cG9ydHNgICh3aGljaCBjYW4gYmUgYSBmdW5jdGlvbilcclxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBCdXQgYWx3YXlzIHN1cHBvcnQgQ29tbW9uSlMgbW9kdWxlIDEuMS4xIHNwZWMgKGBleHBvcnRzYCBjYW5ub3QgYmUgYSBmdW5jdGlvbilcclxuICAgICAgICBleHBvcnRzLkNvb2tpZXMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBnbG9iYWwuQ29va2llcyA9IGNvb2tpZXNFeHBvcnQ7XHJcbiAgICB9XHJcbn0pKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gdGhpcyA6IHdpbmRvdyk7IiwiLyohIEJyb3dzZXIgYnVuZGxlIG9mIG51bmp1Y2tzIDMuMC4xICAqL1xuKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wibnVuanVja3NcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wibnVuanVja3NcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuXG5cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgbGliID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblx0dmFyIGVudiA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XG5cdHZhciBMb2FkZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE2KTtcblx0dmFyIGxvYWRlcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE1KTtcblx0dmFyIHByZWNvbXBpbGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpO1xuXG5cdG1vZHVsZS5leHBvcnRzID0ge307XG5cdG1vZHVsZS5leHBvcnRzLkVudmlyb25tZW50ID0gZW52LkVudmlyb25tZW50O1xuXHRtb2R1bGUuZXhwb3J0cy5UZW1wbGF0ZSA9IGVudi5UZW1wbGF0ZTtcblxuXHRtb2R1bGUuZXhwb3J0cy5Mb2FkZXIgPSBMb2FkZXI7XG5cdG1vZHVsZS5leHBvcnRzLkZpbGVTeXN0ZW1Mb2FkZXIgPSBsb2FkZXJzLkZpbGVTeXN0ZW1Mb2FkZXI7XG5cdG1vZHVsZS5leHBvcnRzLlByZWNvbXBpbGVkTG9hZGVyID0gbG9hZGVycy5QcmVjb21waWxlZExvYWRlcjtcblx0bW9kdWxlLmV4cG9ydHMuV2ViTG9hZGVyID0gbG9hZGVycy5XZWJMb2FkZXI7XG5cblx0bW9kdWxlLmV4cG9ydHMuY29tcGlsZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpO1xuXHRtb2R1bGUuZXhwb3J0cy5wYXJzZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDgpO1xuXHRtb2R1bGUuZXhwb3J0cy5sZXhlciA9IF9fd2VicGFja19yZXF1aXJlX18oOSk7XG5cdG1vZHVsZS5leHBvcnRzLnJ1bnRpbWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEzKTtcblx0bW9kdWxlLmV4cG9ydHMubGliID0gbGliO1xuXHRtb2R1bGUuZXhwb3J0cy5ub2RlcyA9IF9fd2VicGFja19yZXF1aXJlX18oMTApO1xuXG5cdG1vZHVsZS5leHBvcnRzLmluc3RhbGxKaW5qYUNvbXBhdCA9IF9fd2VicGFja19yZXF1aXJlX18oMjIpO1xuXG5cdC8vIEEgc2luZ2xlIGluc3RhbmNlIG9mIGFuIGVudmlyb25tZW50LCBzaW5jZSB0aGlzIGlzIHNvIGNvbW1vbmx5IHVzZWRcblxuXHR2YXIgZTtcblx0bW9kdWxlLmV4cG9ydHMuY29uZmlndXJlID0gZnVuY3Rpb24odGVtcGxhdGVzUGF0aCwgb3B0cykge1xuXHQgICAgb3B0cyA9IG9wdHMgfHwge307XG5cdCAgICBpZihsaWIuaXNPYmplY3QodGVtcGxhdGVzUGF0aCkpIHtcblx0ICAgICAgICBvcHRzID0gdGVtcGxhdGVzUGF0aDtcblx0ICAgICAgICB0ZW1wbGF0ZXNQYXRoID0gbnVsbDtcblx0ICAgIH1cblxuXHQgICAgdmFyIFRlbXBsYXRlTG9hZGVyO1xuXHQgICAgaWYobG9hZGVycy5GaWxlU3lzdGVtTG9hZGVyKSB7XG5cdCAgICAgICAgVGVtcGxhdGVMb2FkZXIgPSBuZXcgbG9hZGVycy5GaWxlU3lzdGVtTG9hZGVyKHRlbXBsYXRlc1BhdGgsIHtcblx0ICAgICAgICAgICAgd2F0Y2g6IG9wdHMud2F0Y2gsXG5cdCAgICAgICAgICAgIG5vQ2FjaGU6IG9wdHMubm9DYWNoZVxuXHQgICAgICAgIH0pO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZihsb2FkZXJzLldlYkxvYWRlcikge1xuXHQgICAgICAgIFRlbXBsYXRlTG9hZGVyID0gbmV3IGxvYWRlcnMuV2ViTG9hZGVyKHRlbXBsYXRlc1BhdGgsIHtcblx0ICAgICAgICAgICAgdXNlQ2FjaGU6IG9wdHMud2ViICYmIG9wdHMud2ViLnVzZUNhY2hlLFxuXHQgICAgICAgICAgICBhc3luYzogb3B0cy53ZWIgJiYgb3B0cy53ZWIuYXN5bmNcblx0ICAgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgZSA9IG5ldyBlbnYuRW52aXJvbm1lbnQoVGVtcGxhdGVMb2FkZXIsIG9wdHMpO1xuXG5cdCAgICBpZihvcHRzICYmIG9wdHMuZXhwcmVzcykge1xuXHQgICAgICAgIGUuZXhwcmVzcyhvcHRzLmV4cHJlc3MpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy5jb21waWxlID0gZnVuY3Rpb24oc3JjLCBlbnYsIHBhdGgsIGVhZ2VyQ29tcGlsZSkge1xuXHQgICAgaWYoIWUpIHtcblx0ICAgICAgICBtb2R1bGUuZXhwb3J0cy5jb25maWd1cmUoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBuZXcgbW9kdWxlLmV4cG9ydHMuVGVtcGxhdGUoc3JjLCBlbnYsIHBhdGgsIGVhZ2VyQ29tcGlsZSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMucmVuZGVyID0gZnVuY3Rpb24obmFtZSwgY3R4LCBjYikge1xuXHQgICAgaWYoIWUpIHtcblx0ICAgICAgICBtb2R1bGUuZXhwb3J0cy5jb25maWd1cmUoKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGUucmVuZGVyKG5hbWUsIGN0eCwgY2IpO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzLnJlbmRlclN0cmluZyA9IGZ1bmN0aW9uKHNyYywgY3R4LCBjYikge1xuXHQgICAgaWYoIWUpIHtcblx0ICAgICAgICBtb2R1bGUuZXhwb3J0cy5jb25maWd1cmUoKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGUucmVuZGVyU3RyaW5nKHNyYywgY3R4LCBjYik7XG5cdH07XG5cblx0aWYocHJlY29tcGlsZSkge1xuXHQgICAgbW9kdWxlLmV4cG9ydHMucHJlY29tcGlsZSA9IHByZWNvbXBpbGUucHJlY29tcGlsZTtcblx0ICAgIG1vZHVsZS5leHBvcnRzLnByZWNvbXBpbGVTdHJpbmcgPSBwcmVjb21waWxlLnByZWNvbXBpbGVTdHJpbmc7XG5cdH1cblxuXG4vKioqLyB9KSxcbi8qIDEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cdHZhciBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cblx0dmFyIGVzY2FwZU1hcCA9IHtcblx0ICAgICcmJzogJyZhbXA7Jyxcblx0ICAgICdcIic6ICcmcXVvdDsnLFxuXHQgICAgJ1xcJyc6ICcmIzM5OycsXG5cdCAgICAnPCc6ICcmbHQ7Jyxcblx0ICAgICc+JzogJyZndDsnXG5cdH07XG5cblx0dmFyIGVzY2FwZVJlZ2V4ID0gL1smXCInPD5dL2c7XG5cblx0dmFyIGxvb2t1cEVzY2FwZSA9IGZ1bmN0aW9uKGNoKSB7XG5cdCAgICByZXR1cm4gZXNjYXBlTWFwW2NoXTtcblx0fTtcblxuXHR2YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cblx0ZXhwb3J0cy5wcmV0dGlmeUVycm9yID0gZnVuY3Rpb24ocGF0aCwgd2l0aEludGVybmFscywgZXJyKSB7XG5cdCAgICAvLyBqc2hpbnQgLVcwMjJcblx0ICAgIC8vIGh0dHA6Ly9qc2xpbnRlcnJvcnMuY29tL2RvLW5vdC1hc3NpZ24tdG8tdGhlLWV4Y2VwdGlvbi1wYXJhbWV0ZXJcblx0ICAgIGlmICghZXJyLlVwZGF0ZSkge1xuXHQgICAgICAgIC8vIG5vdCBvbmUgb2Ygb3VycywgY2FzdCBpdFxuXHQgICAgICAgIGVyciA9IG5ldyBleHBvcnRzLlRlbXBsYXRlRXJyb3IoZXJyKTtcblx0ICAgIH1cblx0ICAgIGVyci5VcGRhdGUocGF0aCk7XG5cblx0ICAgIC8vIFVubGVzcyB0aGV5IG1hcmtlZCB0aGUgZGV2IGZsYWcsIHNob3cgdGhlbSBhIHRyYWNlIGZyb20gaGVyZVxuXHQgICAgaWYgKCF3aXRoSW50ZXJuYWxzKSB7XG5cdCAgICAgICAgdmFyIG9sZCA9IGVycjtcblx0ICAgICAgICBlcnIgPSBuZXcgRXJyb3Iob2xkLm1lc3NhZ2UpO1xuXHQgICAgICAgIGVyci5uYW1lID0gb2xkLm5hbWU7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBlcnI7XG5cdH07XG5cblx0ZXhwb3J0cy5UZW1wbGF0ZUVycm9yID0gZnVuY3Rpb24obWVzc2FnZSwgbGluZW5vLCBjb2xubykge1xuXHQgICAgdmFyIGVyciA9IHRoaXM7XG5cblx0ICAgIGlmIChtZXNzYWdlIGluc3RhbmNlb2YgRXJyb3IpIHsgLy8gZm9yIGNhc3RpbmcgcmVndWxhciBqcyBlcnJvcnNcblx0ICAgICAgICBlcnIgPSBtZXNzYWdlO1xuXHQgICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlLm5hbWUgKyAnOiAnICsgbWVzc2FnZS5tZXNzYWdlO1xuXG5cdCAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgICAgaWYoZXJyLm5hbWUgPSAnJykge31cblx0ICAgICAgICB9XG5cdCAgICAgICAgY2F0Y2goZSkge1xuXHQgICAgICAgICAgICAvLyBJZiB3ZSBjYW4ndCBzZXQgdGhlIG5hbWUgb2YgdGhlIGVycm9yIG9iamVjdCBpbiB0aGlzXG5cdCAgICAgICAgICAgIC8vIGVudmlyb25tZW50LCBkb24ndCB1c2UgaXRcblx0ICAgICAgICAgICAgZXJyID0gdGhpcztcblx0ICAgICAgICB9XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlmKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG5cdCAgICAgICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGVycik7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBlcnIubmFtZSA9ICdUZW1wbGF0ZSByZW5kZXIgZXJyb3InO1xuXHQgICAgZXJyLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHQgICAgZXJyLmxpbmVubyA9IGxpbmVubztcblx0ICAgIGVyci5jb2xubyA9IGNvbG5vO1xuXHQgICAgZXJyLmZpcnN0VXBkYXRlID0gdHJ1ZTtcblxuXHQgICAgZXJyLlVwZGF0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcblx0ICAgICAgICB2YXIgbWVzc2FnZSA9ICcoJyArIChwYXRoIHx8ICd1bmtub3duIHBhdGgnKSArICcpJztcblxuXHQgICAgICAgIC8vIG9ubHkgc2hvdyBsaW5lbm8gKyBjb2xubyBuZXh0IHRvIHBhdGggb2YgdGVtcGxhdGVcblx0ICAgICAgICAvLyB3aGVyZSBlcnJvciBvY2N1cnJlZFxuXHQgICAgICAgIGlmICh0aGlzLmZpcnN0VXBkYXRlKSB7XG5cdCAgICAgICAgICAgIGlmKHRoaXMubGluZW5vICYmIHRoaXMuY29sbm8pIHtcblx0ICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gJyBbTGluZSAnICsgdGhpcy5saW5lbm8gKyAnLCBDb2x1bW4gJyArIHRoaXMuY29sbm8gKyAnXSc7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSBpZih0aGlzLmxpbmVubykge1xuXHQgICAgICAgICAgICAgICAgbWVzc2FnZSArPSAnIFtMaW5lICcgKyB0aGlzLmxpbmVubyArICddJztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIG1lc3NhZ2UgKz0gJ1xcbiAnO1xuXHQgICAgICAgIGlmICh0aGlzLmZpcnN0VXBkYXRlKSB7XG5cdCAgICAgICAgICAgIG1lc3NhZ2UgKz0gJyAnO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgKyAodGhpcy5tZXNzYWdlIHx8ICcnKTtcblx0ICAgICAgICB0aGlzLmZpcnN0VXBkYXRlID0gZmFsc2U7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICB9O1xuXG5cdCAgICByZXR1cm4gZXJyO1xuXHR9O1xuXG5cdGV4cG9ydHMuVGVtcGxhdGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5cblx0ZXhwb3J0cy5lc2NhcGUgPSBmdW5jdGlvbih2YWwpIHtcblx0ICByZXR1cm4gdmFsLnJlcGxhY2UoZXNjYXBlUmVnZXgsIGxvb2t1cEVzY2FwZSk7XG5cdH07XG5cblx0ZXhwb3J0cy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG5cdCAgICByZXR1cm4gT2JqUHJvdG8udG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHR9O1xuXG5cdGV4cG9ydHMuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG5cdCAgICByZXR1cm4gT2JqUHJvdG8udG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuXHR9O1xuXG5cdGV4cG9ydHMuaXNTdHJpbmcgPSBmdW5jdGlvbihvYmopIHtcblx0ICAgIHJldHVybiBPYmpQcm90by50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xuXHR9O1xuXG5cdGV4cG9ydHMuaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcblx0ICAgIHJldHVybiBPYmpQcm90by50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xuXHR9O1xuXG5cdGV4cG9ydHMuZ3JvdXBCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsKSB7XG5cdCAgICB2YXIgcmVzdWx0ID0ge307XG5cdCAgICB2YXIgaXRlcmF0b3IgPSBleHBvcnRzLmlzRnVuY3Rpb24odmFsKSA/IHZhbCA6IGZ1bmN0aW9uKG9iaikgeyByZXR1cm4gb2JqW3ZhbF07IH07XG5cdCAgICBmb3IodmFyIGk9MDsgaTxvYmoubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICB2YXIgdmFsdWUgPSBvYmpbaV07XG5cdCAgICAgICAgdmFyIGtleSA9IGl0ZXJhdG9yKHZhbHVlLCBpKTtcblx0ICAgICAgICAocmVzdWx0W2tleV0gfHwgKHJlc3VsdFtrZXldID0gW10pKS5wdXNoKHZhbHVlKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0ZXhwb3J0cy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG5cdCAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwob2JqKTtcblx0fTtcblxuXHRleHBvcnRzLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuXHQgICAgdmFyIHJlc3VsdCA9IFtdO1xuXHQgICAgaWYgKCFhcnJheSkge1xuXHQgICAgICAgIHJldHVybiByZXN1bHQ7XG5cdCAgICB9XG5cdCAgICB2YXIgaW5kZXggPSAtMSxcblx0ICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcblx0ICAgIGNvbnRhaW5zID0gZXhwb3J0cy50b0FycmF5KGFyZ3VtZW50cykuc2xpY2UoMSk7XG5cblx0ICAgIHdoaWxlKCsraW5kZXggPCBsZW5ndGgpIHtcblx0ICAgICAgICBpZihleHBvcnRzLmluZGV4T2YoY29udGFpbnMsIGFycmF5W2luZGV4XSkgPT09IC0xKSB7XG5cdCAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFycmF5W2luZGV4XSk7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRleHBvcnRzLmV4dGVuZCA9IGZ1bmN0aW9uKG9iaiwgb2JqMikge1xuXHQgICAgZm9yKHZhciBrIGluIG9iajIpIHtcblx0ICAgICAgICBvYmpba10gPSBvYmoyW2tdO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG9iajtcblx0fTtcblxuXHRleHBvcnRzLnJlcGVhdCA9IGZ1bmN0aW9uKGNoYXJfLCBuKSB7XG5cdCAgICB2YXIgc3RyID0gJyc7XG5cdCAgICBmb3IodmFyIGk9MDsgaTxuOyBpKyspIHtcblx0ICAgICAgICBzdHIgKz0gY2hhcl87XG5cdCAgICB9XG5cdCAgICByZXR1cm4gc3RyO1xuXHR9O1xuXG5cdGV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uKG9iaiwgZnVuYywgY29udGV4dCkge1xuXHQgICAgaWYob2JqID09IG51bGwpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIGlmKEFycmF5UHJvdG8uZWFjaCAmJiBvYmouZWFjaCA9PT0gQXJyYXlQcm90by5lYWNoKSB7XG5cdCAgICAgICAgb2JqLmZvckVhY2goZnVuYywgY29udGV4dCk7XG5cdCAgICB9XG5cdCAgICBlbHNlIGlmKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSB7XG5cdCAgICAgICAgZm9yKHZhciBpPTAsIGw9b2JqLmxlbmd0aDsgaTxsOyBpKyspIHtcblx0ICAgICAgICAgICAgZnVuYy5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcblx0ICAgICAgICB9XG5cdCAgICB9XG5cdH07XG5cblx0ZXhwb3J0cy5tYXAgPSBmdW5jdGlvbihvYmosIGZ1bmMpIHtcblx0ICAgIHZhciByZXN1bHRzID0gW107XG5cdCAgICBpZihvYmogPT0gbnVsbCkge1xuXHQgICAgICAgIHJldHVybiByZXN1bHRzO1xuXHQgICAgfVxuXG5cdCAgICBpZihBcnJheVByb3RvLm1hcCAmJiBvYmoubWFwID09PSBBcnJheVByb3RvLm1hcCkge1xuXHQgICAgICAgIHJldHVybiBvYmoubWFwKGZ1bmMpO1xuXHQgICAgfVxuXG5cdCAgICBmb3IodmFyIGk9MDsgaTxvYmoubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICByZXN1bHRzW3Jlc3VsdHMubGVuZ3RoXSA9IGZ1bmMob2JqW2ldLCBpKTtcblx0ICAgIH1cblxuXHQgICAgaWYob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHtcblx0ICAgICAgICByZXN1bHRzLmxlbmd0aCA9IG9iai5sZW5ndGg7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiByZXN1bHRzO1xuXHR9O1xuXG5cdGV4cG9ydHMuYXN5bmNJdGVyID0gZnVuY3Rpb24oYXJyLCBpdGVyLCBjYikge1xuXHQgICAgdmFyIGkgPSAtMTtcblxuXHQgICAgZnVuY3Rpb24gbmV4dCgpIHtcblx0ICAgICAgICBpKys7XG5cblx0ICAgICAgICBpZihpIDwgYXJyLmxlbmd0aCkge1xuXHQgICAgICAgICAgICBpdGVyKGFycltpXSwgaSwgbmV4dCwgY2IpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgY2IoKTtcblx0ICAgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIG5leHQoKTtcblx0fTtcblxuXHRleHBvcnRzLmFzeW5jRm9yID0gZnVuY3Rpb24ob2JqLCBpdGVyLCBjYikge1xuXHQgICAgdmFyIGtleXMgPSBleHBvcnRzLmtleXMob2JqKTtcblx0ICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcblx0ICAgIHZhciBpID0gLTE7XG5cblx0ICAgIGZ1bmN0aW9uIG5leHQoKSB7XG5cdCAgICAgICAgaSsrO1xuXHQgICAgICAgIHZhciBrID0ga2V5c1tpXTtcblxuXHQgICAgICAgIGlmKGkgPCBsZW4pIHtcblx0ICAgICAgICAgICAgaXRlcihrLCBvYmpba10sIGksIGxlbiwgbmV4dCk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICBjYigpO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgbmV4dCgpO1xuXHR9O1xuXG5cdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2luZGV4T2YjUG9seWZpbGxcblx0ZXhwb3J0cy5pbmRleE9mID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgP1xuXHQgICAgZnVuY3Rpb24gKGFyciwgc2VhcmNoRWxlbWVudCwgZnJvbUluZGV4KSB7XG5cdCAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYXJyLCBzZWFyY2hFbGVtZW50LCBmcm9tSW5kZXgpO1xuXHQgICAgfSA6XG5cdCAgICBmdW5jdGlvbiAoYXJyLCBzZWFyY2hFbGVtZW50LCBmcm9tSW5kZXgpIHtcblx0ICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggPj4+IDA7IC8vIEhhY2sgdG8gY29udmVydCBvYmplY3QubGVuZ3RoIHRvIGEgVUludDMyXG5cblx0ICAgICAgICBmcm9tSW5kZXggPSArZnJvbUluZGV4IHx8IDA7XG5cblx0ICAgICAgICBpZihNYXRoLmFicyhmcm9tSW5kZXgpID09PSBJbmZpbml0eSkge1xuXHQgICAgICAgICAgICBmcm9tSW5kZXggPSAwO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKGZyb21JbmRleCA8IDApIHtcblx0ICAgICAgICAgICAgZnJvbUluZGV4ICs9IGxlbmd0aDtcblx0ICAgICAgICAgICAgaWYgKGZyb21JbmRleCA8IDApIHtcblx0ICAgICAgICAgICAgICAgIGZyb21JbmRleCA9IDA7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBmb3IoO2Zyb21JbmRleCA8IGxlbmd0aDsgZnJvbUluZGV4KyspIHtcblx0ICAgICAgICAgICAgaWYgKGFycltmcm9tSW5kZXhdID09PSBzZWFyY2hFbGVtZW50KSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gZnJvbUluZGV4O1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIC0xO1xuXHQgICAgfTtcblxuXHRpZighQXJyYXkucHJvdG90eXBlLm1hcCkge1xuXHQgICAgQXJyYXkucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcignbWFwIGlzIHVuaW1wbGVtZW50ZWQgZm9yIHRoaXMganMgZW5naW5lJyk7XG5cdCAgICB9O1xuXHR9XG5cblx0ZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG5cdCAgICBpZihPYmplY3QucHJvdG90eXBlLmtleXMpIHtcblx0ICAgICAgICByZXR1cm4gb2JqLmtleXMoKTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIHZhciBrZXlzID0gW107XG5cdCAgICAgICAgZm9yKHZhciBrIGluIG9iaikge1xuXHQgICAgICAgICAgICBpZihvYmouaGFzT3duUHJvcGVydHkoaykpIHtcblx0ICAgICAgICAgICAgICAgIGtleXMucHVzaChrKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4ga2V5cztcblx0ICAgIH1cblx0fTtcblxuXHRleHBvcnRzLmluT3BlcmF0b3IgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcblx0ICAgIGlmIChleHBvcnRzLmlzQXJyYXkodmFsKSkge1xuXHQgICAgICAgIHJldHVybiBleHBvcnRzLmluZGV4T2YodmFsLCBrZXkpICE9PSAtMTtcblx0ICAgIH0gZWxzZSBpZiAoZXhwb3J0cy5pc09iamVjdCh2YWwpKSB7XG5cdCAgICAgICAgcmV0dXJuIGtleSBpbiB2YWw7XG5cdCAgICB9IGVsc2UgaWYgKGV4cG9ydHMuaXNTdHJpbmcodmFsKSkge1xuXHQgICAgICAgIHJldHVybiB2YWwuaW5kZXhPZihrZXkpICE9PSAtMTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIFwiaW5cIiBvcGVyYXRvciB0byBzZWFyY2ggZm9yIFwiJ1xuXHQgICAgICAgICAgICArIGtleSArICdcIiBpbiB1bmV4cGVjdGVkIHR5cGVzLicpO1xuXHQgICAgfVxuXHR9O1xuXG5cbi8qKiovIH0pLFxuLyogMiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgcGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5cdHZhciBhc2FwID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KTtcblx0dmFyIGxpYiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdHZhciBPYmogPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXHR2YXIgY29tcGlsZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpO1xuXHR2YXIgYnVpbHRpbl9maWx0ZXJzID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNCk7XG5cdHZhciBidWlsdGluX2xvYWRlcnMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE1KTtcblx0dmFyIHJ1bnRpbWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEzKTtcblx0dmFyIGdsb2JhbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE4KTtcblx0dmFyIHdhdGVyZmFsbCA9IF9fd2VicGFja19yZXF1aXJlX18oMTkpO1xuXHR2YXIgRnJhbWUgPSBydW50aW1lLkZyYW1lO1xuXHR2YXIgVGVtcGxhdGU7XG5cblx0Ly8gVW5jb25kaXRpb25hbGx5IGxvYWQgaW4gdGhpcyBsb2FkZXIsIGV2ZW4gaWYgbm8gb3RoZXIgb25lcyBhcmVcblx0Ly8gaW5jbHVkZWQgKHBvc3NpYmxlIGluIHRoZSBzbGltIGJyb3dzZXIgYnVpbGQpXG5cdGJ1aWx0aW5fbG9hZGVycy5QcmVjb21waWxlZExvYWRlciA9IF9fd2VicGFja19yZXF1aXJlX18oMTcpO1xuXG5cdC8vIElmIHRoZSB1c2VyIGlzIHVzaW5nIHRoZSBhc3luYyBBUEksICphbHdheXMqIGNhbGwgaXRcblx0Ly8gYXN5bmNocm9ub3VzbHkgZXZlbiBpZiB0aGUgdGVtcGxhdGUgd2FzIHN5bmNocm9ub3VzLlxuXHRmdW5jdGlvbiBjYWxsYmFja0FzYXAoY2IsIGVyciwgcmVzKSB7XG5cdCAgICBhc2FwKGZ1bmN0aW9uKCkgeyBjYihlcnIsIHJlcyk7IH0pO1xuXHR9XG5cblx0dmFyIEVudmlyb25tZW50ID0gT2JqLmV4dGVuZCh7XG5cdCAgICBpbml0OiBmdW5jdGlvbihsb2FkZXJzLCBvcHRzKSB7XG5cdCAgICAgICAgLy8gVGhlIGRldiBmbGFnIGRldGVybWluZXMgdGhlIHRyYWNlIHRoYXQnbGwgYmUgc2hvd24gb24gZXJyb3JzLlxuXHQgICAgICAgIC8vIElmIHNldCB0byB0cnVlLCByZXR1cm5zIHRoZSBmdWxsIHRyYWNlIGZyb20gdGhlIGVycm9yIHBvaW50LFxuXHQgICAgICAgIC8vIG90aGVyd2lzZSB3aWxsIHJldHVybiB0cmFjZSBzdGFydGluZyBmcm9tIFRlbXBsYXRlLnJlbmRlclxuXHQgICAgICAgIC8vICh0aGUgZnVsbCB0cmFjZSBmcm9tIHdpdGhpbiBudW5qdWNrcyBtYXkgY29uZnVzZSBkZXZlbG9wZXJzIHVzaW5nXG5cdCAgICAgICAgLy8gIHRoZSBsaWJyYXJ5KVxuXHQgICAgICAgIC8vIGRlZmF1bHRzIHRvIGZhbHNlXG5cdCAgICAgICAgb3B0cyA9IHRoaXMub3B0cyA9IG9wdHMgfHwge307XG5cdCAgICAgICAgdGhpcy5vcHRzLmRldiA9ICEhb3B0cy5kZXY7XG5cblx0ICAgICAgICAvLyBUaGUgYXV0b2VzY2FwZSBmbGFnIHNldHMgZ2xvYmFsIGF1dG9lc2NhcGluZy4gSWYgdHJ1ZSxcblx0ICAgICAgICAvLyBldmVyeSBzdHJpbmcgdmFyaWFibGUgd2lsbCBiZSBlc2NhcGVkIGJ5IGRlZmF1bHQuXG5cdCAgICAgICAgLy8gSWYgZmFsc2UsIHN0cmluZ3MgY2FuIGJlIG1hbnVhbGx5IGVzY2FwZWQgdXNpbmcgdGhlIGBlc2NhcGVgIGZpbHRlci5cblx0ICAgICAgICAvLyBkZWZhdWx0cyB0byB0cnVlXG5cdCAgICAgICAgdGhpcy5vcHRzLmF1dG9lc2NhcGUgPSBvcHRzLmF1dG9lc2NhcGUgIT0gbnVsbCA/IG9wdHMuYXV0b2VzY2FwZSA6IHRydWU7XG5cblx0ICAgICAgICAvLyBJZiB0cnVlLCB0aGlzIHdpbGwgbWFrZSB0aGUgc3lzdGVtIHRocm93IGVycm9ycyBpZiB0cnlpbmdcblx0ICAgICAgICAvLyB0byBvdXRwdXQgYSBudWxsIG9yIHVuZGVmaW5lZCB2YWx1ZVxuXHQgICAgICAgIHRoaXMub3B0cy50aHJvd09uVW5kZWZpbmVkID0gISFvcHRzLnRocm93T25VbmRlZmluZWQ7XG5cdCAgICAgICAgdGhpcy5vcHRzLnRyaW1CbG9ja3MgPSAhIW9wdHMudHJpbUJsb2Nrcztcblx0ICAgICAgICB0aGlzLm9wdHMubHN0cmlwQmxvY2tzID0gISFvcHRzLmxzdHJpcEJsb2NrcztcblxuXHQgICAgICAgIHRoaXMubG9hZGVycyA9IFtdO1xuXG5cdCAgICAgICAgaWYoIWxvYWRlcnMpIHtcblx0ICAgICAgICAgICAgLy8gVGhlIGZpbGVzeXN0ZW0gbG9hZGVyIGlzIG9ubHkgYXZhaWxhYmxlIHNlcnZlci1zaWRlXG5cdCAgICAgICAgICAgIGlmKGJ1aWx0aW5fbG9hZGVycy5GaWxlU3lzdGVtTG9hZGVyKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmxvYWRlcnMgPSBbbmV3IGJ1aWx0aW5fbG9hZGVycy5GaWxlU3lzdGVtTG9hZGVyKCd2aWV3cycpXTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIGlmKGJ1aWx0aW5fbG9hZGVycy5XZWJMb2FkZXIpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMubG9hZGVycyA9IFtuZXcgYnVpbHRpbl9sb2FkZXJzLldlYkxvYWRlcignL3ZpZXdzJyldO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0aGlzLmxvYWRlcnMgPSBsaWIuaXNBcnJheShsb2FkZXJzKSA/IGxvYWRlcnMgOiBbbG9hZGVyc107XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLy8gSXQncyBlYXN5IHRvIHVzZSBwcmVjb21waWxlZCB0ZW1wbGF0ZXM6IGp1c3QgaW5jbHVkZSB0aGVtXG5cdCAgICAgICAgLy8gYmVmb3JlIHlvdSBjb25maWd1cmUgbnVuanVja3MgYW5kIHRoaXMgd2lsbCBhdXRvbWF0aWNhbGx5XG5cdCAgICAgICAgLy8gcGljayBpdCB1cCBhbmQgdXNlIGl0XG5cdCAgICAgICAgaWYoKHRydWUpICYmIHdpbmRvdy5udW5qdWNrc1ByZWNvbXBpbGVkKSB7XG5cdCAgICAgICAgICAgIHRoaXMubG9hZGVycy51bnNoaWZ0KFxuXHQgICAgICAgICAgICAgICAgbmV3IGJ1aWx0aW5fbG9hZGVycy5QcmVjb21waWxlZExvYWRlcih3aW5kb3cubnVuanVja3NQcmVjb21waWxlZClcblx0ICAgICAgICAgICAgKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmluaXRDYWNoZSgpO1xuXG5cdCAgICAgICAgdGhpcy5nbG9iYWxzID0gZ2xvYmFscygpO1xuXHQgICAgICAgIHRoaXMuZmlsdGVycyA9IHt9O1xuXHQgICAgICAgIHRoaXMuYXN5bmNGaWx0ZXJzID0gW107XG5cdCAgICAgICAgdGhpcy5leHRlbnNpb25zID0ge307XG5cdCAgICAgICAgdGhpcy5leHRlbnNpb25zTGlzdCA9IFtdO1xuXG5cdCAgICAgICAgZm9yKHZhciBuYW1lIGluIGJ1aWx0aW5fZmlsdGVycykge1xuXHQgICAgICAgICAgICB0aGlzLmFkZEZpbHRlcihuYW1lLCBidWlsdGluX2ZpbHRlcnNbbmFtZV0pO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIGluaXRDYWNoZTogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgLy8gQ2FjaGluZyBhbmQgY2FjaGUgYnVzdGluZ1xuXHQgICAgICAgIGxpYi5lYWNoKHRoaXMubG9hZGVycywgZnVuY3Rpb24obG9hZGVyKSB7XG5cdCAgICAgICAgICAgIGxvYWRlci5jYWNoZSA9IHt9O1xuXG5cdCAgICAgICAgICAgIGlmKHR5cGVvZiBsb2FkZXIub24gPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICAgICAgICAgIGxvYWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24odGVtcGxhdGUpIHtcblx0ICAgICAgICAgICAgICAgICAgICBsb2FkZXIuY2FjaGVbdGVtcGxhdGVdID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cdCAgICB9LFxuXG5cdCAgICBhZGRFeHRlbnNpb246IGZ1bmN0aW9uKG5hbWUsIGV4dGVuc2lvbikge1xuXHQgICAgICAgIGV4dGVuc2lvbi5fbmFtZSA9IG5hbWU7XG5cdCAgICAgICAgdGhpcy5leHRlbnNpb25zW25hbWVdID0gZXh0ZW5zaW9uO1xuXHQgICAgICAgIHRoaXMuZXh0ZW5zaW9uc0xpc3QucHVzaChleHRlbnNpb24pO1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgfSxcblxuXHQgICAgcmVtb3ZlRXh0ZW5zaW9uOiBmdW5jdGlvbihuYW1lKSB7XG5cdCAgICAgICAgdmFyIGV4dGVuc2lvbiA9IHRoaXMuZ2V0RXh0ZW5zaW9uKG5hbWUpO1xuXHQgICAgICAgIGlmICghZXh0ZW5zaW9uKSByZXR1cm47XG5cblx0ICAgICAgICB0aGlzLmV4dGVuc2lvbnNMaXN0ID0gbGliLndpdGhvdXQodGhpcy5leHRlbnNpb25zTGlzdCwgZXh0ZW5zaW9uKTtcblx0ICAgICAgICBkZWxldGUgdGhpcy5leHRlbnNpb25zW25hbWVdO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0RXh0ZW5zaW9uOiBmdW5jdGlvbihuYW1lKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZXh0ZW5zaW9uc1tuYW1lXTtcblx0ICAgIH0sXG5cblx0ICAgIGhhc0V4dGVuc2lvbjogZnVuY3Rpb24obmFtZSkge1xuXHQgICAgICAgIHJldHVybiAhIXRoaXMuZXh0ZW5zaW9uc1tuYW1lXTtcblx0ICAgIH0sXG5cblx0ICAgIGFkZEdsb2JhbDogZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcblx0ICAgICAgICB0aGlzLmdsb2JhbHNbbmFtZV0gPSB2YWx1ZTtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH0sXG5cblx0ICAgIGdldEdsb2JhbDogZnVuY3Rpb24obmFtZSkge1xuXHQgICAgICAgIGlmKHR5cGVvZiB0aGlzLmdsb2JhbHNbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZ2xvYmFsIG5vdCBmb3VuZDogJyArIG5hbWUpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gdGhpcy5nbG9iYWxzW25hbWVdO1xuXHQgICAgfSxcblxuXHQgICAgYWRkRmlsdGVyOiBmdW5jdGlvbihuYW1lLCBmdW5jLCBhc3luYykge1xuXHQgICAgICAgIHZhciB3cmFwcGVkID0gZnVuYztcblxuXHQgICAgICAgIGlmKGFzeW5jKSB7XG5cdCAgICAgICAgICAgIHRoaXMuYXN5bmNGaWx0ZXJzLnB1c2gobmFtZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHRoaXMuZmlsdGVyc1tuYW1lXSA9IHdyYXBwZWQ7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICB9LFxuXG5cdCAgICBnZXRGaWx0ZXI6IGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICBpZighdGhpcy5maWx0ZXJzW25hbWVdKSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlsdGVyIG5vdCBmb3VuZDogJyArIG5hbWUpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJzW25hbWVdO1xuXHQgICAgfSxcblxuXHQgICAgcmVzb2x2ZVRlbXBsYXRlOiBmdW5jdGlvbihsb2FkZXIsIHBhcmVudE5hbWUsIGZpbGVuYW1lKSB7XG5cdCAgICAgICAgdmFyIGlzUmVsYXRpdmUgPSAobG9hZGVyLmlzUmVsYXRpdmUgJiYgcGFyZW50TmFtZSk/IGxvYWRlci5pc1JlbGF0aXZlKGZpbGVuYW1lKSA6IGZhbHNlO1xuXHQgICAgICAgIHJldHVybiAoaXNSZWxhdGl2ZSAmJiBsb2FkZXIucmVzb2x2ZSk/IGxvYWRlci5yZXNvbHZlKHBhcmVudE5hbWUsIGZpbGVuYW1lKSA6IGZpbGVuYW1lO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0VGVtcGxhdGU6IGZ1bmN0aW9uKG5hbWUsIGVhZ2VyQ29tcGlsZSwgcGFyZW50TmFtZSwgaWdub3JlTWlzc2luZywgY2IpIHtcblx0ICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cdCAgICAgICAgdmFyIHRtcGwgPSBudWxsO1xuXHQgICAgICAgIGlmKG5hbWUgJiYgbmFtZS5yYXcpIHtcblx0ICAgICAgICAgICAgLy8gdGhpcyBmaXhlcyBhdXRvZXNjYXBlIGZvciB0ZW1wbGF0ZXMgcmVmZXJlbmNlZCBpbiBzeW1ib2xzXG5cdCAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJhdztcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZihsaWIuaXNGdW5jdGlvbihwYXJlbnROYW1lKSkge1xuXHQgICAgICAgICAgICBjYiA9IHBhcmVudE5hbWU7XG5cdCAgICAgICAgICAgIHBhcmVudE5hbWUgPSBudWxsO1xuXHQgICAgICAgICAgICBlYWdlckNvbXBpbGUgPSBlYWdlckNvbXBpbGUgfHwgZmFsc2U7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYobGliLmlzRnVuY3Rpb24oZWFnZXJDb21waWxlKSkge1xuXHQgICAgICAgICAgICBjYiA9IGVhZ2VyQ29tcGlsZTtcblx0ICAgICAgICAgICAgZWFnZXJDb21waWxlID0gZmFsc2U7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKG5hbWUgaW5zdGFuY2VvZiBUZW1wbGF0ZSkge1xuXHQgICAgICAgICAgICAgdG1wbCA9IG5hbWU7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGVtcGxhdGUgbmFtZXMgbXVzdCBiZSBhIHN0cmluZzogJyArIG5hbWUpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxvYWRlcnMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHZhciBfbmFtZSA9IHRoaXMucmVzb2x2ZVRlbXBsYXRlKHRoaXMubG9hZGVyc1tpXSwgcGFyZW50TmFtZSwgbmFtZSk7XG5cdCAgICAgICAgICAgICAgICB0bXBsID0gdGhpcy5sb2FkZXJzW2ldLmNhY2hlW19uYW1lXTtcblx0ICAgICAgICAgICAgICAgIGlmICh0bXBsKSBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKHRtcGwpIHtcblx0ICAgICAgICAgICAgaWYoZWFnZXJDb21waWxlKSB7XG5cdCAgICAgICAgICAgICAgICB0bXBsLmNvbXBpbGUoKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGlmKGNiKSB7XG5cdCAgICAgICAgICAgICAgICBjYihudWxsLCB0bXBsKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0bXBsO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgdmFyIHN5bmNSZXN1bHQ7XG5cdCAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cblx0ICAgICAgICAgICAgdmFyIGNyZWF0ZVRlbXBsYXRlID0gZnVuY3Rpb24oZXJyLCBpbmZvKSB7XG5cdCAgICAgICAgICAgICAgICBpZighaW5mbyAmJiAhZXJyKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYoIWlnbm9yZU1pc3NpbmcpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZXJyID0gbmV3IEVycm9yKCd0ZW1wbGF0ZSBub3QgZm91bmQ6ICcgKyBuYW1lKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZihjYikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBjYihlcnIpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB0bXBsO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmKGluZm8pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdG1wbCA9IG5ldyBUZW1wbGF0ZShpbmZvLnNyYywgX3RoaXMsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5wYXRoLCBlYWdlckNvbXBpbGUpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpbmZvLm5vQ2FjaGUpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8ubG9hZGVyLmNhY2hlW25hbWVdID0gdG1wbDtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdG1wbCA9IG5ldyBUZW1wbGF0ZSgnJywgX3RoaXMsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJycsIGVhZ2VyQ29tcGlsZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAgICAgaWYoY2IpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgY2IobnVsbCwgdG1wbCk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzeW5jUmVzdWx0ID0gdG1wbDtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgbGliLmFzeW5jSXRlcih0aGlzLmxvYWRlcnMsIGZ1bmN0aW9uKGxvYWRlciwgaSwgbmV4dCwgZG9uZSkge1xuXHQgICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlKGVyciwgc3JjKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYoZXJyKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoZXJyKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihzcmMpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3JjLmxvYWRlciA9IGxvYWRlcjtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZG9uZShudWxsLCBzcmMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gUmVzb2x2ZSBuYW1lIHJlbGF0aXZlIHRvIHBhcmVudE5hbWVcblx0ICAgICAgICAgICAgICAgIG5hbWUgPSB0aGF0LnJlc29sdmVUZW1wbGF0ZShsb2FkZXIsIHBhcmVudE5hbWUsIG5hbWUpO1xuXG5cdCAgICAgICAgICAgICAgICBpZihsb2FkZXIuYXN5bmMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBsb2FkZXIuZ2V0U291cmNlKG5hbWUsIGhhbmRsZSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICBoYW5kbGUobnVsbCwgbG9hZGVyLmdldFNvdXJjZShuYW1lKSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sIGNyZWF0ZVRlbXBsYXRlKTtcblxuXHQgICAgICAgICAgICByZXR1cm4gc3luY1Jlc3VsdDtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBleHByZXNzOiBmdW5jdGlvbihhcHApIHtcblx0ICAgICAgICB2YXIgZW52ID0gdGhpcztcblxuXHQgICAgICAgIGZ1bmN0aW9uIE51bmp1Y2tzVmlldyhuYW1lLCBvcHRzKSB7XG5cdCAgICAgICAgICAgIHRoaXMubmFtZSAgICAgICAgICA9IG5hbWU7XG5cdCAgICAgICAgICAgIHRoaXMucGF0aCAgICAgICAgICA9IG5hbWU7XG5cdCAgICAgICAgICAgIHRoaXMuZGVmYXVsdEVuZ2luZSA9IG9wdHMuZGVmYXVsdEVuZ2luZTtcblx0ICAgICAgICAgICAgdGhpcy5leHQgICAgICAgICAgID0gcGF0aC5leHRuYW1lKG5hbWUpO1xuXHQgICAgICAgICAgICBpZiAoIXRoaXMuZXh0ICYmICF0aGlzLmRlZmF1bHRFbmdpbmUpIHRocm93IG5ldyBFcnJvcignTm8gZGVmYXVsdCBlbmdpbmUgd2FzIHNwZWNpZmllZCBhbmQgbm8gZXh0ZW5zaW9uIHdhcyBwcm92aWRlZC4nKTtcblx0ICAgICAgICAgICAgaWYgKCF0aGlzLmV4dCkgdGhpcy5uYW1lICs9ICh0aGlzLmV4dCA9ICgnLicgIT09IHRoaXMuZGVmYXVsdEVuZ2luZVswXSA/ICcuJyA6ICcnKSArIHRoaXMuZGVmYXVsdEVuZ2luZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgTnVuanVja3NWaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihvcHRzLCBjYikge1xuXHQgICAgICAgICAgZW52LnJlbmRlcih0aGlzLm5hbWUsIG9wdHMsIGNiKTtcblx0ICAgICAgICB9O1xuXG5cdCAgICAgICAgYXBwLnNldCgndmlldycsIE51bmp1Y2tzVmlldyk7XG5cdCAgICAgICAgYXBwLnNldCgnbnVuanVja3NFbnYnLCB0aGlzKTtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH0sXG5cblx0ICAgIHJlbmRlcjogZnVuY3Rpb24obmFtZSwgY3R4LCBjYikge1xuXHQgICAgICAgIGlmKGxpYi5pc0Z1bmN0aW9uKGN0eCkpIHtcblx0ICAgICAgICAgICAgY2IgPSBjdHg7XG5cdCAgICAgICAgICAgIGN0eCA9IG51bGw7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLy8gV2Ugc3VwcG9ydCBhIHN5bmNocm9ub3VzIEFQSSB0byBtYWtlIGl0IGVhc2llciB0byBtaWdyYXRlXG5cdCAgICAgICAgLy8gZXhpc3RpbmcgY29kZSB0byBhc3luYy4gVGhpcyB3b3JrcyBiZWNhdXNlIGlmIHlvdSBkb24ndCBkb1xuXHQgICAgICAgIC8vIGFueXRoaW5nIGFzeW5jIHdvcmssIHRoZSB3aG9sZSB0aGluZyBpcyBhY3R1YWxseSBydW5cblx0ICAgICAgICAvLyBzeW5jaHJvbm91c2x5LlxuXHQgICAgICAgIHZhciBzeW5jUmVzdWx0ID0gbnVsbDtcblxuXHQgICAgICAgIHRoaXMuZ2V0VGVtcGxhdGUobmFtZSwgZnVuY3Rpb24oZXJyLCB0bXBsKSB7XG5cdCAgICAgICAgICAgIGlmKGVyciAmJiBjYikge1xuXHQgICAgICAgICAgICAgICAgY2FsbGJhY2tBc2FwKGNiLCBlcnIpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYoZXJyKSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBzeW5jUmVzdWx0ID0gdG1wbC5yZW5kZXIoY3R4LCBjYik7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBzeW5jUmVzdWx0O1xuXHQgICAgfSxcblxuXHQgICAgcmVuZGVyU3RyaW5nOiBmdW5jdGlvbihzcmMsIGN0eCwgb3B0cywgY2IpIHtcblx0ICAgICAgICBpZihsaWIuaXNGdW5jdGlvbihvcHRzKSkge1xuXHQgICAgICAgICAgICBjYiA9IG9wdHM7XG5cdCAgICAgICAgICAgIG9wdHMgPSB7fTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgb3B0cyA9IG9wdHMgfHwge307XG5cblx0ICAgICAgICB2YXIgdG1wbCA9IG5ldyBUZW1wbGF0ZShzcmMsIHRoaXMsIG9wdHMucGF0aCk7XG5cdCAgICAgICAgcmV0dXJuIHRtcGwucmVuZGVyKGN0eCwgY2IpO1xuXHQgICAgfSxcblxuXHQgICAgd2F0ZXJmYWxsOiB3YXRlcmZhbGxcblx0fSk7XG5cblx0dmFyIENvbnRleHQgPSBPYmouZXh0ZW5kKHtcblx0ICAgIGluaXQ6IGZ1bmN0aW9uKGN0eCwgYmxvY2tzLCBlbnYpIHtcblx0ICAgICAgICAvLyBIYXMgdG8gYmUgdGllZCB0byBhbiBlbnZpcm9ubWVudCBzbyB3ZSBjYW4gdGFwIGludG8gaXRzIGdsb2JhbHMuXG5cdCAgICAgICAgdGhpcy5lbnYgPSBlbnYgfHwgbmV3IEVudmlyb25tZW50KCk7XG5cblx0ICAgICAgICAvLyBNYWtlIGEgZHVwbGljYXRlIG9mIGN0eFxuXHQgICAgICAgIHRoaXMuY3R4ID0ge307XG5cdCAgICAgICAgZm9yKHZhciBrIGluIGN0eCkge1xuXHQgICAgICAgICAgICBpZihjdHguaGFzT3duUHJvcGVydHkoaykpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuY3R4W2tdID0gY3R4W2tdO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdGhpcy5ibG9ja3MgPSB7fTtcblx0ICAgICAgICB0aGlzLmV4cG9ydGVkID0gW107XG5cblx0ICAgICAgICBmb3IodmFyIG5hbWUgaW4gYmxvY2tzKSB7XG5cdCAgICAgICAgICAgIHRoaXMuYWRkQmxvY2sobmFtZSwgYmxvY2tzW25hbWVdKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBsb29rdXA6IGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICAvLyBUaGlzIGlzIG9uZSBvZiB0aGUgbW9zdCBjYWxsZWQgZnVuY3Rpb25zLCBzbyBvcHRpbWl6ZSBmb3Jcblx0ICAgICAgICAvLyB0aGUgdHlwaWNhbCBjYXNlIHdoZXJlIHRoZSBuYW1lIGlzbid0IGluIHRoZSBnbG9iYWxzXG5cdCAgICAgICAgaWYobmFtZSBpbiB0aGlzLmVudi5nbG9iYWxzICYmICEobmFtZSBpbiB0aGlzLmN0eCkpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW52Lmdsb2JhbHNbbmFtZV07XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5jdHhbbmFtZV07XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgc2V0VmFyaWFibGU6IGZ1bmN0aW9uKG5hbWUsIHZhbCkge1xuXHQgICAgICAgIHRoaXMuY3R4W25hbWVdID0gdmFsO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0VmFyaWFibGVzOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5jdHg7XG5cdCAgICB9LFxuXG5cdCAgICBhZGRCbG9jazogZnVuY3Rpb24obmFtZSwgYmxvY2spIHtcblx0ICAgICAgICB0aGlzLmJsb2Nrc1tuYW1lXSA9IHRoaXMuYmxvY2tzW25hbWVdIHx8IFtdO1xuXHQgICAgICAgIHRoaXMuYmxvY2tzW25hbWVdLnB1c2goYmxvY2spO1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0QmxvY2s6IGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICBpZighdGhpcy5ibG9ja3NbbmFtZV0pIHtcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIGJsb2NrIFwiJyArIG5hbWUgKyAnXCInKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gdGhpcy5ibG9ja3NbbmFtZV1bMF07XG5cdCAgICB9LFxuXG5cdCAgICBnZXRTdXBlcjogZnVuY3Rpb24oZW52LCBuYW1lLCBibG9jaywgZnJhbWUsIHJ1bnRpbWUsIGNiKSB7XG5cdCAgICAgICAgdmFyIGlkeCA9IGxpYi5pbmRleE9mKHRoaXMuYmxvY2tzW25hbWVdIHx8IFtdLCBibG9jayk7XG5cdCAgICAgICAgdmFyIGJsayA9IHRoaXMuYmxvY2tzW25hbWVdW2lkeCArIDFdO1xuXHQgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcblxuXHQgICAgICAgIGlmKGlkeCA9PT0gLTEgfHwgIWJsaykge1xuXHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHN1cGVyIGJsb2NrIGF2YWlsYWJsZSBmb3IgXCInICsgbmFtZSArICdcIicpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGJsayhlbnYsIGNvbnRleHQsIGZyYW1lLCBydW50aW1lLCBjYik7XG5cdCAgICB9LFxuXG5cdCAgICBhZGRFeHBvcnQ6IGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICB0aGlzLmV4cG9ydGVkLnB1c2gobmFtZSk7XG5cdCAgICB9LFxuXG5cdCAgICBnZXRFeHBvcnRlZDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIGV4cG9ydGVkID0ge307XG5cdCAgICAgICAgZm9yKHZhciBpPTA7IGk8dGhpcy5leHBvcnRlZC5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMuZXhwb3J0ZWRbaV07XG5cdCAgICAgICAgICAgIGV4cG9ydGVkW25hbWVdID0gdGhpcy5jdHhbbmFtZV07XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBleHBvcnRlZDtcblx0ICAgIH1cblx0fSk7XG5cblx0VGVtcGxhdGUgPSBPYmouZXh0ZW5kKHtcblx0ICAgIGluaXQ6IGZ1bmN0aW9uIChzcmMsIGVudiwgcGF0aCwgZWFnZXJDb21waWxlKSB7XG5cdCAgICAgICAgdGhpcy5lbnYgPSBlbnYgfHwgbmV3IEVudmlyb25tZW50KCk7XG5cblx0ICAgICAgICBpZihsaWIuaXNPYmplY3Qoc3JjKSkge1xuXHQgICAgICAgICAgICBzd2l0Y2goc3JjLnR5cGUpIHtcblx0ICAgICAgICAgICAgY2FzZSAnY29kZSc6IHRoaXMudG1wbFByb3BzID0gc3JjLm9iajsgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6IHRoaXMudG1wbFN0ciA9IHNyYy5vYmo7IGJyZWFrO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYobGliLmlzU3RyaW5nKHNyYykpIHtcblx0ICAgICAgICAgICAgdGhpcy50bXBsU3RyID0gc3JjO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzcmMgbXVzdCBiZSBhIHN0cmluZyBvciBhbiBvYmplY3QgZGVzY3JpYmluZyAnICtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0aGUgc291cmNlJyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdGhpcy5wYXRoID0gcGF0aDtcblxuXHQgICAgICAgIGlmKGVhZ2VyQ29tcGlsZSkge1xuXHQgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXHQgICAgICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICAgICAgX3RoaXMuX2NvbXBpbGUoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBjYXRjaChlcnIpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IGxpYi5wcmV0dGlmeUVycm9yKHRoaXMucGF0aCwgdGhpcy5lbnYub3B0cy5kZXYsIGVycik7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHRoaXMuY29tcGlsZWQgPSBmYWxzZTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICByZW5kZXI6IGZ1bmN0aW9uKGN0eCwgcGFyZW50RnJhbWUsIGNiKSB7XG5cdCAgICAgICAgaWYgKHR5cGVvZiBjdHggPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICAgICAgY2IgPSBjdHg7XG5cdCAgICAgICAgICAgIGN0eCA9IHt9O1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmICh0eXBlb2YgcGFyZW50RnJhbWUgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICAgICAgY2IgPSBwYXJlbnRGcmFtZTtcblx0ICAgICAgICAgICAgcGFyZW50RnJhbWUgPSBudWxsO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBmb3JjZUFzeW5jID0gdHJ1ZTtcblx0ICAgICAgICBpZihwYXJlbnRGcmFtZSkge1xuXHQgICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIGZyYW1lLCB3ZSBhcmUgYmVpbmcgY2FsbGVkIGZyb20gaW50ZXJuYWxcblx0ICAgICAgICAgICAgLy8gY29kZSBvZiBhbm90aGVyIHRlbXBsYXRlLCBhbmQgdGhlIGludGVybmFsIHN5c3RlbVxuXHQgICAgICAgICAgICAvLyBkZXBlbmRzIG9uIHRoZSBzeW5jL2FzeW5jIG5hdHVyZSBvZiB0aGUgcGFyZW50IHRlbXBsYXRlXG5cdCAgICAgICAgICAgIC8vIHRvIGJlIGluaGVyaXRlZCwgc28gZm9yY2UgYW4gYXN5bmMgY2FsbGJhY2tcblx0ICAgICAgICAgICAgZm9yY2VBc3luYyA9IGZhbHNlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cdCAgICAgICAgLy8gQ2F0Y2ggY29tcGlsZSBlcnJvcnMgZm9yIGFzeW5jIHJlbmRlcmluZ1xuXHQgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICAgIF90aGlzLmNvbXBpbGUoKTtcblx0ICAgICAgICB9IGNhdGNoIChfZXJyKSB7XG5cdCAgICAgICAgICAgIHZhciBlcnIgPSBsaWIucHJldHRpZnlFcnJvcih0aGlzLnBhdGgsIHRoaXMuZW52Lm9wdHMuZGV2LCBfZXJyKTtcblx0ICAgICAgICAgICAgaWYgKGNiKSByZXR1cm4gY2FsbGJhY2tBc2FwKGNiLCBlcnIpO1xuXHQgICAgICAgICAgICBlbHNlIHRocm93IGVycjtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KGN0eCB8fCB7fSwgX3RoaXMuYmxvY2tzLCBfdGhpcy5lbnYpO1xuXHQgICAgICAgIHZhciBmcmFtZSA9IHBhcmVudEZyYW1lID8gcGFyZW50RnJhbWUucHVzaCh0cnVlKSA6IG5ldyBGcmFtZSgpO1xuXHQgICAgICAgIGZyYW1lLnRvcExldmVsID0gdHJ1ZTtcblx0ICAgICAgICB2YXIgc3luY1Jlc3VsdCA9IG51bGw7XG5cblx0ICAgICAgICBfdGhpcy5yb290UmVuZGVyRnVuYyhcblx0ICAgICAgICAgICAgX3RoaXMuZW52LFxuXHQgICAgICAgICAgICBjb250ZXh0LFxuXHQgICAgICAgICAgICBmcmFtZSB8fCBuZXcgRnJhbWUoKSxcblx0ICAgICAgICAgICAgcnVudGltZSxcblx0ICAgICAgICAgICAgZnVuY3Rpb24oZXJyLCByZXMpIHtcblx0ICAgICAgICAgICAgICAgIGlmKGVycikge1xuXHQgICAgICAgICAgICAgICAgICAgIGVyciA9IGxpYi5wcmV0dGlmeUVycm9yKF90aGlzLnBhdGgsIF90aGlzLmVudi5vcHRzLmRldiwgZXJyKTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgaWYoY2IpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZihmb3JjZUFzeW5jKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrQXNhcChjYiwgZXJyLCByZXMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgY2IoZXJyLCByZXMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmKGVycikgeyB0aHJvdyBlcnI7IH1cblx0ICAgICAgICAgICAgICAgICAgICBzeW5jUmVzdWx0ID0gcmVzO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgKTtcblxuXHQgICAgICAgIHJldHVybiBzeW5jUmVzdWx0O1xuXHQgICAgfSxcblxuXG5cdCAgICBnZXRFeHBvcnRlZDogZnVuY3Rpb24oY3R4LCBwYXJlbnRGcmFtZSwgY2IpIHtcblx0ICAgICAgICBpZiAodHlwZW9mIGN0eCA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgICAgICBjYiA9IGN0eDtcblx0ICAgICAgICAgICAgY3R4ID0ge307XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKHR5cGVvZiBwYXJlbnRGcmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgICAgICBjYiA9IHBhcmVudEZyYW1lO1xuXHQgICAgICAgICAgICBwYXJlbnRGcmFtZSA9IG51bGw7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLy8gQ2F0Y2ggY29tcGlsZSBlcnJvcnMgZm9yIGFzeW5jIHJlbmRlcmluZ1xuXHQgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICAgIHRoaXMuY29tcGlsZSgpO1xuXHQgICAgICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgICAgICAgaWYgKGNiKSByZXR1cm4gY2IoZSk7XG5cdCAgICAgICAgICAgIGVsc2UgdGhyb3cgZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgZnJhbWUgPSBwYXJlbnRGcmFtZSA/IHBhcmVudEZyYW1lLnB1c2goKSA6IG5ldyBGcmFtZSgpO1xuXHQgICAgICAgIGZyYW1lLnRvcExldmVsID0gdHJ1ZTtcblxuXHQgICAgICAgIC8vIFJ1biB0aGUgcm9vdFJlbmRlckZ1bmMgdG8gcG9wdWxhdGUgdGhlIGNvbnRleHQgd2l0aCBleHBvcnRlZCB2YXJzXG5cdCAgICAgICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dChjdHggfHwge30sIHRoaXMuYmxvY2tzLCB0aGlzLmVudik7XG5cdCAgICAgICAgdGhpcy5yb290UmVuZGVyRnVuYyh0aGlzLmVudixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFtZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bnRpbWUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlcnIpIHtcblx0ICAgICAgICBcdFx0ICAgICAgICBpZiAoIGVyciApIHtcblx0ICAgICAgICBcdFx0XHQgICAgY2IoZXJyLCBudWxsKTtcblx0ICAgICAgICBcdFx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIFx0XHRcdCAgICBjYihudWxsLCBjb250ZXh0LmdldEV4cG9ydGVkKCkpO1xuXHQgICAgICAgIFx0XHQgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZTogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgaWYoIXRoaXMuY29tcGlsZWQpIHtcblx0ICAgICAgICAgICAgdGhpcy5fY29tcGlsZSgpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIF9jb21waWxlOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgcHJvcHM7XG5cblx0ICAgICAgICBpZih0aGlzLnRtcGxQcm9wcykge1xuXHQgICAgICAgICAgICBwcm9wcyA9IHRoaXMudG1wbFByb3BzO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGNvbXBpbGVyLmNvbXBpbGUodGhpcy50bXBsU3RyLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVudi5hc3luY0ZpbHRlcnMsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW52LmV4dGVuc2lvbnNMaXN0LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdGgsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW52Lm9wdHMpO1xuXG5cdCAgICAgICAgICAgIC8qIGpzbGludCBldmlsOiB0cnVlICovXG5cdCAgICAgICAgICAgIHZhciBmdW5jID0gbmV3IEZ1bmN0aW9uKHNvdXJjZSk7XG5cdCAgICAgICAgICAgIHByb3BzID0gZnVuYygpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuYmxvY2tzID0gdGhpcy5fZ2V0QmxvY2tzKHByb3BzKTtcblx0ICAgICAgICB0aGlzLnJvb3RSZW5kZXJGdW5jID0gcHJvcHMucm9vdDtcblx0ICAgICAgICB0aGlzLmNvbXBpbGVkID0gdHJ1ZTtcblx0ICAgIH0sXG5cblx0ICAgIF9nZXRCbG9ja3M6IGZ1bmN0aW9uKHByb3BzKSB7XG5cdCAgICAgICAgdmFyIGJsb2NrcyA9IHt9O1xuXG5cdCAgICAgICAgZm9yKHZhciBrIGluIHByb3BzKSB7XG5cdCAgICAgICAgICAgIGlmKGsuc2xpY2UoMCwgMikgPT09ICdiXycpIHtcblx0ICAgICAgICAgICAgICAgIGJsb2Nrc1trLnNsaWNlKDIpXSA9IHByb3BzW2tdO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIGJsb2Nrcztcblx0ICAgIH1cblx0fSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgICBFbnZpcm9ubWVudDogRW52aXJvbm1lbnQsXG5cdCAgICBUZW1wbGF0ZTogVGVtcGxhdGVcblx0fTtcblxuXG4vKioqLyB9KSxcbi8qIDMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcblxuLyoqKi8gfSksXG4vKiA0ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Ly8gcmF3QXNhcCBwcm92aWRlcyBldmVyeXRoaW5nIHdlIG5lZWQgZXhjZXB0IGV4Y2VwdGlvbiBtYW5hZ2VtZW50LlxuXHR2YXIgcmF3QXNhcCA9IF9fd2VicGFja19yZXF1aXJlX18oNSk7XG5cdC8vIFJhd1Rhc2tzIGFyZSByZWN5Y2xlZCB0byByZWR1Y2UgR0MgY2h1cm4uXG5cdHZhciBmcmVlVGFza3MgPSBbXTtcblx0Ly8gV2UgcXVldWUgZXJyb3JzIHRvIGVuc3VyZSB0aGV5IGFyZSB0aHJvd24gaW4gcmlnaHQgb3JkZXIgKEZJRk8pLlxuXHQvLyBBcnJheS1hcy1xdWV1ZSBpcyBnb29kIGVub3VnaCBoZXJlLCBzaW5jZSB3ZSBhcmUganVzdCBkZWFsaW5nIHdpdGggZXhjZXB0aW9ucy5cblx0dmFyIHBlbmRpbmdFcnJvcnMgPSBbXTtcblx0dmFyIHJlcXVlc3RFcnJvclRocm93ID0gcmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIodGhyb3dGaXJzdEVycm9yKTtcblxuXHRmdW5jdGlvbiB0aHJvd0ZpcnN0RXJyb3IoKSB7XG5cdCAgICBpZiAocGVuZGluZ0Vycm9ycy5sZW5ndGgpIHtcblx0ICAgICAgICB0aHJvdyBwZW5kaW5nRXJyb3JzLnNoaWZ0KCk7XG5cdCAgICB9XG5cdH1cblxuXHQvKipcblx0ICogQ2FsbHMgYSB0YXNrIGFzIHNvb24gYXMgcG9zc2libGUgYWZ0ZXIgcmV0dXJuaW5nLCBpbiBpdHMgb3duIGV2ZW50LCB3aXRoIHByaW9yaXR5XG5cdCAqIG92ZXIgb3RoZXIgZXZlbnRzIGxpa2UgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZXBhaW50LiBBbiBlcnJvciB0aHJvd24gZnJvbSBhblxuXHQgKiBldmVudCB3aWxsIG5vdCBpbnRlcnJ1cHQsIG5vciBldmVuIHN1YnN0YW50aWFsbHkgc2xvdyBkb3duIHRoZSBwcm9jZXNzaW5nIG9mXG5cdCAqIG90aGVyIGV2ZW50cywgYnV0IHdpbGwgYmUgcmF0aGVyIHBvc3Rwb25lZCB0byBhIGxvd2VyIHByaW9yaXR5IGV2ZW50LlxuXHQgKiBAcGFyYW0ge3tjYWxsfX0gdGFzayBBIGNhbGxhYmxlIG9iamVjdCwgdHlwaWNhbGx5IGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBub1xuXHQgKiBhcmd1bWVudHMuXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGFzYXA7XG5cdGZ1bmN0aW9uIGFzYXAodGFzaykge1xuXHQgICAgdmFyIHJhd1Rhc2s7XG5cdCAgICBpZiAoZnJlZVRhc2tzLmxlbmd0aCkge1xuXHQgICAgICAgIHJhd1Rhc2sgPSBmcmVlVGFza3MucG9wKCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJhd1Rhc2sgPSBuZXcgUmF3VGFzaygpO1xuXHQgICAgfVxuXHQgICAgcmF3VGFzay50YXNrID0gdGFzaztcblx0ICAgIHJhd0FzYXAocmF3VGFzayk7XG5cdH1cblxuXHQvLyBXZSB3cmFwIHRhc2tzIHdpdGggcmVjeWNsYWJsZSB0YXNrIG9iamVjdHMuICBBIHRhc2sgb2JqZWN0IGltcGxlbWVudHNcblx0Ly8gYGNhbGxgLCBqdXN0IGxpa2UgYSBmdW5jdGlvbi5cblx0ZnVuY3Rpb24gUmF3VGFzaygpIHtcblx0ICAgIHRoaXMudGFzayA9IG51bGw7XG5cdH1cblxuXHQvLyBUaGUgc29sZSBwdXJwb3NlIG9mIHdyYXBwaW5nIHRoZSB0YXNrIGlzIHRvIGNhdGNoIHRoZSBleGNlcHRpb24gYW5kIHJlY3ljbGVcblx0Ly8gdGhlIHRhc2sgb2JqZWN0IGFmdGVyIGl0cyBzaW5nbGUgdXNlLlxuXHRSYXdUYXNrLnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKCkge1xuXHQgICAgdHJ5IHtcblx0ICAgICAgICB0aGlzLnRhc2suY2FsbCgpO1xuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgICBpZiAoYXNhcC5vbmVycm9yKSB7XG5cdCAgICAgICAgICAgIC8vIFRoaXMgaG9vayBleGlzdHMgcHVyZWx5IGZvciB0ZXN0aW5nIHB1cnBvc2VzLlxuXHQgICAgICAgICAgICAvLyBJdHMgbmFtZSB3aWxsIGJlIHBlcmlvZGljYWxseSByYW5kb21pemVkIHRvIGJyZWFrIGFueSBjb2RlIHRoYXRcblx0ICAgICAgICAgICAgLy8gZGVwZW5kcyBvbiBpdHMgZXhpc3RlbmNlLlxuXHQgICAgICAgICAgICBhc2FwLm9uZXJyb3IoZXJyb3IpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIC8vIEluIGEgd2ViIGJyb3dzZXIsIGV4Y2VwdGlvbnMgYXJlIG5vdCBmYXRhbC4gSG93ZXZlciwgdG8gYXZvaWRcblx0ICAgICAgICAgICAgLy8gc2xvd2luZyBkb3duIHRoZSBxdWV1ZSBvZiBwZW5kaW5nIHRhc2tzLCB3ZSByZXRocm93IHRoZSBlcnJvciBpbiBhXG5cdCAgICAgICAgICAgIC8vIGxvd2VyIHByaW9yaXR5IHR1cm4uXG5cdCAgICAgICAgICAgIHBlbmRpbmdFcnJvcnMucHVzaChlcnJvcik7XG5cdCAgICAgICAgICAgIHJlcXVlc3RFcnJvclRocm93KCk7XG5cdCAgICAgICAgfVxuXHQgICAgfSBmaW5hbGx5IHtcblx0ICAgICAgICB0aGlzLnRhc2sgPSBudWxsO1xuXHQgICAgICAgIGZyZWVUYXNrc1tmcmVlVGFza3MubGVuZ3RoXSA9IHRoaXM7XG5cdCAgICB9XG5cdH07XG5cblxuLyoqKi8gfSksXG4vKiA1ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKGdsb2JhbCkge1widXNlIHN0cmljdFwiO1xuXG5cdC8vIFVzZSB0aGUgZmFzdGVzdCBtZWFucyBwb3NzaWJsZSB0byBleGVjdXRlIGEgdGFzayBpbiBpdHMgb3duIHR1cm4sIHdpdGhcblx0Ly8gcHJpb3JpdHkgb3ZlciBvdGhlciBldmVudHMgaW5jbHVkaW5nIElPLCBhbmltYXRpb24sIHJlZmxvdywgYW5kIHJlZHJhd1xuXHQvLyBldmVudHMgaW4gYnJvd3NlcnMuXG5cdC8vXG5cdC8vIEFuIGV4Y2VwdGlvbiB0aHJvd24gYnkgYSB0YXNrIHdpbGwgcGVybWFuZW50bHkgaW50ZXJydXB0IHRoZSBwcm9jZXNzaW5nIG9mXG5cdC8vIHN1YnNlcXVlbnQgdGFza3MuIFRoZSBoaWdoZXIgbGV2ZWwgYGFzYXBgIGZ1bmN0aW9uIGVuc3VyZXMgdGhhdCBpZiBhblxuXHQvLyBleGNlcHRpb24gaXMgdGhyb3duIGJ5IGEgdGFzaywgdGhhdCB0aGUgdGFzayBxdWV1ZSB3aWxsIGNvbnRpbnVlIGZsdXNoaW5nIGFzXG5cdC8vIHNvb24gYXMgcG9zc2libGUsIGJ1dCBpZiB5b3UgdXNlIGByYXdBc2FwYCBkaXJlY3RseSwgeW91IGFyZSByZXNwb25zaWJsZSB0b1xuXHQvLyBlaXRoZXIgZW5zdXJlIHRoYXQgbm8gZXhjZXB0aW9ucyBhcmUgdGhyb3duIGZyb20geW91ciB0YXNrLCBvciB0byBtYW51YWxseVxuXHQvLyBjYWxsIGByYXdBc2FwLnJlcXVlc3RGbHVzaGAgaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93bi5cblx0bW9kdWxlLmV4cG9ydHMgPSByYXdBc2FwO1xuXHRmdW5jdGlvbiByYXdBc2FwKHRhc2spIHtcblx0ICAgIGlmICghcXVldWUubGVuZ3RoKSB7XG5cdCAgICAgICAgcmVxdWVzdEZsdXNoKCk7XG5cdCAgICAgICAgZmx1c2hpbmcgPSB0cnVlO1xuXHQgICAgfVxuXHQgICAgLy8gRXF1aXZhbGVudCB0byBwdXNoLCBidXQgYXZvaWRzIGEgZnVuY3Rpb24gY2FsbC5cblx0ICAgIHF1ZXVlW3F1ZXVlLmxlbmd0aF0gPSB0YXNrO1xuXHR9XG5cblx0dmFyIHF1ZXVlID0gW107XG5cdC8vIE9uY2UgYSBmbHVzaCBoYXMgYmVlbiByZXF1ZXN0ZWQsIG5vIGZ1cnRoZXIgY2FsbHMgdG8gYHJlcXVlc3RGbHVzaGAgYXJlXG5cdC8vIG5lY2Vzc2FyeSB1bnRpbCB0aGUgbmV4dCBgZmx1c2hgIGNvbXBsZXRlcy5cblx0dmFyIGZsdXNoaW5nID0gZmFsc2U7XG5cdC8vIGByZXF1ZXN0Rmx1c2hgIGlzIGFuIGltcGxlbWVudGF0aW9uLXNwZWNpZmljIG1ldGhvZCB0aGF0IGF0dGVtcHRzIHRvIGtpY2tcblx0Ly8gb2ZmIGEgYGZsdXNoYCBldmVudCBhcyBxdWlja2x5IGFzIHBvc3NpYmxlLiBgZmx1c2hgIHdpbGwgYXR0ZW1wdCB0byBleGhhdXN0XG5cdC8vIHRoZSBldmVudCBxdWV1ZSBiZWZvcmUgeWllbGRpbmcgdG8gdGhlIGJyb3dzZXIncyBvd24gZXZlbnQgbG9vcC5cblx0dmFyIHJlcXVlc3RGbHVzaDtcblx0Ly8gVGhlIHBvc2l0aW9uIG9mIHRoZSBuZXh0IHRhc2sgdG8gZXhlY3V0ZSBpbiB0aGUgdGFzayBxdWV1ZS4gVGhpcyBpc1xuXHQvLyBwcmVzZXJ2ZWQgYmV0d2VlbiBjYWxscyB0byBgZmx1c2hgIHNvIHRoYXQgaXQgY2FuIGJlIHJlc3VtZWQgaWZcblx0Ly8gYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24uXG5cdHZhciBpbmRleCA9IDA7XG5cdC8vIElmIGEgdGFzayBzY2hlZHVsZXMgYWRkaXRpb25hbCB0YXNrcyByZWN1cnNpdmVseSwgdGhlIHRhc2sgcXVldWUgY2FuIGdyb3dcblx0Ly8gdW5ib3VuZGVkLiBUbyBwcmV2ZW50IG1lbW9yeSBleGhhdXN0aW9uLCB0aGUgdGFzayBxdWV1ZSB3aWxsIHBlcmlvZGljYWxseVxuXHQvLyB0cnVuY2F0ZSBhbHJlYWR5LWNvbXBsZXRlZCB0YXNrcy5cblx0dmFyIGNhcGFjaXR5ID0gMTAyNDtcblxuXHQvLyBUaGUgZmx1c2ggZnVuY3Rpb24gcHJvY2Vzc2VzIGFsbCB0YXNrcyB0aGF0IGhhdmUgYmVlbiBzY2hlZHVsZWQgd2l0aFxuXHQvLyBgcmF3QXNhcGAgdW5sZXNzIGFuZCB1bnRpbCBvbmUgb2YgdGhvc2UgdGFza3MgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cblx0Ly8gSWYgYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24sIGBmbHVzaGAgZW5zdXJlcyB0aGF0IGl0cyBzdGF0ZSB3aWxsIHJlbWFpblxuXHQvLyBjb25zaXN0ZW50IGFuZCB3aWxsIHJlc3VtZSB3aGVyZSBpdCBsZWZ0IG9mZiB3aGVuIGNhbGxlZCBhZ2Fpbi5cblx0Ly8gSG93ZXZlciwgYGZsdXNoYCBkb2VzIG5vdCBtYWtlIGFueSBhcnJhbmdlbWVudHMgdG8gYmUgY2FsbGVkIGFnYWluIGlmIGFuXG5cdC8vIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG5cdGZ1bmN0aW9uIGZsdXNoKCkge1xuXHQgICAgd2hpbGUgKGluZGV4IDwgcXVldWUubGVuZ3RoKSB7XG5cdCAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGluZGV4O1xuXHQgICAgICAgIC8vIEFkdmFuY2UgdGhlIGluZGV4IGJlZm9yZSBjYWxsaW5nIHRoZSB0YXNrLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSB3aWxsXG5cdCAgICAgICAgLy8gYmVnaW4gZmx1c2hpbmcgb24gdGhlIG5leHQgdGFzayB0aGUgdGFzayB0aHJvd3MgYW4gZXJyb3IuXG5cdCAgICAgICAgaW5kZXggPSBpbmRleCArIDE7XG5cdCAgICAgICAgcXVldWVbY3VycmVudEluZGV4XS5jYWxsKCk7XG5cdCAgICAgICAgLy8gUHJldmVudCBsZWFraW5nIG1lbW9yeSBmb3IgbG9uZyBjaGFpbnMgb2YgcmVjdXJzaXZlIGNhbGxzIHRvIGBhc2FwYC5cblx0ICAgICAgICAvLyBJZiB3ZSBjYWxsIGBhc2FwYCB3aXRoaW4gdGFza3Mgc2NoZWR1bGVkIGJ5IGBhc2FwYCwgdGhlIHF1ZXVlIHdpbGxcblx0ICAgICAgICAvLyBncm93LCBidXQgdG8gYXZvaWQgYW4gTyhuKSB3YWxrIGZvciBldmVyeSB0YXNrIHdlIGV4ZWN1dGUsIHdlIGRvbid0XG5cdCAgICAgICAgLy8gc2hpZnQgdGFza3Mgb2ZmIHRoZSBxdWV1ZSBhZnRlciB0aGV5IGhhdmUgYmVlbiBleGVjdXRlZC5cblx0ICAgICAgICAvLyBJbnN0ZWFkLCB3ZSBwZXJpb2RpY2FsbHkgc2hpZnQgMTAyNCB0YXNrcyBvZmYgdGhlIHF1ZXVlLlxuXHQgICAgICAgIGlmIChpbmRleCA+IGNhcGFjaXR5KSB7XG5cdCAgICAgICAgICAgIC8vIE1hbnVhbGx5IHNoaWZ0IGFsbCB2YWx1ZXMgc3RhcnRpbmcgYXQgdGhlIGluZGV4IGJhY2sgdG8gdGhlXG5cdCAgICAgICAgICAgIC8vIGJlZ2lubmluZyBvZiB0aGUgcXVldWUuXG5cdCAgICAgICAgICAgIGZvciAodmFyIHNjYW4gPSAwLCBuZXdMZW5ndGggPSBxdWV1ZS5sZW5ndGggLSBpbmRleDsgc2NhbiA8IG5ld0xlbmd0aDsgc2NhbisrKSB7XG5cdCAgICAgICAgICAgICAgICBxdWV1ZVtzY2FuXSA9IHF1ZXVlW3NjYW4gKyBpbmRleF07XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcXVldWUubGVuZ3RoIC09IGluZGV4O1xuXHQgICAgICAgICAgICBpbmRleCA9IDA7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXHQgICAgcXVldWUubGVuZ3RoID0gMDtcblx0ICAgIGluZGV4ID0gMDtcblx0ICAgIGZsdXNoaW5nID0gZmFsc2U7XG5cdH1cblxuXHQvLyBgcmVxdWVzdEZsdXNoYCBpcyBpbXBsZW1lbnRlZCB1c2luZyBhIHN0cmF0ZWd5IGJhc2VkIG9uIGRhdGEgY29sbGVjdGVkIGZyb21cblx0Ly8gZXZlcnkgYXZhaWxhYmxlIFNhdWNlTGFicyBTZWxlbml1bSB3ZWIgZHJpdmVyIHdvcmtlciBhdCB0aW1lIG9mIHdyaXRpbmcuXG5cdC8vIGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzFtRy01VVlHdXA1cXhHZEVNV2toUDZCV0N6MDUzTlViMkUxUW9VVFUxNnVBL2VkaXQjZ2lkPTc4MzcyNDU5M1xuXG5cdC8vIFNhZmFyaSA2IGFuZCA2LjEgZm9yIGRlc2t0b3AsIGlQYWQsIGFuZCBpUGhvbmUgYXJlIHRoZSBvbmx5IGJyb3dzZXJzIHRoYXRcblx0Ly8gaGF2ZSBXZWJLaXRNdXRhdGlvbk9ic2VydmVyIGJ1dCBub3QgdW4tcHJlZml4ZWQgTXV0YXRpb25PYnNlcnZlci5cblx0Ly8gTXVzdCB1c2UgYGdsb2JhbGAgb3IgYHNlbGZgIGluc3RlYWQgb2YgYHdpbmRvd2AgdG8gd29yayBpbiBib3RoIGZyYW1lcyBhbmQgd2ViXG5cdC8vIHdvcmtlcnMuIGBnbG9iYWxgIGlzIGEgcHJvdmlzaW9uIG9mIEJyb3dzZXJpZnksIE1yLCBNcnMsIG9yIE1vcC5cblxuXHQvKiBnbG9iYWxzIHNlbGYgKi9cblx0dmFyIHNjb3BlID0gdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHNlbGY7XG5cdHZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IHNjb3BlLk11dGF0aW9uT2JzZXJ2ZXIgfHwgc2NvcGUuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuXHQvLyBNdXRhdGlvbk9ic2VydmVycyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBoYXZlIGhpZ2ggcHJpb3JpdHkgYW5kIHdvcmtcblx0Ly8gcmVsaWFibHkgZXZlcnl3aGVyZSB0aGV5IGFyZSBpbXBsZW1lbnRlZC5cblx0Ly8gVGhleSBhcmUgaW1wbGVtZW50ZWQgaW4gYWxsIG1vZGVybiBicm93c2Vycy5cblx0Ly9cblx0Ly8gLSBBbmRyb2lkIDQtNC4zXG5cdC8vIC0gQ2hyb21lIDI2LTM0XG5cdC8vIC0gRmlyZWZveCAxNC0yOVxuXHQvLyAtIEludGVybmV0IEV4cGxvcmVyIDExXG5cdC8vIC0gaVBhZCBTYWZhcmkgNi03LjFcblx0Ly8gLSBpUGhvbmUgU2FmYXJpIDctNy4xXG5cdC8vIC0gU2FmYXJpIDYtN1xuXHRpZiAodHlwZW9mIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID09PSBcImZ1bmN0aW9uXCIpIHtcblx0ICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcblxuXHQvLyBNZXNzYWdlQ2hhbm5lbHMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgZ2l2ZSBkaXJlY3QgYWNjZXNzIHRvIHRoZSBIVE1MXG5cdC8vIHRhc2sgcXVldWUsIGFyZSBpbXBsZW1lbnRlZCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCwgU2FmYXJpIDUuMC0xLCBhbmQgT3BlcmFcblx0Ly8gMTEtMTIsIGFuZCBpbiB3ZWIgd29ya2VycyBpbiBtYW55IGVuZ2luZXMuXG5cdC8vIEFsdGhvdWdoIG1lc3NhZ2UgY2hhbm5lbHMgeWllbGQgdG8gYW55IHF1ZXVlZCByZW5kZXJpbmcgYW5kIElPIHRhc2tzLCB0aGV5XG5cdC8vIHdvdWxkIGJlIGJldHRlciB0aGFuIGltcG9zaW5nIHRoZSA0bXMgZGVsYXkgb2YgdGltZXJzLlxuXHQvLyBIb3dldmVyLCB0aGV5IGRvIG5vdCB3b3JrIHJlbGlhYmx5IGluIEludGVybmV0IEV4cGxvcmVyIG9yIFNhZmFyaS5cblxuXHQvLyBJbnRlcm5ldCBFeHBsb3JlciAxMCBpcyB0aGUgb25seSBicm93c2VyIHRoYXQgaGFzIHNldEltbWVkaWF0ZSBidXQgZG9lc1xuXHQvLyBub3QgaGF2ZSBNdXRhdGlvbk9ic2VydmVycy5cblx0Ly8gQWx0aG91Z2ggc2V0SW1tZWRpYXRlIHlpZWxkcyB0byB0aGUgYnJvd3NlcidzIHJlbmRlcmVyLCBpdCB3b3VsZCBiZVxuXHQvLyBwcmVmZXJyYWJsZSB0byBmYWxsaW5nIGJhY2sgdG8gc2V0VGltZW91dCBzaW5jZSBpdCBkb2VzIG5vdCBoYXZlXG5cdC8vIHRoZSBtaW5pbXVtIDRtcyBwZW5hbHR5LlxuXHQvLyBVbmZvcnR1bmF0ZWx5IHRoZXJlIGFwcGVhcnMgdG8gYmUgYSBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAgTW9iaWxlIChhbmRcblx0Ly8gRGVza3RvcCB0byBhIGxlc3NlciBleHRlbnQpIHRoYXQgcmVuZGVycyBib3RoIHNldEltbWVkaWF0ZSBhbmRcblx0Ly8gTWVzc2FnZUNoYW5uZWwgdXNlbGVzcyBmb3IgdGhlIHB1cnBvc2VzIG9mIEFTQVAuXG5cdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS9pc3N1ZXMvMzk2XG5cblx0Ly8gVGltZXJzIGFyZSBpbXBsZW1lbnRlZCB1bml2ZXJzYWxseS5cblx0Ly8gV2UgZmFsbCBiYWNrIHRvIHRpbWVycyBpbiB3b3JrZXJzIGluIG1vc3QgZW5naW5lcywgYW5kIGluIGZvcmVncm91bmRcblx0Ly8gY29udGV4dHMgaW4gdGhlIGZvbGxvd2luZyBicm93c2Vycy5cblx0Ly8gSG93ZXZlciwgbm90ZSB0aGF0IGV2ZW4gdGhpcyBzaW1wbGUgY2FzZSByZXF1aXJlcyBudWFuY2VzIHRvIG9wZXJhdGUgaW4gYVxuXHQvLyBicm9hZCBzcGVjdHJ1bSBvZiBicm93c2Vycy5cblx0Ly9cblx0Ly8gLSBGaXJlZm94IDMtMTNcblx0Ly8gLSBJbnRlcm5ldCBFeHBsb3JlciA2LTlcblx0Ly8gLSBpUGFkIFNhZmFyaSA0LjNcblx0Ly8gLSBMeW54IDIuOC43XG5cdH0gZWxzZSB7XG5cdCAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoZmx1c2gpO1xuXHR9XG5cblx0Ly8gYHJlcXVlc3RGbHVzaGAgcmVxdWVzdHMgdGhhdCB0aGUgaGlnaCBwcmlvcml0eSBldmVudCBxdWV1ZSBiZSBmbHVzaGVkIGFzXG5cdC8vIHNvb24gYXMgcG9zc2libGUuXG5cdC8vIFRoaXMgaXMgdXNlZnVsIHRvIHByZXZlbnQgYW4gZXJyb3IgdGhyb3duIGluIGEgdGFzayBmcm9tIHN0YWxsaW5nIHRoZSBldmVudFxuXHQvLyBxdWV1ZSBpZiB0aGUgZXhjZXB0aW9uIGhhbmRsZWQgYnkgTm9kZS5qc+KAmXNcblx0Ly8gYHByb2Nlc3Mub24oXCJ1bmNhdWdodEV4Y2VwdGlvblwiKWAgb3IgYnkgYSBkb21haW4uXG5cdHJhd0FzYXAucmVxdWVzdEZsdXNoID0gcmVxdWVzdEZsdXNoO1xuXG5cdC8vIFRvIHJlcXVlc3QgYSBoaWdoIHByaW9yaXR5IGV2ZW50LCB3ZSBpbmR1Y2UgYSBtdXRhdGlvbiBvYnNlcnZlciBieSB0b2dnbGluZ1xuXHQvLyB0aGUgdGV4dCBvZiBhIHRleHQgbm9kZSBiZXR3ZWVuIFwiMVwiIGFuZCBcIi0xXCIuXG5cdGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKSB7XG5cdCAgICB2YXIgdG9nZ2xlID0gMTtcblx0ICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG5cdCAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuXHQgICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuXHQgICAgICAgIHRvZ2dsZSA9IC10b2dnbGU7XG5cdCAgICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlO1xuXHQgICAgfTtcblx0fVxuXG5cdC8vIFRoZSBtZXNzYWdlIGNoYW5uZWwgdGVjaG5pcXVlIHdhcyBkaXNjb3ZlcmVkIGJ5IE1hbHRlIFVibCBhbmQgd2FzIHRoZVxuXHQvLyBvcmlnaW5hbCBmb3VuZGF0aW9uIGZvciB0aGlzIGxpYnJhcnkuXG5cdC8vIGh0dHA6Ly93d3cubm9uYmxvY2tpbmcuaW8vMjAxMS8wNi93aW5kb3duZXh0dGljay5odG1sXG5cblx0Ly8gU2FmYXJpIDYuMC41IChhdCBsZWFzdCkgaW50ZXJtaXR0ZW50bHkgZmFpbHMgdG8gY3JlYXRlIG1lc3NhZ2UgcG9ydHMgb24gYVxuXHQvLyBwYWdlJ3MgZmlyc3QgbG9hZC4gVGhhbmtmdWxseSwgdGhpcyB2ZXJzaW9uIG9mIFNhZmFyaSBzdXBwb3J0c1xuXHQvLyBNdXRhdGlvbk9ic2VydmVycywgc28gd2UgZG9uJ3QgbmVlZCB0byBmYWxsIGJhY2sgaW4gdGhhdCBjYXNlLlxuXG5cdC8vIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NZXNzYWdlQ2hhbm5lbChjYWxsYmFjaykge1xuXHQvLyAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcblx0Ly8gICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gY2FsbGJhY2s7XG5cdC8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG5cdC8vICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcblx0Ly8gICAgIH07XG5cdC8vIH1cblxuXHQvLyBGb3IgcmVhc29ucyBleHBsYWluZWQgYWJvdmUsIHdlIGFyZSBhbHNvIHVuYWJsZSB0byB1c2UgYHNldEltbWVkaWF0ZWBcblx0Ly8gdW5kZXIgYW55IGNpcmN1bXN0YW5jZXMuXG5cdC8vIEV2ZW4gaWYgd2Ugd2VyZSwgdGhlcmUgaXMgYW5vdGhlciBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAuXG5cdC8vIEl0IGlzIG5vdCBzdWZmaWNpZW50IHRvIGFzc2lnbiBgc2V0SW1tZWRpYXRlYCB0byBgcmVxdWVzdEZsdXNoYCBiZWNhdXNlXG5cdC8vIGBzZXRJbW1lZGlhdGVgIG11c3QgYmUgY2FsbGVkICpieSBuYW1lKiBhbmQgdGhlcmVmb3JlIG11c3QgYmUgd3JhcHBlZCBpbiBhXG5cdC8vIGNsb3N1cmUuXG5cdC8vIE5ldmVyIGZvcmdldC5cblxuXHQvLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tU2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG5cdC8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG5cdC8vICAgICAgICAgc2V0SW1tZWRpYXRlKGNhbGxiYWNrKTtcblx0Ly8gICAgIH07XG5cdC8vIH1cblxuXHQvLyBTYWZhcmkgNi4wIGhhcyBhIHByb2JsZW0gd2hlcmUgdGltZXJzIHdpbGwgZ2V0IGxvc3Qgd2hpbGUgdGhlIHVzZXIgaXNcblx0Ly8gc2Nyb2xsaW5nLiBUaGlzIHByb2JsZW0gZG9lcyBub3QgaW1wYWN0IEFTQVAgYmVjYXVzZSBTYWZhcmkgNi4wIHN1cHBvcnRzXG5cdC8vIG11dGF0aW9uIG9ic2VydmVycywgc28gdGhhdCBpbXBsZW1lbnRhdGlvbiBpcyB1c2VkIGluc3RlYWQuXG5cdC8vIEhvd2V2ZXIsIGlmIHdlIGV2ZXIgZWxlY3QgdG8gdXNlIHRpbWVycyBpbiBTYWZhcmksIHRoZSBwcmV2YWxlbnQgd29yay1hcm91bmRcblx0Ly8gaXMgdG8gYWRkIGEgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyIHRoYXQgY2FsbHMgZm9yIGEgZmx1c2guXG5cblx0Ly8gYHNldFRpbWVvdXRgIGRvZXMgbm90IGNhbGwgdGhlIHBhc3NlZCBjYWxsYmFjayBpZiB0aGUgZGVsYXkgaXMgbGVzcyB0aGFuXG5cdC8vIGFwcHJveGltYXRlbHkgNyBpbiB3ZWIgd29ya2VycyBpbiBGaXJlZm94IDggdGhyb3VnaCAxOCwgYW5kIHNvbWV0aW1lcyBub3Rcblx0Ly8gZXZlbiB0aGVuLlxuXG5cdGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihjYWxsYmFjaykge1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuXHQgICAgICAgIC8vIFdlIGRpc3BhdGNoIGEgdGltZW91dCB3aXRoIGEgc3BlY2lmaWVkIGRlbGF5IG9mIDAgZm9yIGVuZ2luZXMgdGhhdFxuXHQgICAgICAgIC8vIGNhbiByZWxpYWJseSBhY2NvbW1vZGF0ZSB0aGF0IHJlcXVlc3QuIFRoaXMgd2lsbCB1c3VhbGx5IGJlIHNuYXBwZWRcblx0ICAgICAgICAvLyB0byBhIDQgbWlsaXNlY29uZCBkZWxheSwgYnV0IG9uY2Ugd2UncmUgZmx1c2hpbmcsIHRoZXJlJ3Mgbm8gZGVsYXlcblx0ICAgICAgICAvLyBiZXR3ZWVuIGV2ZW50cy5cblx0ICAgICAgICB2YXIgdGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoaGFuZGxlVGltZXIsIDApO1xuXHQgICAgICAgIC8vIEhvd2V2ZXIsIHNpbmNlIHRoaXMgdGltZXIgZ2V0cyBmcmVxdWVudGx5IGRyb3BwZWQgaW4gRmlyZWZveFxuXHQgICAgICAgIC8vIHdvcmtlcnMsIHdlIGVubGlzdCBhbiBpbnRlcnZhbCBoYW5kbGUgdGhhdCB3aWxsIHRyeSB0byBmaXJlXG5cdCAgICAgICAgLy8gYW4gZXZlbnQgMjAgdGltZXMgcGVyIHNlY29uZCB1bnRpbCBpdCBzdWNjZWVkcy5cblx0ICAgICAgICB2YXIgaW50ZXJ2YWxIYW5kbGUgPSBzZXRJbnRlcnZhbChoYW5kbGVUaW1lciwgNTApO1xuXG5cdCAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGltZXIoKSB7XG5cdCAgICAgICAgICAgIC8vIFdoaWNoZXZlciB0aW1lciBzdWNjZWVkcyB3aWxsIGNhbmNlbCBib3RoIHRpbWVycyBhbmRcblx0ICAgICAgICAgICAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2suXG5cdCAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SGFuZGxlKTtcblx0ICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbEhhbmRsZSk7XG5cdCAgICAgICAgICAgIGNhbGxiYWNrKCk7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0fVxuXG5cdC8vIFRoaXMgaXMgZm9yIGBhc2FwLmpzYCBvbmx5LlxuXHQvLyBJdHMgbmFtZSB3aWxsIGJlIHBlcmlvZGljYWxseSByYW5kb21pemVkIHRvIGJyZWFrIGFueSBjb2RlIHRoYXQgZGVwZW5kcyBvblxuXHQvLyBpdHMgZXhpc3RlbmNlLlxuXHRyYXdBc2FwLm1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lciA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcjtcblxuXHQvLyBBU0FQIHdhcyBvcmlnaW5hbGx5IGEgbmV4dFRpY2sgc2hpbSBpbmNsdWRlZCBpbiBRLiBUaGlzIHdhcyBmYWN0b3JlZCBvdXRcblx0Ly8gaW50byB0aGlzIEFTQVAgcGFja2FnZS4gSXQgd2FzIGxhdGVyIGFkYXB0ZWQgdG8gUlNWUCB3aGljaCBtYWRlIGZ1cnRoZXJcblx0Ly8gYW1lbmRtZW50cy4gVGhlc2UgZGVjaXNpb25zLCBwYXJ0aWN1bGFybHkgdG8gbWFyZ2luYWxpemUgTWVzc2FnZUNoYW5uZWwgYW5kXG5cdC8vIHRvIGNhcHR1cmUgdGhlIE11dGF0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24gaW4gYSBjbG9zdXJlLCB3ZXJlIGludGVncmF0ZWRcblx0Ly8gYmFjayBpbnRvIEFTQVAgcHJvcGVyLlxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vdGlsZGVpby9yc3ZwLmpzL2Jsb2IvY2RkZjcyMzI1NDZhOWNmODU4NTI0Yjc1Y2RlNmY5ZWRmNzI2MjBhNy9saWIvcnN2cC9hc2FwLmpzXG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0oKSkpKVxuXG4vKioqLyB9KSxcbi8qIDYgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8gQSBzaW1wbGUgY2xhc3Mgc3lzdGVtLCBtb3JlIGRvY3VtZW50YXRpb24gdG8gY29tZVxuXG5cdGZ1bmN0aW9uIGV4dGVuZChjbHMsIG5hbWUsIHByb3BzKSB7XG5cdCAgICAvLyBUaGlzIGRvZXMgdGhhdCBzYW1lIHRoaW5nIGFzIE9iamVjdC5jcmVhdGUsIGJ1dCB3aXRoIHN1cHBvcnQgZm9yIElFOFxuXHQgICAgdmFyIEYgPSBmdW5jdGlvbigpIHt9O1xuXHQgICAgRi5wcm90b3R5cGUgPSBjbHMucHJvdG90eXBlO1xuXHQgICAgdmFyIHByb3RvdHlwZSA9IG5ldyBGKCk7XG5cblx0ICAgIC8vIGpzaGludCB1bmRlZjogZmFsc2Vcblx0ICAgIHZhciBmblRlc3QgPSAveHl6Ly50ZXN0KGZ1bmN0aW9uKCl7IHh5ejsgfSkgPyAvXFxicGFyZW50XFxiLyA6IC8uKi87XG5cdCAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xuXG5cdCAgICBmb3IodmFyIGsgaW4gcHJvcHMpIHtcblx0ICAgICAgICB2YXIgc3JjID0gcHJvcHNba107XG5cdCAgICAgICAgdmFyIHBhcmVudCA9IHByb3RvdHlwZVtrXTtcblxuXHQgICAgICAgIGlmKHR5cGVvZiBwYXJlbnQgPT09ICdmdW5jdGlvbicgJiZcblx0ICAgICAgICAgICB0eXBlb2Ygc3JjID09PSAnZnVuY3Rpb24nICYmXG5cdCAgICAgICAgICAgZm5UZXN0LnRlc3Qoc3JjKSkge1xuXHQgICAgICAgICAgICAvKmpzaGludCAtVzA4MyAqL1xuXHQgICAgICAgICAgICBwcm90b3R5cGVba10gPSAoZnVuY3Rpb24gKHNyYywgcGFyZW50KSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gU2F2ZSB0aGUgY3VycmVudCBwYXJlbnQgbWV0aG9kXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHRtcCA9IHRoaXMucGFyZW50O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHBhcmVudCB0byB0aGUgcHJldmlvdXMgbWV0aG9kLCBjYWxsLCBhbmQgcmVzdG9yZVxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciByZXMgPSBzcmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudCA9IHRtcDtcblxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG5cdCAgICAgICAgICAgICAgICB9O1xuXHQgICAgICAgICAgICB9KShzcmMsIHBhcmVudCk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICBwcm90b3R5cGVba10gPSBzcmM7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBwcm90b3R5cGUudHlwZW5hbWUgPSBuYW1lO1xuXG5cdCAgICB2YXIgbmV3X2NscyA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIGlmKHByb3RvdHlwZS5pbml0KSB7XG5cdCAgICAgICAgICAgIHByb3RvdHlwZS5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblxuXHQgICAgbmV3X2Nscy5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG5cdCAgICBuZXdfY2xzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG5ld19jbHM7XG5cblx0ICAgIG5ld19jbHMuZXh0ZW5kID0gZnVuY3Rpb24obmFtZSwgcHJvcHMpIHtcblx0ICAgICAgICBpZih0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpIHtcblx0ICAgICAgICAgICAgcHJvcHMgPSBuYW1lO1xuXHQgICAgICAgICAgICBuYW1lID0gJ2Fub255bW91cyc7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBleHRlbmQobmV3X2NscywgbmFtZSwgcHJvcHMpO1xuXHQgICAgfTtcblxuXHQgICAgcmV0dXJuIG5ld19jbHM7XG5cdH1cblxuXHRtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZChPYmplY3QsICdPYmplY3QnLCB7fSk7XG5cblxuLyoqKi8gfSksXG4vKiA3ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBsaWIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHR2YXIgcGFyc2VyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg4KTtcblx0dmFyIHRyYW5zZm9ybWVyID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMik7XG5cdHZhciBub2RlcyA9IF9fd2VicGFja19yZXF1aXJlX18oMTApO1xuXHQvLyBqc2hpbnQgLVcwNzlcblx0dmFyIE9iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cdHZhciBGcmFtZSA9IF9fd2VicGFja19yZXF1aXJlX18oMTMpLkZyYW1lO1xuXG5cdC8vIFRoZXNlIGFyZSBhbGwgdGhlIHNhbWUgZm9yIG5vdywgYnV0IHNob3VsZG4ndCBiZSBwYXNzZWQgc3RyYWlnaHRcblx0Ly8gdGhyb3VnaFxuXHR2YXIgY29tcGFyZU9wcyA9IHtcblx0ICAgICc9PSc6ICc9PScsXG5cdCAgICAnPT09JzogJz09PScsXG5cdCAgICAnIT0nOiAnIT0nLFxuXHQgICAgJyE9PSc6ICchPT0nLFxuXHQgICAgJzwnOiAnPCcsXG5cdCAgICAnPic6ICc+Jyxcblx0ICAgICc8PSc6ICc8PScsXG5cdCAgICAnPj0nOiAnPj0nXG5cdH07XG5cblx0Ly8gQSBjb21tb24gcGF0dGVybiBpcyB0byBlbWl0IGJpbmFyeSBvcGVyYXRvcnNcblx0ZnVuY3Rpb24gYmluT3BFbWl0dGVyKHN0cikge1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdGhpcy5jb21waWxlKG5vZGUubGVmdCwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdChzdHIpO1xuXHQgICAgICAgIHRoaXMuY29tcGlsZShub2RlLnJpZ2h0LCBmcmFtZSk7XG5cdCAgICB9O1xuXHR9XG5cblx0dmFyIENvbXBpbGVyID0gT2JqZWN0LmV4dGVuZCh7XG5cdCAgICBpbml0OiBmdW5jdGlvbih0ZW1wbGF0ZU5hbWUsIHRocm93T25VbmRlZmluZWQpIHtcblx0ICAgICAgICB0aGlzLnRlbXBsYXRlTmFtZSA9IHRlbXBsYXRlTmFtZTtcblx0ICAgICAgICB0aGlzLmNvZGVidWYgPSBbXTtcblx0ICAgICAgICB0aGlzLmxhc3RJZCA9IDA7XG5cdCAgICAgICAgdGhpcy5idWZmZXIgPSBudWxsO1xuXHQgICAgICAgIHRoaXMuYnVmZmVyU3RhY2sgPSBbXTtcblx0ICAgICAgICB0aGlzLnNjb3BlQ2xvc2VycyA9ICcnO1xuXHQgICAgICAgIHRoaXMuaW5CbG9jayA9IGZhbHNlO1xuXHQgICAgICAgIHRoaXMudGhyb3dPblVuZGVmaW5lZCA9IHRocm93T25VbmRlZmluZWQ7XG5cdCAgICB9LFxuXG5cdCAgICBmYWlsOiBmdW5jdGlvbiAobXNnLCBsaW5lbm8sIGNvbG5vKSB7XG5cdCAgICAgICAgaWYgKGxpbmVubyAhPT0gdW5kZWZpbmVkKSBsaW5lbm8gKz0gMTtcblx0ICAgICAgICBpZiAoY29sbm8gIT09IHVuZGVmaW5lZCkgY29sbm8gKz0gMTtcblxuXHQgICAgICAgIHRocm93IG5ldyBsaWIuVGVtcGxhdGVFcnJvcihtc2csIGxpbmVubywgY29sbm8pO1xuXHQgICAgfSxcblxuXHQgICAgcHVzaEJ1ZmZlcklkOiBmdW5jdGlvbihpZCkge1xuXHQgICAgICAgIHRoaXMuYnVmZmVyU3RhY2sucHVzaCh0aGlzLmJ1ZmZlcik7XG5cdCAgICAgICAgdGhpcy5idWZmZXIgPSBpZDtcblx0ICAgICAgICB0aGlzLmVtaXQoJ3ZhciAnICsgdGhpcy5idWZmZXIgKyAnID0gXCJcIjsnKTtcblx0ICAgIH0sXG5cblx0ICAgIHBvcEJ1ZmZlcklkOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB0aGlzLmJ1ZmZlciA9IHRoaXMuYnVmZmVyU3RhY2sucG9wKCk7XG5cdCAgICB9LFxuXG5cdCAgICBlbWl0OiBmdW5jdGlvbihjb2RlKSB7XG5cdCAgICAgICAgdGhpcy5jb2RlYnVmLnB1c2goY29kZSk7XG5cdCAgICB9LFxuXG5cdCAgICBlbWl0TGluZTogZnVuY3Rpb24oY29kZSkge1xuXHQgICAgICAgIHRoaXMuZW1pdChjb2RlICsgJ1xcbicpO1xuXHQgICAgfSxcblxuXHQgICAgZW1pdExpbmVzOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICBsaWIuZWFjaChsaWIudG9BcnJheShhcmd1bWVudHMpLCBmdW5jdGlvbihsaW5lKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUobGluZSk7XG5cdCAgICAgICAgfSwgdGhpcyk7XG5cdCAgICB9LFxuXG5cdCAgICBlbWl0RnVuY0JlZ2luOiBmdW5jdGlvbihuYW1lKSB7XG5cdCAgICAgICAgdGhpcy5idWZmZXIgPSAnb3V0cHV0Jztcblx0ICAgICAgICB0aGlzLnNjb3BlQ2xvc2VycyA9ICcnO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ2Z1bmN0aW9uICcgKyBuYW1lICsgJyhlbnYsIGNvbnRleHQsIGZyYW1lLCBydW50aW1lLCBjYikgeycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3ZhciBsaW5lbm8gPSBudWxsOycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3ZhciBjb2xubyA9IG51bGw7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgndmFyICcgKyB0aGlzLmJ1ZmZlciArICcgPSBcIlwiOycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3RyeSB7Jyk7XG5cdCAgICB9LFxuXG5cdCAgICBlbWl0RnVuY0VuZDogZnVuY3Rpb24obm9SZXR1cm4pIHtcblx0ICAgICAgICBpZighbm9SZXR1cm4pIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnY2IobnVsbCwgJyArIHRoaXMuYnVmZmVyICsnKTsnKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmNsb3NlU2NvcGVMZXZlbHMoKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd9IGNhdGNoIChlKSB7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnICBjYihydW50aW1lLmhhbmRsZUVycm9yKGUsIGxpbmVubywgY29sbm8pKTsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd9Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgIHRoaXMuYnVmZmVyID0gbnVsbDtcblx0ICAgIH0sXG5cblx0ICAgIGFkZFNjb3BlTGV2ZWw6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHRoaXMuc2NvcGVDbG9zZXJzICs9ICd9KSc7XG5cdCAgICB9LFxuXG5cdCAgICBjbG9zZVNjb3BlTGV2ZWxzOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKHRoaXMuc2NvcGVDbG9zZXJzICsgJzsnKTtcblx0ICAgICAgICB0aGlzLnNjb3BlQ2xvc2VycyA9ICcnO1xuXHQgICAgfSxcblxuXHQgICAgd2l0aFNjb3BlZFN5bnRheDogZnVuY3Rpb24oZnVuYykge1xuXHQgICAgICAgIHZhciBzY29wZUNsb3NlcnMgPSB0aGlzLnNjb3BlQ2xvc2Vycztcblx0ICAgICAgICB0aGlzLnNjb3BlQ2xvc2VycyA9ICcnO1xuXG5cdCAgICAgICAgZnVuYy5jYWxsKHRoaXMpO1xuXG5cdCAgICAgICAgdGhpcy5jbG9zZVNjb3BlTGV2ZWxzKCk7XG5cdCAgICAgICAgdGhpcy5zY29wZUNsb3NlcnMgPSBzY29wZUNsb3NlcnM7XG5cdCAgICB9LFxuXG5cdCAgICBtYWtlQ2FsbGJhY2s6IGZ1bmN0aW9uKHJlcykge1xuXHQgICAgICAgIHZhciBlcnIgPSB0aGlzLnRtcGlkKCk7XG5cblx0ICAgICAgICByZXR1cm4gJ2Z1bmN0aW9uKCcgKyBlcnIgKyAocmVzID8gJywnICsgcmVzIDogJycpICsgJykge1xcbicgK1xuXHQgICAgICAgICAgICAnaWYoJyArIGVyciArICcpIHsgY2IoJyArIGVyciArICcpOyByZXR1cm47IH0nO1xuXHQgICAgfSxcblxuXHQgICAgdG1waWQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHRoaXMubGFzdElkKys7XG5cdCAgICAgICAgcmV0dXJuICd0XycgKyB0aGlzLmxhc3RJZDtcblx0ICAgIH0sXG5cblx0ICAgIF90ZW1wbGF0ZU5hbWU6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlTmFtZSA9PSBudWxsPyAndW5kZWZpbmVkJyA6IEpTT04uc3RyaW5naWZ5KHRoaXMudGVtcGxhdGVOYW1lKTtcblx0ICAgIH0sXG5cblx0ICAgIF9jb21waWxlQ2hpbGRyZW46IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcblx0ICAgICAgICBmb3IodmFyIGk9MCwgbD1jaGlsZHJlbi5sZW5ndGg7IGk8bDsgaSsrKSB7XG5cdCAgICAgICAgICAgIHRoaXMuY29tcGlsZShjaGlsZHJlbltpXSwgZnJhbWUpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIF9jb21waWxlQWdncmVnYXRlOiBmdW5jdGlvbihub2RlLCBmcmFtZSwgc3RhcnRDaGFyLCBlbmRDaGFyKSB7XG5cdCAgICAgICAgaWYoc3RhcnRDaGFyKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdChzdGFydENoYXIpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGZvcih2YXIgaT0wOyBpPG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgaWYoaSA+IDApIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnLCcpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuY2hpbGRyZW5baV0sIGZyYW1lKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZihlbmRDaGFyKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdChlbmRDaGFyKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBfY29tcGlsZUV4cHJlc3Npb246IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgLy8gVE9ETzogSSdtIG5vdCByZWFsbHkgc3VyZSBpZiB0aGlzIHR5cGUgY2hlY2sgaXMgd29ydGggaXQgb3Jcblx0ICAgICAgICAvLyBub3QuXG5cdCAgICAgICAgdGhpcy5hc3NlcnRUeXBlKFxuXHQgICAgICAgICAgICBub2RlLFxuXHQgICAgICAgICAgICBub2Rlcy5MaXRlcmFsLFxuXHQgICAgICAgICAgICBub2Rlcy5TeW1ib2wsXG5cdCAgICAgICAgICAgIG5vZGVzLkdyb3VwLFxuXHQgICAgICAgICAgICBub2Rlcy5BcnJheSxcblx0ICAgICAgICAgICAgbm9kZXMuRGljdCxcblx0ICAgICAgICAgICAgbm9kZXMuRnVuQ2FsbCxcblx0ICAgICAgICAgICAgbm9kZXMuQ2FsbGVyLFxuXHQgICAgICAgICAgICBub2Rlcy5GaWx0ZXIsXG5cdCAgICAgICAgICAgIG5vZGVzLkxvb2t1cFZhbCxcblx0ICAgICAgICAgICAgbm9kZXMuQ29tcGFyZSxcblx0ICAgICAgICAgICAgbm9kZXMuSW5saW5lSWYsXG5cdCAgICAgICAgICAgIG5vZGVzLkluLFxuXHQgICAgICAgICAgICBub2Rlcy5BbmQsXG5cdCAgICAgICAgICAgIG5vZGVzLk9yLFxuXHQgICAgICAgICAgICBub2Rlcy5Ob3QsXG5cdCAgICAgICAgICAgIG5vZGVzLkFkZCxcblx0ICAgICAgICAgICAgbm9kZXMuQ29uY2F0LFxuXHQgICAgICAgICAgICBub2Rlcy5TdWIsXG5cdCAgICAgICAgICAgIG5vZGVzLk11bCxcblx0ICAgICAgICAgICAgbm9kZXMuRGl2LFxuXHQgICAgICAgICAgICBub2Rlcy5GbG9vckRpdixcblx0ICAgICAgICAgICAgbm9kZXMuTW9kLFxuXHQgICAgICAgICAgICBub2Rlcy5Qb3csXG5cdCAgICAgICAgICAgIG5vZGVzLk5lZyxcblx0ICAgICAgICAgICAgbm9kZXMuUG9zLFxuXHQgICAgICAgICAgICBub2Rlcy5Db21wYXJlLFxuXHQgICAgICAgICAgICBub2Rlcy5Ob2RlTGlzdFxuXHQgICAgICAgICk7XG5cdCAgICAgICAgdGhpcy5jb21waWxlKG5vZGUsIGZyYW1lKTtcblx0ICAgIH0sXG5cblx0ICAgIGFzc2VydFR5cGU6IGZ1bmN0aW9uKG5vZGUgLyosIHR5cGVzICovKSB7XG5cdCAgICAgICAgdmFyIHR5cGVzID0gbGliLnRvQXJyYXkoYXJndW1lbnRzKS5zbGljZSgxKTtcblx0ICAgICAgICB2YXIgc3VjY2VzcyA9IGZhbHNlO1xuXG5cdCAgICAgICAgZm9yKHZhciBpPTA7IGk8dHlwZXMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgaWYobm9kZSBpbnN0YW5jZW9mIHR5cGVzW2ldKSB7XG5cdCAgICAgICAgICAgICAgICBzdWNjZXNzID0gdHJ1ZTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKCFzdWNjZXNzKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgnYXNzZXJ0VHlwZTogaW52YWxpZCB0eXBlOiAnICsgbm9kZS50eXBlbmFtZSxcblx0ICAgICAgICAgICAgICAgICAgICAgIG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUNhbGxFeHRlbnNpb246IGZ1bmN0aW9uKG5vZGUsIGZyYW1lLCBhc3luYykge1xuXHQgICAgICAgIHZhciBhcmdzID0gbm9kZS5hcmdzO1xuXHQgICAgICAgIHZhciBjb250ZW50QXJncyA9IG5vZGUuY29udGVudEFyZ3M7XG5cdCAgICAgICAgdmFyIGF1dG9lc2NhcGUgPSB0eXBlb2Ygbm9kZS5hdXRvZXNjYXBlID09PSAnYm9vbGVhbicgPyBub2RlLmF1dG9lc2NhcGUgOiB0cnVlO1xuXG5cdCAgICAgICAgaWYoIWFzeW5jKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLmJ1ZmZlciArICcgKz0gcnVudGltZS5zdXBwcmVzc1ZhbHVlKCcpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuZW1pdCgnZW52LmdldEV4dGVuc2lvbihcIicgKyBub2RlLmV4dE5hbWUgKyAnXCIpW1wiJyArIG5vZGUucHJvcCArICdcIl0oJyk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCdjb250ZXh0Jyk7XG5cblx0ICAgICAgICBpZihhcmdzIHx8IGNvbnRlbnRBcmdzKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdCgnLCcpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKGFyZ3MpIHtcblx0ICAgICAgICAgICAgaWYoIShhcmdzIGluc3RhbmNlb2Ygbm9kZXMuTm9kZUxpc3QpKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ2NvbXBpbGVDYWxsRXh0ZW5zaW9uOiBhcmd1bWVudHMgbXVzdCBiZSBhIE5vZGVMaXN0LCAnICtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAndXNlIGBwYXJzZXIucGFyc2VTaWduYXR1cmVgJyk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBsaWIuZWFjaChhcmdzLmNoaWxkcmVuLCBmdW5jdGlvbihhcmcsIGkpIHtcblx0ICAgICAgICAgICAgICAgIC8vIFRhZyBhcmd1bWVudHMgYXJlIHBhc3NlZCBub3JtYWxseSB0byB0aGUgY2FsbC4gTm90ZVxuXHQgICAgICAgICAgICAgICAgLy8gdGhhdCBrZXl3b3JkIGFyZ3VtZW50cyBhcmUgdHVybmVkIGludG8gYSBzaW5nbGUganNcblx0ICAgICAgICAgICAgICAgIC8vIG9iamVjdCBhcyB0aGUgbGFzdCBhcmd1bWVudCwgaWYgdGhleSBleGlzdC5cblx0ICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKGFyZywgZnJhbWUpO1xuXG5cdCAgICAgICAgICAgICAgICBpZihpICE9PSBhcmdzLmNoaWxkcmVuLmxlbmd0aCAtIDEgfHwgY29udGVudEFyZ3MubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCcsJyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sIHRoaXMpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKGNvbnRlbnRBcmdzLmxlbmd0aCkge1xuXHQgICAgICAgICAgICBsaWIuZWFjaChjb250ZW50QXJncywgZnVuY3Rpb24oYXJnLCBpKSB7XG5cdCAgICAgICAgICAgICAgICBpZihpID4gMCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnLCcpO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICBpZihhcmcpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSB0aGlzLnRtcGlkKCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdmdW5jdGlvbihjYikgeycpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2lmKCFjYikgeyBjYiA9IGZ1bmN0aW9uKGVycikgeyBpZihlcnIpIHsgdGhyb3cgZXJyOyB9fX0nKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2hCdWZmZXJJZChpZCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLndpdGhTY29wZWRTeW50YXgoZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGlsZShhcmcsIGZyYW1lKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnY2IobnVsbCwgJyArIGlkICsgJyk7Jyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcEJ1ZmZlcklkKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgncmV0dXJuICcgKyBpZCArICc7Jyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdudWxsJyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sIHRoaXMpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKGFzeW5jKSB7XG5cdCAgICAgICAgICAgIHZhciByZXMgPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJywgJyArIHRoaXMubWFrZUNhbGxiYWNrKHJlcykpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKHRoaXMuYnVmZmVyICsgJyArPSBydW50aW1lLnN1cHByZXNzVmFsdWUoJyArIHJlcyArICcsICcgKyBhdXRvZXNjYXBlICsgJyAmJiBlbnYub3B0cy5hdXRvZXNjYXBlKTsnKTtcblx0ICAgICAgICAgICAgdGhpcy5hZGRTY29wZUxldmVsKCk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQoJyknKTtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0KCcsICcgKyBhdXRvZXNjYXBlICsgJyAmJiBlbnYub3B0cy5hdXRvZXNjYXBlKTtcXG4nKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlQ2FsbEV4dGVuc2lvbkFzeW5jOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuY29tcGlsZUNhbGxFeHRlbnNpb24obm9kZSwgZnJhbWUsIHRydWUpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZU5vZGVMaXN0OiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVDaGlsZHJlbihub2RlLCBmcmFtZSk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlTGl0ZXJhbDogZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgIGlmKHR5cGVvZiBub2RlLnZhbHVlID09PSAnc3RyaW5nJykge1xuXHQgICAgICAgICAgICB2YXIgdmFsID0gbm9kZS52YWx1ZS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpO1xuXHQgICAgICAgICAgICB2YWwgPSB2YWwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpO1xuXHQgICAgICAgICAgICB2YWwgPSB2YWwucmVwbGFjZSgvXFxuL2csICdcXFxcbicpO1xuXHQgICAgICAgICAgICB2YWwgPSB2YWwucmVwbGFjZSgvXFxyL2csICdcXFxccicpO1xuXHQgICAgICAgICAgICB2YWwgPSB2YWwucmVwbGFjZSgvXFx0L2csICdcXFxcdCcpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQoJ1wiJyArIHZhbCAgKyAnXCInKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZiAobm9kZS52YWx1ZSA9PT0gbnVsbCkge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQoJ251bGwnKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdChub2RlLnZhbHVlLnRvU3RyaW5nKCkpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVTeW1ib2w6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdmFyIG5hbWUgPSBub2RlLnZhbHVlO1xuXHQgICAgICAgIHZhciB2O1xuXG5cdCAgICAgICAgaWYoKHYgPSBmcmFtZS5sb29rdXAobmFtZSkpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdCh2KTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdCgncnVudGltZS5jb250ZXh0T3JGcmFtZUxvb2t1cCgnICtcblx0ICAgICAgICAgICAgICAgICAgICAgICdjb250ZXh0LCBmcmFtZSwgXCInICsgbmFtZSArICdcIiknKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlR3JvdXA6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUFnZ3JlZ2F0ZShub2RlLCBmcmFtZSwgJygnLCAnKScpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUFycmF5OiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVBZ2dyZWdhdGUobm9kZSwgZnJhbWUsICdbJywgJ10nKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVEaWN0OiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVBZ2dyZWdhdGUobm9kZSwgZnJhbWUsICd7JywgJ30nKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVQYWlyOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHZhciBrZXkgPSBub2RlLmtleTtcblx0ICAgICAgICB2YXIgdmFsID0gbm9kZS52YWx1ZTtcblxuXHQgICAgICAgIGlmKGtleSBpbnN0YW5jZW9mIG5vZGVzLlN5bWJvbCkge1xuXHQgICAgICAgICAgICBrZXkgPSBuZXcgbm9kZXMuTGl0ZXJhbChrZXkubGluZW5vLCBrZXkuY29sbm8sIGtleS52YWx1ZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYoIShrZXkgaW5zdGFuY2VvZiBub2Rlcy5MaXRlcmFsICYmXG5cdCAgICAgICAgICAgICAgICAgIHR5cGVvZiBrZXkudmFsdWUgPT09ICdzdHJpbmcnKSkge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ2NvbXBpbGVQYWlyOiBEaWN0IGtleXMgbXVzdCBiZSBzdHJpbmdzIG9yIG5hbWVzJyxcblx0ICAgICAgICAgICAgICAgICAgICAgIGtleS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICBrZXkuY29sbm8pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuY29tcGlsZShrZXksIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJzogJyk7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUV4cHJlc3Npb24odmFsLCBmcmFtZSk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlSW5saW5lSWY6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdGhpcy5lbWl0KCcoJyk7XG5cdCAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuY29uZCwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnPycpO1xuXHQgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmJvZHksIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJzonKTtcblx0ICAgICAgICBpZihub2RlLmVsc2VfICE9PSBudWxsKVxuXHQgICAgICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5lbHNlXywgZnJhbWUpO1xuXHQgICAgICAgIGVsc2Vcblx0ICAgICAgICAgICAgdGhpcy5lbWl0KCdcIlwiJyk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCcpJyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlSW46IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgIHRoaXMuZW1pdCgncnVudGltZS5pbk9wZXJhdG9yKCcpO1xuXHQgICAgICB0aGlzLmNvbXBpbGUobm9kZS5sZWZ0LCBmcmFtZSk7XG5cdCAgICAgIHRoaXMuZW1pdCgnLCcpO1xuXHQgICAgICB0aGlzLmNvbXBpbGUobm9kZS5yaWdodCwgZnJhbWUpO1xuXHQgICAgICB0aGlzLmVtaXQoJyknKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVPcjogYmluT3BFbWl0dGVyKCcgfHwgJyksXG5cdCAgICBjb21waWxlQW5kOiBiaW5PcEVtaXR0ZXIoJyAmJiAnKSxcblx0ICAgIGNvbXBpbGVBZGQ6IGJpbk9wRW1pdHRlcignICsgJyksXG5cdCAgICAvLyBlbnN1cmUgY29uY2F0ZW5hdGlvbiBpbnN0ZWFkIG9mIGFkZGl0aW9uXG5cdCAgICAvLyBieSBhZGRpbmcgZW1wdHkgc3RyaW5nIGluIGJldHdlZW5cblx0ICAgIGNvbXBpbGVDb25jYXQ6IGJpbk9wRW1pdHRlcignICsgXCJcIiArICcpLFxuXHQgICAgY29tcGlsZVN1YjogYmluT3BFbWl0dGVyKCcgLSAnKSxcblx0ICAgIGNvbXBpbGVNdWw6IGJpbk9wRW1pdHRlcignICogJyksXG5cdCAgICBjb21waWxlRGl2OiBiaW5PcEVtaXR0ZXIoJyAvICcpLFxuXHQgICAgY29tcGlsZU1vZDogYmluT3BFbWl0dGVyKCcgJSAnKSxcblxuXHQgICAgY29tcGlsZU5vdDogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLmVtaXQoJyEnKTtcblx0ICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS50YXJnZXQsIGZyYW1lKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVGbG9vckRpdjogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLmVtaXQoJ01hdGguZmxvb3IoJyk7XG5cdCAgICAgICAgdGhpcy5jb21waWxlKG5vZGUubGVmdCwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnIC8gJyk7XG5cdCAgICAgICAgdGhpcy5jb21waWxlKG5vZGUucmlnaHQsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJyknKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVQb3c6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdGhpcy5lbWl0KCdNYXRoLnBvdygnKTtcblx0ICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5sZWZ0LCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCcsICcpO1xuXHQgICAgICAgIHRoaXMuY29tcGlsZShub2RlLnJpZ2h0LCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCcpJyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlTmVnOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuZW1pdCgnLScpO1xuXHQgICAgICAgIHRoaXMuY29tcGlsZShub2RlLnRhcmdldCwgZnJhbWUpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZVBvczogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLmVtaXQoJysnKTtcblx0ICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS50YXJnZXQsIGZyYW1lKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVDb21wYXJlOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmV4cHIsIGZyYW1lKTtcblxuXHQgICAgICAgIGZvcih2YXIgaT0wOyBpPG5vZGUub3BzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIHZhciBuID0gbm9kZS5vcHNbaV07XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdCgnICcgKyBjb21wYXJlT3BzW24udHlwZV0gKyAnICcpO1xuXHQgICAgICAgICAgICB0aGlzLmNvbXBpbGUobi5leHByLCBmcmFtZSk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUxvb2t1cFZhbDogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLmVtaXQoJ3J1bnRpbWUubWVtYmVyTG9va3VwKCgnKTtcblx0ICAgICAgICB0aGlzLl9jb21waWxlRXhwcmVzc2lvbihub2RlLnRhcmdldCwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnKSwnKTtcblx0ICAgICAgICB0aGlzLl9jb21waWxlRXhwcmVzc2lvbihub2RlLnZhbCwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnKScpO1xuXHQgICAgfSxcblxuXHQgICAgX2dldE5vZGVOYW1lOiBmdW5jdGlvbihub2RlKSB7XG5cdCAgICAgICAgc3dpdGNoIChub2RlLnR5cGVuYW1lKSB7XG5cdCAgICAgICAgICAgIGNhc2UgJ1N5bWJvbCc6XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS52YWx1ZTtcblx0ICAgICAgICAgICAgY2FzZSAnRnVuQ2FsbCc6XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gJ3RoZSByZXR1cm4gdmFsdWUgb2YgKCcgKyB0aGlzLl9nZXROb2RlTmFtZShub2RlLm5hbWUpICsgJyknO1xuXHQgICAgICAgICAgICBjYXNlICdMb29rdXBWYWwnOlxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldE5vZGVOYW1lKG5vZGUudGFyZ2V0KSArICdbXCInICtcblx0ICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXROb2RlTmFtZShub2RlLnZhbCkgKyAnXCJdJztcblx0ICAgICAgICAgICAgY2FzZSAnTGl0ZXJhbCc6XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS52YWx1ZS50b1N0cmluZygpO1xuXHQgICAgICAgICAgICBkZWZhdWx0OlxuXHQgICAgICAgICAgICAgICAgcmV0dXJuICctLWV4cHJlc3Npb24tLSc7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUZ1bkNhbGw6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgLy8gS2VlcCB0cmFjayBvZiBsaW5lL2NvbCBpbmZvIGF0IHJ1bnRpbWUgYnkgc2V0dGluZ3Ncblx0ICAgICAgICAvLyB2YXJpYWJsZXMgd2l0aGluIGFuIGV4cHJlc3Npb24uIEFuIGV4cHJlc3Npb24gaW4gamF2YXNjcmlwdFxuXHQgICAgICAgIC8vIGxpa2UgKHgsIHksIHopIHJldHVybnMgdGhlIGxhc3QgdmFsdWUsIGFuZCB4IGFuZCB5IGNhbiBiZVxuXHQgICAgICAgIC8vIGFueXRoaW5nXG5cdCAgICAgICAgdGhpcy5lbWl0KCcobGluZW5vID0gJyArIG5vZGUubGluZW5vICtcblx0ICAgICAgICAgICAgICAgICAgJywgY29sbm8gPSAnICsgbm9kZS5jb2xubyArICcsICcpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0KCdydW50aW1lLmNhbGxXcmFwKCcpO1xuXHQgICAgICAgIC8vIENvbXBpbGUgaXQgYXMgbm9ybWFsLlxuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKG5vZGUubmFtZSwgZnJhbWUpO1xuXG5cdCAgICAgICAgLy8gT3V0cHV0IHRoZSBuYW1lIG9mIHdoYXQgd2UncmUgY2FsbGluZyBzbyB3ZSBjYW4gZ2V0IGZyaWVuZGx5IGVycm9yc1xuXHQgICAgICAgIC8vIGlmIHRoZSBsb29rdXAgZmFpbHMuXG5cdCAgICAgICAgdGhpcy5lbWl0KCcsIFwiJyArIHRoaXMuX2dldE5vZGVOYW1lKG5vZGUubmFtZSkucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpICsgJ1wiLCBjb250ZXh0LCAnKTtcblxuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVBZ2dyZWdhdGUobm9kZS5hcmdzLCBmcmFtZSwgJ1snLCAnXSknKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdCgnKScpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUZpbHRlcjogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB2YXIgbmFtZSA9IG5vZGUubmFtZTtcblx0ICAgICAgICB0aGlzLmFzc2VydFR5cGUobmFtZSwgbm9kZXMuU3ltYm9sKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJ2Vudi5nZXRGaWx0ZXIoXCInICsgbmFtZS52YWx1ZSArICdcIikuY2FsbChjb250ZXh0LCAnKTtcblx0ICAgICAgICB0aGlzLl9jb21waWxlQWdncmVnYXRlKG5vZGUuYXJncywgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnKScpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUZpbHRlckFzeW5jOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHZhciBuYW1lID0gbm9kZS5uYW1lO1xuXHQgICAgICAgIHRoaXMuYXNzZXJ0VHlwZShuYW1lLCBub2Rlcy5TeW1ib2wpO1xuXG5cdCAgICAgICAgdmFyIHN5bWJvbCA9IG5vZGUuc3ltYm9sLnZhbHVlO1xuXHQgICAgICAgIGZyYW1lLnNldChzeW1ib2wsIHN5bWJvbCk7XG5cblx0ICAgICAgICB0aGlzLmVtaXQoJ2Vudi5nZXRGaWx0ZXIoXCInICsgbmFtZS52YWx1ZSArICdcIikuY2FsbChjb250ZXh0LCAnKTtcblx0ICAgICAgICB0aGlzLl9jb21waWxlQWdncmVnYXRlKG5vZGUuYXJncywgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJywgJyArIHRoaXMubWFrZUNhbGxiYWNrKHN5bWJvbCkpO1xuXG5cdCAgICAgICAgdGhpcy5hZGRTY29wZUxldmVsKCk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlS2V5d29yZEFyZ3M6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdmFyIG5hbWVzID0gW107XG5cblx0ICAgICAgICBsaWIuZWFjaChub2RlLmNoaWxkcmVuLCBmdW5jdGlvbihwYWlyKSB7XG5cdCAgICAgICAgICAgIG5hbWVzLnB1c2gocGFpci5rZXkudmFsdWUpO1xuXHQgICAgICAgIH0pO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0KCdydW50aW1lLm1ha2VLZXl3b3JkQXJncygnKTtcblx0ICAgICAgICB0aGlzLmNvbXBpbGVEaWN0KG5vZGUsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJyknKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVTZXQ6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdmFyIGlkcyA9IFtdO1xuXG5cdCAgICAgICAgLy8gTG9va3VwIHRoZSB2YXJpYWJsZSBuYW1lcyBmb3IgZWFjaCBpZGVudGlmaWVyIGFuZCBjcmVhdGVcblx0ICAgICAgICAvLyBuZXcgb25lcyBpZiBuZWNlc3Nhcnlcblx0ICAgICAgICBsaWIuZWFjaChub2RlLnRhcmdldHMsIGZ1bmN0aW9uKHRhcmdldCkge1xuXHQgICAgICAgICAgICB2YXIgbmFtZSA9IHRhcmdldC52YWx1ZTtcblx0ICAgICAgICAgICAgdmFyIGlkID0gZnJhbWUubG9va3VwKG5hbWUpO1xuXG5cdCAgICAgICAgICAgIGlmIChpZCA9PT0gbnVsbCB8fCBpZCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgICBpZCA9IHRoaXMudG1waWQoKTtcblxuXHQgICAgICAgICAgICAgICAgLy8gTm90ZTogVGhpcyByZWxpZXMgb24ganMgYWxsb3dpbmcgc2NvcGUgYWNyb3NzXG5cdCAgICAgICAgICAgICAgICAvLyBibG9ja3MsIGluIGNhc2UgdGhpcyBpcyBjcmVhdGVkIGluc2lkZSBhbiBgaWZgXG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgJyArIGlkICsgJzsnKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGlkcy5wdXNoKGlkKTtcblx0ICAgICAgICB9LCB0aGlzKTtcblxuXHQgICAgICAgIGlmIChub2RlLnZhbHVlKSB7XG5cdCAgICAgICAgICB0aGlzLmVtaXQoaWRzLmpvaW4oJyA9ICcpICsgJyA9ICcpO1xuXHQgICAgICAgICAgdGhpcy5fY29tcGlsZUV4cHJlc3Npb24obm9kZS52YWx1ZSwgZnJhbWUpO1xuXHQgICAgICAgICAgdGhpcy5lbWl0TGluZSgnOycpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgIHRoaXMuZW1pdChpZHMuam9pbignID0gJykgKyAnID0gJyk7XG5cdCAgICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5ib2R5LCBmcmFtZSk7XG5cdCAgICAgICAgICB0aGlzLmVtaXRMaW5lKCc7Jyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgbGliLmVhY2gobm9kZS50YXJnZXRzLCBmdW5jdGlvbih0YXJnZXQsIGkpIHtcblx0ICAgICAgICAgICAgdmFyIGlkID0gaWRzW2ldO1xuXHQgICAgICAgICAgICB2YXIgbmFtZSA9IHRhcmdldC52YWx1ZTtcblxuXHQgICAgICAgICAgICAvLyBXZSBhcmUgcnVubmluZyB0aGlzIGZvciBldmVyeSB2YXIsIGJ1dCBpdCdzIHZlcnlcblx0ICAgICAgICAgICAgLy8gdW5jb21tb24gdG8gYXNzaWduIHRvIG11bHRpcGxlIHZhcnMgYW55d2F5XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2ZyYW1lLnNldChcIicgKyBuYW1lICsgJ1wiLCAnICsgaWQgKyAnLCB0cnVlKTsnKTtcblxuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdpZihmcmFtZS50b3BMZXZlbCkgeycpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdjb250ZXh0LnNldFZhcmlhYmxlKFwiJyArIG5hbWUgKyAnXCIsICcgKyBpZCArICcpOycpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd9Jyk7XG5cblx0ICAgICAgICAgICAgaWYobmFtZS5jaGFyQXQoMCkgIT09ICdfJykge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnaWYoZnJhbWUudG9wTGV2ZWwpIHsnKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2NvbnRleHQuYWRkRXhwb3J0KFwiJyArIG5hbWUgKyAnXCIsICcgKyBpZCArICcpOycpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSwgdGhpcyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlSWY6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lLCBhc3luYykge1xuXHQgICAgICAgIHRoaXMuZW1pdCgnaWYoJyk7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUV4cHJlc3Npb24obm9kZS5jb25kLCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnKSB7Jyk7XG5cblx0ICAgICAgICB0aGlzLndpdGhTY29wZWRTeW50YXgoZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmJvZHksIGZyYW1lKTtcblxuXHQgICAgICAgICAgICBpZihhc3luYykge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdjYigpJyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIGlmKG5vZGUuZWxzZV8pIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfVxcbmVsc2UgeycpO1xuXG5cdCAgICAgICAgICAgIHRoaXMud2l0aFNjb3BlZFN5bnRheChmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmVsc2VfLCBmcmFtZSk7XG5cblx0ICAgICAgICAgICAgICAgIGlmKGFzeW5jKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdjYigpJyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH0gZWxzZSBpZihhc3luYykge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd9XFxuZWxzZSB7Jyk7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdCgnY2IoKScpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ30nKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVJZkFzeW5jOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuZW1pdCgnKGZ1bmN0aW9uKGNiKSB7Jyk7XG5cdCAgICAgICAgdGhpcy5jb21waWxlSWYobm9kZSwgZnJhbWUsIHRydWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnfSkoJyArIHRoaXMubWFrZUNhbGxiYWNrKCkpO1xuXHQgICAgICAgIHRoaXMuYWRkU2NvcGVMZXZlbCgpO1xuXHQgICAgfSxcblxuXHQgICAgZW1pdExvb3BCaW5kaW5nczogZnVuY3Rpb24obm9kZSwgYXJyLCBpLCBsZW4pIHtcblx0ICAgICAgICB2YXIgYmluZGluZ3MgPSB7XG5cdCAgICAgICAgICAgIGluZGV4OiBpICsgJyArIDEnLFxuXHQgICAgICAgICAgICBpbmRleDA6IGksXG5cdCAgICAgICAgICAgIHJldmluZGV4OiBsZW4gKyAnIC0gJyArIGksXG5cdCAgICAgICAgICAgIHJldmluZGV4MDogbGVuICsgJyAtICcgKyBpICsgJyAtIDEnLFxuXHQgICAgICAgICAgICBmaXJzdDogaSArICcgPT09IDAnLFxuXHQgICAgICAgICAgICBsYXN0OiBpICsgJyA9PT0gJyArIGxlbiArICcgLSAxJyxcblx0ICAgICAgICAgICAgbGVuZ3RoOiBsZW5cblx0ICAgICAgICB9O1xuXG5cdCAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBiaW5kaW5ncykge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZS5zZXQoXCJsb29wLicgKyBuYW1lICsgJ1wiLCAnICsgYmluZGluZ3NbbmFtZV0gKyAnKTsnKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlRm9yOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIC8vIFNvbWUgb2YgdGhpcyBjb2RlIGlzIHVnbHksIGJ1dCBpdCBrZWVwcyB0aGUgZ2VuZXJhdGVkIGNvZGVcblx0ICAgICAgICAvLyBhcyBmYXN0IGFzIHBvc3NpYmxlLiBGb3JBc3luYyBhbHNvIHNoYXJlcyBzb21lIG9mIHRoaXMsIGJ1dFxuXHQgICAgICAgIC8vIG5vdCBtdWNoLlxuXG5cdCAgICAgICAgdmFyIHY7XG5cdCAgICAgICAgdmFyIGkgPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgdmFyIGxlbiA9IHRoaXMudG1waWQoKTtcblx0ICAgICAgICB2YXIgYXJyID0gdGhpcy50bXBpZCgpO1xuXHQgICAgICAgIGZyYW1lID0gZnJhbWUucHVzaCgpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUgPSBmcmFtZS5wdXNoKCk7Jyk7XG5cblx0ICAgICAgICB0aGlzLmVtaXQoJ3ZhciAnICsgYXJyICsgJyA9ICcpO1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKG5vZGUuYXJyLCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnOycpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0KCdpZignICsgYXJyICsgJykgeycpO1xuXG5cdCAgICAgICAgLy8gSWYgbXVsdGlwbGUgbmFtZXMgYXJlIHBhc3NlZCwgd2UgbmVlZCB0byBiaW5kIHRoZW1cblx0ICAgICAgICAvLyBhcHByb3ByaWF0ZWx5XG5cdCAgICAgICAgaWYobm9kZS5uYW1lIGluc3RhbmNlb2Ygbm9kZXMuQXJyYXkpIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgndmFyICcgKyBpICsgJzsnKTtcblxuXHQgICAgICAgICAgICAvLyBUaGUgb2JqZWN0IGNvdWxkIGJlIGFuIGFycm95IG9yIG9iamVjdC4gTm90ZSB0aGF0IHRoZVxuXHQgICAgICAgICAgICAvLyBib2R5IG9mIHRoZSBsb29wIGlzIGR1cGxpY2F0ZWQgZm9yIGVhY2ggY29uZGl0aW9uLCBidXRcblx0ICAgICAgICAgICAgLy8gd2UgYXJlIG9wdGltaXppbmcgZm9yIHNwZWVkIG92ZXIgc2l6ZS5cblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnaWYocnVudGltZS5pc0FycmF5KCcgKyBhcnIgKyAnKSkgeycpOyB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgJyArIGxlbiArICcgPSAnICsgYXJyICsgJy5sZW5ndGg7Jyk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdmb3IoJyArIGkgKyAnPTA7ICcgKyBpICsgJyA8ICcgKyBhcnIgKyAnLmxlbmd0aDsgJ1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIGkgKyAnKyspIHsnKTtcblxuXHQgICAgICAgICAgICAgICAgLy8gQmluZCBlYWNoIGRlY2xhcmVkIHZhclxuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgdT0wOyB1IDwgbm9kZS5uYW1lLmNoaWxkcmVuLmxlbmd0aDsgdSsrKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHRpZCA9IHRoaXMudG1waWQoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgJyArIHRpZCArICcgPSAnICsgYXJyICsgJ1snICsgaSArICddWycgKyB1ICsgJ10nKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZS5zZXQoXCInICsgbm9kZS5uYW1lLmNoaWxkcmVuW3VdLnZhbHVlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICdcIiwgJyArIGFyciArICdbJyArIGkgKyAnXVsnICsgdSArICddJyArICcpOycpO1xuXHQgICAgICAgICAgICAgICAgICAgIGZyYW1lLnNldChub2RlLm5hbWUuY2hpbGRyZW5bdV0udmFsdWUsIHRpZCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExvb3BCaW5kaW5ncyhub2RlLCBhcnIsIGksIGxlbik7XG5cdCAgICAgICAgICAgICAgICB0aGlzLndpdGhTY29wZWRTeW50YXgoZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuYm9keSwgZnJhbWUpO1xuXHQgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd9Jyk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd9IGVsc2UgeycpOyB7XG5cdCAgICAgICAgICAgICAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIGtleS92YWx1ZXMgb2YgYW4gb2JqZWN0XG5cdCAgICAgICAgICAgICAgICB2YXIga2V5ID0gbm9kZS5uYW1lLmNoaWxkcmVuWzBdO1xuXHQgICAgICAgICAgICAgICAgdmFyIHZhbCA9IG5vZGUubmFtZS5jaGlsZHJlblsxXTtcblx0ICAgICAgICAgICAgICAgIHZhciBrID0gdGhpcy50bXBpZCgpO1xuXHQgICAgICAgICAgICAgICAgdiA9IHRoaXMudG1waWQoKTtcblx0ICAgICAgICAgICAgICAgIGZyYW1lLnNldChrZXkudmFsdWUsIGspO1xuXHQgICAgICAgICAgICAgICAgZnJhbWUuc2V0KHZhbC52YWx1ZSwgdik7XG5cblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoaSArICcgPSAtMTsnKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ3ZhciAnICsgbGVuICsgJyA9IHJ1bnRpbWUua2V5cygnICsgYXJyICsgJykubGVuZ3RoOycpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZm9yKHZhciAnICsgayArICcgaW4gJyArIGFyciArICcpIHsnKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoaSArICcrKzsnKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ3ZhciAnICsgdiArICcgPSAnICsgYXJyICsgJ1snICsgayArICddOycpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUuc2V0KFwiJyArIGtleS52YWx1ZSArICdcIiwgJyArIGsgKyAnKTsnKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2ZyYW1lLnNldChcIicgKyB2YWwudmFsdWUgKyAnXCIsICcgKyB2ICsgJyk7Jyk7XG5cblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExvb3BCaW5kaW5ncyhub2RlLCBhcnIsIGksIGxlbik7XG5cdCAgICAgICAgICAgICAgICB0aGlzLndpdGhTY29wZWRTeW50YXgoZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuYm9keSwgZnJhbWUpO1xuXHQgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd9Jyk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd9Jyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIHR5cGljYWwgYXJyYXkgaXRlcmF0aW9uXG5cdCAgICAgICAgICAgIHYgPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgICAgIGZyYW1lLnNldChub2RlLm5hbWUudmFsdWUsIHYpO1xuXG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ3ZhciAnICsgbGVuICsgJyA9ICcgKyBhcnIgKyAnLmxlbmd0aDsnKTtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZm9yKHZhciAnICsgaSArICc9MDsgJyArIGkgKyAnIDwgJyArIGFyciArICcubGVuZ3RoOyAnICtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICBpICsgJysrKSB7Jyk7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ3ZhciAnICsgdiArICcgPSAnICsgYXJyICsgJ1snICsgaSArICddOycpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZS5zZXQoXCInICsgbm9kZS5uYW1lLnZhbHVlICsgJ1wiLCAnICsgdiArICcpOycpO1xuXG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExvb3BCaW5kaW5ncyhub2RlLCBhcnIsIGksIGxlbik7XG5cblx0ICAgICAgICAgICAgdGhpcy53aXRoU2NvcGVkU3ludGF4KGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuYm9keSwgZnJhbWUpO1xuXHQgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd9Jyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgIGlmIChub2RlLmVsc2VfKSB7XG5cdCAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdpZiAoIScgKyBsZW4gKyAnKSB7Jyk7XG5cdCAgICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5lbHNlXywgZnJhbWUpO1xuXHQgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ2ZyYW1lID0gZnJhbWUucG9wKCk7Jyk7XG5cdCAgICB9LFxuXG5cdCAgICBfY29tcGlsZUFzeW5jTG9vcDogZnVuY3Rpb24obm9kZSwgZnJhbWUsIHBhcmFsbGVsKSB7XG5cdCAgICAgICAgLy8gVGhpcyBzaGFyZXMgc29tZSBjb2RlIHdpdGggdGhlIEZvciB0YWcsIGJ1dCBub3QgZW5vdWdoIHRvXG5cdCAgICAgICAgLy8gd29ycnkgYWJvdXQuIFRoaXMgaXRlcmF0ZXMgYWNyb3NzIGFuIG9iamVjdCBhc3luY2hyb25vdXNseSxcblx0ICAgICAgICAvLyBidXQgbm90IGluIHBhcmFsbGVsLlxuXG5cdCAgICAgICAgdmFyIGkgPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgdmFyIGxlbiA9IHRoaXMudG1waWQoKTtcblx0ICAgICAgICB2YXIgYXJyID0gdGhpcy50bXBpZCgpO1xuXHQgICAgICAgIHZhciBhc3luY01ldGhvZCA9IHBhcmFsbGVsID8gJ2FzeW5jQWxsJyA6ICdhc3luY0VhY2gnO1xuXHQgICAgICAgIGZyYW1lID0gZnJhbWUucHVzaCgpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUgPSBmcmFtZS5wdXNoKCk7Jyk7XG5cblx0ICAgICAgICB0aGlzLmVtaXQoJ3ZhciAnICsgYXJyICsgJyA9ICcpO1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKG5vZGUuYXJyLCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnOycpO1xuXG5cdCAgICAgICAgaWYobm9kZS5uYW1lIGluc3RhbmNlb2Ygbm9kZXMuQXJyYXkpIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0KCdydW50aW1lLicgKyBhc3luY01ldGhvZCArICcoJyArIGFyciArICcsICcgK1xuXHQgICAgICAgICAgICAgICAgICAgICAgbm9kZS5uYW1lLmNoaWxkcmVuLmxlbmd0aCArICcsIGZ1bmN0aW9uKCcpO1xuXG5cdCAgICAgICAgICAgIGxpYi5lYWNoKG5vZGUubmFtZS5jaGlsZHJlbiwgZnVuY3Rpb24obmFtZSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0KG5hbWUudmFsdWUgKyAnLCcpO1xuXHQgICAgICAgICAgICB9LCB0aGlzKTtcblxuXHQgICAgICAgICAgICB0aGlzLmVtaXQoaSArICcsJyArIGxlbiArICcsbmV4dCkgeycpO1xuXG5cdCAgICAgICAgICAgIGxpYi5lYWNoKG5vZGUubmFtZS5jaGlsZHJlbiwgZnVuY3Rpb24obmFtZSkge1xuXHQgICAgICAgICAgICAgICAgdmFyIGlkID0gbmFtZS52YWx1ZTtcblx0ICAgICAgICAgICAgICAgIGZyYW1lLnNldChpZCwgaWQpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUuc2V0KFwiJyArIGlkICsgJ1wiLCAnICsgaWQgKyAnKTsnKTtcblx0ICAgICAgICAgICAgfSwgdGhpcyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB2YXIgaWQgPSBub2RlLm5hbWUudmFsdWU7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ3J1bnRpbWUuJyArIGFzeW5jTWV0aG9kICsgJygnICsgYXJyICsgJywgMSwgZnVuY3Rpb24oJyArIGlkICsgJywgJyArIGkgKyAnLCAnICsgbGVuICsgJyxuZXh0KSB7Jyk7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2ZyYW1lLnNldChcIicgKyBpZCArICdcIiwgJyArIGlkICsgJyk7Jyk7XG5cdCAgICAgICAgICAgIGZyYW1lLnNldChpZCwgaWQpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuZW1pdExvb3BCaW5kaW5ncyhub2RlLCBhcnIsIGksIGxlbik7XG5cblx0ICAgICAgICB0aGlzLndpdGhTY29wZWRTeW50YXgoZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgIHZhciBidWY7XG5cdCAgICAgICAgICAgIGlmKHBhcmFsbGVsKSB7XG5cdCAgICAgICAgICAgICAgICBidWYgPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnB1c2hCdWZmZXJJZChidWYpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuYm9keSwgZnJhbWUpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCduZXh0KCcgKyBpICsgKGJ1ZiA/ICcsJyArIGJ1ZiA6ICcnKSArICcpOycpO1xuXG5cdCAgICAgICAgICAgIGlmKHBhcmFsbGVsKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnBvcEJ1ZmZlcklkKCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfSwgJyArIHRoaXMubWFrZUNhbGxiYWNrKG91dHB1dCkpO1xuXHQgICAgICAgIHRoaXMuYWRkU2NvcGVMZXZlbCgpO1xuXG5cdCAgICAgICAgaWYocGFyYWxsZWwpIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSh0aGlzLmJ1ZmZlciArICcgKz0gJyArIG91dHB1dCArICc7Jyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKG5vZGUuZWxzZV8pIHtcblx0ICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2lmICghJyArIGFyciArICcubGVuZ3RoKSB7Jyk7XG5cdCAgICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5lbHNlXywgZnJhbWUpO1xuXHQgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ2ZyYW1lID0gZnJhbWUucG9wKCk7Jyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlQXN5bmNFYWNoOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVBc3luY0xvb3Aobm9kZSwgZnJhbWUpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUFzeW5jQWxsOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVBc3luY0xvb3Aobm9kZSwgZnJhbWUsIHRydWUpO1xuXHQgICAgfSxcblxuXHQgICAgX2NvbXBpbGVNYWNybzogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB2YXIgYXJncyA9IFtdO1xuXHQgICAgICAgIHZhciBrd2FyZ3MgPSBudWxsO1xuXHQgICAgICAgIHZhciBmdW5jSWQgPSAnbWFjcm9fJyArIHRoaXMudG1waWQoKTtcblx0ICAgICAgICB2YXIga2VlcEZyYW1lID0gKGZyYW1lICE9PSB1bmRlZmluZWQpO1xuXG5cdCAgICAgICAgLy8gVHlwZSBjaGVjayB0aGUgZGVmaW5pdGlvbiBvZiB0aGUgYXJnc1xuXHQgICAgICAgIGxpYi5lYWNoKG5vZGUuYXJncy5jaGlsZHJlbiwgZnVuY3Rpb24oYXJnLCBpKSB7XG5cdCAgICAgICAgICAgIGlmKGkgPT09IG5vZGUuYXJncy5jaGlsZHJlbi5sZW5ndGggLSAxICYmXG5cdCAgICAgICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIG5vZGVzLkRpY3QpIHtcblx0ICAgICAgICAgICAgICAgIGt3YXJncyA9IGFyZztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuYXNzZXJ0VHlwZShhcmcsIG5vZGVzLlN5bWJvbCk7XG5cdCAgICAgICAgICAgICAgICBhcmdzLnB1c2goYXJnKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sIHRoaXMpO1xuXG5cdCAgICAgICAgdmFyIHJlYWxOYW1lcyA9IGxpYi5tYXAoYXJncywgZnVuY3Rpb24obikgeyByZXR1cm4gJ2xfJyArIG4udmFsdWU7IH0pO1xuXHQgICAgICAgIHJlYWxOYW1lcy5wdXNoKCdrd2FyZ3MnKTtcblxuXHQgICAgICAgIC8vIFF1b3RlZCBhcmd1bWVudCBuYW1lc1xuXHQgICAgICAgIHZhciBhcmdOYW1lcyA9IGxpYi5tYXAoYXJncywgZnVuY3Rpb24obikgeyByZXR1cm4gJ1wiJyArIG4udmFsdWUgKyAnXCInOyB9KTtcblx0ICAgICAgICB2YXIga3dhcmdOYW1lcyA9IGxpYi5tYXAoKGt3YXJncyAmJiBrd2FyZ3MuY2hpbGRyZW4pIHx8IFtdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihuKSB7IHJldHVybiAnXCInICsgbi5rZXkudmFsdWUgKyAnXCInOyB9KTtcblxuXHQgICAgICAgIC8vIFdlIHBhc3MgYSBmdW5jdGlvbiB0byBtYWtlTWFjcm8gd2hpY2ggZGVzdHJ1Y3R1cmVzIHRoZVxuXHQgICAgICAgIC8vIGFyZ3VtZW50cyBzbyBzdXBwb3J0IHNldHRpbmcgcG9zaXRpb25hbCBhcmdzIHdpdGgga2V5d29yZHNcblx0ICAgICAgICAvLyBhcmdzIGFuZCBwYXNzaW5nIGtleXdvcmQgYXJncyBhcyBwb3NpdGlvbmFsIGFyZ3Ncblx0ICAgICAgICAvLyAoZXNzZW50aWFsbHkgZGVmYXVsdCB2YWx1ZXMpLiBTZWUgcnVudGltZS5qcy5cblx0ICAgICAgICBpZiAoa2VlcEZyYW1lKSB7XG5cdCAgICAgICAgICAgIGZyYW1lID0gZnJhbWUucHVzaCh0cnVlKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBmcmFtZSA9IG5ldyBGcmFtZSgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB0aGlzLmVtaXRMaW5lcyhcblx0ICAgICAgICAgICAgJ3ZhciAnICsgZnVuY0lkICsgJyA9IHJ1bnRpbWUubWFrZU1hY3JvKCcsXG5cdCAgICAgICAgICAgICdbJyArIGFyZ05hbWVzLmpvaW4oJywgJykgKyAnXSwgJyxcblx0ICAgICAgICAgICAgJ1snICsga3dhcmdOYW1lcy5qb2luKCcsICcpICsgJ10sICcsXG5cdCAgICAgICAgICAgICdmdW5jdGlvbiAoJyArIHJlYWxOYW1lcy5qb2luKCcsICcpICsgJykgeycsXG5cdCAgICAgICAgICAgICd2YXIgY2FsbGVyRnJhbWUgPSBmcmFtZTsnLFxuXHQgICAgICAgICAgICAnZnJhbWUgPSAnICsgKChrZWVwRnJhbWUpID8gJ2ZyYW1lLnB1c2godHJ1ZSk7JyA6ICduZXcgcnVudGltZS5GcmFtZSgpOycpLFxuXHQgICAgICAgICAgICAna3dhcmdzID0ga3dhcmdzIHx8IHt9OycsXG5cdCAgICAgICAgICAgICdpZiAoa3dhcmdzLmhhc093blByb3BlcnR5KFwiY2FsbGVyXCIpKSB7Jyxcblx0ICAgICAgICAgICAgJ2ZyYW1lLnNldChcImNhbGxlclwiLCBrd2FyZ3MuY2FsbGVyKTsgfSdcblx0ICAgICAgICApO1xuXG5cdCAgICAgICAgLy8gRXhwb3NlIHRoZSBhcmd1bWVudHMgdG8gdGhlIHRlbXBsYXRlLiBEb24ndCBuZWVkIHRvIHVzZVxuXHQgICAgICAgIC8vIHJhbmRvbSBuYW1lcyBiZWNhdXNlIHRoZSBmdW5jdGlvblxuXHQgICAgICAgIC8vIHdpbGwgY3JlYXRlIGEgbmV3IHJ1bi10aW1lIHNjb3BlIGZvciB1c1xuXHQgICAgICAgIGxpYi5lYWNoKGFyZ3MsIGZ1bmN0aW9uKGFyZykge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZS5zZXQoXCInICsgYXJnLnZhbHVlICsgJ1wiLCAnICtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAnbF8nICsgYXJnLnZhbHVlICsgJyk7Jyk7XG5cdCAgICAgICAgICAgIGZyYW1lLnNldChhcmcudmFsdWUsICdsXycgKyBhcmcudmFsdWUpO1xuXHQgICAgICAgIH0sIHRoaXMpO1xuXG5cdCAgICAgICAgLy8gRXhwb3NlIHRoZSBrZXl3b3JkIGFyZ3VtZW50c1xuXHQgICAgICAgIGlmKGt3YXJncykge1xuXHQgICAgICAgICAgICBsaWIuZWFjaChrd2FyZ3MuY2hpbGRyZW4sIGZ1bmN0aW9uKHBhaXIpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBuYW1lID0gcGFpci5rZXkudmFsdWU7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2ZyYW1lLnNldChcIicgKyBuYW1lICsgJ1wiLCAnICtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAna3dhcmdzLmhhc093blByb3BlcnR5KFwiJyArIG5hbWUgKyAnXCIpID8gJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgJ2t3YXJnc1tcIicgKyBuYW1lICsgJ1wiXSA6ICcpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5fY29tcGlsZUV4cHJlc3Npb24ocGFpci52YWx1ZSwgZnJhbWUpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnKTsnKTtcblx0ICAgICAgICAgICAgfSwgdGhpcyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIGJ1ZmZlcklkID0gdGhpcy50bXBpZCgpO1xuXHQgICAgICAgIHRoaXMucHVzaEJ1ZmZlcklkKGJ1ZmZlcklkKTtcblxuXHQgICAgICAgIHRoaXMud2l0aFNjb3BlZFN5bnRheChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5ib2R5LCBmcmFtZSk7XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZSA9ICcgKyAoKGtlZXBGcmFtZSkgPyAnZnJhbWUucG9wKCk7JyA6ICdjYWxsZXJGcmFtZTsnKSk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgncmV0dXJuIG5ldyBydW50aW1lLlNhZmVTdHJpbmcoJyArIGJ1ZmZlcklkICsgJyk7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfSk7Jyk7XG5cdCAgICAgICAgdGhpcy5wb3BCdWZmZXJJZCgpO1xuXG5cdCAgICAgICAgcmV0dXJuIGZ1bmNJZDtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVNYWNybzogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB2YXIgZnVuY0lkID0gdGhpcy5fY29tcGlsZU1hY3JvKG5vZGUpO1xuXG5cdCAgICAgICAgLy8gRXhwb3NlIHRoZSBtYWNybyB0byB0aGUgdGVtcGxhdGVzXG5cdCAgICAgICAgdmFyIG5hbWUgPSBub2RlLm5hbWUudmFsdWU7XG5cdCAgICAgICAgZnJhbWUuc2V0KG5hbWUsIGZ1bmNJZCk7XG5cblx0ICAgICAgICBpZihmcmFtZS5wYXJlbnQpIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUuc2V0KFwiJyArIG5hbWUgKyAnXCIsICcgKyBmdW5jSWQgKyAnKTsnKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIGlmKG5vZGUubmFtZS52YWx1ZS5jaGFyQXQoMCkgIT09ICdfJykge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnY29udGV4dC5hZGRFeHBvcnQoXCInICsgbmFtZSArICdcIik7Jyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnY29udGV4dC5zZXRWYXJpYWJsZShcIicgKyBuYW1lICsgJ1wiLCAnICsgZnVuY0lkICsgJyk7Jyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUNhbGxlcjogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICAvLyBiYXNpY2FsbHkgYW4gYW5vbnltb3VzIFwibWFjcm8gZXhwcmVzc2lvblwiXG5cdCAgICAgICAgdGhpcy5lbWl0KCcoZnVuY3Rpb24gKCl7Jyk7XG5cdCAgICAgICAgdmFyIGZ1bmNJZCA9IHRoaXMuX2NvbXBpbGVNYWNybyhub2RlLCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCdyZXR1cm4gJyArIGZ1bmNJZCArICc7fSkoKScpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUltcG9ydDogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB2YXIgaWQgPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgdmFyIHRhcmdldCA9IG5vZGUudGFyZ2V0LnZhbHVlO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0KCdlbnYuZ2V0VGVtcGxhdGUoJyk7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUV4cHJlc3Npb24obm9kZS50ZW1wbGF0ZSwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJywgZmFsc2UsICcrdGhpcy5fdGVtcGxhdGVOYW1lKCkrJywgZmFsc2UsICcgKyB0aGlzLm1ha2VDYWxsYmFjayhpZCkpO1xuXHQgICAgICAgIHRoaXMuYWRkU2NvcGVMZXZlbCgpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0TGluZShpZCArICcuZ2V0RXhwb3J0ZWQoJyArXG5cdCAgICAgICAgICAgIChub2RlLndpdGhDb250ZXh0ID8gJ2NvbnRleHQuZ2V0VmFyaWFibGVzKCksIGZyYW1lLCAnIDogJycpICtcblx0ICAgICAgICAgICAgdGhpcy5tYWtlQ2FsbGJhY2soaWQpKTtcblx0ICAgICAgICB0aGlzLmFkZFNjb3BlTGV2ZWwoKTtcblxuXHQgICAgICAgIGZyYW1lLnNldCh0YXJnZXQsIGlkKTtcblxuXHQgICAgICAgIGlmKGZyYW1lLnBhcmVudCkge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZS5zZXQoXCInICsgdGFyZ2V0ICsgJ1wiLCAnICsgaWQgKyAnKTsnKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2NvbnRleHQuc2V0VmFyaWFibGUoXCInICsgdGFyZ2V0ICsgJ1wiLCAnICsgaWQgKyAnKTsnKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlRnJvbUltcG9ydDogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB2YXIgaW1wb3J0ZWRJZCA9IHRoaXMudG1waWQoKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdCgnZW52LmdldFRlbXBsYXRlKCcpO1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKG5vZGUudGVtcGxhdGUsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCcsIGZhbHNlLCAnK3RoaXMuX3RlbXBsYXRlTmFtZSgpKycsIGZhbHNlLCAnICsgdGhpcy5tYWtlQ2FsbGJhY2soaW1wb3J0ZWRJZCkpO1xuXHQgICAgICAgIHRoaXMuYWRkU2NvcGVMZXZlbCgpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0TGluZShpbXBvcnRlZElkICsgJy5nZXRFeHBvcnRlZCgnICtcblx0ICAgICAgICAgICAgKG5vZGUud2l0aENvbnRleHQgPyAnY29udGV4dC5nZXRWYXJpYWJsZXMoKSwgZnJhbWUsICcgOiAnJykgK1xuXHQgICAgICAgICAgICB0aGlzLm1ha2VDYWxsYmFjayhpbXBvcnRlZElkKSk7XG5cdCAgICAgICAgdGhpcy5hZGRTY29wZUxldmVsKCk7XG5cblx0ICAgICAgICBsaWIuZWFjaChub2RlLm5hbWVzLmNoaWxkcmVuLCBmdW5jdGlvbihuYW1lTm9kZSkge1xuXHQgICAgICAgICAgICB2YXIgbmFtZTtcblx0ICAgICAgICAgICAgdmFyIGFsaWFzO1xuXHQgICAgICAgICAgICB2YXIgaWQgPSB0aGlzLnRtcGlkKCk7XG5cblx0ICAgICAgICAgICAgaWYobmFtZU5vZGUgaW5zdGFuY2VvZiBub2Rlcy5QYWlyKSB7XG5cdCAgICAgICAgICAgICAgICBuYW1lID0gbmFtZU5vZGUua2V5LnZhbHVlO1xuXHQgICAgICAgICAgICAgICAgYWxpYXMgPSBuYW1lTm9kZS52YWx1ZS52YWx1ZTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lTm9kZS52YWx1ZTtcblx0ICAgICAgICAgICAgICAgIGFsaWFzID0gbmFtZTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2lmKCcgKyBpbXBvcnRlZElkICsgJy5oYXNPd25Qcm9wZXJ0eShcIicgKyBuYW1lICsgJ1wiKSkgeycpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgJyArIGlkICsgJyA9ICcgKyBpbXBvcnRlZElkICsgJy4nICsgbmFtZSArICc7Jyk7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ30gZWxzZSB7Jyk7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2NiKG5ldyBFcnJvcihcImNhbm5vdCBpbXBvcnQgXFwnJyArIG5hbWUgKyAnXFwnXCIpKTsgcmV0dXJuOycpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd9Jyk7XG5cblx0ICAgICAgICAgICAgZnJhbWUuc2V0KGFsaWFzLCBpZCk7XG5cblx0ICAgICAgICAgICAgaWYoZnJhbWUucGFyZW50KSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZS5zZXQoXCInICsgYWxpYXMgKyAnXCIsICcgKyBpZCArICcpOycpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnY29udGV4dC5zZXRWYXJpYWJsZShcIicgKyBhbGlhcyArICdcIiwgJyArIGlkICsgJyk7Jyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9LCB0aGlzKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVCbG9jazogZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgIHZhciBpZCA9IHRoaXMudG1waWQoKTtcblxuXHQgICAgICAgIC8vIElmIHdlIGFyZSBleGVjdXRpbmcgb3V0c2lkZSBhIGJsb2NrIChjcmVhdGluZyBhIHRvcC1sZXZlbFxuXHQgICAgICAgIC8vIGJsb2NrKSwgd2UgcmVhbGx5IGRvbid0IHdhbnQgdG8gZXhlY3V0ZSBpdHMgY29kZSBiZWNhdXNlIGl0XG5cdCAgICAgICAgLy8gd2lsbCBleGVjdXRlIHR3aWNlOiBvbmNlIHdoZW4gdGhlIGNoaWxkIHRlbXBsYXRlIHJ1bnMgYW5kXG5cdCAgICAgICAgLy8gYWdhaW4gd2hlbiB0aGUgcGFyZW50IHRlbXBsYXRlIHJ1bnMuIE5vdGUgdGhhdCBibG9ja3Ncblx0ICAgICAgICAvLyB3aXRoaW4gYmxvY2tzIHdpbGwgKmFsd2F5cyogZXhlY3V0ZSBpbW1lZGlhdGVseSAqYW5kKlxuXHQgICAgICAgIC8vIHdoZXJldmVyIGVsc2UgdGhleSBhcmUgaW52b2tlZCAobGlrZSB1c2VkIGluIGEgcGFyZW50XG5cdCAgICAgICAgLy8gdGVtcGxhdGUpLiBUaGlzIG1heSBoYXZlIGJlaGF2aW9yYWwgZGlmZmVyZW5jZXMgZnJvbSBqaW5qYVxuXHQgICAgICAgIC8vIGJlY2F1c2UgYmxvY2tzIGNhbiBoYXZlIHNpZGUgZWZmZWN0cywgYnV0IGl0IHNlZW1zIGxpa2UgYVxuXHQgICAgICAgIC8vIHdhc3RlIG9mIHBlcmZvcm1hbmNlIHRvIGFsd2F5cyBleGVjdXRlIGh1Z2UgdG9wLWxldmVsXG5cdCAgICAgICAgLy8gYmxvY2tzIHR3aWNlXG5cdCAgICAgICAgaWYoIXRoaXMuaW5CbG9jaykge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQoJyhwYXJlbnRUZW1wbGF0ZSA/IGZ1bmN0aW9uKGUsIGMsIGYsIHIsIGNiKSB7IGNiKFwiXCIpOyB9IDogJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHRoaXMuZW1pdCgnY29udGV4dC5nZXRCbG9jayhcIicgKyBub2RlLm5hbWUudmFsdWUgKyAnXCIpJyk7XG5cdCAgICAgICAgaWYoIXRoaXMuaW5CbG9jaykge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQoJyknKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnKGVudiwgY29udGV4dCwgZnJhbWUsIHJ1bnRpbWUsICcgKyB0aGlzLm1ha2VDYWxsYmFjayhpZCkpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUodGhpcy5idWZmZXIgKyAnICs9ICcgKyBpZCArICc7Jyk7XG5cdCAgICAgICAgdGhpcy5hZGRTY29wZUxldmVsKCk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlU3VwZXI6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdmFyIG5hbWUgPSBub2RlLmJsb2NrTmFtZS52YWx1ZTtcblx0ICAgICAgICB2YXIgaWQgPSBub2RlLnN5bWJvbC52YWx1ZTtcblxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ2NvbnRleHQuZ2V0U3VwZXIoZW52LCAnICtcblx0ICAgICAgICAgICAgICAgICAgICAgICdcIicgKyBuYW1lICsgJ1wiLCAnICtcblx0ICAgICAgICAgICAgICAgICAgICAgICdiXycgKyBuYW1lICsgJywgJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAnZnJhbWUsIHJ1bnRpbWUsICcrXG5cdCAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ha2VDYWxsYmFjayhpZCkpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoaWQgKyAnID0gcnVudGltZS5tYXJrU2FmZSgnICsgaWQgKyAnKTsnKTtcblx0ICAgICAgICB0aGlzLmFkZFNjb3BlTGV2ZWwoKTtcblx0ICAgICAgICBmcmFtZS5zZXQoaWQsIGlkKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVFeHRlbmRzOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHZhciBrID0gdGhpcy50bXBpZCgpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0KCdlbnYuZ2V0VGVtcGxhdGUoJyk7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUV4cHJlc3Npb24obm9kZS50ZW1wbGF0ZSwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJywgdHJ1ZSwgJyt0aGlzLl90ZW1wbGF0ZU5hbWUoKSsnLCBmYWxzZSwgJyArIHRoaXMubWFrZUNhbGxiYWNrKCdfcGFyZW50VGVtcGxhdGUnKSk7XG5cblx0ICAgICAgICAvLyBleHRlbmRzIGlzIGEgZHluYW1pYyB0YWcgYW5kIGNhbiBvY2N1ciB3aXRoaW4gYSBibG9jayBsaWtlXG5cdCAgICAgICAgLy8gYGlmYCwgc28gaWYgdGhpcyBoYXBwZW5zIHdlIG5lZWQgdG8gY2FwdHVyZSB0aGUgcGFyZW50XG5cdCAgICAgICAgLy8gdGVtcGxhdGUgaW4gdGhlIHRvcC1sZXZlbCBzY29wZVxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3BhcmVudFRlbXBsYXRlID0gX3BhcmVudFRlbXBsYXRlJyk7XG5cblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdmb3IodmFyICcgKyBrICsgJyBpbiBwYXJlbnRUZW1wbGF0ZS5ibG9ja3MpIHsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdjb250ZXh0LmFkZEJsb2NrKCcgKyBrICtcblx0ICAgICAgICAgICAgICAgICAgICAgICcsIHBhcmVudFRlbXBsYXRlLmJsb2Nrc1snICsgayArICddKTsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd9Jyk7XG5cblx0ICAgICAgICB0aGlzLmFkZFNjb3BlTGV2ZWwoKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVJbmNsdWRlOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHZhciBpZCA9IHRoaXMudG1waWQoKTtcblx0ICAgICAgICB2YXIgaWQyID0gdGhpcy50bXBpZCgpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgndmFyIHRhc2tzID0gW107Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgndGFza3MucHVzaCgnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdmdW5jdGlvbihjYWxsYmFjaykgeycpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnZW52LmdldFRlbXBsYXRlKCcpO1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKG5vZGUudGVtcGxhdGUsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCcsIGZhbHNlLCAnK3RoaXMuX3RlbXBsYXRlTmFtZSgpKycsICcgKyBub2RlLmlnbm9yZU1pc3NpbmcgKyAnLCAnICsgdGhpcy5tYWtlQ2FsbGJhY2soaWQpKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdjYWxsYmFjayhudWxsLCcgKyBpZCArICcpO30pOycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ30pOycpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgndGFza3MucHVzaCgnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdmdW5jdGlvbih0ZW1wbGF0ZSwgY2FsbGJhY2speycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3RlbXBsYXRlLnJlbmRlcignICtcblx0ICAgICAgICAgICAgJ2NvbnRleHQuZ2V0VmFyaWFibGVzKCksIGZyYW1lLCAnICsgdGhpcy5tYWtlQ2FsbGJhY2soaWQyKSk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnY2FsbGJhY2sobnVsbCwnICsgaWQyICsgJyk7fSk7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfSk7Jyk7XG5cblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd0YXNrcy5wdXNoKCcpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ2Z1bmN0aW9uKHJlc3VsdCwgY2FsbGJhY2speycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUodGhpcy5idWZmZXIgKyAnICs9IHJlc3VsdDsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdjYWxsYmFjayhudWxsKTsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd9KTsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdlbnYud2F0ZXJmYWxsKHRhc2tzLCBmdW5jdGlvbigpeycpO1xuXHQgICAgICAgIHRoaXMuYWRkU2NvcGVMZXZlbCgpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZVRlbXBsYXRlRGF0YTogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLmNvbXBpbGVMaXRlcmFsKG5vZGUsIGZyYW1lKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVDYXB0dXJlOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIC8vIHdlIG5lZWQgdG8gdGVtcG9yYXJpbHkgb3ZlcnJpZGUgdGhlIGN1cnJlbnQgYnVmZmVyIGlkIGFzICdvdXRwdXQnXG5cdCAgICAgICAgLy8gc28gdGhlIHNldCBibG9jayB3cml0ZXMgdG8gdGhlIGNhcHR1cmUgb3V0cHV0IGluc3RlYWQgb2YgdGhlIGJ1ZmZlclxuXHQgICAgICAgIHZhciBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcblx0ICAgICAgICB0aGlzLmJ1ZmZlciA9ICdvdXRwdXQnO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJyhmdW5jdGlvbigpIHsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgb3V0cHV0ID0gXCJcIjsnKTtcblx0ICAgICAgICB0aGlzLndpdGhTY29wZWRTeW50YXgoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5ib2R5LCBmcmFtZSk7XG5cdCAgICAgICAgfSk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgncmV0dXJuIG91dHB1dDsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd9KSgpJyk7XG5cdCAgICAgICAgLy8gYW5kIG9mIGNvdXJzZSwgcmV2ZXJ0IGJhY2sgdG8gdGhlIG9sZCBidWZmZXIgaWRcblx0ICAgICAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVPdXRwdXQ6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcblx0ICAgICAgICBmb3IodmFyIGk9MCwgbD1jaGlsZHJlbi5sZW5ndGg7IGk8bDsgaSsrKSB7XG5cdCAgICAgICAgICAgIC8vIFRlbXBsYXRlRGF0YSBpcyBhIHNwZWNpYWwgY2FzZSBiZWNhdXNlIGl0IGlzIG5ldmVyXG5cdCAgICAgICAgICAgIC8vIGF1dG9lc2NhcGVkLCBzbyBzaW1wbHkgb3V0cHV0IGl0IGZvciBvcHRpbWl6YXRpb25cblx0ICAgICAgICAgICAgaWYoY2hpbGRyZW5baV0gaW5zdGFuY2VvZiBub2Rlcy5UZW1wbGF0ZURhdGEpIHtcblx0ICAgICAgICAgICAgICAgIGlmKGNoaWxkcmVuW2ldLnZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuYnVmZmVyICsgJyArPSAnKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBpbGVMaXRlcmFsKGNoaWxkcmVuW2ldLCBmcmFtZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnOycpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuYnVmZmVyICsgJyArPSBydW50aW1lLnN1cHByZXNzVmFsdWUoJyk7XG5cdCAgICAgICAgICAgICAgICBpZih0aGlzLnRocm93T25VbmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3J1bnRpbWUuZW5zdXJlRGVmaW5lZCgnKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIHRoaXMuY29tcGlsZShjaGlsZHJlbltpXSwgZnJhbWUpO1xuXHQgICAgICAgICAgICAgICAgaWYodGhpcy50aHJvd09uVW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCcsJyArIG5vZGUubGluZW5vICsgJywnICsgbm9kZS5jb2xubyArICcpJyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJywgZW52Lm9wdHMuYXV0b2VzY2FwZSk7XFxuJyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlUm9vdDogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICBpZihmcmFtZSkge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ2NvbXBpbGVSb290OiByb290IG5vZGUgY2FuXFwndCBoYXZlIGZyYW1lJyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgZnJhbWUgPSBuZXcgRnJhbWUoKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdEZ1bmNCZWdpbigncm9vdCcpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3ZhciBwYXJlbnRUZW1wbGF0ZSA9IG51bGw7Jyk7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUNoaWxkcmVuKG5vZGUsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdpZihwYXJlbnRUZW1wbGF0ZSkgeycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3BhcmVudFRlbXBsYXRlLnJvb3RSZW5kZXJGdW5jKGVudiwgY29udGV4dCwgZnJhbWUsIHJ1bnRpbWUsIGNiKTsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd9IGVsc2UgeycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ2NiKG51bGwsICcgKyB0aGlzLmJ1ZmZlciArJyk7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgIHRoaXMuZW1pdEZ1bmNFbmQodHJ1ZSk7XG5cblx0ICAgICAgICB0aGlzLmluQmxvY2sgPSB0cnVlO1xuXG5cdCAgICAgICAgdmFyIGJsb2NrTmFtZXMgPSBbXTtcblxuXHQgICAgICAgIHZhciBpLCBuYW1lLCBibG9jaywgYmxvY2tzID0gbm9kZS5maW5kQWxsKG5vZGVzLkJsb2NrKTtcblx0ICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2ldO1xuXHQgICAgICAgICAgICBuYW1lID0gYmxvY2submFtZS52YWx1ZTtcblxuXHQgICAgICAgICAgICBpZiAoYmxvY2tOYW1lcy5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuXHQgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCbG9jayBcIicgKyBuYW1lICsgJ1wiIGRlZmluZWQgbW9yZSB0aGFuIG9uY2UuJyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgYmxvY2tOYW1lcy5wdXNoKG5hbWUpO1xuXG5cdCAgICAgICAgICAgIHRoaXMuZW1pdEZ1bmNCZWdpbignYl8nICsgbmFtZSk7XG5cblx0ICAgICAgICAgICAgdmFyIHRtcEZyYW1lID0gbmV3IEZyYW1lKCk7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ3ZhciBmcmFtZSA9IGZyYW1lLnB1c2godHJ1ZSk7Jyk7XG5cdCAgICAgICAgICAgIHRoaXMuY29tcGlsZShibG9jay5ib2R5LCB0bXBGcmFtZSk7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdEZ1bmNFbmQoKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdyZXR1cm4geycpO1xuXHQgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG5cdCAgICAgICAgICAgIG5hbWUgPSAnYl8nICsgYmxvY2submFtZS52YWx1ZTtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZShuYW1lICsgJzogJyArIG5hbWUgKyAnLCcpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdyb290OiByb290XFxufTsnKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGU6IGZ1bmN0aW9uIChub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHZhciBfY29tcGlsZSA9IHRoaXNbJ2NvbXBpbGUnICsgbm9kZS50eXBlbmFtZV07XG5cdCAgICAgICAgaWYoX2NvbXBpbGUpIHtcblx0ICAgICAgICAgICAgX2NvbXBpbGUuY2FsbCh0aGlzLCBub2RlLCBmcmFtZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ2NvbXBpbGU6IENhbm5vdCBjb21waWxlIG5vZGU6ICcgKyBub2RlLnR5cGVuYW1lLFxuXHQgICAgICAgICAgICAgICAgICAgICAgbm9kZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBnZXRDb2RlOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5jb2RlYnVmLmpvaW4oJycpO1xuXHQgICAgfVxuXHR9KTtcblxuXHQvLyB2YXIgYyA9IG5ldyBDb21waWxlcigpO1xuXHQvLyB2YXIgc3JjID0gJ2hlbGxvIHslIGZpbHRlciB0aXRsZSAlfScgK1xuXHQvLyAgICAgJ0hlbGxvIG1hZGFtIGhvdyBhcmUgeW91JyArXG5cdC8vICAgICAneyUgZW5kZmlsdGVyICV9J1xuXHQvLyB2YXIgYXN0ID0gdHJhbnNmb3JtZXIudHJhbnNmb3JtKHBhcnNlci5wYXJzZShzcmMpKTtcblx0Ly8gbm9kZXMucHJpbnROb2Rlcyhhc3QpO1xuXHQvLyBjLmNvbXBpbGUoYXN0KTtcblx0Ly8gdmFyIHRtcGwgPSBjLmdldENvZGUoKTtcblx0Ly8gY29uc29sZS5sb2codG1wbCk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgICBjb21waWxlOiBmdW5jdGlvbihzcmMsIGFzeW5jRmlsdGVycywgZXh0ZW5zaW9ucywgbmFtZSwgb3B0cykge1xuXHQgICAgICAgIHZhciBjID0gbmV3IENvbXBpbGVyKG5hbWUsIG9wdHMudGhyb3dPblVuZGVmaW5lZCk7XG5cblx0ICAgICAgICAvLyBSdW4gdGhlIGV4dGVuc2lvbiBwcmVwcm9jZXNzb3JzIGFnYWluc3QgdGhlIHNvdXJjZS5cblx0ICAgICAgICBpZihleHRlbnNpb25zICYmIGV4dGVuc2lvbnMubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGV4dGVuc2lvbnMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIGlmKCdwcmVwcm9jZXNzJyBpbiBleHRlbnNpb25zW2ldKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgc3JjID0gZXh0ZW5zaW9uc1tpXS5wcmVwcm9jZXNzKHNyYywgbmFtZSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBjLmNvbXBpbGUodHJhbnNmb3JtZXIudHJhbnNmb3JtKFxuXHQgICAgICAgICAgICBwYXJzZXIucGFyc2Uoc3JjLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9ucyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMpLFxuXHQgICAgICAgICAgICBhc3luY0ZpbHRlcnMsXG5cdCAgICAgICAgICAgIG5hbWVcblx0ICAgICAgICApKTtcblx0ICAgICAgICByZXR1cm4gYy5nZXRDb2RlKCk7XG5cdCAgICB9LFxuXG5cdCAgICBDb21waWxlcjogQ29tcGlsZXJcblx0fTtcblxuXG4vKioqLyB9KSxcbi8qIDggKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGxleGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg5KTtcblx0dmFyIG5vZGVzID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMCk7XG5cdC8vIGpzaGludCAtVzA3OVxuXHR2YXIgT2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblx0dmFyIGxpYiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cblx0dmFyIFBhcnNlciA9IE9iamVjdC5leHRlbmQoe1xuXHQgICAgaW5pdDogZnVuY3Rpb24gKHRva2Vucykge1xuXHQgICAgICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xuXHQgICAgICAgIHRoaXMucGVla2VkID0gbnVsbDtcblx0ICAgICAgICB0aGlzLmJyZWFrT25CbG9ja3MgPSBudWxsO1xuXHQgICAgICAgIHRoaXMuZHJvcExlYWRpbmdXaGl0ZXNwYWNlID0gZmFsc2U7XG5cblx0ICAgICAgICB0aGlzLmV4dGVuc2lvbnMgPSBbXTtcblx0ICAgIH0sXG5cblx0ICAgIG5leHRUb2tlbjogZnVuY3Rpb24gKHdpdGhXaGl0ZXNwYWNlKSB7XG5cdCAgICAgICAgdmFyIHRvaztcblxuXHQgICAgICAgIGlmKHRoaXMucGVla2VkKSB7XG5cdCAgICAgICAgICAgIGlmKCF3aXRoV2hpdGVzcGFjZSAmJiB0aGlzLnBlZWtlZC50eXBlID09PSBsZXhlci5UT0tFTl9XSElURVNQQUNFKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnBlZWtlZCA9IG51bGw7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICB0b2sgPSB0aGlzLnBlZWtlZDtcblx0ICAgICAgICAgICAgICAgIHRoaXMucGVla2VkID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0b2s7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0b2sgPSB0aGlzLnRva2Vucy5uZXh0VG9rZW4oKTtcblxuXHQgICAgICAgIGlmKCF3aXRoV2hpdGVzcGFjZSkge1xuXHQgICAgICAgICAgICB3aGlsZSh0b2sgJiYgdG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX1dISVRFU1BBQ0UpIHtcblx0ICAgICAgICAgICAgICAgIHRvayA9IHRoaXMudG9rZW5zLm5leHRUb2tlbigpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHRvaztcblx0ICAgIH0sXG5cblx0ICAgIHBlZWtUb2tlbjogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHRoaXMucGVla2VkID0gdGhpcy5wZWVrZWQgfHwgdGhpcy5uZXh0VG9rZW4oKTtcblx0ICAgICAgICByZXR1cm4gdGhpcy5wZWVrZWQ7XG5cdCAgICB9LFxuXG5cdCAgICBwdXNoVG9rZW46IGZ1bmN0aW9uKHRvaykge1xuXHQgICAgICAgIGlmKHRoaXMucGVla2VkKSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncHVzaFRva2VuOiBjYW4gb25seSBwdXNoIG9uZSB0b2tlbiBvbiBiZXR3ZWVuIHJlYWRzJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHRoaXMucGVla2VkID0gdG9rO1xuXHQgICAgfSxcblxuXHQgICAgZmFpbDogZnVuY3Rpb24gKG1zZywgbGluZW5vLCBjb2xubykge1xuXHQgICAgICAgIGlmKChsaW5lbm8gPT09IHVuZGVmaW5lZCB8fCBjb2xubyA9PT0gdW5kZWZpbmVkKSAmJiB0aGlzLnBlZWtUb2tlbigpKSB7XG5cdCAgICAgICAgICAgIHZhciB0b2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgICAgICBsaW5lbm8gPSB0b2subGluZW5vO1xuXHQgICAgICAgICAgICBjb2xubyA9IHRvay5jb2xubztcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKGxpbmVubyAhPT0gdW5kZWZpbmVkKSBsaW5lbm8gKz0gMTtcblx0ICAgICAgICBpZiAoY29sbm8gIT09IHVuZGVmaW5lZCkgY29sbm8gKz0gMTtcblxuXHQgICAgICAgIHRocm93IG5ldyBsaWIuVGVtcGxhdGVFcnJvcihtc2csIGxpbmVubywgY29sbm8pO1xuXHQgICAgfSxcblxuXHQgICAgc2tpcDogZnVuY3Rpb24odHlwZSkge1xuXHQgICAgICAgIHZhciB0b2sgPSB0aGlzLm5leHRUb2tlbigpO1xuXHQgICAgICAgIGlmKCF0b2sgfHwgdG9rLnR5cGUgIT09IHR5cGUpIHtcblx0ICAgICAgICAgICAgdGhpcy5wdXNoVG9rZW4odG9rKTtcblx0ICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH0sXG5cblx0ICAgIGV4cGVjdDogZnVuY3Rpb24odHlwZSkge1xuXHQgICAgICAgIHZhciB0b2sgPSB0aGlzLm5leHRUb2tlbigpO1xuXHQgICAgICAgIGlmKHRvay50eXBlICE9PSB0eXBlKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgnZXhwZWN0ZWQgJyArIHR5cGUgKyAnLCBnb3QgJyArIHRvay50eXBlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgdG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgIHRvay5jb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiB0b2s7XG5cdCAgICB9LFxuXG5cdCAgICBza2lwVmFsdWU6IGZ1bmN0aW9uKHR5cGUsIHZhbCkge1xuXHQgICAgICAgIHZhciB0b2sgPSB0aGlzLm5leHRUb2tlbigpO1xuXHQgICAgICAgIGlmKCF0b2sgfHwgdG9rLnR5cGUgIT09IHR5cGUgfHwgdG9rLnZhbHVlICE9PSB2YWwpIHtcblx0ICAgICAgICAgICAgdGhpcy5wdXNoVG9rZW4odG9rKTtcblx0ICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgIH0sXG5cblx0ICAgIHNraXBTeW1ib2w6IGZ1bmN0aW9uKHZhbCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLnNraXBWYWx1ZShsZXhlci5UT0tFTl9TWU1CT0wsIHZhbCk7XG5cdCAgICB9LFxuXG5cdCAgICBhZHZhbmNlQWZ0ZXJCbG9ja0VuZDogZnVuY3Rpb24obmFtZSkge1xuXHQgICAgICAgIHZhciB0b2s7XG5cdCAgICAgICAgaWYoIW5hbWUpIHtcblx0ICAgICAgICAgICAgdG9rID0gdGhpcy5wZWVrVG9rZW4oKTtcblxuXHQgICAgICAgICAgICBpZighdG9rKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ3VuZXhwZWN0ZWQgZW5kIG9mIGZpbGUnKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGlmKHRvay50eXBlICE9PSBsZXhlci5UT0tFTl9TWU1CT0wpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZmFpbCgnYWR2YW5jZUFmdGVyQmxvY2tFbmQ6IGV4cGVjdGVkIHN5bWJvbCB0b2tlbiBvciAnICtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAnZXhwbGljaXQgbmFtZSB0byBiZSBwYXNzZWQnKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIG5hbWUgPSB0aGlzLm5leHRUb2tlbigpLnZhbHVlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRvayA9IHRoaXMubmV4dFRva2VuKCk7XG5cblx0ICAgICAgICBpZih0b2sgJiYgdG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX0JMT0NLX0VORCkge1xuXHQgICAgICAgICAgICBpZih0b2sudmFsdWUuY2hhckF0KDApID09PSAnLScpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZHJvcExlYWRpbmdXaGl0ZXNwYWNlID0gdHJ1ZTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdleHBlY3RlZCBibG9jayBlbmQgaW4gJyArIG5hbWUgKyAnIHN0YXRlbWVudCcpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiB0b2s7XG5cdCAgICB9LFxuXG5cdCAgICBhZHZhbmNlQWZ0ZXJWYXJpYWJsZUVuZDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHRvayA9IHRoaXMubmV4dFRva2VuKCk7XG5cblx0ICAgICAgICBpZih0b2sgJiYgdG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX1ZBUklBQkxFX0VORCkge1xuXHQgICAgICAgICAgICB0aGlzLmRyb3BMZWFkaW5nV2hpdGVzcGFjZSA9IHRvay52YWx1ZS5jaGFyQXQoXG5cdCAgICAgICAgICAgICAgICB0b2sudmFsdWUubGVuZ3RoIC0gdGhpcy50b2tlbnMudGFncy5WQVJJQUJMRV9FTkQubGVuZ3RoIC0gMVxuXHQgICAgICAgICAgICApID09PSAnLSc7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgdGhpcy5wdXNoVG9rZW4odG9rKTtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdleHBlY3RlZCB2YXJpYWJsZSBlbmQnKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUZvcjogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIGZvclRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgdmFyIG5vZGU7XG5cdCAgICAgICAgdmFyIGVuZEJsb2NrO1xuXG5cdCAgICAgICAgaWYodGhpcy5za2lwU3ltYm9sKCdmb3InKSkge1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLkZvcihmb3JUb2subGluZW5vLCBmb3JUb2suY29sbm8pO1xuXHQgICAgICAgICAgICBlbmRCbG9jayA9ICdlbmRmb3InO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKHRoaXMuc2tpcFN5bWJvbCgnYXN5bmNFYWNoJykpIHtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5Bc3luY0VhY2goZm9yVG9rLmxpbmVubywgZm9yVG9rLmNvbG5vKTtcblx0ICAgICAgICAgICAgZW5kQmxvY2sgPSAnZW5kZWFjaCc7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYodGhpcy5za2lwU3ltYm9sKCdhc3luY0FsbCcpKSB7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuQXN5bmNBbGwoZm9yVG9rLmxpbmVubywgZm9yVG9rLmNvbG5vKTtcblx0ICAgICAgICAgICAgZW5kQmxvY2sgPSAnZW5kYWxsJztcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VGb3I6IGV4cGVjdGVkIGZvcntBc3luY30nLCBmb3JUb2subGluZW5vLCBmb3JUb2suY29sbm8pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIG5vZGUubmFtZSA9IHRoaXMucGFyc2VQcmltYXJ5KCk7XG5cblx0ICAgICAgICBpZighKG5vZGUubmFtZSBpbnN0YW5jZW9mIG5vZGVzLlN5bWJvbCkpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUZvcjogdmFyaWFibGUgbmFtZSBleHBlY3RlZCBmb3IgbG9vcCcpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciB0eXBlID0gdGhpcy5wZWVrVG9rZW4oKS50eXBlO1xuXHQgICAgICAgIGlmKHR5cGUgPT09IGxleGVyLlRPS0VOX0NPTU1BKSB7XG5cdCAgICAgICAgICAgIC8vIGtleS92YWx1ZSBpdGVyYXRpb25cblx0ICAgICAgICAgICAgdmFyIGtleSA9IG5vZGUubmFtZTtcblx0ICAgICAgICAgICAgbm9kZS5uYW1lID0gbmV3IG5vZGVzLkFycmF5KGtleS5saW5lbm8sIGtleS5jb2xubyk7XG5cdCAgICAgICAgICAgIG5vZGUubmFtZS5hZGRDaGlsZChrZXkpO1xuXG5cdCAgICAgICAgICAgIHdoaWxlKHRoaXMuc2tpcChsZXhlci5UT0tFTl9DT01NQSkpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBwcmltID0gdGhpcy5wYXJzZVByaW1hcnkoKTtcblx0ICAgICAgICAgICAgICAgIG5vZGUubmFtZS5hZGRDaGlsZChwcmltKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKCF0aGlzLnNraXBTeW1ib2woJ2luJykpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUZvcjogZXhwZWN0ZWQgXCJpblwiIGtleXdvcmQgZm9yIGxvb3AnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgZm9yVG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgIGZvclRvay5jb2xubyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgbm9kZS5hcnIgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXHQgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQoZm9yVG9rLnZhbHVlKTtcblxuXHQgICAgICAgIG5vZGUuYm9keSA9IHRoaXMucGFyc2VVbnRpbEJsb2NrcyhlbmRCbG9jaywgJ2Vsc2UnKTtcblxuXHQgICAgICAgIGlmKHRoaXMuc2tpcFN5bWJvbCgnZWxzZScpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQoJ2Vsc2UnKTtcblx0ICAgICAgICAgICAgbm9kZS5lbHNlXyA9IHRoaXMucGFyc2VVbnRpbEJsb2NrcyhlbmRCbG9jayk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZCgpO1xuXG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZU1hY3JvOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgbWFjcm9Ub2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIGlmKCF0aGlzLnNraXBTeW1ib2woJ21hY3JvJykpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdleHBlY3RlZCBtYWNybycpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBuYW1lID0gdGhpcy5wYXJzZVByaW1hcnkodHJ1ZSk7XG5cdCAgICAgICAgdmFyIGFyZ3MgPSB0aGlzLnBhcnNlU2lnbmF0dXJlKCk7XG5cdCAgICAgICAgdmFyIG5vZGUgPSBuZXcgbm9kZXMuTWFjcm8obWFjcm9Ub2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hY3JvVG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJncyk7XG5cblx0ICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKG1hY3JvVG9rLnZhbHVlKTtcblx0ICAgICAgICBub2RlLmJvZHkgPSB0aGlzLnBhcnNlVW50aWxCbG9ja3MoJ2VuZG1hY3JvJyk7XG5cdCAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZCgpO1xuXG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUNhbGw6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIC8vIGEgY2FsbCBibG9jayBpcyBwYXJzZWQgYXMgYSBub3JtYWwgRnVuQ2FsbCwgYnV0IHdpdGggYW4gYWRkZWRcblx0ICAgICAgICAvLyAnY2FsbGVyJyBrd2FyZyB3aGljaCBpcyBhIENhbGxlciBub2RlLlxuXHQgICAgICAgIHZhciBjYWxsVG9rID0gdGhpcy5wZWVrVG9rZW4oKTtcblx0ICAgICAgICBpZighdGhpcy5za2lwU3ltYm9sKCdjYWxsJykpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdleHBlY3RlZCBjYWxsJyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIGNhbGxlckFyZ3MgPSB0aGlzLnBhcnNlU2lnbmF0dXJlKHRydWUpIHx8IG5ldyBub2Rlcy5Ob2RlTGlzdCgpO1xuXHQgICAgICAgIHZhciBtYWNyb0NhbGwgPSB0aGlzLnBhcnNlUHJpbWFyeSgpO1xuXG5cdCAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZChjYWxsVG9rLnZhbHVlKTtcblx0ICAgICAgICB2YXIgYm9keSA9IHRoaXMucGFyc2VVbnRpbEJsb2NrcygnZW5kY2FsbCcpO1xuXHQgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQoKTtcblxuXHQgICAgICAgIHZhciBjYWxsZXJOYW1lID0gbmV3IG5vZGVzLlN5bWJvbChjYWxsVG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFRvay5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhbGxlcicpO1xuXHQgICAgICAgIHZhciBjYWxsZXJOb2RlID0gbmV3IG5vZGVzLkNhbGxlcihjYWxsVG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFRvay5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGVyTmFtZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGVyQXJncyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keSk7XG5cblx0ICAgICAgICAvLyBhZGQgdGhlIGFkZGl0aW9uYWwgY2FsbGVyIGt3YXJnLCBhZGRpbmcga3dhcmdzIGlmIG5lY2Vzc2FyeVxuXHQgICAgICAgIHZhciBhcmdzID0gbWFjcm9DYWxsLmFyZ3MuY2hpbGRyZW47XG5cdCAgICAgICAgaWYgKCEoYXJnc1thcmdzLmxlbmd0aC0xXSBpbnN0YW5jZW9mIG5vZGVzLktleXdvcmRBcmdzKSkge1xuXHQgICAgICAgICAgYXJncy5wdXNoKG5ldyBub2Rlcy5LZXl3b3JkQXJncygpKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgdmFyIGt3YXJncyA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcblx0ICAgICAgICBrd2FyZ3MuYWRkQ2hpbGQobmV3IG5vZGVzLlBhaXIoY2FsbFRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxUb2suY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxlck5hbWUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxlck5vZGUpKTtcblxuXHQgICAgICAgIHJldHVybiBuZXcgbm9kZXMuT3V0cHV0KGNhbGxUb2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxUb2suY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW21hY3JvQ2FsbF0pO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VXaXRoQ29udGV4dDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cblx0ICAgICAgICB2YXIgd2l0aENvbnRleHQgPSBudWxsO1xuXG5cdCAgICAgICAgaWYodGhpcy5za2lwU3ltYm9sKCd3aXRoJykpIHtcblx0ICAgICAgICAgICAgd2l0aENvbnRleHQgPSB0cnVlO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKHRoaXMuc2tpcFN5bWJvbCgnd2l0aG91dCcpKSB7XG5cdCAgICAgICAgICAgIHdpdGhDb250ZXh0ID0gZmFsc2U7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYod2l0aENvbnRleHQgIT09IG51bGwpIHtcblx0ICAgICAgICAgICAgaWYoIXRoaXMuc2tpcFN5bWJvbCgnY29udGV4dCcpKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlRnJvbTogZXhwZWN0ZWQgY29udGV4dCBhZnRlciB3aXRoL3dpdGhvdXQnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvay5jb2xubyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gd2l0aENvbnRleHQ7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUltcG9ydDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIGltcG9ydFRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgaWYoIXRoaXMuc2tpcFN5bWJvbCgnaW1wb3J0JykpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUltcG9ydDogZXhwZWN0ZWQgaW1wb3J0Jyxcblx0ICAgICAgICAgICAgICAgICAgICAgIGltcG9ydFRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRUb2suY29sbm8pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG5cblx0ICAgICAgICBpZighdGhpcy5za2lwU3ltYm9sKCdhcycpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VJbXBvcnQ6IGV4cGVjdGVkIFwiYXNcIiBrZXl3b3JkJyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydFRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRUb2suY29sbm8pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXG5cdCAgICAgICAgdmFyIHdpdGhDb250ZXh0ID0gdGhpcy5wYXJzZVdpdGhDb250ZXh0KCk7XG5cblx0ICAgICAgICB2YXIgbm9kZSA9IG5ldyBub2Rlcy5JbXBvcnQoaW1wb3J0VG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0VG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoQ29udGV4dCk7XG5cblx0ICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKGltcG9ydFRvay52YWx1ZSk7XG5cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlRnJvbTogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIGZyb21Ub2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIGlmKCF0aGlzLnNraXBTeW1ib2woJ2Zyb20nKSkge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlRnJvbTogZXhwZWN0ZWQgZnJvbScpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG5cblx0ICAgICAgICBpZighdGhpcy5za2lwU3ltYm9sKCdpbXBvcnQnKSkge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlRnJvbTogZXhwZWN0ZWQgaW1wb3J0Jyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21Ub2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbVRvay5jb2xubyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIG5hbWVzID0gbmV3IG5vZGVzLk5vZGVMaXN0KCksXG5cdCAgICAgICAgICAgIHdpdGhDb250ZXh0O1xuXG5cdCAgICAgICAgd2hpbGUoMSkge1xuXHQgICAgICAgICAgICB2YXIgbmV4dFRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgICAgIGlmKG5leHRUb2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fQkxPQ0tfRU5EKSB7XG5cdCAgICAgICAgICAgICAgICBpZighbmFtZXMuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUZyb206IEV4cGVjdGVkIGF0IGxlYXN0IG9uZSBpbXBvcnQgbmFtZScsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21Ub2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tVG9rLmNvbG5vKTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gU2luY2Ugd2UgYXJlIG1hbnVhbGx5IGFkdmFuY2luZyBwYXN0IHRoZSBibG9jayBlbmQsXG5cdCAgICAgICAgICAgICAgICAvLyBuZWVkIHRvIGtlZXAgdHJhY2sgb2Ygd2hpdGVzcGFjZSBjb250cm9sIChub3JtYWxseVxuXHQgICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBkb25lIGluIGBhZHZhbmNlQWZ0ZXJCbG9ja0VuZGBcblx0ICAgICAgICAgICAgICAgIGlmKG5leHRUb2sudmFsdWUuY2hhckF0KDApID09PSAnLScpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmRyb3BMZWFkaW5nV2hpdGVzcGFjZSA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGlmKG5hbWVzLmNoaWxkcmVuLmxlbmd0aCA+IDAgJiYgIXRoaXMuc2tpcChsZXhlci5UT0tFTl9DT01NQSkpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VGcm9tOiBleHBlY3RlZCBjb21tYScsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbVRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbVRvay5jb2xubyk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMucGFyc2VQcmltYXJ5KCk7XG5cdCAgICAgICAgICAgIGlmKG5hbWUudmFsdWUuY2hhckF0KDApID09PSAnXycpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VGcm9tOiBuYW1lcyBzdGFydGluZyB3aXRoIGFuIHVuZGVyc2NvcmUgJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Nhbm5vdCBiZSBpbXBvcnRlZCcsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS5jb2xubyk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBpZih0aGlzLnNraXBTeW1ib2woJ2FzJykpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBhbGlhcyA9IHRoaXMucGFyc2VQcmltYXJ5KCk7XG5cdCAgICAgICAgICAgICAgICBuYW1lcy5hZGRDaGlsZChuZXcgbm9kZXMuUGFpcihuYW1lLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUuY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpYXMpKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIG5hbWVzLmFkZENoaWxkKG5hbWUpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgd2l0aENvbnRleHQgPSB0aGlzLnBhcnNlV2l0aENvbnRleHQoKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gbmV3IG5vZGVzLkZyb21JbXBvcnQoZnJvbVRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21Ub2suY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lcyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aENvbnRleHQpO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VCbG9jazogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHRhZyA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgaWYoIXRoaXMuc2tpcFN5bWJvbCgnYmxvY2snKSkge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlQmxvY2s6IGV4cGVjdGVkIGJsb2NrJywgdGFnLmxpbmVubywgdGFnLmNvbG5vKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgbm9kZSA9IG5ldyBub2Rlcy5CbG9jayh0YWcubGluZW5vLCB0YWcuY29sbm8pO1xuXG5cdCAgICAgICAgbm9kZS5uYW1lID0gdGhpcy5wYXJzZVByaW1hcnkoKTtcblx0ICAgICAgICBpZighKG5vZGUubmFtZSBpbnN0YW5jZW9mIG5vZGVzLlN5bWJvbCkpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUJsb2NrOiB2YXJpYWJsZSBuYW1lIGV4cGVjdGVkJyxcblx0ICAgICAgICAgICAgICAgICAgICAgIHRhZy5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICB0YWcuY29sbm8pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQodGFnLnZhbHVlKTtcblxuXHQgICAgICAgIG5vZGUuYm9keSA9IHRoaXMucGFyc2VVbnRpbEJsb2NrcygnZW5kYmxvY2snKTtcblx0ICAgICAgICB0aGlzLnNraXBTeW1ib2woJ2VuZGJsb2NrJyk7XG5cdCAgICAgICAgdGhpcy5za2lwU3ltYm9sKG5vZGUubmFtZS52YWx1ZSk7XG5cblx0ICAgICAgICB2YXIgdG9rID0gdGhpcy5wZWVrVG9rZW4oKTtcblx0ICAgICAgICBpZighdG9rKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VCbG9jazogZXhwZWN0ZWQgZW5kYmxvY2ssIGdvdCBlbmQgb2YgZmlsZScpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQodG9rLnZhbHVlKTtcblxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VFeHRlbmRzOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgdGFnTmFtZSA9ICdleHRlbmRzJztcblx0ICAgICAgICB2YXIgdGFnID0gdGhpcy5wZWVrVG9rZW4oKTtcblx0ICAgICAgICBpZighdGhpcy5za2lwU3ltYm9sKHRhZ05hbWUpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VUZW1wbGF0ZVJlZjogZXhwZWN0ZWQgJysgdGFnTmFtZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIG5vZGUgPSBuZXcgbm9kZXMuRXh0ZW5kcyh0YWcubGluZW5vLCB0YWcuY29sbm8pO1xuXHQgICAgICAgIG5vZGUudGVtcGxhdGUgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXG5cdCAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZCh0YWcudmFsdWUpO1xuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VJbmNsdWRlOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgdGFnTmFtZSA9ICdpbmNsdWRlJztcblx0ICAgICAgICB2YXIgdGFnID0gdGhpcy5wZWVrVG9rZW4oKTtcblx0ICAgICAgICBpZighdGhpcy5za2lwU3ltYm9sKHRhZ05hbWUpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VJbmNsdWRlOiBleHBlY3RlZCAnKyB0YWdOYW1lKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgbm9kZSA9IG5ldyBub2Rlcy5JbmNsdWRlKHRhZy5saW5lbm8sIHRhZy5jb2xubyk7XG5cdCAgICAgICAgbm9kZS50ZW1wbGF0ZSA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG5cblx0ICAgICAgICBpZih0aGlzLnNraXBTeW1ib2woJ2lnbm9yZScpICYmIHRoaXMuc2tpcFN5bWJvbCgnbWlzc2luZycpKSB7XG5cdCAgICAgICAgICAgIG5vZGUuaWdub3JlTWlzc2luZyA9IHRydWU7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZCh0YWcudmFsdWUpO1xuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VJZjogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHRhZyA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgdmFyIG5vZGU7XG5cblx0ICAgICAgICBpZih0aGlzLnNraXBTeW1ib2woJ2lmJykgfHwgdGhpcy5za2lwU3ltYm9sKCdlbGlmJykgfHwgdGhpcy5za2lwU3ltYm9sKCdlbHNlaWYnKSkge1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLklmKHRhZy5saW5lbm8sIHRhZy5jb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYodGhpcy5za2lwU3ltYm9sKCdpZkFzeW5jJykpIHtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5JZkFzeW5jKHRhZy5saW5lbm8sIHRhZy5jb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlSWY6IGV4cGVjdGVkIGlmLCBlbGlmLCBvciBlbHNlaWYnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgdGFnLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgIHRhZy5jb2xubyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgbm9kZS5jb25kID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcblx0ICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKHRhZy52YWx1ZSk7XG5cblx0ICAgICAgICBub2RlLmJvZHkgPSB0aGlzLnBhcnNlVW50aWxCbG9ja3MoJ2VsaWYnLCAnZWxzZWlmJywgJ2Vsc2UnLCAnZW5kaWYnKTtcblx0ICAgICAgICB2YXIgdG9rID0gdGhpcy5wZWVrVG9rZW4oKTtcblxuXHQgICAgICAgIHN3aXRjaCh0b2sgJiYgdG9rLnZhbHVlKSB7XG5cdCAgICAgICAgY2FzZSAnZWxzZWlmJzpcblx0ICAgICAgICBjYXNlICdlbGlmJzpcblx0ICAgICAgICAgICAgbm9kZS5lbHNlXyA9IHRoaXMucGFyc2VJZigpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICBjYXNlICdlbHNlJzpcblx0ICAgICAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZCgpO1xuXHQgICAgICAgICAgICBub2RlLmVsc2VfID0gdGhpcy5wYXJzZVVudGlsQmxvY2tzKCdlbmRpZicpO1xuXHQgICAgICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKCk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIGNhc2UgJ2VuZGlmJzpcblx0ICAgICAgICAgICAgbm9kZS5lbHNlXyA9IG51bGw7XG5cdCAgICAgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQoKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgZGVmYXVsdDpcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUlmOiBleHBlY3RlZCBlbGlmLCBlbHNlLCBvciBlbmRpZiwgJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAnZ290IGVuZCBvZiBmaWxlJyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZVNldDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHRhZyA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgaWYoIXRoaXMuc2tpcFN5bWJvbCgnc2V0JykpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZVNldDogZXhwZWN0ZWQgc2V0JywgdGFnLmxpbmVubywgdGFnLmNvbG5vKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgbm9kZSA9IG5ldyBub2Rlcy5TZXQodGFnLmxpbmVubywgdGFnLmNvbG5vLCBbXSk7XG5cblx0ICAgICAgICB2YXIgdGFyZ2V0O1xuXHQgICAgICAgIHdoaWxlKCh0YXJnZXQgPSB0aGlzLnBhcnNlUHJpbWFyeSgpKSkge1xuXHQgICAgICAgICAgICBub2RlLnRhcmdldHMucHVzaCh0YXJnZXQpO1xuXG5cdCAgICAgICAgICAgIGlmKCF0aGlzLnNraXAobGV4ZXIuVE9LRU5fQ09NTUEpKSB7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKCF0aGlzLnNraXBWYWx1ZShsZXhlci5UT0tFTl9PUEVSQVRPUiwgJz0nKSkge1xuXHQgICAgICAgICAgICBpZiAoIXRoaXMuc2tpcChsZXhlci5UT0tFTl9CTE9DS19FTkQpKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlU2V0OiBleHBlY3RlZCA9IG9yIGJsb2NrIGVuZCBpbiBzZXQgdGFnJyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICB0YWcubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZy5jb2xubyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBub2RlLmJvZHkgPSBuZXcgbm9kZXMuQ2FwdHVyZShcblx0ICAgICAgICAgICAgICAgICAgICB0YWcubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgIHRhZy5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlVW50aWxCbG9ja3MoJ2VuZHNldCcpXG5cdCAgICAgICAgICAgICAgICApO1xuXHQgICAgICAgICAgICAgICAgbm9kZS52YWx1ZSA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIG5vZGUudmFsdWUgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXHQgICAgICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKHRhZy52YWx1ZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZVN0YXRlbWVudDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHZhciB0b2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIHZhciBub2RlO1xuXG5cdCAgICAgICAgaWYodG9rLnR5cGUgIT09IGxleGVyLlRPS0VOX1NZTUJPTCkge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ3RhZyBuYW1lIGV4cGVjdGVkJywgdG9rLmxpbmVubywgdG9rLmNvbG5vKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZih0aGlzLmJyZWFrT25CbG9ja3MgJiZcblx0ICAgICAgICAgICBsaWIuaW5kZXhPZih0aGlzLmJyZWFrT25CbG9ja3MsIHRvay52YWx1ZSkgIT09IC0xKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHN3aXRjaCh0b2sudmFsdWUpIHtcblx0ICAgICAgICBjYXNlICdyYXcnOiByZXR1cm4gdGhpcy5wYXJzZVJhdygpO1xuXHQgICAgICAgIGNhc2UgJ3ZlcmJhdGltJzogcmV0dXJuIHRoaXMucGFyc2VSYXcoJ3ZlcmJhdGltJyk7XG5cdCAgICAgICAgY2FzZSAnaWYnOlxuXHQgICAgICAgIGNhc2UgJ2lmQXN5bmMnOlxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUlmKCk7XG5cdCAgICAgICAgY2FzZSAnZm9yJzpcblx0ICAgICAgICBjYXNlICdhc3luY0VhY2gnOlxuXHQgICAgICAgIGNhc2UgJ2FzeW5jQWxsJzpcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VGb3IoKTtcblx0ICAgICAgICBjYXNlICdibG9jayc6IHJldHVybiB0aGlzLnBhcnNlQmxvY2soKTtcblx0ICAgICAgICBjYXNlICdleHRlbmRzJzogcmV0dXJuIHRoaXMucGFyc2VFeHRlbmRzKCk7XG5cdCAgICAgICAgY2FzZSAnaW5jbHVkZSc6IHJldHVybiB0aGlzLnBhcnNlSW5jbHVkZSgpO1xuXHQgICAgICAgIGNhc2UgJ3NldCc6IHJldHVybiB0aGlzLnBhcnNlU2V0KCk7XG5cdCAgICAgICAgY2FzZSAnbWFjcm8nOiByZXR1cm4gdGhpcy5wYXJzZU1hY3JvKCk7XG5cdCAgICAgICAgY2FzZSAnY2FsbCc6IHJldHVybiB0aGlzLnBhcnNlQ2FsbCgpO1xuXHQgICAgICAgIGNhc2UgJ2ltcG9ydCc6IHJldHVybiB0aGlzLnBhcnNlSW1wb3J0KCk7XG5cdCAgICAgICAgY2FzZSAnZnJvbSc6IHJldHVybiB0aGlzLnBhcnNlRnJvbSgpO1xuXHQgICAgICAgIGNhc2UgJ2ZpbHRlcic6IHJldHVybiB0aGlzLnBhcnNlRmlsdGVyU3RhdGVtZW50KCk7XG5cdCAgICAgICAgZGVmYXVsdDpcblx0ICAgICAgICAgICAgaWYgKHRoaXMuZXh0ZW5zaW9ucy5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5leHRlbnNpb25zLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGV4dCA9IHRoaXMuZXh0ZW5zaW9uc1tpXTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAobGliLmluZGV4T2YoZXh0LnRhZ3MgfHwgW10sIHRvay52YWx1ZSkgIT09IC0xKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBleHQucGFyc2UodGhpcywgbm9kZXMsIGxleGVyKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCd1bmtub3duIGJsb2NrIHRhZzogJyArIHRvay52YWx1ZSwgdG9rLmxpbmVubywgdG9rLmNvbG5vKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlUmF3OiBmdW5jdGlvbih0YWdOYW1lKSB7XG5cdCAgICAgICAgdGFnTmFtZSA9IHRhZ05hbWUgfHwgJ3Jhdyc7XG5cdCAgICAgICAgdmFyIGVuZFRhZ05hbWUgPSAnZW5kJyArIHRhZ05hbWU7XG5cdCAgICAgICAgLy8gTG9vayBmb3IgdXBjb21pbmcgcmF3IGJsb2NrcyAoaWdub3JlIGFsbCBvdGhlciBraW5kcyBvZiBibG9ja3MpXG5cdCAgICAgICAgdmFyIHJhd0Jsb2NrUmVnZXggPSBuZXcgUmVnRXhwKCcoW1xcXFxzXFxcXFNdKj8peyVcXFxccyooJyArIHRhZ05hbWUgKyAnfCcgKyBlbmRUYWdOYW1lICsgJylcXFxccyooPz0lfSklfScpO1xuXHQgICAgICAgIHZhciByYXdMZXZlbCA9IDE7XG5cdCAgICAgICAgdmFyIHN0ciA9ICcnO1xuXHQgICAgICAgIHZhciBtYXRjaGVzID0gbnVsbDtcblxuXHQgICAgICAgIC8vIFNraXAgb3BlbmluZyByYXcgdG9rZW5cblx0ICAgICAgICAvLyBLZWVwIHRoaXMgdG9rZW4gdG8gdHJhY2sgbGluZSBhbmQgY29sdW1uIG51bWJlcnNcblx0ICAgICAgICB2YXIgYmVndW4gPSB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKCk7XG5cblx0ICAgICAgICAvLyBFeGl0IHdoZW4gdGhlcmUncyBub3RoaW5nIHRvIG1hdGNoXG5cdCAgICAgICAgLy8gb3Igd2hlbiB3ZSd2ZSBmb3VuZCB0aGUgbWF0Y2hpbmcgXCJlbmRyYXdcIiBibG9ja1xuXHQgICAgICAgIHdoaWxlKChtYXRjaGVzID0gdGhpcy50b2tlbnMuX2V4dHJhY3RSZWdleChyYXdCbG9ja1JlZ2V4KSkgJiYgcmF3TGV2ZWwgPiAwKSB7XG5cdCAgICAgICAgICAgIHZhciBhbGwgPSBtYXRjaGVzWzBdO1xuXHQgICAgICAgICAgICB2YXIgcHJlID0gbWF0Y2hlc1sxXTtcblx0ICAgICAgICAgICAgdmFyIGJsb2NrTmFtZSA9IG1hdGNoZXNbMl07XG5cblx0ICAgICAgICAgICAgLy8gQWRqdXN0IHJhd2xldmVsXG5cdCAgICAgICAgICAgIGlmKGJsb2NrTmFtZSA9PT0gdGFnTmFtZSkge1xuXHQgICAgICAgICAgICAgICAgcmF3TGV2ZWwgKz0gMTtcblx0ICAgICAgICAgICAgfSBlbHNlIGlmKGJsb2NrTmFtZSA9PT0gZW5kVGFnTmFtZSkge1xuXHQgICAgICAgICAgICAgICAgcmF3TGV2ZWwgLT0gMTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIC8vIEFkZCB0byBzdHJcblx0ICAgICAgICAgICAgaWYocmF3TGV2ZWwgPT09IDApIHtcblx0ICAgICAgICAgICAgICAgIC8vIFdlIHdhbnQgdG8gZXhjbHVkZSB0aGUgbGFzdCBcImVuZHJhd1wiXG5cdCAgICAgICAgICAgICAgICBzdHIgKz0gcHJlO1xuXHQgICAgICAgICAgICAgICAgLy8gTW92ZSB0b2tlbml6ZXIgdG8gYmVnaW5uaW5nIG9mIGVuZHJhdyBibG9ja1xuXHQgICAgICAgICAgICAgICAgdGhpcy50b2tlbnMuYmFja04oYWxsLmxlbmd0aCAtIHByZS5sZW5ndGgpO1xuXHQgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgc3RyICs9IGFsbDtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBuZXcgbm9kZXMuT3V0cHV0KFxuXHQgICAgICAgICAgICBiZWd1bi5saW5lbm8sXG5cdCAgICAgICAgICAgIGJlZ3VuLmNvbG5vLFxuXHQgICAgICAgICAgICBbbmV3IG5vZGVzLlRlbXBsYXRlRGF0YShiZWd1bi5saW5lbm8sIGJlZ3VuLmNvbG5vLCBzdHIpXVxuXHQgICAgICAgICk7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZVBvc3RmaXg6IGZ1bmN0aW9uKG5vZGUpIHtcblx0ICAgICAgICB2YXIgbG9va3VwLCB0b2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXG5cdCAgICAgICAgd2hpbGUodG9rKSB7XG5cdCAgICAgICAgICAgIGlmKHRvay50eXBlID09PSBsZXhlci5UT0tFTl9MRUZUX1BBUkVOKSB7XG5cdCAgICAgICAgICAgICAgICAvLyBGdW5jdGlvbiBjYWxsXG5cdCAgICAgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLkZ1bkNhbGwodG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlU2lnbmF0dXJlKCkpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX0xFRlRfQlJBQ0tFVCkge1xuXHQgICAgICAgICAgICAgICAgLy8gUmVmZXJlbmNlXG5cdCAgICAgICAgICAgICAgICBsb29rdXAgPSB0aGlzLnBhcnNlQWdncmVnYXRlKCk7XG5cdCAgICAgICAgICAgICAgICBpZihsb29rdXAuY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbCgnaW52YWxpZCBpbmRleCcpO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICBub2RlID0gIG5ldyBub2Rlcy5Mb29rdXBWYWwodG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29rdXAuY2hpbGRyZW5bMF0pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX09QRVJBVE9SICYmIHRvay52YWx1ZSA9PT0gJy4nKSB7XG5cdCAgICAgICAgICAgICAgICAvLyBSZWZlcmVuY2Vcblx0ICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XG5cdCAgICAgICAgICAgICAgICB2YXIgdmFsID0gdGhpcy5uZXh0VG9rZW4oKTtcblxuXHQgICAgICAgICAgICAgICAgaWYodmFsLnR5cGUgIT09IGxleGVyLlRPS0VOX1NZTUJPTCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbCgnZXhwZWN0ZWQgbmFtZSBhcyBsb29rdXAgdmFsdWUsIGdvdCAnICsgdmFsLnZhbHVlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwuY29sbm8pO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBNYWtlIGEgbGl0ZXJhbCBzdHJpbmcgYmVjYXVzZSBpdCdzIG5vdCBhIHZhcmlhYmxlXG5cdCAgICAgICAgICAgICAgICAvLyByZWZlcmVuY2Vcblx0ICAgICAgICAgICAgICAgIGxvb2t1cCA9IG5ldyBub2Rlcy5MaXRlcmFsKHZhbC5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbC52YWx1ZSk7XG5cblx0ICAgICAgICAgICAgICAgIG5vZGUgPSAgbmV3IG5vZGVzLkxvb2t1cFZhbCh0b2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvay5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUV4cHJlc3Npb246IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5wYXJzZUlubGluZUlmKCk7XG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUlubGluZUlmOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGFyc2VPcigpO1xuXHQgICAgICAgIGlmKHRoaXMuc2tpcFN5bWJvbCgnaWYnKSkge1xuXHQgICAgICAgICAgICB2YXIgY29uZF9ub2RlID0gdGhpcy5wYXJzZU9yKCk7XG5cdCAgICAgICAgICAgIHZhciBib2R5X25vZGUgPSBub2RlO1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLklubGluZUlmKG5vZGUubGluZW5vLCBub2RlLmNvbG5vKTtcblx0ICAgICAgICAgICAgbm9kZS5ib2R5ID0gYm9keV9ub2RlO1xuXHQgICAgICAgICAgICBub2RlLmNvbmQgPSBjb25kX25vZGU7XG5cdCAgICAgICAgICAgIGlmKHRoaXMuc2tpcFN5bWJvbCgnZWxzZScpKSB7XG5cdCAgICAgICAgICAgICAgICBub2RlLmVsc2VfID0gdGhpcy5wYXJzZU9yKCk7XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBub2RlLmVsc2VfID0gbnVsbDtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VPcjogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBhcnNlQW5kKCk7XG5cdCAgICAgICAgd2hpbGUodGhpcy5za2lwU3ltYm9sKCdvcicpKSB7XG5cdCAgICAgICAgICAgIHZhciBub2RlMiA9IHRoaXMucGFyc2VBbmQoKTtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5Pcihub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlQW5kOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGFyc2VOb3QoKTtcblx0ICAgICAgICB3aGlsZSh0aGlzLnNraXBTeW1ib2woJ2FuZCcpKSB7XG5cdCAgICAgICAgICAgIHZhciBub2RlMiA9IHRoaXMucGFyc2VOb3QoKTtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5BbmQobm9kZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUyKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZU5vdDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgaWYodGhpcy5za2lwU3ltYm9sKCdub3QnKSkge1xuXHQgICAgICAgICAgICByZXR1cm4gbmV3IG5vZGVzLk5vdCh0b2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VOb3QoKSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiB0aGlzLnBhcnNlSW4oKTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlSW46IGZ1bmN0aW9uKCkge1xuXHQgICAgICB2YXIgbm9kZSA9IHRoaXMucGFyc2VDb21wYXJlKCk7XG5cdCAgICAgIHdoaWxlKDEpIHtcblx0ICAgICAgICAvLyBjaGVjayBpZiB0aGUgbmV4dCB0b2tlbiBpcyAnbm90J1xuXHQgICAgICAgIHZhciB0b2sgPSB0aGlzLm5leHRUb2tlbigpO1xuXHQgICAgICAgIGlmICghdG9rKSB7IGJyZWFrOyB9XG5cdCAgICAgICAgdmFyIGludmVydCA9IHRvay50eXBlID09PSBsZXhlci5UT0tFTl9TWU1CT0wgJiYgdG9rLnZhbHVlID09PSAnbm90Jztcblx0ICAgICAgICAvLyBpZiBpdCB3YXNuJ3QgJ25vdCcsIHB1dCBpdCBiYWNrXG5cdCAgICAgICAgaWYgKCFpbnZlcnQpIHsgdGhpcy5wdXNoVG9rZW4odG9rKTsgfVxuXHQgICAgICAgIGlmICh0aGlzLnNraXBTeW1ib2woJ2luJykpIHtcblx0ICAgICAgICAgIHZhciBub2RlMiA9IHRoaXMucGFyc2VDb21wYXJlKCk7XG5cdCAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLkluKG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlMik7XG5cdCAgICAgICAgICBpZiAoaW52ZXJ0KSB7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuTm90KG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAvLyBpZiB3ZSdkIGZvdW5kIGEgJ25vdCcgYnV0IHRoaXMgd2Fzbid0IGFuICdpbicsIHB1dCBiYWNrIHRoZSAnbm90J1xuXHQgICAgICAgICAgaWYgKGludmVydCkgeyB0aGlzLnB1c2hUb2tlbih0b2spOyB9XG5cdCAgICAgICAgICBicmVhaztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUNvbXBhcmU6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBjb21wYXJlT3BzID0gWyc9PScsICc9PT0nLCAnIT0nLCAnIT09JywgJzwnLCAnPicsICc8PScsICc+PSddO1xuXHQgICAgICAgIHZhciBleHByID0gdGhpcy5wYXJzZUNvbmNhdCgpO1xuXHQgICAgICAgIHZhciBvcHMgPSBbXTtcblxuXHQgICAgICAgIHdoaWxlKDEpIHtcblx0ICAgICAgICAgICAgdmFyIHRvayA9IHRoaXMubmV4dFRva2VuKCk7XG5cblx0ICAgICAgICAgICAgaWYoIXRvaykge1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSBpZihsaWIuaW5kZXhPZihjb21wYXJlT3BzLCB0b2sudmFsdWUpICE9PSAtMSkge1xuXHQgICAgICAgICAgICAgICAgb3BzLnB1c2gobmV3IG5vZGVzLkNvbXBhcmVPcGVyYW5kKHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VDb25jYXQoKSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2sudmFsdWUpKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMucHVzaFRva2VuKHRvayk7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKG9wcy5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIG5ldyBub2Rlcy5Db21wYXJlKG9wc1swXS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHNbMF0uY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHByLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BzKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHJldHVybiBleHByO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIC8vIGZpbmRzIHRoZSAnficgZm9yIHN0cmluZyBjb25jYXRlbmF0aW9uXG5cdCAgICBwYXJzZUNvbmNhdDogZnVuY3Rpb24oKXtcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGFyc2VBZGQoKTtcblx0ICAgICAgICB3aGlsZSh0aGlzLnNraXBWYWx1ZShsZXhlci5UT0tFTl9USUxERSwgJ34nKSkge1xuXHQgICAgICAgICAgICB2YXIgbm9kZTIgPSB0aGlzLnBhcnNlQWRkKCk7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuQ29uY2F0KG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlMik7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VBZGQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5wYXJzZVN1YigpO1xuXHQgICAgICAgIHdoaWxlKHRoaXMuc2tpcFZhbHVlKGxleGVyLlRPS0VOX09QRVJBVE9SLCAnKycpKSB7XG5cdCAgICAgICAgICAgIHZhciBub2RlMiA9IHRoaXMucGFyc2VTdWIoKTtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5BZGQobm9kZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUyKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZVN1YjogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBhcnNlTXVsKCk7XG5cdCAgICAgICAgd2hpbGUodGhpcy5za2lwVmFsdWUobGV4ZXIuVE9LRU5fT1BFUkFUT1IsICctJykpIHtcblx0ICAgICAgICAgICAgdmFyIG5vZGUyID0gdGhpcy5wYXJzZU11bCgpO1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLlN1Yihub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlTXVsOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGFyc2VEaXYoKTtcblx0ICAgICAgICB3aGlsZSh0aGlzLnNraXBWYWx1ZShsZXhlci5UT0tFTl9PUEVSQVRPUiwgJyonKSkge1xuXHQgICAgICAgICAgICB2YXIgbm9kZTIgPSB0aGlzLnBhcnNlRGl2KCk7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuTXVsKG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlMik7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VEaXY6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5wYXJzZUZsb29yRGl2KCk7XG5cdCAgICAgICAgd2hpbGUodGhpcy5za2lwVmFsdWUobGV4ZXIuVE9LRU5fT1BFUkFUT1IsICcvJykpIHtcblx0ICAgICAgICAgICAgdmFyIG5vZGUyID0gdGhpcy5wYXJzZUZsb29yRGl2KCk7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuRGl2KG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlMik7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VGbG9vckRpdjogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBhcnNlTW9kKCk7XG5cdCAgICAgICAgd2hpbGUodGhpcy5za2lwVmFsdWUobGV4ZXIuVE9LRU5fT1BFUkFUT1IsICcvLycpKSB7XG5cdCAgICAgICAgICAgIHZhciBub2RlMiA9IHRoaXMucGFyc2VNb2QoKTtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5GbG9vckRpdihub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlTW9kOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGFyc2VQb3coKTtcblx0ICAgICAgICB3aGlsZSh0aGlzLnNraXBWYWx1ZShsZXhlci5UT0tFTl9PUEVSQVRPUiwgJyUnKSkge1xuXHQgICAgICAgICAgICB2YXIgbm9kZTIgPSB0aGlzLnBhcnNlUG93KCk7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuTW9kKG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlMik7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VQb3c6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5wYXJzZVVuYXJ5KCk7XG5cdCAgICAgICAgd2hpbGUodGhpcy5za2lwVmFsdWUobGV4ZXIuVE9LRU5fT1BFUkFUT1IsICcqKicpKSB7XG5cdCAgICAgICAgICAgIHZhciBub2RlMiA9IHRoaXMucGFyc2VVbmFyeSgpO1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLlBvdyhub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlVW5hcnk6IGZ1bmN0aW9uKG5vRmlsdGVycykge1xuXHQgICAgICAgIHZhciB0b2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIHZhciBub2RlO1xuXG5cdCAgICAgICAgaWYodGhpcy5za2lwVmFsdWUobGV4ZXIuVE9LRU5fT1BFUkFUT1IsICctJykpIHtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5OZWcodG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlVW5hcnkodHJ1ZSkpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKHRoaXMuc2tpcFZhbHVlKGxleGVyLlRPS0VOX09QRVJBVE9SLCAnKycpKSB7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuUG9zKHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvay5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVVuYXJ5KHRydWUpKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIG5vZGUgPSB0aGlzLnBhcnNlUHJpbWFyeSgpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKCFub0ZpbHRlcnMpIHtcblx0ICAgICAgICAgICAgbm9kZSA9IHRoaXMucGFyc2VGaWx0ZXIobm9kZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZVByaW1hcnk6IGZ1bmN0aW9uIChub1Bvc3RmaXgpIHtcblx0ICAgICAgICB2YXIgdG9rID0gdGhpcy5uZXh0VG9rZW4oKTtcblx0ICAgICAgICB2YXIgdmFsO1xuXHQgICAgICAgIHZhciBub2RlID0gbnVsbDtcblxuXHQgICAgICAgIGlmKCF0b2spIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdleHBlY3RlZCBleHByZXNzaW9uLCBnb3QgZW5kIG9mIGZpbGUnKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZih0b2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fU1RSSU5HKSB7XG5cdCAgICAgICAgICAgIHZhbCA9IHRvay52YWx1ZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZih0b2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fSU5UKSB7XG5cdCAgICAgICAgICAgIHZhbCA9IHBhcnNlSW50KHRvay52YWx1ZSwgMTApO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKHRvay50eXBlID09PSBsZXhlci5UT0tFTl9GTE9BVCkge1xuXHQgICAgICAgICAgICB2YWwgPSBwYXJzZUZsb2F0KHRvay52YWx1ZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX0JPT0xFQU4pIHtcblx0ICAgICAgICAgICAgaWYodG9rLnZhbHVlID09PSAndHJ1ZScpIHtcblx0ICAgICAgICAgICAgICAgIHZhbCA9IHRydWU7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSBpZih0b2sudmFsdWUgPT09ICdmYWxzZScpIHtcblx0ICAgICAgICAgICAgICAgIHZhbCA9IGZhbHNlO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5mYWlsKCdpbnZhbGlkIGJvb2xlYW46ICcgKyB0b2sudmFsdWUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX05PTkUpIHtcblx0ICAgICAgICAgICAgdmFsID0gbnVsbDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZiAodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX1JFR0VYKSB7XG5cdCAgICAgICAgICAgIHZhbCA9IG5ldyBSZWdFeHAodG9rLnZhbHVlLmJvZHksIHRvay52YWx1ZS5mbGFncyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYodmFsICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5MaXRlcmFsKHRvay5saW5lbm8sIHRvay5jb2xubywgdmFsKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZih0b2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fU1lNQk9MKSB7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuU3ltYm9sKHRvay5saW5lbm8sIHRvay5jb2xubywgdG9rLnZhbHVlKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIC8vIFNlZSBpZiBpdCdzIGFuIGFnZ3JlZ2F0ZSB0eXBlLCB3ZSBuZWVkIHRvIHB1c2ggdGhlXG5cdCAgICAgICAgICAgIC8vIGN1cnJlbnQgZGVsaW1pdGVyIHRva2VuIGJhY2sgb25cblx0ICAgICAgICAgICAgdGhpcy5wdXNoVG9rZW4odG9rKTtcblx0ICAgICAgICAgICAgbm9kZSA9IHRoaXMucGFyc2VBZ2dyZWdhdGUoKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZighbm9Qb3N0Zml4KSB7XG5cdCAgICAgICAgICAgIG5vZGUgPSB0aGlzLnBhcnNlUG9zdGZpeChub2RlKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZihub2RlKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCd1bmV4cGVjdGVkIHRva2VuOiAnICsgdG9rLnZhbHVlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgdG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgIHRvay5jb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgcGFyc2VGaWx0ZXJOYW1lOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgdG9rID0gdGhpcy5leHBlY3QobGV4ZXIuVE9LRU5fU1lNQk9MKTtcblx0ICAgICAgICB2YXIgbmFtZSA9IHRvay52YWx1ZTtcblxuXHQgICAgICAgIHdoaWxlKHRoaXMuc2tpcFZhbHVlKGxleGVyLlRPS0VOX09QRVJBVE9SLCAnLicpKSB7XG5cdCAgICAgICAgICAgIG5hbWUgKz0gJy4nICsgdGhpcy5leHBlY3QobGV4ZXIuVE9LRU5fU1lNQk9MKS52YWx1ZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gbmV3IG5vZGVzLlN5bWJvbCh0b2subGluZW5vLCB0b2suY29sbm8sIG5hbWUpO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VGaWx0ZXJBcmdzOiBmdW5jdGlvbihub2RlKSB7XG5cdCAgICAgICAgaWYodGhpcy5wZWVrVG9rZW4oKS50eXBlID09PSBsZXhlci5UT0tFTl9MRUZUX1BBUkVOKSB7XG5cdCAgICAgICAgICAgIC8vIEdldCBhIEZ1bkNhbGwgbm9kZSBhbmQgYWRkIHRoZSBwYXJhbWV0ZXJzIHRvIHRoZVxuXHQgICAgICAgICAgICAvLyBmaWx0ZXJcblx0ICAgICAgICAgICAgdmFyIGNhbGwgPSB0aGlzLnBhcnNlUG9zdGZpeChub2RlKTtcblx0ICAgICAgICAgICAgcmV0dXJuIGNhbGwuYXJncy5jaGlsZHJlbjtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIFtdO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VGaWx0ZXI6IGZ1bmN0aW9uKG5vZGUpIHtcblx0ICAgICAgICB3aGlsZSh0aGlzLnNraXAobGV4ZXIuVE9LRU5fUElQRSkpIHtcblx0ICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLnBhcnNlRmlsdGVyTmFtZSgpO1xuXG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuRmlsdGVyKFxuXHQgICAgICAgICAgICAgICAgbmFtZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICBuYW1lLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgbmFtZSxcblx0ICAgICAgICAgICAgICAgIG5ldyBub2Rlcy5Ob2RlTGlzdChcblx0ICAgICAgICAgICAgICAgICAgICBuYW1lLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICBuYW1lLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgIFtub2RlXS5jb25jYXQodGhpcy5wYXJzZUZpbHRlckFyZ3Mobm9kZSkpXG5cdCAgICAgICAgICAgICAgICApXG5cdCAgICAgICAgICAgICk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUZpbHRlclN0YXRlbWVudDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIGZpbHRlclRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgaWYoIXRoaXMuc2tpcFN5bWJvbCgnZmlsdGVyJykpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUZpbHRlclN0YXRlbWVudDogZXhwZWN0ZWQgZmlsdGVyJyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIG5hbWUgPSB0aGlzLnBhcnNlRmlsdGVyTmFtZSgpO1xuXHQgICAgICAgIHZhciBhcmdzID0gdGhpcy5wYXJzZUZpbHRlckFyZ3MobmFtZSk7XG5cblx0ICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKGZpbHRlclRvay52YWx1ZSk7XG5cdCAgICAgICAgdmFyIGJvZHkgPSBuZXcgbm9kZXMuQ2FwdHVyZShcblx0ICAgICAgICAgICAgbmFtZS5saW5lbm8sXG5cdCAgICAgICAgICAgIG5hbWUuY29sbm8sXG5cdCAgICAgICAgICAgIHRoaXMucGFyc2VVbnRpbEJsb2NrcygnZW5kZmlsdGVyJylcblx0ICAgICAgICApO1xuXHQgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQoKTtcblxuXHQgICAgICAgIHZhciBub2RlID0gbmV3IG5vZGVzLkZpbHRlcihcblx0ICAgICAgICAgICAgbmFtZS5saW5lbm8sXG5cdCAgICAgICAgICAgIG5hbWUuY29sbm8sXG5cdCAgICAgICAgICAgIG5hbWUsXG5cdCAgICAgICAgICAgIG5ldyBub2Rlcy5Ob2RlTGlzdChcblx0ICAgICAgICAgICAgICAgIG5hbWUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgbmFtZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgIFtib2R5XS5jb25jYXQoYXJncylcblx0ICAgICAgICAgICAgKVxuXHQgICAgICAgICk7XG5cblx0ICAgICAgICByZXR1cm4gbmV3IG5vZGVzLk91dHB1dChcblx0ICAgICAgICAgICAgbmFtZS5saW5lbm8sXG5cdCAgICAgICAgICAgIG5hbWUuY29sbm8sXG5cdCAgICAgICAgICAgIFtub2RlXVxuXHQgICAgICAgICk7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUFnZ3JlZ2F0ZTogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHRvayA9IHRoaXMubmV4dFRva2VuKCk7XG5cdCAgICAgICAgdmFyIG5vZGU7XG5cblx0ICAgICAgICBzd2l0Y2godG9rLnR5cGUpIHtcblx0ICAgICAgICBjYXNlIGxleGVyLlRPS0VOX0xFRlRfUEFSRU46XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuR3JvdXAodG9rLmxpbmVubywgdG9rLmNvbG5vKTsgYnJlYWs7XG5cdCAgICAgICAgY2FzZSBsZXhlci5UT0tFTl9MRUZUX0JSQUNLRVQ6XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuQXJyYXkodG9rLmxpbmVubywgdG9rLmNvbG5vKTsgYnJlYWs7XG5cdCAgICAgICAgY2FzZSBsZXhlci5UT0tFTl9MRUZUX0NVUkxZOlxuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLkRpY3QodG9rLmxpbmVubywgdG9rLmNvbG5vKTsgYnJlYWs7XG5cdCAgICAgICAgZGVmYXVsdDpcblx0ICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgd2hpbGUoMSkge1xuXHQgICAgICAgICAgICB2YXIgdHlwZSA9IHRoaXMucGVla1Rva2VuKCkudHlwZTtcblx0ICAgICAgICAgICAgaWYodHlwZSA9PT0gbGV4ZXIuVE9LRU5fUklHSFRfUEFSRU4gfHxcblx0ICAgICAgICAgICAgICAgdHlwZSA9PT0gbGV4ZXIuVE9LRU5fUklHSFRfQlJBQ0tFVCB8fFxuXHQgICAgICAgICAgICAgICB0eXBlID09PSBsZXhlci5UT0tFTl9SSUdIVF9DVVJMWSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgaWYobm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdCAgICAgICAgICAgICAgICBpZighdGhpcy5za2lwKGxleGVyLlRPS0VOX0NPTU1BKSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VBZ2dyZWdhdGU6IGV4cGVjdGVkIGNvbW1hIGFmdGVyIGV4cHJlc3Npb24nLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgaWYobm9kZSBpbnN0YW5jZW9mIG5vZGVzLkRpY3QpIHtcblx0ICAgICAgICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGZvciBlcnJvcnNcblx0ICAgICAgICAgICAgICAgIHZhciBrZXkgPSB0aGlzLnBhcnNlUHJpbWFyeSgpO1xuXG5cdCAgICAgICAgICAgICAgICAvLyBXZSBleHBlY3QgYSBrZXkvdmFsdWUgcGFpciBmb3IgZGljdHMsIHNlcGFyYXRlZCBieSBhXG5cdCAgICAgICAgICAgICAgICAvLyBjb2xvblxuXHQgICAgICAgICAgICAgICAgaWYoIXRoaXMuc2tpcChsZXhlci5UT0tFTl9DT0xPTikpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlQWdncmVnYXRlOiBleHBlY3RlZCBjb2xvbiBhZnRlciBkaWN0IGtleScsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRvay5jb2xubyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGZvciBlcnJvcnNcblx0ICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG5cdCAgICAgICAgICAgICAgICBub2RlLmFkZENoaWxkKG5ldyBub2Rlcy5QYWlyKGtleS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSkpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgLy8gVE9ETzogY2hlY2sgZm9yIGVycm9yc1xuXHQgICAgICAgICAgICAgICAgdmFyIGV4cHIgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXHQgICAgICAgICAgICAgICAgbm9kZS5hZGRDaGlsZChleHByKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VTaWduYXR1cmU6IGZ1bmN0aW9uKHRvbGVyYW50LCBub1BhcmVucykge1xuXHQgICAgICAgIHZhciB0b2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIGlmKCFub1BhcmVucyAmJiB0b2sudHlwZSAhPT0gbGV4ZXIuVE9LRU5fTEVGVF9QQVJFTikge1xuXHQgICAgICAgICAgICBpZih0b2xlcmFudCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ2V4cGVjdGVkIGFyZ3VtZW50cycsIHRvay5saW5lbm8sIHRvay5jb2xubyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZih0b2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fTEVGVF9QQVJFTikge1xuXHQgICAgICAgICAgICB0b2sgPSB0aGlzLm5leHRUb2tlbigpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBhcmdzID0gbmV3IG5vZGVzLk5vZGVMaXN0KHRvay5saW5lbm8sIHRvay5jb2xubyk7XG5cdCAgICAgICAgdmFyIGt3YXJncyA9IG5ldyBub2Rlcy5LZXl3b3JkQXJncyh0b2subGluZW5vLCB0b2suY29sbm8pO1xuXHQgICAgICAgIHZhciBjaGVja0NvbW1hID0gZmFsc2U7XG5cblx0ICAgICAgICB3aGlsZSgxKSB7XG5cdCAgICAgICAgICAgIHRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgICAgIGlmKCFub1BhcmVucyAmJiB0b2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fUklHSFRfUEFSRU4pIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIGlmKG5vUGFyZW5zICYmIHRvay50eXBlID09PSBsZXhlci5UT0tFTl9CTE9DS19FTkQpIHtcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgaWYoY2hlY2tDb21tYSAmJiAhdGhpcy5za2lwKGxleGVyLlRPS0VOX0NPTU1BKSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZVNpZ25hdHVyZTogZXhwZWN0ZWQgY29tbWEgYWZ0ZXIgZXhwcmVzc2lvbicsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgdmFyIGFyZyA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG5cblx0ICAgICAgICAgICAgICAgIGlmKHRoaXMuc2tpcFZhbHVlKGxleGVyLlRPS0VOX09QRVJBVE9SLCAnPScpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAga3dhcmdzLmFkZENoaWxkKFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBuZXcgbm9kZXMuUGFpcihhcmcubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmcuY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZUV4cHJlc3Npb24oKSlcblx0ICAgICAgICAgICAgICAgICAgICApO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgYXJncy5hZGRDaGlsZChhcmcpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgY2hlY2tDb21tYSA9IHRydWU7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYoa3dhcmdzLmNoaWxkcmVuLmxlbmd0aCkge1xuXHQgICAgICAgICAgICBhcmdzLmFkZENoaWxkKGt3YXJncyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIGFyZ3M7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZVVudGlsQmxvY2tzOiBmdW5jdGlvbigvKiBibG9ja05hbWVzICovKSB7XG5cdCAgICAgICAgdmFyIHByZXYgPSB0aGlzLmJyZWFrT25CbG9ja3M7XG5cdCAgICAgICAgdGhpcy5icmVha09uQmxvY2tzID0gbGliLnRvQXJyYXkoYXJndW1lbnRzKTtcblxuXHQgICAgICAgIHZhciByZXQgPSB0aGlzLnBhcnNlKCk7XG5cblx0ICAgICAgICB0aGlzLmJyZWFrT25CbG9ja3MgPSBwcmV2O1xuXHQgICAgICAgIHJldHVybiByZXQ7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZU5vZGVzOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgdmFyIHRvaztcblx0ICAgICAgICB2YXIgYnVmID0gW107XG5cblx0ICAgICAgICB3aGlsZSgodG9rID0gdGhpcy5uZXh0VG9rZW4oKSkpIHtcblx0ICAgICAgICAgICAgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX0RBVEEpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBkYXRhID0gdG9rLnZhbHVlO1xuXHQgICAgICAgICAgICAgICAgdmFyIG5leHRUb2tlbiA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgICAgICAgICB2YXIgbmV4dFZhbCA9IG5leHRUb2tlbiAmJiBuZXh0VG9rZW4udmFsdWU7XG5cblx0ICAgICAgICAgICAgICAgIC8vIElmIHRoZSBsYXN0IHRva2VuIGhhcyBcIi1cIiB3ZSBuZWVkIHRvIHRyaW0gdGhlXG5cdCAgICAgICAgICAgICAgICAvLyBsZWFkaW5nIHdoaXRlc3BhY2Ugb2YgdGhlIGRhdGEuIFRoaXMgaXMgbWFya2VkIHdpdGhcblx0ICAgICAgICAgICAgICAgIC8vIHRoZSBgZHJvcExlYWRpbmdXaGl0ZXNwYWNlYCB2YXJpYWJsZS5cblx0ICAgICAgICAgICAgICAgIGlmKHRoaXMuZHJvcExlYWRpbmdXaGl0ZXNwYWNlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogdGhpcyBjb3VsZCBiZSBvcHRpbWl6ZWQgKGRvbid0IHVzZSByZWdleClcblx0ICAgICAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS5yZXBsYWNlKC9eXFxzKi8sICcnKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmRyb3BMZWFkaW5nV2hpdGVzcGFjZSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBTYW1lIGZvciB0aGUgc3VjY2VlZGluZyBibG9jayBzdGFydCB0b2tlblxuXHQgICAgICAgICAgICAgICAgaWYobmV4dFRva2VuICYmXG5cdCAgICAgICAgICAgICAgICAgICAgKChuZXh0VG9rZW4udHlwZSA9PT0gbGV4ZXIuVE9LRU5fQkxPQ0tfU1RBUlQgJiZcblx0ICAgICAgICAgICAgICAgICAgICAgIG5leHRWYWwuY2hhckF0KG5leHRWYWwubGVuZ3RoIC0gMSkgPT09ICctJykgfHxcblx0ICAgICAgICAgICAgICAgICAgICAobmV4dFRva2VuLnR5cGUgPT09IGxleGVyLlRPS0VOX1ZBUklBQkxFX1NUQVJUICYmXG5cdCAgICAgICAgICAgICAgICAgICAgICBuZXh0VmFsLmNoYXJBdCh0aGlzLnRva2Vucy50YWdzLlZBUklBQkxFX1NUQVJULmxlbmd0aClcblx0ICAgICAgICAgICAgICAgICAgICAgICAgPT09ICctJykgfHxcblx0ICAgICAgICAgICAgICAgICAgICAobmV4dFRva2VuLnR5cGUgPT09IGxleGVyLlRPS0VOX0NPTU1FTlQgJiZcblx0ICAgICAgICAgICAgICAgICAgICAgIG5leHRWYWwuY2hhckF0KHRoaXMudG9rZW5zLnRhZ3MuQ09NTUVOVF9TVEFSVC5sZW5ndGgpXG5cdCAgICAgICAgICAgICAgICAgICAgICAgID09PSAnLScpKSkge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IHRoaXMgY291bGQgYmUgb3B0aW1pemVkIChkb24ndCB1c2UgcmVnZXgpXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIGJ1Zi5wdXNoKG5ldyBub2Rlcy5PdXRwdXQodG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmV3IG5vZGVzLlRlbXBsYXRlRGF0YSh0b2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEpXSkpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX0JMT0NLX1NUQVJUKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmRyb3BMZWFkaW5nV2hpdGVzcGFjZSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgdmFyIG4gPSB0aGlzLnBhcnNlU3RhdGVtZW50KCk7XG5cdCAgICAgICAgICAgICAgICBpZighbikge1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgYnVmLnB1c2gobik7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSBpZih0b2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fVkFSSUFCTEVfU1RBUlQpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBlID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZHJvcExlYWRpbmdXaGl0ZXNwYWNlID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmFkdmFuY2VBZnRlclZhcmlhYmxlRW5kKCk7XG5cdCAgICAgICAgICAgICAgICBidWYucHVzaChuZXcgbm9kZXMuT3V0cHV0KHRvay5saW5lbm8sIHRvay5jb2xubywgW2VdKSk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSBpZih0b2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fQ09NTUVOVCkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5kcm9wTGVhZGluZ1doaXRlc3BhY2UgPSB0b2sudmFsdWUuY2hhckF0KFxuXHQgICAgICAgICAgICAgICAgICAgIHRvay52YWx1ZS5sZW5ndGggLSB0aGlzLnRva2Vucy50YWdzLkNPTU1FTlRfRU5ELmxlbmd0aCAtIDFcblx0ICAgICAgICAgICAgICAgICkgPT09ICctJztcblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIC8vIElnbm9yZSBjb21tZW50cywgb3RoZXJ3aXNlIHRoaXMgc2hvdWxkIGJlIGFuIGVycm9yXG5cdCAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ1VuZXhwZWN0ZWQgdG9rZW4gYXQgdG9wLWxldmVsOiAnICtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2sudHlwZSwgdG9rLmxpbmVubywgdG9rLmNvbG5vKTtcblxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIGJ1Zjtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICByZXR1cm4gbmV3IG5vZGVzLk5vZGVMaXN0KDAsIDAsIHRoaXMucGFyc2VOb2RlcygpKTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlQXNSb290OiBmdW5jdGlvbigpIHtcblx0ICAgICAgICByZXR1cm4gbmV3IG5vZGVzLlJvb3QoMCwgMCwgdGhpcy5wYXJzZU5vZGVzKCkpO1xuXHQgICAgfVxuXHR9KTtcblxuXHQvLyB2YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxuXHQvLyB2YXIgbCA9IGxleGVyLmxleCgneyUtIGlmIHggLSV9XFxuIGhlbGxvIHslIGVuZGlmICV9Jyk7XG5cdC8vIHZhciB0O1xuXHQvLyB3aGlsZSgodCA9IGwubmV4dFRva2VuKCkpKSB7XG5cdC8vICAgICBjb25zb2xlLmxvZyh1dGlsLmluc3BlY3QodCkpO1xuXHQvLyB9XG5cblx0Ly8gdmFyIHAgPSBuZXcgUGFyc2VyKGxleGVyLmxleCgnaGVsbG8geyUgZmlsdGVyIHRpdGxlICV9JyArXG5cdC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0hlbGxvIG1hZGFtIGhvdyBhcmUgeW91JyArXG5cdC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3slIGVuZGZpbHRlciAlfScpKTtcblx0Ly8gdmFyIG4gPSBwLnBhcnNlQXNSb290KCk7XG5cdC8vIG5vZGVzLnByaW50Tm9kZXMobik7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgICBwYXJzZTogZnVuY3Rpb24oc3JjLCBleHRlbnNpb25zLCBvcHRzKSB7XG5cdCAgICAgICAgdmFyIHAgPSBuZXcgUGFyc2VyKGxleGVyLmxleChzcmMsIG9wdHMpKTtcblx0ICAgICAgICBpZiAoZXh0ZW5zaW9ucyAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgIHAuZXh0ZW5zaW9ucyA9IGV4dGVuc2lvbnM7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBwLnBhcnNlQXNSb290KCk7XG5cdCAgICB9LFxuXHQgICAgUGFyc2VyOiBQYXJzZXJcblx0fTtcblxuXG4vKioqLyB9KSxcbi8qIDkgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGxpYiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cblx0dmFyIHdoaXRlc3BhY2VDaGFycyA9ICcgXFxuXFx0XFxyXFx1MDBBMCc7XG5cdHZhciBkZWxpbUNoYXJzID0gJygpW117fSUqLSt+LyMsOnwuPD49ISc7XG5cdHZhciBpbnRDaGFycyA9ICcwMTIzNDU2Nzg5JztcblxuXHR2YXIgQkxPQ0tfU1RBUlQgPSAneyUnO1xuXHR2YXIgQkxPQ0tfRU5EID0gJyV9Jztcblx0dmFyIFZBUklBQkxFX1NUQVJUID0gJ3t7Jztcblx0dmFyIFZBUklBQkxFX0VORCA9ICd9fSc7XG5cdHZhciBDT01NRU5UX1NUQVJUID0gJ3sjJztcblx0dmFyIENPTU1FTlRfRU5EID0gJyN9JztcblxuXHR2YXIgVE9LRU5fU1RSSU5HID0gJ3N0cmluZyc7XG5cdHZhciBUT0tFTl9XSElURVNQQUNFID0gJ3doaXRlc3BhY2UnO1xuXHR2YXIgVE9LRU5fREFUQSA9ICdkYXRhJztcblx0dmFyIFRPS0VOX0JMT0NLX1NUQVJUID0gJ2Jsb2NrLXN0YXJ0Jztcblx0dmFyIFRPS0VOX0JMT0NLX0VORCA9ICdibG9jay1lbmQnO1xuXHR2YXIgVE9LRU5fVkFSSUFCTEVfU1RBUlQgPSAndmFyaWFibGUtc3RhcnQnO1xuXHR2YXIgVE9LRU5fVkFSSUFCTEVfRU5EID0gJ3ZhcmlhYmxlLWVuZCc7XG5cdHZhciBUT0tFTl9DT01NRU5UID0gJ2NvbW1lbnQnO1xuXHR2YXIgVE9LRU5fTEVGVF9QQVJFTiA9ICdsZWZ0LXBhcmVuJztcblx0dmFyIFRPS0VOX1JJR0hUX1BBUkVOID0gJ3JpZ2h0LXBhcmVuJztcblx0dmFyIFRPS0VOX0xFRlRfQlJBQ0tFVCA9ICdsZWZ0LWJyYWNrZXQnO1xuXHR2YXIgVE9LRU5fUklHSFRfQlJBQ0tFVCA9ICdyaWdodC1icmFja2V0Jztcblx0dmFyIFRPS0VOX0xFRlRfQ1VSTFkgPSAnbGVmdC1jdXJseSc7XG5cdHZhciBUT0tFTl9SSUdIVF9DVVJMWSA9ICdyaWdodC1jdXJseSc7XG5cdHZhciBUT0tFTl9PUEVSQVRPUiA9ICdvcGVyYXRvcic7XG5cdHZhciBUT0tFTl9DT01NQSA9ICdjb21tYSc7XG5cdHZhciBUT0tFTl9DT0xPTiA9ICdjb2xvbic7XG5cdHZhciBUT0tFTl9USUxERSA9ICd0aWxkZSc7XG5cdHZhciBUT0tFTl9QSVBFID0gJ3BpcGUnO1xuXHR2YXIgVE9LRU5fSU5UID0gJ2ludCc7XG5cdHZhciBUT0tFTl9GTE9BVCA9ICdmbG9hdCc7XG5cdHZhciBUT0tFTl9CT09MRUFOID0gJ2Jvb2xlYW4nO1xuXHR2YXIgVE9LRU5fTk9ORSA9ICdub25lJztcblx0dmFyIFRPS0VOX1NZTUJPTCA9ICdzeW1ib2wnO1xuXHR2YXIgVE9LRU5fU1BFQ0lBTCA9ICdzcGVjaWFsJztcblx0dmFyIFRPS0VOX1JFR0VYID0gJ3JlZ2V4JztcblxuXHRmdW5jdGlvbiB0b2tlbih0eXBlLCB2YWx1ZSwgbGluZW5vLCBjb2xubykge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgICB0eXBlOiB0eXBlLFxuXHQgICAgICAgIHZhbHVlOiB2YWx1ZSxcblx0ICAgICAgICBsaW5lbm86IGxpbmVubyxcblx0ICAgICAgICBjb2xubzogY29sbm9cblx0ICAgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBUb2tlbml6ZXIoc3RyLCBvcHRzKSB7XG5cdCAgICB0aGlzLnN0ciA9IHN0cjtcblx0ICAgIHRoaXMuaW5kZXggPSAwO1xuXHQgICAgdGhpcy5sZW4gPSBzdHIubGVuZ3RoO1xuXHQgICAgdGhpcy5saW5lbm8gPSAwO1xuXHQgICAgdGhpcy5jb2xubyA9IDA7XG5cblx0ICAgIHRoaXMuaW5fY29kZSA9IGZhbHNlO1xuXG5cdCAgICBvcHRzID0gb3B0cyB8fCB7fTtcblxuXHQgICAgdmFyIHRhZ3MgPSBvcHRzLnRhZ3MgfHwge307XG5cdCAgICB0aGlzLnRhZ3MgPSB7XG5cdCAgICAgICAgQkxPQ0tfU1RBUlQ6IHRhZ3MuYmxvY2tTdGFydCB8fCBCTE9DS19TVEFSVCxcblx0ICAgICAgICBCTE9DS19FTkQ6IHRhZ3MuYmxvY2tFbmQgfHwgQkxPQ0tfRU5ELFxuXHQgICAgICAgIFZBUklBQkxFX1NUQVJUOiB0YWdzLnZhcmlhYmxlU3RhcnQgfHwgVkFSSUFCTEVfU1RBUlQsXG5cdCAgICAgICAgVkFSSUFCTEVfRU5EOiB0YWdzLnZhcmlhYmxlRW5kIHx8IFZBUklBQkxFX0VORCxcblx0ICAgICAgICBDT01NRU5UX1NUQVJUOiB0YWdzLmNvbW1lbnRTdGFydCB8fCBDT01NRU5UX1NUQVJULFxuXHQgICAgICAgIENPTU1FTlRfRU5EOiB0YWdzLmNvbW1lbnRFbmQgfHwgQ09NTUVOVF9FTkRcblx0ICAgIH07XG5cblx0ICAgIHRoaXMudHJpbUJsb2NrcyA9ICEhb3B0cy50cmltQmxvY2tzO1xuXHQgICAgdGhpcy5sc3RyaXBCbG9ja3MgPSAhIW9wdHMubHN0cmlwQmxvY2tzO1xuXHR9XG5cblx0VG9rZW5pemVyLnByb3RvdHlwZS5uZXh0VG9rZW4gPSBmdW5jdGlvbigpIHtcblx0ICAgIHZhciBsaW5lbm8gPSB0aGlzLmxpbmVubztcblx0ICAgIHZhciBjb2xubyA9IHRoaXMuY29sbm87XG5cdCAgICB2YXIgdG9rO1xuXG5cdCAgICBpZih0aGlzLmluX2NvZGUpIHtcblx0ICAgICAgICAvLyBPdGhlcndpc2UsIGlmIHdlIGFyZSBpbiBhIGJsb2NrIHBhcnNlIGl0IGFzIGNvZGVcblx0ICAgICAgICB2YXIgY3VyID0gdGhpcy5jdXJyZW50KCk7XG5cblx0ICAgICAgICBpZih0aGlzLmlzX2ZpbmlzaGVkKCkpIHtcblx0ICAgICAgICAgICAgLy8gV2UgaGF2ZSBub3RoaW5nIGVsc2UgdG8gcGFyc2Vcblx0ICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYoY3VyID09PSAnXCInIHx8IGN1ciA9PT0gJ1xcJycpIHtcblx0ICAgICAgICAgICAgLy8gV2UndmUgaGl0IGEgc3RyaW5nXG5cdCAgICAgICAgICAgIHJldHVybiB0b2tlbihUT0tFTl9TVFJJTkcsIHRoaXMucGFyc2VTdHJpbmcoY3VyKSwgbGluZW5vLCBjb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYoKHRvayA9IHRoaXMuX2V4dHJhY3Qod2hpdGVzcGFjZUNoYXJzKSkpIHtcblx0ICAgICAgICAgICAgLy8gV2UgaGl0IHNvbWUgd2hpdGVzcGFjZVxuXHQgICAgICAgICAgICByZXR1cm4gdG9rZW4oVE9LRU5fV0hJVEVTUEFDRSwgdG9rLCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZigodG9rID0gdGhpcy5fZXh0cmFjdFN0cmluZyh0aGlzLnRhZ3MuQkxPQ0tfRU5EKSkgfHxcblx0ICAgICAgICAgICAgICAgICh0b2sgPSB0aGlzLl9leHRyYWN0U3RyaW5nKCctJyArIHRoaXMudGFncy5CTE9DS19FTkQpKSkge1xuXHQgICAgICAgICAgICAvLyBTcGVjaWFsIGNoZWNrIGZvciB0aGUgYmxvY2sgZW5kIHRhZ1xuXHQgICAgICAgICAgICAvL1xuXHQgICAgICAgICAgICAvLyBJdCBpcyBhIHJlcXVpcmVtZW50IHRoYXQgc3RhcnQgYW5kIGVuZCB0YWdzIGFyZSBjb21wb3NlZCBvZlxuXHQgICAgICAgICAgICAvLyBkZWxpbWl0ZXIgY2hhcmFjdGVycyAoJXt9W10gZXRjKSwgYW5kIG91ciBjb2RlIGFsd2F5c1xuXHQgICAgICAgICAgICAvLyBicmVha3Mgb24gZGVsaW1pdGVycyBzbyB3ZSBjYW4gYXNzdW1lIHRoZSB0b2tlbiBwYXJzaW5nXG5cdCAgICAgICAgICAgIC8vIGRvZXNuJ3QgY29uc3VtZSB0aGVzZSBlbHNld2hlcmVcblx0ICAgICAgICAgICAgdGhpcy5pbl9jb2RlID0gZmFsc2U7XG5cdCAgICAgICAgICAgIGlmKHRoaXMudHJpbUJsb2Nrcykge1xuXHQgICAgICAgICAgICAgICAgY3VyID0gdGhpcy5jdXJyZW50KCk7XG5cdCAgICAgICAgICAgICAgICBpZihjdXIgPT09ICdcXG4nKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gU2tpcCBuZXdsaW5lXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICAgICAgICAgICAgICB9ZWxzZSBpZihjdXIgPT09ICdcXHInKXtcblx0ICAgICAgICAgICAgICAgICAgICAvLyBTa2lwIENSTEYgbmV3bGluZVxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yd2FyZCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIGN1ciA9IHRoaXMuY3VycmVudCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmKGN1ciA9PT0gJ1xcbicpe1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcndhcmQoKTtcblx0ICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2FzIG5vdCBhIENSTEYsIHNvIGdvIGJhY2tcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJldHVybiB0b2tlbihUT0tFTl9CTE9DS19FTkQsIHRvaywgbGluZW5vLCBjb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYoKHRvayA9IHRoaXMuX2V4dHJhY3RTdHJpbmcodGhpcy50YWdzLlZBUklBQkxFX0VORCkpIHx8XG5cdCAgICAgICAgICAgICAgICAodG9rID0gdGhpcy5fZXh0cmFjdFN0cmluZygnLScgKyB0aGlzLnRhZ3MuVkFSSUFCTEVfRU5EKSkpIHtcblx0ICAgICAgICAgICAgLy8gU3BlY2lhbCBjaGVjayBmb3IgdmFyaWFibGUgZW5kIHRhZyAoc2VlIGFib3ZlKVxuXHQgICAgICAgICAgICB0aGlzLmluX2NvZGUgPSBmYWxzZTtcblx0ICAgICAgICAgICAgcmV0dXJuIHRva2VuKFRPS0VOX1ZBUklBQkxFX0VORCwgdG9rLCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZiAoY3VyID09PSAncicgJiYgdGhpcy5zdHIuY2hhckF0KHRoaXMuaW5kZXggKyAxKSA9PT0gJy8nKSB7XG5cdCAgICAgICAgICAgIC8vIFNraXAgcGFzdCAnci8nLlxuXHQgICAgICAgICAgICB0aGlzLmZvcndhcmROKDIpO1xuXG5cdCAgICAgICAgICAgIC8vIEV4dHJhY3QgdW50aWwgdGhlIGVuZCBvZiB0aGUgcmVnZXggLS0gLyBlbmRzIGl0LCBcXC8gZG9lcyBub3QuXG5cdCAgICAgICAgICAgIHZhciByZWdleEJvZHkgPSAnJztcblx0ICAgICAgICAgICAgd2hpbGUgKCF0aGlzLmlzX2ZpbmlzaGVkKCkpIHtcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQoKSA9PT0gJy8nICYmIHRoaXMucHJldmlvdXMoKSAhPT0gJ1xcXFwnKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIHJlZ2V4Qm9keSArPSB0aGlzLmN1cnJlbnQoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcndhcmQoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIC8vIENoZWNrIGZvciBmbGFncy5cblx0ICAgICAgICAgICAgLy8gVGhlIHBvc3NpYmxlIGZsYWdzIGFyZSBhY2NvcmRpbmcgdG8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvUmVnRXhwKVxuXHQgICAgICAgICAgICB2YXIgUE9TU0lCTEVfRkxBR1MgPSBbJ2cnLCAnaScsICdtJywgJ3knXTtcblx0ICAgICAgICAgICAgdmFyIHJlZ2V4RmxhZ3MgPSAnJztcblx0ICAgICAgICAgICAgd2hpbGUgKCF0aGlzLmlzX2ZpbmlzaGVkKCkpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBpc0N1cnJlbnRBRmxhZyA9IFBPU1NJQkxFX0ZMQUdTLmluZGV4T2YodGhpcy5jdXJyZW50KCkpICE9PSAtMTtcblx0ICAgICAgICAgICAgICAgIGlmIChpc0N1cnJlbnRBRmxhZykge1xuXHQgICAgICAgICAgICAgICAgICAgIHJlZ2V4RmxhZ3MgKz0gdGhpcy5jdXJyZW50KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIHRva2VuKFRPS0VOX1JFR0VYLCB7Ym9keTogcmVnZXhCb2R5LCBmbGFnczogcmVnZXhGbGFnc30sIGxpbmVubywgY29sbm8pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKGRlbGltQ2hhcnMuaW5kZXhPZihjdXIpICE9PSAtMSkge1xuXHQgICAgICAgICAgICAvLyBXZSd2ZSBoaXQgYSBkZWxpbWl0ZXIgKGEgc3BlY2lhbCBjaGFyIGxpa2UgYSBicmFja2V0KVxuXHQgICAgICAgICAgICB0aGlzLmZvcndhcmQoKTtcblx0ICAgICAgICAgICAgdmFyIGNvbXBsZXhPcHMgPSBbJz09JywgJz09PScsICchPScsICchPT0nLCAnPD0nLCAnPj0nLCAnLy8nLCAnKionXTtcblx0ICAgICAgICAgICAgdmFyIGN1ckNvbXBsZXggPSBjdXIgKyB0aGlzLmN1cnJlbnQoKTtcblx0ICAgICAgICAgICAgdmFyIHR5cGU7XG5cblx0ICAgICAgICAgICAgaWYobGliLmluZGV4T2YoY29tcGxleE9wcywgY3VyQ29tcGxleCkgIT09IC0xKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmZvcndhcmQoKTtcblx0ICAgICAgICAgICAgICAgIGN1ciA9IGN1ckNvbXBsZXg7XG5cblx0ICAgICAgICAgICAgICAgIC8vIFNlZSBpZiB0aGlzIGlzIGEgc3RyaWN0IGVxdWFsaXR5L2luZXF1YWxpdHkgY29tcGFyYXRvclxuXHQgICAgICAgICAgICAgICAgaWYobGliLmluZGV4T2YoY29tcGxleE9wcywgY3VyQ29tcGxleCArIHRoaXMuY3VycmVudCgpKSAhPT0gLTEpIHtcblx0ICAgICAgICAgICAgICAgICAgICBjdXIgPSBjdXJDb21wbGV4ICsgdGhpcy5jdXJyZW50KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBzd2l0Y2goY3VyKSB7XG5cdCAgICAgICAgICAgIGNhc2UgJygnOiB0eXBlID0gVE9LRU5fTEVGVF9QQVJFTjsgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgJyknOiB0eXBlID0gVE9LRU5fUklHSFRfUEFSRU47IGJyZWFrO1xuXHQgICAgICAgICAgICBjYXNlICdbJzogdHlwZSA9IFRPS0VOX0xFRlRfQlJBQ0tFVDsgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgJ10nOiB0eXBlID0gVE9LRU5fUklHSFRfQlJBQ0tFVDsgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgJ3snOiB0eXBlID0gVE9LRU5fTEVGVF9DVVJMWTsgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgJ30nOiB0eXBlID0gVE9LRU5fUklHSFRfQ1VSTFk7IGJyZWFrO1xuXHQgICAgICAgICAgICBjYXNlICcsJzogdHlwZSA9IFRPS0VOX0NPTU1BOyBicmVhaztcblx0ICAgICAgICAgICAgY2FzZSAnOic6IHR5cGUgPSBUT0tFTl9DT0xPTjsgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgJ34nOiB0eXBlID0gVE9LRU5fVElMREU7IGJyZWFrO1xuXHQgICAgICAgICAgICBjYXNlICd8JzogdHlwZSA9IFRPS0VOX1BJUEU7IGJyZWFrO1xuXHQgICAgICAgICAgICBkZWZhdWx0OiB0eXBlID0gVE9LRU5fT1BFUkFUT1I7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gdG9rZW4odHlwZSwgY3VyLCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIC8vIFdlIGFyZSBub3QgYXQgd2hpdGVzcGFjZSBvciBhIGRlbGltaXRlciwgc28gZXh0cmFjdCB0aGVcblx0ICAgICAgICAgICAgLy8gdGV4dCBhbmQgcGFyc2UgaXRcblx0ICAgICAgICAgICAgdG9rID0gdGhpcy5fZXh0cmFjdFVudGlsKHdoaXRlc3BhY2VDaGFycyArIGRlbGltQ2hhcnMpO1xuXG5cdCAgICAgICAgICAgIGlmKHRvay5tYXRjaCgvXlstK10/WzAtOV0rJC8pKSB7XG5cdCAgICAgICAgICAgICAgICBpZih0aGlzLmN1cnJlbnQoKSA9PT0gJy4nKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGRlYyA9IHRoaXMuX2V4dHJhY3QoaW50Q2hhcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbihUT0tFTl9GTE9BVCwgdG9rICsgJy4nICsgZGVjLCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbihUT0tFTl9JTlQsIHRvaywgbGluZW5vLCBjb2xubyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSBpZih0b2subWF0Y2goL14odHJ1ZXxmYWxzZSkkLykpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbihUT0tFTl9CT09MRUFOLCB0b2ssIGxpbmVubywgY29sbm8pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYodG9rID09PSAnbm9uZScpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbihUT0tFTl9OT05FLCB0b2ssIGxpbmVubywgY29sbm8pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYodG9rKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW4oVE9LRU5fU1lNQk9MLCB0b2ssIGxpbmVubywgY29sbm8pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIHZhbHVlIHdoaWxlIHBhcnNpbmc6ICcgKyB0b2spO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgLy8gUGFyc2Ugb3V0IHRoZSB0ZW1wbGF0ZSB0ZXh0LCBicmVha2luZyBvbiB0YWdcblx0ICAgICAgICAvLyBkZWxpbWl0ZXJzIGJlY2F1c2Ugd2UgbmVlZCB0byBsb29rIGZvciBibG9jay92YXJpYWJsZSBzdGFydFxuXHQgICAgICAgIC8vIHRhZ3MgKGRvbid0IHVzZSB0aGUgZnVsbCBkZWxpbUNoYXJzIGZvciBvcHRpbWl6YXRpb24pXG5cdCAgICAgICAgdmFyIGJlZ2luQ2hhcnMgPSAodGhpcy50YWdzLkJMT0NLX1NUQVJULmNoYXJBdCgwKSArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdzLlZBUklBQkxFX1NUQVJULmNoYXJBdCgwKSArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdzLkNPTU1FTlRfU1RBUlQuY2hhckF0KDApICtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ3MuQ09NTUVOVF9FTkQuY2hhckF0KDApKTtcblxuXHQgICAgICAgIGlmKHRoaXMuaXNfZmluaXNoZWQoKSkge1xuXHQgICAgICAgICAgICByZXR1cm4gbnVsbDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZigodG9rID0gdGhpcy5fZXh0cmFjdFN0cmluZyh0aGlzLnRhZ3MuQkxPQ0tfU1RBUlQgKyAnLScpKSB8fFxuXHQgICAgICAgICAgICAgICAgKHRvayA9IHRoaXMuX2V4dHJhY3RTdHJpbmcodGhpcy50YWdzLkJMT0NLX1NUQVJUKSkpIHtcblx0ICAgICAgICAgICAgdGhpcy5pbl9jb2RlID0gdHJ1ZTtcblx0ICAgICAgICAgICAgcmV0dXJuIHRva2VuKFRPS0VOX0JMT0NLX1NUQVJULCB0b2ssIGxpbmVubywgY29sbm8pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKCh0b2sgPSB0aGlzLl9leHRyYWN0U3RyaW5nKHRoaXMudGFncy5WQVJJQUJMRV9TVEFSVCArICctJykpIHx8XG5cdCAgICAgICAgICAgICAgICAodG9rID0gdGhpcy5fZXh0cmFjdFN0cmluZyh0aGlzLnRhZ3MuVkFSSUFCTEVfU1RBUlQpKSkge1xuXHQgICAgICAgICAgICB0aGlzLmluX2NvZGUgPSB0cnVlO1xuXHQgICAgICAgICAgICByZXR1cm4gdG9rZW4oVE9LRU5fVkFSSUFCTEVfU1RBUlQsIHRvaywgbGluZW5vLCBjb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0b2sgPSAnJztcblx0ICAgICAgICAgICAgdmFyIGRhdGE7XG5cdCAgICAgICAgICAgIHZhciBpbl9jb21tZW50ID0gZmFsc2U7XG5cblx0ICAgICAgICAgICAgaWYodGhpcy5fbWF0Y2hlcyh0aGlzLnRhZ3MuQ09NTUVOVF9TVEFSVCkpIHtcblx0ICAgICAgICAgICAgICAgIGluX2NvbW1lbnQgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgdG9rID0gdGhpcy5fZXh0cmFjdFN0cmluZyh0aGlzLnRhZ3MuQ09NTUVOVF9TVEFSVCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBDb250aW51YWxseSBjb25zdW1lIHRleHQsIGJyZWFraW5nIG9uIHRoZSB0YWcgZGVsaW1pdGVyXG5cdCAgICAgICAgICAgIC8vIGNoYXJhY3RlcnMgYW5kIGNoZWNraW5nIHRvIHNlZSBpZiBpdCdzIGEgc3RhcnQgdGFnLlxuXHQgICAgICAgICAgICAvL1xuXHQgICAgICAgICAgICAvLyBXZSBjb3VsZCBoaXQgdGhlIGVuZCBvZiB0aGUgdGVtcGxhdGUgaW4gdGhlIG1pZGRsZSBvZlxuXHQgICAgICAgICAgICAvLyBvdXIgbG9vcGluZywgc28gY2hlY2sgZm9yIHRoZSBudWxsIHJldHVybiB2YWx1ZSBmcm9tXG5cdCAgICAgICAgICAgIC8vIF9leHRyYWN0VW50aWxcblx0ICAgICAgICAgICAgd2hpbGUoKGRhdGEgPSB0aGlzLl9leHRyYWN0VW50aWwoYmVnaW5DaGFycykpICE9PSBudWxsKSB7XG5cdCAgICAgICAgICAgICAgICB0b2sgKz0gZGF0YTtcblxuXHQgICAgICAgICAgICAgICAgaWYoKHRoaXMuX21hdGNoZXModGhpcy50YWdzLkJMT0NLX1NUQVJUKSB8fFxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX21hdGNoZXModGhpcy50YWdzLlZBUklBQkxFX1NUQVJUKSB8fFxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX21hdGNoZXModGhpcy50YWdzLkNPTU1FTlRfU1RBUlQpKSAmJlxuXHQgICAgICAgICAgICAgICAgICAhaW5fY29tbWVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMubHN0cmlwQmxvY2tzICYmXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21hdGNoZXModGhpcy50YWdzLkJMT0NLX1NUQVJUKSAmJlxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbG5vID4gMCAmJlxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbG5vIDw9IHRvay5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RMaW5lID0gdG9rLnNsaWNlKC10aGlzLmNvbG5vKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYoL15cXHMrJC8udGVzdChsYXN0TGluZSkpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBibG9jayBsZWFkaW5nIHdoaXRlc3BhY2UgZnJvbSBiZWdpbm5pbmcgb2YgdGhlIHN0cmluZ1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rID0gdG9rLnNsaWNlKDAsIC10aGlzLmNvbG5vKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF0b2subGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWxsIGRhdGEgcmVtb3ZlZCwgY29sbGFwc2UgdG8gYXZvaWQgdW5uZWNlc3Nhcnkgbm9kZXNcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBieSByZXR1cm5pbmcgbmV4dCB0b2tlbiAoYmxvY2sgc3RhcnQpXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dFRva2VuKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gSWYgaXQgaXMgYSBzdGFydCB0YWcsIHN0b3AgbG9vcGluZ1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgZWxzZSBpZih0aGlzLl9tYXRjaGVzKHRoaXMudGFncy5DT01NRU5UX0VORCkpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZighaW5fY29tbWVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuZXhwZWN0ZWQgZW5kIG9mIGNvbW1lbnQnKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgdG9rICs9IHRoaXMuX2V4dHJhY3RTdHJpbmcodGhpcy50YWdzLkNPTU1FTlRfRU5EKTtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIEl0IGRvZXMgbm90IG1hdGNoIGFueSB0YWcsIHNvIGFkZCB0aGUgY2hhcmFjdGVyIGFuZFxuXHQgICAgICAgICAgICAgICAgICAgIC8vIGNhcnJ5IG9uXG5cdCAgICAgICAgICAgICAgICAgICAgdG9rICs9IHRoaXMuY3VycmVudCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yd2FyZCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgaWYoZGF0YSA9PT0gbnVsbCAmJiBpbl9jb21tZW50KSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIGVuZCBvZiBjb21tZW50LCBnb3QgZW5kIG9mIGZpbGUnKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiB0b2tlbihpbl9jb21tZW50ID8gVE9LRU5fQ09NTUVOVCA6IFRPS0VOX0RBVEEsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICB0b2ssXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICBjb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBwYXJzZSB0ZXh0Jyk7XG5cdH07XG5cblx0VG9rZW5pemVyLnByb3RvdHlwZS5wYXJzZVN0cmluZyA9IGZ1bmN0aW9uKGRlbGltaXRlcikge1xuXHQgICAgdGhpcy5mb3J3YXJkKCk7XG5cblx0ICAgIHZhciBzdHIgPSAnJztcblxuXHQgICAgd2hpbGUoIXRoaXMuaXNfZmluaXNoZWQoKSAmJiB0aGlzLmN1cnJlbnQoKSAhPT0gZGVsaW1pdGVyKSB7XG5cdCAgICAgICAgdmFyIGN1ciA9IHRoaXMuY3VycmVudCgpO1xuXG5cdCAgICAgICAgaWYoY3VyID09PSAnXFxcXCcpIHtcblx0ICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICAgICAgICAgIHN3aXRjaCh0aGlzLmN1cnJlbnQoKSkge1xuXHQgICAgICAgICAgICBjYXNlICduJzogc3RyICs9ICdcXG4nOyBicmVhaztcblx0ICAgICAgICAgICAgY2FzZSAndCc6IHN0ciArPSAnXFx0JzsgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgJ3InOiBzdHIgKz0gJ1xccic7IGJyZWFrO1xuXHQgICAgICAgICAgICBkZWZhdWx0OlxuXHQgICAgICAgICAgICAgICAgc3RyICs9IHRoaXMuY3VycmVudCgpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHRoaXMuZm9yd2FyZCgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgc3RyICs9IGN1cjtcblx0ICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICB0aGlzLmZvcndhcmQoKTtcblx0ICAgIHJldHVybiBzdHI7XG5cdH07XG5cblx0VG9rZW5pemVyLnByb3RvdHlwZS5fbWF0Y2hlcyA9IGZ1bmN0aW9uKHN0cikge1xuXHQgICAgaWYodGhpcy5pbmRleCArIHN0ci5sZW5ndGggPiB0aGlzLmxlbikge1xuXHQgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgbSA9IHRoaXMuc3RyLnNsaWNlKHRoaXMuaW5kZXgsIHRoaXMuaW5kZXggKyBzdHIubGVuZ3RoKTtcblx0ICAgIHJldHVybiBtID09PSBzdHI7XG5cdH07XG5cblx0VG9rZW5pemVyLnByb3RvdHlwZS5fZXh0cmFjdFN0cmluZyA9IGZ1bmN0aW9uKHN0cikge1xuXHQgICAgaWYodGhpcy5fbWF0Y2hlcyhzdHIpKSB7XG5cdCAgICAgICAgdGhpcy5pbmRleCArPSBzdHIubGVuZ3RoO1xuXHQgICAgICAgIHJldHVybiBzdHI7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gbnVsbDtcblx0fTtcblxuXHRUb2tlbml6ZXIucHJvdG90eXBlLl9leHRyYWN0VW50aWwgPSBmdW5jdGlvbihjaGFyU3RyaW5nKSB7XG5cdCAgICAvLyBFeHRyYWN0IGFsbCBub24tbWF0Y2hpbmcgY2hhcnMsIHdpdGggdGhlIGRlZmF1bHQgbWF0Y2hpbmcgc2V0XG5cdCAgICAvLyB0byBldmVyeXRoaW5nXG5cdCAgICByZXR1cm4gdGhpcy5fZXh0cmFjdE1hdGNoaW5nKHRydWUsIGNoYXJTdHJpbmcgfHwgJycpO1xuXHR9O1xuXG5cdFRva2VuaXplci5wcm90b3R5cGUuX2V4dHJhY3QgPSBmdW5jdGlvbihjaGFyU3RyaW5nKSB7XG5cdCAgICAvLyBFeHRyYWN0IGFsbCBtYXRjaGluZyBjaGFycyAobm8gZGVmYXVsdCwgc28gY2hhclN0cmluZyBtdXN0IGJlXG5cdCAgICAvLyBleHBsaWNpdClcblx0ICAgIHJldHVybiB0aGlzLl9leHRyYWN0TWF0Y2hpbmcoZmFsc2UsIGNoYXJTdHJpbmcpO1xuXHR9O1xuXG5cdFRva2VuaXplci5wcm90b3R5cGUuX2V4dHJhY3RNYXRjaGluZyA9IGZ1bmN0aW9uIChicmVha09uTWF0Y2gsIGNoYXJTdHJpbmcpIHtcblx0ICAgIC8vIFB1bGwgb3V0IGNoYXJhY3RlcnMgdW50aWwgYSBicmVha2luZyBjaGFyIGlzIGhpdC5cblx0ICAgIC8vIElmIGJyZWFrT25NYXRjaCBpcyBmYWxzZSwgYSBub24tbWF0Y2hpbmcgY2hhciBzdG9wcyBpdC5cblx0ICAgIC8vIElmIGJyZWFrT25NYXRjaCBpcyB0cnVlLCBhIG1hdGNoaW5nIGNoYXIgc3RvcHMgaXQuXG5cblx0ICAgIGlmKHRoaXMuaXNfZmluaXNoZWQoKSkge1xuXHQgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgZmlyc3QgPSBjaGFyU3RyaW5nLmluZGV4T2YodGhpcy5jdXJyZW50KCkpO1xuXG5cdCAgICAvLyBPbmx5IHByb2NlZWQgaWYgdGhlIGZpcnN0IGNoYXJhY3RlciBkb2Vzbid0IG1lZXQgb3VyIGNvbmRpdGlvblxuXHQgICAgaWYoKGJyZWFrT25NYXRjaCAmJiBmaXJzdCA9PT0gLTEpIHx8XG5cdCAgICAgICAoIWJyZWFrT25NYXRjaCAmJiBmaXJzdCAhPT0gLTEpKSB7XG5cdCAgICAgICAgdmFyIHQgPSB0aGlzLmN1cnJlbnQoKTtcblx0ICAgICAgICB0aGlzLmZvcndhcmQoKTtcblxuXHQgICAgICAgIC8vIEFuZCBwdWxsIG91dCBhbGwgdGhlIGNoYXJzIG9uZSBhdCBhIHRpbWUgdW50aWwgd2UgaGl0IGFcblx0ICAgICAgICAvLyBicmVha2luZyBjaGFyXG5cdCAgICAgICAgdmFyIGlkeCA9IGNoYXJTdHJpbmcuaW5kZXhPZih0aGlzLmN1cnJlbnQoKSk7XG5cblx0ICAgICAgICB3aGlsZSgoKGJyZWFrT25NYXRjaCAmJiBpZHggPT09IC0xKSB8fFxuXHQgICAgICAgICAgICAgICAoIWJyZWFrT25NYXRjaCAmJiBpZHggIT09IC0xKSkgJiYgIXRoaXMuaXNfZmluaXNoZWQoKSkge1xuXHQgICAgICAgICAgICB0ICs9IHRoaXMuY3VycmVudCgpO1xuXHQgICAgICAgICAgICB0aGlzLmZvcndhcmQoKTtcblxuXHQgICAgICAgICAgICBpZHggPSBjaGFyU3RyaW5nLmluZGV4T2YodGhpcy5jdXJyZW50KCkpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiB0O1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gJyc7XG5cdH07XG5cblx0VG9rZW5pemVyLnByb3RvdHlwZS5fZXh0cmFjdFJlZ2V4ID0gZnVuY3Rpb24ocmVnZXgpIHtcblx0ICAgIHZhciBtYXRjaGVzID0gdGhpcy5jdXJyZW50U3RyKCkubWF0Y2gocmVnZXgpO1xuXHQgICAgaWYoIW1hdGNoZXMpIHtcblx0ICAgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH1cblxuXHQgICAgLy8gTW92ZSBmb3J3YXJkIHdoYXRldmVyIHdhcyBtYXRjaGVkXG5cdCAgICB0aGlzLmZvcndhcmROKG1hdGNoZXNbMF0ubGVuZ3RoKTtcblxuXHQgICAgcmV0dXJuIG1hdGNoZXM7XG5cdH07XG5cblx0VG9rZW5pemVyLnByb3RvdHlwZS5pc19maW5pc2hlZCA9IGZ1bmN0aW9uKCkge1xuXHQgICAgcmV0dXJuIHRoaXMuaW5kZXggPj0gdGhpcy5sZW47XG5cdH07XG5cblx0VG9rZW5pemVyLnByb3RvdHlwZS5mb3J3YXJkTiA9IGZ1bmN0aW9uKG4pIHtcblx0ICAgIGZvcih2YXIgaT0wOyBpPG47IGkrKykge1xuXHQgICAgICAgIHRoaXMuZm9yd2FyZCgpO1xuXHQgICAgfVxuXHR9O1xuXG5cdFRva2VuaXplci5wcm90b3R5cGUuZm9yd2FyZCA9IGZ1bmN0aW9uKCkge1xuXHQgICAgdGhpcy5pbmRleCsrO1xuXG5cdCAgICBpZih0aGlzLnByZXZpb3VzKCkgPT09ICdcXG4nKSB7XG5cdCAgICAgICAgdGhpcy5saW5lbm8rKztcblx0ICAgICAgICB0aGlzLmNvbG5vID0gMDtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIHRoaXMuY29sbm8rKztcblx0ICAgIH1cblx0fTtcblxuXHRUb2tlbml6ZXIucHJvdG90eXBlLmJhY2tOID0gZnVuY3Rpb24obikge1xuXHQgICAgZm9yKHZhciBpPTA7IGk8bjsgaSsrKSB7XG5cdCAgICAgICAgdGhpcy5iYWNrKCk7XG5cdCAgICB9XG5cdH07XG5cblx0VG9rZW5pemVyLnByb3RvdHlwZS5iYWNrID0gZnVuY3Rpb24oKSB7XG5cdCAgICB0aGlzLmluZGV4LS07XG5cblx0ICAgIGlmKHRoaXMuY3VycmVudCgpID09PSAnXFxuJykge1xuXHQgICAgICAgIHRoaXMubGluZW5vLS07XG5cblx0ICAgICAgICB2YXIgaWR4ID0gdGhpcy5zcmMubGFzdEluZGV4T2YoJ1xcbicsIHRoaXMuaW5kZXgtMSk7XG5cdCAgICAgICAgaWYoaWR4ID09PSAtMSkge1xuXHQgICAgICAgICAgICB0aGlzLmNvbG5vID0gdGhpcy5pbmRleDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHRoaXMuY29sbm8gPSB0aGlzLmluZGV4IC0gaWR4O1xuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIHRoaXMuY29sbm8tLTtcblx0ICAgIH1cblx0fTtcblxuXHQvLyBjdXJyZW50IHJldHVybnMgY3VycmVudCBjaGFyYWN0ZXJcblx0VG9rZW5pemVyLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24oKSB7XG5cdCAgICBpZighdGhpcy5pc19maW5pc2hlZCgpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuc3RyLmNoYXJBdCh0aGlzLmluZGV4KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiAnJztcblx0fTtcblxuXHQvLyBjdXJyZW50U3RyIHJldHVybnMgd2hhdCdzIGxlZnQgb2YgdGhlIHVucGFyc2VkIHN0cmluZ1xuXHRUb2tlbml6ZXIucHJvdG90eXBlLmN1cnJlbnRTdHIgPSBmdW5jdGlvbigpIHtcblx0ICAgIGlmKCF0aGlzLmlzX2ZpbmlzaGVkKCkpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5zdHIuc3Vic3RyKHRoaXMuaW5kZXgpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuICcnO1xuXHR9O1xuXG5cdFRva2VuaXplci5wcm90b3R5cGUucHJldmlvdXMgPSBmdW5jdGlvbigpIHtcblx0ICAgIHJldHVybiB0aGlzLnN0ci5jaGFyQXQodGhpcy5pbmRleC0xKTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0ICAgIGxleDogZnVuY3Rpb24oc3JjLCBvcHRzKSB7XG5cdCAgICAgICAgcmV0dXJuIG5ldyBUb2tlbml6ZXIoc3JjLCBvcHRzKTtcblx0ICAgIH0sXG5cblx0ICAgIFRPS0VOX1NUUklORzogVE9LRU5fU1RSSU5HLFxuXHQgICAgVE9LRU5fV0hJVEVTUEFDRTogVE9LRU5fV0hJVEVTUEFDRSxcblx0ICAgIFRPS0VOX0RBVEE6IFRPS0VOX0RBVEEsXG5cdCAgICBUT0tFTl9CTE9DS19TVEFSVDogVE9LRU5fQkxPQ0tfU1RBUlQsXG5cdCAgICBUT0tFTl9CTE9DS19FTkQ6IFRPS0VOX0JMT0NLX0VORCxcblx0ICAgIFRPS0VOX1ZBUklBQkxFX1NUQVJUOiBUT0tFTl9WQVJJQUJMRV9TVEFSVCxcblx0ICAgIFRPS0VOX1ZBUklBQkxFX0VORDogVE9LRU5fVkFSSUFCTEVfRU5ELFxuXHQgICAgVE9LRU5fQ09NTUVOVDogVE9LRU5fQ09NTUVOVCxcblx0ICAgIFRPS0VOX0xFRlRfUEFSRU46IFRPS0VOX0xFRlRfUEFSRU4sXG5cdCAgICBUT0tFTl9SSUdIVF9QQVJFTjogVE9LRU5fUklHSFRfUEFSRU4sXG5cdCAgICBUT0tFTl9MRUZUX0JSQUNLRVQ6IFRPS0VOX0xFRlRfQlJBQ0tFVCxcblx0ICAgIFRPS0VOX1JJR0hUX0JSQUNLRVQ6IFRPS0VOX1JJR0hUX0JSQUNLRVQsXG5cdCAgICBUT0tFTl9MRUZUX0NVUkxZOiBUT0tFTl9MRUZUX0NVUkxZLFxuXHQgICAgVE9LRU5fUklHSFRfQ1VSTFk6IFRPS0VOX1JJR0hUX0NVUkxZLFxuXHQgICAgVE9LRU5fT1BFUkFUT1I6IFRPS0VOX09QRVJBVE9SLFxuXHQgICAgVE9LRU5fQ09NTUE6IFRPS0VOX0NPTU1BLFxuXHQgICAgVE9LRU5fQ09MT046IFRPS0VOX0NPTE9OLFxuXHQgICAgVE9LRU5fVElMREU6IFRPS0VOX1RJTERFLFxuXHQgICAgVE9LRU5fUElQRTogVE9LRU5fUElQRSxcblx0ICAgIFRPS0VOX0lOVDogVE9LRU5fSU5ULFxuXHQgICAgVE9LRU5fRkxPQVQ6IFRPS0VOX0ZMT0FULFxuXHQgICAgVE9LRU5fQk9PTEVBTjogVE9LRU5fQk9PTEVBTixcblx0ICAgIFRPS0VOX05PTkU6IFRPS0VOX05PTkUsXG5cdCAgICBUT0tFTl9TWU1CT0w6IFRPS0VOX1NZTUJPTCxcblx0ICAgIFRPS0VOX1NQRUNJQUw6IFRPS0VOX1NQRUNJQUwsXG5cdCAgICBUT0tFTl9SRUdFWDogVE9LRU5fUkVHRVhcblx0fTtcblxuXG4vKioqLyB9KSxcbi8qIDEwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKHByb2Nlc3MpIHsndXNlIHN0cmljdCc7XG5cblx0dmFyIGxpYiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdC8vIGpzaGludCAtVzA3OVxuXHR2YXIgT2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblxuXHRmdW5jdGlvbiB0cmF2ZXJzZUFuZENoZWNrKG9iaiwgdHlwZSwgcmVzdWx0cykge1xuXHQgICAgaWYob2JqIGluc3RhbmNlb2YgdHlwZSkge1xuXHQgICAgICAgIHJlc3VsdHMucHVzaChvYmopO1xuXHQgICAgfVxuXG5cdCAgICBpZihvYmogaW5zdGFuY2VvZiBOb2RlKSB7XG5cdCAgICAgICAgb2JqLmZpbmRBbGwodHlwZSwgcmVzdWx0cyk7XG5cdCAgICB9XG5cdH1cblxuXHR2YXIgTm9kZSA9IE9iamVjdC5leHRlbmQoJ05vZGUnLCB7XG5cdCAgICBpbml0OiBmdW5jdGlvbihsaW5lbm8sIGNvbG5vKSB7XG5cdCAgICAgICAgdGhpcy5saW5lbm8gPSBsaW5lbm87XG5cdCAgICAgICAgdGhpcy5jb2xubyA9IGNvbG5vO1xuXG5cdCAgICAgICAgdmFyIGZpZWxkcyA9IHRoaXMuZmllbGRzO1xuXHQgICAgICAgIGZvcih2YXIgaSA9IDAsIGwgPSBmaWVsZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgICAgICAgIHZhciBmaWVsZCA9IGZpZWxkc1tpXTtcblxuXHQgICAgICAgICAgICAvLyBUaGUgZmlyc3QgdHdvIGFyZ3MgYXJlIGxpbmUvY29sIG51bWJlcnMsIHNvIG9mZnNldCBieSAyXG5cdCAgICAgICAgICAgIHZhciB2YWwgPSBhcmd1bWVudHNbaSArIDJdO1xuXG5cdCAgICAgICAgICAgIC8vIEZpZWxkcyBzaG91bGQgbmV2ZXIgYmUgdW5kZWZpbmVkLCBidXQgbnVsbC4gSXQgbWFrZXNcblx0ICAgICAgICAgICAgLy8gdGVzdGluZyBlYXNpZXIgdG8gbm9ybWFsaXplIHZhbHVlcy5cblx0ICAgICAgICAgICAgaWYodmFsID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgICAgIHZhbCA9IG51bGw7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICB0aGlzW2ZpZWxkXSA9IHZhbDtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBmaW5kQWxsOiBmdW5jdGlvbih0eXBlLCByZXN1bHRzKSB7XG5cdCAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG5cblx0ICAgICAgICB2YXIgaSwgbDtcblx0ICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcblx0ICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcblxuXHQgICAgICAgICAgICBmb3IoaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHRyYXZlcnNlQW5kQ2hlY2soY2hpbGRyZW5baV0sIHR5cGUsIHJlc3VsdHMpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB2YXIgZmllbGRzID0gdGhpcy5maWVsZHM7XG5cblx0ICAgICAgICAgICAgZm9yKGkgPSAwLCBsID0gZmllbGRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgdHJhdmVyc2VBbmRDaGVjayh0aGlzW2ZpZWxkc1tpXV0sIHR5cGUsIHJlc3VsdHMpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG5cdCAgICB9LFxuXG5cdCAgICBpdGVyRmllbGRzOiBmdW5jdGlvbihmdW5jKSB7XG5cdCAgICAgICAgbGliLmVhY2godGhpcy5maWVsZHMsIGZ1bmN0aW9uKGZpZWxkKSB7XG5cdCAgICAgICAgICAgIGZ1bmModGhpc1tmaWVsZF0sIGZpZWxkKTtcblx0ICAgICAgICB9LCB0aGlzKTtcblx0ICAgIH1cblx0fSk7XG5cblx0Ly8gQWJzdHJhY3Qgbm9kZXNcblx0dmFyIFZhbHVlID0gTm9kZS5leHRlbmQoJ1ZhbHVlJywgeyBmaWVsZHM6IFsndmFsdWUnXSB9KTtcblxuXHQvLyBDb25jcmV0ZSBub2Rlc1xuXHR2YXIgTm9kZUxpc3QgPSBOb2RlLmV4dGVuZCgnTm9kZUxpc3QnLCB7XG5cdCAgICBmaWVsZHM6IFsnY2hpbGRyZW4nXSxcblxuXHQgICAgaW5pdDogZnVuY3Rpb24obGluZW5vLCBjb2xubywgbm9kZXMpIHtcblx0ICAgICAgICB0aGlzLnBhcmVudChsaW5lbm8sIGNvbG5vLCBub2RlcyB8fCBbXSk7XG5cdCAgICB9LFxuXG5cdCAgICBhZGRDaGlsZDogZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChub2RlKTtcblx0ICAgIH1cblx0fSk7XG5cblx0dmFyIFJvb3QgPSBOb2RlTGlzdC5leHRlbmQoJ1Jvb3QnKTtcblx0dmFyIExpdGVyYWwgPSBWYWx1ZS5leHRlbmQoJ0xpdGVyYWwnKTtcblx0dmFyIFN5bWJvbCA9IFZhbHVlLmV4dGVuZCgnU3ltYm9sJyk7XG5cdHZhciBHcm91cCA9IE5vZGVMaXN0LmV4dGVuZCgnR3JvdXAnKTtcblx0dmFyIEFycmF5ID0gTm9kZUxpc3QuZXh0ZW5kKCdBcnJheScpO1xuXHR2YXIgUGFpciA9IE5vZGUuZXh0ZW5kKCdQYWlyJywgeyBmaWVsZHM6IFsna2V5JywgJ3ZhbHVlJ10gfSk7XG5cdHZhciBEaWN0ID0gTm9kZUxpc3QuZXh0ZW5kKCdEaWN0Jyk7XG5cdHZhciBMb29rdXBWYWwgPSBOb2RlLmV4dGVuZCgnTG9va3VwVmFsJywgeyBmaWVsZHM6IFsndGFyZ2V0JywgJ3ZhbCddIH0pO1xuXHR2YXIgSWYgPSBOb2RlLmV4dGVuZCgnSWYnLCB7IGZpZWxkczogWydjb25kJywgJ2JvZHknLCAnZWxzZV8nXSB9KTtcblx0dmFyIElmQXN5bmMgPSBJZi5leHRlbmQoJ0lmQXN5bmMnKTtcblx0dmFyIElubGluZUlmID0gTm9kZS5leHRlbmQoJ0lubGluZUlmJywgeyBmaWVsZHM6IFsnY29uZCcsICdib2R5JywgJ2Vsc2VfJ10gfSk7XG5cdHZhciBGb3IgPSBOb2RlLmV4dGVuZCgnRm9yJywgeyBmaWVsZHM6IFsnYXJyJywgJ25hbWUnLCAnYm9keScsICdlbHNlXyddIH0pO1xuXHR2YXIgQXN5bmNFYWNoID0gRm9yLmV4dGVuZCgnQXN5bmNFYWNoJyk7XG5cdHZhciBBc3luY0FsbCA9IEZvci5leHRlbmQoJ0FzeW5jQWxsJyk7XG5cdHZhciBNYWNybyA9IE5vZGUuZXh0ZW5kKCdNYWNybycsIHsgZmllbGRzOiBbJ25hbWUnLCAnYXJncycsICdib2R5J10gfSk7XG5cdHZhciBDYWxsZXIgPSBNYWNyby5leHRlbmQoJ0NhbGxlcicpO1xuXHR2YXIgSW1wb3J0ID0gTm9kZS5leHRlbmQoJ0ltcG9ydCcsIHsgZmllbGRzOiBbJ3RlbXBsYXRlJywgJ3RhcmdldCcsICd3aXRoQ29udGV4dCddIH0pO1xuXHR2YXIgRnJvbUltcG9ydCA9IE5vZGUuZXh0ZW5kKCdGcm9tSW1wb3J0Jywge1xuXHQgICAgZmllbGRzOiBbJ3RlbXBsYXRlJywgJ25hbWVzJywgJ3dpdGhDb250ZXh0J10sXG5cblx0ICAgIGluaXQ6IGZ1bmN0aW9uKGxpbmVubywgY29sbm8sIHRlbXBsYXRlLCBuYW1lcywgd2l0aENvbnRleHQpIHtcblx0ICAgICAgICB0aGlzLnBhcmVudChsaW5lbm8sIGNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLFxuXHQgICAgICAgICAgICAgICAgICAgIG5hbWVzIHx8IG5ldyBOb2RlTGlzdCgpLCB3aXRoQ29udGV4dCk7XG5cdCAgICB9XG5cdH0pO1xuXHR2YXIgRnVuQ2FsbCA9IE5vZGUuZXh0ZW5kKCdGdW5DYWxsJywgeyBmaWVsZHM6IFsnbmFtZScsICdhcmdzJ10gfSk7XG5cdHZhciBGaWx0ZXIgPSBGdW5DYWxsLmV4dGVuZCgnRmlsdGVyJyk7XG5cdHZhciBGaWx0ZXJBc3luYyA9IEZpbHRlci5leHRlbmQoJ0ZpbHRlckFzeW5jJywge1xuXHQgICAgZmllbGRzOiBbJ25hbWUnLCAnYXJncycsICdzeW1ib2wnXVxuXHR9KTtcblx0dmFyIEtleXdvcmRBcmdzID0gRGljdC5leHRlbmQoJ0tleXdvcmRBcmdzJyk7XG5cdHZhciBCbG9jayA9IE5vZGUuZXh0ZW5kKCdCbG9jaycsIHsgZmllbGRzOiBbJ25hbWUnLCAnYm9keSddIH0pO1xuXHR2YXIgU3VwZXIgPSBOb2RlLmV4dGVuZCgnU3VwZXInLCB7IGZpZWxkczogWydibG9ja05hbWUnLCAnc3ltYm9sJ10gfSk7XG5cdHZhciBUZW1wbGF0ZVJlZiA9IE5vZGUuZXh0ZW5kKCdUZW1wbGF0ZVJlZicsIHsgZmllbGRzOiBbJ3RlbXBsYXRlJ10gfSk7XG5cdHZhciBFeHRlbmRzID0gVGVtcGxhdGVSZWYuZXh0ZW5kKCdFeHRlbmRzJyk7XG5cdHZhciBJbmNsdWRlID0gTm9kZS5leHRlbmQoJ0luY2x1ZGUnLCB7IGZpZWxkczogWyd0ZW1wbGF0ZScsICdpZ25vcmVNaXNzaW5nJ10gfSk7XG5cdHZhciBTZXQgPSBOb2RlLmV4dGVuZCgnU2V0JywgeyBmaWVsZHM6IFsndGFyZ2V0cycsICd2YWx1ZSddIH0pO1xuXHR2YXIgT3V0cHV0ID0gTm9kZUxpc3QuZXh0ZW5kKCdPdXRwdXQnKTtcblx0dmFyIENhcHR1cmUgPSBOb2RlLmV4dGVuZCgnQ2FwdHVyZScsIHsgZmllbGRzOiBbJ2JvZHknXSB9KTtcblx0dmFyIFRlbXBsYXRlRGF0YSA9IExpdGVyYWwuZXh0ZW5kKCdUZW1wbGF0ZURhdGEnKTtcblx0dmFyIFVuYXJ5T3AgPSBOb2RlLmV4dGVuZCgnVW5hcnlPcCcsIHsgZmllbGRzOiBbJ3RhcmdldCddIH0pO1xuXHR2YXIgQmluT3AgPSBOb2RlLmV4dGVuZCgnQmluT3AnLCB7IGZpZWxkczogWydsZWZ0JywgJ3JpZ2h0J10gfSk7XG5cdHZhciBJbiA9IEJpbk9wLmV4dGVuZCgnSW4nKTtcblx0dmFyIE9yID0gQmluT3AuZXh0ZW5kKCdPcicpO1xuXHR2YXIgQW5kID0gQmluT3AuZXh0ZW5kKCdBbmQnKTtcblx0dmFyIE5vdCA9IFVuYXJ5T3AuZXh0ZW5kKCdOb3QnKTtcblx0dmFyIEFkZCA9IEJpbk9wLmV4dGVuZCgnQWRkJyk7XG5cdHZhciBDb25jYXQgPSBCaW5PcC5leHRlbmQoJ0NvbmNhdCcpO1xuXHR2YXIgU3ViID0gQmluT3AuZXh0ZW5kKCdTdWInKTtcblx0dmFyIE11bCA9IEJpbk9wLmV4dGVuZCgnTXVsJyk7XG5cdHZhciBEaXYgPSBCaW5PcC5leHRlbmQoJ0RpdicpO1xuXHR2YXIgRmxvb3JEaXYgPSBCaW5PcC5leHRlbmQoJ0Zsb29yRGl2Jyk7XG5cdHZhciBNb2QgPSBCaW5PcC5leHRlbmQoJ01vZCcpO1xuXHR2YXIgUG93ID0gQmluT3AuZXh0ZW5kKCdQb3cnKTtcblx0dmFyIE5lZyA9IFVuYXJ5T3AuZXh0ZW5kKCdOZWcnKTtcblx0dmFyIFBvcyA9IFVuYXJ5T3AuZXh0ZW5kKCdQb3MnKTtcblx0dmFyIENvbXBhcmUgPSBOb2RlLmV4dGVuZCgnQ29tcGFyZScsIHsgZmllbGRzOiBbJ2V4cHInLCAnb3BzJ10gfSk7XG5cdHZhciBDb21wYXJlT3BlcmFuZCA9IE5vZGUuZXh0ZW5kKCdDb21wYXJlT3BlcmFuZCcsIHtcblx0ICAgIGZpZWxkczogWydleHByJywgJ3R5cGUnXVxuXHR9KTtcblxuXHR2YXIgQ2FsbEV4dGVuc2lvbiA9IE5vZGUuZXh0ZW5kKCdDYWxsRXh0ZW5zaW9uJywge1xuXHQgICAgZmllbGRzOiBbJ2V4dE5hbWUnLCAncHJvcCcsICdhcmdzJywgJ2NvbnRlbnRBcmdzJ10sXG5cblx0ICAgIGluaXQ6IGZ1bmN0aW9uKGV4dCwgcHJvcCwgYXJncywgY29udGVudEFyZ3MpIHtcblx0ICAgICAgICB0aGlzLmV4dE5hbWUgPSBleHQuX25hbWUgfHwgZXh0O1xuXHQgICAgICAgIHRoaXMucHJvcCA9IHByb3A7XG5cdCAgICAgICAgdGhpcy5hcmdzID0gYXJncyB8fCBuZXcgTm9kZUxpc3QoKTtcblx0ICAgICAgICB0aGlzLmNvbnRlbnRBcmdzID0gY29udGVudEFyZ3MgfHwgW107XG5cdCAgICAgICAgdGhpcy5hdXRvZXNjYXBlID0gZXh0LmF1dG9lc2NhcGU7XG5cdCAgICB9XG5cdH0pO1xuXG5cdHZhciBDYWxsRXh0ZW5zaW9uQXN5bmMgPSBDYWxsRXh0ZW5zaW9uLmV4dGVuZCgnQ2FsbEV4dGVuc2lvbkFzeW5jJyk7XG5cblx0Ly8gUHJpbnQgdGhlIEFTVCBpbiBhIG5pY2VseSBmb3JtYXR0ZWQgdHJlZSBmb3JtYXQgZm9yIGRlYnVnZ2luXG5cdGZ1bmN0aW9uIHByaW50Tm9kZXMobm9kZSwgaW5kZW50KSB7XG5cdCAgICBpbmRlbnQgPSBpbmRlbnQgfHwgMDtcblxuXHQgICAgLy8gVGhpcyBpcyBoYWNreSwgYnV0IHRoaXMgaXMganVzdCBhIGRlYnVnZ2luZyBmdW5jdGlvbiBhbnl3YXlcblx0ICAgIGZ1bmN0aW9uIHByaW50KHN0ciwgaW5kZW50LCBpbmxpbmUpIHtcblx0ICAgICAgICB2YXIgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpO1xuXG5cdCAgICAgICAgZm9yKHZhciBpPTA7IGk8bGluZXMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgaWYobGluZXNbaV0pIHtcblx0ICAgICAgICAgICAgICAgIGlmKChpbmxpbmUgJiYgaSA+IDApIHx8ICFpbmxpbmUpIHtcblx0ICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGo9MDsgajxpbmRlbnQ7IGorKykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnICcpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGlmKGkgPT09IGxpbmVzLmxlbmd0aC0xKSB7XG5cdCAgICAgICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShsaW5lc1tpXSk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShsaW5lc1tpXSArICdcXG4nKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcHJpbnQobm9kZS50eXBlbmFtZSArICc6ICcsIGluZGVudCk7XG5cblx0ICAgIGlmKG5vZGUgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuXHQgICAgICAgIHByaW50KCdcXG4nKTtcblx0ICAgICAgICBsaWIuZWFjaChub2RlLmNoaWxkcmVuLCBmdW5jdGlvbihuKSB7XG5cdCAgICAgICAgICAgIHByaW50Tm9kZXMobiwgaW5kZW50ICsgMik7XG5cdCAgICAgICAgfSk7XG5cdCAgICB9XG5cdCAgICBlbHNlIGlmKG5vZGUgaW5zdGFuY2VvZiBDYWxsRXh0ZW5zaW9uKSB7XG5cdCAgICAgICAgcHJpbnQobm9kZS5leHROYW1lICsgJy4nICsgbm9kZS5wcm9wKTtcblx0ICAgICAgICBwcmludCgnXFxuJyk7XG5cblx0ICAgICAgICBpZihub2RlLmFyZ3MpIHtcblx0ICAgICAgICAgICAgcHJpbnROb2Rlcyhub2RlLmFyZ3MsIGluZGVudCArIDIpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKG5vZGUuY29udGVudEFyZ3MpIHtcblx0ICAgICAgICAgICAgbGliLmVhY2gobm9kZS5jb250ZW50QXJncywgZnVuY3Rpb24obikge1xuXHQgICAgICAgICAgICAgICAgcHJpbnROb2RlcyhuLCBpbmRlbnQgKyAyKTtcblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgdmFyIG5vZGVzID0gbnVsbDtcblx0ICAgICAgICB2YXIgcHJvcHMgPSBudWxsO1xuXG5cdCAgICAgICAgbm9kZS5pdGVyRmllbGRzKGZ1bmN0aW9uKHZhbCwgZmllbGQpIHtcblx0ICAgICAgICAgICAgaWYodmFsIGluc3RhbmNlb2YgTm9kZSkge1xuXHQgICAgICAgICAgICAgICAgbm9kZXMgPSBub2RlcyB8fCB7fTtcblx0ICAgICAgICAgICAgICAgIG5vZGVzW2ZpZWxkXSA9IHZhbDtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHByb3BzID0gcHJvcHMgfHwge307XG5cdCAgICAgICAgICAgICAgICBwcm9wc1tmaWVsZF0gPSB2YWw7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIGlmKHByb3BzKSB7XG5cdCAgICAgICAgICAgIHByaW50KEpTT04uc3RyaW5naWZ5KHByb3BzLCBudWxsLCAyKSArICdcXG4nLCBudWxsLCB0cnVlKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHByaW50KCdcXG4nKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZihub2Rlcykge1xuXHQgICAgICAgICAgICBmb3IodmFyIGsgaW4gbm9kZXMpIHtcblx0ICAgICAgICAgICAgICAgIHByaW50Tm9kZXMobm9kZXNba10sIGluZGVudCArIDIpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICB9XG5cdH1cblxuXHQvLyB2YXIgdCA9IG5ldyBOb2RlTGlzdCgwLCAwLFxuXHQvLyAgICAgICAgICAgICAgICAgICAgICBbbmV3IFZhbHVlKDAsIDAsIDMpLFxuXHQvLyAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZhbHVlKDAsIDAsIDEwKSxcblx0Ly8gICAgICAgICAgICAgICAgICAgICAgIG5ldyBQYWlyKDAsIDAsXG5cdC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmFsdWUoMCwgMCwgJ2tleScpLFxuXHQvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZhbHVlKDAsIDAsICd2YWx1ZScpKV0pO1xuXHQvLyBwcmludE5vZGVzKHQpO1xuXG5cdG1vZHVsZS5leHBvcnRzID0ge1xuXHQgICAgTm9kZTogTm9kZSxcblx0ICAgIFJvb3Q6IFJvb3QsXG5cdCAgICBOb2RlTGlzdDogTm9kZUxpc3QsXG5cdCAgICBWYWx1ZTogVmFsdWUsXG5cdCAgICBMaXRlcmFsOiBMaXRlcmFsLFxuXHQgICAgU3ltYm9sOiBTeW1ib2wsXG5cdCAgICBHcm91cDogR3JvdXAsXG5cdCAgICBBcnJheTogQXJyYXksXG5cdCAgICBQYWlyOiBQYWlyLFxuXHQgICAgRGljdDogRGljdCxcblx0ICAgIE91dHB1dDogT3V0cHV0LFxuXHQgICAgQ2FwdHVyZTogQ2FwdHVyZSxcblx0ICAgIFRlbXBsYXRlRGF0YTogVGVtcGxhdGVEYXRhLFxuXHQgICAgSWY6IElmLFxuXHQgICAgSWZBc3luYzogSWZBc3luYyxcblx0ICAgIElubGluZUlmOiBJbmxpbmVJZixcblx0ICAgIEZvcjogRm9yLFxuXHQgICAgQXN5bmNFYWNoOiBBc3luY0VhY2gsXG5cdCAgICBBc3luY0FsbDogQXN5bmNBbGwsXG5cdCAgICBNYWNybzogTWFjcm8sXG5cdCAgICBDYWxsZXI6IENhbGxlcixcblx0ICAgIEltcG9ydDogSW1wb3J0LFxuXHQgICAgRnJvbUltcG9ydDogRnJvbUltcG9ydCxcblx0ICAgIEZ1bkNhbGw6IEZ1bkNhbGwsXG5cdCAgICBGaWx0ZXI6IEZpbHRlcixcblx0ICAgIEZpbHRlckFzeW5jOiBGaWx0ZXJBc3luYyxcblx0ICAgIEtleXdvcmRBcmdzOiBLZXl3b3JkQXJncyxcblx0ICAgIEJsb2NrOiBCbG9jayxcblx0ICAgIFN1cGVyOiBTdXBlcixcblx0ICAgIEV4dGVuZHM6IEV4dGVuZHMsXG5cdCAgICBJbmNsdWRlOiBJbmNsdWRlLFxuXHQgICAgU2V0OiBTZXQsXG5cdCAgICBMb29rdXBWYWw6IExvb2t1cFZhbCxcblx0ICAgIEJpbk9wOiBCaW5PcCxcblx0ICAgIEluOiBJbixcblx0ICAgIE9yOiBPcixcblx0ICAgIEFuZDogQW5kLFxuXHQgICAgTm90OiBOb3QsXG5cdCAgICBBZGQ6IEFkZCxcblx0ICAgIENvbmNhdDogQ29uY2F0LFxuXHQgICAgU3ViOiBTdWIsXG5cdCAgICBNdWw6IE11bCxcblx0ICAgIERpdjogRGl2LFxuXHQgICAgRmxvb3JEaXY6IEZsb29yRGl2LFxuXHQgICAgTW9kOiBNb2QsXG5cdCAgICBQb3c6IFBvdyxcblx0ICAgIE5lZzogTmVnLFxuXHQgICAgUG9zOiBQb3MsXG5cdCAgICBDb21wYXJlOiBDb21wYXJlLFxuXHQgICAgQ29tcGFyZU9wZXJhbmQ6IENvbXBhcmVPcGVyYW5kLFxuXG5cdCAgICBDYWxsRXh0ZW5zaW9uOiBDYWxsRXh0ZW5zaW9uLFxuXHQgICAgQ2FsbEV4dGVuc2lvbkFzeW5jOiBDYWxsRXh0ZW5zaW9uQXN5bmMsXG5cblx0ICAgIHByaW50Tm9kZXM6IHByaW50Tm9kZXNcblx0fTtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygxMSkpKVxuXG4vKioqLyB9KSxcbi8qIDExICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XG5cbi8qKiovIH0pLFxuLyogMTIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIG5vZGVzID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMCk7XG5cdHZhciBsaWIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXG5cdHZhciBzeW0gPSAwO1xuXHRmdW5jdGlvbiBnZW5zeW0oKSB7XG5cdCAgICByZXR1cm4gJ2hvbGVfJyArIHN5bSsrO1xuXHR9XG5cblx0Ly8gY29weS1vbi13cml0ZSB2ZXJzaW9uIG9mIG1hcFxuXHRmdW5jdGlvbiBtYXBDT1coYXJyLCBmdW5jKSB7XG5cdCAgICB2YXIgcmVzID0gbnVsbDtcblxuXHQgICAgZm9yKHZhciBpPTA7IGk8YXJyLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgdmFyIGl0ZW0gPSBmdW5jKGFycltpXSk7XG5cblx0ICAgICAgICBpZihpdGVtICE9PSBhcnJbaV0pIHtcblx0ICAgICAgICAgICAgaWYoIXJlcykge1xuXHQgICAgICAgICAgICAgICAgcmVzID0gYXJyLnNsaWNlKCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXNbaV0gPSBpdGVtO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHJlcyB8fCBhcnI7XG5cdH1cblxuXHRmdW5jdGlvbiB3YWxrKGFzdCwgZnVuYywgZGVwdGhGaXJzdCkge1xuXHQgICAgaWYoIShhc3QgaW5zdGFuY2VvZiBub2Rlcy5Ob2RlKSkge1xuXHQgICAgICAgIHJldHVybiBhc3Q7XG5cdCAgICB9XG5cblx0ICAgIGlmKCFkZXB0aEZpcnN0KSB7XG5cdCAgICAgICAgdmFyIGFzdFQgPSBmdW5jKGFzdCk7XG5cblx0ICAgICAgICBpZihhc3RUICYmIGFzdFQgIT09IGFzdCkge1xuXHQgICAgICAgICAgICByZXR1cm4gYXN0VDtcblx0ICAgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGlmKGFzdCBpbnN0YW5jZW9mIG5vZGVzLk5vZGVMaXN0KSB7XG5cdCAgICAgICAgdmFyIGNoaWxkcmVuID0gbWFwQ09XKGFzdC5jaGlsZHJlbiwgZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgICAgICByZXR1cm4gd2Fsayhub2RlLCBmdW5jLCBkZXB0aEZpcnN0KTtcblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIGlmKGNoaWxkcmVuICE9PSBhc3QuY2hpbGRyZW4pIHtcblx0ICAgICAgICAgICAgYXN0ID0gbmV3IG5vZGVzW2FzdC50eXBlbmFtZV0oYXN0LmxpbmVubywgYXN0LmNvbG5vLCBjaGlsZHJlbik7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXHQgICAgZWxzZSBpZihhc3QgaW5zdGFuY2VvZiBub2Rlcy5DYWxsRXh0ZW5zaW9uKSB7XG5cdCAgICAgICAgdmFyIGFyZ3MgPSB3YWxrKGFzdC5hcmdzLCBmdW5jLCBkZXB0aEZpcnN0KTtcblxuXHQgICAgICAgIHZhciBjb250ZW50QXJncyA9IG1hcENPVyhhc3QuY29udGVudEFyZ3MsIGZ1bmN0aW9uKG5vZGUpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHdhbGsobm9kZSwgZnVuYywgZGVwdGhGaXJzdCk7XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICBpZihhcmdzICE9PSBhc3QuYXJncyB8fCBjb250ZW50QXJncyAhPT0gYXN0LmNvbnRlbnRBcmdzKSB7XG5cdCAgICAgICAgICAgIGFzdCA9IG5ldyBub2Rlc1thc3QudHlwZW5hbWVdKGFzdC5leHROYW1lLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3QucHJvcCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJncyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEFyZ3MpO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIHZhciBwcm9wcyA9IGFzdC5maWVsZHMubWFwKGZ1bmN0aW9uKGZpZWxkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBhc3RbZmllbGRdO1xuXHQgICAgICAgIH0pO1xuXG5cdCAgICAgICAgdmFyIHByb3BzVCA9IG1hcENPVyhwcm9wcywgZnVuY3Rpb24ocHJvcCkge1xuXHQgICAgICAgICAgICByZXR1cm4gd2Fsayhwcm9wLCBmdW5jLCBkZXB0aEZpcnN0KTtcblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIGlmKHByb3BzVCAhPT0gcHJvcHMpIHtcblx0ICAgICAgICAgICAgYXN0ID0gbmV3IG5vZGVzW2FzdC50eXBlbmFtZV0oYXN0LmxpbmVubywgYXN0LmNvbG5vKTtcblxuXHQgICAgICAgICAgICBwcm9wc1QuZm9yRWFjaChmdW5jdGlvbihwcm9wLCBpKSB7XG5cdCAgICAgICAgICAgICAgICBhc3RbYXN0LmZpZWxkc1tpXV0gPSBwcm9wO1xuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBkZXB0aEZpcnN0ID8gKGZ1bmMoYXN0KSB8fCBhc3QpIDogYXN0O1xuXHR9XG5cblx0ZnVuY3Rpb24gZGVwdGhXYWxrKGFzdCwgZnVuYykge1xuXHQgICAgcmV0dXJuIHdhbGsoYXN0LCBmdW5jLCB0cnVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9saWZ0RmlsdGVycyhub2RlLCBhc3luY0ZpbHRlcnMsIHByb3ApIHtcblx0ICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuXG5cdCAgICB2YXIgd2Fsa2VkID0gZGVwdGhXYWxrKHByb3AgPyBub2RlW3Byb3BdIDogbm9kZSwgZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgIGlmKG5vZGUgaW5zdGFuY2VvZiBub2Rlcy5CbG9jaykge1xuXHQgICAgICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZigobm9kZSBpbnN0YW5jZW9mIG5vZGVzLkZpbHRlciAmJlxuXHQgICAgICAgICAgICAgICAgIGxpYi5pbmRleE9mKGFzeW5jRmlsdGVycywgbm9kZS5uYW1lLnZhbHVlKSAhPT0gLTEpIHx8XG5cdCAgICAgICAgICAgICAgICBub2RlIGluc3RhbmNlb2Ygbm9kZXMuQ2FsbEV4dGVuc2lvbkFzeW5jKSB7XG5cdCAgICAgICAgICAgIHZhciBzeW1ib2wgPSBuZXcgbm9kZXMuU3ltYm9sKG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5zeW0oKSk7XG5cblx0ICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXcgbm9kZXMuRmlsdGVyQXN5bmMobm9kZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUubmFtZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5hcmdzLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeW1ib2wpKTtcblx0ICAgICAgICAgICAgcmV0dXJuIHN5bWJvbDtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgaWYocHJvcCkge1xuXHQgICAgICAgIG5vZGVbcHJvcF0gPSB3YWxrZWQ7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICBub2RlID0gd2Fsa2VkO1xuXHQgICAgfVxuXG5cdCAgICBpZihjaGlsZHJlbi5sZW5ndGgpIHtcblx0ICAgICAgICBjaGlsZHJlbi5wdXNoKG5vZGUpO1xuXG5cdCAgICAgICAgcmV0dXJuIG5ldyBub2Rlcy5Ob2RlTGlzdChcblx0ICAgICAgICAgICAgbm9kZS5saW5lbm8sXG5cdCAgICAgICAgICAgIG5vZGUuY29sbm8sXG5cdCAgICAgICAgICAgIGNoaWxkcmVuXG5cdCAgICAgICAgKTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gbGlmdEZpbHRlcnMoYXN0LCBhc3luY0ZpbHRlcnMpIHtcblx0ICAgIHJldHVybiBkZXB0aFdhbGsoYXN0LCBmdW5jdGlvbihub2RlKSB7XG5cdCAgICAgICAgaWYobm9kZSBpbnN0YW5jZW9mIG5vZGVzLk91dHB1dCkge1xuXHQgICAgICAgICAgICByZXR1cm4gX2xpZnRGaWx0ZXJzKG5vZGUsIGFzeW5jRmlsdGVycyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYobm9kZSBpbnN0YW5jZW9mIG5vZGVzLlNldCkge1xuXHQgICAgICAgICAgICByZXR1cm4gX2xpZnRGaWx0ZXJzKG5vZGUsIGFzeW5jRmlsdGVycywgJ3ZhbHVlJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYobm9kZSBpbnN0YW5jZW9mIG5vZGVzLkZvcikge1xuXHQgICAgICAgICAgICByZXR1cm4gX2xpZnRGaWx0ZXJzKG5vZGUsIGFzeW5jRmlsdGVycywgJ2FycicpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKG5vZGUgaW5zdGFuY2VvZiBub2Rlcy5JZikge1xuXHQgICAgICAgICAgICByZXR1cm4gX2xpZnRGaWx0ZXJzKG5vZGUsIGFzeW5jRmlsdGVycywgJ2NvbmQnKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZihub2RlIGluc3RhbmNlb2Ygbm9kZXMuQ2FsbEV4dGVuc2lvbikge1xuXHQgICAgICAgICAgICByZXR1cm4gX2xpZnRGaWx0ZXJzKG5vZGUsIGFzeW5jRmlsdGVycywgJ2FyZ3MnKTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGxpZnRTdXBlcihhc3QpIHtcblx0ICAgIHJldHVybiB3YWxrKGFzdCwgZnVuY3Rpb24oYmxvY2tOb2RlKSB7XG5cdCAgICAgICAgaWYoIShibG9ja05vZGUgaW5zdGFuY2VvZiBub2Rlcy5CbG9jaykpIHtcblx0ICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBoYXNTdXBlciA9IGZhbHNlO1xuXHQgICAgICAgIHZhciBzeW1ib2wgPSBnZW5zeW0oKTtcblxuXHQgICAgICAgIGJsb2NrTm9kZS5ib2R5ID0gd2FsayhibG9ja05vZGUuYm9keSwgZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgICAgICBpZihub2RlIGluc3RhbmNlb2Ygbm9kZXMuRnVuQ2FsbCAmJlxuXHQgICAgICAgICAgICAgICBub2RlLm5hbWUudmFsdWUgPT09ICdzdXBlcicpIHtcblx0ICAgICAgICAgICAgICAgIGhhc1N1cGVyID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBuZXcgbm9kZXMuU3ltYm9sKG5vZGUubGluZW5vLCBub2RlLmNvbG5vLCBzeW1ib2wpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICBpZihoYXNTdXBlcikge1xuXHQgICAgICAgICAgICBibG9ja05vZGUuYm9keS5jaGlsZHJlbi51bnNoaWZ0KG5ldyBub2Rlcy5TdXBlcihcblx0ICAgICAgICAgICAgICAgIDAsIDAsIGJsb2NrTm9kZS5uYW1lLCBuZXcgbm9kZXMuU3ltYm9sKDAsIDAsIHN5bWJvbClcblx0ICAgICAgICAgICAgKSk7XG5cdCAgICAgICAgfVxuXHQgICAgfSk7XG5cdH1cblxuXHRmdW5jdGlvbiBjb252ZXJ0U3RhdGVtZW50cyhhc3QpIHtcblx0ICAgIHJldHVybiBkZXB0aFdhbGsoYXN0LCBmdW5jdGlvbihub2RlKSB7XG5cdCAgICAgICAgaWYoIShub2RlIGluc3RhbmNlb2Ygbm9kZXMuSWYpICYmXG5cdCAgICAgICAgICAgIShub2RlIGluc3RhbmNlb2Ygbm9kZXMuRm9yKSkge1xuXHQgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIGFzeW5jID0gZmFsc2U7XG5cdCAgICAgICAgd2Fsayhub2RlLCBmdW5jdGlvbihub2RlKSB7XG5cdCAgICAgICAgICAgIGlmKG5vZGUgaW5zdGFuY2VvZiBub2Rlcy5GaWx0ZXJBc3luYyB8fFxuXHQgICAgICAgICAgICAgICBub2RlIGluc3RhbmNlb2Ygbm9kZXMuSWZBc3luYyB8fFxuXHQgICAgICAgICAgICAgICBub2RlIGluc3RhbmNlb2Ygbm9kZXMuQXN5bmNFYWNoIHx8XG5cdCAgICAgICAgICAgICAgIG5vZGUgaW5zdGFuY2VvZiBub2Rlcy5Bc3luY0FsbCB8fFxuXHQgICAgICAgICAgICAgICBub2RlIGluc3RhbmNlb2Ygbm9kZXMuQ2FsbEV4dGVuc2lvbkFzeW5jKSB7XG5cdCAgICAgICAgICAgICAgICBhc3luYyA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAvLyBTdG9wIGl0ZXJhdGluZyBieSByZXR1cm5pbmcgdGhlIG5vZGVcblx0ICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICBpZihhc3luYykge1xuXHRcdCAgICAgICAgaWYobm9kZSBpbnN0YW5jZW9mIG5vZGVzLklmKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbmV3IG5vZGVzLklmQXN5bmMoXG5cdCAgICAgICAgICAgICAgICAgICAgbm9kZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICBub2RlLmNvbmQsXG5cdCAgICAgICAgICAgICAgICAgICAgbm9kZS5ib2R5LFxuXHQgICAgICAgICAgICAgICAgICAgIG5vZGUuZWxzZV9cblx0ICAgICAgICAgICAgICAgICk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSBpZihub2RlIGluc3RhbmNlb2Ygbm9kZXMuRm9yKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbmV3IG5vZGVzLkFzeW5jRWFjaChcblx0ICAgICAgICAgICAgICAgICAgICBub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgIG5vZGUuYXJyLFxuXHQgICAgICAgICAgICAgICAgICAgIG5vZGUubmFtZSxcblx0ICAgICAgICAgICAgICAgICAgICBub2RlLmJvZHksXG5cdCAgICAgICAgICAgICAgICAgICAgbm9kZS5lbHNlX1xuXHQgICAgICAgICAgICAgICAgKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gY3BzKGFzdCwgYXN5bmNGaWx0ZXJzKSB7XG5cdCAgICByZXR1cm4gY29udmVydFN0YXRlbWVudHMobGlmdFN1cGVyKGxpZnRGaWx0ZXJzKGFzdCwgYXN5bmNGaWx0ZXJzKSkpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdHJhbnNmb3JtKGFzdCwgYXN5bmNGaWx0ZXJzKSB7XG5cdCAgICByZXR1cm4gY3BzKGFzdCwgYXN5bmNGaWx0ZXJzIHx8IFtdKTtcblx0fVxuXG5cdC8vIHZhciBwYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcicpO1xuXHQvLyB2YXIgc3JjID0gJ2hlbGxvIHslIGZvbyAlfXslIGVuZGZvbyAlfSBlbmQnO1xuXHQvLyB2YXIgYXN0ID0gdHJhbnNmb3JtKHBhcnNlci5wYXJzZShzcmMsIFtuZXcgRm9vRXh0ZW5zaW9uKCldKSwgWydiYXInXSk7XG5cdC8vIG5vZGVzLnByaW50Tm9kZXMoYXN0KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0ICAgIHRyYW5zZm9ybTogdHJhbnNmb3JtXG5cdH07XG5cblxuLyoqKi8gfSksXG4vKiAxMyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgbGliID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblx0dmFyIE9iaiA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0Ly8gRnJhbWVzIGtlZXAgdHJhY2sgb2Ygc2NvcGluZyBib3RoIGF0IGNvbXBpbGUtdGltZSBhbmQgcnVuLXRpbWUgc29cblx0Ly8gd2Uga25vdyBob3cgdG8gYWNjZXNzIHZhcmlhYmxlcy4gQmxvY2sgdGFncyBjYW4gaW50cm9kdWNlIHNwZWNpYWxcblx0Ly8gdmFyaWFibGVzLCBmb3IgZXhhbXBsZS5cblx0dmFyIEZyYW1lID0gT2JqLmV4dGVuZCh7XG5cdCAgICBpbml0OiBmdW5jdGlvbihwYXJlbnQsIGlzb2xhdGVXcml0ZXMpIHtcblx0ICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IHt9O1xuXHQgICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXHQgICAgICAgIHRoaXMudG9wTGV2ZWwgPSBmYWxzZTtcblx0ICAgICAgICAvLyBpZiB0aGlzIGlzIHRydWUsIHdyaXRlcyAoc2V0KSBzaG91bGQgbmV2ZXIgcHJvcGFnYXRlIHVwd2FyZHMgcGFzdFxuXHQgICAgICAgIC8vIHRoaXMgZnJhbWUgdG8gaXRzIHBhcmVudCAodGhvdWdoIHJlYWRzIG1heSkuXG5cdCAgICAgICAgdGhpcy5pc29sYXRlV3JpdGVzID0gaXNvbGF0ZVdyaXRlcztcblx0ICAgIH0sXG5cblx0ICAgIHNldDogZnVuY3Rpb24obmFtZSwgdmFsLCByZXNvbHZlVXApIHtcblx0ICAgICAgICAvLyBBbGxvdyB2YXJpYWJsZXMgd2l0aCBkb3RzIGJ5IGF1dG9tYXRpY2FsbHkgY3JlYXRpbmcgdGhlXG5cdCAgICAgICAgLy8gbmVzdGVkIHN0cnVjdHVyZVxuXHQgICAgICAgIHZhciBwYXJ0cyA9IG5hbWUuc3BsaXQoJy4nKTtcblx0ICAgICAgICB2YXIgb2JqID0gdGhpcy52YXJpYWJsZXM7XG5cdCAgICAgICAgdmFyIGZyYW1lID0gdGhpcztcblxuXHQgICAgICAgIGlmKHJlc29sdmVVcCkge1xuXHQgICAgICAgICAgICBpZigoZnJhbWUgPSB0aGlzLnJlc29sdmUocGFydHNbMF0sIHRydWUpKSkge1xuXHQgICAgICAgICAgICAgICAgZnJhbWUuc2V0KG5hbWUsIHZhbCk7XG5cdCAgICAgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBmb3IodmFyIGk9MDsgaTxwYXJ0cy5sZW5ndGggLSAxOyBpKyspIHtcblx0ICAgICAgICAgICAgdmFyIGlkID0gcGFydHNbaV07XG5cblx0ICAgICAgICAgICAgaWYoIW9ialtpZF0pIHtcblx0ICAgICAgICAgICAgICAgIG9ialtpZF0gPSB7fTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBvYmogPSBvYmpbaWRdO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIG9ialtwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXV0gPSB2YWw7XG5cdCAgICB9LFxuXG5cdCAgICBnZXQ6IGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICB2YXIgdmFsID0gdGhpcy52YXJpYWJsZXNbbmFtZV07XG5cdCAgICAgICAgaWYodmFsICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHZhbDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9LFxuXG5cdCAgICBsb29rdXA6IGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICB2YXIgcCA9IHRoaXMucGFyZW50O1xuXHQgICAgICAgIHZhciB2YWwgPSB0aGlzLnZhcmlhYmxlc1tuYW1lXTtcblx0ICAgICAgICBpZih2YWwgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gdmFsO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gcCAmJiBwLmxvb2t1cChuYW1lKTtcblx0ICAgIH0sXG5cblx0ICAgIHJlc29sdmU6IGZ1bmN0aW9uKG5hbWUsIGZvcldyaXRlKSB7XG5cdCAgICAgICAgdmFyIHAgPSAoZm9yV3JpdGUgJiYgdGhpcy5pc29sYXRlV3JpdGVzKSA/IHVuZGVmaW5lZCA6IHRoaXMucGFyZW50O1xuXHQgICAgICAgIHZhciB2YWwgPSB0aGlzLnZhcmlhYmxlc1tuYW1lXTtcblx0ICAgICAgICBpZih2YWwgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIHAgJiYgcC5yZXNvbHZlKG5hbWUpO1xuXHQgICAgfSxcblxuXHQgICAgcHVzaDogZnVuY3Rpb24oaXNvbGF0ZVdyaXRlcykge1xuXHQgICAgICAgIHJldHVybiBuZXcgRnJhbWUodGhpcywgaXNvbGF0ZVdyaXRlcyk7XG5cdCAgICB9LFxuXG5cdCAgICBwb3A6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLnBhcmVudDtcblx0ICAgIH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gbWFrZU1hY3JvKGFyZ05hbWVzLCBrd2FyZ05hbWVzLCBmdW5jKSB7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIGFyZ0NvdW50ID0gbnVtQXJncyhhcmd1bWVudHMpO1xuXHQgICAgICAgIHZhciBhcmdzO1xuXHQgICAgICAgIHZhciBrd2FyZ3MgPSBnZXRLZXl3b3JkQXJncyhhcmd1bWVudHMpO1xuXHQgICAgICAgIHZhciBpO1xuXG5cdCAgICAgICAgaWYoYXJnQ291bnQgPiBhcmdOYW1lcy5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCwgYXJnTmFtZXMubGVuZ3RoKTtcblxuXHQgICAgICAgICAgICAvLyBQb3NpdGlvbmFsIGFyZ3VtZW50cyB0aGF0IHNob3VsZCBiZSBwYXNzZWQgaW4gYXNcblx0ICAgICAgICAgICAgLy8ga2V5d29yZCBhcmd1bWVudHMgKGVzc2VudGlhbGx5IGRlZmF1bHQgdmFsdWVzKVxuXHQgICAgICAgICAgICB2YXIgdmFscyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgYXJncy5sZW5ndGgsIGFyZ0NvdW50KTtcblx0ICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgdmFscy5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgaWYoaSA8IGt3YXJnTmFtZXMubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAga3dhcmdzW2t3YXJnTmFtZXNbaV1dID0gdmFsc1tpXTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGFyZ3MucHVzaChrd2FyZ3MpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKGFyZ0NvdW50IDwgYXJnTmFtZXMubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDAsIGFyZ0NvdW50KTtcblxuXHQgICAgICAgICAgICBmb3IoaSA9IGFyZ0NvdW50OyBpIDwgYXJnTmFtZXMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHZhciBhcmcgPSBhcmdOYW1lc1tpXTtcblxuXHQgICAgICAgICAgICAgICAgLy8gS2V5d29yZCBhcmd1bWVudHMgdGhhdCBzaG91bGQgYmUgcGFzc2VkIGFzXG5cdCAgICAgICAgICAgICAgICAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50cywgaS5lLiB0aGUgY2FsbGVyIGV4cGxpY2l0bHlcblx0ICAgICAgICAgICAgICAgIC8vIHVzZWQgdGhlIG5hbWUgb2YgYSBwb3NpdGlvbmFsIGFyZ1xuXHQgICAgICAgICAgICAgICAgYXJncy5wdXNoKGt3YXJnc1thcmddKTtcblx0ICAgICAgICAgICAgICAgIGRlbGV0ZSBrd2FyZ3NbYXJnXTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGFyZ3MucHVzaChrd2FyZ3MpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcblx0ICAgIH07XG5cdH1cblxuXHRmdW5jdGlvbiBtYWtlS2V5d29yZEFyZ3Mob2JqKSB7XG5cdCAgICBvYmouX19rZXl3b3JkcyA9IHRydWU7XG5cdCAgICByZXR1cm4gb2JqO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0S2V5d29yZEFyZ3MoYXJncykge1xuXHQgICAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuXHQgICAgaWYobGVuKSB7XG5cdCAgICAgICAgdmFyIGxhc3RBcmcgPSBhcmdzW2xlbiAtIDFdO1xuXHQgICAgICAgIGlmKGxhc3RBcmcgJiYgbGFzdEFyZy5oYXNPd25Qcm9wZXJ0eSgnX19rZXl3b3JkcycpKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBsYXN0QXJnO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiB7fTtcblx0fVxuXG5cdGZ1bmN0aW9uIG51bUFyZ3MoYXJncykge1xuXHQgICAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuXHQgICAgaWYobGVuID09PSAwKSB7XG5cdCAgICAgICAgcmV0dXJuIDA7XG5cdCAgICB9XG5cblx0ICAgIHZhciBsYXN0QXJnID0gYXJnc1tsZW4gLSAxXTtcblx0ICAgIGlmKGxhc3RBcmcgJiYgbGFzdEFyZy5oYXNPd25Qcm9wZXJ0eSgnX19rZXl3b3JkcycpKSB7XG5cdCAgICAgICAgcmV0dXJuIGxlbiAtIDE7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gbGVuO1xuXHQgICAgfVxuXHR9XG5cblx0Ly8gQSBTYWZlU3RyaW5nIG9iamVjdCBpbmRpY2F0ZXMgdGhhdCB0aGUgc3RyaW5nIHNob3VsZCBub3QgYmVcblx0Ly8gYXV0b2VzY2FwZWQuIFRoaXMgaGFwcGVucyBtYWdpY2FsbHkgYmVjYXVzZSBhdXRvZXNjYXBpbmcgb25seVxuXHQvLyBvY2N1cnMgb24gcHJpbWl0aXZlIHN0cmluZyBvYmplY3RzLlxuXHRmdW5jdGlvbiBTYWZlU3RyaW5nKHZhbCkge1xuXHQgICAgaWYodHlwZW9mIHZhbCAhPT0gJ3N0cmluZycpIHtcblx0ICAgICAgICByZXR1cm4gdmFsO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLnZhbCA9IHZhbDtcblx0ICAgIHRoaXMubGVuZ3RoID0gdmFsLmxlbmd0aDtcblx0fVxuXG5cdFNhZmVTdHJpbmcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTdHJpbmcucHJvdG90eXBlLCB7XG5cdCAgICBsZW5ndGg6IHsgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IDAgfVxuXHR9KTtcblx0U2FmZVN0cmluZy5wcm90b3R5cGUudmFsdWVPZiA9IGZ1bmN0aW9uKCkge1xuXHQgICAgcmV0dXJuIHRoaXMudmFsO1xuXHR9O1xuXHRTYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHQgICAgcmV0dXJuIHRoaXMudmFsO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGNvcHlTYWZlbmVzcyhkZXN0LCB0YXJnZXQpIHtcblx0ICAgIGlmKGRlc3QgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG5cdCAgICAgICAgcmV0dXJuIG5ldyBTYWZlU3RyaW5nKHRhcmdldCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGFyZ2V0LnRvU3RyaW5nKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBtYXJrU2FmZSh2YWwpIHtcblx0ICAgIHZhciB0eXBlID0gdHlwZW9mIHZhbDtcblxuXHQgICAgaWYodHlwZSA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgICByZXR1cm4gbmV3IFNhZmVTdHJpbmcodmFsKTtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYodHlwZSAhPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgIHJldHVybiB2YWw7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgIHZhciByZXQgPSB2YWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuXHQgICAgICAgICAgICBpZih0eXBlb2YgcmV0ID09PSAnc3RyaW5nJykge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTYWZlU3RyaW5nKHJldCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gcmV0O1xuXHQgICAgICAgIH07XG5cdCAgICB9XG5cdH1cblxuXHRmdW5jdGlvbiBzdXBwcmVzc1ZhbHVlKHZhbCwgYXV0b2VzY2FwZSkge1xuXHQgICAgdmFsID0gKHZhbCAhPT0gdW5kZWZpbmVkICYmIHZhbCAhPT0gbnVsbCkgPyB2YWwgOiAnJztcblxuXHQgICAgaWYoYXV0b2VzY2FwZSAmJiAhKHZhbCBpbnN0YW5jZW9mIFNhZmVTdHJpbmcpKSB7XG5cdCAgICAgICAgdmFsID0gbGliLmVzY2FwZSh2YWwudG9TdHJpbmcoKSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB2YWw7XG5cdH1cblxuXHRmdW5jdGlvbiBlbnN1cmVEZWZpbmVkKHZhbCwgbGluZW5vLCBjb2xubykge1xuXHQgICAgaWYodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IGxpYi5UZW1wbGF0ZUVycm9yKFxuXHQgICAgICAgICAgICAnYXR0ZW1wdGVkIHRvIG91dHB1dCBudWxsIG9yIHVuZGVmaW5lZCB2YWx1ZScsXG5cdCAgICAgICAgICAgIGxpbmVubyArIDEsXG5cdCAgICAgICAgICAgIGNvbG5vICsgMVxuXHQgICAgICAgICk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdmFsO1xuXHR9XG5cblx0ZnVuY3Rpb24gbWVtYmVyTG9va3VwKG9iaiwgdmFsKSB7XG5cdCAgICBvYmogPSBvYmogfHwge307XG5cblx0ICAgIGlmKHR5cGVvZiBvYmpbdmFsXSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIG9ialt2YWxdLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcblx0ICAgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gb2JqW3ZhbF07XG5cdH1cblxuXHRmdW5jdGlvbiBjYWxsV3JhcChvYmosIG5hbWUsIGNvbnRleHQsIGFyZ3MpIHtcblx0ICAgIGlmKCFvYmopIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjYWxsIGAnICsgbmFtZSArICdgLCB3aGljaCBpcyB1bmRlZmluZWQgb3IgZmFsc2V5Jyk7XG5cdCAgICB9XG5cdCAgICBlbHNlIGlmKHR5cGVvZiBvYmogIT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjYWxsIGAnICsgbmFtZSArICdgLCB3aGljaCBpcyBub3QgYSBmdW5jdGlvbicpO1xuXHQgICAgfVxuXG5cdCAgICAvLyBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlXG5cdCAgICByZXR1cm4gb2JqLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY29udGV4dE9yRnJhbWVMb29rdXAoY29udGV4dCwgZnJhbWUsIG5hbWUpIHtcblx0ICAgIHZhciB2YWwgPSBmcmFtZS5sb29rdXAobmFtZSk7XG5cdCAgICByZXR1cm4gKHZhbCAhPT0gdW5kZWZpbmVkKSA/XG5cdCAgICAgICAgdmFsIDpcblx0ICAgICAgICBjb250ZXh0Lmxvb2t1cChuYW1lKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycm9yLCBsaW5lbm8sIGNvbG5vKSB7XG5cdCAgICBpZihlcnJvci5saW5lbm8pIHtcblx0ICAgICAgICByZXR1cm4gZXJyb3I7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gbmV3IGxpYi5UZW1wbGF0ZUVycm9yKGVycm9yLCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIGFzeW5jRWFjaChhcnIsIGRpbWVuLCBpdGVyLCBjYikge1xuXHQgICAgaWYobGliLmlzQXJyYXkoYXJyKSkge1xuXHQgICAgICAgIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuXG5cdCAgICAgICAgbGliLmFzeW5jSXRlcihhcnIsIGZ1bmN0aW9uKGl0ZW0sIGksIG5leHQpIHtcblx0ICAgICAgICAgICAgc3dpdGNoKGRpbWVuKSB7XG5cdCAgICAgICAgICAgIGNhc2UgMTogaXRlcihpdGVtLCBpLCBsZW4sIG5leHQpOyBicmVhaztcblx0ICAgICAgICAgICAgY2FzZSAyOiBpdGVyKGl0ZW1bMF0sIGl0ZW1bMV0sIGksIGxlbiwgbmV4dCk7IGJyZWFrO1xuXHQgICAgICAgICAgICBjYXNlIDM6IGl0ZXIoaXRlbVswXSwgaXRlbVsxXSwgaXRlbVsyXSwgaSwgbGVuLCBuZXh0KTsgYnJlYWs7XG5cdCAgICAgICAgICAgIGRlZmF1bHQ6XG5cdCAgICAgICAgICAgICAgICBpdGVtLnB1c2goaSwgbmV4dCk7XG5cdCAgICAgICAgICAgICAgICBpdGVyLmFwcGx5KHRoaXMsIGl0ZW0pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSwgY2IpO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgbGliLmFzeW5jRm9yKGFyciwgZnVuY3Rpb24oa2V5LCB2YWwsIGksIGxlbiwgbmV4dCkge1xuXHQgICAgICAgICAgICBpdGVyKGtleSwgdmFsLCBpLCBsZW4sIG5leHQpO1xuXHQgICAgICAgIH0sIGNiKTtcblx0ICAgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIGFzeW5jQWxsKGFyciwgZGltZW4sIGZ1bmMsIGNiKSB7XG5cdCAgICB2YXIgZmluaXNoZWQgPSAwO1xuXHQgICAgdmFyIGxlbiwgaTtcblx0ICAgIHZhciBvdXRwdXRBcnI7XG5cblx0ICAgIGZ1bmN0aW9uIGRvbmUoaSwgb3V0cHV0KSB7XG5cdCAgICAgICAgZmluaXNoZWQrKztcblx0ICAgICAgICBvdXRwdXRBcnJbaV0gPSBvdXRwdXQ7XG5cblx0ICAgICAgICBpZihmaW5pc2hlZCA9PT0gbGVuKSB7XG5cdCAgICAgICAgICAgIGNiKG51bGwsIG91dHB1dEFyci5qb2luKCcnKSk7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBpZihsaWIuaXNBcnJheShhcnIpKSB7XG5cdCAgICAgICAgbGVuID0gYXJyLmxlbmd0aDtcblx0ICAgICAgICBvdXRwdXRBcnIgPSBuZXcgQXJyYXkobGVuKTtcblxuXHQgICAgICAgIGlmKGxlbiA9PT0gMCkge1xuXHQgICAgICAgICAgICBjYihudWxsLCAnJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHZhciBpdGVtID0gYXJyW2ldO1xuXG5cdCAgICAgICAgICAgICAgICBzd2l0Y2goZGltZW4pIHtcblx0ICAgICAgICAgICAgICAgIGNhc2UgMTogZnVuYyhpdGVtLCBpLCBsZW4sIGRvbmUpOyBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMjogZnVuYyhpdGVtWzBdLCBpdGVtWzFdLCBpLCBsZW4sIGRvbmUpOyBicmVhaztcblx0ICAgICAgICAgICAgICAgIGNhc2UgMzogZnVuYyhpdGVtWzBdLCBpdGVtWzFdLCBpdGVtWzJdLCBpLCBsZW4sIGRvbmUpOyBicmVhaztcblx0ICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5wdXNoKGksIGRvbmUpO1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIGpzaGludCB2YWxpZHRoaXM6IHRydWVcblx0ICAgICAgICAgICAgICAgICAgICBmdW5jLmFwcGx5KHRoaXMsIGl0ZW0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgdmFyIGtleXMgPSBsaWIua2V5cyhhcnIpO1xuXHQgICAgICAgIGxlbiA9IGtleXMubGVuZ3RoO1xuXHQgICAgICAgIG91dHB1dEFyciA9IG5ldyBBcnJheShsZW4pO1xuXG5cdCAgICAgICAgaWYobGVuID09PSAwKSB7XG5cdCAgICAgICAgICAgIGNiKG51bGwsICcnKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHZhciBrID0ga2V5c1tpXTtcblx0ICAgICAgICAgICAgICAgIGZ1bmMoaywgYXJyW2tdLCBpLCBsZW4sIGRvbmUpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgICBGcmFtZTogRnJhbWUsXG5cdCAgICBtYWtlTWFjcm86IG1ha2VNYWNybyxcblx0ICAgIG1ha2VLZXl3b3JkQXJnczogbWFrZUtleXdvcmRBcmdzLFxuXHQgICAgbnVtQXJnczogbnVtQXJncyxcblx0ICAgIHN1cHByZXNzVmFsdWU6IHN1cHByZXNzVmFsdWUsXG5cdCAgICBlbnN1cmVEZWZpbmVkOiBlbnN1cmVEZWZpbmVkLFxuXHQgICAgbWVtYmVyTG9va3VwOiBtZW1iZXJMb29rdXAsXG5cdCAgICBjb250ZXh0T3JGcmFtZUxvb2t1cDogY29udGV4dE9yRnJhbWVMb29rdXAsXG5cdCAgICBjYWxsV3JhcDogY2FsbFdyYXAsXG5cdCAgICBoYW5kbGVFcnJvcjogaGFuZGxlRXJyb3IsXG5cdCAgICBpc0FycmF5OiBsaWIuaXNBcnJheSxcblx0ICAgIGtleXM6IGxpYi5rZXlzLFxuXHQgICAgU2FmZVN0cmluZzogU2FmZVN0cmluZyxcblx0ICAgIGNvcHlTYWZlbmVzczogY29weVNhZmVuZXNzLFxuXHQgICAgbWFya1NhZmU6IG1hcmtTYWZlLFxuXHQgICAgYXN5bmNFYWNoOiBhc3luY0VhY2gsXG5cdCAgICBhc3luY0FsbDogYXN5bmNBbGwsXG5cdCAgICBpbk9wZXJhdG9yOiBsaWIuaW5PcGVyYXRvclxuXHR9O1xuXG5cbi8qKiovIH0pLFxuLyogMTQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGxpYiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdHZhciByID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMyk7XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplKHZhbHVlLCBkZWZhdWx0VmFsdWUpIHtcblx0ICAgIGlmKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IGZhbHNlKSB7XG5cdCAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB2YWx1ZTtcblx0fVxuXG5cdHZhciBmaWx0ZXJzID0ge1xuXHQgICAgYWJzOiBNYXRoLmFicyxcblxuXHQgICAgYmF0Y2g6IGZ1bmN0aW9uKGFyciwgbGluZWNvdW50LCBmaWxsX3dpdGgpIHtcblx0ICAgICAgICB2YXIgaTtcblx0ICAgICAgICB2YXIgcmVzID0gW107XG5cdCAgICAgICAgdmFyIHRtcCA9IFtdO1xuXG5cdCAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIGlmKGkgJSBsaW5lY291bnQgPT09IDAgJiYgdG1wLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgcmVzLnB1c2godG1wKTtcblx0ICAgICAgICAgICAgICAgIHRtcCA9IFtdO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdG1wLnB1c2goYXJyW2ldKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZih0bXAubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgIGlmKGZpbGxfd2l0aCkge1xuXHQgICAgICAgICAgICAgICAgZm9yKGkgPSB0bXAubGVuZ3RoOyBpIDwgbGluZWNvdW50OyBpKyspIHtcblx0ICAgICAgICAgICAgICAgICAgICB0bXAucHVzaChmaWxsX3dpdGgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmVzLnB1c2godG1wKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gcmVzO1xuXHQgICAgfSxcblxuXHQgICAgY2FwaXRhbGl6ZTogZnVuY3Rpb24oc3RyKSB7XG5cdCAgICAgICAgc3RyID0gbm9ybWFsaXplKHN0ciwgJycpO1xuXHQgICAgICAgIHZhciByZXQgPSBzdHIudG9Mb3dlckNhc2UoKTtcblx0ICAgICAgICByZXR1cm4gci5jb3B5U2FmZW5lc3Moc3RyLCByZXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyByZXQuc2xpY2UoMSkpO1xuXHQgICAgfSxcblxuXHQgICAgY2VudGVyOiBmdW5jdGlvbihzdHIsIHdpZHRoKSB7XG5cdCAgICAgICAgc3RyID0gbm9ybWFsaXplKHN0ciwgJycpO1xuXHQgICAgICAgIHdpZHRoID0gd2lkdGggfHwgODA7XG5cblx0ICAgICAgICBpZihzdHIubGVuZ3RoID49IHdpZHRoKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBzdHI7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIHNwYWNlcyA9IHdpZHRoIC0gc3RyLmxlbmd0aDtcblx0ICAgICAgICB2YXIgcHJlID0gbGliLnJlcGVhdCgnICcsIHNwYWNlcy8yIC0gc3BhY2VzICUgMik7XG5cdCAgICAgICAgdmFyIHBvc3QgPSBsaWIucmVwZWF0KCcgJywgc3BhY2VzLzIpO1xuXHQgICAgICAgIHJldHVybiByLmNvcHlTYWZlbmVzcyhzdHIsIHByZSArIHN0ciArIHBvc3QpO1xuXHQgICAgfSxcblxuXHQgICAgJ2RlZmF1bHQnOiBmdW5jdGlvbih2YWwsIGRlZiwgYm9vbCkge1xuXHQgICAgICAgIGlmKGJvb2wpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHZhbCA/IHZhbCA6IGRlZjtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHJldHVybiAodmFsICE9PSB1bmRlZmluZWQpID8gdmFsIDogZGVmO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIGRpY3Rzb3J0OiBmdW5jdGlvbih2YWwsIGNhc2Vfc2Vuc2l0aXZlLCBieSkge1xuXHQgICAgICAgIGlmICghbGliLmlzT2JqZWN0KHZhbCkpIHtcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IGxpYi5UZW1wbGF0ZUVycm9yKCdkaWN0c29ydCBmaWx0ZXI6IHZhbCBtdXN0IGJlIGFuIG9iamVjdCcpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBhcnJheSA9IFtdO1xuXHQgICAgICAgIGZvciAodmFyIGsgaW4gdmFsKSB7XG5cdCAgICAgICAgICAgIC8vIGRlbGliZXJhdGVseSBpbmNsdWRlIHByb3BlcnRpZXMgZnJvbSB0aGUgb2JqZWN0J3MgcHJvdG90eXBlXG5cdCAgICAgICAgICAgIGFycmF5LnB1c2goW2ssdmFsW2tdXSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIHNpO1xuXHQgICAgICAgIGlmIChieSA9PT0gdW5kZWZpbmVkIHx8IGJ5ID09PSAna2V5Jykge1xuXHQgICAgICAgICAgICBzaSA9IDA7XG5cdCAgICAgICAgfSBlbHNlIGlmIChieSA9PT0gJ3ZhbHVlJykge1xuXHQgICAgICAgICAgICBzaSA9IDE7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IGxpYi5UZW1wbGF0ZUVycm9yKFxuXHQgICAgICAgICAgICAgICAgJ2RpY3Rzb3J0IGZpbHRlcjogWW91IGNhbiBvbmx5IHNvcnQgYnkgZWl0aGVyIGtleSBvciB2YWx1ZScpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGFycmF5LnNvcnQoZnVuY3Rpb24odDEsIHQyKSB7XG5cdCAgICAgICAgICAgIHZhciBhID0gdDFbc2ldO1xuXHQgICAgICAgICAgICB2YXIgYiA9IHQyW3NpXTtcblxuXHQgICAgICAgICAgICBpZiAoIWNhc2Vfc2Vuc2l0aXZlKSB7XG5cdCAgICAgICAgICAgICAgICBpZiAobGliLmlzU3RyaW5nKGEpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgYSA9IGEudG9VcHBlckNhc2UoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGlmIChsaWIuaXNTdHJpbmcoYikpIHtcblx0ICAgICAgICAgICAgICAgICAgICBiID0gYi50b1VwcGVyQ2FzZSgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGEgPiBiID8gMSA6IChhID09PSBiID8gMCA6IC0xKTtcblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBhcnJheTtcblx0ICAgIH0sXG5cblx0ICAgIGR1bXA6IGZ1bmN0aW9uKG9iaiwgc3BhY2VzKSB7XG5cdCAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaiwgbnVsbCwgc3BhY2VzKTtcblx0ICAgIH0sXG5cblx0ICAgIGVzY2FwZTogZnVuY3Rpb24oc3RyKSB7XG5cdCAgICAgICAgaWYoc3RyIGluc3RhbmNlb2Ygci5TYWZlU3RyaW5nKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBzdHI7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHN0ciA9IChzdHIgPT09IG51bGwgfHwgc3RyID09PSB1bmRlZmluZWQpID8gJycgOiBzdHI7XG5cdCAgICAgICAgcmV0dXJuIHIubWFya1NhZmUobGliLmVzY2FwZShzdHIudG9TdHJpbmcoKSkpO1xuXHQgICAgfSxcblxuXHQgICAgc2FmZTogZnVuY3Rpb24oc3RyKSB7XG5cdCAgICAgICAgaWYgKHN0ciBpbnN0YW5jZW9mIHIuU2FmZVN0cmluZykge1xuXHQgICAgICAgICAgICByZXR1cm4gc3RyO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBzdHIgPSAoc3RyID09PSBudWxsIHx8IHN0ciA9PT0gdW5kZWZpbmVkKSA/ICcnIDogc3RyO1xuXHQgICAgICAgIHJldHVybiByLm1hcmtTYWZlKHN0ci50b1N0cmluZygpKTtcblx0ICAgIH0sXG5cblx0ICAgIGZpcnN0OiBmdW5jdGlvbihhcnIpIHtcblx0ICAgICAgICByZXR1cm4gYXJyWzBdO1xuXHQgICAgfSxcblxuXHQgICAgZ3JvdXBieTogZnVuY3Rpb24oYXJyLCBhdHRyKSB7XG5cdCAgICAgICAgcmV0dXJuIGxpYi5ncm91cEJ5KGFyciwgYXR0cik7XG5cdCAgICB9LFxuXG5cdCAgICBpbmRlbnQ6IGZ1bmN0aW9uKHN0ciwgd2lkdGgsIGluZGVudGZpcnN0KSB7XG5cdCAgICAgICAgc3RyID0gbm9ybWFsaXplKHN0ciwgJycpO1xuXG5cdCAgICAgICAgaWYgKHN0ciA9PT0gJycpIHJldHVybiAnJztcblxuXHQgICAgICAgIHdpZHRoID0gd2lkdGggfHwgNDtcblx0ICAgICAgICB2YXIgcmVzID0gJyc7XG5cdCAgICAgICAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKTtcblx0ICAgICAgICB2YXIgc3AgPSBsaWIucmVwZWF0KCcgJywgd2lkdGgpO1xuXG5cdCAgICAgICAgZm9yKHZhciBpPTA7IGk8bGluZXMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgaWYoaSA9PT0gMCAmJiAhaW5kZW50Zmlyc3QpIHtcblx0ICAgICAgICAgICAgICAgIHJlcyArPSBsaW5lc1tpXSArICdcXG4nO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgcmVzICs9IHNwICsgbGluZXNbaV0gKyAnXFxuJztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiByLmNvcHlTYWZlbmVzcyhzdHIsIHJlcyk7XG5cdCAgICB9LFxuXG5cdCAgICBqb2luOiBmdW5jdGlvbihhcnIsIGRlbCwgYXR0cikge1xuXHQgICAgICAgIGRlbCA9IGRlbCB8fCAnJztcblxuXHQgICAgICAgIGlmKGF0dHIpIHtcblx0ICAgICAgICAgICAgYXJyID0gbGliLm1hcChhcnIsIGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB2W2F0dHJdO1xuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gYXJyLmpvaW4oZGVsKTtcblx0ICAgIH0sXG5cblx0ICAgIGxhc3Q6IGZ1bmN0aW9uKGFycikge1xuXHQgICAgICAgIHJldHVybiBhcnJbYXJyLmxlbmd0aC0xXTtcblx0ICAgIH0sXG5cblx0ICAgIGxlbmd0aDogZnVuY3Rpb24odmFsKSB7XG5cdCAgICAgICAgdmFyIHZhbHVlID0gbm9ybWFsaXplKHZhbCwgJycpO1xuXG5cdCAgICAgICAgaWYodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICBpZihcblx0ICAgICAgICAgICAgICAgICh0eXBlb2YgTWFwID09PSAnZnVuY3Rpb24nICYmIHZhbHVlIGluc3RhbmNlb2YgTWFwKSB8fFxuXHQgICAgICAgICAgICAgICAgKHR5cGVvZiBTZXQgPT09ICdmdW5jdGlvbicgJiYgdmFsdWUgaW5zdGFuY2VvZiBTZXQpXG5cdCAgICAgICAgICAgICkge1xuXHQgICAgICAgICAgICAgICAgLy8gRUNNQVNjcmlwdCAyMDE1IE1hcHMgYW5kIFNldHNcblx0ICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5zaXplO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGlmKGxpYi5pc09iamVjdCh2YWx1ZSkgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIHIuU2FmZVN0cmluZykpIHtcblx0ICAgICAgICAgICAgICAgIC8vIE9iamVjdHMgKGJlc2lkZXMgU2FmZVN0cmluZ3MpLCBub24tcHJpbWF0aXZlIEFycmF5c1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGg7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIDA7XG5cdCAgICB9LFxuXG5cdCAgICBsaXN0OiBmdW5jdGlvbih2YWwpIHtcblx0ICAgICAgICBpZihsaWIuaXNTdHJpbmcodmFsKSkge1xuXHQgICAgICAgICAgICByZXR1cm4gdmFsLnNwbGl0KCcnKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZihsaWIuaXNPYmplY3QodmFsKSkge1xuXHQgICAgICAgICAgICB2YXIga2V5cyA9IFtdO1xuXG5cdCAgICAgICAgICAgIGlmKE9iamVjdC5rZXlzKSB7XG5cdCAgICAgICAgICAgICAgICBrZXlzID0gT2JqZWN0LmtleXModmFsKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIGZvcih2YXIgayBpbiB2YWwpIHtcblx0ICAgICAgICAgICAgICAgICAgICBrZXlzLnB1c2goayk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gbGliLm1hcChrZXlzLCBmdW5jdGlvbihrKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4geyBrZXk6IGssXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsW2tdIH07XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKGxpYi5pc0FycmF5KHZhbCkpIHtcblx0ICAgICAgICAgIHJldHVybiB2YWw7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0aHJvdyBuZXcgbGliLlRlbXBsYXRlRXJyb3IoJ2xpc3QgZmlsdGVyOiB0eXBlIG5vdCBpdGVyYWJsZScpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIGxvd2VyOiBmdW5jdGlvbihzdHIpIHtcblx0ICAgICAgICBzdHIgPSBub3JtYWxpemUoc3RyLCAnJyk7XG5cdCAgICAgICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xuXHQgICAgfSxcblxuXHQgICAgbmwyYnI6IGZ1bmN0aW9uKHN0cikge1xuXHQgICAgICAgIGlmIChzdHIgPT09IG51bGwgfHwgc3RyID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuICcnO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gci5jb3B5U2FmZW5lc3Moc3RyLCBzdHIucmVwbGFjZSgvXFxyXFxufFxcbi9nLCAnPGJyIC8+XFxuJykpO1xuXHQgICAgfSxcblxuXHQgICAgcmFuZG9tOiBmdW5jdGlvbihhcnIpIHtcblx0ICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcblx0ICAgIH0sXG5cblx0ICAgIHJlamVjdGF0dHI6IGZ1bmN0aW9uKGFyciwgYXR0cikge1xuXHQgICAgICByZXR1cm4gYXJyLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuXHQgICAgICAgIHJldHVybiAhaXRlbVthdHRyXTtcblx0ICAgICAgfSk7XG5cdCAgICB9LFxuXG5cdCAgICBzZWxlY3RhdHRyOiBmdW5jdGlvbihhcnIsIGF0dHIpIHtcblx0ICAgICAgcmV0dXJuIGFyci5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICByZXR1cm4gISFpdGVtW2F0dHJdO1xuXHQgICAgICB9KTtcblx0ICAgIH0sXG5cblx0ICAgIHJlcGxhY2U6IGZ1bmN0aW9uKHN0ciwgb2xkLCBuZXdfLCBtYXhDb3VudCkge1xuXHQgICAgICAgIHZhciBvcmlnaW5hbFN0ciA9IHN0cjtcblxuXHQgICAgICAgIGlmIChvbGQgaW5zdGFuY2VvZiBSZWdFeHApIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKG9sZCwgbmV3Xyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYodHlwZW9mIG1heENvdW50ID09PSAndW5kZWZpbmVkJyl7XG5cdCAgICAgICAgICAgIG1heENvdW50ID0gLTE7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIHJlcyA9ICcnOyAgLy8gT3V0cHV0XG5cblx0ICAgICAgICAvLyBDYXN0IE51bWJlcnMgaW4gdGhlIHNlYXJjaCB0ZXJtIHRvIHN0cmluZ1xuXHQgICAgICAgIGlmKHR5cGVvZiBvbGQgPT09ICdudW1iZXInKXtcblx0ICAgICAgICAgICAgb2xkID0gb2xkICsgJyc7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYodHlwZW9mIG9sZCAhPT0gJ3N0cmluZycpIHtcblx0ICAgICAgICAgICAgLy8gSWYgaXQgaXMgc29tZXRoaW5nIG90aGVyIHRoYW4gbnVtYmVyIG9yIHN0cmluZyxcblx0ICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBvcmlnaW5hbCBzdHJpbmdcblx0ICAgICAgICAgICAgcmV0dXJuIHN0cjtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICAvLyBDYXN0IG51bWJlcnMgaW4gdGhlIHJlcGxhY2VtZW50IHRvIHN0cmluZ1xuXHQgICAgICAgIGlmKHR5cGVvZiBzdHIgPT09ICdudW1iZXInKXtcblx0ICAgICAgICAgICAgc3RyID0gc3RyICsgJyc7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLy8gSWYgYnkgbm93LCB3ZSBkb24ndCBoYXZlIGEgc3RyaW5nLCB0aHJvdyBpdCBiYWNrXG5cdCAgICAgICAgaWYodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycgJiYgIShzdHIgaW5zdGFuY2VvZiByLlNhZmVTdHJpbmcpKXtcblx0ICAgICAgICAgICAgcmV0dXJuIHN0cjtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICAvLyBTaG9ydENpcmN1aXRzXG5cdCAgICAgICAgaWYob2xkID09PSAnJyl7XG5cdCAgICAgICAgICAgIC8vIE1pbWljIHRoZSBweXRob24gYmVoYXZpb3VyOiBlbXB0eSBzdHJpbmcgaXMgcmVwbGFjZWRcblx0ICAgICAgICAgICAgLy8gYnkgcmVwbGFjZW1lbnQgZS5nLiBcImFiY1wifHJlcGxhY2UoXCJcIiwgXCIuXCIpIC0+IC5hLmIuYy5cblx0ICAgICAgICAgICAgcmVzID0gbmV3XyArIHN0ci5zcGxpdCgnJykuam9pbihuZXdfKSArIG5ld187XG5cdCAgICAgICAgICAgIHJldHVybiByLmNvcHlTYWZlbmVzcyhzdHIsIHJlcyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIG5leHRJbmRleCA9IHN0ci5pbmRleE9mKG9sZCk7XG5cdCAgICAgICAgLy8gaWYgIyBvZiByZXBsYWNlbWVudHMgdG8gcGVyZm9ybSBpcyAwLCBvciB0aGUgc3RyaW5nIHRvIGRvZXNcblx0ICAgICAgICAvLyBub3QgY29udGFpbiB0aGUgb2xkIHZhbHVlLCByZXR1cm4gdGhlIHN0cmluZ1xuXHQgICAgICAgIGlmKG1heENvdW50ID09PSAwIHx8IG5leHRJbmRleCA9PT0gLTEpe1xuXHQgICAgICAgICAgICByZXR1cm4gc3RyO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBwb3MgPSAwO1xuXHQgICAgICAgIHZhciBjb3VudCA9IDA7IC8vICMgb2YgcmVwbGFjZW1lbnRzIG1hZGVcblxuXHQgICAgICAgIHdoaWxlKG5leHRJbmRleCAgPiAtMSAmJiAobWF4Q291bnQgPT09IC0xIHx8IGNvdW50IDwgbWF4Q291bnQpKXtcblx0ICAgICAgICAgICAgLy8gR3JhYiB0aGUgbmV4dCBjaHVuayBvZiBzcmMgc3RyaW5nIGFuZCBhZGQgaXQgd2l0aCB0aGVcblx0ICAgICAgICAgICAgLy8gcmVwbGFjZW1lbnQsIHRvIHRoZSByZXN1bHRcblx0ICAgICAgICAgICAgcmVzICs9IHN0ci5zdWJzdHJpbmcocG9zLCBuZXh0SW5kZXgpICsgbmV3Xztcblx0ICAgICAgICAgICAgLy8gSW5jcmVtZW50IG91ciBwb2ludGVyIGluIHRoZSBzcmMgc3RyaW5nXG5cdCAgICAgICAgICAgIHBvcyA9IG5leHRJbmRleCArIG9sZC5sZW5ndGg7XG5cdCAgICAgICAgICAgIGNvdW50Kys7XG5cdCAgICAgICAgICAgIC8vIFNlZSBpZiB0aGVyZSBhcmUgYW55IG1vcmUgcmVwbGFjZW1lbnRzIHRvIGJlIG1hZGVcblx0ICAgICAgICAgICAgbmV4dEluZGV4ID0gc3RyLmluZGV4T2Yob2xkLCBwb3MpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIC8vIFdlJ3ZlIGVpdGhlciByZWFjaGVkIHRoZSBlbmQsIG9yIGRvbmUgdGhlIG1heCAjIG9mXG5cdCAgICAgICAgLy8gcmVwbGFjZW1lbnRzLCB0YWNrIG9uIGFueSByZW1haW5pbmcgc3RyaW5nXG5cdCAgICAgICAgaWYocG9zIDwgc3RyLmxlbmd0aCkge1xuXHQgICAgICAgICAgICByZXMgKz0gc3RyLnN1YnN0cmluZyhwb3MpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiByLmNvcHlTYWZlbmVzcyhvcmlnaW5hbFN0ciwgcmVzKTtcblx0ICAgIH0sXG5cblx0ICAgIHJldmVyc2U6IGZ1bmN0aW9uKHZhbCkge1xuXHQgICAgICAgIHZhciBhcnI7XG5cdCAgICAgICAgaWYobGliLmlzU3RyaW5nKHZhbCkpIHtcblx0ICAgICAgICAgICAgYXJyID0gZmlsdGVycy5saXN0KHZhbCk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAvLyBDb3B5IGl0XG5cdCAgICAgICAgICAgIGFyciA9IGxpYi5tYXAodmFsLCBmdW5jdGlvbih2KSB7IHJldHVybiB2OyB9KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBhcnIucmV2ZXJzZSgpO1xuXG5cdCAgICAgICAgaWYobGliLmlzU3RyaW5nKHZhbCkpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHIuY29weVNhZmVuZXNzKHZhbCwgYXJyLmpvaW4oJycpKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIGFycjtcblx0ICAgIH0sXG5cblx0ICAgIHJvdW5kOiBmdW5jdGlvbih2YWwsIHByZWNpc2lvbiwgbWV0aG9kKSB7XG5cdCAgICAgICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uIHx8IDA7XG5cdCAgICAgICAgdmFyIGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xuXHQgICAgICAgIHZhciByb3VuZGVyO1xuXG5cdCAgICAgICAgaWYobWV0aG9kID09PSAnY2VpbCcpIHtcblx0ICAgICAgICAgICAgcm91bmRlciA9IE1hdGguY2VpbDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZihtZXRob2QgPT09ICdmbG9vcicpIHtcblx0ICAgICAgICAgICAgcm91bmRlciA9IE1hdGguZmxvb3I7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICByb3VuZGVyID0gTWF0aC5yb3VuZDtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gcm91bmRlcih2YWwgKiBmYWN0b3IpIC8gZmFjdG9yO1xuXHQgICAgfSxcblxuXHQgICAgc2xpY2U6IGZ1bmN0aW9uKGFyciwgc2xpY2VzLCBmaWxsV2l0aCkge1xuXHQgICAgICAgIHZhciBzbGljZUxlbmd0aCA9IE1hdGguZmxvb3IoYXJyLmxlbmd0aCAvIHNsaWNlcyk7XG5cdCAgICAgICAgdmFyIGV4dHJhID0gYXJyLmxlbmd0aCAlIHNsaWNlcztcblx0ICAgICAgICB2YXIgb2Zmc2V0ID0gMDtcblx0ICAgICAgICB2YXIgcmVzID0gW107XG5cblx0ICAgICAgICBmb3IodmFyIGk9MDsgaTxzbGljZXM7IGkrKykge1xuXHQgICAgICAgICAgICB2YXIgc3RhcnQgPSBvZmZzZXQgKyBpICogc2xpY2VMZW5ndGg7XG5cdCAgICAgICAgICAgIGlmKGkgPCBleHRyYSkge1xuXHQgICAgICAgICAgICAgICAgb2Zmc2V0Kys7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgdmFyIGVuZCA9IG9mZnNldCArIChpICsgMSkgKiBzbGljZUxlbmd0aDtcblxuXHQgICAgICAgICAgICB2YXIgc2xpY2UgPSBhcnIuc2xpY2Uoc3RhcnQsIGVuZCk7XG5cdCAgICAgICAgICAgIGlmKGZpbGxXaXRoICYmIGkgPj0gZXh0cmEpIHtcblx0ICAgICAgICAgICAgICAgIHNsaWNlLnB1c2goZmlsbFdpdGgpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJlcy5wdXNoKHNsaWNlKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gcmVzO1xuXHQgICAgfSxcblxuXHQgICAgc3VtOiBmdW5jdGlvbihhcnIsIGF0dHIsIHN0YXJ0KSB7XG5cdCAgICAgICAgdmFyIHN1bSA9IDA7XG5cblx0ICAgICAgICBpZih0eXBlb2Ygc3RhcnQgPT09ICdudW1iZXInKXtcblx0ICAgICAgICAgICAgc3VtICs9IHN0YXJ0O1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKGF0dHIpIHtcblx0ICAgICAgICAgICAgYXJyID0gbGliLm1hcChhcnIsIGZ1bmN0aW9uKHYpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB2W2F0dHJdO1xuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIHN1bSArPSBhcnJbaV07XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHN1bTtcblx0ICAgIH0sXG5cblx0ICAgIHNvcnQ6IHIubWFrZU1hY3JvKFsndmFsdWUnLCAncmV2ZXJzZScsICdjYXNlX3NlbnNpdGl2ZScsICdhdHRyaWJ1dGUnXSwgW10sIGZ1bmN0aW9uKGFyciwgcmV2ZXJzZSwgY2FzZVNlbnMsIGF0dHIpIHtcblx0ICAgICAgICAgLy8gQ29weSBpdFxuXHQgICAgICAgIGFyciA9IGxpYi5tYXAoYXJyLCBmdW5jdGlvbih2KSB7IHJldHVybiB2OyB9KTtcblxuXHQgICAgICAgIGFyci5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcblx0ICAgICAgICAgICAgdmFyIHgsIHk7XG5cblx0ICAgICAgICAgICAgaWYoYXR0cikge1xuXHQgICAgICAgICAgICAgICAgeCA9IGFbYXR0cl07XG5cdCAgICAgICAgICAgICAgICB5ID0gYlthdHRyXTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHggPSBhO1xuXHQgICAgICAgICAgICAgICAgeSA9IGI7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBpZighY2FzZVNlbnMgJiYgbGliLmlzU3RyaW5nKHgpICYmIGxpYi5pc1N0cmluZyh5KSkge1xuXHQgICAgICAgICAgICAgICAgeCA9IHgudG9Mb3dlckNhc2UoKTtcblx0ICAgICAgICAgICAgICAgIHkgPSB5LnRvTG93ZXJDYXNlKCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBpZih4IDwgeSkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHJldmVyc2UgPyAxIDogLTE7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSBpZih4ID4geSkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHJldmVyc2UgPyAtMTogMTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiAwO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICByZXR1cm4gYXJyO1xuXHQgICAgfSksXG5cblx0ICAgIHN0cmluZzogZnVuY3Rpb24ob2JqKSB7XG5cdCAgICAgICAgcmV0dXJuIHIuY29weVNhZmVuZXNzKG9iaiwgb2JqKTtcblx0ICAgIH0sXG5cblx0ICAgIHN0cmlwdGFnczogZnVuY3Rpb24oaW5wdXQsIHByZXNlcnZlX2xpbmVicmVha3MpIHtcblx0ICAgICAgICBpbnB1dCA9IG5vcm1hbGl6ZShpbnB1dCwgJycpO1xuXHQgICAgICAgIHByZXNlcnZlX2xpbmVicmVha3MgPSBwcmVzZXJ2ZV9saW5lYnJlYWtzIHx8IGZhbHNlO1xuXHQgICAgICAgIHZhciB0YWdzID0gLzxcXC8/KFthLXpdW2EtejAtOV0qKVxcYltePl0qPnw8IS0tW1xcc1xcU10qPy0tPi9naTtcblx0ICAgICAgICB2YXIgdHJpbW1lZElucHV0ID0gZmlsdGVycy50cmltKGlucHV0LnJlcGxhY2UodGFncywgJycpKTtcblx0ICAgICAgICB2YXIgcmVzID0gJyc7XG5cdCAgICAgICAgaWYgKHByZXNlcnZlX2xpbmVicmVha3MpIHtcblx0ICAgICAgICAgICAgcmVzID0gdHJpbW1lZElucHV0XG5cdCAgICAgICAgICAgICAgICAucmVwbGFjZSgvXiArfCArJC9nbSwgJycpICAgICAvLyByZW1vdmUgbGVhZGluZyBhbmQgdHJhaWxpbmcgc3BhY2VzXG5cdCAgICAgICAgICAgICAgICAucmVwbGFjZSgvICsvZywgJyAnKSAgICAgICAgICAvLyBzcXVhc2ggYWRqYWNlbnQgc3BhY2VzXG5cdCAgICAgICAgICAgICAgICAucmVwbGFjZSgvKFxcclxcbikvZywgJ1xcbicpICAgICAvLyBub3JtYWxpemUgbGluZWJyZWFrcyAoQ1JMRiAtPiBMRilcblx0ICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG5cXG5cXG4rL2csICdcXG5cXG4nKTsgLy8gc3F1YXNoIGFibm9ybWFsIGFkamFjZW50IGxpbmVicmVha3Ncblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICByZXMgPSB0cmltbWVkSW5wdXQucmVwbGFjZSgvXFxzKy9naSwgJyAnKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIHIuY29weVNhZmVuZXNzKGlucHV0LCByZXMpO1xuXHQgICAgfSxcblxuXHQgICAgdGl0bGU6IGZ1bmN0aW9uKHN0cikge1xuXHQgICAgICAgIHN0ciA9IG5vcm1hbGl6ZShzdHIsICcnKTtcblx0ICAgICAgICB2YXIgd29yZHMgPSBzdHIuc3BsaXQoJyAnKTtcblx0ICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgd29yZHNbaV0gPSBmaWx0ZXJzLmNhcGl0YWxpemUod29yZHNbaV0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gci5jb3B5U2FmZW5lc3Moc3RyLCB3b3Jkcy5qb2luKCcgJykpO1xuXHQgICAgfSxcblxuXHQgICAgdHJpbTogZnVuY3Rpb24oc3RyKSB7XG5cdCAgICAgICAgcmV0dXJuIHIuY29weVNhZmVuZXNzKHN0ciwgc3RyLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKSk7XG5cdCAgICB9LFxuXG5cdCAgICB0cnVuY2F0ZTogZnVuY3Rpb24oaW5wdXQsIGxlbmd0aCwga2lsbHdvcmRzLCBlbmQpIHtcblx0ICAgICAgICB2YXIgb3JpZyA9IGlucHV0O1xuXHQgICAgICAgIGlucHV0ID0gbm9ybWFsaXplKGlucHV0LCAnJyk7XG5cdCAgICAgICAgbGVuZ3RoID0gbGVuZ3RoIHx8IDI1NTtcblxuXHQgICAgICAgIGlmIChpbnB1dC5sZW5ndGggPD0gbGVuZ3RoKVxuXHQgICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG5cblx0ICAgICAgICBpZiAoa2lsbHdvcmRzKSB7XG5cdCAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyaW5nKDAsIGxlbmd0aCk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgdmFyIGlkeCA9IGlucHV0Lmxhc3RJbmRleE9mKCcgJywgbGVuZ3RoKTtcblx0ICAgICAgICAgICAgaWYoaWR4ID09PSAtMSkge1xuXHQgICAgICAgICAgICAgICAgaWR4ID0gbGVuZ3RoO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwgaWR4KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpbnB1dCArPSAoZW5kICE9PSB1bmRlZmluZWQgJiYgZW5kICE9PSBudWxsKSA/IGVuZCA6ICcuLi4nO1xuXHQgICAgICAgIHJldHVybiByLmNvcHlTYWZlbmVzcyhvcmlnLCBpbnB1dCk7XG5cdCAgICB9LFxuXG5cdCAgICB1cHBlcjogZnVuY3Rpb24oc3RyKSB7XG5cdCAgICAgICAgc3RyID0gbm9ybWFsaXplKHN0ciwgJycpO1xuXHQgICAgICAgIHJldHVybiBzdHIudG9VcHBlckNhc2UoKTtcblx0ICAgIH0sXG5cblx0ICAgIHVybGVuY29kZTogZnVuY3Rpb24ob2JqKSB7XG5cdCAgICAgICAgdmFyIGVuYyA9IGVuY29kZVVSSUNvbXBvbmVudDtcblx0ICAgICAgICBpZiAobGliLmlzU3RyaW5nKG9iaikpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGVuYyhvYmopO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHZhciBwYXJ0cztcblx0ICAgICAgICAgICAgaWYgKGxpYi5pc0FycmF5KG9iaikpIHtcblx0ICAgICAgICAgICAgICAgIHBhcnRzID0gb2JqLm1hcChmdW5jdGlvbihpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuYyhpdGVtWzBdKSArICc9JyArIGVuYyhpdGVtWzFdKTtcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgcGFydHMgPSBbXTtcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKGVuYyhrKSArICc9JyArIGVuYyhvYmpba10pKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oJyYnKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICB1cmxpemU6IGZ1bmN0aW9uKHN0ciwgbGVuZ3RoLCBub2ZvbGxvdykge1xuXHQgICAgICAgIGlmIChpc05hTihsZW5ndGgpKSBsZW5ndGggPSBJbmZpbml0eTtcblxuXHQgICAgICAgIHZhciBub0ZvbGxvd0F0dHIgPSAobm9mb2xsb3cgPT09IHRydWUgPyAnIHJlbD1cIm5vZm9sbG93XCInIDogJycpO1xuXG5cdCAgICAgICAgLy8gRm9yIHRoZSBqaW5qYSByZWdleHAsIHNlZVxuXHQgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9taXRzdWhpa28vamluamEyL2Jsb2IvZjE1YjgxNGRjYmE2YWExMmJjNzRkMWY3ZDBjODgxZDU1ZjcxMjZiZS9qaW5qYTIvdXRpbHMucHkjTDIwLUwyM1xuXHQgICAgICAgIHZhciBwdW5jUkUgPSAvXig/OlxcKHw8fCZsdDspPyguKj8pKD86XFwufCx8XFwpfFxcbnwmZ3Q7KT8kLztcblx0ICAgICAgICAvLyBmcm9tIGh0dHA6Ly9ibG9nLmdlcnYubmV0LzIwMTEvMDUvaHRtbDVfZW1haWxfYWRkcmVzc19yZWdleHAvXG5cdCAgICAgICAgdmFyIGVtYWlsUkUgPSAvXltcXHcuISMkJSYnKitcXC1cXC89P1xcXmB7fH1+XStAW2EtelxcZFxcLV0rKFxcLlthLXpcXGRcXC1dKykrJC9pO1xuXHQgICAgICAgIHZhciBodHRwSHR0cHNSRSA9IC9eaHR0cHM/OlxcL1xcLy4qJC87XG5cdCAgICAgICAgdmFyIHd3d1JFID0gL153d3dcXC4vO1xuXHQgICAgICAgIHZhciB0bGRSRSA9IC9cXC4oPzpvcmd8bmV0fGNvbSkoPzpcXDp8XFwvfCQpLztcblxuXHQgICAgICAgIHZhciB3b3JkcyA9IHN0ci5zcGxpdCgvKFxccyspLykuZmlsdGVyKGZ1bmN0aW9uKHdvcmQpIHtcblx0ICAgICAgICAgIC8vIElmIHRoZSB3b3JkIGhhcyBubyBsZW5ndGgsIGJhaWwuIFRoaXMgY2FuIGhhcHBlbiBmb3Igc3RyIHdpdGhcblx0ICAgICAgICAgIC8vIHRyYWlsaW5nIHdoaXRlc3BhY2UuXG5cdCAgICAgICAgICByZXR1cm4gd29yZCAmJiB3b3JkLmxlbmd0aDtcblx0ICAgICAgICB9KS5tYXAoZnVuY3Rpb24od29yZCkge1xuXHQgICAgICAgICAgdmFyIG1hdGNoZXMgPSB3b3JkLm1hdGNoKHB1bmNSRSk7XG5cdCAgICAgICAgICB2YXIgcG9zc2libGVVcmwgPSBtYXRjaGVzICYmIG1hdGNoZXNbMV0gfHwgd29yZDtcblxuXHQgICAgICAgICAgLy8gdXJsIHRoYXQgc3RhcnRzIHdpdGggaHR0cCBvciBodHRwc1xuXHQgICAgICAgICAgaWYgKGh0dHBIdHRwc1JFLnRlc3QocG9zc2libGVVcmwpKVxuXHQgICAgICAgICAgICByZXR1cm4gJzxhIGhyZWY9XCInICsgcG9zc2libGVVcmwgKyAnXCInICsgbm9Gb2xsb3dBdHRyICsgJz4nICsgcG9zc2libGVVcmwuc3Vic3RyKDAsIGxlbmd0aCkgKyAnPC9hPic7XG5cblx0ICAgICAgICAgIC8vIHVybCB0aGF0IHN0YXJ0cyB3aXRoIHd3dy5cblx0ICAgICAgICAgIGlmICh3d3dSRS50ZXN0KHBvc3NpYmxlVXJsKSlcblx0ICAgICAgICAgICAgcmV0dXJuICc8YSBocmVmPVwiaHR0cDovLycgKyBwb3NzaWJsZVVybCArICdcIicgKyBub0ZvbGxvd0F0dHIgKyAnPicgKyBwb3NzaWJsZVVybC5zdWJzdHIoMCwgbGVuZ3RoKSArICc8L2E+JztcblxuXHQgICAgICAgICAgLy8gYW4gZW1haWwgYWRkcmVzcyBvZiB0aGUgZm9ybSB1c2VybmFtZUBkb21haW4udGxkXG5cdCAgICAgICAgICBpZiAoZW1haWxSRS50ZXN0KHBvc3NpYmxlVXJsKSlcblx0ICAgICAgICAgICAgcmV0dXJuICc8YSBocmVmPVwibWFpbHRvOicgKyBwb3NzaWJsZVVybCArICdcIj4nICsgcG9zc2libGVVcmwgKyAnPC9hPic7XG5cblx0ICAgICAgICAgIC8vIHVybCB0aGF0IGVuZHMgaW4gLmNvbSwgLm9yZyBvciAubmV0IHRoYXQgaXMgbm90IGFuIGVtYWlsIGFkZHJlc3Ncblx0ICAgICAgICAgIGlmICh0bGRSRS50ZXN0KHBvc3NpYmxlVXJsKSlcblx0ICAgICAgICAgICAgcmV0dXJuICc8YSBocmVmPVwiaHR0cDovLycgKyBwb3NzaWJsZVVybCArICdcIicgKyBub0ZvbGxvd0F0dHIgKyAnPicgKyBwb3NzaWJsZVVybC5zdWJzdHIoMCwgbGVuZ3RoKSArICc8L2E+JztcblxuXHQgICAgICAgICAgcmV0dXJuIHdvcmQ7XG5cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiB3b3Jkcy5qb2luKCcnKTtcblx0ICAgIH0sXG5cblx0ICAgIHdvcmRjb3VudDogZnVuY3Rpb24oc3RyKSB7XG5cdCAgICAgICAgc3RyID0gbm9ybWFsaXplKHN0ciwgJycpO1xuXHQgICAgICAgIHZhciB3b3JkcyA9IChzdHIpID8gc3RyLm1hdGNoKC9cXHcrL2cpIDogbnVsbDtcblx0ICAgICAgICByZXR1cm4gKHdvcmRzKSA/IHdvcmRzLmxlbmd0aCA6IG51bGw7XG5cdCAgICB9LFxuXG5cdCAgICAnZmxvYXQnOiBmdW5jdGlvbih2YWwsIGRlZikge1xuXHQgICAgICAgIHZhciByZXMgPSBwYXJzZUZsb2F0KHZhbCk7XG5cdCAgICAgICAgcmV0dXJuIGlzTmFOKHJlcykgPyBkZWYgOiByZXM7XG5cdCAgICB9LFxuXG5cdCAgICAnaW50JzogZnVuY3Rpb24odmFsLCBkZWYpIHtcblx0ICAgICAgICB2YXIgcmVzID0gcGFyc2VJbnQodmFsLCAxMCk7XG5cdCAgICAgICAgcmV0dXJuIGlzTmFOKHJlcykgPyBkZWYgOiByZXM7XG5cdCAgICB9XG5cdH07XG5cblx0Ly8gQWxpYXNlc1xuXHRmaWx0ZXJzLmQgPSBmaWx0ZXJzWydkZWZhdWx0J107XG5cdGZpbHRlcnMuZSA9IGZpbHRlcnMuZXNjYXBlO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZmlsdGVycztcblxuXG4vKioqLyB9KSxcbi8qIDE1ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBMb2FkZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE2KTtcblx0dmFyIFByZWNvbXBpbGVkTG9hZGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNyk7XG5cblx0dmFyIFdlYkxvYWRlciA9IExvYWRlci5leHRlbmQoe1xuXHQgICAgaW5pdDogZnVuY3Rpb24oYmFzZVVSTCwgb3B0cykge1xuXHQgICAgICAgIHRoaXMuYmFzZVVSTCA9IGJhc2VVUkwgfHwgJy4nO1xuXHQgICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG5cdCAgICAgICAgLy8gQnkgZGVmYXVsdCwgdGhlIGNhY2hlIGlzIHR1cm5lZCBvZmYgYmVjYXVzZSB0aGVyZSdzIG5vIHdheVxuXHQgICAgICAgIC8vIHRvIFwid2F0Y2hcIiB0ZW1wbGF0ZXMgb3ZlciBIVFRQLCBzbyB0aGV5IGFyZSByZS1kb3dubG9hZGVkXG5cdCAgICAgICAgLy8gYW5kIGNvbXBpbGVkIGVhY2ggdGltZS4gKFJlbWVtYmVyLCBQUkVDT01QSUxFIFlPVVJcblx0ICAgICAgICAvLyBURU1QTEFURVMgaW4gcHJvZHVjdGlvbiEpXG5cdCAgICAgICAgdGhpcy51c2VDYWNoZSA9ICEhb3B0cy51c2VDYWNoZTtcblxuXHQgICAgICAgIC8vIFdlIGRlZmF1bHQgYGFzeW5jYCB0byBmYWxzZSBzbyB0aGF0IHRoZSBzaW1wbGUgc3luY2hyb25vdXNcblx0ICAgICAgICAvLyBBUEkgY2FuIGJlIHVzZWQgd2hlbiB5b3UgYXJlbid0IGRvaW5nIGFueXRoaW5nIGFzeW5jIGluXG5cdCAgICAgICAgLy8geW91ciB0ZW1wbGF0ZXMgKHdoaWNoIGlzIG1vc3Qgb2YgdGhlIHRpbWUpLiBUaGlzIHBlcmZvcm1zIGFcblx0ICAgICAgICAvLyBzeW5jIGFqYXggcmVxdWVzdCwgYnV0IHRoYXQncyBvayBiZWNhdXNlIGl0IHNob3VsZCAqb25seSpcblx0ICAgICAgICAvLyBoYXBwZW4gaW4gZGV2ZWxvcG1lbnQuIFBSRUNPTVBJTEUgWU9VUiBURU1QTEFURVMuXG5cdCAgICAgICAgdGhpcy5hc3luYyA9ICEhb3B0cy5hc3luYztcblx0ICAgIH0sXG5cblx0ICAgIHJlc29sdmU6IGZ1bmN0aW9uKGZyb20sIHRvKSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcigncmVsYXRpdmUgdGVtcGxhdGVzIG5vdCBzdXBwb3J0IGluIHRoZSBicm93c2VyIHlldCcpO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0U291cmNlOiBmdW5jdGlvbihuYW1lLCBjYikge1xuXHQgICAgICAgIHZhciB1c2VDYWNoZSA9IHRoaXMudXNlQ2FjaGU7XG5cdCAgICAgICAgdmFyIHJlc3VsdDtcblx0ICAgICAgICB0aGlzLmZldGNoKHRoaXMuYmFzZVVSTCArICcvJyArIG5hbWUsIGZ1bmN0aW9uKGVyciwgc3JjKSB7XG5cdCAgICAgICAgICAgIGlmKGVycikge1xuXHQgICAgICAgICAgICAgICAgaWYoY2IpIHtcblx0ICAgICAgICAgICAgICAgICAgICBjYihlcnIuY29udGVudCk7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmIChlcnIuc3RhdHVzID09PSA0MDQpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVyci5jb250ZW50O1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHJlc3VsdCA9IHsgc3JjOiBzcmMsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG5hbWUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vQ2FjaGU6ICF1c2VDYWNoZSB9O1xuXHQgICAgICAgICAgICAgICAgaWYoY2IpIHtcblx0ICAgICAgICAgICAgICAgICAgICBjYihudWxsLCByZXN1bHQpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICAvLyBpZiB0aGlzIFdlYkxvYWRlciBpc24ndCBydW5uaW5nIGFzeW5jaHJvbm91c2x5LCB0aGVcblx0ICAgICAgICAvLyBmZXRjaCBhYm92ZSB3b3VsZCBhY3R1YWxseSBydW4gc3luYyBhbmQgd2UnbGwgaGF2ZSBhXG5cdCAgICAgICAgLy8gcmVzdWx0IGhlcmVcblx0ICAgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgfSxcblxuXHQgICAgZmV0Y2g6IGZ1bmN0aW9uKHVybCwgY2IpIHtcblx0ICAgICAgICAvLyBPbmx5IGluIHRoZSBicm93c2VyIHBsZWFzZVxuXHQgICAgICAgIHZhciBhamF4O1xuXHQgICAgICAgIHZhciBsb2FkaW5nID0gdHJ1ZTtcblxuXHQgICAgICAgIGlmKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCkgeyAvLyBNb3ppbGxhLCBTYWZhcmksIC4uLlxuXHQgICAgICAgICAgICBhamF4ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYod2luZG93LkFjdGl2ZVhPYmplY3QpIHsgLy8gSUUgOCBhbmQgb2xkZXJcblx0ICAgICAgICAgICAgLyogZ2xvYmFsIEFjdGl2ZVhPYmplY3QgKi9cblx0ICAgICAgICAgICAgYWpheCA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGFqYXgub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgIGlmKGFqYXgucmVhZHlTdGF0ZSA9PT0gNCAmJiBsb2FkaW5nKSB7XG5cdCAgICAgICAgICAgICAgICBsb2FkaW5nID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICBpZihhamF4LnN0YXR1cyA9PT0gMCB8fCBhamF4LnN0YXR1cyA9PT0gMjAwKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgY2IobnVsbCwgYWpheC5yZXNwb25zZVRleHQpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgY2IoeyBzdGF0dXM6IGFqYXguc3RhdHVzLCBjb250ZW50OiBhamF4LnJlc3BvbnNlVGV4dCB9KTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH07XG5cblx0ICAgICAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArICdzPScgK1xuXHQgICAgICAgICAgICAgICAobmV3IERhdGUoKS5nZXRUaW1lKCkpO1xuXG5cdCAgICAgICAgYWpheC5vcGVuKCdHRVQnLCB1cmwsIHRoaXMuYXN5bmMpO1xuXHQgICAgICAgIGFqYXguc2VuZCgpO1xuXHQgICAgfVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0ICAgIFdlYkxvYWRlcjogV2ViTG9hZGVyLFxuXHQgICAgUHJlY29tcGlsZWRMb2FkZXI6IFByZWNvbXBpbGVkTG9hZGVyXG5cdH07XG5cblxuLyoqKi8gfSksXG4vKiAxNiAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgcGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5cdHZhciBPYmogPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXHR2YXIgbGliID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblxuXHR2YXIgTG9hZGVyID0gT2JqLmV4dGVuZCh7XG5cdCAgICBvbjogZnVuY3Rpb24obmFtZSwgZnVuYykge1xuXHQgICAgICAgIHRoaXMubGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMgfHwge307XG5cdCAgICAgICAgdGhpcy5saXN0ZW5lcnNbbmFtZV0gPSB0aGlzLmxpc3RlbmVyc1tuYW1lXSB8fCBbXTtcblx0ICAgICAgICB0aGlzLmxpc3RlbmVyc1tuYW1lXS5wdXNoKGZ1bmMpO1xuXHQgICAgfSxcblxuXHQgICAgZW1pdDogZnVuY3Rpb24obmFtZSAvKiwgYXJnMSwgYXJnMiwgLi4uKi8pIHtcblx0ICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cblx0ICAgICAgICBpZih0aGlzLmxpc3RlbmVycyAmJiB0aGlzLmxpc3RlbmVyc1tuYW1lXSkge1xuXHQgICAgICAgICAgICBsaWIuZWFjaCh0aGlzLmxpc3RlbmVyc1tuYW1lXSwgZnVuY3Rpb24obGlzdGVuZXIpIHtcblx0ICAgICAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KG51bGwsIGFyZ3MpO1xuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICByZXNvbHZlOiBmdW5jdGlvbihmcm9tLCB0bykge1xuXHQgICAgICAgIHJldHVybiBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKGZyb20pLCB0byk7XG5cdCAgICB9LFxuXG5cdCAgICBpc1JlbGF0aXZlOiBmdW5jdGlvbihmaWxlbmFtZSkge1xuXHQgICAgICAgIHJldHVybiAoZmlsZW5hbWUuaW5kZXhPZignLi8nKSA9PT0gMCB8fCBmaWxlbmFtZS5pbmRleE9mKCcuLi8nKSA9PT0gMCk7XG5cdCAgICB9XG5cdH0pO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuXG5cbi8qKiovIH0pLFxuLyogMTcgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIExvYWRlciA9IF9fd2VicGFja19yZXF1aXJlX18oMTYpO1xuXG5cdHZhciBQcmVjb21waWxlZExvYWRlciA9IExvYWRlci5leHRlbmQoe1xuXHQgICAgaW5pdDogZnVuY3Rpb24oY29tcGlsZWRUZW1wbGF0ZXMpIHtcblx0ICAgICAgICB0aGlzLnByZWNvbXBpbGVkID0gY29tcGlsZWRUZW1wbGF0ZXMgfHwge307XG5cdCAgICB9LFxuXG5cdCAgICBnZXRTb3VyY2U6IGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICBpZiAodGhpcy5wcmVjb21waWxlZFtuYW1lXSkge1xuXHQgICAgICAgICAgICByZXR1cm4ge1xuXHQgICAgICAgICAgICAgICAgc3JjOiB7IHR5cGU6ICdjb2RlJyxcblx0ICAgICAgICAgICAgICAgICAgICAgICBvYmo6IHRoaXMucHJlY29tcGlsZWRbbmFtZV0gfSxcblx0ICAgICAgICAgICAgICAgIHBhdGg6IG5hbWVcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdH0pO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gUHJlY29tcGlsZWRMb2FkZXI7XG5cblxuLyoqKi8gfSksXG4vKiAxOCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRmdW5jdGlvbiBjeWNsZXIoaXRlbXMpIHtcblx0ICAgIHZhciBpbmRleCA9IC0xO1xuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICAgIGN1cnJlbnQ6IG51bGwsXG5cdCAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICBpbmRleCA9IC0xO1xuXHQgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBuZXh0OiBmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgaW5kZXgrKztcblx0ICAgICAgICAgICAgaWYoaW5kZXggPj0gaXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICBpbmRleCA9IDA7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBpdGVtc1tpbmRleF07XG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnQ7XG5cdCAgICAgICAgfSxcblx0ICAgIH07XG5cblx0fVxuXG5cdGZ1bmN0aW9uIGpvaW5lcihzZXApIHtcblx0ICAgIHNlcCA9IHNlcCB8fCAnLCc7XG5cdCAgICB2YXIgZmlyc3QgPSB0cnVlO1xuXG5cdCAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHZhbCA9IGZpcnN0ID8gJycgOiBzZXA7XG5cdCAgICAgICAgZmlyc3QgPSBmYWxzZTtcblx0ICAgICAgICByZXR1cm4gdmFsO1xuXHQgICAgfTtcblx0fVxuXG5cdC8vIE1ha2luZyB0aGlzIGEgZnVuY3Rpb24gaW5zdGVhZCBzbyBpdCByZXR1cm5zIGEgbmV3IG9iamVjdFxuXHQvLyBlYWNoIHRpbWUgaXQncyBjYWxsZWQuIFRoYXQgd2F5LCBpZiBzb21ldGhpbmcgbGlrZSBhbiBlbnZpcm9ubWVudFxuXHQvLyB1c2VzIGl0LCB0aGV5IHdpbGwgZWFjaCBoYXZlIHRoZWlyIG93biBjb3B5LlxuXHRmdW5jdGlvbiBnbG9iYWxzKCkge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgICByYW5nZTogZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcblx0ICAgICAgICAgICAgaWYodHlwZW9mIHN0b3AgPT09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgICAgICAgICBzdG9wID0gc3RhcnQ7XG5cdCAgICAgICAgICAgICAgICBzdGFydCA9IDA7XG5cdCAgICAgICAgICAgICAgICBzdGVwID0gMTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIGlmKCFzdGVwKSB7XG5cdCAgICAgICAgICAgICAgICBzdGVwID0gMTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHZhciBhcnIgPSBbXTtcblx0ICAgICAgICAgICAgdmFyIGk7XG5cdCAgICAgICAgICAgIGlmIChzdGVwID4gMCkge1xuXHQgICAgICAgICAgICAgICAgZm9yIChpPXN0YXJ0OyBpPHN0b3A7IGkrPXN0ZXApIHtcblx0ICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChpKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIGZvciAoaT1zdGFydDsgaT5zdG9wOyBpKz1zdGVwKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goaSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIGFycjtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLy8gbGlwc3VtOiBmdW5jdGlvbihuLCBodG1sLCBtaW4sIG1heCkge1xuXHQgICAgICAgIC8vIH0sXG5cblx0ICAgICAgICBjeWNsZXI6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICByZXR1cm4gY3ljbGVyKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBqb2luZXI6IGZ1bmN0aW9uKHNlcCkge1xuXHQgICAgICAgICAgICByZXR1cm4gam9pbmVyKHNlcCk7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0fVxuXG5cdG1vZHVsZS5leHBvcnRzID0gZ2xvYmFscztcblxuXG4vKioqLyB9KSxcbi8qIDE5ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIF9fV0VCUEFDS19BTURfREVGSU5FX0FSUkFZX18sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fOy8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihzZXRJbW1lZGlhdGUsIHByb2Nlc3MpIHsvLyBNSVQgbGljZW5zZSAoYnkgRWxhbiBTaGFua2VyKS5cblx0KGZ1bmN0aW9uKGdsb2JhbHMpIHtcblx0ICAndXNlIHN0cmljdCc7XG5cblx0ICB2YXIgZXhlY3V0ZVN5bmMgPSBmdW5jdGlvbigpe1xuXHQgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXHQgICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnZnVuY3Rpb24nKXtcblx0ICAgICAgYXJnc1swXS5hcHBseShudWxsLCBhcmdzLnNwbGljZSgxKSk7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIHZhciBleGVjdXRlQXN5bmMgPSBmdW5jdGlvbihmbil7XG5cdCAgICBpZiAodHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICBzZXRJbW1lZGlhdGUoZm4pO1xuXHQgICAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5uZXh0VGljaykge1xuXHQgICAgICBwcm9jZXNzLm5leHRUaWNrKGZuKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICB2YXIgbWFrZUl0ZXJhdG9yID0gZnVuY3Rpb24gKHRhc2tzKSB7XG5cdCAgICB2YXIgbWFrZUNhbGxiYWNrID0gZnVuY3Rpb24gKGluZGV4KSB7XG5cdCAgICAgIHZhciBmbiA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBpZiAodGFza3MubGVuZ3RoKSB7XG5cdCAgICAgICAgICB0YXNrc1tpbmRleF0uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIGZuLm5leHQoKTtcblx0ICAgICAgfTtcblx0ICAgICAgZm4ubmV4dCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gKGluZGV4IDwgdGFza3MubGVuZ3RoIC0gMSkgPyBtYWtlQ2FsbGJhY2soaW5kZXggKyAxKTogbnVsbDtcblx0ICAgICAgfTtcblx0ICAgICAgcmV0dXJuIGZuO1xuXHQgICAgfTtcblx0ICAgIHJldHVybiBtYWtlQ2FsbGJhY2soMCk7XG5cdCAgfTtcblx0ICBcblx0ICB2YXIgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG1heWJlQXJyYXkpe1xuXHQgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChtYXliZUFycmF5KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcblx0ICB9O1xuXG5cdCAgdmFyIHdhdGVyZmFsbCA9IGZ1bmN0aW9uICh0YXNrcywgY2FsbGJhY2ssIGZvcmNlQXN5bmMpIHtcblx0ICAgIHZhciBuZXh0VGljayA9IGZvcmNlQXN5bmMgPyBleGVjdXRlQXN5bmMgOiBleGVjdXRlU3luYztcblx0ICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG5cdCAgICBpZiAoIV9pc0FycmF5KHRhc2tzKSkge1xuXHQgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCB0byB3YXRlcmZhbGwgbXVzdCBiZSBhbiBhcnJheSBvZiBmdW5jdGlvbnMnKTtcblx0ICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG5cdCAgICB9XG5cdCAgICBpZiAoIXRhc2tzLmxlbmd0aCkge1xuXHQgICAgICByZXR1cm4gY2FsbGJhY2soKTtcblx0ICAgIH1cblx0ICAgIHZhciB3cmFwSXRlcmF0b3IgPSBmdW5jdGlvbiAoaXRlcmF0b3IpIHtcblx0ICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlcnIpIHtcblx0ICAgICAgICBpZiAoZXJyKSB7XG5cdCAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuXHQgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXHQgICAgICAgICAgdmFyIG5leHQgPSBpdGVyYXRvci5uZXh0KCk7XG5cdCAgICAgICAgICBpZiAobmV4dCkge1xuXHQgICAgICAgICAgICBhcmdzLnB1c2god3JhcEl0ZXJhdG9yKG5leHQpKTtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIGFyZ3MucHVzaChjYWxsYmFjayk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICBuZXh0VGljayhmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIGl0ZXJhdG9yLmFwcGx5KG51bGwsIGFyZ3MpO1xuXHQgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9O1xuXHQgICAgfTtcblx0ICAgIHdyYXBJdGVyYXRvcihtYWtlSXRlcmF0b3IodGFza3MpKSgpO1xuXHQgIH07XG5cblx0ICBpZiAodHJ1ZSkge1xuXHQgICAgIShfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fID0gW10sIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gd2F0ZXJmYWxsO1xuXHQgICAgfS5hcHBseShleHBvcnRzLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fKSwgX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX18gIT09IHVuZGVmaW5lZCAmJiAobW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXykpOyAvLyBSZXF1aXJlSlNcblx0ICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdCAgICBtb2R1bGUuZXhwb3J0cyA9IHdhdGVyZmFsbDsgLy8gQ29tbW9uSlNcblx0ICB9IGVsc2Uge1xuXHQgICAgZ2xvYmFscy53YXRlcmZhbGwgPSB3YXRlcmZhbGw7IC8vIDxzY3JpcHQ+XG5cdCAgfVxuXHR9KSh0aGlzKTtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXygyMCkuc2V0SW1tZWRpYXRlLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDExKSkpXG5cbi8qKiovIH0pLFxuLyogMjAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG5cblx0Ly8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuXHRleHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcblx0ICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG5cdH07XG5cdGV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcblx0ICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhckludGVydmFsKTtcblx0fTtcblx0ZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuXHRleHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbih0aW1lb3V0KSB7XG5cdCAgaWYgKHRpbWVvdXQpIHtcblx0ICAgIHRpbWVvdXQuY2xvc2UoKTtcblx0ICB9XG5cdH07XG5cblx0ZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuXHQgIHRoaXMuX2lkID0gaWQ7XG5cdCAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG5cdH1cblx0VGltZW91dC5wcm90b3R5cGUudW5yZWYgPSBUaW1lb3V0LnByb3RvdHlwZS5yZWYgPSBmdW5jdGlvbigpIHt9O1xuXHRUaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHQgIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcblx0fTtcblxuXHQvLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cblx0ZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuXHQgIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblx0ICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xuXHR9O1xuXG5cdGV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG5cdCAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXHQgIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG5cdH07XG5cblx0ZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0ICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cblx0ICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcblx0ICBpZiAobXNlY3MgPj0gMCkge1xuXHQgICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuXHQgICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuXHQgICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuXHQgICAgfSwgbXNlY3MpO1xuXHQgIH1cblx0fTtcblxuXHQvLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5cdF9fd2VicGFja19yZXF1aXJlX18oMjEpO1xuXHRleHBvcnRzLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcblx0ZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xuXG5cbi8qKiovIH0pLFxuLyogMjEgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24oZ2xvYmFsLCBwcm9jZXNzKSB7KGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuXHQgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cblx0ICAgIGlmIChnbG9iYWwuc2V0SW1tZWRpYXRlKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgbmV4dEhhbmRsZSA9IDE7IC8vIFNwZWMgc2F5cyBncmVhdGVyIHRoYW4gemVyb1xuXHQgICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcblx0ICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcblx0ICAgIHZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG5cdCAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cblx0ICAgIGZ1bmN0aW9uIHNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuXHQgICAgICAvLyBDYWxsYmFjayBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24gb3IgYSBzdHJpbmdcblx0ICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdCAgICAgICAgY2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24oXCJcIiArIGNhbGxiYWNrKTtcblx0ICAgICAgfVxuXHQgICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuXHQgICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG5cdCAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG5cdCAgICAgIH1cblx0ICAgICAgLy8gU3RvcmUgYW5kIHJlZ2lzdGVyIHRoZSB0YXNrXG5cdCAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcblx0ICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHRhc2s7XG5cdCAgICAgIHJlZ2lzdGVySW1tZWRpYXRlKG5leHRIYW5kbGUpO1xuXHQgICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShoYW5kbGUpIHtcblx0ICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBydW4odGFzaykge1xuXHQgICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG5cdCAgICAgICAgdmFyIGFyZ3MgPSB0YXNrLmFyZ3M7XG5cdCAgICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuXHQgICAgICAgIGNhc2UgMDpcblx0ICAgICAgICAgICAgY2FsbGJhY2soKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgY2FzZSAxOlxuXHQgICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgY2FzZSAyOlxuXHQgICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgY2FzZSAzOlxuXHQgICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgZGVmYXVsdDpcblx0ICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBydW5JZlByZXNlbnQoaGFuZGxlKSB7XG5cdCAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuXHQgICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG5cdCAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdBVGFzaykge1xuXHQgICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuXHQgICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuXHQgICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcblx0ICAgICAgICAgICAgaWYgKHRhc2spIHtcblx0ICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJ1bih0YXNrKTtcblx0ICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG5cdCAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcblx0ICAgICAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG5cdCAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcblx0ICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcblx0ICAgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcblx0ICAgICAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG5cdCAgICAgICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW4ndCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG5cdCAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcblx0ICAgICAgICAgICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuXHQgICAgICAgICAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcblx0ICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuXHQgICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuXHQgICAgICAgICAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcblx0ICAgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCkge1xuXHQgICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuXHQgICAgICAgIC8vICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5wb3N0TWVzc2FnZVxuXHQgICAgICAgIC8vICogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvY29tbXMuaHRtbCNjcm9zc0RvY3VtZW50TWVzc2FnZXNcblxuXHQgICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG5cdCAgICAgICAgdmFyIG9uR2xvYmFsTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdCAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJlxuXHQgICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcblx0ICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXhPZihtZXNzYWdlUHJlZml4KSA9PT0gMCkge1xuXHQgICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KCtldmVudC5kYXRhLnNsaWNlKG1lc3NhZ2VQcmVmaXgubGVuZ3RoKSk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9O1xuXG5cdCAgICAgICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG5cdCAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuXHQgICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UobWVzc2FnZVByZWZpeCArIGhhbmRsZSwgXCIqXCIpO1xuXHQgICAgICAgIH07XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCkge1xuXHQgICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG5cdCAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuXHQgICAgICAgICAgICB2YXIgaGFuZGxlID0gZXZlbnQuZGF0YTtcblx0ICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG5cdCAgICAgICAgfTtcblxuXHQgICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG5cdCAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcblx0ICAgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuXHQgICAgICAgIHZhciBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudDtcblx0ICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuXHQgICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcblx0ICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cblx0ICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuXHQgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG5cdCAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcblx0ICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblx0ICAgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuXHQgICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG5cdCAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuXHQgICAgICAgIH07XG5cdCAgICB9XG5cblx0ICAgIC8vIElmIHN1cHBvcnRlZCwgd2Ugc2hvdWxkIGF0dGFjaCB0byB0aGUgcHJvdG90eXBlIG9mIGdsb2JhbCwgc2luY2UgdGhhdCBpcyB3aGVyZSBzZXRUaW1lb3V0IGV0IGFsLiBsaXZlLlxuXHQgICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuXHQgICAgYXR0YWNoVG8gPSBhdHRhY2hUbyAmJiBhdHRhY2hUby5zZXRUaW1lb3V0ID8gYXR0YWNoVG8gOiBnbG9iYWw7XG5cblx0ICAgIC8vIERvbid0IGdldCBmb29sZWQgYnkgZS5nLiBicm93c2VyaWZ5IGVudmlyb25tZW50cy5cblx0ICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcblx0ICAgICAgICAvLyBGb3IgTm9kZS5qcyBiZWZvcmUgMC45XG5cdCAgICAgICAgaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKTtcblxuXHQgICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG5cdCAgICAgICAgLy8gRm9yIG5vbi1JRTEwIG1vZGVybiBicm93c2Vyc1xuXHQgICAgICAgIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCk7XG5cblx0ICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG5cdCAgICAgICAgLy8gRm9yIHdlYiB3b3JrZXJzLCB3aGVyZSBzdXBwb3J0ZWRcblx0ICAgICAgICBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpO1xuXG5cdCAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG5cdCAgICAgICAgLy8gRm9yIElFIDbigJM4XG5cdCAgICAgICAgaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAgIC8vIEZvciBvbGRlciBicm93c2Vyc1xuXHQgICAgICAgIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKTtcblx0ICAgIH1cblxuXHQgICAgYXR0YWNoVG8uc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuXHQgICAgYXR0YWNoVG8uY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcblx0fSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KCkpLCBfX3dlYnBhY2tfcmVxdWlyZV9fKDExKSkpXG5cbi8qKiovIH0pLFxuLyogMjIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRmdW5jdGlvbiBpbnN0YWxsQ29tcGF0KCkge1xuXHQgICAgJ3VzZSBzdHJpY3QnO1xuXG5cdCAgICAvLyBUaGlzIG11c3QgYmUgY2FsbGVkIGxpa2UgYG51bmp1Y2tzLmluc3RhbGxDb21wYXRgIHNvIHRoYXQgYHRoaXNgXG5cdCAgICAvLyByZWZlcmVuY2VzIHRoZSBudW5qdWNrcyBpbnN0YW5jZVxuXHQgICAgdmFyIHJ1bnRpbWUgPSB0aGlzLnJ1bnRpbWU7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXHQgICAgdmFyIGxpYiA9IHRoaXMubGliOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblx0ICAgIHZhciBDb21waWxlciA9IHRoaXMuY29tcGlsZXIuQ29tcGlsZXI7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXHQgICAgdmFyIFBhcnNlciA9IHRoaXMucGFyc2VyLlBhcnNlcjsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cdCAgICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblx0ICAgIHZhciBsZXhlciA9IHRoaXMubGV4ZXI7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG5cdCAgICB2YXIgb3JpZ19jb250ZXh0T3JGcmFtZUxvb2t1cCA9IHJ1bnRpbWUuY29udGV4dE9yRnJhbWVMb29rdXA7XG5cdCAgICB2YXIgb3JpZ19Db21waWxlcl9hc3NlcnRUeXBlID0gQ29tcGlsZXIucHJvdG90eXBlLmFzc2VydFR5cGU7XG5cdCAgICB2YXIgb3JpZ19QYXJzZXJfcGFyc2VBZ2dyZWdhdGUgPSBQYXJzZXIucHJvdG90eXBlLnBhcnNlQWdncmVnYXRlO1xuXHQgICAgdmFyIG9yaWdfbWVtYmVyTG9va3VwID0gcnVudGltZS5tZW1iZXJMb29rdXA7XG5cblx0ICAgIGZ1bmN0aW9uIHVuaW5zdGFsbCgpIHtcblx0ICAgICAgICBydW50aW1lLmNvbnRleHRPckZyYW1lTG9va3VwID0gb3JpZ19jb250ZXh0T3JGcmFtZUxvb2t1cDtcblx0ICAgICAgICBDb21waWxlci5wcm90b3R5cGUuYXNzZXJ0VHlwZSA9IG9yaWdfQ29tcGlsZXJfYXNzZXJ0VHlwZTtcblx0ICAgICAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQWdncmVnYXRlID0gb3JpZ19QYXJzZXJfcGFyc2VBZ2dyZWdhdGU7XG5cdCAgICAgICAgcnVudGltZS5tZW1iZXJMb29rdXAgPSBvcmlnX21lbWJlckxvb2t1cDtcblx0ICAgIH1cblxuXHQgICAgcnVudGltZS5jb250ZXh0T3JGcmFtZUxvb2t1cCA9IGZ1bmN0aW9uKGNvbnRleHQsIGZyYW1lLCBrZXkpIHtcblx0ICAgICAgICB2YXIgdmFsID0gb3JpZ19jb250ZXh0T3JGcmFtZUxvb2t1cC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHQgICAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuXHQgICAgICAgICAgICBjYXNlICdUcnVlJzpcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgICAgICAgICBjYXNlICdGYWxzZSc6XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgICAgICAgIGNhc2UgJ05vbmUnOlxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gdmFsO1xuXHQgICAgfTtcblxuXHQgICAgdmFyIFNsaWNlID0gbm9kZXMuTm9kZS5leHRlbmQoJ1NsaWNlJywge1xuXHQgICAgICAgIGZpZWxkczogWydzdGFydCcsICdzdG9wJywgJ3N0ZXAnXSxcblx0ICAgICAgICBpbml0OiBmdW5jdGlvbihsaW5lbm8sIGNvbG5vLCBzdGFydCwgc3RvcCwgc3RlcCkge1xuXHQgICAgICAgICAgICBzdGFydCA9IHN0YXJ0IHx8IG5ldyBub2Rlcy5MaXRlcmFsKGxpbmVubywgY29sbm8sIG51bGwpO1xuXHQgICAgICAgICAgICBzdG9wID0gc3RvcCB8fCBuZXcgbm9kZXMuTGl0ZXJhbChsaW5lbm8sIGNvbG5vLCBudWxsKTtcblx0ICAgICAgICAgICAgc3RlcCA9IHN0ZXAgfHwgbmV3IG5vZGVzLkxpdGVyYWwobGluZW5vLCBjb2xubywgMSk7XG5cdCAgICAgICAgICAgIHRoaXMucGFyZW50KGxpbmVubywgY29sbm8sIHN0YXJ0LCBzdG9wLCBzdGVwKTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgQ29tcGlsZXIucHJvdG90eXBlLmFzc2VydFR5cGUgPSBmdW5jdGlvbihub2RlKSB7XG5cdCAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBTbGljZSkge1xuXHQgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBvcmlnX0NvbXBpbGVyX2Fzc2VydFR5cGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0ICAgIH07XG5cdCAgICBDb21waWxlci5wcm90b3R5cGUuY29tcGlsZVNsaWNlID0gZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLmVtaXQoJygnKTtcblx0ICAgICAgICB0aGlzLl9jb21waWxlRXhwcmVzc2lvbihub2RlLnN0YXJ0LCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCcpLCgnKTtcblx0ICAgICAgICB0aGlzLl9jb21waWxlRXhwcmVzc2lvbihub2RlLnN0b3AsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJyksKCcpO1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKG5vZGUuc3RlcCwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnKScpO1xuXHQgICAgfTtcblxuXHQgICAgZnVuY3Rpb24gZ2V0VG9rZW5zU3RhdGUodG9rZW5zKSB7XG5cdCAgICAgICAgcmV0dXJuIHtcblx0ICAgICAgICAgICAgaW5kZXg6IHRva2Vucy5pbmRleCxcblx0ICAgICAgICAgICAgbGluZW5vOiB0b2tlbnMubGluZW5vLFxuXHQgICAgICAgICAgICBjb2xubzogdG9rZW5zLmNvbG5vXG5cdCAgICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUFnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBzZWxmID0gdGhpcztcblx0ICAgICAgICB2YXIgb3JpZ1N0YXRlID0gZ2V0VG9rZW5zU3RhdGUodGhpcy50b2tlbnMpO1xuXHQgICAgICAgIC8vIFNldCBiYWNrIG9uZSBhY2NvdW50aW5nIGZvciBvcGVuaW5nIGJyYWNrZXQvcGFyZW5zXG5cdCAgICAgICAgb3JpZ1N0YXRlLmNvbG5vLS07XG5cdCAgICAgICAgb3JpZ1N0YXRlLmluZGV4LS07XG5cdCAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgICAgcmV0dXJuIG9yaWdfUGFyc2VyX3BhcnNlQWdncmVnYXRlLmFwcGx5KHRoaXMpO1xuXHQgICAgICAgIH0gY2F0Y2goZSkge1xuXHQgICAgICAgICAgICB2YXIgZXJyU3RhdGUgPSBnZXRUb2tlbnNTdGF0ZSh0aGlzLnRva2Vucyk7XG5cdCAgICAgICAgICAgIHZhciByZXRocm93ID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgICAgICBsaWIuZXh0ZW5kKHNlbGYudG9rZW5zLCBlcnJTdGF0ZSk7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gZTtcblx0ICAgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgICAvLyBSZXNldCB0byBzdGF0ZSBiZWZvcmUgb3JpZ2luYWwgcGFyc2VBZ2dyZWdhdGUgY2FsbGVkXG5cdCAgICAgICAgICAgIGxpYi5leHRlbmQodGhpcy50b2tlbnMsIG9yaWdTdGF0ZSk7XG5cdCAgICAgICAgICAgIHRoaXMucGVla2VkID0gZmFsc2U7XG5cblx0ICAgICAgICAgICAgdmFyIHRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgICAgIGlmICh0b2sudHlwZSAhPT0gbGV4ZXIuVE9LRU5fTEVGVF9CUkFDS0VUKSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyByZXRocm93KCk7XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdmFyIG5vZGUgPSBuZXcgU2xpY2UodG9rLmxpbmVubywgdG9rLmNvbG5vKTtcblxuXHQgICAgICAgICAgICAvLyBJZiB3ZSBkb24ndCBlbmNvdW50ZXIgYSBjb2xvbiB3aGlsZSBwYXJzaW5nLCB0aGlzIGlzIG5vdCBhIHNsaWNlLFxuXHQgICAgICAgICAgICAvLyBzbyByZS1yYWlzZSB0aGUgb3JpZ2luYWwgZXhjZXB0aW9uLlxuXHQgICAgICAgICAgICB2YXIgaXNTbGljZSA9IGZhbHNlO1xuXG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IG5vZGUuZmllbGRzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5za2lwKGxleGVyLlRPS0VOX1JJR0hUX0JSQUNLRVQpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAoaSA9PT0gbm9kZS5maWVsZHMubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGlzU2xpY2UpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZVNsaWNlOiB0b28gbWFueSBzbGljZSBjb21wb25lbnRzJywgdG9rLmxpbmVubywgdG9rLmNvbG5vKTtcblx0ICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5za2lwKGxleGVyLlRPS0VOX0NPTE9OKSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGlzU2xpY2UgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBub2RlLmZpZWxkc1tpXTtcblx0ICAgICAgICAgICAgICAgICAgICBub2RlW2ZpZWxkXSA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgaXNTbGljZSA9IHRoaXMuc2tpcChsZXhlci5UT0tFTl9DT0xPTikgfHwgaXNTbGljZTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBpZiAoIWlzU2xpY2UpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IHJldGhyb3coKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gbmV3IG5vZGVzLkFycmF5KHRvay5saW5lbm8sIHRvay5jb2xubywgW25vZGVdKTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXG5cdCAgICBmdW5jdGlvbiBzbGljZUxvb2t1cChvYmosIHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG5cdCAgICAgICAgb2JqID0gb2JqIHx8IFtdO1xuXHQgICAgICAgIGlmIChzdGFydCA9PT0gbnVsbCkge1xuXHQgICAgICAgICAgICBzdGFydCA9IChzdGVwIDwgMCkgPyAob2JqLmxlbmd0aCAtIDEpIDogMDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKHN0b3AgPT09IG51bGwpIHtcblx0ICAgICAgICAgICAgc3RvcCA9IChzdGVwIDwgMCkgPyAtMSA6IG9iai5sZW5ndGg7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgaWYgKHN0b3AgPCAwKSB7XG5cdCAgICAgICAgICAgICAgICBzdG9wICs9IG9iai5sZW5ndGg7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG5cdCAgICAgICAgICAgIHN0YXJ0ICs9IG9iai5sZW5ndGg7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcblxuXHQgICAgICAgIGZvciAodmFyIGkgPSBzdGFydDsgOyBpICs9IHN0ZXApIHtcblx0ICAgICAgICAgICAgaWYgKGkgPCAwIHx8IGkgPiBvYmoubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBpZiAoc3RlcCA+IDAgJiYgaSA+PSBzdG9wKSB7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBpZiAoc3RlcCA8IDAgJiYgaSA8PSBzdG9wKSB7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXN1bHRzLnB1c2gocnVudGltZS5tZW1iZXJMb29rdXAob2JqLCBpKSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiByZXN1bHRzO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgQVJSQVlfTUVNQkVSUyA9IHtcblx0ICAgICAgICBwb3A6IGZ1bmN0aW9uKGluZGV4KSB7XG5cdCAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wb3AoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5sZW5ndGggfHwgaW5kZXggPCAwKSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tleUVycm9yJyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGFwcGVuZDogZnVuY3Rpb24oZWxlbWVudCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHVzaChlbGVtZW50KTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIHJlbW92ZTogZnVuY3Rpb24oZWxlbWVudCkge1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzW2ldID09PSBlbGVtZW50KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3BsaWNlKGksIDEpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVmFsdWVFcnJvcicpO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgY291bnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0ICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpc1tpXSA9PT0gZWxlbWVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgaW5kZXg6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0ICAgICAgICAgICAgdmFyIGk7XG5cdCAgICAgICAgICAgIGlmICgoaSA9IHRoaXMuaW5kZXhPZihlbGVtZW50KSkgPT09IC0xKSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlRXJyb3InKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gaTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGZpbmQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihlbGVtZW50KTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGluc2VydDogZnVuY3Rpb24oaW5kZXgsIGVsZW0pIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAwLCBlbGVtKTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXHQgICAgdmFyIE9CSkVDVF9NRU1CRVJTID0ge1xuXHQgICAgICAgIGl0ZW1zOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgdmFyIHJldCA9IFtdO1xuXHQgICAgICAgICAgICBmb3IodmFyIGsgaW4gdGhpcykge1xuXHQgICAgICAgICAgICAgICAgcmV0LnB1c2goW2ssIHRoaXNba11dKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gcmV0O1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgdmFsdWVzOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgdmFyIHJldCA9IFtdO1xuXHQgICAgICAgICAgICBmb3IodmFyIGsgaW4gdGhpcykge1xuXHQgICAgICAgICAgICAgICAgcmV0LnB1c2godGhpc1trXSk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIHJldDtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGtleXM6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICB2YXIgcmV0ID0gW107XG5cdCAgICAgICAgICAgIGZvcih2YXIgayBpbiB0aGlzKSB7XG5cdCAgICAgICAgICAgICAgICByZXQucHVzaChrKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gcmV0O1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZ2V0OiBmdW5jdGlvbihrZXksIGRlZikge1xuXHQgICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpc1trZXldO1xuXHQgICAgICAgICAgICBpZiAob3V0cHV0ID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgICAgIG91dHB1dCA9IGRlZjtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgaGFzX2tleTogZnVuY3Rpb24oa2V5KSB7XG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLmhhc093blByb3BlcnR5KGtleSk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBwb3A6IGZ1bmN0aW9uKGtleSwgZGVmKSB7XG5cdCAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzW2tleV07XG5cdCAgICAgICAgICAgIGlmIChvdXRwdXQgPT09IHVuZGVmaW5lZCAmJiBkZWYgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICAgICAgb3V0cHV0ID0gZGVmO1xuXHQgICAgICAgICAgICB9IGVsc2UgaWYgKG91dHB1dCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tleUVycm9yJyk7XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBkZWxldGUgdGhpc1trZXldO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBwb3BpdGVtOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgZm9yICh2YXIgayBpbiB0aGlzKSB7XG5cdCAgICAgICAgICAgICAgICAvLyBSZXR1cm4gdGhlIGZpcnN0IG9iamVjdCBwYWlyLlxuXHQgICAgICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXNba107XG5cdCAgICAgICAgICAgICAgICBkZWxldGUgdGhpc1trXTtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBbaywgdmFsXTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tleUVycm9yJyk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBzZXRkZWZhdWx0OiBmdW5jdGlvbihrZXksIGRlZikge1xuXHQgICAgICAgICAgICBpZiAoa2V5IGluIHRoaXMpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2tleV07XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgaWYgKGRlZiA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgICBkZWYgPSBudWxsO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzW2tleV0gPSBkZWY7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGt3YXJncykge1xuXHQgICAgICAgICAgICBmb3IgKHZhciBrIGluIGt3YXJncykge1xuXHQgICAgICAgICAgICAgICAgdGhpc1trXSA9IGt3YXJnc1trXTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gbnVsbDsgICAgLy8gQWx3YXlzIHJldHVybnMgTm9uZVxuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdCAgICBPQkpFQ1RfTUVNQkVSUy5pdGVyaXRlbXMgPSBPQkpFQ1RfTUVNQkVSUy5pdGVtcztcblx0ICAgIE9CSkVDVF9NRU1CRVJTLml0ZXJ2YWx1ZXMgPSBPQkpFQ1RfTUVNQkVSUy52YWx1ZXM7XG5cdCAgICBPQkpFQ1RfTUVNQkVSUy5pdGVya2V5cyA9IE9CSkVDVF9NRU1CRVJTLmtleXM7XG5cdCAgICBydW50aW1lLm1lbWJlckxvb2t1cCA9IGZ1bmN0aW9uKG9iaiwgdmFsLCBhdXRvZXNjYXBlKSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXHQgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA0KSB7XG5cdCAgICAgICAgICAgIHJldHVybiBzbGljZUxvb2t1cC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBvYmogPSBvYmogfHwge307XG5cblx0ICAgICAgICAvLyBJZiB0aGUgb2JqZWN0IGlzIGFuIG9iamVjdCwgcmV0dXJuIGFueSBvZiB0aGUgbWV0aG9kcyB0aGF0IFB5dGhvbiB3b3VsZFxuXHQgICAgICAgIC8vIG90aGVyd2lzZSBwcm92aWRlLlxuXHQgICAgICAgIGlmIChsaWIuaXNBcnJheShvYmopICYmIEFSUkFZX01FTUJFUlMuaGFzT3duUHJvcGVydHkodmFsKSkge1xuXHQgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7cmV0dXJuIEFSUkFZX01FTUJFUlNbdmFsXS5hcHBseShvYmosIGFyZ3VtZW50cyk7fTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZiAobGliLmlzT2JqZWN0KG9iaikgJiYgT0JKRUNUX01FTUJFUlMuaGFzT3duUHJvcGVydHkodmFsKSkge1xuXHQgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7cmV0dXJuIE9CSkVDVF9NRU1CRVJTW3ZhbF0uYXBwbHkob2JqLCBhcmd1bWVudHMpO307XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIG9yaWdfbWVtYmVyTG9va3VwLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICB9O1xuXG5cdCAgICByZXR1cm4gdW5pbnN0YWxsO1xuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBpbnN0YWxsQ29tcGF0O1xuXG5cbi8qKiovIH0pXG4vKioqKioqLyBdKVxufSk7XG47IiwiaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9saWIvY29udHJvbGxlcic7XG5pbXBvcnQgbnVuanVja3MgZnJvbSAnbnVuanVja3MnO1xuXG5udW5qdWNrcy5jb25maWd1cmUoJy4vZGlzdCcpO1xuXG5mdW5jdGlvbiBnZXROYW1lKHJlcXVlc3QpIHtcbiAgbGV0IG5hbWUgPSB7XG4gICAgZm5hbWU6ICdSaWNrJyxcbiAgICBsbmFtZTogJ1NhbmNoZXonXG4gIH07XG5cbiAgbGV0IG5hbWVQYXJ0cyA9IHJlcXVlc3QucGFyYW1zLm5hbWUgPyByZXF1ZXN0LnBhcmFtcy5uYW1lLnNwbGl0KCcvJykgOiBbXTtcblxuICBuYW1lLmZuYW1lID0gKG5hbWVQYXJ0c1swXSB8fCByZXF1ZXN0LnF1ZXJ5LmZuYW1lKSB8fCBuYW1lLmZuYW1lO1xuICBuYW1lLmxuYW1lID0gKG5hbWVQYXJ0c1sxXSB8fCByZXF1ZXN0LnF1ZXJ5LmxuYW1lKSB8fCBuYW1lLmxuYW1lO1xuICByZXR1cm4gbmFtZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVsbG9Db250cm9sbGVyIGV4dGVuZHMgQ29udHJvbGxlciB7XG4gIHRvU3RyaW5nKGNhbGxiYWNrKSB7XG4gICAgbnVuanVja3MucmVuZGVyU3RyaW5nKCdoZWxsby5odG1sJywgZ2V0TmFtZSh0aGlzLmNvbnRleHQpLCAoZXJyLCBodG1sKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2sobnVsbCwgaHRtbCk7XG4gICAgfSk7XG4gIH1cbiAgaW5kZXgoYXBwbGljYXRpb24sIHJlcXVlc3QsIHJlcGx5LCBjYWxsYmFjaykge1xuICAgIHRoaXMuY29udGV4dC5jb29raWUuc2V0KCdyYW5kb20nLCAnXycgKyAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCkgKyAxKSwge3BhdGg6ICcvJ30pO1xuICAgIGNhbGxiYWNrKG51bGwpO1xuICB9XG59XG4iLCJjb25zb2xlLmxvZygnaGVsbG8gYnJvd3NlcicpO1xuXG5pbXBvcnQgQXBwbGljYXRpb24gZnJvbSAnLi9saWInO1xuaW1wb3J0IEhlbGxvQ29udHJvbGxlciBmcm9tICcuL2hlbGxvLWNvbnRyb2xsZXInO1xuXG5jb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBBcHBsaWNhdGlvbih7XG4gICcvaGVsbG8ve25hbWV9JzogSGVsbG9Db250cm9sbGVyXG59LCB7XG5cbiAgdGFyZ2V0OiAnYm9keSdcbn0pXG5cbmFwcGxpY2F0aW9uLnN0YXJ0KCk7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCkge1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIH1cblxuICBpbmRleChhcHBsaWNhdGlvbiwgcmVxdWVzdCwgcmVwbHksIGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sobnVsbCk7XG4gIH1cblxuICB0b1N0cmluZyhjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrKG51bGwsICfmiJDlip8nKVxuICB9XG59XG4iLCJpbXBvcnQgY29va2llIGZyb20gJ2Nvb2tpZXMtanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldChuYW1lKSB7XG4gICAgcmV0dXJuIGNvb2tpZS5nZXQobmFtZSlcbiAgfSxcbiAgc2V0KG5hbWUsIHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAob3B0aW9ucy5leHBpcmVzKSB7XG4gICAgICBvcHRpb25zLmV4cGlyZXMgLz0gMTAwMDtcbiAgICB9XG5cbiAgICBjb29raWUuc2V0KG5hbWUsIHZhbHVlLCBvcHRpb25zKTtcbiAgfVxufVxuIiwiaW1wb3J0IGNvb2tpZSBmcm9tICcuL2Nvb2tpZS5jbGllbnQnO1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9jb250cm9sbGVyJztcbmltcG9ydCByZXBseUZhY3RvcnkgZnJvbSAnLi9yZXBseS5jbGllbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gIG5hdmlnYXRlKHVybCwgcHVzaCA9IHRydWUpIHtcbiAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIoe1xuICAgICAgcXVlcnk6IHF1ZXJ5LnBhcnNlKHNlYXJjaCksXG4gICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgIGNvb2tpZTogY29va2llXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gKCkgPT4ge307XG4gICAgY29uc3QgcmVwbHkgPSByZXBseUZhY3RvcnkodGhpcyk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGFwcGxpY2F0aW9uKSB7XG4gIGNvbnN0IHJlcGx5ID0gZnVuY3Rpb24oKSB7XG5cbiAgfTtcbiAgcmVwbHkucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwpIHtcbiAgICBhcHBsaWNhdGlvbi5uYXZpZ2F0ZSh1cmwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJlcGx5LnRlbXBvcmFyeSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVwbHkucmV3cml0YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVwbHkucGVybWFuZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXR1cm4gcmVwbHk7XG59XG4iXX0=
