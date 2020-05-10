import React, { useState } from 'react'
import './select.css'

const Select = (props: any) => {
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
        options.map((x: any) => <div 
          key={x.id} 
          onClick={() => handleOptionClick(x.id, x.name)}
        >{x.name}</div>)
      }
      </div>
    </div>
}

export default Select