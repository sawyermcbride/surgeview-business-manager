
import {useState, useEffect} from "react";
import { CustomerDetailsObject } from "../types/apiResponses";
import axios from "axios";

//GET /api/customers/

interface CustomerDetailsReturnObject {
  details: CustomerDetailsObject | null;
  loading: boolean;
  error: string | null;
}

const useFetchCustomerDetails = function(customerId: number | null): CustomerDetailsReturnObject {

  const [details, setDetails] = useState<CustomerDetailsObject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerDetails = async function() {
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:3000/api/customers/${customerId}`,
          {
            withCredentials: true 
          }
        );
  
        setDetails(response.data);
        setLoading(false);

      } catch(err) {
        if(axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('Unknown error occured');
        }
      }

    }

    if(customerId) {
      fetchCustomerDetails();
    } else {
      setError("No Customer Id");
      setDetails(null);
      setLoading(false);
    }

  }, [customerId])
  
  return {details, loading, error};
}

export default useFetchCustomerDetails;