import express, { Request, Response } from 'express'
import Message from '../models/Message'
import { sendEmail } from '../utils/mailer'

const router = express.Router()

// POST /api/contact - Submit contact form
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Create message in database
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message
    })

    // Send email notification
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'khushprajapati@example.com',
        subject: `New Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><small>Sent from your portfolio website</small></p>
        `
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Continue even if email fails - message is saved in DB
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: {
        id: newMessage._id,
        createdAt: newMessage.createdAt
      }
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message'
    })
  }
})

export default router
