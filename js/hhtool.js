(function(){
    // @log delete setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')
    !function(t,e){function n(t){return t&&e.XDomainRequest&&!/MSIE 1/.test(navigator.userAgent)?new XDomainRequest:e.XMLHttpRequest?new XMLHttpRequest:void 0}function o(t,e,n){t[e]=t[e]||n}var r=["responseType","withCredentials","timeout","onprogress"];t.ajax=function(t,a){function s(t,e){return function(){c||(a(void 0===f.status?t:f.status,0===f.status?"Error":f.response||f.responseText||e,f),c=!0)}}var u=t.headers||{},i=t.body,d=t.method||(i?"POST":"GET"),c=!1,f=n(t.cors);f.open(d,t.url,!0);var l=f.onload=s(200);f.onreadystatechange=function(){4===f.readyState&&l()},f.onerror=s(null,"Error"),f.ontimeout=s(null,"Timeout"),f.onabort=s(null,"Abort"),i&&(e.FormData&&i instanceof e.FormData||o(u,"Content-Type","application/x-www-form-urlencoded"));for(var p,m=0,v=r.length;v>m;m++)p=r[m],void 0!==t[p]&&(f[p]=t[p]);for(var p in u)f.setRequestHeader(p,u[p]);return f.send(i),f},e.nanoajax=t}({},function(){return this}());
    /* 参考实现jQuery.param序列化方法 */
    (function(a){var b=a.Tools||{},toString={}.toString;b.stringify=function(f){var e=[];for(var c in f){d(c,f[c],function(h,g){var i=typeof g==="function"?g():g;e[e.length]=encodeURIComponent(h)+"="+encodeURIComponent(i==null?"":i)})}function d(g,k,j){if(toString.apply(k)==="[object Array]"){for(var h=0;h<k.length;h++){if(/\[\]$/.test(g)){j(g,k[h])}else{d(g+"["+(typeof k[h]==="object"&&k[h]!=null?h:"")+"]",k[h])}}}else{if(toString.apply(k)==="[object Object]"){for(name in k){d(g+"["+name+"]",k[name],j)}}else{j(g,k)}}}return e.join("&")};a.Tools=b})(window);
    (function(w){w.$_cookie={get:function(name,options){this.validateCookieName(name);if(typeof options==="function"){options={converter:options}}else{options=options||{}}var cookies=this.parseCookieString(document.cookie,!options["raw"]);return(options.converter||this.same)(cookies[name])},set:function(name,value,options){this.validateCookieName(name);options=options||{};var expires=options["expires"];var domain=options["domain"];var path=options["path"];if(!options["raw"]){value=encodeURIComponent(String(value))}var text=name+"="+value;var date=expires;if(typeof date==="number"){date=new Date();date.setDate(date.getDate()+expires)}if(date instanceof Date){text+="; expires="+date.toUTCString()}if(this.isNonEmptyString(domain)){text+="; domain="+domain}if(this.isNonEmptyString(path)){text+="; path="+path}if(options["secure"]){text+="; secure"}document.cookie=text;return text},remove:function(name,options){options=options||{};options["expires"]=new Date(0);return this.set(name,"",options)},parseCookieString:function(text,shouldDecode){var cookies={};if(this.isString(text)&&text.length>0){var decodeValue=shouldDecode?decodeURIComponent:this.same;var cookieParts=text.split(/;\s/g);var cookieName;var cookieValue;var cookieNameValue;for(var i=0,len=cookieParts.length;i<len;i++){cookieNameValue=cookieParts[i].match(/([^=]+)=/i);if(cookieNameValue instanceof Array){try{cookieName=decodeURIComponent(cookieNameValue[1]);cookieValue=decodeValue(cookieParts[i].substring(cookieNameValue[1].length+1))}catch(ex){}}else{cookieName=decodeURIComponent(cookieParts[i]);cookieValue=""}if(cookieName){cookies[cookieName]=cookieValue}}}return cookies},isString:function(o){return typeof o==="string"},isNonEmptyString:function(s){return this.isString(s)&&s!==""},validateCookieName:function(name){if(!this.isNonEmptyString(name)){throw new TypeError("Cookie name must be a non-empty string")}},same:function(s){return s}}})(window);

    var ocsInfo = {
        http : ['wsap-fs201.zcgsha.com:65','tapi1.zcgsqd.com:65','tapi2.zcgshm.com:65','publicserv-1526.zcgsyq.com:65','ocsapi-aka.zcgsha.com','publicserv-2541.zcgsrg.com', 'publicserv-3658.zcgsqd.com'],
        https : ['wsap-fs201.zcgsha.com:66','tapi1.zcgsqd.com:66','tapi2.zcgshm.com:66','publicserv-1526.zcgsyq.com:66','ocsapi-aka.zcgsha.com','publicserv-2541.zcgsrg.com', 'publicserv-3658.zcgsqd.com'],
        path : '/ocs/qp-card',
        protocol: location.protocol,
    }

    var _code, _sn, _callback, _movieKey, _superSign;

    function getOCSConfig() {
        var proto = ocsInfo.protocol.replace(/\W/, '');
        var domains = ocsInfo[proto];
        race(domains, '/ping.gif', function(fastDomain){
            var url = ocsInfo.protocol + '//' + fastDomain + ocsInfo.path + '?ts=' + Date.now()
            window.nanoajax.ajax({
                url: url
            }, function(code, res, req) {
                if(code == 200) {
                    var respObj = JSON.parse(res);
                    var domainConfig = respObj[proto];
                    //ping api
                    race(domainConfig.API_DOMAINS, '/ping.gif', function(fd) {
                        setPromoCode(fd);
                    });
                    //ping cdn
                    race(respObj.gb_app_file_domains, '/ping.gif', function(fd) {
                        _callback({
                            ios: createIOSLink(fd),
                            android: createAndroidLink(fd)
                        })
                    });
                }
            });
        })
    }

    function race(domains, path, cb) {
        var hit = false;
        for (var i = 0; i < domains.length; i++) {
            (function(){
                var domain = domains[i];
                var url = ocsInfo.protocol + '//' + domain + path + '?ts=' + Date.now()
                window.nanoajax.ajax({
                    url: url,
                    timeout: 4000
                }, function(code, res, req) {
                    if(hit) return;
                    if(code == 200) {
                        hit = true;
                        cb(domain)
                    }
                });
            })()
        }
    }

    function setPromoCode(domain) {
        var params = {promotionCode: getCode(), sn: getSN(), movieKey: getMovieKey()||''}
        var ran = new Date().getTime() + '_' + Math.random();
        var json = {
            "id": ran,
            "method": 'sn.user.promotionCode.set',
            "params": params,
            "jsonrpc": '2.0'
        };
        var jstr = JSON.stringify(json);
        window.nanoajax.ajax({
            url: ocsInfo.protocol + '//' + domain + '/qp-cloud/api/' + json.method,
            method: 'post',
            body: Tools.stringify({
                'json': jstr
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 4000
        }, function(code, res, req) {
            // console.log(res);
        })
    }

    function createIOSLink(domain) {
      //  if(getSuperSign()) return getSuperSign();
        return 'itms-services:///?action=download-manifest&url=https://ossformysoft.oss-accelerate.aliyuncs.com/manifest_v1.plist'
    }

    function createAndroidLink(domain) {
        //   return 'https://' + domain + '/qpcdn/app-resource/android/' + getSN() + 'x10_full.apk'
        return 'https://ossformysoft.oss-accelerate.aliyuncs.com/YHQP-release.apk'
    }

    function getCode() {
        return _code;
    }

    function getSN() {
        return _sn;
    }

    //推廣碼
    function setCode(code) {
        _code = code;
    }

    //廳代號
    function setSN(sn) {
        _sn = sn;
    }

    function setCB(cb) {
        _callback = cb;
    }

    function getCB(cb) {
        return _callback;
    }

    function setMovieKey(movieKey) {
        _movieKey = movieKey;
    }

    function getMovieKey() {
        return _movieKey;
    }

    function setSuperSign(superSign) {
        _superSign = superSign;
    }

    function getSuperSign() {
        return _superSign;
    }

    function run(param) {
        setSN(param.sn)
        setCode(param.code)
        setCB(param.callback)
        setMovieKey(param.movieKey||queryString('mtoken'))
        setSuperSign(param.superSign)
        getOCSConfig();
    }

    function queryString(key) {
        var location = document.location.search;
    	return (location.match(new RegExp("(?:^\\?|&)" + key + "=(.*?)(?=&|$)")) || [ '', null ])[1];
    }

    var bgTool = {
        run: run
    }
    window.BGTool = bgTool;
})()
