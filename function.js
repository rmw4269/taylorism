"use strict";

// Really, nobody should be using these.
delete Function.prototype.caller;
delete Function.prototype.callee;
delete Function.prototype.arguments;


Object.defineProperty(Function.prototype, "once", { get: function once() {
	let called = false;
	let fun = (...args) => {
		if (!called) {
			called = true;
			return this(...args);
		}
	};
	return Object.defineProperties(fun, {
		[Symbol.functionTemplate]: { value: this, enumerable: true },
		name: { get: () => this.name, set: newName => this.name = newName },
		displayName: { get: () => this.displayName, set: newName => this.displayName = newName },
		length: { get: () => this.length },
		once: { value: fun }
	});
}, configurable: true });

Function.schedule = function schedule(fun, options = Object.create(null)) {
	let list = [fun];
	let canceller = Object.freeze(Object.defineProperty(function cancel() { canceller = undefined, "name"; }, "toString", {value: () => ""}));
	list.push(() => {
		if (canceller) {
			canceller();
			list.pop()();
		}
	});
	(options.frame) && (list.push(() => canceller && globalThis.requestAnimationFrame(list.pop())));
	(options.max !== undefined) && (options.min !== undefined) && (options.max -= options.min);
	(options.max !== undefined) && (list.push(() => canceller && globalThis.requestIdleCallback(list.pop(), {timeout: Math.round(options.max * 1000)})));
	(options.min !== undefined) && (list.push(() => canceller && globalThis.setTimeout(list.pop(), Math.round(options.min * 1000))));
	list.push(() => { list.pop()(); return canceller; });
	globalThis.funList = list;
	//console.dir(options);
	return console.now ? list.pop()() : list.pop();
};

Promise.schedule = function schedule(options = Object.create(null)) {
	return new Promise(resolve => Function.schedule(() => resolve, options));
};

Function.prototype.debounce = function debounce(timeout) {
	let start = timeout === 0 ? Object.is(timeout, -0) : timeout < 0;
	start && (timeout *= -1);
	console.assert(timeout >= 0 && Number.isFinite(timeout), `The timeout must be a finite number or zero, not ${timeout}.`);
	return Object.defineProperties((start
		? function me(...args) { // start
			if (me.timer === undefined) {
				me.template(...args);
			} else {
				globalThis.clearTimeout(me.timer);
			}
			me.timer = globalThis.setTimeout(me.timer = globalThis.setTimeout(me.innerCallback ?? Object.defineProperty(me, "innerCallback", {
				value: Object.freeze(() => { me.timer = undefined; })
			}).innerCallback, me.timeout), me.timeout);
		}
		: function me(...args) { // end
			(me.timer !== undefined) && globalThis.clearTimeout(me.timer);
			me.timer = globalThis.setTimeout(me.innerCallback ?? Object.defineProperty(me, "innerCallback", {
				value: Object.freeze(() => { me.timer = undefined; me.template(...args); })
			}).innerCallback, me.timeout);
		}
	), {
		[Symbol.functionTemplate]: { value: this, enumerable: true },
		timer: { value: undefined, writable: true, enumerable: true },
		timeout: { value: Math.round(timeout * 1000), enumerable: true },
		start: { value: start, enumerable: true},
		name: { value: this.name, writable: true },
		displayName: { value: this.displayName, writable: true },
		length: { value: this.length }
	});
};

Function.prototype.leechInput = function leechInput(fun, after) {
	if (!(fun instanceof Function)) {
		throw new TypeError("no leech (function) given to call");
	}
	if (after) {
		return (...args) => {
			let output = this(...args);
			fun(...args);
			return output;
		};
	} else {
		return (...args) => {
			fun(...args);
			return this(...args);
		};
	}
};

