//  _           _
// (_)_ __   __| | _____  __
// | | '_ \ / _` |/ _ \ \/ /
// | | | | | (_| |  __/>  <
// |_|_| |_|\__,_|\___/_/\_\
//
// Logs out all the channel outlines for redirecting
// with shell scripts
//
// Tristan Lukens, 20205

const csv = require("csv-parser");
const fs = require("fs");

const PATH = "./lib/subscriptions.csv";

let NO_SHORTS = false;
if (process.argv.includes("-n") || process.argv.includes("--no-shorts"))
	NO_SHORTS = true;

if (process.argv.includes("-h") || process.argv.includes("--help")) {
	console.log(
		`Usage\n--[h]elp: show this screen\n--[n]o-shorts: output feeds without shorts (live videos are also omitted)`
	);
	process.exit("0");
}

let channels = [];
fs.createReadStream(PATH)
	.pipe(
		csv({
			skipComments: "#",
			mapHeaders: ({ header }) => header.toLowerCase().replace(" ", "_"),
		})
	)
	.on("data", (data) => channels.push(data))
	.on("end", () => {
		console.log(handle(channels).join("\n"));
	});

const handle = (channels) => {
	let outlines = [];

	// https://blog.amen6.com/blog/2025/01/no-shorts-please-hidden-youtube-rss-feed-urls/
	channels.forEach((c) => {
		let xmlUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${c.channel_id}`;

		if (NO_SHORTS)
			xmlUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=UULF${c.channel_id.slice(
				2
			)}`;

		outlines.push(
			`<outline title="${c.channel_title}" text="${c.channel_title}" type="rss" xmlUrl="${xmlUrl}"></outline>`
		);
	});

	return outlines;
};
