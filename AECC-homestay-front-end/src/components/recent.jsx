import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import TruncatedText from "./truncate/TruncateText";
import TruncatedLink from "./truncate/TruncateLink";

export default function Recent() {
    const [mostRent, setMostRent] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get("http://localhost:8080/homes/findBooking").then((response) => {
            console.log(response.data)
            setMostRent(response.data)
            setLoading(false)
        }).catch((er) => {
            console.log(er)
        })
    }, [])
    if (loading) {
        return <div>Loading...</div>
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 1:
                return 'green';
            case 2:
                return 'orange';
            case 3:
                return 'red';
            default:
                return 'transparent';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 1:
                return 'Phòng trống';
            case 2:
                return 'Đang bảo trì';
            case 3:
                return 'Đang cho thuê';
            default:
                return 'Unknown';
        }
    };

    return (
        <div>
            {(mostRent !== null) ? (
                <div className="recent-properties content-area-2">
                    <div className="container">
                        <div className="main-title">
                            <h1>Top Homestays</h1>

                        </div>
                        <div className="row">
                            {mostRent.map((home, index) => (
                                <div className="col-lg-3 col-md-6 col-sm-12 wow fadeInLeft delay-04s">
                                    <div className="property-box-8">
                                        <div className="photo-thumbnail">
                                            <Link className="property-img" to={`/viewHome/${home.id}`}>
                                                <div className="photo">
                                                    <img height={200} src={home.images} alt="property-box-8"/>
                                                </div>
                                            </Link>
                                            <div style={{backgroundColor: getStatusColor(home.status)}}
                                                 className="tag-for">{getStatusLabel(home.status)}</div>
                                            <div className="price-ratings-box">
                                                <p className="price">
                                                    {home.priceByDay >=10000 ? home.priceByDay.toLocaleString(): home.priceByDay} VNĐ/ngày
                                                </p>
                                                <div className="ratings">
                                                    <span></span>{[...Array(home.rating)].map((_, index) => (
                                                    <i className="fa fa-star" style={{color: "orange"}}></i>))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="detail">
                                            <h5 className="title">
                                                <p></p>
                                                &nbsp;<TruncatedLink url={`/viewHome/${home.id}`} text={home.name}
                                                               maxLength={20}></TruncatedLink>
                                            </h5>
                                            <div className="location">
                                                <a href="">
                                                    &nbsp;<TruncatedText text={home.address} maxLength={27}></TruncatedText>
                                                </a>
                                            </div>
                                            <div className="location">
                                                <a href="">
                                                    <span>&nbsp;<i className="fa fa-home"></i></span> {home.homeType}
                                                </a>
                                            </div>
                                            <div className="properties-listing">
                                                <span>{home.bedroom} <i className="fa fa-bed"></i></span>
                                                <span>{home.bathroom} <i className="fa fa-bath"></i></span>
                                                <span>{home.bookingCount} lượt thuê</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="featured-properties content-area-19">
                    <div className="container">
                        <div className="main-title">
                            <h1>Danh sách nhà trống</h1>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
