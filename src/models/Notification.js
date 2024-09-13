export const NOTIFICATION_CODE = {
    GENERAL: 0,
    ORDER_STATUS_CHANGED: 1,
}

export const NOTIFICATION_STATUS = {
    UNREAD: 0,
    READ: 1,
    DELETED: 2,
}

export class Notification {
    constructor(){
        this.id = "";
        this.code = NOTIFICATION_CODE.GENERAL;
        this.title = "";
        this.content = "";
        this.meta = "";
        this.status = NOTIFICATION_STATUS.UNREAD;
        this.displayIcon = "";
        this.created = Date.now();
        this.lastUpdate = Date.now();
    }

    data(){
        return JSON.parse(JSON.stringify(this));
    }
}