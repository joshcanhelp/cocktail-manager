/* globals alert */

jQuery(document).ready(function ($) {
	"use strict";

	/*
	Ingredient fields
	*/

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
	var stepCount = 1;

	// Add the first step
	renderStep();

	// On button click, count the step and add a field
	$('#add-step').click(function (e) {
		e.preventDefault();
		stepCount++;
		renderStep();
	});

	// Add another step field
	function renderStep() {
		$('#add-step-control').before(
			'<div class="form-group">' +
			'<label class="col-sm-2 control-label">Step ' + stepCount + '</label>' +
			'<div class="col-sm-10">' +
			'<textarea name="cocktailStep[]" class="form-control" rows="2"></textarea>' +
			'</div>'
		);
	}

});

// Standard units used on the dropdown when adding a cocktail
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