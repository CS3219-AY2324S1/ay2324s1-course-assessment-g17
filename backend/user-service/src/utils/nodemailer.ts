import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false, 
  auth: {
    user: "peerprep17@gmail.com",
    pass: "ztud otnc ixyt kfwo"
  },
});
export default transporter;
