/*jslint browser:true,nomen:true,vars:true,unparam:true*/
/*global requirejs,define*/
(function () {
    'use strict';

    requirejs.config({
        paths: {
            'durandal': '../bower_components/durandal/js',
            'plugins': '../bower_components/durandal/js/plugins',
            'text': '../bower_components/requirejs-text/text',
            'transitions': '../bower_components/durandal/js/transitions',

            'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
            'jquery': '../bower_components/jquery/jquery',
            'knockout': '../bower_components/knockout.js/knockout',
            'lodash': '../bower_components/lodash/dist/lodash.compat',
            'q': '../bower_components/q/q',
            'summernote': '../bower_components/summernote/dist/summernote'
        },
        shim: {
            'bootstrap': ['jquery']
        }
    });

    define(function (require) {
        var system = require('durandal/system');
        var app = require('durandal/app');
        var viewLocator = require('durandal/viewLocator');
        var binder = require('durandal/binder');
        var $ = require('jquery');
        var q = require('q');

        var bootstrap = require('bootstrap');
        var summernote = require('summernote');

        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        app.title = 'Админ - ЭкоКуб';

        app.configurePlugins({
            router: true
        });

        system.defer = function (action) {
            var deferred = q.defer();
            action.call(deferred, deferred);
            var promise = deferred.promise;
            deferred.promise = function () {
                return promise;
            };
            return deferred;
        };

        app.start().then(function () {
            viewLocator.useConvention();
            app.setRoot('shell', null, 'application');
        });
    });
}());
