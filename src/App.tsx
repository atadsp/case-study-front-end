import { useState } from 'react'
import axios from "axios";

import Cards, { Focused } from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

import './App.css'


interface ICard {
  CreditCard: string,
  CVV: string,
  ExpiryDate: string,
  Name: string,
  focused: Focused | undefined,
}

function App() {
  const [isValid, setIsValid] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [card, setCard] = useState<ICard>({
    CreditCard: "",
    CVV: "",
    ExpiryDate: "",
    Name: "",
    focused: ""
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (evt: any) => {
    const { name, value } = evt.target;
    
    setCard((prev) => ({ ...prev, [name]: value }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputFocus = (evt: any) => {
    setCard((prev) => ({ ...prev, focus: evt.target.name }));
  }

  const convertDateFormat = (dateString: string) => {
    const parts = dateString.split("-");
    const year = parts[0].substring(2); // Taking the last two digits of the year
    const month = parts[1];
    return `${month}/${year}`;
  }

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault();
    const exp_date = convertDateFormat(card.ExpiryDate);
    const cc_number = card.CreditCard;
    const body = {
      exp_date,
      cc_number
    }
    await axios
    .post("http://localhost:1701/api/v1/validate-credit-card", body, {
      headers: {}
    })
    .then(() => {
      setIsInvalid(false);
      setIsValid(true);
    })
    .catch((err: Error) => {
      console.error(err);
      setIsInvalid(true);
      setIsValid(false);
    });

  }

  return (
    <>
      <div>
        <Cards
          number={card.CreditCard}
          expiry={card.ExpiryDate}
          cvc={card.CVV}
          name={card.Name}
          focused={card.focused}
        />
        <form onSubmit = {submitForm}>
          <input
            type="number"
            name="CreditCard"
            placeholder="Card Number"
            value={card.CreditCard}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          /> <br></br>
          <input
            type="month"
            name="ExpiryDate"
            placeholder="ExpiryDate"
            value={card.ExpiryDate}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          /> <br></br>
          <button>Submit</button>
        </form>
        {isInvalid && 
          <div>
            <p style={{color: "red"}}>Something Went Wrong, please check your info and try again</p>
          </div>
        }
        {isValid && 
          <div>
            <p style={{color: "green"}}>Your credit card was validated, hurray!</p>
          </div>
        }

      </div>
    </>
  )
}

export default App
function useRef<T>(arg0: null) {
  throw new Error('Function not implemented.');
}

