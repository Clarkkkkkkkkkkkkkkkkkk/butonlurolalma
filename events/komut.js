//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------

const Discord = require('discord.js');
const moment = require('moment');
const chalk = require('chalk');
const db = require('quick.db')
const ayarlar = require('../ayarlar');

//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------

module.exports = async client => {

//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------

const botayar = ayarlar.bot
const kanallar = ayarlar.kanallar
const roller = ayarlar.roller
const botconfig = ayarlar.config

//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------

let ccc = chalk.yellow(" | ")

const rgun = moment(new Date().toISOString()).format('DD')
const ray = moment(new Date().toISOString()).format('MM').replace("01", "Ocak").replace("02","Şubat").replace("03","Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10","Ekim").replace("11","Kasım").replace("12","Aralık")
const ryıl = moment(new Date().toISOString()).format('YYYY')
const rsaat = moment(new Date().toISOString()).format('HH:mm:ss')
const rcre = `${rgun} ${ray} ${ryıl} | ${rsaat}`  

let tarihc = ccc+chalk.red("Tarih : ")+chalk.white("[")+chalk.green(rcre)+chalk.white("]")+ccc

let discowbotc = chalk.magenta("Mhykol / Bot")

const komutc = message => {
  console.log(chalk.bold(`${discowkomutc} ${tarihc} `+chalk.red(message)))
}

const girisc = message => {
  console.log(chalk.bold(`${discowgirisc} ${tarihc} `+chalk.red(message)))
}

const seslic = message => {
  console.log(chalk.bold(`${discowsesliodac} ${tarihc} `+chalk.red(message)))
}

const logc = message => {
  console.log(chalk.bold(`${discowbotc} ${tarihc} `+chalk.red(message)))
}

const mongoc = message => {
  console.log(chalk.bold(`${discowmongoc} ${tarihc} `+chalk.red(message)))
}

const eventc = message => {
  console.log(chalk.bold(`${discoweventc} ${tarihc} `+chalk.red(message)))
}

//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------

client.on("message", async message => {

        if(message.author.bot) return;
        if(message.channel.type === "dm") return;

const msunucu = message.guild
const muye = message.member
const msahip = message.author
const mkanal = message.channel

const prefix = ayarlar.bot.prefix

        if (!message.content.startsWith(prefix)) return;
let command = message.content.split(' ')[0].slice(prefix.length);
let params = message.content.split(' ').slice(1);
let cmd;

        if (!client.commands.has(command)) {
        if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
} else {
        if(command == '') return;
}
}

        if (client.commands.has(command)) {
    cmd = client.commands.get(command);
} else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
}

//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------

        if (cmd) {

const discow = new Discord.MessageEmbed().setColor('BLACK').setFooter(`${botconfig.footer}`, message.author.avatarURL({ dynamic: true, size: 2048 })).setTimestamp()
const dikkat = client.emojis.cache.get(ayarlar.emojiler.discow_carpi)
const tik = client.emojis.cache.get(ayarlar.emojiler.discow_tik)
const ok = client.emojis.cache.get(ayarlar.emojiler.discow_ok)
        
const gonder = async mesaj => {
    message.channel.send(discow.setDescription(`${mesaj}`))
}
const hata = async mesaj => {
    message.channel.send(discow.setDescription(`${dikkat} ${mesaj} ${dikkat}`))
}

const kanal = client.guilds.cache.get(botconfig.sunucuid).channels.cache.get("899679952050458625")
        
        if(!kanal) return hata(`**\`Komut Log\` Kanalını Bulamıyorum.**`)

    cmd.run(client, message, params).catch(err => {

    kanal.send(discow.setDescription(`${dikkat} **Komutta Bir Hata Oluştu.** ${dikkat}

${ok} **Komutu Kullanan :** **${mesajsahip}**
${ok} **Komutu Kullanan ID :** **\`${mesajsahip.id}\`**

${ok} **Kullanılan Komut :** **\`${prefix+command}\`**

${ok} **Tarih :** **[\`${rcre}\`]**`)
.addField(`${ok} **Hata :**`, `**\`\`\`js\n${err}\`\`\`**`))
kanal.send(`${botayar.sahipler.map(x => `<@${x}>`)}`)

})

    logc("Bir Komut Kullanıldı. / Kullanılan Komut : "+prefix+command+" / Komutun Adı : "+client.aliases.get(command))

    kanal.send(discow.setDescription(`${tik} **Bir Komut Kullanıldı.** ${tik}
    
    ${ok} **Komutu Kullanan :** **${msahip} / (\`${msahip.tag}\`)**
    ${ok} **Komutu Kullanan ID :** **\`${msahip.id}\`**

    ${ok} **Komutun Kullanıldığı Sunucu :** **\`${msunucu.name}\`**
    ${ok} **Komutun Kullanıldığı Sunucu ID :** **\`${msunucu.id}\`**
    
    ${ok} **Kullanılan Komut :** **\`${prefix+command}\`**
    ${ok} **Mesaj :**
    **\`\`\`js\n${message.content}\`\`\`**
    ${ok} **Tarih :** **[\`${rcre}\`]**`))

}})};

