import './App.css';
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage";
import CreateNewHotel from "./components/NewHotel";
import ComingSoon from "./components/ComingSoon";
import HotelDetails from "./components/HotelDetails";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import UserProfile from "./components/Login/UserProfile";
import 'react-toastify/dist/ReactToastify.css';
import EditHotel from "./components/EditHotel";
import Recent from "./components/recent";
import BookingsOfCustomer from "./components/Login/BookingsOfCustomer";
import React from "react";
import Page404 from "./components/404/Page404";
import ListHomeByHomeType from "./components/ListHomeByHomeType";
import MapPage from "./components/map/MapPage";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<HomePage/>}></Route>
                <Route path={'/create'} element={<CreateNewHotel/>}></Route>
                <Route path={'/coming-soon'} element={<ComingSoon/>}></Route>
                <Route path={'/viewHome/:id'} element={<HotelDetails/>}></Route>
                <Route path={'/login'} element={<Login />}></Route>
                <Route path={'/register'} element={<Register/>}></Route>
                <Route path={'/user'} element={<UserProfile/>}></Route>
                <Route path={'/edit/:id'} element={<EditHotel/>}></Route>
                <Route path={'/recent'} element={<Recent/>}></Route>
                <Route path={'/bookings'} element={<BookingsOfCustomer/>}></Route>
                <Route path={'/edit/:id'} element={<EditHotel/>}></Route>
                <Route path={'/category/:id'} element={<ListHomeByHomeType/>}></Route>
                <Route path={'/map'} element={<MapPage/>}></Route>
                <Route path={"*"} element={<Page404/>}></Route>
            </Routes>
            <Outlet/>
        </BrowserRouter>
    )
}

export default App;
