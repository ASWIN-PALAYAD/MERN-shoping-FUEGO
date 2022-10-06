import React from "react";
import "./Home.css";
import Carousel from "react-material-ui-carousel";
import bg from "../../Assets/background.jpg";
import bg2 from "../../Assets/background2.jpg";
// import Header from "./Header";


const Home = () => {


    return (
        <>
            {/* Carousel */}
            <div className="banner">
                <Carousel>
                    <img src={bg} className="bgImg" alt="" />
                    <img src={bg2} className="bgImg" alt="" />
                </Carousel>
                <div className="home__content">
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                        <h2 style={{
                            fontFamily: "Segoe Script",
                            fontSize: "3em",
                            fontWeight: "500"
                        }}>Buy 2 Get</h2>
                        <span style={{
                            padding: "10px",
                            backgroundColor: "#fff",
                            margin: "0px 10px",
                            textAlign: "center",
                            width: "150px",
                            height: "40px",
                            color: "#26c",
                            fontFamily: "Segoe Script",
                            fontSize: "2.4em",
                            display: "flex",
                            justifyContent: "center",
                            lineHeight: ".7",
                            alignItems: "center"
                        }}>1 Free</span>
                    </div>
                    <div>
                        <h2 style={{
                            fontSize: "4.5em",
                            fontFamily: "Poppins,sans-serif",
                            color: "#fff",
                        }}>Fashionable</h2>
                    </div>
                    <div>
                        <h2 style={{
                            fontSize: "4.5em",
                            fontWeight: "400",
                            fontFamily: "Poppins,sans-serif",
                            color: "#fff",
                            lineHeight: ".7"
                        }}>Collection</h2>
                    </div>
                    <div>
                        <h2
                            style={{
                                fontWeight: "400",
                                fontFamily: "Poppins,sans-serif",
                                color: "#fff",
                                fontSize: "1em",
                                paddingTop: "10px"
                            }}
                        >
                            Get Free Shipping on all orders over $99.00
                        </h2>
                    </div>
                    <div>
                        <a href="#container">
                            <button type="submit" style={{
                                width: "135px",
                                height: "50px",
                                border: "none",
                                background: "#3BB77E",
                                margin: "10px 0",
                                fontSize: "1.2vmax",
                                color: "#fff",
                                cursor: "pointer"
                            }}
                                className="Home__button"
                            >SHOP NOW</button>
                        </a>
                    </div>
                </div>
            </div>


            <h2 className="homeHeading">Featured Products</h2>
            <div className="container" id="container">
                
            </div>
           
        </>
    );
};
    

export default Home;