define(function(require, exports, module) {
    var $ = require('jquery');
    var TplManager = require('tplmanager');
    var PageSlider = require('pageslider');
    var moduleId = module.id;

    exports.init = function(module) {
        var tpl = TplManager.get(moduleId);
        console.log(moduleId)
        if (!tpl) {
            $.get('./partial/' + module + '.html', function(data) {
                PageSlider.slide($(data));
                TplManager.push(moduleId, data);
            }, 'html');
        } else {
            PageSlider.slide($(tpl));
        }
    };
});