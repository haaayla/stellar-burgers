import { TConstructorIngredient, TIngredient } from '@utils-types';

import reducer, {
  addIngredient,
  clearConstructor,
  initialState,
  moveIngredient,
  removeIngredient,
  setBun
} from './constructorSlice';

const bun: TIngredient = {
  _id: '1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_large: '',
  image_mobile: ''
};

const ingredient1: TConstructorIngredient = {
  id: '1',
  _id: '2',
  name: 'Соус традиционный галактический',
  type: 'sauce',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_large: '',
  image_mobile: ''
};

const ingredient2: TConstructorIngredient = {
  id: '2',
  _id: '3',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_large: '',
  image_mobile: ''
};

const ingredient3: TConstructorIngredient = {
  id: '3',
  _id: '4',
  name: 'Плоды Фалленианского дерева',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('constructorSlice', () => {
  test('должен вернуть initialState при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('должен установить булку в конструктор', () => {
    const action = setBun(bun);

    const state = reducer(initialState, action);

    expect(state.constructorItems.bun).toEqual(bun);
    expect(state.constructorItems.ingredients).toEqual([]);
  });

  test('должен добавить ингредиент в конструктор', () => {
    const action = addIngredient(ingredient1);

    const state = reducer(initialState, action);

    expect(state.constructorItems.ingredients).toEqual([ingredient1]);
    expect(state.constructorItems.bun).toBeNull();
  });

  test('должен удалить ингредиент по индексу', () => {
    const stateWithIngredients = {
      constructorItems: {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      }
    };

    const action = removeIngredient(0);

    const state = reducer(stateWithIngredients, action);

    expect(state.constructorItems.ingredients).toEqual([ingredient2]);
    expect(state.constructorItems.bun).toBeNull();
  });

  test('должен изменить порядок ингредиентов', () => {
    const stateWithIngredients = {
      constructorItems: {
        bun: null,
        ingredients: [ingredient1, ingredient2, ingredient3]
      }
    };

    const action = moveIngredient({ from: 0, to: 2 });

    const state = reducer(stateWithIngredients, action);

    expect(state.constructorItems.ingredients).toEqual([
      ingredient2,
      ingredient3,
      ingredient1
    ]);
  });

  test('должен очистить конструктор', () => {
    const stateWithItems = {
      constructorItems: {
        bun,
        ingredients: [ingredient1, ingredient2]
      }
    };

    const action = clearConstructor();

    const state = reducer(stateWithItems, action);

    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toEqual([]);
  });
});
