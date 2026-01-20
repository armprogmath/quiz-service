import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

export function RabbitPublish(exchange: string, routingKey: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      //// Access `AmqpConnection` from the current instance (i.e., 'this') context
      const amqpConnection: AmqpConnection = this.amqpConnection;

      if (!amqpConnection) {
        throw new Error('AmqpConnection is not available. Ensure it is injected in the constructor.');
      }

      // Call the original method
      const message = await originalMethod.apply(this, args);

      // Publish the message to the exchange
      await amqpConnection.publish(exchange, routingKey, message);
    };

    return descriptor;
  };
}
