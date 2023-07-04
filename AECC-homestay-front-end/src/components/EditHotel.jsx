import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {storage} from '../firebase';
import {useDropzone} from 'react-dropzone';
import Footer from "./footer/Footer";
import TopHeader from "./header/TopHeader";
import MainHeader from "./header/MainHeader";
import Swal from 'sweetalert2';

export default function EditHotel() {
    const { id } = useParams();
    // const nav = useNavigate();
    const [imgUrls, setImgUrls] = useState([]);
    const [progressPercent, setProgressPercent] = useState([]);
    const [homeTypes, setHomeTypes] = useState([]);
    const [showProgressBar, setShowProgressBar] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const [home,setHome]=useState('');
    const [img,setImg]=useState([]);


    // const validationSchema = ;

    useEffect(() => {
        const getHomeType = async () => {
            try {
                const res = await axios.get('http://localhost:8080/user/hometypes/');
                setHomeTypes(res.data);
            } catch (error) {
                console.log(error.message);
            }
        };
        getHomeType();
    }, []);
    useEffect(() => {
        const getHome = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/homes/${id}`);
                setHome(res.data);
                setImg(res.data.image)
            } catch (error) {
                console.log(error.message);
            }
        };
        getHome();
    }, []);

    useEffect(() => {
        // Ẩn thanh tiến trình sau khi tải xong ảnh
        if (imgUrls.length > 0) {
            setShowProgressBar(false);
        }
    }, [imgUrls]);

    const handleImageChange = async (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            if (!isFileValid(file)) {
                alert('Chỉ được chọn file định dạng ảnh JPG/JPEG/PNG.');
            } else {
                const storageRef = ref(storage, `files/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setProgressPercent((prevPercent) => [...prevPercent, progress]);
                    },
                    (error) => {
                        alert(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            setImgUrls((prevUrls) => [...prevUrls, downloadURL]);
                        });
                    }
                );
            }
        });
    };

    const isFileValid = (file) => {
        const allowedExtensions = ['jpeg', 'jpg', 'png'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
    };
    const openPreviewWindow = () => {
        // Tạo cửa sổ mới hoặc pop-up
        const previewWindow = window.open('', '_blank', 'width=800,height=600');

        // Tạo nội dung HTML cho cửa sổ xem trước
        const previewContent = imgUrls
            .map((url, index) => `<img key=${index} src=${url} alt="uploaded file" height={200}/>`)
            .join('');

        // Gán nội dung HTML cho cửa sổ xem trước
        previewWindow.document.body.innerHTML = previewContent;
    };

    const {getRootProps, getInputProps, isDragActive, fileRejections} = useDropzone({
        accept: "image/jpeg, image/png",
        multiple: true,
        onDrop: handleImageChange,
        onDropRejected: (fileRejections) => {
            // Xử lý khi có file bị từ chối
            if (fileRejections && fileRejections.length > 0) {
                const nonImageFiles = fileRejections.map((fileRejection) => fileRejection.file.name).join(', ');
                alert(`Cảnh báo: Các file sau đây không phải là file ảnh: ${nonImageFiles}`);
            }
        },
    });
    if (user === null) {
        return (
            <>
                <h1>Bạn chưa đăng nhập, bạn sẽ chuyển đến trang đăng nhập sau 3 giây</h1>
            </>)
    } else {
        const userId = user.id;
        return (
            <div>
                <Formik
                    initialValues={{
                        name: home.name,
                        address: home.address,
                        bathroom: home.bathroom,
                        bedroom: home.bedroom,
                        description: home.description,
                        priceByDay: home.priceByDay,
                        image: home.image,
                        status: home.status,
                        homeType: home.homeType,
                        users: home.users
                    }}
                    validationSchema={yup.object({
                        name: yup.string().required('Không được để trống.'),
                        address: yup.string().required('Không được để trống.'),
                        bathroom: yup
                            .number()
                            .min(1, 'Ít nhất phải có 1 phòng tắm.')
                            .max(3, 'Nhà bạn nhiều phòng tắm thế, chỉ cần 3 phòng tắm thôi.')
                            .required('Vui lòng nhập số lượng tắm.'),
                        bedroom: yup
                            .number()
                            .min(1, 'Ít nhất phải có 1 phòng ngủ')
                            .max(10, 'Nhà bạn nhiều phòng ngủ thế, chỉ cần 10 phòng ngủ thôi.')
                            .required('Vui lòng nhập số lượng phòng ngủ.'),
                        description: yup.string().nullable().default(null),
                        priceByDay: yup
                            .number()
                            .required('Vui lòng nhập giá.')
                            .positive('Vui lòng nhập giá nhà là số dương.'),
                        status: yup.number().required('Vui lòng chọn trạng thái nhà.'),
                        homeType: yup.object().required('Vui lòng chọn kiểu phòng.'),
                    })}
                    onSubmit={(values) => {
                        saveHome(values)
                    }}
                    enableReinitialize={true}
                >
                    {(formik) => (
                        <>
                            {/* Top header start */}
                            <TopHeader/>
                            {/* Top header end */}

                            {/* main header start */}
                            <MainHeader/>
                            {/* main header end */}

                            {/* Sidenav start */}

                            {/* Sidenav end */}

                            {/* Sub banner start */}
                            <div className="sub-banner">
                                <div className="container">
                                    <div className="breadcrumb-area">
                                        <h1>Sửa Nhà</h1>
                                        <ul className="breadcrumbs">

                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* Sub banner end */}

                            {/* User page start */}
                            <div className="user-page submit-property content-area-7">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="notification-box mb-50">
                                                <h4>Bạn là chủ nhà và muốn biến ngôi nhà của mình thành một homestay hấp
                                                    dẫn, thu hút du khách từ khắp nơi?
                                                </h4>
                                                <p> Với trang web cho thuê homestay của chúng tôi, việc đăng ký và tìm
                                                    kiếm
                                                    homestay trở nên đơn giản và thuận tiện hơn bao giờ hết.
                                                    Tận dụng ngôi nhà của bạn và biến nó thành một homestay đáng yêu và
                                                    độc
                                                    đáo. Với không gian ấm cúng và trải nghiệm độc đáo mà bạn cung cấp,
                                                    hãy
                                                    mở ra cánh cửa cho thuê homestay để mang đến cho du khách một trải
                                                    nghiệm tuyệt vời và giúp bạn tận hưởng lợi ích kinh doanh và thú
                                                    vị.!</p>
                                            </div>

                                            <div className="search-area contact-2">
                                                <div className="search-area-inner">
                                                    <div className="search-contents ">
                                                        <Form onSubmit={formik.handleSubmit}>
                                                            <h3 className="heading-3">Thông tin nhà</h3>
                                                            <div className="row mb-30">
                                                                {/*user id*/}
                                                                <input type={'hidden'} name={'users.id'}/>

                                                                <div className="col-lg-4 col-md-6">
                                                                    <div className="form-group">
                                                                        <label htmlFor={'name'}>Tên nhà</label>
                                                                        <Field className="form-control"
                                                                               name={'name'}></Field>
                                                                        <ErrorMessage name={'name'}/>
                                                                    </div>
                                                                </div>
                                                                {/*loại phòng*/}
                                                                <div className="col-lg-4 col-md-6">
                                                                    <div className="form-group">
                                                                        <label htmlFor={'homeType.id'}>Loại
                                                                            phòng</label>
                                                                        <Field as='select'
                                                                               className="selectpicker search-fields"
                                                                               name={'homeType.id'} id={'homeType'}>
                                                                            <option value={''}>Loại phòng</option>
                                                                            {homeTypes.map((homeType) => {
                                                                                return (
                                                                                    <option key={homeType.id}
                                                                                            value={homeType.id}>{homeType.name}</option>
                                                                                )
                                                                            })}
                                                                        </Field>
                                                                        <ErrorMessage name={'homeType'}/>
                                                                    </div>
                                                                </div>

                                                                {/*địa chỉ*/}
                                                                <div className="col-lg-4 col-md-6">
                                                                    <div className="form-group">
                                                                        <label htmlFor={'address'}>Địa chỉ</label>
                                                                        <Field className="form-control"
                                                                               name={'address'}></Field>
                                                                        <ErrorMessage name={'address'}/>
                                                                    </div>
                                                                </div>

                                                                {/*số phòng ngủ*/}
                                                                <div className="col-lg-4 col-md-6">
                                                                    <div className="form-group">
                                                                        <label htmlFor="bedroom">Số lượng phòng
                                                                            ngủ</label>
                                                                        <Field as="select" name="bedroom"
                                                                               className="selectpicker search-fields">
                                                                            <option>Số phòng ngủ</option>
                                                                            {[...Array(10)].map((_, index) => (
                                                                                <option key={index + 1}
                                                                                        value={index + 1}>{index + 1}</option>
                                                                            ))}
                                                                        </Field>
                                                                        <ErrorMessage name="bedroom"/>
                                                                    </div>
                                                                </div>

                                                                {/*số phòng tắm*/}
                                                                <div className="col-lg-4 col-md-6">
                                                                    <div className="form-group">
                                                                        <label htmlFor="bathroom">Số lượng phòng
                                                                            tắm</label>
                                                                        <Field as="select" name="bathroom"
                                                                               className="selectpicker search-fields">
                                                                            <option>Số phòng tắm</option>
                                                                            {[...Array(3)].map((_, index) => (
                                                                                <option key={index + 1}
                                                                                        value={index + 1}>{index + 1}</option>
                                                                            ))}
                                                                        </Field>
                                                                        <ErrorMessage name="bathroom"/>
                                                                    </div>
                                                                </div>

                                                                {/*giá tiền*/}
                                                                <div className="col-lg-4 col-md-6">
                                                                    <div className="form-group">
                                                                        <label htmlFor={'priceByDay'}>Giá tiền</label>
                                                                        <Field className="form-control" type={'number'}
                                                                               name={'priceByDay'}></Field>
                                                                        <ErrorMessage name={'priceByDay'}/>
                                                                    </div>
                                                                </div>

                                                                {/*mô tả*/}
                                                                <div className="col-lg-8 col-md-6">
                                                                    <div className="form-group">
                                                                        <label htmlFor={'description'}>Mô tả</label>
                                                                        <Field className="form-control" as='textarea'
                                                                               name={'description'}
                                                                               style={{height: "100px"}}></Field>
                                                                        <ErrorMessage name={'description'}/>
                                                                    </div>
                                                                </div>


                                                                {/*trạng thái nhà*/}
                                                                <div className="col-lg-4 col-md-6">
                                                                    <div className="form-group">
                                                                        <label htmlFor="status">Trạng thái nhà</label>
                                                                        <Field as="select" name="status"
                                                                               className="selectpicker search-fields">
                                                                            <option value="">--Trạng thái--</option>
                                                                            <option value={1}>Còn trống</option>
                                                                            <option value={2}>Đang bảo trì</option>
                                                                            <option value={3}>Đã có người thuê</option>
                                                                        </Field>
                                                                        <ErrorMessage name="status"/>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            {/*Ảnh*/}
                                                            <h3 className="heading-3">Ảnh nhà hiện tại</h3>
                                                            <div className="row mb-45" {...getRootProps()}>
                                                                <div className="col-lg-12">
                                                                    <div className="col-lg-12">
                                                                        {img.map(( index) => (
                                                                            <img key={index} src={index} alt="uploaded file" width={215} height={200} />
                                                                        ))}
                                                                    </div>
                                                                    <div id="myDropZone"
                                                                         className="dropzone dropzone-design">
                                                                        <div className="dz-default dz-message">
                                                                            <input {...getInputProps()} name="image"/>
                                                                            <span>Kéo và thả hoặc nhấp để chọn file thêm ảnh mới</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row mb-45">
                                                                {img.length > 0 && (
                                                                    <div className="col-lg-12">
                                                                        <button className="btn btn-4"
                                                                                onClick={openPreviewWindow}>Xem trước
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="col-lg-12">
                                                                <button type={'submit'} className="btn btn-4">Cập nhật
                                                                </button>
                                                            </div>

                                                        </Form>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* User page end */}

                            {/* Footer start */}
                            <Footer/>
                            {/* Footer end */}
                        </>
                    )
                    }
                </Formik>
            </div>
        );
    }


    function saveHome(data) {
        let imgArr = [];
        for (let i = 0; i < imgUrls.length; i++) {
            imgArr[i] = imgUrls[i];
        }
        data.image = imgArr;
        axios.put(`http://localhost:8080/homes/${id}`, data,{
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            Swal.fire({
                position:"center",
                icon:"success",
                title: "Thành công",
                text: "Cập nhật thành công",
                showConfirmButton: true,
            })
        }).catch((err) => {
            Swal.fire({
                position:"center",
                icon:"error",
                title: "Đã xảy ra sự cố",
                text: err.message,
                showConfirmButton: true,
            })
        })
    }
}