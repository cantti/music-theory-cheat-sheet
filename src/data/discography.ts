interface Album {
    artist: string;
    title: string;
    date: Date;
    description: string;
    image: string;
    link: string;
    hyperFollow: string;
}

const discography: Partial<Album>[] = [
    {
        artist: 'Cantti',
        title: 'Steppers Story',
        description: ``,
        date: new Date('2014-10-12'),
        image: 'steppers-story.jpg',
        link: 'https://cantti.bandcamp.com/album/steppers-story',
        hyperFollow: 'https://distrokid.com/hyperfollow/cantti/dy4s',
    },
    {
        artist: 'Cantti',
        title: 'Young Warriors',
        description: ``,
        date: new Date('2016-03-04'),
        image: 'young-warriors.jpg',
        link: 'https://cantti.bandcamp.com/album/young-warriors',
        hyperFollow: undefined,
    },
    {
        artist: 'Cantti',
        title: 'Space Travel',
        description: ``,
        date: new Date('2018-01-14'),
        image: 'space-travel.jpg',
        link: 'https://cantti.bandcamp.com/album/space-travel',
        hyperFollow: 'https://distrokid.com/hyperfollow/cantti/dy5d',
    },
    {
        artist: 'Cantti',
        title: 'Dub Selection 1',
        description: ``,
        date: new Date('2019-12-17'),
        image: 'dub-selection.jpg',
        link: 'https://cantti.bandcamp.com/album/dub-selection-1',
        hyperFollow:
            'https://distrokid.com/hyperfollow/cantti/dub-selection-1-2',
    },
    {
        artist: 'Cantti / Скальд',
        title: 'Коробочка коробка',
        description: ``,
        date: new Date('2020-06-2'),
        image: 'korobochka.jpg',
        link: 'https://cantti.bandcamp.com/album/korobochka-korobka',
        hyperFollow: 'https://vk.com/wall-20788333_22228',
    },
    {
        artist: 'Imminent State',
        title: 'Final Lap',
        description: ``,
        date: new Date('2018-10-25'),
        image: 'final-lap.jpg',
        link: 'https://imminentstate.bandcamp.com/album/final-lap',
        hyperFollow: 'https://distrokid.com/hyperfollow/imminentstate/fa6R',
    },
    {
        artist: 'Cantti / Skald',
        title: 'Получать счастьем',
        description: ``,
        date: new Date('2022-01-01'),
        image: 'poluchat-schastem.jpg',
        hyperFollow: 'https://hyperfollow.com/skaldcanttipoluchatschastem',
    },
];

export { discography };
