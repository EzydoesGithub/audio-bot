const https = require('https');
const fs = require('fs');
const _exec = require('child_process').exec;

function MKVBait(msg){
    try {
        msg.reply('Generating your bait...')
        const [file, rnum] = [msg.attachments.array()[0].url, Math.floor(Math.random() * 999)]
        https.get(file, function (response) {
            if(process.platform === 'linux') {
                var [A, B] = [`MakeBait/Workspace/A_${rnum}`, `MakeBait/Results/Bait_${rnum}.mp3`];
                var DeleteFiles = `rm -rf "${A}" "${B}"`
            } else if(process.platform === 'win32') {
                var [A, B] = [`MakeBait\\Workspace\\A_${rnum}`, `MakeBait\\Results\\Bait_${rnum}.mp3`];
                var DeleteFiles = `Del "${A}" "${B}"`
            };
            var endFile = fs.createWriteStream(A);
            var stream = response.pipe(endFile);
            stream.on('finish', function () {
                _exec(`ffmpeg -i ${A} -f matroska -acodec libmp3lame -ac 1 -aq 0 -ar 8000 -ss 0 -to 0.45 ${B}`, function (err) {
                    if (err) throw err;
                    msg.member.send({ embed: {
                        "title": `Generated your bait :)`,
                        "color": 0X36393F,
                        "author": { 
                            "name": msg.author.username, 
                            "icon_url": msg.author.avatarURL() 
                        } 
                    }}).then(()=>{
                        msg.reply('Sent the bait to your dms :)');
                        msg.member.send({ files: [B] })
                    }).catch(() => {msg.reply('Error sending the file to your dms. Make sure your dms are enabled!')})
                    setTimeout(() => { _exec(DeleteFiles, () => { console.log('Deleted All Files') }) }, 15000);
                });
            });
        });
    } catch {
        msg.reply('Error Occured.');
    };
};

function WEBMBait(msg){
    try {
        msg.reply('Generating your bait...')
        const [file, rnum] = [msg.attachments.array()[0].url, Math.floor(Math.random() * 999)]
        https.get(file, function (response) {
            if(process.platform === 'linux') {
                var [A, B, C] = [`MakeBait/Workspace/A_${rnum}`, `MakeBait/Workspace/B_${rnum}.ogg`,`MakeBait/Results/Bait_${rnum}.ogg`];
                var DeleteFiles = `rm -rf "${A}" "${B}" "${C}"`
            } else if(process.platform === 'win32') {
                var [A, B, C] = [`MakeBait\\Workspace\\A_${rnum}`, `MakeBait\\Workspace\\B_${rnum}.ogg`,`MakeBait\\Results\\Bait_${rnum}.ogg`];
                var DeleteFiles = `Del "${A}" "${B}" "${C}"`
            };
            var endFile = fs.createWriteStream(A);
            var stream = response.pipe(endFile);
            stream.on('finish', function () {
                _exec(`ffmpeg -i ${A} -f webm -acodec libvorbis -ac 1 -ss 00:00:00 -t 00:01:15 ${B}`, function (err) {
                    if (err) throw err;
                    fs.readFile(B, 'binary', function (err, data) {
                        if (err) throw err;
                        data = data.replace(/webm/, ' anti || https://discord.gg/m4DETpH4hp ');
                        fs.writeFile(C, data, 'binary', function (err) {
                            if (err) throw err;
                            msg.member.send({ embed: {
                                "title": `Generated your bait :)`,
                                "color": 0X36393F,
                                "author": { 
                                    "name": msg.author.username, 
                                    "icon_url": msg.author.avatarURL() 
                                } 
                            }}).then(()=>{
                                msg.reply('Sent the bait to your dms :)');
                                msg.member.send({ files: [C] })
                            }).catch(() => {msg.reply('Error sending the file to your dms. Make sure your dms are enabled!')})
                            setTimeout(() => { _exec(DeleteFiles, () => { console.log('Deleted All Files') }) }, 15000);
                        });
                    });
                });
            });
        });
    } catch {
        msg.reply('Error Occured.');
    };
};

module.exports = {MKVBait: MKVBait, WEBMBait: WEBMBait};