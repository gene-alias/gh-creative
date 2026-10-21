import assets from './centum-brand-assets.json';

function image(name: keyof typeof assets, alt: string, caption: string) {
  return {
    type: 'image' as const,
    ...assets[name],
    alt,
    caption: `CENTUM / ${caption}`,
    enlarge: true,
  };
}

export const centumBrandingMedia = {
  mark: image(
    'mark',
    'Orange CENTUM double-ring C mark on a black background',
    'Standalone brand mark.',
  ),
  appIcons: image(
    'app-icons',
    'CENTUM app icon direction board with orange-on-black and black-on-orange variations at multiple sizes',
    'App icon directions and size studies.',
  ),
  splash: image(
    'splash',
    'Dark CENTUM iPhone splash screen with the orange symbol, white wordmark and 100 days tagline',
    'App splash screen.',
  ),
  confirmEmail: image(
    'confirm-email',
    'CENTUM email confirmation design with an orange button and dark branded layout',
    'Email confirmation template.',
  ),
  welcomeEmail: image(
    'welcome-email',
    'CENTUM welcome email introducing the five daily tasks with an orange Open CENTUM button',
    'Welcome and onboarding email.',
  ),
  milestone: image(
    'milestone',
    'CENTUM milestone sharing card with a half-filled orange ring, 50 of 100 days and the headline Halfway',
    'Milestone sharing card.',
  ),
  fiveTasks: image(
    'five-tasks',
    'CENTUM Five tasks, one ring advertisement with an orange-lit phone showing daily challenge progress',
    'Five tasks. One ring. / Product campaign.',
  ),
  coastalRun: image(
    'coastal-run',
    'CENTUM Day 41, still going advertisement with a phone held beside a coastal running route',
    'Day 41. Still going. / Lifestyle campaign.',
  ),
  eatToTrain: image(
    'eat-to-train',
    'Light CENTUM nutrition advertisement showing a woman preparing breakfast with a nutrition tracking overlay',
    'Eat to train. Not to shrink. / Nutrition creative.',
  ),
  restOnPlan: image(
    'rest-on-plan',
    'Light CENTUM recovery advertisement showing a woman beside a foam roller with sleep and mobility tracking details',
    'Rest is on the plan. / Recovery creative.',
  ),
  everyRep: image(
    'every-rep',
    'Monochrome CENTUM gym advertisement showing a squat and orange performance tracking details',
    'Every rep on record. / Strength creative.',
  ),
  doneLoggedScored: image(
    'done-logged-scored',
    'CENTUM gym advertisement with the headline Done, logged, scored and a completed five-task checklist',
    'Done. Logged. Scored. / Training creative.',
  ),
  postProof: image(
    'post-proof',
    'CENTUM Post the proof advertisement displaying three branded photo sharing cards with activity data',
    'Post the proof. / Social-sharing campaign.',
  ),
  teamChallenge: image(
    'team-challenge',
    'CENTUM No one skips alone advertisement with a training group and a phone showing team challenge progress',
    'No one skips alone. / Team challenge campaign.',
  ),
};
