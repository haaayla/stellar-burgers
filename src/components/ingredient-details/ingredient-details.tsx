import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui/preloader';

import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams();

  const { ingredients, isLoading } = useSelector((state) => state.ingredients);

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <p className='text text_type_main-medium mt-10'>Ингредиент не найден</p>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
