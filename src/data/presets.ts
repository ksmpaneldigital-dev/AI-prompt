import { SongProject } from '../types/songwriter';

export interface PromptPreset {
  id: string;
  labelKhmer: string;
  labelEnglish: string;
  genre: string;
  prompt: string;
  iconName: string;
}

export const SAMPLE_PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'sad-son-parents',
    labelKhmer: 'កូនអ្នកក្រតស៊ូចិញ្ចឹមម៉ែឪ (Sad Ballad)',
    labelEnglish: 'Poor Son Supporting Parents (Emotional Ballad)',
    genre: 'Sad Acoustic Ballad',
    prompt: 'Write an emotional Khmer sad song about a poor son who works hard far from home to support his elderly parents in the countryside. Use Sad Acoustic Ballad, emotional male vocals, piano, soft guitar, cinematic strings, and an emotional rap section. Duration 3–4 minutes.',
    iconName: 'HeartCrack'
  },
  {
    id: 'khmer-pop-romance',
    labelKhmer: 'ស្នេហាយុវវ័យសម័យថ្មី (Modern Khmer Pop)',
    labelEnglish: 'Modern Youth Romance (Khmer Pop)',
    genre: 'Modern Khmer Pop',
    prompt: 'A sweet, upbeat modern Khmer pop love song about confessing feelings on a rainy evening in Phnom Penh Riverside. Catchy melody, female vocal, clean electric guitar, bright synths, warm bass. Upbeat and romantic.',
    iconName: 'Sparkles'
  },
  {
    id: 'emotional-khmer-rap',
    labelKhmer: 'បទរ៉េបជីវិតក្មេងតាមផ្លូវ (Emotional Rap/Trap)',
    labelEnglish: 'Street Life & Dreams (Khmer Emotional Rap)',
    genre: 'Emotional Khmer Rap',
    prompt: 'An intense and emotional Khmer hip-hop / rap song about never giving up on your dreams despite poverty, hunger, and skepticism. Deep 808 bass, acoustic piano loop, hard hitting rhythm, aggressive yet emotional flow with melodic hook.',
    iconName: 'Mic'
  },
  {
    id: 'cinematic-ost',
    labelKhmer: 'បទខ្សែភាពយន្តបុរាណ (Cinematic OST)',
    labelEnglish: 'Historical Drama (Cinematic OST)',
    genre: 'Cinematic OST',
    prompt: 'A majestic and sorrowful Khmer cinematic OST combining traditional Khmer instruments (Roneat Ek, Tro Sau) with a full Western orchestral sound, soaring female vocals, epic crescendos, and poetic Khmer lyrics about ancient devotion.',
    iconName: 'Film'
  },
  {
    id: 'lofi-kampot-rain',
    labelKhmer: 'ភ្លៀងធ្លាក់នៅកំពត (Lo-fi Chill / Acoustic)',
    labelEnglish: 'Rain in Kampot (Lo-fi Acoustic Chill)',
    genre: 'Lo-fi Chill',
    prompt: 'A relaxing, melancholic Lo-fi acoustic song about sitting by the Kampot river while gentle rain falls, reminiscing about past love. Warm vinyl crackle, mellow Rhodes piano, nylon guitar, soft whispering vocal.',
    iconName: 'CloudRain'
  },
  {
    id: 'motivational-anthem',
    labelKhmer: 'ក្រោកឈរតស៊ូដើម្បីអនាគត (Motivational Pop)',
    labelEnglish: 'Rise Up & Fight for Tomorrow (Anthem)',
    genre: 'Motivational Pop',
    prompt: 'An inspiring motivational Khmer pop-rock anthem about rising after failures, holding your head high, and making your homeland proud. Driving drums, electric guitars, stadium chants, uplifting chorus.',
    iconName: 'Flame'
  }
];

