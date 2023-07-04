import React from 'react';
import {Link} from "react-router-dom";

function Footer(props) {
    return (
        <div>
            <footer className="footer-1">
                <div className="container footer-inner">
                    <div className="row">
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <div className="footer-item">
                                <h4>Liên lạc với chúng tôi</h4>
                                <ul className="contact-info">
                                    <li>
                                        <i className="flaticon-facebook-placeholder-for-locate-places-on-maps"></i>
                                        23 lô tt01 KĐT MonCity, Mỹ Đình, Nam Từ Liêm, Hà Nội
                                    </li>
                                    <li>
                                        <i className="fa fa-envelope"></i><a
                                        href="mailto:sales@hotelempire.com">trinhnam180697@gmail.com</a>
                                    </li>
                                    <li>
                                        <i className="fa fa-phone"></i><a href="tel:+55-417-634-7071">+084 369 324 197</a>
                                    </li>
                                    <li>
                                        <i className="fa fa-fax"></i>+08888 8888 888
                                    </li>
                                    <li>
                                        <i className="fa fa-skype"></i><a
                                        href="mailto:info@green.com">hoanggh2108@gmail.com</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6">

                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                            <div className="footer-item">
                                <h4>
                                    Liên kết
                                </h4>
                                <ul className="links">
                                    <li>
                                        <Link to={"/"} ><i className="fa fa-angle-right"></i>Trang chủ</Link>
                                    </li>
                                    <li>
                                        <a href="/coming-soon"><i className="fa fa-angle-right"></i>Thông tin chung</a>
                                    </li>
                                    <li>
                                        <a href="/coming-soon"><i className="fa fa-angle-right"></i>Dịch vụ</a>
                                    </li>
                                    <li>
                                        <a href="/coming-soon"><i className="fa fa-angle-right"></i>Liên lạc</a>
                                    </li>
                                    <li>
                                        <a href="/coming-soon"><i className="fa fa-angle-right"></i>Mạng lưới</a>
                                    </li>
                                    <li>
                                        <a href="/coming-soon"><i className="fa fa-angle-right"></i>Bài đăng</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-3 col-md-6 col-sm-6">
                            <div className="footer-item clearfix">
                                <div className="submitNewsletter">
                                    <h4>Theo dõi</h4>
                                    <div className="Subscribe-box">
                                        <p>Tận dụng ngôi nhà của bạn và biến nó thành một homestay đáng yêu và độc đáo.
                                            Với không gian ấm cúng và trải nghiệm độc đáo mà bạn cung cấp, hãy mở ra cánh
                                            cửa để mang đến cho du khách một trải nghiệm tuyệt vời.!</p>
                                        <form action="#" method="GET">
                                            <input type="text" className="form-contact" name="email"
                                                   placeholder="Enter Address"/>
                                            <button type="submit" name="submitNewsletter" className="btn btn-color">
                                                <i className="fa fa-paper-plane"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sub-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-md-12">
                                <p className="copy">© 2023 <a href="#">AECC</a> Đã đăng ký bản quyền.</p>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <ul className="social-list clearfix">
                                    <li><a href="#" className="facebook-bg"><i className="fa fa-facebook"></i></a></li>
                                    <li><a href="#" className="twitter-bg"><i className="fa fa-twitter"></i></a></li>
                                    <li><a href="#" className="google-bg"><i className="fa fa-google-plus"></i></a></li>
                                    <li><a href="#" className="linkedin-bg"><i className="fa fa-linkedin"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;