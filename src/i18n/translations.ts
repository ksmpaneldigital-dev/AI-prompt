export type Language = 'km' | 'en';

export const TRANSLATIONS = {
  km: {
    appTitle: 'AI Khmer Songwriter Pro',
    appSubtitle: 'ស្ទូឌីយោតែងទំនុកច្រៀង និងរចនាបទតន្ត្រី AI',
    tagline: 'និពន្ធទំនុកច្រៀងខ្មែរពិរោះ រណ្តំចុងចួន និងបង្កើត Prompt សម្រាប់ Suno AI ភ្លាមៗ',
    newSong: 'និពន្ធបទថ្មី',
    library: 'បណ្ណាល័យចម្រៀង',
    sunoBuilder: 'Suno AI Prompt',
    lyricsStudio: 'ស្ទូឌីយោទំនុកច្រៀង',
    advancedTools: 'ឧបករណ៍កម្រិតខ្ពស់',
    
    // Prompt Panel
    promptHeader: 'ប្រអប់បញ្ចូលគំនិត ឬ Prompt ចម្រៀង',
    promptPlaceholder: 'ឧទាហរណ៍៖ សរសេរបទចម្រៀងកំសត់ខ្មែរ រៀបរាប់ពីកូនប្រុសកំសត់ធ្វើការសំណង់ចិញ្ចឹមម៉ែឪចាស់ជរា។ ប្រើចង្វាក់ Sad Acoustic Ballad, សំឡេងបុរសរំជួលចិត្ត, ព្យាណូ, ហ្គីតាស្រទន់, cinematic strings និងមានវគ្គរ៉េបកំសត់...',
    pastePrompt: 'បិទភ្ជាប់ (Paste)',
    clear: 'សម្អាត',
    presets: 'គំរូ និងរចនាបទពេញនិយម៖',
    
    // Actions
    generateFull: 'បង្កើតបទចម្រៀងពេញលេញ (Full Song)',
    generateLyrics: 'តែងទំនុកច្រៀង',
    generateStyle: 'បង្កើត Music Style',
    analyzeSettings: 'វិភាគលម្អិត',
    expandPrompt: 'ពង្រីក Prompt ឱ្យកាន់តែអាជីព',
    
    // Analysis
    songAnalysis: 'ការវិភាគប៉ារ៉ាម៉ែត្របទចម្រៀង',
    editSettings: 'កែសម្រួលការកំណត់',
    songTitle: 'ចំណងជើងបទ',
    genre: 'ចង្វាក់ / ប្រភេទតន្ត្រី',
    vocalType: 'ប្រភេទសំឡេងច្រៀង',
    theme: 'ប្រធានបទ / សាច់រឿង',
    emotion: 'អារម្មណ៍ / មនោសញ្ចេតនា',
    tempo: 'ល្បឿន / ថាមពល',
    duration: 'រយៈពេល',
    instruments: 'ឧបករណ៍តន្ត្រី',
    hasRap: 'មានវគ្គរ៉េប (Rap Verse)',
    
    // Lyrics Editor
    lyricsTitle: 'ផ្ទាំងកែសម្រួលទំនុកច្រៀង',
    wordCount: 'ពាក្យ',
    lineCount: 'បន្ទាត់',
    estSingTime: 'រយៈពេលច្រៀងប្រហែល',
    undo: 'ត្រឡប់ក្រោយ (Undo)',
    redo: 'ទៅមុខ (Redo)',
    findReplace: 'ស្វែងរក & ជំនួស',
    copyLyrics: 'ចម្លងទំនុកច្រៀង',
    insertTag: 'បញ្ចូលវគ្គ៖',
    
    // AI Actions on Lyrics
    improveRhymes: 'ពង្រឹងចុងចួន (Rhymes)',
    moreEmotional: 'បង្កើនមនោសញ្ចេតនា',
    simplifySinging: 'សម្រួលឱ្យស្រួលច្រៀង',
    altChorus: '៣ បន្ទរជម្រើស (Alt Chorus)',
    addRap: 'បន្ថែមវគ្គរ៉េប',
    removeRap: 'លុបវគ្គរ៉េប',
    translateSong: 'បកប្រែ (Translate)',
    shortenLyrics: 'បង្រួមបទឱ្យខ្លី',
    regenSelected: 'បង្កើតវគ្គដែលជ្រើសរើសឡើងវិញ',
    
    // Suno Card
    sunoTitle: 'Suno AI Prompt Builder',
    sunoDesc: 'ចម្លងទម្រង់ខាងក្រោមទៅបិទភ្ជាប់ក្នុង Suno AI Create (Custom Mode)',
    styleOfMusic: 'Style of Music (សម្រាប់ Suno)',
    extendedNotes: 'ការរៀបចំតន្ត្រីពិស្តារ (Arrangement)',
    negativePrompt: 'Exclude Styles (ដកចេញ)',
    copyAllSuno: 'ចម្លងទាំងអស់សម្រាប់ Suno AI',
    copied: 'បានចម្លងរួចរាល់!',
    
    // Storage & Library
    savedSongs: 'បទចម្រៀងដែលបានរក្សាទុក',
    searchSongs: 'ស្វែងរកតាមចំណងជើង...',
    filterGenre: 'គ្រប់ចង្វាក់',
    duplicate: 'ចម្លងស្ទួន (Duplicate)',
    delete: 'លុប',
    exportTxt: 'ទាញយក .TXT',
    exportMd: 'ទាញយក .MD',
    exportJson: 'ទាញយក .JSON',
    
    // Status
    liveAi: 'Gemini 3.8 Flash AI កំពុងដំណើរការ',
    demoMode: 'ដំណើរការ Demo Mode (គំរូ)',
    generating: 'កំពុងតែងទំនុកច្រៀង និងរៀបចំតន្ត្រី...',
    retry: 'ព្យាយាមម្តងទៀត',
  },
  en: {
    appTitle: 'AI Khmer Songwriter Pro',
    appSubtitle: 'Khmer AI Song Lyrics & Music Style Studio',
    tagline: 'Generate authentic Khmer lyrics with poetic meter and ready-to-use Suno AI prompts',
    newSong: 'New Song',
    library: 'Song Library',
    sunoBuilder: 'Suno AI Prompts',
    lyricsStudio: 'Lyrics Studio',
    advancedTools: 'Advanced Tools',
    
    // Prompt Panel
    promptHeader: 'Song Concept / Prompt Input',
    promptPlaceholder: 'E.g. Write an emotional Khmer sad song about a poor son who works hard to support his parents. Use Sad Acoustic Ballad, emotional male vocals, piano, soft guitar, cinematic strings, and an emotional rap section...',
    pastePrompt: 'Paste Prompt',
    clear: 'Clear',
    presets: 'Presets & Genres:',
    
    // Actions
    generateFull: 'Generate Full Song',
    generateLyrics: 'Generate Lyrics',
    generateStyle: 'Generate Music Style',
    analyzeSettings: 'Analyze Settings',
    expandPrompt: 'Expand Prompt into Pro',
    
    // Analysis
    songAnalysis: 'Detected Song Parameters',
    editSettings: 'Edit Settings',
    songTitle: 'Song Title',
    genre: 'Music Genre',
    vocalType: 'Vocal Type',
    theme: 'Theme & Story',
    emotion: 'Mood & Emotion',
    tempo: 'Tempo & Energy',
    duration: 'Duration',
    instruments: 'Instruments',
    hasRap: 'Rap Verse Included',
    
    // Lyrics Editor
    lyricsTitle: 'Lyrics Editor Studio',
    wordCount: 'words',
    lineCount: 'lines',
    estSingTime: 'Est. Sing Time',
    undo: 'Undo',
    redo: 'Redo',
    findReplace: 'Find & Replace',
    copyLyrics: 'Copy Lyrics',
    insertTag: 'Insert Section:',
    
    // AI Actions on Lyrics
    improveRhymes: 'Improve Rhymes',
    moreEmotional: 'Make More Emotional',
    simplifySinging: 'Simplify for Singing',
    altChorus: '3 Alt Chorus Hooks',
    addRap: 'Add Rap Verse',
    removeRap: 'Remove Rap',
    translateSong: 'Translate',
    shortenLyrics: 'Shorten Lyrics',
    regenSelected: 'Regenerate Selection',
    
    // Suno Card
    sunoTitle: 'Suno AI Prompt Builder',
    sunoDesc: 'Ready-to-copy fields formatted for Suno AI Custom Mode',
    styleOfMusic: 'Style of Music',
    extendedNotes: 'Studio Arrangement Notes',
    negativePrompt: 'Exclude Styles',
    copyAllSuno: 'Copy All for Suno AI',
    copied: 'Copied to Clipboard!',
    
    // Storage & Library
    savedSongs: 'Saved Projects',
    searchSongs: 'Search by title...',
    filterGenre: 'All Genres',
    duplicate: 'Duplicate',
    delete: 'Delete',
    exportTxt: 'Export .TXT',
    exportMd: 'Export .MD',
    exportJson: 'Export .JSON',
    
    // Status
    liveAi: 'Gemini 3.8 Flash Active',
    demoMode: 'Demo Fallback Mode',
    generating: 'Composing lyrics & music style...',
    retry: 'Retry',
  }
};
