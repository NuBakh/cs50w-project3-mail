# 📧 CS50 Mail — Single Page Email Client

A Django-based single-page email client built for **CS50 Web Programming (Project 3)**.  
Users can register, send and receive emails, archive, reply, and navigate between mailboxes using a dynamic JavaScript interface.

[![Watch Demo](https://img.youtube.com/vi/Pv-_2s4_Ei0/0.jpg)](https://youtu.be/Pv-_2s4_Ei0)

---
🏷 Features

User Authentication: Register, login, logout

Inbox: View received emails, mark as read/unread

Sent Mail: View emails you have sent

Compose Email: Send emails to registered users

Archive/Unarchive: Move emails to/from archive

Reply: Reply to any email with pre-filled recipient, subject, and body

Dynamic Interface: Single-page app controlled with JavaScript

API-driven: Uses GET/POST/PUT requests to manage emails

🔹 API Endpoints

GET /emails/<mailbox> — Get all emails in inbox, sent, or archive

GET /emails/<email_id> — Get a single email

POST /emails — Send a new email (recipients, subject, body)

PUT /emails/<email_id> — Update email status (read/archived)

🎬 Demo

Watch the demo: https://youtu.be/Pv-_2s4_Ei0

💡 Notes

All emails are stored in the database, not sent to real email servers.

JavaScript handles view switching between Inbox, Sent, Archive, Compose, and individual email view.

CSRF tokens are not required for API requests in this project.
