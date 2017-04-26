import '../styles/Fade.less';

export const Fade = {
    fader: null,
    init() {
        this.fader = document.createElement("div");
        this.fader.id = "fader";
        document.body.appendChild(this.fader);
    },
    startFullAnimation(){
        this.fader.classList.add("full-fading");
        setTimeout(this._fullAnimationHandler.bind(this), 500)
    },
    _fullAnimationHandler(){
        this.fader.classList.remove("full-fading");
    }
};