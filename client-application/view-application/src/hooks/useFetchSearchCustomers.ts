
import {useState, useEffect} from "react";
import { CustomerObject } from "../types/apiResponses";
import axios from "axios";

//POST /api/customers/search/
interface SearchCustomersReturnObject {
  customers: CustomerObject[];
  loading: boolean;
  error: string | null;
}

const useFetchSearchCustomers = function(searchTerm: string): SearchCustomersReturnObject {
  const [customers, setCustomers] = useState<CustomerObject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async function() {
      setError(null)
      setLoading(true);

      try {
        const response = await axios.post(
          `http://localhost:3000/api/customers/search/${searchTerm}`,
          {}, 
          {
            withCredentials: true 
          }
        );

        const contentType = response.headers['content-type'];

        console.log(response.data);
        console.log(contentType);

        if(contentType.includes('application/json')) {
          console.log('JSON received');
          setCustomers(response.data);
        } else if(contentType.includes('text/html') && response.data.includes('Login')) {
          setError('Authorization_Error');
        }

        setLoading(false);

      } catch(err) {
        if(axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('Unknown error occured');
        }
      }

    }

    if(searchTerm) {
      fetchCustomers();
    } else {
      setCustomers([]);
      setLoading(false);
    }

  }, [searchTerm])
  
  return {customers, loading, error};
}

export default useFetchSearchCustomers;