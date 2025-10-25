import MyJSON from '../src/index';
import { jest } from '@jest/globals';

// Mock fetch and WebSocket for testing
global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue({
  ok: true,
  json: async () => ({}),
  status: 200,
  headers: new Headers({ 'Content-Type': 'application/json' }),
} as Response);
const mockWebSocket = {
  on: jest.fn(),
  close: jest.fn(),
};
jest.mock('ws', () => ({
  WebSocket: jest.fn(() => mockWebSocket),
}));

test('MyJSON client should connect and perform basic operations', async () => {
  // Mock successful responses
  (global.fetch as jest.Mock<() => Promise<Response>>)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ foo: 'initial' }),
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
    } as Response)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' }),
    } as Response);

  // Connect to the JSON server
  const myJSON = MyJSON.connect<{ foo: string }>(
    'http://localhost:3000/client/test',
    'THIS_IS_A_CLIENT_TOKEN',
  );

  // Read data
  const data = await myJSON.read();
  expect(data).toEqual({ foo: 'initial' });

  // Set up real-time updates
  const mockCallback = jest.fn();
  myJSON.onChange(mockCallback);

  // Update data
  data.foo = 'bar';
  await myJSON.write(data);
  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/client/test', {
    method: 'POST',
    headers: {
      'x-api-token': 'THIS_IS_A_CLIENT_TOKEN',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ foo: 'bar' }),
  });

  // Simulate WebSocket message
  const mockMessage = { data: { foo: 'updated' } };
  const messageHandler = (mockWebSocket.on as jest.Mock).mock.calls.find(
    (call) => call[0] === 'message',
    // eslint-disable-next-line no-unused-vars
  )![1] as (data: Buffer) => void;
  messageHandler(Buffer.from(JSON.stringify(mockMessage)));

  expect(mockCallback).toHaveBeenCalledWith({ foo: 'updated' });

  // Cleanup
  myJSON.close();
  expect(mockWebSocket.close).toHaveBeenCalled();
});
