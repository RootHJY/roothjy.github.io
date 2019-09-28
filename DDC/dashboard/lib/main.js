    var chart_a1 = echarts.init(document.getElementById('chart_a1'));
    var chart_a2 = echarts.init(document.getElementById('chart_a2'));

    var chart_b1 = echarts.init(document.getElementById('chart_b1'));
    var chart_b2 = echarts.init(document.getElementById('chart_b2'));

    var chart_c1 = echarts.init(document.getElementById('chart_c1'));
    var chart_c2 = echarts.init(document.getElementById('chart_c2'));

    var chart_d1 = echarts.init(document.getElementById('chart_d1'));
    var chart_d2 = echarts.init(document.getElementById('chart_d2'));

    var chart_recipeAll = echarts.init(document.getElementById('chart_recipeAll'));

    var channel_a = ["APP", "微信", "淘宝"];  // chatA 的渠道
    var channel_b = ["APP", "微信", "淘宝"];  // chatB 的渠道
    var channel_c = ["APP", "微信", "淘宝"];  // chatC 的渠道
    var channel_d = ["APP", "微信", "淘宝"];  // chatD 的渠道
    var channel_e = ["APP"];  // chatE 的渠道
    var channel_recipe = ["APP", "微信", "淘宝"];  // channel_recipe 的渠道

    var thisTime =  new Date();
    var thisYear = thisTime.getFullYear();
    var thisMouth = thisTime.getMonth() + 1;
    var lastMouth = thisMouth - 1;
    var yesterday = thisTime.getDate() - 1;
        
        if(yesterday == 0){
            yesterday = 1;
        }

        thisMouth = addZero(thisMouth);
        lastMouth = addZero(lastMouth);
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

    var nowStamp = new Date().getTime(); //获取当前时间戳
    var oneStamp = 60*60*24*1000; //获取一天的时间戳长度

    var endStamp = nowStamp - oneStamp; //获取结束时间戳长度
    var endTime = formatDate(endStamp); //快捷方式结束时间
    var start_7 = formatDate(nowStamp - oneStamp*7); // 7天起点时间  
    var start_14 = formatDate(nowStamp - oneStamp*14); // 14天起点时间 
    var start_28 = formatDate(nowStamp - oneStamp*28); // 28天起点时间 
    var start_56 = formatDate(nowStamp - oneStamp*56); // 56天起点时间 

    var db_end_7 = formatDate(nowStamp - oneStamp*8);  // 7天上一周期结束时间  
    var db_end_14 = formatDate(nowStamp - oneStamp*15); // 14天上一周期结束时间          
    var db_end_28 = formatDate(nowStamp - oneStamp*29); // 28天上一周期结束时间
    var db_end_90 = formatDate(nowStamp - oneStamp*90); // 28天上一周期结束时间

    var winWth = $(window).width();

    function loadA(start,endt,chan){//开始时间，结束时间，渠道
        var chanStrA  = chan.join(",");
        var urlA = shopApi + "ecom/appserver/report/orderGmvReport?startDate=" + start + "&endDate=" + endt + "&channelArr=" + chanStrA;

        var dataAmtA  = [];
        var dayA  = [];
        var d = new Date(); 
        var year = d.getFullYear(); 
        $("#table_a").html("");

        ajaxDataFun(urlA,function(obj){
            if(obj.code == "200"){
                var dataA = obj.data;
                var lenA = dataA.length;
                var i = 0;
                var strA = '';
                for(i;i<lenA;i++){
                    dataAmtA[i] = dataA[i].daydayTotalAmt;
                    dayA[i] = dataA[i].dateAndWeek;
                    strA = "<tr>";
                    strA += "<td>" + year + "/" + (dataA[i].dateAndWeek).split(" ")[0] + "</td>";
                    strA += "<td>" + (dataA[i].dateAndWeek).split(" ")[1] + "</td>";
                    strA += "<td>" + dataA[i].daydayTotalAmt + "</td>";
                    strA += "<tr>";
                    $("#table_a").append(strA);
                }
            }
        });

        //A1的参数
        chart.option_a1 = {
            // title:{ text:'GMV增长趋势'},
            tooltip:{ trigger:'axis'},
            grid:{left:'0', right:'3%', bottom:'3%', containLabel:true },
            xAxis:[{
                type:'category',
                boundaryGap:false,
                data:dayA
            }],
            yAxis:{ 
                type:'value',
                min:dataAmtA[0]
            },
            series:[{
                name:'累计GMV',
                type:'line',
                stack:'总量',
                areaStyle:{normal:{}},
                data:dataAmtA
            }]
        };

        if(winWth>640){
            chart.option_a2 = {
                color: ['#3398DB'],
                // title:{ text:'GMV增长趋势'},
                tooltip : {trigger: 'axis', axisPointer : {type : 'shadow'}},
                grid: {left: '0', right: '3%', bottom: '3%', containLabel:true },
                xAxis: [{
                   type: 'category',
                   data: dayA,
                   axisTick: {
                       alignWithLabel: true
                   }
                }],
                yAxis: {
                    type:'value',
                    min:dataAmtA[0]
                },
                series : [{
                   name:'累积GMV',
                   type:'bar',
                   barWidth: '60%',
                   data:dataAmtA
               }]
            };
        }else{
            chart.option_a2 = {
                color: ['#3398DB'],
                // title:{ text:'GMV增长趋势'},
                tooltip : {trigger: 'axis', axisPointer : {type : 'shadow'}},
                grid: {left: '0', right: '3%', bottom: '3%', containLabel:true },
                xAxis: [{
                   type: 'category',
                   data: dayA,
                   axisTick: {
                       alignWithLabel: true
                   }
                }],
                yAxis: {
                    type:'value',
                    min:dataAmtA[0]
                },
                series : [{
                   name:'累积GMV',
                   type:'bar',
                   barWidth: '30%',
                   data:dataAmtA
               }]
            };
        }

        chart_a1.setOption(chart.option_a1);
        chart_a2.setOption(chart.option_a2);
    }

    function loadB(start,endt,startdb,endtdb,chan){
        var chanStrB  = chan.join(",");
        var urlB = shopApi + "ecom/appserver/report/orderGmvReport?startDate=" + start + "&endDate=" + endt + "&channelArr=" + chanStrB;
        var urlB_db = shopApi + "ecom/appserver/report/orderGmvReport?startDate=" + startdb + "&endDate=" + endtdb + "&channelArr=" + chanStrB;
        var dataAmtB  = [];
        var dataAmtB_db  = [];
        var dayB  = [];
        var dayB_db  = [];
        var d = new Date(); 
        var year = d.getFullYear(); 

        $("#table_b1").html("");
        $("#table_b2").html("");

        ajaxDataFun(urlB,function(obj){
            if(obj.code == "200"){
                var dataB = obj.data;
                var lenB = dataB.length;
                var j = 0;
                var strB = '';
                for(j;j<lenB;j++){
                    dataAmtB[j] = dataB[j].totalAmt;
                    dayB[j] = dataB[j].dateAndWeek;
                    strB = "<tr>";
                    strB += "<td>" + year + "/" + (dataB[j].dateAndWeek).split(" ")[0] + "</td>";
                    strB += "<td>" + (dataB[j].dateAndWeek).split(" ")[1] + "</td>";
                    strB += "<td>" + dataB[j].totalAmt + "</td>";
                    strB += "<tr>";
                    $("#table_b1").append(strB);
                }
            }
        });

        ajaxDataFun(urlB_db,function(obj){
            if(obj.code == "200"){
                var dataB_db = obj.data;
                var lenB_db = dataB_db.length;
                var z = 0;
                var strB_db = '';
                for(z;z<lenB_db;z++){
                    dataAmtB_db[z] = dataB_db[z].totalAmt;
                    dayB_db[z] = dataB_db[z].dateAndWeek;
                    strB_db = "<tr>";
                    strB_db += "<td>" + year + "/" + (dataB_db[z].dateAndWeek).split(" ")[0] + "</td>";
                    strB_db += "<td>" + (dataB_db[z].dateAndWeek).split(" ")[1] + "</td>";
                    strB_db += "<td>" + dataB_db[z].totalAmt + "</td>";
                    strB_db += "<tr>";
                    $("#table_b2").append(strB_db);
                }
            }
        });

        //B1的参数
        chart.option_b1= {
            // title:{ text:'GMV变化对比'},
            tooltip:{ trigger:'axis'},
            legend:{
                data:['当前周期','上一周期']
            },
            grid:{ left:'0', right:'3%', bottom:'3%', containLabel:true },
            xAxis:[{
                type:'category',
                boundaryGap:false,
                data:dayB
            }],
            yAxis:{ 
                type:'value'
            },
            series:[{
                name:'当前周期',
                type:'line',
                areaStyle:{normal:{}},
                data:dataAmtB
            },
            {
                name:'上一周期',
                type:'line',
                areaStyle:{normal:{}},
                data:dataAmtB_db
            }]
        };

        // B2的参数
        if(winWth>640){
            chart.option_b2 = {
                // title:{ text:'GMV变化对比'},
                tooltip : {trigger: 'axis', axisPointer : {type : 'shadow'}},
                legend: { data:['当前周期','上一周期']},
                grid: {left: '0', right: '4%', bottom: '3%', containLabel: true},
                xAxis : [{
                    type : 'category',
                    data : dayB
                }],
                yAxis : [{type : 'value'}],
                series : [{
                    name:'当前周期',
                    type:'bar',
                    barWidth:30,
                    data:dataAmtB
                },
                {
                    name:'上一周期',
                    type:'bar',
                    barWidth:30,
                    data:dataAmtB_db
                }]
            };
        }else{
            chart.option_b2 = {
                // title:{ text:'GMV变化对比'},
                tooltip : {trigger: 'axis', axisPointer : {type : 'shadow'}},
                legend: { data:['当前周期','上一周期']},
                grid: {left: '0', right: '4%', bottom: '3%', containLabel: true},
                xAxis : [{
                    type : 'category',
                    data : dayB
                }],
                yAxis : [{type : 'value'}],
                series : [{
                    name:'当前周期',
                    type:'bar',
                    barWidth:4,
                    data:dataAmtB
                },
                {
                    name:'上一周期',
                    type:'bar',
                    barWidth:4,
                    data:dataAmtB_db
                }]
            };
        }

        chart_b1.setOption(chart.option_b1);
        chart_b2.setOption(chart.option_b2);
    }

    function loadC(start,endt,chan){//开始时间，结束时间，渠道
        var chanStrC  = chan.join(",");
        var urlC = shopApi + "ecom/appserver/report/orderCountReport?startDate=" + start + "&endDate=" + endt + "&channelArr=" + chanStrC;
        var dataCmtC_a  = [];
        var dataCmtC_b  = [];
        var dataCmtC_c  = [];
        var dataCmtC_d  = [];
        var dayC  = [];
        var d = new Date(); 
        var year = d.getFullYear(); 
        $("#table_c").html("");
        ajaxDataFun(urlC,function(obj){
            if(obj.code == "200"){
                var dataC = obj.data;
                var lenC = dataC.length;
                var i = 0;
                var strC = '';
                for(i;i<lenC;i++){
                    dataCmtC_a[i] = dataC[i].browseCount;
                    dataCmtC_b[i] = dataC[i].browsePeopleCount;
                    dataCmtC_c[i] = dataC[i].orderPeopleCount;
                    dataCmtC_d[i] = dataC[i].payPeopleCount;
                    dayC[i] = dataC[i].dateAndWeek;

                    strC = "<tr>";
                    strC += "<td>" + year + "/" + (dataC[i].dateAndWeek).split(" ")[0] + "</td>";
                    strC += "<td>" + (dataC[i].dateAndWeek).split(" ")[1] + "</td>";
                    strC += "<td>" + dataC[i].browseCount + "</td>";
                    strC += "<td>" + dataC[i].browsePeopleCount + "</td>";
                    strC += "<td>" + dataC[i].orderPeopleCount + "</td>";
                    strC += "<td>" + dataC[i].payPeopleCount + "</td>";
                    strC += "<tr>";
                    $("#table_c").append(strC);
                }
            }
        });

        //C1的参数
        chart.option_c1 = {
            // title:{ text:'GMV增长趋势'},
            tooltip:{ trigger:'axis'},
            legend:{
                data:['浏览次数','浏览人数','下单人数','付款人数']
            },
            grid:{ left:'0', right:'3%', bottom:'3%', containLabel:true },
            xAxis:{
                type:'category',
                boundaryGap:false,
                data:dayC
            },
            yAxis:{ 
                type:'value'
            },
            series : [{
                name:'浏览次数',
                type:'line',
                areaStyle:{normal:{}},
                data:dataCmtC_a
            },
            {
                name:'浏览人数',
                type:'line',
                areaStyle:{normal:{}},
                data:dataCmtC_b
            },
            {
                name:'下单人数',
                type:'line',
                areaStyle:{normal:{}},
                data:dataCmtC_c
            },
            {
                name:'付款人数',
                type:'line',
                areaStyle:{normal:{}},
                data:dataCmtC_d
            }]
        };

        if(winWth>640){
            chart.option_c2 = {
                // title:{ text:'GMV变化对比'},
                tooltip : {trigger: 'axis', axisPointer : {type : 'shadow'}},
                legend: { data:['浏览次数','浏览人数','下单人数','付款人数']},
                grid: {left: '0', right: '4%', bottom: '3%', containLabel: true},
                xAxis : [{
                    type : 'category',
                    data : dayC
                }],
                yAxis : [{type : 'value'}],
                series : [{
                    name:'浏览次数',
                    type:'bar',
                    barWidth:20,
                    data:dataCmtC_a
                },
                {
                    name:'浏览人数',
                    type:'bar',
                    barWidth:20,
                    data:dataCmtC_b
                },
                {
                    name:'下单人数',
                    type:'bar',
                    barWidth:20,
                    data:dataCmtC_c
                },
                {
                    name:'付款人数',
                    type:'bar',
                    barWidth:20,
                    data:dataCmtC_d
                }]
            };
        }else{
            chart.option_c2 = {
            // title:{ text:'GMV变化对比'},
                tooltip : {trigger: 'axis', axisPointer : {type : 'shadow'}},
                legend: { data:['浏览次数','浏览人数','下单人数','付款人数']},
                grid: {left: '0', right: '4%', bottom: '3%', containLabel: true},
                xAxis : [{
                    type : 'category',
                    data : dayC
                }],
                yAxis : [{type : 'value'}],
                series : [{
                    name:'浏览次数',
                    type:'bar',
                    barWidth:2,
                    data:dataCmtC_a
                },
                {
                    name:'浏览人数',
                    type:'bar',
                    barWidth:2,
                    data:dataCmtC_b
                },
                {
                    name:'下单人数',
                    type:'bar',
                    barWidth:2,
                    data:dataCmtC_c
                },
                {
                    name:'付款人数',
                    type:'bar',
                    barWidth:2,
                    data:dataCmtC_d
                }]
            };
        }
        chart_c1.setOption(chart.option_c1);
        chart_c2.setOption(chart.option_c2);
    }

    function loadD(start,endt,chan){//开始时间，结束时间，渠道
        var chanStrD  = chan.join(",");
        var urlD = shopApi + "ecom/appserver/report/orderNumReport?startDate=" + start + "&endDate=" + endt + "&channelArr=" + chanStrD;
        var dataDmtD_a  = [];
        var dataDmtD_b  = [];
        var dataDmtD_c  = [];
        var dayD  = [];
        var d = new Date(); 
        var year = d.getFullYear(); 
        $("#table_d").html("");

        ajaxDataFun(urlD,function(obj){
            if(obj.code == "200"){
                var dataD = obj.data;
                var lenD = dataD.length;
                var i = 0;
                var strD = '';
                for(i;i<lenD;i++){
                    dataDmtD_a[i] = dataD[i].orderTotalCount;
                    dataDmtD_b[i] = dataD[i].cnt;
                    dataDmtD_c[i] = dataD[i].productTotalSales;
                    dayD[i] = dataD[i].dateAndWeek;

                    strD = "<tr>";
                    strD += "<td>" + year + "/" + (dataD[i].dateAndWeek).split(" ")[0] + "</td>";
                    strD += "<td>" + (dataD[i].dateAndWeek).split(" ")[1] + "</td>";
                    strD += "<td>" + dataD[i].orderTotalCount + "</td>";
                    strD += "<td>" + dataD[i].cnt + "</td>";
                    strD += "<td>" + dataD[i].productTotalSales + "</td>";
                    strD += "<tr>";
                    $("#table_d").append(strD);
                }
            }
        });

        //D1的参数
        chart.option_d1 = {
            // title:{ text:'GMV增长趋势'},
            tooltip:{ trigger:'axis'},
            legend:{
                data:['下单总数','付款订单数','商品销量']
            },
            grid:{ left:'0', right:'3%', bottom:'3%', containLabel:true },
            xAxis:{
                type:'category',
                boundaryGap:false,
                data:dayD
            },
            yAxis : [{type : 'value'}],
            series : [{
                name:'下单总数',
                type:'line',
                areaStyle:{normal:{}},
                data:dataDmtD_a
            },
            {
                name:'付款订单数',
                type:'line',
                areaStyle:{normal:{}},
                data:dataDmtD_b
            },
            {
                name:'商品销量',
                type:'line',
                areaStyle:{normal:{}},
                data:dataDmtD_c
            }]
        };
        if(winWth>640){
            chart.option_d2 = {
                tooltip : {trigger: 'axis', axisPointer : {type : 'shadow'}},
                legend: { data:['下单总数','付款订单数','商品销量']},
                grid: {left: '0', right: '4%', bottom: '3%', containLabel: true},
                xAxis : [{
                    type : 'category',
                    data : dayD
                }],
                yAxis : [{type : 'value'}],
                yAxis: {
                    type:'value'
                },
                series : [{
                    name:'下单总数',
                    type:'bar',
                    barWidth:20,
                    data:dataDmtD_a
                },
                {
                    name:'付款订单数',
                    type:'bar',
                    barWidth:20,
                    data:dataDmtD_b
                },
                {
                    name:'商品销量',
                    type:'bar',
                    barWidth:20,
                    data:dataDmtD_c
                }]
            };
        }else{
            chart.option_d2 = {
                tooltip : {trigger: 'axis', axisPointer : {type : 'shadow'}},
                legend: { data:['下单总数','付款订单数','商品销量']},
                grid: {left: '0', right: '4%', bottom: '3%', containLabel: true},
                xAxis : [{
                    type : 'category',
                    data : dayD
                }],
                yAxis : [{type : 'value'}],
                yAxis: {
                    type:'value'
                },
                series : [{
                    name:'下单总数',
                    type:'bar',
                    barWidth:5,
                    data:dataDmtD_a
                },
                {
                    name:'付款订单数',
                    type:'bar',
                    barWidth:5,
                    data:dataDmtD_b
                },
                {
                    name:'商品销量',
                    type:'bar',
                    barWidth:5,
                    data:dataDmtD_c
                }]
            };
        }
        chart_d1.setOption(chart.option_d1);
        chart_d2.setOption(chart.option_d2);
    }

    function loadE(start,endt,chan,sort){//开始时间，结束时间，渠道
        $(".topten").hide();
        var chanStrE  = chan.join(",");
        var urlE = shopApi + "ecom/appserver/report/orderCycleData?startDate=" + start + "&endDate=" + endt + "&channelArr=" + chanStrE;
        var topTenUrl = shopApi + "ecom/appserver/report/topProductInfo?startDate=" + start + "&endDate=" + endt + "&channelArr=" + chanStrE + "&sortName=" + sort;
        if(chanStrE.length == 0){
            $(".moTomoSpt").hide();
        }else{
            $(".moTomoSpt").show();
            ajaxDataFun(urlE,function(obj){
                if(obj.code == "200"){
                    var dataE = obj.data;
                    $(".moTomo_a").text(dataE[0].browsePeopleCount);
                    $(".moTomo_b").text(dataE[0].orderPeopleCount);
                    $(".moTomo_c").text(dataE[0].orderTotalCount);
                    $(".moTomo_d").text(dataE[0].orderTotalMoney);
                    $(".moTomo_e").text(dataE[0].payPeopleCount);
                    $(".moTomo_f").text(dataE[0].cnt);
                    $(".moTomo_g").text(dataE[0].totalAmt);
                    $(".moTomo_h").text(dataE[0].productTotalSales);
                    $(".moTomo_i").text(dataE[0].price);
                    $(".xiadan").text(dataE[0].orderCVR);
                    $(".fukuan_a").text(dataE[0].payCVR);
                    $(".fukuan_b").text(dataE[0].shopCVR);
                    if(chanStrE == "APP" || chanStrE == "App"){
                        $(".moTomo_hide").css("display","block");
                        $(".moTomo_j").text(dataE[0].orderPRP + "%");
                    }else{
                        $(".moTomo_hide").hide();
                    }
                }
            });
        }
        
        $("#table_e").html("");
        if(chan.length == 1){
            $(".topten").show();
            ajaxDataFun(topTenUrl,function(obj){
                if(obj.code == "200"){
                    var topTen = obj.data;
                    var topTenLen = topTen.length;
                    var i = 0;
                    var topTenStr = '';
                    for(i;i<topTenLen;i++){
                        topTenStr = "<tr>";
                        topTenStr += "<td>" + topTen[i].productName + "</td>";
                        topTenStr += "<td>" + topTen[i].categoryName + "</td>";
                        topTenStr += "<td>¥" + topTen[i].price + "</td>";
                        topTenStr += "<td>" + topTen[i].browsePeopleCount + "</td>";
                        topTenStr += "<td>" + topTen[i].payPeopleCount + "</td>";
                        topTenStr += "<td>" + topTen[i].payCVR + "%</td>";
                        topTenStr += "<td>" + topTen[i].productSales + "</td>";
                        topTenStr += "<td>¥" + topTen[i].totalAmt + "</td>";
                        topTenStr += "<td><a href='./alone.html?productId=" + topTen[i].productId + "'>查看详情</a></td>";
                        topTenStr += "<tr>";
                        $("#table_e").append(topTenStr);
                    }
                }
            });
        }else{
            $(".topten").hide();
        }
    }

    var table_faVm = new Vue({
        el: '#ccc',
        data: {
            list:''
        }
    })

    function loadF(order){
        var urlD = shopApi + "ecom/appserver/report/cycleContrast?ver=2.9.1";
        ajaxDataFun(urlD,function(obj){
            if(obj.code == "200"){
                var thisarr = obj.data;
                table_faVm.list = thisarr.slice().reverse();
            }
        });
    }

    function loadRecipeAll(time) {
        var recipeAllUrl = shopApi  + "ecom/newappserver/statistics/recipeCount?dValue=" + time + "&languageId=3" 
        ajaxDataFun(recipeAllUrl,function(obj){
            var topRecipeData = obj.data.topRecipes;
            var i = 0;
            var rl = topRecipeData.length;
            var recipeName = [];
            var recipeClick = [];
            var recipeAccount = obj.data.recipeCount.recipeAccount;
            var recipeIncAccount = obj.data.recipeCount.recipeIncAccount;

            $(".recipeAdd").html(recipeAccount);
            $(".yesRecipeAdd").html(recipeIncAccount);
            for(i; i<rl; i++){
                recipeName[i] = topRecipeData[i].recipeName;
                recipeClick[i] = topRecipeData[i].clickAccount;
            }

            $('#chart_recipeAll').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: recipeName,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '点击量 (次)'
                    }
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: '点击量',
                    data:recipeClick
                }]
            });
        });
    }

    var recipeVm = new Vue({
        el: '#tableRecipeDay',
        data: {
            list:''
        }
    })

    //累积菜谱日报
    function loadRecipeDay(start,endt,chan,type){
        console.log("========")
        var chanRecipe = chan.join(",");
        var recipeUrl = shopApi  + "ecom/newappserver/statistics/recipeDailyStatistics?currentPage=1&pageSize=90&startDate=" + start + "&endDate=" + endt + "&type=" + type;

        ajaxDataFun(recipeUrl,function(obj){
            if(obj.code == "200"){
                recipeVm.list = obj.data;
            }
        })
    }

    // GMV增长趋势 默认开始时间和结束时间 第一栏
    var initStartA = start_7; 
    var initEndA = endTime;   
    loadA(initStartA,initEndA,channel_a);

    // GMV变化对比 默认开始时间和结束时间(带周期) 第二栏 
    var initStartB = start_7;
    var initEndB = endTime;
    var initStart_dbB = start_14;
    var initEnd_dbB = db_end_7;
    loadB(initStartB,initEndB,initStart_dbB,initEnd_dbB,channel_b);

    // 第三栏
    var initStartC = start_7; 
    var initEndC = endTime;   
    loadC(initStartC,initEndC,channel_c);

    // 第四栏
    var initStartD = start_7; 
    var initEndD = endTime;  
    loadD(initStartD,initEndD,channel_d);

    // 第五栏
    var initStartE = start_7; 
    var initEndE = endTime;  
    var sortE = "payCVR";

    loadE(initStartE,initEndE,channel_e,sortE);

    // 第六栏
    loadF();

    //菜谱统计
    loadRecipeAll(1);

    var recipeStart = thisYear + "-" + thisMouth + "-01";
    var recipeEnd = thisYear + "-" + thisMouth + "-" + yesterday;

    if(yesterday == '01'){
        recipeStart = thisYear + "-" + lastMouth + "-01";
    }

    loadRecipeDay(recipeStart,recipeEnd,channel_recipe,'');


    $("#allRecipe").change(function(){
        var type = $(this).find("option:selected").val();
        loadRecipeDay(recipeStart,recipeEnd,channel_recipe,type);
    })


    $(".mainWrap .time li").click(function(){ // 切换时间周期
        var _this =  $(this);
        var _type = _this.parents(".tool").attr("data-type"); 
        var _index  = _this.index();  
            _this.siblings('li').removeClass('active');
            _this.addClass('active');  

        if(_type == 0){
            if(_index == 0){
                initStartA = start_7;
            }else if(_index==1){
                initStartA = start_14;
            }else{
                initStartA = start_28;
            }
            loadA(initStartA,initEndA,channel_a);
            $("#inpstart_a").val(initStartA).removeClass('active'); //a的时间选择移除选中
            $("#inpend_a").val(endTime).removeClass('active');
        }else if(_type == 1){
            if(_index == 0){
                initStartB = start_7;
                initStart_dbB = start_14;
                initEnd_dbB = db_end_7;
            }else if(_index==1){
                initStartB = start_14;
                initStart_dbB = start_28;
                initEnd_dbB = db_end_14;
            }else{
                initStartB = start_28;
                initStart_dbB = start_56;
                initEnd_dbB = db_end_28;
            }
            loadB(initStartB,initEndB,initStart_dbB,initEnd_dbB,channel_b);
            $("#inpstart_b").val(initStartB).removeClass('active'); //b的时间选择移除选中
            $("#inpend_b").val(endTime).removeClass('active');
        }else if(_type == 2){
            if(_index == 0){
                initStartC = start_7;
            }else if(_index==1){
                initStartC = start_14;
            }else{
                initStartC = start_28;
            }
            loadC(initStartC,initEndC,channel_c);
            $("#inpstart_c").val(initStartC).removeClass('active'); //c的时间选择移除选中
            $("#inpend_c").val(endTime).removeClass('active');
        }else if(_type == 3){
            if(_index == 0){
                initStartD = start_7;
            }else if(_index==1){
                initStartD = start_14;
            }else{
                initStartD = start_28;
            }
            loadD(initStartD,initEndD,channel_d);
            $("#inpstart_d").val(initStartD).removeClass('active'); //a的时间选择移除选中
            $("#inpend_d").val(endTime).removeClass('active');
        }else if(_type == 4){
            if(_index == 0){
                initStartE = start_7;
            }else if(_index==1){
                initStartE = start_14;
            }else{
                initStartE = start_28;
            }
            loadE(initStartE,initEndE,channel_e,sortE);
            $(".hand").removeClass("sortThis");
            $(".moren").addClass("sortThis");
            $("#inpstart_e").val(initStartE).removeClass('active'); //a的时间选择移除选中
            $("#inpend_e").val(endTime).removeClass('active');
        }else if(_type == 6){
            if(_index == 0){
                loadRecipeAll(1)
            }else if(_index == 1){
                loadRecipeAll(7)
            }
        }else{
            console.log("404");
        }
    });

    function sortLoadE(sort,obj){
        loadE(initStartE,initEndE,channel_e,sort);
        $(obj).addClass("sortThis").siblings().removeClass('sortThis');
    }

    // GMV增长趋势 默认开始时间和结束时间
    $("input[name=channel_a]").change(function(){  
        var len;
        var _this = $(this);
        channel_a = [];  // 数组置空
        $("input[name=channel_a]").each(function(){
            if($(this).prop("checked")){
                channel_a.push($(this).val());
            }
        });
        len = channel_a.length;
        if( len < 1){
            popShow(_this,"最少选择一个渠道");
            return;
        }
        loadA(initStartA,initEndA,channel_a);
    });

    $("input[name=channel_b]").change(function(){ 
        var len;
        var _this = $(this);
        channel_b = [];  // 数组置空
        $("input[name=channel_b]").each(function(){
            if($(this).prop("checked")){
                channel_b.push($(this).val());
            }
        });
        len = channel_b.length;
        if( len < 1){
            popShow(_this,"最少选择一个渠道");
            return;
        }
        loadB(initStartB,initEndB,initStart_dbB,initEnd_dbB,channel_b);
    });

    $("input[name=channel_c]").change(function(){  
        var len;
        var _this = $(this);
        channel_c = [];  // 数组置空
        $("input[name=channel_c]").each(function(){
            if($(this).prop("checked")){
                channel_c.push($(this).val());
            }
        });
        len = channel_c.length;
        if( len < 1){
            popShow(_this,"最少选择一个渠道");
            return;
        }
        loadC(initStartC,initEndC,channel_c);
    });

    $("input[name=channel_d]").change(function(){  
        var len;
        var _this = $(this);
        channel_d = [];  // 数组置空
        $("input[name=channel_d]").each(function(){
            if($(this).prop("checked")){
                channel_d.push($(this).val());
            }
        });
        len = channel_d.length;
        if( len < 1){
            popShow(_this,"最少选择一个渠道");
            return;
        }
        loadD(initStartD,initEndD,channel_d);
    });

    $("input[name=channel_e]").change(function(){  
        var len;
        var _this = $(this);
        channel_e = [];  // 数组置空
        $("input[name=channel_e]").each(function(){
            if($(this).prop("checked")){
                channel_e.push($(this).val());
            }
        });
        len = channel_e.length;
        if( len < 1){
            popShow(_this,"最少选择一个渠道");
            return;
        }
        loadE(initStartE,initEndE,channel_e,sortE);
        $(".hand").removeClass("sortThis");
        $(".moren").addClass("sortThis");
    });

    // $("input[name=channel_recipe]").change(function(){  
    //     var len;
    //     var _this = $(this);
    //     channel_recipe = [];  // 数组置空
    //     $("input[name=channel_recipe]").each(function(){
    //         if($(this).prop("checked")){
    //             channel_recipe.push($(this).val());
    //         }
    //     });
    //     len = channel_recipe.length;
    //     if( len < 1){
    //         popShow(_this,"最少选择一个渠道");
    //         return;
    //     }
    //     loadRecipeDay(recipeStart,recipeEnd,channel_recipe);
    // });

    function popShow(o,txt){
        if(o){
            $(o).prop("checked","checked");
        }
        $("#popshow p").html(txt);
        $("#popshow").show();
        setTimeout(function(){
            $("#popshow").fadeOut();
        },2000);
    }

    // 指标单图  交易额变化数据 时间选择
    var start_a = {
        format: 'YYYY-MM-DD',
        minDate: '2016-01-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-7],
        isClear:false,
        choosefun: function(elem,datas){
            end_a.minDate = datas; 
            $("#inpstart_a").addClass('active');
            $(".time_a li").removeClass('active');
            initStartA = datas;
            loadA(initStartA,initEndA,channel_a);
        }
    };

    var end_a = {
        format: 'YYYY-MM-DD',
        minDate: '2016-10-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-1],
        isClear:false,
        choosefun: function(elem,datas){
            start_a.maxDate = datas; 
            $("#inpend_a").addClass('active');
            $(".time_a li").removeClass('active');
            initEndA = datas;
            loadA(initStartA,initEndA,channel_a);
        }
    };

    // 指标单图  交易额周期对比 时间选择
    var start_b = {
        format: 'YYYY-MM-DD',
        minDate: '2016-01-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-7],
        isClear:false,
        choosefun: function(elem,datas){
            end_b.minDate = datas; 
            $("#inpstart_b").addClass('active');
            $(".time_b li").removeClass('active');

            initStartB = datas;
            var thisStarStamp = Date.parse(datas);  //当天的时间戳
                initEnd_dbB = formatDate(thisStarStamp - oneStamp);
            var dayGap  = (Date.parse(initEndB) - thisStarStamp)/oneStamp + 1; // 相差天数
                initStart_dbB =  formatDate(thisStarStamp - oneStamp*dayGap);
            loadB(initStartB,initEndB,initStart_dbB,initEnd_dbB,channel_b);
        }
    };

    var end_b = {
        format: 'YYYY-MM-DD',
        minDate: '2016-10-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-1],
        isClear:false,
        choosefun: function(elem,datas){
            start_b.maxDate = datas; 
            $("#inpend_b").addClass('active');
            $(".time_b li").removeClass('active');

            initEndB = datas;
            var thisEndStamp = Date.parse(datas);  //当天的时间戳
            var dayGap = (thisEndStamp -  Date.parse(initStartB))/oneStamp + 1;// 相差天数
                initStart_dbB =  formatDate(thisEndStamp - oneStamp*dayGap*2 + oneStamp);

            loadB(initStartB,initEndB,initStart_dbB,initEnd_dbB,channel_b);
        }
    };

    // 用户数据趋势时间选择
    var start_c = {
        format: 'YYYY-MM-DD',
        minDate: '2016-01-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-7],
        isClear:false,
        choosefun: function(elem,datas){
            end_c.minDate = datas; 
            $("#inpstart_c").addClass('active');
            $(".time_c li").removeClass('active');
            initStartC = datas;
            loadC(initStartC,initEndC,channel_c);
        }
    };

    var end_c = {
        format: 'YYYY-MM-DD',
        minDate: '2016-10-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-1],
        isClear:false,
        choosefun: function(elem,datas){
            start_c.maxDate = datas; 
            $("#inpend_c").addClass('active');
            $(".time_c li").removeClass('active');
            initEndC = datas;
            loadC(initStartC,initEndC,channel_c);
        }
    };

    // 购买数据趋势时间选择
    var start_d = {
        format: 'YYYY-MM-DD',
        minDate: '2016-01-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-7],
        isClear:false,
        choosefun: function(elem,datas){
            end_d.minDate = datas; 
            $("#inpstart_d").addClass('active');
            $(".time_d li").removeClass('active');
            initStartD = datas;
            loadD(initStartD,initEndD,channel_d);
        }
    };

    var end_d = {
        format: 'YYYY-MM-DD',
        minDate: '2016-10-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-1],
        isClear:false,
        choosefun: function(elem,datas){
            start_d.maxDate = datas; 
            $("#inpend_d").addClass('active');
            $(".time_d li").removeClass('active');
            initEndD = datas;
            loadD(initStartD,initEndD,channel_d);
        }
    };

    // 交易概况时间选择
    var start_e = {
        format: 'YYYY-MM-DD',
        minDate: '2016-01-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-7],
        isClear:false,
        choosefun: function(elem,datas){
            end_e.minDate = datas; 
            $("#inpstart_e").addClass('active');
            $(".time_e li").removeClass('active');
            initStartE = datas;
            loadE(initStartE,initEndE,channel_e,sortE);
            $(".hand").removeClass("sortThis");
            $(".moren").addClass("sortThis");
        }
    };

    var end_e = {
        format: 'YYYY-MM-DD',
        minDate: '2016-10-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-1],
        isClear:false,
        choosefun: function(elem,datas){
            start_e.maxDate = datas; 
            $("#inpend_e").addClass('active');
            $(".time_e li").removeClass('active');
            initEndE = datas;
            loadE(initStartE,initEndE,channel_e,sortE);
            $(".hand").removeClass("sortThis");
            $(".moren").addClass("sortThis");
        }
    };

    // 累积菜谱日报时间选择
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
            var type = $("#allRecipe option:selected").val();
            end_recipe.minDate = datas; 
            recipeStart = datas;
            loadRecipeDay(recipeStart,recipeEnd,channel_recipe,type);
            $("#inpstart_recipe").addClass('active');
        }
    };

    $("#inpstart_recipe").val(recipeStart);

    var end_recipe = {
        format: 'YYYY-MM-DD',
        minDate: '2016-10-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-1],
        isClear:false,
        isToday:true,
        choosefun: function(elem,datas){
            var thisStamp = Date.parse(datas);
            var min_90 = formatDate(thisStamp - oneStamp*89); // 最大限制90天
            var type = $("#allRecipe option:selected").val();
            start_recipe.maxDate = datas;
            start_recipe.minDate = min_90;
            recipeEnd = datas;
            loadRecipeDay(recipeStart,recipeEnd,channel_recipe,type);
            $("#inpend_recipe").addClass('active');
        }
    };

    // 菜谱统计详情筛选日期 
    var seachStarTime = db_end_90;
    var searchEndTime = endTime;
    var search_start_time = {
        format: 'YYYY-MM-DD',
        minDate: '2016-01-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-90],
        isClear:false,
        isToday:false,
        choosefun: function(elem,datas){
            seach_end_tiem.minDate = datas; 
            seachStarTime = datas;
        }
    };

    var seach_end_tiem = {
        format: 'YYYY-MM-DD',
        minDate: '2016-10-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:true,
        initAddVal:[-1],
        isClear:false,
        isToday:true,
        choosefun: function(elem,datas){
            search_start_time.maxDate = datas; 
            searchEndTime = datas;
        }
    };

     // 菜谱发布
    var publishStartTime = "";
    var publishEndTime = "";

    var publish_start_time = {
        format: 'YYYY-MM-DD hh:mm:ss',
        minDate: '2016-01-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:false,
        isClear:true,
        isToday:false,
        choosefun: function(elem,datas){
            publish_end_tiem.minDate = datas; 
            publishStartTime = Date.parse(new Date(datas));
            console.log(publishStartTime);
        },
        clearfun:function(){
            publishStartTime = "";
        }
    };

    var publish_end_tiem = {
        format: 'YYYY-MM-DD hh:mm:ss',
        minDate: '2016-10-01 23:59:59', 
        maxDate: $.nowDate(-1), 
        isinitVal:false,
        isClear:true,
        isToday:false,
        choosefun: function(elem,datas){
            publish_start_time.maxDate = datas; 
            publishEndTime =  Date.parse(new Date(datas));
            console.log(publishEndTime);
        },
        clearfun:function(){
            publishEndTime = "";
        }
    };

    //栏目一时间选择
    $("#inpstart_a").jeDate(start_a);
    $("#inpend_a").jeDate(end_a);

    //栏目二时间选择
    $("#inpstart_b").jeDate(start_b);
    $("#inpend_b").jeDate(end_b);

    //栏目三时间选择
    $("#inpstart_c").jeDate(start_c);
    $("#inpend_c").jeDate(end_c);

    //栏目四时间选择
    $("#inpstart_d").jeDate(start_d);
    $("#inpend_d").jeDate(end_d);

    //栏目五时间选择
    $("#inpstart_e").jeDate(start_e);
    $("#inpend_e").jeDate(end_e);

    //菜谱日报
    $("#inpstart_recipe").jeDate(start_recipe);
    $("#inpend_recipe").jeDate(end_recipe);

    //菜谱筛选日期
    $("#inpstartAllRecipe").jeDate(search_start_time);
    $("#inpendAllRecipe").jeDate(seach_end_tiem);

    //菜谱发布日期
    $("#recipePublish_start").jeDate(publish_start_time);
    $("#recipePublish_end").jeDate(publish_end_tiem);

    var searchVm = new Vue({
        el: '#recipeSearch',
        data: {
            list:'',
            totalCount:'',
            pageSize:'1',
            currentPage:'',
            toPage:'1',
            taotalClickAccount:0,
            taotalCollectionAccount:0,
            taotalShareAccount:0
        }
    })

    Vue.filter('timeFix',function(val) {
        return formatDate(val);
    });


    function searchRecipe(load,page){
        var searchId = $("#searchId").val();
        var searchName = $("#searchName").val();
        var authorType = $("#recipeType option:selected").val();

        var searchRecipeUrl = shopApi + "ecom/newappserver/statistics/recipeDetailStatistics.do?authorType=" + authorType + "&recipeName=" + searchName + "&recipeId=" + searchId + "&pageNo=" + page + "&pageSize=10&startDate=" + seachStarTime + "&endDate=" + searchEndTime + "&releaseDateBegin=" + publishStartTime + "&releaseDateEnd=" + publishEndTime;

        if(load){
            searchRecipeUrl = shopApi + "ecom/newappserver/statistics/recipeDetailStatistics.do?authorType=" + authorType + "&recipeName=" + searchName + "&recipeId=" + searchId + "&pageNo=1&pageSize=10&startDate=" + seachStarTime + "&endDate=" + searchEndTime + "&releaseDateBegin=" + publishStartTime + "&releaseDateEnd=" + publishEndTime;
        }else{
            if(page > searchVm.pageSize){
                searchVm.toPage = 1;
                return;
            }
        }

        ajaxDataFun(searchRecipeUrl,function(obj){
            if(obj.code == "200"){
                searchVm.list = obj.data;
                searchVm.totalCount = obj.totalCount;
                searchVm.pageSize = Math.ceil(searchVm.totalCount/10)?Math.ceil(searchVm.totalCount/10):1;
                searchVm.currentPage = page;
                searchVm.taotalClickAccount = obj.taotalClickAccount;
                searchVm.taotalCollectionAccount = obj.taotalCollectionAccount;
                searchVm.taotalShareAccount = obj.taotalShareAccount;
            }
        })
    }

    searchRecipe(1,1);

    //表格切换
    $(".viewList li").click(function(){
        var _this = $(this);
        var _index = $(this).index();
        var _tool = $(this).parents(".tool");
        _this.siblings().removeClass('active');
        _this.addClass("active");
        _tool.next(".tagCont").find(".tagbox").removeClass('active');
        _tool.next(".tagCont").find(".tagbox").eq(_index).addClass('active');
    });

    $(".icon-help").click(function(){
        $(".help").hide();
        $(this).next(".help").fadeIn();
    });

    $(".icon-close").click(function(){
        $(".help").fadeOut();
    });

    var a_h = $("#aaa").offset().top;
    var b_h = $("#bbb").offset().top;
    var c_h = $("#ccc").offset().top;
    var d_h = $("#ddd").offset().top;
    var e_h = $("#eee").offset().top;
    var f_h = $("#fff").offset().top;

    $(window).scroll(function(){
        var top_h = $(window).scrollTop();
        if(top_h > 200){
            $("#gotop").show();
        }else{
            $("#gotop").hide();
        }

        a_h = $("#aaa").offset().top - 20;
        b_h = $("#bbb").offset().top - 20;
        c_h = $("#ccc").offset().top - 20;
        d_h = $("#ddd").offset().top - 20;
        e_h = $("#eee").offset().top - 20;
        f_h = $("#fff").offset().top - 20;

        $(".shoptag li").removeClass('active');

        if(top_h < b_h){
            $(".toaaa").addClass('active');
        }else if(top_h > b_h && top_h < c_h){
            $(".tobbb").addClass('active');
        }else if(top_h > c_h && top_h < d_h){
            $(".toccc").addClass('active');
        }else if(top_h > d_h && top_h < e_h){
            $(".toddd").addClass('active');
        }else if(top_h > e_h && top_h < e_h){
            $(".toeee").addClass('active');
        }else if(top_h > f_h){
            $(".tofff").addClass('active');
        }
    });

    $("#gotop").click(function() {
        $('html, body').animate({scrollTop:0}, '1000');
    });

    $(".shoptag li").click(function() {
        var _this = $(this);
        var goLayer = $(this).attr("data-id");
        var h = $("#" + goLayer).offset().top;
        $(".shoptag li").removeClass('active');
        $('html, body').animate({
            scrollTop: h
        }, '2000',function(){
            _this.addClass('active');
        });
    });
    
    $("#moblieMenu").click(function() {
        $("#nav").slideToggle();
    });    

  //第一个导出按钮
    function execlExported_one() {
        var type = $("#allRecipe").find("option:selected").val();
        var formDataUrl = shopApi  + "ecom/newappserver/statistics/recipeDailyStatisticsToExcel.do?startDate=" + recipeStart + "&endDate=" + recipeEnd + "&type=" + type;
        window.location.href = formDataUrl;
    }

    //第二个导出功能 已成功
    function execlExported_two() {
        var searchId = $("#searchId").val();
        var searchName = $("#searchName").val();
        var authorType = $("#recipeType option:selected").val();

        var formData = "authorType=" + authorType + "&recipeName=" + searchName + "&recipeId=" + searchId + "&startDate=" + seachStarTime + "&endDate=" + searchEndTime + "&releaseDateBegin=" + publishStartTime + "&releaseDateEnd=" + publishEndTime;
        window.location.href = shopApi + 'ecom/newappserver/statistics/recipeDetailToExcel.do?'+ formData;

    }
