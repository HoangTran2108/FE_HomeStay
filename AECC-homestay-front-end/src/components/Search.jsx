import React, {useEffect, useState} from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import {DatePicker} from "antd";

const {RangePicker} = DatePicker;

function Search(props) {
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [address, setAddress] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [search, setSearch] = useState([]);

    useEffect(() => {
        fetchHomes();
        const interval = setInterval(() => {
            fetchHomes();
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    const fetchHomes = () => {
        axios.get('http://localhost:8080/homes/search')
            .then(response => {
                setSearch(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    function convertVietnamese(text) {
        const mapChars = {
            'á': 'a',
            'à': 'a',
            'ả': 'a',
            'ã': 'a',
            'ạ': 'a',
            'â': 'a',
            'ấ': 'a',
            'ầ': 'a',
            'ẩ': 'a',
            'ẫ': 'a',
            'ậ': 'a',
            'ă': 'a',
            'ắ': 'a',
            'ằ': 'a',
            'ẳ': 'a',
            'ẵ': 'a',
            'ặ': 'a',
            'đ': 'd',
            'é': 'e',
            'è': 'e',
            'ẻ': 'e',
            'ẽ': 'e',
            'ẹ': 'e',
            'ê': 'e',
            'ế': 'e',
            'ề': 'e',
            'ể': 'e',
            'ễ': 'e',
            'ệ': 'e',
            'í': 'i',
            'ì': 'i',
            'ỉ': 'i',
            'ĩ': 'i',
            'ị': 'i',
            'ó': 'o',
            'ò': 'o',
            'ỏ': 'o',
            'õ': 'o',
            'ọ': 'o',
            'ô': 'o',
            'ố': 'o',
            'ồ': 'o',
            'ổ': 'o',
            'ỗ': 'o',
            'ộ': 'o',
            'ơ': 'o',
            'ớ': 'o',
            'ờ': 'o',
            'ở': 'o',
            'ỡ': 'o',
            'ợ': 'o',
            'ú': 'u',
            'ù': 'u',
            'ủ': 'u',
            'ũ': 'u',
            'ụ': 'u',
            'ư': 'u',
            'ứ': 'u',
            'ừ': 'u',
            'ử': 'u',
            'ữ': 'u',
            'ự': 'u',
            'ý': 'y',
            'ỳ': 'y',
            'ỷ': 'y',
            'ỹ': 'y',
            'ỵ': 'y'
        };

        return text
            .toLowerCase()
            .trim()
            .replace(/[áàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/g, function (matched) {
                return mapChars[matched];
            })
            .replace(/[^a-zA-Z0-9 ]/g, '');
    }

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            setCheckIn(dates[0]);
            setCheckOut(dates[1]);
        } else {
            setCheckIn("");
            setCheckOut("");
        }
    };

    const handleSearch = () => {
        const filteredHomes = search.filter(home => {
            const checkinDate = new Date(home.checkin);
            const checkoutDate = new Date(home.checkout);
            const currentDate = new Date(checkIn);

            return (
                (bedrooms === '' || home.bedroom == bedrooms) &&
                (bathrooms === '' || home.bathroom == bathrooms) &&
                (address === '' || convertVietnamese(home.address).includes(address)) &&
                (checkIn === '' || checkOut === '' || currentDate < checkinDate || currentDate > checkoutDate) &&
                (minPrice === '' || home.priceByDay >= minPrice) &&
                (maxPrice === '' || home.priceByDay <= maxPrice)
            );
        });



        if (filteredHomes.length !== 0) {
            Swal.fire({
                title: 'Đang tìm kiếm...',
                text: `Tìm thấy ${filteredHomes.length} ngôi nhà phù hợp với tiêu chí của bạn.`,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                props.onHomesReceived(filteredHomes);
            });
        } else {
            Swal.fire({
                title: 'Đang tìm kiếm...',
                text: `Không tìm thấy ngôi nhà nào phù hợp với tiêu chí của bạn`,
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <div>
            <div className="container">
                <div className="search-area-inner">
                    <div className="search-contents ">
                        <div className="row">
                            <div className="col-6 col-lg-3">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="selectpicker search-fields"
                                        value={address} placeholder={" Nhập địa chỉ..."}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/*so phong ngu*/}
                            <div className="col-6 col-lg-3 col-md-3">
                                <div className="form-group">
                                    <select className="selectpicker search-fields"
                                            value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                                        <option value={""}>Chọn số phòng ngủ</option>
                                        <option value={"1"}>1 phòng ngủ</option>
                                        <option value={"2"}>2 phòng ngủ</option>
                                        <option value={"3"}>3 phòng ngủ</option>
                                        <option value={"4"}>4 phòng ngủ</option>
                                        <option value={"5"}>5 phòng ngủ</option>
                                        <option value={"6"}>6 phòng ngủ</option>
                                        <option value={"7"}>7 phòng ngủ</option>
                                        <option value={"8"}>8 phòng ngủ</option>
                                        <option value={"9"}>9 phòng ngủ</option>
                                        <option value={"10"}>10 phòng ngủ</option>
                                    </select>
                                </div>
                            </div>

                            {/*so phong tam*/}
                            <div className="col-6 col-lg-3 col-md-3">
                                <div className="form-group">
                                    <select className="selectpicker search-fields" value={bathrooms}
                                            onChange={(e) => setBathrooms(e.target.value)}>
                                        <option value={""}>Chọn số phòng tắm</option>
                                        <option value={"1"}>1 phòng tắm</option>
                                        <option value={"2"}>2 phòng tắm</option>
                                        <option value={"3"}>3 phòng tắm</option>
                                    </select>
                                </div>
                            </div>

                            {/*nut tim kiem*/}
                            <div className="col-6 col-lg-3 col-md-3">
                                <div className="form-group">
                                    <button className="btn btn-block btn-4"
                                            onClick={handleSearch}>Tìm kiếm
                                    </button>
                                </div>
                            </div>

                            <div className="col-6 col-lg-3 col-md-3">
                                <div className="form-group">
                                        <RangePicker style={{height: 49, width: 510,marginTop:2}}
                                                     onChange={handleDateChange}
                                                     placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}/>
                                </div>
                            </div>

                            {/*gia thap*/}
                            <div style={{marginLeft: 270}} className="col-6 col-lg-3 col-md-3">
                                <div className="form-group">
                                    <input className={"form-box search-fields"} type="number"
                                           placeholder="  Giá thấp nhất VNĐ" value={minPrice}
                                           onChange={(e) => setMinPrice(e.target.value)}/>
                                </div>
                            </div>
                            {/*gia sau*/}
                            <div className="col-6 col-lg-3 col-md-3">
                                <div className="form-group">
                                    <input className={"form-box search-fields"} type="number"
                                           placeholder="  Giá cao nhất VNĐ" value={maxPrice}
                                           onChange={(e) => setMaxPrice(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;