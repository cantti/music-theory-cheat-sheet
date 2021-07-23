import React from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import { discography } from '../data/discography';
import _ from 'lodash';

export const AboutMe = () => {
    return (
        <>
            <h1 className="display-4">Обо мне</h1>
            <p>
                Музыкант из Санкт-Петербурга. В основном работаю в жанре
                регги-даб под псевдонимом <b>Cantti</b>. Также есть релизы в
                жанре Synthwave под псевдонимом <b>Imminent State</b>. Ниже —
                список моих альбомов со ссылками на Bandcamp, где их можно
                купить. Также все альбомы доступны в стримминговых сервисах.
            </p>
            <Row>
                {_.orderBy(discography, (x) => x.date, ['desc']).map(
                    (album, index) => (
                        <Col xs={12} md={6} lg={3} key={index}>
                            <Card className="mb-3">
                                <Card.Img variant="top" src={album.image} />
                                <Card.Body>
                                    <Card.Title>
                                        {album.artist}
                                        <br />
                                        {album.title}{' '}
                                        <span className="text-secondary">
                                            ({album.date.getFullYear()})
                                        </span>
                                    </Card.Title>
                                    <Card.Link
                                        href={album.link}
                                        target="_blank"
                                    >
                                        Купить
                                    </Card.Link>
                                    {!!album.hyperFollow && (
                                        <Card.Link
                                            href={album.hyperFollow}
                                            target="_blank"
                                        >
                                            Прослушать
                                        </Card.Link>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                )}
            </Row>
        </>
    );
};
