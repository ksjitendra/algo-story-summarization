
const pineconeClient = require("../Config/pincone")
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter")
const { embeddingClient } = require("../Config/openai")
 
/**
 * Storing embeddings in pincone 
 * @param {*} docs 
 * @returns 
 */
const storeData = async (docs) => {
  
    try {

    // Pinecone index 
    const index = pineconeClient.Index(process.env.PINECONE_INDEX)

    // Iterating over the generated docs 
    for(const doc of docs) {
        const txtPath = doc.metadata.source;
        const text = doc.pageContent; // Text contnent of a single page

        // Text splitter confiuguration, chunks configuration
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
        });
        
        // Creating chunks of a signle document text data
        const chunks = await textSplitter.createDocuments([text]);

        // Creating embeddings of generated chunks 
        const embeddings = await embeddingClient.embedDocuments(
            chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " ")) // Replacing the new line code with empty string
          );

        const batchSize = 100;
        let batch = [];

        for (let idx = 0; idx < chunks.length; idx++) {
            const chunk = chunks[idx];

            const vector = {
                id: `${txtPath}_${idx}`,
                values: embeddings[idx],
                metadata: {
                    ...chunk.metadata,
                    loc: JSON.stringify(chunk.metadata.loc),
                    pageContent: chunk.pageContent,
                    txtPath: txtPath,
                }
            };

            batch.push(vector);

            if (batch.length === batchSize || idx === chunks.length - 1) {
                const savedData = await index.upsert(batch);
                console.log("data has been saved", savedData);
                batch = [];
            }
        }
    }

    return true;

    } catch (error) {
        console.log("Getting trouble in saving data into pincone", error.message);
        return false;
    }
}

module.exports = { storeData }