document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  // Handle form submission for sending emails
  document.querySelector("#compose-form").addEventListener("submit", function(e){
    e.preventDefault()

    const recipients= document.querySelector('#compose-recipients').value;
    const subject=document.querySelector('#compose-subject').value;
    const composeBody=document.querySelector('#compose-body').value;


    // Send a POST request to create a new email
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: composeBody
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);


        // Clear the form fields after sending
        document.querySelector('#compose-recipients').value = '';
        document.querySelector('#compose-subject').value = '';
        document.querySelector('#compose-body').value = '';


        // Load the Sent mailbox after sending
        load_mailbox('sent');

    });
   
  })
  
});


// Show compose email view and hide other views
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#email-detail-view').style.display = 'none';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}



// Load a mailbox (inbox, sent, archive)
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#email-detail-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  const container = document.querySelector('#emails-view');
  container.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  // Fetch emails from server
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);

    // Loop through emails and create a container for each
    emails.forEach(email=>{
      let divContainer= document.createElement("div")
      let div= document.createElement("div")
      divContainer.classList.add("divContainer")
      div.classList.add("list");
      divContainer.dataset.emailId=email.id


      // Display sender (or recipients if Sent mailbox)
      let spanSender=document.createElement("span")
      spanSender.classList.add("list-item")

       if(mailbox==="sent"){
        spanSender.innerHTML= email.recipients.join(", ");
      }else{
        spanSender.innerHTML=email.sender}


      // Display email subject
      let spanSubject=document.createElement("span")
      spanSubject.classList.add("subject")
      spanSubject.innerText = email.subject;


      // Set read/unread background color
      div.style.marginBottom="10px"
      if (email.read){
        divContainer.style.backgroundColor="rgba(213, 213, 213, 1)"
      }else{
         divContainer.style.backgroundColor="white"}

       // Display timestamp
      let spanTime=document.createElement("span")
      spanTime.innerHTML=email.timestamp

      // Append elements to build email preview box
      div.appendChild(spanSender)
      div.appendChild(spanSubject)
      divContainer.appendChild(div)
      divContainer.appendChild(spanTime)
      container.appendChild(divContainer);
      


      // Add click event to show email details
      divContainer.addEventListener('click', function(email_id){
        email_id=this.dataset.emailId

        // Fetch the selected email
        fetch(`/emails/${email_id}`)
        .then(response => response.json())
        .then(email => {
          // Print email
          console.log(email);

          // ... do something else with email ...

        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'none';

        // Mark email as read
        fetch(`/emails/${email.id}`, {
            method: 'PUT',
             body: JSON.stringify({
             read : true}) 
                   })
              
              
        // Show email details
        show_detail_email(email)
            });
        })
    })
    
  });

}





// Show the details of a selected email
function show_detail_email(email){

  // Hide other views and show email detail
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail-view').style.display = 'block';

 
  // Fill in the email information
  document.querySelector('#email-sender').innerHTML =`<strong>From</strong>: ${email.sender}` ;
  document.querySelector('#email-recipients').innerHTML = `<strong>To</strong>: ${email.recipients.join(", ")}`;
  document.querySelector('#email-subject').innerHTML =`<strong>Subject</strong>: ${email.subject}`;
  document.querySelector('#email-timestamp').innerHTML =`<strong>Timestamp</strong>: ${email.timestamp}`;
  document.querySelector('#email-body').innerHTML =email.body ;


  const btnArchive=document.querySelector('#btnArchive');
  const btnReply=document.querySelector('#btnReply') ;

  // Update archive button text depending on email status
    if (email.archived) {
        btnArchive.textContent = "Unarchive";
    } else {
        btnArchive.textContent = "Archive";
    }






  // Get logged-in user
  const user=document.querySelector("#request-user-email").textContent
  console.log(user)

  // Hide archive button if the email is sent by the user      
  if( email.sender === user){
            btnArchive.style.display = 'none';
  }else{
    btnArchive.style.display = 'inline-block';

     // Archive/Unarchive the email on button click
     btnArchive.onclick = function(){
           fetch(`/emails/${email.id}`, {
                method: 'PUT',
                
                body: JSON.stringify({
                    archived: !email.archived})
                  })
            .then(() => {
                document.querySelector('#email-detail-view').style.display = 'none';
                  // After archiving/unarchiving, reload inbox
                   load_mailbox('inbox');
                 
            });
        }
      }


    // Reply to the email
    btnReply.onclick=function(){
    compose_email()
     document.querySelector('#compose-recipients').value = email.sender;

    // Handle subject prefix
    let subject;

     if(email.subject.startsWith("Re:")){
       subject=email.subject
     }else{
       subject=`Re: ${email.subject}`
     }

    document.querySelector('#compose-subject').value = subject;


    // Pre-fill email body with original message
    document.querySelector('#compose-body').value = `\n\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
  }
}

                


