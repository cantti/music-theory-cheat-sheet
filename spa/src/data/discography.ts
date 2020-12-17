import SteppersStoryImg from './album-covers/steppers-story.jpg';
import DubSelection from './album-covers/dub-selection.jpg';
import YoungWarriors from './album-covers/young-warriors.jpg';
import SpaceTravel from './album-covers/space-travel.jpg';

interface Album {
    title: string;
    date: Date;
    description: string;
    image: string;
    link: string;
}

const discography: Album[] = [
    {
        title: 'Steppers Story',
        description: ``,
        date: new Date('2014-10-12'),
        image: SteppersStoryImg,
        link: 'https://cantti.bandcamp.com/album/steppers-story',
    },
    {
        title: 'Young Warriors',
        description: ``,
        date: new Date('2016-03-04'),
        image: YoungWarriors,
        link: 'https://cantti.bandcamp.com/album/young-warriors',
    },
    {
        title: 'Space Travel',
        description: ``,
        date: new Date('2018-01-14'),
        image: SpaceTravel,
        link: 'https://cantti.bandcamp.com/album/space-travel',
    },
    {
        title: 'Dub Selection 1',
        description: ``,
        date: new Date('2019-12-17'),
        image: DubSelection,
        link: 'https://cantti.bandcamp.com/album/dub-selection-1',
    },
];

export { discography };
