// __tests__/deleteParkingSpot.test.ts

import { handler } from '../src/functions/delete_parking_ticket';
import { dbGet, dbDelete, formatJSONResponse } from '../src/utils';

jest.mock('../src/utils', () => ({
  dbGet: jest.fn(),
  dbDelete: jest.fn(),
  // Mock formatJSONResponse to simulate how your real function behaves:
  formatJSONResponse: (body: unknown, statusCode = 200) => ({
    statusCode,
    body: JSON.stringify(body),
  }),
}));

describe('deleteParkingSpot Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no pathParameters.id is provided', async () => {
    const event = {pathParameters: {}};

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Parking spot ID is required',
    });
  });

  it('should return 404 if the item does not exist in DynamoDB', async () => {
    // Mock dbGet to return an empty Item
    (dbGet as jest.Mock).mockResolvedValue({ Item: undefined });

    const event = {
      pathParameters: { id: 'nonexistent-id' },
    } as any;

    const result = await handler(event);

    expect(dbGet).toHaveBeenCalledWith('nonexistent-id');
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Parking spot not found',
    });
  });

  it('should delete the item and return success if the item is found', async () => {
    // Mock dbGet to return a valid item
    (dbGet as jest.Mock).mockResolvedValue({ Item: { id: 'existing-id' } });
    // Mock dbDelete to succeed
    (dbDelete as jest.Mock).mockResolvedValue({});

    const event = {
      pathParameters: { id: 'existing-id' },
    } as any;

    const result = await handler(event);

    expect(dbGet).toHaveBeenCalledWith('existing-id');
    expect(dbDelete).toHaveBeenCalledWith('existing-id');
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Parking spot deleted successfully',
    });
  });

  it('should return 400 if an error is thrown during deletion', async () => {
    // Mock dbGet to return a valid item
    (dbGet as jest.Mock).mockResolvedValue({ Item: { id: 'error-id' } });
    // Mock dbDelete to throw an error
    (dbDelete as jest.Mock).mockRejectedValue(new Error('DB delete error'));

    const event = {
      pathParameters: { id: 'error-id' },
    } as any;

    const result = await handler(event);

    expect(dbGet).toHaveBeenCalledWith('error-id');
    expect(dbDelete).toHaveBeenCalledWith('error-id');
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Could not delete parking spot',
    });
  });
});
