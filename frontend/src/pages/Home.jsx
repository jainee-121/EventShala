import React from 'react';
import '../styles/Home.css'
import event from '../assets/event.avif'
function Home() {
    return (
        <div className='main-home'>
            <h2 className='name-home'>Welcome to the EventShala</h2>
            <img 
                    src={event}
                    alt='EventShala'
                    className="home-photo"
                />
        </div>
    );
}

export default Home; 