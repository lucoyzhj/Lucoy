(function(){

var $skuAttr = $('.J_attr_list');
if( $skuAttr.length==0 ){
    return;
}

var selectedClass = 'selected';
var disableClass = 'disable';
var skuId = "";
var realStockNum = 0;

var skuSetStoreCache = {};
var skuPropsLen = allProps.length;
var lock = false;


//如果一个sku都没有选择，返回的skumap，格式{"20548":{"undefined":166},"20549":{"28919":8,"28921":11,"28923":30,"28925":42,"28927":32,"28929":43}}
var skuMapListCache = null; 

//每个sku点击后
$skuAttr.on('click','a', function(){

    //防连点
    if( lock ){ return; }
    lock = true;
    setTimeout(function(){
        lock = false;
    },300);

    //click to change sku

    var $this = $(this);
    var skuItemProcId = $this.attr('proc-id');
    var setStoreParam = {};
    var skuListObj = {};

    var skuItemId = $this.data('id');
    if( $this.hasClass(disableClass) ){
        return;
    }

    //已选中
    if( $this.hasClass(selectedClass) ){
        $this.removeClass(selectedClass);
        // //取消选中，则根据第一个选中的类别来定sku   这段有问题
        // var $firstSelected = $('.J_attr_list a.selected').eq(0);
        // if( $firstSelected.length>0 ){
        //     $firstSelected.siblings('a').removeClass(disableClass);
        //     skuItemProcId = $firstSelected.attr('proc-id');
        //     skuItemId = $firstSelected.data('id');
        //     setStoreParam[skuItemProcId] = skuItemId;
        //     skuListObj = setStore(setStoreParam);
        // }else{
        //     skuListObj = setStore('');
        // }

        //取消选中  这段也有问题        
        if( $('.J_attr_list a.selected').length==0 ){
            skuListObj = setStore('');
        }
        else{
            $('.J_attr_list a.selected').each(function(){
                var $this = $(this);
                //$this.siblings('a').removeClass(disableClass);
                skuItemProcId = $this.attr('proc-id');
                skuItemId = $this.data('id');
                setStoreParam[skuItemProcId] = skuItemId;
            })
            // console.log(setStoreParam) //{20549: 28929, 1627207: 3232481}
            skuListObj = setStore(setStoreParam, 1);
        }
    }
    //未选中
    else{
        $this.addClass(selectedClass).siblings('a').removeClass(selectedClass);
        //更新大图
        if( $this.data('img') != undefined ){
            //更新图片
        }

        setStoreParam[skuItemProcId] = skuItemId;
        skuListObj = setStore(setStoreParam);
    }

    //联动
    //点击一个sku属性id后，得到该属性配对的库存列表
    //var skuListObj = setStore({skuItemProcId : skuItemId}); //{"20548":{"undefined":166},"20549":{"28919":8,"28921":11,"28923":30,"28925":42,"28927":32,"28929":43}}
    
    //遍历库存列表，改变其他属性的样式（是否变灰）
    for( var skuProp in skuListObj){

        if( skuItemProcId==skuProp ){
            continue;
        }

        var $curSkuRow = $('#J_sku_'+skuProp);
        
        $('a', $curSkuRow).each(function(){
            var $this = $(this);

// console.log(skuListObj[skuProp][$this.data('id')])

            if( skuListObj[skuProp][$this.data('id')] ){
                $this.removeClass(disableClass);
            }else{
                $this.addClass(disableClass);
            }
        });
    }

    //如果选中的属性值不全
    if( $skuAttr.find('a.'+selectedClass).length<skuPropsLen ){
        realStockNum = 0;
        
        //dosomething
        $('#J_sku_skuid').val( '' );
        $('#J_sku_stock').val( '' );
        $('#J_sku_price').val( '' );
        $('#J_sku_reserve_price').val( '' );
    }
    //选中属性齐全，match skuid
    else{
        var skuObj = {};
        var matchObj = {};

        $skuAttr.find('a.'+selectedClass).each(function(){
            var $this = $(this);
            skuObj[ $this.attr('proc-id') ] = $this.data('id');
        });
        
        matchObj = matchSkuId(skuObj);

        //当前sku的price   matchObj['price']
        //dosomething
        $('#J_sku_skuid').val( matchObj['skuid'] );
        $('#J_sku_stock').val( matchObj['stock'] );
        $('#J_sku_price').val( matchObj['price'] );
        $('#J_sku_reserve_price').val( matchObj['reserve_price'] );
    }
});

setInitSku();
setDefaultSKU();

function setInitSku(){

    //页面加载后判断下各个sku有没有数据

    var initSkuListObj = setStore('');
    
    //先循环一遍库存情况
    //遍历库存列表，改变其他属性的样式（是否变灰）
    for( var skuPropInit in initSkuListObj){

        var $curSkuRow = $('#J_sku_'+skuPropInit);
        
        $('a', $curSkuRow).each(function(){
            var $this = $(this);

            if( initSkuListObj[skuPropInit][$this.data('id')] ){
                $this.removeClass(disableClass);
            }else{
                $this.addClass(disableClass);
            }
        });
    }
}

function setDefaultSKU(){
    if( typeof defaultSku == 'undefined' || !defaultSku ){
        return;
    }

    $skuAttr.find('a[data-id='+defaultSku+']').trigger('click');
}

//通过传入sku prop id获得与之匹配元素的库存情况
function setStore(propMap, isCancle) {  //propMap=>{'1627207' : 3232484}
    var outputProps = new Array();
    var returnObj = {};
    if(propMap == '' && skuMapListCache) {
        returnObj = skuMapListCache;
        return returnObj;
    } else {
        if( propMap=='' ){
            propMap = {};
        }
        for(var i = allProps.length-1 ; i >= 0; i--) {
            var property = allProps[i];
            if(!isCancle ) {
                !propMap[property] && outputProps.push(property);
            }else{
                propMap[property] && outputProps.push(property);
            }
        }
    }
console.log(propMap)
console.log(outputProps)
    for(var i = outputProps.length -1; i >= 0 ; i--) {
        var propId = outputProps[i] + '';
        returnObj[propId] = {};
        for(j = skuMap.length - 1; j >= 0; j--) {
            if(skuMap[j].pv && compareObject(skuMap[j].pv, propMap, true)) {

                var propValue = skuMap[j]['pv'][propId];
                if(returnObj[propId][propValue]) {
                    returnObj[propId][propValue] += skuMap[j].stock;
                } else {
                    returnObj[propId][propValue] = skuMap[j].stock;
                }
            }
        }
    }
    if(propMap == '') {
        skuMapListCache = returnObj;
    }

    // console.log(returnObj)
    return returnObj; //{"20549":{"28919":8,"28921":11,"28923":30,"28925":42,"28927":32,"28929":43}}
}

function matchSkuId(propMap) {
    var matchObj = {};

    for(var i=skuMap.length-1; i>=0; i--) {
        if(skuMap[i].pv && compareObject(skuMap[i].pv, propMap, false)) {
            matchObj = skuMap[i];
            break;
        }
    }
    return matchObj;
}

function compareObject(obj1, obj2, allowContain){
    var flag = true;
    var pcount = 0;
    for(var key in obj2) {
        if(typeof(obj1[key]) == 'object' || obj2[key] != obj1[key]) {
            flag = false;
        }
        pcount ++;
    }

    //比对完全相等， 还要比两个对象的属性个数
    if(flag && !allowContain) {
        var pcount1 = 0;
        for(var key in obj1) {
            pcount1 ++;
        }
        if(pcount1 != pcount) {
            flag = false;
        }
    }

    return flag;
}

})(this);