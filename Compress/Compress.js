const https = require('https');
const fs = require('fs');
const _exec = require('child_process').exec;

function Compress(msg,FileType){
    try {
        msg.reply('Attempting to compress file...')
        const [file, rnum] = [msg.attachments.array()[0].url, Math.floor(Math.random() * 999)]
        https.get(file, function (response) {
            if(process.platform === 'linux') {
                var [A, B] = [`Compress/Workspace/A_${rnum}`, `Compress/Results/Compressed_${rnum}.${FileType}`];
                var DeleteFiles = `rm -rf "${A}" "${B}"`
            } else if(process.platform === 'win32') {
                var [A, B] = [`Compress\\Workspace\\A_${rnum}`, `Compress\\Results\\Compressed_${rnum}.${FileType}`];
                var DeleteFiles = `Del "${A}" "${B}"`
            }
            var endFile = fs.createWriteStream(A);
            var stream = response.pipe(endFile);
            stream.on('finish', function () {
                _exec(`ffmpeg -i ${A} -map 0:a:0 -b:a 96k -ar 32000 ${B}`, function (err) {
                    if (err) throw err;
                    var embed = {
                        "title": `Attempted to compress your file :)`,
                        "color": 0X36393F,
                        "author": { 
                            "name": msg.author.username, 
                            "icon_url": msg.author.avatarURL() 
                        } 
                    };
                    msg.member.send({ embed: embed });
                    msg.member.send({ files: [B] });
                    msg.reply('Sent the compressed file to your dms :)');
                    setTimeout(() => { _exec(DeleteFiles, () => { console.log('Deleted All Files') }) }, 15000);
                });
            });
        })
    } catch {
        msg.reply('Error Occured.');
    };
};

module.exports = {Compress: Compress};