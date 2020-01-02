import { BookRoom } from "../entity/BookRoom"
import { MomentDateTime } from "../util/DateTimeUTC"
import { GroupBookingRepository } from "../repository/GroupBookingRepository"
import { RoomRepository } from "../repository/RoomRepository"

export const arrDate = [{
    startDate: 1,
    endDate: 3
}, {
    startDate: 3,
    endDate: 4
}, {
    startDate: 2,
    endDate: 5
}]

export const arrOne = [
    {
        id: 1
    },
    {
        id: 2
    },
    {
        id: 3
    }
]

export const arrTwo = [
    {
        id: 1
    },
    null,
    {
        id: 3
    }
]

export const arrThree = [
    {
        id: 1
    },
    {
        id: 2
    },
    {
        id: 3
    }
]

export const itemQueue = [
    {
		startDate: 1577768400000,
    	endDate: 1577890800000,
    	userId: "88a42875-67e9-488f-983c-a7d902db2cbe",
    	roomID: 1
	},
]

export const initBooking = async () => {
}