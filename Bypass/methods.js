const https = require('https');
const fs = require('fs');
const _exec = require('child_process').exec;

function MKV_Method(msg) {
    try {
        msg.reply('Processing...')
        const [file,rnum] = [msg.attachments.array()[0].url,Math.floor(Math.random() * 100)]
        https.get(file, function (response) {
            fs.readdir('Bypass/mkvBaits', function (err, Baits) {
                if (err) throw err;
                setTimeout(()=>{

                    if(process.platform === 'linux') {
                        var Bait = `Bypass/mkvBaits/${Baits[Math.floor(Math.random() * Baits.length)]}`
                        var [A, B, output] = [`Bypass/Workspace/A_${rnum}.mp3`, `Bypass/Workspace/B_${rnum}.mp3`, `Bypass/Results/${Bait.replace('Bypass/mkvBaits/', '').replace('.mp3', '')}_${rnum}.mp3`]
                        var concat = `cat "${Bait}" "${B}" > "${output}"`
                        var DeleteFiles = `rm -rf "${A}" "${B}" "${output}"`
                    } else if(process.platform === 'win32') {
                        var Bait = `Bypass\\mkvBaits\\${Baits[Math.floor(Math.random() * Baits.length)]}`
                        var [A, B, output] = [`Bypass\\Workspace\\A_${rnum}.mp3`, `Bypass\\Workspace\\B_${rnum}.mp3`, `Bypass\\Results\\${Bait.replace('Bypass\\mkvBaits\\', '').replace('.mp3', '')}_${rnum}.mp3`]
                        var concat = `copy /b "${Bait}" + "${B}" "${output}"`
                        var DeleteFiles = `Del "${A}" "${B}" "${output}"`
                    }

                    var endFile = fs.createWriteStream(A);
                    var stream = response.pipe(endFile);
                    stream.on('finish', function () {
                        _exec(`ffmpeg -i ${A} -ac 2 -ar 32000 ${B}`, function (err) {
                            if (err) throw err;
                            _exec(concat, function (err) {
                                if (err) throw err;
                                var embed = {
                                    "title": `Successfully Applied Method "A" To Your File :)`,
                                    "color": 0X36393F,
                                    "author": { 
                                        "name": msg.author.username, 
                                        "icon_url": msg.author.avatarURL() 
                                    } 
                                };
                                msg.member.send({ embed: embed });
                                msg.member.send({ files: [output] });
                                msg.reply('Sent the bypass to your dms :)');
                                setTimeout(() => { _exec(DeleteFiles, () => { console.log('Deleted All Files') }) }, 15000);
                            });
                        });
                    });
                },3000)
            });
        })
    } catch {
        msg.reply('Error Occured.')
    };
};

function WEBM_Method(msg) {
    try {
        msg.reply('Processing...')
        const [file, rnum] = [msg.attachments.array()[0].url, Math.floor(Math.random() * 999)]
        https.get(file, function (response) {
            fs.readdir('Bypass/webmBaits', function (err, Baits) {
                if (err) throw err;
                setTimeout(()=>{
                    if(process.platform === 'linux') {
                        var Bait = `Bypass/webmBaits/${Baits[Math.floor(Math.random() * Baits.length)]}`
                        var [Header, A, B, output] = [`Bypass/webmRequirement/Header.ogg`,`Bypass/Workspace/A_${rnum}.mp3`, `Bypass/Workspace/B_${rnum}.mp3`, `Bypass/Results/${Bait.replace('Bypass/webmBaits/', '').replace('.ogg', '')}_${rnum}.ogg`];
                        var concat = `cat "${Bait}" "${B}" > "${output}"`
                        var DeleteFiles = `rm -rf "${A}" "${B}" "${output}"`
                    } else if(process.platform === 'win32') {
                        var Bait = `Bypass\\webmBaits\\${Baits[Math.floor(Math.random() * Baits.length)]}`
                        var [Header, A, B, output] = [`Bypass\\webmRequirement\\Header.ogg`,`Bypass\\Workspace\\A_${rnum}.mp3`, `Bypass\\Workspace\\B_${rnum}.mp3`, `Bypass\\Results\\${Bait.replace('Bypass\\webmBaits\\', '').replace('.ogg', '')}_${rnum}.ogg`];
                        var concat = `copy /b "${Header}" + "${B}" + "${Bait}" "${output}"`
                        var DeleteFiles = `Del "${A}" "${B}" "${output}"`
                    }
                    var endFile = fs.createWriteStream(A);
                    var stream = response.pipe(endFile);
                    stream.on('finish', function () {
                        _exec(`ffmpeg -i "${A}" -ac 2 -ar 32000 "${B}"`, function (err) {
                            if (err) throw err;
                            _exec(concat, function (err) {
                                if (err) throw err;
                                var embed = {
                                    "title": `Successfully Applied Method "B" To Your File :)`,
                                    "color": 0X36393F,
                                    "author": { 
                                        "name": msg.author.username, 
                                        "icon_url": msg.author.avatarURL() 
                                    } 
                                };
                                msg.member.send({ embed: embed });
                                msg.member.send({ files: [output] });
                                msg.reply('Sent the bypass to your dms :)');
                                setTimeout(() => { _exec(DeleteFiles, () => { console.log('Deleted All Files') }) }, 15000);
                            });
                        });
                    });
                },3000)
            });
        })
    } catch {
        msg.reply('Error Occured.')
    };
};

module.exports = {MKV_Method: MKV_Method, WEBM_Method: WEBM_Method};