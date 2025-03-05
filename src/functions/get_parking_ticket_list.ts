import { LambdaFunction } from '../types';
import { dbScan, formatJSONResponse } from '../utils';

export const handler: LambdaFunction = async () => {
  try {
    const result = await dbScan();
    
    return formatJSONResponse({
      count: result.Items?.length || 0,
      parkings: result.Items || [],
    });
  } catch (error) {
    console.error('Error listing parking spots:', error);
    return formatJSONResponse({message: 'Could not list parking spots'},404);
  }
};