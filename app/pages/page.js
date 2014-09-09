/*jslint unparam:true,vars:true,nomen:true*/
/*global define*/
define(function(require) {
    'use strict';
    var _ = require('lodash');
    var ko = require('knockout');

    var source = ko.observable();

    var Media = (function() {
        function Class(data) {
            this.type = ko.observable(data.type);
            this.types = ['image', 'video'];
            this.id = ko.observable(data.id);
        }

        Class.prototype.toJS = function() {
            return {
                type: this.type(),
                id: this.id()
            }
        };

        return Class;
    }());

    var Article = (function() {
        function Class(data) {
            this.title = ko.observable(data.title);
            this.text = ko.observable(data.text);
            this.media = ko.observableArray(_.map(data.media, function(media) {
                return new Media(media);
            }));
        }

        Class.prototype.toJS = function() {
            return {
                title: this.title(),
                text: this.text(),
                media: _.map(this.media(), function(media) {
                    return media.toJS();
                })
            };
        };

        return Class;
    }());

    var Page = (function() {
        function Class(data) {
            this._id = ko.observable(data._id);
            this.title = ko.observable(data.title);
            this.category = ko.observable(data.category);
            this.categories = ['Покупателю', 'Бизнесу', 'Новости'];
            this.articles = ko.observableArray(_.map(data.articles, function(article) {
                return new Article(article);
            }));
        }

        Class.prototype.toJS = function() {
            return {
                _id: this._id(),
                title: this.title(),
                category: this.category(),
                articles: _.map(this.articles(), function(article) {
                    return article.toJS();
                })
            };
        };

        Class.prototype.toJSON = function() {
            return JSON.stringify(this.toJS());
        };

        return Class;
    }());

    var ViewModel = (function() {
        function Class() {
            this.page = ko.observable(new Page({}));
            this.source = ko.computed({
                read: function() {
                    return this.page().toJSON();
                }.bind(this),
                write: function(newValue) {
                    var newValueJS = JSON.parse(newValue);
                    this.page(new Page(newValueJS));
                }.bind(this)
            })
        }

        return Class;
    }());

    var vm = new ViewModel();

    return vm;
});
