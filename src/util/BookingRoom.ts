import { BookRoomModel } from "../model/BookRoomModel";
import { Room } from "../entity/Room";
import { User } from "../entity/User";
import { getConnection } from "typeorm";
import { MomentDateTime } from "./DateTimeUTC";
import { BookRoom } from "../entity/BookRoom";
import { BOOKING } from "../constant";
import { BookingQueueModel } from "../model/BookingQueue";
import { TempBookRoom } from "../entity/TempBookRoom";

export const handleBookingRoom = async (itemQueue: BookingQueueModel) => {
    const bookRoomModel = itemQueue.dataAPI;
    const tempBookingId = itemQueue.tempBookingId;        
    const isBooked = await checkBooking(bookRoomModel);
    const statusBooking = isBooked ? BOOKING.BOOKED : BOOKING.SUCCESS;

    // find tempBooking and update
    await getConnection().createQueryBuilder()
    .update(TempBookRoom)
    .set({ status: statusBooking })
    .where('id = :tempBookingId', { tempBookingId: tempBookingId})
    .execute();


    if(statusBooking === BOOKING.SUCCESS) {
        const room = await getConnection().manager.findOne(Room, {id: bookRoomModel.roomID});
        const user = await getConnection().manager.findOne(User, { id: bookRoomModel.userId });
        const bookRoom = new BookRoom();
        bookRoom.startDate = MomentDateTime.getDateUtc(bookRoomModel.startDate);
        bookRoom.endDate = MomentDateTime.getDateUtc(bookRoomModel.endDate);
        bookRoom.user = user;
        bookRoom.room = room;

        await getConnection().manager.save(bookRoom);
    }

}

const checkBooking = async (BRModel: BookRoomModel) => {
    
    const startDate = MomentDateTime.getDateUtc(BRModel.startDate);    
    const booking = getConnection().createQueryBuilder()
    .select('br.id')
    .from(BookRoom, 'br')
    .where('br.startDate <= :startDate AND br.endDate >= :startDate AND br.roomId = :roomId')
    .setParameters({ roomId: BRModel.roomID, startDate: startDate })
    .getOne();

    return booking;
}