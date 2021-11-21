//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------

const Discord = require('discord.js');
const client = new Discord.Client();
const db = require('quick.db');

const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');
const mongo = require('mongoose');

const ayarlar = require('./ayarlar');
require('moment-duration-format')

const botayar = ayarlar.bot
const kanallar = ayarlar.kanallar
const roller = ayarlar.roller
const botconfig = ayarlar.config

global.client = client

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

let discowkomutc = chalk.magenta("Mhykol / Komutlar")
let discowmongoc = chalk.magenta("Mhykol / MongoDB")
let discowgirisc = chalk.magenta("Mhykol / Giriş")
let discowsesliodac = chalk.magenta("Mhykol / Sesli Oda")
let discowbotc = chalk.magenta("Mhykol / Bot")
let discoweventc = chalk.magenta("Mhykol / Fonksiyonlar")

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

//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------

require('./events/komut')(client);
mongo.connect(botconfig.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(x => {
mongoc("MongoDB Bağlantısı Başarıyla Kuruldu.")
}).catch(err => {
mongoc("MongoDB Bağlantısı Kurulurken Bir Hata Oluştu.\nHata : "+chalk.yellow(err))
});


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
  fs.readdir("./komutlar/", (err, files) => {
    if (err) console.error(err);
    console.log(chalk.bold.yellow("——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————"))
  komutc(`${files.length} Adet Komut Yüklenicek.`);
  files.forEach(f => {
let props = require(`./komutlar/${f}`);
  komutc(`Bir Komut Yüklendi. / Yüklenen Komut : ${props.help.name} / Yüklenen Kod : ${f} / Komutun Alias'ları : ${props.conf.aliases.map(x => `${x}`).join(", ")}`);
  client.commands.set(props.help.name, props);
  props.conf.aliases.forEach(alias => {
  client.aliases.set(alias, props.help.name);
}); 
});
});

//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------

client.reload = command => {
    return new Promise((resolve, reject) => {
    try {
  delete require.cache[require.resolve(`./komutlar/${command}`)];
let cmd = require(`./komutlar/${command}`);
  client.commands.delete(command);
  client.aliases.forEach((cmd, alias) => {
    if (cmd === command) client.aliases.delete(alias);});
  client.commands.set(command, cmd);
  cmd.conf.aliases.forEach(alias => {
  client.aliases.set(alias, cmd.help.name);
});
  resolve();
} catch (e) {
  reject(e);
}
});
};

client.load = command => {
    return new Promise((resolve, reject) => {
    try {
let cmd = require(`./komutlar/${command}`);
  client.commands.set(command, cmd);
  cmd.conf.aliases.forEach(alias => {
  client.aliases.set(alias, cmd.help.name);
});
  resolve();
} catch (e) {
  reject(e);
}
});
};

client.unload = command => {
    return new Promise((resolve, reject) => {
    try {
  delete require.cache[require.resolve(`./komutlar/${command}`)];
let cmd = require(`./komutlar/${command}`);
  client.commands.delete(command);
  client.aliases.forEach((cmd, alias) => {
    if (cmd === command) client.aliases.delete(alias);
});
  resolve();
} catch (e) {
  reject(e);
}
});
};

//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------

const tokens = require('./token-girme')

client.login(tokens.token).then(x => {
  console.log("")
  girisc("Bot Başarıyla Giriş Yaptı.")
}).catch(err => girisc("Bot Giriş Yaparken Bir Hata Oluştu."))

client.on("ready", async () => {
  client.user.setPresence({ activity: { name: botconfig.footer, type: "PLAYING" }, status: botconfig.status })
  client.channels.cache.get(botconfig.seslioda).join().then(x => {
  client.guilds.cache.get(botconfig.sunucuid).members.cache.get(client.user.id).voice.setDeaf(true)
  seslic("Bot Başarıyla Sese Giriş Yaptı.")
  console.log(chalk.bold.yellow("——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————"))
}).catch(err => {
  seslic("Bot Sese Girerken Bir Hata Oluştu.\nHata : "+chalk.yellow(err))
  process.exit(0)
})
})

//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------

fs.readdir("./fonk", (err, files) => {
  if (err) return console.error(err);
  files
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
      let prop = require(`./fonk/${file}`);
      if (!prop.conf) return;
      client.on(prop.conf.name, prop);
      setTimeout(function() {
       eventc(`${chalk.magenta(prop.conf.name.toUpperCase())} Fonksiyonu Başarıyla Başlatıldı.`);
      }, 5000)
    });
});

//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------

