import { Module } from '@nestjs/common';
import { CocktailsService } from './cocktails.service';
import { CocktailsController } from './cocktails.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature(['Cocktail'])],
  controllers: [CocktailsController],
  providers: [CocktailsService],
})
export class CocktailsModule {}
