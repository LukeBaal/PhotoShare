import { AuthActions, GetUserAction, LogoutAction } from './index';

import { auth } from '../firebase';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { User } from 'firebase';
import { Dispatch } from 'react';
import { AuthState } from '../reducers/auth';

// LOGOUT
export const logout = (): ThunkAction<
  Promise<void>,
  AuthState,
  {},
  LogoutAction
> => async (
  dispatch: ThunkDispatch<AuthState, {}, LogoutAction>
): Promise<void> => {
  await auth.signOut();
  dispatch({
    type: 'LOGOUT_USER'
  });
};

// GET USER
export const getUser = (user: User | null): any => (
  dispatch: Dispatch<GetUserAction>
): void => {
  if (user) {
    dispatch({
      type: 'GET_USER',
      user
    });
  }
};
