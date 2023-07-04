import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Search from "../Search";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

function MainHeader(props) {
    const [categoryHome, setCategoryHome] = useState([])
    const data = localStorage.getItem("user");
    const [room, setRoom] = useState("1");
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        socket.emit("join_room", room);
        socket.on("receive_message", (res) => {
            const data = { uId: res.message.uId, name: res.message.name, avatar: res.message.avatar, timeN: res.message.time };
            setNotifications(prevNotifications => {
                // Kiểm tra xem phần tử đã tồn tại trong mảng chưa
                const isDuplicate = prevNotifications.some(
                    notification => notification.uId === data.uId
                );

                if (isDuplicate) {
                    return prevNotifications; // Không thêm phần tử nếu đã tồn tại
                } else {
                    return [data, ...prevNotifications]; // Thêm phần tử mới vào mảng
                }
            });
        });
    }, [socket]);
    console.log("res.message", notifications);


    const removeNotification = (index1) => {
        const updatedNotifications = [...notifications];
        updatedNotifications.splice(index1, 1);
        setNotifications(updatedNotifications);
    };

    let roles = null;
    if (data != null) {
        roles = JSON.parse(localStorage.getItem("user")).roles[0].authority
    } else {
        roles = null;
    };
    useEffect(()=>{
        axios.get("http://localhost:8080/user/hometypes/")
            .then(res => {
                setCategoryHome(res.data);
                console.log("categoryHome",categoryHome)
            })
    },[])

    return (
        <div>
            <header className="main-header sticky-header" id="main-header-2">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav className="navbar navbar-expand-lg navbar-light rounded">
                                <a className="navbar-brand logo2" href="/">
                                    <img
                                        src={"https://firebasestorage.googleapis.com/v0/b/react-demo-d28f4.appspot.com/o/logo%2Flogo-white.png?alt=media&token=88cdba59-84da-40a8-8141-d3aa0cab9574"}
                                        height={'55px'} alt="logo"/>
                                </a>
                                <button className="navbar-toggler" type="button" id="drawer">
                                    <span className="fa fa-bars"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbar">

                                    <ul className="navbar-nav  justify-content-center">
                                        <li className="nav-item dropdown active">
                                            <Link className="nav-link dropdown-toggle" to={"/"}
                                                  id="change-font-size" data-toggle="dropdown"
                                                  aria-haspopup="true" aria-expanded="false">
                                                Trang chủ
                                            </Link>
                                        </li>
                                    </ul>
                                    {roles ? (
                                        <>
                                            {roles === "ROLE_ADMIN" ? (
                                                <>
                                                    <ul className="navbar-nav  justify-content-center">
                                                        <li className="nav-item dropdown">
                                                            <Link to={""} className="nav-link dropdown-toggle" href="#"
                                                                  id="change-font-size" data-toggle="dropdown"
                                                                  aria-haspopup="true" aria-expanded="false">
                                                                Danh sách tài khoản
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </>
                                            ) : (
                                                <>
                                                    {roles === "ROLE_USER" ? (
                                                        <>
                                                            <ul className="navbar-nav  justify-content-center">
                                                                <li className="nav-item dropdown">
                                                                    <Link to={"/user"}
                                                                          className="nav-link dropdown-toggle" href="#"
                                                                          id="change-font-size"
                                                                          data-toggle="dropdown" aria-haspopup="true"
                                                                          aria-expanded="false">
                                                                        Tài khoản
                                                                    </Link>
                                                                </li>
                                                                <li className="nav-item dropdown">
                                                                    <Link to={"/"} className="nav-link dropdown-toggle"
                                                                          href="#"
                                                                          id="change-font-size" role="button"
                                                                          data-toggle="dropdown"
                                                                          aria-haspopup="true" aria-expanded="false">
                                                                        Danh Mục
                                                                    </Link>
                                                                    <ul className="dropdown-menu"
                                                                        aria-labelledby="navbarDropdownMenuLink">
                                                                        {categoryHome.map((category,index)=>(
                                                                            <li key={index}><a  className="dropdown-item" href={`/category/${category.id}`}>{category.name}</a></li>
                                                                        ))}

                                                                    </ul>
                                                                </li>
                                                                <li className="nav-item dropdown ">
                                                                    <a className="nav-link dropdown-toggle notification-ui_icon"
                                                                       href="#" id="navbarDropdown" role="button"
                                                                       data-toggle="dropdown" aria-haspopup="true"
                                                                       aria-expanded="false">
                                                                        <i className="fa fa-bell">{notifications.length}</i>
                                                                        <span className="unread-notification"></span>
                                                                    </a>
                                                                    <div className="dropdown-menu notification-ui_dd"
                                                                         aria-labelledby="navbarDropdown">
                                                                        <div className="notification-ui_dd-header">
                                                                            <h3 className="text-center">Thông Báo</h3>
                                                                        </div>
                                                                        <div className="notification-ui_dd-content">
                                                                            <div
                                                                                className="notification-list notification-list--unread">
                                                                                {notifications.length!==0?(
                                                                                    <>  {notifications.map((item, index) => (
                                                                                        <div className="notification-list_img" key={index}>
                                                                                            <img src={item.avatar} alt="user" style={{ width: "40px", height: "40px" }} />
                                                                                            <p><b>{item.name}: Đã Booking</b></p>
                                                                                            <p><small>{item.timeN}</small></p>
                                                                                            <button onClick={() => removeNotification(index)}>Xóa</button>
                                                                                        </div>
                                                                                    ))}
                                                                                    </>

                                                                                ):(
                                                                                    <>
                                                                                        <p>không có thông báo</p>
                                                                                    </>
                                                                                )}




                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </li>

                                                            </ul>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ul className="navbar-nav  justify-content-center">
                                                                <li className="nav-item dropdown">
                                                                    <Link to={"/"} className="nav-link dropdown-toggle"
                                                                          href="#"
                                                                          id="change-font-size" role="button"
                                                                          data-toggle="dropdown"
                                                                          aria-haspopup="true" aria-expanded="false">
                                                                        Danh Mục
                                                                    </Link>
                                                                    <ul className="dropdown-menu"
                                                                        aria-labelledby="navbarDropdownMenuLink">
                                                                        {categoryHome.map((category,index)=>(
                                                                            <li key={index}><a className="dropdown-item" href={`/category/${category.id}`}>{category.name}</a></li>
                                                                        ))}

                                                                    </ul>
                                                                </li>
                                                                {/* cho dang sua*/}
                                                                <li className="nav-item dropdown">
                                                                    <Link to={"/user"}
                                                                          className="nav-link dropdown-toggle" href="#"
                                                                          id="change-font-size"
                                                                          data-toggle="dropdown" aria-haspopup="true"
                                                                          aria-expanded="false">
                                                                        Tài khoản
                                                                    </Link>
                                                                </li>
                                                                {/* ket thu sua*/}
                                                            </ul>
                                                        </>
                                                    )}

                                                </>
                                            )}

                                        </>
                                    ) : (
                                        <>

                                        </>
                                    )}
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default MainHeader;