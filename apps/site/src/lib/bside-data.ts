import eddy from "@/assets/team-eddy.jpg";
import bart from "@/assets/team-bart.jpg";
import lecyr from "@/assets/team-lecyr.jpg";

/**
 * Flux live de la radio. Remplacer par l'URL Icecast/AzuraCast de B Side Radio.
 */
export const STREAM_URL = "https://stream.b-side-radio.com/radio.mp3";

export type NowPlaying = {
  title: string;
  artist: string;
  original: string;
  buyUrl: string;
};

export const nowPlaying: NowPlaying = {
  title: "Billie Jean (B Side Rework)",
  artist: "Michael Jackson x Purple Disco Machine",
  original: "Original : Michael Jackson — Billie Jean (1982)",
  buyUrl: "https://www.beatport.com/search?q=purple%20disco%20machine",
};

export const nextUp = {
  title: "Rhythm Is A Mashup",
  artist: "Snap! x Dom Dolla",
};

export type Show = {
  name: string;
  host: string;
  start: string;
  end: string;
  blurb: string;
  blurbEn: string;
};

export const schedule: Show[] = [
  {
    name: "Wake Up",
    host: "DJ Eddy",
    start: "07:00",
    end: "10:00",
    blurb: "Reveil en douceur : nu-disco, edits soul et mashups pop pour lancer la journee.",
    blurbEn: "A gentle wake-up: nu-disco, soul edits and pop mashups to kick off the day.",
  },
  {
    name: "Day Side",
    host: "Auto DJ",
    start: "10:00",
    end: "17:00",
    blurb: "Rotation non-stop, sans pub : les meilleurs remixes des annees 80 a aujourd'hui.",
    blurbEn: "Non-stop, ad-free rotation: the best remixes from the 80s to today.",
  },
  {
    name: "Drive Time",
    host: "DJ Bart",
    start: "17:00",
    end: "20:00",
    blurb: "Le retour du taf en mode funky house, mashups efficaces et gros basslines.",
    blurbEn: "The commute home in funky house mode: punchy mashups and fat basslines.",
  },
  {
    name: "Klub Time",
    host: "DJ LeCyr",
    start: "20:00",
    end: "23:00",
    blurb: "Le club a la maison : house, tech-house et remixes exclusifs mixes en live.",
    blurbEn: "The club at home: house, tech-house and exclusive remixes mixed live.",
  },
  {
    name: "After Hours",
    host: "B Side Bot",
    start: "23:00",
    end: "07:00",
    blurb: "Deep, downtempo et B-sides oubliees pour finir la nuit.",
    blurbEn: "Deep, downtempo and forgotten B-sides to close out the night.",
  },
];

export type Vinyl = {
  side: string;
  title: string;
  artist: string;
  year: string;
  labelColor: string;
  remixedBy: string;
};

export type DaySchedule = { day: string; dayEn: string; shows: Show[] };

const weekend: Show[] = [
  {
    name: "Slow Wake",
    host: "DJ Eddy",
    start: "09:00",
    end: "12:00",
    blurb: "Reveil tardif : soul edits, disco douce et B-sides pour le brunch.",
    blurbEn: "Late wake-up: soul edits, mellow disco and B-sides for brunch.",
  },
  {
    name: "Day Side",
    host: "Auto DJ",
    start: "12:00",
    end: "18:00",
    blurb: "Rotation non-stop, sans pub : les meilleurs remixes des annees 80 a aujourd'hui.",
    blurbEn: "Non-stop, ad-free rotation: the best remixes from the 80s to today.",
  },
  {
    name: "Klub Time Live",
    host: "DJ LeCyr",
    start: "18:00",
    end: "23:00",
    blurb: "Session live etendue : house, tech-house et exclus mixees en direct.",
    blurbEn: "Extended live session: house, tech-house and exclusives mixed on air.",
  },
  {
    name: "After Hours",
    host: "B Side Bot",
    start: "23:00",
    end: "09:00",
    blurb: "Deep, downtempo et B-sides oubliees pour finir la nuit.",
    blurbEn: "Deep, downtempo and forgotten B-sides to close out the night.",
  },
];

