import React, { Component } from 'react';
import './home-tile.css';

class HomeTile extends Component {
    render() {
        return (
            <div className="home-tile--main-div">
                <p className="home-tile--paragraph home-tile--paragraph-heading">{this.props.data.title}</p>
                <p className="home-tile--paragraph home-tile--paragraph-content">{this.props.data.content}</p>
                <p className="home-tile--paragraph home-tile--paragraph-click-message">{this.props.data.clickMessage}</p>
            </div>
        );
    }
}

export default HomeTile;