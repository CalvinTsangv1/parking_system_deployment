import { dbGet, dbPut, dbUpdate, formatJSONResponse } from "@utils/index";
import { LambdaFunction, ParkingTicket } from '../types';

export const handler: LambdaFunction = async (event) => {
    try {
        const id = event.pathParameters.id;

        if(!id) {
            return formatJSONResponse({message: "id is required"}, 400);
        }

        const existingItem = await dbGet(id);

        if(!existingItem.Item) {
            return formatJSONResponse({message: "Parking Ticket not found"}, 404);
        }

        const requestBody = JSON.parse(event.body) as ParkingTicket;
        const timestamp = new Date().toISOString();
    
        // Build update expression and attribute values
        let updateExpression = 'SET updatedAt = :updatedAt';
        const expressionAttributeValues: Record<string, any> = {
            ':updatedAt': timestamp,
        };

        // Add fields that need to be updated
        if (requestBody.license_plate !== undefined) {
            updateExpression += ', license_plate = :license_plate';
            expressionAttributeValues[':license_plate'] = requestBody.license_plate;
        }

        if (requestBody.vehicleDetails?.make !== undefined) {
            updateExpression += ', vehicleDetails.make = :vehicleDetails';
            expressionAttributeValues[':vehicleDetails'] = requestBody.vehicleDetails.make;
        }

        if (requestBody.vehicleDetails?.model !== undefined) {
            updateExpression += ', vehicleDetails.model = :model';
            expressionAttributeValues[':model'] = requestBody.vehicleDetails.model;
        }

        if (requestBody.vehicleDetails?.year !== undefined) {
            updateExpression += ', vehicleDetails.year = :year';
            expressionAttributeValues[':year'] = requestBody.vehicleDetails.year;
        }

        const result = await dbUpdate(id, updateExpression, expressionAttributeValues);

        return formatJSONResponse({message: "Parking Ticket Information updated successfully", parkingTicket: result.Attributes});
    } catch (error) {
        return formatJSONResponse({message: error}, 500);
    }
};
       