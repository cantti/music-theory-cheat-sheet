import _ from 'lodash';

export default function AboutMe() {
  const canttiReleases = [
    'track=379330236',
    'track=3883024499',
    'album=2599868140',
    'track=39885008',
    'track=350652303',
    'album=966016900',
    'album=4019982752',
    'album=1707757818',
    'album=2793997991',
    'album=3146788245',
    'album=1913466361',
    'album=717509761',
    'album=3122310838',
  ];
  const isReleases = ['album=92237236', 'album=1124706077', 'album=2077738303'];
  return (
    <>
      <h3>About me</h3>
      <p>
        Musician and software developer. I mainly work in the reggae dub genre
        under the pseudonym <b>Cantti</b>. There are also releases in the
        Synthwave genre under the pseudonym <b>Imminent State</b>. Below is a
        list of my releases with the links to Spotify and Bandcamp. All releases
        can be found on other streaming platforms.
      </p>
      <p>
        <a
          href="https://www.youtube.com/channel/UCS26LO1Y8E8ACgkgv7sOd7A"
          rel="noreferrer"
          target="_blank"
        >
          Youtube Channel
        </a>
        .
      </p>
      <h4>Synthwave releases (Imminent state)</h4>
      <h5>Spotify</h5>
      <iframe
        src="https://open.spotify.com/embed/artist/2XacwfKxItLK7VXXS1r8wR?utm_source=generator&theme=0"
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      <h5>Bandcamp</h5>
      {isReleases.map((rel) => (
        <iframe
          key={rel}
          src={`https://bandcamp.com/EmbeddedPlayer/${rel}/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/`}
          seamless
          className="me-4 mb-4 border-0"
          style={{ width: '400px', height: '350px' }}
        />
      ))}
      <h4>Reggae releases (Cantti)</h4>
      <h5>Spotify</h5>
      <iframe
        src="https://open.spotify.com/embed/artist/0ESGrsq25JWPHp4TRfCltL?utm_source=generator&theme=0"
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      <h5>Bandcamp</h5>
      {canttiReleases.map((rel) => (
        <iframe
          key={rel}
          src={`https://bandcamp.com/EmbeddedPlayer/${rel}/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/`}
          seamless
          className="me-4 mb-4 border-0"
          style={{ width: '400px', height: '350px' }}
        />
      ))}
    </>
  );
}
