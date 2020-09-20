import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './tile.css';

class Tile extends Component {

    renderBuckets() {
        if (this.props.data && this.props.data.buckets) {
            return this.props.data.buckets.map(bucket => {
                return (
                    <p className="tile--paragraph tile--paragraph-content">#{bucket.title}</p>
                );
            });
        }
        return;
    }

    render() {
        return (
            <Link to={this.props.data.link} className="tile--link">
                <div className="tile--main-div" style={{backgroundColor: this.props.data.color}}>
                    <p className={"tile--paragraph tile--paragraph-heading " + this.props.customClassName}>{this.props.data.title}</p>
                    <p className="tile--paragraph tile--paragraph-content">{this.props.data.content}</p>
                    {this.renderBuckets()}
                    <p className="tile--paragraph tile--paragraph-click-message">{this.props.data.clickMessage}</p>
                </div>
            </Link>
        );
    }
}

export default Tile;