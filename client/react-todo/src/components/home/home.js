import React, { Component } from 'react';
import './home.css';

import HomeTile from '../home-tile/home-tile';

class Home extends Component {
    state = {
        todosTile: {
            title: "Todos",
            content: "View all your saved Todo List here.",
            clickMessage: "Click here",
            link: "/todos"
        },
        bucketsTile: {
            title: "Buckets",
            content: "Categorize your todos more efficiently.",
            clickMessage: "Click here",
            link: "/buckets"
        }
    };

    render() {
        return (
            <div className="container-fluid home--main-div">
                <h3 className="home--heading">Welcome!</h3>
                <div className="row home--tile-row">
                    <div className="col-md-6 col-xl-4 home--tile">
                        <HomeTile data={this.state.todosTile} />
                    </div>
                    <div className="col-md-6 col-xl-4 home--tile">
                        <HomeTile data={this.state.bucketsTile} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;