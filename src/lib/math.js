import { isSafeInteger } from 'lodash';

function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

export function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    const days = (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
    return Math.floor(days);
}

export function formatPercentage(percentage) {
    percentage = (percentage * 100).toFixed(2);
    percentage = String(percentage).replace('.', ',');
    return `${percentage}%`;
}

export function formatPrice(price, opts = {}) {
    opts = Object.assign({
        format : null,
        prefix : ''
    }, opts);

    // Only round floats, or if we want fixed prices
    if (!isSafeInteger(price) || opts.format === 'fixed') {
        price = price.toFixed(2);
    }

    price = String(price);

    return opts.prefix + numberWithCommas(price);
}

export function lerp(start, end, value) {
    return start * (1 - value) + end * value;
}

// From < https://stackoverflow.com/a/2901298/152809 >
export function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
}

export function zeroPad(num, numZeros) {
    var n = Math.abs(num);
    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
    var zeroString = Math.pow(10,zeros).toString().substr(1);

    if( num < 0 ) {
        zeroString = '-' + zeroString;
    }

    return zeroString + n;
}