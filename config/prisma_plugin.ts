// prisma-plugin.ts
import { PrismaClient } from '@prisma/client';

import { FastifyInstance } from 'fastify';

async function prismaPlugin(fastify: FastifyInstance, options: Record<string, any>) {
  const prisma = new PrismaClient();

  // Decorate Fastify with Prisma
  fastify.decorate('prisma', prisma);

  // Cleanup on shutdown
  fastify.addHook('onClose', async (instance, done) => {
    await prisma.$disconnect();
    done();
  });
}

export default prismaPlugin;
