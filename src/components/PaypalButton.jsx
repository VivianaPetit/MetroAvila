import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router";
import { useUser } from "../contexto/userContext";

const PaypalButtonComponent = () => {
    const navigate = useNavigate();
    const { user } = useUser(); 

    const initialOptions = {
        "client-id": "Adf3an280HO6cBsk24ZRCrekduPEIkauPyICKigL4cenBCBE2-97AOYt2_w2oRHP_U_DhSfSMTM7IURa",
        currency: "USD",
        intent: "capture",
    };

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "5",
                    },
                },
            ],
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            const name = details.payer.name.given_name;
            console.log(name);
            console.log("");
            navigate('/exitosa');
        });
    };

    const handleButtonClick = () => {
        if (!user) {
            navigate('/login');
        }
    };

   
    if (!user) {
        return null; 
    }

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons 
                createOrder={createOrder} 
                onApprove={onApprove} 
                onClick={handleButtonClick}
            />
        </PayPalScriptProvider>
    );
};

export default function BotonPaypal() {
    return (
        <>
            <PaypalButtonComponent />
        </>
    );
}