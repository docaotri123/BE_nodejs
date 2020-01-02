import { GroupBooking } from "../entity/GroupBooking";
import { getConnection } from "typeorm";

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
}