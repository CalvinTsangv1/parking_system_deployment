import { dbGet, dbPut, formatJSONResponse } from "@utils/index";
import { v4 as uuidv4 } from 'uuid';
import { LambdaFunction } from '../types';

export const handler: LambdaFunction = async (event) => {
    try {
        const id = event.pathParameters.id;

        if(!id) {
            return formatJSONResponse({message: "id is required"}, 400);
        }

        const result = await dbGet(id);

        if(!result.Item) {
            return formatJSONResponse({message: "Parking Ticket not found"}, 404);
        }
        
        return formatJSONResponse({parkingTicket: result.Item});
    } catch (error) {
        return formatJSONResponse({message: error}, 500);
    }
};
       