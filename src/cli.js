#!/opt/homebrew/opt/node/bin/node

//             _   ____                     _
//   __ _  ___| |_|  _ \ ___  ___ ___ _ __ | |_ ___
//  / _` |/ _ \ __| |_) / _ \/ __/ _ \ '_ \| __/ __|
// | (_| |  __/ |_|  _ <  __/ (_|  __/ | | | |_\__ \
//  \__, |\___|\__|_| \_\___|\___\___|_| |_|\__|___/
//  |___/
//
// Logs out all titles and subs, with id which can be
// tracked to the video's url (fzf)
//
// Tristan Lukens, 2025

import { MinifluxClient } from "miniflux-js";
import * as fs from "node:fs/promises";

import { Command } from "commander";

import * as nfzf from "node-fzf";

// const program = new Command();

// program
// 	.name("yt-flux")
// 	.description(
// 		"CLI tool which interacts with Miniflux RSS reader API to open, copy links to or download YouTube videos"
// 	)
// 	.version("0.1.0");

// program.command("copy");

let OPTIONS = {
	limit: 10,
	verbose: false,
	action: "open",
	browserPath: "/Applications/Brave Browser.app",
};

// OPTIONS.verbose = process.argv.includes("--verbose");

// OPTIONS.limit = process.argv
// 	.filter((arg) => arg.includes("="))
// 	.find((pair) => /--limit=\d*/g.test(pair))
// 	.match(/\d+$/g);

// OPTIONS.action = process.argv.find((arg) => arg.match(/^-o|--open$/i));

const ENV_PATH = `${process.env.HOME}/.config/yt-flux/env.example.json`;
const getEnv = async () => {
	try {
		const buf = await fs.readFile(ENV_PATH);
		return JSON.parse(buf);
	} catch (err) {
		console.log(
			"Opening of local environment file failed. Use flag --verbose for JavaScript error"
		);
		if (OPTIONS.verbose) console.log(`\n${err}`);
		process.exit(1);
	}
};

const ENV = await getEnv();

const getCategoryId = async () => {
	if (ENV.ytId) return ENV.ytId;

	const all = await client.getCategories();
	return all.find((c) => c.title == "YouTube").id;
};

const client = new MinifluxClient({
	baseURL: ENV.baseURL,
	apiKey: ENV.key,
	authType: "api_key",
});

const id = await getCategoryId();

const entries = (
	await client.getCategoryEntries(id, {
		limit: OPTIONS.limit,
		direction: "desc",
	})
).entries;

let list = {};
entries.forEach((e) => {
	list[`${e.url}`] = `[${e.id}] ${e.author} -> ${e.title}`;
});

console.log(JSON.stringify(list));
