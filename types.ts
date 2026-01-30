
export enum GameState {
  HUB = 'HUB',
  MUSIC_SHOP = 'MUSIC_SHOP',
  SORTING_GARDEN = 'SORTING_GARDEN',
  FOREST_OF_MYSTERY = 'FOREST_OF_MYSTERY',
  ART_STUDIO = 'ART_STUDIO',
  CAR_WASH = 'CAR_WASH',
  ALPHABET_ZOO = 'ALPHABET_ZOO',
  ROCKET_LAUNCHER = 'ROCKET_LAUNCHER',
  BALLOON_POP = 'BALLOON_POP',
  NUMBER_PARK = 'NUMBER_PARK',
  ADMIN = 'ADMIN'
}

export interface UserSettings {
  userName: string;
  voiceEnabled: boolean;
}

export interface CarWashImage {
  id: string;
  url: string;
  name: string;
}
