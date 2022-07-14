/*************************************************Audio Recorder**********************************************************/

var voiceRecorder = {
    dataChunks: [],
    mediaRecorder: null,
    streamCaptured: null, 
     
    start: function () {
        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            return Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'))
        }

        else {
            return navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                voiceRecorder.streamCaptured = stream
                voiceRecorder.mediaRecorder = new MediaRecorder(stream)
                voiceRecorder.dataChunks = []
                voiceRecorder.mediaRecorder.addEventListener("dataavailable", event => {
                    voiceRecorder.dataChunks.push(event.data)
                })
                voiceRecorder.mediaRecorder.start()
            })
        }
    },

    stop: function () {
        return new Promise(resolve => {
            var mimeType = voiceRecorder.mediaRecorder.mimeType
            voiceRecorder.mediaRecorder.addEventListener("stop", () => {
                resolve(new Blob(voiceRecorder.dataChunks, { type: mimeType }))
            })
            voiceRecorder.cancel()
        })
    },

    pause: function () {
        voiceRecorder.mediaRecorder.pause()

    },

    resume: function () {
        voiceRecorder.mediaRecorder.resume()
    },

    cancel: function () {
        voiceRecorder.mediaRecorder.stop()
        voiceRecorder.streamCaptured.getTracks().forEach(track => track.stop()) 
    },

    save: function(blob){
        return window.URL.createObjectURL(blob)
    },
    
    reset: function(){
        voiceRecorder.mediaRecorder = null
        voiceRecorder.streamCaptured = null
        elapsedTime = 0
    }
}

/*************************************************Screen and Audio Recorder**********************************************************/
var screenRecorder = {
    dataChunks: [],
    mediaRecorder: null,
    streamCaptured: null, 
     
    start:async function () {
        if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
            return Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'))
        }

        else {
            audioStream = await navigator.mediaDevices.getUserMedia({audio: true});
            stream = await navigator.mediaDevices.getDisplayMedia({ audio: true ,video: { mediaSource: "screen"}})
            stream.addTrack(audioStream.getAudioTracks()[0]);
            screenRecorder.streamCaptured = stream
            screenRecorder.mediaRecorder = new MediaRecorder(stream)
            screenRecorder.dataChunks = []
            screenRecorder.mediaRecorder.addEventListener("dataavailable", event => {
                screenRecorder.dataChunks.push(event.data)
            })
            screenRecorder.mediaRecorder.start()
            
        }
    },

    stop: function () {
        return new Promise(resolve => {
            var mimeType = screenRecorder.mediaRecorder.mimeType
            screenRecorder.mediaRecorder.addEventListener("stop", () => {
                resolve(new Blob(screenRecorder.dataChunks, { type: mimeType }))
            })
            screenRecorder.cancel()
        })
    },

    pause: function () {
        screenRecorder.mediaRecorder.pause()

    },

    resume: function () {
        screenRecorder.mediaRecorder.resume()
    },

    cancel: function () {
        screenRecorder.mediaRecorder.stop()
        screenRecorder.streamCaptured.getTracks().forEach(track => track.stop()) 
    },

    save: function(blob){
        return window.URL.createObjectURL(blob)
    },

    reset: function(){
        screenRecorder.mediaRecorder = null
        screenRecorder.streamCaptured = null
        elapsedTime = 0
    }
}