import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature(['Ingredient'])],
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
