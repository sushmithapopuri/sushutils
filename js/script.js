/***********************************************Constants**********************************************************/
error_messages = {
    "AbortError":"An AbortError has occured.",
    "NotAllowedError":"A NotAllowedError has occured. User might have denied permission.",
    "NotFoundError":"A NotFoundError has occured.",
    "NotReadableError":"A NotReadableError has occured.",
    "SecurityError":"A SecurityError has occured.",
    "TypeError":"A TypeError has occured.",
    "InvalidStateError":"An InvalidStateError has occured.",
    "UnknownError":"An UnknownError has occured."
}

/***********************************************Variables**********************************************************/
var audioRecorder = voiceRecorder
var transcript = textRecognition
var maximumRecordingTimeInHours = 2
var elapsedTime = 0
var isRecording = false

/***********************************************Utilities**********************************************************/

function generateRecordFile(data){
	var audioURL = window.URL.createObjectURL(data)
	$("#player ").attr('src',audioURL)
	$('#download').attr('href', audioURL)
}

function generateFileName(){
    console.log('Generating File Name')
    var filename = 'output.mp3'

    if ($('#download-name').val() != '')
        filename= $('#download-name').val()
    if (!filename.endsWith("mp3"))
        filename = filename+ ".mp3" 

    $('#download').attr('download', filename ) 

}

function generateMoM(){
    if ($("#mom").is(":checked")){
        console.log('Generating MoM')
        transcript.start()
    }
    else{
        console.log('Stopped generating MoM')
        transcript.stop()
        if ($("#mom-text").val() == "")
            $("#mom-display").addClass("hide")
        
    }
}

function computeElapsedTime() {
    if(!isRecording){
        $(".red-recording-dot").addClass("hide")    
    }
    else{
        $(".red-recording-dot").removeClass("hide") 
        elapsedTime = elapsedTime + 1000
    }
    
    timeDiff = elapsedTime/1000
    var seconds = Math.floor(timeDiff % 60)
    timeDiff = Math.floor(timeDiff / 60)
    var minutes = timeDiff % 60
    timeDiff = Math.floor(timeDiff / 60)
    var hours = timeDiff % 24
    
    if(hours == maximumRecordingTimeInHours){
        stopRecording()
    }
    return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
}

/***********************************************Recording Utilities******************************************************/
function startRecording() {
    console.log("Recording Audio...")
    if (!$("#player").paused) {
        $("#player").trigger("pause")
    }

    audioRecorder.start().then(() => {
        elapsedTime = 0
        isRecording = true
        $("#start").css("display", "none")
        $(".result").addClass("hide")
        $(".recording").removeClass("hide")
        if ($("#mom").is(":checked")){
            $("#mom-display").removeClass("hide")
        }
        setInterval(() => {$("#elapsed-time").html(computeElapsedTime())}, 1000)}).catch(error => {
            if (error.message.includes("mediaDevices API or getUserMedia method is not supported in this browser.")) {
                console.log("To record audio, use browsers like Chrome and Firefox.")
                
            }else{
                console.log(error_messages[error.name])
            }

        })

}

function pauseRecording(){
    console.log("Pausing audio...")
    audioRecorder.pause()
    audioRecorder.paused
    isRecording = false
    $("#pause").addClass("hide")
    $("#resume").removeClass("hide")
}

function resumeRecording(){
    console.log("Resuming audio...")
    audioRecorder.resume()
    isRecording = true
    $("#resume").addClass("hide")
    $("#pause").removeClass("hide")
}

function stopRecording() {
    console.log("Stopping Audio Recording...")
    audioRecorder.stop().then(audioAsblob => {
        generateRecordFile(audioAsblob)
        $("#start").css("display","block")
        $(".recording").addClass("hide")
        $("#display").removeClass("hide")
        elapsedTime = 0
    })
    .catch(error => {
        switch (error.name) {
            case 'InvalidStateError': //error from the MediaRecorder.stop
                console.log("An InvalidStateError has occured.")
                break
                default:
                console.log("An error occured with the error name " + error.name)
            }
        })
}

function cancelRecording() {
    console.log("Canceling audio...")
    audioRecorder.cancel()
    $("#start").css("display","block")
    $(".recording").addClass("hide")
}

function playRecording(){
    console.log("Playing Audio...")
    if ($("#player").prop('paused')) {
        $("#player").trigger("play")
        $("#rplay").addClass("hide")
        $("#rpause").removeClass("hide")
    }
    else{
        $("#player").trigger("pause")
        $("#rpause").addClass("hide")
        $("#rplay").removeClass("hide")
    }
}



//Listeners
$("#start").click(startRecording)
$("#pause").click(pauseRecording)
$("#resume").click(resumeRecording)
$("#stop").click(stopRecording)
$("#cancel").click(cancelRecording)
$("#rplay").click(playRecording)
$("#rpause").click(playRecording)
$("#download-name").on('input', generateFileName)
$("#mom").change(generateMoM)

$(function() {
    console.log( "ready!" );
});