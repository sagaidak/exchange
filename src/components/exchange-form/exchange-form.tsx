import React, { useEffect, useState } from 'react'
import './exchange-form.css'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { fetchPayMethods, changeMethod, fetchValue, ChangeMethod, clearInputs, ClearInputs } from '../../actions'
import { Base, CalculateQuery } from '../../services/involve-api-service'
import { Redirect } from 'react-router-dom'
import { State, PayMethodsState, BidState } from '../../reducers'
import Spinner from '../spinner/spinner'
import Select from '../select/select'

interface Props {
  payMethods: PayMethodsState
  bid: BidState
  fetchPayMethods: () => void
  changeMethod: (id: string, base: Base) => ChangeMethod
  fetchValue: (query: CalculateQuery) => void
  clearInputs: () => ClearInputs
}

const ExchangeForm = (props: Props) => {
  const {
    fetchPayMethods, 
    payMethods, 
    changeMethod,
    bid,
    fetchValue,
    clearInputs
  } = props

  const [ redirect, setRedirect ] = useState(false)

  const disabled = bid.invoice.amount === '' || bid.withdraw.amount === ''

  useEffect(() => {
    clearInputs()
    fetchPayMethods()
  }, [fetchPayMethods, clearInputs])

  if (redirect) return <Redirect to="/confirm" />

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: Base) => {
    const v = e.currentTarget.value

    if (!Number(v) && v !== '') return

    const query = {
      base: field,
      amount: Number(v),
      invoicePayMethod: Number(bid.invoice.methodId),
      withdrawPayMethod: Number(bid.withdraw.methodId)
    }

    fetchValue(query)
  }

  const handleSelectChange = (v: string, field: Base) => {
    changeMethod(v, field)
    clearInputs()
  }

  const handleSubmit = () => {
    if (bid.invoice.amount !== '' && bid.withdraw.amount !== '') {
      setRedirect(true)
    }
  }

  const renderCol = (field: Base) => {

    return <div className='col'>
      <h2>{field === 'invoice' ? 'Sell' : 'Buy'}</h2>
      <Select 
        onChange={(v: string) => handleSelectChange(v, field)} 
        options={payMethods[field]} />
      <input type="text" value={bid[field].amount} onChange={(e) => handleInputChange(e, field)} />
      {bid[field].isLoading && <div className='spinner'><Spinner /></div>}
    </div>
  }

  return <div className='form_wrapper'>
    <form onSubmit={handleSubmit}>
      <div className='row'>
        {renderCol('invoice')}
        {renderCol('withdraw')}
      </div>
      <div className='row-buttons'>
        <button
          type="submit"
          disabled={disabled}
          className='button'
        >
          Exchange
        </button>
      </div>
    </form>
    
  </div>
}

const mapStateToProps = ({ payMethods, bid }: State) => {
  return { payMethods, bid };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchPayMethods: fetchPayMethods(dispatch),
    changeMethod: (id: string, base: Base) => dispatch(changeMethod(id, base)),
    fetchValue: (query: CalculateQuery) => fetchValue(dispatch, query)(),
    clearInputs: () => dispatch(clearInputs())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeForm)