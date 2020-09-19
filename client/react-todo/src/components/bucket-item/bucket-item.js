import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { 
    getSingleBucket,
    idChanged,
    titleChanged,
    colorChanged,
    validationMessageChanged,
    saveBucket,
    removeBucket
} from '../../actions/bucket-actions';

import './bucket-item.css';

class BucketItem extends Component {
    componentDidMount() {
        const { bucketId } = this.props.match.params;
        if (bucketId) {
            this.props.getSingleBucket(bucketId);
        }
    }

    onTitleChange = (event) => {
        this.props.titleChanged(event.target.value);
    }

    onColorChange = (event) => {
        this.props.colorChanged(event.target.value);
    }

    showBucketAdditonalInfo = () => {
        if (this.props.modifiedDateMesage &&
            this.props.createdDateMessage) {
                return (
                    <React.Fragment>
                        <div className="alert alert-info bucket-item--alert" role="alert">
                            {this.props.modifiedDateMesage}
                        </div>
                        <div className="alert alert-info bucket-item--alert" role="alert">
                            {this.props.createdDateMessage}
                        </div>
                    </React.Fragment>
                );  
            }
    }

    showAlertOnSuccessfulSave = () => {
        if (this.props.saveResponse.status !== undefined &&
            this.props.saveResponse.status === 0) {
                console.log(this.props.saveResponse.status);
                return (
                    <div className="alert alert-success bucket-item--alert" role="alert">
                        Changes were saved successfully
                    </div>
                );
            }
    }

    showAlertOnRequestFailure = () => {
        if ((this.props.getSingleResponse.status !== undefined &&
            this.props.getSingleResponse.status !== 0) ||
            (this.props.saveResponse.status &&
            this.props.saveResponse.status !== 0)) {
            return (
                <div className="alert alert-danger bucket-item--alert" role="alert">
                    Server might be under maintainence. Please try again later.
                </div>
            );
        }
    };

    showAlertOnValidationFailure = () => {
        if (this.props.validationMessage !== '') {
            return (
                <div className="alert alert-warning bucket-item--alert" role="alert">
                    {this.props.validationMessage}
                </div>
            );
        }
    }

    showDeleteButton = () => {
        if (this.props.id) {
            return (
                <button className="btn btn-danger bucket-item--button" onClick={this.removeBucket}>Delete</button>
            );
        }
    }

    saveBucket = () => {
        let validationMessage = this.validateInputs();
        if (validationMessage === '') {
            this.props.saveBucket(
                this.props.id,
                this.props.title,
                this.props.color
            );
        }
    }

    removeBucket = () => {
        if (window.confirm('Are you sure you want to delete?')) {
            this.props.removeBucket(this.props.id);
            this.props.history.push('/buckets');
        }
    }

    validateInputs = () => {
        let validationMessage = '';
        if (this.props.title === '') {
            validationMessage += 'Please enter bucket title. \n';
        }
        if (this.props.title.length > 256) {
            validationMessage += 'Bucket title length cannot be greater than 256. \n';
        }
        if (this.props.color === '') {
            validationMessage += 'Please enter bucket color. \n';
        } 
        if (!this.props.color.match(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g)) {
            validationMessage += 'Please enter valid bucket color value. \n';
        }
        this.props.validationMessageChanged(validationMessage);
        return validationMessage;
    }

    render() {
        
        return (
            <div className="bucket-item--main-div">
                <Link to="/buckets" className="bucket-item--link">❮ Go Back to Buckets List</Link>

                {this.showAlertOnSuccessfulSave()}
                {this.showAlertOnRequestFailure()}
                {this.showAlertOnValidationFailure()}

                <div className="bucket-item--form">
                    <div className="row">
                        <div className="col-md-10">
                            <div className="input-group mb-3 bucket-item--search-input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bucket-item--input-text" id="inputGroup-sizing-default">Title:</span>
                                </div>
                                <input 
                                type="text" 
                                placeholder="Enter bucket title here" 
                                className="form-control bucket-item--input" 
                                aria-label="Bucket Title Text" 
                                aria-describedby="inputGroup-sizing-default"
                                onChange={this.onTitleChange}
                                defaultValue={this.props.title}
                                ></input>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-10">
                            <div className="input-group mb-3 bucket-item--search-input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bucket-item--input-text" id="inputGroup-sizing-default">Color:</span>
                                </div>
                                <input 
                                type="text" 
                                placeholder="Enter bucket color hex code here without #" 
                                className="form-control bucket-item--input" 
                                aria-label="Bucket Color Text" 
                                aria-describedby="inputGroup-sizing-default"
                                onChange={this.onColorChange}
                                defaultValue={this.props.color}
                                maxLength="6"
                                ></input>
                            </div>
                        </div>
                    </div>
                </div>

                {this.showBucketAdditonalInfo()}

                <button className="btn btn-success bucket-item--button" onSubmit={this.saveBucket} onClick={this.saveBucket}>Save</button>
                {this.showDeleteButton()}
            </div>
        );
    }
}

const mapStateToProps = ({ bucketData }) => {
    const { 
        id, 
        title, 
        color, 
        createdDateMessage, 
        modifiedDateMesage, 
        validationMessage, 
        getSingleResponse,
        saveResponse
    } = bucketData;
    return { 
        id, 
        title, 
        color, 
        createdDateMessage, 
        modifiedDateMesage, 
        validationMessage, 
        getSingleResponse,
        saveResponse
    };
};

export default 
connect(mapStateToProps, {
    getSingleBucket, 
    idChanged, 
    titleChanged, 
    colorChanged, 
    validationMessageChanged,
    saveBucket,
    removeBucket
})(BucketItem);