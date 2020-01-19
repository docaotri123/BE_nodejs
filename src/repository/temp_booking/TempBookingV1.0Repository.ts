import { getConnection } from "typeorm";
import { TempBookRoom } from "../../entity/TempBookRoom";
import { GroupBooking } from "../../entity/GroupBooking";

export class TempBookingRepository {

    private static instance: TempBookingRepository;

    private constructor() { }

    public static getInstance(): TempBookingRepository {
        if (!TempBookingRepository.instance) {
            TempBookingRepository.instance = new TempBookingRepository();
        }

        return TempBookingRepository.instance;
    }

    public updateStatusTempBooking(tempId: number, status: string) {
        return getConnection()
            .createQueryBuilder()
            .update(TempBookRoom)
            .set({ status: status })
            .where('id = :tempBookingId', { tempBookingId: tempId })
            .execute();
    }

    public getStatusTempBookingByGroup(group: GroupBooking) {
        return getConnection()
            .createQueryBuilder()
            .select('t')
            .addSelect('room.id')
            .from(TempBookRoom, 't')
            .where('t.groupId = :groupId', { groupId: group.id })
            .leftJoin('t.room', 'room')
            .getMany();
    }

}