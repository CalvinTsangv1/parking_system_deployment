export interface APIGatewayResponse {
    statusCode: number;
    headers?: {
      [header: string]: string;
    };
    body: string;
}  

export type LambdaFunction = (
    event: any,
    context: any
  ) => Promise<APIGatewayResponse>;