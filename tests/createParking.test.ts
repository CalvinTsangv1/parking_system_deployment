// __tests__/createParking.test.ts
import { handler } from '../src/functions/create_parking_ticket';
import { dbPut, formatJSONResponse } from '../src/utils';

jest.mock('../src/utils', () => ({
  dbPut: jest.fn(),
  // Mock formatJSONResponse to simulate the real function
  formatJSONResponse: (body: unknown, statusCode = 200) => ({
    statusCode,
    body: JSON.stringify(body),
  }),
}));

describe('createParking Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if required fields are missing', async () => {
    // Missing license_plate, startTime, endTime
    const event = {
      body: JSON.stringify({}),
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Missing required fields',
    });
    // dbPut should NOT be called
    expect(dbPut).not.toHaveBeenCalled();
  });

  it('should create a parking spot successfully', async () => {
    // Mock dbPut to succeed
    (dbPut as jest.Mock).mockResolvedValue({});

    const mockBody = {
      license_plate: 'ABC123',
      startTime: 123456789,
      endTime: 123456999,
      vehicleDetails: {
        make: 'Toyota',
        model: 'Corolla',
        year: 2021,
      }
    };

    const event = {
      body: JSON.stringify(mockBody),
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    const parsedBody = JSON.parse(result.body);
    expect(parsedBody.message).toBe('Parking Ticket is created successfully');
    expect(parsedBody.item).toEqual(expect.objectContaining({
      license_plate: 'ABC123',
      startTime: 123456789,
      endTime: 123456999,
      vehicleDetails: {
        make: 'Toyota',
        model: 'Corolla',
        year: 2021,
      },
    }));

    expect(parsedBody.item.id).toBeDefined();
    expect(dbPut).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if an error is thrown during creation', async () => {

    (dbPut as jest.Mock).mockRejectedValue(new Error('DB put error'));

    const mockBody = {
      license_plate: 'XYZ789',
      startTime: 987654321,
      endTime: 987654999,
    };

    const event = {
      body: JSON.stringify(mockBody),
    } as any;

    const result = await handler(event);

    expect(dbPut).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual(expect.objectContaining({
      message: 'Could not create parking ticket',
    }));
  });
});
