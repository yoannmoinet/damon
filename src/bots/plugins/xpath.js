function parseSelector (params) {
    var selectorType = ['selector', 'visible', 'hidden'];
    if (params.xpath !== true) {
        return params;
    }
    selectorType.forEach(function (selector) {
        if (params[selector] !== undefined) {
            params[selector] = {
                type: 'xpath',
                path: params[selector]
            };
        }
    });
    return params;
}

module.exports = function () {
    return {
        parse: parseSelector
    };
};
