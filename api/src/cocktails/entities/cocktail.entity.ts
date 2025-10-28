import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from '@mikro-orm/sqlite';
import { CocktailIngredient } from 'src/cocktails/entities/cocktail-ingredient.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Cocktail extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  category!: string;

  @Property({ type: 'text' })
  instructions!: string;

  @OneToMany(() => CocktailIngredient, (ci) => ci.cocktail, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  cocktailIngredients = new Collection<CocktailIngredient>(this); // ingredientId -> quantity
}
