import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import './home-tile.css';

class HomeTile extends Component {
    index = parseInt(this.props.tileId);

    render() {
        return (
            <Link to={this.props.data[this.index].link} className="home-tile--link">
                <div className="home-tile--main-div">
                    <p className="home-tile--paragraph home-tile--paragraph-heading">{this.props.data[this.index].title}</p>
                    <p className="home-tile--paragraph home-tile--paragraph-content">{this.props.data[this.index].content}</p>
                    <p className="home-tile--paragraph home-tile--paragraph-click-message">{this.props.data[this.index].clickMessage}</p>
                </div>
            </Link>
        );
    }
}

const mapStateToProps = ({homeTileData}) => {
    return {data: homeTileData};
};

export default connect(mapStateToProps)(HomeTile);