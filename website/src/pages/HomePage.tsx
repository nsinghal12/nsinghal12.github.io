import React from 'react';

export default class HomePage extends React.Component {

    render() {
        return <div className='jumbotron'>
            <img src='https://nitisinghal.com/image/niti.jpeg' alt='Niti Singhal' className='circular-image' />
            <div>
                <h1>Hi, I'm Niti Singhal.</h1>
                <h2>I'm a Web Developer based in Bay Area.</h2>
            </div>
        </div>
    }

}
