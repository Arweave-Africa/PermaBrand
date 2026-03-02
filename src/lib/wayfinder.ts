import {
  createWayfinderClient,
  FastestPingRoutingStrategy,
  NetworkGatewaysProvider,
} from '@ar.io/wayfinder-core';
import { ARIO } from '@ar.io/sdk';

export const wayfinder = createWayfinderClient({
  routingStrategy: new FastestPingRoutingStrategy({
    gatewaysProvider: new NetworkGatewaysProvider({
      ario: ARIO.mainnet(),
      sortBy: 'operatorStake',
      sortOrder: 'desc',
      limit: 10,
    }),
  }),
});