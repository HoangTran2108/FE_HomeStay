import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Pagination, DatePicker} from "antd";
import Swal from "sweetalert2";

const {RangePicker} = DatePicker;

export default function UncheckedCustomer(props) {
    const userId = props.user;
    const [booking, setBooking] = useState([]);
    const [check, setCheck] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/${userId.id}/booking/unchecked`
            );
            setBooking(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [check]);

    useEffect(() => {
        setCurrentPage(1); // Reset current page when date range changes
    }, [startDate, endDate]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            setStartDate(dates[0]);
            setEndDate(dates[1]);
        } else {
            setStartDate(null);
            setEndDate(null);
        }
    };

    const totalItems = booking.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedIncome = booking
        .filter((booking) => {
            if (!startDate || !endDate) {
                return true; // Show all bookings if no date range is selected
            }

            const checkinDate = new Date(booking.checkin);
            const checkoutDate = new Date(booking.checkout);

            return (
                checkinDate >= startDate && checkinDate <= endDate ||
                checkoutDate >= startDate && checkoutDate <= endDate
            );
        })
        .slice(startIndex, endIndex);

    const deleteBooking = async (bookingId, checkinDate) => {
        const timeDiff = new Date(checkinDate) - new Date();
        const oneDayInMs = 24 * 60 * 60 * 1000;
        if (timeDiff <= oneDayInMs) {
            await Swal.fire({
                title: "Không thể hủy!",
                text:
                    "Không thể hủy trong trường hợp khách đang thuê hoặc thời gian checkin của khách còn ít hơn 1 ngày",
                icon: "warning",
            });
            return;
        }

        const confirmed = await Swal.fire({
            title: "Bạn chắc chắn muốn hủy đơn?",
            text: "Sẽ không được hoàn tác nếu bạn xác nhận hủy",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Có",
            cancelButtonText: "Không",
        }).then((result) => result.isConfirmed);

        if (confirmed) {
            try {
                const response = await axios.put(`http://localhost:8080/customer/bookings/setStatus/${bookingId}`
                );
                await Swal.fire("Đã hủy!", "Đơn đặt phòng đã được hủy thành công", "success");
                fetchData();
            } catch (error) {
                await Swal.fire({
                    title: "Đã xảy ra sự cố",
                    text: "Không thể hủy vì đang có người thuê!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    return (
        <div>
            <div>
                {/* Ô tìm kiếm */}
                <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                    <RangePicker onChange={handleDateChange} placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                    />
                </div>
                <p style={{display: "flex", justifyContent: "center"}}>Nhập vào ô bên trên để tìm kiếm theo ngày: </p>
            </div>
            {/* Danh sách đã lọc */}
            <div>
                {paginatedIncome.map((bookings, index) => (
                    <div className="col-lg-12 col-md-12 col-sm-12" key={index}>
                        <div className="my-properties">
                            <table className="manage-table">
                                <tbody className="responsive-table">
                                <tr>
                                    <td className="listing-photoo">
                                        <img
                                            alt="my-properties"
                                            src={bookings.users.avatar}
                                            height={125}
                                        />
                                    </td>
                                    <td className="title-container">
                                        <h5>
                                            <a href="#">Khách hàng: {bookings.users.name}</a>
                                        </h5>
                                        <p>
                                            <h6>SĐT: {bookings.users.phoneNumber}</h6>
                                        </p>
                                        <p>
                                            <h6>Tên nhà: {bookings.homes.name}</h6>
                                        </p>
                                    </td>
                                    <td>
                                        <h6>
                                            <span style={{color: "blue"}}>checkin:</span>{" "}
                                            {bookings.checkin}
                                        </h6>
                                        <p>
                                            <h6>
                                                <span style={{color: "red"}}>checkout:</span>{" "}
                                                {bookings.checkout}
                                            </h6>
                                        </p>
                                        <p>
                                            <h6>
                                                <span>Tổng tiền:</span>{" "}
                                                {bookings.totalPrice >= 10000
                                                    ? bookings.totalPrice.toLocaleString()
                                                    : bookings.totalPrice}
                                            </h6>
                                        </p>
                                    </td>
                                    <td className="action">
                                        <Button
                                            style={{width: "100%"}}
                                            onClick={() => deleteBooking(bookings.id, bookings.checkin)}
                                        >
                                            <i className="fa fa-trash"></i>&nbsp;&nbsp;Hủy đơn
                                        </Button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            <div
                style={{display: "flex", justifyContent: "center", marginTop: "20px"}}
            >
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