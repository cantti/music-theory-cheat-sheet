type Genre = "reggae" | "dub" | "reggae & dub" | "synthwave";

interface Album {
  artist: string;
  title: string;
  date: Date;
  description: string;
  image: string;
  buyLink: string;
  listenLink: string;
  genre: Genre;
}

const discography: Album[] = [
  {
    artist: "Cantti",
    title: "Steppers Story",
    description: ``,
    date: new Date("2014-10-12"),
    image: "steppers-story.jpg",
    buyLink: "https://cantti.bandcamp.com/album/steppers-story",
    listenLink: "https://distrokid.com/hyperfollow/cantti/dy4s",
    genre: "dub",
  },
  {
    artist: "Cantti",
    title: "Young Warriors",
    description: ``,
    date: new Date("2016-03-04"),
    image: "young-warriors.jpg",
    buyLink: "https://cantti.bandcamp.com/album/young-warriors",
    listenLink: "",
    genre: "dub",
  },
  {
    artist: "Cantti",
    title: "Space Travel",
    description: ``,
    date: new Date("2018-01-14"),
    image: "space-travel.jpg",
    buyLink: "https://cantti.bandcamp.com/album/space-travel",
    listenLink: "https://distrokid.com/hyperfollow/cantti/dy5d",
    genre: "dub",
  },
  {
    artist: "Cantti",
    title: "Dub Selection 1",
    description: ``,
    date: new Date("2019-12-17"),
    image: "dub-selection.jpg",
    buyLink: "https://cantti.bandcamp.com/album/dub-selection-1",
    listenLink: "https://distrokid.com/hyperfollow/cantti/dub-selection-1-2",
    genre: "dub",
  },
  {
    artist: "Cantti / Скальд",
    title: "Коробочка коробка",
    description: ``,
    date: new Date("2020-06-2"),
    image: "korobochka.jpg",
    buyLink: "https://cantti.bandcamp.com/album/korobochka-korobka",
    listenLink: "https://vk.com/wall-20788333_22228",
    genre: "reggae & dub",
  },
  {
    artist: "Imminent State",
    title: "Final Lap",
    description: ``,
    date: new Date("2018-10-25"),
    image: "final-lap.jpg",
    buyLink: "https://imminentstate.bandcamp.com/album/final-lap",
    listenLink: "https://distrokid.com/hyperfollow/imminentstate/fa6R",
    genre: "synthwave",
  },
  {
    artist: "Cantti / Skald",
    title: "Получать счастьем",
    description: ``,
    date: new Date("2022-01-01"),
    image: "poluchat-schastem.jpg",
    listenLink: "https://hyperfollow.com/skaldcanttipoluchatschastem",
    buyLink: "",
    genre: "reggae & dub",
  },
];

export { discography };
