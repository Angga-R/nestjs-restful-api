import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {
    super({
      log: [
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  onModuleInit() {
    // Error
    this.$on('error', (e) => {
      this.logger.error(e);
    });

    // Warning
    this.$on('warn', (e) => {
      this.logger.error(e);
    });

    // Info
    this.$on('info', (e) => {
      this.logger.error(e);
    });

    // Query
    this.$on('query', (e) => {
      this.logger.error(e);
    });
  }
}
