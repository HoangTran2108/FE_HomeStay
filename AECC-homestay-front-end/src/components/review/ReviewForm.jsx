import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Rating} from 'react-simple-star-rating';
import Button from "../button/Button";

const ReviewForm = (props) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [review, setReview] = useState([])
    const homeId = props.homeId;
    const userId = props.userId;

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/review/get-first/home-id=${homeId}/user-id=${userId}`);
                //lấy review hiện tại
                setReview(res.data);
            } catch (err) {
                console.error(err.message);
            }
        };
        fetchReview();
    }, [rating]);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/review/create', {
                homeId, userId, rating, comment,
            });
            console.log(response.data);
            // Handle success, show notification, etc.
        } catch (error) {
            console.error(error.response.data);
            // Handle error, show error message, etc.
        }
    };

    const reviewRating = review.rating;
    const reviewComment = review.comment;
    console.log("commenahjgsdjgas", reviewComment)

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:8080/api/review/${review.id}`, {
                homeId, userId, rating, comment,
            });
            console.log("edit ", res)
        } catch (err) {
            console.log(err.message)
        }
    };

    console.log("review 2", review)

    return (<div>
        {review.length === 0 ? <div>
            {userId !== undefined || userId !== 0 || userId !== null ? (<form onSubmit={handleSubmit}>
                <div>
                    <label>Rating:</label>
                    <Rating
                        initialValue={5}
                        ratingValue={rating}
                        size={20}
                        transition
                        fillColor="#ffc107"
                        emptyColor="#e0e0e0"
                        onClick={handleRatingChange}
                    />
                </div>
                <div>
                    <label>Comment:</label>
                    <textarea
                        value={comment}
                        cols={50}
                        rows={5}
                        style={{resize: 'none'}}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                <Button name={"Đánh giá"}/>
            </form>) : ('')}
        </div> : <>
            {userId !== undefined || userId !== 0 || userId !== null ? (<form onSubmit={handleEdit}>
                <div>
                    <label>Rating:</label>
                    <Rating
                        initialValue={reviewRating}
                        ratingValue={rating}
                        size={20}
                        transition
                        fillColor="#ffc107"
                        emptyColor="#e0e0e0"
                        onClick={handleRatingChange}
                    />
                </div>
                <input type="hidden" name={"comment"} value={reviewComment}/>
                <Button name={"Chỉnh sửa"}/>
            </form>) : ('')}
        </>}
    </div>);
};

export default ReviewForm;