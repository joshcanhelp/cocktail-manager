/* globals alert */

jQuery(document).ready(function ($) {
	"use strict";

	/*
	Tabbed nav
	*/

	var viewNav = $('#view-nav');

	viewNav.find('a').click(function (e) {
		$(this).tab('show');
	});

	var hash = window.location.hash;
	if (hash) {
		viewNav.find('a[href="' + hash + '"]').tab('show');
	} else{
		viewNav.find('a[href="#view-all"]').tab('show');
	}

	/*
	Ingredient fields
	*/

	// Number of steps showing
	var ingredientCount = 0;

	// Create select options from a standard list
	var unitOptions = '<option val="">Select...</option>';
	$.each(cmAllUnits(), function (index, el) {
		unitOptions += '<option val="' + el.val + '">' + el.name + '</option>';
	});

	// Add the first set of fields
	renderIngredient();

	// Add another set of fields when clicking that button
	$('#add-ingredient').click(function (e) {
		e.preventDefault();
		renderIngredient();
	});

	// Set of fields to add an ingredient
	function renderIngredient() {
		ingredientCount++;
		$('#add-ingredient-control').before(
			'<div class="form-group">' +
			'<div class="col-sm-2">&nbsp;</div>' +
			'<div class="col-sm-2">' +
			'<input name="cocktailPartsAmount[]" type="text" class="form-control">' +
			'</div>' +
			'<div class="col-sm-2">' +
			'<select name="cocktailPartsUnit[]" class="form-control">' +
			unitOptions +
			'</select>' +
			'</div>' +
			'<div class="col-sm-6">' +
			'<input name="cocktailPartsName[]" type="text" class="form-control">' +
			'</div>' +
			'</div>'
		);
	}

	/*
	Step fields
	*/

	// Number of steps showing
	var stepCount = 0;

	// Add the first step
	renderStep();

	// On button click, count the step and add a field
	$('#add-step').click(function (e) {
		e.preventDefault();
		renderStep();
	});

	// Add another step field
	function renderStep() {
		stepCount++;
		$('#add-step-control').before(
			'<div class="form-group">' +
			'<label class="col-sm-2 control-label">Step ' + stepCount + '</label>' +
			'<div class="col-sm-10">' +
			'<textarea name="cocktailStep[]" class="form-control" rows="2"></textarea>' +
			'</div>'
		);
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