export const weekSchedule: DaySchedule[] = [
  { day: "Lundi", dayEn: "Monday", shows: schedule },
  { day: "Mardi", dayEn: "Tuesday", shows: schedule },
  { day: "Mercredi", dayEn: "Wednesday", shows: schedule },
  { day: "Jeudi", dayEn: "Thursday", shows: schedule },
  {
    day: "Vendredi",
    dayEn: "Friday",
    shows: [
      ...schedule.slice(0, 4),
      {
        name: "Friday Funky Session",
        host: "DJ Eddy",
        start: "23:00",
        end: "07:00",
        blurb: "Le mix session du vendredi : funky house et disco jusqu'au bout de la nuit.",
        blurbEn: "Friday's mix session: funky house and disco until the night is over.",
      },
    ],
  },
  { day: "Samedi", dayEn: "Saturday", shows: weekend },
  {
    day: "Dimanche",
    dayEn: "Sunday",
    shows: [
      ...weekend.slice(0, 2),
      {
        name: "Sunday B Side Session",
        host: "DJ Bart",
        start: "18:00",
        end: "23:00",
        blurb: "Mashups et edits pour cloturer la semaine en douceur.",
        blurbEn: "Mashups and edits to wind the week down gently.",
      },
      weekend[3]!,
    ],
  },
];

export const vinyls: Vinyl[] = [
  { side: "A1", title: "Le Freak", artist: "Chic", year: "1978", labelColor: "#FF0000", remixedBy: "Dimitri From Paris" },
  { side: "A2", title: "Blue Monday", artist: "New Order", year: "1983", labelColor: "#B65151", remixedBy: "Vitalic" },
  { side: "A3", title: "Around The World", artist: "Daft Punk", year: "1997", labelColor: "#F2F2F2", remixedBy: "Folamour" },
  { side: "A4", title: "Show Me Love", artist: "Robin S", year: "1993", labelColor: "#FF0000", remixedBy: "DJ Eddy" },
  { side: "A5", title: "Groove Is In The Heart", artist: "Deee-Lite", year: "1990", labelColor: "#B65151", remixedBy: "Purple Disco Machine" },
  { side: "B1", title: "Music Sounds Better", artist: "Stardust", year: "1998", labelColor: "#F2F2F2", remixedBy: "DJ Bart" },
  { side: "B2", title: "I Feel Love", artist: "Donna Summer", year: "1977", labelColor: "#FF0000", remixedBy: "Roisin Murphy" },
  { side: "B3", title: "Give Me The Night", artist: "George Benson", year: "1980", labelColor: "#B65151", remixedBy: "Yuksek" },
  { side: "B4", title: "Ain't Nobody", artist: "Chaka Khan", year: "1983", labelColor: "#F2F2F2", remixedBy: "DJ LeCyr" },
  { side: "B5", title: "Insomnia", artist: "Faithless", year: "1995", labelColor: "#FF0000", remixedBy: "Mount Kimbie" },
];

export type Track = {
  title: string;
  artist: string;
  duration: string;
  dj: string;
  src: string;
  buyUrl: string;
};

