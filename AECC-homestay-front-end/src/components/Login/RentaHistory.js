import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Field} from "formik";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import EditHotel from "../EditHotel";

function RentaHistory(props) {
    const [homes, setHomes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [check, setCheck] = useState(false);
    const visiblePages = totalPages+1;
    const [historyRentalHotel,setHistoryRentalHotel]=useState([])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const pageNumbers = [];
        const halfVisiblePages = Math.floor(visiblePages / 2);
        let startPage = currentPage - halfVisiblePages;
        if (startPage < 0) startPage = 0;
        let endPage = startPage + visiblePages - 1;
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = endPage - visiblePages + 1;
            if (startPage < 0) startPage = 0;
        }

        for (let i = startPage; i < endPage; i++) {
            const pageItemStyle = {
                marginRight: '5px', // Khoảng cách giữa các số trang
                display: 'inline-block', // Hiển thị trên cùng một dòng
                cursor: 'pointer', // Con trỏ chuột thành dạng tay
                fontWeight: currentPage === i ? 'bold' : 'normal', // Trang hiện tại được đậm
            };
            const pageLinkStyle = {
                cursor: "pointer",
                padding: '5px 10px', // Kích thước nút số trang
                backgroundColor: currentPage === i ? '#ccc' : 'transparent', // Màu nền của trang hiện tại
            };
            pageNumbers.push(
                <li key={i} style={pageItemStyle}>
                    <button
                        className="page-link"
                        style={pageLinkStyle}
                        onClick={() => handlePageChange(i)}
                    >
                        {i +1}
                    </button>
                </li>
            );
        }

        return pageNumbers;
    };

    useEffect(() =>{
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/history/infor?page=${currentPage}`);
                const { totalPages } = response.data;
                setHistoryRentalHotel(response.data.content);
                setTotalPages(totalPages);
                console.log(historyRentalHotel[0].image)
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [check, currentPage]);

    const goToPreviousPage = () => {
        setCheck(!check);
        setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1);
    };
    return (
        historyRentalHotel.length > 0 ? (
            <div>
                <div>
                    {historyRentalHotel.map((home, index) => (
                        <div className="col-lg-12 col-md-12 col-sm-12" >
                            <div className="my-properties">
                                <table className="manage-table"key={index}>
                                    <tbody className="responsive-table">
                                    <tr>
                                        <td className="listing-photoo">
                                            <img alt="my-properties" src={home.image}
                                                 height={100}/>
                                        </td>
                                        <td className="title-container">
                                            <h5><a href="#">{home.name}</a></h5>
                                            <h7><span>{home.priceByDay}</span> VNĐ/Ngày</h7>
                                            <p><i
                                                className="flaticon-facebook-placeholder-for-locate-places-on-maps"></i>
                                                {home.address} </p>
                                        </td>
                                        <td className="date">
                                            <h7>Ngày thuê phòng:</h7><br/>
                                            {home.checkin}
                                        </td>
                                        <td className="date">
                                            <h7>Ngày trả phòng:</h7><br/>
                                            {home.checkout}
                                        </td>
                                        <td className="date">
                                            <h7>Tổng thanh toán:</h7><br/>
                                            {home.totalPrice}/VND
                                        </td>

                                    </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    ))}
                </div>
                <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button style={{border:"none", cursor:"pointer"}}
                            onClick={goToPreviousPage}
                            disabled={currentPage === 0}
                    >
                        <i style={{fontSize:25}} className="fa fa-angle-left"></i>
                    </button>
                    {/*<span>{currentPage + 1}</span> / <span>{totalPages}</span>*/}
                    {renderPagination()}
                    <button style={{border:"none", cursor:"pointer"}}
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages - 1}
                    >
                        <i style={{fontSize:25}} className="fa fa-angle-right"></i>
                    </button>
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
        )
    );
}

export default RentaHistory;