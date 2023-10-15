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

export const gameOptions = {
  cardWidth: window.innerHeight * 0.15 * 0.71, // width to height = 0.71 (standard card ratio)
  cardHeight: window.innerHeight * 0.15, // height to width = 1.4 (standart card ratio)
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
  inFieldAnnouncement: 'inFieldAnnouncement',
  gameObjectNames: {
    leftSidebar: "leftSidebar",
    rightSidebar: "rightSidebar",
    totalScore: "totalScore",
    optionsButton: "optionsButton"
  }  
}

/**
 * Constructs a game object name based on the naming convention
 * @param name
 * @returns
 */
export function getBelotGameObject(name: string): string {
  return constants.belotGameObjectName + name;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
