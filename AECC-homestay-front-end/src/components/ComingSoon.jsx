import React from 'react';

function ComingSoon(props) {
    return (
        <div>
            <div className="banner coming-soon">
                <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                    <div className="">
                        <div className="active item-bg">
                            <img className="d-block w-100 h-100" src={"assets/img/banner/img-4.jpg"} alt="banner"/>
                            <div className="carousel-caption banner-slider-inner d-flex h-100">
                                <div className="carousel-content container">
                                    <div className="cmt">
                                        <a href="/">
                                            <img src={"assets/img/logos/white.png"} height={'70px'} alt="logo"/>
                                        </a>
                                    </div>
                                    <div className="cm" style={{width:"105%"}}>
                                        <h1>Tính năng đang phát triển!</h1>
                                        <p style={{textTransform:'uppercase'}}>Chúng tôi đang làm việc chăm chỉ để mang lại trải nghiệm tốt nhất cho bạn</p>
                                        {/*<a href="#" className="btn btn-lg btn-white-lg-outline">Subscribe</a>*/}
                                        {/*<a href="#" className="btn btn-lg btn-white-lg-outline">Contact</a>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComingSoon;