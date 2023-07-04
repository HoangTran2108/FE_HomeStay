import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import TruncatedLink from "./truncate/TruncateLink";
import TruncatedText from "./truncate/TruncateText";
import {Pagination} from "antd";

function ListHomestay(props) {
    const [homes, setHomes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    useEffect(() => {
        axios
            .get(`http://localhost:8080/homes?page=${currentPage}`)
            .then((response) => {
                setHomes(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


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

    const totalItems = homes.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedHome = homes.slice(startIndex, endIndex);
    if (paginatedHome === undefined) {
        return (
            <div className="featured-properties content-area-19">
                <div className="container">
                    <div className="main-title">
                        <h1>Danh sách nhà trống</h1>
                    </div>
                </div>
            </div>)
    } else {
        return (
            <div>
                {paginatedHome.length > 0 ? (
                    <div className="featured-properties content-area-19">
                        <div className="container">
                            <div className="main-title">
                                <h1>Danh sách homestay</h1>
                            </div>
                            <div className="row wow fadeInUp delay-04s">
                                {paginatedHome.map(home => (
                                    <div className="col-lg-4 col-md-6 col-sm-12 filtr-item"
                                         data-category="3, 2" key={home.id}>
                                        <div className="property-box-7">
                                            <div className="property-thumbnail">
                                                <Link className="property-img" to={`/viewHome/${home.id}`}>
                                                    <div style={{backgroundColor: getStatusColor(home.status)}}
                                                         className="tag-2">{getStatusLabel(home.status)}</div>
                                                    <div className="price-box">
                                                        <span>{home.priceByDay >= 10000 ? home.priceByDay.toLocaleString() : home.priceByDay} VNĐ</span>/ngày
                                                    </div>
                                                    <img height={250} src={home.image[0]} alt="property-box-7"/>
                                                </Link>
                                            </div>
                                            <div className="detail">
                                                <h1 className="title">
                                                    <TruncatedLink url={`/viewHome/${home.id}`} text={home.name}
                                                                   maxLength={28}></TruncatedLink>
                                                </h1>
                                                <div className="location">
                                                    <TruncatedText text={home.address} maxLength={35}>
                                                    </TruncatedText>
                                                </div>
                                            </div>
                                            <ul style={{backgroundColor: '#FFFFFF'}}
                                                className="facilities-list clearfix">
                                                <li>
                                                    <span><i className="fa fa-home"></i></span>{home.homeType.name}
                                                </li>
                                                <li>
                                                    <span><i className="fa fa-bed"></i></span> {home.bedroom}
                                                </li>
                                                <li>
                                                    <span><i className="fa fa-bath"></i></span> {home.bathroom}
                                                </li>
                                                <li className="float-right">
                                                    <span>Đánh giá</span>{[...Array(home.rating)].map((_, index) => (
                                                    <i className="fa fa-star" style={{color: "orange"}} key={index}></i>))}
                                                </li>
                                            </ul>
                                            <div className="footer clearfix">
                                                <div className="pull-left days">
                                                    <p><i className="fa fa-user"></i>{home.users.name}</p>
                                                </div>
                                                <ul className="pull-right">
                                                    <li><a href="#"><i
                                                        className="flaticon-heart-shape-outline"></i></a></li>
                                                    <li><a href="#"><i className="flaticon-calendar"></i></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                                <Pagination
                                    current={currentPage}
                                    total={totalItems}
                                    pageSize={pageSize}
                                    onChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="featured-properties content-area-19">
                        <div className="container">
                            <div className="main-title">
                                <h1>Danh sách trống</h1>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ListHomestay;