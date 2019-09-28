/*
    接口升级加密版本
    1.获取设备唯一标识 foreverCid
    2.本地生成随机 randomKey 随机公钥
    3.通过设备foreverCid 请求 pubKeyUrl 地址 获取公钥publickKey
    4.用publickKey 对randomKey 进行RAS加密 然后通过url encodeURIComponent编码 得到 totalKey
    5.通过 totalKey去请求 accessTokenUrl 获取accessTokenId
*/
    /* 设置缓存 */
    function setCookie(cname, cvalue, hours) {
        var d = new Date();
        d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString() + ";path=/";
        cvalue = encodeURI(cvalue, "utf-8");
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    /* 获取缓存  */
    function getCookie(cname) {
        var name = cname + "=";
        var ca = decodeURI((document.cookie), "utf-8").split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    /* 清除缓存  */
    function clearCookie(cname) {
        setCookie(cname, "", -1);
    }

    var domainAdd = window.location.host  + "/";

    if(domainAdd.indexOf('localhost') > -1){
        domainAdd = "http://dev.daydaycook.com.cn/";
    }   

    var nowBrush = Date.parse(new Date());
    var tokenBrush = "FB5A1FF3D574DF222E51B6AB862067A246049A01" + nowBrush;
    tokenBrush = hex_md5(tokenBrush).toUpperCase();

    var Fingerprint = require('fingerprintjs');
    var foreverCid = new Fingerprint().get(); //设备id

    var pubKeyUrl; // 请求公钥地址
    var publickKey; //公钥
    var randomKey; //随机生成key
    var crypto = require('crypto'); //crypto
    var cryptoKey; //crypto 第一次生成字节
    var cryptoKey_two; //rypto  第二次生成字节 
    var totalKey; //通过公钥和随机生成的key 去请求accessTokenId接口
    var accessTokenUrl; //请求accessTokenId url
    var accessTokenId; 
    var acctoken; 
    var clearToken; //解密后的token 
    var device = '6'; //device = 6代表pc

    var jsencrypt = require('jsencrypt');
    var RASencrypt = new jsencrypt.JSEncrypt(); //RAS加密

    var linshiKey; //第二个key
    //header 请求头参数 通过linshiKey AESEncrypt加密
    //linshiUrlkey 通过 randomKey AESEncrypt  对linshiKey进行加密
    var linshiHeader = {};
    var linshiHeadToken;
    var linshiUrlkey;
    var linshidevice;
    var linshitokenBrush;
    var linshinowBrush;
    //更新请求时间戳
    function updateBrush(){
        nowBrush = Date.parse(new Date());
        tokenBrush = "FB5A1FF3D574DF222E51B6AB862067A246049A01" + nowBrush;
        tokenBrush = hex_md5(tokenBrush).toUpperCase();
    };

    function newHeader(){
        randomKey = getCookie("randomKey");
        acctoken = getCookie("acctoken");
        
        clearToken = AESDecrypt(randomKey,acctoken);
        cryptoKey_two = crypto.randomBytes(16, function(ex, buf) {
            linshiKey = buf.toString('base64');
        });

        updateBrush();

        //对header参数进行加密
        linshitokenBrush = AESEncrypt(linshiKey,tokenBrush); 
        linshinowBrush = AESEncrypt(linshiKey,nowBrush); 
        linshidevice = AESEncrypt(linshiKey,device); // pc端
        linshiHeadToken = AESEncrypt(linshiKey,clearToken); //通过临时key加密临时token 
        linshiUrlkey = AESEncrypt(randomKey,linshiKey); //临时秘钥 

        linshiHeader = {
            "signature":linshitokenBrush,
            "timestamp":linshinowBrush,
            "device":linshidevice,
            "accessTokenId":linshiHeadToken,
            "cid":foreverCid,
            "key":linshiUrlkey
        }
    }

    //AES加密
    function AESEncrypt(type,word){
        var key = CryptoJS.enc.Base64.parse(type);  
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
        return encrypted.toString();
    }
    //AES解密
    function AESDecrypt(type,word){
        var key = CryptoJS.enc.Base64.parse(type);  
        var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }

    pubKeyUrl = domainAdd + "auth/server/auth/key.do?cid=" + foreverCid;

    //获取公钥
    function getPubFunction(){
        console.log("再次请求");
        clearCookie("randomKey");
        clearCookie("acctoken");
        updateBrush();

        cryptoKey = crypto.randomBytes(16, function(ex, buf) {
            randomKey = buf.toString('base64');
            setCookie("randomKey",randomKey,0.5);
        });

        $.ajax({
            url: pubKeyUrl,
            type: "GET",
            async:false,
            success:function(obj){
                if(obj.code == 200){
                    publickKey =  obj.data.publickKey;
                    RASencrypt.setPublicKey(publickKey); //通过公钥进行RAS加密
                    totalKey = encodeURIComponent(RASencrypt.encrypt(randomKey)); 
                    //需要url编码作为参数去请求accessTokenUrl
                    accessTokenUrl = domainAdd + "auth/server/auth/authKey.do?cid=" + foreverCid + "&key=" + totalKey;
                }
            }
        });

        $.ajax({
            url: accessTokenUrl,
            type: "GET",
            async:false,
            success:function(obj){
                if(obj.code ==200){
                    accessTokenId = obj.data.accessTokenId;
                    setCookie("acctoken",accessTokenId,0.5);
                }
            }
        });

        randomKey = getCookie("randomKey");
        acctoken = getCookie("acctoken");
        newHeader();
    }

    function changeUrlArg(url, arg, val){
        var pattern = arg+'=([^&]*)';
        var replaceText = arg+'='+val;
        var returnUrl = url.match(pattern) ? url.replace(eval('/('+ arg+'=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url+'&'+replaceText : url+'?'+replaceText);
        return returnUrl;
    }

    //过滤url 进行 三次 encodeURIComponent编码
    function filterUrl(url,type){
        var thisUrl = url;
        var urlArr = [];
        var arrPar = [];
        var arrLeft = [];
        var arrRight = [];
        var urlArrlen;
        var returnUrl = "";

        if(thisUrl.indexOf('?') > -1){ 
            if(thisUrl.indexOf('ver=') > -1){ 
                thisUrl  = changeUrlArg(thisUrl,'ver','3.0.0');
            }else if(thisUrl.indexOf('version=') > -1){ 
                thisUrl = changeUrlArg(thisUrl,'version','3.0.0');
            }else{
                thisUrl += "&ver=3.0.0";
            }
        }else{
            return thisUrl;
        }

        urlArr = thisUrl.split("?");
        arrPar = urlArr[1].split("&");
        $.each(arrPar,function(i,e){
            if(arrPar[i].indexOf('=') > -1){
                arrLeft[i] = arrPar[i].split("=")[0];
                arrRight[i] = arrPar[i].split("=")[1];
                arrRight[i] = encodeURIComponent(encodeURIComponent(AESEncrypt(linshiKey,arrRight[i])));
                arrPar[i] =  arrLeft[i] + "=" + arrRight[i];
            }
        });
        returnUrl = urlArr[0] + "?" + arrPar.join("&");
        return returnUrl;
    }

    //缓存中获取
    randomKey = getCookie("randomKey");
    acctoken = getCookie("acctoken");

    if(!randomKey || !acctoken){
        getPubFunction();
    }else{
        newHeader();
    }

    window.ajaxDataFun = function(url,sucfun,errfun,data){
        randomKey = getCookie("randomKey");
        acctoken = getCookie("acctoken");

        newHeader();
        var thisUrl = filterUrl(url);

        var thisAjax = function(address){
            newHeader();
            var addUrl = filterUrl(address);
            $.ajax({
                url: addUrl,
                type: "POST",
                async:false,
                headers:linshiHeader,
                success:function(obj){
                    console.log(obj);
                    var thistype = typeof(obj);
                    if(thistype == 'string' && obj != 'true' && obj != 'notMatch' && obj != 'false' && obj != 'nologin'){
                        obj = JSON.parse(obj);
                    }
                    sucfun(obj);
                },
                error:function(err){ errfun(err) || console.log(err);}
            });
        }

        $.ajax({
            url: thisUrl,
            type: "POST",
            async:false,
            headers:linshiHeader,
            success:function(obj){
                console.log(obj);
                var type = typeof(obj);
                if(type == 'string' && obj != 'true' && obj != 'notMatch' && obj != 'false' && obj != 'nologin'){
                    obj = JSON.parse(obj);
                } 

                if(obj.code == '4010' || obj.code == '4050' || obj.code == '4060'){
                    getPubFunction();
                    thisAjax(url);
                }else{
                    sucfun(obj);
                }
            },
            error:function(err){errfun(err) || console.log(err);}
        });
    }