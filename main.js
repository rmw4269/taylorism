"use strict";

/**
 * @name innerNodeDepth
 * @memberof Node.prototype
 * @kind member
 * @type number
 * @readonly
 *
 * how many layers of child nodes this node has
 *
 * @see Node.prototype.childNodes
 */

window.Node && Object.defineProperty(Node.prototype, "innerNodeDepth", {get: function innerNodeDepth() {
	if (this.childNodes.length === 0) { return 0; }
	let list = [this];
	let depth = 0;
	while ((list = list.flatMap(child => [...child.childNodes])).length > 0 && ++depth !== 0);
	list = undefined;
	return --depth;
}});

/**
 * @name innerElementDepth
 * @memberof Element.prototype
 * @kind member
 * @type number
 * @readonly
 *
 * how many layers of child elements this element has
 *
 * @see Element.prototype.children
 * @see Element.prototype.childElementCount
 */

window.Element && Object.defineProperty(Element.prototype, "innerElementDepth", {get: function innerElementDepth() {
	if (this.childElementCount === 0) { return 0; }
	let list = [this];
	let depth = 0;
	while ((list = list.flatMap(child => [...child.children])).length > 0 && ++depth !== 0);
	list = undefined;
	return --depth;
}});

/**
 * @name empty
 * @memberof Array
 * @kind member
 * @type Array
 *
 * empty immutable array
 */
Object.defineProperty(Array, "empty", {
	value: Object.freeze([]),
	enumerable: true
});

/**
 * @name null
 * @memberof Object
 * @kind member
 * @type Object
 *
 * new empty object
 */
Object.defineProperty(Object, "null", {
	get: () => Object.create(null),
	enumerable: false
});

/**
 * This applies the replace method in sequence, using each argument as an array of arguments to call the method.
 *
 * @param {...String} replacements arguments for the replace method
 */
String.prototype.replaceFor = function(...replacements) {
	return replacements.reduce((str, replacement) => str.replace(...replacement), this);
};

/**
 * This applies the replaceAll method in sequence, using each argument as an array of arguments to call the method.
 *
 * @param {...String} replacements arguments for the replaceAll method
 */
String.prototype.replaceAllFor = function(...replacements) {
	return replacements.reduce((str, replacement) => str.replaceAll(...replacement), this);
};

/**
 * This clamps the input number to be inclusively within the min and max values.
 *
 * @param {?Number} min minimum value
 * @param {?Number} max maximum value
 */
Math.clamp = (value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) => Math.min(Math.max(min, value), max);

/**
 * This adds all of the given arguments together, so you???d better hope that they???re numbers. With no arguments, zero is returned;
 *
 * @param values values to add
 * @return sum of all values
 */
Math.sum = (...values) => values.reduce((a, b) => a + b, 0);
