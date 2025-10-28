import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CocktailsModule } from './cocktails/cocktails.module';
import { IngredientsModule } from './ingredients/ingredients.module';

@Module({
  imports: [CocktailsModule, IngredientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
