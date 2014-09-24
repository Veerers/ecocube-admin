/*jslint unparam:true,vars:true,nomen:true*/
/*global define*/
define(function(require) {
    'use strict';
    var _ = require('lodash');
    var ko = require('knockout');
    var $ = require('jquery');

    ko.bindingHandlers.summernote = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            var options = valueAccessor();
            var binding = ko.utils.unwrapObservable(allBindingsAccessor()).value;

            var updateObservable = function(e) {
                binding(e.currentTarget.innerHTML);
            };

            options.onkeydown = options.onkeyup = options.onfocus = options.onblur = updateObservable;

            $(element).summernote(options);
        }
    };

    var Media = (function() {
        function Class(data) {
            this.type = ko.observable(data.type);
            this.types = ['image', 'video', 'file'];
            this.id = ko.observable(data.id);
            this.name = ko.observable();
        }

        Class.prototype.toJS = function() {
            return {
                type: this.type(),
                id: this.id(),
                name: this.name()
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

        Class.prototype.addMedia = function() {
            this.media.push(new Media({}));
        };

        Class.prototype.removeMedia = function(media) {
            this.media.remove(media);
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

        Class.prototype.addArticle = function() {
            this.articles.push(new Article({}));
        };

        Class.prototype.removeArticle = function(article) {
            this.articles.remove(article);
        };

        return Class;
    }());

    var ViewModel = (function() {
        function Class() {
            this.page = ko.observable(new Page({}));
            this.source = ko.computed({
                read: function() {
                    return this.page().toJSON().replace(/(?:"_id":)(".*?")/, '"_id":ObjectId($1)');
                }.bind(this),
                write: function(newValue) {
                    var newValueJS = JSON.parse(newValue.replace(/ObjectId\((\".*?\")\)/, '$1'));
                    this.page(new Page(newValueJS));
                }.bind(this)
            })
        }

        return Class;
    }());

    var vm = new ViewModel();

    return vm;
});
