$(function(){


    //导航切换
    $(".iconNav").click(function(){
        $("#nav").slideToggle();
    });

    //手机端菜单按钮
    $(".iconPhone").click(function(){
        $("#phoneTool").slideToggle();
        $(".search").slideUp();
    });

    //手机端搜索按钮
    $(".iconSearch").click(function(){
        $(".search").slideToggle();
        $("#phoneTool").slideUp();
    });


    //年月日 三级联动 填写资料里面
    $("#calendar").birthday();

    //点击地域下拉选择
    $(".regionCode p").click(function(){
        $(this).next("ul").slideToggle();
    });

    //点击注册 弹框
    $(".members").click(function(){
        $(".popWrap").fadeIn();
        $(".popRegin").css("display","inline-block");
    });

    //gotop功能
    $(".scrollTop").click(function() {
        $('html, body').animate({scrollTop:0}, '1000');
    });

    //gotop 按钮显示隐藏
    $(window).scroll(function(){
        if($(window).scrollTop()>200){
            $("#gotop").show();
        }else{
            $("#gotop").hide();
        }
    });

    // 关闭弹框
    $(".popClose").click(function() {
        $(".popWrap").fadeOut();
        $(".popMain").fadeOut();
    });

    //注册按钮 弹框
    $(".registBtn").click(function(){
        $(this).parents(".popMain").hide();
        $(".popRegin").css("display","inline-block");
    });

    // 登陆弹框
    $(".loginBtn").click(function(){
        $(this).parents(".popMain").hide();
        $(".popLogin").css("display","inline-block");
    });

    //忘记密码弹框
    $(".forgetPd").click(function(){
        $(this).parents(".popMain").hide();
        $(".sendEmail").css("display","inline-block");
    });

    //详情页分享
    $("#details .share").hover(function(){
        $("#details .toshare").slideToggle();
    })

    //高级筛选 折叠
    $(".advancedList .more").click(function(){
        $(".advancedList dl").not(":first").slideToggle();
        $(this).toggleClass('toggle');;
    });

    // 选项卡
    $(".tagClick li").eq(0).addClass('active');
    $(".tagContent .tagbox").eq(0).show();
    $(".tagClick li").click(function() {
        var _this = $(this);
        var _parent = _this.parents(".tagClick");
        var index = _this.index();
        _this.addClass('active').siblings().removeClass('active');
        _parent.siblings(".tagContent").find(".tagbox").hide();
        _parent.siblings(".tagContent").find(".tagbox").eq(index).show();

    });

});