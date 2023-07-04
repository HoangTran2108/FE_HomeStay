import React, {useEffect, useState} from 'react';
import axios from "axios";
import {format} from "date-fns";
import Swal from "sweetalert2";
import {Button, Pagination} from "antd";
import {Link} from "react-router-dom";
import TruncatedLink from "../truncate/TruncateLink";
import TruncatedText from "../truncate/TruncateText";


function BookingsOfCustomer(props) {
    const userId = props.user;
    const [check, setCheck] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [isDone, setIsDone] = useState(false);
    const [status, setStatus] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const checkinButton = async (bookingId) => {
        const response = await axios.get(`http://localhost:8080/customer/bookings/view/${bookingId}`);
        const newBooking = response.data;
        const checkIn = format(new Date(newBooking.checkin), 'd/M/yyyy');
        const currentDate = new Date().toLocaleDateString();
        console.log("current date", currentDate);
        console.log("check in", checkIn);
        console.log("id cua home la :", newBooking.homes.id);
        console.log(newBooking)
        let updateBooking = {
            ...newBooking,
            checkinB: true,
        };
        if (checkIn === currentDate) {
            await axios.put(`http://localhost:8080/customer/bookings/edit/${bookingId}`, updateBooking, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                Swal.fire({
                    title: 'Thành công',
                    text: 'Check-in thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setCheck(!check);
            });
            await axios.put(`http://localhost:8080/homes/after-checkin/${newBooking.homes.id}`, newBooking.homes.id, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            console.log("check-in thành cong");
        } else {
            Swal.fire({
                title: 'Thất bại',
                text: 'Bạn không thể check-in trước thời gian đã đăng kí!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
    const checkoutButton = async (bookingId) => {
        const response = await axios.get(`http://localhost:8080/customer/bookings/view/${bookingId}`);
        const newBooking = response.data;
        const checkIn = format(new Date(newBooking.checkin), 'd/M/yyyy');
        const currentDate = new Date().toLocaleDateString();
        console.log("current date", currentDate);
        console.log("check in", checkIn);

        let updateBooking = {
            ...newBooking,
            checkinB: true,
            checkoutB: true,
            done: true,
            paid: true
        };
        if (checkIn === currentDate) {
            await axios.put(`http://localhost:8080/customer/bookings/edit/${bookingId}`, updateBooking, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                Swal.fire({
                    title: 'Thành công',
                    text: 'Check-out thành công !',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setCheck(!check);
            });
            await axios.put(`http://localhost:8080/homes/after-bookings/${newBooking.homes.id}`, newBooking.homes.id, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            console.log("check-out thanh cong");
        } else {
            console.log("khong the check-out");
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/customer/bookings/status/${userId.id}`);
                setBookings(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [check, isDone]);
    const deleteBooking = async (bookingId, checkinDate) => {

        const timeDiff = new Date(checkinDate) - new Date();
        console.log("thoi gian hien tai", timeDiff);
        const oneDayInMs = 24 * 60 * 60 * 1000;
        if (timeDiff <= oneDayInMs) {
            await Swal.fire({
                title: 'Không thể hủy !',
                text: 'Không thể hủy trong trường hợp khách đang thuê hoặc thời gian checkin của khách còn ít hơn 1 ngày',
                icon: 'warning'
            });
            return;
        }

        const confirmed = await Swal.fire({
            title: 'Bạn chắc chắn muốn hủy đơn?',
            text: 'Sẽ không được hoàn tác nếu bạn xác nhận hủy',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        }).then((result) => result.isConfirmed);

        if (confirmed) {
            try {
                const response = await axios.put(`http://localhost:8080/customer/bookings/setStatus/${bookingId}`);
                await Swal.fire(
                    'Đã hủy!',
                    'Đơn đặt phòng đã được hủy thành công',
                    'success',
                );
                setCheck(!check);
            } catch (error) {
                await Swal.fire({
                    title: 'Đã xảy ra sự cố',
                    text: "Không thể hủy trước thời hạn 1 ngày!",
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    }
    const totalItems = bookings.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedIncome = bookings.slice(startIndex, endIndex);


    return (
        paginatedIncome.length > 0 ? (
            <div>
                <div>
                    {paginatedIncome.map((booking, index) => (
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="my-properties">
                                {/*<table className="manage-table" key={index}>*/}

                                {/*    <tbody className="responsive-table">*/}

                                {/*    <tr><Link className="property-img" to={`/viewHome/${booking.homes.id}`}>*/}
                                {/*        <td className="listing-photoo">*/}
                                {/*            <img alt="my-properties" src={booking.homes.image[0]}*/}
                                {/*                 height={100}/>*/}
                                {/*        </td>*/}
                                {/*        <td className="title-container">*/}
                                {/*            <h5><a href="#">{booking.homes.name}</a></h5>*/}
                                {/*            <h6><span>{booking.totalPrice}</span> VNĐ/Ngày</h6>*/}
                                {/*            <p><i*/}
                                {/*                className="flaticon-facebook-placeholder-for-locate-places-on-maps"></i>*/}
                                {/*                {booking.homes.address} </p>*/}
                                {/*        </td>*/}
                                {/*    </Link>*/}
                                {/*        <td><h6><span style={{color: "blue"}}>checkin:</span> {bookings.checkin}</h6>*/}
                                {/*            <p><h6><span style={{color: "red"}}>checkout:</span> {bookings.checkout}*/}
                                {/*            </h6></p>*/}
                                {/*        </td>*/}
                                {/*        <td>*/}
                                {/*            <th style={{*/}
                                {/*                display: "flex",*/}
                                {/*                flexDirection: "column",*/}
                                {/*                alignItems: "center"*/}
                                {/*            }}>*/}
                                {/*                <button style={{width: "100px"}}*/}
                                {/*                        onClick={() => checkinButton(booking.id)}*/}
                                {/*                        disabled={booking.checkinB}*/}
                                {/*                        className="btn-danger btn-secondary btn btn-blue">Check-in*/}
                                {/*                </button>*/}
                                {/*            </th>*/}
                                {/*            <th style={{*/}
                                {/*                display: "flex",*/}
                                {/*                flexDirection: "column",*/}
                                {/*                alignItems: "center"*/}
                                {/*            }}>*/}
                                {/*                <button style={{width: "100px", marginBottom: "0"}}*/}
                                {/*                        onClick={() => checkoutButton(booking.id)}*/}
                                {/*                        disabled={!booking.checkinB}*/}
                                {/*                        className="btn-danger btn-secondary btn btn-blue">Check-out*/}
                                {/*                </button>*/}
                                {/*            </th>*/}
                                {/*            <th style={{*/}
                                {/*                display: "flex",*/}
                                {/*                flexDirection: "column",*/}
                                {/*                alignItems: "center"*/}
                                {/*            }}>*/}
                                {/*                <button style={{width: "100px"}}*/}
                                {/*                        onClick={() => deleteBooking(booking.id, booking.checkin)}*/}
                                {/*                        disabled={booking.checkinB}*/}
                                {/*                        className="btn-danger btn-secondary btn btn-blue">Hủy*/}
                                {/*                </button>*/}
                                {/*            </th>*/}
                                {/*            /!*<th><button style={{width: "100px"}} onClick={() => checkoutButton(booking.id)} className="btn-danger btn-secondary btn btn-blue">Hủy</button></th>*!/*/}
                                {/*        </td>*/}
                                {/*    </tr>*/}
                                {/*    </tbody>*/}
                                {/*</table>*/}
                                <table className="manage-table" key={index}>
                                    <tbody className="responsive-table">
                                    <tr>
                                        <td className="listing-photoo">
                                            <img alt="my-properties" src={booking.homes.image[0]}
                                                 height={125}/>
                                        </td>
                                        <td className="title-container">
                                            <h5><a href="#">Chủ nhà: {booking.homes.users.name}</a></h5>
                                            {/*<p><h6>SĐT: {booking.homes.users.phoneNumber}</h6></p>*/}

                                            <p><h6>Tên nhà: {booking.homes.name}</h6></p>
                                            <p><h6>
                                                <TruncatedText text={booking.homes.address} maxLength={30}></TruncatedText></h6></p>
                                        </td>
                                        <td>
                                            <h6><span style={{color: "blue"}}>checkin:</span> {booking.checkin}</h6>
                                            <p><h6><span style={{color: "red"}}>checkout:</span> {booking.checkout}
                                            </h6></p>
                                            <p><h6>
                                                <span>Tổng tiền:</span> {booking.totalPrice >= 10000 ? booking.totalPrice.toLocaleString() : booking.totalPrice}
                                            </h6></p>
                                        </td>
                                        <td className="action">
                                            {/*<Button style={{width: '100%'}}*/}
                                            {/*        onClick={() => deleteBooking(bookings.id, bookings.checkin)}>*/}
                                            {/*    <i className="fa fa-trash"></i>&nbsp;&nbsp;Hủy đơn*/}
                                            {/*</Button>*/}
                                            <th style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center"
                                            }}>
                                                <button style={{width: "100px", backgroundColor: "#3F56FF"}}
                                                        onClick={() => checkinButton(booking.id)}
                                                        disabled={booking.checkinB}
                                                        className="btn-danger btn-secondary btn">Check-in
                                                </button>
                                            </th>
                                            <th style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center"
                                            }}>
                                                <button style={{width: "100px", marginBottom: "0", backgroundColor: "#3F56FF"}}
                                                        onClick={() => checkoutButton(booking.id)}
                                                        disabled={!booking.checkinB}
                                                        className="btn-danger btn-secondary btn">Check-out
                                                </button>
                                            </th>
                                            <th style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center"
                                            }}>
                                                <button style={{width: "100px", backgroundColor: "#3F56FF"}}
                                                        onClick={() => deleteBooking(booking.id, booking.checkin)}
                                                        disabled={booking.checkinB}
                                                        className="btn-danger btn-secondary btn">Hủy
                                                </button>
                                            </th>
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

        ) : (
            <div className="featured-properties content-area-19">
                <div className="container">
                    <div className="main-title">
                        <h1>Trống</h1>
                    </div>
                </div>
            </div>
        )
    );
}

export default BookingsOfCustomer;