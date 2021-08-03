import React from 'react';
import { ReactComponent as GithubSvg } from '../img/github.svg';
import { ReactComponent as GmailSvg } from '../img/gmail.svg';
import { ReactComponent as LinkedinSvg } from '../img/linkedin.svg';

const Info = () => {
  return (
    <div className='info'>
      <a className='button' href='https://github.com/jojoonthat' target='_blank'><GithubSvg /></a>
      <a className='button' href='mailto:jpan0917@gmail.com' target='_blank'><GmailSvg /></a>
      <a className='button' href='https://www.linkedin.com/in/panjoanne' target='_blank'><LinkedinSvg /></a>
    </div>
  )
}

export default Info;
