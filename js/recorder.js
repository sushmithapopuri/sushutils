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

    reset: function(){
        voiceRecorder.mediaRecorder = null
        voiceRecorder.streamCaptured = null
        elapsedTime = 0
    }
}