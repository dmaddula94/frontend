/**
 * @return {string}
 */
export default function Temp({ value }) {
    try {
        const number = Number.parseFloat(value);
        return `${number.toFixed(0)}`;
    } catch (e) {
        return '';
    }
}
