"use strict";

/**
 * This multiplies all of the given arguments together, so you’d better hope that they’re numbers. With no arguments, one is returned;
 *
 * @param values values to multiply
 * @return product of all values
 */
Math.product = (...values) => values.reduce((a, b) => a * b, 1);

/**
 * @return mathematical mean of the given values
 */
Math.mean = (...values) => Math.sum(...values) / values.length;

/**
 * @return mathematical median of the given values
 */
Math.median = (...values) => values.length === 0
	? undefined
	: (values.sort((a, b) => a - b).length % 2 === 0)
		? (values[a.length / 2 - 1] + values[a.length / 2]) / 2
		: values[(values.length - 1) / 2];

