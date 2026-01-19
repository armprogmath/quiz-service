import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

export function RabbitRPCPublish(exchange: string, routingKey: string, timeout = 60000) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const amqpConnection: AmqpConnection = this.amqpConnection;

      if (!amqpConnection) {
        throw new Error('AmqpConnection is not available. Make sure it is injected.');
      }

      const payload = await originalMethod.apply(this, args);

      // const response = await amqpConnection.request({
      //   exchange,
      //   routingKey,
      //   payload,
      //   timeout,
      // });
      //
      // return response;
        return amqpConnection.request({
            exchange,
            routingKey,
            payload,
            timeout,
        });
    };

    return descriptor;
  };
}