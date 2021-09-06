import { useEffect, useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import dictionary from "./model/dict.json";

function App() {
    const [model, setModel] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [result, setResult] = useState("");

    useEffect(() => {
        const init = async () => {
            const model = await tf.loadLayersModel("model.json");
            setModel(model);
        };

        init();
    }, []);

    // Negative: Incorrect Disc: I love the style of this, but after a couple years, the DVD is giving me problems. It doesn't even work anymore and I use my broken PS2 Now. I wouldn't recommend this, I'm just going to upgrade to a recorder now. I wish it would work but I guess i'm giving up on JVC. I really did like this one... before it stopped working. The dvd player gave me problems probably after a year of having it.
    // Negative: A complete Bust: This game requires quicktime 5.0 to work...if you have a better version of quicktime (I have 7.5), it will ask you to install the quicktime available on the CD...if you click no, it will not let you play. So, I begrudgingly clicked yes on the third try, and it installed quicktime 5, THEN it tells me to please install the quicktime available on the disc. It KEPT telling me that, even after I uninstalled my version of quicktime 7.5, and reinstalled Barbie Rapunzel and quicktime 5. Very frustrating, and the game absolutely will not work for me. It keeps telling me over and over, to install quicktime 5, tho I've been through the installation process repeatedly. It is NOT my operating system limitations. This is a brand new computer...merely weeks old with all the state of the art contraptions.
    // Positive: One of the best game music soundtracks - for a game I didn't really play: Despite the fact that I have only played a small portion of the game, the music I heard (plus the connection to Chrono Trigger which was great as well) led me to purchase the soundtrack, and it remains one of my favorite albums. There is an incredible mix of fun, epic, and emotional songs. Those sad and beautiful tracks I especially like, as there's not too many of those kinds of songs in my other video game soundtracks. I must admit that one of the songs (Life-A Distant Promise) has brought tears to my eyes on many occasions.My one complaint about this soundtrack is that they use guitar fretting effects in many of the songs, which I find distracting. But even if those weren't included I would still consider the collection worth it.

    const convert = (text) => {
        const processedText = text
            .split(" ")
            .filter((word) => word !== " ")
            .map((word) => word.toLowerCase())
            .map((word) => word.replace(/\d/i, "0"))
            .map((word) => word.replace(/[^A-Za-z0-9]/g, ""))
            .map((word) => {
                if (["www.", "http:", "https:", ".com"].includes(word))
                    return word.replace(/([^ ]+(?<=\.[a-z]{3}))/i, "<url>");
                return word;
            });

        let result = processedText.map(
            (word) => dictionary[word] || dictionary["<OOV>"]
        );
        while (result.length < 128) result.push(0);

        if (result.length >= 128) result.splice(128, result.length);

        return result;
    };

    const onTextChange = (e) => {
        setFeedback(e.target.value);
    };

    const onClick = async () => {
        if (model) {
            const prediction = await model
                .predict(tf.tensor2d([convert(feedback)]))
                .data();

            if (prediction[0] > prediction[1])
                setResult("The user gives a NEGATIVE feedback");
            else setResult("The user gives a POSITIVE feedback");
        }
    };

    return (
        <div className="container">
            <input
                type="text"
                name="feedback"
                value={feedback}
                onChange={onTextChange}
            />
            <button onClick={onClick}>Predict the FeedBack</button>
            <div>
                <p>{result}</p>
            </div>
        </div>
    );
}

export default App;
