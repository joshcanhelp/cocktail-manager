/* globals alert */

jQuery(document).ready(function ($) {
	"use strict";

	var hash = window.location.hash;

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

	// Create select options from a standard list
	var unitOptions = '<option val="">Select...</option>';
	$.each(cmAllUnits(), function (index, el) {
		unitOptions += '<option val="' + el.val + '">' + el.name + '</option>';
	});

	// Add another set of fields when clicking that button
	$('#add-ingredient').click(function (e) {
		e.preventDefault();
		renderIngredient();
	});

	$(document).on('click', '#add-edit-cocktail .glyphicon-remove', function (e) {
		$(this).parents('.form-group').remove();
		ingredientCount--;
	});

	// Set of fields to add an ingredient
	function renderIngredient() {
		var ingredientControl = $('#add-ingredient-control');
		var ingredientField = ingredientControl.prev('.form-group').clone();

		ingredientField.find('input').val('');
		ingredientField.find('option').removeAttr('selected');
		ingredientField.find('.col-sm-2:first').html('').append('<span class="glyphicon glyphicon-remove"/>');

		ingredientControl.before(ingredientField);
		ingredientCount++;
	}

	/*
	Step fields
	*/

	// Number of steps showing
	var stepCount = 1;

	// On button click, count the step and add a field
	$('#add-step').click(function (e) {
		e.preventDefault();
		renderStep();
	});

	// Add another step field
	function renderStep() {
		var stepControl = $('#add-step-control');
		var stepField = stepControl.prev('.form-group').clone();
		var stepLabel = stepField.find('.col-sm-2:first');

		stepField.find('textarea').text('');
		stepLabel.text('Step ' + ++stepCount);
		stepLabel.append('<br>');
		stepLabel.append('<span class="glyphicon glyphicon-remove"/>');

		stepControl.before(stepField);

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

	$('#cocktail-table .glyphicon-remove').click(function (e) {
		if (! window.confirm('Are you sure you want to delete this cocktail? This cannot be undone.')) {
			e.preventDefault();
		}
	});

});

// Standard units used on the drop-down when adding a cocktail
function cmAllUnits() {
	"use strict";

	return [
		{
			val: 'oz',
			name: 'Ounces'
		},
		{
			val: 'tbl',
			name: 'Tablespoons'
		},
		{
			val: 'tsp',
			name: 'Teaspoons'
		},
		{
			val: 'dash',
			name: 'Dashes'
		},
		{
			val: 'splash',
			name: 'Splashes'
		}
	];
}