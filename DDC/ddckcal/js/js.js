    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var thisLocal = window.location.href;
    var apiAdd = "http://api.daydaycook.com.cn/";

    function linkTheme(){
        if(isiOS){
            console.log("isiOS");
            window.location.href = "ddcthemedetails://a?id=38045";
        }else{
            console.log("isAndroid");
            window.myJsf.linkTheme(38045);
        }
    }

    if (thisLocal.indexOf('inapp=1') > -1 && thisLocal.indexOf('isShare=') < 0) {
        $(".page_0").hide();
        $(".haveSort").hide();
        $(".inApp").show();
        $(".page_g .moreKcal").hide();
        $(".page_g .kouhao label").hide();
        $(".page_g .sort").hide();
        $(".page_g .pkMore").hide();
    }

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

    function getPostUrl(arr) {
        $.each(arr, function(i, e) {
            if (e.indexOf('code=') > -1) {
                code = arr[i];
            }
            if (e.indexOf('state=') > -1) {
                state = arr[i];
            }
            if (e.indexOf('openId=') > -1) {
                fid = arr[i];
            }
        })
    }

    var code;
    var state;
    var fid;
    var friendName;
    var locationStr = window.location.search;
    var locRight = locationStr.split("?");
    var postData = locRight[1].split("&");
    getPostUrl(postData);

    var userName;
    var imageUrl;
    var userId;

    var nowBrush = Math.round(new Date().getTime() / 1000);
    var tokenBrush = "FB5A1FF3D574DF222E51B6AB862067A246049A01" + nowBrush;
    tokenBrush = hex_md5(tokenBrush).toUpperCase();

    // 获取分享人信息
    if (fid != "undefined") {
        var fidUrl = apiAdd + "daydaycook/server/domob/queryKcalById.do?" + fid;
        gameUserList(1);

        $.ajax({
            type: "GET",
            url: fidUrl,
            async: false,
            headers: {
                "signature": tokenBrush,
                "timestamp": nowBrush
            },
            success: function(obj) {
                if (obj.code == 200) {
                    friendName = obj.data[0].username;
                    var kcalScore = (obj.data[0].kcalScore) * 10;
                    $(".page_0 .percent").addClass('all' + kcalScore);
                    $('.owner').find('label').html(friendName);
                }
            },
        });
    } else {
        $(".page_g .sort").hide();
    }

    var getWechatInfoUrl = apiAdd + "daydaycook/wechat/getInfo.do?" + code;

    userName = getCookie("userName");
    imageUrl = getCookie("imageUrl");
    userId = getCookie("userId");

    if (userName == "" || userName == "undefined" || userName == undefined) {
        var saveWeiChatUrl;

        nowBrush = Math.round(new Date().getTime() / 1000);
        tokenBrush = "FB5A1FF3D574DF222E51B6AB862067A246049A01" + nowBrush;
        tokenBrush = hex_md5(tokenBrush).toUpperCase();

        // 获取玩家信息
        $.ajax({
            type: "GET",
            url: getWechatInfoUrl,
            async: false,
            success: function(obj) {
                userName = obj.userName;
                imageUrl = obj.imageUrl;
                userId = obj.openId;
                setCookie("userName", userName, 0.5);
                setCookie("imageUrl", imageUrl, 0.5);
                setCookie("userId", userId, 0.5);

                saveWeiChatUrl = apiAdd + "daydaycook/server/domob/saveKcal.do?userName=" + userName + "&kcalScore=-100&openId=" + userId + "&imageUrl=" + imageUrl;

                if (thisLocal.indexOf('inapp=1') > -1 && thisLocal.indexOf('isShare=') < 0) {
                    console.log("in app");
                } else {
                    $.ajax({
                        type: "GET",
                        url: saveWeiChatUrl,
                        async: false,
                        headers: {
                            "signature": tokenBrush,
                            "timestamp": nowBrush
                        },
                        success: function(obj) {},
                    });
                }
            },
        });
    }

    if (thisLocal.indexOf('inapp=1') > -1 && thisLocal.indexOf('isShare=') < 0) {
        $('.runGif').find('p').html("本宝宝");
    } else {
        $('.runGif').find('p').html(userName);
        console.log("userName:" + userName)
    }

    function gameUserList(type) {
        nowBrush = Math.round(new Date().getTime() / 1000);
        tokenBrush = "FB5A1FF3D574DF222E51B6AB862067A246049A01" + nowBrush;
        tokenBrush = hex_md5(tokenBrush).toUpperCase();
        var thisUrl = apiAdd + "daydaycook/server/domob/queryKcal.do";

        $.ajax({
            type: "GET",
            url: thisUrl,
            headers: {
                "signature": tokenBrush,
                "timestamp": nowBrush
            },
            success: function(obj) {
                if (obj.code == 200) {
                    var data = obj.data;
                    var dataLen = data.length;
                    var listStr = "";
                    if (dataLen) {
                        $.each(data, function(i) {
                            if (data[i].kcalScore > -1) {
                                listStr += '<li>';
                                listStr += '<div class="name">';
                                if (data[i].imageUrl == 'undefined') {
                                    listStr += '<img class="nick" src="./img/error.png" />';
                                } else {
                                    listStr += '<img class="nick" onerror="this.src=\'./img/error.png\'" src="' + data[i].imageUrl + '"/>';
                                }
                                listStr += '<p><label> ' + data[i].username + '</label>的减肥指数是<span class="iconTwo all' + (data[i].kcalScore) * 10 + '"></span> </p>';
                                listStr += ' </div>';
                                listStr += '<div class="time"><p>' + formatDate(data[i].createDate) + '</p></div>';
                                listStr += '</li>';
                            }
                        });
                        if (type == 1) {
                            $(".page_0 .haveSort ul").append(listStr);
                        } else {
                            $(".page_g .haveSort ul").html("");
                            $(".page_g .haveSort ul").append(listStr);
                        }
                    } else {
                        if (type == 1) {
                            $(".page_0 .noSort").show();
                        } else {
                            $(".page_g .noSort").show();
                        }
                    }
                } else {
                    if (type == 1) {
                        $(".page_0 .noSort").show();
                    } else {
                        $(".page_g .noSort").show();
                    }
                }
            },
        });
    }

    var dingdang = document.getElementById("dingdang");
    var dabai = document.getElementById("dabai");
    var yueliang = document.getElementById("yueliang");
    var zhizhu = document.getElementById("zhizhu");
    var xicha = document.getElementById("xicha");
    var bgMusic = document.getElementById("bgMusic");

    var i = 0;
    var flag = 0;

    function reload() {
        $('.page').hide();
        $('.page_a .kouhao .sub1').hide();
        $('.page_a .kouhao .sub2').hide();
        $('.page_a .kouhao .sub3').hide();
        $('.dingdang').hide();
        $('.dabai').hide();
        $('.yueliang').hide();
        $('.xicha').hide();
        $('.right').hide();
        $('.q1').css('color', '#005DFD');
        $('.q1').css('background-color', '#fff');
        $('.q1').css('border', '2px solid #005DFD');
        $('.q2').css('color', '#005DFD');
        $('.q2').css('background-color', '#fff');
        $('.q2').css('border', '2px solid #005DFD');
        $('.q3').css('color', '#005DFD');
        $('.q3').css('background-color', '#fff');
        $('.q3').css('border', '2px solid #005DFD');
        $('.q1').removeClass('addShow');
        $('.q2').removeClass('addShow');
        $('.q3').removeClass('addShow');
        $('.page_b .q1').attr('onclick', 'kcalNum(this,90,1170,270)');
        $('.page_b .q2').attr('onclick', 'kcalNum(this,270,1170,270)');
        $('.page_b .q3').attr('onclick', 'kcalNum(this,810,1170,270)');

        $('.page_c .q1').attr('onclick', 'kcalNum(this,250,1750,500)');
        $('.page_c .q2').attr('onclick', 'kcalNum(this,500,1750,500)');
        $('.page_c .q3').attr('onclick', 'kcalNum(this,1000,1750,500)');

        $('.page_d .q1').attr('onclick', 'kcalNum(this,50,650,450)');
        $('.page_d .q2').attr('onclick', 'kcalNum(this,150,650,450)');
        $('.page_d .q3').attr('onclick', 'kcalNum(this,450,650,450)');

        $('.page_e .q1').attr('onclick', 'kcalNum(this,370,2590,370)');
        $('.page_e .q2').attr('onclick', 'kcalNum(this,740,2590,370)');
        $('.page_e .q3').attr('onclick', 'kcalNum(this,1480,2590,370)');

        $('.page_f .q1').attr('onclick', 'kcalNum(this,500,3500,1000)');
        $('.page_f .q2').attr('onclick', 'kcalNum(this,1000,3500,1000)');
        $('.page_f .q3').attr('onclick', 'kcalNum(this,2000,3500,1000)');
        $('.page_a').show();
        run(1);
    }

    function run(a) {
        i = 0;
        flag = 0;
        if (a == undefined) {
            bgMusic.play();
            dingdang.play();
            dingdang.pause();
            dabai.play();
            dabai.pause();
            yueliang.play();
            yueliang.pause();
            xicha.play();
            xicha.pause();
            zhizhu.play();
            zhizhu.pause();
        }
        setTimeout(function() {
            $('.page_a .kouhao .sub1').show();
        }, 500)
        setTimeout(function() {
            $('.page_a .kouhao .sub2').show();
        }, 1200)
        setTimeout(function() {
            $('.page_a .kouhao .sub3').show();
        }, 2000)
        setTimeout(function() {
            $('.page_a').hide();
            $('.page_b').show();
            dingdang.play();
            $('.dingdang').show(300);
        }, 3000)
        setTimeout(function() {
            $('.page_b .kouhao .sub1').show();
            $('.tanhao').fadeIn('fast');
            $('.tanhao').addClass('addBounce');
        }, 3300)
        setTimeout(function() {
            $('.page_b').find('.q1').addClass('addShow');
        }, 3800)
        setTimeout(function() {
            $('.page_b').find('.q2').addClass('addShow');
        }, 3900)
        setTimeout(function() {
            $('.page_b').find('.q3').addClass('addShow');
            $('.slogan').show();
        }, 4000)
    }

    function Download() {
        var u = navigator.userAgent;
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //安卓手机
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //苹果系统
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.gfeng.daydaycook";
        } else {
            var loadDateTime = new Date();
            window.setTimeout(function() {
                var timeOutDateTime = new Date();
                if (timeOutDateTime - loadDateTime < 4000) {
                    if (isIOS) {
                        window.location.href = "https://itunes.apple.com/app/apple-store/id1060973985?pt=118034773";
                    } else {
                        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.gfeng.daydaycook";
                    }
                }
            }, 3000)
        }
    }

    function kcalNum(obj, kcal, total, right) {
        dingdang.pause();
        yueliang.pause();
        dabai.pause();
        zhizhu.pause();
        xicha.pause();
        i++;
        $('.result').find('.zero').hide();
        var _this = $(obj);
        $(obj).css('background-color', '#FA4953');
        $(obj).css('color', '#fff');
        $(obj).css('border', '2px solid #FA4953');
        $(obj).attr("onclick", '');
        $(obj).siblings().attr("onclick", '');
        var rate = kcal / total;
        $('.kcal .li').css('border', '2px solid #005DFD')
        $('.kcal .li').css('height', rate * 100 + '%');
        if (kcal < right) {
            $('.kcal .li').css('background-color', '#F88D1C');
            $(obj).parents('.kcalNum').siblings('.kcal').find('.right').css('display', 'inline-block');
            $('.tips').css('height', rate * 189 + 30);
            $('.result').find('.less').show().html(kcal + 'kcal');
            $('.result').css('height', rate * 189 + 10);
            $('.lessRight').find('label').show().html(right + 'kcal');
            $('.right').css('height', right / total * 189 + 10);
            $('.lessRight').css('height', right / total * 189 + 16);
            setTimeout(function() {
                $('.low').show();
            }, 500)
        } else if (kcal > right) {
            $('.kcal .li').css('height', right / total * 100 + '%');
            $('.kcal .li').css('background-color', '#FA4953');
            $('.kcal .bao').show();
            $('.tips').css('height', right / total * 189 + 30);
            $('.result').find('.more').show().html(right + 'kcal');
            $('.result').css('height', right / total * 189 + 10);
            setTimeout(function() {
                $('.high').show();
            }, 500)
        } else {
            flag++;
            $('.kcal .li').css('background-color', '#04D5C4');
            $('.tips').css('height', rate * 189 + 30);
            $('.result').find('.ok').show().html(kcal + 'kcal');
            $('.result').css('height', rate * 189 + 10);
            setTimeout(function() {
                $('.eq').show();
            }, 500)
        }
        setTimeout(function() {
            _this.parents('.page').hide();
            _this.parents('.page').next(".page").show();
            $('.result label').hide();
            $('.lessRight label').hide();
            $('.slogan').hide();
            $('.tips label').hide();
            $('.tanhao').hide();
            $('.xicha').hide();
            $('.yueliang').hide();
            $('.dabai').hide();
            $('.kcal .bao').hide();
            $('.sub1').hide();
            $('.result').find('.zero').show();
            $('.result').css('height', '16px');
            $('.tips').css('height', '0px');
            $('.kcal .li').css('height', '0px');
            $('.kcal .li').css('border', '0px');
            $('.kcalNum').find('li').hide();
            if (i == 1) {
                zhizhu.play();
            } else if (i == 2) {
                xicha.play();
            } else if (i == 3) {
                yueliang.play();
            } else if (i == 4) {
                dabai.play();
            }
        }, 2500)

        setTimeout(function() {
            $('.page_c .kouhao .sub1').show();
            $('.zhizhu').show(300);
        }, 2800)
        setTimeout(function() {
            $('.page_d .kouhao .sub1').show();
            $('.xicha').show(300);
        }, 2800)
        setTimeout(function() {
            $('.page_e .kouhao .sub1').show();
            $('.yueliang').show(300);
        }, 2800)
        setTimeout(function() {
            $('.page_f .kouhao .sub1').show();
            $('.dabai').show(300);
        }, 2800)

        setTimeout(function() {
            $('.tanhao').fadeIn('fast');
            $('.tanhao').addClass('addBounce');
        }, 3000)
        setTimeout(function() {
            $('.kcalNum').find('.q1').css('display', 'inline-block');
            $('.kcalNum').find('.q1').addClass('addShow');
        }, 3800)
        setTimeout(function() {
            $('.kcalNum').find('.q2').css('display', 'inline-block');
            $('.kcalNum').find('.q2').addClass('addShow');
        }, 3900)
        setTimeout(function() {
            $('.kcalNum').find('.q3').css('display', 'inline-block');
            $('.kcalNum').find('.q3').addClass('addShow');
            $('.slogan').show();
        }, 4000)

        if (i == 5) {
            if (flag / i == 0) {
                $('.finalKcal').html('哦No，别丧气，来搞明白每个食谱的卡路里含量吧');
                $('.percent').removeClass('all0');
                $('.percent').removeClass('all2');
                $('.percent').removeClass('all4');
                $('.percent').removeClass('all6');
                $('.percent').removeClass('all8');
                $('.percent').removeClass('all10');
                $('.percent').addClass('all0');
            } else if (flag / i == 0.2) {
                $('.finalKcal').html('亲爱的，时刻谨记“出来吃，迟早是要还的”');
                $('.percent').removeClass('all0');
                $('.percent').removeClass('all2');
                $('.percent').removeClass('all4');
                $('.percent').removeClass('all6');
                $('.percent').removeClass('all8');
                $('.percent').removeClass('all10');
                $('.percent').addClass('all2');
            } else if (flag / i == 0.4) {
                $('.finalKcal').html('不能掌控自己体重的人，还能掌控自己的人生吗');
                $('.percent').removeClass('all0');
                $('.percent').removeClass('all2');
                $('.percent').removeClass('all4');
                $('.percent').removeClass('all6');
                $('.percent').removeClass('all8');
                $('.percent').removeClass('all10');
                $('.percent').addClass('all4');
            } else if (flag / i == 0.6) {
                $('.finalKcal').html('要想掌控自己的身材，首先要了解自己吃的每一餐喔');
                $('.percent').removeClass('all0');
                $('.percent').removeClass('all2');
                $('.percent').removeClass('all4');
                $('.percent').removeClass('all6');
                $('.percent').removeClass('all8');
                $('.percent').removeClass('all10');
                $('.percent').addClass('all6');
            } else if (flag / i == 0.8) {
                $('.finalKcal').html('很懂嘛~ 是因为下载了日日煮APP看食谱吗');
                $('.percent').removeClass('all0');
                $('.percent').removeClass('all2');
                $('.percent').removeClass('all4');
                $('.percent').removeClass('all6');
                $('.percent').removeClass('all8');
                $('.percent').removeClass('all10');
                $('.percent').addClass('all8');
            } else if (flag / i == 1) {
                $('.finalKcal').html('行家呀，想必平日很擅长做“身材管理”哟');
                $('.percent').removeClass('all0');
                $('.percent').removeClass('all2');
                $('.percent').removeClass('all4');
                $('.percent').removeClass('all6');
                $('.percent').removeClass('all8');
                $('.percent').removeClass('all10');
                $('.percent').addClass('all10');
            }
            var kcalScore = flag / i;

            var saveUrl = apiAdd + "daydaycook/server/domob/saveKcal.do?userName=" + userName + "&kcalScore=" + kcalScore + "&openId=" + userId + "&imageUrl=" + imageUrl;

            nowBrush = Math.round(new Date().getTime() / 1000);
            tokenBrush = "FB5A1FF3D574DF222E51B6AB862067A246049A01" + nowBrush;
            tokenBrush = hex_md5(tokenBrush).toUpperCase();

            if (thisLocal.indexOf('inapp=1') > -1 && thisLocal.indexOf('isShare=') < 0) {
                console.log("in app");
            } else {
                $.ajax({
                    type: "GET",
                    url: saveUrl,
                    async: false,
                    headers: {
                        "signature": tokenBrush,
                        "timestamp": nowBrush
                    },
                    success: function(obj) {},
                });
            }

            gameUserList(2);
        }
    }

    /* 时间戳转换的两种方式 */
    function addZero(m) {
        return m < 10 ? '0' + m : m
    }

    function formatDate(dd) {
        dd = new Date(dd.replace(/-/g, "/"));
        var mydate = Date.parse(new Date());
        var minus = Date.parse(dd) - mydate;
        var dy = new Date(dd);
        var month = dy.getMonth() + 1;
        var day = dy.getDate();
        var hour = dy.getHours();
        var minute = dy.getMinutes();
        return month + "月" + day + "日 " + addZero(hour) + ":" + addZero(minute);
    }

    if (thisLocal.indexOf('openId=') > -1) {
        $('.page').hide();
        $('.page_0').show();
        $('.pk').click(function() {
            $('.page').hide();
            $('.page_a').show();
            run();
        })
    } else {
        $(".page_g .haveSort").hide();
        $(".page_g .owner").hide();
        $(".page_g .noSort").show();
        run();
    }

    // encodeURIComponent(location.href.split('#')[0]);
    var configUrl = apiAdd + "daydaycook/wechat/getSignature.do";
    var configtoUrl = window.location.href;

    $.ajax({
        url: configUrl,
        dataType: 'json',
        data: {
            "url": configtoUrl
        },
        success: function(obj) {
            var thisId = obj.appId;
            var thisTimestamp = obj.timestamp;
            var thisNonceStr = obj.nonceStr;
            var thisSignature = obj.signature;

            wx.config({
                debug: false,
                appId: thisId,
                timestamp: thisTimestamp,
                nonceStr: thisNonceStr,
                signature: thisSignature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
            });
        }
    });

    wx.ready(function() {
        // 获取“ 分享到朋友圈” 按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: '胖友们，这个夏天' + userName + '先瘦为敬啦！', // 分享标题
            link: 'http://daydaycook.gfeng.com.cn/ddckcal/index.html?openId=' + userId,
            imgUrl: 'http://daydaycook.gfeng.com.cn/ddckcal/img/zong.png', // 分享图标
            success: function() {},
            cancel: function() {}
        });

        // 获取“ 分享给朋友” 按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage({
            title: '胖友们，这个夏天' + userName + '先瘦为敬啦！', // 分享标题
            desc: '意识先行，行动跟上，我的卡路里要燃烧了！', // 分享描述
            link: 'http://daydaycook.gfeng.com.cn/ddckcal/index.html?openId=' + userId,
            imgUrl: 'http://daydaycook.gfeng.com.cn/ddckcal/img/zong.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {},
            cancel: function() {}
        });

        // 获取“分享到QQ”按钮点击状态及自定义分享内容接口
        wx.onMenuShareQQ({
            title: '胖友们，这个夏天' + userName + '先瘦为敬啦！', // 分享标题
            desc: '意识先行，行动跟上，我的卡路里要燃烧了！', // 分享描述
            link: 'http://daydaycook.gfeng.com.cn/ddckcal/index.html?openId=' + userId, // 分享链接
            imgUrl: 'http://daydaycook.gfeng.com.cn/ddckcal/img/zong.png', // 分享图标
            success: function() {},
            cancel: function() {}
        });

        // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
        wx.onMenuShareWeibo({
            title: '胖友们，这个夏天' + userName + '先瘦为敬啦！', // 分享标题
            desc: '意识先行，行动跟上，我的卡路里要燃烧了！', // 分享描述
            link: 'http://daydaycook.gfeng.com.cn/ddckcal/index.html?openId=' + userId, // 分享链接
            imgUrl: 'http://daydaycook.gfeng.com.cn/ddckcal/img/zong.png', // 分享图标
            success: function() {},
            cancel: function() {}
        });

        // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
        wx.onMenuShareQZone({
            title: '胖友们，这个夏天' + userName + '先瘦为敬啦！', // 分享标题
            desc: '意识先行，行动跟上，我的卡路里要燃烧了！', // 分享描述
            link: 'http://daydaycook.gfeng.com.cn/ddckcal/index.html?openId=' + fid, // 分享链接
            imgUrl: 'http://daydaycook.gfeng.com.cn/ddckcal/img/zong.png', // 分享图标
            success: function() {},
            cancel: function() {}
        });

        if (thisLocal.indexOf('openId=') > -1) {
            $('.pk').click(function() {
                document.getElementById('bgMusic').play();
            });
        } else {
            document.getElementById('bgMusic').play();
        }
    });