import { BookRoomModel } from "./BookRoomModel";

export class BookingQueueModel {
    dataAPI: BookRoomModel[];
    groupId: number;
    tempBookingIds: number[];

    constructor(dataAPI: BookRoomModel[], groupId: number, tempBookingIds: number[]) {
        this.dataAPI = dataAPI;
        this.groupId = groupId;
        this.tempBookingIds = tempBookingIds;
    }
}
