import setAttrObj from '../utils/setAttr';

const CURSOR_PARAMS = {
    "animation__click":"property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150",
    "animation__fusing":"property: fusing; startEvents: fusing; from: 1 1 1; to: 0.1 0.1 0.1; dur: 1500",
    "event-set__1":"_event: mouseenter; color: springgreen",
    "event-set__2":"_event: mouseleave; color: black",
    "raycaster": "objects: .clickable"
};

export const Cursor = {
    raycaster: null,
    initCursor(){
        var a = document.createElement("a-cursor");
        setAttrObj(a, CURSOR_PARAMS);
        this.raycaster = a.components.raycaster;
        return a;
    },
    refreshRaycaster(){
        this.raycaster.refreshObjects();
    }
};