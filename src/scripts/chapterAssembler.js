module.exports = (blogCode, postCode, lang) => {
  const {
    readFile,
    readFolder,
    writeJSONFile,
  } = require("./fileSystemOperator");
  const { replaceAll, getTextArrayFormatted } = require("./textManipulator");
  const { isOdd } = require("./mathUtils");
  const generateVoiceFile = require("./voiceGenerator");
  const combineVoiceFiles = require("./audioFilesCombinator");

  const {
    JSON_EXTENSION,
    MD_EXTENSION,
    INPUT_FOLDER,
    BACKUP_FOLDER,
    SONGS_FOLDER,
    OUTPUT_FOLDER,
    AUDIO_EXTENSION,
    getVoices,
    DELIMITERS,
  } = require("./constants");
  let VOICES = getVoices(lang);

  const blogDataFilename = `${INPUT_FOLDER}/${blogCode}/${blogCode}.${JSON_EXTENSION}`;
  readFile(blogDataFilename, (blogJsonData) => {
    const { blogName, gtts, songs } = JSON.parse(blogJsonData);

    const postDataFilename = `${INPUT_FOLDER}/${blogCode}/${postCode}.${JSON_EXTENSION}`;
    readFile(postDataFilename, (jsonData) => {
      const { code, textPost, repository, illustration } = JSON.parse(jsonData);

      let outputJSON = {
        title: "",
        //TODO: refactor this into an HTMLGenerator.js
        description:
          `<p><a href=\"${textPost}"><strong>${blogName}</strong></a></p>` +
          (repository
            ? `<p><a href=\"${repository}"><strong>GitHub repository</strong></a></p>`
            : "") +
          `<p><a href=\"${gtts}"><strong>Voice from Google Text-to-Speech</strong></a></p>` +
          (songs
            ? `<p><strong>Songs</strong>:</p>` +
              `<p>- <a href=\"${songs.attribution}\"><strong>Attribution</strong></a></p>` +
              `<p>- <strong>License</strong>${songs.license}</p>`
            : "") +
          (illustration
            ? `<p><a href=\"${illustration}"><strong>Cover image attribution</strong></a></p>`
            : ""),
      };

      const filename = code;
      readFile(`${BACKUP_FOLDER}/${filename}.${MD_EXTENSION}`, (text) => {
        console.log(`${filename} read succesfully.`);

        const getSongsPath = (name) => `${SONGS_FOLDER}/${blogCode}/${name}/`;
        const openingSongsPath = getSongsPath("opening");
        const closureSongsPath = getSongsPath("closure");

        readFolder(openingSongsPath, (openingSongs) => {
          const openingSong = `${openingSongsPath}${
            openingSongs[Math.floor(Math.random() * openingSongs.length)]
          }`;

          readFolder(closureSongsPath, (closureSongs) => {
            const closureSong = `${closureSongsPath}${
              closureSongs[Math.floor(Math.random() * closureSongs.length)]
            }`;

            let segmentsFilenames = [openingSong];

            const formattedTextArray = getTextArrayFormatted(
              `${DELIMITERS.TITLE} ${blogName}\r\r${text}`
            ).reduce((accumulator, item, index) => {
              if (item.trim().length > 0) {
                let voice = VOICES.NARRATOR;
                const length = item.length;
                const firstLetter = item[0];
                const dialogueStartDelimiter = /(?<= )\-/;

                const startsWith = (word) =>
                  length > word.length &&
                  item.substring(0, word.length) === word;

                if (
                  firstLetter === DELIMITERS.NOTE ||
                  startsWith(DELIMITERS.TITLE)
                ) {
                  voice = VOICES.INTRO;
                  item = replaceAll(
                    replaceAll(item, DELIMITERS.TITLE, ""),
                    DELIMITERS.NOTE,
                    ""
                  ).trim();

                  const titleIndex = 2;
                  if (index === titleIndex) {
                    outputJSON.title = item;
                  }
                } else if (
                  firstLetter === DELIMITERS.DIALOGUE ||
                  dialogueStartDelimiter.test(item)
                ) {
                  voice = VOICES.DIALOGUE;
                }

                const subSegmentArray = item.split(DELIMITERS.DIALOGUE);

                subSegmentArray.forEach((subSegmentItem, index) => {
                  if (subSegmentItem.trim().length > 0) {
                    accumulator.push({
                      text: subSegmentItem,
                      voice:
                        subSegmentArray.length === 1 || isOdd(index)
                          ? voice
                          : VOICES.NARRATOR,
                    });
                  }
                });
              }

              return accumulator;
            }, []);

            let formattedTextIndex = 0;

            const iterate = () => {
              const callback = () => {
                formattedTextIndex++;

                if (formattedTextIndex < formattedTextArray.length) {
                  iterate();
                } else {
                  // End of iteration
                  const outputPath = `${OUTPUT_FOLDER}/${blogCode}/${blogCode}-${postCode}`;

                  writeJSONFile(outputPath, outputJSON, () => {
                    segmentsFilenames.push(closureSong);

                    combineVoiceFiles(
                      blogCode,
                      segmentsFilenames,
                      `${outputPath}.${AUDIO_EXTENSION}`
                    );
                  });
                }
              };

              const segment = formattedTextArray[formattedTextIndex];
              const segmentFilename = `${filename}_${formattedTextIndex}`;
              const segmentFilePath = `${OUTPUT_FOLDER}/${segmentFilename}.${AUDIO_EXTENSION}`;

              segmentsFilenames.push(segmentFilePath);

              generateVoiceFile(
                segment.text,
                segmentFilePath,
                segment.voice,
                callback
              );
            };

            iterate();
          });
        });
      });
    });
  });
};
