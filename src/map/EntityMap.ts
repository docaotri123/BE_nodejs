import { UserModel } from "../model/UserModel";
import { User } from "../entity/User";
import { Md5 } from "ts-md5";
import { HASH_STR, ROLE, BOOKING } from "../constant";
import { RoleRepository } from "../repository/RoleRepository";
import { Role } from "../entity/Role";
import { TempBookRoom } from "../entity/TempBookRoom";
import { BookRoomModel } from "../model/BookRoomModel";
import { GroupBooking } from "../entity/GroupBooking";
import { Room } from "../entity/Room";
import { MomentDateTime } from "../util/DateTimeUTC";

export class EntityMap{

    public static async mapUser(user: User , userModel: UserModel, role: Role) {
        user.email = userModel.email;
        user.phone = userModel.phone;
        user.password = Md5.hashStr(userModel.password + HASH_STR);
        user.role = role;
    }

    public static mapTempBookingEntity(resource: TempBookRoom , des: BookRoomModel, group: GroupBooking, room: Room) {
        resource.startDate = MomentDateTime.getDateUtc(des.startDate);
        resource.endDate = MomentDateTime.getDateUtc(des.endDate);
        resource.status = BOOKING.PENDING;
        resource.group = group;
        resource.room = room;
    }

    public static mapGroupEntity(resource: GroupBooking , des: BookRoomModel, user: User) {
        resource.startDate = MomentDateTime.getDateUtc(des.startDate);
        resource.endDate = MomentDateTime.getDateUtc(des.endDate);
        resource.user = user;
    }

}