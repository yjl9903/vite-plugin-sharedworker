export interface RpcPayload {
  id: string;
  name: string;
  args: any;
}

export type Payload =
  | { command: 'rpc'; data: RpcPayload }
  | { command: 'broadcast'; data: any }
  | { command: 'ping' };

export function makeRpcPayload(id: string, name: string, args: any): Payload {
  return {
    command: 'rpc',
    data: {
      id,
      name,
      args: args
    }
  };
}

export function makeBroadcastPayload(data: any): Payload {
  return {
    command: 'broadcast',
    data
  };
}

export function makePingPayload(): Payload {
  return {
    command: 'ping'
  };
}

export function parsePayload(payload: Payload): Payload | undefined {
  if (payload.command === 'ping') {
    return payload;
  } else if (payload.command === 'rpc') {
    return payload;
  } else {
    return undefined;
  }
}
