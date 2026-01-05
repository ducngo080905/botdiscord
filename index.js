require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");

// Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

client.once("ready", () => {
  console.log(`✅ Bot ChatGPT đã online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  // Bỏ qua bot khác
  if (message.author.bot) return;

  // Chỉ phản hồi khi bắt đầu bằng !chat
  if (!message.content.startsWith("!chat ")) return;

  const userPrompt = message.content.slice(6);

  if (!userPrompt) {
    return message.reply("❗ Bạn chưa nhập câu hỏi.");
  }

  try {
    // Gửi trạng thái đang gõ
    await message.channel.sendTyping();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Bạn là một trợ lý AI thân thiện, trả lời bằng tiếng Việt."
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: 500
    });

    const reply = response.choices[0].message.content;

    await message.reply(reply);
  } catch (error) {
    console.error(error);
    message.reply("❌ Có lỗi xảy ra khi gọi ChatGPT.");
  }
});

// Login bot
client.login(process.env.DISCORD_TOKEN);
