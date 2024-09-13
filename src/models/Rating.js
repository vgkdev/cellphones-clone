// link: https://docs.google.com/spreadsheets/d/156ZhsFAVjD1MJdgOQWm85diH0xkKXNfwqd60cg1U1Bo/edit#gid=1617646420
export class Rating{
    constructor(){
        this.id = "";
        this.userId = "";
        this.productId = "";
        this.score = 0;
        this.isStaffRating = false;
        this.lastUpdate = Date.now();
        this.date = Date.now();
    }

    data(){
        let res =  JSON.parse(JSON.stringify(this));
        res.score = Number(res.score);
        return res;
    }
}