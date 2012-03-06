var Adfly = function(options){
   try{
        if (options){
            if ('id' in options){
                  adfly_id = options.id;
            }
            if ('type' in options){
                  adfly_advert = options.type;
            }
            if ('exlude' in options){
                  exclude_domains = options.exclude;
            }
            if ('domains' in options){
                  domains = options.domains;
            }
        }
        if (!options){
            options = {};
            if (adfly_id){
                options.id = adfly_id;
            }
            if (adfly_advert){
                options.type = adfly_advert;
            }
            if (exclude_domains){
                options.exclude = exclude_domains;
            }
            if (domains){
                options.domains = domains;
            }
        }
        if (options.type != 'int' && options.type != 'banner') {
            options.type = 'int';
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
        options.exclude = prepare_domain(options.exclude);
        options.domains = prepare_domain(options.domains);

        var url;
        var location = window.location.href;
        var l = location.length;
        var links = document.getElementsByTagName('a');
        var num_of_links = links.length;
        for (var i=0; i < num_of_links; i++){
            var link = links[i];
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
                        url = "http://adf.ly/"+options.id+"/"+href;
                    } else {
                        url = "http://adf.ly/"+options.id+"/banner/"+href;
                    }
                    link.href = url;
                }
            }
        }
    }catch(err){
        if (console){
            if (typeof(err) == 'object'){
                err = err.message;
            }
            console.error(err);
        }
    }
}

Adfly({
    id: 'Blabbla',
    exclude: '*.example.com'
})