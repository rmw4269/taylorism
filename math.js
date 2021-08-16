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

/**
 * This counts the occurrences of each element and returns in a sealed array all that occurred the most. The output array has two additional properties to convey the result.
 * The `frequency` property is the most occurrences of any element.
 * The `sampleSize` property is the quantity of arguments/elements originally given.
 *
 * @return mathematical modes of the given values
 */
Math.mode = (...values) => {
	let frequencies = new Map();
	let freqMax;
	for (let value of values) {
		let frequency = (frequencies.get(value) ?? 0) + 1;
		if (freqMax == undefined || freqMax < frequency) {
			freqMax = frequency;
		}
		frequencies.set(value, frequency);
	}
	return Object.seal(
		Object.defineProperties(
			[...frequencies.entries()]
			.filter(entry => entry[1] == freqMax)
			.map(entry => entry[0]),
			{
				"frequency": {
					value: freqMax
				},
				"sampleSize": {
					value: values.length
				}
			}
		)
	);
};

{
	let logMap = new Map();
	/**
	 * This is a logarithm function with a flexible base.
	 * Bases are cached to increase performance.
	 *
	 * @param {number} value
	 * @param {number} base
	 *
	 * @return logarithm of `value` with the given base
	 *
	 * @see Math.log
	 * @see Math.log2
	 * @see Math.log10
	 */
	Math.logx = function logx(value, base) {
		switch (base) {
			case 10: return Math.log10(value);
			case 2: return Math.log2(value);
			case Math.E: return Math.log(value);
			default:
				if (!logMap.has(base)) {
					logMap.set(base, Math.log2(base));
				}
				return Math.log2(value) / logMap.get(base);
		}
	};
}
