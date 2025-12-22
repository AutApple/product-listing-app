export function capitalizeString(str: string) {
    return str.split(' ').map((v) => v.charAt(0).toUpperCase() + v.slice(1)).join(' ');
}