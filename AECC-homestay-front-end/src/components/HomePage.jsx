import TopHeader from "./header/TopHeader";
import MainHeader from "./header/MainHeader";
import Footer from "./footer/Footer";
import Recent from "./recent";
import ListHomestay from "./ListHomestay";
import Search from "./Search";
import React, {useState} from "react";
import SearchResult from "./SearchResult";
import MapPage from "./map/MapPage";


function HomePage(props) {
    const [homes, setHomes] = useState([]);
    const [showSearchResult, setShowSearchResult] = useState(false);

    const handleHomesReceived = (homes) => {
        setHomes(homes);
        setShowSearchResult(true)
    };

    return (
        <div>
            {/*Top header start*/}
            <TopHeader/>
            {/* Top header end */}

            {/* main header start */}
            <MainHeader/>
            {/* main header end */}
            {/* Banner start */}
            <div className="banner banner-bg" id="particles-banner-wrapper">
                <div id="particles-banner-2"></div>
                <div className="search-area sa-show-2" id="search-area-4">
                    <Search onHomesReceived={handleHomesReceived}/>
                </div>
                {/* Search area end */}
            </div>
            {/*List homestay*/}
            <div>
                {showSearchResult ? (
                    <SearchResult searchResult={homes} />
                ) : (
                    <ListHomestay />
                )}
            </div>

            {/* Featured properties end */}

            {/*Recent hear*/}
            <Recent/>
            {/*Recent hear end*/}

            {/* Footer start */}
            <Footer/>
            {/* Footer end */}
        </div>
    );
}

export default HomePage;