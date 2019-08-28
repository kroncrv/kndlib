export function $(selector) {
    return document.querySelector(selector);
}

export function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}

export default function debounce(fn, wait) {
    let timer = null;

    return function() {
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn()
            timer = null;
        },wait);
    }
}