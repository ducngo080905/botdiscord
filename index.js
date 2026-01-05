require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");

// Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

client.once("ready", () => {
  console.log(`✅ Bot ChatGPT đã online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!chat ")) return;

  const userPrompt = message.content.slice(6).trim();
  if (!userPrompt) {
    return message.reply("❗ Bạn chưa nhập nội dung.");
  }

  try {
    await message.channel.sendTyping();

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: "Bạn là một trợ lý AI thân thiện, trả lời bằng tiếng Việt."
        },
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    const reply = response.output_text;

    await message.reply(reply || "❌ Không nhận được phản hồi từ AI.");
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    await message.reply("❌ Có lỗi xảy ra khi gọi ChatGPT.");
  }
});

client.login(process.env.DISCORD_TOKEN);
