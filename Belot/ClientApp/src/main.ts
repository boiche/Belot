import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

export const belotServerAPI = {
  mainAPI: "https://localhost:7126/",
  signalR: "https://localhost:7126/belotGame/"
};

export function getScales(): { X: number, Y: number} {  
  const ratioX = 17.219730941704036;
  const ratioY = 5.752321981424148;

  var X = (window.innerWidth / ratioX) / gameOptions.cardWidth;
  var Y = (window.innerHeight / ratioY) / gameOptions.cardHeight;


  return { X, Y };
}

export const gameOptions = {
  cardWidth: 223,
  cardHeight: 323,
  tweens: 200,
  arrangeByStrength: true  
};

export const constants = {
  belotGameObjectName: 'belotObject',
  clubGameAnnouncement: 'clubsGameAnnouncement',
  diamondsGameAnnouncement: 'diamondsGameAnnouncement',
  heartsGameAnnouncement: 'heartsGameAnnouncement',
  spadesGameAnnouncement: 'spadesGameAnnouncement',
  noSuitGameAnnouncement: 'noSuitGameAnnouncement',
  allSuitsGameAnnouncement: 'allSuitsGameAnnouncement',
  doubleGameAnnouncement: 'doubleGameAnnouncement',
  redoubleGameAnnouncement: 'redoubleGameAnnouncement',
  passGameAnnouncement: 'passGameAnnouncement',
  gameAnnouncementsBackground: 'gameAnnouncementsBackground',
  gameScoreBackground: 'gameScoreBackground',
  gameScoreItem: 'gameScoreItem',
  cardBack: 'cardBack',
  cardsSpritesheet: 'belotCards'
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
