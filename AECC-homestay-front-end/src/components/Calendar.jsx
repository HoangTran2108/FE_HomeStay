import React, {useEffect, useState} from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRangePicker} from 'react-date-range';
import {differenceInDays, format, parseISO} from 'date-fns';
import "../styles/SinglePageMiddle.css";
import axios from "axios";
import {useParams} from "react-router-dom";
import Swal from "sweetalert2";

const CalendarFunc = (props) => {
    const {id} = useParams();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [bookingCheckin, setBookingCheckin] = useState([]);
    const [bookingCheckout, setBookingCheckout] = useState([]);
    const [booking, setBooking] = useState([]);
    const [check, setCheck] = useState(false);
    const [isValid, setValid] = useState(false);

    useEffect(() => {
        const getBooking = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/customer/bookings/home/${id}`);
                setBooking(res.data);
                setBookingCheckin(res.data.map(booking => booking.checkin)); // Lưu các giá trị checkin vào mảng checkinDate
                setBookingCheckout(res.data.map(booking => booking.checkout)); // Lưu các giá trị checkin vào mảng checkinDate
            } catch (error) {
                console.log(error.message);
            }
        };
        getBooking();
    }, [id, check, startDate, endDate]);

    let disabledDates = bookingCheckin.slice(0, bookingCheckout.length).map((checkin, index) => ({
        startDate: new Date(checkin),
        endDate: new Date(bookingCheckout[index])
    }));

    if (disabledDates.length === 0) {
        disabledDates = [{startDate: new Date(-1), endDate: new Date(-1)}];
    }

    const handleSelect = (ranges) => {
        const selectedStartDate = ranges.selection.startDate;
        const selectedEndDate = ranges.selection.endDate;// Chuyển date => string
        const startDateString = format(selectedStartDate, 'yyyy-MM-dd');
        const endDateString = format(selectedEndDate, 'yyyy-MM-dd');
        var count = 0;
        const flag = {startDate: startDateString, endDate: endDateString};
        setCheck(!check);

        // Kiểm tra tính trùng lặp
        (disabledDates.map(date => {
                if ((date.startDate.toString() === flag.startDate || date.endDate.toString() === flag.endDate) ||
                    (selectedStartDate >= date.startDate && selectedStartDate <= date.endDate) ||
                    (selectedEndDate >= date.startDate && selectedEndDate <= date.endDate) ||
                    (selectedStartDate <= date.startDate && selectedEndDate >= date.endDate)) {
                    Swal.fire({
                        title: "Ngày bạn vừa chọn đã có người booking trong khoảng thời gian từ " +
                            format(date.startDate, 'dd-MM-yyyy') + " đến " + format(date.endDate, 'dd-MM-yyyy') + ". Mời chọn lại ngày khác",
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    setValid(false);
                    count++;
                }
                if (count === 0) {
                    setStartDate(selectedStartDate);
                    setEndDate(selectedEndDate);
                    setValid(true);
                }
            })
        )
    };

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: "selection"
    };

    const daysCheck = differenceInDays(endDate, startDate);

    useEffect(() => {
        props.onDataChanged(daysCheck, startDate, endDate, isValid);
    }, [daysCheck, startDate, endDate, isValid]);

    return (
        <div className='calendarHolder calendarHolder2'>
            {props.buttonopenState && (
                <DateRangePicker
                    ranges={[selectionRange]}
                    minDate={new Date()}
                    rangeColors={["#FD5B61"]}
                    onChange={handleSelect}
                />
            )}
            {props.buttonopenState && (
                <button className='close-cal rounded-xl' onClick={props.closeFunc}>
                    Đóng lịch
                </button>
            )} {daysCheck === 0 ? (
            <p className={daysCheck === 0 ? "days-0" : "days-updated"}></p>
        ) : (
            <p className='days-updated'>Tổng số ngày đã chọn là {daysCheck} ngày</p>
        )}
        </div>
    );
};

export default CalendarFunc;