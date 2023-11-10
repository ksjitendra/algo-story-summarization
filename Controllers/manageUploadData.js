 

const path = require('path')
const docPath = path.join(__dirname, "../Public/docs")
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const  { TextLoader } = require("langchain/document_loaders/fs/text");
const { storeData } = require("../Services/dataService")

const handleDocuments = async (req, res) => {

    try {
        // Loading text file 
        const textFile = path.join(docPath, "story-2.txt")
        const loader = new TextLoader(textFile);
        const docs = await loader.load();  

        // Calling data saving service 
        const saveData = await storeData(docs) 

        if(saveData) {
            console.log("Data saved successfully");
            res.status(200).json({
                message: "Data has saved successfully!",
            })
        }
    } catch (err) {
        console.error('Error reading files:', err);
        res.status(200).json({
            error : err.message,
            message: "Getting trouble in saving data!",
        })

    }
}
module.exports = {handleDocuments}