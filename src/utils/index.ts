import { DynamoDB } from "aws-sdk";
import { APIGatewayResponse } from "../types";

const dynamoDB = new DynamoDB.DocumentClient();
const PARKING_TABLE = process.env.PARKING_TABLE || 'PARKING_TABLE';


export const formatJSONResponse = (response: Record<string,  unknown>, statusCode = 200): APIGatewayResponse => {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
    }
}

