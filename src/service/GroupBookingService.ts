import { GroupBooking } from "../entity/GroupBooking";
import { getConnection } from "typeorm";
import { MomentDateTime } from "../util/DateTimeUTC";
import { BookRoomModel } from "../model/BookRoomModel";
import { User } from "../entity/User";

export class GroupBookingService {
    public static getGroupById(groupId: number) {
        return getConnection().manager.findOne(GroupBooking, { id: groupId });
    }

    public static getRandomGroup() {
        return getConnection()
            .createQueryBuilder()
            .select('br.id')
            .from(GroupBooking, 'br')
            .getOne();
    }

    public static mapGroupEntity(resource: GroupBooking , des: BookRoomModel, user: User) {
        resource.startDate = MomentDateTime.getDateUtc(des.startDate);
        resource.endDate = MomentDateTime.getDateUtc(des.endDate);
        resource.user = user;
        return resource;
    }

    public static getGroupBookingByUser(userId: string) {
        const today = MomentDateTime.getCurrentDate();

        return getConnection()
            .createQueryBuilder()
            .select('g.id')
            .from(GroupBooking, 'g')
            .leftJoin('g.user', 'u')
            .where('u.id = :id AND g.endDate >= :today', { id: userId, today: today })
            .getMany();
    }
}