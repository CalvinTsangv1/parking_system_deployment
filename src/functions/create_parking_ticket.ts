import { dbPut, formatJSONResponse } from "../utils/index";
import { v4 as uuidv4 } from 'uuid';
import { LambdaFunction, ParkingTicket } from '../types';

export const handler: LambdaFunction = async (event) => {
    try {

        const requestBody = JSON.parse(event.body);
        console.log("requestBody", requestBody);

        if (!requestBody?.license_plate) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required fields" }),
            };
        }
        const timestamp = new Date().getTime();
        const parkingTicket: ParkingTicket = {
            id: uuidv4(),
            license_plate: requestBody.license_plate,
            startTime: requestBody.startTime,
            endTime: requestBody.endTime
        }

        if (requestBody?.vehicleDetails) {
            parkingTicket.vehicleDetails = requestBody.vehicleDetails;
        }

        await dbPut(parkingTicket);
        console.log("parkingTicket", parkingTicket);
        return formatJSONResponse({message: "Parking Ticket is created successfully", item: parkingTicket}, 201);
    } catch (error) {
        return formatJSONResponse({message: "Could not create parking ticket"}, 400);
    }
};
       

