$(function(){
    /* 视频控件 */
    var player;

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    var audio = document.getElementById('audio');
    var index = document.getElementById('index');
    index.addEventListener('touchstart', function(){ 
        audio.play();
    }, false);

    function iosVideoPlay(){
        videojs("myVideo", {
            "controls": true,
            "autoplay": false,
            "preload": "none"
        },function(){
            this.on('ended',function(){ // 视频结束
                 $("#Thumb").show();
            });
            this.on('pause',function(){ // 视频暂停
                 $("#Thumb").show();
            });
        });
    }

    function andVideoPlay(){
        videojs("myVideo", { 
            "controls": true, 
            "autoplay": false, 
            "preload": "none"
        },function(){
            this.on('ended',function(){
                $(".video_Wrap").hide();
                $("#Thumb").show();
            });
            this.on('pause',function(){
                $(".video_Wrap").hide();
                $("#Thumb").show();
            });
        });
        $(".video_Wrap").show();
    }
    
    function removePlay(){
        videojs("myVideo").dispose();
    }

    /* 主页进入挑战 */ 
    $(".index").click(function(){
        $(this).removeClass('bounceIn').addClass('fadeOutUp');
        $(this).next(".page").show();
    });

    /* 参加挑战 */
    $(".challenge").click(function(){
        $(this).removeClass('fadeInUp').addClass('fadeOutUp');
        $(this).next(".page").show();
    });

    /* 选择问题 */
    $(".checkbox .list").click(function(){
        $(".checkbox .list").removeClass('active');
        $(this).addClass('active');
    });

    $(".checkbox").click(function(){
        $("#error").fadeOut();
    })

    /* 回答问题 */
    $(".question .href").click(function(){
        var _thisp = $(this).parents(".page");
        var anwser = _thisp.find(".active");
        var value = anwser.attr("data-value");
        if(value != "1"){
            $("#error").fadeIn();
            return;
        }else{
            _thisp.removeClass('fadeInUp').addClass('fadeOutUp');
            _thisp.next(".page").show();
        }
    });

    /* 关闭错误提示 */
    $("#error").click(function(){
        $(this).fadeOut();
    });

    var toNum = Math.floor(Math.random()*2);
    var muNum = Math.floor(Math.random()*3);
    var flag;

    /* 西红柿鸡蛋面随机出一个鲜肉 */
    $(".Tomato").click(function(){
        flag = "tomato";
        var nameArr = ["晨跑小鲜肉","拳击小鲜肉"];
        // var avarArr = ["t1.png","t2.png"];
        var imgArr = ["t_1.jpg","t_2.jpg"];
        var vidArr = [
            "http://pic.daydaycook.com/promotion/kangshifu1611/v1.mp4",
            "http://pic.daydaycook.com/promotion/kangshifu1611/v2.mp4"
        ];

        // var avrSrc = avarArr[toNum];
        var nameStr = nameArr[toNum];
        var imgSrc = imgArr[toNum];
        var vidSrc = vidArr[toNum];

        $(this).parents(".page").removeClass('fadeInUp').addClass('fadeOutUp');
        $(this).parents(".page").next(".page").show();

        $(".peopleName").html(nameStr);
        // $(".people .avar").attr("src","./img/" + avrSrc);
        $(".author .imgSrc").attr("src","./img/" + imgSrc);
        $(".videoBox source").attr("src",vidSrc);
    });

    /* 香菇鸡蛋面随机出一个鲜肉 */
    $(".Mushrooms").click(function(){
        flag = "mushrooms";
        var nameArr = ["健身房小鲜肉","篮球小鲜肉","跳舞小鲜肉"];
        // var avarArr = ["m1.png","m2.png","m3.png"];
        var imgArr = ["m_1.jpg","m_2.jpg","m_3.jpg"];
        var vidArr = [
            "http://pic.daydaycook.com/promotion/kangshifu1611/v3.mp4",
            "http://pic.daydaycook.com/promotion/kangshifu1611/v4.mp4",
            "http://pic.daydaycook.com/promotion/kangshifu1611/v5.mp4"
        ];
        // var avrSrc = avarArr[muNum];
        var nameStr = nameArr[muNum];
        var imgSrc = imgArr[muNum];
        var vidSrc = vidArr[muNum];

        $(this).parents(".page").removeClass('fadeInUp').addClass('fadeOutUp');
        $(this).parents(".page").next(".page").show();

        $(".peopleName").html(nameStr);
        // $(".people .avar").attr("src","./img/"+avrSrc);
        $(".author .imgSrc").attr("src","./img/" + imgSrc);
        $(".videoBox source").attr("src",vidSrc);
    });

    /* 链接视频页面 点击隐藏自己 */
    $(".author").click(function(){
        var name = $(".peopleName").html();
        $("#music").remove();
        if(flag == "tomato"){
            type = 1;
        }else{
            type = 2;
        }

        var url = "http://api.daydaycook.com.cn/daydaycook/server/domob/voteCount.do?name=" + name + "&type=" + type;

        $.ajax({ 
            type: "post", 
            url: url, 
            async:false,
            success: function(obj){ 
                if(obj.success == "true"){
                    var datanum = obj.voteCount;
                    $("#vote .num").html(datanum);
                }
            }
        });

        if(isAndroid){
           andVideoPlay();
        }else{
           iosVideoPlay();
        }
        $(this).removeClass('fadeInUp').addClass('fadeOutUp');
        $(this).next(".page").show();
    });


     /* 点击显示投票  */
    $("#vote").click(function(){
        if(isAndroid){
            $(".video_Wrap").hide();
        }
        $("#Thumb").show();
    });

    /* 关闭投票  */
    $("#Thumb .close").click(function(){
        $(this).parents("#Thumb").hide();
        if(isAndroid){
            $(".video_Wrap").show();
        }
    });

    /* 关闭发送个人信息 */
    $("#saveInfo .close").click(function(){
        $(this).parents("#saveInfo").hide();
        if(isAndroid){
            $(".video_Wrap").show();
        }
    });

    function hideDiv(){
        $("#already").fadeOut(function(){
            $(".video_Wrap").show();
        });
    }

    var voteTag = 1;

    /* 确认投票  */
    $("#Thumb .thumb").click(function(){
        if(!voteTag){
            $("#Thumb").hide();
            $("#already").fadeIn();
            setTimeout(hideDiv,1500);
            return;
        }
        $("#Thumb").hide();
        $("#saveInfo").show();
        var num = $("#vote .num").html();
        if(voteTag){
            num++;
            $("#vote .num").html(num);
        }
        var name = $(".peopleName").html();
        var type;
        if(flag == "tomato"){
            type = 1;
        }else{
            type = 2;
        }
        var url = "http://api.daydaycook.com.cn/daydaycook/server/domob/vote.do?name=" + name + "&type=" + type;
        if(voteTag){
            $.ajax({ 
                type: "post", 
                url: url, 
                async:false,
                success: function(obj){ 
                    if(obj.success == "true"){
                        console.log("投票成功！");
                        voteTag = 0;
                    }
                }
            });
        }
        console.log("voteTag=" + voteTag);
    });

    /* 下一个小鲜肉 */
    $("#Thumb .nextA").click(function(){
        removePlay();
        var nameArr = [];
        var avarArr = [];
        var imgArr = [];
        var vidArr = [];
        var listNum;
        toNum++; 
        muNum++;
        if(flag == "tomato"){
            nameArr = ["晨跑小鲜肉","拳击小鲜肉"];
            // avarArr = ["t1.png","t2.png"];
            imgArr = ["t_1.jpg","t_2.jpg"];
            vidArr = ["http://pic.daydaycook.com/promotion/kangshifu1611/v1.mp4",
                "http://pic.daydaycook.com/promotion/kangshifu1611/v2.mp4"
            ];

            listNum = toNum;  
        }else{
            nameArr = ["健身房小鲜肉","篮球小鲜肉","跳舞小鲜肉"];
            // avarArr = ["m1.png","m2.png","m3.png"];
            imgArr = ["m_1.jpg","m_2.jpg","m_3.jpg"];
            vidArr = [
                "http://pic.daydaycook.com/promotion/kangshifu1611/v3.mp4",
                "http://pic.daydaycook.com/promotion/kangshifu1611/v4.mp4",
                "http://pic.daydaycook.com/promotion/kangshifu1611/v5.mp4"
            ];
            listNum = muNum;
        }

        if(listNum == vidArr.length){
            listNum = 0; 
            toNum = 0; 
            muNum = 0;
        }

        // var avrSrcNext = avarArr[listNum];
        var nameStrNext = nameArr[listNum];
        var imgSrcNext = imgArr[listNum];
        var vidSrcNext = vidArr[listNum];

        $(".peopleName").html(nameStrNext);
        // $(".people .avar").attr("src","./img/"+ avrSrcNext);
        $(".author .imgSrc").attr("src","./img/" + imgSrcNext);

        var videoStr = "<video id='myVideo' class='video-js vjs-default-skin' controls preload x-webkit-airplay='allow' x5-video-player-type='h5' x5-video-player-fullscreen='false' webkit-playsinline='true' playsinline='true' poster='./img/poster.jpg'><source src='" + vidSrcNext + "' type='video/mp4' </video>";

        $(".video_Wrap").append(videoStr);
        // $("#myVideo").attr("style",style);
        if(isAndroid){
           andVideoPlay();
        }else{
           iosVideoPlay();
        }

        $(".videoBox").removeClass('fadeInUp').fadeOut();
        $(".author").removeClass('fadeOutUp').fadeIn();

        if(flag == "tomato"){
            type = 1;
        }else{
            type = 2;
        }

        var url = "http://api.daydaycook.com.cn/daydaycook/server/domob/voteCount.do?name=" + nameStrNext + "&type=" + type;
        console.log(url);
        $.ajax({ 
            type: "post", 
            url: url, 
            async:false,
            success: function(obj){ 
                if(obj.success == "true"){
                    var datanum = obj.voteCount;
                    $("#vote .num").html(datanum);
                }
            }
        });

        $("#Thumb").hide();
    });

    /* 发送个人信息 */
    $("#saveInfo .submit").click(function(){
        var name = $("input[name=name]").val();
        var phone = $("input[name=phone]").val();
        var email = $("input[name=email]").val();
        var weichat = $("input[name=weichat]").val();
        var member = $(".peopleName").html();
        var type;
        if(flag == "tomato"){
            type = 1;
        }else{
            type = 2;
        }
        var postUrl = "http://api.daydaycook.com.cn/daydaycook/server/domob/saveVoter.do?name=" + name + "&mobile=" + phone + "&email=" + email + "&weChat=" + weichat + "&member=" + member + "&type=" + type;

        console.log("postUrl:" + postUrl);
        $(".namErr").hide();
        $(".phonErr").hide();
        if($.trim(name) === ""){
            $(".namErr").show();
            return;
        }else if(!(/^1[34578]\d{9}$/.test(phone))){
            $(".phonErr").show();
            return;
        }else{
            $.ajax({ 
                type: "post", 
                url: postUrl, 
                async:false,
                success: function(obj){ 
                    console.log("保存成功！");
                    $("#saveInfo").fadeOut();
                    $(".videoBox").removeClass('fadeInUp').addClass('fadeOutUp');
                    $(".endPage").show();
                }
            });
        }
    });

    $(window).resize(function(){
        var w =  $(window).width();
        if(w>560){
            $(".video_Wrap").css("top","0");
        }else{
            $(".video_Wrap").css("top","30%");
        }
    });

});