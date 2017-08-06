(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
  }]);

  return HelloController;
}(_controller2.default);

exports.default = HelloController;

},{"./lib/controller":4,"nunjucks":1}],3:[function(require,module,exports){
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

},{"./hello-controller":2,"./lib":5}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Application = function () {
  function Application() {
    _classCallCheck(this, Application);
  }

  _createClass(Application, [{
    key: 'navigate',
    value: function navigate(url) {
      var push = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      console.log(url);

      // history apiに対応していないブラウザではlocationにurlをセットして終了
      if (!history.pushState) {
        window.location = url;
        return;
      }

      console.log(url);

      // push引数がtrueの場合のみ 履歴のスタックにプッシュ
      if (push) {
        history.pushStae({}, null, url);
      }
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      this.popStateListener = window.addEventListener('popstate', function (e) {
        var _window$location = window.location,
            pathname = _window$location.pathname,
            search = _window$location.search;

        var url = '' + pathname + search;
        _this.navigate(url, false);
      });

      // クリックのイベントハンドラ作成
      this.clickListener = document.addeventListener('click', function (e) {
        var target = e.target;

        var identifier = target.dataset.navigate;
        var href = target.getAttribute('href');

        if (identifier !== undefined) {
          if (href) {
            e.preventDefault();
          }

          _this.navigate(identifier || href);
        }
      });
    }
  }]);

  return Application;
}();

exports.default = Application;

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbnVuanVja3MvYnJvd3Nlci9udW5qdWNrcy5qcyIsInNyYy9oZWxsby1jb250cm9sbGVyLmpzIiwic3JjL2luZGV4LmNsaWVudC5qcyIsInNyYy9saWIvY29udHJvbGxlci5qcyIsInNyYy9saWIvaW5kZXguY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNXZOQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxtQkFBUyxTQUFULENBQW1CLFFBQW5COztBQUVBLFNBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQjtBQUN4QixNQUFJLE9BQU87QUFDVCxXQUFPLE1BREU7QUFFVCxXQUFPO0FBRkUsR0FBWDs7QUFLQSxNQUFJLFlBQVksUUFBUSxNQUFSLENBQWUsSUFBZixHQUFzQixRQUFRLE1BQVIsQ0FBZSxJQUFmLENBQW9CLEtBQXBCLENBQTBCLEdBQTFCLENBQXRCLEdBQXVELEVBQXZFOztBQUVBLE9BQUssS0FBTCxHQUFjLFVBQVUsQ0FBVixLQUFnQixRQUFRLEtBQVIsQ0FBYyxLQUEvQixJQUF5QyxLQUFLLEtBQTNEO0FBQ0EsT0FBSyxLQUFMLEdBQWMsVUFBVSxDQUFWLEtBQWdCLFFBQVEsS0FBUixDQUFjLEtBQS9CLElBQXlDLEtBQUssS0FBM0Q7QUFDQSxTQUFPLElBQVA7QUFDRDs7SUFFb0IsZTs7Ozs7Ozs7Ozs7NkJBQ1YsUSxFQUFVO0FBQ2pCLHlCQUFTLFlBQVQsQ0FBc0IsWUFBdEIsRUFBb0MsUUFBUSxLQUFLLE9BQWIsQ0FBcEMsRUFBMkQsVUFBQyxHQUFELEVBQU0sSUFBTixFQUFlO0FBQ3hFLFlBQUksR0FBSixFQUFTO0FBQ1AsaUJBQU8sU0FBUyxHQUFULEVBQWMsSUFBZCxDQUFQO0FBQ0Q7QUFDRCxpQkFBUyxJQUFULEVBQWUsSUFBZjtBQUNELE9BTEQ7QUFNRDs7Ozs7O2tCQVJrQixlOzs7OztBQ2hCckI7Ozs7QUFDQTs7Ozs7O0FBSEEsUUFBUSxHQUFSLENBQVksZUFBWjs7QUFLQSxJQUFNLGNBQWMsa0JBQWdCO0FBQ2xDO0FBRGtDLENBQWhCLEVBRWpCOztBQUVELFVBQVE7QUFGUCxDQUZpQixDQUFwQjs7QUFPQSxZQUFZLEtBQVo7Ozs7Ozs7Ozs7Ozs7SUNacUIsVTtBQUNuQixzQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQ25CLFNBQUssT0FBTCxHQUFlLE9BQWY7QUFDRDs7OzswQkFFSyxXLEVBQWEsTyxFQUFTLEssRUFBTyxRLEVBQVU7QUFDM0MsZUFBUyxJQUFUO0FBQ0Q7Ozs2QkFFUSxRLEVBQVU7QUFDakIsZUFBUyxJQUFULEVBQWUsSUFBZjtBQUNEOzs7Ozs7a0JBWGtCLFU7Ozs7Ozs7Ozs7Ozs7SUNBQSxXOzs7Ozs7OzZCQUNWLEcsRUFBZ0I7QUFBQSxVQUFYLElBQVcsdUVBQU4sSUFBTTs7QUFDdkIsY0FBUSxHQUFSLENBQVksR0FBWjs7QUFFQTtBQUNBLFVBQUksQ0FBQyxRQUFRLFNBQWIsRUFBd0I7QUFDdEIsZUFBTyxRQUFQLEdBQWtCLEdBQWxCO0FBQ0E7QUFDRDs7QUFFRCxjQUFRLEdBQVIsQ0FBWSxHQUFaOztBQUVBO0FBQ0EsVUFBSSxJQUFKLEVBQVU7QUFDUixnQkFBUSxRQUFSLENBQWlCLEVBQWpCLEVBQXFCLElBQXJCLEVBQTJCLEdBQTNCO0FBQ0Q7QUFDRjs7OzRCQUNPO0FBQUE7O0FBQ04sV0FBSyxnQkFBTCxHQUF3QixPQUFPLGdCQUFQLENBQXdCLFVBQXhCLEVBQW9DLFVBQUMsQ0FBRCxFQUFPO0FBQUEsK0JBQ3hDLE9BQU8sUUFEaUM7QUFBQSxZQUM1RCxRQUQ0RCxvQkFDNUQsUUFENEQ7QUFBQSxZQUNsRCxNQURrRCxvQkFDbEQsTUFEa0Q7O0FBRWpFLFlBQUksV0FBUyxRQUFULEdBQW9CLE1BQXhCO0FBQ0EsY0FBSyxRQUFMLENBQWMsR0FBZCxFQUFtQixLQUFuQjtBQUNELE9BSnVCLENBQXhCOztBQU1BO0FBQ0EsV0FBSyxhQUFMLEdBQXFCLFNBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsVUFBQyxDQUFELEVBQU87QUFBQSxZQUN4RCxNQUR3RCxHQUM5QyxDQUQ4QyxDQUN4RCxNQUR3RDs7QUFFN0QsWUFBSSxhQUFhLE9BQU8sT0FBUCxDQUFlLFFBQWhDO0FBQ0EsWUFBSSxPQUFPLE9BQU8sWUFBUCxDQUFvQixNQUFwQixDQUFYOztBQUVBLFlBQUksZUFBZSxTQUFuQixFQUE4QjtBQUM1QixjQUFJLElBQUosRUFBVTtBQUNSLGNBQUUsY0FBRjtBQUNEOztBQUVELGdCQUFLLFFBQUwsQ0FBYyxjQUFjLElBQTVCO0FBQ0Q7QUFDRixPQVpvQixDQUFyQjtBQWFEOzs7Ozs7a0JBdENrQixXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qISBCcm93c2VyIGJ1bmRsZSBvZiBudW5qdWNrcyAzLjAuMSAgKi9cbihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIm51bmp1Y2tzXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIm51bmp1Y2tzXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcblxuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cblxuXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGxpYiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdHZhciBlbnYgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xuXHR2YXIgTG9hZGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNik7XG5cdHZhciBsb2FkZXJzID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNSk7XG5cdHZhciBwcmVjb21waWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXHRtb2R1bGUuZXhwb3J0cy5FbnZpcm9ubWVudCA9IGVudi5FbnZpcm9ubWVudDtcblx0bW9kdWxlLmV4cG9ydHMuVGVtcGxhdGUgPSBlbnYuVGVtcGxhdGU7XG5cblx0bW9kdWxlLmV4cG9ydHMuTG9hZGVyID0gTG9hZGVyO1xuXHRtb2R1bGUuZXhwb3J0cy5GaWxlU3lzdGVtTG9hZGVyID0gbG9hZGVycy5GaWxlU3lzdGVtTG9hZGVyO1xuXHRtb2R1bGUuZXhwb3J0cy5QcmVjb21waWxlZExvYWRlciA9IGxvYWRlcnMuUHJlY29tcGlsZWRMb2FkZXI7XG5cdG1vZHVsZS5leHBvcnRzLldlYkxvYWRlciA9IGxvYWRlcnMuV2ViTG9hZGVyO1xuXG5cdG1vZHVsZS5leHBvcnRzLmNvbXBpbGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3KTtcblx0bW9kdWxlLmV4cG9ydHMucGFyc2VyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg4KTtcblx0bW9kdWxlLmV4cG9ydHMubGV4ZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDkpO1xuXHRtb2R1bGUuZXhwb3J0cy5ydW50aW1lID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMyk7XG5cdG1vZHVsZS5leHBvcnRzLmxpYiA9IGxpYjtcblx0bW9kdWxlLmV4cG9ydHMubm9kZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEwKTtcblxuXHRtb2R1bGUuZXhwb3J0cy5pbnN0YWxsSmluamFDb21wYXQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIyKTtcblxuXHQvLyBBIHNpbmdsZSBpbnN0YW5jZSBvZiBhbiBlbnZpcm9ubWVudCwgc2luY2UgdGhpcyBpcyBzbyBjb21tb25seSB1c2VkXG5cblx0dmFyIGU7XG5cdG1vZHVsZS5leHBvcnRzLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uKHRlbXBsYXRlc1BhdGgsIG9wdHMpIHtcblx0ICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXHQgICAgaWYobGliLmlzT2JqZWN0KHRlbXBsYXRlc1BhdGgpKSB7XG5cdCAgICAgICAgb3B0cyA9IHRlbXBsYXRlc1BhdGg7XG5cdCAgICAgICAgdGVtcGxhdGVzUGF0aCA9IG51bGw7XG5cdCAgICB9XG5cblx0ICAgIHZhciBUZW1wbGF0ZUxvYWRlcjtcblx0ICAgIGlmKGxvYWRlcnMuRmlsZVN5c3RlbUxvYWRlcikge1xuXHQgICAgICAgIFRlbXBsYXRlTG9hZGVyID0gbmV3IGxvYWRlcnMuRmlsZVN5c3RlbUxvYWRlcih0ZW1wbGF0ZXNQYXRoLCB7XG5cdCAgICAgICAgICAgIHdhdGNoOiBvcHRzLndhdGNoLFxuXHQgICAgICAgICAgICBub0NhY2hlOiBvcHRzLm5vQ2FjaGVcblx0ICAgICAgICB9KTtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYobG9hZGVycy5XZWJMb2FkZXIpIHtcblx0ICAgICAgICBUZW1wbGF0ZUxvYWRlciA9IG5ldyBsb2FkZXJzLldlYkxvYWRlcih0ZW1wbGF0ZXNQYXRoLCB7XG5cdCAgICAgICAgICAgIHVzZUNhY2hlOiBvcHRzLndlYiAmJiBvcHRzLndlYi51c2VDYWNoZSxcblx0ICAgICAgICAgICAgYXN5bmM6IG9wdHMud2ViICYmIG9wdHMud2ViLmFzeW5jXG5cdCAgICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIGUgPSBuZXcgZW52LkVudmlyb25tZW50KFRlbXBsYXRlTG9hZGVyLCBvcHRzKTtcblxuXHQgICAgaWYob3B0cyAmJiBvcHRzLmV4cHJlc3MpIHtcblx0ICAgICAgICBlLmV4cHJlc3Mob3B0cy5leHByZXNzKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGU7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuY29tcGlsZSA9IGZ1bmN0aW9uKHNyYywgZW52LCBwYXRoLCBlYWdlckNvbXBpbGUpIHtcblx0ICAgIGlmKCFlKSB7XG5cdCAgICAgICAgbW9kdWxlLmV4cG9ydHMuY29uZmlndXJlKCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gbmV3IG1vZHVsZS5leHBvcnRzLlRlbXBsYXRlKHNyYywgZW52LCBwYXRoLCBlYWdlckNvbXBpbGUpO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzLnJlbmRlciA9IGZ1bmN0aW9uKG5hbWUsIGN0eCwgY2IpIHtcblx0ICAgIGlmKCFlKSB7XG5cdCAgICAgICAgbW9kdWxlLmV4cG9ydHMuY29uZmlndXJlKCk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBlLnJlbmRlcihuYW1lLCBjdHgsIGNiKTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy5yZW5kZXJTdHJpbmcgPSBmdW5jdGlvbihzcmMsIGN0eCwgY2IpIHtcblx0ICAgIGlmKCFlKSB7XG5cdCAgICAgICAgbW9kdWxlLmV4cG9ydHMuY29uZmlndXJlKCk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBlLnJlbmRlclN0cmluZyhzcmMsIGN0eCwgY2IpO1xuXHR9O1xuXG5cdGlmKHByZWNvbXBpbGUpIHtcblx0ICAgIG1vZHVsZS5leHBvcnRzLnByZWNvbXBpbGUgPSBwcmVjb21waWxlLnByZWNvbXBpbGU7XG5cdCAgICBtb2R1bGUuZXhwb3J0cy5wcmVjb21waWxlU3RyaW5nID0gcHJlY29tcGlsZS5wcmVjb21waWxlU3RyaW5nO1xuXHR9XG5cblxuLyoqKi8gfSksXG4vKiAxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXHR2YXIgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5cdHZhciBlc2NhcGVNYXAgPSB7XG5cdCAgICAnJic6ICcmYW1wOycsXG5cdCAgICAnXCInOiAnJnF1b3Q7Jyxcblx0ICAgICdcXCcnOiAnJiMzOTsnLFxuXHQgICAgJzwnOiAnJmx0OycsXG5cdCAgICAnPic6ICcmZ3Q7J1xuXHR9O1xuXG5cdHZhciBlc2NhcGVSZWdleCA9IC9bJlwiJzw+XS9nO1xuXG5cdHZhciBsb29rdXBFc2NhcGUgPSBmdW5jdGlvbihjaCkge1xuXHQgICAgcmV0dXJuIGVzY2FwZU1hcFtjaF07XG5cdH07XG5cblx0dmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5cdGV4cG9ydHMucHJldHRpZnlFcnJvciA9IGZ1bmN0aW9uKHBhdGgsIHdpdGhJbnRlcm5hbHMsIGVycikge1xuXHQgICAgLy8ganNoaW50IC1XMDIyXG5cdCAgICAvLyBodHRwOi8vanNsaW50ZXJyb3JzLmNvbS9kby1ub3QtYXNzaWduLXRvLXRoZS1leGNlcHRpb24tcGFyYW1ldGVyXG5cdCAgICBpZiAoIWVyci5VcGRhdGUpIHtcblx0ICAgICAgICAvLyBub3Qgb25lIG9mIG91cnMsIGNhc3QgaXRcblx0ICAgICAgICBlcnIgPSBuZXcgZXhwb3J0cy5UZW1wbGF0ZUVycm9yKGVycik7XG5cdCAgICB9XG5cdCAgICBlcnIuVXBkYXRlKHBhdGgpO1xuXG5cdCAgICAvLyBVbmxlc3MgdGhleSBtYXJrZWQgdGhlIGRldiBmbGFnLCBzaG93IHRoZW0gYSB0cmFjZSBmcm9tIGhlcmVcblx0ICAgIGlmICghd2l0aEludGVybmFscykge1xuXHQgICAgICAgIHZhciBvbGQgPSBlcnI7XG5cdCAgICAgICAgZXJyID0gbmV3IEVycm9yKG9sZC5tZXNzYWdlKTtcblx0ICAgICAgICBlcnIubmFtZSA9IG9sZC5uYW1lO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZXJyO1xuXHR9O1xuXG5cdGV4cG9ydHMuVGVtcGxhdGVFcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGxpbmVubywgY29sbm8pIHtcblx0ICAgIHZhciBlcnIgPSB0aGlzO1xuXG5cdCAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKSB7IC8vIGZvciBjYXN0aW5nIHJlZ3VsYXIganMgZXJyb3JzXG5cdCAgICAgICAgZXJyID0gbWVzc2FnZTtcblx0ICAgICAgICBtZXNzYWdlID0gbWVzc2FnZS5uYW1lICsgJzogJyArIG1lc3NhZ2UubWVzc2FnZTtcblxuXHQgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICAgIGlmKGVyci5uYW1lID0gJycpIHt9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGNhdGNoKGUpIHtcblx0ICAgICAgICAgICAgLy8gSWYgd2UgY2FuJ3Qgc2V0IHRoZSBuYW1lIG9mIHRoZSBlcnJvciBvYmplY3QgaW4gdGhpc1xuXHQgICAgICAgICAgICAvLyBlbnZpcm9ubWVudCwgZG9uJ3QgdXNlIGl0XG5cdCAgICAgICAgICAgIGVyciA9IHRoaXM7XG5cdCAgICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICBpZihFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuXHQgICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZShlcnIpO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgZXJyLm5hbWUgPSAnVGVtcGxhdGUgcmVuZGVyIGVycm9yJztcblx0ICAgIGVyci5tZXNzYWdlID0gbWVzc2FnZTtcblx0ICAgIGVyci5saW5lbm8gPSBsaW5lbm87XG5cdCAgICBlcnIuY29sbm8gPSBjb2xubztcblx0ICAgIGVyci5maXJzdFVwZGF0ZSA9IHRydWU7XG5cblx0ICAgIGVyci5VcGRhdGUgPSBmdW5jdGlvbihwYXRoKSB7XG5cdCAgICAgICAgdmFyIG1lc3NhZ2UgPSAnKCcgKyAocGF0aCB8fCAndW5rbm93biBwYXRoJykgKyAnKSc7XG5cblx0ICAgICAgICAvLyBvbmx5IHNob3cgbGluZW5vICsgY29sbm8gbmV4dCB0byBwYXRoIG9mIHRlbXBsYXRlXG5cdCAgICAgICAgLy8gd2hlcmUgZXJyb3Igb2NjdXJyZWRcblx0ICAgICAgICBpZiAodGhpcy5maXJzdFVwZGF0ZSkge1xuXHQgICAgICAgICAgICBpZih0aGlzLmxpbmVubyAmJiB0aGlzLmNvbG5vKSB7XG5cdCAgICAgICAgICAgICAgICBtZXNzYWdlICs9ICcgW0xpbmUgJyArIHRoaXMubGluZW5vICsgJywgQ29sdW1uICcgKyB0aGlzLmNvbG5vICsgJ10nO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYodGhpcy5saW5lbm8pIHtcblx0ICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gJyBbTGluZSAnICsgdGhpcy5saW5lbm8gKyAnXSc7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBtZXNzYWdlICs9ICdcXG4gJztcblx0ICAgICAgICBpZiAodGhpcy5maXJzdFVwZGF0ZSkge1xuXHQgICAgICAgICAgICBtZXNzYWdlICs9ICcgJztcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlICsgKHRoaXMubWVzc2FnZSB8fCAnJyk7XG5cdCAgICAgICAgdGhpcy5maXJzdFVwZGF0ZSA9IGZhbHNlO1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgfTtcblxuXHQgICAgcmV0dXJuIGVycjtcblx0fTtcblxuXHRleHBvcnRzLlRlbXBsYXRlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG5cdGV4cG9ydHMuZXNjYXBlID0gZnVuY3Rpb24odmFsKSB7XG5cdCAgcmV0dXJuIHZhbC5yZXBsYWNlKGVzY2FwZVJlZ2V4LCBsb29rdXBFc2NhcGUpO1xuXHR9O1xuXG5cdGV4cG9ydHMuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuXHQgICAgcmV0dXJuIE9ialByb3RvLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0fTtcblxuXHRleHBvcnRzLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuXHQgICAgcmV0dXJuIE9ialByb3RvLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcblx0fTtcblxuXHRleHBvcnRzLmlzU3RyaW5nID0gZnVuY3Rpb24ob2JqKSB7XG5cdCAgICByZXR1cm4gT2JqUHJvdG8udG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBTdHJpbmddJztcblx0fTtcblxuXHRleHBvcnRzLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG5cdCAgICByZXR1cm4gT2JqUHJvdG8udG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJztcblx0fTtcblxuXHRleHBvcnRzLmdyb3VwQnkgPSBmdW5jdGlvbihvYmosIHZhbCkge1xuXHQgICAgdmFyIHJlc3VsdCA9IHt9O1xuXHQgICAgdmFyIGl0ZXJhdG9yID0gZXhwb3J0cy5pc0Z1bmN0aW9uKHZhbCkgPyB2YWwgOiBmdW5jdGlvbihvYmopIHsgcmV0dXJuIG9ialt2YWxdOyB9O1xuXHQgICAgZm9yKHZhciBpPTA7IGk8b2JqLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgdmFyIHZhbHVlID0gb2JqW2ldO1xuXHQgICAgICAgIHZhciBrZXkgPSBpdGVyYXRvcih2YWx1ZSwgaSk7XG5cdCAgICAgICAgKHJlc3VsdFtrZXldIHx8IChyZXN1bHRba2V5XSA9IFtdKSkucHVzaCh2YWx1ZSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdGV4cG9ydHMudG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuXHQgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG9iaik7XG5cdH07XG5cblx0ZXhwb3J0cy53aXRob3V0ID0gZnVuY3Rpb24oYXJyYXkpIHtcblx0ICAgIHZhciByZXN1bHQgPSBbXTtcblx0ICAgIGlmICghYXJyYXkpIHtcblx0ICAgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgfVxuXHQgICAgdmFyIGluZGV4ID0gLTEsXG5cdCAgICBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG5cdCAgICBjb250YWlucyA9IGV4cG9ydHMudG9BcnJheShhcmd1bWVudHMpLnNsaWNlKDEpO1xuXG5cdCAgICB3aGlsZSgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdCAgICAgICAgaWYoZXhwb3J0cy5pbmRleE9mKGNvbnRhaW5zLCBhcnJheVtpbmRleF0pID09PSAtMSkge1xuXHQgICAgICAgICAgICByZXN1bHQucHVzaChhcnJheVtpbmRleF0pO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0ZXhwb3J0cy5leHRlbmQgPSBmdW5jdGlvbihvYmosIG9iajIpIHtcblx0ICAgIGZvcih2YXIgayBpbiBvYmoyKSB7XG5cdCAgICAgICAgb2JqW2tdID0gb2JqMltrXTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBvYmo7XG5cdH07XG5cblx0ZXhwb3J0cy5yZXBlYXQgPSBmdW5jdGlvbihjaGFyXywgbikge1xuXHQgICAgdmFyIHN0ciA9ICcnO1xuXHQgICAgZm9yKHZhciBpPTA7IGk8bjsgaSsrKSB7XG5cdCAgICAgICAgc3RyICs9IGNoYXJfO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHN0cjtcblx0fTtcblxuXHRleHBvcnRzLmVhY2ggPSBmdW5jdGlvbihvYmosIGZ1bmMsIGNvbnRleHQpIHtcblx0ICAgIGlmKG9iaiA9PSBudWxsKSB7XG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBpZihBcnJheVByb3RvLmVhY2ggJiYgb2JqLmVhY2ggPT09IEFycmF5UHJvdG8uZWFjaCkge1xuXHQgICAgICAgIG9iai5mb3JFYWNoKGZ1bmMsIGNvbnRleHQpO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZihvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuXHQgICAgICAgIGZvcih2YXIgaT0wLCBsPW9iai5sZW5ndGg7IGk8bDsgaSsrKSB7XG5cdCAgICAgICAgICAgIGZ1bmMuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaik7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXHR9O1xuXG5cdGV4cG9ydHMubWFwID0gZnVuY3Rpb24ob2JqLCBmdW5jKSB7XG5cdCAgICB2YXIgcmVzdWx0cyA9IFtdO1xuXHQgICAgaWYob2JqID09IG51bGwpIHtcblx0ICAgICAgICByZXR1cm4gcmVzdWx0cztcblx0ICAgIH1cblxuXHQgICAgaWYoQXJyYXlQcm90by5tYXAgJiYgb2JqLm1hcCA9PT0gQXJyYXlQcm90by5tYXApIHtcblx0ICAgICAgICByZXR1cm4gb2JqLm1hcChmdW5jKTtcblx0ICAgIH1cblxuXHQgICAgZm9yKHZhciBpPTA7IGk8b2JqLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aF0gPSBmdW5jKG9ialtpXSwgaSk7XG5cdCAgICB9XG5cblx0ICAgIGlmKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSB7XG5cdCAgICAgICAgcmVzdWx0cy5sZW5ndGggPSBvYmoubGVuZ3RoO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gcmVzdWx0cztcblx0fTtcblxuXHRleHBvcnRzLmFzeW5jSXRlciA9IGZ1bmN0aW9uKGFyciwgaXRlciwgY2IpIHtcblx0ICAgIHZhciBpID0gLTE7XG5cblx0ICAgIGZ1bmN0aW9uIG5leHQoKSB7XG5cdCAgICAgICAgaSsrO1xuXG5cdCAgICAgICAgaWYoaSA8IGFyci5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgaXRlcihhcnJbaV0sIGksIG5leHQsIGNiKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIGNiKCk7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBuZXh0KCk7XG5cdH07XG5cblx0ZXhwb3J0cy5hc3luY0ZvciA9IGZ1bmN0aW9uKG9iaiwgaXRlciwgY2IpIHtcblx0ICAgIHZhciBrZXlzID0gZXhwb3J0cy5rZXlzKG9iaik7XG5cdCAgICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XG5cdCAgICB2YXIgaSA9IC0xO1xuXG5cdCAgICBmdW5jdGlvbiBuZXh0KCkge1xuXHQgICAgICAgIGkrKztcblx0ICAgICAgICB2YXIgayA9IGtleXNbaV07XG5cblx0ICAgICAgICBpZihpIDwgbGVuKSB7XG5cdCAgICAgICAgICAgIGl0ZXIoaywgb2JqW2tdLCBpLCBsZW4sIG5leHQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgY2IoKTtcblx0ICAgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIG5leHQoKTtcblx0fTtcblxuXHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9pbmRleE9mI1BvbHlmaWxsXG5cdGV4cG9ydHMuaW5kZXhPZiA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mID9cblx0ICAgIGZ1bmN0aW9uIChhcnIsIHNlYXJjaEVsZW1lbnQsIGZyb21JbmRleCkge1xuXHQgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGFyciwgc2VhcmNoRWxlbWVudCwgZnJvbUluZGV4KTtcblx0ICAgIH0gOlxuXHQgICAgZnVuY3Rpb24gKGFyciwgc2VhcmNoRWxlbWVudCwgZnJvbUluZGV4KSB7XG5cdCAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoID4+PiAwOyAvLyBIYWNrIHRvIGNvbnZlcnQgb2JqZWN0Lmxlbmd0aCB0byBhIFVJbnQzMlxuXG5cdCAgICAgICAgZnJvbUluZGV4ID0gK2Zyb21JbmRleCB8fCAwO1xuXG5cdCAgICAgICAgaWYoTWF0aC5hYnMoZnJvbUluZGV4KSA9PT0gSW5maW5pdHkpIHtcblx0ICAgICAgICAgICAgZnJvbUluZGV4ID0gMDtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZihmcm9tSW5kZXggPCAwKSB7XG5cdCAgICAgICAgICAgIGZyb21JbmRleCArPSBsZW5ndGg7XG5cdCAgICAgICAgICAgIGlmIChmcm9tSW5kZXggPCAwKSB7XG5cdCAgICAgICAgICAgICAgICBmcm9tSW5kZXggPSAwO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgZm9yKDtmcm9tSW5kZXggPCBsZW5ndGg7IGZyb21JbmRleCsrKSB7XG5cdCAgICAgICAgICAgIGlmIChhcnJbZnJvbUluZGV4XSA9PT0gc2VhcmNoRWxlbWVudCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGZyb21JbmRleDtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiAtMTtcblx0ICAgIH07XG5cblx0aWYoIUFycmF5LnByb3RvdHlwZS5tYXApIHtcblx0ICAgIEFycmF5LnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hcCBpcyB1bmltcGxlbWVudGVkIGZvciB0aGlzIGpzIGVuZ2luZScpO1xuXHQgICAgfTtcblx0fVxuXG5cdGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuXHQgICAgaWYoT2JqZWN0LnByb3RvdHlwZS5rZXlzKSB7XG5cdCAgICAgICAgcmV0dXJuIG9iai5rZXlzKCk7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICB2YXIga2V5cyA9IFtdO1xuXHQgICAgICAgIGZvcih2YXIgayBpbiBvYmopIHtcblx0ICAgICAgICAgICAgaWYob2JqLmhhc093blByb3BlcnR5KGspKSB7XG5cdCAgICAgICAgICAgICAgICBrZXlzLnB1c2goayk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIGtleXM7XG5cdCAgICB9XG5cdH07XG5cblx0ZXhwb3J0cy5pbk9wZXJhdG9yID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XG5cdCAgICBpZiAoZXhwb3J0cy5pc0FycmF5KHZhbCkpIHtcblx0ICAgICAgICByZXR1cm4gZXhwb3J0cy5pbmRleE9mKHZhbCwga2V5KSAhPT0gLTE7XG5cdCAgICB9IGVsc2UgaWYgKGV4cG9ydHMuaXNPYmplY3QodmFsKSkge1xuXHQgICAgICAgIHJldHVybiBrZXkgaW4gdmFsO1xuXHQgICAgfSBlbHNlIGlmIChleHBvcnRzLmlzU3RyaW5nKHZhbCkpIHtcblx0ICAgICAgICByZXR1cm4gdmFsLmluZGV4T2Yoa2V5KSAhPT0gLTE7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBcImluXCIgb3BlcmF0b3IgdG8gc2VhcmNoIGZvciBcIidcblx0ICAgICAgICAgICAgKyBrZXkgKyAnXCIgaW4gdW5leHBlY3RlZCB0eXBlcy4nKTtcblx0ICAgIH1cblx0fTtcblxuXG4vKioqLyB9KSxcbi8qIDIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpO1xuXHR2YXIgYXNhcCA9IF9fd2VicGFja19yZXF1aXJlX18oNCk7XG5cdHZhciBsaWIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHR2YXIgT2JqID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblx0dmFyIGNvbXBpbGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3KTtcblx0dmFyIGJ1aWx0aW5fZmlsdGVycyA9IF9fd2VicGFja19yZXF1aXJlX18oMTQpO1xuXHR2YXIgYnVpbHRpbl9sb2FkZXJzID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNSk7XG5cdHZhciBydW50aW1lID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMyk7XG5cdHZhciBnbG9iYWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXygxOCk7XG5cdHZhciB3YXRlcmZhbGwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE5KTtcblx0dmFyIEZyYW1lID0gcnVudGltZS5GcmFtZTtcblx0dmFyIFRlbXBsYXRlO1xuXG5cdC8vIFVuY29uZGl0aW9uYWxseSBsb2FkIGluIHRoaXMgbG9hZGVyLCBldmVuIGlmIG5vIG90aGVyIG9uZXMgYXJlXG5cdC8vIGluY2x1ZGVkIChwb3NzaWJsZSBpbiB0aGUgc2xpbSBicm93c2VyIGJ1aWxkKVxuXHRidWlsdGluX2xvYWRlcnMuUHJlY29tcGlsZWRMb2FkZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE3KTtcblxuXHQvLyBJZiB0aGUgdXNlciBpcyB1c2luZyB0aGUgYXN5bmMgQVBJLCAqYWx3YXlzKiBjYWxsIGl0XG5cdC8vIGFzeW5jaHJvbm91c2x5IGV2ZW4gaWYgdGhlIHRlbXBsYXRlIHdhcyBzeW5jaHJvbm91cy5cblx0ZnVuY3Rpb24gY2FsbGJhY2tBc2FwKGNiLCBlcnIsIHJlcykge1xuXHQgICAgYXNhcChmdW5jdGlvbigpIHsgY2IoZXJyLCByZXMpOyB9KTtcblx0fVxuXG5cdHZhciBFbnZpcm9ubWVudCA9IE9iai5leHRlbmQoe1xuXHQgICAgaW5pdDogZnVuY3Rpb24obG9hZGVycywgb3B0cykge1xuXHQgICAgICAgIC8vIFRoZSBkZXYgZmxhZyBkZXRlcm1pbmVzIHRoZSB0cmFjZSB0aGF0J2xsIGJlIHNob3duIG9uIGVycm9ycy5cblx0ICAgICAgICAvLyBJZiBzZXQgdG8gdHJ1ZSwgcmV0dXJucyB0aGUgZnVsbCB0cmFjZSBmcm9tIHRoZSBlcnJvciBwb2ludCxcblx0ICAgICAgICAvLyBvdGhlcndpc2Ugd2lsbCByZXR1cm4gdHJhY2Ugc3RhcnRpbmcgZnJvbSBUZW1wbGF0ZS5yZW5kZXJcblx0ICAgICAgICAvLyAodGhlIGZ1bGwgdHJhY2UgZnJvbSB3aXRoaW4gbnVuanVja3MgbWF5IGNvbmZ1c2UgZGV2ZWxvcGVycyB1c2luZ1xuXHQgICAgICAgIC8vICB0aGUgbGlicmFyeSlcblx0ICAgICAgICAvLyBkZWZhdWx0cyB0byBmYWxzZVxuXHQgICAgICAgIG9wdHMgPSB0aGlzLm9wdHMgPSBvcHRzIHx8IHt9O1xuXHQgICAgICAgIHRoaXMub3B0cy5kZXYgPSAhIW9wdHMuZGV2O1xuXG5cdCAgICAgICAgLy8gVGhlIGF1dG9lc2NhcGUgZmxhZyBzZXRzIGdsb2JhbCBhdXRvZXNjYXBpbmcuIElmIHRydWUsXG5cdCAgICAgICAgLy8gZXZlcnkgc3RyaW5nIHZhcmlhYmxlIHdpbGwgYmUgZXNjYXBlZCBieSBkZWZhdWx0LlxuXHQgICAgICAgIC8vIElmIGZhbHNlLCBzdHJpbmdzIGNhbiBiZSBtYW51YWxseSBlc2NhcGVkIHVzaW5nIHRoZSBgZXNjYXBlYCBmaWx0ZXIuXG5cdCAgICAgICAgLy8gZGVmYXVsdHMgdG8gdHJ1ZVxuXHQgICAgICAgIHRoaXMub3B0cy5hdXRvZXNjYXBlID0gb3B0cy5hdXRvZXNjYXBlICE9IG51bGwgPyBvcHRzLmF1dG9lc2NhcGUgOiB0cnVlO1xuXG5cdCAgICAgICAgLy8gSWYgdHJ1ZSwgdGhpcyB3aWxsIG1ha2UgdGhlIHN5c3RlbSB0aHJvdyBlcnJvcnMgaWYgdHJ5aW5nXG5cdCAgICAgICAgLy8gdG8gb3V0cHV0IGEgbnVsbCBvciB1bmRlZmluZWQgdmFsdWVcblx0ICAgICAgICB0aGlzLm9wdHMudGhyb3dPblVuZGVmaW5lZCA9ICEhb3B0cy50aHJvd09uVW5kZWZpbmVkO1xuXHQgICAgICAgIHRoaXMub3B0cy50cmltQmxvY2tzID0gISFvcHRzLnRyaW1CbG9ja3M7XG5cdCAgICAgICAgdGhpcy5vcHRzLmxzdHJpcEJsb2NrcyA9ICEhb3B0cy5sc3RyaXBCbG9ja3M7XG5cblx0ICAgICAgICB0aGlzLmxvYWRlcnMgPSBbXTtcblxuXHQgICAgICAgIGlmKCFsb2FkZXJzKSB7XG5cdCAgICAgICAgICAgIC8vIFRoZSBmaWxlc3lzdGVtIGxvYWRlciBpcyBvbmx5IGF2YWlsYWJsZSBzZXJ2ZXItc2lkZVxuXHQgICAgICAgICAgICBpZihidWlsdGluX2xvYWRlcnMuRmlsZVN5c3RlbUxvYWRlcikge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJzID0gW25ldyBidWlsdGluX2xvYWRlcnMuRmlsZVN5c3RlbUxvYWRlcigndmlld3MnKV07XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSBpZihidWlsdGluX2xvYWRlcnMuV2ViTG9hZGVyKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmxvYWRlcnMgPSBbbmV3IGJ1aWx0aW5fbG9hZGVycy5XZWJMb2FkZXIoJy92aWV3cycpXTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdGhpcy5sb2FkZXJzID0gbGliLmlzQXJyYXkobG9hZGVycykgPyBsb2FkZXJzIDogW2xvYWRlcnNdO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIC8vIEl0J3MgZWFzeSB0byB1c2UgcHJlY29tcGlsZWQgdGVtcGxhdGVzOiBqdXN0IGluY2x1ZGUgdGhlbVxuXHQgICAgICAgIC8vIGJlZm9yZSB5b3UgY29uZmlndXJlIG51bmp1Y2tzIGFuZCB0aGlzIHdpbGwgYXV0b21hdGljYWxseVxuXHQgICAgICAgIC8vIHBpY2sgaXQgdXAgYW5kIHVzZSBpdFxuXHQgICAgICAgIGlmKCh0cnVlKSAmJiB3aW5kb3cubnVuanVja3NQcmVjb21waWxlZCkge1xuXHQgICAgICAgICAgICB0aGlzLmxvYWRlcnMudW5zaGlmdChcblx0ICAgICAgICAgICAgICAgIG5ldyBidWlsdGluX2xvYWRlcnMuUHJlY29tcGlsZWRMb2FkZXIod2luZG93Lm51bmp1Y2tzUHJlY29tcGlsZWQpXG5cdCAgICAgICAgICAgICk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdGhpcy5pbml0Q2FjaGUoKTtcblxuXHQgICAgICAgIHRoaXMuZ2xvYmFscyA9IGdsb2JhbHMoKTtcblx0ICAgICAgICB0aGlzLmZpbHRlcnMgPSB7fTtcblx0ICAgICAgICB0aGlzLmFzeW5jRmlsdGVycyA9IFtdO1xuXHQgICAgICAgIHRoaXMuZXh0ZW5zaW9ucyA9IHt9O1xuXHQgICAgICAgIHRoaXMuZXh0ZW5zaW9uc0xpc3QgPSBbXTtcblxuXHQgICAgICAgIGZvcih2YXIgbmFtZSBpbiBidWlsdGluX2ZpbHRlcnMpIHtcblx0ICAgICAgICAgICAgdGhpcy5hZGRGaWx0ZXIobmFtZSwgYnVpbHRpbl9maWx0ZXJzW25hbWVdKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBpbml0Q2FjaGU6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIC8vIENhY2hpbmcgYW5kIGNhY2hlIGJ1c3Rpbmdcblx0ICAgICAgICBsaWIuZWFjaCh0aGlzLmxvYWRlcnMsIGZ1bmN0aW9uKGxvYWRlcikge1xuXHQgICAgICAgICAgICBsb2FkZXIuY2FjaGUgPSB7fTtcblxuXHQgICAgICAgICAgICBpZih0eXBlb2YgbG9hZGVyLm9uID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgICAgICAgICAgICBsb2FkZXIub24oJ3VwZGF0ZScsIGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgbG9hZGVyLmNhY2hlW3RlbXBsYXRlXSA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXHQgICAgfSxcblxuXHQgICAgYWRkRXh0ZW5zaW9uOiBmdW5jdGlvbihuYW1lLCBleHRlbnNpb24pIHtcblx0ICAgICAgICBleHRlbnNpb24uX25hbWUgPSBuYW1lO1xuXHQgICAgICAgIHRoaXMuZXh0ZW5zaW9uc1tuYW1lXSA9IGV4dGVuc2lvbjtcblx0ICAgICAgICB0aGlzLmV4dGVuc2lvbnNMaXN0LnB1c2goZXh0ZW5zaW9uKTtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH0sXG5cblx0ICAgIHJlbW92ZUV4dGVuc2lvbjogZnVuY3Rpb24obmFtZSkge1xuXHQgICAgICAgIHZhciBleHRlbnNpb24gPSB0aGlzLmdldEV4dGVuc2lvbihuYW1lKTtcblx0ICAgICAgICBpZiAoIWV4dGVuc2lvbikgcmV0dXJuO1xuXG5cdCAgICAgICAgdGhpcy5leHRlbnNpb25zTGlzdCA9IGxpYi53aXRob3V0KHRoaXMuZXh0ZW5zaW9uc0xpc3QsIGV4dGVuc2lvbik7XG5cdCAgICAgICAgZGVsZXRlIHRoaXMuZXh0ZW5zaW9uc1tuYW1lXTtcblx0ICAgIH0sXG5cblx0ICAgIGdldEV4dGVuc2lvbjogZnVuY3Rpb24obmFtZSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLmV4dGVuc2lvbnNbbmFtZV07XG5cdCAgICB9LFxuXG5cdCAgICBoYXNFeHRlbnNpb246IGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICByZXR1cm4gISF0aGlzLmV4dGVuc2lvbnNbbmFtZV07XG5cdCAgICB9LFxuXG5cdCAgICBhZGRHbG9iYWw6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG5cdCAgICAgICAgdGhpcy5nbG9iYWxzW25hbWVdID0gdmFsdWU7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICB9LFxuXG5cdCAgICBnZXRHbG9iYWw6IGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICBpZih0eXBlb2YgdGhpcy5nbG9iYWxzW25hbWVdID09PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dsb2JhbCBub3QgZm91bmQ6ICcgKyBuYW1lKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZ2xvYmFsc1tuYW1lXTtcblx0ICAgIH0sXG5cblx0ICAgIGFkZEZpbHRlcjogZnVuY3Rpb24obmFtZSwgZnVuYywgYXN5bmMpIHtcblx0ICAgICAgICB2YXIgd3JhcHBlZCA9IGZ1bmM7XG5cblx0ICAgICAgICBpZihhc3luYykge1xuXHQgICAgICAgICAgICB0aGlzLmFzeW5jRmlsdGVycy5wdXNoKG5hbWUpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB0aGlzLmZpbHRlcnNbbmFtZV0gPSB3cmFwcGVkO1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0RmlsdGVyOiBmdW5jdGlvbihuYW1lKSB7XG5cdCAgICAgICAgaWYoIXRoaXMuZmlsdGVyc1tuYW1lXSkge1xuXHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpbHRlciBub3QgZm91bmQ6ICcgKyBuYW1lKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyc1tuYW1lXTtcblx0ICAgIH0sXG5cblx0ICAgIHJlc29sdmVUZW1wbGF0ZTogZnVuY3Rpb24obG9hZGVyLCBwYXJlbnROYW1lLCBmaWxlbmFtZSkge1xuXHQgICAgICAgIHZhciBpc1JlbGF0aXZlID0gKGxvYWRlci5pc1JlbGF0aXZlICYmIHBhcmVudE5hbWUpPyBsb2FkZXIuaXNSZWxhdGl2ZShmaWxlbmFtZSkgOiBmYWxzZTtcblx0ICAgICAgICByZXR1cm4gKGlzUmVsYXRpdmUgJiYgbG9hZGVyLnJlc29sdmUpPyBsb2FkZXIucmVzb2x2ZShwYXJlbnROYW1lLCBmaWxlbmFtZSkgOiBmaWxlbmFtZTtcblx0ICAgIH0sXG5cblx0ICAgIGdldFRlbXBsYXRlOiBmdW5jdGlvbihuYW1lLCBlYWdlckNvbXBpbGUsIHBhcmVudE5hbWUsIGlnbm9yZU1pc3NpbmcsIGNiKSB7XG5cdCAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXHQgICAgICAgIHZhciB0bXBsID0gbnVsbDtcblx0ICAgICAgICBpZihuYW1lICYmIG5hbWUucmF3KSB7XG5cdCAgICAgICAgICAgIC8vIHRoaXMgZml4ZXMgYXV0b2VzY2FwZSBmb3IgdGVtcGxhdGVzIHJlZmVyZW5jZWQgaW4gc3ltYm9sc1xuXHQgICAgICAgICAgICBuYW1lID0gbmFtZS5yYXc7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYobGliLmlzRnVuY3Rpb24ocGFyZW50TmFtZSkpIHtcblx0ICAgICAgICAgICAgY2IgPSBwYXJlbnROYW1lO1xuXHQgICAgICAgICAgICBwYXJlbnROYW1lID0gbnVsbDtcblx0ICAgICAgICAgICAgZWFnZXJDb21waWxlID0gZWFnZXJDb21waWxlIHx8IGZhbHNlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKGxpYi5pc0Z1bmN0aW9uKGVhZ2VyQ29tcGlsZSkpIHtcblx0ICAgICAgICAgICAgY2IgPSBlYWdlckNvbXBpbGU7XG5cdCAgICAgICAgICAgIGVhZ2VyQ29tcGlsZSA9IGZhbHNlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmIChuYW1lIGluc3RhbmNlb2YgVGVtcGxhdGUpIHtcblx0ICAgICAgICAgICAgIHRtcGwgPSBuYW1lO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuXHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RlbXBsYXRlIG5hbWVzIG11c3QgYmUgYSBzdHJpbmc6ICcgKyBuYW1lKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sb2FkZXJzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgX25hbWUgPSB0aGlzLnJlc29sdmVUZW1wbGF0ZSh0aGlzLmxvYWRlcnNbaV0sIHBhcmVudE5hbWUsIG5hbWUpO1xuXHQgICAgICAgICAgICAgICAgdG1wbCA9IHRoaXMubG9hZGVyc1tpXS5jYWNoZVtfbmFtZV07XG5cdCAgICAgICAgICAgICAgICBpZiAodG1wbCkgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZih0bXBsKSB7XG5cdCAgICAgICAgICAgIGlmKGVhZ2VyQ29tcGlsZSkge1xuXHQgICAgICAgICAgICAgICAgdG1wbC5jb21waWxlKCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBpZihjYikge1xuXHQgICAgICAgICAgICAgICAgY2IobnVsbCwgdG1wbCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdG1wbDtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHZhciBzeW5jUmVzdWx0O1xuXHQgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgIHZhciBjcmVhdGVUZW1wbGF0ZSA9IGZ1bmN0aW9uKGVyciwgaW5mbykge1xuXHQgICAgICAgICAgICAgICAgaWYoIWluZm8gJiYgIWVycikge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmKCFpZ25vcmVNaXNzaW5nKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGVyciA9IG5ldyBFcnJvcigndGVtcGxhdGUgbm90IGZvdW5kOiAnICsgbmFtZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYoY2IpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgY2IoZXJyKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdG1wbDtcblx0ICAgICAgICAgICAgICAgICAgICBpZihpbmZvKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRtcGwgPSBuZXcgVGVtcGxhdGUoaW5mby5zcmMsIF90aGlzLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8ucGF0aCwgZWFnZXJDb21waWxlKTtcblxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZighaW5mby5ub0NhY2hlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvLmxvYWRlci5jYWNoZVtuYW1lXSA9IHRtcGw7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRtcGwgPSBuZXcgVGVtcGxhdGUoJycsIF90aGlzLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnLCBlYWdlckNvbXBpbGUpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgIGlmKGNiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNiKG51bGwsIHRtcGwpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3luY1Jlc3VsdCA9IHRtcGw7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgIGxpYi5hc3luY0l0ZXIodGhpcy5sb2FkZXJzLCBmdW5jdGlvbihsb2FkZXIsIGksIG5leHQsIGRvbmUpIHtcblx0ICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZShlcnIsIHNyYykge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmKGVycikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBkb25lKGVycik7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoc3JjKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHNyYy5sb2FkZXIgPSBsb2FkZXI7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUobnVsbCwgc3JjKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG5leHQoKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIC8vIFJlc29sdmUgbmFtZSByZWxhdGl2ZSB0byBwYXJlbnROYW1lXG5cdCAgICAgICAgICAgICAgICBuYW1lID0gdGhhdC5yZXNvbHZlVGVtcGxhdGUobG9hZGVyLCBwYXJlbnROYW1lLCBuYW1lKTtcblxuXHQgICAgICAgICAgICAgICAgaWYobG9hZGVyLmFzeW5jKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgbG9hZGVyLmdldFNvdXJjZShuYW1lLCBoYW5kbGUpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaGFuZGxlKG51bGwsIGxvYWRlci5nZXRTb3VyY2UobmFtZSkpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LCBjcmVhdGVUZW1wbGF0ZSk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIHN5bmNSZXN1bHQ7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgZXhwcmVzczogZnVuY3Rpb24oYXBwKSB7XG5cdCAgICAgICAgdmFyIGVudiA9IHRoaXM7XG5cblx0ICAgICAgICBmdW5jdGlvbiBOdW5qdWNrc1ZpZXcobmFtZSwgb3B0cykge1xuXHQgICAgICAgICAgICB0aGlzLm5hbWUgICAgICAgICAgPSBuYW1lO1xuXHQgICAgICAgICAgICB0aGlzLnBhdGggICAgICAgICAgPSBuYW1lO1xuXHQgICAgICAgICAgICB0aGlzLmRlZmF1bHRFbmdpbmUgPSBvcHRzLmRlZmF1bHRFbmdpbmU7XG5cdCAgICAgICAgICAgIHRoaXMuZXh0ICAgICAgICAgICA9IHBhdGguZXh0bmFtZShuYW1lKTtcblx0ICAgICAgICAgICAgaWYgKCF0aGlzLmV4dCAmJiAhdGhpcy5kZWZhdWx0RW5naW5lKSB0aHJvdyBuZXcgRXJyb3IoJ05vIGRlZmF1bHQgZW5naW5lIHdhcyBzcGVjaWZpZWQgYW5kIG5vIGV4dGVuc2lvbiB3YXMgcHJvdmlkZWQuJyk7XG5cdCAgICAgICAgICAgIGlmICghdGhpcy5leHQpIHRoaXMubmFtZSArPSAodGhpcy5leHQgPSAoJy4nICE9PSB0aGlzLmRlZmF1bHRFbmdpbmVbMF0gPyAnLicgOiAnJykgKyB0aGlzLmRlZmF1bHRFbmdpbmUpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIE51bmp1Y2tzVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24ob3B0cywgY2IpIHtcblx0ICAgICAgICAgIGVudi5yZW5kZXIodGhpcy5uYW1lLCBvcHRzLCBjYik7XG5cdCAgICAgICAgfTtcblxuXHQgICAgICAgIGFwcC5zZXQoJ3ZpZXcnLCBOdW5qdWNrc1ZpZXcpO1xuXHQgICAgICAgIGFwcC5zZXQoJ251bmp1Y2tzRW52JywgdGhpcyk7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICB9LFxuXG5cdCAgICByZW5kZXI6IGZ1bmN0aW9uKG5hbWUsIGN0eCwgY2IpIHtcblx0ICAgICAgICBpZihsaWIuaXNGdW5jdGlvbihjdHgpKSB7XG5cdCAgICAgICAgICAgIGNiID0gY3R4O1xuXHQgICAgICAgICAgICBjdHggPSBudWxsO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIC8vIFdlIHN1cHBvcnQgYSBzeW5jaHJvbm91cyBBUEkgdG8gbWFrZSBpdCBlYXNpZXIgdG8gbWlncmF0ZVxuXHQgICAgICAgIC8vIGV4aXN0aW5nIGNvZGUgdG8gYXN5bmMuIFRoaXMgd29ya3MgYmVjYXVzZSBpZiB5b3UgZG9uJ3QgZG9cblx0ICAgICAgICAvLyBhbnl0aGluZyBhc3luYyB3b3JrLCB0aGUgd2hvbGUgdGhpbmcgaXMgYWN0dWFsbHkgcnVuXG5cdCAgICAgICAgLy8gc3luY2hyb25vdXNseS5cblx0ICAgICAgICB2YXIgc3luY1Jlc3VsdCA9IG51bGw7XG5cblx0ICAgICAgICB0aGlzLmdldFRlbXBsYXRlKG5hbWUsIGZ1bmN0aW9uKGVyciwgdG1wbCkge1xuXHQgICAgICAgICAgICBpZihlcnIgJiYgY2IpIHtcblx0ICAgICAgICAgICAgICAgIGNhbGxiYWNrQXNhcChjYiwgZXJyKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIGlmKGVycikge1xuXHQgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgc3luY1Jlc3VsdCA9IHRtcGwucmVuZGVyKGN0eCwgY2IpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICByZXR1cm4gc3luY1Jlc3VsdDtcblx0ICAgIH0sXG5cblx0ICAgIHJlbmRlclN0cmluZzogZnVuY3Rpb24oc3JjLCBjdHgsIG9wdHMsIGNiKSB7XG5cdCAgICAgICAgaWYobGliLmlzRnVuY3Rpb24ob3B0cykpIHtcblx0ICAgICAgICAgICAgY2IgPSBvcHRzO1xuXHQgICAgICAgICAgICBvcHRzID0ge307XG5cdCAgICAgICAgfVxuXHQgICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG5cdCAgICAgICAgdmFyIHRtcGwgPSBuZXcgVGVtcGxhdGUoc3JjLCB0aGlzLCBvcHRzLnBhdGgpO1xuXHQgICAgICAgIHJldHVybiB0bXBsLnJlbmRlcihjdHgsIGNiKTtcblx0ICAgIH0sXG5cblx0ICAgIHdhdGVyZmFsbDogd2F0ZXJmYWxsXG5cdH0pO1xuXG5cdHZhciBDb250ZXh0ID0gT2JqLmV4dGVuZCh7XG5cdCAgICBpbml0OiBmdW5jdGlvbihjdHgsIGJsb2NrcywgZW52KSB7XG5cdCAgICAgICAgLy8gSGFzIHRvIGJlIHRpZWQgdG8gYW4gZW52aXJvbm1lbnQgc28gd2UgY2FuIHRhcCBpbnRvIGl0cyBnbG9iYWxzLlxuXHQgICAgICAgIHRoaXMuZW52ID0gZW52IHx8IG5ldyBFbnZpcm9ubWVudCgpO1xuXG5cdCAgICAgICAgLy8gTWFrZSBhIGR1cGxpY2F0ZSBvZiBjdHhcblx0ICAgICAgICB0aGlzLmN0eCA9IHt9O1xuXHQgICAgICAgIGZvcih2YXIgayBpbiBjdHgpIHtcblx0ICAgICAgICAgICAgaWYoY3R4Lmhhc093blByb3BlcnR5KGspKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmN0eFtrXSA9IGN0eFtrXTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuYmxvY2tzID0ge307XG5cdCAgICAgICAgdGhpcy5leHBvcnRlZCA9IFtdO1xuXG5cdCAgICAgICAgZm9yKHZhciBuYW1lIGluIGJsb2Nrcykge1xuXHQgICAgICAgICAgICB0aGlzLmFkZEJsb2NrKG5hbWUsIGJsb2Nrc1tuYW1lXSk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgbG9va3VwOiBmdW5jdGlvbihuYW1lKSB7XG5cdCAgICAgICAgLy8gVGhpcyBpcyBvbmUgb2YgdGhlIG1vc3QgY2FsbGVkIGZ1bmN0aW9ucywgc28gb3B0aW1pemUgZm9yXG5cdCAgICAgICAgLy8gdGhlIHR5cGljYWwgY2FzZSB3aGVyZSB0aGUgbmFtZSBpc24ndCBpbiB0aGUgZ2xvYmFsc1xuXHQgICAgICAgIGlmKG5hbWUgaW4gdGhpcy5lbnYuZ2xvYmFscyAmJiAhKG5hbWUgaW4gdGhpcy5jdHgpKSB7XG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLmVudi5nbG9iYWxzW25hbWVdO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3R4W25hbWVdO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIHNldFZhcmlhYmxlOiBmdW5jdGlvbihuYW1lLCB2YWwpIHtcblx0ICAgICAgICB0aGlzLmN0eFtuYW1lXSA9IHZhbDtcblx0ICAgIH0sXG5cblx0ICAgIGdldFZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuY3R4O1xuXHQgICAgfSxcblxuXHQgICAgYWRkQmxvY2s6IGZ1bmN0aW9uKG5hbWUsIGJsb2NrKSB7XG5cdCAgICAgICAgdGhpcy5ibG9ja3NbbmFtZV0gPSB0aGlzLmJsb2Nrc1tuYW1lXSB8fCBbXTtcblx0ICAgICAgICB0aGlzLmJsb2Nrc1tuYW1lXS5wdXNoKGJsb2NrKTtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH0sXG5cblx0ICAgIGdldEJsb2NrOiBmdW5jdGlvbihuYW1lKSB7XG5cdCAgICAgICAgaWYoIXRoaXMuYmxvY2tzW25hbWVdKSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biBibG9jayBcIicgKyBuYW1lICsgJ1wiJyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuYmxvY2tzW25hbWVdWzBdO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0U3VwZXI6IGZ1bmN0aW9uKGVudiwgbmFtZSwgYmxvY2ssIGZyYW1lLCBydW50aW1lLCBjYikge1xuXHQgICAgICAgIHZhciBpZHggPSBsaWIuaW5kZXhPZih0aGlzLmJsb2Nrc1tuYW1lXSB8fCBbXSwgYmxvY2spO1xuXHQgICAgICAgIHZhciBibGsgPSB0aGlzLmJsb2Nrc1tuYW1lXVtpZHggKyAxXTtcblx0ICAgICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG5cblx0ICAgICAgICBpZihpZHggPT09IC0xIHx8ICFibGspIHtcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBzdXBlciBibG9jayBhdmFpbGFibGUgZm9yIFwiJyArIG5hbWUgKyAnXCInKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBibGsoZW52LCBjb250ZXh0LCBmcmFtZSwgcnVudGltZSwgY2IpO1xuXHQgICAgfSxcblxuXHQgICAgYWRkRXhwb3J0OiBmdW5jdGlvbihuYW1lKSB7XG5cdCAgICAgICAgdGhpcy5leHBvcnRlZC5wdXNoKG5hbWUpO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0RXhwb3J0ZWQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBleHBvcnRlZCA9IHt9O1xuXHQgICAgICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuZXhwb3J0ZWQubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmV4cG9ydGVkW2ldO1xuXHQgICAgICAgICAgICBleHBvcnRlZFtuYW1lXSA9IHRoaXMuY3R4W25hbWVdO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gZXhwb3J0ZWQ7XG5cdCAgICB9XG5cdH0pO1xuXG5cdFRlbXBsYXRlID0gT2JqLmV4dGVuZCh7XG5cdCAgICBpbml0OiBmdW5jdGlvbiAoc3JjLCBlbnYsIHBhdGgsIGVhZ2VyQ29tcGlsZSkge1xuXHQgICAgICAgIHRoaXMuZW52ID0gZW52IHx8IG5ldyBFbnZpcm9ubWVudCgpO1xuXG5cdCAgICAgICAgaWYobGliLmlzT2JqZWN0KHNyYykpIHtcblx0ICAgICAgICAgICAgc3dpdGNoKHNyYy50eXBlKSB7XG5cdCAgICAgICAgICAgIGNhc2UgJ2NvZGUnOiB0aGlzLnRtcGxQcm9wcyA9IHNyYy5vYmo7IGJyZWFrO1xuXHQgICAgICAgICAgICBjYXNlICdzdHJpbmcnOiB0aGlzLnRtcGxTdHIgPSBzcmMub2JqOyBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKGxpYi5pc1N0cmluZyhzcmMpKSB7XG5cdCAgICAgICAgICAgIHRoaXMudG1wbFN0ciA9IHNyYztcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc3JjIG11c3QgYmUgYSBzdHJpbmcgb3IgYW4gb2JqZWN0IGRlc2NyaWJpbmcgJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGhlIHNvdXJjZScpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG5cblx0ICAgICAgICBpZihlYWdlckNvbXBpbGUpIHtcblx0ICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblx0ICAgICAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgICAgICAgIF90aGlzLl9jb21waWxlKCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgY2F0Y2goZXJyKSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyBsaWIucHJldHRpZnlFcnJvcih0aGlzLnBhdGgsIHRoaXMuZW52Lm9wdHMuZGV2LCBlcnIpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0aGlzLmNvbXBpbGVkID0gZmFsc2U7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgcmVuZGVyOiBmdW5jdGlvbihjdHgsIHBhcmVudEZyYW1lLCBjYikge1xuXHQgICAgICAgIGlmICh0eXBlb2YgY3R4ID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgICAgICAgIGNiID0gY3R4O1xuXHQgICAgICAgICAgICBjdHggPSB7fTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcmVudEZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgICAgICAgIGNiID0gcGFyZW50RnJhbWU7XG5cdCAgICAgICAgICAgIHBhcmVudEZyYW1lID0gbnVsbDtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgZm9yY2VBc3luYyA9IHRydWU7XG5cdCAgICAgICAgaWYocGFyZW50RnJhbWUpIHtcblx0ICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBmcmFtZSwgd2UgYXJlIGJlaW5nIGNhbGxlZCBmcm9tIGludGVybmFsXG5cdCAgICAgICAgICAgIC8vIGNvZGUgb2YgYW5vdGhlciB0ZW1wbGF0ZSwgYW5kIHRoZSBpbnRlcm5hbCBzeXN0ZW1cblx0ICAgICAgICAgICAgLy8gZGVwZW5kcyBvbiB0aGUgc3luYy9hc3luYyBuYXR1cmUgb2YgdGhlIHBhcmVudCB0ZW1wbGF0ZVxuXHQgICAgICAgICAgICAvLyB0byBiZSBpbmhlcml0ZWQsIHNvIGZvcmNlIGFuIGFzeW5jIGNhbGxiYWNrXG5cdCAgICAgICAgICAgIGZvcmNlQXN5bmMgPSBmYWxzZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXHQgICAgICAgIC8vIENhdGNoIGNvbXBpbGUgZXJyb3JzIGZvciBhc3luYyByZW5kZXJpbmdcblx0ICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICBfdGhpcy5jb21waWxlKCk7XG5cdCAgICAgICAgfSBjYXRjaCAoX2Vycikge1xuXHQgICAgICAgICAgICB2YXIgZXJyID0gbGliLnByZXR0aWZ5RXJyb3IodGhpcy5wYXRoLCB0aGlzLmVudi5vcHRzLmRldiwgX2Vycik7XG5cdCAgICAgICAgICAgIGlmIChjYikgcmV0dXJuIGNhbGxiYWNrQXNhcChjYiwgZXJyKTtcblx0ICAgICAgICAgICAgZWxzZSB0aHJvdyBlcnI7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dChjdHggfHwge30sIF90aGlzLmJsb2NrcywgX3RoaXMuZW52KTtcblx0ICAgICAgICB2YXIgZnJhbWUgPSBwYXJlbnRGcmFtZSA/IHBhcmVudEZyYW1lLnB1c2godHJ1ZSkgOiBuZXcgRnJhbWUoKTtcblx0ICAgICAgICBmcmFtZS50b3BMZXZlbCA9IHRydWU7XG5cdCAgICAgICAgdmFyIHN5bmNSZXN1bHQgPSBudWxsO1xuXG5cdCAgICAgICAgX3RoaXMucm9vdFJlbmRlckZ1bmMoXG5cdCAgICAgICAgICAgIF90aGlzLmVudixcblx0ICAgICAgICAgICAgY29udGV4dCxcblx0ICAgICAgICAgICAgZnJhbWUgfHwgbmV3IEZyYW1lKCksXG5cdCAgICAgICAgICAgIHJ1bnRpbWUsXG5cdCAgICAgICAgICAgIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG5cdCAgICAgICAgICAgICAgICBpZihlcnIpIHtcblx0ICAgICAgICAgICAgICAgICAgICBlcnIgPSBsaWIucHJldHRpZnlFcnJvcihfdGhpcy5wYXRoLCBfdGhpcy5lbnYub3B0cy5kZXYsIGVycik7XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIGlmKGNiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYoZm9yY2VBc3luYykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja0FzYXAoY2IsIGVyciwgcmVzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNiKGVyciwgcmVzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZihlcnIpIHsgdGhyb3cgZXJyOyB9XG5cdCAgICAgICAgICAgICAgICAgICAgc3luY1Jlc3VsdCA9IHJlcztcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICk7XG5cblx0ICAgICAgICByZXR1cm4gc3luY1Jlc3VsdDtcblx0ICAgIH0sXG5cblxuXHQgICAgZ2V0RXhwb3J0ZWQ6IGZ1bmN0aW9uKGN0eCwgcGFyZW50RnJhbWUsIGNiKSB7XG5cdCAgICAgICAgaWYgKHR5cGVvZiBjdHggPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICAgICAgY2IgPSBjdHg7XG5cdCAgICAgICAgICAgIGN0eCA9IHt9O1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmICh0eXBlb2YgcGFyZW50RnJhbWUgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICAgICAgY2IgPSBwYXJlbnRGcmFtZTtcblx0ICAgICAgICAgICAgcGFyZW50RnJhbWUgPSBudWxsO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIC8vIENhdGNoIGNvbXBpbGUgZXJyb3JzIGZvciBhc3luYyByZW5kZXJpbmdcblx0ICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICB0aGlzLmNvbXBpbGUoKTtcblx0ICAgICAgICB9IGNhdGNoIChlKSB7XG5cdCAgICAgICAgICAgIGlmIChjYikgcmV0dXJuIGNiKGUpO1xuXHQgICAgICAgICAgICBlbHNlIHRocm93IGU7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIGZyYW1lID0gcGFyZW50RnJhbWUgPyBwYXJlbnRGcmFtZS5wdXNoKCkgOiBuZXcgRnJhbWUoKTtcblx0ICAgICAgICBmcmFtZS50b3BMZXZlbCA9IHRydWU7XG5cblx0ICAgICAgICAvLyBSdW4gdGhlIHJvb3RSZW5kZXJGdW5jIHRvIHBvcHVsYXRlIHRoZSBjb250ZXh0IHdpdGggZXhwb3J0ZWQgdmFyc1xuXHQgICAgICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQoY3R4IHx8IHt9LCB0aGlzLmJsb2NrcywgdGhpcy5lbnYpO1xuXHQgICAgICAgIHRoaXMucm9vdFJlbmRlckZ1bmModGhpcy5lbnYsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBydW50aW1lLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZXJyKSB7XG5cdCAgICAgICAgXHRcdCAgICAgICAgaWYgKCBlcnIgKSB7XG5cdCAgICAgICAgXHRcdFx0ICAgIGNiKGVyciwgbnVsbCk7XG5cdCAgICAgICAgXHRcdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBcdFx0XHQgICAgY2IobnVsbCwgY29udGV4dC5nZXRFeHBvcnRlZCgpKTtcblx0ICAgICAgICBcdFx0ICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGU6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIGlmKCF0aGlzLmNvbXBpbGVkKSB7XG5cdCAgICAgICAgICAgIHRoaXMuX2NvbXBpbGUoKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBfY29tcGlsZTogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHByb3BzO1xuXG5cdCAgICAgICAgaWYodGhpcy50bXBsUHJvcHMpIHtcblx0ICAgICAgICAgICAgcHJvcHMgPSB0aGlzLnRtcGxQcm9wcztcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHZhciBzb3VyY2UgPSBjb21waWxlci5jb21waWxlKHRoaXMudG1wbFN0cixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbnYuYXN5bmNGaWx0ZXJzLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVudi5leHRlbnNpb25zTGlzdCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVudi5vcHRzKTtcblxuXHQgICAgICAgICAgICAvKiBqc2xpbnQgZXZpbDogdHJ1ZSAqL1xuXHQgICAgICAgICAgICB2YXIgZnVuYyA9IG5ldyBGdW5jdGlvbihzb3VyY2UpO1xuXHQgICAgICAgICAgICBwcm9wcyA9IGZ1bmMoKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmJsb2NrcyA9IHRoaXMuX2dldEJsb2Nrcyhwcm9wcyk7XG5cdCAgICAgICAgdGhpcy5yb290UmVuZGVyRnVuYyA9IHByb3BzLnJvb3Q7XG5cdCAgICAgICAgdGhpcy5jb21waWxlZCA9IHRydWU7XG5cdCAgICB9LFxuXG5cdCAgICBfZ2V0QmxvY2tzOiBmdW5jdGlvbihwcm9wcykge1xuXHQgICAgICAgIHZhciBibG9ja3MgPSB7fTtcblxuXHQgICAgICAgIGZvcih2YXIgayBpbiBwcm9wcykge1xuXHQgICAgICAgICAgICBpZihrLnNsaWNlKDAsIDIpID09PSAnYl8nKSB7XG5cdCAgICAgICAgICAgICAgICBibG9ja3Nbay5zbGljZSgyKV0gPSBwcm9wc1trXTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBibG9ja3M7XG5cdCAgICB9XG5cdH0pO1xuXG5cdG1vZHVsZS5leHBvcnRzID0ge1xuXHQgICAgRW52aXJvbm1lbnQ6IEVudmlyb25tZW50LFxuXHQgICAgVGVtcGxhdGU6IFRlbXBsYXRlXG5cdH07XG5cblxuLyoqKi8gfSksXG4vKiAzICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XG5cbi8qKiovIH0pLFxuLyogNCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8vIHJhd0FzYXAgcHJvdmlkZXMgZXZlcnl0aGluZyB3ZSBuZWVkIGV4Y2VwdCBleGNlcHRpb24gbWFuYWdlbWVudC5cblx0dmFyIHJhd0FzYXAgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xuXHQvLyBSYXdUYXNrcyBhcmUgcmVjeWNsZWQgdG8gcmVkdWNlIEdDIGNodXJuLlxuXHR2YXIgZnJlZVRhc2tzID0gW107XG5cdC8vIFdlIHF1ZXVlIGVycm9ycyB0byBlbnN1cmUgdGhleSBhcmUgdGhyb3duIGluIHJpZ2h0IG9yZGVyIChGSUZPKS5cblx0Ly8gQXJyYXktYXMtcXVldWUgaXMgZ29vZCBlbm91Z2ggaGVyZSwgc2luY2Ugd2UgYXJlIGp1c3QgZGVhbGluZyB3aXRoIGV4Y2VwdGlvbnMuXG5cdHZhciBwZW5kaW5nRXJyb3JzID0gW107XG5cdHZhciByZXF1ZXN0RXJyb3JUaHJvdyA9IHJhd0FzYXAubWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKHRocm93Rmlyc3RFcnJvcik7XG5cblx0ZnVuY3Rpb24gdGhyb3dGaXJzdEVycm9yKCkge1xuXHQgICAgaWYgKHBlbmRpbmdFcnJvcnMubGVuZ3RoKSB7XG5cdCAgICAgICAgdGhyb3cgcGVuZGluZ0Vycm9ycy5zaGlmdCgpO1xuXHQgICAgfVxuXHR9XG5cblx0LyoqXG5cdCAqIENhbGxzIGEgdGFzayBhcyBzb29uIGFzIHBvc3NpYmxlIGFmdGVyIHJldHVybmluZywgaW4gaXRzIG93biBldmVudCwgd2l0aCBwcmlvcml0eVxuXHQgKiBvdmVyIG90aGVyIGV2ZW50cyBsaWtlIGFuaW1hdGlvbiwgcmVmbG93LCBhbmQgcmVwYWludC4gQW4gZXJyb3IgdGhyb3duIGZyb20gYW5cblx0ICogZXZlbnQgd2lsbCBub3QgaW50ZXJydXB0LCBub3IgZXZlbiBzdWJzdGFudGlhbGx5IHNsb3cgZG93biB0aGUgcHJvY2Vzc2luZyBvZlxuXHQgKiBvdGhlciBldmVudHMsIGJ1dCB3aWxsIGJlIHJhdGhlciBwb3N0cG9uZWQgdG8gYSBsb3dlciBwcmlvcml0eSBldmVudC5cblx0ICogQHBhcmFtIHt7Y2FsbH19IHRhc2sgQSBjYWxsYWJsZSBvYmplY3QsIHR5cGljYWxseSBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgbm9cblx0ICogYXJndW1lbnRzLlxuXHQgKi9cblx0bW9kdWxlLmV4cG9ydHMgPSBhc2FwO1xuXHRmdW5jdGlvbiBhc2FwKHRhc2spIHtcblx0ICAgIHZhciByYXdUYXNrO1xuXHQgICAgaWYgKGZyZWVUYXNrcy5sZW5ndGgpIHtcblx0ICAgICAgICByYXdUYXNrID0gZnJlZVRhc2tzLnBvcCgpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICByYXdUYXNrID0gbmV3IFJhd1Rhc2soKTtcblx0ICAgIH1cblx0ICAgIHJhd1Rhc2sudGFzayA9IHRhc2s7XG5cdCAgICByYXdBc2FwKHJhd1Rhc2spO1xuXHR9XG5cblx0Ly8gV2Ugd3JhcCB0YXNrcyB3aXRoIHJlY3ljbGFibGUgdGFzayBvYmplY3RzLiAgQSB0YXNrIG9iamVjdCBpbXBsZW1lbnRzXG5cdC8vIGBjYWxsYCwganVzdCBsaWtlIGEgZnVuY3Rpb24uXG5cdGZ1bmN0aW9uIFJhd1Rhc2soKSB7XG5cdCAgICB0aGlzLnRhc2sgPSBudWxsO1xuXHR9XG5cblx0Ly8gVGhlIHNvbGUgcHVycG9zZSBvZiB3cmFwcGluZyB0aGUgdGFzayBpcyB0byBjYXRjaCB0aGUgZXhjZXB0aW9uIGFuZCByZWN5Y2xlXG5cdC8vIHRoZSB0YXNrIG9iamVjdCBhZnRlciBpdHMgc2luZ2xlIHVzZS5cblx0UmF3VGFzay5wcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIHRyeSB7XG5cdCAgICAgICAgdGhpcy50YXNrLmNhbGwoKTtcblx0ICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgICAgaWYgKGFzYXAub25lcnJvcikge1xuXHQgICAgICAgICAgICAvLyBUaGlzIGhvb2sgZXhpc3RzIHB1cmVseSBmb3IgdGVzdGluZyBwdXJwb3Nlcy5cblx0ICAgICAgICAgICAgLy8gSXRzIG5hbWUgd2lsbCBiZSBwZXJpb2RpY2FsbHkgcmFuZG9taXplZCB0byBicmVhayBhbnkgY29kZSB0aGF0XG5cdCAgICAgICAgICAgIC8vIGRlcGVuZHMgb24gaXRzIGV4aXN0ZW5jZS5cblx0ICAgICAgICAgICAgYXNhcC5vbmVycm9yKGVycm9yKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAvLyBJbiBhIHdlYiBicm93c2VyLCBleGNlcHRpb25zIGFyZSBub3QgZmF0YWwuIEhvd2V2ZXIsIHRvIGF2b2lkXG5cdCAgICAgICAgICAgIC8vIHNsb3dpbmcgZG93biB0aGUgcXVldWUgb2YgcGVuZGluZyB0YXNrcywgd2UgcmV0aHJvdyB0aGUgZXJyb3IgaW4gYVxuXHQgICAgICAgICAgICAvLyBsb3dlciBwcmlvcml0eSB0dXJuLlxuXHQgICAgICAgICAgICBwZW5kaW5nRXJyb3JzLnB1c2goZXJyb3IpO1xuXHQgICAgICAgICAgICByZXF1ZXN0RXJyb3JUaHJvdygpO1xuXHQgICAgICAgIH1cblx0ICAgIH0gZmluYWxseSB7XG5cdCAgICAgICAgdGhpcy50YXNrID0gbnVsbDtcblx0ICAgICAgICBmcmVlVGFza3NbZnJlZVRhc2tzLmxlbmd0aF0gPSB0aGlzO1xuXHQgICAgfVxuXHR9O1xuXG5cbi8qKiovIH0pLFxuLyogNSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihnbG9iYWwpIHtcInVzZSBzdHJpY3RcIjtcblxuXHQvLyBVc2UgdGhlIGZhc3Rlc3QgbWVhbnMgcG9zc2libGUgdG8gZXhlY3V0ZSBhIHRhc2sgaW4gaXRzIG93biB0dXJuLCB3aXRoXG5cdC8vIHByaW9yaXR5IG92ZXIgb3RoZXIgZXZlbnRzIGluY2x1ZGluZyBJTywgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZWRyYXdcblx0Ly8gZXZlbnRzIGluIGJyb3dzZXJzLlxuXHQvL1xuXHQvLyBBbiBleGNlcHRpb24gdGhyb3duIGJ5IGEgdGFzayB3aWxsIHBlcm1hbmVudGx5IGludGVycnVwdCB0aGUgcHJvY2Vzc2luZyBvZlxuXHQvLyBzdWJzZXF1ZW50IHRhc2tzLiBUaGUgaGlnaGVyIGxldmVsIGBhc2FwYCBmdW5jdGlvbiBlbnN1cmVzIHRoYXQgaWYgYW5cblx0Ly8gZXhjZXB0aW9uIGlzIHRocm93biBieSBhIHRhc2ssIHRoYXQgdGhlIHRhc2sgcXVldWUgd2lsbCBjb250aW51ZSBmbHVzaGluZyBhc1xuXHQvLyBzb29uIGFzIHBvc3NpYmxlLCBidXQgaWYgeW91IHVzZSBgcmF3QXNhcGAgZGlyZWN0bHksIHlvdSBhcmUgcmVzcG9uc2libGUgdG9cblx0Ly8gZWl0aGVyIGVuc3VyZSB0aGF0IG5vIGV4Y2VwdGlvbnMgYXJlIHRocm93biBmcm9tIHlvdXIgdGFzaywgb3IgdG8gbWFudWFsbHlcblx0Ly8gY2FsbCBgcmF3QXNhcC5yZXF1ZXN0Rmx1c2hgIGlmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG5cdG1vZHVsZS5leHBvcnRzID0gcmF3QXNhcDtcblx0ZnVuY3Rpb24gcmF3QXNhcCh0YXNrKSB7XG5cdCAgICBpZiAoIXF1ZXVlLmxlbmd0aCkge1xuXHQgICAgICAgIHJlcXVlc3RGbHVzaCgpO1xuXHQgICAgICAgIGZsdXNoaW5nID0gdHJ1ZTtcblx0ICAgIH1cblx0ICAgIC8vIEVxdWl2YWxlbnQgdG8gcHVzaCwgYnV0IGF2b2lkcyBhIGZ1bmN0aW9uIGNhbGwuXG5cdCAgICBxdWV1ZVtxdWV1ZS5sZW5ndGhdID0gdGFzaztcblx0fVxuXG5cdHZhciBxdWV1ZSA9IFtdO1xuXHQvLyBPbmNlIGEgZmx1c2ggaGFzIGJlZW4gcmVxdWVzdGVkLCBubyBmdXJ0aGVyIGNhbGxzIHRvIGByZXF1ZXN0Rmx1c2hgIGFyZVxuXHQvLyBuZWNlc3NhcnkgdW50aWwgdGhlIG5leHQgYGZsdXNoYCBjb21wbGV0ZXMuXG5cdHZhciBmbHVzaGluZyA9IGZhbHNlO1xuXHQvLyBgcmVxdWVzdEZsdXNoYCBpcyBhbiBpbXBsZW1lbnRhdGlvbi1zcGVjaWZpYyBtZXRob2QgdGhhdCBhdHRlbXB0cyB0byBraWNrXG5cdC8vIG9mZiBhIGBmbHVzaGAgZXZlbnQgYXMgcXVpY2tseSBhcyBwb3NzaWJsZS4gYGZsdXNoYCB3aWxsIGF0dGVtcHQgdG8gZXhoYXVzdFxuXHQvLyB0aGUgZXZlbnQgcXVldWUgYmVmb3JlIHlpZWxkaW5nIHRvIHRoZSBicm93c2VyJ3Mgb3duIGV2ZW50IGxvb3AuXG5cdHZhciByZXF1ZXN0Rmx1c2g7XG5cdC8vIFRoZSBwb3NpdGlvbiBvZiB0aGUgbmV4dCB0YXNrIHRvIGV4ZWN1dGUgaW4gdGhlIHRhc2sgcXVldWUuIFRoaXMgaXNcblx0Ly8gcHJlc2VydmVkIGJldHdlZW4gY2FsbHMgdG8gYGZsdXNoYCBzbyB0aGF0IGl0IGNhbiBiZSByZXN1bWVkIGlmXG5cdC8vIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuXHR2YXIgaW5kZXggPSAwO1xuXHQvLyBJZiBhIHRhc2sgc2NoZWR1bGVzIGFkZGl0aW9uYWwgdGFza3MgcmVjdXJzaXZlbHksIHRoZSB0YXNrIHF1ZXVlIGNhbiBncm93XG5cdC8vIHVuYm91bmRlZC4gVG8gcHJldmVudCBtZW1vcnkgZXhoYXVzdGlvbiwgdGhlIHRhc2sgcXVldWUgd2lsbCBwZXJpb2RpY2FsbHlcblx0Ly8gdHJ1bmNhdGUgYWxyZWFkeS1jb21wbGV0ZWQgdGFza3MuXG5cdHZhciBjYXBhY2l0eSA9IDEwMjQ7XG5cblx0Ly8gVGhlIGZsdXNoIGZ1bmN0aW9uIHByb2Nlc3NlcyBhbGwgdGFza3MgdGhhdCBoYXZlIGJlZW4gc2NoZWR1bGVkIHdpdGhcblx0Ly8gYHJhd0FzYXBgIHVubGVzcyBhbmQgdW50aWwgb25lIG9mIHRob3NlIHRhc2tzIHRocm93cyBhbiBleGNlcHRpb24uXG5cdC8vIElmIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLCBgZmx1c2hgIGVuc3VyZXMgdGhhdCBpdHMgc3RhdGUgd2lsbCByZW1haW5cblx0Ly8gY29uc2lzdGVudCBhbmQgd2lsbCByZXN1bWUgd2hlcmUgaXQgbGVmdCBvZmYgd2hlbiBjYWxsZWQgYWdhaW4uXG5cdC8vIEhvd2V2ZXIsIGBmbHVzaGAgZG9lcyBub3QgbWFrZSBhbnkgYXJyYW5nZW1lbnRzIHRvIGJlIGNhbGxlZCBhZ2FpbiBpZiBhblxuXHQvLyBleGNlcHRpb24gaXMgdGhyb3duLlxuXHRmdW5jdGlvbiBmbHVzaCgpIHtcblx0ICAgIHdoaWxlIChpbmRleCA8IHF1ZXVlLmxlbmd0aCkge1xuXHQgICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBpbmRleDtcblx0ICAgICAgICAvLyBBZHZhbmNlIHRoZSBpbmRleCBiZWZvcmUgY2FsbGluZyB0aGUgdGFzay4gVGhpcyBlbnN1cmVzIHRoYXQgd2Ugd2lsbFxuXHQgICAgICAgIC8vIGJlZ2luIGZsdXNoaW5nIG9uIHRoZSBuZXh0IHRhc2sgdGhlIHRhc2sgdGhyb3dzIGFuIGVycm9yLlxuXHQgICAgICAgIGluZGV4ID0gaW5kZXggKyAxO1xuXHQgICAgICAgIHF1ZXVlW2N1cnJlbnRJbmRleF0uY2FsbCgpO1xuXHQgICAgICAgIC8vIFByZXZlbnQgbGVha2luZyBtZW1vcnkgZm9yIGxvbmcgY2hhaW5zIG9mIHJlY3Vyc2l2ZSBjYWxscyB0byBgYXNhcGAuXG5cdCAgICAgICAgLy8gSWYgd2UgY2FsbCBgYXNhcGAgd2l0aGluIHRhc2tzIHNjaGVkdWxlZCBieSBgYXNhcGAsIHRoZSBxdWV1ZSB3aWxsXG5cdCAgICAgICAgLy8gZ3JvdywgYnV0IHRvIGF2b2lkIGFuIE8obikgd2FsayBmb3IgZXZlcnkgdGFzayB3ZSBleGVjdXRlLCB3ZSBkb24ndFxuXHQgICAgICAgIC8vIHNoaWZ0IHRhc2tzIG9mZiB0aGUgcXVldWUgYWZ0ZXIgdGhleSBoYXZlIGJlZW4gZXhlY3V0ZWQuXG5cdCAgICAgICAgLy8gSW5zdGVhZCwgd2UgcGVyaW9kaWNhbGx5IHNoaWZ0IDEwMjQgdGFza3Mgb2ZmIHRoZSBxdWV1ZS5cblx0ICAgICAgICBpZiAoaW5kZXggPiBjYXBhY2l0eSkge1xuXHQgICAgICAgICAgICAvLyBNYW51YWxseSBzaGlmdCBhbGwgdmFsdWVzIHN0YXJ0aW5nIGF0IHRoZSBpbmRleCBiYWNrIHRvIHRoZVxuXHQgICAgICAgICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIHF1ZXVlLlxuXHQgICAgICAgICAgICBmb3IgKHZhciBzY2FuID0gMCwgbmV3TGVuZ3RoID0gcXVldWUubGVuZ3RoIC0gaW5kZXg7IHNjYW4gPCBuZXdMZW5ndGg7IHNjYW4rKykge1xuXHQgICAgICAgICAgICAgICAgcXVldWVbc2Nhbl0gPSBxdWV1ZVtzY2FuICsgaW5kZXhdO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHF1ZXVlLmxlbmd0aCAtPSBpbmRleDtcblx0ICAgICAgICAgICAgaW5kZXggPSAwO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIHF1ZXVlLmxlbmd0aCA9IDA7XG5cdCAgICBpbmRleCA9IDA7XG5cdCAgICBmbHVzaGluZyA9IGZhbHNlO1xuXHR9XG5cblx0Ly8gYHJlcXVlc3RGbHVzaGAgaXMgaW1wbGVtZW50ZWQgdXNpbmcgYSBzdHJhdGVneSBiYXNlZCBvbiBkYXRhIGNvbGxlY3RlZCBmcm9tXG5cdC8vIGV2ZXJ5IGF2YWlsYWJsZSBTYXVjZUxhYnMgU2VsZW5pdW0gd2ViIGRyaXZlciB3b3JrZXIgYXQgdGltZSBvZiB3cml0aW5nLlxuXHQvLyBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xbUctNVVZR3VwNXF4R2RFTVdraFA2QldDejA1M05VYjJFMVFvVVRVMTZ1QS9lZGl0I2dpZD03ODM3MjQ1OTNcblxuXHQvLyBTYWZhcmkgNiBhbmQgNi4xIGZvciBkZXNrdG9wLCBpUGFkLCBhbmQgaVBob25lIGFyZSB0aGUgb25seSBicm93c2VycyB0aGF0XG5cdC8vIGhhdmUgV2ViS2l0TXV0YXRpb25PYnNlcnZlciBidXQgbm90IHVuLXByZWZpeGVkIE11dGF0aW9uT2JzZXJ2ZXIuXG5cdC8vIE11c3QgdXNlIGBnbG9iYWxgIG9yIGBzZWxmYCBpbnN0ZWFkIG9mIGB3aW5kb3dgIHRvIHdvcmsgaW4gYm90aCBmcmFtZXMgYW5kIHdlYlxuXHQvLyB3b3JrZXJzLiBgZ2xvYmFsYCBpcyBhIHByb3Zpc2lvbiBvZiBCcm93c2VyaWZ5LCBNciwgTXJzLCBvciBNb3AuXG5cblx0LyogZ2xvYmFscyBzZWxmICovXG5cdHZhciBzY29wZSA9IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiBzZWxmO1xuXHR2YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBzY29wZS5NdXRhdGlvbk9ic2VydmVyIHx8IHNjb3BlLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cblx0Ly8gTXV0YXRpb25PYnNlcnZlcnMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgaGF2ZSBoaWdoIHByaW9yaXR5IGFuZCB3b3JrXG5cdC8vIHJlbGlhYmx5IGV2ZXJ5d2hlcmUgdGhleSBhcmUgaW1wbGVtZW50ZWQuXG5cdC8vIFRoZXkgYXJlIGltcGxlbWVudGVkIGluIGFsbCBtb2Rlcm4gYnJvd3NlcnMuXG5cdC8vXG5cdC8vIC0gQW5kcm9pZCA0LTQuM1xuXHQvLyAtIENocm9tZSAyNi0zNFxuXHQvLyAtIEZpcmVmb3ggMTQtMjlcblx0Ly8gLSBJbnRlcm5ldCBFeHBsb3JlciAxMVxuXHQvLyAtIGlQYWQgU2FmYXJpIDYtNy4xXG5cdC8vIC0gaVBob25lIFNhZmFyaSA3LTcuMVxuXHQvLyAtIFNhZmFyaSA2LTdcblx0aWYgKHR5cGVvZiBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdCAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG5cblx0Ly8gTWVzc2FnZUNoYW5uZWxzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGdpdmUgZGlyZWN0IGFjY2VzcyB0byB0aGUgSFRNTFxuXHQvLyB0YXNrIHF1ZXVlLCBhcmUgaW1wbGVtZW50ZWQgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAsIFNhZmFyaSA1LjAtMSwgYW5kIE9wZXJhXG5cdC8vIDExLTEyLCBhbmQgaW4gd2ViIHdvcmtlcnMgaW4gbWFueSBlbmdpbmVzLlxuXHQvLyBBbHRob3VnaCBtZXNzYWdlIGNoYW5uZWxzIHlpZWxkIHRvIGFueSBxdWV1ZWQgcmVuZGVyaW5nIGFuZCBJTyB0YXNrcywgdGhleVxuXHQvLyB3b3VsZCBiZSBiZXR0ZXIgdGhhbiBpbXBvc2luZyB0aGUgNG1zIGRlbGF5IG9mIHRpbWVycy5cblx0Ly8gSG93ZXZlciwgdGhleSBkbyBub3Qgd29yayByZWxpYWJseSBpbiBJbnRlcm5ldCBFeHBsb3JlciBvciBTYWZhcmkuXG5cblx0Ly8gSW50ZXJuZXQgRXhwbG9yZXIgMTAgaXMgdGhlIG9ubHkgYnJvd3NlciB0aGF0IGhhcyBzZXRJbW1lZGlhdGUgYnV0IGRvZXNcblx0Ly8gbm90IGhhdmUgTXV0YXRpb25PYnNlcnZlcnMuXG5cdC8vIEFsdGhvdWdoIHNldEltbWVkaWF0ZSB5aWVsZHMgdG8gdGhlIGJyb3dzZXIncyByZW5kZXJlciwgaXQgd291bGQgYmVcblx0Ly8gcHJlZmVycmFibGUgdG8gZmFsbGluZyBiYWNrIHRvIHNldFRpbWVvdXQgc2luY2UgaXQgZG9lcyBub3QgaGF2ZVxuXHQvLyB0aGUgbWluaW11bSA0bXMgcGVuYWx0eS5cblx0Ly8gVW5mb3J0dW5hdGVseSB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwIE1vYmlsZSAoYW5kXG5cdC8vIERlc2t0b3AgdG8gYSBsZXNzZXIgZXh0ZW50KSB0aGF0IHJlbmRlcnMgYm90aCBzZXRJbW1lZGlhdGUgYW5kXG5cdC8vIE1lc3NhZ2VDaGFubmVsIHVzZWxlc3MgZm9yIHRoZSBwdXJwb3NlcyBvZiBBU0FQLlxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL3EvaXNzdWVzLzM5NlxuXG5cdC8vIFRpbWVycyBhcmUgaW1wbGVtZW50ZWQgdW5pdmVyc2FsbHkuXG5cdC8vIFdlIGZhbGwgYmFjayB0byB0aW1lcnMgaW4gd29ya2VycyBpbiBtb3N0IGVuZ2luZXMsIGFuZCBpbiBmb3JlZ3JvdW5kXG5cdC8vIGNvbnRleHRzIGluIHRoZSBmb2xsb3dpbmcgYnJvd3NlcnMuXG5cdC8vIEhvd2V2ZXIsIG5vdGUgdGhhdCBldmVuIHRoaXMgc2ltcGxlIGNhc2UgcmVxdWlyZXMgbnVhbmNlcyB0byBvcGVyYXRlIGluIGFcblx0Ly8gYnJvYWQgc3BlY3RydW0gb2YgYnJvd3NlcnMuXG5cdC8vXG5cdC8vIC0gRmlyZWZveCAzLTEzXG5cdC8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgNi05XG5cdC8vIC0gaVBhZCBTYWZhcmkgNC4zXG5cdC8vIC0gTHlueCAyLjguN1xuXHR9IGVsc2Uge1xuXHQgICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGZsdXNoKTtcblx0fVxuXG5cdC8vIGByZXF1ZXN0Rmx1c2hgIHJlcXVlc3RzIHRoYXQgdGhlIGhpZ2ggcHJpb3JpdHkgZXZlbnQgcXVldWUgYmUgZmx1c2hlZCBhc1xuXHQvLyBzb29uIGFzIHBvc3NpYmxlLlxuXHQvLyBUaGlzIGlzIHVzZWZ1bCB0byBwcmV2ZW50IGFuIGVycm9yIHRocm93biBpbiBhIHRhc2sgZnJvbSBzdGFsbGluZyB0aGUgZXZlbnRcblx0Ly8gcXVldWUgaWYgdGhlIGV4Y2VwdGlvbiBoYW5kbGVkIGJ5IE5vZGUuanPigJlzXG5cdC8vIGBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIilgIG9yIGJ5IGEgZG9tYWluLlxuXHRyYXdBc2FwLnJlcXVlc3RGbHVzaCA9IHJlcXVlc3RGbHVzaDtcblxuXHQvLyBUbyByZXF1ZXN0IGEgaGlnaCBwcmlvcml0eSBldmVudCwgd2UgaW5kdWNlIGEgbXV0YXRpb24gb2JzZXJ2ZXIgYnkgdG9nZ2xpbmdcblx0Ly8gdGhlIHRleHQgb2YgYSB0ZXh0IG5vZGUgYmV0d2VlbiBcIjFcIiBhbmQgXCItMVwiLlxuXHRmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjaykge1xuXHQgICAgdmFyIHRvZ2dsZSA9IDE7XG5cdCAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuXHQgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcblx0ICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTtcblx0ICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcblx0ICAgICAgICB0b2dnbGUgPSAtdG9nZ2xlO1xuXHQgICAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZTtcblx0ICAgIH07XG5cdH1cblxuXHQvLyBUaGUgbWVzc2FnZSBjaGFubmVsIHRlY2huaXF1ZSB3YXMgZGlzY292ZXJlZCBieSBNYWx0ZSBVYmwgYW5kIHdhcyB0aGVcblx0Ly8gb3JpZ2luYWwgZm91bmRhdGlvbiBmb3IgdGhpcyBsaWJyYXJ5LlxuXHQvLyBodHRwOi8vd3d3Lm5vbmJsb2NraW5nLmlvLzIwMTEvMDYvd2luZG93bmV4dHRpY2suaHRtbFxuXG5cdC8vIFNhZmFyaSA2LjAuNSAoYXQgbGVhc3QpIGludGVybWl0dGVudGx5IGZhaWxzIHRvIGNyZWF0ZSBtZXNzYWdlIHBvcnRzIG9uIGFcblx0Ly8gcGFnZSdzIGZpcnN0IGxvYWQuIFRoYW5rZnVsbHksIHRoaXMgdmVyc2lvbiBvZiBTYWZhcmkgc3VwcG9ydHNcblx0Ly8gTXV0YXRpb25PYnNlcnZlcnMsIHNvIHdlIGRvbid0IG5lZWQgdG8gZmFsbCBiYWNrIGluIHRoYXQgY2FzZS5cblxuXHQvLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTWVzc2FnZUNoYW5uZWwoY2FsbGJhY2spIHtcblx0Ly8gICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG5cdC8vICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGNhbGxiYWNrO1xuXHQvLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuXHQvLyAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG5cdC8vICAgICB9O1xuXHQvLyB9XG5cblx0Ly8gRm9yIHJlYXNvbnMgZXhwbGFpbmVkIGFib3ZlLCB3ZSBhcmUgYWxzbyB1bmFibGUgdG8gdXNlIGBzZXRJbW1lZGlhdGVgXG5cdC8vIHVuZGVyIGFueSBjaXJjdW1zdGFuY2VzLlxuXHQvLyBFdmVuIGlmIHdlIHdlcmUsIHRoZXJlIGlzIGFub3RoZXIgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwLlxuXHQvLyBJdCBpcyBub3Qgc3VmZmljaWVudCB0byBhc3NpZ24gYHNldEltbWVkaWF0ZWAgdG8gYHJlcXVlc3RGbHVzaGAgYmVjYXVzZVxuXHQvLyBgc2V0SW1tZWRpYXRlYCBtdXN0IGJlIGNhbGxlZCAqYnkgbmFtZSogYW5kIHRoZXJlZm9yZSBtdXN0IGJlIHdyYXBwZWQgaW4gYVxuXHQvLyBjbG9zdXJlLlxuXHQvLyBOZXZlciBmb3JnZXQuXG5cblx0Ly8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuXHQvLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuXHQvLyAgICAgICAgIHNldEltbWVkaWF0ZShjYWxsYmFjayk7XG5cdC8vICAgICB9O1xuXHQvLyB9XG5cblx0Ly8gU2FmYXJpIDYuMCBoYXMgYSBwcm9ibGVtIHdoZXJlIHRpbWVycyB3aWxsIGdldCBsb3N0IHdoaWxlIHRoZSB1c2VyIGlzXG5cdC8vIHNjcm9sbGluZy4gVGhpcyBwcm9ibGVtIGRvZXMgbm90IGltcGFjdCBBU0FQIGJlY2F1c2UgU2FmYXJpIDYuMCBzdXBwb3J0c1xuXHQvLyBtdXRhdGlvbiBvYnNlcnZlcnMsIHNvIHRoYXQgaW1wbGVtZW50YXRpb24gaXMgdXNlZCBpbnN0ZWFkLlxuXHQvLyBIb3dldmVyLCBpZiB3ZSBldmVyIGVsZWN0IHRvIHVzZSB0aW1lcnMgaW4gU2FmYXJpLCB0aGUgcHJldmFsZW50IHdvcmstYXJvdW5kXG5cdC8vIGlzIHRvIGFkZCBhIHNjcm9sbCBldmVudCBsaXN0ZW5lciB0aGF0IGNhbGxzIGZvciBhIGZsdXNoLlxuXG5cdC8vIGBzZXRUaW1lb3V0YCBkb2VzIG5vdCBjYWxsIHRoZSBwYXNzZWQgY2FsbGJhY2sgaWYgdGhlIGRlbGF5IGlzIGxlc3MgdGhhblxuXHQvLyBhcHByb3hpbWF0ZWx5IDcgaW4gd2ViIHdvcmtlcnMgaW4gRmlyZWZveCA4IHRocm91Z2ggMTgsIGFuZCBzb21ldGltZXMgbm90XG5cdC8vIGV2ZW4gdGhlbi5cblxuXHRmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoY2FsbGJhY2spIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcblx0ICAgICAgICAvLyBXZSBkaXNwYXRjaCBhIHRpbWVvdXQgd2l0aCBhIHNwZWNpZmllZCBkZWxheSBvZiAwIGZvciBlbmdpbmVzIHRoYXRcblx0ICAgICAgICAvLyBjYW4gcmVsaWFibHkgYWNjb21tb2RhdGUgdGhhdCByZXF1ZXN0LiBUaGlzIHdpbGwgdXN1YWxseSBiZSBzbmFwcGVkXG5cdCAgICAgICAgLy8gdG8gYSA0IG1pbGlzZWNvbmQgZGVsYXksIGJ1dCBvbmNlIHdlJ3JlIGZsdXNoaW5nLCB0aGVyZSdzIG5vIGRlbGF5XG5cdCAgICAgICAgLy8gYmV0d2VlbiBldmVudHMuXG5cdCAgICAgICAgdmFyIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGhhbmRsZVRpbWVyLCAwKTtcblx0ICAgICAgICAvLyBIb3dldmVyLCBzaW5jZSB0aGlzIHRpbWVyIGdldHMgZnJlcXVlbnRseSBkcm9wcGVkIGluIEZpcmVmb3hcblx0ICAgICAgICAvLyB3b3JrZXJzLCB3ZSBlbmxpc3QgYW4gaW50ZXJ2YWwgaGFuZGxlIHRoYXQgd2lsbCB0cnkgdG8gZmlyZVxuXHQgICAgICAgIC8vIGFuIGV2ZW50IDIwIHRpbWVzIHBlciBzZWNvbmQgdW50aWwgaXQgc3VjY2VlZHMuXG5cdCAgICAgICAgdmFyIGludGVydmFsSGFuZGxlID0gc2V0SW50ZXJ2YWwoaGFuZGxlVGltZXIsIDUwKTtcblxuXHQgICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRpbWVyKCkge1xuXHQgICAgICAgICAgICAvLyBXaGljaGV2ZXIgdGltZXIgc3VjY2VlZHMgd2lsbCBjYW5jZWwgYm90aCB0aW1lcnMgYW5kXG5cdCAgICAgICAgICAgIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrLlxuXHQgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEhhbmRsZSk7XG5cdCAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxIYW5kbGUpO1xuXHQgICAgICAgICAgICBjYWxsYmFjaygpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdH1cblxuXHQvLyBUaGlzIGlzIGZvciBgYXNhcC5qc2Agb25seS5cblx0Ly8gSXRzIG5hbWUgd2lsbCBiZSBwZXJpb2RpY2FsbHkgcmFuZG9taXplZCB0byBicmVhayBhbnkgY29kZSB0aGF0IGRlcGVuZHMgb25cblx0Ly8gaXRzIGV4aXN0ZW5jZS5cblx0cmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIgPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXI7XG5cblx0Ly8gQVNBUCB3YXMgb3JpZ2luYWxseSBhIG5leHRUaWNrIHNoaW0gaW5jbHVkZWQgaW4gUS4gVGhpcyB3YXMgZmFjdG9yZWQgb3V0XG5cdC8vIGludG8gdGhpcyBBU0FQIHBhY2thZ2UuIEl0IHdhcyBsYXRlciBhZGFwdGVkIHRvIFJTVlAgd2hpY2ggbWFkZSBmdXJ0aGVyXG5cdC8vIGFtZW5kbWVudHMuIFRoZXNlIGRlY2lzaW9ucywgcGFydGljdWxhcmx5IHRvIG1hcmdpbmFsaXplIE1lc3NhZ2VDaGFubmVsIGFuZFxuXHQvLyB0byBjYXB0dXJlIHRoZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIGluIGEgY2xvc3VyZSwgd2VyZSBpbnRlZ3JhdGVkXG5cdC8vIGJhY2sgaW50byBBU0FQIHByb3Blci5cblx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL3RpbGRlaW8vcnN2cC5qcy9ibG9iL2NkZGY3MjMyNTQ2YTljZjg1ODUyNGI3NWNkZTZmOWVkZjcyNjIwYTcvbGliL3JzdnAvYXNhcC5qc1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqL30uY2FsbChleHBvcnRzLCAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KCkpKSlcblxuLyoqKi8gfSksXG4vKiA2ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIEEgc2ltcGxlIGNsYXNzIHN5c3RlbSwgbW9yZSBkb2N1bWVudGF0aW9uIHRvIGNvbWVcblxuXHRmdW5jdGlvbiBleHRlbmQoY2xzLCBuYW1lLCBwcm9wcykge1xuXHQgICAgLy8gVGhpcyBkb2VzIHRoYXQgc2FtZSB0aGluZyBhcyBPYmplY3QuY3JlYXRlLCBidXQgd2l0aCBzdXBwb3J0IGZvciBJRThcblx0ICAgIHZhciBGID0gZnVuY3Rpb24oKSB7fTtcblx0ICAgIEYucHJvdG90eXBlID0gY2xzLnByb3RvdHlwZTtcblx0ICAgIHZhciBwcm90b3R5cGUgPSBuZXcgRigpO1xuXG5cdCAgICAvLyBqc2hpbnQgdW5kZWY6IGZhbHNlXG5cdCAgICB2YXIgZm5UZXN0ID0gL3h5ei8udGVzdChmdW5jdGlvbigpeyB4eXo7IH0pID8gL1xcYnBhcmVudFxcYi8gOiAvLiovO1xuXHQgICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcblxuXHQgICAgZm9yKHZhciBrIGluIHByb3BzKSB7XG5cdCAgICAgICAgdmFyIHNyYyA9IHByb3BzW2tdO1xuXHQgICAgICAgIHZhciBwYXJlbnQgPSBwcm90b3R5cGVba107XG5cblx0ICAgICAgICBpZih0eXBlb2YgcGFyZW50ID09PSAnZnVuY3Rpb24nICYmXG5cdCAgICAgICAgICAgdHlwZW9mIHNyYyA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHQgICAgICAgICAgIGZuVGVzdC50ZXN0KHNyYykpIHtcblx0ICAgICAgICAgICAgLypqc2hpbnQgLVcwODMgKi9cblx0ICAgICAgICAgICAgcHJvdG90eXBlW2tdID0gKGZ1bmN0aW9uIChzcmMsIHBhcmVudCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIFNhdmUgdGhlIGN1cnJlbnQgcGFyZW50IG1ldGhvZFxuXHQgICAgICAgICAgICAgICAgICAgIHZhciB0bXAgPSB0aGlzLnBhcmVudDtcblxuXHQgICAgICAgICAgICAgICAgICAgIC8vIFNldCBwYXJlbnQgdG8gdGhlIHByZXZpb3VzIG1ldGhvZCwgY2FsbCwgYW5kIHJlc3RvcmVcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgcmVzID0gc3JjLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQgPSB0bXA7XG5cblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuXHQgICAgICAgICAgICAgICAgfTtcblx0ICAgICAgICAgICAgfSkoc3JjLCBwYXJlbnQpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgcHJvdG90eXBlW2tdID0gc3JjO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcHJvdG90eXBlLnR5cGVuYW1lID0gbmFtZTtcblxuXHQgICAgdmFyIG5ld19jbHMgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgICBpZihwcm90b3R5cGUuaW5pdCkge1xuXHQgICAgICAgICAgICBwcm90b3R5cGUuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIG5ld19jbHMucHJvdG90eXBlID0gcHJvdG90eXBlO1xuXHQgICAgbmV3X2Nscy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBuZXdfY2xzO1xuXG5cdCAgICBuZXdfY2xzLmV4dGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHByb3BzKSB7XG5cdCAgICAgICAgaWYodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgICAgICAgIHByb3BzID0gbmFtZTtcblx0ICAgICAgICAgICAgbmFtZSA9ICdhbm9ueW1vdXMnO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gZXh0ZW5kKG5ld19jbHMsIG5hbWUsIHByb3BzKTtcblx0ICAgIH07XG5cblx0ICAgIHJldHVybiBuZXdfY2xzO1xuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBleHRlbmQoT2JqZWN0LCAnT2JqZWN0Jywge30pO1xuXG5cbi8qKiovIH0pLFxuLyogNyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgbGliID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblx0dmFyIHBhcnNlciA9IF9fd2VicGFja19yZXF1aXJlX18oOCk7XG5cdHZhciB0cmFuc2Zvcm1lciA9IF9fd2VicGFja19yZXF1aXJlX18oMTIpO1xuXHR2YXIgbm9kZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEwKTtcblx0Ly8ganNoaW50IC1XMDc5XG5cdHZhciBPYmplY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXHR2YXIgRnJhbWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEzKS5GcmFtZTtcblxuXHQvLyBUaGVzZSBhcmUgYWxsIHRoZSBzYW1lIGZvciBub3csIGJ1dCBzaG91bGRuJ3QgYmUgcGFzc2VkIHN0cmFpZ2h0XG5cdC8vIHRocm91Z2hcblx0dmFyIGNvbXBhcmVPcHMgPSB7XG5cdCAgICAnPT0nOiAnPT0nLFxuXHQgICAgJz09PSc6ICc9PT0nLFxuXHQgICAgJyE9JzogJyE9Jyxcblx0ICAgICchPT0nOiAnIT09Jyxcblx0ICAgICc8JzogJzwnLFxuXHQgICAgJz4nOiAnPicsXG5cdCAgICAnPD0nOiAnPD0nLFxuXHQgICAgJz49JzogJz49J1xuXHR9O1xuXG5cdC8vIEEgY29tbW9uIHBhdHRlcm4gaXMgdG8gZW1pdCBiaW5hcnkgb3BlcmF0b3JzXG5cdGZ1bmN0aW9uIGJpbk9wRW1pdHRlcihzdHIpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmxlZnQsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoc3RyKTtcblx0ICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5yaWdodCwgZnJhbWUpO1xuXHQgICAgfTtcblx0fVxuXG5cdHZhciBDb21waWxlciA9IE9iamVjdC5leHRlbmQoe1xuXHQgICAgaW5pdDogZnVuY3Rpb24odGVtcGxhdGVOYW1lLCB0aHJvd09uVW5kZWZpbmVkKSB7XG5cdCAgICAgICAgdGhpcy50ZW1wbGF0ZU5hbWUgPSB0ZW1wbGF0ZU5hbWU7XG5cdCAgICAgICAgdGhpcy5jb2RlYnVmID0gW107XG5cdCAgICAgICAgdGhpcy5sYXN0SWQgPSAwO1xuXHQgICAgICAgIHRoaXMuYnVmZmVyID0gbnVsbDtcblx0ICAgICAgICB0aGlzLmJ1ZmZlclN0YWNrID0gW107XG5cdCAgICAgICAgdGhpcy5zY29wZUNsb3NlcnMgPSAnJztcblx0ICAgICAgICB0aGlzLmluQmxvY2sgPSBmYWxzZTtcblx0ICAgICAgICB0aGlzLnRocm93T25VbmRlZmluZWQgPSB0aHJvd09uVW5kZWZpbmVkO1xuXHQgICAgfSxcblxuXHQgICAgZmFpbDogZnVuY3Rpb24gKG1zZywgbGluZW5vLCBjb2xubykge1xuXHQgICAgICAgIGlmIChsaW5lbm8gIT09IHVuZGVmaW5lZCkgbGluZW5vICs9IDE7XG5cdCAgICAgICAgaWYgKGNvbG5vICE9PSB1bmRlZmluZWQpIGNvbG5vICs9IDE7XG5cblx0ICAgICAgICB0aHJvdyBuZXcgbGliLlRlbXBsYXRlRXJyb3IobXNnLCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgIH0sXG5cblx0ICAgIHB1c2hCdWZmZXJJZDogZnVuY3Rpb24oaWQpIHtcblx0ICAgICAgICB0aGlzLmJ1ZmZlclN0YWNrLnB1c2godGhpcy5idWZmZXIpO1xuXHQgICAgICAgIHRoaXMuYnVmZmVyID0gaWQ7XG5cdCAgICAgICAgdGhpcy5lbWl0KCd2YXIgJyArIHRoaXMuYnVmZmVyICsgJyA9IFwiXCI7Jyk7XG5cdCAgICB9LFxuXG5cdCAgICBwb3BCdWZmZXJJZDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdGhpcy5idWZmZXIgPSB0aGlzLmJ1ZmZlclN0YWNrLnBvcCgpO1xuXHQgICAgfSxcblxuXHQgICAgZW1pdDogZnVuY3Rpb24oY29kZSkge1xuXHQgICAgICAgIHRoaXMuY29kZWJ1Zi5wdXNoKGNvZGUpO1xuXHQgICAgfSxcblxuXHQgICAgZW1pdExpbmU6IGZ1bmN0aW9uKGNvZGUpIHtcblx0ICAgICAgICB0aGlzLmVtaXQoY29kZSArICdcXG4nKTtcblx0ICAgIH0sXG5cblx0ICAgIGVtaXRMaW5lczogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgbGliLmVhY2gobGliLnRvQXJyYXkoYXJndW1lbnRzKSwgZnVuY3Rpb24obGluZSkge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKGxpbmUpO1xuXHQgICAgICAgIH0sIHRoaXMpO1xuXHQgICAgfSxcblxuXHQgICAgZW1pdEZ1bmNCZWdpbjogZnVuY3Rpb24obmFtZSkge1xuXHQgICAgICAgIHRoaXMuYnVmZmVyID0gJ291dHB1dCc7XG5cdCAgICAgICAgdGhpcy5zY29wZUNsb3NlcnMgPSAnJztcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdmdW5jdGlvbiAnICsgbmFtZSArICcoZW52LCBjb250ZXh0LCBmcmFtZSwgcnVudGltZSwgY2IpIHsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgbGluZW5vID0gbnVsbDsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgY29sbm8gPSBudWxsOycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3ZhciAnICsgdGhpcy5idWZmZXIgKyAnID0gXCJcIjsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd0cnkgeycpO1xuXHQgICAgfSxcblxuXHQgICAgZW1pdEZ1bmNFbmQ6IGZ1bmN0aW9uKG5vUmV0dXJuKSB7XG5cdCAgICAgICAgaWYoIW5vUmV0dXJuKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2NiKG51bGwsICcgKyB0aGlzLmJ1ZmZlciArJyk7Jyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdGhpcy5jbG9zZVNjb3BlTGV2ZWxzKCk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfSBjYXRjaCAoZSkgeycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJyAgY2IocnVudGltZS5oYW5kbGVFcnJvcihlLCBsaW5lbm8sIGNvbG5vKSk7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ30nKTtcblx0ICAgICAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG5cdCAgICB9LFxuXG5cdCAgICBhZGRTY29wZUxldmVsOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB0aGlzLnNjb3BlQ2xvc2VycyArPSAnfSknO1xuXHQgICAgfSxcblxuXHQgICAgY2xvc2VTY29wZUxldmVsczogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSh0aGlzLnNjb3BlQ2xvc2VycyArICc7Jyk7XG5cdCAgICAgICAgdGhpcy5zY29wZUNsb3NlcnMgPSAnJztcblx0ICAgIH0sXG5cblx0ICAgIHdpdGhTY29wZWRTeW50YXg6IGZ1bmN0aW9uKGZ1bmMpIHtcblx0ICAgICAgICB2YXIgc2NvcGVDbG9zZXJzID0gdGhpcy5zY29wZUNsb3NlcnM7XG5cdCAgICAgICAgdGhpcy5zY29wZUNsb3NlcnMgPSAnJztcblxuXHQgICAgICAgIGZ1bmMuY2FsbCh0aGlzKTtcblxuXHQgICAgICAgIHRoaXMuY2xvc2VTY29wZUxldmVscygpO1xuXHQgICAgICAgIHRoaXMuc2NvcGVDbG9zZXJzID0gc2NvcGVDbG9zZXJzO1xuXHQgICAgfSxcblxuXHQgICAgbWFrZUNhbGxiYWNrOiBmdW5jdGlvbihyZXMpIHtcblx0ICAgICAgICB2YXIgZXJyID0gdGhpcy50bXBpZCgpO1xuXG5cdCAgICAgICAgcmV0dXJuICdmdW5jdGlvbignICsgZXJyICsgKHJlcyA/ICcsJyArIHJlcyA6ICcnKSArICcpIHtcXG4nICtcblx0ICAgICAgICAgICAgJ2lmKCcgKyBlcnIgKyAnKSB7IGNiKCcgKyBlcnIgKyAnKTsgcmV0dXJuOyB9Jztcblx0ICAgIH0sXG5cblx0ICAgIHRtcGlkOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB0aGlzLmxhc3RJZCsrO1xuXHQgICAgICAgIHJldHVybiAndF8nICsgdGhpcy5sYXN0SWQ7XG5cdCAgICB9LFxuXG5cdCAgICBfdGVtcGxhdGVOYW1lOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZU5hbWUgPT0gbnVsbD8gJ3VuZGVmaW5lZCcgOiBKU09OLnN0cmluZ2lmeSh0aGlzLnRlbXBsYXRlTmFtZSk7XG5cdCAgICB9LFxuXG5cdCAgICBfY29tcGlsZUNoaWxkcmVuOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG5cdCAgICAgICAgZm9yKHZhciBpPTAsIGw9Y2hpbGRyZW4ubGVuZ3RoOyBpPGw7IGkrKykge1xuXHQgICAgICAgICAgICB0aGlzLmNvbXBpbGUoY2hpbGRyZW5baV0sIGZyYW1lKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBfY29tcGlsZUFnZ3JlZ2F0ZTogZnVuY3Rpb24obm9kZSwgZnJhbWUsIHN0YXJ0Q2hhciwgZW5kQ2hhcikge1xuXHQgICAgICAgIGlmKHN0YXJ0Q2hhcikge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQoc3RhcnRDaGFyKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBmb3IodmFyIGk9MDsgaTxub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIGlmKGkgPiAwKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJywnKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmNoaWxkcmVuW2ldLCBmcmFtZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYoZW5kQ2hhcikge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQoZW5kQ2hhcik7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgX2NvbXBpbGVFeHByZXNzaW9uOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIC8vIFRPRE86IEknbSBub3QgcmVhbGx5IHN1cmUgaWYgdGhpcyB0eXBlIGNoZWNrIGlzIHdvcnRoIGl0IG9yXG5cdCAgICAgICAgLy8gbm90LlxuXHQgICAgICAgIHRoaXMuYXNzZXJ0VHlwZShcblx0ICAgICAgICAgICAgbm9kZSxcblx0ICAgICAgICAgICAgbm9kZXMuTGl0ZXJhbCxcblx0ICAgICAgICAgICAgbm9kZXMuU3ltYm9sLFxuXHQgICAgICAgICAgICBub2Rlcy5Hcm91cCxcblx0ICAgICAgICAgICAgbm9kZXMuQXJyYXksXG5cdCAgICAgICAgICAgIG5vZGVzLkRpY3QsXG5cdCAgICAgICAgICAgIG5vZGVzLkZ1bkNhbGwsXG5cdCAgICAgICAgICAgIG5vZGVzLkNhbGxlcixcblx0ICAgICAgICAgICAgbm9kZXMuRmlsdGVyLFxuXHQgICAgICAgICAgICBub2Rlcy5Mb29rdXBWYWwsXG5cdCAgICAgICAgICAgIG5vZGVzLkNvbXBhcmUsXG5cdCAgICAgICAgICAgIG5vZGVzLklubGluZUlmLFxuXHQgICAgICAgICAgICBub2Rlcy5Jbixcblx0ICAgICAgICAgICAgbm9kZXMuQW5kLFxuXHQgICAgICAgICAgICBub2Rlcy5Pcixcblx0ICAgICAgICAgICAgbm9kZXMuTm90LFxuXHQgICAgICAgICAgICBub2Rlcy5BZGQsXG5cdCAgICAgICAgICAgIG5vZGVzLkNvbmNhdCxcblx0ICAgICAgICAgICAgbm9kZXMuU3ViLFxuXHQgICAgICAgICAgICBub2Rlcy5NdWwsXG5cdCAgICAgICAgICAgIG5vZGVzLkRpdixcblx0ICAgICAgICAgICAgbm9kZXMuRmxvb3JEaXYsXG5cdCAgICAgICAgICAgIG5vZGVzLk1vZCxcblx0ICAgICAgICAgICAgbm9kZXMuUG93LFxuXHQgICAgICAgICAgICBub2Rlcy5OZWcsXG5cdCAgICAgICAgICAgIG5vZGVzLlBvcyxcblx0ICAgICAgICAgICAgbm9kZXMuQ29tcGFyZSxcblx0ICAgICAgICAgICAgbm9kZXMuTm9kZUxpc3Rcblx0ICAgICAgICApO1xuXHQgICAgICAgIHRoaXMuY29tcGlsZShub2RlLCBmcmFtZSk7XG5cdCAgICB9LFxuXG5cdCAgICBhc3NlcnRUeXBlOiBmdW5jdGlvbihub2RlIC8qLCB0eXBlcyAqLykge1xuXHQgICAgICAgIHZhciB0eXBlcyA9IGxpYi50b0FycmF5KGFyZ3VtZW50cykuc2xpY2UoMSk7XG5cdCAgICAgICAgdmFyIHN1Y2Nlc3MgPSBmYWxzZTtcblxuXHQgICAgICAgIGZvcih2YXIgaT0wOyBpPHR5cGVzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIGlmKG5vZGUgaW5zdGFuY2VvZiB0eXBlc1tpXSkge1xuXHQgICAgICAgICAgICAgICAgc3VjY2VzcyA9IHRydWU7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZighc3VjY2Vzcykge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ2Fzc2VydFR5cGU6IGludmFsaWQgdHlwZTogJyArIG5vZGUudHlwZW5hbWUsXG5cdCAgICAgICAgICAgICAgICAgICAgICBub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY29sbm8pO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVDYWxsRXh0ZW5zaW9uOiBmdW5jdGlvbihub2RlLCBmcmFtZSwgYXN5bmMpIHtcblx0ICAgICAgICB2YXIgYXJncyA9IG5vZGUuYXJncztcblx0ICAgICAgICB2YXIgY29udGVudEFyZ3MgPSBub2RlLmNvbnRlbnRBcmdzO1xuXHQgICAgICAgIHZhciBhdXRvZXNjYXBlID0gdHlwZW9mIG5vZGUuYXV0b2VzY2FwZSA9PT0gJ2Jvb2xlYW4nID8gbm9kZS5hdXRvZXNjYXBlIDogdHJ1ZTtcblxuXHQgICAgICAgIGlmKCFhc3luYykge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5idWZmZXIgKyAnICs9IHJ1bnRpbWUuc3VwcHJlc3NWYWx1ZSgnKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmVtaXQoJ2Vudi5nZXRFeHRlbnNpb24oXCInICsgbm9kZS5leHROYW1lICsgJ1wiKVtcIicgKyBub2RlLnByb3AgKyAnXCJdKCcpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnY29udGV4dCcpO1xuXG5cdCAgICAgICAgaWYoYXJncyB8fCBjb250ZW50QXJncykge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQoJywnKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZihhcmdzKSB7XG5cdCAgICAgICAgICAgIGlmKCEoYXJncyBpbnN0YW5jZW9mIG5vZGVzLk5vZGVMaXN0KSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5mYWlsKCdjb21waWxlQ2FsbEV4dGVuc2lvbjogYXJndW1lbnRzIG11c3QgYmUgYSBOb2RlTGlzdCwgJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgJ3VzZSBgcGFyc2VyLnBhcnNlU2lnbmF0dXJlYCcpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgbGliLmVhY2goYXJncy5jaGlsZHJlbiwgZnVuY3Rpb24oYXJnLCBpKSB7XG5cdCAgICAgICAgICAgICAgICAvLyBUYWcgYXJndW1lbnRzIGFyZSBwYXNzZWQgbm9ybWFsbHkgdG8gdGhlIGNhbGwuIE5vdGVcblx0ICAgICAgICAgICAgICAgIC8vIHRoYXQga2V5d29yZCBhcmd1bWVudHMgYXJlIHR1cm5lZCBpbnRvIGEgc2luZ2xlIGpzXG5cdCAgICAgICAgICAgICAgICAvLyBvYmplY3QgYXMgdGhlIGxhc3QgYXJndW1lbnQsIGlmIHRoZXkgZXhpc3QuXG5cdCAgICAgICAgICAgICAgICB0aGlzLl9jb21waWxlRXhwcmVzc2lvbihhcmcsIGZyYW1lKTtcblxuXHQgICAgICAgICAgICAgICAgaWYoaSAhPT0gYXJncy5jaGlsZHJlbi5sZW5ndGggLSAxIHx8IGNvbnRlbnRBcmdzLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnLCcpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LCB0aGlzKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZihjb250ZW50QXJncy5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgbGliLmVhY2goY29udGVudEFyZ3MsIGZ1bmN0aW9uKGFyZywgaSkge1xuXHQgICAgICAgICAgICAgICAgaWYoaSA+IDApIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJywnKTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgaWYoYXJnKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy50bXBpZCgpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZnVuY3Rpb24oY2IpIHsnKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdpZighY2IpIHsgY2IgPSBmdW5jdGlvbihlcnIpIHsgaWYoZXJyKSB7IHRocm93IGVycjsgfX19Jyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoQnVmZmVySWQoaWQpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy53aXRoU2NvcGVkU3ludGF4KGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBpbGUoYXJnLCBmcmFtZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2NiKG51bGwsICcgKyBpZCArICcpOycpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BCdWZmZXJJZCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ3JldHVybiAnICsgaWQgKyAnOycpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ30nKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnbnVsbCcpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LCB0aGlzKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZihhc3luYykge1xuXHQgICAgICAgICAgICB2YXIgcmVzID0gdGhpcy50bXBpZCgpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCcsICcgKyB0aGlzLm1ha2VDYWxsYmFjayhyZXMpKTtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSh0aGlzLmJ1ZmZlciArICcgKz0gcnVudGltZS5zdXBwcmVzc1ZhbHVlKCcgKyByZXMgKyAnLCAnICsgYXV0b2VzY2FwZSArICcgJiYgZW52Lm9wdHMuYXV0b2VzY2FwZSk7Jyk7XG5cdCAgICAgICAgICAgIHRoaXMuYWRkU2NvcGVMZXZlbCgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0KCcpJyk7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdCgnLCAnICsgYXV0b2VzY2FwZSArICcgJiYgZW52Lm9wdHMuYXV0b2VzY2FwZSk7XFxuJyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUNhbGxFeHRlbnNpb25Bc3luYzogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLmNvbXBpbGVDYWxsRXh0ZW5zaW9uKG5vZGUsIGZyYW1lLCB0cnVlKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVOb2RlTGlzdDogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLl9jb21waWxlQ2hpbGRyZW4obm9kZSwgZnJhbWUpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUxpdGVyYWw6IGZ1bmN0aW9uKG5vZGUpIHtcblx0ICAgICAgICBpZih0eXBlb2Ygbm9kZS52YWx1ZSA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgICAgICAgdmFyIHZhbCA9IG5vZGUudmFsdWUucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKTtcblx0ICAgICAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKTtcblx0ICAgICAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKTtcblx0ICAgICAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoL1xcci9nLCAnXFxcXHInKTtcblx0ICAgICAgICAgICAgdmFsID0gdmFsLnJlcGxhY2UoL1xcdC9nLCAnXFxcXHQnKTtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0KCdcIicgKyB2YWwgICsgJ1wiJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYgKG5vZGUudmFsdWUgPT09IG51bGwpIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0KCdudWxsJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQobm9kZS52YWx1ZS50b1N0cmluZygpKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlU3ltYm9sOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHZhciBuYW1lID0gbm9kZS52YWx1ZTtcblx0ICAgICAgICB2YXIgdjtcblxuXHQgICAgICAgIGlmKCh2ID0gZnJhbWUubG9va3VwKG5hbWUpKSkge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQodik7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQoJ3J1bnRpbWUuY29udGV4dE9yRnJhbWVMb29rdXAoJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAnY29udGV4dCwgZnJhbWUsIFwiJyArIG5hbWUgKyAnXCIpJyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUdyb3VwOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVBZ2dyZWdhdGUobm9kZSwgZnJhbWUsICcoJywgJyknKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVBcnJheTogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLl9jb21waWxlQWdncmVnYXRlKG5vZGUsIGZyYW1lLCAnWycsICddJyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlRGljdDogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLl9jb21waWxlQWdncmVnYXRlKG5vZGUsIGZyYW1lLCAneycsICd9Jyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlUGFpcjogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB2YXIga2V5ID0gbm9kZS5rZXk7XG5cdCAgICAgICAgdmFyIHZhbCA9IG5vZGUudmFsdWU7XG5cblx0ICAgICAgICBpZihrZXkgaW5zdGFuY2VvZiBub2Rlcy5TeW1ib2wpIHtcblx0ICAgICAgICAgICAga2V5ID0gbmV3IG5vZGVzLkxpdGVyYWwoa2V5LmxpbmVubywga2V5LmNvbG5vLCBrZXkudmFsdWUpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKCEoa2V5IGluc3RhbmNlb2Ygbm9kZXMuTGl0ZXJhbCAmJlxuXHQgICAgICAgICAgICAgICAgICB0eXBlb2Yga2V5LnZhbHVlID09PSAnc3RyaW5nJykpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdjb21waWxlUGFpcjogRGljdCBrZXlzIG11c3QgYmUgc3RyaW5ncyBvciBuYW1lcycsXG5cdCAgICAgICAgICAgICAgICAgICAgICBrZXkubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAga2V5LmNvbG5vKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmNvbXBpbGUoa2V5LCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCc6ICcpO1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKHZhbCwgZnJhbWUpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUlubGluZUlmOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuZW1pdCgnKCcpO1xuXHQgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmNvbmQsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJz8nKTtcblx0ICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5ib2R5LCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCc6Jyk7XG5cdCAgICAgICAgaWYobm9kZS5lbHNlXyAhPT0gbnVsbClcblx0ICAgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuZWxzZV8sIGZyYW1lKTtcblx0ICAgICAgICBlbHNlXG5cdCAgICAgICAgICAgIHRoaXMuZW1pdCgnXCJcIicpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnKScpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUluOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICB0aGlzLmVtaXQoJ3J1bnRpbWUuaW5PcGVyYXRvcignKTtcblx0ICAgICAgdGhpcy5jb21waWxlKG5vZGUubGVmdCwgZnJhbWUpO1xuXHQgICAgICB0aGlzLmVtaXQoJywnKTtcblx0ICAgICAgdGhpcy5jb21waWxlKG5vZGUucmlnaHQsIGZyYW1lKTtcblx0ICAgICAgdGhpcy5lbWl0KCcpJyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlT3I6IGJpbk9wRW1pdHRlcignIHx8ICcpLFxuXHQgICAgY29tcGlsZUFuZDogYmluT3BFbWl0dGVyKCcgJiYgJyksXG5cdCAgICBjb21waWxlQWRkOiBiaW5PcEVtaXR0ZXIoJyArICcpLFxuXHQgICAgLy8gZW5zdXJlIGNvbmNhdGVuYXRpb24gaW5zdGVhZCBvZiBhZGRpdGlvblxuXHQgICAgLy8gYnkgYWRkaW5nIGVtcHR5IHN0cmluZyBpbiBiZXR3ZWVuXG5cdCAgICBjb21waWxlQ29uY2F0OiBiaW5PcEVtaXR0ZXIoJyArIFwiXCIgKyAnKSxcblx0ICAgIGNvbXBpbGVTdWI6IGJpbk9wRW1pdHRlcignIC0gJyksXG5cdCAgICBjb21waWxlTXVsOiBiaW5PcEVtaXR0ZXIoJyAqICcpLFxuXHQgICAgY29tcGlsZURpdjogYmluT3BFbWl0dGVyKCcgLyAnKSxcblx0ICAgIGNvbXBpbGVNb2Q6IGJpbk9wRW1pdHRlcignICUgJyksXG5cblx0ICAgIGNvbXBpbGVOb3Q6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdGhpcy5lbWl0KCchJyk7XG5cdCAgICAgICAgdGhpcy5jb21waWxlKG5vZGUudGFyZ2V0LCBmcmFtZSk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlRmxvb3JEaXY6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdGhpcy5lbWl0KCdNYXRoLmZsb29yKCcpO1xuXHQgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmxlZnQsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJyAvICcpO1xuXHQgICAgICAgIHRoaXMuY29tcGlsZShub2RlLnJpZ2h0LCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCcpJyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlUG93OiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHRoaXMuZW1pdCgnTWF0aC5wb3coJyk7XG5cdCAgICAgICAgdGhpcy5jb21waWxlKG5vZGUubGVmdCwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnLCAnKTtcblx0ICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5yaWdodCwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnKScpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZU5lZzogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLmVtaXQoJy0nKTtcblx0ICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS50YXJnZXQsIGZyYW1lKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVQb3M6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdGhpcy5lbWl0KCcrJyk7XG5cdCAgICAgICAgdGhpcy5jb21waWxlKG5vZGUudGFyZ2V0LCBmcmFtZSk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlQ29tcGFyZTogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5leHByLCBmcmFtZSk7XG5cblx0ICAgICAgICBmb3IodmFyIGk9MDsgaTxub2RlLm9wcy5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICB2YXIgbiA9IG5vZGUub3BzW2ldO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQoJyAnICsgY29tcGFyZU9wc1tuLnR5cGVdICsgJyAnKTtcblx0ICAgICAgICAgICAgdGhpcy5jb21waWxlKG4uZXhwciwgZnJhbWUpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVMb29rdXBWYWw6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdGhpcy5lbWl0KCdydW50aW1lLm1lbWJlckxvb2t1cCgoJyk7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUV4cHJlc3Npb24obm9kZS50YXJnZXQsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJyksJyk7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUV4cHJlc3Npb24obm9kZS52YWwsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJyknKTtcblx0ICAgIH0sXG5cblx0ICAgIF9nZXROb2RlTmFtZTogZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgIHN3aXRjaCAobm9kZS50eXBlbmFtZSkge1xuXHQgICAgICAgICAgICBjYXNlICdTeW1ib2wnOlxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XG5cdCAgICAgICAgICAgIGNhc2UgJ0Z1bkNhbGwnOlxuXHQgICAgICAgICAgICAgICAgcmV0dXJuICd0aGUgcmV0dXJuIHZhbHVlIG9mICgnICsgdGhpcy5fZ2V0Tm9kZU5hbWUobm9kZS5uYW1lKSArICcpJztcblx0ICAgICAgICAgICAgY2FzZSAnTG9va3VwVmFsJzpcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXROb2RlTmFtZShub2RlLnRhcmdldCkgKyAnW1wiJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0Tm9kZU5hbWUobm9kZS52YWwpICsgJ1wiXSc7XG5cdCAgICAgICAgICAgIGNhc2UgJ0xpdGVyYWwnOlxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUudmFsdWUudG9TdHJpbmcoKTtcblx0ICAgICAgICAgICAgZGVmYXVsdDpcblx0ICAgICAgICAgICAgICAgIHJldHVybiAnLS1leHByZXNzaW9uLS0nO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVGdW5DYWxsOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgbGluZS9jb2wgaW5mbyBhdCBydW50aW1lIGJ5IHNldHRpbmdzXG5cdCAgICAgICAgLy8gdmFyaWFibGVzIHdpdGhpbiBhbiBleHByZXNzaW9uLiBBbiBleHByZXNzaW9uIGluIGphdmFzY3JpcHRcblx0ICAgICAgICAvLyBsaWtlICh4LCB5LCB6KSByZXR1cm5zIHRoZSBsYXN0IHZhbHVlLCBhbmQgeCBhbmQgeSBjYW4gYmVcblx0ICAgICAgICAvLyBhbnl0aGluZ1xuXHQgICAgICAgIHRoaXMuZW1pdCgnKGxpbmVubyA9ICcgKyBub2RlLmxpbmVubyArXG5cdCAgICAgICAgICAgICAgICAgICcsIGNvbG5vID0gJyArIG5vZGUuY29sbm8gKyAnLCAnKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdCgncnVudGltZS5jYWxsV3JhcCgnKTtcblx0ICAgICAgICAvLyBDb21waWxlIGl0IGFzIG5vcm1hbC5cblx0ICAgICAgICB0aGlzLl9jb21waWxlRXhwcmVzc2lvbihub2RlLm5hbWUsIGZyYW1lKTtcblxuXHQgICAgICAgIC8vIE91dHB1dCB0aGUgbmFtZSBvZiB3aGF0IHdlJ3JlIGNhbGxpbmcgc28gd2UgY2FuIGdldCBmcmllbmRseSBlcnJvcnNcblx0ICAgICAgICAvLyBpZiB0aGUgbG9va3VwIGZhaWxzLlxuXHQgICAgICAgIHRoaXMuZW1pdCgnLCBcIicgKyB0aGlzLl9nZXROb2RlTmFtZShub2RlLm5hbWUpLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIiwgY29udGV4dCwgJyk7XG5cblx0ICAgICAgICB0aGlzLl9jb21waWxlQWdncmVnYXRlKG5vZGUuYXJncywgZnJhbWUsICdbJywgJ10pJyk7XG5cblx0ICAgICAgICB0aGlzLmVtaXQoJyknKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVGaWx0ZXI6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdmFyIG5hbWUgPSBub2RlLm5hbWU7XG5cdCAgICAgICAgdGhpcy5hc3NlcnRUeXBlKG5hbWUsIG5vZGVzLlN5bWJvbCk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCdlbnYuZ2V0RmlsdGVyKFwiJyArIG5hbWUudmFsdWUgKyAnXCIpLmNhbGwoY29udGV4dCwgJyk7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUFnZ3JlZ2F0ZShub2RlLmFyZ3MsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJyknKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVGaWx0ZXJBc3luYzogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB2YXIgbmFtZSA9IG5vZGUubmFtZTtcblx0ICAgICAgICB0aGlzLmFzc2VydFR5cGUobmFtZSwgbm9kZXMuU3ltYm9sKTtcblxuXHQgICAgICAgIHZhciBzeW1ib2wgPSBub2RlLnN5bWJvbC52YWx1ZTtcblx0ICAgICAgICBmcmFtZS5zZXQoc3ltYm9sLCBzeW1ib2wpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0KCdlbnYuZ2V0RmlsdGVyKFwiJyArIG5hbWUudmFsdWUgKyAnXCIpLmNhbGwoY29udGV4dCwgJyk7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUFnZ3JlZ2F0ZShub2RlLmFyZ3MsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCcsICcgKyB0aGlzLm1ha2VDYWxsYmFjayhzeW1ib2wpKTtcblxuXHQgICAgICAgIHRoaXMuYWRkU2NvcGVMZXZlbCgpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUtleXdvcmRBcmdzOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHZhciBuYW1lcyA9IFtdO1xuXG5cdCAgICAgICAgbGliLmVhY2gobm9kZS5jaGlsZHJlbiwgZnVuY3Rpb24ocGFpcikge1xuXHQgICAgICAgICAgICBuYW1lcy5wdXNoKHBhaXIua2V5LnZhbHVlKTtcblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHRoaXMuZW1pdCgncnVudGltZS5tYWtlS2V5d29yZEFyZ3MoJyk7XG5cdCAgICAgICAgdGhpcy5jb21waWxlRGljdChub2RlLCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCcpJyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlU2V0OiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHZhciBpZHMgPSBbXTtcblxuXHQgICAgICAgIC8vIExvb2t1cCB0aGUgdmFyaWFibGUgbmFtZXMgZm9yIGVhY2ggaWRlbnRpZmllciBhbmQgY3JlYXRlXG5cdCAgICAgICAgLy8gbmV3IG9uZXMgaWYgbmVjZXNzYXJ5XG5cdCAgICAgICAgbGliLmVhY2gobm9kZS50YXJnZXRzLCBmdW5jdGlvbih0YXJnZXQpIHtcblx0ICAgICAgICAgICAgdmFyIG5hbWUgPSB0YXJnZXQudmFsdWU7XG5cdCAgICAgICAgICAgIHZhciBpZCA9IGZyYW1lLmxvb2t1cChuYW1lKTtcblxuXHQgICAgICAgICAgICBpZiAoaWQgPT09IG51bGwgfHwgaWQgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICAgICAgaWQgPSB0aGlzLnRtcGlkKCk7XG5cblx0ICAgICAgICAgICAgICAgIC8vIE5vdGU6IFRoaXMgcmVsaWVzIG9uIGpzIGFsbG93aW5nIHNjb3BlIGFjcm9zc1xuXHQgICAgICAgICAgICAgICAgLy8gYmxvY2tzLCBpbiBjYXNlIHRoaXMgaXMgY3JlYXRlZCBpbnNpZGUgYW4gYGlmYFxuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgndmFyICcgKyBpZCArICc7Jyk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBpZHMucHVzaChpZCk7XG5cdCAgICAgICAgfSwgdGhpcyk7XG5cblx0ICAgICAgICBpZiAobm9kZS52YWx1ZSkge1xuXHQgICAgICAgICAgdGhpcy5lbWl0KGlkcy5qb2luKCcgPSAnKSArICcgPSAnKTtcblx0ICAgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKG5vZGUudmFsdWUsIGZyYW1lKTtcblx0ICAgICAgICAgIHRoaXMuZW1pdExpbmUoJzsnKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICB0aGlzLmVtaXQoaWRzLmpvaW4oJyA9ICcpICsgJyA9ICcpO1xuXHQgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuYm9keSwgZnJhbWUpO1xuXHQgICAgICAgICAgdGhpcy5lbWl0TGluZSgnOycpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGxpYi5lYWNoKG5vZGUudGFyZ2V0cywgZnVuY3Rpb24odGFyZ2V0LCBpKSB7XG5cdCAgICAgICAgICAgIHZhciBpZCA9IGlkc1tpXTtcblx0ICAgICAgICAgICAgdmFyIG5hbWUgPSB0YXJnZXQudmFsdWU7XG5cblx0ICAgICAgICAgICAgLy8gV2UgYXJlIHJ1bm5pbmcgdGhpcyBmb3IgZXZlcnkgdmFyLCBidXQgaXQncyB2ZXJ5XG5cdCAgICAgICAgICAgIC8vIHVuY29tbW9uIHRvIGFzc2lnbiB0byBtdWx0aXBsZSB2YXJzIGFueXdheVxuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZS5zZXQoXCInICsgbmFtZSArICdcIiwgJyArIGlkICsgJywgdHJ1ZSk7Jyk7XG5cblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnaWYoZnJhbWUudG9wTGV2ZWwpIHsnKTtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnY29udGV4dC5zZXRWYXJpYWJsZShcIicgKyBuYW1lICsgJ1wiLCAnICsgaWQgKyAnKTsnKTtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXG5cdCAgICAgICAgICAgIGlmKG5hbWUuY2hhckF0KDApICE9PSAnXycpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2lmKGZyYW1lLnRvcExldmVsKSB7Jyk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdjb250ZXh0LmFkZEV4cG9ydChcIicgKyBuYW1lICsgJ1wiLCAnICsgaWQgKyAnKTsnKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ30nKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sIHRoaXMpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUlmOiBmdW5jdGlvbihub2RlLCBmcmFtZSwgYXN5bmMpIHtcblx0ICAgICAgICB0aGlzLmVtaXQoJ2lmKCcpO1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKG5vZGUuY29uZCwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJykgeycpO1xuXG5cdCAgICAgICAgdGhpcy53aXRoU2NvcGVkU3ludGF4KGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5ib2R5LCBmcmFtZSk7XG5cblx0ICAgICAgICAgICAgaWYoYXN5bmMpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnY2IoKScpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICBpZihub2RlLmVsc2VfKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ31cXG5lbHNlIHsnKTtcblxuXHQgICAgICAgICAgICB0aGlzLndpdGhTY29wZWRTeW50YXgoZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbXBpbGUobm9kZS5lbHNlXywgZnJhbWUpO1xuXG5cdCAgICAgICAgICAgICAgICBpZihhc3luYykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnY2IoKScpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9IGVsc2UgaWYoYXN5bmMpIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfVxcbmVsc2UgeycpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXQoJ2NiKCknKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd9Jyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlSWZBc3luYzogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLmVtaXQoJyhmdW5jdGlvbihjYikgeycpO1xuXHQgICAgICAgIHRoaXMuY29tcGlsZUlmKG5vZGUsIGZyYW1lLCB0cnVlKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJ30pKCcgKyB0aGlzLm1ha2VDYWxsYmFjaygpKTtcblx0ICAgICAgICB0aGlzLmFkZFNjb3BlTGV2ZWwoKTtcblx0ICAgIH0sXG5cblx0ICAgIGVtaXRMb29wQmluZGluZ3M6IGZ1bmN0aW9uKG5vZGUsIGFyciwgaSwgbGVuKSB7XG5cdCAgICAgICAgdmFyIGJpbmRpbmdzID0ge1xuXHQgICAgICAgICAgICBpbmRleDogaSArICcgKyAxJyxcblx0ICAgICAgICAgICAgaW5kZXgwOiBpLFxuXHQgICAgICAgICAgICByZXZpbmRleDogbGVuICsgJyAtICcgKyBpLFxuXHQgICAgICAgICAgICByZXZpbmRleDA6IGxlbiArICcgLSAnICsgaSArICcgLSAxJyxcblx0ICAgICAgICAgICAgZmlyc3Q6IGkgKyAnID09PSAwJyxcblx0ICAgICAgICAgICAgbGFzdDogaSArICcgPT09ICcgKyBsZW4gKyAnIC0gMScsXG5cdCAgICAgICAgICAgIGxlbmd0aDogbGVuXG5cdCAgICAgICAgfTtcblxuXHQgICAgICAgIGZvciAodmFyIG5hbWUgaW4gYmluZGluZ3MpIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUuc2V0KFwibG9vcC4nICsgbmFtZSArICdcIiwgJyArIGJpbmRpbmdzW25hbWVdICsgJyk7Jyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUZvcjogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICAvLyBTb21lIG9mIHRoaXMgY29kZSBpcyB1Z2x5LCBidXQgaXQga2VlcHMgdGhlIGdlbmVyYXRlZCBjb2RlXG5cdCAgICAgICAgLy8gYXMgZmFzdCBhcyBwb3NzaWJsZS4gRm9yQXN5bmMgYWxzbyBzaGFyZXMgc29tZSBvZiB0aGlzLCBidXRcblx0ICAgICAgICAvLyBub3QgbXVjaC5cblxuXHQgICAgICAgIHZhciB2O1xuXHQgICAgICAgIHZhciBpID0gdGhpcy50bXBpZCgpO1xuXHQgICAgICAgIHZhciBsZW4gPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgdmFyIGFyciA9IHRoaXMudG1waWQoKTtcblx0ICAgICAgICBmcmFtZSA9IGZyYW1lLnB1c2goKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ2ZyYW1lID0gZnJhbWUucHVzaCgpOycpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0KCd2YXIgJyArIGFyciArICcgPSAnKTtcblx0ICAgICAgICB0aGlzLl9jb21waWxlRXhwcmVzc2lvbihub2RlLmFyciwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJzsnKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdCgnaWYoJyArIGFyciArICcpIHsnKTtcblxuXHQgICAgICAgIC8vIElmIG11bHRpcGxlIG5hbWVzIGFyZSBwYXNzZWQsIHdlIG5lZWQgdG8gYmluZCB0aGVtXG5cdCAgICAgICAgLy8gYXBwcm9wcmlhdGVseVxuXHQgICAgICAgIGlmKG5vZGUubmFtZSBpbnN0YW5jZW9mIG5vZGVzLkFycmF5KSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ3ZhciAnICsgaSArICc7Jyk7XG5cblx0ICAgICAgICAgICAgLy8gVGhlIG9iamVjdCBjb3VsZCBiZSBhbiBhcnJveSBvciBvYmplY3QuIE5vdGUgdGhhdCB0aGVcblx0ICAgICAgICAgICAgLy8gYm9keSBvZiB0aGUgbG9vcCBpcyBkdXBsaWNhdGVkIGZvciBlYWNoIGNvbmRpdGlvbiwgYnV0XG5cdCAgICAgICAgICAgIC8vIHdlIGFyZSBvcHRpbWl6aW5nIGZvciBzcGVlZCBvdmVyIHNpemUuXG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2lmKHJ1bnRpbWUuaXNBcnJheSgnICsgYXJyICsgJykpIHsnKTsge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgndmFyICcgKyBsZW4gKyAnID0gJyArIGFyciArICcubGVuZ3RoOycpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZm9yKCcgKyBpICsgJz0wOyAnICsgaSArICcgPCAnICsgYXJyICsgJy5sZW5ndGg7ICdcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBpICsgJysrKSB7Jyk7XG5cblx0ICAgICAgICAgICAgICAgIC8vIEJpbmQgZWFjaCBkZWNsYXJlZCB2YXJcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIHU9MDsgdSA8IG5vZGUubmFtZS5jaGlsZHJlbi5sZW5ndGg7IHUrKykge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB0aWQgPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgndmFyICcgKyB0aWQgKyAnID0gJyArIGFyciArICdbJyArIGkgKyAnXVsnICsgdSArICddJyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUuc2V0KFwiJyArIG5vZGUubmFtZS5jaGlsZHJlblt1XS52YWx1ZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXCIsICcgKyBhcnIgKyAnWycgKyBpICsgJ11bJyArIHUgKyAnXScgKyAnKTsnKTtcblx0ICAgICAgICAgICAgICAgICAgICBmcmFtZS5zZXQobm9kZS5uYW1lLmNoaWxkcmVuW3VdLnZhbHVlLCB0aWQpO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMb29wQmluZGluZ3Mobm9kZSwgYXJyLCBpLCBsZW4pO1xuXHQgICAgICAgICAgICAgICAgdGhpcy53aXRoU2NvcGVkU3ludGF4KGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmJvZHksIGZyYW1lKTtcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfSBlbHNlIHsnKTsge1xuXHQgICAgICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSBrZXkvdmFsdWVzIG9mIGFuIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgdmFyIGtleSA9IG5vZGUubmFtZS5jaGlsZHJlblswXTtcblx0ICAgICAgICAgICAgICAgIHZhciB2YWwgPSBub2RlLm5hbWUuY2hpbGRyZW5bMV07XG5cdCAgICAgICAgICAgICAgICB2YXIgayA9IHRoaXMudG1waWQoKTtcblx0ICAgICAgICAgICAgICAgIHYgPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgICAgICAgICBmcmFtZS5zZXQoa2V5LnZhbHVlLCBrKTtcblx0ICAgICAgICAgICAgICAgIGZyYW1lLnNldCh2YWwudmFsdWUsIHYpO1xuXG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKGkgKyAnID0gLTE7Jyk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgJyArIGxlbiArICcgPSBydW50aW1lLmtleXMoJyArIGFyciArICcpLmxlbmd0aDsnKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2Zvcih2YXIgJyArIGsgKyAnIGluICcgKyBhcnIgKyAnKSB7Jyk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKGkgKyAnKys7Jyk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgJyArIHYgKyAnID0gJyArIGFyciArICdbJyArIGsgKyAnXTsnKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2ZyYW1lLnNldChcIicgKyBrZXkudmFsdWUgKyAnXCIsICcgKyBrICsgJyk7Jyk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZS5zZXQoXCInICsgdmFsLnZhbHVlICsgJ1wiLCAnICsgdiArICcpOycpO1xuXG5cdCAgICAgICAgICAgICAgICB0aGlzLmVtaXRMb29wQmluZGluZ3Mobm9kZSwgYXJyLCBpLCBsZW4pO1xuXHQgICAgICAgICAgICAgICAgdGhpcy53aXRoU2NvcGVkU3ludGF4KGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmJvZHksIGZyYW1lKTtcblx0ICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgLy8gR2VuZXJhdGUgYSB0eXBpY2FsIGFycmF5IGl0ZXJhdGlvblxuXHQgICAgICAgICAgICB2ID0gdGhpcy50bXBpZCgpO1xuXHQgICAgICAgICAgICBmcmFtZS5zZXQobm9kZS5uYW1lLnZhbHVlLCB2KTtcblxuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgJyArIGxlbiArICcgPSAnICsgYXJyICsgJy5sZW5ndGg7Jyk7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2Zvcih2YXIgJyArIGkgKyAnPTA7ICcgKyBpICsgJyA8ICcgKyBhcnIgKyAnLmxlbmd0aDsgJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgaSArICcrKykgeycpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgJyArIHYgKyAnID0gJyArIGFyciArICdbJyArIGkgKyAnXTsnKTtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUuc2V0KFwiJyArIG5vZGUubmFtZS52YWx1ZSArICdcIiwgJyArIHYgKyAnKTsnKTtcblxuXHQgICAgICAgICAgICB0aGlzLmVtaXRMb29wQmluZGluZ3Mobm9kZSwgYXJyLCBpLCBsZW4pO1xuXG5cdCAgICAgICAgICAgIHRoaXMud2l0aFNjb3BlZFN5bnRheChmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmJvZHksIGZyYW1lKTtcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ30nKTtcblx0ICAgICAgICBpZiAobm9kZS5lbHNlXykge1xuXHQgICAgICAgICAgdGhpcy5lbWl0TGluZSgnaWYgKCEnICsgbGVuICsgJykgeycpO1xuXHQgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuZWxzZV8sIGZyYW1lKTtcblx0ICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ30nKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZSA9IGZyYW1lLnBvcCgpOycpO1xuXHQgICAgfSxcblxuXHQgICAgX2NvbXBpbGVBc3luY0xvb3A6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lLCBwYXJhbGxlbCkge1xuXHQgICAgICAgIC8vIFRoaXMgc2hhcmVzIHNvbWUgY29kZSB3aXRoIHRoZSBGb3IgdGFnLCBidXQgbm90IGVub3VnaCB0b1xuXHQgICAgICAgIC8vIHdvcnJ5IGFib3V0LiBUaGlzIGl0ZXJhdGVzIGFjcm9zcyBhbiBvYmplY3QgYXN5bmNocm9ub3VzbHksXG5cdCAgICAgICAgLy8gYnV0IG5vdCBpbiBwYXJhbGxlbC5cblxuXHQgICAgICAgIHZhciBpID0gdGhpcy50bXBpZCgpO1xuXHQgICAgICAgIHZhciBsZW4gPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgdmFyIGFyciA9IHRoaXMudG1waWQoKTtcblx0ICAgICAgICB2YXIgYXN5bmNNZXRob2QgPSBwYXJhbGxlbCA/ICdhc3luY0FsbCcgOiAnYXN5bmNFYWNoJztcblx0ICAgICAgICBmcmFtZSA9IGZyYW1lLnB1c2goKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ2ZyYW1lID0gZnJhbWUucHVzaCgpOycpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0KCd2YXIgJyArIGFyciArICcgPSAnKTtcblx0ICAgICAgICB0aGlzLl9jb21waWxlRXhwcmVzc2lvbihub2RlLmFyciwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJzsnKTtcblxuXHQgICAgICAgIGlmKG5vZGUubmFtZSBpbnN0YW5jZW9mIG5vZGVzLkFycmF5KSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdCgncnVudGltZS4nICsgYXN5bmNNZXRob2QgKyAnKCcgKyBhcnIgKyAnLCAnICtcblx0ICAgICAgICAgICAgICAgICAgICAgIG5vZGUubmFtZS5jaGlsZHJlbi5sZW5ndGggKyAnLCBmdW5jdGlvbignKTtcblxuXHQgICAgICAgICAgICBsaWIuZWFjaChub2RlLm5hbWUuY2hpbGRyZW4sIGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdChuYW1lLnZhbHVlICsgJywnKTtcblx0ICAgICAgICAgICAgfSwgdGhpcyk7XG5cblx0ICAgICAgICAgICAgdGhpcy5lbWl0KGkgKyAnLCcgKyBsZW4gKyAnLG5leHQpIHsnKTtcblxuXHQgICAgICAgICAgICBsaWIuZWFjaChub2RlLm5hbWUuY2hpbGRyZW4sIGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBpZCA9IG5hbWUudmFsdWU7XG5cdCAgICAgICAgICAgICAgICBmcmFtZS5zZXQoaWQsIGlkKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2ZyYW1lLnNldChcIicgKyBpZCArICdcIiwgJyArIGlkICsgJyk7Jyk7XG5cdCAgICAgICAgICAgIH0sIHRoaXMpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdmFyIGlkID0gbm9kZS5uYW1lLnZhbHVlO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdydW50aW1lLicgKyBhc3luY01ldGhvZCArICcoJyArIGFyciArICcsIDEsIGZ1bmN0aW9uKCcgKyBpZCArICcsICcgKyBpICsgJywgJyArIGxlbiArICcsbmV4dCkgeycpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZS5zZXQoXCInICsgaWQgKyAnXCIsICcgKyBpZCArICcpOycpO1xuXHQgICAgICAgICAgICBmcmFtZS5zZXQoaWQsIGlkKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmVtaXRMb29wQmluZGluZ3Mobm9kZSwgYXJyLCBpLCBsZW4pO1xuXG5cdCAgICAgICAgdGhpcy53aXRoU2NvcGVkU3ludGF4KGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICB2YXIgYnVmO1xuXHQgICAgICAgICAgICBpZihwYXJhbGxlbCkge1xuXHQgICAgICAgICAgICAgICAgYnVmID0gdGhpcy50bXBpZCgpO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5wdXNoQnVmZmVySWQoYnVmKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHRoaXMuY29tcGlsZShub2RlLmJvZHksIGZyYW1lKTtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnbmV4dCgnICsgaSArIChidWYgPyAnLCcgKyBidWYgOiAnJykgKyAnKTsnKTtcblxuXHQgICAgICAgICAgICBpZihwYXJhbGxlbCkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5wb3BCdWZmZXJJZCgpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy50bXBpZCgpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ30sICcgKyB0aGlzLm1ha2VDYWxsYmFjayhvdXRwdXQpKTtcblx0ICAgICAgICB0aGlzLmFkZFNjb3BlTGV2ZWwoKTtcblxuXHQgICAgICAgIGlmKHBhcmFsbGVsKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUodGhpcy5idWZmZXIgKyAnICs9ICcgKyBvdXRwdXQgKyAnOycpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmIChub2RlLmVsc2VfKSB7XG5cdCAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdpZiAoIScgKyBhcnIgKyAnLmxlbmd0aCkgeycpO1xuXHQgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuZWxzZV8sIGZyYW1lKTtcblx0ICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ30nKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdmcmFtZSA9IGZyYW1lLnBvcCgpOycpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUFzeW5jRWFjaDogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLl9jb21waWxlQXN5bmNMb29wKG5vZGUsIGZyYW1lKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVBc3luY0FsbDogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB0aGlzLl9jb21waWxlQXN5bmNMb29wKG5vZGUsIGZyYW1lLCB0cnVlKTtcblx0ICAgIH0sXG5cblx0ICAgIF9jb21waWxlTWFjcm86IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdmFyIGFyZ3MgPSBbXTtcblx0ICAgICAgICB2YXIga3dhcmdzID0gbnVsbDtcblx0ICAgICAgICB2YXIgZnVuY0lkID0gJ21hY3JvXycgKyB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgdmFyIGtlZXBGcmFtZSA9IChmcmFtZSAhPT0gdW5kZWZpbmVkKTtcblxuXHQgICAgICAgIC8vIFR5cGUgY2hlY2sgdGhlIGRlZmluaXRpb24gb2YgdGhlIGFyZ3Ncblx0ICAgICAgICBsaWIuZWFjaChub2RlLmFyZ3MuY2hpbGRyZW4sIGZ1bmN0aW9uKGFyZywgaSkge1xuXHQgICAgICAgICAgICBpZihpID09PSBub2RlLmFyZ3MuY2hpbGRyZW4ubGVuZ3RoIC0gMSAmJlxuXHQgICAgICAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBub2Rlcy5EaWN0KSB7XG5cdCAgICAgICAgICAgICAgICBrd2FyZ3MgPSBhcmc7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmFzc2VydFR5cGUoYXJnLCBub2Rlcy5TeW1ib2wpO1xuXHQgICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9LCB0aGlzKTtcblxuXHQgICAgICAgIHZhciByZWFsTmFtZXMgPSBsaWIubWFwKGFyZ3MsIGZ1bmN0aW9uKG4pIHsgcmV0dXJuICdsXycgKyBuLnZhbHVlOyB9KTtcblx0ICAgICAgICByZWFsTmFtZXMucHVzaCgna3dhcmdzJyk7XG5cblx0ICAgICAgICAvLyBRdW90ZWQgYXJndW1lbnQgbmFtZXNcblx0ICAgICAgICB2YXIgYXJnTmFtZXMgPSBsaWIubWFwKGFyZ3MsIGZ1bmN0aW9uKG4pIHsgcmV0dXJuICdcIicgKyBuLnZhbHVlICsgJ1wiJzsgfSk7XG5cdCAgICAgICAgdmFyIGt3YXJnTmFtZXMgPSBsaWIubWFwKChrd2FyZ3MgJiYga3dhcmdzLmNoaWxkcmVuKSB8fCBbXSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24obikgeyByZXR1cm4gJ1wiJyArIG4ua2V5LnZhbHVlICsgJ1wiJzsgfSk7XG5cblx0ICAgICAgICAvLyBXZSBwYXNzIGEgZnVuY3Rpb24gdG8gbWFrZU1hY3JvIHdoaWNoIGRlc3RydWN0dXJlcyB0aGVcblx0ICAgICAgICAvLyBhcmd1bWVudHMgc28gc3VwcG9ydCBzZXR0aW5nIHBvc2l0aW9uYWwgYXJncyB3aXRoIGtleXdvcmRzXG5cdCAgICAgICAgLy8gYXJncyBhbmQgcGFzc2luZyBrZXl3b3JkIGFyZ3MgYXMgcG9zaXRpb25hbCBhcmdzXG5cdCAgICAgICAgLy8gKGVzc2VudGlhbGx5IGRlZmF1bHQgdmFsdWVzKS4gU2VlIHJ1bnRpbWUuanMuXG5cdCAgICAgICAgaWYgKGtlZXBGcmFtZSkge1xuXHQgICAgICAgICAgICBmcmFtZSA9IGZyYW1lLnB1c2godHJ1ZSk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgZnJhbWUgPSBuZXcgRnJhbWUoKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZXMoXG5cdCAgICAgICAgICAgICd2YXIgJyArIGZ1bmNJZCArICcgPSBydW50aW1lLm1ha2VNYWNybygnLFxuXHQgICAgICAgICAgICAnWycgKyBhcmdOYW1lcy5qb2luKCcsICcpICsgJ10sICcsXG5cdCAgICAgICAgICAgICdbJyArIGt3YXJnTmFtZXMuam9pbignLCAnKSArICddLCAnLFxuXHQgICAgICAgICAgICAnZnVuY3Rpb24gKCcgKyByZWFsTmFtZXMuam9pbignLCAnKSArICcpIHsnLFxuXHQgICAgICAgICAgICAndmFyIGNhbGxlckZyYW1lID0gZnJhbWU7Jyxcblx0ICAgICAgICAgICAgJ2ZyYW1lID0gJyArICgoa2VlcEZyYW1lKSA/ICdmcmFtZS5wdXNoKHRydWUpOycgOiAnbmV3IHJ1bnRpbWUuRnJhbWUoKTsnKSxcblx0ICAgICAgICAgICAgJ2t3YXJncyA9IGt3YXJncyB8fCB7fTsnLFxuXHQgICAgICAgICAgICAnaWYgKGt3YXJncy5oYXNPd25Qcm9wZXJ0eShcImNhbGxlclwiKSkgeycsXG5cdCAgICAgICAgICAgICdmcmFtZS5zZXQoXCJjYWxsZXJcIiwga3dhcmdzLmNhbGxlcik7IH0nXG5cdCAgICAgICAgKTtcblxuXHQgICAgICAgIC8vIEV4cG9zZSB0aGUgYXJndW1lbnRzIHRvIHRoZSB0ZW1wbGF0ZS4gRG9uJ3QgbmVlZCB0byB1c2Vcblx0ICAgICAgICAvLyByYW5kb20gbmFtZXMgYmVjYXVzZSB0aGUgZnVuY3Rpb25cblx0ICAgICAgICAvLyB3aWxsIGNyZWF0ZSBhIG5ldyBydW4tdGltZSBzY29wZSBmb3IgdXNcblx0ICAgICAgICBsaWIuZWFjaChhcmdzLCBmdW5jdGlvbihhcmcpIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUuc2V0KFwiJyArIGFyZy52YWx1ZSArICdcIiwgJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xfJyArIGFyZy52YWx1ZSArICcpOycpO1xuXHQgICAgICAgICAgICBmcmFtZS5zZXQoYXJnLnZhbHVlLCAnbF8nICsgYXJnLnZhbHVlKTtcblx0ICAgICAgICB9LCB0aGlzKTtcblxuXHQgICAgICAgIC8vIEV4cG9zZSB0aGUga2V5d29yZCBhcmd1bWVudHNcblx0ICAgICAgICBpZihrd2FyZ3MpIHtcblx0ICAgICAgICAgICAgbGliLmVhY2goa3dhcmdzLmNoaWxkcmVuLCBmdW5jdGlvbihwYWlyKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IHBhaXIua2V5LnZhbHVlO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdmcmFtZS5zZXQoXCInICsgbmFtZSArICdcIiwgJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgJ2t3YXJncy5oYXNPd25Qcm9wZXJ0eShcIicgKyBuYW1lICsgJ1wiKSA/ICcgK1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICdrd2FyZ3NbXCInICsgbmFtZSArICdcIl0gOiAnKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKHBhaXIudmFsdWUsIGZyYW1lKTtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJyk7Jyk7XG5cdCAgICAgICAgICAgIH0sIHRoaXMpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBidWZmZXJJZCA9IHRoaXMudG1waWQoKTtcblx0ICAgICAgICB0aGlzLnB1c2hCdWZmZXJJZChidWZmZXJJZCk7XG5cblx0ICAgICAgICB0aGlzLndpdGhTY29wZWRTeW50YXgoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuYm9keSwgZnJhbWUpO1xuXHQgICAgICAgIH0pO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUgPSAnICsgKChrZWVwRnJhbWUpID8gJ2ZyYW1lLnBvcCgpOycgOiAnY2FsbGVyRnJhbWU7JykpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3JldHVybiBuZXcgcnVudGltZS5TYWZlU3RyaW5nKCcgKyBidWZmZXJJZCArICcpOycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ30pOycpO1xuXHQgICAgICAgIHRoaXMucG9wQnVmZmVySWQoKTtcblxuXHQgICAgICAgIHJldHVybiBmdW5jSWQ7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlTWFjcm86IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdmFyIGZ1bmNJZCA9IHRoaXMuX2NvbXBpbGVNYWNybyhub2RlKTtcblxuXHQgICAgICAgIC8vIEV4cG9zZSB0aGUgbWFjcm8gdG8gdGhlIHRlbXBsYXRlc1xuXHQgICAgICAgIHZhciBuYW1lID0gbm9kZS5uYW1lLnZhbHVlO1xuXHQgICAgICAgIGZyYW1lLnNldChuYW1lLCBmdW5jSWQpO1xuXG5cdCAgICAgICAgaWYoZnJhbWUucGFyZW50KSB7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2ZyYW1lLnNldChcIicgKyBuYW1lICsgJ1wiLCAnICsgZnVuY0lkICsgJyk7Jyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICBpZihub2RlLm5hbWUudmFsdWUuY2hhckF0KDApICE9PSAnXycpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2NvbnRleHQuYWRkRXhwb3J0KFwiJyArIG5hbWUgKyAnXCIpOycpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2NvbnRleHQuc2V0VmFyaWFibGUoXCInICsgbmFtZSArICdcIiwgJyArIGZ1bmNJZCArICcpOycpO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVDYWxsZXI6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgLy8gYmFzaWNhbGx5IGFuIGFub255bW91cyBcIm1hY3JvIGV4cHJlc3Npb25cIlxuXHQgICAgICAgIHRoaXMuZW1pdCgnKGZ1bmN0aW9uICgpeycpO1xuXHQgICAgICAgIHZhciBmdW5jSWQgPSB0aGlzLl9jb21waWxlTWFjcm8obm9kZSwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgncmV0dXJuICcgKyBmdW5jSWQgKyAnO30pKCknKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVJbXBvcnQ6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdmFyIGlkID0gdGhpcy50bXBpZCgpO1xuXHQgICAgICAgIHZhciB0YXJnZXQgPSBub2RlLnRhcmdldC52YWx1ZTtcblxuXHQgICAgICAgIHRoaXMuZW1pdCgnZW52LmdldFRlbXBsYXRlKCcpO1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKG5vZGUudGVtcGxhdGUsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCcsIGZhbHNlLCAnK3RoaXMuX3RlbXBsYXRlTmFtZSgpKycsIGZhbHNlLCAnICsgdGhpcy5tYWtlQ2FsbGJhY2soaWQpKTtcblx0ICAgICAgICB0aGlzLmFkZFNjb3BlTGV2ZWwoKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoaWQgKyAnLmdldEV4cG9ydGVkKCcgK1xuXHQgICAgICAgICAgICAobm9kZS53aXRoQ29udGV4dCA/ICdjb250ZXh0LmdldFZhcmlhYmxlcygpLCBmcmFtZSwgJyA6ICcnKSArXG5cdCAgICAgICAgICAgIHRoaXMubWFrZUNhbGxiYWNrKGlkKSk7XG5cdCAgICAgICAgdGhpcy5hZGRTY29wZUxldmVsKCk7XG5cblx0ICAgICAgICBmcmFtZS5zZXQodGFyZ2V0LCBpZCk7XG5cblx0ICAgICAgICBpZihmcmFtZS5wYXJlbnQpIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUuc2V0KFwiJyArIHRhcmdldCArICdcIiwgJyArIGlkICsgJyk7Jyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdjb250ZXh0LnNldFZhcmlhYmxlKFwiJyArIHRhcmdldCArICdcIiwgJyArIGlkICsgJyk7Jyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZUZyb21JbXBvcnQ6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdmFyIGltcG9ydGVkSWQgPSB0aGlzLnRtcGlkKCk7XG5cblx0ICAgICAgICB0aGlzLmVtaXQoJ2Vudi5nZXRUZW1wbGF0ZSgnKTtcblx0ICAgICAgICB0aGlzLl9jb21waWxlRXhwcmVzc2lvbihub2RlLnRlbXBsYXRlLCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnLCBmYWxzZSwgJyt0aGlzLl90ZW1wbGF0ZU5hbWUoKSsnLCBmYWxzZSwgJyArIHRoaXMubWFrZUNhbGxiYWNrKGltcG9ydGVkSWQpKTtcblx0ICAgICAgICB0aGlzLmFkZFNjb3BlTGV2ZWwoKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoaW1wb3J0ZWRJZCArICcuZ2V0RXhwb3J0ZWQoJyArXG5cdCAgICAgICAgICAgIChub2RlLndpdGhDb250ZXh0ID8gJ2NvbnRleHQuZ2V0VmFyaWFibGVzKCksIGZyYW1lLCAnIDogJycpICtcblx0ICAgICAgICAgICAgdGhpcy5tYWtlQ2FsbGJhY2soaW1wb3J0ZWRJZCkpO1xuXHQgICAgICAgIHRoaXMuYWRkU2NvcGVMZXZlbCgpO1xuXG5cdCAgICAgICAgbGliLmVhY2gobm9kZS5uYW1lcy5jaGlsZHJlbiwgZnVuY3Rpb24obmFtZU5vZGUpIHtcblx0ICAgICAgICAgICAgdmFyIG5hbWU7XG5cdCAgICAgICAgICAgIHZhciBhbGlhcztcblx0ICAgICAgICAgICAgdmFyIGlkID0gdGhpcy50bXBpZCgpO1xuXG5cdCAgICAgICAgICAgIGlmKG5hbWVOb2RlIGluc3RhbmNlb2Ygbm9kZXMuUGFpcikge1xuXHQgICAgICAgICAgICAgICAgbmFtZSA9IG5hbWVOb2RlLmtleS52YWx1ZTtcblx0ICAgICAgICAgICAgICAgIGFsaWFzID0gbmFtZU5vZGUudmFsdWUudmFsdWU7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBuYW1lID0gbmFtZU5vZGUudmFsdWU7XG5cdCAgICAgICAgICAgICAgICBhbGlhcyA9IG5hbWU7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdpZignICsgaW1wb3J0ZWRJZCArICcuaGFzT3duUHJvcGVydHkoXCInICsgbmFtZSArICdcIikpIHsnKTtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgndmFyICcgKyBpZCArICcgPSAnICsgaW1wb3J0ZWRJZCArICcuJyArIG5hbWUgKyAnOycpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd9IGVsc2UgeycpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCdjYihuZXcgRXJyb3IoXCJjYW5ub3QgaW1wb3J0IFxcJycgKyBuYW1lICsgJ1xcJ1wiKSk7IHJldHVybjsnKTtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXG5cdCAgICAgICAgICAgIGZyYW1lLnNldChhbGlhcywgaWQpO1xuXG5cdCAgICAgICAgICAgIGlmKGZyYW1lLnBhcmVudCkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0TGluZSgnZnJhbWUuc2V0KFwiJyArIGFsaWFzICsgJ1wiLCAnICsgaWQgKyAnKTsnKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJ2NvbnRleHQuc2V0VmFyaWFibGUoXCInICsgYWxpYXMgKyAnXCIsICcgKyBpZCArICcpOycpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSwgdGhpcyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlQmxvY2s6IGZ1bmN0aW9uKG5vZGUpIHtcblx0ICAgICAgICB2YXIgaWQgPSB0aGlzLnRtcGlkKCk7XG5cblx0ICAgICAgICAvLyBJZiB3ZSBhcmUgZXhlY3V0aW5nIG91dHNpZGUgYSBibG9jayAoY3JlYXRpbmcgYSB0b3AtbGV2ZWxcblx0ICAgICAgICAvLyBibG9jayksIHdlIHJlYWxseSBkb24ndCB3YW50IHRvIGV4ZWN1dGUgaXRzIGNvZGUgYmVjYXVzZSBpdFxuXHQgICAgICAgIC8vIHdpbGwgZXhlY3V0ZSB0d2ljZTogb25jZSB3aGVuIHRoZSBjaGlsZCB0ZW1wbGF0ZSBydW5zIGFuZFxuXHQgICAgICAgIC8vIGFnYWluIHdoZW4gdGhlIHBhcmVudCB0ZW1wbGF0ZSBydW5zLiBOb3RlIHRoYXQgYmxvY2tzXG5cdCAgICAgICAgLy8gd2l0aGluIGJsb2NrcyB3aWxsICphbHdheXMqIGV4ZWN1dGUgaW1tZWRpYXRlbHkgKmFuZCpcblx0ICAgICAgICAvLyB3aGVyZXZlciBlbHNlIHRoZXkgYXJlIGludm9rZWQgKGxpa2UgdXNlZCBpbiBhIHBhcmVudFxuXHQgICAgICAgIC8vIHRlbXBsYXRlKS4gVGhpcyBtYXkgaGF2ZSBiZWhhdmlvcmFsIGRpZmZlcmVuY2VzIGZyb20gamluamFcblx0ICAgICAgICAvLyBiZWNhdXNlIGJsb2NrcyBjYW4gaGF2ZSBzaWRlIGVmZmVjdHMsIGJ1dCBpdCBzZWVtcyBsaWtlIGFcblx0ICAgICAgICAvLyB3YXN0ZSBvZiBwZXJmb3JtYW5jZSB0byBhbHdheXMgZXhlY3V0ZSBodWdlIHRvcC1sZXZlbFxuXHQgICAgICAgIC8vIGJsb2NrcyB0d2ljZVxuXHQgICAgICAgIGlmKCF0aGlzLmluQmxvY2spIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0KCcocGFyZW50VGVtcGxhdGUgPyBmdW5jdGlvbihlLCBjLCBmLCByLCBjYikgeyBjYihcIlwiKTsgfSA6ICcpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB0aGlzLmVtaXQoJ2NvbnRleHQuZ2V0QmxvY2soXCInICsgbm9kZS5uYW1lLnZhbHVlICsgJ1wiKScpO1xuXHQgICAgICAgIGlmKCF0aGlzLmluQmxvY2spIHtcblx0ICAgICAgICAgICAgdGhpcy5lbWl0KCcpJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJyhlbnYsIGNvbnRleHQsIGZyYW1lLCBydW50aW1lLCAnICsgdGhpcy5tYWtlQ2FsbGJhY2soaWQpKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKHRoaXMuYnVmZmVyICsgJyArPSAnICsgaWQgKyAnOycpO1xuXHQgICAgICAgIHRoaXMuYWRkU2NvcGVMZXZlbCgpO1xuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZVN1cGVyOiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHZhciBuYW1lID0gbm9kZS5ibG9ja05hbWUudmFsdWU7XG5cdCAgICAgICAgdmFyIGlkID0gbm9kZS5zeW1ib2wudmFsdWU7XG5cblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdjb250ZXh0LmdldFN1cGVyKGVudiwgJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAnXCInICsgbmFtZSArICdcIiwgJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAnYl8nICsgbmFtZSArICcsICcgK1xuXHQgICAgICAgICAgICAgICAgICAgICAgJ2ZyYW1lLCBydW50aW1lLCAnK1xuXHQgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYWtlQ2FsbGJhY2soaWQpKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKGlkICsgJyA9IHJ1bnRpbWUubWFya1NhZmUoJyArIGlkICsgJyk7Jyk7XG5cdCAgICAgICAgdGhpcy5hZGRTY29wZUxldmVsKCk7XG5cdCAgICAgICAgZnJhbWUuc2V0KGlkLCBpZCk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlRXh0ZW5kczogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB2YXIgayA9IHRoaXMudG1waWQoKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdCgnZW52LmdldFRlbXBsYXRlKCcpO1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVFeHByZXNzaW9uKG5vZGUudGVtcGxhdGUsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCcsIHRydWUsICcrdGhpcy5fdGVtcGxhdGVOYW1lKCkrJywgZmFsc2UsICcgKyB0aGlzLm1ha2VDYWxsYmFjaygnX3BhcmVudFRlbXBsYXRlJykpO1xuXG5cdCAgICAgICAgLy8gZXh0ZW5kcyBpcyBhIGR5bmFtaWMgdGFnIGFuZCBjYW4gb2NjdXIgd2l0aGluIGEgYmxvY2sgbGlrZVxuXHQgICAgICAgIC8vIGBpZmAsIHNvIGlmIHRoaXMgaGFwcGVucyB3ZSBuZWVkIHRvIGNhcHR1cmUgdGhlIHBhcmVudFxuXHQgICAgICAgIC8vIHRlbXBsYXRlIGluIHRoZSB0b3AtbGV2ZWwgc2NvcGVcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdwYXJlbnRUZW1wbGF0ZSA9IF9wYXJlbnRUZW1wbGF0ZScpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnZm9yKHZhciAnICsgayArICcgaW4gcGFyZW50VGVtcGxhdGUuYmxvY2tzKSB7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnY29udGV4dC5hZGRCbG9jaygnICsgayArXG5cdCAgICAgICAgICAgICAgICAgICAgICAnLCBwYXJlbnRUZW1wbGF0ZS5ibG9ja3NbJyArIGsgKyAnXSk7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfScpO1xuXG5cdCAgICAgICAgdGhpcy5hZGRTY29wZUxldmVsKCk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlSW5jbHVkZTogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB2YXIgaWQgPSB0aGlzLnRtcGlkKCk7XG5cdCAgICAgICAgdmFyIGlkMiA9IHRoaXMudG1waWQoKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3ZhciB0YXNrcyA9IFtdOycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3Rhc2tzLnB1c2goJyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnZnVuY3Rpb24oY2FsbGJhY2spIHsnKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJ2Vudi5nZXRUZW1wbGF0ZSgnKTtcblx0ICAgICAgICB0aGlzLl9jb21waWxlRXhwcmVzc2lvbihub2RlLnRlbXBsYXRlLCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnLCBmYWxzZSwgJyt0aGlzLl90ZW1wbGF0ZU5hbWUoKSsnLCAnICsgbm9kZS5pZ25vcmVNaXNzaW5nICsgJywgJyArIHRoaXMubWFrZUNhbGxiYWNrKGlkKSk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnY2FsbGJhY2sobnVsbCwnICsgaWQgKyAnKTt9KTsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd9KTsnKTtcblxuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3Rhc2tzLnB1c2goJyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnZnVuY3Rpb24odGVtcGxhdGUsIGNhbGxiYWNrKXsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd0ZW1wbGF0ZS5yZW5kZXIoJyArXG5cdCAgICAgICAgICAgICdjb250ZXh0LmdldFZhcmlhYmxlcygpLCBmcmFtZSwgJyArIHRoaXMubWFrZUNhbGxiYWNrKGlkMikpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ2NhbGxiYWNrKG51bGwsJyArIGlkMiArICcpO30pOycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ30pOycpO1xuXG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgndGFza3MucHVzaCgnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdmdW5jdGlvbihyZXN1bHQsIGNhbGxiYWNrKXsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKHRoaXMuYnVmZmVyICsgJyArPSByZXN1bHQ7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnY2FsbGJhY2sobnVsbCk7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfSk7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnZW52LndhdGVyZmFsbCh0YXNrcywgZnVuY3Rpb24oKXsnKTtcblx0ICAgICAgICB0aGlzLmFkZFNjb3BlTGV2ZWwoKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBpbGVUZW1wbGF0ZURhdGE6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdGhpcy5jb21waWxlTGl0ZXJhbChub2RlLCBmcmFtZSk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlQ2FwdHVyZTogZnVuY3Rpb24obm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICAvLyB3ZSBuZWVkIHRvIHRlbXBvcmFyaWx5IG92ZXJyaWRlIHRoZSBjdXJyZW50IGJ1ZmZlciBpZCBhcyAnb3V0cHV0J1xuXHQgICAgICAgIC8vIHNvIHRoZSBzZXQgYmxvY2sgd3JpdGVzIHRvIHRoZSBjYXB0dXJlIG91dHB1dCBpbnN0ZWFkIG9mIHRoZSBidWZmZXJcblx0ICAgICAgICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXI7XG5cdCAgICAgICAgdGhpcy5idWZmZXIgPSAnb3V0cHV0Jztcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCcoZnVuY3Rpb24oKSB7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgndmFyIG91dHB1dCA9IFwiXCI7Jyk7XG5cdCAgICAgICAgdGhpcy53aXRoU2NvcGVkU3ludGF4KGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUuYm9keSwgZnJhbWUpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ3JldHVybiBvdXRwdXQ7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfSkoKScpO1xuXHQgICAgICAgIC8vIGFuZCBvZiBjb3Vyc2UsIHJldmVydCBiYWNrIHRvIHRoZSBvbGQgYnVmZmVyIGlkXG5cdCAgICAgICAgdGhpcy5idWZmZXIgPSBidWZmZXI7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlT3V0cHV0OiBmdW5jdGlvbihub2RlLCBmcmFtZSkge1xuXHQgICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG5cdCAgICAgICAgZm9yKHZhciBpPTAsIGw9Y2hpbGRyZW4ubGVuZ3RoOyBpPGw7IGkrKykge1xuXHQgICAgICAgICAgICAvLyBUZW1wbGF0ZURhdGEgaXMgYSBzcGVjaWFsIGNhc2UgYmVjYXVzZSBpdCBpcyBuZXZlclxuXHQgICAgICAgICAgICAvLyBhdXRvZXNjYXBlZCwgc28gc2ltcGx5IG91dHB1dCBpdCBmb3Igb3B0aW1pemF0aW9uXG5cdCAgICAgICAgICAgIGlmKGNoaWxkcmVuW2ldIGluc3RhbmNlb2Ygbm9kZXMuVGVtcGxhdGVEYXRhKSB7XG5cdCAgICAgICAgICAgICAgICBpZihjaGlsZHJlbltpXS52YWx1ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLmJ1ZmZlciArICcgKz0gJyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21waWxlTGl0ZXJhbChjaGlsZHJlbltpXSwgZnJhbWUpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdExpbmUoJzsnKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLmJ1ZmZlciArICcgKz0gcnVudGltZS5zdXBwcmVzc1ZhbHVlKCcpO1xuXHQgICAgICAgICAgICAgICAgaWYodGhpcy50aHJvd09uVW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdydW50aW1lLmVuc3VyZURlZmluZWQoJyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbXBpbGUoY2hpbGRyZW5baV0sIGZyYW1lKTtcblx0ICAgICAgICAgICAgICAgIGlmKHRoaXMudGhyb3dPblVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnLCcgKyBub2RlLmxpbmVubyArICcsJyArIG5vZGUuY29sbm8gKyAnKScpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCcsIGVudi5vcHRzLmF1dG9lc2NhcGUpO1xcbicpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgY29tcGlsZVJvb3Q6IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgaWYoZnJhbWUpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdjb21waWxlUm9vdDogcm9vdCBub2RlIGNhblxcJ3QgaGF2ZSBmcmFtZScpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGZyYW1lID0gbmV3IEZyYW1lKCk7XG5cblx0ICAgICAgICB0aGlzLmVtaXRGdW5jQmVnaW4oJ3Jvb3QnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgcGFyZW50VGVtcGxhdGUgPSBudWxsOycpO1xuXHQgICAgICAgIHRoaXMuX2NvbXBpbGVDaGlsZHJlbihub2RlLCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnaWYocGFyZW50VGVtcGxhdGUpIHsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdwYXJlbnRUZW1wbGF0ZS5yb290UmVuZGVyRnVuYyhlbnYsIGNvbnRleHQsIGZyYW1lLCBydW50aW1lLCBjYik7Jyk7XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgnfSBlbHNlIHsnKTtcblx0ICAgICAgICB0aGlzLmVtaXRMaW5lKCdjYihudWxsLCAnICsgdGhpcy5idWZmZXIgKycpOycpO1xuXHQgICAgICAgIHRoaXMuZW1pdExpbmUoJ30nKTtcblx0ICAgICAgICB0aGlzLmVtaXRGdW5jRW5kKHRydWUpO1xuXG5cdCAgICAgICAgdGhpcy5pbkJsb2NrID0gdHJ1ZTtcblxuXHQgICAgICAgIHZhciBibG9ja05hbWVzID0gW107XG5cblx0ICAgICAgICB2YXIgaSwgbmFtZSwgYmxvY2ssIGJsb2NrcyA9IG5vZGUuZmluZEFsbChub2Rlcy5CbG9jayk7XG5cdCAgICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tpXTtcblx0ICAgICAgICAgICAgbmFtZSA9IGJsb2NrLm5hbWUudmFsdWU7XG5cblx0ICAgICAgICAgICAgaWYgKGJsb2NrTmFtZXMuaW5kZXhPZihuYW1lKSAhPT0gLTEpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmxvY2sgXCInICsgbmFtZSArICdcIiBkZWZpbmVkIG1vcmUgdGhhbiBvbmNlLicpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGJsb2NrTmFtZXMucHVzaChuYW1lKTtcblxuXHQgICAgICAgICAgICB0aGlzLmVtaXRGdW5jQmVnaW4oJ2JfJyArIG5hbWUpO1xuXG5cdCAgICAgICAgICAgIHZhciB0bXBGcmFtZSA9IG5ldyBGcmFtZSgpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRMaW5lKCd2YXIgZnJhbWUgPSBmcmFtZS5wdXNoKHRydWUpOycpO1xuXHQgICAgICAgICAgICB0aGlzLmNvbXBpbGUoYmxvY2suYm9keSwgdG1wRnJhbWUpO1xuXHQgICAgICAgICAgICB0aGlzLmVtaXRGdW5jRW5kKCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgncmV0dXJuIHsnKTtcblx0ICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2ldO1xuXHQgICAgICAgICAgICBuYW1lID0gJ2JfJyArIGJsb2NrLm5hbWUudmFsdWU7XG5cdCAgICAgICAgICAgIHRoaXMuZW1pdExpbmUobmFtZSArICc6ICcgKyBuYW1lICsgJywnKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgdGhpcy5lbWl0TGluZSgncm9vdDogcm9vdFxcbn07Jyk7XG5cdCAgICB9LFxuXG5cdCAgICBjb21waWxlOiBmdW5jdGlvbiAobm9kZSwgZnJhbWUpIHtcblx0ICAgICAgICB2YXIgX2NvbXBpbGUgPSB0aGlzWydjb21waWxlJyArIG5vZGUudHlwZW5hbWVdO1xuXHQgICAgICAgIGlmKF9jb21waWxlKSB7XG5cdCAgICAgICAgICAgIF9jb21waWxlLmNhbGwodGhpcywgbm9kZSwgZnJhbWUpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdjb21waWxlOiBDYW5ub3QgY29tcGlsZSBub2RlOiAnICsgbm9kZS50eXBlbmFtZSxcblx0ICAgICAgICAgICAgICAgICAgICAgIG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgZ2V0Q29kZTogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuY29kZWJ1Zi5qb2luKCcnKTtcblx0ICAgIH1cblx0fSk7XG5cblx0Ly8gdmFyIGMgPSBuZXcgQ29tcGlsZXIoKTtcblx0Ly8gdmFyIHNyYyA9ICdoZWxsbyB7JSBmaWx0ZXIgdGl0bGUgJX0nICtcblx0Ly8gICAgICdIZWxsbyBtYWRhbSBob3cgYXJlIHlvdScgK1xuXHQvLyAgICAgJ3slIGVuZGZpbHRlciAlfSdcblx0Ly8gdmFyIGFzdCA9IHRyYW5zZm9ybWVyLnRyYW5zZm9ybShwYXJzZXIucGFyc2Uoc3JjKSk7XG5cdC8vIG5vZGVzLnByaW50Tm9kZXMoYXN0KTtcblx0Ly8gYy5jb21waWxlKGFzdCk7XG5cdC8vIHZhciB0bXBsID0gYy5nZXRDb2RlKCk7XG5cdC8vIGNvbnNvbGUubG9nKHRtcGwpO1xuXG5cdG1vZHVsZS5leHBvcnRzID0ge1xuXHQgICAgY29tcGlsZTogZnVuY3Rpb24oc3JjLCBhc3luY0ZpbHRlcnMsIGV4dGVuc2lvbnMsIG5hbWUsIG9wdHMpIHtcblx0ICAgICAgICB2YXIgYyA9IG5ldyBDb21waWxlcihuYW1lLCBvcHRzLnRocm93T25VbmRlZmluZWQpO1xuXG5cdCAgICAgICAgLy8gUnVuIHRoZSBleHRlbnNpb24gcHJlcHJvY2Vzc29ycyBhZ2FpbnN0IHRoZSBzb3VyY2UuXG5cdCAgICAgICAgaWYoZXh0ZW5zaW9ucyAmJiBleHRlbnNpb25zLmxlbmd0aCkge1xuXHQgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxleHRlbnNpb25zLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICBpZigncHJlcHJvY2VzcycgaW4gZXh0ZW5zaW9uc1tpXSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHNyYyA9IGV4dGVuc2lvbnNbaV0ucHJlcHJvY2VzcyhzcmMsIG5hbWUpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgYy5jb21waWxlKHRyYW5zZm9ybWVyLnRyYW5zZm9ybShcblx0ICAgICAgICAgICAgcGFyc2VyLnBhcnNlKHNyYyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnMsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzKSxcblx0ICAgICAgICAgICAgYXN5bmNGaWx0ZXJzLFxuXHQgICAgICAgICAgICBuYW1lXG5cdCAgICAgICAgKSk7XG5cdCAgICAgICAgcmV0dXJuIGMuZ2V0Q29kZSgpO1xuXHQgICAgfSxcblxuXHQgICAgQ29tcGlsZXI6IENvbXBpbGVyXG5cdH07XG5cblxuLyoqKi8gfSksXG4vKiA4ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBsZXhlciA9IF9fd2VicGFja19yZXF1aXJlX18oOSk7XG5cdHZhciBub2RlcyA9IF9fd2VicGFja19yZXF1aXJlX18oMTApO1xuXHQvLyBqc2hpbnQgLVcwNzlcblx0dmFyIE9iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cdHZhciBsaWIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXG5cdHZhciBQYXJzZXIgPSBPYmplY3QuZXh0ZW5kKHtcblx0ICAgIGluaXQ6IGZ1bmN0aW9uICh0b2tlbnMpIHtcblx0ICAgICAgICB0aGlzLnRva2VucyA9IHRva2Vucztcblx0ICAgICAgICB0aGlzLnBlZWtlZCA9IG51bGw7XG5cdCAgICAgICAgdGhpcy5icmVha09uQmxvY2tzID0gbnVsbDtcblx0ICAgICAgICB0aGlzLmRyb3BMZWFkaW5nV2hpdGVzcGFjZSA9IGZhbHNlO1xuXG5cdCAgICAgICAgdGhpcy5leHRlbnNpb25zID0gW107XG5cdCAgICB9LFxuXG5cdCAgICBuZXh0VG9rZW46IGZ1bmN0aW9uICh3aXRoV2hpdGVzcGFjZSkge1xuXHQgICAgICAgIHZhciB0b2s7XG5cblx0ICAgICAgICBpZih0aGlzLnBlZWtlZCkge1xuXHQgICAgICAgICAgICBpZighd2l0aFdoaXRlc3BhY2UgJiYgdGhpcy5wZWVrZWQudHlwZSA9PT0gbGV4ZXIuVE9LRU5fV0hJVEVTUEFDRSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5wZWVrZWQgPSBudWxsO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgdG9rID0gdGhpcy5wZWVrZWQ7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnBlZWtlZCA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdG9rO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdG9rID0gdGhpcy50b2tlbnMubmV4dFRva2VuKCk7XG5cblx0ICAgICAgICBpZighd2l0aFdoaXRlc3BhY2UpIHtcblx0ICAgICAgICAgICAgd2hpbGUodG9rICYmIHRvay50eXBlID09PSBsZXhlci5UT0tFTl9XSElURVNQQUNFKSB7XG5cdCAgICAgICAgICAgICAgICB0b2sgPSB0aGlzLnRva2Vucy5uZXh0VG9rZW4oKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiB0b2s7XG5cdCAgICB9LFxuXG5cdCAgICBwZWVrVG9rZW46IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICB0aGlzLnBlZWtlZCA9IHRoaXMucGVla2VkIHx8IHRoaXMubmV4dFRva2VuKCk7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMucGVla2VkO1xuXHQgICAgfSxcblxuXHQgICAgcHVzaFRva2VuOiBmdW5jdGlvbih0b2spIHtcblx0ICAgICAgICBpZih0aGlzLnBlZWtlZCkge1xuXHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3B1c2hUb2tlbjogY2FuIG9ubHkgcHVzaCBvbmUgdG9rZW4gb24gYmV0d2VlbiByZWFkcycpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB0aGlzLnBlZWtlZCA9IHRvaztcblx0ICAgIH0sXG5cblx0ICAgIGZhaWw6IGZ1bmN0aW9uIChtc2csIGxpbmVubywgY29sbm8pIHtcblx0ICAgICAgICBpZigobGluZW5vID09PSB1bmRlZmluZWQgfHwgY29sbm8gPT09IHVuZGVmaW5lZCkgJiYgdGhpcy5wZWVrVG9rZW4oKSkge1xuXHQgICAgICAgICAgICB2YXIgdG9rID0gdGhpcy5wZWVrVG9rZW4oKTtcblx0ICAgICAgICAgICAgbGluZW5vID0gdG9rLmxpbmVubztcblx0ICAgICAgICAgICAgY29sbm8gPSB0b2suY29sbm87XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmIChsaW5lbm8gIT09IHVuZGVmaW5lZCkgbGluZW5vICs9IDE7XG5cdCAgICAgICAgaWYgKGNvbG5vICE9PSB1bmRlZmluZWQpIGNvbG5vICs9IDE7XG5cblx0ICAgICAgICB0aHJvdyBuZXcgbGliLlRlbXBsYXRlRXJyb3IobXNnLCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgIH0sXG5cblx0ICAgIHNraXA6IGZ1bmN0aW9uKHR5cGUpIHtcblx0ICAgICAgICB2YXIgdG9rID0gdGhpcy5uZXh0VG9rZW4oKTtcblx0ICAgICAgICBpZighdG9rIHx8IHRvay50eXBlICE9PSB0eXBlKSB7XG5cdCAgICAgICAgICAgIHRoaXMucHVzaFRva2VuKHRvayk7XG5cdCAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9LFxuXG5cdCAgICBleHBlY3Q6IGZ1bmN0aW9uKHR5cGUpIHtcblx0ICAgICAgICB2YXIgdG9rID0gdGhpcy5uZXh0VG9rZW4oKTtcblx0ICAgICAgICBpZih0b2sudHlwZSAhPT0gdHlwZSkge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ2V4cGVjdGVkICcgKyB0eXBlICsgJywgZ290ICcgKyB0b2sudHlwZSxcblx0ICAgICAgICAgICAgICAgICAgICAgIHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gdG9rO1xuXHQgICAgfSxcblxuXHQgICAgc2tpcFZhbHVlOiBmdW5jdGlvbih0eXBlLCB2YWwpIHtcblx0ICAgICAgICB2YXIgdG9rID0gdGhpcy5uZXh0VG9rZW4oKTtcblx0ICAgICAgICBpZighdG9rIHx8IHRvay50eXBlICE9PSB0eXBlIHx8IHRvay52YWx1ZSAhPT0gdmFsKSB7XG5cdCAgICAgICAgICAgIHRoaXMucHVzaFRva2VuKHRvayk7XG5cdCAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9LFxuXG5cdCAgICBza2lwU3ltYm9sOiBmdW5jdGlvbih2YWwpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5za2lwVmFsdWUobGV4ZXIuVE9LRU5fU1lNQk9MLCB2YWwpO1xuXHQgICAgfSxcblxuXHQgICAgYWR2YW5jZUFmdGVyQmxvY2tFbmQ6IGZ1bmN0aW9uKG5hbWUpIHtcblx0ICAgICAgICB2YXIgdG9rO1xuXHQgICAgICAgIGlmKCFuYW1lKSB7XG5cdCAgICAgICAgICAgIHRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cblx0ICAgICAgICAgICAgaWYoIXRvaykge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5mYWlsKCd1bmV4cGVjdGVkIGVuZCBvZiBmaWxlJyk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBpZih0b2sudHlwZSAhPT0gbGV4ZXIuVE9LRU5fU1lNQk9MKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ2FkdmFuY2VBZnRlckJsb2NrRW5kOiBleHBlY3RlZCBzeW1ib2wgdG9rZW4gb3IgJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgJ2V4cGxpY2l0IG5hbWUgdG8gYmUgcGFzc2VkJyk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBuYW1lID0gdGhpcy5uZXh0VG9rZW4oKS52YWx1ZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0b2sgPSB0aGlzLm5leHRUb2tlbigpO1xuXG5cdCAgICAgICAgaWYodG9rICYmIHRvay50eXBlID09PSBsZXhlci5UT0tFTl9CTE9DS19FTkQpIHtcblx0ICAgICAgICAgICAgaWYodG9rLnZhbHVlLmNoYXJBdCgwKSA9PT0gJy0nKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmRyb3BMZWFkaW5nV2hpdGVzcGFjZSA9IHRydWU7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgnZXhwZWN0ZWQgYmxvY2sgZW5kIGluICcgKyBuYW1lICsgJyBzdGF0ZW1lbnQnKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gdG9rO1xuXHQgICAgfSxcblxuXHQgICAgYWR2YW5jZUFmdGVyVmFyaWFibGVFbmQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciB0b2sgPSB0aGlzLm5leHRUb2tlbigpO1xuXG5cdCAgICAgICAgaWYodG9rICYmIHRvay50eXBlID09PSBsZXhlci5UT0tFTl9WQVJJQUJMRV9FTkQpIHtcblx0ICAgICAgICAgICAgdGhpcy5kcm9wTGVhZGluZ1doaXRlc3BhY2UgPSB0b2sudmFsdWUuY2hhckF0KFxuXHQgICAgICAgICAgICAgICAgdG9rLnZhbHVlLmxlbmd0aCAtIHRoaXMudG9rZW5zLnRhZ3MuVkFSSUFCTEVfRU5ELmxlbmd0aCAtIDFcblx0ICAgICAgICAgICAgKSA9PT0gJy0nO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHRoaXMucHVzaFRva2VuKHRvayk7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgnZXhwZWN0ZWQgdmFyaWFibGUgZW5kJyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgcGFyc2VGb3I6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBmb3JUb2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIHZhciBub2RlO1xuXHQgICAgICAgIHZhciBlbmRCbG9jaztcblxuXHQgICAgICAgIGlmKHRoaXMuc2tpcFN5bWJvbCgnZm9yJykpIHtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5Gb3IoZm9yVG9rLmxpbmVubywgZm9yVG9rLmNvbG5vKTtcblx0ICAgICAgICAgICAgZW5kQmxvY2sgPSAnZW5kZm9yJztcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZih0aGlzLnNraXBTeW1ib2woJ2FzeW5jRWFjaCcpKSB7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuQXN5bmNFYWNoKGZvclRvay5saW5lbm8sIGZvclRvay5jb2xubyk7XG5cdCAgICAgICAgICAgIGVuZEJsb2NrID0gJ2VuZGVhY2gnO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKHRoaXMuc2tpcFN5bWJvbCgnYXN5bmNBbGwnKSkge1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLkFzeW5jQWxsKGZvclRvay5saW5lbm8sIGZvclRvay5jb2xubyk7XG5cdCAgICAgICAgICAgIGVuZEJsb2NrID0gJ2VuZGFsbCc7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlRm9yOiBleHBlY3RlZCBmb3J7QXN5bmN9JywgZm9yVG9rLmxpbmVubywgZm9yVG9rLmNvbG5vKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBub2RlLm5hbWUgPSB0aGlzLnBhcnNlUHJpbWFyeSgpO1xuXG5cdCAgICAgICAgaWYoIShub2RlLm5hbWUgaW5zdGFuY2VvZiBub2Rlcy5TeW1ib2wpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VGb3I6IHZhcmlhYmxlIG5hbWUgZXhwZWN0ZWQgZm9yIGxvb3AnKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgdHlwZSA9IHRoaXMucGVla1Rva2VuKCkudHlwZTtcblx0ICAgICAgICBpZih0eXBlID09PSBsZXhlci5UT0tFTl9DT01NQSkge1xuXHQgICAgICAgICAgICAvLyBrZXkvdmFsdWUgaXRlcmF0aW9uXG5cdCAgICAgICAgICAgIHZhciBrZXkgPSBub2RlLm5hbWU7XG5cdCAgICAgICAgICAgIG5vZGUubmFtZSA9IG5ldyBub2Rlcy5BcnJheShrZXkubGluZW5vLCBrZXkuY29sbm8pO1xuXHQgICAgICAgICAgICBub2RlLm5hbWUuYWRkQ2hpbGQoa2V5KTtcblxuXHQgICAgICAgICAgICB3aGlsZSh0aGlzLnNraXAobGV4ZXIuVE9LRU5fQ09NTUEpKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgcHJpbSA9IHRoaXMucGFyc2VQcmltYXJ5KCk7XG5cdCAgICAgICAgICAgICAgICBub2RlLm5hbWUuYWRkQ2hpbGQocHJpbSk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZighdGhpcy5za2lwU3ltYm9sKCdpbicpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VGb3I6IGV4cGVjdGVkIFwiaW5cIiBrZXl3b3JkIGZvciBsb29wJyxcblx0ICAgICAgICAgICAgICAgICAgICAgIGZvclRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICBmb3JUb2suY29sbm8pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIG5vZGUuYXJyID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcblx0ICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKGZvclRvay52YWx1ZSk7XG5cblx0ICAgICAgICBub2RlLmJvZHkgPSB0aGlzLnBhcnNlVW50aWxCbG9ja3MoZW5kQmxvY2ssICdlbHNlJyk7XG5cblx0ICAgICAgICBpZih0aGlzLnNraXBTeW1ib2woJ2Vsc2UnKSkge1xuXHQgICAgICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKCdlbHNlJyk7XG5cdCAgICAgICAgICAgIG5vZGUuZWxzZV8gPSB0aGlzLnBhcnNlVW50aWxCbG9ja3MoZW5kQmxvY2spO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQoKTtcblxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VNYWNybzogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIG1hY3JvVG9rID0gdGhpcy5wZWVrVG9rZW4oKTtcblx0ICAgICAgICBpZighdGhpcy5za2lwU3ltYm9sKCdtYWNybycpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgnZXhwZWN0ZWQgbWFjcm8nKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgbmFtZSA9IHRoaXMucGFyc2VQcmltYXJ5KHRydWUpO1xuXHQgICAgICAgIHZhciBhcmdzID0gdGhpcy5wYXJzZVNpZ25hdHVyZSgpO1xuXHQgICAgICAgIHZhciBub2RlID0gbmV3IG5vZGVzLk1hY3JvKG1hY3JvVG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWNyb1Rvay5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MpO1xuXG5cdCAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZChtYWNyb1Rvay52YWx1ZSk7XG5cdCAgICAgICAgbm9kZS5ib2R5ID0gdGhpcy5wYXJzZVVudGlsQmxvY2tzKCdlbmRtYWNybycpO1xuXHQgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQoKTtcblxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VDYWxsOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICAvLyBhIGNhbGwgYmxvY2sgaXMgcGFyc2VkIGFzIGEgbm9ybWFsIEZ1bkNhbGwsIGJ1dCB3aXRoIGFuIGFkZGVkXG5cdCAgICAgICAgLy8gJ2NhbGxlcicga3dhcmcgd2hpY2ggaXMgYSBDYWxsZXIgbm9kZS5cblx0ICAgICAgICB2YXIgY2FsbFRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgaWYoIXRoaXMuc2tpcFN5bWJvbCgnY2FsbCcpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgnZXhwZWN0ZWQgY2FsbCcpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBjYWxsZXJBcmdzID0gdGhpcy5wYXJzZVNpZ25hdHVyZSh0cnVlKSB8fCBuZXcgbm9kZXMuTm9kZUxpc3QoKTtcblx0ICAgICAgICB2YXIgbWFjcm9DYWxsID0gdGhpcy5wYXJzZVByaW1hcnkoKTtcblxuXHQgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQoY2FsbFRvay52YWx1ZSk7XG5cdCAgICAgICAgdmFyIGJvZHkgPSB0aGlzLnBhcnNlVW50aWxCbG9ja3MoJ2VuZGNhbGwnKTtcblx0ICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKCk7XG5cblx0ICAgICAgICB2YXIgY2FsbGVyTmFtZSA9IG5ldyBub2Rlcy5TeW1ib2woY2FsbFRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxUb2suY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYWxsZXInKTtcblx0ICAgICAgICB2YXIgY2FsbGVyTm9kZSA9IG5ldyBub2Rlcy5DYWxsZXIoY2FsbFRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxUb2suY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxlck5hbWUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxlckFyZ3MsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkpO1xuXG5cdCAgICAgICAgLy8gYWRkIHRoZSBhZGRpdGlvbmFsIGNhbGxlciBrd2FyZywgYWRkaW5nIGt3YXJncyBpZiBuZWNlc3Nhcnlcblx0ICAgICAgICB2YXIgYXJncyA9IG1hY3JvQ2FsbC5hcmdzLmNoaWxkcmVuO1xuXHQgICAgICAgIGlmICghKGFyZ3NbYXJncy5sZW5ndGgtMV0gaW5zdGFuY2VvZiBub2Rlcy5LZXl3b3JkQXJncykpIHtcblx0ICAgICAgICAgIGFyZ3MucHVzaChuZXcgbm9kZXMuS2V5d29yZEFyZ3MoKSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHZhciBrd2FyZ3MgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG5cdCAgICAgICAga3dhcmdzLmFkZENoaWxkKG5ldyBub2Rlcy5QYWlyKGNhbGxUb2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsVG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsZXJOYW1lLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsZXJOb2RlKSk7XG5cblx0ICAgICAgICByZXR1cm4gbmV3IG5vZGVzLk91dHB1dChjYWxsVG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsVG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttYWNyb0NhbGxdKTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlV2l0aENvbnRleHQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciB0b2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXG5cdCAgICAgICAgdmFyIHdpdGhDb250ZXh0ID0gbnVsbDtcblxuXHQgICAgICAgIGlmKHRoaXMuc2tpcFN5bWJvbCgnd2l0aCcpKSB7XG5cdCAgICAgICAgICAgIHdpdGhDb250ZXh0ID0gdHJ1ZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZih0aGlzLnNraXBTeW1ib2woJ3dpdGhvdXQnKSkge1xuXHQgICAgICAgICAgICB3aXRoQ29udGV4dCA9IGZhbHNlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKHdpdGhDb250ZXh0ICE9PSBudWxsKSB7XG5cdCAgICAgICAgICAgIGlmKCF0aGlzLnNraXBTeW1ib2woJ2NvbnRleHQnKSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUZyb206IGV4cGVjdGVkIGNvbnRleHQgYWZ0ZXIgd2l0aC93aXRob3V0Jyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHdpdGhDb250ZXh0O1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VJbXBvcnQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBpbXBvcnRUb2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIGlmKCF0aGlzLnNraXBTeW1ib2woJ2ltcG9ydCcpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VJbXBvcnQ6IGV4cGVjdGVkIGltcG9ydCcsXG5cdCAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRUb2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0VG9rLmNvbG5vKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXG5cdCAgICAgICAgaWYoIXRoaXMuc2tpcFN5bWJvbCgnYXMnKSkge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlSW1wb3J0OiBleHBlY3RlZCBcImFzXCIga2V5d29yZCcsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRUb2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0VG9rLmNvbG5vKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcblxuXHQgICAgICAgIHZhciB3aXRoQ29udGV4dCA9IHRoaXMucGFyc2VXaXRoQ29udGV4dCgpO1xuXG5cdCAgICAgICAgdmFyIG5vZGUgPSBuZXcgbm9kZXMuSW1wb3J0KGltcG9ydFRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydFRvay5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aENvbnRleHQpO1xuXG5cdCAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZChpbXBvcnRUb2sudmFsdWUpO1xuXG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUZyb206IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBmcm9tVG9rID0gdGhpcy5wZWVrVG9rZW4oKTtcblx0ICAgICAgICBpZighdGhpcy5za2lwU3ltYm9sKCdmcm9tJykpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUZyb206IGV4cGVjdGVkIGZyb20nKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXG5cdCAgICAgICAgaWYoIXRoaXMuc2tpcFN5bWJvbCgnaW1wb3J0JykpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUZyb206IGV4cGVjdGVkIGltcG9ydCcsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tVG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21Ub2suY29sbm8pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBuYW1lcyA9IG5ldyBub2Rlcy5Ob2RlTGlzdCgpLFxuXHQgICAgICAgICAgICB3aXRoQ29udGV4dDtcblxuXHQgICAgICAgIHdoaWxlKDEpIHtcblx0ICAgICAgICAgICAgdmFyIG5leHRUb2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgICAgICBpZihuZXh0VG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX0JMT0NLX0VORCkge1xuXHQgICAgICAgICAgICAgICAgaWYoIW5hbWVzLmNoaWxkcmVuLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VGcm9tOiBFeHBlY3RlZCBhdCBsZWFzdCBvbmUgaW1wb3J0IG5hbWUnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tVG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbVRvay5jb2xubyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlIGFyZSBtYW51YWxseSBhZHZhbmNpbmcgcGFzdCB0aGUgYmxvY2sgZW5kLFxuXHQgICAgICAgICAgICAgICAgLy8gbmVlZCB0byBrZWVwIHRyYWNrIG9mIHdoaXRlc3BhY2UgY29udHJvbCAobm9ybWFsbHlcblx0ICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgZG9uZSBpbiBgYWR2YW5jZUFmdGVyQmxvY2tFbmRgXG5cdCAgICAgICAgICAgICAgICBpZihuZXh0VG9rLnZhbHVlLmNoYXJBdCgwKSA9PT0gJy0nKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wTGVhZGluZ1doaXRlc3BhY2UgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBpZihuYW1lcy5jaGlsZHJlbi5sZW5ndGggPiAwICYmICF0aGlzLnNraXAobGV4ZXIuVE9LRU5fQ09NTUEpKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlRnJvbTogZXhwZWN0ZWQgY29tbWEnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21Ub2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb21Ub2suY29sbm8pO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLnBhcnNlUHJpbWFyeSgpO1xuXHQgICAgICAgICAgICBpZihuYW1lLnZhbHVlLmNoYXJBdCgwKSA9PT0gJ18nKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlRnJvbTogbmFtZXMgc3RhcnRpbmcgd2l0aCBhbiB1bmRlcnNjb3JlICcgK1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICdjYW5ub3QgYmUgaW1wb3J0ZWQnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUuY29sbm8pO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgaWYodGhpcy5za2lwU3ltYm9sKCdhcycpKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgYWxpYXMgPSB0aGlzLnBhcnNlUHJpbWFyeSgpO1xuXHQgICAgICAgICAgICAgICAgbmFtZXMuYWRkQ2hpbGQobmV3IG5vZGVzLlBhaXIobmFtZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWFzKSk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBuYW1lcy5hZGRDaGlsZChuYW1lKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHdpdGhDb250ZXh0ID0gdGhpcy5wYXJzZVdpdGhDb250ZXh0KCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIG5ldyBub2Rlcy5Gcm9tSW1wb3J0KGZyb21Ub2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tVG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXMsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhDb250ZXh0KTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlQmxvY2s6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciB0YWcgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIGlmKCF0aGlzLnNraXBTeW1ib2woJ2Jsb2NrJykpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUJsb2NrOiBleHBlY3RlZCBibG9jaycsIHRhZy5saW5lbm8sIHRhZy5jb2xubyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIG5vZGUgPSBuZXcgbm9kZXMuQmxvY2sodGFnLmxpbmVubywgdGFnLmNvbG5vKTtcblxuXHQgICAgICAgIG5vZGUubmFtZSA9IHRoaXMucGFyc2VQcmltYXJ5KCk7XG5cdCAgICAgICAgaWYoIShub2RlLm5hbWUgaW5zdGFuY2VvZiBub2Rlcy5TeW1ib2wpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VCbG9jazogdmFyaWFibGUgbmFtZSBleHBlY3RlZCcsXG5cdCAgICAgICAgICAgICAgICAgICAgICB0YWcubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgdGFnLmNvbG5vKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKHRhZy52YWx1ZSk7XG5cblx0ICAgICAgICBub2RlLmJvZHkgPSB0aGlzLnBhcnNlVW50aWxCbG9ja3MoJ2VuZGJsb2NrJyk7XG5cdCAgICAgICAgdGhpcy5za2lwU3ltYm9sKCdlbmRibG9jaycpO1xuXHQgICAgICAgIHRoaXMuc2tpcFN5bWJvbChub2RlLm5hbWUudmFsdWUpO1xuXG5cdCAgICAgICAgdmFyIHRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgaWYoIXRvaykge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlQmxvY2s6IGV4cGVjdGVkIGVuZGJsb2NrLCBnb3QgZW5kIG9mIGZpbGUnKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKHRvay52YWx1ZSk7XG5cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlRXh0ZW5kczogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHRhZ05hbWUgPSAnZXh0ZW5kcyc7XG5cdCAgICAgICAgdmFyIHRhZyA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgaWYoIXRoaXMuc2tpcFN5bWJvbCh0YWdOYW1lKSkge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlVGVtcGxhdGVSZWY6IGV4cGVjdGVkICcrIHRhZ05hbWUpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBub2RlID0gbmV3IG5vZGVzLkV4dGVuZHModGFnLmxpbmVubywgdGFnLmNvbG5vKTtcblx0ICAgICAgICBub2RlLnRlbXBsYXRlID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcblxuXHQgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQodGFnLnZhbHVlKTtcblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlSW5jbHVkZTogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHRhZ05hbWUgPSAnaW5jbHVkZSc7XG5cdCAgICAgICAgdmFyIHRhZyA9IHRoaXMucGVla1Rva2VuKCk7XG5cdCAgICAgICAgaWYoIXRoaXMuc2tpcFN5bWJvbCh0YWdOYW1lKSkge1xuXHQgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlSW5jbHVkZTogZXhwZWN0ZWQgJysgdGFnTmFtZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIG5vZGUgPSBuZXcgbm9kZXMuSW5jbHVkZSh0YWcubGluZW5vLCB0YWcuY29sbm8pO1xuXHQgICAgICAgIG5vZGUudGVtcGxhdGUgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXG5cdCAgICAgICAgaWYodGhpcy5za2lwU3ltYm9sKCdpZ25vcmUnKSAmJiB0aGlzLnNraXBTeW1ib2woJ21pc3NpbmcnKSkge1xuXHQgICAgICAgICAgICBub2RlLmlnbm9yZU1pc3NpbmcgPSB0cnVlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQodGFnLnZhbHVlKTtcblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlSWY6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciB0YWcgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIHZhciBub2RlO1xuXG5cdCAgICAgICAgaWYodGhpcy5za2lwU3ltYm9sKCdpZicpIHx8IHRoaXMuc2tpcFN5bWJvbCgnZWxpZicpIHx8IHRoaXMuc2tpcFN5bWJvbCgnZWxzZWlmJykpIHtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5JZih0YWcubGluZW5vLCB0YWcuY29sbm8pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKHRoaXMuc2tpcFN5bWJvbCgnaWZBc3luYycpKSB7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuSWZBc3luYyh0YWcubGluZW5vLCB0YWcuY29sbm8pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUlmOiBleHBlY3RlZCBpZiwgZWxpZiwgb3IgZWxzZWlmJyxcblx0ICAgICAgICAgICAgICAgICAgICAgIHRhZy5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICB0YWcuY29sbm8pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIG5vZGUuY29uZCA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG5cdCAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZCh0YWcudmFsdWUpO1xuXG5cdCAgICAgICAgbm9kZS5ib2R5ID0gdGhpcy5wYXJzZVVudGlsQmxvY2tzKCdlbGlmJywgJ2Vsc2VpZicsICdlbHNlJywgJ2VuZGlmJyk7XG5cdCAgICAgICAgdmFyIHRvayA9IHRoaXMucGVla1Rva2VuKCk7XG5cblx0ICAgICAgICBzd2l0Y2godG9rICYmIHRvay52YWx1ZSkge1xuXHQgICAgICAgIGNhc2UgJ2Vsc2VpZic6XG5cdCAgICAgICAgY2FzZSAnZWxpZic6XG5cdCAgICAgICAgICAgIG5vZGUuZWxzZV8gPSB0aGlzLnBhcnNlSWYoKTtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgY2FzZSAnZWxzZSc6XG5cdCAgICAgICAgICAgIHRoaXMuYWR2YW5jZUFmdGVyQmxvY2tFbmQoKTtcblx0ICAgICAgICAgICAgbm9kZS5lbHNlXyA9IHRoaXMucGFyc2VVbnRpbEJsb2NrcygnZW5kaWYnKTtcblx0ICAgICAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZCgpO1xuXHQgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICBjYXNlICdlbmRpZic6XG5cdCAgICAgICAgICAgIG5vZGUuZWxzZV8gPSBudWxsO1xuXHQgICAgICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKCk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIGRlZmF1bHQ6XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VJZjogZXhwZWN0ZWQgZWxpZiwgZWxzZSwgb3IgZW5kaWYsICcgK1xuXHQgICAgICAgICAgICAgICAgICAgICAgJ2dvdCBlbmQgb2YgZmlsZScpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VTZXQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciB0YWcgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIGlmKCF0aGlzLnNraXBTeW1ib2woJ3NldCcpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VTZXQ6IGV4cGVjdGVkIHNldCcsIHRhZy5saW5lbm8sIHRhZy5jb2xubyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIG5vZGUgPSBuZXcgbm9kZXMuU2V0KHRhZy5saW5lbm8sIHRhZy5jb2xubywgW10pO1xuXG5cdCAgICAgICAgdmFyIHRhcmdldDtcblx0ICAgICAgICB3aGlsZSgodGFyZ2V0ID0gdGhpcy5wYXJzZVByaW1hcnkoKSkpIHtcblx0ICAgICAgICAgICAgbm9kZS50YXJnZXRzLnB1c2godGFyZ2V0KTtcblxuXHQgICAgICAgICAgICBpZighdGhpcy5za2lwKGxleGVyLlRPS0VOX0NPTU1BKSkge1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZighdGhpcy5za2lwVmFsdWUobGV4ZXIuVE9LRU5fT1BFUkFUT1IsICc9JykpIHtcblx0ICAgICAgICAgICAgaWYgKCF0aGlzLnNraXAobGV4ZXIuVE9LRU5fQkxPQ0tfRU5EKSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZVNldDogZXhwZWN0ZWQgPSBvciBibG9jayBlbmQgaW4gc2V0IHRhZycsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICB0YWcuY29sbm8pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgbm9kZS5ib2R5ID0gbmV3IG5vZGVzLkNhcHR1cmUoXG5cdCAgICAgICAgICAgICAgICAgICAgdGFnLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICB0YWcuY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVVudGlsQmxvY2tzKCdlbmRzZXQnKVxuXHQgICAgICAgICAgICAgICAgKTtcblx0ICAgICAgICAgICAgICAgIG5vZGUudmFsdWUgPSBudWxsO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZCgpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICBub2RlLnZhbHVlID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcblx0ICAgICAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZCh0YWcudmFsdWUpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VTdGF0ZW1lbnQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICB2YXIgdG9rID0gdGhpcy5wZWVrVG9rZW4oKTtcblx0ICAgICAgICB2YXIgbm9kZTtcblxuXHQgICAgICAgIGlmKHRvay50eXBlICE9PSBsZXhlci5UT0tFTl9TWU1CT0wpIHtcblx0ICAgICAgICAgICAgdGhpcy5mYWlsKCd0YWcgbmFtZSBleHBlY3RlZCcsIHRvay5saW5lbm8sIHRvay5jb2xubyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYodGhpcy5icmVha09uQmxvY2tzICYmXG5cdCAgICAgICAgICAgbGliLmluZGV4T2YodGhpcy5icmVha09uQmxvY2tzLCB0b2sudmFsdWUpICE9PSAtMSkge1xuXHQgICAgICAgICAgICByZXR1cm4gbnVsbDtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzd2l0Y2godG9rLnZhbHVlKSB7XG5cdCAgICAgICAgY2FzZSAncmF3JzogcmV0dXJuIHRoaXMucGFyc2VSYXcoKTtcblx0ICAgICAgICBjYXNlICd2ZXJiYXRpbSc6IHJldHVybiB0aGlzLnBhcnNlUmF3KCd2ZXJiYXRpbScpO1xuXHQgICAgICAgIGNhc2UgJ2lmJzpcblx0ICAgICAgICBjYXNlICdpZkFzeW5jJzpcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VJZigpO1xuXHQgICAgICAgIGNhc2UgJ2Zvcic6XG5cdCAgICAgICAgY2FzZSAnYXN5bmNFYWNoJzpcblx0ICAgICAgICBjYXNlICdhc3luY0FsbCc6XG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRm9yKCk7XG5cdCAgICAgICAgY2FzZSAnYmxvY2snOiByZXR1cm4gdGhpcy5wYXJzZUJsb2NrKCk7XG5cdCAgICAgICAgY2FzZSAnZXh0ZW5kcyc6IHJldHVybiB0aGlzLnBhcnNlRXh0ZW5kcygpO1xuXHQgICAgICAgIGNhc2UgJ2luY2x1ZGUnOiByZXR1cm4gdGhpcy5wYXJzZUluY2x1ZGUoKTtcblx0ICAgICAgICBjYXNlICdzZXQnOiByZXR1cm4gdGhpcy5wYXJzZVNldCgpO1xuXHQgICAgICAgIGNhc2UgJ21hY3JvJzogcmV0dXJuIHRoaXMucGFyc2VNYWNybygpO1xuXHQgICAgICAgIGNhc2UgJ2NhbGwnOiByZXR1cm4gdGhpcy5wYXJzZUNhbGwoKTtcblx0ICAgICAgICBjYXNlICdpbXBvcnQnOiByZXR1cm4gdGhpcy5wYXJzZUltcG9ydCgpO1xuXHQgICAgICAgIGNhc2UgJ2Zyb20nOiByZXR1cm4gdGhpcy5wYXJzZUZyb20oKTtcblx0ICAgICAgICBjYXNlICdmaWx0ZXInOiByZXR1cm4gdGhpcy5wYXJzZUZpbHRlclN0YXRlbWVudCgpO1xuXHQgICAgICAgIGRlZmF1bHQ6XG5cdCAgICAgICAgICAgIGlmICh0aGlzLmV4dGVuc2lvbnMubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZXh0ZW5zaW9ucy5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBleHQgPSB0aGlzLmV4dGVuc2lvbnNbaV07XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGxpYi5pbmRleE9mKGV4dC50YWdzIHx8IFtdLCB0b2sudmFsdWUpICE9PSAtMSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXh0LnBhcnNlKHRoaXMsIG5vZGVzLCBsZXhlcik7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgndW5rbm93biBibG9jayB0YWc6ICcgKyB0b2sudmFsdWUsIHRvay5saW5lbm8sIHRvay5jb2xubyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZVJhdzogZnVuY3Rpb24odGFnTmFtZSkge1xuXHQgICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lIHx8ICdyYXcnO1xuXHQgICAgICAgIHZhciBlbmRUYWdOYW1lID0gJ2VuZCcgKyB0YWdOYW1lO1xuXHQgICAgICAgIC8vIExvb2sgZm9yIHVwY29taW5nIHJhdyBibG9ja3MgKGlnbm9yZSBhbGwgb3RoZXIga2luZHMgb2YgYmxvY2tzKVxuXHQgICAgICAgIHZhciByYXdCbG9ja1JlZ2V4ID0gbmV3IFJlZ0V4cCgnKFtcXFxcc1xcXFxTXSo/KXslXFxcXHMqKCcgKyB0YWdOYW1lICsgJ3wnICsgZW5kVGFnTmFtZSArICcpXFxcXHMqKD89JX0pJX0nKTtcblx0ICAgICAgICB2YXIgcmF3TGV2ZWwgPSAxO1xuXHQgICAgICAgIHZhciBzdHIgPSAnJztcblx0ICAgICAgICB2YXIgbWF0Y2hlcyA9IG51bGw7XG5cblx0ICAgICAgICAvLyBTa2lwIG9wZW5pbmcgcmF3IHRva2VuXG5cdCAgICAgICAgLy8gS2VlcCB0aGlzIHRva2VuIHRvIHRyYWNrIGxpbmUgYW5kIGNvbHVtbiBudW1iZXJzXG5cdCAgICAgICAgdmFyIGJlZ3VuID0gdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZCgpO1xuXG5cdCAgICAgICAgLy8gRXhpdCB3aGVuIHRoZXJlJ3Mgbm90aGluZyB0byBtYXRjaFxuXHQgICAgICAgIC8vIG9yIHdoZW4gd2UndmUgZm91bmQgdGhlIG1hdGNoaW5nIFwiZW5kcmF3XCIgYmxvY2tcblx0ICAgICAgICB3aGlsZSgobWF0Y2hlcyA9IHRoaXMudG9rZW5zLl9leHRyYWN0UmVnZXgocmF3QmxvY2tSZWdleCkpICYmIHJhd0xldmVsID4gMCkge1xuXHQgICAgICAgICAgICB2YXIgYWxsID0gbWF0Y2hlc1swXTtcblx0ICAgICAgICAgICAgdmFyIHByZSA9IG1hdGNoZXNbMV07XG5cdCAgICAgICAgICAgIHZhciBibG9ja05hbWUgPSBtYXRjaGVzWzJdO1xuXG5cdCAgICAgICAgICAgIC8vIEFkanVzdCByYXdsZXZlbFxuXHQgICAgICAgICAgICBpZihibG9ja05hbWUgPT09IHRhZ05hbWUpIHtcblx0ICAgICAgICAgICAgICAgIHJhd0xldmVsICs9IDE7XG5cdCAgICAgICAgICAgIH0gZWxzZSBpZihibG9ja05hbWUgPT09IGVuZFRhZ05hbWUpIHtcblx0ICAgICAgICAgICAgICAgIHJhd0xldmVsIC09IDE7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBBZGQgdG8gc3RyXG5cdCAgICAgICAgICAgIGlmKHJhd0xldmVsID09PSAwKSB7XG5cdCAgICAgICAgICAgICAgICAvLyBXZSB3YW50IHRvIGV4Y2x1ZGUgdGhlIGxhc3QgXCJlbmRyYXdcIlxuXHQgICAgICAgICAgICAgICAgc3RyICs9IHByZTtcblx0ICAgICAgICAgICAgICAgIC8vIE1vdmUgdG9rZW5pemVyIHRvIGJlZ2lubmluZyBvZiBlbmRyYXcgYmxvY2tcblx0ICAgICAgICAgICAgICAgIHRoaXMudG9rZW5zLmJhY2tOKGFsbC5sZW5ndGggLSBwcmUubGVuZ3RoKTtcblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHN0ciArPSBhbGw7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gbmV3IG5vZGVzLk91dHB1dChcblx0ICAgICAgICAgICAgYmVndW4ubGluZW5vLFxuXHQgICAgICAgICAgICBiZWd1bi5jb2xubyxcblx0ICAgICAgICAgICAgW25ldyBub2Rlcy5UZW1wbGF0ZURhdGEoYmVndW4ubGluZW5vLCBiZWd1bi5jb2xubywgc3RyKV1cblx0ICAgICAgICApO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VQb3N0Zml4OiBmdW5jdGlvbihub2RlKSB7XG5cdCAgICAgICAgdmFyIGxvb2t1cCwgdG9rID0gdGhpcy5wZWVrVG9rZW4oKTtcblxuXHQgICAgICAgIHdoaWxlKHRvaykge1xuXHQgICAgICAgICAgICBpZih0b2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fTEVGVF9QQVJFTikge1xuXHQgICAgICAgICAgICAgICAgLy8gRnVuY3Rpb24gY2FsbFxuXHQgICAgICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5GdW5DYWxsKHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVNpZ25hdHVyZSgpKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIGlmKHRvay50eXBlID09PSBsZXhlci5UT0tFTl9MRUZUX0JSQUNLRVQpIHtcblx0ICAgICAgICAgICAgICAgIC8vIFJlZmVyZW5jZVxuXHQgICAgICAgICAgICAgICAgbG9va3VwID0gdGhpcy5wYXJzZUFnZ3JlZ2F0ZSgpO1xuXHQgICAgICAgICAgICAgICAgaWYobG9va3VwLmNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ2ludmFsaWQgaW5kZXgnKTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgbm9kZSA9ICBuZXcgbm9kZXMuTG9va3VwVmFsKHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9va3VwLmNoaWxkcmVuWzBdKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIGlmKHRvay50eXBlID09PSBsZXhlci5UT0tFTl9PUEVSQVRPUiAmJiB0b2sudmFsdWUgPT09ICcuJykge1xuXHQgICAgICAgICAgICAgICAgLy8gUmVmZXJlbmNlXG5cdCAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xuXHQgICAgICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMubmV4dFRva2VuKCk7XG5cblx0ICAgICAgICAgICAgICAgIGlmKHZhbC50eXBlICE9PSBsZXhlci5UT0tFTl9TWU1CT0wpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ2V4cGVjdGVkIG5hbWUgYXMgbG9va3VwIHZhbHVlLCBnb3QgJyArIHZhbC52YWx1ZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsLmNvbG5vKTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gTWFrZSBhIGxpdGVyYWwgc3RyaW5nIGJlY2F1c2UgaXQncyBub3QgYSB2YXJpYWJsZVxuXHQgICAgICAgICAgICAgICAgLy8gcmVmZXJlbmNlXG5cdCAgICAgICAgICAgICAgICBsb29rdXAgPSBuZXcgbm9kZXMuTGl0ZXJhbCh2YWwubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbC5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwudmFsdWUpO1xuXG5cdCAgICAgICAgICAgICAgICBub2RlID0gIG5ldyBub2Rlcy5Mb29rdXBWYWwodG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29rdXApO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICB0b2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VFeHByZXNzaW9uOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGFyc2VJbmxpbmVJZigpO1xuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VJbmxpbmVJZjogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBhcnNlT3IoKTtcblx0ICAgICAgICBpZih0aGlzLnNraXBTeW1ib2woJ2lmJykpIHtcblx0ICAgICAgICAgICAgdmFyIGNvbmRfbm9kZSA9IHRoaXMucGFyc2VPcigpO1xuXHQgICAgICAgICAgICB2YXIgYm9keV9ub2RlID0gbm9kZTtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5JbmxpbmVJZihub2RlLmxpbmVubywgbm9kZS5jb2xubyk7XG5cdCAgICAgICAgICAgIG5vZGUuYm9keSA9IGJvZHlfbm9kZTtcblx0ICAgICAgICAgICAgbm9kZS5jb25kID0gY29uZF9ub2RlO1xuXHQgICAgICAgICAgICBpZih0aGlzLnNraXBTeW1ib2woJ2Vsc2UnKSkge1xuXHQgICAgICAgICAgICAgICAgbm9kZS5lbHNlXyA9IHRoaXMucGFyc2VPcigpO1xuXHQgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgbm9kZS5lbHNlXyA9IG51bGw7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlT3I6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5wYXJzZUFuZCgpO1xuXHQgICAgICAgIHdoaWxlKHRoaXMuc2tpcFN5bWJvbCgnb3InKSkge1xuXHQgICAgICAgICAgICB2YXIgbm9kZTIgPSB0aGlzLnBhcnNlQW5kKCk7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuT3Iobm9kZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUyKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUFuZDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBhcnNlTm90KCk7XG5cdCAgICAgICAgd2hpbGUodGhpcy5za2lwU3ltYm9sKCdhbmQnKSkge1xuXHQgICAgICAgICAgICB2YXIgbm9kZTIgPSB0aGlzLnBhcnNlTm90KCk7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuQW5kKG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlMik7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VOb3Q6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciB0b2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIGlmKHRoaXMuc2tpcFN5bWJvbCgnbm90JykpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIG5ldyBub2Rlcy5Ob3QodG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlTm90KCkpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUluKCk7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUluOiBmdW5jdGlvbigpIHtcblx0ICAgICAgdmFyIG5vZGUgPSB0aGlzLnBhcnNlQ29tcGFyZSgpO1xuXHQgICAgICB3aGlsZSgxKSB7XG5cdCAgICAgICAgLy8gY2hlY2sgaWYgdGhlIG5leHQgdG9rZW4gaXMgJ25vdCdcblx0ICAgICAgICB2YXIgdG9rID0gdGhpcy5uZXh0VG9rZW4oKTtcblx0ICAgICAgICBpZiAoIXRvaykgeyBicmVhazsgfVxuXHQgICAgICAgIHZhciBpbnZlcnQgPSB0b2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fU1lNQk9MICYmIHRvay52YWx1ZSA9PT0gJ25vdCc7XG5cdCAgICAgICAgLy8gaWYgaXQgd2Fzbid0ICdub3QnLCBwdXQgaXQgYmFja1xuXHQgICAgICAgIGlmICghaW52ZXJ0KSB7IHRoaXMucHVzaFRva2VuKHRvayk7IH1cblx0ICAgICAgICBpZiAodGhpcy5za2lwU3ltYm9sKCdpbicpKSB7XG5cdCAgICAgICAgICB2YXIgbm9kZTIgPSB0aGlzLnBhcnNlQ29tcGFyZSgpO1xuXHQgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5Jbihub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTIpO1xuXHQgICAgICAgICAgaWYgKGludmVydCkge1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLk5vdChub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgLy8gaWYgd2UnZCBmb3VuZCBhICdub3QnIGJ1dCB0aGlzIHdhc24ndCBhbiAnaW4nLCBwdXQgYmFjayB0aGUgJ25vdCdcblx0ICAgICAgICAgIGlmIChpbnZlcnQpIHsgdGhpcy5wdXNoVG9rZW4odG9rKTsgfVxuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VDb21wYXJlOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgY29tcGFyZU9wcyA9IFsnPT0nLCAnPT09JywgJyE9JywgJyE9PScsICc8JywgJz4nLCAnPD0nLCAnPj0nXTtcblx0ICAgICAgICB2YXIgZXhwciA9IHRoaXMucGFyc2VDb25jYXQoKTtcblx0ICAgICAgICB2YXIgb3BzID0gW107XG5cblx0ICAgICAgICB3aGlsZSgxKSB7XG5cdCAgICAgICAgICAgIHZhciB0b2sgPSB0aGlzLm5leHRUb2tlbigpO1xuXG5cdCAgICAgICAgICAgIGlmKCF0b2spIHtcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYobGliLmluZGV4T2YoY29tcGFyZU9wcywgdG9rLnZhbHVlKSAhPT0gLTEpIHtcblx0ICAgICAgICAgICAgICAgIG9wcy5wdXNoKG5ldyBub2Rlcy5Db21wYXJlT3BlcmFuZCh0b2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvay5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlQ29uY2F0KCksXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLnZhbHVlKSk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnB1c2hUb2tlbih0b2spO1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZihvcHMubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgbm9kZXMuQ29tcGFyZShvcHNbMF0ubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BzWzBdLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwcixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wcyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICByZXR1cm4gZXhwcjtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICAvLyBmaW5kcyB0aGUgJ34nIGZvciBzdHJpbmcgY29uY2F0ZW5hdGlvblxuXHQgICAgcGFyc2VDb25jYXQ6IGZ1bmN0aW9uKCl7XG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBhcnNlQWRkKCk7XG5cdCAgICAgICAgd2hpbGUodGhpcy5za2lwVmFsdWUobGV4ZXIuVE9LRU5fVElMREUsICd+JykpIHtcblx0ICAgICAgICAgICAgdmFyIG5vZGUyID0gdGhpcy5wYXJzZUFkZCgpO1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLkNvbmNhdChub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlQWRkOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGFyc2VTdWIoKTtcblx0ICAgICAgICB3aGlsZSh0aGlzLnNraXBWYWx1ZShsZXhlci5UT0tFTl9PUEVSQVRPUiwgJysnKSkge1xuXHQgICAgICAgICAgICB2YXIgbm9kZTIgPSB0aGlzLnBhcnNlU3ViKCk7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuQWRkKG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlMik7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VTdWI6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5wYXJzZU11bCgpO1xuXHQgICAgICAgIHdoaWxlKHRoaXMuc2tpcFZhbHVlKGxleGVyLlRPS0VOX09QRVJBVE9SLCAnLScpKSB7XG5cdCAgICAgICAgICAgIHZhciBub2RlMiA9IHRoaXMucGFyc2VNdWwoKTtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5TdWIobm9kZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUyKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZU11bDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBhcnNlRGl2KCk7XG5cdCAgICAgICAgd2hpbGUodGhpcy5za2lwVmFsdWUobGV4ZXIuVE9LRU5fT1BFUkFUT1IsICcqJykpIHtcblx0ICAgICAgICAgICAgdmFyIG5vZGUyID0gdGhpcy5wYXJzZURpdigpO1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLk11bChub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlRGl2OiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGFyc2VGbG9vckRpdigpO1xuXHQgICAgICAgIHdoaWxlKHRoaXMuc2tpcFZhbHVlKGxleGVyLlRPS0VOX09QRVJBVE9SLCAnLycpKSB7XG5cdCAgICAgICAgICAgIHZhciBub2RlMiA9IHRoaXMucGFyc2VGbG9vckRpdigpO1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLkRpdihub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlRmxvb3JEaXY6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5wYXJzZU1vZCgpO1xuXHQgICAgICAgIHdoaWxlKHRoaXMuc2tpcFZhbHVlKGxleGVyLlRPS0VOX09QRVJBVE9SLCAnLy8nKSkge1xuXHQgICAgICAgICAgICB2YXIgbm9kZTIgPSB0aGlzLnBhcnNlTW9kKCk7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuRmxvb3JEaXYobm9kZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUyKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZU1vZDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBhcnNlUG93KCk7XG5cdCAgICAgICAgd2hpbGUodGhpcy5za2lwVmFsdWUobGV4ZXIuVE9LRU5fT1BFUkFUT1IsICclJykpIHtcblx0ICAgICAgICAgICAgdmFyIG5vZGUyID0gdGhpcy5wYXJzZVBvdygpO1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLk1vZChub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlUG93OiBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGFyc2VVbmFyeSgpO1xuXHQgICAgICAgIHdoaWxlKHRoaXMuc2tpcFZhbHVlKGxleGVyLlRPS0VOX09QRVJBVE9SLCAnKionKSkge1xuXHQgICAgICAgICAgICB2YXIgbm9kZTIgPSB0aGlzLnBhcnNlVW5hcnkoKTtcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5Qb3cobm9kZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUyKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZVVuYXJ5OiBmdW5jdGlvbihub0ZpbHRlcnMpIHtcblx0ICAgICAgICB2YXIgdG9rID0gdGhpcy5wZWVrVG9rZW4oKTtcblx0ICAgICAgICB2YXIgbm9kZTtcblxuXHQgICAgICAgIGlmKHRoaXMuc2tpcFZhbHVlKGxleGVyLlRPS0VOX09QRVJBVE9SLCAnLScpKSB7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuTmVnKHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvay5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVVuYXJ5KHRydWUpKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZih0aGlzLnNraXBWYWx1ZShsZXhlci5UT0tFTl9PUEVSQVRPUiwgJysnKSkge1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLlBvcyh0b2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VVbmFyeSh0cnVlKSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICBub2RlID0gdGhpcy5wYXJzZVByaW1hcnkoKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZighbm9GaWx0ZXJzKSB7XG5cdCAgICAgICAgICAgIG5vZGUgPSB0aGlzLnBhcnNlRmlsdGVyKG5vZGUpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VQcmltYXJ5OiBmdW5jdGlvbiAobm9Qb3N0Zml4KSB7XG5cdCAgICAgICAgdmFyIHRvayA9IHRoaXMubmV4dFRva2VuKCk7XG5cdCAgICAgICAgdmFyIHZhbDtcblx0ICAgICAgICB2YXIgbm9kZSA9IG51bGw7XG5cblx0ICAgICAgICBpZighdG9rKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgnZXhwZWN0ZWQgZXhwcmVzc2lvbiwgZ290IGVuZCBvZiBmaWxlJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX1NUUklORykge1xuXHQgICAgICAgICAgICB2YWwgPSB0b2sudmFsdWU7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX0lOVCkge1xuXHQgICAgICAgICAgICB2YWwgPSBwYXJzZUludCh0b2sudmFsdWUsIDEwKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZih0b2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fRkxPQVQpIHtcblx0ICAgICAgICAgICAgdmFsID0gcGFyc2VGbG9hdCh0b2sudmFsdWUpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKHRvay50eXBlID09PSBsZXhlci5UT0tFTl9CT09MRUFOKSB7XG5cdCAgICAgICAgICAgIGlmKHRvay52YWx1ZSA9PT0gJ3RydWUnKSB7XG5cdCAgICAgICAgICAgICAgICB2YWwgPSB0cnVlO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYodG9rLnZhbHVlID09PSAnZmFsc2UnKSB7XG5cdCAgICAgICAgICAgICAgICB2YWwgPSBmYWxzZTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZmFpbCgnaW52YWxpZCBib29sZWFuOiAnICsgdG9rLnZhbHVlLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgIHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmNvbG5vKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKHRvay50eXBlID09PSBsZXhlci5UT0tFTl9OT05FKSB7XG5cdCAgICAgICAgICAgIHZhbCA9IG51bGw7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYgKHRvay50eXBlID09PSBsZXhlci5UT0tFTl9SRUdFWCkge1xuXHQgICAgICAgICAgICB2YWwgPSBuZXcgUmVnRXhwKHRvay52YWx1ZS5ib2R5LCB0b2sudmFsdWUuZmxhZ3MpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKHZhbCAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgIG5vZGUgPSBuZXcgbm9kZXMuTGl0ZXJhbCh0b2subGluZW5vLCB0b2suY29sbm8sIHZhbCk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX1NZTUJPTCkge1xuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLlN5bWJvbCh0b2subGluZW5vLCB0b2suY29sbm8sIHRvay52YWx1ZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAvLyBTZWUgaWYgaXQncyBhbiBhZ2dyZWdhdGUgdHlwZSwgd2UgbmVlZCB0byBwdXNoIHRoZVxuXHQgICAgICAgICAgICAvLyBjdXJyZW50IGRlbGltaXRlciB0b2tlbiBiYWNrIG9uXG5cdCAgICAgICAgICAgIHRoaXMucHVzaFRva2VuKHRvayk7XG5cdCAgICAgICAgICAgIG5vZGUgPSB0aGlzLnBhcnNlQWdncmVnYXRlKCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYoIW5vUG9zdGZpeCkge1xuXHQgICAgICAgICAgICBub2RlID0gdGhpcy5wYXJzZVBvc3RmaXgobm9kZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYobm9kZSkge1xuXHQgICAgICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgndW5leHBlY3RlZCB0b2tlbjogJyArIHRvay52YWx1ZSxcblx0ICAgICAgICAgICAgICAgICAgICAgIHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8pO1xuXHQgICAgICAgIH1cblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlRmlsdGVyTmFtZTogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgdmFyIHRvayA9IHRoaXMuZXhwZWN0KGxleGVyLlRPS0VOX1NZTUJPTCk7XG5cdCAgICAgICAgdmFyIG5hbWUgPSB0b2sudmFsdWU7XG5cblx0ICAgICAgICB3aGlsZSh0aGlzLnNraXBWYWx1ZShsZXhlci5UT0tFTl9PUEVSQVRPUiwgJy4nKSkge1xuXHQgICAgICAgICAgICBuYW1lICs9ICcuJyArIHRoaXMuZXhwZWN0KGxleGVyLlRPS0VOX1NZTUJPTCkudmFsdWU7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIG5ldyBub2Rlcy5TeW1ib2wodG9rLmxpbmVubywgdG9rLmNvbG5vLCBuYW1lKTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlRmlsdGVyQXJnczogZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgIGlmKHRoaXMucGVla1Rva2VuKCkudHlwZSA9PT0gbGV4ZXIuVE9LRU5fTEVGVF9QQVJFTikge1xuXHQgICAgICAgICAgICAvLyBHZXQgYSBGdW5DYWxsIG5vZGUgYW5kIGFkZCB0aGUgcGFyYW1ldGVycyB0byB0aGVcblx0ICAgICAgICAgICAgLy8gZmlsdGVyXG5cdCAgICAgICAgICAgIHZhciBjYWxsID0gdGhpcy5wYXJzZVBvc3RmaXgobm9kZSk7XG5cdCAgICAgICAgICAgIHJldHVybiBjYWxsLmFyZ3MuY2hpbGRyZW47XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBbXTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlRmlsdGVyOiBmdW5jdGlvbihub2RlKSB7XG5cdCAgICAgICAgd2hpbGUodGhpcy5za2lwKGxleGVyLlRPS0VOX1BJUEUpKSB7XG5cdCAgICAgICAgICAgIHZhciBuYW1lID0gdGhpcy5wYXJzZUZpbHRlck5hbWUoKTtcblxuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLkZpbHRlcihcblx0ICAgICAgICAgICAgICAgIG5hbWUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgbmFtZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgIG5hbWUsXG5cdCAgICAgICAgICAgICAgICBuZXcgbm9kZXMuTm9kZUxpc3QoXG5cdCAgICAgICAgICAgICAgICAgICAgbmFtZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgbmFtZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICBbbm9kZV0uY29uY2F0KHRoaXMucGFyc2VGaWx0ZXJBcmdzKG5vZGUpKVxuXHQgICAgICAgICAgICAgICAgKVxuXHQgICAgICAgICAgICApO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBub2RlO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VGaWx0ZXJTdGF0ZW1lbnQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBmaWx0ZXJUb2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgIGlmKCF0aGlzLnNraXBTeW1ib2woJ2ZpbHRlcicpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VGaWx0ZXJTdGF0ZW1lbnQ6IGV4cGVjdGVkIGZpbHRlcicpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBuYW1lID0gdGhpcy5wYXJzZUZpbHRlck5hbWUoKTtcblx0ICAgICAgICB2YXIgYXJncyA9IHRoaXMucGFyc2VGaWx0ZXJBcmdzKG5hbWUpO1xuXG5cdCAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJCbG9ja0VuZChmaWx0ZXJUb2sudmFsdWUpO1xuXHQgICAgICAgIHZhciBib2R5ID0gbmV3IG5vZGVzLkNhcHR1cmUoXG5cdCAgICAgICAgICAgIG5hbWUubGluZW5vLFxuXHQgICAgICAgICAgICBuYW1lLmNvbG5vLFxuXHQgICAgICAgICAgICB0aGlzLnBhcnNlVW50aWxCbG9ja3MoJ2VuZGZpbHRlcicpXG5cdCAgICAgICAgKTtcblx0ICAgICAgICB0aGlzLmFkdmFuY2VBZnRlckJsb2NrRW5kKCk7XG5cblx0ICAgICAgICB2YXIgbm9kZSA9IG5ldyBub2Rlcy5GaWx0ZXIoXG5cdCAgICAgICAgICAgIG5hbWUubGluZW5vLFxuXHQgICAgICAgICAgICBuYW1lLmNvbG5vLFxuXHQgICAgICAgICAgICBuYW1lLFxuXHQgICAgICAgICAgICBuZXcgbm9kZXMuTm9kZUxpc3QoXG5cdCAgICAgICAgICAgICAgICBuYW1lLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgIG5hbWUuY29sbm8sXG5cdCAgICAgICAgICAgICAgICBbYm9keV0uY29uY2F0KGFyZ3MpXG5cdCAgICAgICAgICAgIClcblx0ICAgICAgICApO1xuXG5cdCAgICAgICAgcmV0dXJuIG5ldyBub2Rlcy5PdXRwdXQoXG5cdCAgICAgICAgICAgIG5hbWUubGluZW5vLFxuXHQgICAgICAgICAgICBuYW1lLmNvbG5vLFxuXHQgICAgICAgICAgICBbbm9kZV1cblx0ICAgICAgICApO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VBZ2dyZWdhdGU6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciB0b2sgPSB0aGlzLm5leHRUb2tlbigpO1xuXHQgICAgICAgIHZhciBub2RlO1xuXG5cdCAgICAgICAgc3dpdGNoKHRvay50eXBlKSB7XG5cdCAgICAgICAgY2FzZSBsZXhlci5UT0tFTl9MRUZUX1BBUkVOOlxuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLkdyb3VwKHRvay5saW5lbm8sIHRvay5jb2xubyk7IGJyZWFrO1xuXHQgICAgICAgIGNhc2UgbGV4ZXIuVE9LRU5fTEVGVF9CUkFDS0VUOlxuXHQgICAgICAgICAgICBub2RlID0gbmV3IG5vZGVzLkFycmF5KHRvay5saW5lbm8sIHRvay5jb2xubyk7IGJyZWFrO1xuXHQgICAgICAgIGNhc2UgbGV4ZXIuVE9LRU5fTEVGVF9DVVJMWTpcblx0ICAgICAgICAgICAgbm9kZSA9IG5ldyBub2Rlcy5EaWN0KHRvay5saW5lbm8sIHRvay5jb2xubyk7IGJyZWFrO1xuXHQgICAgICAgIGRlZmF1bHQ6XG5cdCAgICAgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHdoaWxlKDEpIHtcblx0ICAgICAgICAgICAgdmFyIHR5cGUgPSB0aGlzLnBlZWtUb2tlbigpLnR5cGU7XG5cdCAgICAgICAgICAgIGlmKHR5cGUgPT09IGxleGVyLlRPS0VOX1JJR0hUX1BBUkVOIHx8XG5cdCAgICAgICAgICAgICAgIHR5cGUgPT09IGxleGVyLlRPS0VOX1JJR0hUX0JSQUNLRVQgfHxcblx0ICAgICAgICAgICAgICAgdHlwZSA9PT0gbGV4ZXIuVE9LRU5fUklHSFRfQ1VSTFkpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGlmKG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHQgICAgICAgICAgICAgICAgaWYoIXRoaXMuc2tpcChsZXhlci5UT0tFTl9DT01NQSkpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWwoJ3BhcnNlQWdncmVnYXRlOiBleHBlY3RlZCBjb21tYSBhZnRlciBleHByZXNzaW9uJyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmNvbG5vKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGlmKG5vZGUgaW5zdGFuY2VvZiBub2Rlcy5EaWN0KSB7XG5cdCAgICAgICAgICAgICAgICAvLyBUT0RPOiBjaGVjayBmb3IgZXJyb3JzXG5cdCAgICAgICAgICAgICAgICB2YXIga2V5ID0gdGhpcy5wYXJzZVByaW1hcnkoKTtcblxuXHQgICAgICAgICAgICAgICAgLy8gV2UgZXhwZWN0IGEga2V5L3ZhbHVlIHBhaXIgZm9yIGRpY3RzLCBzZXBhcmF0ZWQgYnkgYVxuXHQgICAgICAgICAgICAgICAgLy8gY29sb25cblx0ICAgICAgICAgICAgICAgIGlmKCF0aGlzLnNraXAobGV4ZXIuVE9LRU5fQ09MT04pKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWlsKCdwYXJzZUFnZ3JlZ2F0ZTogZXhwZWN0ZWQgY29sb24gYWZ0ZXIgZGljdCBrZXknLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0b2subGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0b2suY29sbm8pO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBUT0RPOiBjaGVjayBmb3IgZXJyb3JzXG5cdCAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXHQgICAgICAgICAgICAgICAgbm9kZS5hZGRDaGlsZChuZXcgbm9kZXMuUGFpcihrZXkubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkuY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUpKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGZvciBlcnJvcnNcblx0ICAgICAgICAgICAgICAgIHZhciBleHByID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcblx0ICAgICAgICAgICAgICAgIG5vZGUuYWRkQ2hpbGQoZXhwcik7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH0sXG5cblx0ICAgIHBhcnNlU2lnbmF0dXJlOiBmdW5jdGlvbih0b2xlcmFudCwgbm9QYXJlbnMpIHtcblx0ICAgICAgICB2YXIgdG9rID0gdGhpcy5wZWVrVG9rZW4oKTtcblx0ICAgICAgICBpZighbm9QYXJlbnMgJiYgdG9rLnR5cGUgIT09IGxleGVyLlRPS0VOX0xFRlRfUEFSRU4pIHtcblx0ICAgICAgICAgICAgaWYodG9sZXJhbnQpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5mYWlsKCdleHBlY3RlZCBhcmd1bWVudHMnLCB0b2subGluZW5vLCB0b2suY29sbm8pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX0xFRlRfUEFSRU4pIHtcblx0ICAgICAgICAgICAgdG9rID0gdGhpcy5uZXh0VG9rZW4oKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgYXJncyA9IG5ldyBub2Rlcy5Ob2RlTGlzdCh0b2subGluZW5vLCB0b2suY29sbm8pO1xuXHQgICAgICAgIHZhciBrd2FyZ3MgPSBuZXcgbm9kZXMuS2V5d29yZEFyZ3ModG9rLmxpbmVubywgdG9rLmNvbG5vKTtcblx0ICAgICAgICB2YXIgY2hlY2tDb21tYSA9IGZhbHNlO1xuXG5cdCAgICAgICAgd2hpbGUoMSkge1xuXHQgICAgICAgICAgICB0b2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgICAgICBpZighbm9QYXJlbnMgJiYgdG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX1JJR0hUX1BBUkVOKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSBpZihub1BhcmVucyAmJiB0b2sudHlwZSA9PT0gbGV4ZXIuVE9LRU5fQkxPQ0tfRU5EKSB7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGlmKGNoZWNrQ29tbWEgJiYgIXRoaXMuc2tpcChsZXhlci5UT0tFTl9DT01NQSkpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VTaWduYXR1cmU6IGV4cGVjdGVkIGNvbW1hIGFmdGVyIGV4cHJlc3Npb24nLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgIHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmNvbG5vKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHZhciBhcmcgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXG5cdCAgICAgICAgICAgICAgICBpZih0aGlzLnNraXBWYWx1ZShsZXhlci5UT0tFTl9PUEVSQVRPUiwgJz0nKSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGt3YXJncy5hZGRDaGlsZChcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbmV3IG5vZGVzLlBhaXIoYXJnLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmcsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFeHByZXNzaW9uKCkpXG5cdCAgICAgICAgICAgICAgICAgICAgKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIGFyZ3MuYWRkQ2hpbGQoYXJnKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGNoZWNrQ29tbWEgPSB0cnVlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKGt3YXJncy5jaGlsZHJlbi5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgYXJncy5hZGRDaGlsZChrd2FyZ3MpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBhcmdzO1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VVbnRpbEJsb2NrczogZnVuY3Rpb24oLyogYmxvY2tOYW1lcyAqLykge1xuXHQgICAgICAgIHZhciBwcmV2ID0gdGhpcy5icmVha09uQmxvY2tzO1xuXHQgICAgICAgIHRoaXMuYnJlYWtPbkJsb2NrcyA9IGxpYi50b0FycmF5KGFyZ3VtZW50cyk7XG5cblx0ICAgICAgICB2YXIgcmV0ID0gdGhpcy5wYXJzZSgpO1xuXG5cdCAgICAgICAgdGhpcy5icmVha09uQmxvY2tzID0gcHJldjtcblx0ICAgICAgICByZXR1cm4gcmV0O1xuXHQgICAgfSxcblxuXHQgICAgcGFyc2VOb2RlczogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIHZhciB0b2s7XG5cdCAgICAgICAgdmFyIGJ1ZiA9IFtdO1xuXG5cdCAgICAgICAgd2hpbGUoKHRvayA9IHRoaXMubmV4dFRva2VuKCkpKSB7XG5cdCAgICAgICAgICAgIGlmKHRvay50eXBlID09PSBsZXhlci5UT0tFTl9EQVRBKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHRvay52YWx1ZTtcblx0ICAgICAgICAgICAgICAgIHZhciBuZXh0VG9rZW4gPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgICAgICAgICAgdmFyIG5leHRWYWwgPSBuZXh0VG9rZW4gJiYgbmV4dFRva2VuLnZhbHVlO1xuXG5cdCAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbGFzdCB0b2tlbiBoYXMgXCItXCIgd2UgbmVlZCB0byB0cmltIHRoZVxuXHQgICAgICAgICAgICAgICAgLy8gbGVhZGluZyB3aGl0ZXNwYWNlIG9mIHRoZSBkYXRhLiBUaGlzIGlzIG1hcmtlZCB3aXRoXG5cdCAgICAgICAgICAgICAgICAvLyB0aGUgYGRyb3BMZWFkaW5nV2hpdGVzcGFjZWAgdmFyaWFibGUuXG5cdCAgICAgICAgICAgICAgICBpZih0aGlzLmRyb3BMZWFkaW5nV2hpdGVzcGFjZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IHRoaXMgY291bGQgYmUgb3B0aW1pemVkIChkb24ndCB1c2UgcmVnZXgpXG5cdCAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEucmVwbGFjZSgvXlxccyovLCAnJyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wTGVhZGluZ1doaXRlc3BhY2UgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gU2FtZSBmb3IgdGhlIHN1Y2NlZWRpbmcgYmxvY2sgc3RhcnQgdG9rZW5cblx0ICAgICAgICAgICAgICAgIGlmKG5leHRUb2tlbiAmJlxuXHQgICAgICAgICAgICAgICAgICAgICgobmV4dFRva2VuLnR5cGUgPT09IGxleGVyLlRPS0VOX0JMT0NLX1NUQVJUICYmXG5cdCAgICAgICAgICAgICAgICAgICAgICBuZXh0VmFsLmNoYXJBdChuZXh0VmFsLmxlbmd0aCAtIDEpID09PSAnLScpIHx8XG5cdCAgICAgICAgICAgICAgICAgICAgKG5leHRUb2tlbi50eXBlID09PSBsZXhlci5UT0tFTl9WQVJJQUJMRV9TVEFSVCAmJlxuXHQgICAgICAgICAgICAgICAgICAgICAgbmV4dFZhbC5jaGFyQXQodGhpcy50b2tlbnMudGFncy5WQVJJQUJMRV9TVEFSVC5sZW5ndGgpXG5cdCAgICAgICAgICAgICAgICAgICAgICAgID09PSAnLScpIHx8XG5cdCAgICAgICAgICAgICAgICAgICAgKG5leHRUb2tlbi50eXBlID09PSBsZXhlci5UT0tFTl9DT01NRU5UICYmXG5cdCAgICAgICAgICAgICAgICAgICAgICBuZXh0VmFsLmNoYXJBdCh0aGlzLnRva2Vucy50YWdzLkNPTU1FTlRfU1RBUlQubGVuZ3RoKVxuXHQgICAgICAgICAgICAgICAgICAgICAgICA9PT0gJy0nKSkpIHtcblx0ICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiB0aGlzIGNvdWxkIGJlIG9wdGltaXplZCAoZG9uJ3QgdXNlIHJlZ2V4KVxuXHQgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnJlcGxhY2UoL1xccyokLywgJycpO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICBidWYucHVzaChuZXcgbm9kZXMuT3V0cHV0KHRvay5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvay5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25ldyBub2Rlcy5UZW1wbGF0ZURhdGEodG9rLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhKV0pKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIGlmKHRvay50eXBlID09PSBsZXhlci5UT0tFTl9CTE9DS19TVEFSVCkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5kcm9wTGVhZGluZ1doaXRlc3BhY2UgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgIHZhciBuID0gdGhpcy5wYXJzZVN0YXRlbWVudCgpO1xuXHQgICAgICAgICAgICAgICAgaWYoIW4pIHtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGJ1Zi5wdXNoKG4pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX1ZBUklBQkxFX1NUQVJUKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgZSA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG5cdCAgICAgICAgICAgICAgICB0aGlzLmRyb3BMZWFkaW5nV2hpdGVzcGFjZSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgdGhpcy5hZHZhbmNlQWZ0ZXJWYXJpYWJsZUVuZCgpO1xuXHQgICAgICAgICAgICAgICAgYnVmLnB1c2gobmV3IG5vZGVzLk91dHB1dCh0b2subGluZW5vLCB0b2suY29sbm8sIFtlXSkpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYodG9rLnR5cGUgPT09IGxleGVyLlRPS0VOX0NPTU1FTlQpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZHJvcExlYWRpbmdXaGl0ZXNwYWNlID0gdG9rLnZhbHVlLmNoYXJBdChcblx0ICAgICAgICAgICAgICAgICAgICB0b2sudmFsdWUubGVuZ3RoIC0gdGhpcy50b2tlbnMudGFncy5DT01NRU5UX0VORC5sZW5ndGggLSAxXG5cdCAgICAgICAgICAgICAgICApID09PSAnLSc7XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAvLyBJZ25vcmUgY29tbWVudHMsIG90aGVyd2lzZSB0aGlzIHNob3VsZCBiZSBhbiBlcnJvclxuXHQgICAgICAgICAgICAgICAgdGhpcy5mYWlsKCdVbmV4cGVjdGVkIHRva2VuIGF0IHRvcC1sZXZlbDogJyArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLnR5cGUsIHRvay5saW5lbm8sIHRvay5jb2xubyk7XG5cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBidWY7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZTogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgcmV0dXJuIG5ldyBub2Rlcy5Ob2RlTGlzdCgwLCAwLCB0aGlzLnBhcnNlTm9kZXMoKSk7XG5cdCAgICB9LFxuXG5cdCAgICBwYXJzZUFzUm9vdDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgcmV0dXJuIG5ldyBub2Rlcy5Sb290KDAsIDAsIHRoaXMucGFyc2VOb2RlcygpKTtcblx0ICAgIH1cblx0fSk7XG5cblx0Ly8gdmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cblx0Ly8gdmFyIGwgPSBsZXhlci5sZXgoJ3slLSBpZiB4IC0lfVxcbiBoZWxsbyB7JSBlbmRpZiAlfScpO1xuXHQvLyB2YXIgdDtcblx0Ly8gd2hpbGUoKHQgPSBsLm5leHRUb2tlbigpKSkge1xuXHQvLyAgICAgY29uc29sZS5sb2codXRpbC5pbnNwZWN0KHQpKTtcblx0Ly8gfVxuXG5cdC8vIHZhciBwID0gbmV3IFBhcnNlcihsZXhlci5sZXgoJ2hlbGxvIHslIGZpbHRlciB0aXRsZSAlfScgK1xuXHQvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdIZWxsbyBtYWRhbSBob3cgYXJlIHlvdScgK1xuXHQvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd7JSBlbmRmaWx0ZXIgJX0nKSk7XG5cdC8vIHZhciBuID0gcC5wYXJzZUFzUm9vdCgpO1xuXHQvLyBub2Rlcy5wcmludE5vZGVzKG4pO1xuXG5cdG1vZHVsZS5leHBvcnRzID0ge1xuXHQgICAgcGFyc2U6IGZ1bmN0aW9uKHNyYywgZXh0ZW5zaW9ucywgb3B0cykge1xuXHQgICAgICAgIHZhciBwID0gbmV3IFBhcnNlcihsZXhlci5sZXgoc3JjLCBvcHRzKSk7XG5cdCAgICAgICAgaWYgKGV4dGVuc2lvbnMgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICBwLmV4dGVuc2lvbnMgPSBleHRlbnNpb25zO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gcC5wYXJzZUFzUm9vdCgpO1xuXHQgICAgfSxcblx0ICAgIFBhcnNlcjogUGFyc2VyXG5cdH07XG5cblxuLyoqKi8gfSksXG4vKiA5ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBsaWIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXG5cdHZhciB3aGl0ZXNwYWNlQ2hhcnMgPSAnIFxcblxcdFxcclxcdTAwQTAnO1xuXHR2YXIgZGVsaW1DaGFycyA9ICcoKVtde30lKi0rfi8jLDp8Ljw+PSEnO1xuXHR2YXIgaW50Q2hhcnMgPSAnMDEyMzQ1Njc4OSc7XG5cblx0dmFyIEJMT0NLX1NUQVJUID0gJ3slJztcblx0dmFyIEJMT0NLX0VORCA9ICclfSc7XG5cdHZhciBWQVJJQUJMRV9TVEFSVCA9ICd7eyc7XG5cdHZhciBWQVJJQUJMRV9FTkQgPSAnfX0nO1xuXHR2YXIgQ09NTUVOVF9TVEFSVCA9ICd7Iyc7XG5cdHZhciBDT01NRU5UX0VORCA9ICcjfSc7XG5cblx0dmFyIFRPS0VOX1NUUklORyA9ICdzdHJpbmcnO1xuXHR2YXIgVE9LRU5fV0hJVEVTUEFDRSA9ICd3aGl0ZXNwYWNlJztcblx0dmFyIFRPS0VOX0RBVEEgPSAnZGF0YSc7XG5cdHZhciBUT0tFTl9CTE9DS19TVEFSVCA9ICdibG9jay1zdGFydCc7XG5cdHZhciBUT0tFTl9CTE9DS19FTkQgPSAnYmxvY2stZW5kJztcblx0dmFyIFRPS0VOX1ZBUklBQkxFX1NUQVJUID0gJ3ZhcmlhYmxlLXN0YXJ0Jztcblx0dmFyIFRPS0VOX1ZBUklBQkxFX0VORCA9ICd2YXJpYWJsZS1lbmQnO1xuXHR2YXIgVE9LRU5fQ09NTUVOVCA9ICdjb21tZW50Jztcblx0dmFyIFRPS0VOX0xFRlRfUEFSRU4gPSAnbGVmdC1wYXJlbic7XG5cdHZhciBUT0tFTl9SSUdIVF9QQVJFTiA9ICdyaWdodC1wYXJlbic7XG5cdHZhciBUT0tFTl9MRUZUX0JSQUNLRVQgPSAnbGVmdC1icmFja2V0Jztcblx0dmFyIFRPS0VOX1JJR0hUX0JSQUNLRVQgPSAncmlnaHQtYnJhY2tldCc7XG5cdHZhciBUT0tFTl9MRUZUX0NVUkxZID0gJ2xlZnQtY3VybHknO1xuXHR2YXIgVE9LRU5fUklHSFRfQ1VSTFkgPSAncmlnaHQtY3VybHknO1xuXHR2YXIgVE9LRU5fT1BFUkFUT1IgPSAnb3BlcmF0b3InO1xuXHR2YXIgVE9LRU5fQ09NTUEgPSAnY29tbWEnO1xuXHR2YXIgVE9LRU5fQ09MT04gPSAnY29sb24nO1xuXHR2YXIgVE9LRU5fVElMREUgPSAndGlsZGUnO1xuXHR2YXIgVE9LRU5fUElQRSA9ICdwaXBlJztcblx0dmFyIFRPS0VOX0lOVCA9ICdpbnQnO1xuXHR2YXIgVE9LRU5fRkxPQVQgPSAnZmxvYXQnO1xuXHR2YXIgVE9LRU5fQk9PTEVBTiA9ICdib29sZWFuJztcblx0dmFyIFRPS0VOX05PTkUgPSAnbm9uZSc7XG5cdHZhciBUT0tFTl9TWU1CT0wgPSAnc3ltYm9sJztcblx0dmFyIFRPS0VOX1NQRUNJQUwgPSAnc3BlY2lhbCc7XG5cdHZhciBUT0tFTl9SRUdFWCA9ICdyZWdleCc7XG5cblx0ZnVuY3Rpb24gdG9rZW4odHlwZSwgdmFsdWUsIGxpbmVubywgY29sbm8pIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgICAgdHlwZTogdHlwZSxcblx0ICAgICAgICB2YWx1ZTogdmFsdWUsXG5cdCAgICAgICAgbGluZW5vOiBsaW5lbm8sXG5cdCAgICAgICAgY29sbm86IGNvbG5vXG5cdCAgICB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gVG9rZW5pemVyKHN0ciwgb3B0cykge1xuXHQgICAgdGhpcy5zdHIgPSBzdHI7XG5cdCAgICB0aGlzLmluZGV4ID0gMDtcblx0ICAgIHRoaXMubGVuID0gc3RyLmxlbmd0aDtcblx0ICAgIHRoaXMubGluZW5vID0gMDtcblx0ICAgIHRoaXMuY29sbm8gPSAwO1xuXG5cdCAgICB0aGlzLmluX2NvZGUgPSBmYWxzZTtcblxuXHQgICAgb3B0cyA9IG9wdHMgfHwge307XG5cblx0ICAgIHZhciB0YWdzID0gb3B0cy50YWdzIHx8IHt9O1xuXHQgICAgdGhpcy50YWdzID0ge1xuXHQgICAgICAgIEJMT0NLX1NUQVJUOiB0YWdzLmJsb2NrU3RhcnQgfHwgQkxPQ0tfU1RBUlQsXG5cdCAgICAgICAgQkxPQ0tfRU5EOiB0YWdzLmJsb2NrRW5kIHx8IEJMT0NLX0VORCxcblx0ICAgICAgICBWQVJJQUJMRV9TVEFSVDogdGFncy52YXJpYWJsZVN0YXJ0IHx8IFZBUklBQkxFX1NUQVJULFxuXHQgICAgICAgIFZBUklBQkxFX0VORDogdGFncy52YXJpYWJsZUVuZCB8fCBWQVJJQUJMRV9FTkQsXG5cdCAgICAgICAgQ09NTUVOVF9TVEFSVDogdGFncy5jb21tZW50U3RhcnQgfHwgQ09NTUVOVF9TVEFSVCxcblx0ICAgICAgICBDT01NRU5UX0VORDogdGFncy5jb21tZW50RW5kIHx8IENPTU1FTlRfRU5EXG5cdCAgICB9O1xuXG5cdCAgICB0aGlzLnRyaW1CbG9ja3MgPSAhIW9wdHMudHJpbUJsb2Nrcztcblx0ICAgIHRoaXMubHN0cmlwQmxvY2tzID0gISFvcHRzLmxzdHJpcEJsb2Nrcztcblx0fVxuXG5cdFRva2VuaXplci5wcm90b3R5cGUubmV4dFRva2VuID0gZnVuY3Rpb24oKSB7XG5cdCAgICB2YXIgbGluZW5vID0gdGhpcy5saW5lbm87XG5cdCAgICB2YXIgY29sbm8gPSB0aGlzLmNvbG5vO1xuXHQgICAgdmFyIHRvaztcblxuXHQgICAgaWYodGhpcy5pbl9jb2RlKSB7XG5cdCAgICAgICAgLy8gT3RoZXJ3aXNlLCBpZiB3ZSBhcmUgaW4gYSBibG9jayBwYXJzZSBpdCBhcyBjb2RlXG5cdCAgICAgICAgdmFyIGN1ciA9IHRoaXMuY3VycmVudCgpO1xuXG5cdCAgICAgICAgaWYodGhpcy5pc19maW5pc2hlZCgpKSB7XG5cdCAgICAgICAgICAgIC8vIFdlIGhhdmUgbm90aGluZyBlbHNlIHRvIHBhcnNlXG5cdCAgICAgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKGN1ciA9PT0gJ1wiJyB8fCBjdXIgPT09ICdcXCcnKSB7XG5cdCAgICAgICAgICAgIC8vIFdlJ3ZlIGhpdCBhIHN0cmluZ1xuXHQgICAgICAgICAgICByZXR1cm4gdG9rZW4oVE9LRU5fU1RSSU5HLCB0aGlzLnBhcnNlU3RyaW5nKGN1ciksIGxpbmVubywgY29sbm8pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKCh0b2sgPSB0aGlzLl9leHRyYWN0KHdoaXRlc3BhY2VDaGFycykpKSB7XG5cdCAgICAgICAgICAgIC8vIFdlIGhpdCBzb21lIHdoaXRlc3BhY2Vcblx0ICAgICAgICAgICAgcmV0dXJuIHRva2VuKFRPS0VOX1dISVRFU1BBQ0UsIHRvaywgbGluZW5vLCBjb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYoKHRvayA9IHRoaXMuX2V4dHJhY3RTdHJpbmcodGhpcy50YWdzLkJMT0NLX0VORCkpIHx8XG5cdCAgICAgICAgICAgICAgICAodG9rID0gdGhpcy5fZXh0cmFjdFN0cmluZygnLScgKyB0aGlzLnRhZ3MuQkxPQ0tfRU5EKSkpIHtcblx0ICAgICAgICAgICAgLy8gU3BlY2lhbCBjaGVjayBmb3IgdGhlIGJsb2NrIGVuZCB0YWdcblx0ICAgICAgICAgICAgLy9cblx0ICAgICAgICAgICAgLy8gSXQgaXMgYSByZXF1aXJlbWVudCB0aGF0IHN0YXJ0IGFuZCBlbmQgdGFncyBhcmUgY29tcG9zZWQgb2Zcblx0ICAgICAgICAgICAgLy8gZGVsaW1pdGVyIGNoYXJhY3RlcnMgKCV7fVtdIGV0YyksIGFuZCBvdXIgY29kZSBhbHdheXNcblx0ICAgICAgICAgICAgLy8gYnJlYWtzIG9uIGRlbGltaXRlcnMgc28gd2UgY2FuIGFzc3VtZSB0aGUgdG9rZW4gcGFyc2luZ1xuXHQgICAgICAgICAgICAvLyBkb2Vzbid0IGNvbnN1bWUgdGhlc2UgZWxzZXdoZXJlXG5cdCAgICAgICAgICAgIHRoaXMuaW5fY29kZSA9IGZhbHNlO1xuXHQgICAgICAgICAgICBpZih0aGlzLnRyaW1CbG9ja3MpIHtcblx0ICAgICAgICAgICAgICAgIGN1ciA9IHRoaXMuY3VycmVudCgpO1xuXHQgICAgICAgICAgICAgICAgaWYoY3VyID09PSAnXFxuJykge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIFNraXAgbmV3bGluZVxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yd2FyZCgpO1xuXHQgICAgICAgICAgICAgICAgfWVsc2UgaWYoY3VyID09PSAnXFxyJyl7XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gU2tpcCBDUkxGIG5ld2xpbmVcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcndhcmQoKTtcblx0ICAgICAgICAgICAgICAgICAgICBjdXIgPSB0aGlzLmN1cnJlbnQoKTtcblx0ICAgICAgICAgICAgICAgICAgICBpZihjdXIgPT09ICdcXG4nKXtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdhcyBub3QgYSBDUkxGLCBzbyBnbyBiYWNrXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmFjaygpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gdG9rZW4oVE9LRU5fQkxPQ0tfRU5ELCB0b2ssIGxpbmVubywgY29sbm8pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKCh0b2sgPSB0aGlzLl9leHRyYWN0U3RyaW5nKHRoaXMudGFncy5WQVJJQUJMRV9FTkQpKSB8fFxuXHQgICAgICAgICAgICAgICAgKHRvayA9IHRoaXMuX2V4dHJhY3RTdHJpbmcoJy0nICsgdGhpcy50YWdzLlZBUklBQkxFX0VORCkpKSB7XG5cdCAgICAgICAgICAgIC8vIFNwZWNpYWwgY2hlY2sgZm9yIHZhcmlhYmxlIGVuZCB0YWcgKHNlZSBhYm92ZSlcblx0ICAgICAgICAgICAgdGhpcy5pbl9jb2RlID0gZmFsc2U7XG5cdCAgICAgICAgICAgIHJldHVybiB0b2tlbihUT0tFTl9WQVJJQUJMRV9FTkQsIHRvaywgbGluZW5vLCBjb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYgKGN1ciA9PT0gJ3InICYmIHRoaXMuc3RyLmNoYXJBdCh0aGlzLmluZGV4ICsgMSkgPT09ICcvJykge1xuXHQgICAgICAgICAgICAvLyBTa2lwIHBhc3QgJ3IvJy5cblx0ICAgICAgICAgICAgdGhpcy5mb3J3YXJkTigyKTtcblxuXHQgICAgICAgICAgICAvLyBFeHRyYWN0IHVudGlsIHRoZSBlbmQgb2YgdGhlIHJlZ2V4IC0tIC8gZW5kcyBpdCwgXFwvIGRvZXMgbm90LlxuXHQgICAgICAgICAgICB2YXIgcmVnZXhCb2R5ID0gJyc7XG5cdCAgICAgICAgICAgIHdoaWxlICghdGhpcy5pc19maW5pc2hlZCgpKSB7XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50KCkgPT09ICcvJyAmJiB0aGlzLnByZXZpb3VzKCkgIT09ICdcXFxcJykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yd2FyZCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICByZWdleEJvZHkgKz0gdGhpcy5jdXJyZW50KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBDaGVjayBmb3IgZmxhZ3MuXG5cdCAgICAgICAgICAgIC8vIFRoZSBwb3NzaWJsZSBmbGFncyBhcmUgYWNjb3JkaW5nIHRvIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1JlZ0V4cClcblx0ICAgICAgICAgICAgdmFyIFBPU1NJQkxFX0ZMQUdTID0gWydnJywgJ2knLCAnbScsICd5J107XG5cdCAgICAgICAgICAgIHZhciByZWdleEZsYWdzID0gJyc7XG5cdCAgICAgICAgICAgIHdoaWxlICghdGhpcy5pc19maW5pc2hlZCgpKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgaXNDdXJyZW50QUZsYWcgPSBQT1NTSUJMRV9GTEFHUy5pbmRleE9mKHRoaXMuY3VycmVudCgpKSAhPT0gLTE7XG5cdCAgICAgICAgICAgICAgICBpZiAoaXNDdXJyZW50QUZsYWcpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZWdleEZsYWdzICs9IHRoaXMuY3VycmVudCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yd2FyZCgpO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiB0b2tlbihUT0tFTl9SRUdFWCwge2JvZHk6IHJlZ2V4Qm9keSwgZmxhZ3M6IHJlZ2V4RmxhZ3N9LCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZihkZWxpbUNoYXJzLmluZGV4T2YoY3VyKSAhPT0gLTEpIHtcblx0ICAgICAgICAgICAgLy8gV2UndmUgaGl0IGEgZGVsaW1pdGVyIChhIHNwZWNpYWwgY2hhciBsaWtlIGEgYnJhY2tldClcblx0ICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICAgICAgICAgIHZhciBjb21wbGV4T3BzID0gWyc9PScsICc9PT0nLCAnIT0nLCAnIT09JywgJzw9JywgJz49JywgJy8vJywgJyoqJ107XG5cdCAgICAgICAgICAgIHZhciBjdXJDb21wbGV4ID0gY3VyICsgdGhpcy5jdXJyZW50KCk7XG5cdCAgICAgICAgICAgIHZhciB0eXBlO1xuXG5cdCAgICAgICAgICAgIGlmKGxpYi5pbmRleE9mKGNvbXBsZXhPcHMsIGN1ckNvbXBsZXgpICE9PSAtMSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICAgICAgICAgICAgICBjdXIgPSBjdXJDb21wbGV4O1xuXG5cdCAgICAgICAgICAgICAgICAvLyBTZWUgaWYgdGhpcyBpcyBhIHN0cmljdCBlcXVhbGl0eS9pbmVxdWFsaXR5IGNvbXBhcmF0b3Jcblx0ICAgICAgICAgICAgICAgIGlmKGxpYi5pbmRleE9mKGNvbXBsZXhPcHMsIGN1ckNvbXBsZXggKyB0aGlzLmN1cnJlbnQoKSkgIT09IC0xKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgY3VyID0gY3VyQ29tcGxleCArIHRoaXMuY3VycmVudCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yd2FyZCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgc3dpdGNoKGN1cikge1xuXHQgICAgICAgICAgICBjYXNlICcoJzogdHlwZSA9IFRPS0VOX0xFRlRfUEFSRU47IGJyZWFrO1xuXHQgICAgICAgICAgICBjYXNlICcpJzogdHlwZSA9IFRPS0VOX1JJR0hUX1BBUkVOOyBicmVhaztcblx0ICAgICAgICAgICAgY2FzZSAnWyc6IHR5cGUgPSBUT0tFTl9MRUZUX0JSQUNLRVQ7IGJyZWFrO1xuXHQgICAgICAgICAgICBjYXNlICddJzogdHlwZSA9IFRPS0VOX1JJR0hUX0JSQUNLRVQ7IGJyZWFrO1xuXHQgICAgICAgICAgICBjYXNlICd7JzogdHlwZSA9IFRPS0VOX0xFRlRfQ1VSTFk7IGJyZWFrO1xuXHQgICAgICAgICAgICBjYXNlICd9JzogdHlwZSA9IFRPS0VOX1JJR0hUX0NVUkxZOyBicmVhaztcblx0ICAgICAgICAgICAgY2FzZSAnLCc6IHR5cGUgPSBUT0tFTl9DT01NQTsgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgJzonOiB0eXBlID0gVE9LRU5fQ09MT047IGJyZWFrO1xuXHQgICAgICAgICAgICBjYXNlICd+JzogdHlwZSA9IFRPS0VOX1RJTERFOyBicmVhaztcblx0ICAgICAgICAgICAgY2FzZSAnfCc6IHR5cGUgPSBUT0tFTl9QSVBFOyBicmVhaztcblx0ICAgICAgICAgICAgZGVmYXVsdDogdHlwZSA9IFRPS0VOX09QRVJBVE9SO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIHRva2VuKHR5cGUsIGN1ciwgbGluZW5vLCBjb2xubyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAvLyBXZSBhcmUgbm90IGF0IHdoaXRlc3BhY2Ugb3IgYSBkZWxpbWl0ZXIsIHNvIGV4dHJhY3QgdGhlXG5cdCAgICAgICAgICAgIC8vIHRleHQgYW5kIHBhcnNlIGl0XG5cdCAgICAgICAgICAgIHRvayA9IHRoaXMuX2V4dHJhY3RVbnRpbCh3aGl0ZXNwYWNlQ2hhcnMgKyBkZWxpbUNoYXJzKTtcblxuXHQgICAgICAgICAgICBpZih0b2subWF0Y2goL15bLStdP1swLTldKyQvKSkge1xuXHQgICAgICAgICAgICAgICAgaWYodGhpcy5jdXJyZW50KCkgPT09ICcuJykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yd2FyZCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBkZWMgPSB0aGlzLl9leHRyYWN0KGludENoYXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW4oVE9LRU5fRkxPQVQsIHRvayArICcuJyArIGRlYywgbGluZW5vLCBjb2xubyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW4oVE9LRU5fSU5ULCB0b2ssIGxpbmVubywgY29sbm8pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYodG9rLm1hdGNoKC9eKHRydWV8ZmFsc2UpJC8pKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW4oVE9LRU5fQk9PTEVBTiwgdG9rLCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIGlmKHRvayA9PT0gJ25vbmUnKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW4oVE9LRU5fTk9ORSwgdG9rLCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIGlmKHRvaykge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuKFRPS0VOX1NZTUJPTCwgdG9rLCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCB2YWx1ZSB3aGlsZSBwYXJzaW5nOiAnICsgdG9rKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIC8vIFBhcnNlIG91dCB0aGUgdGVtcGxhdGUgdGV4dCwgYnJlYWtpbmcgb24gdGFnXG5cdCAgICAgICAgLy8gZGVsaW1pdGVycyBiZWNhdXNlIHdlIG5lZWQgdG8gbG9vayBmb3IgYmxvY2svdmFyaWFibGUgc3RhcnRcblx0ICAgICAgICAvLyB0YWdzIChkb24ndCB1c2UgdGhlIGZ1bGwgZGVsaW1DaGFycyBmb3Igb3B0aW1pemF0aW9uKVxuXHQgICAgICAgIHZhciBiZWdpbkNoYXJzID0gKHRoaXMudGFncy5CTE9DS19TVEFSVC5jaGFyQXQoMCkgK1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFncy5WQVJJQUJMRV9TVEFSVC5jaGFyQXQoMCkgK1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFncy5DT01NRU5UX1NUQVJULmNoYXJBdCgwKSArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdzLkNPTU1FTlRfRU5ELmNoYXJBdCgwKSk7XG5cblx0ICAgICAgICBpZih0aGlzLmlzX2ZpbmlzaGVkKCkpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYoKHRvayA9IHRoaXMuX2V4dHJhY3RTdHJpbmcodGhpcy50YWdzLkJMT0NLX1NUQVJUICsgJy0nKSkgfHxcblx0ICAgICAgICAgICAgICAgICh0b2sgPSB0aGlzLl9leHRyYWN0U3RyaW5nKHRoaXMudGFncy5CTE9DS19TVEFSVCkpKSB7XG5cdCAgICAgICAgICAgIHRoaXMuaW5fY29kZSA9IHRydWU7XG5cdCAgICAgICAgICAgIHJldHVybiB0b2tlbihUT0tFTl9CTE9DS19TVEFSVCwgdG9rLCBsaW5lbm8sIGNvbG5vKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZigodG9rID0gdGhpcy5fZXh0cmFjdFN0cmluZyh0aGlzLnRhZ3MuVkFSSUFCTEVfU1RBUlQgKyAnLScpKSB8fFxuXHQgICAgICAgICAgICAgICAgKHRvayA9IHRoaXMuX2V4dHJhY3RTdHJpbmcodGhpcy50YWdzLlZBUklBQkxFX1NUQVJUKSkpIHtcblx0ICAgICAgICAgICAgdGhpcy5pbl9jb2RlID0gdHJ1ZTtcblx0ICAgICAgICAgICAgcmV0dXJuIHRva2VuKFRPS0VOX1ZBUklBQkxFX1NUQVJULCB0b2ssIGxpbmVubywgY29sbm8pO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdG9rID0gJyc7XG5cdCAgICAgICAgICAgIHZhciBkYXRhO1xuXHQgICAgICAgICAgICB2YXIgaW5fY29tbWVudCA9IGZhbHNlO1xuXG5cdCAgICAgICAgICAgIGlmKHRoaXMuX21hdGNoZXModGhpcy50YWdzLkNPTU1FTlRfU1RBUlQpKSB7XG5cdCAgICAgICAgICAgICAgICBpbl9jb21tZW50ID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgIHRvayA9IHRoaXMuX2V4dHJhY3RTdHJpbmcodGhpcy50YWdzLkNPTU1FTlRfU1RBUlQpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gQ29udGludWFsbHkgY29uc3VtZSB0ZXh0LCBicmVha2luZyBvbiB0aGUgdGFnIGRlbGltaXRlclxuXHQgICAgICAgICAgICAvLyBjaGFyYWN0ZXJzIGFuZCBjaGVja2luZyB0byBzZWUgaWYgaXQncyBhIHN0YXJ0IHRhZy5cblx0ICAgICAgICAgICAgLy9cblx0ICAgICAgICAgICAgLy8gV2UgY291bGQgaGl0IHRoZSBlbmQgb2YgdGhlIHRlbXBsYXRlIGluIHRoZSBtaWRkbGUgb2Zcblx0ICAgICAgICAgICAgLy8gb3VyIGxvb3BpbmcsIHNvIGNoZWNrIGZvciB0aGUgbnVsbCByZXR1cm4gdmFsdWUgZnJvbVxuXHQgICAgICAgICAgICAvLyBfZXh0cmFjdFVudGlsXG5cdCAgICAgICAgICAgIHdoaWxlKChkYXRhID0gdGhpcy5fZXh0cmFjdFVudGlsKGJlZ2luQ2hhcnMpKSAhPT0gbnVsbCkge1xuXHQgICAgICAgICAgICAgICAgdG9rICs9IGRhdGE7XG5cblx0ICAgICAgICAgICAgICAgIGlmKCh0aGlzLl9tYXRjaGVzKHRoaXMudGFncy5CTE9DS19TVEFSVCkgfHxcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXRjaGVzKHRoaXMudGFncy5WQVJJQUJMRV9TVEFSVCkgfHxcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXRjaGVzKHRoaXMudGFncy5DT01NRU5UX1NUQVJUKSkgJiZcblx0ICAgICAgICAgICAgICAgICAgIWluX2NvbW1lbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmxzdHJpcEJsb2NrcyAmJlxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXRjaGVzKHRoaXMudGFncy5CTE9DS19TVEFSVCkgJiZcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xubyA+IDAgJiZcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xubyA8PSB0b2subGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0TGluZSA9IHRvay5zbGljZSgtdGhpcy5jb2xubyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmKC9eXFxzKyQvLnRlc3QobGFzdExpbmUpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgYmxvY2sgbGVhZGluZyB3aGl0ZXNwYWNlIGZyb20gYmVnaW5uaW5nIG9mIHRoZSBzdHJpbmdcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvayA9IHRvay5zbGljZSgwLCAtdGhpcy5jb2xubyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighdG9rLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFsbCBkYXRhIHJlbW92ZWQsIGNvbGxhcHNlIHRvIGF2b2lkIHVubmVjZXNzYXJ5IG5vZGVzXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnkgcmV0dXJuaW5nIG5leHQgdG9rZW4gKGJsb2NrIHN0YXJ0KVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRUb2tlbigpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgIC8vIElmIGl0IGlzIGEgc3RhcnQgdGFnLCBzdG9wIGxvb3Bpbmdcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5fbWF0Y2hlcyh0aGlzLnRhZ3MuQ09NTUVOVF9FTkQpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYoIWluX2NvbW1lbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmV4cGVjdGVkIGVuZCBvZiBjb21tZW50Jyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgIHRvayArPSB0aGlzLl9leHRyYWN0U3RyaW5nKHRoaXMudGFncy5DT01NRU5UX0VORCk7XG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAvLyBJdCBkb2VzIG5vdCBtYXRjaCBhbnkgdGFnLCBzbyBhZGQgdGhlIGNoYXJhY3RlciBhbmRcblx0ICAgICAgICAgICAgICAgICAgICAvLyBjYXJyeSBvblxuXHQgICAgICAgICAgICAgICAgICAgIHRvayArPSB0aGlzLmN1cnJlbnQoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcndhcmQoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGlmKGRhdGEgPT09IG51bGwgJiYgaW5fY29tbWVudCkge1xuXHQgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleHBlY3RlZCBlbmQgb2YgY29tbWVudCwgZ290IGVuZCBvZiBmaWxlJyk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gdG9rZW4oaW5fY29tbWVudCA/IFRPS0VOX0NPTU1FTlQgOiBUT0tFTl9EQVRBLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgdG9rLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgbGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgY29sbm8pO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgcGFyc2UgdGV4dCcpO1xuXHR9O1xuXG5cdFRva2VuaXplci5wcm90b3R5cGUucGFyc2VTdHJpbmcgPSBmdW5jdGlvbihkZWxpbWl0ZXIpIHtcblx0ICAgIHRoaXMuZm9yd2FyZCgpO1xuXG5cdCAgICB2YXIgc3RyID0gJyc7XG5cblx0ICAgIHdoaWxlKCF0aGlzLmlzX2ZpbmlzaGVkKCkgJiYgdGhpcy5jdXJyZW50KCkgIT09IGRlbGltaXRlcikge1xuXHQgICAgICAgIHZhciBjdXIgPSB0aGlzLmN1cnJlbnQoKTtcblxuXHQgICAgICAgIGlmKGN1ciA9PT0gJ1xcXFwnKSB7XG5cdCAgICAgICAgICAgIHRoaXMuZm9yd2FyZCgpO1xuXHQgICAgICAgICAgICBzd2l0Y2godGhpcy5jdXJyZW50KCkpIHtcblx0ICAgICAgICAgICAgY2FzZSAnbic6IHN0ciArPSAnXFxuJzsgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgJ3QnOiBzdHIgKz0gJ1xcdCc7IGJyZWFrO1xuXHQgICAgICAgICAgICBjYXNlICdyJzogc3RyICs9ICdcXHInOyBicmVhaztcblx0ICAgICAgICAgICAgZGVmYXVsdDpcblx0ICAgICAgICAgICAgICAgIHN0ciArPSB0aGlzLmN1cnJlbnQoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB0aGlzLmZvcndhcmQoKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIHN0ciArPSBjdXI7XG5cdCAgICAgICAgICAgIHRoaXMuZm9yd2FyZCgpO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgdGhpcy5mb3J3YXJkKCk7XG5cdCAgICByZXR1cm4gc3RyO1xuXHR9O1xuXG5cdFRva2VuaXplci5wcm90b3R5cGUuX21hdGNoZXMgPSBmdW5jdGlvbihzdHIpIHtcblx0ICAgIGlmKHRoaXMuaW5kZXggKyBzdHIubGVuZ3RoID4gdGhpcy5sZW4pIHtcblx0ICAgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH1cblxuXHQgICAgdmFyIG0gPSB0aGlzLnN0ci5zbGljZSh0aGlzLmluZGV4LCB0aGlzLmluZGV4ICsgc3RyLmxlbmd0aCk7XG5cdCAgICByZXR1cm4gbSA9PT0gc3RyO1xuXHR9O1xuXG5cdFRva2VuaXplci5wcm90b3R5cGUuX2V4dHJhY3RTdHJpbmcgPSBmdW5jdGlvbihzdHIpIHtcblx0ICAgIGlmKHRoaXMuX21hdGNoZXMoc3RyKSkge1xuXHQgICAgICAgIHRoaXMuaW5kZXggKz0gc3RyLmxlbmd0aDtcblx0ICAgICAgICByZXR1cm4gc3RyO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG51bGw7XG5cdH07XG5cblx0VG9rZW5pemVyLnByb3RvdHlwZS5fZXh0cmFjdFVudGlsID0gZnVuY3Rpb24oY2hhclN0cmluZykge1xuXHQgICAgLy8gRXh0cmFjdCBhbGwgbm9uLW1hdGNoaW5nIGNoYXJzLCB3aXRoIHRoZSBkZWZhdWx0IG1hdGNoaW5nIHNldFxuXHQgICAgLy8gdG8gZXZlcnl0aGluZ1xuXHQgICAgcmV0dXJuIHRoaXMuX2V4dHJhY3RNYXRjaGluZyh0cnVlLCBjaGFyU3RyaW5nIHx8ICcnKTtcblx0fTtcblxuXHRUb2tlbml6ZXIucHJvdG90eXBlLl9leHRyYWN0ID0gZnVuY3Rpb24oY2hhclN0cmluZykge1xuXHQgICAgLy8gRXh0cmFjdCBhbGwgbWF0Y2hpbmcgY2hhcnMgKG5vIGRlZmF1bHQsIHNvIGNoYXJTdHJpbmcgbXVzdCBiZVxuXHQgICAgLy8gZXhwbGljaXQpXG5cdCAgICByZXR1cm4gdGhpcy5fZXh0cmFjdE1hdGNoaW5nKGZhbHNlLCBjaGFyU3RyaW5nKTtcblx0fTtcblxuXHRUb2tlbml6ZXIucHJvdG90eXBlLl9leHRyYWN0TWF0Y2hpbmcgPSBmdW5jdGlvbiAoYnJlYWtPbk1hdGNoLCBjaGFyU3RyaW5nKSB7XG5cdCAgICAvLyBQdWxsIG91dCBjaGFyYWN0ZXJzIHVudGlsIGEgYnJlYWtpbmcgY2hhciBpcyBoaXQuXG5cdCAgICAvLyBJZiBicmVha09uTWF0Y2ggaXMgZmFsc2UsIGEgbm9uLW1hdGNoaW5nIGNoYXIgc3RvcHMgaXQuXG5cdCAgICAvLyBJZiBicmVha09uTWF0Y2ggaXMgdHJ1ZSwgYSBtYXRjaGluZyBjaGFyIHN0b3BzIGl0LlxuXG5cdCAgICBpZih0aGlzLmlzX2ZpbmlzaGVkKCkpIHtcblx0ICAgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH1cblxuXHQgICAgdmFyIGZpcnN0ID0gY2hhclN0cmluZy5pbmRleE9mKHRoaXMuY3VycmVudCgpKTtcblxuXHQgICAgLy8gT25seSBwcm9jZWVkIGlmIHRoZSBmaXJzdCBjaGFyYWN0ZXIgZG9lc24ndCBtZWV0IG91ciBjb25kaXRpb25cblx0ICAgIGlmKChicmVha09uTWF0Y2ggJiYgZmlyc3QgPT09IC0xKSB8fFxuXHQgICAgICAgKCFicmVha09uTWF0Y2ggJiYgZmlyc3QgIT09IC0xKSkge1xuXHQgICAgICAgIHZhciB0ID0gdGhpcy5jdXJyZW50KCk7XG5cdCAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cblx0ICAgICAgICAvLyBBbmQgcHVsbCBvdXQgYWxsIHRoZSBjaGFycyBvbmUgYXQgYSB0aW1lIHVudGlsIHdlIGhpdCBhXG5cdCAgICAgICAgLy8gYnJlYWtpbmcgY2hhclxuXHQgICAgICAgIHZhciBpZHggPSBjaGFyU3RyaW5nLmluZGV4T2YodGhpcy5jdXJyZW50KCkpO1xuXG5cdCAgICAgICAgd2hpbGUoKChicmVha09uTWF0Y2ggJiYgaWR4ID09PSAtMSkgfHxcblx0ICAgICAgICAgICAgICAgKCFicmVha09uTWF0Y2ggJiYgaWR4ICE9PSAtMSkpICYmICF0aGlzLmlzX2ZpbmlzaGVkKCkpIHtcblx0ICAgICAgICAgICAgdCArPSB0aGlzLmN1cnJlbnQoKTtcblx0ICAgICAgICAgICAgdGhpcy5mb3J3YXJkKCk7XG5cblx0ICAgICAgICAgICAgaWR4ID0gY2hhclN0cmluZy5pbmRleE9mKHRoaXMuY3VycmVudCgpKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gdDtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuICcnO1xuXHR9O1xuXG5cdFRva2VuaXplci5wcm90b3R5cGUuX2V4dHJhY3RSZWdleCA9IGZ1bmN0aW9uKHJlZ2V4KSB7XG5cdCAgICB2YXIgbWF0Y2hlcyA9IHRoaXMuY3VycmVudFN0cigpLm1hdGNoKHJlZ2V4KTtcblx0ICAgIGlmKCFtYXRjaGVzKSB7XG5cdCAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cblx0ICAgIC8vIE1vdmUgZm9yd2FyZCB3aGF0ZXZlciB3YXMgbWF0Y2hlZFxuXHQgICAgdGhpcy5mb3J3YXJkTihtYXRjaGVzWzBdLmxlbmd0aCk7XG5cblx0ICAgIHJldHVybiBtYXRjaGVzO1xuXHR9O1xuXG5cdFRva2VuaXplci5wcm90b3R5cGUuaXNfZmluaXNoZWQgPSBmdW5jdGlvbigpIHtcblx0ICAgIHJldHVybiB0aGlzLmluZGV4ID49IHRoaXMubGVuO1xuXHR9O1xuXG5cdFRva2VuaXplci5wcm90b3R5cGUuZm9yd2FyZE4gPSBmdW5jdGlvbihuKSB7XG5cdCAgICBmb3IodmFyIGk9MDsgaTxuOyBpKyspIHtcblx0ICAgICAgICB0aGlzLmZvcndhcmQoKTtcblx0ICAgIH1cblx0fTtcblxuXHRUb2tlbml6ZXIucHJvdG90eXBlLmZvcndhcmQgPSBmdW5jdGlvbigpIHtcblx0ICAgIHRoaXMuaW5kZXgrKztcblxuXHQgICAgaWYodGhpcy5wcmV2aW91cygpID09PSAnXFxuJykge1xuXHQgICAgICAgIHRoaXMubGluZW5vKys7XG5cdCAgICAgICAgdGhpcy5jb2xubyA9IDA7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICB0aGlzLmNvbG5vKys7XG5cdCAgICB9XG5cdH07XG5cblx0VG9rZW5pemVyLnByb3RvdHlwZS5iYWNrTiA9IGZ1bmN0aW9uKG4pIHtcblx0ICAgIGZvcih2YXIgaT0wOyBpPG47IGkrKykge1xuXHQgICAgICAgIHRoaXMuYmFjaygpO1xuXHQgICAgfVxuXHR9O1xuXG5cdFRva2VuaXplci5wcm90b3R5cGUuYmFjayA9IGZ1bmN0aW9uKCkge1xuXHQgICAgdGhpcy5pbmRleC0tO1xuXG5cdCAgICBpZih0aGlzLmN1cnJlbnQoKSA9PT0gJ1xcbicpIHtcblx0ICAgICAgICB0aGlzLmxpbmVuby0tO1xuXG5cdCAgICAgICAgdmFyIGlkeCA9IHRoaXMuc3JjLmxhc3RJbmRleE9mKCdcXG4nLCB0aGlzLmluZGV4LTEpO1xuXHQgICAgICAgIGlmKGlkeCA9PT0gLTEpIHtcblx0ICAgICAgICAgICAgdGhpcy5jb2xubyA9IHRoaXMuaW5kZXg7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICB0aGlzLmNvbG5vID0gdGhpcy5pbmRleCAtIGlkeDtcblx0ICAgICAgICB9XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICB0aGlzLmNvbG5vLS07XG5cdCAgICB9XG5cdH07XG5cblx0Ly8gY3VycmVudCByZXR1cm5zIGN1cnJlbnQgY2hhcmFjdGVyXG5cdFRva2VuaXplci5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uKCkge1xuXHQgICAgaWYoIXRoaXMuaXNfZmluaXNoZWQoKSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLnN0ci5jaGFyQXQodGhpcy5pbmRleCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gJyc7XG5cdH07XG5cblx0Ly8gY3VycmVudFN0ciByZXR1cm5zIHdoYXQncyBsZWZ0IG9mIHRoZSB1bnBhcnNlZCBzdHJpbmdcblx0VG9rZW5pemVyLnByb3RvdHlwZS5jdXJyZW50U3RyID0gZnVuY3Rpb24oKSB7XG5cdCAgICBpZighdGhpcy5pc19maW5pc2hlZCgpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuc3RyLnN1YnN0cih0aGlzLmluZGV4KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiAnJztcblx0fTtcblxuXHRUb2tlbml6ZXIucHJvdG90eXBlLnByZXZpb3VzID0gZnVuY3Rpb24oKSB7XG5cdCAgICByZXR1cm4gdGhpcy5zdHIuY2hhckF0KHRoaXMuaW5kZXgtMSk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgICBsZXg6IGZ1bmN0aW9uKHNyYywgb3B0cykge1xuXHQgICAgICAgIHJldHVybiBuZXcgVG9rZW5pemVyKHNyYywgb3B0cyk7XG5cdCAgICB9LFxuXG5cdCAgICBUT0tFTl9TVFJJTkc6IFRPS0VOX1NUUklORyxcblx0ICAgIFRPS0VOX1dISVRFU1BBQ0U6IFRPS0VOX1dISVRFU1BBQ0UsXG5cdCAgICBUT0tFTl9EQVRBOiBUT0tFTl9EQVRBLFxuXHQgICAgVE9LRU5fQkxPQ0tfU1RBUlQ6IFRPS0VOX0JMT0NLX1NUQVJULFxuXHQgICAgVE9LRU5fQkxPQ0tfRU5EOiBUT0tFTl9CTE9DS19FTkQsXG5cdCAgICBUT0tFTl9WQVJJQUJMRV9TVEFSVDogVE9LRU5fVkFSSUFCTEVfU1RBUlQsXG5cdCAgICBUT0tFTl9WQVJJQUJMRV9FTkQ6IFRPS0VOX1ZBUklBQkxFX0VORCxcblx0ICAgIFRPS0VOX0NPTU1FTlQ6IFRPS0VOX0NPTU1FTlQsXG5cdCAgICBUT0tFTl9MRUZUX1BBUkVOOiBUT0tFTl9MRUZUX1BBUkVOLFxuXHQgICAgVE9LRU5fUklHSFRfUEFSRU46IFRPS0VOX1JJR0hUX1BBUkVOLFxuXHQgICAgVE9LRU5fTEVGVF9CUkFDS0VUOiBUT0tFTl9MRUZUX0JSQUNLRVQsXG5cdCAgICBUT0tFTl9SSUdIVF9CUkFDS0VUOiBUT0tFTl9SSUdIVF9CUkFDS0VULFxuXHQgICAgVE9LRU5fTEVGVF9DVVJMWTogVE9LRU5fTEVGVF9DVVJMWSxcblx0ICAgIFRPS0VOX1JJR0hUX0NVUkxZOiBUT0tFTl9SSUdIVF9DVVJMWSxcblx0ICAgIFRPS0VOX09QRVJBVE9SOiBUT0tFTl9PUEVSQVRPUixcblx0ICAgIFRPS0VOX0NPTU1BOiBUT0tFTl9DT01NQSxcblx0ICAgIFRPS0VOX0NPTE9OOiBUT0tFTl9DT0xPTixcblx0ICAgIFRPS0VOX1RJTERFOiBUT0tFTl9USUxERSxcblx0ICAgIFRPS0VOX1BJUEU6IFRPS0VOX1BJUEUsXG5cdCAgICBUT0tFTl9JTlQ6IFRPS0VOX0lOVCxcblx0ICAgIFRPS0VOX0ZMT0FUOiBUT0tFTl9GTE9BVCxcblx0ICAgIFRPS0VOX0JPT0xFQU46IFRPS0VOX0JPT0xFQU4sXG5cdCAgICBUT0tFTl9OT05FOiBUT0tFTl9OT05FLFxuXHQgICAgVE9LRU5fU1lNQk9MOiBUT0tFTl9TWU1CT0wsXG5cdCAgICBUT0tFTl9TUEVDSUFMOiBUT0tFTl9TUEVDSUFMLFxuXHQgICAgVE9LRU5fUkVHRVg6IFRPS0VOX1JFR0VYXG5cdH07XG5cblxuLyoqKi8gfSksXG4vKiAxMCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qIFdFQlBBQ0sgVkFSIElOSkVDVElPTiAqLyhmdW5jdGlvbihwcm9jZXNzKSB7J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBsaWIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHQvLyBqc2hpbnQgLVcwNzlcblx0dmFyIE9iamVjdCA9IF9fd2VicGFja19yZXF1aXJlX18oNik7XG5cblx0ZnVuY3Rpb24gdHJhdmVyc2VBbmRDaGVjayhvYmosIHR5cGUsIHJlc3VsdHMpIHtcblx0ICAgIGlmKG9iaiBpbnN0YW5jZW9mIHR5cGUpIHtcblx0ICAgICAgICByZXN1bHRzLnB1c2gob2JqKTtcblx0ICAgIH1cblxuXHQgICAgaWYob2JqIGluc3RhbmNlb2YgTm9kZSkge1xuXHQgICAgICAgIG9iai5maW5kQWxsKHR5cGUsIHJlc3VsdHMpO1xuXHQgICAgfVxuXHR9XG5cblx0dmFyIE5vZGUgPSBPYmplY3QuZXh0ZW5kKCdOb2RlJywge1xuXHQgICAgaW5pdDogZnVuY3Rpb24obGluZW5vLCBjb2xubykge1xuXHQgICAgICAgIHRoaXMubGluZW5vID0gbGluZW5vO1xuXHQgICAgICAgIHRoaXMuY29sbm8gPSBjb2xubztcblxuXHQgICAgICAgIHZhciBmaWVsZHMgPSB0aGlzLmZpZWxkcztcblx0ICAgICAgICBmb3IodmFyIGkgPSAwLCBsID0gZmllbGRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICAgICAgICB2YXIgZmllbGQgPSBmaWVsZHNbaV07XG5cblx0ICAgICAgICAgICAgLy8gVGhlIGZpcnN0IHR3byBhcmdzIGFyZSBsaW5lL2NvbCBudW1iZXJzLCBzbyBvZmZzZXQgYnkgMlxuXHQgICAgICAgICAgICB2YXIgdmFsID0gYXJndW1lbnRzW2kgKyAyXTtcblxuXHQgICAgICAgICAgICAvLyBGaWVsZHMgc2hvdWxkIG5ldmVyIGJlIHVuZGVmaW5lZCwgYnV0IG51bGwuIEl0IG1ha2VzXG5cdCAgICAgICAgICAgIC8vIHRlc3RpbmcgZWFzaWVyIHRvIG5vcm1hbGl6ZSB2YWx1ZXMuXG5cdCAgICAgICAgICAgIGlmKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgICB2YWwgPSBudWxsO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdGhpc1tmaWVsZF0gPSB2YWw7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgZmluZEFsbDogZnVuY3Rpb24odHlwZSwgcmVzdWx0cykge1xuXHQgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXG5cdCAgICAgICAgdmFyIGksIGw7XG5cdCAgICAgICAgaWYodGhpcyBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG5cdCAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG5cblx0ICAgICAgICAgICAgZm9yKGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICB0cmF2ZXJzZUFuZENoZWNrKGNoaWxkcmVuW2ldLCB0eXBlLCByZXN1bHRzKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdmFyIGZpZWxkcyA9IHRoaXMuZmllbGRzO1xuXG5cdCAgICAgICAgICAgIGZvcihpID0gMCwgbCA9IGZpZWxkcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHRyYXZlcnNlQW5kQ2hlY2sodGhpc1tmaWVsZHNbaV1dLCB0eXBlLCByZXN1bHRzKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiByZXN1bHRzO1xuXHQgICAgfSxcblxuXHQgICAgaXRlckZpZWxkczogZnVuY3Rpb24oZnVuYykge1xuXHQgICAgICAgIGxpYi5lYWNoKHRoaXMuZmllbGRzLCBmdW5jdGlvbihmaWVsZCkge1xuXHQgICAgICAgICAgICBmdW5jKHRoaXNbZmllbGRdLCBmaWVsZCk7XG5cdCAgICAgICAgfSwgdGhpcyk7XG5cdCAgICB9XG5cdH0pO1xuXG5cdC8vIEFic3RyYWN0IG5vZGVzXG5cdHZhciBWYWx1ZSA9IE5vZGUuZXh0ZW5kKCdWYWx1ZScsIHsgZmllbGRzOiBbJ3ZhbHVlJ10gfSk7XG5cblx0Ly8gQ29uY3JldGUgbm9kZXNcblx0dmFyIE5vZGVMaXN0ID0gTm9kZS5leHRlbmQoJ05vZGVMaXN0Jywge1xuXHQgICAgZmllbGRzOiBbJ2NoaWxkcmVuJ10sXG5cblx0ICAgIGluaXQ6IGZ1bmN0aW9uKGxpbmVubywgY29sbm8sIG5vZGVzKSB7XG5cdCAgICAgICAgdGhpcy5wYXJlbnQobGluZW5vLCBjb2xubywgbm9kZXMgfHwgW10pO1xuXHQgICAgfSxcblxuXHQgICAgYWRkQ2hpbGQ6IGZ1bmN0aW9uKG5vZGUpIHtcblx0ICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2gobm9kZSk7XG5cdCAgICB9XG5cdH0pO1xuXG5cdHZhciBSb290ID0gTm9kZUxpc3QuZXh0ZW5kKCdSb290Jyk7XG5cdHZhciBMaXRlcmFsID0gVmFsdWUuZXh0ZW5kKCdMaXRlcmFsJyk7XG5cdHZhciBTeW1ib2wgPSBWYWx1ZS5leHRlbmQoJ1N5bWJvbCcpO1xuXHR2YXIgR3JvdXAgPSBOb2RlTGlzdC5leHRlbmQoJ0dyb3VwJyk7XG5cdHZhciBBcnJheSA9IE5vZGVMaXN0LmV4dGVuZCgnQXJyYXknKTtcblx0dmFyIFBhaXIgPSBOb2RlLmV4dGVuZCgnUGFpcicsIHsgZmllbGRzOiBbJ2tleScsICd2YWx1ZSddIH0pO1xuXHR2YXIgRGljdCA9IE5vZGVMaXN0LmV4dGVuZCgnRGljdCcpO1xuXHR2YXIgTG9va3VwVmFsID0gTm9kZS5leHRlbmQoJ0xvb2t1cFZhbCcsIHsgZmllbGRzOiBbJ3RhcmdldCcsICd2YWwnXSB9KTtcblx0dmFyIElmID0gTm9kZS5leHRlbmQoJ0lmJywgeyBmaWVsZHM6IFsnY29uZCcsICdib2R5JywgJ2Vsc2VfJ10gfSk7XG5cdHZhciBJZkFzeW5jID0gSWYuZXh0ZW5kKCdJZkFzeW5jJyk7XG5cdHZhciBJbmxpbmVJZiA9IE5vZGUuZXh0ZW5kKCdJbmxpbmVJZicsIHsgZmllbGRzOiBbJ2NvbmQnLCAnYm9keScsICdlbHNlXyddIH0pO1xuXHR2YXIgRm9yID0gTm9kZS5leHRlbmQoJ0ZvcicsIHsgZmllbGRzOiBbJ2FycicsICduYW1lJywgJ2JvZHknLCAnZWxzZV8nXSB9KTtcblx0dmFyIEFzeW5jRWFjaCA9IEZvci5leHRlbmQoJ0FzeW5jRWFjaCcpO1xuXHR2YXIgQXN5bmNBbGwgPSBGb3IuZXh0ZW5kKCdBc3luY0FsbCcpO1xuXHR2YXIgTWFjcm8gPSBOb2RlLmV4dGVuZCgnTWFjcm8nLCB7IGZpZWxkczogWyduYW1lJywgJ2FyZ3MnLCAnYm9keSddIH0pO1xuXHR2YXIgQ2FsbGVyID0gTWFjcm8uZXh0ZW5kKCdDYWxsZXInKTtcblx0dmFyIEltcG9ydCA9IE5vZGUuZXh0ZW5kKCdJbXBvcnQnLCB7IGZpZWxkczogWyd0ZW1wbGF0ZScsICd0YXJnZXQnLCAnd2l0aENvbnRleHQnXSB9KTtcblx0dmFyIEZyb21JbXBvcnQgPSBOb2RlLmV4dGVuZCgnRnJvbUltcG9ydCcsIHtcblx0ICAgIGZpZWxkczogWyd0ZW1wbGF0ZScsICduYW1lcycsICd3aXRoQ29udGV4dCddLFxuXG5cdCAgICBpbml0OiBmdW5jdGlvbihsaW5lbm8sIGNvbG5vLCB0ZW1wbGF0ZSwgbmFtZXMsIHdpdGhDb250ZXh0KSB7XG5cdCAgICAgICAgdGhpcy5wYXJlbnQobGluZW5vLCBjb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSxcblx0ICAgICAgICAgICAgICAgICAgICBuYW1lcyB8fCBuZXcgTm9kZUxpc3QoKSwgd2l0aENvbnRleHQpO1xuXHQgICAgfVxuXHR9KTtcblx0dmFyIEZ1bkNhbGwgPSBOb2RlLmV4dGVuZCgnRnVuQ2FsbCcsIHsgZmllbGRzOiBbJ25hbWUnLCAnYXJncyddIH0pO1xuXHR2YXIgRmlsdGVyID0gRnVuQ2FsbC5leHRlbmQoJ0ZpbHRlcicpO1xuXHR2YXIgRmlsdGVyQXN5bmMgPSBGaWx0ZXIuZXh0ZW5kKCdGaWx0ZXJBc3luYycsIHtcblx0ICAgIGZpZWxkczogWyduYW1lJywgJ2FyZ3MnLCAnc3ltYm9sJ11cblx0fSk7XG5cdHZhciBLZXl3b3JkQXJncyA9IERpY3QuZXh0ZW5kKCdLZXl3b3JkQXJncycpO1xuXHR2YXIgQmxvY2sgPSBOb2RlLmV4dGVuZCgnQmxvY2snLCB7IGZpZWxkczogWyduYW1lJywgJ2JvZHknXSB9KTtcblx0dmFyIFN1cGVyID0gTm9kZS5leHRlbmQoJ1N1cGVyJywgeyBmaWVsZHM6IFsnYmxvY2tOYW1lJywgJ3N5bWJvbCddIH0pO1xuXHR2YXIgVGVtcGxhdGVSZWYgPSBOb2RlLmV4dGVuZCgnVGVtcGxhdGVSZWYnLCB7IGZpZWxkczogWyd0ZW1wbGF0ZSddIH0pO1xuXHR2YXIgRXh0ZW5kcyA9IFRlbXBsYXRlUmVmLmV4dGVuZCgnRXh0ZW5kcycpO1xuXHR2YXIgSW5jbHVkZSA9IE5vZGUuZXh0ZW5kKCdJbmNsdWRlJywgeyBmaWVsZHM6IFsndGVtcGxhdGUnLCAnaWdub3JlTWlzc2luZyddIH0pO1xuXHR2YXIgU2V0ID0gTm9kZS5leHRlbmQoJ1NldCcsIHsgZmllbGRzOiBbJ3RhcmdldHMnLCAndmFsdWUnXSB9KTtcblx0dmFyIE91dHB1dCA9IE5vZGVMaXN0LmV4dGVuZCgnT3V0cHV0Jyk7XG5cdHZhciBDYXB0dXJlID0gTm9kZS5leHRlbmQoJ0NhcHR1cmUnLCB7IGZpZWxkczogWydib2R5J10gfSk7XG5cdHZhciBUZW1wbGF0ZURhdGEgPSBMaXRlcmFsLmV4dGVuZCgnVGVtcGxhdGVEYXRhJyk7XG5cdHZhciBVbmFyeU9wID0gTm9kZS5leHRlbmQoJ1VuYXJ5T3AnLCB7IGZpZWxkczogWyd0YXJnZXQnXSB9KTtcblx0dmFyIEJpbk9wID0gTm9kZS5leHRlbmQoJ0Jpbk9wJywgeyBmaWVsZHM6IFsnbGVmdCcsICdyaWdodCddIH0pO1xuXHR2YXIgSW4gPSBCaW5PcC5leHRlbmQoJ0luJyk7XG5cdHZhciBPciA9IEJpbk9wLmV4dGVuZCgnT3InKTtcblx0dmFyIEFuZCA9IEJpbk9wLmV4dGVuZCgnQW5kJyk7XG5cdHZhciBOb3QgPSBVbmFyeU9wLmV4dGVuZCgnTm90Jyk7XG5cdHZhciBBZGQgPSBCaW5PcC5leHRlbmQoJ0FkZCcpO1xuXHR2YXIgQ29uY2F0ID0gQmluT3AuZXh0ZW5kKCdDb25jYXQnKTtcblx0dmFyIFN1YiA9IEJpbk9wLmV4dGVuZCgnU3ViJyk7XG5cdHZhciBNdWwgPSBCaW5PcC5leHRlbmQoJ011bCcpO1xuXHR2YXIgRGl2ID0gQmluT3AuZXh0ZW5kKCdEaXYnKTtcblx0dmFyIEZsb29yRGl2ID0gQmluT3AuZXh0ZW5kKCdGbG9vckRpdicpO1xuXHR2YXIgTW9kID0gQmluT3AuZXh0ZW5kKCdNb2QnKTtcblx0dmFyIFBvdyA9IEJpbk9wLmV4dGVuZCgnUG93Jyk7XG5cdHZhciBOZWcgPSBVbmFyeU9wLmV4dGVuZCgnTmVnJyk7XG5cdHZhciBQb3MgPSBVbmFyeU9wLmV4dGVuZCgnUG9zJyk7XG5cdHZhciBDb21wYXJlID0gTm9kZS5leHRlbmQoJ0NvbXBhcmUnLCB7IGZpZWxkczogWydleHByJywgJ29wcyddIH0pO1xuXHR2YXIgQ29tcGFyZU9wZXJhbmQgPSBOb2RlLmV4dGVuZCgnQ29tcGFyZU9wZXJhbmQnLCB7XG5cdCAgICBmaWVsZHM6IFsnZXhwcicsICd0eXBlJ11cblx0fSk7XG5cblx0dmFyIENhbGxFeHRlbnNpb24gPSBOb2RlLmV4dGVuZCgnQ2FsbEV4dGVuc2lvbicsIHtcblx0ICAgIGZpZWxkczogWydleHROYW1lJywgJ3Byb3AnLCAnYXJncycsICdjb250ZW50QXJncyddLFxuXG5cdCAgICBpbml0OiBmdW5jdGlvbihleHQsIHByb3AsIGFyZ3MsIGNvbnRlbnRBcmdzKSB7XG5cdCAgICAgICAgdGhpcy5leHROYW1lID0gZXh0Ll9uYW1lIHx8IGV4dDtcblx0ICAgICAgICB0aGlzLnByb3AgPSBwcm9wO1xuXHQgICAgICAgIHRoaXMuYXJncyA9IGFyZ3MgfHwgbmV3IE5vZGVMaXN0KCk7XG5cdCAgICAgICAgdGhpcy5jb250ZW50QXJncyA9IGNvbnRlbnRBcmdzIHx8IFtdO1xuXHQgICAgICAgIHRoaXMuYXV0b2VzY2FwZSA9IGV4dC5hdXRvZXNjYXBlO1xuXHQgICAgfVxuXHR9KTtcblxuXHR2YXIgQ2FsbEV4dGVuc2lvbkFzeW5jID0gQ2FsbEV4dGVuc2lvbi5leHRlbmQoJ0NhbGxFeHRlbnNpb25Bc3luYycpO1xuXG5cdC8vIFByaW50IHRoZSBBU1QgaW4gYSBuaWNlbHkgZm9ybWF0dGVkIHRyZWUgZm9ybWF0IGZvciBkZWJ1Z2dpblxuXHRmdW5jdGlvbiBwcmludE5vZGVzKG5vZGUsIGluZGVudCkge1xuXHQgICAgaW5kZW50ID0gaW5kZW50IHx8IDA7XG5cblx0ICAgIC8vIFRoaXMgaXMgaGFja3ksIGJ1dCB0aGlzIGlzIGp1c3QgYSBkZWJ1Z2dpbmcgZnVuY3Rpb24gYW55d2F5XG5cdCAgICBmdW5jdGlvbiBwcmludChzdHIsIGluZGVudCwgaW5saW5lKSB7XG5cdCAgICAgICAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKTtcblxuXHQgICAgICAgIGZvcih2YXIgaT0wOyBpPGxpbmVzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIGlmKGxpbmVzW2ldKSB7XG5cdCAgICAgICAgICAgICAgICBpZigoaW5saW5lICYmIGkgPiAwKSB8fCAhaW5saW5lKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBqPTA7IGo8aW5kZW50OyBqKyspIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJyAnKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBpZihpID09PSBsaW5lcy5sZW5ndGgtMSkge1xuXHQgICAgICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUobGluZXNbaV0pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUobGluZXNbaV0gKyAnXFxuJyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHByaW50KG5vZGUudHlwZW5hbWUgKyAnOiAnLCBpbmRlbnQpO1xuXG5cdCAgICBpZihub2RlIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcblx0ICAgICAgICBwcmludCgnXFxuJyk7XG5cdCAgICAgICAgbGliLmVhY2gobm9kZS5jaGlsZHJlbiwgZnVuY3Rpb24obikge1xuXHQgICAgICAgICAgICBwcmludE5vZGVzKG4sIGluZGVudCArIDIpO1xuXHQgICAgICAgIH0pO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZihub2RlIGluc3RhbmNlb2YgQ2FsbEV4dGVuc2lvbikge1xuXHQgICAgICAgIHByaW50KG5vZGUuZXh0TmFtZSArICcuJyArIG5vZGUucHJvcCk7XG5cdCAgICAgICAgcHJpbnQoJ1xcbicpO1xuXG5cdCAgICAgICAgaWYobm9kZS5hcmdzKSB7XG5cdCAgICAgICAgICAgIHByaW50Tm9kZXMobm9kZS5hcmdzLCBpbmRlbnQgKyAyKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZihub2RlLmNvbnRlbnRBcmdzKSB7XG5cdCAgICAgICAgICAgIGxpYi5lYWNoKG5vZGUuY29udGVudEFyZ3MsIGZ1bmN0aW9uKG4pIHtcblx0ICAgICAgICAgICAgICAgIHByaW50Tm9kZXMobiwgaW5kZW50ICsgMik7XG5cdCAgICAgICAgICAgIH0pO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIHZhciBub2RlcyA9IG51bGw7XG5cdCAgICAgICAgdmFyIHByb3BzID0gbnVsbDtcblxuXHQgICAgICAgIG5vZGUuaXRlckZpZWxkcyhmdW5jdGlvbih2YWwsIGZpZWxkKSB7XG5cdCAgICAgICAgICAgIGlmKHZhbCBpbnN0YW5jZW9mIE5vZGUpIHtcblx0ICAgICAgICAgICAgICAgIG5vZGVzID0gbm9kZXMgfHwge307XG5cdCAgICAgICAgICAgICAgICBub2Rlc1tmaWVsZF0gPSB2YWw7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xuXHQgICAgICAgICAgICAgICAgcHJvcHNbZmllbGRdID0gdmFsO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICBpZihwcm9wcykge1xuXHQgICAgICAgICAgICBwcmludChKU09OLnN0cmluZ2lmeShwcm9wcywgbnVsbCwgMikgKyAnXFxuJywgbnVsbCwgdHJ1ZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICBwcmludCgnXFxuJyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYobm9kZXMpIHtcblx0ICAgICAgICAgICAgZm9yKHZhciBrIGluIG5vZGVzKSB7XG5cdCAgICAgICAgICAgICAgICBwcmludE5vZGVzKG5vZGVzW2tdLCBpbmRlbnQgKyAyKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgfVxuXHR9XG5cblx0Ly8gdmFyIHQgPSBuZXcgTm9kZUxpc3QoMCwgMCxcblx0Ly8gICAgICAgICAgICAgICAgICAgICAgW25ldyBWYWx1ZSgwLCAwLCAzKSxcblx0Ly8gICAgICAgICAgICAgICAgICAgICAgIG5ldyBWYWx1ZSgwLCAwLCAxMCksXG5cdC8vICAgICAgICAgICAgICAgICAgICAgICBuZXcgUGFpcigwLCAwLFxuXHQvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZhbHVlKDAsIDAsICdrZXknKSxcblx0Ly8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWYWx1ZSgwLCAwLCAndmFsdWUnKSldKTtcblx0Ly8gcHJpbnROb2Rlcyh0KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0ICAgIE5vZGU6IE5vZGUsXG5cdCAgICBSb290OiBSb290LFxuXHQgICAgTm9kZUxpc3Q6IE5vZGVMaXN0LFxuXHQgICAgVmFsdWU6IFZhbHVlLFxuXHQgICAgTGl0ZXJhbDogTGl0ZXJhbCxcblx0ICAgIFN5bWJvbDogU3ltYm9sLFxuXHQgICAgR3JvdXA6IEdyb3VwLFxuXHQgICAgQXJyYXk6IEFycmF5LFxuXHQgICAgUGFpcjogUGFpcixcblx0ICAgIERpY3Q6IERpY3QsXG5cdCAgICBPdXRwdXQ6IE91dHB1dCxcblx0ICAgIENhcHR1cmU6IENhcHR1cmUsXG5cdCAgICBUZW1wbGF0ZURhdGE6IFRlbXBsYXRlRGF0YSxcblx0ICAgIElmOiBJZixcblx0ICAgIElmQXN5bmM6IElmQXN5bmMsXG5cdCAgICBJbmxpbmVJZjogSW5saW5lSWYsXG5cdCAgICBGb3I6IEZvcixcblx0ICAgIEFzeW5jRWFjaDogQXN5bmNFYWNoLFxuXHQgICAgQXN5bmNBbGw6IEFzeW5jQWxsLFxuXHQgICAgTWFjcm86IE1hY3JvLFxuXHQgICAgQ2FsbGVyOiBDYWxsZXIsXG5cdCAgICBJbXBvcnQ6IEltcG9ydCxcblx0ICAgIEZyb21JbXBvcnQ6IEZyb21JbXBvcnQsXG5cdCAgICBGdW5DYWxsOiBGdW5DYWxsLFxuXHQgICAgRmlsdGVyOiBGaWx0ZXIsXG5cdCAgICBGaWx0ZXJBc3luYzogRmlsdGVyQXN5bmMsXG5cdCAgICBLZXl3b3JkQXJnczogS2V5d29yZEFyZ3MsXG5cdCAgICBCbG9jazogQmxvY2ssXG5cdCAgICBTdXBlcjogU3VwZXIsXG5cdCAgICBFeHRlbmRzOiBFeHRlbmRzLFxuXHQgICAgSW5jbHVkZTogSW5jbHVkZSxcblx0ICAgIFNldDogU2V0LFxuXHQgICAgTG9va3VwVmFsOiBMb29rdXBWYWwsXG5cdCAgICBCaW5PcDogQmluT3AsXG5cdCAgICBJbjogSW4sXG5cdCAgICBPcjogT3IsXG5cdCAgICBBbmQ6IEFuZCxcblx0ICAgIE5vdDogTm90LFxuXHQgICAgQWRkOiBBZGQsXG5cdCAgICBDb25jYXQ6IENvbmNhdCxcblx0ICAgIFN1YjogU3ViLFxuXHQgICAgTXVsOiBNdWwsXG5cdCAgICBEaXY6IERpdixcblx0ICAgIEZsb29yRGl2OiBGbG9vckRpdixcblx0ICAgIE1vZDogTW9kLFxuXHQgICAgUG93OiBQb3csXG5cdCAgICBOZWc6IE5lZyxcblx0ICAgIFBvczogUG9zLFxuXHQgICAgQ29tcGFyZTogQ29tcGFyZSxcblx0ICAgIENvbXBhcmVPcGVyYW5kOiBDb21wYXJlT3BlcmFuZCxcblxuXHQgICAgQ2FsbEV4dGVuc2lvbjogQ2FsbEV4dGVuc2lvbixcblx0ICAgIENhbGxFeHRlbnNpb25Bc3luYzogQ2FsbEV4dGVuc2lvbkFzeW5jLFxuXG5cdCAgICBwcmludE5vZGVzOiBwcmludE5vZGVzXG5cdH07XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMTEpKSlcblxuLyoqKi8gfSksXG4vKiAxMSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFxuXG4vKioqLyB9KSxcbi8qIDEyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBub2RlcyA9IF9fd2VicGFja19yZXF1aXJlX18oMTApO1xuXHR2YXIgbGliID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblxuXHR2YXIgc3ltID0gMDtcblx0ZnVuY3Rpb24gZ2Vuc3ltKCkge1xuXHQgICAgcmV0dXJuICdob2xlXycgKyBzeW0rKztcblx0fVxuXG5cdC8vIGNvcHktb24td3JpdGUgdmVyc2lvbiBvZiBtYXBcblx0ZnVuY3Rpb24gbWFwQ09XKGFyciwgZnVuYykge1xuXHQgICAgdmFyIHJlcyA9IG51bGw7XG5cblx0ICAgIGZvcih2YXIgaT0wOyBpPGFyci5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgIHZhciBpdGVtID0gZnVuYyhhcnJbaV0pO1xuXG5cdCAgICAgICAgaWYoaXRlbSAhPT0gYXJyW2ldKSB7XG5cdCAgICAgICAgICAgIGlmKCFyZXMpIHtcblx0ICAgICAgICAgICAgICAgIHJlcyA9IGFyci5zbGljZSgpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmVzW2ldID0gaXRlbTtcblx0ICAgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiByZXMgfHwgYXJyO1xuXHR9XG5cblx0ZnVuY3Rpb24gd2Fsayhhc3QsIGZ1bmMsIGRlcHRoRmlyc3QpIHtcblx0ICAgIGlmKCEoYXN0IGluc3RhbmNlb2Ygbm9kZXMuTm9kZSkpIHtcblx0ICAgICAgICByZXR1cm4gYXN0O1xuXHQgICAgfVxuXG5cdCAgICBpZighZGVwdGhGaXJzdCkge1xuXHQgICAgICAgIHZhciBhc3RUID0gZnVuYyhhc3QpO1xuXG5cdCAgICAgICAgaWYoYXN0VCAmJiBhc3RUICE9PSBhc3QpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGFzdFQ7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBpZihhc3QgaW5zdGFuY2VvZiBub2Rlcy5Ob2RlTGlzdCkge1xuXHQgICAgICAgIHZhciBjaGlsZHJlbiA9IG1hcENPVyhhc3QuY2hpbGRyZW4sIGZ1bmN0aW9uKG5vZGUpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHdhbGsobm9kZSwgZnVuYywgZGVwdGhGaXJzdCk7XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICBpZihjaGlsZHJlbiAhPT0gYXN0LmNoaWxkcmVuKSB7XG5cdCAgICAgICAgICAgIGFzdCA9IG5ldyBub2Rlc1thc3QudHlwZW5hbWVdKGFzdC5saW5lbm8sIGFzdC5jb2xubywgY2hpbGRyZW4pO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIGVsc2UgaWYoYXN0IGluc3RhbmNlb2Ygbm9kZXMuQ2FsbEV4dGVuc2lvbikge1xuXHQgICAgICAgIHZhciBhcmdzID0gd2Fsayhhc3QuYXJncywgZnVuYywgZGVwdGhGaXJzdCk7XG5cblx0ICAgICAgICB2YXIgY29udGVudEFyZ3MgPSBtYXBDT1coYXN0LmNvbnRlbnRBcmdzLCBmdW5jdGlvbihub2RlKSB7XG5cdCAgICAgICAgICAgIHJldHVybiB3YWxrKG5vZGUsIGZ1bmMsIGRlcHRoRmlyc3QpO1xuXHQgICAgICAgIH0pO1xuXG5cdCAgICAgICAgaWYoYXJncyAhPT0gYXN0LmFyZ3MgfHwgY29udGVudEFyZ3MgIT09IGFzdC5jb250ZW50QXJncykge1xuXHQgICAgICAgICAgICBhc3QgPSBuZXcgbm9kZXNbYXN0LnR5cGVuYW1lXShhc3QuZXh0TmFtZSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN0LnByb3AsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRBcmdzKTtcblx0ICAgICAgICB9XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICB2YXIgcHJvcHMgPSBhc3QuZmllbGRzLm1hcChmdW5jdGlvbihmaWVsZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gYXN0W2ZpZWxkXTtcblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHZhciBwcm9wc1QgPSBtYXBDT1cocHJvcHMsIGZ1bmN0aW9uKHByb3ApIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHdhbGsocHJvcCwgZnVuYywgZGVwdGhGaXJzdCk7XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICBpZihwcm9wc1QgIT09IHByb3BzKSB7XG5cdCAgICAgICAgICAgIGFzdCA9IG5ldyBub2Rlc1thc3QudHlwZW5hbWVdKGFzdC5saW5lbm8sIGFzdC5jb2xubyk7XG5cblx0ICAgICAgICAgICAgcHJvcHNULmZvckVhY2goZnVuY3Rpb24ocHJvcCwgaSkge1xuXHQgICAgICAgICAgICAgICAgYXN0W2FzdC5maWVsZHNbaV1dID0gcHJvcDtcblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gZGVwdGhGaXJzdCA/IChmdW5jKGFzdCkgfHwgYXN0KSA6IGFzdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGRlcHRoV2Fsayhhc3QsIGZ1bmMpIHtcblx0ICAgIHJldHVybiB3YWxrKGFzdCwgZnVuYywgdHJ1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBfbGlmdEZpbHRlcnMobm9kZSwgYXN5bmNGaWx0ZXJzLCBwcm9wKSB7XG5cdCAgICB2YXIgY2hpbGRyZW4gPSBbXTtcblxuXHQgICAgdmFyIHdhbGtlZCA9IGRlcHRoV2Fsayhwcm9wID8gbm9kZVtwcm9wXSA6IG5vZGUsIGZ1bmN0aW9uKG5vZGUpIHtcblx0ICAgICAgICBpZihub2RlIGluc3RhbmNlb2Ygbm9kZXMuQmxvY2spIHtcblx0ICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYoKG5vZGUgaW5zdGFuY2VvZiBub2Rlcy5GaWx0ZXIgJiZcblx0ICAgICAgICAgICAgICAgICBsaWIuaW5kZXhPZihhc3luY0ZpbHRlcnMsIG5vZGUubmFtZS52YWx1ZSkgIT09IC0xKSB8fFxuXHQgICAgICAgICAgICAgICAgbm9kZSBpbnN0YW5jZW9mIG5vZGVzLkNhbGxFeHRlbnNpb25Bc3luYykge1xuXHQgICAgICAgICAgICB2YXIgc3ltYm9sID0gbmV3IG5vZGVzLlN5bWJvbChub2RlLmxpbmVubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2Vuc3ltKCkpO1xuXG5cdCAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobmV3IG5vZGVzLkZpbHRlckFzeW5jKG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLm5hbWUsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuYXJncyxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sKSk7XG5cdCAgICAgICAgICAgIHJldHVybiBzeW1ib2w7XG5cdCAgICAgICAgfVxuXHQgICAgfSk7XG5cblx0ICAgIGlmKHByb3ApIHtcblx0ICAgICAgICBub2RlW3Byb3BdID0gd2Fsa2VkO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgbm9kZSA9IHdhbGtlZDtcblx0ICAgIH1cblxuXHQgICAgaWYoY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdCAgICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcblxuXHQgICAgICAgIHJldHVybiBuZXcgbm9kZXMuTm9kZUxpc3QoXG5cdCAgICAgICAgICAgIG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICBub2RlLmNvbG5vLFxuXHQgICAgICAgICAgICBjaGlsZHJlblxuXHQgICAgICAgICk7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIGxpZnRGaWx0ZXJzKGFzdCwgYXN5bmNGaWx0ZXJzKSB7XG5cdCAgICByZXR1cm4gZGVwdGhXYWxrKGFzdCwgZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgIGlmKG5vZGUgaW5zdGFuY2VvZiBub2Rlcy5PdXRwdXQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIF9saWZ0RmlsdGVycyhub2RlLCBhc3luY0ZpbHRlcnMpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKG5vZGUgaW5zdGFuY2VvZiBub2Rlcy5TZXQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIF9saWZ0RmlsdGVycyhub2RlLCBhc3luY0ZpbHRlcnMsICd2YWx1ZScpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKG5vZGUgaW5zdGFuY2VvZiBub2Rlcy5Gb3IpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIF9saWZ0RmlsdGVycyhub2RlLCBhc3luY0ZpbHRlcnMsICdhcnInKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZihub2RlIGluc3RhbmNlb2Ygbm9kZXMuSWYpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIF9saWZ0RmlsdGVycyhub2RlLCBhc3luY0ZpbHRlcnMsICdjb25kJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYobm9kZSBpbnN0YW5jZW9mIG5vZGVzLkNhbGxFeHRlbnNpb24pIHtcblx0ICAgICAgICAgICAgcmV0dXJuIF9saWZ0RmlsdGVycyhub2RlLCBhc3luY0ZpbHRlcnMsICdhcmdzJyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSk7XG5cdH1cblxuXHRmdW5jdGlvbiBsaWZ0U3VwZXIoYXN0KSB7XG5cdCAgICByZXR1cm4gd2Fsayhhc3QsIGZ1bmN0aW9uKGJsb2NrTm9kZSkge1xuXHQgICAgICAgIGlmKCEoYmxvY2tOb2RlIGluc3RhbmNlb2Ygbm9kZXMuQmxvY2spKSB7XG5cdCAgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgaGFzU3VwZXIgPSBmYWxzZTtcblx0ICAgICAgICB2YXIgc3ltYm9sID0gZ2Vuc3ltKCk7XG5cblx0ICAgICAgICBibG9ja05vZGUuYm9keSA9IHdhbGsoYmxvY2tOb2RlLmJvZHksIGZ1bmN0aW9uKG5vZGUpIHtcblx0ICAgICAgICAgICAgaWYobm9kZSBpbnN0YW5jZW9mIG5vZGVzLkZ1bkNhbGwgJiZcblx0ICAgICAgICAgICAgICAgbm9kZS5uYW1lLnZhbHVlID09PSAnc3VwZXInKSB7XG5cdCAgICAgICAgICAgICAgICBoYXNTdXBlciA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbmV3IG5vZGVzLlN5bWJvbChub2RlLmxpbmVubywgbm9kZS5jb2xubywgc3ltYm9sKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXG5cdCAgICAgICAgaWYoaGFzU3VwZXIpIHtcblx0ICAgICAgICAgICAgYmxvY2tOb2RlLmJvZHkuY2hpbGRyZW4udW5zaGlmdChuZXcgbm9kZXMuU3VwZXIoXG5cdCAgICAgICAgICAgICAgICAwLCAwLCBibG9ja05vZGUubmFtZSwgbmV3IG5vZGVzLlN5bWJvbCgwLCAwLCBzeW1ib2wpXG5cdCAgICAgICAgICAgICkpO1xuXHQgICAgICAgIH1cblx0ICAgIH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gY29udmVydFN0YXRlbWVudHMoYXN0KSB7XG5cdCAgICByZXR1cm4gZGVwdGhXYWxrKGFzdCwgZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgIGlmKCEobm9kZSBpbnN0YW5jZW9mIG5vZGVzLklmKSAmJlxuXHQgICAgICAgICAgICEobm9kZSBpbnN0YW5jZW9mIG5vZGVzLkZvcikpIHtcblx0ICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBhc3luYyA9IGZhbHNlO1xuXHQgICAgICAgIHdhbGsobm9kZSwgZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgICAgICBpZihub2RlIGluc3RhbmNlb2Ygbm9kZXMuRmlsdGVyQXN5bmMgfHxcblx0ICAgICAgICAgICAgICAgbm9kZSBpbnN0YW5jZW9mIG5vZGVzLklmQXN5bmMgfHxcblx0ICAgICAgICAgICAgICAgbm9kZSBpbnN0YW5jZW9mIG5vZGVzLkFzeW5jRWFjaCB8fFxuXHQgICAgICAgICAgICAgICBub2RlIGluc3RhbmNlb2Ygbm9kZXMuQXN5bmNBbGwgfHxcblx0ICAgICAgICAgICAgICAgbm9kZSBpbnN0YW5jZW9mIG5vZGVzLkNhbGxFeHRlbnNpb25Bc3luYykge1xuXHQgICAgICAgICAgICAgICAgYXN5bmMgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgLy8gU3RvcCBpdGVyYXRpbmcgYnkgcmV0dXJuaW5nIHRoZSBub2RlXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXG5cdCAgICAgICAgaWYoYXN5bmMpIHtcblx0XHQgICAgICAgIGlmKG5vZGUgaW5zdGFuY2VvZiBub2Rlcy5JZikge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBub2Rlcy5JZkFzeW5jKFxuXHQgICAgICAgICAgICAgICAgICAgIG5vZGUubGluZW5vLFxuXHQgICAgICAgICAgICAgICAgICAgIG5vZGUuY29sbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgbm9kZS5jb25kLFxuXHQgICAgICAgICAgICAgICAgICAgIG5vZGUuYm9keSxcblx0ICAgICAgICAgICAgICAgICAgICBub2RlLmVsc2VfXG5cdCAgICAgICAgICAgICAgICApO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYobm9kZSBpbnN0YW5jZW9mIG5vZGVzLkZvcikge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBub2Rlcy5Bc3luY0VhY2goXG5cdCAgICAgICAgICAgICAgICAgICAgbm9kZS5saW5lbm8sXG5cdCAgICAgICAgICAgICAgICAgICAgbm9kZS5jb2xubyxcblx0ICAgICAgICAgICAgICAgICAgICBub2RlLmFycixcblx0ICAgICAgICAgICAgICAgICAgICBub2RlLm5hbWUsXG5cdCAgICAgICAgICAgICAgICAgICAgbm9kZS5ib2R5LFxuXHQgICAgICAgICAgICAgICAgICAgIG5vZGUuZWxzZV9cblx0ICAgICAgICAgICAgICAgICk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNwcyhhc3QsIGFzeW5jRmlsdGVycykge1xuXHQgICAgcmV0dXJuIGNvbnZlcnRTdGF0ZW1lbnRzKGxpZnRTdXBlcihsaWZ0RmlsdGVycyhhc3QsIGFzeW5jRmlsdGVycykpKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRyYW5zZm9ybShhc3QsIGFzeW5jRmlsdGVycykge1xuXHQgICAgcmV0dXJuIGNwcyhhc3QsIGFzeW5jRmlsdGVycyB8fCBbXSk7XG5cdH1cblxuXHQvLyB2YXIgcGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXInKTtcblx0Ly8gdmFyIHNyYyA9ICdoZWxsbyB7JSBmb28gJX17JSBlbmRmb28gJX0gZW5kJztcblx0Ly8gdmFyIGFzdCA9IHRyYW5zZm9ybShwYXJzZXIucGFyc2Uoc3JjLCBbbmV3IEZvb0V4dGVuc2lvbigpXSksIFsnYmFyJ10pO1xuXHQvLyBub2Rlcy5wcmludE5vZGVzKGFzdCk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybVxuXHR9O1xuXG5cbi8qKiovIH0pLFxuLyogMTMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGxpYiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdHZhciBPYmogPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xuXG5cdC8vIEZyYW1lcyBrZWVwIHRyYWNrIG9mIHNjb3BpbmcgYm90aCBhdCBjb21waWxlLXRpbWUgYW5kIHJ1bi10aW1lIHNvXG5cdC8vIHdlIGtub3cgaG93IHRvIGFjY2VzcyB2YXJpYWJsZXMuIEJsb2NrIHRhZ3MgY2FuIGludHJvZHVjZSBzcGVjaWFsXG5cdC8vIHZhcmlhYmxlcywgZm9yIGV4YW1wbGUuXG5cdHZhciBGcmFtZSA9IE9iai5leHRlbmQoe1xuXHQgICAgaW5pdDogZnVuY3Rpb24ocGFyZW50LCBpc29sYXRlV3JpdGVzKSB7XG5cdCAgICAgICAgdGhpcy52YXJpYWJsZXMgPSB7fTtcblx0ICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblx0ICAgICAgICB0aGlzLnRvcExldmVsID0gZmFsc2U7XG5cdCAgICAgICAgLy8gaWYgdGhpcyBpcyB0cnVlLCB3cml0ZXMgKHNldCkgc2hvdWxkIG5ldmVyIHByb3BhZ2F0ZSB1cHdhcmRzIHBhc3Rcblx0ICAgICAgICAvLyB0aGlzIGZyYW1lIHRvIGl0cyBwYXJlbnQgKHRob3VnaCByZWFkcyBtYXkpLlxuXHQgICAgICAgIHRoaXMuaXNvbGF0ZVdyaXRlcyA9IGlzb2xhdGVXcml0ZXM7XG5cdCAgICB9LFxuXG5cdCAgICBzZXQ6IGZ1bmN0aW9uKG5hbWUsIHZhbCwgcmVzb2x2ZVVwKSB7XG5cdCAgICAgICAgLy8gQWxsb3cgdmFyaWFibGVzIHdpdGggZG90cyBieSBhdXRvbWF0aWNhbGx5IGNyZWF0aW5nIHRoZVxuXHQgICAgICAgIC8vIG5lc3RlZCBzdHJ1Y3R1cmVcblx0ICAgICAgICB2YXIgcGFydHMgPSBuYW1lLnNwbGl0KCcuJyk7XG5cdCAgICAgICAgdmFyIG9iaiA9IHRoaXMudmFyaWFibGVzO1xuXHQgICAgICAgIHZhciBmcmFtZSA9IHRoaXM7XG5cblx0ICAgICAgICBpZihyZXNvbHZlVXApIHtcblx0ICAgICAgICAgICAgaWYoKGZyYW1lID0gdGhpcy5yZXNvbHZlKHBhcnRzWzBdLCB0cnVlKSkpIHtcblx0ICAgICAgICAgICAgICAgIGZyYW1lLnNldChuYW1lLCB2YWwpO1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgZm9yKHZhciBpPTA7IGk8cGFydHMubGVuZ3RoIC0gMTsgaSsrKSB7XG5cdCAgICAgICAgICAgIHZhciBpZCA9IHBhcnRzW2ldO1xuXG5cdCAgICAgICAgICAgIGlmKCFvYmpbaWRdKSB7XG5cdCAgICAgICAgICAgICAgICBvYmpbaWRdID0ge307XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgb2JqID0gb2JqW2lkXTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBvYmpbcGFydHNbcGFydHMubGVuZ3RoIC0gMV1dID0gdmFsO1xuXHQgICAgfSxcblxuXHQgICAgZ2V0OiBmdW5jdGlvbihuYW1lKSB7XG5cdCAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFyaWFibGVzW25hbWVdO1xuXHQgICAgICAgIGlmKHZhbCAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiB2YWw7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfSxcblxuXHQgICAgbG9va3VwOiBmdW5jdGlvbihuYW1lKSB7XG5cdCAgICAgICAgdmFyIHAgPSB0aGlzLnBhcmVudDtcblx0ICAgICAgICB2YXIgdmFsID0gdGhpcy52YXJpYWJsZXNbbmFtZV07XG5cdCAgICAgICAgaWYodmFsICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHZhbDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIHAgJiYgcC5sb29rdXAobmFtZSk7XG5cdCAgICB9LFxuXG5cdCAgICByZXNvbHZlOiBmdW5jdGlvbihuYW1lLCBmb3JXcml0ZSkge1xuXHQgICAgICAgIHZhciBwID0gKGZvcldyaXRlICYmIHRoaXMuaXNvbGF0ZVdyaXRlcykgPyB1bmRlZmluZWQgOiB0aGlzLnBhcmVudDtcblx0ICAgICAgICB2YXIgdmFsID0gdGhpcy52YXJpYWJsZXNbbmFtZV07XG5cdCAgICAgICAgaWYodmFsICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBwICYmIHAucmVzb2x2ZShuYW1lKTtcblx0ICAgIH0sXG5cblx0ICAgIHB1c2g6IGZ1bmN0aW9uKGlzb2xhdGVXcml0ZXMpIHtcblx0ICAgICAgICByZXR1cm4gbmV3IEZyYW1lKHRoaXMsIGlzb2xhdGVXcml0ZXMpO1xuXHQgICAgfSxcblxuXHQgICAgcG9wOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XG5cdCAgICB9XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIG1ha2VNYWNybyhhcmdOYW1lcywga3dhcmdOYW1lcywgZnVuYykge1xuXHQgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciBhcmdDb3VudCA9IG51bUFyZ3MoYXJndW1lbnRzKTtcblx0ICAgICAgICB2YXIgYXJncztcblx0ICAgICAgICB2YXIga3dhcmdzID0gZ2V0S2V5d29yZEFyZ3MoYXJndW1lbnRzKTtcblx0ICAgICAgICB2YXIgaTtcblxuXHQgICAgICAgIGlmKGFyZ0NvdW50ID4gYXJnTmFtZXMubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDAsIGFyZ05hbWVzLmxlbmd0aCk7XG5cblx0ICAgICAgICAgICAgLy8gUG9zaXRpb25hbCBhcmd1bWVudHMgdGhhdCBzaG91bGQgYmUgcGFzc2VkIGluIGFzXG5cdCAgICAgICAgICAgIC8vIGtleXdvcmQgYXJndW1lbnRzIChlc3NlbnRpYWxseSBkZWZhdWx0IHZhbHVlcylcblx0ICAgICAgICAgICAgdmFyIHZhbHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIGFyZ3MubGVuZ3RoLCBhcmdDb3VudCk7XG5cdCAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHZhbHMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIGlmKGkgPCBrd2FyZ05hbWVzLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGt3YXJnc1trd2FyZ05hbWVzW2ldXSA9IHZhbHNbaV07XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBhcmdzLnB1c2goa3dhcmdzKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZihhcmdDb3VudCA8IGFyZ05hbWVzLmxlbmd0aCkge1xuXHQgICAgICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwLCBhcmdDb3VudCk7XG5cblx0ICAgICAgICAgICAgZm9yKGkgPSBhcmdDb3VudDsgaSA8IGFyZ05hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgYXJnID0gYXJnTmFtZXNbaV07XG5cblx0ICAgICAgICAgICAgICAgIC8vIEtleXdvcmQgYXJndW1lbnRzIHRoYXQgc2hvdWxkIGJlIHBhc3NlZCBhc1xuXHQgICAgICAgICAgICAgICAgLy8gcG9zaXRpb25hbCBhcmd1bWVudHMsIGkuZS4gdGhlIGNhbGxlciBleHBsaWNpdGx5XG5cdCAgICAgICAgICAgICAgICAvLyB1c2VkIHRoZSBuYW1lIG9mIGEgcG9zaXRpb25hbCBhcmdcblx0ICAgICAgICAgICAgICAgIGFyZ3MucHVzaChrd2FyZ3NbYXJnXSk7XG5cdCAgICAgICAgICAgICAgICBkZWxldGUga3dhcmdzW2FyZ107XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBhcmdzLnB1c2goa3dhcmdzKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG5cdCAgICB9O1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFrZUtleXdvcmRBcmdzKG9iaikge1xuXHQgICAgb2JqLl9fa2V5d29yZHMgPSB0cnVlO1xuXHQgICAgcmV0dXJuIG9iajtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldEtleXdvcmRBcmdzKGFyZ3MpIHtcblx0ICAgIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcblx0ICAgIGlmKGxlbikge1xuXHQgICAgICAgIHZhciBsYXN0QXJnID0gYXJnc1tsZW4gLSAxXTtcblx0ICAgICAgICBpZihsYXN0QXJnICYmIGxhc3RBcmcuaGFzT3duUHJvcGVydHkoJ19fa2V5d29yZHMnKSkge1xuXHQgICAgICAgICAgICByZXR1cm4gbGFzdEFyZztcblx0ICAgICAgICB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4ge307XG5cdH1cblxuXHRmdW5jdGlvbiBudW1BcmdzKGFyZ3MpIHtcblx0ICAgIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcblx0ICAgIGlmKGxlbiA9PT0gMCkge1xuXHQgICAgICAgIHJldHVybiAwO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgbGFzdEFyZyA9IGFyZ3NbbGVuIC0gMV07XG5cdCAgICBpZihsYXN0QXJnICYmIGxhc3RBcmcuaGFzT3duUHJvcGVydHkoJ19fa2V5d29yZHMnKSkge1xuXHQgICAgICAgIHJldHVybiBsZW4gLSAxO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuIGxlbjtcblx0ICAgIH1cblx0fVxuXG5cdC8vIEEgU2FmZVN0cmluZyBvYmplY3QgaW5kaWNhdGVzIHRoYXQgdGhlIHN0cmluZyBzaG91bGQgbm90IGJlXG5cdC8vIGF1dG9lc2NhcGVkLiBUaGlzIGhhcHBlbnMgbWFnaWNhbGx5IGJlY2F1c2UgYXV0b2VzY2FwaW5nIG9ubHlcblx0Ly8gb2NjdXJzIG9uIHByaW1pdGl2ZSBzdHJpbmcgb2JqZWN0cy5cblx0ZnVuY3Rpb24gU2FmZVN0cmluZyh2YWwpIHtcblx0ICAgIGlmKHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7XG5cdCAgICAgICAgcmV0dXJuIHZhbDtcblx0ICAgIH1cblxuXHQgICAgdGhpcy52YWwgPSB2YWw7XG5cdCAgICB0aGlzLmxlbmd0aCA9IHZhbC5sZW5ndGg7XG5cdH1cblxuXHRTYWZlU3RyaW5nLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU3RyaW5nLnByb3RvdHlwZSwge1xuXHQgICAgbGVuZ3RoOiB7IHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiAwIH1cblx0fSk7XG5cdFNhZmVTdHJpbmcucHJvdG90eXBlLnZhbHVlT2YgPSBmdW5jdGlvbigpIHtcblx0ICAgIHJldHVybiB0aGlzLnZhbDtcblx0fTtcblx0U2FmZVN0cmluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0ICAgIHJldHVybiB0aGlzLnZhbDtcblx0fTtcblxuXHRmdW5jdGlvbiBjb3B5U2FmZW5lc3MoZGVzdCwgdGFyZ2V0KSB7XG5cdCAgICBpZihkZXN0IGluc3RhbmNlb2YgU2FmZVN0cmluZykge1xuXHQgICAgICAgIHJldHVybiBuZXcgU2FmZVN0cmluZyh0YXJnZXQpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRhcmdldC50b1N0cmluZygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFya1NhZmUodmFsKSB7XG5cdCAgICB2YXIgdHlwZSA9IHR5cGVvZiB2YWw7XG5cblx0ICAgIGlmKHR5cGUgPT09ICdzdHJpbmcnKSB7XG5cdCAgICAgICAgcmV0dXJuIG5ldyBTYWZlU3RyaW5nKHZhbCk7XG5cdCAgICB9XG5cdCAgICBlbHNlIGlmKHR5cGUgIT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICByZXR1cm4gdmFsO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICB2YXIgcmV0ID0gdmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cblx0ICAgICAgICAgICAgaWYodHlwZW9mIHJldCA9PT0gJ3N0cmluZycpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU2FmZVN0cmluZyhyZXQpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIHJldDtcblx0ICAgICAgICB9O1xuXHQgICAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gc3VwcHJlc3NWYWx1ZSh2YWwsIGF1dG9lc2NhcGUpIHtcblx0ICAgIHZhbCA9ICh2YWwgIT09IHVuZGVmaW5lZCAmJiB2YWwgIT09IG51bGwpID8gdmFsIDogJyc7XG5cblx0ICAgIGlmKGF1dG9lc2NhcGUgJiYgISh2YWwgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSkge1xuXHQgICAgICAgIHZhbCA9IGxpYi5lc2NhcGUodmFsLnRvU3RyaW5nKCkpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdmFsO1xuXHR9XG5cblx0ZnVuY3Rpb24gZW5zdXJlRGVmaW5lZCh2YWwsIGxpbmVubywgY29sbm8pIHtcblx0ICAgIGlmKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIHRocm93IG5ldyBsaWIuVGVtcGxhdGVFcnJvcihcblx0ICAgICAgICAgICAgJ2F0dGVtcHRlZCB0byBvdXRwdXQgbnVsbCBvciB1bmRlZmluZWQgdmFsdWUnLFxuXHQgICAgICAgICAgICBsaW5lbm8gKyAxLFxuXHQgICAgICAgICAgICBjb2xubyArIDFcblx0ICAgICAgICApO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHZhbDtcblx0fVxuXG5cdGZ1bmN0aW9uIG1lbWJlckxvb2t1cChvYmosIHZhbCkge1xuXHQgICAgb2JqID0gb2JqIHx8IHt9O1xuXG5cdCAgICBpZih0eXBlb2Ygb2JqW3ZhbF0gPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBvYmpbdmFsXS5hcHBseShvYmosIGFyZ3VtZW50cyk7XG5cdCAgICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIG9ialt2YWxdO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2FsbFdyYXAob2JqLCBuYW1lLCBjb250ZXh0LCBhcmdzKSB7XG5cdCAgICBpZighb2JqKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY2FsbCBgJyArIG5hbWUgKyAnYCwgd2hpY2ggaXMgdW5kZWZpbmVkIG9yIGZhbHNleScpO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZih0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gY2FsbCBgJyArIG5hbWUgKyAnYCwgd2hpY2ggaXMgbm90IGEgZnVuY3Rpb24nKTtcblx0ICAgIH1cblxuXHQgICAgLy8ganNoaW50IHZhbGlkdGhpczogdHJ1ZVxuXHQgICAgcmV0dXJuIG9iai5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNvbnRleHRPckZyYW1lTG9va3VwKGNvbnRleHQsIGZyYW1lLCBuYW1lKSB7XG5cdCAgICB2YXIgdmFsID0gZnJhbWUubG9va3VwKG5hbWUpO1xuXHQgICAgcmV0dXJuICh2YWwgIT09IHVuZGVmaW5lZCkgP1xuXHQgICAgICAgIHZhbCA6XG5cdCAgICAgICAgY29udGV4dC5sb29rdXAobmFtZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVFcnJvcihlcnJvciwgbGluZW5vLCBjb2xubykge1xuXHQgICAgaWYoZXJyb3IubGluZW5vKSB7XG5cdCAgICAgICAgcmV0dXJuIGVycm9yO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuIG5ldyBsaWIuVGVtcGxhdGVFcnJvcihlcnJvciwgbGluZW5vLCBjb2xubyk7XG5cdCAgICB9XG5cdH1cblxuXHRmdW5jdGlvbiBhc3luY0VhY2goYXJyLCBkaW1lbiwgaXRlciwgY2IpIHtcblx0ICAgIGlmKGxpYi5pc0FycmF5KGFycikpIHtcblx0ICAgICAgICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcblxuXHQgICAgICAgIGxpYi5hc3luY0l0ZXIoYXJyLCBmdW5jdGlvbihpdGVtLCBpLCBuZXh0KSB7XG5cdCAgICAgICAgICAgIHN3aXRjaChkaW1lbikge1xuXHQgICAgICAgICAgICBjYXNlIDE6IGl0ZXIoaXRlbSwgaSwgbGVuLCBuZXh0KTsgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgMjogaXRlcihpdGVtWzBdLCBpdGVtWzFdLCBpLCBsZW4sIG5leHQpOyBicmVhaztcblx0ICAgICAgICAgICAgY2FzZSAzOiBpdGVyKGl0ZW1bMF0sIGl0ZW1bMV0sIGl0ZW1bMl0sIGksIGxlbiwgbmV4dCk7IGJyZWFrO1xuXHQgICAgICAgICAgICBkZWZhdWx0OlxuXHQgICAgICAgICAgICAgICAgaXRlbS5wdXNoKGksIG5leHQpO1xuXHQgICAgICAgICAgICAgICAgaXRlci5hcHBseSh0aGlzLCBpdGVtKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sIGNiKTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIGxpYi5hc3luY0ZvcihhcnIsIGZ1bmN0aW9uKGtleSwgdmFsLCBpLCBsZW4sIG5leHQpIHtcblx0ICAgICAgICAgICAgaXRlcihrZXksIHZhbCwgaSwgbGVuLCBuZXh0KTtcblx0ICAgICAgICB9LCBjYik7XG5cdCAgICB9XG5cdH1cblxuXHRmdW5jdGlvbiBhc3luY0FsbChhcnIsIGRpbWVuLCBmdW5jLCBjYikge1xuXHQgICAgdmFyIGZpbmlzaGVkID0gMDtcblx0ICAgIHZhciBsZW4sIGk7XG5cdCAgICB2YXIgb3V0cHV0QXJyO1xuXG5cdCAgICBmdW5jdGlvbiBkb25lKGksIG91dHB1dCkge1xuXHQgICAgICAgIGZpbmlzaGVkKys7XG5cdCAgICAgICAgb3V0cHV0QXJyW2ldID0gb3V0cHV0O1xuXG5cdCAgICAgICAgaWYoZmluaXNoZWQgPT09IGxlbikge1xuXHQgICAgICAgICAgICBjYihudWxsLCBvdXRwdXRBcnIuam9pbignJykpO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgaWYobGliLmlzQXJyYXkoYXJyKSkge1xuXHQgICAgICAgIGxlbiA9IGFyci5sZW5ndGg7XG5cdCAgICAgICAgb3V0cHV0QXJyID0gbmV3IEFycmF5KGxlbik7XG5cblx0ICAgICAgICBpZihsZW4gPT09IDApIHtcblx0ICAgICAgICAgICAgY2IobnVsbCwgJycpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGFycltpXTtcblxuXHQgICAgICAgICAgICAgICAgc3dpdGNoKGRpbWVuKSB7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDE6IGZ1bmMoaXRlbSwgaSwgbGVuLCBkb25lKTsgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDI6IGZ1bmMoaXRlbVswXSwgaXRlbVsxXSwgaSwgbGVuLCBkb25lKTsgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBjYXNlIDM6IGZ1bmMoaXRlbVswXSwgaXRlbVsxXSwgaXRlbVsyXSwgaSwgbGVuLCBkb25lKTsgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICBkZWZhdWx0OlxuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0ucHVzaChpLCBkb25lKTtcblx0ICAgICAgICAgICAgICAgICAgICAvLyBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlXG5cdCAgICAgICAgICAgICAgICAgICAgZnVuYy5hcHBseSh0aGlzLCBpdGVtKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIHZhciBrZXlzID0gbGliLmtleXMoYXJyKTtcblx0ICAgICAgICBsZW4gPSBrZXlzLmxlbmd0aDtcblx0ICAgICAgICBvdXRwdXRBcnIgPSBuZXcgQXJyYXkobGVuKTtcblxuXHQgICAgICAgIGlmKGxlbiA9PT0gMCkge1xuXHQgICAgICAgICAgICBjYihudWxsLCAnJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgayA9IGtleXNbaV07XG5cdCAgICAgICAgICAgICAgICBmdW5jKGssIGFycltrXSwgaSwgbGVuLCBkb25lKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgIH1cblx0fVxuXG5cdG1vZHVsZS5leHBvcnRzID0ge1xuXHQgICAgRnJhbWU6IEZyYW1lLFxuXHQgICAgbWFrZU1hY3JvOiBtYWtlTWFjcm8sXG5cdCAgICBtYWtlS2V5d29yZEFyZ3M6IG1ha2VLZXl3b3JkQXJncyxcblx0ICAgIG51bUFyZ3M6IG51bUFyZ3MsXG5cdCAgICBzdXBwcmVzc1ZhbHVlOiBzdXBwcmVzc1ZhbHVlLFxuXHQgICAgZW5zdXJlRGVmaW5lZDogZW5zdXJlRGVmaW5lZCxcblx0ICAgIG1lbWJlckxvb2t1cDogbWVtYmVyTG9va3VwLFxuXHQgICAgY29udGV4dE9yRnJhbWVMb29rdXA6IGNvbnRleHRPckZyYW1lTG9va3VwLFxuXHQgICAgY2FsbFdyYXA6IGNhbGxXcmFwLFxuXHQgICAgaGFuZGxlRXJyb3I6IGhhbmRsZUVycm9yLFxuXHQgICAgaXNBcnJheTogbGliLmlzQXJyYXksXG5cdCAgICBrZXlzOiBsaWIua2V5cyxcblx0ICAgIFNhZmVTdHJpbmc6IFNhZmVTdHJpbmcsXG5cdCAgICBjb3B5U2FmZW5lc3M6IGNvcHlTYWZlbmVzcyxcblx0ICAgIG1hcmtTYWZlOiBtYXJrU2FmZSxcblx0ICAgIGFzeW5jRWFjaDogYXN5bmNFYWNoLFxuXHQgICAgYXN5bmNBbGw6IGFzeW5jQWxsLFxuXHQgICAgaW5PcGVyYXRvcjogbGliLmluT3BlcmF0b3Jcblx0fTtcblxuXG4vKioqLyB9KSxcbi8qIDE0ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBsaWIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHR2YXIgciA9IF9fd2VicGFja19yZXF1aXJlX18oMTMpO1xuXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZSh2YWx1ZSwgZGVmYXVsdFZhbHVlKSB7XG5cdCAgICBpZih2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBmYWxzZSkge1xuXHQgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdmFsdWU7XG5cdH1cblxuXHR2YXIgZmlsdGVycyA9IHtcblx0ICAgIGFiczogTWF0aC5hYnMsXG5cblx0ICAgIGJhdGNoOiBmdW5jdGlvbihhcnIsIGxpbmVjb3VudCwgZmlsbF93aXRoKSB7XG5cdCAgICAgICAgdmFyIGk7XG5cdCAgICAgICAgdmFyIHJlcyA9IFtdO1xuXHQgICAgICAgIHZhciB0bXAgPSBbXTtcblxuXHQgICAgICAgIGZvcihpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICBpZihpICUgbGluZWNvdW50ID09PSAwICYmIHRtcC5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgICAgIHJlcy5wdXNoKHRtcCk7XG5cdCAgICAgICAgICAgICAgICB0bXAgPSBbXTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHRtcC5wdXNoKGFycltpXSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYodG1wLmxlbmd0aCkge1xuXHQgICAgICAgICAgICBpZihmaWxsX3dpdGgpIHtcblx0ICAgICAgICAgICAgICAgIGZvcihpID0gdG1wLmxlbmd0aDsgaSA8IGxpbmVjb3VudDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdG1wLnB1c2goZmlsbF93aXRoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJlcy5wdXNoKHRtcCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHJlcztcblx0ICAgIH0sXG5cblx0ICAgIGNhcGl0YWxpemU6IGZ1bmN0aW9uKHN0cikge1xuXHQgICAgICAgIHN0ciA9IG5vcm1hbGl6ZShzdHIsICcnKTtcblx0ICAgICAgICB2YXIgcmV0ID0gc3RyLnRvTG93ZXJDYXNlKCk7XG5cdCAgICAgICAgcmV0dXJuIHIuY29weVNhZmVuZXNzKHN0ciwgcmV0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcmV0LnNsaWNlKDEpKTtcblx0ICAgIH0sXG5cblx0ICAgIGNlbnRlcjogZnVuY3Rpb24oc3RyLCB3aWR0aCkge1xuXHQgICAgICAgIHN0ciA9IG5vcm1hbGl6ZShzdHIsICcnKTtcblx0ICAgICAgICB3aWR0aCA9IHdpZHRoIHx8IDgwO1xuXG5cdCAgICAgICAgaWYoc3RyLmxlbmd0aCA+PSB3aWR0aCkge1xuXHQgICAgICAgICAgICByZXR1cm4gc3RyO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBzcGFjZXMgPSB3aWR0aCAtIHN0ci5sZW5ndGg7XG5cdCAgICAgICAgdmFyIHByZSA9IGxpYi5yZXBlYXQoJyAnLCBzcGFjZXMvMiAtIHNwYWNlcyAlIDIpO1xuXHQgICAgICAgIHZhciBwb3N0ID0gbGliLnJlcGVhdCgnICcsIHNwYWNlcy8yKTtcblx0ICAgICAgICByZXR1cm4gci5jb3B5U2FmZW5lc3Moc3RyLCBwcmUgKyBzdHIgKyBwb3N0KTtcblx0ICAgIH0sXG5cblx0ICAgICdkZWZhdWx0JzogZnVuY3Rpb24odmFsLCBkZWYsIGJvb2wpIHtcblx0ICAgICAgICBpZihib29sKSB7XG5cdCAgICAgICAgICAgIHJldHVybiB2YWwgPyB2YWwgOiBkZWY7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICByZXR1cm4gKHZhbCAhPT0gdW5kZWZpbmVkKSA/IHZhbCA6IGRlZjtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBkaWN0c29ydDogZnVuY3Rpb24odmFsLCBjYXNlX3NlbnNpdGl2ZSwgYnkpIHtcblx0ICAgICAgICBpZiAoIWxpYi5pc09iamVjdCh2YWwpKSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBsaWIuVGVtcGxhdGVFcnJvcignZGljdHNvcnQgZmlsdGVyOiB2YWwgbXVzdCBiZSBhbiBvYmplY3QnKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgYXJyYXkgPSBbXTtcblx0ICAgICAgICBmb3IgKHZhciBrIGluIHZhbCkge1xuXHQgICAgICAgICAgICAvLyBkZWxpYmVyYXRlbHkgaW5jbHVkZSBwcm9wZXJ0aWVzIGZyb20gdGhlIG9iamVjdCdzIHByb3RvdHlwZVxuXHQgICAgICAgICAgICBhcnJheS5wdXNoKFtrLHZhbFtrXV0pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBzaTtcblx0ICAgICAgICBpZiAoYnkgPT09IHVuZGVmaW5lZCB8fCBieSA9PT0gJ2tleScpIHtcblx0ICAgICAgICAgICAgc2kgPSAwO1xuXHQgICAgICAgIH0gZWxzZSBpZiAoYnkgPT09ICd2YWx1ZScpIHtcblx0ICAgICAgICAgICAgc2kgPSAxO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHRocm93IG5ldyBsaWIuVGVtcGxhdGVFcnJvcihcblx0ICAgICAgICAgICAgICAgICdkaWN0c29ydCBmaWx0ZXI6IFlvdSBjYW4gb25seSBzb3J0IGJ5IGVpdGhlciBrZXkgb3IgdmFsdWUnKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBhcnJheS5zb3J0KGZ1bmN0aW9uKHQxLCB0Mikge1xuXHQgICAgICAgICAgICB2YXIgYSA9IHQxW3NpXTtcblx0ICAgICAgICAgICAgdmFyIGIgPSB0MltzaV07XG5cblx0ICAgICAgICAgICAgaWYgKCFjYXNlX3NlbnNpdGl2ZSkge1xuXHQgICAgICAgICAgICAgICAgaWYgKGxpYi5pc1N0cmluZyhhKSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGEgPSBhLnRvVXBwZXJDYXNlKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICBpZiAobGliLmlzU3RyaW5nKGIpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgYiA9IGIudG9VcHBlckNhc2UoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiBhID4gYiA/IDEgOiAoYSA9PT0gYiA/IDAgOiAtMSk7XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICByZXR1cm4gYXJyYXk7XG5cdCAgICB9LFxuXG5cdCAgICBkdW1wOiBmdW5jdGlvbihvYmosIHNwYWNlcykge1xuXHQgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIHNwYWNlcyk7XG5cdCAgICB9LFxuXG5cdCAgICBlc2NhcGU6IGZ1bmN0aW9uKHN0cikge1xuXHQgICAgICAgIGlmKHN0ciBpbnN0YW5jZW9mIHIuU2FmZVN0cmluZykge1xuXHQgICAgICAgICAgICByZXR1cm4gc3RyO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBzdHIgPSAoc3RyID09PSBudWxsIHx8IHN0ciA9PT0gdW5kZWZpbmVkKSA/ICcnIDogc3RyO1xuXHQgICAgICAgIHJldHVybiByLm1hcmtTYWZlKGxpYi5lc2NhcGUoc3RyLnRvU3RyaW5nKCkpKTtcblx0ICAgIH0sXG5cblx0ICAgIHNhZmU6IGZ1bmN0aW9uKHN0cikge1xuXHQgICAgICAgIGlmIChzdHIgaW5zdGFuY2VvZiByLlNhZmVTdHJpbmcpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHN0cjtcblx0ICAgICAgICB9XG5cdCAgICAgICAgc3RyID0gKHN0ciA9PT0gbnVsbCB8fCBzdHIgPT09IHVuZGVmaW5lZCkgPyAnJyA6IHN0cjtcblx0ICAgICAgICByZXR1cm4gci5tYXJrU2FmZShzdHIudG9TdHJpbmcoKSk7XG5cdCAgICB9LFxuXG5cdCAgICBmaXJzdDogZnVuY3Rpb24oYXJyKSB7XG5cdCAgICAgICAgcmV0dXJuIGFyclswXTtcblx0ICAgIH0sXG5cblx0ICAgIGdyb3VwYnk6IGZ1bmN0aW9uKGFyciwgYXR0cikge1xuXHQgICAgICAgIHJldHVybiBsaWIuZ3JvdXBCeShhcnIsIGF0dHIpO1xuXHQgICAgfSxcblxuXHQgICAgaW5kZW50OiBmdW5jdGlvbihzdHIsIHdpZHRoLCBpbmRlbnRmaXJzdCkge1xuXHQgICAgICAgIHN0ciA9IG5vcm1hbGl6ZShzdHIsICcnKTtcblxuXHQgICAgICAgIGlmIChzdHIgPT09ICcnKSByZXR1cm4gJyc7XG5cblx0ICAgICAgICB3aWR0aCA9IHdpZHRoIHx8IDQ7XG5cdCAgICAgICAgdmFyIHJlcyA9ICcnO1xuXHQgICAgICAgIHZhciBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJyk7XG5cdCAgICAgICAgdmFyIHNwID0gbGliLnJlcGVhdCgnICcsIHdpZHRoKTtcblxuXHQgICAgICAgIGZvcih2YXIgaT0wOyBpPGxpbmVzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIGlmKGkgPT09IDAgJiYgIWluZGVudGZpcnN0KSB7XG5cdCAgICAgICAgICAgICAgICByZXMgKz0gbGluZXNbaV0gKyAnXFxuJztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHJlcyArPSBzcCArIGxpbmVzW2ldICsgJ1xcbic7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gci5jb3B5U2FmZW5lc3Moc3RyLCByZXMpO1xuXHQgICAgfSxcblxuXHQgICAgam9pbjogZnVuY3Rpb24oYXJyLCBkZWwsIGF0dHIpIHtcblx0ICAgICAgICBkZWwgPSBkZWwgfHwgJyc7XG5cblx0ICAgICAgICBpZihhdHRyKSB7XG5cdCAgICAgICAgICAgIGFyciA9IGxpYi5tYXAoYXJyLCBmdW5jdGlvbih2KSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdlthdHRyXTtcblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIGFyci5qb2luKGRlbCk7XG5cdCAgICB9LFxuXG5cdCAgICBsYXN0OiBmdW5jdGlvbihhcnIpIHtcblx0ICAgICAgICByZXR1cm4gYXJyW2Fyci5sZW5ndGgtMV07XG5cdCAgICB9LFxuXG5cdCAgICBsZW5ndGg6IGZ1bmN0aW9uKHZhbCkge1xuXHQgICAgICAgIHZhciB2YWx1ZSA9IG5vcm1hbGl6ZSh2YWwsICcnKTtcblxuXHQgICAgICAgIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgaWYoXG5cdCAgICAgICAgICAgICAgICAodHlwZW9mIE1hcCA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWx1ZSBpbnN0YW5jZW9mIE1hcCkgfHxcblx0ICAgICAgICAgICAgICAgICh0eXBlb2YgU2V0ID09PSAnZnVuY3Rpb24nICYmIHZhbHVlIGluc3RhbmNlb2YgU2V0KVxuXHQgICAgICAgICAgICApIHtcblx0ICAgICAgICAgICAgICAgIC8vIEVDTUFTY3JpcHQgMjAxNSBNYXBzIGFuZCBTZXRzXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc2l6ZTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBpZihsaWIuaXNPYmplY3QodmFsdWUpICYmICEodmFsdWUgaW5zdGFuY2VvZiByLlNhZmVTdHJpbmcpKSB7XG5cdCAgICAgICAgICAgICAgICAvLyBPYmplY3RzIChiZXNpZGVzIFNhZmVTdHJpbmdzKSwgbm9uLXByaW1hdGl2ZSBBcnJheXNcblx0ICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGg7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiAwO1xuXHQgICAgfSxcblxuXHQgICAgbGlzdDogZnVuY3Rpb24odmFsKSB7XG5cdCAgICAgICAgaWYobGliLmlzU3RyaW5nKHZhbCkpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHZhbC5zcGxpdCgnJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYobGliLmlzT2JqZWN0KHZhbCkpIHtcblx0ICAgICAgICAgICAgdmFyIGtleXMgPSBbXTtcblxuXHQgICAgICAgICAgICBpZihPYmplY3Qua2V5cykge1xuXHQgICAgICAgICAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzKHZhbCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBmb3IodmFyIGsgaW4gdmFsKSB7XG5cdCAgICAgICAgICAgICAgICAgICAga2V5cy5wdXNoKGspO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGxpYi5tYXAoa2V5cywgZnVuY3Rpb24oaykge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHsga2V5OiBrLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbFtrXSB9O1xuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgZWxzZSBpZihsaWIuaXNBcnJheSh2YWwpKSB7XG5cdCAgICAgICAgICByZXR1cm4gdmFsO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdGhyb3cgbmV3IGxpYi5UZW1wbGF0ZUVycm9yKCdsaXN0IGZpbHRlcjogdHlwZSBub3QgaXRlcmFibGUnKTtcblx0ICAgICAgICB9XG5cdCAgICB9LFxuXG5cdCAgICBsb3dlcjogZnVuY3Rpb24oc3RyKSB7XG5cdCAgICAgICAgc3RyID0gbm9ybWFsaXplKHN0ciwgJycpO1xuXHQgICAgICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKTtcblx0ICAgIH0sXG5cblx0ICAgIG5sMmJyOiBmdW5jdGlvbihzdHIpIHtcblx0ICAgICAgICBpZiAoc3RyID09PSBudWxsIHx8IHN0ciA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgIHJldHVybiAnJztcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIHIuY29weVNhZmVuZXNzKHN0ciwgc3RyLnJlcGxhY2UoL1xcclxcbnxcXG4vZywgJzxiciAvPlxcbicpKTtcblx0ICAgIH0sXG5cblx0ICAgIHJhbmRvbTogZnVuY3Rpb24oYXJyKSB7XG5cdCAgICAgICAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG5cdCAgICB9LFxuXG5cdCAgICByZWplY3RhdHRyOiBmdW5jdGlvbihhcnIsIGF0dHIpIHtcblx0ICAgICAgcmV0dXJuIGFyci5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICByZXR1cm4gIWl0ZW1bYXR0cl07XG5cdCAgICAgIH0pO1xuXHQgICAgfSxcblxuXHQgICAgc2VsZWN0YXR0cjogZnVuY3Rpb24oYXJyLCBhdHRyKSB7XG5cdCAgICAgIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG5cdCAgICAgICAgcmV0dXJuICEhaXRlbVthdHRyXTtcblx0ICAgICAgfSk7XG5cdCAgICB9LFxuXG5cdCAgICByZXBsYWNlOiBmdW5jdGlvbihzdHIsIG9sZCwgbmV3XywgbWF4Q291bnQpIHtcblx0ICAgICAgICB2YXIgb3JpZ2luYWxTdHIgPSBzdHI7XG5cblx0ICAgICAgICBpZiAob2xkIGluc3RhbmNlb2YgUmVnRXhwKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBzdHIucmVwbGFjZShvbGQsIG5ld18pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmKHR5cGVvZiBtYXhDb3VudCA9PT0gJ3VuZGVmaW5lZCcpe1xuXHQgICAgICAgICAgICBtYXhDb3VudCA9IC0xO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciByZXMgPSAnJzsgIC8vIE91dHB1dFxuXG5cdCAgICAgICAgLy8gQ2FzdCBOdW1iZXJzIGluIHRoZSBzZWFyY2ggdGVybSB0byBzdHJpbmdcblx0ICAgICAgICBpZih0eXBlb2Ygb2xkID09PSAnbnVtYmVyJyl7XG5cdCAgICAgICAgICAgIG9sZCA9IG9sZCArICcnO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKHR5cGVvZiBvbGQgIT09ICdzdHJpbmcnKSB7XG5cdCAgICAgICAgICAgIC8vIElmIGl0IGlzIHNvbWV0aGluZyBvdGhlciB0aGFuIG51bWJlciBvciBzdHJpbmcsXG5cdCAgICAgICAgICAgIC8vIHJldHVybiB0aGUgb3JpZ2luYWwgc3RyaW5nXG5cdCAgICAgICAgICAgIHJldHVybiBzdHI7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLy8gQ2FzdCBudW1iZXJzIGluIHRoZSByZXBsYWNlbWVudCB0byBzdHJpbmdcblx0ICAgICAgICBpZih0eXBlb2Ygc3RyID09PSAnbnVtYmVyJyl7XG5cdCAgICAgICAgICAgIHN0ciA9IHN0ciArICcnO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIC8vIElmIGJ5IG5vdywgd2UgZG9uJ3QgaGF2ZSBhIHN0cmluZywgdGhyb3cgaXQgYmFja1xuXHQgICAgICAgIGlmKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnICYmICEoc3RyIGluc3RhbmNlb2Ygci5TYWZlU3RyaW5nKSl7XG5cdCAgICAgICAgICAgIHJldHVybiBzdHI7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgLy8gU2hvcnRDaXJjdWl0c1xuXHQgICAgICAgIGlmKG9sZCA9PT0gJycpe1xuXHQgICAgICAgICAgICAvLyBNaW1pYyB0aGUgcHl0aG9uIGJlaGF2aW91cjogZW1wdHkgc3RyaW5nIGlzIHJlcGxhY2VkXG5cdCAgICAgICAgICAgIC8vIGJ5IHJlcGxhY2VtZW50IGUuZy4gXCJhYmNcInxyZXBsYWNlKFwiXCIsIFwiLlwiKSAtPiAuYS5iLmMuXG5cdCAgICAgICAgICAgIHJlcyA9IG5ld18gKyBzdHIuc3BsaXQoJycpLmpvaW4obmV3XykgKyBuZXdfO1xuXHQgICAgICAgICAgICByZXR1cm4gci5jb3B5U2FmZW5lc3Moc3RyLCByZXMpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciBuZXh0SW5kZXggPSBzdHIuaW5kZXhPZihvbGQpO1xuXHQgICAgICAgIC8vIGlmICMgb2YgcmVwbGFjZW1lbnRzIHRvIHBlcmZvcm0gaXMgMCwgb3IgdGhlIHN0cmluZyB0byBkb2VzXG5cdCAgICAgICAgLy8gbm90IGNvbnRhaW4gdGhlIG9sZCB2YWx1ZSwgcmV0dXJuIHRoZSBzdHJpbmdcblx0ICAgICAgICBpZihtYXhDb3VudCA9PT0gMCB8fCBuZXh0SW5kZXggPT09IC0xKXtcblx0ICAgICAgICAgICAgcmV0dXJuIHN0cjtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB2YXIgcG9zID0gMDtcblx0ICAgICAgICB2YXIgY291bnQgPSAwOyAvLyAjIG9mIHJlcGxhY2VtZW50cyBtYWRlXG5cblx0ICAgICAgICB3aGlsZShuZXh0SW5kZXggID4gLTEgJiYgKG1heENvdW50ID09PSAtMSB8fCBjb3VudCA8IG1heENvdW50KSl7XG5cdCAgICAgICAgICAgIC8vIEdyYWIgdGhlIG5leHQgY2h1bmsgb2Ygc3JjIHN0cmluZyBhbmQgYWRkIGl0IHdpdGggdGhlXG5cdCAgICAgICAgICAgIC8vIHJlcGxhY2VtZW50LCB0byB0aGUgcmVzdWx0XG5cdCAgICAgICAgICAgIHJlcyArPSBzdHIuc3Vic3RyaW5nKHBvcywgbmV4dEluZGV4KSArIG5ld187XG5cdCAgICAgICAgICAgIC8vIEluY3JlbWVudCBvdXIgcG9pbnRlciBpbiB0aGUgc3JjIHN0cmluZ1xuXHQgICAgICAgICAgICBwb3MgPSBuZXh0SW5kZXggKyBvbGQubGVuZ3RoO1xuXHQgICAgICAgICAgICBjb3VudCsrO1xuXHQgICAgICAgICAgICAvLyBTZWUgaWYgdGhlcmUgYXJlIGFueSBtb3JlIHJlcGxhY2VtZW50cyB0byBiZSBtYWRlXG5cdCAgICAgICAgICAgIG5leHRJbmRleCA9IHN0ci5pbmRleE9mKG9sZCwgcG9zKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICAvLyBXZSd2ZSBlaXRoZXIgcmVhY2hlZCB0aGUgZW5kLCBvciBkb25lIHRoZSBtYXggIyBvZlxuXHQgICAgICAgIC8vIHJlcGxhY2VtZW50cywgdGFjayBvbiBhbnkgcmVtYWluaW5nIHN0cmluZ1xuXHQgICAgICAgIGlmKHBvcyA8IHN0ci5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgcmVzICs9IHN0ci5zdWJzdHJpbmcocG9zKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gci5jb3B5U2FmZW5lc3Mob3JpZ2luYWxTdHIsIHJlcyk7XG5cdCAgICB9LFxuXG5cdCAgICByZXZlcnNlOiBmdW5jdGlvbih2YWwpIHtcblx0ICAgICAgICB2YXIgYXJyO1xuXHQgICAgICAgIGlmKGxpYi5pc1N0cmluZyh2YWwpKSB7XG5cdCAgICAgICAgICAgIGFyciA9IGZpbHRlcnMubGlzdCh2YWwpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgLy8gQ29weSBpdFxuXHQgICAgICAgICAgICBhcnIgPSBsaWIubWFwKHZhbCwgZnVuY3Rpb24odikgeyByZXR1cm4gdjsgfSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgYXJyLnJldmVyc2UoKTtcblxuXHQgICAgICAgIGlmKGxpYi5pc1N0cmluZyh2YWwpKSB7XG5cdCAgICAgICAgICAgIHJldHVybiByLmNvcHlTYWZlbmVzcyh2YWwsIGFyci5qb2luKCcnKSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBhcnI7XG5cdCAgICB9LFxuXG5cdCAgICByb3VuZDogZnVuY3Rpb24odmFsLCBwcmVjaXNpb24sIG1ldGhvZCkge1xuXHQgICAgICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbiB8fCAwO1xuXHQgICAgICAgIHZhciBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKTtcblx0ICAgICAgICB2YXIgcm91bmRlcjtcblxuXHQgICAgICAgIGlmKG1ldGhvZCA9PT0gJ2NlaWwnKSB7XG5cdCAgICAgICAgICAgIHJvdW5kZXIgPSBNYXRoLmNlaWw7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2UgaWYobWV0aG9kID09PSAnZmxvb3InKSB7XG5cdCAgICAgICAgICAgIHJvdW5kZXIgPSBNYXRoLmZsb29yO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgcm91bmRlciA9IE1hdGgucm91bmQ7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHJvdW5kZXIodmFsICogZmFjdG9yKSAvIGZhY3Rvcjtcblx0ICAgIH0sXG5cblx0ICAgIHNsaWNlOiBmdW5jdGlvbihhcnIsIHNsaWNlcywgZmlsbFdpdGgpIHtcblx0ICAgICAgICB2YXIgc2xpY2VMZW5ndGggPSBNYXRoLmZsb29yKGFyci5sZW5ndGggLyBzbGljZXMpO1xuXHQgICAgICAgIHZhciBleHRyYSA9IGFyci5sZW5ndGggJSBzbGljZXM7XG5cdCAgICAgICAgdmFyIG9mZnNldCA9IDA7XG5cdCAgICAgICAgdmFyIHJlcyA9IFtdO1xuXG5cdCAgICAgICAgZm9yKHZhciBpPTA7IGk8c2xpY2VzOyBpKyspIHtcblx0ICAgICAgICAgICAgdmFyIHN0YXJ0ID0gb2Zmc2V0ICsgaSAqIHNsaWNlTGVuZ3RoO1xuXHQgICAgICAgICAgICBpZihpIDwgZXh0cmEpIHtcblx0ICAgICAgICAgICAgICAgIG9mZnNldCsrO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHZhciBlbmQgPSBvZmZzZXQgKyAoaSArIDEpICogc2xpY2VMZW5ndGg7XG5cblx0ICAgICAgICAgICAgdmFyIHNsaWNlID0gYXJyLnNsaWNlKHN0YXJ0LCBlbmQpO1xuXHQgICAgICAgICAgICBpZihmaWxsV2l0aCAmJiBpID49IGV4dHJhKSB7XG5cdCAgICAgICAgICAgICAgICBzbGljZS5wdXNoKGZpbGxXaXRoKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXMucHVzaChzbGljZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHJlcztcblx0ICAgIH0sXG5cblx0ICAgIHN1bTogZnVuY3Rpb24oYXJyLCBhdHRyLCBzdGFydCkge1xuXHQgICAgICAgIHZhciBzdW0gPSAwO1xuXG5cdCAgICAgICAgaWYodHlwZW9mIHN0YXJ0ID09PSAnbnVtYmVyJyl7XG5cdCAgICAgICAgICAgIHN1bSArPSBzdGFydDtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZihhdHRyKSB7XG5cdCAgICAgICAgICAgIGFyciA9IGxpYi5tYXAoYXJyLCBmdW5jdGlvbih2KSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdlthdHRyXTtcblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICBzdW0gKz0gYXJyW2ldO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBzdW07XG5cdCAgICB9LFxuXG5cdCAgICBzb3J0OiByLm1ha2VNYWNybyhbJ3ZhbHVlJywgJ3JldmVyc2UnLCAnY2FzZV9zZW5zaXRpdmUnLCAnYXR0cmlidXRlJ10sIFtdLCBmdW5jdGlvbihhcnIsIHJldmVyc2UsIGNhc2VTZW5zLCBhdHRyKSB7XG5cdCAgICAgICAgIC8vIENvcHkgaXRcblx0ICAgICAgICBhcnIgPSBsaWIubWFwKGFyciwgZnVuY3Rpb24odikgeyByZXR1cm4gdjsgfSk7XG5cblx0ICAgICAgICBhcnIuc29ydChmdW5jdGlvbihhLCBiKSB7XG5cdCAgICAgICAgICAgIHZhciB4LCB5O1xuXG5cdCAgICAgICAgICAgIGlmKGF0dHIpIHtcblx0ICAgICAgICAgICAgICAgIHggPSBhW2F0dHJdO1xuXHQgICAgICAgICAgICAgICAgeSA9IGJbYXR0cl07XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICB4ID0gYTtcblx0ICAgICAgICAgICAgICAgIHkgPSBiO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgaWYoIWNhc2VTZW5zICYmIGxpYi5pc1N0cmluZyh4KSAmJiBsaWIuaXNTdHJpbmcoeSkpIHtcblx0ICAgICAgICAgICAgICAgIHggPSB4LnRvTG93ZXJDYXNlKCk7XG5cdCAgICAgICAgICAgICAgICB5ID0geS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgaWYoeCA8IHkpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiByZXZlcnNlID8gMSA6IC0xO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGVsc2UgaWYoeCA+IHkpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiByZXZlcnNlID8gLTE6IDE7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gMDtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXG5cdCAgICAgICAgcmV0dXJuIGFycjtcblx0ICAgIH0pLFxuXG5cdCAgICBzdHJpbmc6IGZ1bmN0aW9uKG9iaikge1xuXHQgICAgICAgIHJldHVybiByLmNvcHlTYWZlbmVzcyhvYmosIG9iaik7XG5cdCAgICB9LFxuXG5cdCAgICBzdHJpcHRhZ3M6IGZ1bmN0aW9uKGlucHV0LCBwcmVzZXJ2ZV9saW5lYnJlYWtzKSB7XG5cdCAgICAgICAgaW5wdXQgPSBub3JtYWxpemUoaW5wdXQsICcnKTtcblx0ICAgICAgICBwcmVzZXJ2ZV9saW5lYnJlYWtzID0gcHJlc2VydmVfbGluZWJyZWFrcyB8fCBmYWxzZTtcblx0ICAgICAgICB2YXIgdGFncyA9IC88XFwvPyhbYS16XVthLXowLTldKilcXGJbXj5dKj58PCEtLVtcXHNcXFNdKj8tLT4vZ2k7XG5cdCAgICAgICAgdmFyIHRyaW1tZWRJbnB1dCA9IGZpbHRlcnMudHJpbShpbnB1dC5yZXBsYWNlKHRhZ3MsICcnKSk7XG5cdCAgICAgICAgdmFyIHJlcyA9ICcnO1xuXHQgICAgICAgIGlmIChwcmVzZXJ2ZV9saW5lYnJlYWtzKSB7XG5cdCAgICAgICAgICAgIHJlcyA9IHRyaW1tZWRJbnB1dFxuXHQgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14gK3wgKyQvZ20sICcnKSAgICAgLy8gcmVtb3ZlIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNwYWNlc1xuXHQgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyArL2csICcgJykgICAgICAgICAgLy8gc3F1YXNoIGFkamFjZW50IHNwYWNlc1xuXHQgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyhcXHJcXG4pL2csICdcXG4nKSAgICAgLy8gbm9ybWFsaXplIGxpbmVicmVha3MgKENSTEYgLT4gTEYpXG5cdCAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuXFxuXFxuKy9nLCAnXFxuXFxuJyk7IC8vIHNxdWFzaCBhYm5vcm1hbCBhZGphY2VudCBsaW5lYnJlYWtzXG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgcmVzID0gdHJpbW1lZElucHV0LnJlcGxhY2UoL1xccysvZ2ksICcgJyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiByLmNvcHlTYWZlbmVzcyhpbnB1dCwgcmVzKTtcblx0ICAgIH0sXG5cblx0ICAgIHRpdGxlOiBmdW5jdGlvbihzdHIpIHtcblx0ICAgICAgICBzdHIgPSBub3JtYWxpemUoc3RyLCAnJyk7XG5cdCAgICAgICAgdmFyIHdvcmRzID0gc3RyLnNwbGl0KCcgJyk7XG5cdCAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIHdvcmRzW2ldID0gZmlsdGVycy5jYXBpdGFsaXplKHdvcmRzW2ldKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIHIuY29weVNhZmVuZXNzKHN0ciwgd29yZHMuam9pbignICcpKTtcblx0ICAgIH0sXG5cblx0ICAgIHRyaW06IGZ1bmN0aW9uKHN0cikge1xuXHQgICAgICAgIHJldHVybiByLmNvcHlTYWZlbmVzcyhzdHIsIHN0ci5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJykpO1xuXHQgICAgfSxcblxuXHQgICAgdHJ1bmNhdGU6IGZ1bmN0aW9uKGlucHV0LCBsZW5ndGgsIGtpbGx3b3JkcywgZW5kKSB7XG5cdCAgICAgICAgdmFyIG9yaWcgPSBpbnB1dDtcblx0ICAgICAgICBpbnB1dCA9IG5vcm1hbGl6ZShpbnB1dCwgJycpO1xuXHQgICAgICAgIGxlbmd0aCA9IGxlbmd0aCB8fCAyNTU7XG5cblx0ICAgICAgICBpZiAoaW5wdXQubGVuZ3RoIDw9IGxlbmd0aClcblx0ICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuXG5cdCAgICAgICAgaWYgKGtpbGx3b3Jkcykge1xuXHQgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZygwLCBsZW5ndGgpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHZhciBpZHggPSBpbnB1dC5sYXN0SW5kZXhPZignICcsIGxlbmd0aCk7XG5cdCAgICAgICAgICAgIGlmKGlkeCA9PT0gLTEpIHtcblx0ICAgICAgICAgICAgICAgIGlkeCA9IGxlbmd0aDtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyaW5nKDAsIGlkeCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaW5wdXQgKz0gKGVuZCAhPT0gdW5kZWZpbmVkICYmIGVuZCAhPT0gbnVsbCkgPyBlbmQgOiAnLi4uJztcblx0ICAgICAgICByZXR1cm4gci5jb3B5U2FmZW5lc3Mob3JpZywgaW5wdXQpO1xuXHQgICAgfSxcblxuXHQgICAgdXBwZXI6IGZ1bmN0aW9uKHN0cikge1xuXHQgICAgICAgIHN0ciA9IG5vcm1hbGl6ZShzdHIsICcnKTtcblx0ICAgICAgICByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7XG5cdCAgICB9LFxuXG5cdCAgICB1cmxlbmNvZGU6IGZ1bmN0aW9uKG9iaikge1xuXHQgICAgICAgIHZhciBlbmMgPSBlbmNvZGVVUklDb21wb25lbnQ7XG5cdCAgICAgICAgaWYgKGxpYi5pc1N0cmluZyhvYmopKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBlbmMob2JqKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICB2YXIgcGFydHM7XG5cdCAgICAgICAgICAgIGlmIChsaWIuaXNBcnJheShvYmopKSB7XG5cdCAgICAgICAgICAgICAgICBwYXJ0cyA9IG9iai5tYXAoZnVuY3Rpb24oaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmMoaXRlbVswXSkgKyAnPScgKyBlbmMoaXRlbVsxXSk7XG5cdCAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHBhcnRzID0gW107XG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIG9iaikge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcGFydHMucHVzaChlbmMoaykgKyAnPScgKyBlbmMob2JqW2tdKSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJldHVybiBwYXJ0cy5qb2luKCcmJyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgdXJsaXplOiBmdW5jdGlvbihzdHIsIGxlbmd0aCwgbm9mb2xsb3cpIHtcblx0ICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSkgbGVuZ3RoID0gSW5maW5pdHk7XG5cblx0ICAgICAgICB2YXIgbm9Gb2xsb3dBdHRyID0gKG5vZm9sbG93ID09PSB0cnVlID8gJyByZWw9XCJub2ZvbGxvd1wiJyA6ICcnKTtcblxuXHQgICAgICAgIC8vIEZvciB0aGUgamluamEgcmVnZXhwLCBzZWVcblx0ICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWl0c3VoaWtvL2ppbmphMi9ibG9iL2YxNWI4MTRkY2JhNmFhMTJiYzc0ZDFmN2QwYzg4MWQ1NWY3MTI2YmUvamluamEyL3V0aWxzLnB5I0wyMC1MMjNcblx0ICAgICAgICB2YXIgcHVuY1JFID0gL14oPzpcXCh8PHwmbHQ7KT8oLio/KSg/OlxcLnwsfFxcKXxcXG58Jmd0Oyk/JC87XG5cdCAgICAgICAgLy8gZnJvbSBodHRwOi8vYmxvZy5nZXJ2Lm5ldC8yMDExLzA1L2h0bWw1X2VtYWlsX2FkZHJlc3NfcmVnZXhwL1xuXHQgICAgICAgIHZhciBlbWFpbFJFID0gL15bXFx3LiEjJCUmJyorXFwtXFwvPT9cXF5ge3x9fl0rQFthLXpcXGRcXC1dKyhcXC5bYS16XFxkXFwtXSspKyQvaTtcblx0ICAgICAgICB2YXIgaHR0cEh0dHBzUkUgPSAvXmh0dHBzPzpcXC9cXC8uKiQvO1xuXHQgICAgICAgIHZhciB3d3dSRSA9IC9ed3d3XFwuLztcblx0ICAgICAgICB2YXIgdGxkUkUgPSAvXFwuKD86b3JnfG5ldHxjb20pKD86XFw6fFxcL3wkKS87XG5cblx0ICAgICAgICB2YXIgd29yZHMgPSBzdHIuc3BsaXQoLyhcXHMrKS8pLmZpbHRlcihmdW5jdGlvbih3b3JkKSB7XG5cdCAgICAgICAgICAvLyBJZiB0aGUgd29yZCBoYXMgbm8gbGVuZ3RoLCBiYWlsLiBUaGlzIGNhbiBoYXBwZW4gZm9yIHN0ciB3aXRoXG5cdCAgICAgICAgICAvLyB0cmFpbGluZyB3aGl0ZXNwYWNlLlxuXHQgICAgICAgICAgcmV0dXJuIHdvcmQgJiYgd29yZC5sZW5ndGg7XG5cdCAgICAgICAgfSkubWFwKGZ1bmN0aW9uKHdvcmQpIHtcblx0ICAgICAgICAgIHZhciBtYXRjaGVzID0gd29yZC5tYXRjaChwdW5jUkUpO1xuXHQgICAgICAgICAgdmFyIHBvc3NpYmxlVXJsID0gbWF0Y2hlcyAmJiBtYXRjaGVzWzFdIHx8IHdvcmQ7XG5cblx0ICAgICAgICAgIC8vIHVybCB0aGF0IHN0YXJ0cyB3aXRoIGh0dHAgb3IgaHR0cHNcblx0ICAgICAgICAgIGlmIChodHRwSHR0cHNSRS50ZXN0KHBvc3NpYmxlVXJsKSlcblx0ICAgICAgICAgICAgcmV0dXJuICc8YSBocmVmPVwiJyArIHBvc3NpYmxlVXJsICsgJ1wiJyArIG5vRm9sbG93QXR0ciArICc+JyArIHBvc3NpYmxlVXJsLnN1YnN0cigwLCBsZW5ndGgpICsgJzwvYT4nO1xuXG5cdCAgICAgICAgICAvLyB1cmwgdGhhdCBzdGFydHMgd2l0aCB3d3cuXG5cdCAgICAgICAgICBpZiAod3d3UkUudGVzdChwb3NzaWJsZVVybCkpXG5cdCAgICAgICAgICAgIHJldHVybiAnPGEgaHJlZj1cImh0dHA6Ly8nICsgcG9zc2libGVVcmwgKyAnXCInICsgbm9Gb2xsb3dBdHRyICsgJz4nICsgcG9zc2libGVVcmwuc3Vic3RyKDAsIGxlbmd0aCkgKyAnPC9hPic7XG5cblx0ICAgICAgICAgIC8vIGFuIGVtYWlsIGFkZHJlc3Mgb2YgdGhlIGZvcm0gdXNlcm5hbWVAZG9tYWluLnRsZFxuXHQgICAgICAgICAgaWYgKGVtYWlsUkUudGVzdChwb3NzaWJsZVVybCkpXG5cdCAgICAgICAgICAgIHJldHVybiAnPGEgaHJlZj1cIm1haWx0bzonICsgcG9zc2libGVVcmwgKyAnXCI+JyArIHBvc3NpYmxlVXJsICsgJzwvYT4nO1xuXG5cdCAgICAgICAgICAvLyB1cmwgdGhhdCBlbmRzIGluIC5jb20sIC5vcmcgb3IgLm5ldCB0aGF0IGlzIG5vdCBhbiBlbWFpbCBhZGRyZXNzXG5cdCAgICAgICAgICBpZiAodGxkUkUudGVzdChwb3NzaWJsZVVybCkpXG5cdCAgICAgICAgICAgIHJldHVybiAnPGEgaHJlZj1cImh0dHA6Ly8nICsgcG9zc2libGVVcmwgKyAnXCInICsgbm9Gb2xsb3dBdHRyICsgJz4nICsgcG9zc2libGVVcmwuc3Vic3RyKDAsIGxlbmd0aCkgKyAnPC9hPic7XG5cblx0ICAgICAgICAgIHJldHVybiB3b3JkO1xuXG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICByZXR1cm4gd29yZHMuam9pbignJyk7XG5cdCAgICB9LFxuXG5cdCAgICB3b3JkY291bnQ6IGZ1bmN0aW9uKHN0cikge1xuXHQgICAgICAgIHN0ciA9IG5vcm1hbGl6ZShzdHIsICcnKTtcblx0ICAgICAgICB2YXIgd29yZHMgPSAoc3RyKSA/IHN0ci5tYXRjaCgvXFx3Ky9nKSA6IG51bGw7XG5cdCAgICAgICAgcmV0dXJuICh3b3JkcykgPyB3b3Jkcy5sZW5ndGggOiBudWxsO1xuXHQgICAgfSxcblxuXHQgICAgJ2Zsb2F0JzogZnVuY3Rpb24odmFsLCBkZWYpIHtcblx0ICAgICAgICB2YXIgcmVzID0gcGFyc2VGbG9hdCh2YWwpO1xuXHQgICAgICAgIHJldHVybiBpc05hTihyZXMpID8gZGVmIDogcmVzO1xuXHQgICAgfSxcblxuXHQgICAgJ2ludCc6IGZ1bmN0aW9uKHZhbCwgZGVmKSB7XG5cdCAgICAgICAgdmFyIHJlcyA9IHBhcnNlSW50KHZhbCwgMTApO1xuXHQgICAgICAgIHJldHVybiBpc05hTihyZXMpID8gZGVmIDogcmVzO1xuXHQgICAgfVxuXHR9O1xuXG5cdC8vIEFsaWFzZXNcblx0ZmlsdGVycy5kID0gZmlsdGVyc1snZGVmYXVsdCddO1xuXHRmaWx0ZXJzLmUgPSBmaWx0ZXJzLmVzY2FwZTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZpbHRlcnM7XG5cblxuLyoqKi8gfSksXG4vKiAxNSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgTG9hZGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNik7XG5cdHZhciBQcmVjb21waWxlZExvYWRlciA9IF9fd2VicGFja19yZXF1aXJlX18oMTcpO1xuXG5cdHZhciBXZWJMb2FkZXIgPSBMb2FkZXIuZXh0ZW5kKHtcblx0ICAgIGluaXQ6IGZ1bmN0aW9uKGJhc2VVUkwsIG9wdHMpIHtcblx0ICAgICAgICB0aGlzLmJhc2VVUkwgPSBiYXNlVVJMIHx8ICcuJztcblx0ICAgICAgICBvcHRzID0gb3B0cyB8fCB7fTtcblxuXHQgICAgICAgIC8vIEJ5IGRlZmF1bHQsIHRoZSBjYWNoZSBpcyB0dXJuZWQgb2ZmIGJlY2F1c2UgdGhlcmUncyBubyB3YXlcblx0ICAgICAgICAvLyB0byBcIndhdGNoXCIgdGVtcGxhdGVzIG92ZXIgSFRUUCwgc28gdGhleSBhcmUgcmUtZG93bmxvYWRlZFxuXHQgICAgICAgIC8vIGFuZCBjb21waWxlZCBlYWNoIHRpbWUuIChSZW1lbWJlciwgUFJFQ09NUElMRSBZT1VSXG5cdCAgICAgICAgLy8gVEVNUExBVEVTIGluIHByb2R1Y3Rpb24hKVxuXHQgICAgICAgIHRoaXMudXNlQ2FjaGUgPSAhIW9wdHMudXNlQ2FjaGU7XG5cblx0ICAgICAgICAvLyBXZSBkZWZhdWx0IGBhc3luY2AgdG8gZmFsc2Ugc28gdGhhdCB0aGUgc2ltcGxlIHN5bmNocm9ub3VzXG5cdCAgICAgICAgLy8gQVBJIGNhbiBiZSB1c2VkIHdoZW4geW91IGFyZW4ndCBkb2luZyBhbnl0aGluZyBhc3luYyBpblxuXHQgICAgICAgIC8vIHlvdXIgdGVtcGxhdGVzICh3aGljaCBpcyBtb3N0IG9mIHRoZSB0aW1lKS4gVGhpcyBwZXJmb3JtcyBhXG5cdCAgICAgICAgLy8gc3luYyBhamF4IHJlcXVlc3QsIGJ1dCB0aGF0J3Mgb2sgYmVjYXVzZSBpdCBzaG91bGQgKm9ubHkqXG5cdCAgICAgICAgLy8gaGFwcGVuIGluIGRldmVsb3BtZW50LiBQUkVDT01QSUxFIFlPVVIgVEVNUExBVEVTLlxuXHQgICAgICAgIHRoaXMuYXN5bmMgPSAhIW9wdHMuYXN5bmM7XG5cdCAgICB9LFxuXG5cdCAgICByZXNvbHZlOiBmdW5jdGlvbihmcm9tLCB0bykgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbGF0aXZlIHRlbXBsYXRlcyBub3Qgc3VwcG9ydCBpbiB0aGUgYnJvd3NlciB5ZXQnKTtcblx0ICAgIH0sXG5cblx0ICAgIGdldFNvdXJjZTogZnVuY3Rpb24obmFtZSwgY2IpIHtcblx0ICAgICAgICB2YXIgdXNlQ2FjaGUgPSB0aGlzLnVzZUNhY2hlO1xuXHQgICAgICAgIHZhciByZXN1bHQ7XG5cdCAgICAgICAgdGhpcy5mZXRjaCh0aGlzLmJhc2VVUkwgKyAnLycgKyBuYW1lLCBmdW5jdGlvbihlcnIsIHNyYykge1xuXHQgICAgICAgICAgICBpZihlcnIpIHtcblx0ICAgICAgICAgICAgICAgIGlmKGNiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgY2IoZXJyLmNvbnRlbnQpO1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDA0KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBudWxsO1xuXHQgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnIuY29udGVudDtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSB7XG5cdCAgICAgICAgICAgICAgICByZXN1bHQgPSB7IHNyYzogc3JjLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBuYW1lLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICBub0NhY2hlOiAhdXNlQ2FjaGUgfTtcblx0ICAgICAgICAgICAgICAgIGlmKGNiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgY2IobnVsbCwgcmVzdWx0KTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXG5cdCAgICAgICAgLy8gaWYgdGhpcyBXZWJMb2FkZXIgaXNuJ3QgcnVubmluZyBhc3luY2hyb25vdXNseSwgdGhlXG5cdCAgICAgICAgLy8gZmV0Y2ggYWJvdmUgd291bGQgYWN0dWFsbHkgcnVuIHN5bmMgYW5kIHdlJ2xsIGhhdmUgYVxuXHQgICAgICAgIC8vIHJlc3VsdCBoZXJlXG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdDtcblx0ICAgIH0sXG5cblx0ICAgIGZldGNoOiBmdW5jdGlvbih1cmwsIGNiKSB7XG5cdCAgICAgICAgLy8gT25seSBpbiB0aGUgYnJvd3NlciBwbGVhc2Vcblx0ICAgICAgICB2YXIgYWpheDtcblx0ICAgICAgICB2YXIgbG9hZGluZyA9IHRydWU7XG5cblx0ICAgICAgICBpZih3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHsgLy8gTW96aWxsYSwgU2FmYXJpLCAuLi5cblx0ICAgICAgICAgICAgYWpheCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIGlmKHdpbmRvdy5BY3RpdmVYT2JqZWN0KSB7IC8vIElFIDggYW5kIG9sZGVyXG5cdCAgICAgICAgICAgIC8qIGdsb2JhbCBBY3RpdmVYT2JqZWN0ICovXG5cdCAgICAgICAgICAgIGFqYXggPSBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBhamF4Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICBpZihhamF4LnJlYWR5U3RhdGUgPT09IDQgJiYgbG9hZGluZykge1xuXHQgICAgICAgICAgICAgICAgbG9hZGluZyA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgaWYoYWpheC5zdGF0dXMgPT09IDAgfHwgYWpheC5zdGF0dXMgPT09IDIwMCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGNiKG51bGwsIGFqYXgucmVzcG9uc2VUZXh0KTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIGNiKHsgc3RhdHVzOiBhamF4LnN0YXR1cywgY29udGVudDogYWpheC5yZXNwb25zZVRleHQgfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9O1xuXG5cdCAgICAgICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyAncz0nICtcblx0ICAgICAgICAgICAgICAgKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcblxuXHQgICAgICAgIGFqYXgub3BlbignR0VUJywgdXJsLCB0aGlzLmFzeW5jKTtcblx0ICAgICAgICBhamF4LnNlbmQoKTtcblx0ICAgIH1cblx0fSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgICBXZWJMb2FkZXI6IFdlYkxvYWRlcixcblx0ICAgIFByZWNvbXBpbGVkTG9hZGVyOiBQcmVjb21waWxlZExvYWRlclxuXHR9O1xuXG5cbi8qKiovIH0pLFxuLyogMTYgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpO1xuXHR2YXIgT2JqID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcblx0dmFyIGxpYiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cblx0dmFyIExvYWRlciA9IE9iai5leHRlbmQoe1xuXHQgICAgb246IGZ1bmN0aW9uKG5hbWUsIGZ1bmMpIHtcblx0ICAgICAgICB0aGlzLmxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzIHx8IHt9O1xuXHQgICAgICAgIHRoaXMubGlzdGVuZXJzW25hbWVdID0gdGhpcy5saXN0ZW5lcnNbbmFtZV0gfHwgW107XG5cdCAgICAgICAgdGhpcy5saXN0ZW5lcnNbbmFtZV0ucHVzaChmdW5jKTtcblx0ICAgIH0sXG5cblx0ICAgIGVtaXQ6IGZ1bmN0aW9uKG5hbWUgLyosIGFyZzEsIGFyZzIsIC4uLiovKSB7XG5cdCAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG5cdCAgICAgICAgaWYodGhpcy5saXN0ZW5lcnMgJiYgdGhpcy5saXN0ZW5lcnNbbmFtZV0pIHtcblx0ICAgICAgICAgICAgbGliLmVhY2godGhpcy5saXN0ZW5lcnNbbmFtZV0sIGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG5cdCAgICAgICAgICAgICAgICBsaXN0ZW5lci5hcHBseShudWxsLCBhcmdzKTtcblx0ICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgfVxuXHQgICAgfSxcblxuXHQgICAgcmVzb2x2ZTogZnVuY3Rpb24oZnJvbSwgdG8pIHtcblx0ICAgICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShmcm9tKSwgdG8pO1xuXHQgICAgfSxcblxuXHQgICAgaXNSZWxhdGl2ZTogZnVuY3Rpb24oZmlsZW5hbWUpIHtcblx0ICAgICAgICByZXR1cm4gKGZpbGVuYW1lLmluZGV4T2YoJy4vJykgPT09IDAgfHwgZmlsZW5hbWUuaW5kZXhPZignLi4vJykgPT09IDApO1xuXHQgICAgfVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IExvYWRlcjtcblxuXG4vKioqLyB9KSxcbi8qIDE3ICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBMb2FkZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE2KTtcblxuXHR2YXIgUHJlY29tcGlsZWRMb2FkZXIgPSBMb2FkZXIuZXh0ZW5kKHtcblx0ICAgIGluaXQ6IGZ1bmN0aW9uKGNvbXBpbGVkVGVtcGxhdGVzKSB7XG5cdCAgICAgICAgdGhpcy5wcmVjb21waWxlZCA9IGNvbXBpbGVkVGVtcGxhdGVzIHx8IHt9O1xuXHQgICAgfSxcblxuXHQgICAgZ2V0U291cmNlOiBmdW5jdGlvbihuYW1lKSB7XG5cdCAgICAgICAgaWYgKHRoaXMucHJlY29tcGlsZWRbbmFtZV0pIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHtcblx0ICAgICAgICAgICAgICAgIHNyYzogeyB0eXBlOiAnY29kZScsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgb2JqOiB0aGlzLnByZWNvbXBpbGVkW25hbWVdIH0sXG5cdCAgICAgICAgICAgICAgICBwYXRoOiBuYW1lXG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IFByZWNvbXBpbGVkTG9hZGVyO1xuXG5cbi8qKiovIH0pLFxuLyogMTggKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0ZnVuY3Rpb24gY3ljbGVyKGl0ZW1zKSB7XG5cdCAgICB2YXIgaW5kZXggPSAtMTtcblxuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgICBjdXJyZW50OiBudWxsLFxuXHQgICAgICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgaW5kZXggPSAtMTtcblx0ICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgIGluZGV4Kys7XG5cdCAgICAgICAgICAgIGlmKGluZGV4ID49IGl0ZW1zLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgaW5kZXggPSAwO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gaXRlbXNbaW5kZXhdO1xuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50O1xuXHQgICAgICAgIH0sXG5cdCAgICB9O1xuXG5cdH1cblxuXHRmdW5jdGlvbiBqb2luZXIoc2VwKSB7XG5cdCAgICBzZXAgPSBzZXAgfHwgJywnO1xuXHQgICAgdmFyIGZpcnN0ID0gdHJ1ZTtcblxuXHQgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHZhciB2YWwgPSBmaXJzdCA/ICcnIDogc2VwO1xuXHQgICAgICAgIGZpcnN0ID0gZmFsc2U7XG5cdCAgICAgICAgcmV0dXJuIHZhbDtcblx0ICAgIH07XG5cdH1cblxuXHQvLyBNYWtpbmcgdGhpcyBhIGZ1bmN0aW9uIGluc3RlYWQgc28gaXQgcmV0dXJucyBhIG5ldyBvYmplY3Rcblx0Ly8gZWFjaCB0aW1lIGl0J3MgY2FsbGVkLiBUaGF0IHdheSwgaWYgc29tZXRoaW5nIGxpa2UgYW4gZW52aXJvbm1lbnRcblx0Ly8gdXNlcyBpdCwgdGhleSB3aWxsIGVhY2ggaGF2ZSB0aGVpciBvd24gY29weS5cblx0ZnVuY3Rpb24gZ2xvYmFscygpIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgICAgcmFuZ2U6IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG5cdCAgICAgICAgICAgIGlmKHR5cGVvZiBzdG9wID09PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgICAgICAgICAgc3RvcCA9IHN0YXJ0O1xuXHQgICAgICAgICAgICAgICAgc3RhcnQgPSAwO1xuXHQgICAgICAgICAgICAgICAgc3RlcCA9IDE7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgZWxzZSBpZighc3RlcCkge1xuXHQgICAgICAgICAgICAgICAgc3RlcCA9IDE7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICB2YXIgYXJyID0gW107XG5cdCAgICAgICAgICAgIHZhciBpO1xuXHQgICAgICAgICAgICBpZiAoc3RlcCA+IDApIHtcblx0ICAgICAgICAgICAgICAgIGZvciAoaT1zdGFydDsgaTxzdG9wOyBpKz1zdGVwKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goaSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICBmb3IgKGk9c3RhcnQ7IGk+c3RvcDsgaSs9c3RlcCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGkpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJldHVybiBhcnI7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8vIGxpcHN1bTogZnVuY3Rpb24obiwgaHRtbCwgbWluLCBtYXgpIHtcblx0ICAgICAgICAvLyB9LFxuXG5cdCAgICAgICAgY3ljbGVyOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGN5Y2xlcihBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgam9pbmVyOiBmdW5jdGlvbihzZXApIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGpvaW5lcihzZXApO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdH1cblxuXHRtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbHM7XG5cblxuLyoqKi8gfSksXG4vKiAxOSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBfX1dFQlBBQ0tfQU1EX0RFRklORV9BUlJBWV9fLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXzsvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi8oZnVuY3Rpb24oc2V0SW1tZWRpYXRlLCBwcm9jZXNzKSB7Ly8gTUlUIGxpY2Vuc2UgKGJ5IEVsYW4gU2hhbmtlcikuXG5cdChmdW5jdGlvbihnbG9iYWxzKSB7XG5cdCAgJ3VzZSBzdHJpY3QnO1xuXG5cdCAgdmFyIGV4ZWN1dGVTeW5jID0gZnVuY3Rpb24oKXtcblx0ICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblx0ICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ2Z1bmN0aW9uJyl7XG5cdCAgICAgIGFyZ3NbMF0uYXBwbHkobnVsbCwgYXJncy5zcGxpY2UoMSkpO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICB2YXIgZXhlY3V0ZUFzeW5jID0gZnVuY3Rpb24oZm4pe1xuXHQgICAgaWYgKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgc2V0SW1tZWRpYXRlKGZuKTtcblx0ICAgIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MubmV4dFRpY2spIHtcblx0ICAgICAgcHJvY2Vzcy5uZXh0VGljayhmbik7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgdmFyIG1ha2VJdGVyYXRvciA9IGZ1bmN0aW9uICh0YXNrcykge1xuXHQgICAgdmFyIG1ha2VDYWxsYmFjayA9IGZ1bmN0aW9uIChpbmRleCkge1xuXHQgICAgICB2YXIgZm4gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgaWYgKHRhc2tzLmxlbmd0aCkge1xuXHQgICAgICAgICAgdGFza3NbaW5kZXhdLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBmbi5uZXh0KCk7XG5cdCAgICAgIH07XG5cdCAgICAgIGZuLm5leHQgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgcmV0dXJuIChpbmRleCA8IHRhc2tzLmxlbmd0aCAtIDEpID8gbWFrZUNhbGxiYWNrKGluZGV4ICsgMSk6IG51bGw7XG5cdCAgICAgIH07XG5cdCAgICAgIHJldHVybiBmbjtcblx0ICAgIH07XG5cdCAgICByZXR1cm4gbWFrZUNhbGxiYWNrKDApO1xuXHQgIH07XG5cdCAgXG5cdCAgdmFyIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihtYXliZUFycmF5KXtcblx0ICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobWF5YmVBcnJheSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdCAgfTtcblxuXHQgIHZhciB3YXRlcmZhbGwgPSBmdW5jdGlvbiAodGFza3MsIGNhbGxiYWNrLCBmb3JjZUFzeW5jKSB7XG5cdCAgICB2YXIgbmV4dFRpY2sgPSBmb3JjZUFzeW5jID8gZXhlY3V0ZUFzeW5jIDogZXhlY3V0ZVN5bmM7XG5cdCAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuXHQgICAgaWYgKCFfaXNBcnJheSh0YXNrcykpIHtcblx0ICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgdG8gd2F0ZXJmYWxsIG11c3QgYmUgYW4gYXJyYXkgb2YgZnVuY3Rpb25zJyk7XG5cdCAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuXHQgICAgfVxuXHQgICAgaWYgKCF0YXNrcy5sZW5ndGgpIHtcblx0ICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG5cdCAgICB9XG5cdCAgICB2YXIgd3JhcEl0ZXJhdG9yID0gZnVuY3Rpb24gKGl0ZXJhdG9yKSB7XG5cdCAgICAgIHJldHVybiBmdW5jdGlvbiAoZXJyKSB7XG5cdCAgICAgICAgaWYgKGVycikge1xuXHQgICAgICAgICAgY2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblx0ICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblx0ICAgICAgICAgIHZhciBuZXh0ID0gaXRlcmF0b3IubmV4dCgpO1xuXHQgICAgICAgICAgaWYgKG5leHQpIHtcblx0ICAgICAgICAgICAgYXJncy5wdXNoKHdyYXBJdGVyYXRvcihuZXh0KSk7XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICBhcmdzLnB1c2goY2FsbGJhY2spO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgbmV4dFRpY2soZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICBpdGVyYXRvci5hcHBseShudWxsLCBhcmdzKTtcblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfTtcblx0ICAgIH07XG5cdCAgICB3cmFwSXRlcmF0b3IobWFrZUl0ZXJhdG9yKHRhc2tzKSkoKTtcblx0ICB9O1xuXG5cdCAgaWYgKHRydWUpIHtcblx0ICAgICEoX19XRUJQQUNLX0FNRF9ERUZJTkVfQVJSQVlfXyA9IFtdLCBfX1dFQlBBQ0tfQU1EX0RFRklORV9SRVNVTFRfXyA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgcmV0dXJuIHdhdGVyZmFsbDtcblx0ICAgIH0uYXBwbHkoZXhwb3J0cywgX19XRUJQQUNLX0FNRF9ERUZJTkVfQVJSQVlfXyksIF9fV0VCUEFDS19BTURfREVGSU5FX1JFU1VMVF9fICE9PSB1bmRlZmluZWQgJiYgKG1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0FNRF9ERUZJTkVfUkVTVUxUX18pKTsgLy8gUmVxdWlyZUpTXG5cdCAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHQgICAgbW9kdWxlLmV4cG9ydHMgPSB3YXRlcmZhbGw7IC8vIENvbW1vbkpTXG5cdCAgfSBlbHNlIHtcblx0ICAgIGdsb2JhbHMud2F0ZXJmYWxsID0gd2F0ZXJmYWxsOyAvLyA8c2NyaXB0PlxuXHQgIH1cblx0fSkodGhpcyk7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovfS5jYWxsKGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18oMjApLnNldEltbWVkaWF0ZSwgX193ZWJwYWNrX3JlcXVpcmVfXygxMSkpKVxuXG4vKioqLyB9KSxcbi8qIDIwICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG5cdC8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cblx0ZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG5cdCAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xuXHR9O1xuXHRleHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG5cdCAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG5cdH07XG5cdGV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cblx0ZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuXHQgIGlmICh0aW1lb3V0KSB7XG5cdCAgICB0aW1lb3V0LmNsb3NlKCk7XG5cdCAgfVxuXHR9O1xuXG5cdGZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcblx0ICB0aGlzLl9pZCA9IGlkO1xuXHQgIHRoaXMuX2NsZWFyRm4gPSBjbGVhckZuO1xuXHR9XG5cdFRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblx0VGltZW91dC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcblx0ICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG5cdH07XG5cblx0Ly8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5cdGV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcblx0ICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cdCAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcblx0fTtcblxuXHRleHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuXHQgIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblx0ICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xuXHR9O1xuXG5cdGV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG5cdCAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG5cdCAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG5cdCAgaWYgKG1zZWNzID49IDApIHtcblx0ICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcblx0ICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcblx0ICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcblx0ICAgIH0sIG1zZWNzKTtcblx0ICB9XG5cdH07XG5cblx0Ly8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxuXHRfX3dlYnBhY2tfcmVxdWlyZV9fKDIxKTtcblx0ZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG5cdGV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcblxuXG4vKioqLyB9KSxcbi8qIDIxICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKGdsb2JhbCwgcHJvY2VzcykgeyhmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcblx0ICAgIFwidXNlIHN0cmljdFwiO1xuXG5cdCAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cblx0ICAgIHZhciB0YXNrc0J5SGFuZGxlID0ge307XG5cdCAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG5cdCAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuXHQgICAgdmFyIHJlZ2lzdGVySW1tZWRpYXRlO1xuXG5cdCAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcblx0ICAgICAgLy8gQ2FsbGJhY2sgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXG5cdCAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuXHQgICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG5cdCAgICAgIH1cblx0ICAgICAgLy8gQ29weSBmdW5jdGlvbiBhcmd1bWVudHNcblx0ICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuXHQgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuXHQgICAgICB9XG5cdCAgICAgIC8vIFN0b3JlIGFuZCByZWdpc3RlciB0aGUgdGFza1xuXHQgICAgICB2YXIgdGFzayA9IHsgY2FsbGJhY2s6IGNhbGxiYWNrLCBhcmdzOiBhcmdzIH07XG5cdCAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuXHQgICAgICByZWdpc3RlckltbWVkaWF0ZShuZXh0SGFuZGxlKTtcblx0ICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG5cdCAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcnVuKHRhc2spIHtcblx0ICAgICAgICB2YXIgY2FsbGJhY2sgPSB0YXNrLmNhbGxiYWNrO1xuXHQgICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuXHQgICAgICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcblx0ICAgICAgICBjYXNlIDA6XG5cdCAgICAgICAgICAgIGNhbGxiYWNrKCk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIGNhc2UgMTpcblx0ICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIGNhc2UgMjpcblx0ICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIGNhc2UgMzpcblx0ICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIGRlZmF1bHQ6XG5cdCAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG5cdCAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuXHQgICAgICAgIC8vIEZyb20gdGhlIHNwZWM6IFwiV2FpdCB1bnRpbCBhbnkgaW52b2NhdGlvbnMgb2YgdGhpcyBhbGdvcml0aG0gc3RhcnRlZCBiZWZvcmUgdGhpcyBvbmUgaGF2ZSBjb21wbGV0ZWQuXCJcblx0ICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuXHQgICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcblx0ICAgICAgICAgICAgLy8gRGVsYXkgYnkgZG9pbmcgYSBzZXRUaW1lb3V0LiBzZXRJbW1lZGlhdGUgd2FzIHRyaWVkIGluc3RlYWQsIGJ1dCBpbiBGaXJlZm94IDcgaXQgZ2VuZXJhdGVkIGFcblx0ICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cblx0ICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG5cdCAgICAgICAgICAgIGlmICh0YXNrKSB7XG5cdCAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgICAgICAgICAgICBydW4odGFzayk7XG5cdCAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuXHQgICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuXHQgICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG5cdCAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkgeyBydW5JZlByZXNlbnQoaGFuZGxlKTsgfSk7XG5cdCAgICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gY2FuVXNlUG9zdE1lc3NhZ2UoKSB7XG5cdCAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuXHQgICAgICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuJ3QgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuXHQgICAgICAgIGlmIChnbG9iYWwucG9zdE1lc3NhZ2UgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG5cdCAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcblx0ICAgICAgICAgICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG5cdCAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcblx0ICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcblx0ICAgICAgICAgICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpIHtcblx0ICAgICAgICAvLyBJbnN0YWxscyBhbiBldmVudCBoYW5kbGVyIG9uIGBnbG9iYWxgIGZvciB0aGUgYG1lc3NhZ2VgIGV2ZW50OiBzZWVcblx0ICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2Vcblx0ICAgICAgICAvLyAqIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL2NvbW1zLmh0bWwjY3Jvc3NEb2N1bWVudE1lc3NhZ2VzXG5cblx0ICAgICAgICB2YXIgbWVzc2FnZVByZWZpeCA9IFwic2V0SW1tZWRpYXRlJFwiICsgTWF0aC5yYW5kb20oKSArIFwiJFwiO1xuXHQgICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuXHQgICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiZcblx0ICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG5cdCAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcblx0ICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudCgrZXZlbnQuZGF0YS5zbGljZShtZXNzYWdlUHJlZml4Lmxlbmd0aCkpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfTtcblxuXHQgICAgICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuXHQgICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcblx0ICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcblx0ICAgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpIHtcblx0ICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuXHQgICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0ICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGV2ZW50LmRhdGE7XG5cdCAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuXHQgICAgICAgIH07XG5cblx0ICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuXHQgICAgICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKGhhbmRsZSk7XG5cdCAgICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpIHtcblx0ICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG5cdCAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcblx0ICAgICAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG5cdCAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG5cdCAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcblx0ICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuXHQgICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG5cdCAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgICAgICBodG1sLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cdCAgICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpIHtcblx0ICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuXHQgICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcblx0ICAgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICAvLyBJZiBzdXBwb3J0ZWQsIHdlIHNob3VsZCBhdHRhY2ggdG8gdGhlIHByb3RvdHlwZSBvZiBnbG9iYWwsIHNpbmNlIHRoYXQgaXMgd2hlcmUgc2V0VGltZW91dCBldCBhbC4gbGl2ZS5cblx0ICAgIHZhciBhdHRhY2hUbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsKTtcblx0ICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG5cdCAgICAvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IGUuZy4gYnJvd3NlcmlmeSBlbnZpcm9ubWVudHMuXG5cdCAgICBpZiAoe30udG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG5cdCAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuXHQgICAgICAgIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCk7XG5cblx0ICAgIH0gZWxzZSBpZiAoY2FuVXNlUG9zdE1lc3NhZ2UoKSkge1xuXHQgICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcblx0ICAgICAgICBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG5cdCAgICB9IGVsc2UgaWYgKGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCkge1xuXHQgICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG5cdCAgICAgICAgaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKTtcblxuXHQgICAgfSBlbHNlIGlmIChkb2MgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuXHQgICAgICAgIC8vIEZvciBJRSA24oCTOFxuXHQgICAgICAgIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKTtcblxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcblx0ICAgICAgICBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCk7XG5cdCAgICB9XG5cblx0ICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcblx0ICAgIGF0dGFjaFRvLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG5cdH0odHlwZW9mIHNlbGYgPT09IFwidW5kZWZpbmVkXCIgPyB0eXBlb2YgZ2xvYmFsID09PSBcInVuZGVmaW5lZFwiID8gdGhpcyA6IGdsb2JhbCA6IHNlbGYpKTtcblxuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSgpKSwgX193ZWJwYWNrX3JlcXVpcmVfXygxMSkpKVxuXG4vKioqLyB9KSxcbi8qIDIyICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0ZnVuY3Rpb24gaW5zdGFsbENvbXBhdCgpIHtcblx0ICAgICd1c2Ugc3RyaWN0JztcblxuXHQgICAgLy8gVGhpcyBtdXN0IGJlIGNhbGxlZCBsaWtlIGBudW5qdWNrcy5pbnN0YWxsQ29tcGF0YCBzbyB0aGF0IGB0aGlzYFxuXHQgICAgLy8gcmVmZXJlbmNlcyB0aGUgbnVuanVja3MgaW5zdGFuY2Vcblx0ICAgIHZhciBydW50aW1lID0gdGhpcy5ydW50aW1lOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblx0ICAgIHZhciBsaWIgPSB0aGlzLmxpYjsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cdCAgICB2YXIgQ29tcGlsZXIgPSB0aGlzLmNvbXBpbGVyLkNvbXBpbGVyOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblx0ICAgIHZhciBQYXJzZXIgPSB0aGlzLnBhcnNlci5QYXJzZXI7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXHQgICAgdmFyIG5vZGVzID0gdGhpcy5ub2RlczsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cdCAgICB2YXIgbGV4ZXIgPSB0aGlzLmxleGVyOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuXHQgICAgdmFyIG9yaWdfY29udGV4dE9yRnJhbWVMb29rdXAgPSBydW50aW1lLmNvbnRleHRPckZyYW1lTG9va3VwO1xuXHQgICAgdmFyIG9yaWdfQ29tcGlsZXJfYXNzZXJ0VHlwZSA9IENvbXBpbGVyLnByb3RvdHlwZS5hc3NlcnRUeXBlO1xuXHQgICAgdmFyIG9yaWdfUGFyc2VyX3BhcnNlQWdncmVnYXRlID0gUGFyc2VyLnByb3RvdHlwZS5wYXJzZUFnZ3JlZ2F0ZTtcblx0ICAgIHZhciBvcmlnX21lbWJlckxvb2t1cCA9IHJ1bnRpbWUubWVtYmVyTG9va3VwO1xuXG5cdCAgICBmdW5jdGlvbiB1bmluc3RhbGwoKSB7XG5cdCAgICAgICAgcnVudGltZS5jb250ZXh0T3JGcmFtZUxvb2t1cCA9IG9yaWdfY29udGV4dE9yRnJhbWVMb29rdXA7XG5cdCAgICAgICAgQ29tcGlsZXIucHJvdG90eXBlLmFzc2VydFR5cGUgPSBvcmlnX0NvbXBpbGVyX2Fzc2VydFR5cGU7XG5cdCAgICAgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUFnZ3JlZ2F0ZSA9IG9yaWdfUGFyc2VyX3BhcnNlQWdncmVnYXRlO1xuXHQgICAgICAgIHJ1bnRpbWUubWVtYmVyTG9va3VwID0gb3JpZ19tZW1iZXJMb29rdXA7XG5cdCAgICB9XG5cblx0ICAgIHJ1bnRpbWUuY29udGV4dE9yRnJhbWVMb29rdXAgPSBmdW5jdGlvbihjb250ZXh0LCBmcmFtZSwga2V5KSB7XG5cdCAgICAgICAgdmFyIHZhbCA9IG9yaWdfY29udGV4dE9yRnJhbWVMb29rdXAuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0ICAgICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcblx0ICAgICAgICAgICAgY2FzZSAnVHJ1ZSc6XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgICAgICAgICAgY2FzZSAnRmFsc2UnOlxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICAgICAgICBjYXNlICdOb25lJzpcblx0ICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHZhbDtcblx0ICAgIH07XG5cblx0ICAgIHZhciBTbGljZSA9IG5vZGVzLk5vZGUuZXh0ZW5kKCdTbGljZScsIHtcblx0ICAgICAgICBmaWVsZHM6IFsnc3RhcnQnLCAnc3RvcCcsICdzdGVwJ10sXG5cdCAgICAgICAgaW5pdDogZnVuY3Rpb24obGluZW5vLCBjb2xubywgc3RhcnQsIHN0b3AsIHN0ZXApIHtcblx0ICAgICAgICAgICAgc3RhcnQgPSBzdGFydCB8fCBuZXcgbm9kZXMuTGl0ZXJhbChsaW5lbm8sIGNvbG5vLCBudWxsKTtcblx0ICAgICAgICAgICAgc3RvcCA9IHN0b3AgfHwgbmV3IG5vZGVzLkxpdGVyYWwobGluZW5vLCBjb2xubywgbnVsbCk7XG5cdCAgICAgICAgICAgIHN0ZXAgPSBzdGVwIHx8IG5ldyBub2Rlcy5MaXRlcmFsKGxpbmVubywgY29sbm8sIDEpO1xuXHQgICAgICAgICAgICB0aGlzLnBhcmVudChsaW5lbm8sIGNvbG5vLCBzdGFydCwgc3RvcCwgc3RlcCk7XG5cdCAgICAgICAgfVxuXHQgICAgfSk7XG5cblx0ICAgIENvbXBpbGVyLnByb3RvdHlwZS5hc3NlcnRUeXBlID0gZnVuY3Rpb24obm9kZSkge1xuXHQgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgU2xpY2UpIHtcblx0ICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gb3JpZ19Db21waWxlcl9hc3NlcnRUeXBlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICB9O1xuXHQgICAgQ29tcGlsZXIucHJvdG90eXBlLmNvbXBpbGVTbGljZSA9IGZ1bmN0aW9uKG5vZGUsIGZyYW1lKSB7XG5cdCAgICAgICAgdGhpcy5lbWl0KCcoJyk7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUV4cHJlc3Npb24obm9kZS5zdGFydCwgZnJhbWUpO1xuXHQgICAgICAgIHRoaXMuZW1pdCgnKSwoJyk7XG5cdCAgICAgICAgdGhpcy5fY29tcGlsZUV4cHJlc3Npb24obm9kZS5zdG9wLCBmcmFtZSk7XG5cdCAgICAgICAgdGhpcy5lbWl0KCcpLCgnKTtcblx0ICAgICAgICB0aGlzLl9jb21waWxlRXhwcmVzc2lvbihub2RlLnN0ZXAsIGZyYW1lKTtcblx0ICAgICAgICB0aGlzLmVtaXQoJyknKTtcblx0ICAgIH07XG5cblx0ICAgIGZ1bmN0aW9uIGdldFRva2Vuc1N0YXRlKHRva2Vucykge1xuXHQgICAgICAgIHJldHVybiB7XG5cdCAgICAgICAgICAgIGluZGV4OiB0b2tlbnMuaW5kZXgsXG5cdCAgICAgICAgICAgIGxpbmVubzogdG9rZW5zLmxpbmVubyxcblx0ICAgICAgICAgICAgY29sbm86IHRva2Vucy5jb2xub1xuXHQgICAgICAgIH07XG5cdCAgICB9XG5cblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VBZ2dyZWdhdGUgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdCAgICAgICAgdmFyIG9yaWdTdGF0ZSA9IGdldFRva2Vuc1N0YXRlKHRoaXMudG9rZW5zKTtcblx0ICAgICAgICAvLyBTZXQgYmFjayBvbmUgYWNjb3VudGluZyBmb3Igb3BlbmluZyBicmFja2V0L3BhcmVuc1xuXHQgICAgICAgIG9yaWdTdGF0ZS5jb2xuby0tO1xuXHQgICAgICAgIG9yaWdTdGF0ZS5pbmRleC0tO1xuXHQgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICAgIHJldHVybiBvcmlnX1BhcnNlcl9wYXJzZUFnZ3JlZ2F0ZS5hcHBseSh0aGlzKTtcblx0ICAgICAgICB9IGNhdGNoKGUpIHtcblx0ICAgICAgICAgICAgdmFyIGVyclN0YXRlID0gZ2V0VG9rZW5zU3RhdGUodGhpcy50b2tlbnMpO1xuXHQgICAgICAgICAgICB2YXIgcmV0aHJvdyA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgICAgICAgICAgbGliLmV4dGVuZChzZWxmLnRva2VucywgZXJyU3RhdGUpO1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGU7XG5cdCAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgLy8gUmVzZXQgdG8gc3RhdGUgYmVmb3JlIG9yaWdpbmFsIHBhcnNlQWdncmVnYXRlIGNhbGxlZFxuXHQgICAgICAgICAgICBsaWIuZXh0ZW5kKHRoaXMudG9rZW5zLCBvcmlnU3RhdGUpO1xuXHQgICAgICAgICAgICB0aGlzLnBlZWtlZCA9IGZhbHNlO1xuXG5cdCAgICAgICAgICAgIHZhciB0b2sgPSB0aGlzLnBlZWtUb2tlbigpO1xuXHQgICAgICAgICAgICBpZiAodG9rLnR5cGUgIT09IGxleGVyLlRPS0VOX0xFRlRfQlJBQ0tFVCkge1xuXHQgICAgICAgICAgICAgICAgdGhyb3cgcmV0aHJvdygpO1xuXHQgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHZhciBub2RlID0gbmV3IFNsaWNlKHRvay5saW5lbm8sIHRvay5jb2xubyk7XG5cblx0ICAgICAgICAgICAgLy8gSWYgd2UgZG9uJ3QgZW5jb3VudGVyIGEgY29sb24gd2hpbGUgcGFyc2luZywgdGhpcyBpcyBub3QgYSBzbGljZSxcblx0ICAgICAgICAgICAgLy8gc28gcmUtcmFpc2UgdGhlIG9yaWdpbmFsIGV4Y2VwdGlvbi5cblx0ICAgICAgICAgICAgdmFyIGlzU2xpY2UgPSBmYWxzZTtcblxuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBub2RlLmZpZWxkcy5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2tpcChsZXhlci5UT0tFTl9SSUdIVF9CUkFDS0VUKSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgaWYgKGkgPT09IG5vZGUuZmllbGRzLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmIChpc1NsaWNlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmFpbCgncGFyc2VTbGljZTogdG9vIG1hbnkgc2xpY2UgY29tcG9uZW50cycsIHRvay5saW5lbm8sIHRvay5jb2xubyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2tpcChsZXhlci5UT0tFTl9DT0xPTikpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpc1NsaWNlID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gbm9kZS5maWVsZHNbaV07XG5cdCAgICAgICAgICAgICAgICAgICAgbm9kZVtmaWVsZF0gPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlzU2xpY2UgPSB0aGlzLnNraXAobGV4ZXIuVE9LRU5fQ09MT04pIHx8IGlzU2xpY2U7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgaWYgKCFpc1NsaWNlKSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyByZXRocm93KCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIG5ldyBub2Rlcy5BcnJheSh0b2subGluZW5vLCB0b2suY29sbm8sIFtub2RlXSk7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblxuXHQgICAgZnVuY3Rpb24gc2xpY2VMb29rdXAob2JqLCBzdGFydCwgc3RvcCwgc3RlcCkge1xuXHQgICAgICAgIG9iaiA9IG9iaiB8fCBbXTtcblx0ICAgICAgICBpZiAoc3RhcnQgPT09IG51bGwpIHtcblx0ICAgICAgICAgICAgc3RhcnQgPSAoc3RlcCA8IDApID8gKG9iai5sZW5ndGggLSAxKSA6IDA7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmIChzdG9wID09PSBudWxsKSB7XG5cdCAgICAgICAgICAgIHN0b3AgPSAoc3RlcCA8IDApID8gLTEgOiBvYmoubGVuZ3RoO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIGlmIChzdG9wIDwgMCkge1xuXHQgICAgICAgICAgICAgICAgc3RvcCArPSBvYmoubGVuZ3RoO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuXHQgICAgICAgICAgICBzdGFydCArPSBvYmoubGVuZ3RoO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHZhciByZXN1bHRzID0gW107XG5cblx0ICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQ7IDsgaSArPSBzdGVwKSB7XG5cdCAgICAgICAgICAgIGlmIChpIDwgMCB8fCBpID4gb2JqLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgaWYgKHN0ZXAgPiAwICYmIGkgPj0gc3RvcCkge1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgaWYgKHN0ZXAgPCAwICYmIGkgPD0gc3RvcCkge1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHJ1bnRpbWUubWVtYmVyTG9va3VwKG9iaiwgaSkpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gcmVzdWx0cztcblx0ICAgIH1cblxuXHQgICAgdmFyIEFSUkFZX01FTUJFUlMgPSB7XG5cdCAgICAgICAgcG9wOiBmdW5jdGlvbihpbmRleCkge1xuXHQgICAgICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9wKCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgaWYgKGluZGV4ID49IHRoaXMubGVuZ3RoIHx8IGluZGV4IDwgMCkge1xuXHQgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZXlFcnJvcicpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBhcHBlbmQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnB1c2goZWxlbWVudCk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICBpZiAodGhpc1tpXSA9PT0gZWxlbWVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNwbGljZShpLCAxKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlRXJyb3InKTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGNvdW50OiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdCAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXNbaV0gPT09IGVsZW1lbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJldHVybiBjb3VudDtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGluZGV4OiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdCAgICAgICAgICAgIHZhciBpO1xuXHQgICAgICAgICAgICBpZiAoKGkgPSB0aGlzLmluZGV4T2YoZWxlbWVudCkpID09PSAtMSkge1xuXHQgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdWYWx1ZUVycm9yJyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIGk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBmaW5kOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLmluZGV4T2YoZWxlbWVudCk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBpbnNlcnQ6IGZ1bmN0aW9uKGluZGV4LCBlbGVtKSB7XG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLnNwbGljZShpbmRleCwgMCwgZWxlbSk7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0ICAgIHZhciBPQkpFQ1RfTUVNQkVSUyA9IHtcblx0ICAgICAgICBpdGVtczogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgIHZhciByZXQgPSBbXTtcblx0ICAgICAgICAgICAgZm9yKHZhciBrIGluIHRoaXMpIHtcblx0ICAgICAgICAgICAgICAgIHJldC5wdXNoKFtrLCB0aGlzW2tdXSk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIHJldDtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIHZhbHVlczogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgIHZhciByZXQgPSBbXTtcblx0ICAgICAgICAgICAgZm9yKHZhciBrIGluIHRoaXMpIHtcblx0ICAgICAgICAgICAgICAgIHJldC5wdXNoKHRoaXNba10pO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJldHVybiByZXQ7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBrZXlzOiBmdW5jdGlvbigpIHtcblx0ICAgICAgICAgICAgdmFyIHJldCA9IFtdO1xuXHQgICAgICAgICAgICBmb3IodmFyIGsgaW4gdGhpcykge1xuXHQgICAgICAgICAgICAgICAgcmV0LnB1c2goayk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIHJldDtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGdldDogZnVuY3Rpb24oa2V5LCBkZWYpIHtcblx0ICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRoaXNba2V5XTtcblx0ICAgICAgICAgICAgaWYgKG91dHB1dCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgICBvdXRwdXQgPSBkZWY7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGhhc19rZXk6IGZ1bmN0aW9uKGtleSkge1xuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgcG9wOiBmdW5jdGlvbihrZXksIGRlZikge1xuXHQgICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpc1trZXldO1xuXHQgICAgICAgICAgICBpZiAob3V0cHV0ID09PSB1bmRlZmluZWQgJiYgZGVmICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgICAgIG91dHB1dCA9IGRlZjtcblx0ICAgICAgICAgICAgfSBlbHNlIGlmIChvdXRwdXQgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZXlFcnJvcicpO1xuXHQgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXNba2V5XTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgcG9waXRlbTogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgIGZvciAodmFyIGsgaW4gdGhpcykge1xuXHQgICAgICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSBmaXJzdCBvYmplY3QgcGFpci5cblx0ICAgICAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzW2tdO1xuXHQgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXNba107XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gW2ssIHZhbF07XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZXlFcnJvcicpO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgc2V0ZGVmYXVsdDogZnVuY3Rpb24oa2V5LCBkZWYpIHtcblx0ICAgICAgICAgICAgaWYgKGtleSBpbiB0aGlzKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1trZXldO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGlmIChkZWYgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICAgICAgZGVmID0gbnVsbDtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gdGhpc1trZXldID0gZGVmO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihrd2FyZ3MpIHtcblx0ICAgICAgICAgICAgZm9yICh2YXIgayBpbiBrd2FyZ3MpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXNba10gPSBrd2FyZ3Nba107XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIG51bGw7ICAgIC8vIEFsd2F5cyByZXR1cm5zIE5vbmVcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXHQgICAgT0JKRUNUX01FTUJFUlMuaXRlcml0ZW1zID0gT0JKRUNUX01FTUJFUlMuaXRlbXM7XG5cdCAgICBPQkpFQ1RfTUVNQkVSUy5pdGVydmFsdWVzID0gT0JKRUNUX01FTUJFUlMudmFsdWVzO1xuXHQgICAgT0JKRUNUX01FTUJFUlMuaXRlcmtleXMgPSBPQkpFQ1RfTUVNQkVSUy5rZXlzO1xuXHQgICAgcnVudGltZS5tZW1iZXJMb29rdXAgPSBmdW5jdGlvbihvYmosIHZhbCwgYXV0b2VzY2FwZSkgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblx0ICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCkge1xuXHQgICAgICAgICAgICByZXR1cm4gc2xpY2VMb29rdXAuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgb2JqID0gb2JqIHx8IHt9O1xuXG5cdCAgICAgICAgLy8gSWYgdGhlIG9iamVjdCBpcyBhbiBvYmplY3QsIHJldHVybiBhbnkgb2YgdGhlIG1ldGhvZHMgdGhhdCBQeXRob24gd291bGRcblx0ICAgICAgICAvLyBvdGhlcndpc2UgcHJvdmlkZS5cblx0ICAgICAgICBpZiAobGliLmlzQXJyYXkob2JqKSAmJiBBUlJBWV9NRU1CRVJTLmhhc093blByb3BlcnR5KHZhbCkpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge3JldHVybiBBUlJBWV9NRU1CRVJTW3ZhbF0uYXBwbHkob2JqLCBhcmd1bWVudHMpO307XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKGxpYi5pc09iamVjdChvYmopICYmIE9CSkVDVF9NRU1CRVJTLmhhc093blByb3BlcnR5KHZhbCkpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge3JldHVybiBPQkpFQ1RfTUVNQkVSU1t2YWxdLmFwcGx5KG9iaiwgYXJndW1lbnRzKTt9O1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiBvcmlnX21lbWJlckxvb2t1cC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHQgICAgfTtcblxuXHQgICAgcmV0dXJuIHVuaW5zdGFsbDtcblx0fVxuXG5cdG1vZHVsZS5leHBvcnRzID0gaW5zdGFsbENvbXBhdDtcblxuXG4vKioqLyB9KVxuLyoqKioqKi8gXSlcbn0pO1xuOyIsImltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vbGliL2NvbnRyb2xsZXInO1xuaW1wb3J0IG51bmp1Y2tzIGZyb20gJ251bmp1Y2tzJztcblxubnVuanVja3MuY29uZmlndXJlKCcuL2Rpc3QnKTtcblxuZnVuY3Rpb24gZ2V0TmFtZShyZXF1ZXN0KSB7XG4gIGxldCBuYW1lID0ge1xuICAgIGZuYW1lOiAnUmljaycsXG4gICAgbG5hbWU6ICdTYW5jaGV6J1xuICB9O1xuXG4gIGxldCBuYW1lUGFydHMgPSByZXF1ZXN0LnBhcmFtcy5uYW1lID8gcmVxdWVzdC5wYXJhbXMubmFtZS5zcGxpdCgnLycpIDogW107XG5cbiAgbmFtZS5mbmFtZSA9IChuYW1lUGFydHNbMF0gfHwgcmVxdWVzdC5xdWVyeS5mbmFtZSkgfHwgbmFtZS5mbmFtZTtcbiAgbmFtZS5sbmFtZSA9IChuYW1lUGFydHNbMV0gfHwgcmVxdWVzdC5xdWVyeS5sbmFtZSkgfHwgbmFtZS5sbmFtZTtcbiAgcmV0dXJuIG5hbWU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlbGxvQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXIge1xuICB0b1N0cmluZyhjYWxsYmFjaykge1xuICAgIG51bmp1Y2tzLnJlbmRlclN0cmluZygnaGVsbG8uaHRtbCcsIGdldE5hbWUodGhpcy5jb250ZXh0KSwgKGVyciwgaHRtbCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKG51bGwsIGh0bWwpO1xuICAgIH0pO1xuICB9XG59XG4iLCJjb25zb2xlLmxvZygnaGVsbG8gYnJvd3NlcicpO1xuXG5pbXBvcnQgQXBwbGljYXRpb24gZnJvbSAnLi9saWInO1xuaW1wb3J0IEhlbGxvQ29udHJvbGxlciBmcm9tICcuL2hlbGxvLWNvbnRyb2xsZXInO1xuXG5jb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBBcHBsaWNhdGlvbih7XG4gICcvaGVsbG8ve25hbWV9JzogSGVsbG9Db250cm9sbGVyXG59LCB7XG5cbiAgdGFyZ2V0OiAnYm9keSdcbn0pXG5cbmFwcGxpY2F0aW9uLnN0YXJ0KCk7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCkge1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIH1cblxuICBpbmRleChhcHBsaWNhdGlvbiwgcmVxdWVzdCwgcmVwbHksIGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sobnVsbCk7XG4gIH1cblxuICB0b1N0cmluZyhjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrKG51bGwsICfmiJDlip8nKVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gIG5hdmlnYXRlKHVybCwgcHVzaD10cnVlKSB7XG4gICAgY29uc29sZS5sb2codXJsKTtcblxuICAgIC8vIGhpc3RvcnkgYXBp44Gr5a++5b+c44GX44Gm44GE44Gq44GE44OW44Op44Km44K244Gn44GvbG9jYXRpb27jgat1cmzjgpLjgrvjg4Pjg4jjgZfjgabntYLkuoZcbiAgICBpZiAoIWhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24gPSB1cmw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2codXJsKTtcblxuICAgIC8vIHB1c2jlvJXmlbDjgYx0cnVl44Gu5aC05ZCI44Gu44G/IOWxpeattOOBruOCueOCv+ODg+OCr+OBq+ODl+ODg+OCt+ODpVxuICAgIGlmIChwdXNoKSB7XG4gICAgICBoaXN0b3J5LnB1c2hTdGFlKHt9LCBudWxsLCB1cmwpO1xuICAgIH1cbiAgfVxuICBzdGFydCgpIHtcbiAgICB0aGlzLnBvcFN0YXRlTGlzdGVuZXIgPSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoZSkgPT4ge1xuICAgICAgbGV0IHtwYXRobmFtZSwgc2VhcmNofSA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgIGxldCB1cmwgPSBgJHtwYXRobmFtZX0ke3NlYXJjaH1gO1xuICAgICAgdGhpcy5uYXZpZ2F0ZSh1cmwsIGZhbHNlKTtcbiAgICB9KTtcblxuICAgIC8vIOOCr+ODquODg+OCr+OBruOCpOODmeODs+ODiOODj+ODs+ODieODqeS9nOaIkFxuICAgIHRoaXMuY2xpY2tMaXN0ZW5lciA9IGRvY3VtZW50LmFkZGV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGxldCB7dGFyZ2V0fSA9IGU7XG4gICAgICBsZXQgaWRlbnRpZmllciA9IHRhcmdldC5kYXRhc2V0Lm5hdmlnYXRlO1xuICAgICAgbGV0IGhyZWYgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cbiAgICAgIGlmIChpZGVudGlmaWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGhyZWYpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5hdmlnYXRlKGlkZW50aWZpZXIgfHwgaHJlZik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
