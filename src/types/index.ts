export interface APIGatewayResponse {
    statusCode: number;
    headers: {
      [header: string]: string;
    };
    body: string;
}  