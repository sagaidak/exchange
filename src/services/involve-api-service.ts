// API BASE URL: https://involve-it.com/test_front/api (CORS are allowed)

import debounce from "lodash.debounce"

// Method: GET
// URI: /payMethods

export interface PayMethod {
  id: number;
  name: string;
}
 
export interface PayMethodResponse {
  invoice: PayMethod[];
  withdraw: PayMethod[];
}

// Method: GET
// URI: /payMethods/calculate
export type Base = 'invoice' | 'withdraw'

export interface CalculateQuery {
  base: Base;
  amount: number;
  invoicePayMethod: number;
  withdrawPayMethod: number;
}
 
export interface CalculateResponse {
  amount: number;
}

// Method: POST
// URI: /bids

export interface CreateBidQuery {
  amount: number;
  base: Base;
  invoicePayMethod: number;
  withdrawPayMethod: number;
}

export interface CreateBidResponse {
  message: string
}

export default class InvolveApiService {
  baseUrl = 'https://involve-it.com/test_front/api'

  fetchData = async (URI: string) => {
    const res = await fetch(`${this.baseUrl}${URI}`)
    
    if (!res.ok) {
      throw new Error(`Could not fetch ${URI}` +
        `, received ${res.status}`)
    }
    return await res.json();
  }

  postData = async (URI: string, data = {}) => {
    const response = await fetch(`${this.baseUrl}${URI}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json(); 
  }

  getPaymentMethods = async () => {
    return await this.fetchData('/payMethods')
  }

  calculate1 = async (query: CalculateQuery) => {
    return await this.fetchData(`/payMethods/calculate?amount=${query.amount.toString()}&base=${query.base.toString()}&invoicePayMethod=${query.invoicePayMethod.toString()}&withdrawPayMethod=${query.withdrawPayMethod.toString()}`)
  }

  calculate = debounce(this.calculate1, 1000, {
    'leading': true
  })

  createBid = async (query: CreateBidQuery) => {
    return await this.postData('/bids', query)
  }
}