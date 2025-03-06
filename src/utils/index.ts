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
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(response),
    }
}

export const dbPut = async (item: Record<string,any>): Promise<DynamoDB.DocumentClient.PutItemOutput> => {
    const params = {
        TableName: PARKING_TABLE,
        Item: item,
    };

    return dynamoDB.put(params).promise();
}

export const dbGet = async (id: string): Promise<DynamoDB.DocumentClient.GetItemOutput> => {
    const params = {
        TableName: PARKING_TABLE,
        Key: {id},
        FilterExpression: "isDeleted = :isDeletedValue",
        ExpressionAttributeValues: { ":isDeleted": false }
    };

    return dynamoDB.get(params).promise();
}

export const dbUpdate = async (
    id: string, 
    updateExpression: string,
    expressionAttributeValues: Record<string, any>,
    expressionAttributeNames?: Record<string, string>
  ): Promise<any> => {
    const params = {
      TableName: PARKING_TABLE,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
    };
    
    return dynamoDB.update(params).promise();
};

export const dbDelete = async (id: string): Promise<any> => {

  const timestamp = new Date().toISOString();
  const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': timestamp,
  };
    const params = {
      TableName: PARKING_TABLE,
      Key: { id },
      UpdateExpression: 'SET isDeleted = TRUE, updatedAt = :updatedAt',
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };
    
    return dynamoDB.update(params).promise();
  };
  
  export const dbScan = async (): Promise<any> => {
    const params = {
      TableName: PARKING_TABLE,
      FilterExpression: "isDeleted = :isDeletedValue",
      ExpressionAttributeValues: { ":isDeleted": false }
    };
    
    return dynamoDB.scan(params).promise();
  };