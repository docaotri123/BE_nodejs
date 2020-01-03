import { getConnection } from "typeorm";
import { TempBookRoom } from "../entity/TempBookRoom";
import { BookRoomModel } from "../model/BookRoomModel";
import { GroupBooking } from "../entity/GroupBooking";
import { Room } from "../entity/Room";
import { MomentDateTime } from "../util/DateTimeUTC";
import { BOOKING } from "../constant";

export class TempBookingService {
    public static updateStatusTempBooking(tempId: number, status: string) {
        return getConnection().createQueryBuilder()
            .update(TempBookRoom)
            .set({ status: status })
            .where('id = :tempBookingId', { tempBookingId: tempId })
            .execute();
    }

    public static mapTempBookingEntity(resource: TempBookRoom , des: BookRoomModel, group: GroupBooking, room: Room) {
        resource.startDate = MomentDateTime.getDateUtc(des.startDate);
        resource.endDate = MomentDateTime.getDateUtc(des.endDate);
        resource.status = BOOKING.PENDING;
        resource.group = group;
        resource.room = room;
        return resource;
    }

    public static getStatusTempBookingByGroup(group: GroupBooking) {
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