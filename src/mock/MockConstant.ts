import { BookRoom } from "../entity/BookRoom"
import { MomentDateTime } from "../util/DateTimeUTC"
import { GroupBookingService } from "../service/GroupBookingService"
import { RoomService } from "../service/RoomService"

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

export const bookRoom = {
	startDate: 1577685600000,
    endDate: 1577728800000,
    userId: "88a42875-67e9-488f-983c-a7d902db2cbe",
    roomID: 1
}

export const token_not_author = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiODhhNDI4NzUtNjdlOS00ODhmLTk4M2MtYTdkOTAyZGIyY2JlIiwiZW1haWwiOiJkY3Rlc3QxOTk3QGdtYWlsLmNvbSIsInJvbGUiOnsiaWQiOjMsInJvbGUiOiJ2aXAifX0sImlhdCI6MTU3ODAyMzY3NSwiZXhwIjoxNTc4MTEwMDc1fQ.7N5GPwVyU8H2HPinOsDtX3wtoZ6AFsmZ-Luz5vNNyfQ`;
export const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiODhhNDI4NzUtNjdlOS00ODhmLTk4M2MtYTdkOTAyZGIyY2JlIiwiZW1haWwiOiJkY3Rlc3QxOTk3QGdtYWlsLmNvbSIsInJvbGUiOnsiaWQiOjIsInJvbGUiOiJjdXN0b21lciJ9fSwiaWF0IjoxNTc4MDI1MzQ3LCJleHAiOjE1NzgxMTE3NDd9.8vvucM0xCxGdZibs6a5vDQf6h2qhNlKCCfHUdLEJ86Q`;

