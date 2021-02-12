let socket = io()

// Data e Horario:
let dia = new Date().getDate()
let mes = new Date().getMonth() + 1
let horas = new Date().getHours();
let minutos = new Date().getMinutes()
let segundos = new Date().getSeconds()
if(mes.toString().length == 1) { mes = `0${mes}` }
if(dia.toString().length == 1) { dia = `0${dia}` }
if(horas.toString().length == 1) { horas = `0${horas}` }
if(minutos.toString().length == 1) { minutos = `0${minutos}` }
if(segundos.toString().length == 1) { segundos = `0${segundos}` }
const timer = ms => new Promise( res => setTimeout(res, ms));


// Utiliza o ip para saber qual é o host de cada mensagem.
window.ip;
var ip;
    jQuery.get('https://api.ipify.org?format=json', (data) => {
        var ip = data.ip;
         window.ip = data.ip;
        socket.emit('yourIP', data.ip)
    })


// Ele renderiza a mensagem/poem a mensagem na tela.
function render_Message(message, me){
    jQuery('.messages').append(`<div class="message" style="${me == true ? 'text-align: left;' : 'text-align: right;'}"><strong style="${me == true ? 'color: green;' : 'color: red;'}">` + message.user + `</strong>: ` + message.message + `<h1 id="horario">Horario: ` + `${horas}:${minutos}:${segundos} ${dia}/${mes}` +  `</h1></div>`)
}

// Visualiza a mensagem anterioes e coloca na tela.
socket.on('previousMessages', async function(messages) {
    for(message of messages) {
        await timer(100)
        render_Message(message, window.ip == message.ip);
    }
})

// Visualiza as mensagem recebi ao momento.
socket.on('receivedMessage', function(message){
    
    console.log(message)
    console.log(window.ip == message.ip, message.ip)
    render_Message(message, window.ip == message.ip);

})

// faz o convertimento do ip como proteção na tela do usuário.
jQuery(document).ready(() => {
    jQuery.get('https://api.ipify.org?format=json', (data) => {
        document.querySelector('#myIP').innerText = data.ip
        .replace('0', '*')
        .replace('1', '*')
        .replace('2', '*')
        .replace('3', '*')
        .replace('4', '*')
        .replace('5', '*')
        .replace('6', '*')
        .replace('7', '*')
        .replace('8', '*')
        .replace('9', '*')
        .replace('10', '*')
        ;
    })


    jQuery('[id="apagar"]').on('click', async function(event){
        event.preventDefault();

        let user = $('input[name=username]').val()
        let message = $('input[name=message]').val()

        let text_box = document.querySelector('.messages').innerText

        if(text_box.length) {
            document.querySelector('.messages').innerText = ""
            jQuery('.messages').append('<div class="message"><strong>' + 'Client: ' + '</strong> ' + 'Chat limpo.' + '</div>')
            setInterval(() => {
                document.querySelector('.messages').innerText = ""
            }, 5000);
        }
        if(user.includes('admin') && message == "/limpar"){
            document.querySelector('.messages').innerText = ""
            jQuery('.messages').append('<div class="message"><strong>' + 'Server ' + '</strong> ' + 'Chat limpo.' + '</div>')
            let message_object = {
                user: 'Server:',
                message: 'Chat limpo.'
            }

            await timer(2000)
                document.querySelector('.messages').innerText = ""
                socket.emit('sendMessage', message_object)
                socket.emit('DelMessages', true)

        }

    })
    jQuery('[id="enviar"]').on('click', function(event){
        event.preventDefault();
        let user = $('input[name=username]').val()
        let message = $('input[name=message]').val()

        if(user.length && message.length) {
            let messageObject = {
                ip: window.ip,
                user: user,
                message: message
            };
            console.log(window.ip == message.ip, window.ip)
            if(messageObject.user.includes('</') || messageObject.user.includes('<') || messageObject.message.includes('</') || messageObject.message.includes('<') || messageObject.message.includes('<script>') || messageObject.message.includes('</script>') || messageObject.user.includes('<script>') || messageObject.user.includes('</script>')) {

                jQuery('.messages').append('<div class="message"><strong>' + 'Client: ' + '</strong> ' + 'Não é permitido esses tipo de caracteres!' + '</div>')

            } else if(messageObject.message.length >= 200) {
                    jQuery('.messages').append('<div class="message"><strong>' + 'Client: ' + '</strong> ' + 'Não foi possível enviar a mensagem, pois contém mais de 200 caracteres!' + '</div>')
                } else {
                render_Message(messageObject, true);
                socket.emit('sendMessage', messageObject)
                }
            
            
          } else {
              console.log('[SOURCE] | Não encontrei a mensagem.')
          }
    })
})

      
