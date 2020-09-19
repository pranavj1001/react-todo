import React, { Component } from 'react';
import './home.css';

import HomeTile from '../home-tile/home-tile';

class Home extends Component {
    render() {
        return (
            <div className="container-fluid home--main-div">
                <h3 className="home--heading">Welcome!</h3>
                <div className="row home--tile-row">
                    <div className="col-md-6 col-xl-4 home--tile">
                        <HomeTile tileId="0" />
                    </div>
                    <div className="col-md-6 col-xl-4 home--tile">
                        <HomeTile tileId="1" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;