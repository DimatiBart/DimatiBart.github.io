import 'aframe';
import 'aframe-animation-component';
import 'aframe-event-set-component';

import {Menu} from './components/Menu';
import {Cursor} from './components/Cursor.js'
import {MENU_CONFIG} from './configs/menu.config';
import {VideoSphere} from './components/VideoSphere';
import StopPlatform from './components/StopPlatform';
import {Fade} from './components/Fade';

const STATE = {
    isVideoStarted: false,
};


var MenuItemClickHandler = (id) => {
    console.log(id);
    document.getElementById('floor').setAttribute("visible", "false");
    document.getElementById('sky').setAttribute("visible", "false");
    Menu.hideMenu();
    VideoSphere.showVideo(id);
    Cursor.refreshRaycaster();
    Fade.startFullAnimation();
    STATE.isVideoStarted = true;
};

var stopVideoCallback = () => {
    if (!STATE.isVideoStarted) {
        return;
    }
    document.getElementById('floor').setAttribute("visible", "true");
    document.getElementById('sky').setAttribute("visible", "true");
    Menu.showMenu();
    VideoSphere.hideVideo();
    Cursor.refreshRaycaster();
    Fade.startFullAnimation();
    STATE.isVideoStarted = false;
};

const app = document.getElementById("app");
Fade.init();
app.appendChild(Menu.createMenu(MENU_CONFIG, MenuItemClickHandler));
app.appendChild(StopPlatform(stopVideoCallback));
VideoSphere.init(app, MENU_CONFIG, stopVideoCallback);
document.querySelector("a-camera").appendChild(Cursor.initCursor());