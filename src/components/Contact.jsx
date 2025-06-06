import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { slideIn } from '../utils/motion';
import { send, sendHover } from '../assets';
import { toast } from 'react-toastify';
import { EmailClient } from '@azure/communication-email';

const client = new EmailClient(window.env?.VITE_AZURE_COMMUNICATION_KEY ?? import.meta.env.VITE_AZURE_COMMUNICATION_KEY);

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailClientMessage = {
      senderAddress: "DoNotReply@e63f5779-e487-4192-8c2e-4663d57fb3b8.azurecomm.net",
      content: {
          subject: "Message Received - Avneet's Portfolio",
          plainText: `Hi ${form.name},\n\nThank you for reaching out! I have received your message and will get back to you as soon as possible.\n\nBest regards,\nAvneet`,
          html: `
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #915EFF;">Message Received</h2>
                  <p>Hi ${form.name},</p>
                  <p>Thank you for reaching out! I have received your message and will get back to you as soon as possible.</p>
                  <p>Your message:</p>
                  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <p style="margin: 0;">${form.message}</p>
                  </div>
                  <p>Best regards,<br>Avneet</p>
                </div>
              </body>
            </html>`,
      },
      recipients: {
          to: [{ address: form.email }],
      },
    };
    const emailOwnerMessage = {
      senderAddress: "DoNotReply@e63f5779-e487-4192-8c2e-4663d57fb3b8.azurecomm.net",
      content: {
        subject: `New Contact Form Message from ${form.name}`,
        plainText: `New message received from your portfolio website:\n\nName: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
        html: `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #915EFF;">New Contact Form Message</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 10px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${form.name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${form.email}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${form.message}</p>
          </div>
          <p style="color: #666; font-size: 0.9em;">This message was sent from your portfolio website contact form.</p>
        </div>
      </body>
    </html>`,
      },
      recipients: {
        to: [{ address: 'avneetpandey82@gmail.com' }],
      }
    };
    try {
      // Send confirmation email to the client
      const clientPoller = await client.beginSend(emailClientMessage);
      await clientPoller.pollUntilDone();
      
      // Show success to user immediately
      setLoading(false);
      toast.success('Thank you! I will get back to you as soon as possible.');
      setForm({
        name: '',
        email: '',
        message: '',
      });

      // Send notification email to the owner in background
      client.beginSend(emailOwnerMessage)
        .then(poller => poller.pollUntilDone())
        .catch(error => {
          console.error('Error sending owner notification:', error);
          // Don't show error to user since they already got success message
        });
    } catch (error) {
      setLoading(false);
      console.error('Error sending email:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div
      className="-mt-[8rem] xl:flex-row flex-col-reverse 
      flex gap-10 overflow-hidden">
      <motion.div
        variants={slideIn('left', 'tween', 0.2, 1)}
        className="flex-[0.75] bg-jet/90 p-8 rounded-2xl backdrop-blur-sm border border-[#915EFF]/10 shadow-lg">
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadTextLight}>Contact.</h3>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-6 font-poppins">
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              required
              className="bg-eerieBlack/80 py-4 px-6
              placeholder:text-taupe
              text-white rounded-lg outline-none
              border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              required
              className="bg-eerieBlack/80 py-4 px-6
              placeholder:text-taupe
              text-white rounded-lg outline-none
              border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">
              Your Message
            </span>
            <textarea
              rows="7"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What's your message?"
              required
              className="bg-eerieBlack/80 py-4 px-6
              placeholder:text-taupe
              text-white rounded-lg outline-none
              border-none font-medium resize-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`live-demo flex justify-center sm:gap-4 
            gap-3 sm:text-[20px] text-[16px] text-white 
            font-bold font-beckman items-center py-5
            whitespace-nowrap ${loading?"sm:w-[150px]":"sm:w-[130px]"} sm:h-[50px] 
            w-[100px] h-[45px] rounded-[10px] bg-night 
            hover:bg-battleGray hover:text-eerieBlack 
            transition duration-[0.2s] ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed`}
            onMouseOver={() => {
              document
                .querySelector('.contact-btn')
                .setAttribute('src', sendHover);
            }}
            onMouseOut={() => {
              document.querySelector('.contact-btn').setAttribute('src', send);
            }}>
            {loading ? 'Sending..' : 'Send'}
            <img
              src={send}
              alt="send"
              className="contact-btn sm:w-[26px] sm:h-[26px] 
              w-[23px] h-[23px] object-contain"
            />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, 'contact');
