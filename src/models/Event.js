export const DISPLAY_PARTS = {
    PRIMARY: "primaryDisplayPart",
    SECONDARY: "secondaryDisplayPart",
    TERTIARY: "tertiaryDisplayPart",
};

export class Event
{
    constructor()
    {
        this.id = "";
        this.name = "";
        this.title = "";
        this.description = "";
        this.displayImageUrl = "";
        this.primaryDisplayPart = "";
        this.secondaryDisplayPart = "";
        this.tertiaryDisplayPart = "";
        this.imageUrls = [];
        this.isExclusive = false;
        this.applicableProducts = [];
        this.discountRate = 0;
        this.maxDiscount = 0;
        this.startTime = "";
        this.endTime = "";
        this.createAt = Date.now();
        this.lastUpdate = Date.now();
    }

    data()
    {
        return JSON.parse(JSON.stringify(this));
    }
}