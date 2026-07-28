import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  clearCurrentOrder,
  getOrderByNumber
} from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();

  const { number } = useParams();

  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);

  const currentOrder = useSelector((state) => state.order.currentOrder);
  const error = useSelector((state) => state.order.error);

  const orderData =
    [...feedOrders, ...profileOrders].find(
      (order) => order.number === Number(number)
    ) || currentOrder;

  // Загружаем заказ только если его нет в store
  useEffect(() => {
    if (!number || orderData) return;

    dispatch(getOrderByNumber(Number(number)));
  }, [dispatch, number, orderData]);

  // Очищаем currentOrder при размонтировании
  useEffect(
    () => () => {
      dispatch(clearCurrentOrder());
    },
    [dispatch]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (error) {
    return <p className='text text_type_main-medium mt-10'>{error}</p>;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
