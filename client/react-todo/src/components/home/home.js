import React, { Component } from 'react';
import { connect } from 'react-redux';

import './home.css';

import Tile from '../tile/tile';

class Home extends Component {

    renderHomeTiles = () => {
        return this.props.data.map(tile => {
            tile.color = 'rgba(66, 103, 178, 1)';
            return (
                <div key={tile.id} className="col-md-6 col-xl-4 home--tile">
                    <Tile data={tile} />
                </div>
            );
        });
    }

    render() {
        return (
            <div className="container-fluid home--main-div">
                <h3 className="home--heading">Welcome!</h3>
                <div className="row home--tile-row">
                    {this.renderHomeTiles()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({homeTileData}) => {
    return {data: homeTileData};
};

export default connect(mapStateToProps)(Home);