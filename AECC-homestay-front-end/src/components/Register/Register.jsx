import React from 'react';
import LoginGoogle from "../Login/LoginGoogle";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {registerUser} from "../../redux/apiRequest";
import {Formik, ErrorMessage} from "formik";
import * as Yup from "yup";
import Button from "../button/Button";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

function Register(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialValues = {
        username: "",
        password: "",
        email: "",
        roles: [""]
    };

    const validationSchema = Yup.object({
        username: Yup.string().required("tên tài khoản không được để trống !"),
        password: Yup.string().min(6,"mật khẩu phải ít nhất 6 ký tự").required("mật khẩu không được để trống !"),
        email: Yup.string().email("vui lòng nhập đúng định dạng email !").required("email không được để trống !"),
        roles: Yup.string().required("Vui lòng chọn vai trò người dùng!")
    });

    const handleRegister = (values) => {
        const newUser = {
            username: values.username,
            password: values.password,
            email: values.email,
            roles: [values.roles]
        };
        MySwal.fire({
            title: 'Đang đăng ký tài khoản',
            html: 'Vui lòng chờ trong giây lát...',
            icon: 'info',
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                MySwal.showLoading();
            }
        })
        registerUser(newUser, dispatch, navigate);
    };
    return (
        <div>
            <div className="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto">
                <div className="card card0 border-0">
                    <div className="row d-flex">
                        <div className="col-lg-6">
                            <div className="card1 pb-5">
                                <div className="row justify-content-center">
                                    <img
                                        src="https://pearlriverhotel.vn/wp-content/uploads/2019/07/pearl-river-hotel-home1.jpg"
                                        style={{
                                            width: '680px', marginLeft: '100px', marginTop: '80px',
                                            borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
                                        }}
                                        alt="homestay"/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card2 card border-0 px-4 py-5">
                                <div className="row mb-4 px-3">
                                    <h6 className="mb-0 mr-4 mt-2"><LoginGoogle/></h6>
                                </div>
                                <div className="row px-3 mb-4">
                                    <div className="line"></div>
                                    <small className="or text-center">Or</small>
                                    <div className="line"></div>
                                </div>
                                <Formik initialValues={initialValues}
                                        onSubmit={handleRegister}
                                        validationSchema={validationSchema}>
                                    {formik => (
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="row px-3">
                                                <label className="mb-1"><h6 className="mb-0 text-xl-end">Tên tài
                                                    khoản:</h6></label>
                                                <input {...formik.getFieldProps("username")} type="text"/>
                                                <span style={{color: 'red', fontSize: 12}}><ErrorMessage
                                                    name={"username"}></ErrorMessage></span>
                                            </div>
                                            <br/>
                                            <div className="row px-3">
                                                <label className="mb-1"><h6 className="mb-0 text-xl-end">Mật khẩu:</h6>
                                                </label>
                                                <input {...formik.getFieldProps("password")} type="password" style={{height:43, border:'1px solid #D8D8D8'}}/>
                                                <span style={{color: 'red', fontSize: 12}}><ErrorMessage
                                                    name={"password"}></ErrorMessage></span>
                                            </div>
                                            <br/>
                                            <div className="row px-3">
                                                <label className="mb-1"><h6 className="mb-0 text-xl-end">Email:</h6>
                                                </label>
                                                <input {...formik.getFieldProps("email")} type="text"/>
                                                <span style={{color: 'red', fontSize: 12}}><ErrorMessage
                                                    name={"email"}></ErrorMessage></span>
                                            </div>
                                            <br/>
                                            <div>
                                                <div className="custom-select-wrapper d-flex align-items-center">
                                                    <h6 className="custom-text mb-0">Vai trò : </h6>
                                                    <select
                                                        className="custom-select ml-2" {...formik.getFieldProps("roles")}>
                                                        <option value="">---Vai trò---</option>
                                                        <option value="ROLE_USER">Người bán</option>
                                                        <option value="ROLE_CUSTOMER">Người thuê</option>
                                                    </select>
                                                    <div className="custom-select-arrow"></div>
                                                    <span style={{color: 'red', fontSize: 12, marginLeft:7}}><ErrorMessage
                                                        name={"roles"}></ErrorMessage></span>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="row mb-3 px-3">
                                                <Button name={"ĐĂNG KÝ"}/>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                                <div className="row mb-4 px-3">
                                    <small className="font-weight-bold">Bạn đã có tài khoản ?
                                        <Link to={"/login"} className="text-danger"> Đăng nhập</Link></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Register;