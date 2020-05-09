import { Dispatch } from "redux";
import InvolveApiService, { PayMethodResponse, Base, CalculateQuery, CalculateResponse, CreateBidQuery, CreateBidResponse } from "../services/involve-api-service";

const involveApiService = new InvolveApiService()

export const FETCH_PAYMETHODS_REQUEST = 'FETCH_PAYMETHODS_REQUEST'
export const FETCH_PAYMETHODS_SUCCESS = 'FETCH_PAYMETHODS_SUCCESS'
export const CHANGE_METHOD = 'CHANGE_METHOD'
export const FETCH_VALUE_REQUEST = 'FETCH_VALUE_REQUEST'
export const FETCH_VALUE_SUCCESS = 'FETCH_VALUE_SUCCESS'
export const CHANGE_AMOUNT = 'CHANGE_AMOUNT'
export const CREATE_BID_REQUEST = 'CREATE_BID_REQUEST'
export const CREATE_BID_SUCCESS = 'CREATE_BID_SUCCESS'
export const CLEAR_INPUTS = 'CLEAR_INPUTS'

interface PayMethodRequestedAction { type: typeof FETCH_PAYMETHODS_REQUEST }

interface PayMethodsLoadedAction {
  type: typeof FETCH_PAYMETHODS_SUCCESS
  payload: PayMethodResponse
}

export interface ChangeMethod {
  type: typeof CHANGE_METHOD
  payload: { 
    methodId: string
    base: Base
  }
}

interface ChangeAmount {
  type: typeof CHANGE_AMOUNT
  payload: { 
    amount: string
    base: Base
  }
}

interface ValueRequestedAction { 
  type: typeof FETCH_VALUE_REQUEST,
  payload: {
    base: Base
  }
}

interface ValueLoadedAction {
  type: typeof FETCH_VALUE_SUCCESS,
  payload: {
    base: Base
  }
}

interface CreateBidRequest {
  type: typeof CREATE_BID_REQUEST
}

interface CreateBidLoadedAction {
  type: typeof CREATE_BID_SUCCESS,
  payload: { message: string }
}

export interface ClearInputs {
  type: typeof CLEAR_INPUTS
}

export type ActionTypes = 
  PayMethodRequestedAction | 
  PayMethodsLoadedAction | 
  ChangeMethod | 
  ValueRequestedAction |
  ValueLoadedAction |
  ChangeAmount |
  CreateBidRequest |
  CreateBidLoadedAction |
  ClearInputs

const payMethodRequested = (): PayMethodRequestedAction => {
  return {
    type: FETCH_PAYMETHODS_REQUEST
  }
};

const payMethodsLoaded = (payMethods: PayMethodResponse): PayMethodsLoadedAction => {
  return {
    type: FETCH_PAYMETHODS_SUCCESS,
    payload: payMethods
  };
};

export const changeMethod = (methodId: string, base: Base): ChangeMethod => {
  return {
    type: CHANGE_METHOD,
    payload: { methodId, base }
  }
}

const changeAmount = (amount: string, base: Base): ChangeAmount => {
  return {
    type: CHANGE_AMOUNT,
    payload: { amount, base }
  }
}

const valueRequested = (base: Base): ValueRequestedAction => {
  return {
    type: FETCH_VALUE_REQUEST,
    payload: { base }
  }
}

const valueLoaded = (base: Base): ValueLoadedAction => {
  return {
    type: FETCH_VALUE_SUCCESS,
    payload: { base }
  };
}

const createBidRequested = (): CreateBidRequest => {
  return {
    type: CREATE_BID_REQUEST
  }
}

const createBidLoaded = (message: string): CreateBidLoadedAction => {
  return {
    type: CREATE_BID_SUCCESS,
    payload: { message }
  }
}

export const clearInputs = (): ClearInputs => {
  return {
    type: CLEAR_INPUTS
  }
}

export const createBid = (dispatch: Dispatch, query: CreateBidQuery) => () => {
  dispatch(createBidRequested())
  involveApiService.createBid(query)
    .then((data: CreateBidResponse) => {
      dispatch(createBidLoaded(data.message))
    })
}

export const fetchValue = (dispatch: Dispatch, query: CalculateQuery) => () => {
  dispatch(changeAmount(query.amount.toString(), query.base))
  const baseChanged = query.base === 'invoice' ? 'withdraw' : 'invoice'
  dispatch(valueRequested(baseChanged));

  involveApiService.calculate(query)
    .then((data: CalculateResponse) => { 
      dispatch(changeAmount(data.amount.toString(), baseChanged))
      dispatch(valueLoaded(baseChanged)) 
    })
    .catch((err: any) => console.log(err));
}

export const fetchPayMethods = (dispatch: Dispatch) => () => {
  dispatch(payMethodRequested());
  involveApiService.getPaymentMethods()
    .then((data: PayMethodResponse) => {
      dispatch(payMethodsLoaded(data))
      dispatch(changeMethod(data.invoice[0].id.toString(), 'invoice'))
      dispatch(changeMethod(data.withdraw[0].id.toString(), 'withdraw'))
    })
    .catch((err: any) => console.log(err));
}
