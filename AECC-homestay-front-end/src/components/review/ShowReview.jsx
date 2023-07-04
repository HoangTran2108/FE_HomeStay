import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import ReviewForm from './ReviewForm';
import axios from 'axios';
import {Pagination} from 'antd';

function ShowReview(props) {
    const [reviews, setReviews] = useState([]);
    const homeId = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const ratingAvg = props.avgRating;
    const reviewsPerPage = 3; // Số đánh giá hiển thị trên mỗi trang
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/review/get-review/${homeId.id}`
                );
                setReviews(response.data);
            } catch (error) {
                console.error(error.message);
                // Handle error, show error message, etc.
            }
        };

        setTimeout(() => {
            fetchReviews();
        }, 1000);
    });

    // Xác định đánh giá hiển thị trên trang hiện tại
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    // Chuyển đến trang mới
    const handleChangePage = (page) => setCurrentPage(page);

    // Kiểm tra xem có đủ dữ liệu để hiển thị phân trang hay không
    const shouldPaginate = reviews.length > reviewsPerPage;

    return (
        <div>
            <h3 className="heading-3">Đánh giá</h3>
            {reviews.length === 0 ? (
                <p>Hiện chưa có review nào về nhà này.</p>
            ) : (
                <div className={'col-md-12'}>
                    <p>
                        <i className="fa fa-star"></i> {ratingAvg} · {reviews.length} đánh giá
                    </p>
                    <ul>
                        {currentReviews.map((review) => (
                            <div key={review.id}>
                                <div className={'review-avatar'}>
                                    <img src={review.users.avatar} className={'avatar-custom'} alt="avatar"/>
                                    {review.users.name}
                                </div>
                                <li className={'review-comment'} style={{paddingLeft: 0}}>
                                    {review.comment}
                                </li>
                            </div>
                        ))}
                    </ul>
                    {/* Phân trang */}
                    {shouldPaginate && (
                        <Pagination
                            current={currentPage}
                            total={reviews.length}
                            pageSize={reviewsPerPage}
                            onChange={handleChangePage}
                            showSizeChanger={false}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default ShowReview;
