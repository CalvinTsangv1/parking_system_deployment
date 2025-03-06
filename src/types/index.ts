export interface APIGatewayResponse {
    statusCode: number;
    headers?: {
      [header: string]: string;
    };
    body: string;
}  

export type LambdaFunction = (
    event: any,
    context?: any
  ) => Promise<APIGatewayResponse>;

  export interface ParkingTicket {
    id: string;
    license_plate: string;
    startTime: number;
    endTime: number;
    vehicleDetails?: {
        make: string;
        model: string;
        year: number;
    };
    isDeleted?: boolean;
    created_at?: number;
    updated_at?: number;
}