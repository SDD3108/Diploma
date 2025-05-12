// const express = require('express');
// const router = express.Router();
// const upload = require('../middleware/upload')

// const emailSendMessage = async (req,res)=>{
//     const { to, subject, text, html } = req.body
//     try{
//       const info = await transporter.sendMail({
//         from: process.env.FROM_EMAIL,
//         to,
//         subject,
//         text,
//         html
//       })
//       console.log('Email sent:', info.messageId)
//       res.status(200).json({ message: 'Email sent', id: info.messageId })
//     }
//     catch(err){
//       console.error('Error sending email:', err)
//       res.status(500).json({ error: 'Failed to send email' })
//     }
// }
// const 