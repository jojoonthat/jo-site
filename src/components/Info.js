import React from 'react';
import Button from './Button';
import githubImg from '../img/github.png';
import linkedinImg from '../img/linkedin.png';
import gmailImg from '../img/gmail.png';

const Info = () => {
  return (
    <div className='info'>
      <Button imgSource={githubImg} link='https://github.com/jojoonthat' />
      <Button imgSource={gmailImg} link='mailto:jpan0917@gmail.com' />
      <Button imgSource={linkedinImg} link='https://www.linkedin.com/in/panjoanne' />
    </div>
  )
}

export default Info;
