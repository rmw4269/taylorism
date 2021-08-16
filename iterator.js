"use strict";

/**
 * This script searches through all objects and classes accessible from the global scope,
 * including prototypes and prototype chains. For every iterable object found that isn’t the
 * array prototype, new wrapper functions are added that allow these objects to be treated as
 * arrays, and a getter property is added that returns an array version of the object. The
 * wrapper functions are fromed from a subset of the functions on the array prototype and are
 * all prefixed with “arr” while maintaining camel case naming. The getter property, which
 * performs the same function as the spread operator (but instead syntactically after the
 * object) can be accessed with the key `Symbol.toArray.`
 *
 * @example <caption>iterating across codepoints in a string</caption>
 * let str = "Hello, World!";
 * let strArray = str[Symbol.toArray];
 * let vowels = strArray
 * 	.map(codepoint => codepoint.toLowerCase())
 * 	.filter(codepoint => "aeiouy".arrIncludes(codepoint))
 * 	.join("");
 *
 * function CaesarCipher(message, shift = 0) {
 * 	return String.fromCodePoint(...message.arrMap(codepoint =>
 * 		codepoint.codePointAt(0) + shift)
 * 	);
 * }
 *
 * @example <caption>finding an element when CSS can’t</caption>
 * document.querySelectorAll("button[type='submit']").arrFind(button => button.innerText)
 *
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
 * @see Array.prototype.unique
 */

let arrayFunctions =
	[
		"every",
		"filter",
		"find",
		"findIndex",
		"flatMap",
		"includes",
		"indexOf",
		"lastIndexOf",
		"map",
		"reduce",
		"reduceRight",
		"reverse",
		"slice",
		"some",
		"unique"
	]
	.flatMap(name => Array.prototype[name] instanceof Function ? Object.defineProperties(function(...args) { return [...this][name](...args); }, {
		name: { value: `arr${name.slice(0, 1).toUpperCase()}${name.slice(1)}` },
		comment: { value: `generated from Array.prototype.${name}` },
		template: { value: Array.prototype[name] },
		length: { value: (() => { try { return Array.prototype[name].length; } catch { return undefined; }})() }
	}) : Array.empty ?? []);

Object.defineProperty(Symbol, "toArray", { value: Symbol("toArray") });
let toArray = Object.defineProperty(function toArray() {
	return [...this];
}, "symbol", { value: Symbol.toArray });

for (let o of (
	Object.entries(Object.getOwnPropertyDescriptors(typeof globalThis !== "undefined" ? globalThis : window))
		.flatMap(([name, {value}]) => {
			if (value instanceof Object) {
				if (value.prototype instanceof Object) {
					return [value, value.prototype];
				}
				return [value];
			}
			return Array.empty ?? [];
		})
		.filter(o => Symbol.iterator in o)
		.flatMap(child => {
			if (child => Symbol.iterator in child) {
				let parent = child;
				do {
					child = parent;
					parent = Object.getPrototypeOf(child);
				} while (parent instanceof Object && Symbol.iterator in parent);
				console.assert(child instanceof Object, "null parent");
				return [child];
			}
			return Array.empty ?? [];
		})
)) {
	if (o === Array.prototype) { continue; }
	for (let fun of arrayFunctions) {
		if (!o.hasOwnProperty(fun.name)) {
			Object.defineProperty(o, fun.name, { value: fun });
		}
	}
	(Symbol.toArray in o) || Object.defineProperty(o, Symbol.toArray, { get: toArray, enumerable: true });
}
