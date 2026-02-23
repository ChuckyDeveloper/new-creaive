"use client";
import React, { useState, useRef } from "react";
import Header from "@/components/Header/Header";
import Buttons from "../Buttons/Button";

import { FaMediumM } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import GradientSplitHeading from "../ui/Heads/HeadGradient";

const ContactComponant = ({ title }: { title?: string }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [detail, setDetails] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const form = useRef<HTMLFormElement>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !email.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !country.trim() ||
      !company.trim() ||
      !phone.trim() ||
      !subject.trim() ||
      !detail.trim()
    ) {
      setError("All fields are required!");
      return;
    }

    // basic phone validation: digits only, length >= 8
    const phoneRegex = /^[0-9+()\s-]{8,}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError("Invalid phone number format!");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/v1/controllers/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          country: country.trim(),
          company: company.trim(),
          phone: phone.trim(),
          subject: subject.trim(),
          detail: detail.trim(),
        }),
      });

      if (response.ok) {
        console.log("Mailbox has send.");
      }

      setSuccess("Successfully!");

      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);

      form.current?.reset();
      setFirstName("");
      setLastName("");
      setEmail("");
      setCountry("");
      setCompany("");
      setPhone("");
      setSubject("");
      setDetails("");
    } catch (error) {
      console.log("Error during registration: ", error);
    }
    setSubmitting(false);
  };

  return (
    <div className="h-[200vh] md:h-[155vh] lg:h-auto xl:h-auto text-center items-center border-grayDefaultDark-400 mx-4 text-white">
      {/* <Header topic={title} tagline={[]} /> */}

      {/* <div className="grid lg:grid-cols-10 grid-cols-1">
        <h2 className="lg:col-span-10 col-span-1 text-[28px] md:text-[38px] lg:text-[40px] xl:text-[50px] font-black leading-[2.8vw] text-center lg:text-center uppercase pb-8 font-unitea pt-[20vh] px-2 bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
          CONTACT
        </h2>
      </div> */}
        <GradientSplitHeading textAfter="CONTACT" textBefore="" width="auto"/>

      <div className="h-auto ">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 w-full h-full pb-6 gap-4 ">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <div className="relative text-[20px] text-start h-full ">
              <div className="">
                <div className="w-full text-start text-[4vw] lg:text-[1vw]">
                  Follow Us
                </div>
                <div className="grid grid-cols-4 w-auto gap-1 p-2">
                  {/* Medium */}
                  <a
                    href="https://medium.com/@creaive"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-1 w-[40px] h-[40px] bg-primary-500 rounded-[6px] flex items-center justify-center"
                  >
                    <FaMediumM className="p-1 w-full h-full" />
                  </a>
                  <a
                    href="https://medium.com/@creaive"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-3 flex items-center"
                  >
                    medium.com/@creaive
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/creaive"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-1 w-[40px] h-[40px] bg-primary-500 rounded-[6px] flex items-center justify-center"
                  >
                    <FaLinkedin className="p-1 w-full h-full" />
                  </a>
                  <a
                    href="https://linkedin.com/creaive"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-3 flex items-center"
                  >
                    linkedin.com/creaive
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/creaive.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-1 w-[40px] h-[40px] bg-primary-500 rounded-[6px] flex items-center justify-center"
                  >
                    <FaInstagram className="p-1 w-full h-full" />
                  </a>
                  <a
                    href="https://instagram.com/creaive.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-3 flex items-center"
                  >
                    instagram.com/creaive.ai
                  </a>
                </div>
              </div>

              <div className="lg:absolute grid gap-2 w-full bottom-4 ">
                <div className="w-full border-[0.5px] border-grayDefaultDark-300 bg-grayDefaultDark-500 h-auto rounded-[12px] p-4">
                  <div className="flex">
                    <div className="w-full items-center">
                      <div className="text-[10px] text-grayDefaultDark-100 text-start">
                        You can contact email us here.
                      </div>
                      <div className="text-[14px] text-start ">
                        hello@creaive.ai
                      </div>
                    </div>
                    {/* <MdArrowForward size={30} className="m-auto" /> */}
                  </div>
                </div>
                <div className="w-full border-[0.5px] border-grayDefaultDark-300 bg-grayDefaultDark-500 h-auto rounded-[12px] p-4">
                  <div className="flex">
                    <div className="w-full items-center">
                      <div className="text-[10px] text-grayDefaultDark-100 text-start">
                        Give us a call on
                      </div>
                      <div className="text-[14px] text-start ">
                        Tel: (+66) 080-169-9741
                      </div>
                    </div>
                    {/* <MdArrowForward size={30} className="m-auto" /> */}
                  </div>
                </div>
                <div className="w-full border-[0.5px] border-grayDefaultDark-300 bg-grayDefaultDark-500 h-auto rounded-[12px] p-4">
                  <div className="flex">
                    <div className="w-full items-center">
                      <div className="text-[10px] text-grayDefaultDark-100 text-start">
                        Line Official
                      </div>
                      <div className="text-[14px] text-start ">@creaive.ai</div>
                    </div>
                    {/* <MdArrowForward size={30} className="m-auto" /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <div className="col-span-12 lg:col-span-8 h-full ">
              <div className="w-full h-auto rounded-[20px] border-[0.5px] border-grayDefaultDark-400 bg-grayDefaultDark-500 text-start p-4">
                <div className="w-full m-auto text-center text-[20px] py-8">
                  We’d love to hear from you!
                </div>
                <form
                  ref={form}
                  onSubmit={(e) => handleSubmit(e)}
                  className="grid grid-cols-4  md:grid-cols-2 xl:grid-cols-4 gap-4"
                >
                  <div className="col-span-4 xl:col-span-2">
                    <div>
                      <div>
                        First Name <span className="text-red-500">*</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Your First Name"
                        className="w-full rounded-[4px] h-[35px] px-4 text-black"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-span-4 xl:col-span-2">
                    <div>
                      <div>
                        Last Name <span className="text-red-500">*</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Your Last Name"
                        className="w-full rounded-[4px] h-[35px] px-4 text-black"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-span-4 xl:col-span-2">
                    <div>
                      <div>
                        Email Address <span className="text-red-500">*</span>
                      </div>
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full rounded-[4px] h-[35px] px-4 text-black"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-span-4 xl:col-span-2">
                    <div>
                      <div>
                        Country <span className="text-red-500">*</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Country"
                        className="w-full rounded-[4px] h-[35px] px-4 text-black"
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-span-4 xl:col-span-2">
                    <div>
                      <div>
                        Company <span className="text-red-500">*</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Your Company"
                        className="w-full rounded-[4px] h-[35px] px-4 text-black"
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-span-4 xl:col-span-2">
                    <div>
                      <div>
                        Phone Number <span className="text-red-500">*</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Phone Number"
                        className="w-full rounded-[4px] h-[35px] px-4 text-black"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-span-4 xl:col-span-4">
                    <div>
                      <div>
                        Subject <span className="text-red-500">*</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Subject"
                        className="w-full rounded-[4px] h-[35px] px-4 text-black"
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-span-4 xl:col-span-4">
                    <div>
                      <div>
                        Tell me about you.{" "}
                        <span className="text-red-500">*</span>
                      </div>
                      <textarea
                        className="w-full rounded-[4px] max-h-[160px] min-h-[100px] px-4 text-black"
                        onChange={(e) => setDetails(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full col-span-4 md:col-span-4 xl:col-start-4 xl:col-span-2 justify-end lg:pr-10">
                    <Buttons
                      href_="/contact-us"
                      text={submitting ? "Submitting..." : "Submit"}
                      disabled={submitting}
                      width="relative w-full lg:w-[180px]"
                      height="h-[40px] xl:h-[45px]"
                      padding="xl:p-1 xl:p-1 col-span-4"
                      margin="m-auto"
                      bgColor=""
                      fontColor="text-white hover:text-[20px] duration-200 text-[12px] xl:text-[14px]"
                    />
                  </div>

                  {error && (
                    <div className="col-span-4 text-center bg-red-500 text-sm text-white py-1 rounded-md w-full">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="col-span-4 text-center bg-green-500 w-full text-sm text-white py-1 rounded-md ">
                      {success}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactComponant;
