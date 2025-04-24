import { Module } from '@nestjs/common';
import { ConsoleModule } from '@squareboat/nest-console';

import { ChessService } from './modules/chess/chess.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConsoleModule],
  controllers: [AppController],
  providers: [AppService, ChessService],
})
export class AppModule {}