export const weeklyTracks: Track[] = [
  {
    title: "BSR Selection #1",
    artist: "byEddy Edit",
    duration: "6:12",
    dj: "DJ Eddy",
    src: "http://byeddy.free.fr/MIXES/BSR_byeddy_1.mp3",
    buyUrl: "https://www.beatport.com/search?q=edit",
  },
  {
    title: "BSR Selection #2",
    artist: "byEddy Edit",
    duration: "5:44",
    dj: "DJ Eddy",
    src: "http://byeddy.free.fr/MIXES/BSR_byeddy_2.mp3",
    buyUrl: "https://www.beatport.com/search?q=edit",
  },
  {
    title: "Funky House Cut",
    artist: "DJ Bart",
    duration: "7:03",
    dj: "DJ Bart",
    src: "http://byeddy.free.fr/MIXES/BSR_djbart_1.mp3",
    buyUrl: "https://www.beatport.com/search?q=funky+house",
  },
  {
    title: "Late Night Cut",
    artist: "DJ Bart",
    duration: "6:37",
    dj: "DJ Bart",
    src: "http://byeddy.free.fr/MIXES/BSR_djbart_2.mp3",
    buyUrl: "https://www.beatport.com/search?q=funky+house",
  },
  {
    title: "Klub Time Weapon",
    artist: "DJ LeCyr",
    duration: "5:58",
    dj: "DJ LeCyr",
    src: "http://byeddy.free.fr/MIXES/BSR_djlecyr_1.mp3",
    buyUrl: "https://www.beatport.com/search?q=tech+house",
  },
  {
    title: "B Side Closer",
    artist: "DJ LeCyr",
    duration: "8:21",
    dj: "DJ LeCyr",
    src: "http://byeddy.free.fr/MIXES/BSR_djlecyr_2.mp3",
    buyUrl: "https://www.beatport.com/search?q=tech+house",
  },
];

export const mixSessions = [
  {
    name: "Friday Funky Session",
    dj: "DJ Eddy",
    length: "62 min",
    style: "Funky House / Disco",
    src: "http://byeddy.free.fr/MIXES/BSR_byeddy_1.mp3",
  },
  {
    name: "Saturday Klub Session",
    dj: "DJ Bart",
    length: "74 min",
    style: "House / Mashups",
    src: "http://byeddy.free.fr/MIXES/BSR_djbart_1.mp3",
  },
  {
    name: "Sunday B Side Session",
    dj: "DJ LeCyr",
    length: "58 min",
    style: "Tech House / Edits",
    src: "http://byeddy.free.fr/MIXES/BSR_djlecyr_1.mp3",
  },
];

export const team = [
  {
    name: "DJ Eddy",
    role: "Fondateur / Wake Up",
    roleEn: "Founder / Wake Up",
    image: eddy,
    bio: "A l'origine de B Side Radio. Digger de disco, de soul et de tout ce qui se remixe bien.",
    bioEn: "The founder of B Side Radio. A digger of disco, soul and anything that remixes well.",
  },
  {
    name: "DJ Bart",
    role: "Drive Time",
    roleEn: "Drive Time",
    image: bart,
    bio: "Le specialiste des mashups qui ne devraient pas marcher, et qui marchent quand meme.",
    bioEn: "The specialist of mashups that shouldn't work, and somehow always do.",
  },
  {
    name: "DJ LeCyr",
    role: "Klub Time",
    roleEn: "Klub Time",
    image: lecyr,
    bio: "House, tech-house et sessions live du vendredi et samedi soir.",
    bioEn: "House, tech-house and the live sessions on Friday and Saturday nights.",
  },
];

export const videos = [
  {
    id: "1-eYunUhSpo",
    title: "B Side Session — Rooftop Paris",
    titleEn: "B Side Session — Rooftop Paris",
  },
  {
    id: "FcQvsQstZEA",
    title: "Mashup Lab — Behind The Decks",
    titleEn: "Mashup Lab — Behind The Decks",
  },
  {
    id: "UuzImt46v2Y",
    title: "Klub Time — Live Set Extrait",
    titleEn: "Klub Time — Live Set Excerpt",
  },
];

export const socials = [
  { name: "Instagram", handle: "@bsideradioparis", url: "https://www.instagram.com/bsideradioparis/" },
  { name: "Facebook", handle: "b.side.radio.byeddy", url: "https://www.facebook.com/b.side.radio.byeddy/" },
  { name: "Twitter / X", handle: "@radio_bside", url: "https://twitter.com/radio_bside" },
  { name: "Mail", handle: "b.side.radio.com@gmail.com", url: "mailto:b.side.radio.com@gmail.com" },
];
