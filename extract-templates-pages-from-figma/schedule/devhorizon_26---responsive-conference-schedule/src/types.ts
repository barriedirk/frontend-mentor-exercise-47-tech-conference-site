export type TrackType = 'KEYNOTE' | 'PERFORMANCE' | 'TOOLING' | 'FRONTEND' | 'ACCESSIBILITY';

export interface Talk {
  id: string;
  day: number;
  track: TrackType;
  trackLabel: string;
  trackColor: {
    bg: string;
    text: string;
    subtext: string;
  };
  title: string;
  speaker: string;
  company: string;
  description: string;
  location: string;
  timeStart: string;
  timeEnd: string;
  isKeynote?: boolean;
}
