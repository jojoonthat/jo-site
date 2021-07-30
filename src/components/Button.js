import React from 'react'

const Button = ({ imgSource, link }) => {
  return (
    <a className='button' href={link} target='_blank'>
      <img src={imgSource} width='36px' />
    </a>
  )
}

export default Button;
