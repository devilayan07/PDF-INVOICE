export function numberToWords(num) {
    if (num === 0) return "zero";

    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const thousands = ["", "thousand", "million", "billion"];

    function convertChunk(num) {
        let str = "";
        if (num >= 100) {
            str += ones[Math.floor(num / 100)] + " hundred ";
            num %= 100;
        }
        if (num >= 11 && num <= 19) {
            str += teens[num - 10] + " ";
            return str.trim();
        }
        if (num >= 10) {
            str += tens[Math.floor(num / 10)] + " ";
            num %= 10;
        }
        if (num > 0) {
            str += ones[num] + " ";
        }
        return str.trim();
    }

    let words = "";
    let chunkCount = 0;

    while (num > 0) {
        let chunk = num % 1000;
        if (chunk !== 0) {
            words = convertChunk(chunk) + " " + thousands[chunkCount] + " " + words;
        }
        num = Math.floor(num / 1000);
        chunkCount++;
    }

    return words.trim();
}
