import React, {useState} from 'react';
import {Link} from "react-router-dom";
import TruncatedLink from "./truncate/TruncateLink";
import TruncatedText from "./truncate/TruncateText";
import {Pagination} from "antd";

function SearchResult(props) {
    const {searchResult} = props;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;
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
    const totalItems = searchResult.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedHome = searchResult.slice(startIndex, endIndex);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div>
            <div className="featured-properties content-area-19">
                <div className="container">
                    <div className="main-title">
                        <h1>Kết quả tìm kiếm</h1>
                    </div>
                    <div className="row wow fadeInUp delay-02s">
                        {paginatedHome.map(home => (
                            <div className="col-lg-4 col-md-6 col-sm-12 filtr-item" data-category="3, 2">
                                <div className="property-box-7">
                                    <div className="property-thumbnail">
                                        <Link className="property-img" to={`/viewHome/${home.id}`}>
                                            <div style={{backgroundColor: getStatusColor(home.status)}}
                                                 className="tag-2">
                                                {getStatusLabel(home.status)}
                                            </div>
                                            <div className="price-box">
                                                <span>{home.priceByDay} VNĐ</span>/ngày
                                            </div>
                                            <img height={250} src={home.image} alt="property-box-7"/>
                                        </Link>
                                    </div>
                                    <div className="detail">
                                        <h1 className="title">
                                            <TruncatedLink url={`/viewHome/${home.id}`} text={home.homeName}
                                                           maxLength={28}></TruncatedLink>
                                        </h1>
                                        <div className="location">
                                            <TruncatedText text={home.address} maxLength={35}></TruncatedText>
                                        </div>
                                    </div>
                                    <ul style={{backgroundColor: '#FFFFFF'}} className="facilities-list clearfix">
                                        <li>
                                            <span><i className="fa fa-home"></i></span>{home.homeType}
                                        </li>
                                        <li>
                                            <span><i className="fa fa-bed"></i></span> {home.bedroom}
                                        </li>
                                        <li>
                                            <span><i className="fa fa-bath"></i></span> {home.bathroom}
                                        </li>
                                    </ul>
                                    <div className="footer clearfix">
                                        <div className="pull-left days">
                                            <p><i className="fa fa-user"></i>{home.username}</p>
                                        </div>
                                        <ul className="pull-right">
                                            <li><a href="#"><i className="flaticon-heart-shape-outline"></i></a></li>
                                            <li><a href="#"><i className="flaticon-calendar"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{justifyContent: "center", display: "flex", marginTop: 10}}>
                        <Pagination
                            current={currentPage}
                            total={totalItems}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchResult;