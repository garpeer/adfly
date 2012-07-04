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
 * domains & exclude accepts * wildcard
 */
var Adfly = function(id, options){
    var self;
    
    if (this === window){
        self = this.Adfly;
    }else{
        self = this;
    } 
    
    
    var has_domain = function(domain, domains){
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
        return false;
    }
    var prepare_domain = function (domains){
        if (domains){
            if (typeof(domains)=='string'){
                domains = [domains];
            }
            var l = domains.length;
            for (var i=0; i < l; i++){
                var domain = domains[i];
                if (domain.substr(0,1)=='*'){
                    domains[i] = {
                        host: domain.substr(2),
                        is_wildcard: true
                    }
                }else{
                    domains[i] = {
                        host: domain,
                        is_wildcard: false
                    }
                }
            }
        }
        return domains;
    }
    
    var init = function (id , options){
        if (undefined === id){
            throw 'Adfly id not set';
        }  
        self.id = id;
        self.options = (options && Object == options.constructor) ? options : {};        
        if (self.options.type != 'int' && self.options.type != 'banner') {
            self.options.type = 'int';
        }
        self.options.exclude = prepare_domain(self.options.exclude);
        self.options.domains = prepare_domain(self.options.domains);
        self.options.parent = (undefined !== self.options.parent) ? self.options.parent : document;
    }
    
    
    self.replace = function(parent){
        parent = (undefined !== parent) ? parent : self.options.parent;
        var url;
        var location = window.location.href;
        var l = location.length;
        var links = parent.getElementsByTagName('a');
        var num_of_links = links.length;
        for (var i=0; i < num_of_links; i++){
            var link = links[i];
            if (!link.has_adfly){
                var href = link.href;
                var hostname = link.hostname;
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
                        if (options.type == 'int') {
                            url = "http://adf.ly/" + id + "/"+href;
                        } else {
                            url = "http://adf.ly/" + id + "/banner/"+href;
                        }
                        link.href = url;
                        link.has_adfly = true;
                    }
                }
            }
        }
    }
    if (this === window){
        init(id, options);
        self.replace(self.options.parent);
    }else{
        init(id, options);
    }
}