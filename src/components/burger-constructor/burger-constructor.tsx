import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';

import { createOrder, clearOrderModal } from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { constructorItems } = useSelector((state) => state.burgerConstructor);

  const { orderRequest, orderModalData } = useSelector((state) => state.order);

  const { user } = useSelector((state) => state.user);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!user) {
      navigate('/login', {
        state: {
          from: location
        }
      });

      return;
    }

    dispatch(createOrder());
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
