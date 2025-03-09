const App = () => {
    const [recording, setRecording] = React.useState(false);
    const [audioBlob, setAudioBlob] = React.useState(null);
    const [transcription, setTranscription] = React.useState("Waiting for transcription...");
    let mediaRecorder;
    let recordedChunks = [];

    const startRecording = async () => {
        setRecording(true);
        recordedChunks = [];
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
            setAudioBlob(audioBlob);
            uploadAudio(audioBlob);
        };

        mediaRecorder.start();
    };

    const stopRecording = () => {
        setRecording(false);
        mediaRecorder.stop();
    };

    const uploadAudio = async (blob) => {
        const formData = new FormData();
        formData.append("audio", blob, "recording.wav");

        try {
            const response = await fetch("/record_audio/", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.status === "success") {
                setTranscription(data.text);
            } else {
                setTranscription("Error: " + data.message);
            }
        } catch (error) {
            setTranscription("Error uploading audio");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Physician-Patient Conversation</h2>
            <button onClick={startRecording} disabled={recording} style={buttonStyle}>Start Recording</button>
            <button onClick={stopRecording} disabled={!recording} style={buttonStyle}>Stop Recording</button>
            <p><strong>Transcription:</strong></p>
            <div style={transcriptionStyle}>{transcription}</div>
        </div>
    );
};

const buttonStyle = {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#004080",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px"
};

const transcriptionStyle = {
    marginTop: "20px",
    fontSize: "18px",
    color: "#fff",
    backgroundColor: "#333",
    padding: "10px",
    borderRadius: "5px"
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
