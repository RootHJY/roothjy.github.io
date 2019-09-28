    var nowStamp = new Date().getTime(); //获取当前时间戳
    var oneStamp = 60*60*24*1000; //获取一天的时间戳长度
    
    var thisTime =  new Date();
    var thisYear = thisTime.getFullYear();
    var thisMouth = thisTime.getMonth() + 1;
    var yesterday = thisTime.getDate() - 1;
        
        thisMouth = addZero(thisMouth);
        yesterday = addZero(yesterday);

    chart = new Object();

    function addZero(m) {
        return m < 10 ? '0' + m : m
    }

    function formatDate(stamp)   {    // 2016-10-10通过时间戳 返回年月日
        var d = new Date(stamp); 
        var year = d.getFullYear();     
        var month = d.getMonth() + 1;     
        var date = d.getDate();     
        return  year + "-" + addZero(month) + "-" + addZero(date);
    }  

    var shopApi = "http://shop.daydaycook.com.cn/";
    var winWth = $(window).width();

    var recipeVm = new Vue({
        el: '#tableRecipeDay',
        data: {
            list:'',
            recipeId:'',
            recipeName:'',
            authorName:'',
            releaseDate:''
        }
    })

    var channel_recipe = ["APP", "微信", "淘宝"];  // channel_recipe 的渠道

    var recipeIdStr = window.location.search;
    var recipeId = recipeIdStr.slice(1,recipeIdStr.length);

    function searchRecipeOne(start,endt,chan){
        // var chanRecipe = chan.join(",");
        var recipeUrl = shopApi  + "ecom/newappserver/statistics/recipeSingleDetailStatistics?recipeId=" + recipeId + "&currentPage=1&pageSize=90&startDate=" + start + "&endDate=" + endt;

        ajaxDataFun(recipeUrl,function(obj){
            if(obj.code == "200"){
                recipeVm.list = obj.data;
                recipeVm.recipeId = obj.recipeInfo.recipeId;
                recipeVm.recipeName = obj.recipeInfo.recipeName;
                recipeVm.authorName = obj.recipeInfo.authorName;
                recipeVm.releaseDate = obj.recipeInfo.releaseDate;
            }
        })
    }

    var recipeStart = thisYear + "-" + thisMouth + "-01";
    var recipeEnd = thisYear + "-" + thisMouth + "-" + yesterday;

    searchRecipeOne(recipeStart,recipeEnd,channel_recipe);

    function popShow(o){
        $(o).prop("checked","checked");
        $("#popshow").show();
        setTimeout(function(){
            $("#popshow").fadeOut();
        },2000);
    }

    // 交易概况时间选择
    var start_recipe = {
        format: 'YYYY-MM-DD',
        minDate: '2016-10-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-yesterday],
        isClear:false,
        isToday:false,
        choosefun: function(elem,datas){
            var thisStamp = Date.parse(datas);
            // var max_90 = formatDate(thisStamp + oneStamp*89); // 最大限制90天
            end_recipe.minDate = datas; 
            // end_recipe.maxDate = max_90; 
            recipeStart = datas;
            searchRecipeOne(recipeStart,recipeEnd,channel_recipe);
            $("#inpstart_recipe").addClass('active');
        }
    };

    var end_recipe = {
        format: 'YYYY-MM-DD',
        minDate: '2016-10-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-1],
        isClear:false,
        isToday:false,
        choosefun: function(elem,datas){
            var thisStamp = Date.parse(datas);
            var min_90 = formatDate(thisStamp - oneStamp*89); // 最大限制90天
            start_recipe.maxDate = datas;
            start_recipe.minDate = min_90;
            recipeEnd = datas;
            searchRecipeOne(recipeStart,recipeEnd,channel_recipe);
            $("#inpend_recipe").addClass('active');
        }
    };

    //菜谱日报
    $("#inpstart_recipe").jeDate(start_recipe);
    $("#inpend_recipe").jeDate(end_recipe);


    //单个菜谱导出
    function execlExported() {
        var formDataUrl = shopApi  + "ecom/newappserver/statistics/recipeSingleDetailToExcel.do?startDate=" +  recipeStart + "&endDate=" + recipeEnd+"&recipeId=" + recipeId;
        window.location.href = formDataUrl;
    }
