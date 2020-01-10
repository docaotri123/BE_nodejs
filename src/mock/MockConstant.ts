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

export const token_not_author = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMWVjNGVlZTktZTg1OC00MWZkLTg1MmMtODIwMmVjNzgzZTU5IiwiZW1haWwiOiJ0cmlkb0BnbWFpbC5jb20iLCJwaG9uZSI6IjA5NjU1Mjg2MjEifSwiaWF0IjoxNTc4NjQ5NjEzLCJleHAiOjE1Nzg3MzYwMTN9.wEnRWS4Tp_7fxFq1IVeScp7NVZ4ypNHlKUGXkx50uVU`;
export const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMWQzZjhkOWEtZDBkOC00YjQwLWJkNTktNjQ2NGM2NmI0ZTYzIiwiZW1haWwiOiJ0cmlhZG1pbkBnbWFpbC5jb20iLCJwaG9uZSI6IjAxNjg4OTQ2MjUyIn0sImlhdCI6MTU3ODY0OTM3MiwiZXhwIjoxNTc4NzM1NzcyfQ.VxVLU35btJC2mocA7-ck5ZCXLnHtSX3QhQ3Fq7oHlcM`;

