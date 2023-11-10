const {Pinecone} = require("@pinecone-database/pinecone");
 
// Pinecone connection 
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT
});


module.exports = pinecone   