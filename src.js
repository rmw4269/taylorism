"use strict";

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
				type = tupleSize.__proto__[Symbol.toStringTag];
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
