import { forwardRef, useMemo } from 'react';

import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { TIngredientsCategoryProps } from './type';

import { useSelector } from '../../services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { constructorItems } = useSelector((state) => state.burgerConstructor);

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    constructorItems.ingredients.forEach((ingredient) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });

    if (constructorItems.bun) {
      counters[constructorItems.bun._id] = 2;
    }

    return counters;
  }, [constructorItems]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
