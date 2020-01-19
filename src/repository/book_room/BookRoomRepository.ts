import { getConnection } from "typeorm";
import { BookRoom } from "../../entity/BookRoom";
import { MomentDateTime } from "../../util/DateTimeUTC";

export class BookRoomRepository {

    private static instance: BookRoomRepository;

    private constructor() { }

    public static getInstance(): BookRoomRepository {
        if (!BookRoomRepository.instance) {
            BookRoomRepository.instance = new BookRoomRepository();
        }

        return BookRoomRepository.instance;
    }

    public getRandomBooking() {
        return getConnection().createQueryBuilder()
            .select('br.id')
            .from(BookRoom, 'br')
            .where('isCancelled = :isCancelled', {isCancelled: false})
            .getOne();
    }

    public getBookingById(bookingId: number) {
        return getConnection().manager.findOne(BookRoom, {id: bookingId, isCancelled: false});
    }

    public getBookingByRoomIdAndStartDate(roomID: number, startDate: number) {
        const _startDate = MomentDateTime.getDateUtc(startDate);
        return getConnection()
            .createQueryBuilder()
            .select('br.id')
            .from(BookRoom, 'br')
            .where('br.roomId = :roomId AND br.startDate <= :startDate AND br.endDate >= :startDate')
            .setParameters({ roomId: roomID, startDate: _startDate })
            .getOne();
    }

    public getBookingByTimes(startDate: Date, endDate: Date) {
        return getConnection().createQueryBuilder()
            .select('br')
            .from(BookRoom, 'br')
            .where(`br.startDate >= :startTime AND br.startDate <= :endTime
                OR br.startDate <= :startTime AND br.endDate >= :endTime
                OR br.endDate >= :startTime AND br.endDate <= :endTime
                OR br.startDate >= :startTime AND br.endDate <= :endTime
                AND isCancelled = :isCancelled`)
            .leftJoinAndMapOne('br.room', 'Room', 'r', 'r.id = br.roomId')
            .setParameters({ startTime: startDate, endTime: endDate, isCancelled: false })
            .getMany();
    }

    public getBookingByDays(startDate: Date) {
        return getConnection().createQueryBuilder()
            .select('br')
            .from(BookRoom, 'br')
            .where('br.startDate <= :startDay AND br.endDate >= :startDay AND isCancelled = :isCancelled')
            .leftJoinAndMapOne('br.room', 'Room', 'r', 'r.id = br.roomId')
            .setParameters({ startDay: startDate, isCancelled: false })
            .getMany();
    }

    public insertBookingRoom(booking: BookRoom) {
        return getConnection().manager.save(booking);
    }

    public async checkStartGreaterToday(bookingId: number) {
        const instance = BookRoomRepository.getInstance();
        try {
            const room = await instance.getBookingById(bookingId);
            const today = MomentDateTime.getCurrentDate();
            return today >= room.startDate
        } catch(err) {
            return false;
        }
    }

}