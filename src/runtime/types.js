function Color(value) {
    // validate valid color
    this.val = value;
}

Color.prototype.toString = function() {
    return this.val;
}

function loop_guard(timeout) {
	const start = Date.now();
	return () => {
		if (Date.now() - start > timeout) {
			throw new Error(`Infinite loop detected`);
		}
	};
}

module.exports = {
    loop_guard
}