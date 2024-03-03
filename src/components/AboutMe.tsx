import _ from 'lodash';
import { discography } from '../data/discography';

export const AboutMe = () => {
    return (
        <>
            <h3>About me</h3>
            <p>
                Musician and software developer currently living in Sweden. I
                mainly work in the reggae dub genre under the pseudonym{' '}
                <b>Cantti</b>. There are also releases in the Synthwave genre
                under the pseudonym <b>Imminent State</b>. Below is a list of my
                albums with links to Bandcamp where you can buy them. All albums
                are also available on streaming services. Recently I started my{' '}
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
            <ul>
                {_.orderBy(discography, (x) => x.date, ['desc']).map(
                    (album, index) => (
                        <li key={index}>
                            <div>
                                {album.artist} - {album.title} (
                                {album.date.getFullYear()})
                            </div>
                            <div className="fw-light">{album.genre}</div>
                            <div>
                                {album.listenLink && (
                                    <a
                                        href={album.listenLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="me-2"
                                    >
                                        Listen
                                    </a>
                                )}
                                {album.buyLink && (
                                    <a
                                        href={album.buyLink}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Buy
                                    </a>
                                )}
                            </div>
                        </li>
                    ),
                )}
            </ul>
        </>
    );
};
