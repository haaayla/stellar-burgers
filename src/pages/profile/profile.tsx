import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { ProfileUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: '******'
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormValue({
      name: user.name,
      email: user.email,
      password: '******'
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    formValue.password !== '******';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const data = {
      name: formValue.name,
      email: formValue.email,
      ...(formValue.password !== '******' && {
        password: formValue.password
      })
    };

    dispatch(updateUser(data));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    setFormValue({
      name: user.name,
      email: user.email,
      password: '******'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValue((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
