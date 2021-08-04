"use strict";

/**
 * This multiplies all of the given arguments together, so you’d better hope that they’re numbers. With no arguments, one is returned;
 *
 * @param values values to multiply
 * @return product of all values
 */
Math.product = (...values) => values.reduce((a, b) => a * b, 1);
