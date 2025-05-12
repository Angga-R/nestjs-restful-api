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
          level: 'query',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
      ],
    });
  }

  onModuleInit() {
    // Query
    this.$on('query', (e) => {
      this.logger.error(e);
    });

    // Info
    this.$on('info', (e) => {
      this.logger.error(e);
    });

    // Warning
    this.$on('warn', (e) => {
      this.logger.error(e);
    });

    // Error
    this.$on('error', (e) => {
      this.logger.error(e);
    });
  }
}
