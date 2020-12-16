import React from "react";
import { Carousel, Row } from "react-bootstrap";
import { discography } from "../data/discography";

const DiscographyList = () => {
    const [index, setIndex] = React.useState(0);

    return (
        <>
            <div className="d-flex justify-content-center mb-3">
                <Row className="justify-content-center">
                    <Carousel
                        className="col-md-8 col-lg-6"
                        activeIndex={index}
                        onSelect={(selectedIndex) => setIndex(selectedIndex)}
                    >
                        {discography.map((album) => (
                            <Carousel.Item
                                key={album.title}
                                as="a"
                                href={album.link}
                                target="_blank"
                            >
                                <img
                                    className="d-block w-100"
                                    src={album.image}
                                    alt="First slide"
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Row>
            </div>
            <div className="d-flex justify-content-center">
                <h3>{discography[index].title}</h3>
            </div>
            <div className="d-flex justify-content-center">
                <div>{discography[index].date.getFullYear()}</div>
            </div>
        </>
    );
};

export default DiscographyList;
