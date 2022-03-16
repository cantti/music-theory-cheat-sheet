import React from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import { discography } from '../data/discography';
import _ from 'lodash';

export const AboutMe = () => {
    return (
        <>
            <h1 className="display-4">About me</h1>
            <p>
                Musician from St. Petersburg. I mainly work in the reggae dub
                genre under the pseudonym Cantti. There are also releases in the
                Synthwave genre under the pseudonym Imminent State. Below is a
                list of my albums with links to Bandcamp where you can buy them.
                All albums are also available on streaming services.
            </p>
            <p>
                Recently I started my{' '}
                <a
                    href="https://www.youtube.com/channel/UCS26LO1Y8E8ACgkgv7sOd7A"
                    rel="noreferrer"
                    target="_blank"
                >
                    Youtube Channel
                </a>
                .
            </p>
            <p>Below is a partial list of my music releases.</p>
            <Row>
                {_.orderBy(discography, (x) => x.date, ['desc']).map(
                    (album, index) => (
                        <Col xs={12} md={6} lg={3} key={index}>
                            <Card className="mb-3">
                                <Card.Img
                                    variant="top"
                                    src={
                                        process.env.PUBLIC_URL +
                                        '/album-covers/' +
                                        album.image
                                    }
                                />
                                <Card.Body>
                                    <Card.Title>
                                        {album.artist}
                                        <br />
                                        {album.title}{' '}
                                        <span className="text-secondary">
                                            (
                                            {album.date
                                                ? album.date.getFullYear()
                                                : ''}
                                            )
                                        </span>
                                    </Card.Title>
                                    {album.link != null && (
                                        <Card.Link
                                            href={album.link}
                                            target="_blank"
                                        >
                                            Buy
                                        </Card.Link>
                                    )}
                                    {album.hyperFollow != null && (
                                        <Card.Link
                                            href={album.hyperFollow}
                                            target="_blank"
                                        >
                                            Listen
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
