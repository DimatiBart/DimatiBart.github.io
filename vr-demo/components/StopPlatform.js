import setAttrObj from '../utils/setAttr';

const attributes = {
    radius: "1",
    rotation: "-90 0 0",
    position: "0 0.01 0",
    color: "#d73a49"
};

export default (callback)=> {
    var platform = document.createElement("a-circle");
    setAttrObj(platform, attributes);
    platform.classList.add("clickable");
    platform.addEventListener("click", callback);
    return platform;
}