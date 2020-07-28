function sanitize(value = '') {
    return value.replace(/-/g, '');
}

module.exports = {
    sanitize
}