client.discow = {
etki1: [
  { emoji: "🎆", id: "11discow", rol: "899679312607858708", label: "Etkinlik Katılımcısı", tagli: "Hayır" },
  { emoji: "🎉", id: "22discow", rol: "899679612349607987", label: "Çekiliş Katılımcısı", tagli: "Hayır" },
  { emoji: "🎆", id: "discow3etk", rol: "899679441658208316", label: "Konser Katılımcısı", tagli: "Hayır" },
  { emoji: "🎆", id: "discow4etk", rol: "899679670973399060", label: "Film İzleyicisi", tagli: "Hayır" },
],
oyun1: [
  { emoji: "🎮", id: "discow1oyunb", rol: "897208014422016050", label: "League Of Legends", tagli: "Hayır" },
  { emoji: "🎮", id: "discow2oyun", rol: "897208011347595295", label: "Grand Theft Auto", tagli: "Hayır" },
  { emoji: "🎮", id: "discow3oyun", rol: "897208010340958298", label: "Among US", tagli: "Hayır" },
  { emoji: "🎮", id: "discow4oyun", rol: "897208015202160640", label: "Mobile Legends", tagli: "Hayır" },
  { emoji: "🎮", id: "discow5oyun", rol: "897208017500655696", label: "Pubg Mobile", tagli: "Hayır" },
  { emoji: "🎮", id: "discow6oyun", rol: "897208015969726524", label: "Pubg", tagli: "Hayır" },
  { emoji: "🎮", id: "discow7oyun", rol: "897208013507657779", label: "Minecraft", tagli: "Hayır" },
  { emoji: "🎮", id: "discow8oyun", rol: "897208012308090901", label: "Counter Strike", tagli: "Hayır" },
  { emoji: "🎮", id: "discow9oyun", rol: "897208016741498960", label: "Valorant", tagli: "Hayır" },
],
burc1: [
  { emoji: "♈", id: "discow1burc", rol: "897958538012413962", label: "Koç", tagli: "Hayır" },
  { emoji: "♉", id: "discow2burc", rol: "897208022118580285", label: "Boğa", tagli: "Hayır" },
  { emoji: "♊", id: "discow3burc", rol: "897208028401643570", label: "İkizler", tagli: "Hayır" },
  { emoji: "♋", id: "discow4burc", rol: "897208027520839741", label: "Yengeç", tagli: "Hayır" },
  { emoji: "♌", id: "discow5burc", rol: "897208023733375047", label: "Aslan", tagli: "Hayır" },
  { emoji: "♍", id: "discow6burc", rol: "897208024790360074", label: "Başak", tagli: "Hayır" },
  { emoji: "♎", id: "discow7burc", rol: "897208025557893160", label: "Terazi", tagli: "Hayır" },
  { emoji: "♏", id: "discow8burc", rol: "897208026556145764", label: "Akrep", tagli: "Hayır" },
  { emoji: "♐", id: "discow9burc", rol: "897208020612829194", label: "Yay", tagli: "Hayır" },
  { emoji: "♑", id: "discow10burc", rol: "897208018956062731", label: "Oğlak", tagli: "Hayır" },
  { emoji: "♓", id: "discow11burc", rol: "898266671914037308", label: "Balık", tagli: "Hayır" },
  { emoji: "♒", id: "discow12burc", rol: "897208021342650448", label: "Kova", tagli: "Hayır" },
],
sevg1: [
  { emoji: "💕", id: "discow1sev", rol: "897207998760497235", label: "Couple", tagli: "Hayır" },
  { emoji: "💔", id: "discow2sev", rol: "897208000291418132", label: "Alone", tagli: "Hayır" },
  { emoji: "🎆", id: "discow3sev", rol: "899685617280122880", label: "Dear I Don't", tagli: "Hayır" },
  { emoji: "⭕", id: "discow4sev", rol: "899685801556860979", label: "LGBT++", tagli: "Hayır" },
  { emoji: "♾️", id: "discow5sev", rol: "899685645654560810", label: "1881-193∞", tagli: "Hayır" },
  ],
  tag: "❆"
}

const yarq = require("discord-buttons");
require('discord-buttons')(client)

