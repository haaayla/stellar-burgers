import { FC, useEffect } from 'react';

import { ProfileOrdersUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { getProfileOrders } from '../../services/slices/profileOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileOrders());
  }, [dispatch]);

  const { orders } = useSelector((state) => state.profileOrders);

  return <ProfileOrdersUI orders={orders} />;
};
