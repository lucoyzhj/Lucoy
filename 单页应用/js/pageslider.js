define(function(require, exports) {
    var $ = require('jquery');

    var $view = $('#J_view');
    var $currentPage;

    var centerClass = 'center';
    var leftClass = 'left';
    var rightClass = 'right';
    var pageClass = 'page';
    var transitionClass = 'transition';

    /*
        1. list
        2. detail 
         2.1 detail - list
         2.2 detail - detail
    */
    exports.slide = function($page) {
        var currentRole;
        var targetRole;
        var from = 'right';

        $view.append($page);

        if (!$currentPage) {
            $currentPage = $page.addClass(pageClass + ' ' + centerClass);
            return;
        }

        currentRole = $currentPage.data('role');
        targetRole = $page.data('role');

        if (currentRole == 'detail') {
            if (targetRole == 'detail') {
                from = 'right'
            } else {
                from = 'left';
            }
        }

        // Position the page at the starting position of the animation
        $page.addClass(pageClass + ' ' + from);

        $currentPage.one('webkitTransitionEnd', function(e) {
            $(e.target).remove();
        });

        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        $view[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        $page.removeClass(leftClass + ' ' + rightClass).addClass(transitionClass + ' ' + centerClass);
        $currentPage.attr("class", "page transition " + (from === "left" ? "right" : "left"));
        $currentPage = $page;
    };
});