Function.prototype.intercept = function intercept(interceptor) {
	if (!(interceptor instanceof Function)) {
		throw new TypeError("no interceptor given");
	}
	let killed = false;
	return (...args) => {
		if (!killed) {
			let prevent = false;
			let newInput = undefined;
			let newOutput = undefined;
			let callRecord = Object.freeze({
				// arguments intended for the victim
				input: args,
				// leeched function
				victim: this,
				act: {
					// don’t call the victim
					prevent: () => {
						if (callRecord) {
							callRecord = undefined;
							prevent = true;
						}
					},
					// replace the input of the victim
					replaceInput: (...newArgs) => {
						if (callRecord) {
							callRecord = undefined;
							newInput = newArgs;
						}
					},
					// replace the output of the victim, without calling it
					replaceOutput: (...newReturn) => {
						if (callRecord) {
							callRecord = undefined;
							newOutput = newReturn;
						}
					},
					// prevent all future calls to both the victim and the leech
					kill: () => {
						killed = true;
					}
				}
			});

			interceptor(callRecord);

			if (prevent) {
				return;
			}
			if (newInput) {
				return this(...newInput);
			}
			if (newOutput) {
				return newOutput.pop();
			}
			return this(...args);
		}
	};
};

Function.prototype.leechOutput = function leechOutput(...outerArgs) { // TODO
	let fun = outerArgs.pop(); // function to call
	if (!(fun instanceof Function)) {
		throw new TypeError("no leech (function) given to call");
	}
	console.dir({this: this, fun});
	if (outerArgs.length === 0) {
		// return a function
		return (...innerArgs) => {
			let output = this(...innerArgs);
			fun(output);
			return output;
		};
	}
	// call leech immediately (single-use)
	let output = this(...outerArgs);
	fun(output);
	return output;
};

Function.prototype.delegateCaller = function delegateCaller(calling) {
	// use case: calling.fun(a), calling.fun(b), calling.fun(c), calling.fun(d)
	// replacement for: x => calling.fun(x)
	if (calling === undefined || calling === null) {
		throw new TypeError("no call");
	}
	return Object.defineProperties((...args) => {
		return this.call(calling, ...args);
	}, {
		name: { get: () => this.name, set: newName => this.name = newName },
		displayName: { get: () => this.displayName, set: newDisplayName => this.displayName = newDisplayName },
		length: { get: () => this.length },
		[Symbol.functionTemplate]: { value: this }
	});
};

Function.prototype.delegateInput = function delegateInput(...args) {
	// use case: a.fun(x), b.fun(x), c.fun(x), d.fun(x)
	// replacement for: x => x.fun(...args)
	return Object.defineProperties((calling) => {
		return this.call(calling, ...args);
	}, {
		name: { get: () => this.name, set: newName => this.name = newName },
		displayName: { get: () => this.displayName, set: newDisplayName => this.displayName = newDisplayName },
		length: { get: () => this.length },
		[Symbol.functionTemplate]: { value: this }
	});
};

Function.prototype.delegate = function delegate(options = {input: Array.empty ?? []}) {
	let del;
	if (options.caller !== undefined && options.caller !== null) {
		if (options.input) {
			throw new SyntaxError("Only the caller or the input can be static.");
		}
		let calling = options.caller;
		if (options.spread) {
			del = (argArray) => {
				return this.call(calling, ...argArray);
			}
		} else {
			del = (...args) => {
				return this.call(calling, ...args);
			}
		}
	} else {
		let args;
		if (options.input?.[Symbol.iterator]) {
			args = [...options.input];
		}
		if (args?.length) {
			del = (calling) => {
				return this.call(calling, ...args);
			}
		} else {
			del = (calling) => {
				return this.call(calling);
			}
		}
	}
	return Object.defineProperties(del, {
		name: {
			get: () => this.name,
			set: newName => this.name = newName
		}, displayName: {
			get: () => this.displayName,
			set: newDisplayName => this.displayName = newDisplayName
		}, length: { get: () => this.length },
		[Symbol.functionTemplate]: { value: this }
	});
};
