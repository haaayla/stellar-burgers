import { TIngredient } from '@utils-types';

import reducer, { getIngredients, initialState } from './ingredientsSlice';

describe('ingredientsSlice', () => {
  test('должен вернуть initialState при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('должен установить isLoading=true при pending', () => {
    const action = getIngredients.pending('', undefined);

    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  test('должен сохранить ингредиенты при fulfilled', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 200,
        price: 100,
        image: 'image.png',
        image_large: 'image_large.png',
        image_mobile: 'image_mobile.png'
      }
    ];

    const action = getIngredients.fulfilled(ingredients, '', undefined);

    const state = reducer(initialState, action);

    expect(state.ingredients).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('должен сохранить ошибку при rejected', () => {
    const error = new Error('Ошибка загрузки ингредиентов');

    const action = getIngredients.rejected(error, '', undefined);

    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
    expect(state.ingredients).toEqual([]);
  });
});
