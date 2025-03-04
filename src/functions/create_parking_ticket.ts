import { dbPut, formatJSONResponse } from "@utils/index";
import { v4 as uuidv4 } from 'uuid';
import { LambdaFunction } from '../types';

interface ParkingTicket {
    id: string;
    license_plate: string;
    startTime: number;
    endTime: number;
    vehicleDetails?: {
        make: string;
        model: string;
        year: number;
    };
    created_at: number;
    updated_at: number;
}

export const handler: LambdaFunction = async (event) => {
    try {

        const requestBody = JSON.parse(event.body);

        if (!requestBody.license_plate) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "license_plate is required" }),
            };
        }

        const timestamp = new Date().getTime();
        const parkingTicket: ParkingTicket = {
            id: uuidv4(),
            license_plate: requestBody.license_plate,
            startTime: timestamp,
            endTime: timestamp + requestBody.duration,
            created_at: timestamp,
            updated_at: timestamp,
        }

        if (requestBody.vehicleDetails) {
            parkingTicket.vehicleDetails = requestBody.vehicleDetails;
        }
        
        await dbPut(parkingTicket);

        return formatJSONResponse({message: "Parking Ticket is created successfully", parkingTicket}, 201);
    } catch (error) {
        return formatJSONResponse({message: error}, 500);
    }
};
       

