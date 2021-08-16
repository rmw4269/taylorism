"use strict";

/**
 * @name empty
 * @memberof Array
 * @kind member
 * @type Array
 *
 * empty immutable array
 */

/**
 * @name protoParent
 * @memberof Object.prototype
 * @kind member
 * @type Object
 * @readonly
 *
 * getter for the parent prototype of the given object
 *
 * @see Object.getPrototypeOf
 */

/**
 * @name protoChain
 * @memberof Object.prototype
 * @kind member
 * @type Array
 * @readonly
 *
 * getter for the prototype chain of the object, excluding this object
 *
 * @see Object.prototype.protoParent
 */

/**
 * @name protoFind
 * @memberof Object.prototype
 * @kind member
 * @type function
 *
 * This walks up prototype chain of the object, excluding itself, and returns the first object
 * that satisfies the given predicate.
 *
 * @param {function} predicate function to check each object
 *
 * @return {Object|undefined} first object to satisfy the predicate, or undefined
 *
 * @see Object.prototype.protoParent
 */

Object.defineProperties(Object.prototype, {
	protoParent: { get: function getPrototypeOf() {
		return Object.getPrototypeOf(this);
	}},
	protoChain: { get: function prototypeChain() {
		let chain = [];
		let proto = this;
		do {
			chain.push(proto);
			proto = chain.at(-1).protoParent;
		} while (proto !== null);
		return chain;
	}},
	protoFind: { value: function findPrototype(predicate) {
		let obj = this;
		do {
			obj = obj.protoParent;
		} while (obj !== null && !predicate(obj));
		return predicate(obj) ? obj : undefined;
	}}
});
