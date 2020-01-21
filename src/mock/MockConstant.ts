import { BookRoom } from "../entity/BookRoom"
import { MomentDateTime } from "../util/DateTimeUTC"
import { GroupBookingRepository } from "../repository/v1.0/GroupRepository"
import { RoomService } from "../service/v1.0/RoomService"

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

export const token_not_author = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMWVjNGVlZTktZTg1OC00MWZkLTg1MmMtODIwMmVjNzgzZTU5IiwiZW1haWwiOiJ0cmlkb0BnbWFpbC5jb20iLCJwaG9uZSI6IjA5NjU1Mjg2MjEifSwiaWF0IjoxNTc4ODg2NDE5LCJleHAiOjE1Nzg5NzI4MTl9.IuKGupA3OQakbMfee2aq_7m7btAL9aoJp7dvk1KLXiY`;
export const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMWQzZjhkOWEtZDBkOC00YjQwLWJkNTktNjQ2NGM2NmI0ZTYzIiwiZW1haWwiOiJ0cmlhZG1pbkBnbWFpbC5jb20iLCJwaG9uZSI6IjAxNjg4OTQ2MjUyIn0sImlhdCI6MTU3ODg4MzIzMCwiZXhwIjoxNTc4OTY5NjMwfQ.mL0z9o07szU5zXTSOQyfi8-vBVlcXmxuDL_HdN8MFm4`;

