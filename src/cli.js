#!/usr/bin/env node

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

import { Command, Option } from "commander";
import { MinifluxClient } from "miniflux-js";
import nfzf from "node-fzf";

import * as fs from "node:fs/promises";
import * as util from "node:util";
import * as child_process from "node:child_process";

// ---------------

const program = new Command();

const OPTION_DEFAULTS = {
	limit: 10,
	verbose: false,
	action: "open",
	directory: `${process.env.HOME}/Movies/`,
	envFile: `${process.env.HOME}/.config/yt-flux/env.json`,
};

program
	.name("yt-flux")
	.description(
		"Tool that interacts with Miniflux RSS reader API to open, copy links to or download YouTube videos"
	)
	.option(
		"-l, --limit <limit>",
		"limit for the number of listed videos",
		OPTION_DEFAULTS.limit
	)
	.addOption(
		new Option(
			"-a, --action <action>",
			"action to perform on selected video"
		)
			.choices(["open", "download", "copy", "o", "d", "c"])
			.default(OPTION_DEFAULTS.action)
	)
	.option(
		"-d, --directory <path>",
		"directory to download videos to",
		OPTION_DEFAULTS.directory
	)
	.option("-b, --browser <path>", "path to browser to open video in")
	.option(
		"-v, --verbose",
		"display JavaScript errors",
		OPTION_DEFAULTS.verbose
	)
	.option(
		"--env-file <path>",
		"path to environment json file",
		OPTION_DEFAULTS.envFile
	)
	.version("0.1.0");

program.parse();

const OPTIONS = program.opts();

// ---------------

const getEnv = async () => {
	try {
		const buf = await fs.readFile(OPTIONS.envFile);
		return JSON.parse(buf);
	} catch (err) {
		console.error(
			"Opening of local environment file failed. Use flag --verbose for JavaScript error"
		);
		if (OPTIONS.verbose) console.error(`\n${err}`);
		process.exit(1);
	}
};

const ENV = await getEnv();

const getId = async () => {
	if (ENV.ytId) return ENV.ytId;

	const all = await client.getCategories();
	return all.find((c) => c.title == "YouTube").id;
};

const id = await getId();

const client = new MinifluxClient({
	baseURL: ENV.baseURL,
	apiKey: ENV.key,
	authType: "api_key",
});

const entries = (
	await client.getCategoryEntries(id, {
		limit: OPTIONS.limit,
		direction: "desc",
	})
).entries;

let list = {};
entries.forEach((e) => {
	list[`[${e.id}] ${e.author} -> ${e.title}`] = `${e.url}`;
});

// Now this is what I call hideously elegant
const videos = Object.keys(list);
const video = await (async () => (await nfzf(videos)).selected.value)();
const url = await list[video];

switch (OPTIONS.action) {
	case "open":
		child_process.spawn("open", [
			"-a",
			"/Applications/Brave Browser.app",
			url,
		]);
		break;
	default:
		console.log("This option has not been implemented yet");
}
