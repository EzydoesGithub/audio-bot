const Discord = require('discord.js');
const client = new Discord.Client();
const talkedRecently = new Set();

const bypassMethods = require('./Bypass/methods.js');
const { Compress } = require('./Compress/Compress.js');
const { MKVBait, WEBMBait } = require('./MakeBait/MakeBait.js');
const { getFileInfo } = require('./FileInfo/FileInfo.js');
const { Options, Token, Prefix } = require('./config.json');

function bytesToSize(bytes) {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0) return 'n/a';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	if (i == 0) return bytes + ' ' + sizes[i];
	return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

function DeleteMethodCollectorAndMethodSelector(_stop,_delete) {
	setTimeout(() => {
		_stop.stop();
		_delete.delete();
	}, 1000)
}

client.on("message", async function (msg) {

	let body = msg.content.split(" ");
	var whitelistedChannel = false;
	if (Options['Channels'].length > 0) {
		for (i = 0; i < Options['Channels'].length; i++) {
			if (Options['Channels'][i] === msg.channel.id) {
				whitelistedChannel = true;
			};
		};
	} else {
		whitelistedChannel = true;
	};
	if (!whitelistedChannel) {
		return
	};

	if (body[0] === `${Prefix}bypass`) {
		if (msg.attachments.size > 0) {
			if (bytesToSize(msg.attachments.array()[0].size) == 'n/a') {
				return msg.reply('File has no data.');
			}
			if (bytesToSize(msg.attachments.array()[0].size).split(' ')[1] != 'KB' && bytesToSize(msg.attachments.array()[0].size).split(' ')[1] != 'Bytes' && parseInt(bytesToSize(msg.attachments.array()[0].size).split(' ')[0]) > 7) {
				return msg.reply('File too large.');
			};
			if (talkedRecently.has(msg.author.id)) {
				return msg.reply(`Wait ${millisToMinutesAndSeconds(Options['Timeout'])} before doing another command.`);
			}
			let emojis = ["🇦", "🇧", "🇨", "❌"];
			const embed = {
				color: 0X36393F,
				author: {
					name: msg.author.username,
					icon_url: msg.author.avatarURL()
				},
				title: 'anti-releases audio-bot',
				url: 'https://github.com/anti-releases/audio-bot',
				description: ":regional_indicator_a: **MKV Method**\nCopyright: Yes\nCurse words: Yes\nCheap: ~\n\n:regional_indicator_b: **WEBM Method**\nCopyright: No\nCurse words: Yes\nCheap: ~\n\n:regional_indicator_c: **Copyright Method**\nCopyright: Yes\nCurse Words: No\nCheap: Yes\n\n:x: **Cancel**\nCancels the command.\n\n*Please wait for all the reactions to finish before you select one*"
			};
			const methodSelector = await msg.channel.send({
				embed: embed
			});
			await methodSelector.react(emojis[0]);
			await methodSelector.react(emojis[1]);
			await methodSelector.react(emojis[2]);
			await methodSelector.react(emojis[3]);
			const methodCollector = methodSelector.createReactionCollector(
				(reaction, member) => emojis.includes(reaction.emoji.name) && !member.bot && member.id
			)
			methodCollector.on("collect", function (reaction) {
				reaction.users.remove(msg.author);
				if (reaction.users.cache.has(msg.author.id)) {
					switch (reaction.emoji.name) {
						case emojis[0]:
							bypassMethods.MKV_Method(msg);
							DeleteMethodCollectorAndMethodSelector(methodCollector,methodSelector)
							break;
						case emojis[1]:
							bypassMethods.WEBM_Method(msg);
							DeleteMethodCollectorAndMethodSelector(methodCollector,methodSelector)
							break;
						case emojis[2]:
							bypassMethods.COPYRIGHT_Method(msg);
							DeleteMethodCollectorAndMethodSelector(methodCollector,methodSelector)
							break;
						case emojis[3]:
							DeleteMethodCollectorAndMethodSelector(methodCollector,methodSelector)
							break;
					};
				}
			});
			talkedRecently.add(msg.author.id);
			setTimeout(() => {
				talkedRecently.delete(msg.author.id);
			}, Options['Timeout']);
		} else {
			msg.reply('No file attached!')
		}
	};

	if (body[0] === `${Prefix}compress`) {
		if (msg.attachments.size > 0) {
			if (bytesToSize(msg.attachments.array()[0].size) == 'n/a') {
				return msg.reply('File has no data.');
			}
			if (bytesToSize(msg.attachments.array()[0].size).split(' ')[1] != 'KB' && bytesToSize(msg.attachments.array()[0].size).split(' ')[1] != 'Bytes' && parseInt(bytesToSize(msg.attachments.array()[0].size).split(' ')[0]) > 7) {
				return msg.reply('File too large.');
			};
			if (talkedRecently.has(msg.author.id)) {
				return msg.reply(`Wait ${millisToMinutesAndSeconds(Options['Timeout'])} before doing another command.`);
			}
			let emojis = ["🇦", "🇧", "❌"];
			const embed = {
				color: 0X36393F,
				author: {
					name: msg.author.username,
					icon_url: msg.author.avatarURL()
				},
				title: "anti-releases audio-bot",
				url: 'https://github.com/anti-releases/audio-bot',
				description: ":regional_indicator_a: **MP3 Output**\n\n:regional_indicator_b: **OGG Output**\n\n:x: **Cancel**\nCancels the command.\n\n*Please wait for all the reactions to finish before you select one*"
			};
			const methodSelector = await msg.channel.send({
				embed: embed
			});
			await methodSelector.react(emojis[0]);
			await methodSelector.react(emojis[1]);
			await methodSelector.react(emojis[2]);
			const methodCollector = methodSelector.createReactionCollector(
				(reaction, member) => emojis.includes(reaction.emoji.name) && !member.bot && member.id
			);

			methodCollector.on("collect", function (reaction) {
				reaction.users.remove(msg.author);
				if (reaction.users.cache.has(msg.author.id)) {
					switch (reaction.emoji.name) {
						case emojis[0]:
							Compress(msg, 'mp3');
							DeleteMethodCollectorAndMethodSelector(methodCollector,methodSelector)
							break;
						case emojis[1]:
							Compress(msg, 'ogg');
							DeleteMethodCollectorAndMethodSelector(methodCollector,methodSelector)
							break;
						case emojis[2]:
							DeleteMethodCollectorAndMethodSelector(methodCollector,methodSelector)
							break;
					};
				}
			});
			talkedRecently.add(msg.author.id);
			setTimeout(() => {
				talkedRecently.delete(msg.author.id);
			}, Options['Timeout']);
		} else {
			msg.reply('No file attached!')
		}
	};

	if (body[0] === `${Prefix}makebait`) {
		if (msg.attachments.size > 0) {
			if (bytesToSize(msg.attachments.array()[0].size) == 'n/a') {
				return msg.reply('File has no data.');
			};
			if (bytesToSize(msg.attachments.array()[0].size).split(' ')[1] != 'KB' && bytesToSize(msg.attachments.array()[0].size).split(' ')[1] != 'Bytes' && parseInt(bytesToSize(msg.attachments.array()[0].size).split(' ')[0]) > 7) {
				return msg.reply('File too large.');
			};
			if (talkedRecently.has(msg.author.id)) {
				return msg.reply(`Wait ${millisToMinutesAndSeconds(Options['Timeout'])} before doing another command.`);
			};
			let emojis = ["🇦", "🇧", "❌"];
			const embed = {
				color: 0X36393F,
				author: {
					name: msg.author.username,
					icon_url: msg.author.avatarURL()
				},
				title: "anti-releases audio-bot",
				url: 'https://github.com/anti-releases/audio-bot',
				description: ":regional_indicator_a: **MKV Bait**\nAudio gets snipped to 0.5 seconds, so make sure the sound is within 0.5 seconds.\n\n:regional_indicator_b: **WEBM Bait**\nAudio gets snipped to 1:15\n\n:x: **Cancel**\nCancels the command.\n\n*Please wait for all the reactions to finish before you select one*"
			};
			const methodSelector = await msg.channel.send({
				embed: embed
			});
			await methodSelector.react(emojis[0]);
			await methodSelector.react(emojis[1]);
			await methodSelector.react(emojis[2]);
			const methodCollector = methodSelector.createReactionCollector(
				(reaction, member) => emojis.includes(reaction.emoji.name) && !member.bot && member.id
			);
			methodCollector.on("collect", function (reaction) {
				reaction.users.remove(msg.author);
				if (reaction.users.cache.has(msg.author.id)) {
					switch (reaction.emoji.name) {
						case emojis[0]:
							MKVBait(msg);
							DeleteMethodCollectorAndMethodSelector(methodCollector,methodSelector)
							break;
						case emojis[1]:
							WEBMBait(msg);
							DeleteMethodCollectorAndMethodSelector(methodCollector,methodSelector)
							break;
						case emojis[2]:
							DeleteMethodCollectorAndMethodSelector(methodCollector,methodSelector)
							break;
					};
				};
			});
			talkedRecently.add(msg.author.id);
			setTimeout(() => {
				talkedRecently.delete(msg.author.id);
			}, Options['Timeout']);
		} else {
			msg.reply('No file attached!')
		};
	};

	if(body[0] === `${Prefix}fileinfo`) {
		if (msg.attachments.size > 0) {
			if (bytesToSize(msg.attachments.array()[0].size) == 'n/a') {
				return msg.reply('File has no data.');
			};
			if (bytesToSize(msg.attachments.array()[0].size).split(' ')[1] != 'KB' && bytesToSize(msg.attachments.array()[0].size).split(' ')[1] != 'Bytes' && parseInt(bytesToSize(msg.attachments.array()[0].size).split(' ')[0]) > 7) {
				return msg.reply('File too large.');
			};
			if (talkedRecently.has(msg.author.id)) {
				return msg.reply(`Wait ${millisToMinutesAndSeconds(Options['Timeout'])} before doing another command.`);
			};
			getFileInfo(msg)
			talkedRecently.add(msg.author.id);
			setTimeout(() => {
				talkedRecently.delete(msg.author.id);
			}, Options['Timeout']);
		} else {
			msg.reply('No file attached!');
		};
	};

	if (body[0] === `${Prefix}cmds` || body[0] === `${Prefix}commands`|| body[0] === `${Prefix}cmd` || body[0] === `${Prefix}help`) {
		msg.channel.send({
			embed: {
				title: "anti-releases audio-bot",
				description: "Command list",
				url: "https://github.com/anti-releases/audio-bot",
				color: 0X36393F,
				author: {
					name: msg.author.username,
					icon_url: msg.author.avatarURL()
				},
				fields: [
					{
						name: `${Prefix}bypass`,
						value: "Give options with bypass method(s) to choose from then applies the selected method to your file."
					},
					{
						name: `${Prefix}compress`,
						value: "Compresses the audio that you input with options of .ogg and .mp3 outputs."
					},
					{
						name: `${Prefix}makebait`,
						value: "Turns your inputted file into a bait for method A."
					},
					{
						name: `${Prefix}fileinfo`,
						value: `Gives you "Important" information about the file.`
					}
				]
			}
		});
	};

});

client.on('ready', () => {
	client.user.setActivity('discord.gg/m4DETpH4hp | github.com/anti-releases/audio-bot')
	console.log(`Logged in as ${client.user.tag}!`)
});

client.login(Token);