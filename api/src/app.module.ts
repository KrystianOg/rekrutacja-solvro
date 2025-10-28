import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CocktailsModule } from './cocktails/cocktails.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { appConfig } from './app.config';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../mikro-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(config),
    CocktailsModule,
    IngredientsModule,
  ],
})
export class AppModule {}
