import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import UserService from './app/shared/services/user-service';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

export const belotServerAPI = {
  mainAPI: "https://localhost:7126/",
  signalR: "https://localhost:7126/belotGame/"
};

function getScales(): { X: number, Y: number} {  
  const ratioX = 17.219730941704036;
  const ratioY = 5.752321981424148;

  var X = (window.innerWidth / ratioX) / 223;
  var Y = (window.innerHeight / ratioY) / 323;

  //ТОDO: find a better way to scale cards. By far, many object relate on cards' size.

  return { X, Y };
}

export const gameOptions = {
  cardWidth: 223 * getScales().X,
  cardHeight: 323 * getScales().Y,
  tweens: 200,
  arrangeByStrength: true,
  hoverColor: 0xD3DCE5,
  inGame: {
    cardOrder: 0 //0: ASC, 1: DESC
  },
  sceneLayout: {
    paddings: {
      leftPadding: 30,
      rightPadding: 30,
      topPadding: 30,
      bottomPadding: 30,
    },
    rectangles: {
      width: 280,
      height: 280
    }
  }
};

export const constants = {
  loadingText: 'loadingText',
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
  announcementElement: 'announcementElement',
  clubsGameAnnouncementElement: 'clubsGameAnnouncementElement',
  diamondsGameAnnouncementElement: 'diamondsGameAnnouncementElement',
  heartsGameAnnouncementElement: 'heartsGameAnnouncementElement',
  spadesGameAnnouncementElement: 'spadesGameAnnouncementElement',
  noSuitGameAnnouncementElement: 'noSuitGameAnnouncementElement',
  allSuitsGameAnnouncementElement: 'allSuitsGameAnnouncementElement',
  gameAnnouncementsBackground: 'gameAnnouncementsBackground',
  gameScoreBackground: 'gameScoreBackground',
  gameScoreItem: 'gameScoreItem',
  gameScoreTotalItem: 'gameScoreTotalItem',
  cardBack: 'cardBack',
  cardsSpritesheet: 'belotCards',
  optionsButton: 'optionsButton',
  handAnnouncementObjectName: 'belotObject handAnnouncementObjectName',
  inFieldAnnouncement: 'inFieldAnnouncement'
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
