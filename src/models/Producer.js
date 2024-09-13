export class Producer {
    constructor(){
        this.name = "";
        this.description = "";
        this.logoSvg = "";
    }

    data() {
        return JSON.parse(JSON.stringify(this));
    }
}