document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("start-recording");
    const stopBtn = document.getElementById("stop-recording");
    const transcriptionDiv = document.getElementById("transcription");

    let mediaRecorder;
    let audioChunks = [];

    // Request access to the microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            // When data is available, store the audio chunks
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            // When recording stops, process the audio file
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                sendAudioToServer(audioBlob);
                audioChunks = [];  // Reset for next recording
            };

            // Start recording
            startBtn.onclick = () => {
                audioChunks = [];
                mediaRecorder.start();
                transcriptionDiv.innerText = "Recording...";
            };

            // Stop recording
            stopBtn.onclick = () => {
                mediaRecorder.stop();
                transcriptionDiv.innerText = "Processing audio...";
            };
        })
        .catch(error => {
            alert("Microphone access denied. Please enable it.");
            console.error(error);
        });

    // Function to send audio to Django backend
    function sendAudioToServer(audioBlob) {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");

        fetch("/record_audio/", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                transcriptionDiv.innerText = data.text;
            } else {
                transcriptionDiv.innerText = "Error: " + data.message;
            }
        })
        .catch(error => {
            transcriptionDiv.innerText = "Failed to process audio.";
            console.error(error);
        });
    }
});
