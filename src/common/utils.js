const mongoose = require("mongoose");

const roundTo4 = (num) => {
    const roundedValue = Math.round((Number(num) + Number.EPSILON) * 10000) / 10000;
    return mongoose.Types.Decimal128.fromString(roundedValue.toString());
};

module.exports = { roundTo4 };
