import {Action} from "@ngrx/store";

export const SET_AUTH = '[Auth] Set Authenticated';
export const SET_UNAUTH = '[Auth] Set Unautheticated';

export class SetAuth implements Action{
  readonly type = SET_AUTH;
}

export class SetUnauth implements Action{
  readonly type = SET_UNAUTH;
}

export type AuthActions = SetAuth | SetUnauth;
