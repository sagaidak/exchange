import React from 'react'
import { connect } from 'react-redux'
import { Redirect, NavLink } from 'react-router-dom'
import { State, SuccessState } from '../../reducers'
import icon from './success.svg'
import './success-form.css'

type Props = {
  success: SuccessState
}

const SuccessForm = (props: Props) => {
  const { success } = props

  if (success.message === '') return <Redirect to='/' />

  return <div className='form_wrapper success'>
    <img src={icon} />
    <h2>{success.message}</h2>
    <div>
      Your exchange order has been placed successfully and will be processed soon.
    </div>
    <NavLink to='/'><button className='button'>Home</button></NavLink>
  </div>
}

const mapStateToProps = ({ success }: State) => {
  return {
    success
  }
}

export default connect(mapStateToProps, {})(SuccessForm)