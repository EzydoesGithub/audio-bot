const ffprobe = require('ffprobe-client');

async function getFileInfo(msg){
    try {
        const URL = msg.attachments.array()[0].url;
        const data = await ffprobe(URL)
        const streamData = {
            "sampleRate": data.streams[0].sample_rate,
            "channels": data.streams[0].channels,
            "bitsPerSample": data.streams[0].bits_per_sample
        }
        const formatData = {
            "format": data.format.format_name,
            "formatLongName": data.format.format_long_name
        }
        var embed = {
            "title": `Information about file`,
            "color": 0X36393F,
            "fields": [
                {
                    "name": 'Stream one data',
                    "value": [
                        `Sample Rate: ${streamData['sampleRate']}`,
                        `Channels: ${streamData['channels']}`,
                        `Bits per sample: ${streamData['bitsPerSample']}`
                    ]
                },
                {
                    "name": "Stream one format",
                    "value": [
                        `Format: ${formatData['format']}`,
                        `Format Long Name: ${formatData['formatLongName']}`
                    ]
                }
            ],
            "author": { 
                "name": msg.author.username, 
                "icon_url": msg.author.avatarURL() 
            } 
        };
        msg.member.send({ embed: embed });
        msg.reply('Sent the file information to your dms :)');
    } catch {
        msg.reply('Error Occured') 
    }
};

module.exports = {getFileInfo: getFileInfo};