client.on('message', async message => {
  
const dikkat = client.emojis.cache.get(ayarlar.emojiler.discow_carpi)
const tik = client.emojis.cache.get(ayarlar.emojiler.discow_tik)
const ok = client.emojis.cache.get(ayarlar.emojiler.discow_ok)
  
    if(message.content === "!!menuler") {
      if(message.author.id != "189455299868884992") return;

//------------------------------------------------------------------------------------------------------------

let oyunkutu = []
let burckutu = []
let sevkutu = []
let etkkutu = []
    
client.discow.etki1.forEach(x => {
  oyunkutu.push(new yarq.MessageMenuOption().setLabel(x.label).setEmoji(x.emoji).setValue(x.id))
})

client.discow.oyun1.forEach(x => {
  burckutu.push(new yarq.MessageMenuOption().setLabel(x.label).setEmoji(x.emoji).setValue(x.id))
})

client.discow.burc1.forEach(x => {
  sevkutu.push(new yarq.MessageMenuOption().setLabel(x.label).setEmoji(x.emoji).setValue(x.id))
})

client.discow.sevg1.forEach(x => {
  etkkutu.push(new yarq.MessageMenuOption().setLabel(x.label).setEmoji(x.emoji).setValue(x.id))
})

let discowmenu1 = new yarq.MessageMenu()
.setID('oyun_menu')
.setPlaceholder('Etkinlik Rollerini Seçmek İçin Tıkla.')
.setMaxValues(1)
.setMinValues(1)
oyunkutu.forEach(xs => {
  discowmenu1
.addOption(xs)
})

let discowmenu2 = new yarq.MessageMenu()
.setID('burc_menu')
.setPlaceholder('Oyun Rollerini Seçmek İçin Tıkla.')
.setMaxValues(1)
.setMinValues(1)
burckutu.forEach(xs => {
discowmenu2
.addOption(xs)
})

let discowmenu3 = new yarq.MessageMenu()
.setID('sevgili_menu')
.setPlaceholder('Burç Rollerini Seçmek İçin Tıkla.')
.setMaxValues(1)
.setMinValues(1)
sevkutu.forEach(xs => {
discowmenu3
.addOption(xs)
})

let discowmenu4 = new yarq.MessageMenu()
.setID('etkinlik_menu')
.setPlaceholder('Sevgili Rollerini Seçmek İçin Tıkla.')
.setMaxValues(1)
.setMinValues(1)
etkkutu.forEach(xs => {
discowmenu4
.addOption(xs)
})

const menu1 = new yarq.MessageActionRow()
.addComponent(discowmenu1)
const menu2 = new yarq.MessageActionRow()
.addComponent(discowmenu2)
const menu3 = new yarq.MessageActionRow()
.addComponent(discowmenu3)
const menu4 = new yarq.MessageActionRow()
.addComponent(discowmenu4)

//------------------------------------------------------------------------------------------------------------

await message.channel.send(new Discord.MessageEmbed().setColor('BLACK').setFooter(`${ayarlar.config.footer}`, message.author.avatarURL({ dynamic: true })).setTimestamp().setTitle("Mhykol | Menü Sistemi").setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`), { components: [menu1, menu2, menu3, menu4] })
    
}})

//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------
//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------

client.on("clickMenu", async (button) => {
  
const dikkat = client.emojis.cache.get(ayarlar.emojiler.discow_carpi)
const tik = client.emojis.cache.get(ayarlar.emojiler.discow_tik)
const ok = client.emojis.cache.get(ayarlar.emojiler.discow_ok)

const uye = button.clicker.member
const kanal = button.channel

const discowembed = new Discord.MessageEmbed().setColor('BLACK').setTimestamp().setAuthor(`${uye.user.tag} / ${uye.id}`, uye.user.avatarURL({ size: 2048, dynamic: true }) || client.user.avatarURL()).setFooter(`${ayarlar.config.footer}`, uye.user.avatarURL({ size: 2048, dynamic: true }) || client.user.avatarURL())

//--------------------------------------------------//--------------------------------------------------//--------------------------------------------------

    client.discow.etki1.forEach(async x => {
	
		if(button.values[0] === x.id) {

const rol = button.guild.roles.cache.find(r => r.id === x.rol)

        if(!rol) return button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`Verilecek/Alınacak\` Rolü Bulamıyorum, Lütfen Bunu Sahibime İletin.** ${tik}`), true).then(x => { button.reply.defer(), x.delete({ timeout: 5000 })})

		if(x.tagli === "Evet") {

	    if(!uye.user.tag.includes(client.discow.tag)) return button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${dikkat} **Bu Rol Taglılara Özel Bir Rol Olduğu İçin Bu Rolü Alamazsın.** ${dikkat}
    
${ok} **Eğer Tagımızı Almak İstersen Herhangi Bir Kanala \`.tag\` Yazman Yeterli.** ${tik}`), true).then(x => { button.reply.defer(), x.delete({ timeout: 5000 })})

        if(!uye.roles.cache.get(rol.id)) {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerine Verildi.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.add(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

} else {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerinden Alındı.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.remove(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

}	

} else {

        if(!uye.roles.cache.get(rol.id)) {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerine Verildi.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.add(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

} else {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerinden Alındı.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.remove(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))


}

}

}})

