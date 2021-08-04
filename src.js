"use strict";

/**
 * @alias NodeList_convenience
 *
 * This code applies many convenience functions to NodeList instances, copying them from the Array prototype, if they exist. These functions will simply convert a NodeList to an Array via iteration, before calling the normal Array function.
 * @see Array.prototype.every
 * @see Array.prototype.filter
 * @see Array.prototype.find
 * @see Array.prototype.findIndex
 * @see Array.prototype.flatMap
 * @see Array.prototype.includes
 * @see Array.prototype.indexOf
 * @see Array.prototype.lastIndexOf
 * @see Array.prototype.map
 * @see Array.prototype.reduce
 * @see Array.prototype.reduceRight
 * @see Array.prototype.reverse
 * @see Array.prototype.slice
 * @see Array.prototype.some
 */
["every", "filter", "find", "findIndex", "flatMap", "includes", "indexOf", "lastIndexOf", "map", "reduce", "reduceRight", "reverse", "slice", "some"].forEach(name => Array.prototype[name] instanceof Function && Nodelist.prototype[name] === undefined && (NodeList.prototype[name] = function(...args) { return [...this][name](...args)}));

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
 * This filters out duplicate elements from the array, returning a new array of just the unique values.
 * If the comparator argument is given, it is used to determine uniqueness. The comparator is passed in two elements; only a truthy output indicates that the elements are identical.
 * If no comparator is given, then the same uniqueness logic used by Set is applied.
 *
 * @param {Function} comparator equality indicator for elements
 */
Array.prototype.unique = function(comparator) { return comparator instanceof Function ? this.reduce((uniques, current) => {
	(uniques.length > 0 && uniques.some(unique => comparator(unique, current))) || uniques.push(current);
	return uniques;
}, []) : [...new Set(this)]};

/**
 * This generates and returns an array of linearly sequential numbers.
 *
 * @param {?Number} length length of array to return
 * @param {?Number} start first element of the array
 * @param {?Number} spacing increment amount from one element to the next
 * @param {?Function} map mapping function to apply to the output as in Array.prototype.map
 */
Array.range = (length = 1, start = 0, spacing = 1, map = undefined) => Array.from((function*(){
	while (length-- > 0) {
		yield start;
		start += spacing;
	}
})(), map);

/**
 * This returns a copy of the array but with the elements grouped into tuples (arrays).
 * This can operate in three modes. By default, this operates in strict mode; a TypeError is thrown if the array length is not divisible by the tuple size. In exclusive mode, any elements that do not completely fill a tuple is excluded from the output array. In inclusive mode, all elements are returned, but the last tuple may be missing elements.
 *
 * @param {Number} tupleSize target length of the inner arrays
 * @param {String} mode rounding mode
 */
Array.prototype.tuplify = function(tupleSize = 2, mode = "strict") {
	if (!Number.isInteger(tupleSize)) {
		let type = (typeof tupleSize).toLowerCase();
		if (type == "object") {
			try {
				type = Object.getPrototypeOf(tupleSize)[Symbol.toStringTag];
			} catch {}
		}
		throw new TypeError(`Tuple size given is ${type.matches(/^(?:a|e|i|o|t)/i) ? "an" : "a"} ${type}, not an integer.`);
	}
	let outSize, out, i, j;
	if (this.length % tupleSize == 0) {
		outSize = this.length / tupleSize;
	} else if (mode == "strict") {
		if (this.length % tupleSize != 0) {
			throw new RangeError(`An array of length ${this.length} cannot be evenly split into groups of ${tupleSize}.`);
		}
		outSize = this.length / tupleSize;
	} else if (mode == "exclusive") {
		outSize = Math.floor(this.length / tupleSize);
	} else if (mode == "inclusive") {
		outSize = Math.ceil(this.length / tupleSize);
	} else {
		throw new TypeError("The mode given is not one of the valid modes (“strict,” “exclusive,” “inclusive”).");
	}
	out = new Array(outSize);
	for (i = 0; i < outSize; i++) {
		out[i] = this.slice(i * tupleSize, (i + 1) * tupleSize);
	}
	return out;
};

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
 * This adds all of the given arguments together, so you’d better hope that they’re numbers. With no arguments, zero is returned;
 *
 * @param values values to add
 * @return sum of all values
 */
Math.sum = (...values) => values.reduce((a, b) => a + b, 0);