export const INITIAL_DEMO_PROJECT: SongProject = {
  id: 'demo-sad-son',
  title: 'Tears of a Hardworking Son',
  titleKhmer: 'ទឹកភ្នែកកូនអ្នកក្រ',
  originalPrompt: 'Write an emotional Khmer sad song about a poor son who works hard to support his parents. Use Sad Acoustic Ballad, emotional male vocals, piano, soft guitar, cinematic strings, and an emotional rap section. Duration 3–4 minutes.',
  analysis: {
    titleKhmer: 'ទឹកភ្នែកកូនអ្នកក្រ (Tears of a Hardworking Son)',
    titleEnglish: 'Tears of a Hardworking Son',
    theme: 'Filial piety, hardship, sacrifice, working far from home to support impoverished elderly parents',
    story: 'A young man leaves his rural village to do hard manual construction labor in the bustling city. Despite exhaustion, blistering heat, and loneliness, every riel earned is sent back home to buy medicine for his sick mother and food for his father.',
    language: 'Khmer',
    emotion: 'Deeply emotional, sorrowful, heartfelt, resilient, filial gratitude (កតញ្ញូតាធម៌)',
    genre: 'Sad Acoustic Ballad / Emotional Rap',
    vocalType: 'Emotional Male Solo with soulful rasp and heartfelt delivery',
    instruments: ['Grand Piano', 'Fingerstyle Acoustic Guitar', 'Cinematic Cello & Violins', 'Soft Sub-Bass', 'Ambient Chimes'],
    tempoEnergy: 'Slow Melancholic Ballad (68 BPM), building to dramatic crescendo',
    duration: '3:45 minutes',
    targetAudience: 'Youth, migrant workers, diaspora, families, anyone touched by filial sacrifice',
    lyricsStructure: ['[Intro]', '[Verse 1]', '[Pre-Chorus]', '[Chorus]', '[Verse 2]', '[Rap Verse]', '[Bridge]', '[Final Chorus]', '[Outro]'],
    hasRap: true,
    rapTone: 'Fast, emotional, breathless spoken delivery filled with gritty realism and raw tears',
    specialInstructions: 'Ensure Khmer rhymes follow poetic meter (ពាក្យ៧/រណ្តំចុងចួន). Section headers must be Suno-compliant tags.'
  },
  lyrics: `[Intro]
(សំឡេងព្យាណូដ៏ស្រទន់ និងសូរខ្យល់រងំ)
(Soft melancholic piano chords with gentle fingerstyle acoustic guitar)
អូ... ម៉ែអើយ... ពុកអើយ...
កូននឹកអ្នកទាំងពីរណាស់...

[Verse 1]
ព្រះអាទិត្យលិចបាត់ ដួងចិត្តរឹតតែរងា
ក្រុងធំដាច់ឆ្ងាយ កូនរស់នៅឯនាយឯកា
បែកញើសហូរស្រក់ លើដែកស៊ីម៉ង់ត៍គ្រប់គ្រា
ដើម្បីតែប្រាក់ផ្ញើជូនអ្នកម្តាយពិសា។
ដៃកូនរឹងគគ្រើម តែចិត្តនៅចាំដំបូន្មាន
ម៉ែផ្តាំឱ្យទ្រាំ ទោះបីលំបាកយ៉ាងណា
ឃ្លានបាយហូបទឹក មិនហ៊ានចាយផ្តេសផ្តាសឡើយណា
ទុកប្រាក់ទិញថ្នាំ ជូនម៉ែពេលមានរោគា។

[Pre-Chorus]
យប់យន់ទន់សូរ ឮតែសូរសំឡេងផ្គរលាន់
ភ្នែកកូនសម្លឹងមើលទៅមេឃឆ្ងាយហួសផុត
តើម៉ែពិសាបាយហើយឬនៅ យប់ត្រជាក់ក្តៅយ៉ាងណា?
កូននៅទីនេះ មិនបោះបង់ក្តីសង្ឃឹមឡើយ...

[Chorus]
ទឹកភ្នែកកូនអ្នកក្រ ស្រក់លើដីធ្លីឥតស្តាយ
ទោះហត់នឿយស្ទើរស្លាប់ ក៏មិនឱ្យម៉ែបារម្ភ
ស្នាមញញឹមអ្នកម្តាយ ជាដង្ហើមកូនរស់នៅ
ពុកម៉ែអើយ... ចាំកូនណា កូននឹងវិលត្រឡប់!
ទោះត្រូវរែកពន់ ទុក្ខសោកធ្ងន់ប៉ុនភ្នំ
កូននៅតែញញឹម ដើម្បីម៉ែពុកសុខសាន្ត។

[Verse 2]
សម្លឹងមើលអាវចាស់ ដែលម៉ែដេរជូនកាលចេញដំណើរ
រហែកធ្លុះធ្លាយ ដូចបេះដូងកូននឹកស្រុក
ឃើញគេដើរលេង ជួបជុំសប្បាយក្អាកក្អាយ
កូនបានត្រឹមលេបទឹកភ្នែក លាក់ទុក្ខក្នុងទ្រូងស្ងាត់ៗ។

[Rap Verse]
(Beats kick in: Emotional slow 808, fast heartfelt flow)
(ម៉ែអើយ...)
ក្រោកពីព្រលឹម ម៉ោងប្រាំមិនទាន់ដឹងខ្លួន
ស្ពាយកាតាបចាស់ ដើរចូលការដ្ឋានសាងសង់
លើកឥដ្ឋរែកខ្សាច់ ធូលីចូលភ្នែកផ្សាខ្លាំង
ជើងដៃឡើងពង តែបេះដូងមិនដែលរុញរា!
ទូរស័ព្ទតេមក ឮសំឡេងម៉ែសួរនាំ
"កូនហូបបាយនៅ? ហត់ទេកូនប្រុសពៅម៉ែ?"
កូនឆ្លើយថា "កូនស្រួលណាស់ម៉ែ កុំបារម្ភ"
ទាំងដែលបំពង់ក កំពុងស្ទះទឹកភ្នែកហូរ!
កូនសន្យា នឹងនាំភាពជោគជ័យជូនម៉ែ
មិនឱ្យអ្នកភូមិគេមើលងាយគ្រួសារយើងទៀតឡើយ!

[Bridge]
(Strings crescendo into high emotional peak)
ខ្យល់អើយជួយបក់... នាំពាក្យនឹកទៅស្រុកកំណើត
ប្រាប់ម៉ែនិងពុកថា កូនកត្តញ្ញូនៅតែរង់ចាំ
ថ្ងៃដែលកូនមានគ្រប់គ្រាន់ វិលទៅឱបអ្នកទាំងពីរ
លាងជើងម៉ែពុក ដោយទឹកភ្នែកនៃក្តីអំណរ...

[Final Chorus]
(Full dramatic band with strings, heavy emotional vocals)
ទឹកភ្នែកកូនអ្នកក្រ ស្រក់លើដីធ្លីឥតស្តាយ!
ទោះហត់នឿយស្ទើរស្លាប់ ក៏មិនឱ្យម៉ែបារម្ភ!
ស្នាមញញឹមអ្នកម្តាយ ជាដង្ហើមកូនរស់នៅ
ពុកម៉ែអើយ... ចាំកូនណា កូននឹងវិលត្រឡប់!
ទោះត្រូវរែកពន់ ទុក្ខសោកធ្ងន់ប៉ុនភ្នំ
កូននៅតែញញឹម... ដើម្បីម៉ែពុកសុខសាន្ត!

[Outro]
(Acoustic guitar fades out with solo cello)
ចាំកូនណាពុក...
ចាំកូនណាម៉ែ...
កូនស្រឡាញ់ម៉ែពុកបំផុត...
(Piano resolves on a quiet emotional chord)
(Fade out)`,
  sunoPrompt: {
    title: 'Tears of a Hardworking Son (ទឹកភ្នែកកូនអ្នកក្រ)',
    lyrics: `[Intro]
អូ... ម៉ែអើយ... ពុកអើយ...

[Verse 1]
ព្រះអាទិត្យលិចបាត់ ដួងចិត្តរឹតតែរងា
ក្រុងធំដាច់ឆ្ងាយ កូនរស់នៅឯនាយឯកា
បែកញើសហូរស្រក់ លើដែកស៊ីម៉ង់ត៍គ្រប់គ្រា
ដើម្បីតែប្រាក់ផ្ញើជូនអ្នកម្តាយពិសា។
ដៃកូនរឹងគគ្រើម តែចិត្តនៅចាំដំបូន្មាន
ម៉ែផ្តាំឱ្យទ្រាំ ទោះបីលំបាកយ៉ាងណា
ឃ្លានបាយហូបទឹក មិនហ៊ានចាយផ្តេសផ្តាសឡើយណា
ទុកប្រាក់ទិញថ្នាំ ជូនម៉ែពេលមានរោគា។

[Pre-Chorus]
យប់យន់ទន់សូរ ឮតែសូរសំឡេងផ្គរលាន់
ភ្នែកកូនសម្លឹងមើលទៅមេឃឆ្ងាយហួសផុត
តើម៉ែពិសាបាយហើយឬនៅ យប់ត្រជាក់ក្តៅយ៉ាងណា?
កូននៅទីនេះ មិនបោះបង់ក្តីសង្ឃឹមឡើយ...

[Chorus]
ទឹកភ្នែកកូនអ្នកក្រ ស្រក់លើដីធ្លីឥតស្តាយ
ទោះហត់នឿយស្ទើរស្លាប់ ក៏មិនឱ្យម៉ែបារម្ភ
ស្នាមញញឹមអ្នកម្តាយ ជាដង្ហើមកូនរស់នៅ
ពុកម៉ែអើយ... ចាំកូនណា កូននឹងវិលត្រឡប់!
ទោះត្រូវរែកពន់ ទុក្ខសោកធ្ងន់ប៉ុនភ្នំ
កូននៅតែញញឹម ដើម្បីម៉ែពុកសុខសាន្ត។

[Verse 2]
សម្លឹងមើលអាវចាស់ ដែលម៉ែដេរជូនកាលចេញដំណើរ
រហែកធ្លុះធ្លាយ ដូចបេះដូងកូននឹកស្រុក
ឃើញគេដើរលេង ជួបជុំសប្បាយក្អាកក្អាយ
កូនបានត្រឹមលេបទឹកភ្នែក លាក់ទុក្ខក្នុងទ្រូងស្ងាត់ៗ។

[Rap Verse]
ក្រោកពីព្រលឹម ម៉ោងប្រាំមិនទាន់ដឹងខ្លួន
ស្ពាយកាតាបចាស់ ដើរចូលការដ្ឋានសាងសង់
លើកឥដ្ឋរែកខ្សាច់ ធូលីចូលភ្នែកផ្សាខ្លាំង
ជើងដៃឡើងពង តែបេះដូងមិនដែលរុញរា!
ទូរស័ព្ទតេមក ឮសំឡេងម៉ែសួរនាំ
កូនឆ្លើយថា កូនស្រួលណាស់ម៉ែ កុំបារម្ភ
ទាំងដែលបំពង់ក កំពុងស្ទះទឹកភ្នែកហូរ!

[Bridge]
ខ្យល់អើយជួយបក់ នាំពាក្យនឹកទៅស្រុកកំណើត
ប្រាប់ម៉ែនិងពុកថា កូនកត្តញ្ញូនៅតែរង់ចាំ
ថ្ងៃដែលកូនមានគ្រប់គ្រាន់ វិលទៅឱបអ្នកទាំងពីរ
លាងជើងម៉ែពុក ដោយទឹកភ្នែកនៃក្តីអំណរ...

[Final Chorus]
ទឹកភ្នែកកូនអ្នកក្រ ស្រក់លើដីធ្លីឥតស្តាយ!
ទោះហត់នឿយស្ទើរស្លាប់ ក៏មិនឱ្យម៉ែបារម្ភ!
ស្នាមញញឹមអ្នកម្តាយ ជាដង្ហើមកូនរស់នៅ
ពុកម៉ែអើយ... ចាំកូនណា កូននឹងវិលត្រឡប់!

[Outro]
ចាំកូនណាពុក...
ចាំកូនណាម៉ែ...
(Fade out)`,
    styleOfMusic: 'Sad Khmer Acoustic Ballad, emotional male vocal, melancholic piano, fingerstyle acoustic guitar, dramatic strings, emotional rap, 68 bpm',
    extendedStyle: 'Sad acoustic ballad featuring deep sentimental grand piano chords, soft fingerstyle acoustic guitar, warm cello and cinematic strings orchestration. Heartfelt emotional male vocal delivery with slight raspy tone, followed by an emotional mid-tempo rap section with deep warm 808s, rising to an anthemic climax and delicate fading outro.',
    negativeStyle: 'EDM, dance, house, techno, joyful, upbeat, party, auto-tune heavy, aggressive screaming, distorted electric guitar',
    additionalInstructions: 'Keep vocal raw and vulnerable. Allow natural breathing pauses. Suno AI prompt tag: [Melancholic Piano Intro], [Emotional Crescendo].'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isFavorite: true,
  tags: ['Khmer Ballad', 'Family', 'Emotional', 'Rap Verse'],
  source: 'demo'
};
