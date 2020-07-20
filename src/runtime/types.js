function Color(value) {
    // validate valid color
    this.val = value;
}

Color.prototype.toString = function() {
    return this.val;
}