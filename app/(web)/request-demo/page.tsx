"use client"
import React, { useEffect, useState, useRef } from 'react'
import Container from '../../../components/layout/containerPage'
import Buttons from '../../../components/Buttons/Button';
const RequestDemo = () => {
    const [aiHuman, setAiHuman] = useState(true)
    const [operationalAI, setOperationalAi] = useState(false)
    const [aiMicrosites, setAiMIcrosites] = useState(false)
    const [holovue, setHolovue] = useState(false)

    // Align fields with /api/v1/controllers/mail
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [country, setCountry] = useState("")
    const [company, setCompany] = useState("")
    const [phone, setPhone] = useState("")
    const [subject, setSubject] = useState("")
    const [detail, setDetail] = useState("")

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const form = useRef<HTMLFormElement | null>(null);

    const SubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (submitting) return;

        // Required fields check
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
            setError("Please fill in all required fields.");
            return;
        }

        // Email validation (basic but robust)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            setError("Invalid email format.");
            return;
        }

        // Phone validation: digits/space/+/( )/- with min length 8
        const phoneRegex = /^[0-9+()\s-]{8,}$/;
        if (!phoneRegex.test(phone.trim())) {
            setError("Invalid phone number format.");
            return;
        }

        setSubmitting(true);

        try {
            // append selected product interests into detail for the same mail API
            const interest = [
                aiHuman ? "AI Humans" : null,
                operationalAI ? "Operational AI" : null,
                aiMicrosites ? "AI Microsites" : null,
                holovue ? "HOLOVUE" : null,
            ].filter(Boolean).join(", ");

            const enrichedDetail = interest
                ? `${detail.trim()}\n\nInterested in: ${interest}`
                : detail.trim();

            const response = await fetch('/api/v1/controllers/mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.toLowerCase().trim(),
                    country: country.trim(),
                    company: company.trim(),
                    phone: phone.trim(),
                    subject: subject.trim(),
                    detail: enrichedDetail,
                }),
            })

            if (response.ok) {
                console.log("Mailbox has send.");
            }

            setSuccess("Submitted successfully!");

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
            setDetail("");
        } catch (error) {
            console.log("Error during registration: ", error);
        }
        setSubmitting(false);
    }



    return (
        <Container>
            <div className='pt-[10vh]'>
                <h1 className='w-full m-auto text-center text-[60px] font-unitea font-bold'>Request Demo</h1>
                <h2 className='py-[8vh] w-full text-center'>
                    You can select the product that you would like to see demo. <br />
                    We will reach out to product demo according to your request.
                </h2>
                <div className='grid grid-cols-4 w-full xl:w-[1200px] m-auto bg-grayDefaultDark-500 h-auto py-4'>
                    <div className='col-span-4 lg:col-span-1'>
                        <button onClick={() => {
                            setAiHuman(!aiHuman)
                            setOperationalAi(false)
                            setAiMIcrosites(false)
                            setHolovue(false)
                        }} className={aiHuman ? `font-bold text-[20px] text-center p-2 w-full text-primary-600 font-unitea border-t-8 border-t-primary-600` : `font-bold text-[20px] bg-white text-black w-full p-4`}>AI Humans</button>
                    </div>
                    <div className='col-span-4 lg:col-span-1'>
                        <button onClick={() => {
                            setOperationalAi(!operationalAI)
                            setAiHuman(false)
                            setAiMIcrosites(false)
                            setHolovue(false)
                        }} className={operationalAI ? `font-bold text-[20px] text-center p-2 w-full text-primary-600 font-unitea border-t-8 border-t-primary-600` : `font-bold text-[20px] bg-white text-black w-full p-4`}>Operational AI</button>
                    </div>
                    <div className='col-span-4 lg:col-span-1'>
                        <button onClick={() => {
                            setAiMIcrosites(!aiMicrosites)
                            setAiHuman(false)
                            setOperationalAi(false)
                            setHolovue(false)
                        }} className={aiMicrosites ? `font-bold text-[20px] text-center p-2 w-full text-primary-600 font-unitea border-t-8 border-t-primary-600` : `font-bold text-[20px] bg-white text-black w-full p-4`}>AI Microsites</button>
                    </div>
                    <div className='col-span-4 lg:col-span-1'>
                        <button onClick={() => {
                            setHolovue(!holovue)
                            setAiHuman(false)
                            setOperationalAi(false)
                            setAiMIcrosites(false)
                        }} className={holovue ? `font-bold text-[20px] text-center p-2 w-full text-primary-600 font-unitea border-t-8 border-t-primary-600` : `font-bold text-[20px] bg-white text-black w-full p-4`}>HOLOVUE</button>
                    </div>

                    <form
                        ref={form}
                        onSubmit={(e) => SubmitForm(e)}
                        className='col-span-4 px-10 '
                    >
                        <h3 className='text-primary-600  py-10 text-[18px]'>Enter your details below</h3>


                        <div className='grid grid-cols-2 gap-4'>
                            <div className='col-span-1 '>
                                <div>
                                    <div className='py-2'>First Name <span className='text-red-500'>*</span></div>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="w-full rounded-[12px] h-[50px] px-4 text-white bg-grayDefaultDark-500 border-white border-[2px]"
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='col-span-1'>
                                <div>
                                    <div className='py-2'>Last Name <span className='text-red-500'>*</span></div>
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        className="w-full rounded-[12px] h-[50px] px-4 text-white bg-grayDefaultDark-500 border-white border-[2px]"
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='col-span-1'>
                                <div>
                                    <div className='py-2'>Country <span className='text-red-500'>*</span></div>
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        className="w-full rounded-[12px] h-[50px] px-4 text-white bg-grayDefaultDark-500 border-white border-[2px]"
                                        onChange={(e) => setCountry(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='col-span-1'>
                                <div>
                                    <div className='py-2'>Phone Number <span className='text-red-500'>*</span></div>
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        className="w-full rounded-[12px] h-[50px] px-4 text-white bg-grayDefaultDark-500 border-white border-[2px]"
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        inputMode="tel"
                                    />
                                </div>
                            </div>

                            <div className='col-span-1'>
                                <div>
                                    <div className='py-2'>Company Name <span className='text-red-500'>*</span></div>
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        className="w-full rounded-[12px] h-[50px] px-4 text-white bg-grayDefaultDark-500 border-white border-[2px]"
                                        onChange={(e) => setCompany(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>


                            <div className='col-span-1'>
                                <div>
                                    <div className='py-2'>Email Address <span className='text-red-500'>*</span></div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full rounded-[12px] h-[50px] px-4 text-white bg-grayDefaultDark-500 border-white border-[2px]"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='col-span-2'>
                                <div>
                                    <div className='py-2'>Subject <span className='text-red-500'>*</span></div>
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        className="w-full rounded-[12px] h-[50px] px-4 text-white bg-grayDefaultDark-500 border-white border-[2px]"
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='col-span-2'>
                                <div>
                                    <div className='py-2'>Message <span className='text-red-500'>*</span></div>
                                    <textarea
                                        className="w-full rounded-[12px] max-h-[400px] min-h-[250px] px-4 text-white bg-grayDefaultDark-500 border-white border-[2px]"
                                        onChange={(e) => setDetail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-4 col-span-2'>
                                <div className='col-span-4 lg:col-span-1 lg:col-start-4'>
                                    <Buttons
                                        // href_="/contact-us"
                                        text={submitting ? "Submitting..." : "Submit"}
                                        disabled={submitting}
                                        // ariaDisabled={submitting}
                                        width="relative w-full lg:w-full"
                                        height="h-[40px] xl:h-[45px]"
                                        padding="xl:p-1 xl:p-1 col-span-4"
                                        margin="m-auto"
                                        bgColor=""
                                        fontColor="text-white hover:text-[20px] duration-200 text-[12px] xl:text-[14px]"
                                    />
                                </div>

                                {error && (
                                    <div className="col-span-4 text-center bg-red-500 text-sm text-white py-1 rounded-md w-full mt-2">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="col-span-4 text-center bg-green-500 w-full text-sm text-white py-1 rounded-md mt-2">
                                        {success}
                                    </div>
                                )}
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </Container>
    )
}

export default RequestDemo
