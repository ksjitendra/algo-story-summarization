const { ChatOpenAI } = require("langchain/chat_models/openai");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { loadQAStuffChain }  = require("langchain/chains");
const { Document } = require("langchain/document");
const pineconeClient = require("../Config/pincone")
const {embeddingClient, openAiModel  } = require("../Config/openai")

// Hndling question , getting answer using references and question string
const getResults =  async (req, res) => {

    try {
            const question = req.body.question
            var result = false
            console.log(question); 
            const index = pineconeClient.Index(process.env.PINECONE_INDEX)
            const queryEmbeddings = await embeddingClient.embedQuery(question)
            const queryResponse = await index.query({
                    topK : 10,
                    vector: queryEmbeddings, 
                    includeMetadata: true, 
                    includeValues: true
            });   

            console.log("queryResponse", queryResponse.matches.length);
            if(queryResponse.matches.length > 0) {

                const chain = loadQAStuffChain(openAiModel);

                const concatenatedPageContent = queryResponse.matches
                                                .map((match) => match.metadata.pageContent)
                                                .join(" ");

                result = await chain.call({input_documents: [new Document({ pageContent: concatenatedPageContent })],
                                                question: question,
                                                });
            }

            res.status(200).json({
                answer: (result) ? result: "Not found!",
                message: "Answer retrieved successfully"
            })
        
    } catch (error) {

        res.status(400).json({
            error: error.message, 
            message: "Something went wrong"
        })
    }
}


module.exports = getResults