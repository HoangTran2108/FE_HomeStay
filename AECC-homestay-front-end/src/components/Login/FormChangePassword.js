import React, {useEffect, useState} from 'react';
import axios from "axios";
import {ErrorMessage, Formik} from "formik";
import * as Yup from "yup";
import Button from "../button/Button";
import Swal from 'sweetalert2';

function FormChangePassword(props) {
    const user = props.user;
    const [reloadKey, setReloadKey] = useState(0);
    const initialValue = {
        oldPassword: "",
        password: "",
        confirmPassword: ""
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Vui lòng nhập mật khẩu mới')
            .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận phải khớp với mật khẩu mới')
            .required('Vui lòng xác nhận mật khẩu mới'),
    });

    const reloadComponent = () => {
        setReloadKey(prevKey => prevKey + 1);
    };

    return (
        <div key={reloadKey}>
            <Formik initialValues={initialValue}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        axios
                            .put(`http://localhost:8080/change/${user.id}`, values)
                            .then((response) => {
                                let mes = response.data.message;
                                Swal.fire({
                                    icon: 'success',
                                    text: mes,
                                    showConfirmButton:false,
                                    timer:1000
                                });
                                reloadComponent()
                            })
                            .catch((error) => {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Đã xảy ra sự cố',
                                    text: error.response.data.message,
                                });
                            });
                    }}
                    enableReinitialize={true}>
                {formik => (
                    <form onSubmit={formik.handleSubmit}>
                        <div className="row">
                            <div className="col-lg-12 ">
                                <div className="form-group number">
                                    <label>Tên tài khoản</label>
                                    <input readOnly type="text" value={user.username} className="form-control"
                                           placeholder="Tên tài khoản"/>
                                </div>
                            </div>
                            <div className="col-lg-12 ">
                                <div className="form-group number">
                                    <label>Mật khẩu hiện tại</label>
                                    <input type="password" {...formik.getFieldProps("oldPassword")} className="form-control"
                                           placeholder="Nhập mật khẩu hiện tại"/>
                                </div>
                            </div>
                            <div className="col-lg-12 ">
                                <div className="form-group number">
                                    <label>Mật khẩu mới</label>
                                    <input type="password" {...formik.getFieldProps("password")} className="form-control"
                                           placeholder="Nhập mật khẩu mới"/>
                                    <span style={{color: 'red', fontSize: 12}}><ErrorMessage
                                        name={"password"}></ErrorMessage></span>
                                </div>
                            </div>
                            <div className="col-lg-12 ">
                                <div className="form-group number">
                                    <label>Xác nhận mật khẩu mới</label>
                                    <input type="password" {...formik.getFieldProps("confirmPassword")}
                                           className="form-control"
                                           placeholder="Nhập lại mật khẩu mới"/>
                                    <span style={{color: 'red', fontSize: 12}}><ErrorMessage
                                        name={"confirmPassword"}></ErrorMessage></span>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="send-btn">
                                    <Button name={"Đổi mật khẩu"}/>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}

export default FormChangePassword;