//------------------------------------------------------------------------------------------------------------

    client.discow.oyun1.forEach(async x => {
	
		if(button.values[0] === x.id) {

const rol = button.guild.roles.cache.find(r => r.id === x.rol)

        if(!rol) return button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`Verilecek/Alınacak\` Rolü Bulamıyorum, Lütfen Bunu Sahibime İletin.** ${tik}`), true).then(x => { button.reply.defer(), x.delete({ timeout: 5000 })})

		if(x.tagli === "Evet") {

	    if(!uye.user.tag.includes(client.discow.tag)) return button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${dikkat} **Bu Rol Taglılara Özel Bir Rol Olduğu İçin Bu Rolü Alamazsın.** ${dikkat}
    
${ok} **Eğer Tagımızı Almak İstersen Herhangi Bir Kanala \`.tag\` Yazman Yeterli.** ${tik}`), true).then(x => { button.reply.defer(), x.delete({ timeout: 5000 })})

        if(!uye.roles.cache.get(rol.id)) {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerine Verildi.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.add(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

} else {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerinden Alındı.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.remove(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

}	

} else {

        if(!uye.roles.cache.get(rol.id)) {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerine Verildi.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.add(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

} else {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerinden Alındı.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.remove(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))


}

}

}})

//------------------------------------------------------------------------------------------------------------

    client.discow.burc1.forEach(async x => {
	
		if(button.values[0] === x.id) {

const rol = button.guild.roles.cache.find(r => r.id === x.rol)

        if(!rol) return button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`Verilecek/Alınacak\` Rolü Bulamıyorum, Lütfen Bunu Sahibime İletin.** ${tik}`), true).then(x => { button.reply.defer(), x.delete({ timeout: 5000 })})

		if(x.tagli === "Evet") {

	    if(!uye.user.tag.includes(client.discow.tag)) return button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${dikkat} **Bu Rol Taglılara Özel Bir Rol Olduğu İçin Bu Rolü Alamazsın.** ${dikkat}
    
${ok} **Eğer Tagımızı Almak İstersen Herhangi Bir Kanala \`.tag\` Yazman Yeterli.** ${tik}`), true).then(x => { button.reply.defer(), x.delete({ timeout: 5000 })})

        if(!uye.roles.cache.get(rol.id)) {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerine Verildi.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.add(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

} else {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerinden Alındı.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.remove(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

}	

} else {

        if(!uye.roles.cache.get(rol.id)) {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerine Verildi.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.add(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

} else {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerinden Alındı.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.remove(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))


}

}

}})

//------------------------------------------------------------------------------------------------------------

    client.discow.sevg1.forEach(async x => {
	
		if(button.values[0] === x.id) {

const rol = button.guild.roles.cache.find(r => r.id === x.rol)

        if(!rol) return button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`Verilecek/Alınacak\` Rolü Bulamıyorum, Lütfen Bunu Sahibime İletin.** ${tik}`), true).then(x => { button.reply.defer(), x.delete({ timeout: 5000 })})

		if(x.tagli === "Evet") {

	    if(!uye.user.tag.includes(client.discow.tag)) return button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${dikkat} **Bu Rol Taglılara Özel Bir Rol Olduğu İçin Bu Rolü Alamazsın.** ${dikkat}
    
${ok} **Eğer Tagımızı Almak İstersen Herhangi Bir Kanala \`.tag\` Yazman Yeterli.** ${tik}`), true).then(x => { button.reply.defer(), x.delete({ timeout: 5000 })})

        if(!uye.roles.cache.get(rol.id)) {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerine Verildi.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.add(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

} else {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerinden Alındı.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.remove(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

}	

} else {

        if(!uye.roles.cache.get(rol.id)) {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerine Verildi.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.add(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))

} else {

	await button.reply.defer();
    await button.channel.send(`**${uye}, \`${uye.id}\`**`,discowembed.setDescription(`${ok} **\`${rol.name}\` Rolü Başarıyla Üzerinden Alındı.** ${tik}`), true).then(x => { x.delete({ timeout: 5000 })})
    await uye.roles.remove(rol.id)
	await button.message.edit(discowembed.setDescription(`${ok} **Rollerinizi Aşağıdaki Menülerden Seçebilirsiniz.** ${tik}`).addField(`Rolünü Güncelleyen :`, `**\`\`\`fix\n${uye.user.tag} / ${uye.id}\`\`\`**`, true).addField(`Güncellediği Rol :`, `**\`\`\`fix\n@${rol.name} / ${rol.id}\`\`\`**`, true))


}

}

}})

//------------------------------------------------------------------------------------------------------------

})

//------------------------------------------------------------------------------------------------------------//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------//------------------------------------------------------------------------------------------------------------