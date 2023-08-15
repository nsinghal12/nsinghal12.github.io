import React from 'react';
import './Website.scss';
import Link from './components/Link';
import Router from './components/Router';

export default class Website extends React.Component {

  render() {
    return <>
      <header className='header'>
        <nav className='nav'>
          <a className='brand' href='/'>🦄</a>
          <div className='navbar'>
            <Link href='/' className='nav-item'>Home</Link>
            <Link href='/blog' className='nav-item'>Blog</Link>
            {/* <Link href='/projects' className='nav-item'>Projects</Link>
            <Link href='/apps' className='nav-item'>Apps</Link> */}
            <Link href='/about' className='nav-item'>About</Link>
          </div>
        </nav>
      </header>
      <main className='main'>
        <div className='alert alert-info'>
          Blog rebuild in progress, not all content is available at this time.
        </div>
        <section className='content'>
          <Router />
        </section>
      </main>
      <footer className='footer'>
        Made with <span className='heart'>❤</span> on some rainy days. Copyright &copy; 2023,&nbsp;<a href='https://nitisinghal.com'>Niti Singhal</a>
      </footer>
    </>
  }

}

