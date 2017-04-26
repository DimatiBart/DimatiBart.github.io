//set attribute as plain object rather than lots of settAttribute calls
export default (elem, attrObj) => {
    if (!(elem instanceof Node)) {
        throw new Error("Not a Node element");
    }
    for (var i in attrObj) {
        elem.setAttribute(i, attrObj[i]);
    }
}