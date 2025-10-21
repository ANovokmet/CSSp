export function sanitize(value = '') {
    return value.replace(/-/g, '');
}
