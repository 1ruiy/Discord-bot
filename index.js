const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// إنشاء خادم بسيط لإبقاء البوت شغال 24/7
http.createServer((req, res) => {
    res.write("Bot is alive!");
    res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const CHANNEL_ID = '1559104968894578749';
const GUILD_ID = '1543168935036330085';

async function connectToVoice() {
    try {
        // استخدام fetch بدلاً من cache لضمان جلب البيانات الصحيحة
        const guild = await client.guilds.fetch(GUILD_ID);
        if (!guild) {
            console.error("لم يتم العثور على السيرفر!");
            return;
        }

        const channel = await guild.channels.fetch(CHANNEL_ID);
        if (!channel) {
            console.error("لم يتم العثور على الروم الصوتية!");
            return;
        }

        joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: true
        });
        console.log("تم الاتصال بالروم الصوتية بحالة Deafen!");
    } catch (error) {
        console.error("خطأ في الاتصال:", error);
    }
}

client.once('ready', async () => {
    console.log(`تم تسجيل الدخول باسم: ${client.user.tag}`);
    await connectToVoice();
    
    // إعادة محاولة الاتصال كل 5 دقائق لضمان عدم الخروج
    setInterval(connectToVoice, 300000);
});

client.login(process.env.DISCORD_TOKEN);

