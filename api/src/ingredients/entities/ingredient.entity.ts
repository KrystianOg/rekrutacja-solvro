import { Collection, Entity, OneToMany, Property } from '@mikro-orm/sqlite';
import { CocktailIngredient } from 'src/cocktails/entities/cocktail-ingredient.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Ingredient extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  isAlcoholic: boolean;

  @OneToMany(() => CocktailIngredient, (ci) => ci.ingredient)
  cocktailIngredients = new Collection<CocktailIngredient>(this);

  @Property()
  imageUrl: string;
}
