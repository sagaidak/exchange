import { ActionTypes, FETCH_PAYMETHODS_SUCCESS, FETCH_PAYMETHODS_REQUEST, CHANGE_METHOD, FETCH_VALUE_REQUEST, FETCH_VALUE_SUCCESS, CHANGE_AMOUNT, CREATE_BID_REQUEST, CREATE_BID_SUCCESS, CLEAR_INPUTS } from "../actions";
import { PayMethod } from "../services/involve-api-service";

const initialState = {
  payMethods: {
    invoice: [] as PayMethod[],
    withdraw: [] as PayMethod[],
    isLoading: false
  },

  bid: {
    base: '',
    invoice: {
      methodName: '',
      methodId: '',
      amount: '',
      isLoading: false
    },
    withdraw: {
      methodName: '',
      methodId: '',
      amount: '',
      isLoading: false
    }
  },

  success: {
    message: '',
    isLoading: false
  }
};

export type State = typeof initialState
export type PayMethodsState = typeof initialState.payMethods
export type BidState = typeof initialState.bid
export type SuccessState = typeof initialState.success

const reducer = (state = initialState, action: ActionTypes) => {

  switch (action.type) {
    case FETCH_PAYMETHODS_REQUEST:
      return {...state, payMethods: { ...state.payMethods, isLoading: true }}
    
    case FETCH_PAYMETHODS_SUCCESS:
      const { invoice, withdraw } = action.payload

      return {...state, payMethods: { 
          isLoading: false, 
          invoice,
          withdraw
        }
      }

    case CHANGE_METHOD:
      const { base, methodId } = action.payload
      const methodName = state.payMethods[base].find((x) => x.id.toString() === methodId)?.name

      return {...state, bid: {
          ...state.bid,
          [base]: { ...state.bid[base], methodId, methodName }
        }
      }

    case CHANGE_AMOUNT: {
      const { base, amount } = action.payload

      return {...state, bid: {
          ...state.bid,
          [base]: { ...state.bid[base], amount }
        }
      }
    }

    case FETCH_VALUE_REQUEST: {
      const { base } = action.payload
      return {...state, bid: {
          ...state.bid,
          [base]: { ...state.bid[base], isLoading: true }
        }
      }
    }

    case FETCH_VALUE_SUCCESS: {
      const { base } = action.payload
      const baseChanged = base === 'invoice' ? 'withdraw' : 'invoice'
      return {...state, bid: {
          ...state.bid,
          [base]: { ...state.bid[base], isLoading: false },
          base: baseChanged
        }
      }
    }

    case CREATE_BID_REQUEST:
      return {...state, success: {
          ...state.success,
          isLoading: true
        }
      }
    
    case CREATE_BID_SUCCESS:
      return {...state, success: {
          isLoading: false,
          message: action.payload.message
        }
      }
    
    case CLEAR_INPUTS: {
      return {...state, success:{
          ...state.success,
          message: ''
        },
        bid: {
          ...state.bid,
          base: '',
          invoice: {
            ...state.bid.invoice,
            amount: ''
          },
          withdraw: {
            ...state.bid.withdraw,
            amount: ''
          }
        }
      }
    }
    default:
      return state
  }
};

export default reducer