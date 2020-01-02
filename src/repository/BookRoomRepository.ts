import { MomentDateTime } from "../util/DateTimeUTC";
import { getConnection } from "typeorm";
import { BookRoom } from "../entity/BookRoom";

export class BookRoomRepository {
    public static getBookingByRoomIdAndStartDate(roomID: number, startDate: number) {
        const _startDate = MomentDateTime.getDateUtc(startDate);    
        return getConnection()
        .createQueryBuilder()
        .select('br.id')
        .from(BookRoom, 'br')
        .where('br.startDate <= :startDate AND br.endDate >= :startDate AND br.roomId = :roomId')
        .setParameters({ roomId: roomID, startDate: _startDate })
        .getOne();
    }

    public static insertBookingRoom(booking: BookRoom) {
        return getConnection().manager.save(booking);
    }

}