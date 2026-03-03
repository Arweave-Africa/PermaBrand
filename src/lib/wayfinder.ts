import {
  createWayfinderClient,
  RandomRoutingStrategy,
  StaticGatewaysProvider
} from '@ar.io/wayfinder-core';


const gatewaysProvider = new StaticGatewaysProvider({
  gateways: [
    //'https://arweave.net',
    'https://ardrive.net',
    'https://permagate.io',
    'https://turbo-gateway.com'
  ],
})

export const wayfinder = createWayfinderClient({
  routingStrategy: new RandomRoutingStrategy({
    gatewaysProvider
  })
});