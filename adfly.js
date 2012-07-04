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
 */
var Adfly = function(id, options){
    var self

    if (this === window){
        self = this.Adfly;
    }else{
        self = this;
    }

    /**
     * check whether domain is on the domains list
     *
     * @param domain
     * @param domains
     * @return boolean
     */
    var has_domain = function(domain, domains){
        if (domains){
            for (var d in domains){
                var checker = domains[d];
                if (domain == checker.host){
                    return true;
                }else if (checker.is_wildcard){
                    var start = domain.length - checker.host.length;
                    if (domain.substr(start-1) == ('.'+checker.host)){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * prepare domain list
     *
     * @param domains
     * @return object
     */
    var prepare_domains = function (domains){
        var out, list;
        if (domains){
            out = {}
            if (typeof(domains)=='string'){
                list = [domains];
            }else{
                list = domains;
            }
            var l = list.length;
            for (var i=0; i < l; i++){
                var domain = list[i];
                if (domain.substr(0,1)=='*'){
                    out[i] = {
                        host: domain.substr(2),
                        is_wildcard: true
                    }
                }else{
                    out[i] = {
                        host: domain,
                        is_wildcard: false
                    }
                }
            }
        }
        return out;
    }

    /**
     * parse options
     *
     * @param options object
     * @return object
     */
    var parseOptions = function(options){
        options = (options && Object == options.constructor) ? Object.create(options) : {};
        if (options.type != 'int' && options.type != 'banner') {
            options.type = 'int';
        }
        options.parent = (undefined !== options.parent) ? options.parent : document;
        options.domains = prepare_domains(options.domains);
        options.exclude = prepare_domains(options.exclude);
        return options;
    }

    /**
     * initialize script
     *
     * @param id adfly user id
     * @param options
     */
    var init = function (id , options){
        if (undefined === id){
            throw 'Adfly id not set';
        }
        self.id = id;
        self.options = options;
    }

    /**
     * replace links
     *
     * @parent parent element (optional)
     */
    self.replace = function(parent){
        var options = parseOptions(self.options);
        parent = (undefined !== parent) ? parent : options.parent;
        var url;
        var location = window.location.href;
        var l = location.length;
        var links = parent.getElementsByTagName('a');
        var num_of_links = links.length;
        var counter = 0;
        for (var i=0; i < num_of_links; i++){
            var link = links[i];
            var href = (undefined === link.adflyOriginalHref) ? link.href : link.adflyOriginalHref;
            var hostname = (undefined === link.adflyOriginalHostname) ? link.hostname : link.adflyOriginalHostname;
            if ( href
                && ( location != href.substr(0,l) )
                && ( hostname != 'adf.ly' )
                ){
                var replace = true;
                if (typeof(options.domains) == "object") {
                    if (!has_domain(hostname, options.domains)) {
                        replace = false;
                    }
                }else if (typeof(options.exclude) == "object") {
                    if ( has_domain(hostname, options.exclude) ) {
                        replace = false;
                    }
                }

                if (replace){
                    link.adflyOriginalHref = href;
                    link.adflyOriginalHostname = hostname;
                    if (options.type == 'int') {
                        url = "http://adf.ly/" + id + "/"+href;
                    } else {
                        url = "http://adf.ly/" + id + "/banner/"+href;
                    }
                    link.href = url;
                    counter++;
                }
            }
        }
        return counter;
    }
    if (this === window){
        init(id, options);
        self.replace();
    }else{
        init(id, options);
    }
}