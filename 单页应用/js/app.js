define(function(require, exports) {
    var Backbone = require('backbone');
    
    /*
        http://m.51fanli.com/oto/movie/#list
        http://m.51fanli.com/oto/movie/#detail/1
    */
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'list': 'home',
            ':detail/:id': 'loadModule'
        },

        home: function() {
            this.loadModule('list');
        },

        loadModule: function(module, id) {
            require.async(module, function(m) {
                m.init(module, id);
            });
        }
    });

    exports.run = function() {
        new AppRouter();
        Backbone.history.start();
    };
});