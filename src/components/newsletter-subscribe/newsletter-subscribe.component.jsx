import React, {useState, useEffect} from 'react';
import './newsletter-subscribe.styles.scss';
import MailchimpSubscribe from "react-mailchimp-subscribe"
// import PrimaryCTAButton from "../../ui/PrimaryCTAButton/PrimaryCTAButton";
// import { useGHStContext } from '../../../utils/ContextProvider';
import InputField from "../ui/inputField/inputField.component";

const CustomForm = ({ status, message, onValidated }) => {


    // const {modalOpen, setModalOpen} = useGHStContext();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        email &&
        firstName &&
        lastName &&
        email.indexOf("@") > -1 &&
        onValidated({
            EMAIL: email,
            MERGE1: firstName,
            MERGE2: lastName,
        });

    }

    useEffect(() => {
        if(status === "success") clearFields();
        // if(status === "success") clearFields();
    }, [status])

    const clearFields = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
    }


    return (
        <form
            className="mc__form"
            onSubmit={(e) => handleSubmit(e)}
        >
            {/* {status === "sending" && (
                <div
                    className="mc__alert mc__alert--sending"
                >Sending...</div>
            )} */}
            {status === "error" && (
                <div
                    className="mc__alert mc__alert--error"
                    dangerouslySetInnerHTML={{ __html: message }}
                />
            )}
            {status === "success" && (
                <div
                    className="mc__alert mc__alert--success"
                    dangerouslySetInnerHTML={{ __html: message }}
                />
            )}

            {status !== "success" ? (
                <div className="mc__field-container">
                    <InputField
                        // label="First Name"
                        onChangeHandler={setFirstName}
                        type="text"
                        value={firstName}
                        placeholder="First Name"
                        isRequired
                    />

                    <InputField
                        // label="Last Name"
                        onChangeHandler={setLastName}
                        type="text"
                        value={lastName}
                        placeholder="Last Name"
                        isRequired
                    />

                    <InputField
                        // label="Email"
                        onChangeHandler={setEmail}
                        type="email"
                        value={email}
                        placeholder="Email"
                        isRequired
                    />

                        <div className="menu-section-email-opt-wrapper">
                            <div className="menu-section-email-opt-tick-wrapper">
                                <input type="checkbox" className="theme-color-bg" />
                            </div>
                            <div className="menu-section-email-opt-label">I'd like to opt in to this mailing list</div>
                        </div>

                </div>
            ) : null}
            {
                status === 'success' ?
                '' : <InputField
                    label="Sign up"
                    type="submit"
                    formValues={[email, firstName, lastName]}
                />
            }
        </form>
    );
};


const NewsletterSubscribe = props => {
    // const url = `https://genhybridsystems.us1.list-manage.com/subscribe/post?u=${process.env.REACT_APP_MAILCHIMP_U}&id=${process.env.REACT_APP_MAILCHIMP_ID}`;
    const url = `https://damnmagazine.us11.list-manage.com/subscribe/post?u=e83f5d434bc817ef95113b8f0&id=f3041604cb`;

    return (

        <div className="mc__form-container">
            <MailchimpSubscribe
                url={url}
                render={({ subscribe, status, message }) => (
                    <CustomForm
                        status={status}
                        message={message}
                        onValidated={formData => subscribe(formData)}
                    />
                )}
            />
        </div>

    )
}

export default NewsletterSubscribe;