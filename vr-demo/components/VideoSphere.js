import setAttrObj from '../utils/setAttr';

const VIDEOSPHERE_PARAMS = {
    visible: "false"
};

export const VideoSphere = {
    video: null,
    videosphere: null,
    init(app, urlObj, videoEndCallback) {
        this.video = document.getElementById('video');
        this.videosphere = document.createElement("a-videosphere");
        setAttrObj(this.videosphere, VIDEOSPHERE_PARAMS);
        app.appendChild(this.videosphere);
        this.addVideoAssets(urlObj, videoEndCallback);
    },
    hideVideo() {
        this.video.pause();
        this.video.currentTime = 0;
        this.videosphere.setAttribute("visible", "false");
        this.videosphere.setAttribute("src", "");
    },
    showVideo(id) {
        this.video = document.getElementById(id);
        this.videosphere.setAttribute("src", `#${id}`);
        this.videosphere.setAttribute("visible", "true");
        //this.videosphere.components.material.material.map.image.play();
        this.video.play();
    },
    addVideoAssets(urlObj, onEndCallback){
        let assets = document.getElementById("assets");
        urlObj.forEach((elem, index)=> {
            let video = document.createElement("video");
            video.id = `video_${index}`;
            video.setAttribute('src', elem.videoURL);
            video.addEventListener("ended", onEndCallback);
            assets.appendChild(video);
        })
    }
};