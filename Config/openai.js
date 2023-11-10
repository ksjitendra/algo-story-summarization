const { OpenAIEmbeddings } = require("langchain/embeddings/openai")
const { OpenAI } = require("langchain/llms/openai");

// Establishing open AI client 
const embeddingClient = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_AI_APIKEY,
    model: "gpt-3.5-turbo", 
})


const openAiModel = new OpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 1,
    openAIApiKey: process.env.OPEN_AI_APIKEY,
  });

module.exports = {embeddingClient, openAiModel}