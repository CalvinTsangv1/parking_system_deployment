import { LambdaFunction } from '../types';
import { dbDelete, dbGet, formatJSONResponse } from '../utils';

export const handler: LambdaFunction = async (event) => {
  try {
    const id = event.pathParameters?.id;
    
    if (!id) {
      return formatJSONResponse({message: 'Parking spot ID is required'}, 400);
    }
    
    // Check if parking spot exists
    const existingItem = await dbGet(id);
    
    if (!existingItem.Item) {
      return formatJSONResponse({message: 'Parking spot not found'}, 404);
    }
    
    // Delete from DynamoDB
    await dbDelete(id);
    
    return formatJSONResponse({
      message: 'Parking spot deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting parking spot:', error);
    return formatJSONResponse({message: 'Could not delete parking spot'}, 400);
  }
};