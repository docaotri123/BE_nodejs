import { GroupBooking } from "../../entity/GroupBooking";
import { getConnection } from "typeorm";
import { MomentDateTime } from "../../util/DateTimeUTC";

export class GroupBookingRepository {
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