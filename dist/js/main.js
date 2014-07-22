/* globals alert */

jQuery(document).ready(function ($) {
	"use strict";

	var hash = window.location.hash;
	var addCocktailForm = $('#add-edit-cocktail');

	/*
	Tabbed nav
	*/

	var viewNav = $('#view-nav');

	viewNav.find('a').click(function (e) {
		$(this).tab('show');
	});

	if (hash) {
		viewNav.find('a[href="' + hash + '"]').tab('show');
	} else{
		viewNav.find('a[href="#view-all"]').tab('show');
	}


	/*
	Ingredient fields
	*/

	// Number of steps showing
	var ingredientCount = 1;

	// Add another set of fields when clicking that button
	$('#add-ingredient').click(function (e) {
		e.preventDefault();
		renderIngredient();
	});

	// Set of fields to add an ingredient
	function renderIngredient() {
		var ingredientControl = $('#add-ingredient-control');
		var ingredientField = ingredientControl.prev('.form-group').clone();

		ingredientField.find('input').val('');
		ingredientField.find('option').prop('selected', false);
		ingredientField.find('option').removeAttr('selected');

		ingredientControl.before(ingredientField);
		ingredientCount++;
		decorateListItems();
		ingredientField.find('input:first').focus();
	}


	/*
	Step fields
	*/

	// On button click, count the step and add a field
	$('#add-step').click(function (e) {
		e.preventDefault();
		renderStep();
	});

	// Add another step field
	function renderStep() {
		var stepControl = $('#add-step-control');
		var stepField = stepControl.prev().find('.cocktail-step:last').clone();

		stepField.find('textarea').text('');
		stepField.find('.control-label').text('');

		$('#step-list').append(stepField);

		decorateListItems();

		stepField.find('textarea:first').focus();
	}

	/*
	Actions for both steps and ingredients
	*/

	decorateListItems();

	$(document).on('click', '#add-edit-cocktail .glyphicon-remove', function (e) {
		var removeTarget = $(this).parents('.form-group');
		removeTarget.remove();
		decorateListItems();
	});

	function decorateListItems () {

		var stepCount = 0;

		$('.cocktail-ingredient').each(function (index) {
			removeIt($(this), index);
		});

		$('.cocktail-step').each(function (index) {
			var el = $(this);
			removeIt(el, index);
			stepIt(el, index);
		});
		
		function removeIt(el, index) {
			var label = el.find('.col-sm-1');
			if (index > 0 && !label.find('.glyphicon-remove').length) {
				label.append('<span class="glyphicon glyphicon-remove text-right"/>');
			}
		}

		function stepIt(el, index) {
			if (index === 0) {
				el.find('.control-label').text('Steps');
			}
		}
	}

	/*
	Tag listing
	*/

	var tagFilter = $('.tag-listing span.tag-name');
	tagFilter.click(function (e) {

		// Cache selectors
		var thisTag = $(this);
		var tagSlug = thisTag.attr('data-tag-slug');
		var cocktailTable = $('#cocktail-table');

		// Toggle filters
		if (thisTag.hasClass('active')) {
			// Show all rows
			cocktailTable.find('tbody tr').show();

			// Turn this filter off
			thisTag.removeClass('active');
		} else {
			// Hide all rows then show filtered ones
			cocktailTable.find('tbody tr').hide();
			cocktailTable.find('tr[data-tag-slugs*=' + tagSlug + ']').show();

			// Assign active class to the active filter
			tagFilter.removeClass('active');
			thisTag.addClass('active');
		}
	});

	/*
	Edit controls
	*/

	$('.remove-cocktail').click(function (e) {
		if (! window.confirm('Are you sure you want to delete this cocktail? This cannot be undone.')) {
			e.preventDefault();
		}
	});

	/*
	Auth/login
	*/

	$('#auth-form[action="/register"]').submit(function (e) {
		if ($(this).find('#loginPassword').val() !== $(this).find('#confirmPassword').val()) {
			e.preventDefault();
			alert('Passwords do not match.');
		}
	});

});

