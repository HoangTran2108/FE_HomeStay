import React, {useState} from "react";
import {Button} from "antd";
import CancelRequest from "./CancelRequest";
import CheckedCustomer from "./CheckedCustomer";
import UncheckedCustomer from "./UncheckedCustomer";


export default function ListBookingByOwner(props) {
    const user = props.user;
    const [showCancelRequest, setShowCancelRequest] = useState(false);
    const [showCheckedCustomer, setShowCheckedCustomer] = useState(false);
    const [showUncheckedCustomer, setShowUncheckedCustomer] = useState(true);
    const [activeButton, setActiveButton] = useState('uncheckedCustomer');

    const handCancelRequest = () => {
        setShowCancelRequest(true);
        setShowCheckedCustomer(false);
        setShowUncheckedCustomer(false)
        setActiveButton('cancelRequest');
    }
    const handleCheckedCustomer = () => {
        setShowCancelRequest(false);
        setShowCheckedCustomer(true);
        setShowUncheckedCustomer(false)
        setActiveButton('checkedCustomer');
    }

    const handleShowUncheckedCustomer = () => {
        setShowCancelRequest(false);
        setShowCheckedCustomer(false);
        setShowUncheckedCustomer(true);
        setActiveButton('uncheckedCustomer');

    };

    return (
        <div>
            <table>
                <tr>
                    <td>
                        <Button onClick={handleShowUncheckedCustomer}
                                className={activeButton === "uncheckedCustomer" ? 'active' : ''}
                                style={{
                                    backgroundColor: activeButton === "uncheckedCustomer" ? '#3F56FF' : 'transparent',
                                    color: activeButton === "uncheckedCustomer" ? '#ffffff' : '#000000',
                                    width: 250,
                                    height: 40,
                                    fontSize: 15,
                                }}
                        >
                            Chưa thanh toán
                        </Button>
                    </td>
                    <td>
                        <Button onClick={handleCheckedCustomer}
                                className={activeButton === "checkedCustomer" ? 'active' : ''}
                                style={{
                                    backgroundColor: activeButton === "checkedCustomer" ? '#3F56FF' : 'transparent',
                                    color: activeButton === "checkedCustomer" ? '#ffffff' : '#000000',
                                    width: 250,
                                    height: 40,
                                    fontSize: 15,
                                }}
                        >
                            Đã thanh toán
                        </Button>
                    </td>
                    <td>
                        <Button onClick={handCancelRequest}
                                className={activeButton === "cancelRequest" ? 'active' : ''}
                                style={{
                                    backgroundColor: activeButton === "cancelRequest" ? '#3F56FF' : 'transparent',
                                    color: activeButton === "cancelRequest" ? '#ffffff' : '#000000',
                                    width: 250,
                                    height: 40,
                                    fontSize: 15,
                                }}
                        >
                            Đã hủy
                        </Button>
                    </td>
                </tr>
            </table>
            <div>
                <div>
                    <div>
                        {showCancelRequest ? (
                            <div>
                                <CancelRequest user={user}/>
                            </div>
                        ) : null}
                        {showCheckedCustomer ? (
                            <div>
                                <CheckedCustomer user={user}/>
                            </div>
                        ) : null}
                        {showUncheckedCustomer ? (
                            <div>
                                <UncheckedCustomer user={user}/>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

