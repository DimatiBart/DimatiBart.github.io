import createMenuItem from "./MenuItem";

export const Menu = {
    menu: null,
    items: null,
    createMenu(urlObj, itemCallback){
        this.items = urlObj.map((element, index) => createMenuItem(element, index, itemCallback));
        this.menu = document.createElement("a-entity");
        var centerPosX = 0 - ((this.items.length-1) * 1.2) / 2;
        var position = [centerPosX, 1.5, -2];
        this.menu.setAttribute("position", position.join(" "));
        this.menu.id = "menu";
        this.items.forEach((elem) => {
            this.menu.appendChild(elem);
        });
        return this.menu;
    },
    hideMenu(){
        this.menu.setAttribute("visible", "false");
        this.items.forEach((elem)=>{
            elem.classList.remove("clickable");
        })
    },
    showMenu(){
        this.menu.setAttribute("visible", "true");
        this.items.forEach((elem)=>{
            elem.classList.add("clickable");
        })
    }
};