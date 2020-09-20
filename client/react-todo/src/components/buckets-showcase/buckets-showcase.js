import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { getBucketList, resetBucketState } from '../../actions/bucket-actions';
import Tile from '../tile/tile';

import './buckets-showcase.css';

class BucketsShowcase extends Component {
    componentDidMount() {
        this.props.resetBucketState();
        this.props.getBucketList();
    }

    renderBucketList() {
        if (this.props.bucketData.status !== 0) {
            return (
                <div className="alert alert-danger bucket-showcase--alert" role="alert">
                    Server might be under maintainence. Please try again later.
                </div>
            );
        }

        if (!this.props.bucketData.data) {
            return (
                <div className="alert alert-info bucket-showcase--primary" role="alert">
                    No Buckets yet. Please add some Buckets to be viewable here.
                </div>
            );
        }

        return this.props.bucketData.data.map(bucket => {
            
            bucket.link = `/bucket/addedit/${bucket.id}`;
            bucket.color = '#' + bucket.color;
            return (
                <div key={bucket.id} className="col-md-6 col-xl-3 bucket-showcase--tile">
                    <Tile data={bucket} customClassName="tile--paragraph-heading-invert-colors" />
                </div>
            );
        });
    }

    render() {
        return (
            <div className="bucket-showcase--main-div">
                <Link to="/" className="bucket-showcase--link">❮ Go Back to Home</Link>
                <div className="bucket-showcase--tools">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="input-group mb-3 bucket-showcase--search-input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-default">Search Text:</span>
                                </div>
                                <input 
                                type="text" 
                                placeholder="Enter Search Text Here" 
                                className="form-control bucket-showcase--input" 
                                aria-label="Search Text" 
                                aria-describedby="inputGroup-sizing-default"></input>
                            </div>
                        </div>
                        <div className="col-md-8 bucket-showcase--tools-buttons">
                            <Link to="/todo/addedit/" className="btn btn-default bucket-showcase--button">Add Todo</Link>
                            <Link to="/bucket/addedit/" className="btn btn-default bucket-showcase--button">Add Bucket</Link>
                        </div>
                    </div>
                </div>
                <div className="row bucket-showcase--row">
                    {this.renderBucketList()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ bucketData }) => {
    return { bucketData: bucketData.getListResponse };
};

export default connect(mapStateToProps, { getBucketList, resetBucketState })(BucketsShowcase);