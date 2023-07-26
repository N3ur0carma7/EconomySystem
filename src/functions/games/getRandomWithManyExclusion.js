module.exports = (originalArray, arrayOfIndexesToExclude) => {
    var rand = null;

    while (rand === null || rand === arrayOfIndexesToExclude.includes(rand)) {
        rand = Math.round(Math.random() * (originalArray.length - 1));
    }

    return rand;
}