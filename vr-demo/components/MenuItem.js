import setAttrObj from '../utils/setAttr';

const MENU_ATTRS = {
    "height": "1",
    "width": "1",
    "event-set__1":"_event: mousedown; scale: 1 1 1",
    "event-set__2":"_event: mouseup; scale: 1.2 1.2 1",
    "event-set__3":"_event: mouseenter; scale: 1.2 1.2 1",
    "event-set__4":"_event: mouseleave; scale: 1 1 1"
};

export default (url, index, callback) => {
    const padding = 1.2;
    var posX = index * padding;
    var menuItem = document.createElement('a-plane');
    setAttrObj(menuItem, MENU_ATTRS);
    menuItem.classList.add("clickable");
    menuItem.setAttribute('position', `${posX} 0 0`);
    menuItem.setAttribute('material', `shader: flat; src: ${url.textureURL}; side: double`);
    menuItem.addEventListener("click", ()=> callback(`video_${index}`));
    return menuItem;
}