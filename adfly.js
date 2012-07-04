/**
 * adf.ly link changer
 *
 * @author Gergely "Garpeer" Aradszki
 *
 * @param id string adf.ly user id
 * @param options object (optional)
 *
 * Possible options values:
 * options.type [int|banner] ad type (defaults to int)
 * options.domains domains to include (defaults to all links)
 * options.exclude domains to exclude
 * options.parent element in which to change links, defaults to document (DOM Element)
 *
 * domains & exclude accepts * wildcard for subdomains & domains (*.example.com, *.com)
 *
 * two modes of deployment:
 *  simple:
 *      Adfly('your_adfly_id', { type: ... });
 *
 *  instance:
 *      var adfly = new Adfly('your_adfly_id', { domain : '*.example.com' });
 *      adfly.replace();
 *      adfly.options.type = 'banner';
 *      adfly.options.domain = '*.example.other';
 *      adfly.replace();
 *
 *   @todo convert domains list to array
 *   @todo check if exclude is subset of domain and vice versa
 *   @todo remove method
 *   @todo allow single replace (options.parent is <a>)
 */
var Adfly = function (id, options) {
    "use strict";
    var self,
        is_instance,
        /**
        * check whether domain is on the domains list
        *
        * @param domain
        * @param domains
        * @return boolean
        */
        has_domain = function (domain, domains) {
            var d, checker, start;
            if (domains) {
                for (d in domains) {
                    if (domains.hasOwnProperty(d)) {
                        checker = domains[d];
                        if (domain === checker.host) {
                            return true;
                        }
                        if (checker.is_wildcard) {
                            start = domain.length - checker.host.length;
                            if (domain.substr(start - 1) === ('.' + checker.host)) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        },

        /**
        * prepare domain list
        *
        * @param domains
        * @return object
        */
        prepare_domains = function (domains) {
            var out,
                list,
                i = 0,
                l,
                domain;
            if (domains) {
                out = {};
                if ('string' === typeof (domains)) {
                    list = [domains];
                } else {
                    list = domains;
                }
                l = list.length;
                for (i; i < l; i += 1) {
                    domain = list[i];
                    if ('*' === domain.substr(0, 1)) {
                        out[i] = {
                            host: domain.substr(2),
                            is_wildcard: true
                        };
                    } else {
                        out[i] = {
                            host: domain,
                            is_wildcard: false
                        };
                    }
                }
            }
            return out;
        },

        /**
        * parse options
        *
        * @param options object
        * @return object
        */
        parseOptions = function (options) {
            options = (options && Object === options.constructor) ? Object.create(options) : {};
            if (options.type !== 'int' && options.type !== 'banner') {
                options.type = 'int';
            }
            options.parent = (undefined !== options.parent) ? options.parent : document;
            options.domains = prepare_domains(options.domains);
            options.exclude = prepare_domains(options.exclude);
            return options;
        },

        /**
        * initialize script
        *
        * @param id adfly user id
        * @param options
        */
        init = function (id, options) {
            if (undefined === id) {
                throw 'Adfly id not set';
            }
            self.id = id;
            self.options = options;
        };

    if (undefined === this || window === this) {
        self = window.Adfly;
        is_instance = false;
    } else {
        self = this;
        is_instance = true;
    }

    /**
     * replace links
     *
     * @parent parent element (optional)
     */
    self.replace = function (parent) {
        var options = parseOptions(self.options),
            element = ((undefined !== parent) ? parent : options.parent),
            location = window.location.href,
            links = element.getElementsByTagName('a'),
            link,
            counter = 0,
            i = 0,
            href,
            hostname,
            replace;
        for (i; i < links.length; i += 1) {
            link = links[i];
            href = (undefined === link.adflyOriginalHref) ? link.href : link.adflyOriginalHref;
            hostname = (undefined === link.adflyOriginalHostname) ? link.hostname : link.adflyOriginalHostname;
            if (href && (location !== href.substr(0, location.length)) && (hostname !== 'adf.ly')) {
                replace = true;
                if (typeof (options.domains) === "object") {
                    if (!has_domain(hostname, options.domains)) {
                        replace = false;
                    }
                } else if (typeof (options.exclude) === "object") {
                    if (has_domain(hostname, options.exclude)) {
                        replace = false;
                    }
                }

                if (replace) {
                    link.adflyOriginalHref = href;
                    link.adflyOriginalHostname = hostname;
                    if (options.type === 'int') {
                        link.href = "http://adf.ly/" + id + "/" + href;
                    } else {
                        link.href = "http://adf.ly/" + id + "/banner/" + href;
                    }
                    counter += 1;
                }
            }
        }
        return counter;
    };

    if (is_instance) {
        init(id, options);
    } else {
        init(id, options);
        self.replace();
    }
};