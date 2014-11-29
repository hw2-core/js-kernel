/*
 * Copyright (C) 2007 - 2014 Hyperweb2 All rights reserved.
 * GNU General Public License version 3; see www.hyperweb2.com/terms/
 */

//DEPENDENCIES
define([
    HW2PATH_JS_KERNEL + "Class.js",
    HW2PATH_JS_KERNEL + "syntax.js"
], function () {
    var $ = Hw2Core;
    return Hw2Core.Loader = $.Class({members: [
            {
                /**
                 * src {String} -> path of resource to load
                 * options {Object}:
                 * sync {Boolen} -> load in async/sync mode
                 * callback {Function}: function to cast as callback
                 */
                attributes: ["public", "static"],
                name: "load",
                val: function (src, callback, options) {
                    options = options || {};
                    options.sync = options.sync !== undefined ? options.sync : false;

                    try {
                        if (!options.sync) {
                            requirejs(
                                    Array.isArray(src) ? src : [src],
                                    typeof callback !== "undefined" ? callback : null
                                    );
                        } else {
                            function loadSync (src) {
                                if (HW2_INBROWSER) {
                                    var xhrObj = createXMLHTTPObject();
                                    // open and send a synchronous request
                                    xhrObj.open('GET', src, false);
                                    xhrObj.send('');
                                    // add the returned content to a newly created script tag
                                    var se = document.createElement('script');
                                    se.type = "text/javascript";
                                    se.text = xhrObj.responseText;
                                    document.getElementsByTagName('head')[0].appendChild(se);

                                    if (typeof callback !== "undefined") {
                                        callback(requirejs(src));
                                    }
                                } else {
                                    var res = require(src);
                                    callback(res);
                                    return res;
                                }
                            }

                            if (Array.isArray(src)) {
                                for (i in src) {
                                    loadSync(src[i]);
                                }
                            } else {
                                loadSync(src);
                            }
                        }

                    } catch (error) {
                        throw error;
                        return false;
                    }
                }
            }
        ]
    });
});

