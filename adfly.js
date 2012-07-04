/**
 * adf.ly link changer
 * 
 * @author Gergely "Garpeer" Aradszki
 * 
 * @param id string adf.ly user id
 * @param options object
 * 
 * Possible options values:
 * options.type [int|banner] ad type
 * options.domains domains to include
 * options.exclude domains to exclude
 * 
 * domains & exclude accepts * wildcard for subdomains (*.example.com)
 */
var Adfly = function(id, options){
    var self
    
    if (this === window){
        self = this.Adfly;
    }else{
        self = this;
    }
    
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
    
    var prepare_domain = function (domains){
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
    
    
    var parseOptions = function(options){
        options = (options && Object == options.constructor) ? Object.create(options) : {};
        if (options.type != 'int' && options.type != 'banner') {
            options.type = 'int';
        }        
        options.parent = (undefined !== options.parent) ? options.parent : document;
        options.domains = prepare_domain(options.domains);
        options.exclude = prepare_domain(options.exclude);
        return options;
    }
    
    var init = function (id , options){
        if (undefined === id){
            throw 'Adfly id not set';
        }
        self.id = id;
        self.options = options;
    }
    
    
    self.replace = function(parent){
        var options = parseOptions(self.options);
        parent = (undefined !== parent) ? parent : options.parent;
        var url;
        var location = window.location.href;
        var l = location.length;
        var links = parent.getElementsByTagName('a');
        var num_of_links = links.length;
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
                    }
                }
            
        }
    }
    if (this === window){
        init(id, options);
        self.replace();
    }else{
        init(id, options);
    }
}