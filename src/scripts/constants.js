const SOURCE_FOLDER = "src";

// Spanish compatible
const SPAIN_SPANISH = "es-es";
const AMERICAN_SPANISH = "es-us";
const PORTUGUESE = "pt";
const ITALIAN = "it";

// English compatible
const GB_ENGLISH = "en";
const AMERICAN_ENGLISH = "en-us";
const AUSTRALIAN_ENGLISH = "en-au";

module.exports = {
  FOLDER: {
    INPUT: `${SOURCE_FOLDER}/input`,
    BACKUP: "../thenursewhocoded",
    OUTPUT: `${SOURCE_FOLDER}/output`,
    SONGS: "../songs",
  },
  EXTENSION: {
    AUDIO: "mp3",
    JSON: "json",
    MD: "md",
  },
  DELIMITERS: {
    GIF: "%[",
    TITLE: "#",
    NOTE: "*",
    DIALOGUE: "-",
  },

  UTF_8: "utf8",

  getVoices: (lang) =>
    ({
      es: {
        INTRO: PORTUGUESE,
        NARRATOR: SPAIN_SPANISH,
        DIALOGUE: AMERICAN_SPANISH,
      },
      en: {
        INTRO: AUSTRALIAN_ENGLISH,
        NARRATOR: GB_ENGLISH,
        DIALOGUE: AMERICAN_ENGLISH,
      },
    }[lang || "en"]),
};
