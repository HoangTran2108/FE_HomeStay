import React, {useEffect, useState} from "react";
import axios from "axios";
import {Pagination} from "antd";

export default function RentalOfCustomer(props){
    const userId = props.user;
    const [booking, setBooking] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    useEffect(() => {
        axios
            .get(`http://localhost:8080/customer/bookings/status/true/${userId.id}`)
            .then((response) => {
                setBooking(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalItems = booking.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedIncome = booking.slice(startIndex, endIndex);

    return (
        <div>
            <div>
                {paginatedIncome.map((bookings, index) => (
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="my-properties">
                            <table className="manage-table" key={index}>
                                <tbody className="responsive-table">
                                <tr>
                                    <td className="listing-photoo">
                                        <img alt="my-properties" src={bookings.homes.image[0]}
                                             height={125}/>
                                    </td>
                                    <td className="title-container">
                                        <h5><a href="#">Chủ nhà: {bookings.homes.users.name}</a></h5>
                                        <p><h6>SĐT: {bookings.homes.users.phoneNumber}</h6></p>
                                        <p><h6>Tên nhà: {bookings.homes.name}</h6></p>

                                    </td>
                                    <td>
                                        <h6><span style={{color: "blue"}}>checkin:</span> {bookings.checkin}</h6>
                                        <p><h6><span style={{color: "red"}}>checkout:</span> {bookings.checkout}
                                        </h6></p>
                                        <p><h6>
                                            <span>Tổng tiền:</span> {bookings.totalPrice >= 10000 ? bookings.totalPrice.toLocaleString() : bookings.totalPrice}
                                        </h6></p>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                <Pagination
                    current={currentPage}
                    total={totalItems}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
}
