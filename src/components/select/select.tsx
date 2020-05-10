import React, { useState } from 'react'
import './select.css'
import { PayMethod } from '../../services/involve-api-service'

type Props = {
  className?: string
  onChange: (v: string) => void
  options: PayMethod[]
}

const Select = (props: Props) => {
  const { className = '', onChange, options = [] } = props
  const defaultName = options.length > 0 ? options[0].name : ''
  const [ name, setName ] = useState('')
  const [ showOptions, setShowOptions ] = useState(false)

  const handleOptionClick = (v: string, name: string) => {
    setName(name)
    onChange(v)
    setShowOptions(false)
  }

  const selectClass = `${className} divSelect }`
  const wrapperClass = `selectWrapper ${showOptions ? '' : 'hiddenOption'}`

  return <div className={wrapperClass}>
    <div className={selectClass} onClick={() => setShowOptions(!showOptions)}>{name ? name : defaultName}</div>
      <div className={'options'}  > 
      {
        options.map((x: PayMethod) => <div 
          key={x.id} 
          onClick={() => handleOptionClick(x.id.toString(), x.name)}
        >{x.name}</div>)
      }
      </div>
    </div>
}

export default Select