import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { CreateCocktailDto } from './create-cocktail.dto';
import { validate } from 'class-validator';

describe('CreateCocktailDto', () => {
  it('should validate nested ingredients', async () => {
    const plain = {
      name: 'Mojito',
      category: 'Classic',
      ingredients: [
        { ingredientId: 1, quantity: '50ml' },
        { ingredientId: 'invalid', quantity: '10ml' },
      ],
    };

    const dto = plainToInstance(CreateCocktailDto, plain);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('ingredients');
  });
});
