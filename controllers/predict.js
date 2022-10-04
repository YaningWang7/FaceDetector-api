import {ClarifaiStub, grpc} from 'clarifai-nodejs-grpc';

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
// In bash run APIKey='aa296bf469ee48d2b1222b3d9a6ade70' node server.js to start the app
const APIKey = process.env.APIKey;
metadata.set("authorization", `Key ${APIKey}`)

const handlePredict = () => (req, res) => {
    let bounding_box;
    const {input} = req.body;
    if(!input) {
        return res.status(400).json("incorrect form submission");
    }
    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "face-detection",
            inputs: [{data: {image: {url: input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                res.status(400).json("Error!");
                return;
            }
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                res.json("Failed to receive!");
                return;
            }
            bounding_box = response.outputs[0].data.regions[0].region_info.bounding_box;
            res.json(bounding_box); 
        }
    ); 
}

export default handlePredict;