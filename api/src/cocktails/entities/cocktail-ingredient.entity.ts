import { Entity, ManyToOne, Property } from '@mikro-orm/sqlite';
import { Cocktail } from './cocktail.entity';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class CocktailIngredient extends BaseEntity {
  @ManyToOne(() => Cocktail)
  cocktail!: Cocktail;

  @ManyToOne(() => Ingredient)
  ingredient!: Ingredient;

  @Property()
  amount!: string;

  @Property({ nullable: true })
  unit?: string;

  @Property({ nullable: true })
  orderIndex?: number;

  constructor(cocktail: Cocktail, ingredient: Ingredient, amount: string) {
    super();
    this.cocktail = cocktail;
    this.ingredient = ingredient;
    this.amount = amount;
  }
}
