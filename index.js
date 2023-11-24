const express = require('express');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const app = express()
app.use(express.json());

const port = 3000;

// Configure nodemailer with your email provider settings
var transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  auth: {
    user: 'kogue001@gmail.com',
    pass: 'p4kxJNIMmLG6SZsD'
  },
  port: 587
});

app.post('/notification', async (req, res) => {

  try {
    // Generate QR code
    const lines = [];

    lines.push(`tx_reference: ${req.body.tx_reference}`);
    lines.push(`identifier: ${req.body.identifier.split('_')[1]}`);
    lines.push(`payment_reference: ${req.body.payment_reference}`);
    lines.push(`amount: ${req.body.amount}`);
    lines.push(`datetime: ${req.body.datetime}`);
    lines.push(`payment_method: ${req.body.payment_method}`);
    lines.push(`phone_number: ${req.body.phone_number}`);

    console.log(lines)
    const qrCodeText = lines.join('\n');
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeText);

    const contentID = `qrCodeImage-${Date.now()}`;
    
    // Compose HTML email body with Bootstrap styling
    const emailBody = `
      <html>
        <head>
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
            integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8sh+WyL8L4M8UJ6I2HXUnA8A/uKLIK5I6uzLW"
            crossorigin="anonymous"
          />
          <style>
            .main-btn {
              display: inline-block;
              position: relative;
              font-weight: 700;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
              border: 0;
              padding: 0 38px 0 38px;
              font-size: 17px;
              height: 60px;
              line-height: 62.5px;
              border-radius: 40px;
              color: #0b6749 !important;
              cursor: pointer;
              z-index: 5;
              -webkit-transition: all 0.4s ease-out 0s;
              transition: all 0.4s ease-out 0s;
              letter-spacing: -0.02em;
              background-color: #ffc000;
              -webkit-box-shadow: 0px 10px 30px rgba(255, 190, 0, 0.2);
              box-shadow: 0px 10px 30px rgba(255, 190, 0, 0.2);
              text-decoration: none;
            }
            .main-btn:hover {
              background-color: #0b6749;
              color: #fff !important;
              border-color: #ffc000;
              -webkit-box-shadow: 0px 10px 30px rgba(39, 162, 122, 0.2);
              box-shadow: 0px 10px 30px rgba(39, 162, 122, 0.2);
            }
            .main-btn:hover i {
              color: #ffc000;
            }
            .confirmation-container {
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                border: 5px solid #ddd;
                overflow: hidden;
            }

            .confirmation-icon {
                font-size: 60px;
                color: #0b6749;
            }
          </style>
        </head>
        <body>
          <div class="container confirmation-container">
            <div class="text-center">
                <i class="fas fa-check-circle confirmation-icon"></i>
                <h1 class="mt-3" style="color: #0b6749">Paiement Confirmé <strong style="color: #4caf50;font-size: 24px;vertical-align: top">&#10004;</strong></h1>
                <p style="color: black">Votre paiement a été traité avec succès. Veuillez conserver soigneusement ce <strong>QR code</strong>. Il sera nécessaire pour toute interaction future.</p>
                <div style="
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      padding: 20px;
                      text-align: center;
                ">
                  <div class="text-center">
                    <img src="cid:${contentID}" width="250" alt="QR Code" />
                  </div>
                  <div class="text-center mt-4">
                      <p style="color: black">Merci pour votre achat !</p>
                      <a href="https://www.lomebiketour.com" class="main-btn">REVENIR SUR LE SITE</a>
                  </div>
                </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Email configuration
    const mailOptions = {
      from: 'LOME BIKE TOUR <biketrip228@gmail.com>',
      to: req.body.identifier.split('_')[1],
      subject: 'QR Code de confirmation',
      html: emailBody,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrCodeDataURL.split(';base64,').pop(),
          encoding: 'base64',
          cid: contentID, // Use the Content-ID as the CID for embedding
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.send('Email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
