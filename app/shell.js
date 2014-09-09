/*jslint unparam:true,vars:true*/
/*global define*/
define(function(require) {
    'use strict';
    var router = require('plugins/router');

    return {
        router: router,
        activate: function() {
            router.map([{
                route: '',
                moduleId: 'pages/page',
            }]);

            return router.activate();
        }
    };
});
