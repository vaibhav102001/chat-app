const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormButton = $messageForm.querySelector('button')
const $messageFormInput = $messageForm.querySelector('input')
const $sendlocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render(locationTemplate,{
        url
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})



document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const message = e.target.elements.message.value
    $messageFormButton.setAttribute('disabled','disabled')
    socket.emit('sendmessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')

        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('Message was deleivered successfully!')
    })
})
document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation api not supported')
    }
    $sendlocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{

        $sendlocation.removeAttribute('disabled')

        socket.emit('location',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        },(message)=>{
            console.log(message)
        })
    })
})
