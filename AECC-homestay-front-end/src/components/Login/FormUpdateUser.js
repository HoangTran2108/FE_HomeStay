import React, {useState} from 'react';
import axios from "axios";
import {ErrorMessage, Formik} from "formik";
import Button from "../button/Button";
import Swal from 'sweetalert2';

function FormUpdateUser(props) {
    const user = props.user;
    const imgUrl = props.imgUrl;
    const [current, setCurrent] = useState({});

    const initialValue = {
        name: user.name || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
        avatar: user.avatar || "",
        email: user.email || "",
    };
    return (
        <Formik initialValues={initialValue}
                onSubmit={(values) => {
                    values.avatar = imgUrl;
                    axios
                        .put(`http://localhost:8080/${user.id}`, values)
                        .then(() => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Sửa thông tin thành công',
                                position: 'center',
                                showConfirmButton: false,
                                timer: 1000
                            });
                        })
                        .catch((err) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Đã xảy ra sự cố',
                                text: `${err}`,
                            });
                        });
                }}
                enableReinitialize={true}>
            {formik => (
                <form onSubmit={formik.handleSubmit}>
                    <div className="row">
                        <div className="col-lg-12 ">
                            <div className="form-group name">
                                <label>Họ và tên</label>
                                <input type="text" {...formik.getFieldProps("name")} className="form-control"
                                       placeholder="..."/>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group email">
                                <label>Số điện thoại</label>
                                <input type="text" {...formik.getFieldProps("phoneNumber")} className="form-control"
                                       placeholder="Nhập số điện thoại"/>
                                <span style={{color: 'red', fontSize: 12}}><ErrorMessage
                                    name={"phoneNumber"}></ErrorMessage></span>
                            </div>
                        </div>
                        <div className="col-lg-12 ">
                            <div className="form-group number">
                                <label>Email</label>
                                <input readOnly type="email" {...formik.getFieldProps("email")} className="form-control"
                                       placeholder="Email"/>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="form-group message">
                                <label>Địa chỉ</label>
                                <textarea className="form-control" {...formik.getFieldProps("address")}
                                          placeholder="Nhập địa chỉ"></textarea>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="send-btn">
                                <Button name={"Cập nhật"}/>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
}

export default FormUpdateUser;