(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
jQuery(document).ready(function(t){"use strict";function n(){var n=t("#add-ingredient-control"),i=n.prev(".form-group").clone();i.find("input").val(""),i.find("option").prop("selected",!1),i.find("option").removeAttr("selected"),n.before(i),c++,e(),i.find("input:first").focus()}function i(){var n=t("#add-step-control"),i=n.prev().find(".cocktail-step:last").clone();i.find("textarea").text(""),i.find(".control-label").text(""),t("#step-list").append(i),e(),i.find("textarea:first").focus()}function e(){function n(t,n){var i=t.find(".col-sm-1");n>0&&!i.find(".glyphicon-remove").length&&i.append('<span class="glyphicon glyphicon-remove text-right"/>')}function i(t,n){0===n&&t.find(".control-label").text("Steps")}t(".cocktail-ingredient").each(function(i){n(t(this),i)}),t(".cocktail-step").each(function(e){var a=t(this);n(a,e),i(a,e)})}var a=window.location.hash,o=(t("#add-edit-cocktail"),t("#view-nav"));o.find("a").click(function(){t(this).tab("show")}),a?o.find('a[href="'+a+'"]').tab("show"):o.find('a[href="#view-all"]').tab("show");var c=1;t("#add-ingredient").click(function(t){t.preventDefault(),n()}),t("#add-step").click(function(t){t.preventDefault(),i()}),e(),t(document).on("click","#add-edit-cocktail .glyphicon-remove",function(){var n=t(this).parents(".form-group");n.remove(),e()});var r=t(".tag-listing span.tag-name");r.click(function(){var n=t(this),i=n.attr("data-tag-slug"),e=t("#cocktail-table");n.hasClass("active")?(e.find("tbody tr").show(),n.removeClass("active")):(e.find("tbody tr").hide(),e.find("tr").filter(function(){return t(this).data("tag-slugs")?t(this).data("tag-slugs").split(" ").indexOf(i)>=0:!1}).show(),r.removeClass("active"),n.addClass("active"))}),t(".remove-cocktail").click(function(t){window.confirm("Are you sure you want to delete this cocktail? This cannot be undone.")||t.preventDefault()}),t('#auth-form[action="/register"]').submit(function(n){var i=t(this);i.find("#loginPassword").val()!==i.find("#confirmPassword").val()&&(n.preventDefault(),alert("Passwords do not match."))})});
},{}]},{},[1]);
