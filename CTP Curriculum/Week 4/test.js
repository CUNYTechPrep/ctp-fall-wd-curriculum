var x = undefined;
var useX = function (initial) {
    if (x === undefined) {
        x = initial;
    }
    return [x, function (newValue) { return (x = newValue); }];
};
var component = function () {
    var _a = useX(10), value = _a[0], setValue = _a[1];
    return "<div>".concat(value, "</div>");
};
console.log(component());
