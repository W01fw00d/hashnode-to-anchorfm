# Hasnode to Anchor.fm

An automation tool to transform your blog into audio and publish it as a podcast in Anchor.fm

[Blog post about this project](https://thenursewhocoded.hashnode.dev/how-to-transform-your-blog-into-a-podcast-for-free)

[Audio version](https://anchor.fm/gabriel-romaymachado/episodes/How-to-transform-your-blog-into-a-podcast-for-free-evavgb)

## How it works

</br>

<div align="center">
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/javascript.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/puppeteer.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/puppet.svg"/>
</div>

</br>

# Transform text doc to voice audio file

| **Main dependencies:**

- [node-gtts](https://www.npmjs.com/package/node-gtts)
- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)

| **Setup:**

- Install [ffmpeg](http://www.ffmpeg.org/). It's recommended to install full version to be sure to have all needed features
- `[Windows]` Add `ffmpeg` and `ffprobe` to your `PATH`

- Install other dependencies:

```
npm install
```

| **How to use:**

- If you want to upload into AnchorFM, you need to set your credentials in `secrets/anchor/email` and `secrets/anchor/password`

- Expected folder structure:

  - blog-management\thenursewhocoded (contains .md files used as text input)
  - blog-management\songs (contains .mp3 to be added at chapter opening and closure)
  - blog-management\hashnode-to-anchorfm (this repository)

- Add the input text doc in `.md` format in `thenursewhocoded`

- Expected input filename structure: `src/input/{postCode}.json`. You have an example in `src/input/test1/post1.json`

  - In the json file, "code" atribute must be equal to `filename` in `thenursewhocoded/{filename}.md`

- Add desired `opening.mp3` song in `blog-management/songs/{blogCode}/opening`. Add the `closure.mp3` song in `blog-management/songs/{blogCode}/closure`

- Create `output/{blogCode}` folder. It will be used to store the output audio file

- You can run independently the task for transforming from text to voice (? args are optional):

```
npm run text-to-voice {blogCode} {postCode} {?lang}
```

A) `blogCode`: The name of the folder for your chosen input file, as well as the desired location for the output file. It's part of the input and output file name too

B) `postCode`: Part of the input and output file name

C) `lang`: Desired language for the voices. Supports Spanish (`es`) and English (`en`). Defaults to `en`

- `text-to-voice` output `.mp3` audio file will be created on `src/output/{blogCode}`

- A `{blogCode}.json` file will be created too on output, that will be used by the `upload-anchor` task

- [TODO, Not working right now] You can also run only the task for uploading to AnchorFM:

```
npm run upload-anchor [same params]
```

- Audio file will be uploaded to AnchorFM

- [TODO, Not working right now] You can execute together text-to-voice and upload-anchor tasks with:

```
npm run text-to-anchor [same params]
```

| **Command executed on ffmpeg in text-to-voice task:**

```
ffmpeg -i src/input/test1/songs/opening.mp3 -i src/output/test1/test1_cap1_0_0.mp3 -i src/input/test1/songs/closure.mp3
-y -filter_complex concat=n=73:v=0:a=1 src/output/test1/test1_cap1.mp3
```

# Credits

- [Forked repo](https://github.com/Schrodinger-Hat/youtube-to-anchorfm): [@thejoin](https://github.com/thejoin95) & [@wabri](https://github.com/wabri)

- Code for gtts by @W01fw00d from https://github.com/W01fw00d/text-to-voice

- Hasnode management by @W01fw00d

- `test1` opening and closure songs were created by @W01fw00d

# License

MIT
