import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Redirect } from 'react-router-dom'
import { createBid } from '../../actions'
import { CreateBidQuery, Base } from '../../services/involve-api-service'
import { State, BidState, SuccessState } from '../../reducers'
import './confirm-form.css'

type Props = {
  createBid: (query: CreateBidQuery) => void
  bid: BidState
  success: SuccessState
}

const ConfirmForm = (props: Props) => {
  const { bid, createBid, success } = props
  const { invoice, withdraw, base } = bid

  const [ redirect, setRedirect ] = useState(false)

  if (!invoice.amount || !withdraw.amount) return <Redirect to='/' />
  if (redirect) return <Redirect to={'/'} />
  if (success.message) return <Redirect to={'/success'} />

  const handleCancel = () => {
    setRedirect(true)
  }

  const handleConfirm = () => {
    const query = {
      amount: Number(bid[base as Base].amount),
      base: base as Base,
      invoicePayMethod: Number(invoice.methodId),
      withdrawPayMethod: Number(withdraw.methodId)
    }
    createBid(query)
  }

  return <div className='form_wrapper confirm'>
    <h2>Details</h2>
    <div className='row'>
      <div className='base'>Sell</div><div>{invoice.amount} {invoice.methodName}</div>
    </div>
    <div className='row'>
      <div className='base'>Buy</div><div>{withdraw.amount} {withdraw.methodName}</div>
    </div>
    <div className='row'>
      <button type="button" className='button cancel' onClick={handleCancel}>Cancel</button>
      <button type="button" className='button' onClick={handleConfirm}>Confirm</button>
    </div>
    
  </div>
}

const mapStateToProps = ({ bid, success }: State) => {
  return {
    bid, success
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    createBid: (query: CreateBidQuery) => createBid(dispatch, query)()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmForm)