import { getConnection } from "typeorm";
import { TempBookRoom } from "../entity/TempBookRoom";

export class TempBookingRepository {
    public static updateStatusTempBooking(tempId: number, status: string) {
        return getConnection().createQueryBuilder()
            .update(TempBookRoom)
            .set({ status: status })
            .where('id = :tempBookingId', { tempBookingId: tempId })
            .execute();
    }
}